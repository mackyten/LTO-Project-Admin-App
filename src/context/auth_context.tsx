// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

// 1. Define the type for our context state.
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

// 2. Create the context.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create a custom hook to use the context easily.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 4. Create the provider component.
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for changes in the Firebase authentication state.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    // This function is returned to clean up the listener when the component unmounts.
    return () => unsubscribe();
  }, []);

  const value = { currentUser, loading };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};