import {
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import type { LoginSchemaType } from "../components/pages/auth/schema";
import { auth } from "../firebase";
import {
  collection,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { FirebaseCollections } from "../enums/collections";
import { UserRoles } from "../enums/roles";

export const logoutUser = async () => {
  await signOut(auth);
};

export const loginUser = async (credentials: LoginSchemaType) => {
  const { email, password } = credentials;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    const authError = error as { code?: string };
    if (authError.code === "auth/user-not-found") {
      console.log("User not found in Firebase Auth, checking Firestore...");
      // Check Firestore for temporary password
      const usersRef = collection(db, FirebaseCollections.users);
      const q = query(usersRef, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        if (!userData.roles || !userData.roles.includes(UserRoles.Admin)) {
          throw error; // User is not an admin
        }

        if (userData.temporaryPassword === password) {
          // Create Firebase Auth account
          const newUserCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const uid = newUserCredential.user.uid;

          // Update Firestore document
          const userDocRef = doc(db, FirebaseCollections.users, userDoc.id);
          await updateDoc(userDocRef, {
            uuid: uid,
            temporaryPassword: null,
            roles: [...userData.roles, UserRoles.None],
          });
          return newUserCredential.user;
        } else {
          throw error; // Password does not match temporary password
        }
      } else {
        throw error; // No user found in Firestore
      }
    } else {
      throw error; // Other authentication errors
    }
  }
};

/**
 * Reauthenticate the current user with their password
 * @param password - The user's current password
 * @returns Promise that resolves when reauthentication is successful
 */
export const reauthenticateUser = async (password: string): Promise<void> => {
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error("No user is currently logged in");
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  } catch (error) {
    const authError = error as { code?: string; message?: string };

    if (
      authError.code === "auth/wrong-password" ||
      authError.code === "auth/invalid-credential"
    ) {
      throw new Error("The password you entered is incorrect");
    } else if (authError.code === "auth/too-many-requests") {
      throw new Error("Too many failed attempts. Please try again later");
    } else {
      throw new Error(
        `Reauthentication failed: ${authError.message || "Unknown error"}`
      );
    }
  }
};

/**
 * Update the current user's email
 * @param newEmail - The new email address
 * @returns Promise that resolves when email is updated successfully
 */
export const updateUserEmail = async (newEmail: string): Promise<void> => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user is currently logged in");
  }

  try {
     await updateEmail(user, newEmail);
  } catch (error) {
    const authError = error as { code?: string; message?: string };
    if (authError.code === "auth/email-already-in-use") {
      throw new Error(
        "This email address is already in use by another account"
      );
    } else if (authError.code === "auth/invalid-email") {
      throw new Error("The email address is not valid");
    } else if (authError.code === "auth/requires-recent-login") {
      throw new Error(
        "This operation requires recent authentication. Please log in again"
      );
    } else if (authError.code === "auth/operation-not-allowed") {
      throw new Error(
        "Email changes require verification. Please contact an administrator or check your Firebase project settings to enable direct email updates for admin users."
      );
    } else {
      throw new Error(
        `Failed to update email: ${authError.message || "Unknown error"}`
      );
    }
  }
};

/**
 * Update the current user's password
 * @param newPassword - The new password
 * @returns Promise that resolves when password is updated successfully
 */
export const updateUserPassword = async (
  newPassword: string
): Promise<void> => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user is currently logged in");
  }

  try {
    await updatePassword(user, newPassword);
  } catch (error) {
    const authError = error as { code?: string; message?: string };

    if (authError.code === "auth/weak-password") {
      throw new Error(
        "The password is too weak. Please choose a stronger password"
      );
    } else if (authError.code === "auth/requires-recent-login") {
      throw new Error(
        "This operation requires recent authentication. Please log in again"
      );
    } else {
      throw new Error(
        `Failed to update password: ${authError.message || "Unknown error"}`
      );
    }
  }
};

/**
 * Reauthenticate the current user and change their password
 * @param currentPassword - The user's current password for reauthentication
 * @param newPassword - The new password to set
 * @returns Promise that resolves when reauthentication and password change are successful
 */
export const reauthenticateAndChangePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error("No user is currently logged in");
  }

  try {
    // First, reauthenticate the user with their current password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // After successful reauthentication, update the password
    await updatePassword(user, newPassword);
  } catch (error) {
    const authError = error as { code?: string; message?: string };

    // Handle reauthentication errors
    if (
      authError.code === "auth/wrong-password" ||
      authError.code === "auth/invalid-credential"
    ) {
      throw new Error("The current password you entered is incorrect");
    } else if (authError.code === "auth/too-many-requests") {
      throw new Error("Too many failed attempts. Please try again later");
    }
    // Handle password update errors
    else if (authError.code === "auth/weak-password") {
      throw new Error(
        "The new password is too weak. Please choose a stronger password"
      );
    } else {
      throw new Error(
        `Failed to change password: ${authError.message || "Unknown error"}`
      );
    }
  }
};
