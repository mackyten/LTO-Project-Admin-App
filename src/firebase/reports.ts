// src/firebase/reports.ts
import type { ReportModel } from "../models/report_model";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  type DocumentData,
  getCountFromServer,
  CollectionReference,
  Query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { FirebaseCollections } from "../enums/collections";

interface GetReportsParams {
  pageSize: number;
  lastDoc?: DocumentData | null;
  searchQuery?: string;
}

// Helper function to generate the end-of-range string for a "starts with" query

export const getReports = async ({
  pageSize,
  lastDoc,
  searchQuery = "",
}: GetReportsParams): Promise<{
  reports: ReportModel[];
  lastDoc: DocumentData | null;
  totalCount: number;
}> => {
  let q;
  let reports: ReportModel[] = [];
  let lastVisible: DocumentData | null = null;
  let totalCount = 0;

  let countQ: CollectionReference<DocumentData> | Query<DocumentData> =
    collection(db, FirebaseCollections.reports);

  if (searchQuery) {
    const searchQueryUpper = searchQuery.toUpperCase();
    const plateNumberQuery = query(
      collection(db, "reports"),
      where("plateNumber", "==", searchQuery),
      limit(pageSize)
    );
    const plateNumberSnapshot = await getDocs(plateNumberQuery);
    if (!plateNumberSnapshot.empty) {
      q = plateNumberQuery;
      countQ = query(
        collection(db, "reports"),
        where("plateNumber", "==", searchQuery)
      );
    } else {
      // Create a case-insensitive "starts with" query for fullname

      q = query(
        collection(db, "reports"),
        where("trackingNumber", "==", searchQueryUpper),
        limit(pageSize)
      );
      // The count query must use the same search filters
      countQ = query(
        collection(db, "reports"),
        where("trackingNumber", "==", searchQueryUpper)
      );
    }
  } else {
    q = query(
      collection(db, "reports"),
      orderBy("createdAt", "desc"),
      limit(pageSize),
      ...(lastDoc ? [startAfter(lastDoc)] : [])
    );
  }

  try {
    // If the main query is a search query, we also need to get the count for it.
    if (searchQuery) {
      // Run both the paginated search query and the count query for that search
      const [querySnapshot, countSnapshot] = await Promise.all([
        getDocs(q),
        getCountFromServer(countQ),
      ]);
      totalCount = countSnapshot.data().count;

      // This is a Firestore limitation:
      // You cannot use orderBy on a field that is not part of the where clause.
      // Therefore, we sort the results in memory.
      const sortedReports = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            documentId: doc.id,
            ...data,
            // Convert Firestore Timestamps to JavaScript Dates
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
            lastUpdatedAt: data.lastUpdatedAt instanceof Timestamp ? data.lastUpdatedAt.toDate() : data.lastUpdatedAt,
            deletedAt: data.deletedAt instanceof Timestamp ? data.deletedAt.toDate() : data.deletedAt,
          } as unknown as ReportModel;
        })
        .sort((a, b) => {
          let aTime, bTime;

          // Safely get the timestamp value for a
          if (a.createdAt instanceof Timestamp) {
            aTime = a.createdAt.toDate().getTime();
          } else {
            // If not a Timestamp, assume it's a string or other invalid type and handle it
            // You can parse it as a Date if it's a valid date string
            // or set it to 0 to sort it at the bottom
            aTime = new Date(a.createdAt as unknown as string).getTime() || 0;
          }

          // Safely get the timestamp value for b
          if (b.createdAt instanceof Timestamp) {
            bTime = b.createdAt.toDate().getTime();
          } else {
            bTime = new Date(b.createdAt as unknown as string).getTime() || 0;
          }

          return bTime - aTime;
        });
      reports = sortedReports;

      // Find the last visible document based on the in-memory sorted array
      if (querySnapshot.docs.length > 0) {
        lastVisible =
          querySnapshot.docs.find(
            (doc) => doc.id === reports[reports.length - 1].documentId
          ) || null;
      }
    } else {
      // For the default, non-search query, we can rely on standard pagination
      const [querySnapshot, countSnapshot] = await Promise.all([
        getDocs(q),
        getCountFromServer(collection(db, "reports")),
      ]);

      totalCount = countSnapshot.data().count;

      reports = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          documentId: doc.id,
          ...data,
          // Convert Firestore Timestamps to JavaScript Dates
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          lastUpdatedAt: data.lastUpdatedAt instanceof Timestamp ? data.lastUpdatedAt.toDate() : data.lastUpdatedAt,
          deletedAt: data.deletedAt instanceof Timestamp ? data.deletedAt.toDate() : data.deletedAt,
        } as unknown as ReportModel;
      });

      if (!querySnapshot.empty) {
        lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      }
    }
  } catch (e) {
    console.error("Error getting documents: ", e);
  }

  return { reports, lastDoc: lastVisible, totalCount };
};

export const getReportByTrackingNumber = async (
  violationTrackingNumber: string
): Promise<ReportModel | null> => {
  if (!violationTrackingNumber) {
    throw new Error("Violation tracking number is required.");
  }

  try {
    // const trackingNumberUpper = violationTrackingNumber.toUpperCase();
    const q = query(
      collection(db, FirebaseCollections.reports),
      where("trackingNumber", "==", violationTrackingNumber),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return {
      documentId: doc.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate() 
        : new Date(data.createdAt as unknown as string),
    } as ReportModel;
  } catch (e) {
    console.error("Error getting report by tracking number: ", e);
    throw e;
  }
};

export const deleteReport = async (documentId: string): Promise<void> => {
  if (!documentId) {
    throw new Error("Document ID is required to delete a report.");
  }

  try {
    const reportRef = doc(db, "reports", documentId);
    await deleteDoc(reportRef);
    console.log(`Document with ID ${documentId} successfully deleted.`);
  } catch (e) {
    console.error(`Error deleting document with ID ${documentId}: `, e);
    throw e; // Re-throw the error to be handled by the caller
  }
};
