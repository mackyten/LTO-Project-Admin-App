import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth_context';

const AuthStatusWrapper = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        // User is authenticated, redirect to the Home page
        navigate('/', { replace: true });
      } else {
        // User is not authenticated, redirect to the Login page
        navigate('/login', { replace: true });
      }
    }
  }, [currentUser, loading, navigate]);

  // Optionally, show a loading screen while the auth status is being checked
  return <div>Loading...</div>;
};

export default AuthStatusWrapper;