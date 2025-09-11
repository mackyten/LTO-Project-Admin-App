// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../../layouts/app_layout';
import AuthStatusWrapper from '../auth_status_wrapper';
import LoginPage from '../pages/auth/login_page';
import HomePage from '../pages/public/home_page';


const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        // This is a special redirect route that acts as the entry point
        index: true,
        element: <AuthStatusWrapper />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      // All other routes will be handled normally
      {
        path: 'home',
        element: <HomePage />,
      },
      // {
      //   path: 'dashboard',
      //   element: (
      //     <ProtectedRoute>
      //       <DashboardPage />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: 'profile',
      //   element: (
      //     <ProtectedRoute>
      //       <ProfilePage />
      //     </ProtectedRoute>
      //   ),
      // },
      // You can add more public or protected routes here
    ],
  },
]);

export default router;