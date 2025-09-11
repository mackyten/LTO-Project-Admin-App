// src/router/ProtectedRoute.tsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth_context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth(); // Get user and loading state from your AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until the authentication state is no longer loading
    if (!loading && !currentUser) {
      // User is not logged in, redirect to the login page
      navigate('/login', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    // Show a loading spinner or a simple message while checking auth status
    return <div>Loading...</div>;
  }

  return currentUser ? <>{children}</> : null;
};

export default ProtectedRoute;