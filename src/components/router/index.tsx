// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import AppLayout from "../../layouts/app_layout";
import AuthStatusWrapper from "../auth_status_wrapper";
import { Box, CircularProgress } from "@mui/material";

// Lazy imports
const LoginPage = lazy(() => import("../pages/auth/login_page"));
const HomePage = lazy(() => import("../pages/public/home_page/home_page"));
const ViolationsPage = lazy(() => import("../pages/public/violations_page"));
const EnforcersPage = lazy(() => import("../pages/public/enforcers_page"));
const PaymentsPage = lazy(() => import("../pages/public/payments_page"));
const DriversPage = lazy(() => import("../pages/public/drivers_page"));
const AppealsPage = lazy(() => import("../pages/public/appeals_page"));
const AdministratorsPage = lazy(
  () => import("../pages/public/administrators_page")
);
const AccountPage = lazy(() => import("../pages/public/account_page"));
const ProtectedLayout = lazy(() => import("../pages/public/protected_layout"));
const PaymentSuccessPage = lazy(
  () => import("../pages/public/payment_success_page")
);
const PaymentFailedPage = lazy(
  () => import("../pages/public/payment_failed_page")
);

// A simple wrapper for Suspense
const withSuspense = (Component: React.ReactNode) => (
  <Suspense fallback={<Box sx={{
    width: "100vw", height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}><CircularProgress /></Box>}>{Component}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <AuthStatusWrapper />,
      },
      {
        path: "login",
        element: withSuspense(<LoginPage />),
      },
      {
        path: "success-payment",
        element: withSuspense(<PaymentSuccessPage />),
      },
      {
        path: "failed-payment",
        element: withSuspense(<PaymentFailedPage />),
      },
      {
        path: "app",
        element: withSuspense(<ProtectedLayout />),
        children: [
          {
            index: true,
            element: withSuspense(<HomePage />),
          },
          {
            path: "violations",
            element: withSuspense(<ViolationsPage />),
          },
          {
            path: "enforcers",
            element: withSuspense(<EnforcersPage />),
          },
          {
            path: "drivers",
            element: withSuspense(<DriversPage />),
          },
          {
            path: "payments",
            element: withSuspense(<PaymentsPage />),
          },
          {
            path: "administrators",
            element: withSuspense(<AdministratorsPage />),
          },
          {
            path: "appeals",
            element: withSuspense(<AppealsPage />),
          },
          {
            path: "account",
            element: withSuspense(<AccountPage />),
          },
        ],
      },
    ],
  },
]);

export default router;
