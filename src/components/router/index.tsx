// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import AppLayout from "../../layouts/app_layout";
import AuthStatusWrapper from "../auth_status_wrapper";

// Lazy imports
const LoginPage = lazy(() => import("../pages/auth/login_page"));
const HomePage = lazy(() => import("../pages/public/home_page/home_page"));
const ViolationsPage = lazy(() => import("../pages/public/violations_page"));
const EnforcersPage = lazy(() => import("../pages/public/enforcers_page"));
const PaymentsPage = lazy(() => import("../pages/public/payments_page"));
const DriversPage = lazy(() => import("../pages/public/drivers_page"));
const AdministratorsPage = lazy(
  () => import("../pages/public/administrators_page")
);
const AccountPage = lazy(() => import("../pages/public/account_page"));
const ProtectedLayout = lazy(() => import("../pages/public/protected_layout"));

// A simple wrapper for Suspense
const withSuspense = (Component: React.ReactNode) => (
  <Suspense fallback={<div>Loading...</div>}>{Component}</Suspense>
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
            path: "account",
            element: withSuspense(<AccountPage />),
          },
        ],
      },
    ],
  },
]);

export default router;
