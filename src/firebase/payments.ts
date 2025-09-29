import {
  collection,
  query,
  getDocs,
  QueryDocumentSnapshot,
  type DocumentData,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { FirebaseCollections } from "../enums/collections";
import type { PaymentModel } from "../models/payment_model";
import type { UserModel } from "../models/user_model";

interface GetPaymentsParams {
  pageSize: number;
  lastDoc: DocumentData | null | undefined;
  searchQuery?: string;
}

export const getPayments = async ({
  pageSize,
  lastDoc,
  searchQuery = "",
}: GetPaymentsParams): Promise<{
  payments: PaymentModel[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  totalCount: number;
}> => {
  let payments: PaymentModel[] = [];
  let lastVisible: QueryDocumentSnapshot<DocumentData> | null = null;
  let totalCount = 0;

  try {
    const paymentsRef = collection(db, FirebaseCollections.payments);

    if (searchQuery) {
      // Server-side exact match search for either violationTrackingNumber or referenceNumber
      const query1 = query(
        paymentsRef,
        where("violationTrackingNumber", "==", searchQuery),
        orderBy("paidAt", "desc")
      );
      const query2 = query(
        paymentsRef,
        where("referenceNumber", "==", searchQuery),
        orderBy("paidAt", "desc")
      );

      const [snapshot1, snapshot2, count1, count2] = await Promise.all([
        getDocs(query1),
        getDocs(query2),
        getCountFromServer(query1),
        getCountFromServer(query2),
      ]);

      totalCount = count1.data().count + count2.data().count;

      // Combine and deduplicate results (in case a payment has both matching fields)
      const allDocs = [...snapshot1.docs, ...snapshot2.docs];
      const uniqueDocs = allDocs.filter((doc, index, self) =>
        index === self.findIndex(d => d.id === doc.id)
      );

      // Sort by paidAt desc
      uniqueDocs.sort((a, b) => {
        const aDate = a.data().paidAt?.toDate() || new Date(0);
        const bDate = b.data().paidAt?.toDate() || new Date(0);
        return bDate.getTime() - aDate.getTime();
      });

      // Apply pagination
      const startIndex = lastDoc ? uniqueDocs.findIndex(doc => doc.id === lastDoc.id) + 1 : 0;
      const paginatedDocs = uniqueDocs.slice(startIndex, startIndex + pageSize);

      payments = paginatedDocs.map(doc => ({
        documentId: doc.id,
        ...doc.data(),
        paidAt: doc.data().paidAt?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as PaymentModel));

      lastVisible = paginatedDocs.length > 0 ? paginatedDocs[paginatedDocs.length - 1] : null;
    } else {
      // No search query - use original pagination logic
      const q = query(
        paymentsRef,
        orderBy("createdAt", "desc"),
        limit(pageSize),
        ...(lastDoc ? [startAfter(lastDoc)] : [])
      );
      const countQ = query(paymentsRef);

      const [querySnapshot, countSnapshot] = await Promise.all([
        getDocs(q),
        getCountFromServer(countQ),
      ]);

      totalCount = countSnapshot.data().count;
      payments = querySnapshot.docs.map(doc => ({
        documentId: doc.id,
        ...doc.data(),
        paidAt: doc.data().paidAt?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as PaymentModel));

      lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;
    }

    // Populate violatorFullName from users collection
    const violatorIds = payments.map(p => p.violatorId).filter(id => id);
    if (violatorIds.length > 0) {
      const usersRef = collection(db, FirebaseCollections.users);
      const usersQuery = query(usersRef, where("uuid", "in", violatorIds));
      const usersSnapshot = await getDocs(usersQuery);
      const usersMap = new Map<string, string>();
      usersSnapshot.docs.forEach(doc => {
        const user = doc.data() as UserModel;
        usersMap.set(user.uuid!, `${user.firstName} ${user.lastName}`);
      });

      payments.forEach(payment => {
        if (payment.violatorId && usersMap.has(payment.violatorId)) {
          payment.violatorFullName = usersMap.get(payment.violatorId)!;
        }
      });
    }
  } catch (e) {
    console.error("Error getting payments: ", e);
  }

  return { payments, lastDoc: lastVisible, totalCount };
};