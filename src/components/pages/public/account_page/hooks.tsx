import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateUserAccount, getCurrentUserData } from '../../../../firebase/account';
import { reauthenticateAndChangePassword } from '../../../../firebase/auth';
import type { UpdateAccountParams } from '../../../../firebase/account';
import type { AdministratorModel } from '../../../../models/administrator_model';
import { useUserStore } from '../protected_layout/store';

// Query Keys
export const ACCOUNT_QUERY_KEYS = {
  currentUser: ['account', 'currentUserData'] as const,
} as const;

/**
 * Hook to get current user data for account management
 */
export const useAccountCurrentUser = () => {
  return useQuery({
    queryKey: ACCOUNT_QUERY_KEYS.currentUser,
    queryFn: getCurrentUserData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      // Don't retry if user is not authenticated
      if (error?.message?.includes('No user is currently logged in')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook to update user account with optimistic updates and rollback
 */
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  const { setCurrentUser } = useUserStore();

  return useMutation({
    mutationFn: updateUserAccount,
    retry: (failureCount, error) => {
      // Retry up to 2 times for network errors or temporary failures
      if (failureCount < 2) {
        const errorMessage = error?.message?.toLowerCase() || '';
        // Retry for network errors, timeouts, or cloudinary issues
        if (errorMessage.includes('network') || 
            errorMessage.includes('timeout') || 
            errorMessage.includes('cloudinary') ||
            errorMessage.includes('fetch')) {
          return true;
        }
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff
    onMutate: async (params: UpdateAccountParams) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ACCOUNT_QUERY_KEYS.currentUser });

      // Snapshot the previous value
      const previousUser = queryClient.getQueryData<AdministratorModel>(
        ACCOUNT_QUERY_KEYS.currentUser
      );

      // Optimistically update to the new value
      if (previousUser) {
        const optimisticUser: AdministratorModel = {
          ...previousUser,
          firstName: params.accountData.firstName,
          lastName: params.accountData.lastName,
          middleName: params.accountData.middleName || "",
          email: params.accountData.email,
          mobileNumber: params.accountData.mobileNumber || "",
          departmentOfficeStation: params.accountData.departmentOfficeStation,
          lastUpdatedAt: new Date(),
        };

        queryClient.setQueryData(ACCOUNT_QUERY_KEYS.currentUser, optimisticUser);
        setCurrentUser(optimisticUser);
      }

      // Return a context object with the snapshotted value
      return { previousUser };
    },
    onSuccess: (updatedUser: AdministratorModel) => {
      // Update the query cache with the actual returned data
      queryClient.setQueryData(ACCOUNT_QUERY_KEYS.currentUser, updatedUser);
      setCurrentUser(updatedUser);
    },
    onError: (_error, _variables, context) => {
      // Rollback to the previous value if the mutation fails
      if (context?.previousUser) {
        queryClient.setQueryData(ACCOUNT_QUERY_KEYS.currentUser, context.previousUser);
        setCurrentUser(context.previousUser);
      }
      // Only invalidate on error to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEYS.currentUser });
    },
  });
};

/**
 * Hook to refetch current user data
 */
export const useRefreshCurrentUser = () => {
  const queryClient = useQueryClient();
  const { setCurrentUser } = useUserStore();

  return useMutation({
    mutationFn: async () => {
      const userData = await getCurrentUserData();
      return userData;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(ACCOUNT_QUERY_KEYS.currentUser, userData);
      setCurrentUser(userData);
    },
  });
};

/**
 * Hook to reauthenticate and change password
 */
export const useReauthenticateAndChangePassword = () => {
  return useMutation({
    mutationFn: async ({ 
      currentPassword, 
      newPassword 
    }: { 
      currentPassword: string; 
      newPassword: string; 
    }) => {
      await reauthenticateAndChangePassword(currentPassword, newPassword);
    },
    retry: (failureCount, error) => {
      // Don't retry for authentication errors or weak password errors
      const errorMessage = error?.message?.toLowerCase() || '';
      if (errorMessage.includes('password') || 
          errorMessage.includes('credential') ||
          errorMessage.includes('weak') ||
          errorMessage.includes('too many')) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000), // Exponential backoff
  });
};

/**
 * Hook to get loading and error states for account operations
 */
export const useAccountState = () => {
  const { data: currentUser, isLoading, error, isError } = useAccountCurrentUser();
  const updateMutation = useUpdateAccount();
  const changePasswordMutation = useReauthenticateAndChangePassword();
  
  return {
    currentUser,
    isLoading: isLoading || updateMutation.isPending || changePasswordMutation.isPending,
    isUpdating: updateMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isError: isError || updateMutation.isError || changePasswordMutation.isError,
    error: error || updateMutation.error || changePasswordMutation.error,
    updateAccount: updateMutation.mutate,
    updateAccountAsync: updateMutation.mutateAsync,
    changePassword: changePasswordMutation.mutate,
    changePasswordAsync: changePasswordMutation.mutateAsync,
  };
};
