// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/auth_context";
import router from "./components/router";
import { ThemeProvider } from "@mui/material";
import { theme } from "./themes/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./utils/emailjs";
export const queryClient = new QueryClient();

declare global {
  var __reactRoot: ReactDOM.Root | undefined;
}

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");

if (!globalThis.__reactRoot) {
  globalThis.__reactRoot = ReactDOM.createRoot(container);
}

globalThis.__reactRoot.render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
