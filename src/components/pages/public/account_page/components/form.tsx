import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "../schema";
import type { AccountData } from "./types";
import { AccountHeader } from "./account_header";
import { AccountEditForm } from "./account_edit_form";
import { AccountDisplayView } from "./account_display_view";
import { FloatingActionButtons } from "./floating_action_buttons";
import { PasswordVerificationDialog } from "./password_verification_dialog";
import { useUserStore } from "../../protected_layout/store";
import { useUpdateAccount } from "../hooks";
import type { UpdateAccountParams } from "../../../../../firebase/account";
import type { AdministratorModel } from "../../../../../models/administrator_model";

interface AccountFormProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
  onSubmitFormSet: (submitForm: () => void) => void;
  onSubmittingChange: (isSubmitting: boolean) => void;
}

const AccountForm: React.FC<AccountFormProps> = ({
  isEditing,
  isSubmitting,
  onEditToggle,
  onSave,
  onCancel,
  onSubmitFormSet,
  onSubmittingChange,
}) => {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [idBadgePhoto, setIdBadgePhoto] = useState<File | null>(null);
  
  // Keep a ref to ensure file objects persist across re-renders
  const profilePictureRef = useRef<File | null>(null);
  const idBadgePhotoRef = useRef<File | null>(null);

  // Profile picture change handler that updates both state and ref
  const handleProfilePictureChange = useCallback((file: File | null) => {
    setProfilePicture(file);
    profilePictureRef.current = file;
  }, []);
  
  // ID badge photo change handler that updates both state and ref
  const handleIdBadgePhotoChange = useCallback((file: File | null) => {
    setIdBadgePhoto(file);
    idBadgePhotoRef.current = file;
  }, []);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<AccountData | null>(
    null
  );
  const [passwordVerificationError, setPasswordVerificationError] =
    useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const { currentUser } = useUserStore();
  const updateAccountMutation = useUpdateAccount();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<AccountData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      mobileNumber: "",
      departmentOfficeStation: "",
    },
  });

  // Initialize form with user data only once when user data is available
  useEffect(() => {
    if (currentUser && !isInitialized) {
      reset({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        middleName: currentUser.middleName || "",
        email: currentUser.email || "",
        mobileNumber: currentUser.mobileNumber || "",
        departmentOfficeStation: currentUser.departmentOfficeStation || "",
      });
      setIsInitialized(true);
    }
  }, [currentUser, reset, isInitialized]);

  const watchedData = watch();

  const handleSave = useCallback(
    async (data: AccountData) => {
      try {
        // Use ref values to ensure we have the most current files, even if state is stale
        const currentProfilePicture = profilePictureRef.current || profilePicture;
        const currentIdBadgePhoto = idBadgePhotoRef.current || idBadgePhoto;
        
        // Create fresh file references to avoid stale data
        const freshProfilePicture = currentProfilePicture ? new File([currentProfilePicture], currentProfilePicture.name, { type: currentProfilePicture.type }) : null;
        const freshIdBadgePhoto = currentIdBadgePhoto ? new File([currentIdBadgePhoto], currentIdBadgePhoto.name, { type: currentIdBadgePhoto.type }) : null;
        
        const updateParams: UpdateAccountParams = {
          accountData: {
            firstName: data.firstName,
            lastName: data.lastName,
            middleName: data.middleName,
            email: data.email,
            mobileNumber: data.mobileNumber,
            departmentOfficeStation: data.departmentOfficeStation,
            profilePicture: freshProfilePicture,
            idBadgePhoto: freshIdBadgePhoto,
          },
        };

        // Add password if email changed
        if (currentUser?.email !== data.email && pendingFormData) {
          // This will be handled by the password verification dialog
          return;
        }

        await updateAccountMutation.mutateAsync(updateParams);
        
        // Don't clear file states here - let them persist until edit mode is exited
        // This prevents issues where the state is cleared before the user sees success
        
        // Exit editing mode after successful save
        onCancel(); // This will reset the form and exit editing mode
      } catch (error) {
        console.error("Failed to save account data:", error);
        // Don't clear files on error so user can retry
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      currentUser?.email,
      pendingFormData,
      updateAccountMutation,
      onCancel,
    ]
    // Note: profilePicture and idBadgePhoto are intentionally excluded from deps
    // We use refs (profilePictureRef, idBadgePhotoRef) to access current values
  );

  const handlePasswordVerification = useCallback(
    async (password: string) => {
      if (!pendingFormData) return;

      setPasswordVerificationError(""); // Clear previous errors
      
      try {
        // Use ref values to ensure we have the most current files, even if state is stale
        const currentProfilePicture = profilePictureRef.current || profilePicture;
        const currentIdBadgePhoto = idBadgePhotoRef.current || idBadgePhoto;
        
        // Create fresh file references to avoid stale data
        const freshProfilePicture = currentProfilePicture ? new File([currentProfilePicture], currentProfilePicture.name, { type: currentProfilePicture.type }) : null;
        const freshIdBadgePhoto = currentIdBadgePhoto ? new File([currentIdBadgePhoto], currentIdBadgePhoto.name, { type: currentIdBadgePhoto.type }) : null;
        
        const updateParams: UpdateAccountParams = {
          accountData: {
            firstName: pendingFormData.firstName,
            lastName: pendingFormData.lastName,
            middleName: pendingFormData.middleName,
            email: pendingFormData.email,
            mobileNumber: pendingFormData.mobileNumber,
            departmentOfficeStation: pendingFormData.departmentOfficeStation,
            profilePicture: freshProfilePicture,
            idBadgePhoto: freshIdBadgePhoto,
          },
          currentPassword: password,
        };        await updateAccountMutation.mutateAsync(updateParams);

        // Don't clear file states here - let them persist until edit mode is exited
        // This prevents issues where the state is cleared before the user sees success
        
        setShowPasswordDialog(false);
        setPendingFormData(null);
        onCancel(); // This will reset the form and exit editing mode
      } catch (error) {
        console.error("Password verification or account update failed:", error);

        // Set error message to display in the dialog
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setPasswordVerificationError(errorMessage);

        // Don't close the dialog, let user try again
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      pendingFormData,
      updateAccountMutation,
      onCancel,
    ]
    // Note: profilePicture and idBadgePhoto are intentionally excluded from deps
    // We use refs (profilePictureRef, idBadgePhotoRef) to access current values
  );

  const handlePasswordDialogClose = useCallback(() => {
    if (!updateAccountMutation.isPending) {
      setShowPasswordDialog(false);
      setPendingFormData(null);
      setPasswordVerificationError(""); // Clear errors when closing
      onSubmittingChange(false);
    }
  }, [updateAccountMutation.isPending, onSubmittingChange]);

  // Set up the submit handler when editing mode changes - using a simpler approach
  useEffect(() => {
    if (isEditing) {
      const submitHandler = () => {
        // Use handleSubmit to get validated form data
        handleSubmit(async (formData: AccountData) => {
          const hasEmailChanged = currentUser?.email !== formData.email;

          if (hasEmailChanged) {
            // Store the form data and show password verification dialog
            setPendingFormData(formData);
            setShowPasswordDialog(true);
            return;
          }

          // If email hasn't changed, proceed with normal save
          await handleSave(formData);
        })();
      };
      onSubmitFormSet(submitHandler);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  // Sync submitting state with React Query loading state
  useEffect(() => {
    onSubmittingChange(updateAccountMutation.isPending);
  }, [updateAccountMutation.isPending, onSubmittingChange]);

  const handleCancel = () => {
    if (currentUser) {
      reset({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        middleName: currentUser.middleName || "",
        email: currentUser.email || "",
        mobileNumber: currentUser.mobileNumber || "",
        departmentOfficeStation: currentUser.departmentOfficeStation || "",
      });
    }
    setProfilePicture(null);
    setIdBadgePhoto(null);
    profilePictureRef.current = null;
    idBadgePhotoRef.current = null;
    onCancel();
  };

  return (
    <Box>
      <AccountHeader
        profilePicture={profilePicture}
        profilePictureUrl={currentUser?.profilePictureUrl}
        onProfilePictureChange={handleProfilePictureChange}
        isEditing={isEditing}
        firstName={watchedData.firstName}
        lastName={watchedData.lastName}
        middleName={watchedData.middleName}
        departmentOfficeStation={watchedData.departmentOfficeStation}
      />

      {isEditing ? (
        <AccountEditForm
          control={control}
          errors={errors}
          idBadgePhoto={idBadgePhoto}
          idBadgePhotoUrl={(currentUser as AdministratorModel)?.idBadgePhotoUrl}
          onIdBadgePhotoChange={handleIdBadgePhotoChange}
          isEditing={isEditing}
        />
      ) : (
        <AccountDisplayView
          accountData={watchedData}
          idBadgePhoto={idBadgePhoto}
          idBadgePhotoUrl={(currentUser as AdministratorModel)?.idBadgePhotoUrl}
          onIdBadgePhotoChange={handleIdBadgePhotoChange}
        />
      )}

      <FloatingActionButtons
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        onEditToggle={onEditToggle}
        onSave={onSave}
        onCancel={handleCancel}
      />

      <PasswordVerificationDialog
        open={showPasswordDialog}
        onClose={handlePasswordDialogClose}
        onConfirm={handlePasswordVerification}
        isLoading={updateAccountMutation.isPending}
        newEmail={pendingFormData?.email || ""}
        externalError={passwordVerificationError}
      />
    </Box>
  );
};

export default AccountForm;
