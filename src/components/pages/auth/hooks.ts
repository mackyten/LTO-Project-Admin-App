import { logoutUser } from "../../../firebase/auth";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();
      navigate("/auth/login"); // Redirect to login page after logout
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};
// src/hooks/useLogin.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../firebase/auth";


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
