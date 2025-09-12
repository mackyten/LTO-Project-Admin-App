// src/router/index.tsx

import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../../layouts/app_layout";
import AuthStatusWrapper from "../auth_status_wrapper";
import LoginPage from "../pages/auth/login_page";
import HomePage from "../pages/public/home_page/home_page";
import ViolationsPage from "../pages/public/violations_page";
import EnforcersPage from "../pages/public/enforcers_page";
import PaymentsPage from "../pages/public/payments_page";
import AdministratorsPage from "../pages/public/administrators_page";
import AccountPage from "../pages/public/account_page";
import ProtectedLayout from "../pages/public/protected_layout";

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
        element: <LoginPage />,
      },
      // This is the new parent route for all authenticated pages
      {
        path: "app", // You can name this anything, like "dashboard"
        element: <ProtectedLayout />,
        children: [
          {
            index: true, // This makes "/app" render the HomePage
            element: <HomePage />,
          },
          {
            path: "violations",
            element: <ViolationsPage />,
          },
          {
            path: "enforcers",
            element: <EnforcersPage />,
          },
          {
            path: "payments",
            element: <PaymentsPage />,
          },
          {
            path: "administrators",
            element: <AdministratorsPage />,
          },
          {
            path: "account",
            element: <AccountPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
