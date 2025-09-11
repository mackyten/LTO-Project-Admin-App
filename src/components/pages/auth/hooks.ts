// src/hooks/useLogin.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import type { LoginSchemaType } from "./schema";

const loginUser = async (credentials: LoginSchemaType) => {
  const { email, password } = credentials;
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Invalidate and refetch queries to update data after a successful login
      queryClient.invalidateQueries({ queryKey: ["user"] });
      console.log("Login successful:", data);
      navigate("/"); // Redirect to the authenticated home page
    },
    onError: (error) => {
      console.error("Login failed:", error);
      // You can handle specific error codes here
    },
  });
};
