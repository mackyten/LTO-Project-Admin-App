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
  addDoc,
  deleteDoc,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { FirebaseCollections } from "../enums/collections";
import type { AdministratorModel } from "../models/administrator_model";
import { UserRoles } from "../enums/roles";
import generateId from "../utils/id_generator";
import { generateQueryKeyPrefixes } from "../utils/query_key_generator";
import generatePassword from "../utils/password_generator";
import { sendEmail } from "../utils/emailjs";
import { uuid } from "zod";

interface GetAdministratorsParams {
  pageSize: number;
  lastDoc: DocumentData | null | undefined;
}

export const getAdministrators = async ({
  pageSize,
  lastDoc,
}: GetAdministratorsParams): Promise<{
  administrators: AdministratorModel[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  totalCount: number;
}> => {
  let administrators: AdministratorModel[] = [];
  let lastVisible: QueryDocumentSnapshot<DocumentData> | null = null;
  let totalCount = 0;

  try {
    const usersRef = collection(db, FirebaseCollections.users);

    // Query for users with Administrator role
    const baseQuery = query(
      usersRef,
      where("roles", "array-contains", UserRoles.Admin)
    );

    const q = query(
      baseQuery,
      orderBy("createdAt", "desc"),
      limit(pageSize),
      ...(lastDoc ? [startAfter(lastDoc)] : [])
    );

    const countQ = baseQuery;

    const [querySnapshot, countSnapshot] = await Promise.all([
      getDocs(q),
      getCountFromServer(countQ),
    ]);

    totalCount = countSnapshot.data().count;
    administrators = querySnapshot.docs.map(
      (doc) =>
        ({
          documentId: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate
            ? doc.data().createdAt.toDate()
            : new Date(doc.data().createdAt),
        } as AdministratorModel)
    );

    lastVisible =
      querySnapshot.docs.length > 0
        ? querySnapshot.docs[querySnapshot.docs.length - 1]
        : null;
  } catch (e) {
    console.error("Error getting administrators: ", e);
  }

  return { administrators, lastDoc: lastVisible, totalCount };
};

export const createAdministrator = async (
  data: Omit<
    AdministratorModel,
    | "administratorID"
    | "documentId"
    | "createdAt"
    | "queryKeys"
    | "uuid"
    | "idBadgePhoto"
    | "profilePictureUrl "
  >
): Promise<void> => {
  const usersRef = collection(db, FirebaseCollections.users);

  // Check if user already exists by email
  const q = query(usersRef, where("email", "==", data.email));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const existingDoc = snapshot.docs[0];
    const existingData = existingDoc.data() as AdministratorModel;
    const roles = existingData.roles || [];

    if (
      roles.includes(UserRoles.Admin) ||
      roles.includes(UserRoles.SuperAdmin)
    ) {
      throw new Error("User is already an administrator.");
    }

    if (roles.some((role) => role !== UserRoles.None)) {
      throw new Error(
        "Cannot create administrator, this account already has a driver and/or enforcer role(s)."
      );
    }

    // User exists with only UserRoles.None, update to add Admin role
    const administratorID = generateId();

    const updateData = {
      ...data,
      administratorID,
      roles: [UserRoles.None, UserRoles.Admin],
      temporaryPassword: null,
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      mobileNumber: data.mobileNumber,
      uuid: existingData.uuid || "",
      profilePictureUrl: existingData.profilePictureUrl || "",
      idBadgePhoto: "",
    };

    await updateDoc(existingDoc.ref, updateData);
  } else {
    // User does not exist, create new
    const administratorID = generateId();
    const queryKeys = [
      ...generateQueryKeyPrefixes(data.firstName),
      ...generateQueryKeyPrefixes(data.lastName),
      ...(data.middleName ? generateQueryKeyPrefixes(data.middleName) : []),
    ];
    const temporaryPassword = generatePassword();

    const userData: AdministratorModel = {
      ...data,
      uuid: "",
      administratorID,
      roles: [UserRoles.Admin],
      createdAt: new Date(),
      queryKeys,
      temporaryPassword,
      idBadgePhoto: "",
      profilePictureUrl: "",
    };

    const docRef = await addDoc(usersRef, userData);

    try {
      await sendEmail({
        to_email: data.email,
        full_name: `${data.firstName} ${data.lastName}`,
        temporary_password: temporaryPassword,
      });
    } catch {
      await deleteDoc(docRef);
      throw new Error("Failed to send email. Administrator not added.");
    }
  }
};

export const deleteAdmin = async (documentId: string): Promise<void> => {
  if (!documentId) {
    throw new Error("Document ID is required to delete a report.");
  }

  try {
    const userRef = doc(db, FirebaseCollections.users, documentId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User not found.");
    }

    const userData = userDoc.data();
    const roles = userData.roles || [];
    if (roles.length === 1 && roles[0] === UserRoles.Admin) {
      // Only Enforcer role, delete the document permanently
      await deleteDoc(userRef);
      console.log(`User with ID ${documentId} permanently deleted.`);
    } else {
      // Has other roles, remove Admin role
      const updatedRoles = roles.filter(
        (role: number) => role !== UserRoles.Admin
      );
      await updateDoc(userRef, { roles: updatedRoles });
      console.log(`Admin role removed from user with ID ${documentId}.`);
    }
  } catch (e) {
    console.error(`Error processing user with ID ${documentId}: `, e);
    throw e; // Re-throw the error to be handled by the caller
  }
};
