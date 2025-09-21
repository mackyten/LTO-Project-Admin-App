import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getCurrentUser } from '../../../../firebase/users';
import { useUserStore } from './store';
import { useAuth } from '../../../../context/auth_context';

export const useCurrentUser = () => {
  const { currentUser } = useAuth();
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const query = useQuery({
    queryKey: ['currentUser', currentUser?.uid],
    queryFn: () => getCurrentUser(currentUser?.uid || ''),
    enabled: !!currentUser?.uid,
  });

  useEffect(() => {
    if (query.data) {
      setCurrentUser(query.data);
    }
  }, [query.data, setCurrentUser]);

  return query;
};