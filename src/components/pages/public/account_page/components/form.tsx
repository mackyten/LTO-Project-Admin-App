import React, { useState, useCallback, useEffect } from "react";
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
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<AccountData | null>(null);
  const [passwordVerificationError, setPasswordVerificationError] = useState<string>("");
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
        const updateParams: UpdateAccountParams = {
          accountData: {
            firstName: data.firstName,
            lastName: data.lastName,
            middleName: data.middleName,
            email: data.email,
            mobileNumber: data.mobileNumber,
            departmentOfficeStation: data.departmentOfficeStation,
            profilePicture: profilePicture,
            idBadgePhoto: idBadgePhoto,
          },
        };

        // Add password if email changed
        if (currentUser?.email !== data.email && pendingFormData) {
          // This will be handled by the password verification dialog
          return;
        }

        await updateAccountMutation.mutateAsync(updateParams);
        onSave();
      } catch (error) {
        console.error("Failed to save account data:", error);
      }
    },
    [profilePicture, idBadgePhoto, currentUser?.email, pendingFormData, updateAccountMutation, onSave]
  );

  const handlePasswordVerification = useCallback(
    async (password: string) => {
      if (!pendingFormData) return;

      setPasswordVerificationError(""); // Clear previous errors
      
      try {
        const updateParams: UpdateAccountParams = {
          accountData: {
            firstName: pendingFormData.firstName,
            lastName: pendingFormData.lastName,
            middleName: pendingFormData.middleName,
            email: pendingFormData.email,
            mobileNumber: pendingFormData.mobileNumber,
            departmentOfficeStation: pendingFormData.departmentOfficeStation,
            profilePicture: profilePicture,
            idBadgePhoto: idBadgePhoto,
          },
          currentPassword: password,
        };

        await updateAccountMutation.mutateAsync(updateParams);
        
        // If successful, close dialog and save
        setShowPasswordDialog(false);
        setPendingFormData(null);
        onSave();
        
      } catch (error) {
        console.error("Password verification or account update failed:", error);
        
        // Set error message to display in the dialog
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        setPasswordVerificationError(errorMessage);
        
        // Don't close the dialog, let user try again
      }
    },
    [pendingFormData, profilePicture, idBadgePhoto, updateAccountMutation, onSave]
  );

  const handlePasswordDialogClose = useCallback(() => {
    if (!updateAccountMutation.isPending) {
      setShowPasswordDialog(false);
      setPendingFormData(null);
      setPasswordVerificationError(""); // Clear errors when closing
      onSubmittingChange(false);
    }
  }, [updateAccountMutation.isPending, onSubmittingChange]);

  // Set up the submit handler when editing mode changes
  React.useEffect(() => {
    if (isEditing) {
      const submitHandler = () => {
        handleSubmit(async (data: AccountData) => {
          // Check if email has been changed
          const hasEmailChanged = currentUser?.email !== data.email;
          
          if (hasEmailChanged) {
            // Store the form data and show password verification dialog
            setPendingFormData(data);
            setShowPasswordDialog(true);
            return;
          }

          // If email hasn't changed, proceed with normal save
          await handleSave(data);
        })();
      };
      onSubmitFormSet(submitHandler);
    }
  }, [isEditing, handleSubmit, currentUser?.email, handleSave, onSubmitFormSet]);

  // Sync submitting state with React Query loading state
  React.useEffect(() => {
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
    onCancel();
  };

  return (
    <Box>
      <AccountHeader
        profilePicture={profilePicture}
        onProfilePictureChange={setProfilePicture}
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
          onIdBadgePhotoChange={setIdBadgePhoto}
          isEditing={isEditing}
        />
      ) : (
        <AccountDisplayView
          accountData={watchedData}
          idBadgePhoto={idBadgePhoto}
          onIdBadgePhotoChange={setIdBadgePhoto}
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
