// src/firebase/enforcers.ts
import {
  collection,
  addDoc,
  query,
  getDocs,
  where,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { FirebaseCollections } from "../enums/collections";
import type { EnforcerSchemaType } from "../components/pages/public/enforcers_page/schema";
import { UserRoles } from "../enums/roles";
import generatePassword from "../utils/password_generator";
import generateId from "../utils/id_generator";
import generateQueryKeyPrefixes from "../utils/query_key_generator";
import type { EnforcerCreateResponseModel } from "./response_models/enforcers_response_model";
import { sendEmail } from "../utils/emailjs";

/**
 * Adds a new enforcer to thex Firestore 'users' collection.
 * @param data - The enforcer data from the form.
 * @returns The document reference of the newly created user.
 */
export const addEnforcer = async (
  data: EnforcerSchemaType
): Promise<EnforcerCreateResponseModel> => {
  try {
    const usersRef = collection(db, FirebaseCollections.users);
    const q = query(usersRef, where("email", "==", data.email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // Account exists, check if already an enforcer
      const existingDoc = snapshot.docs[0];
      const existingData = existingDoc.data();
      const roles = existingData.roles || [];

      if (roles.includes(UserRoles.Enforcer)) {
        throw new Error("An account with this email already exists.");
      }else if(roles.includes(UserRoles.Admin) || roles.includes(UserRoles.SuperAdmin)) {
        // Admin or SuperAdmin exists, cannot add Enforcer
        throw new Error("Cannot add Enforcer role to an Admin account.");
      } else {
        // Add Enforcer roles to existing account
        const updatedRoles = [...roles, UserRoles.Enforcer];
        await updateDoc(existingDoc.ref, { roles: updatedRoles });
        return { isSuccess: true, message: existingDoc.id };
      }
    }

    // Account doesn't exist, create new enforcer
    const temporaryPassword = generatePassword();
    const enforcerId = generateId();
    const queryKeys = generateQueryKeyPrefixes(data.firstName);
    queryKeys.push(...generateQueryKeyPrefixes(data.lastName));
    if (data.middleName) {
      queryKeys.push(...generateQueryKeyPrefixes(data.middleName));
    }

    const docRef = await addDoc(collection(db, FirebaseCollections.users), {
      ...data,
      createdAt: new Date(),
      roles: [UserRoles.Enforcer],
      temporaryPassword: temporaryPassword,
      enforcerIdNumber: enforcerId,
      queryKeys: queryKeys,
      uuid: null,
    });
    try {
      await sendEmail({
        to_email: data.email,
        full_name: `${data.firstName} ${data.lastName}`,
        temporary_password: temporaryPassword,
      });
    } catch {
      await deleteDoc(docRef);
      throw new Error("Failed to send email. Enforcer not added.");
    }

    return { isSuccess: true, message: docRef.id };
  } catch (error) {
    console.error("Error adding enforcer:", error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
};

export const deleteEnforcers = async (documentId: string): Promise<void> => {
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

    if (roles.length === 1 && roles[0] === UserRoles.Enforcer) {
      // Only Enforcer role, delete the document permanently
      await deleteDoc(userRef);
      console.log(`User with ID ${documentId} permanently deleted.`);
    } else {
      // Has other roles, remove Enforcer role
      const updatedRoles = roles.filter((role: number) => role !== UserRoles.Enforcer);
      await updateDoc(userRef, { roles: updatedRoles });
      console.log(`Enforcer role removed from user with ID ${documentId}.`);
    }
  } catch (e) {
    console.error(`Error processing user with ID ${documentId}: `, e);
    throw e; // Re-throw the error to be handled by the caller
  }
};
