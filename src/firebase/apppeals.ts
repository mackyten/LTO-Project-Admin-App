// src/firebase/appeals.ts
import type { AppealsModel } from "../models/appeals_model";
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
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { FirebaseCollections } from "../enums/collections";

interface GetAppealsParams {
  pageSize: number;
  lastDoc?: DocumentData | null;
  searchQuery?: string;
}

export const getAppeals = async ({
  pageSize,
  lastDoc,
  searchQuery = "",
}: GetAppealsParams): Promise<{
  appeals: AppealsModel[];
  lastDoc: DocumentData | null;
  totalCount: number;
}> => {
  let q;
  let appeals: AppealsModel[] = [];
  let lastVisible: DocumentData | null = null;
  let totalCount = 0;

  let countQ: CollectionReference<DocumentData> | Query<DocumentData> =
    collection(db, FirebaseCollections.appeals);

  if (searchQuery) {
    // Case-sensitive search for violation tracking number
    q = query(
      collection(db, FirebaseCollections.appeals),
      where("violationTrackingNumber", "==", searchQuery),
      limit(pageSize)
    );
    countQ = query(
      collection(db, FirebaseCollections.appeals),
      where("violationTrackingNumber", "==", searchQuery)
    );
  } else {
    q = query(
      collection(db, FirebaseCollections.appeals),
      orderBy("createdAt", "desc"),
      limit(pageSize),
      ...(lastDoc ? [startAfter(lastDoc)] : [])
    );
  }

  try {
    if (searchQuery) {
      // Run both the paginated search query and the count query for that search
      const [querySnapshot, countSnapshot] = await Promise.all([
        getDocs(q),
        getCountFromServer(countQ),
      ]);
      totalCount = countSnapshot.data().count;

      // Sort the results in memory since we can't use orderBy with where clause
      const sortedAppeals = querySnapshot.docs
        .map(
          (doc) =>
            ({ ...doc.data(), documentId: doc.id } as AppealsModel & {
              documentId: string;
            })
        )
        .sort((a, b) => {
          let aTime, bTime;

          // Safely get the timestamp value for a
          if (a.createdAt instanceof Timestamp) {
            aTime = a.createdAt.toDate().getTime();
          } else {
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

      // Get violator full names from users collection
      const appealsWithViolatorNames = await Promise.all(
        sortedAppeals.map(async (appeal) => {
          try {
            const userDoc = await getDoc(
              doc(db, FirebaseCollections.users, appeal.createdById)
            );
            const userData = userDoc.data();
            const fullName = userData?.lastName
              ? `${userData.firstName} ${userData.lastName}`
              : userData?.firstName || "Unknown User";
            return {
              ...appeal,
              createdAt:
                appeal.createdAt instanceof Timestamp
                  ? appeal.createdAt.toDate()
                  : new Date(appeal.createdAt as unknown as string),
              violatorFullName: fullName,
            } as AppealsModel;
          } catch (error) {
            console.error(
              `Error fetching user data for ${appeal.createdById}:`,
              error
            );
            return {
              ...appeal,
              createdAt:
                appeal.createdAt instanceof Timestamp
                  ? appeal.createdAt.toDate()
                  : new Date(appeal.createdAt as unknown as string),
              violatorFullName: "Unknown User",
            } as AppealsModel;
          }
        })
      );

      appeals = appealsWithViolatorNames;

      // Find the last visible document based on the in-memory sorted array
      if (querySnapshot.docs.length > 0) {
        lastVisible =
          querySnapshot.docs.find(
            (doc) => doc.id === appeals[appeals.length - 1].documentId
          ) || null;
      }
    } else {
      // For the default, non-search query, we can rely on standard pagination
      const [querySnapshot, countSnapshot] = await Promise.all([
        getDocs(q),
        getCountFromServer(collection(db, FirebaseCollections.appeals)),
      ]);

      totalCount = countSnapshot.data().count;

      // Get appeals data with violator full names
      const appealsWithViolatorNames = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          try {
            const userDoc = await getDoc(
              doc(db, FirebaseCollections.users, data.createdById)
            );
            const userData = userDoc.data();
            const fullName = userData?.lastName
              ? `${userData.firstName} ${userData.lastName}`
              : userData?.firstName || "Unknown User";
            return {
              documentId: docSnapshot.id,
              ...data,
              createdAt:
                data.createdAt instanceof Timestamp
                  ? data.createdAt.toDate()
                  : new Date(data.createdAt as unknown as string),
              violatorFullName: fullName,
            } as AppealsModel;
          } catch (error) {
            console.error(
              `Error fetching user data for ${data.createdById}:`,
              error
            );
            return {
              documentId: docSnapshot.id,
              ...data,
              createdAt:
                data.createdAt instanceof Timestamp
                  ? data.createdAt.toDate()
                  : new Date(data.createdAt as unknown as string),
              violatorFullName: "Unknown User",
            } as AppealsModel;
          }
        })
      );

      appeals = appealsWithViolatorNames;
      if (!querySnapshot.empty) {
        lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      }
    }
  } catch (e) {
    console.error("Error getting appeals documents: ", e);
  }
  return { appeals, lastDoc: lastVisible, totalCount };
};

export const updateAppealStatus = async (
  documentId: string,
  status: "Approved" | "Rejected",
  currentUserId: string,
  violationTrackingNumber: string
): Promise<void> => {
  if (!documentId) {
    throw new Error("Document ID is required to update an appeal.");
  }

  if (!currentUserId) {
    throw new Error("Current User ID is required to update an appeal.");
  }

  if (!violationTrackingNumber) {
    throw new Error("Violation tracking number is required to update an appeal.");
  }

  try {
    // Update the appeal status
    const appealRef = doc(db, FirebaseCollections.appeals, documentId);
    await updateDoc(appealRef, {
      status: status,
      statusUpdatedById: currentUserId,
    });

    // If approved, update the report status to "Overturned"
    if (status === "Approved") {
      const reportsQuery = query(
        collection(db, FirebaseCollections.reports),
        where("trackingNumber", "==", violationTrackingNumber.toUpperCase()),
        limit(1)
      );

      const reportsSnapshot = await getDocs(reportsQuery);
      
      if (!reportsSnapshot.empty) {
        const reportDoc = reportsSnapshot.docs[0];
        const reportRef = doc(db, FirebaseCollections.reports, reportDoc.id);
        
        await updateDoc(reportRef, {
          status: "Overturned"
        });
        
        console.log(`Report with tracking number ${violationTrackingNumber} status updated to Overturned.`);
      } else {
        console.warn(`No report found with tracking number: ${violationTrackingNumber}`);
      }
    }

    console.log(`Appeal with ID ${documentId} status updated to ${status}.`);
  } catch (e) {
    console.error(`Error updating appeal status with ID ${documentId}: `, e);
    throw e; // Re-throw the error to be handled by the caller
  }
};
