import {
  collection,
  query,
  where,
  getDocs,
  QueryDocumentSnapshot,
  type DocumentData,
  Query,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../firebase"; // Assuming you have your Firebase instance here
import type { DriverModel } from "../models/driver_model";
import type { UserRoles } from "../enums/roles";
import type { UserModel } from "../models/user_model";

/**
 * Queries the 'users' collection for a driver with a specific plate number.
 * @param plateNumber The plate number to search for.
 * @returns A promise that resolves to a DriverModel, or null if no matching driver is found.
 */
export const getDriverByPlateNumber = async (
  plateNumber: string
): Promise<DriverModel | null> => {
  if (!plateNumber) {
    console.error("Plate number is required for the query.");
    return null;
  }

  try {
    // 1. Create a reference to the 'users' collection.
    const usersCollection = collection(db, "users");

    // 2. Build the query. We're looking for documents where the 'plateNumber' field
    // is exactly equal to the provided plateNumber string.
    const q = query(usersCollection, where("plateNumber", "==", plateNumber));

    // 3. Execute the query and get the documents.
    const querySnapshot = await getDocs(q);

    // 4. Check if any documents were found.
    if (querySnapshot.empty) {
      console.log("No matching driver found with that plate number.");
      return null;
    }

    // 5. Get the first document from the result.
    const doc = querySnapshot.docs[0];
    const data = doc.data() as DriverModel;

    // 6. Map the Firestore document data to your DriverModel, including the document ID.
    const driver: DriverModel = {
      //   documentId: doc.id,
      ...data,
    };
    driver.documentId = doc.id;

    return driver;
  } catch (e) {
    console.error("Error getting driver by plate number: ", e);
    return null;
  }
};

interface GetUsersParams {
  pageSize: number;
  lastDoc: DocumentData | null | undefined;
  role: UserRoles;
  searchQuery?: string; // Make searchQuery optional
}
export const getUsers = async ({
  pageSize,
  lastDoc,
  role,
  searchQuery = "",
}: GetUsersParams): Promise<{
  users: UserModel[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  totalCount: number;
}> => {
  let q: Query<DocumentData>;
  let countQ: Query<DocumentData>;
  let users: UserModel[] = [];
  let lastVisible: QueryDocumentSnapshot<DocumentData> | null = null;
  let totalCount = 0;

  try {
    const userRef = collection(db, "users");
    const baseQuery = query(userRef, where("role", "array-contains", role));

    if (searchQuery) {
      const searchKeywords = searchQuery
        .toLowerCase()
        .split(" ")
        .filter(Boolean);
      q = query(
        baseQuery,
        where("queryKeys", "array-contains-any", searchKeywords),
        orderBy("queryKeys"), // Firestore requires an orderBy on the array-contains-any field for a range search
        limit(pageSize),
        ...(lastDoc ? [startAfter(lastDoc)] : [])
      );
      countQ = query(
        baseQuery,
        where("queryKeys", "array-contains-any", searchKeywords)
      );
    } else {
      q = query(
        baseQuery,
        orderBy("createdAt", "desc"), // Assuming a 'createdAt' field for sorting
        limit(pageSize),
        ...(lastDoc ? [startAfter(lastDoc)] : [])
      );
      countQ = baseQuery;
    }
    const [querySnapshot, countSnapshot] = await Promise.all([
      getDocs(q),
      getCountFromServer(countQ),
    ]);

    totalCount = countSnapshot.data().count;
    users = querySnapshot.docs.map(
      (doc) =>
        ({
          documentId: doc.id,
          ...doc.data(),
        } as UserModel)
    );

    if (!querySnapshot.empty) {
      lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    }
  } catch (e) {
    console.error("Error getting users: ", e);
  }
  console.log("users:", users);
  return { users, lastDoc: lastVisible, totalCount };
};
