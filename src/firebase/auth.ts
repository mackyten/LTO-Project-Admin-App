import {
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
    if (authError.code === "auth/invalid-credential") {
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
