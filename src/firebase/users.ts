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
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase"; // Assuming you have your Firebase instance here
import type { DriverModel } from "../models/driver_model";
import { UserRoles } from "../enums/roles";
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
    const data = doc.data();

    // 6. Map the Firestore document data to your DriverModel, including the document ID.
    const driver: DriverModel = {
      documentId: doc.id,
      ...data,
      // Convert Firestore Timestamps to JavaScript Dates
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
      lastUpdatedAt: data.lastUpdatedAt instanceof Timestamp ? data.lastUpdatedAt.toDate() : data.lastUpdatedAt,
      deletedAt: data.deletedAt instanceof Timestamp ? data.deletedAt.toDate() : data.deletedAt,
    } as DriverModel;

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
    const baseQuery = query(userRef, where("roles", "array-contains", role));

    // Always query by role only
    q = query(
      baseQuery,
      orderBy("createdAt", "desc"),
      limit(pageSize * 5), // Fetch more to allow for in-memory filtering if searching
      ...(lastDoc ? [startAfter(lastDoc)] : [])
    );
    countQ = baseQuery;

    const [querySnapshot, countSnapshot] = await Promise.all([
      getDocs(q),
      getCountFromServer(countQ),
    ]);

    totalCount = countSnapshot.data().count;
    const allUsers = querySnapshot.docs.map(
      (doc) => {
        const data = doc.data();
        return {
          documentId: doc.id,
          ...data,
          // Convert Firestore Timestamps to JavaScript Dates
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          lastUpdatedAt: data.lastUpdatedAt instanceof Timestamp ? data.lastUpdatedAt.toDate() : data.lastUpdatedAt,
          deletedAt: data.deletedAt instanceof Timestamp ? data.deletedAt.toDate() : data.deletedAt,
        } as UserModel;
      }
    );

    if (searchQuery) {
      const search = searchQuery.toLocaleUpperCase();
      
      if (role === UserRoles.Driver) {
        // For drivers, first search by plateNumber (case-insensitive exact match)
        let driversByPlateNumber = allUsers.filter(user => {
          const driver = user as DriverModel;
          return driver.plateNumber && driver.plateNumber.toLocaleUpperCase() === search;
        });

        // If no results from plateNumber search, fall back to queryKeys search
        if (driversByPlateNumber.length === 0) {
          driversByPlateNumber = allUsers.filter(user =>
            Array.isArray(user.queryKeys) && user.queryKeys.includes(search)
          );
        }

        users = driversByPlateNumber.slice(0, pageSize);
      } else {
        // For other roles, search by queryKeys
        users = allUsers.filter(user =>
          Array.isArray(user.queryKeys) && user.queryKeys.includes(search)
        ).slice(0, pageSize);
      }
    } else {
      users = allUsers.slice(0, pageSize);
    }

    if (users.length > 0) {
      const lastUserId = users[users.length - 1].documentId;
      const lastDocIndex = querySnapshot.docs.findIndex(doc => doc.id === lastUserId);
      lastVisible = lastDocIndex !== -1 ? querySnapshot.docs[lastDocIndex] : null;
    }
  } catch (e) {
    console.error("Error getting users: ", e);
  }
  console.log("users:", users);
  return { users, lastDoc: lastVisible, totalCount };
};

/**
 * Queries the 'users' collection for a user with a specific UUID.
 * @param uuid The UUID to search for.
 * @returns A promise that resolves to a UserModel, or null if no matching user is found.
 */
export const getCurrentUser = async (
  uuid: string
): Promise<UserModel | null> => {
  if (!uuid) {
    console.error("UUID is required for the query.");
    return null;
  }

  try {
    // 1. Create a reference to the 'users' collection.
    const usersCollection = collection(db, "users");

    // 2. Build the query. We're looking for documents where the 'uuid' field
    // is exactly equal to the provided uuid string.
    const q = query(usersCollection, where("uuid", "==", uuid));

    // 3. Execute the query and get the documents.
    const querySnapshot = await getDocs(q);

    // 4. Check if any documents were found.
    if (querySnapshot.empty) {
      console.log("No matching user found with that UUID.");
      return null;
    }

    // 5. Get the first document from the result.
    const doc = querySnapshot.docs[0];
    const data = doc.data();

    // 6. Map the Firestore document data to your UserModel, including the document ID.
    const user: UserModel = {
      documentId: doc.id,
      ...data,
      // Convert Firestore Timestamps to JavaScript Dates
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
      lastUpdatedAt: data.lastUpdatedAt instanceof Timestamp ? data.lastUpdatedAt.toDate() : data.lastUpdatedAt,
      deletedAt: data.deletedAt instanceof Timestamp ? data.deletedAt.toDate() : data.deletedAt,
    } as UserModel;

    return user;
  } catch (e) {
    console.error("Error getting user by UUID: ", e);
    return null;
  }
};


