import { signOut } from "firebase/auth";

export const logoutUser = async () => {
  await signOut(auth);
};
import { signInWithEmailAndPassword } from "firebase/auth";
import type { LoginSchemaType } from "../components/pages/auth/schema";
import { auth } from "../firebase";

export const loginUser = async (credentials: LoginSchemaType) => {
  const { email, password } = credentials;
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};
