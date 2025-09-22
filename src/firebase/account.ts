import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { FirebaseCollections } from "../enums/collections";
import { reauthenticateUser, updateUserEmail } from "./auth";
import { createFile, deleteFileIfExists } from "../cloudinary/file_upload";
import type { AdministratorModel } from "../models/administrator_model";

export interface UpdateAccountData {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  mobileNumber?: string;
  departmentOfficeStation: string;
  profilePicture?: File | null;
  idBadgePhoto?: File | null;
}

export interface UpdateAccountParams {
  accountData: UpdateAccountData;
  currentPassword?: string; // Required if email is being changed
}

/**
 * Update user account with proper rollback mechanism
 * @param params - Account data and optional current password
 * @returns Promise with updated user data
 */
export const updateUserAccount = async (params: UpdateAccountParams): Promise<AdministratorModel> => {
  const { accountData, currentPassword } = params;
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    throw new Error("No user is currently logged in");
  }

  // Get current user document from Firestore
  const usersRef = collection(db, FirebaseCollections.users);
  const q = query(usersRef, where("uuid", "==", currentUser.uid));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("User document not found in Firestore");
  }

  const userDoc = snapshot.docs[0];
  const currentUserData = userDoc.data() as AdministratorModel;
  
  // Check if email is being changed
  const emailChanged = currentUser.email !== accountData.email;
  
  // Step 1: Reauthenticate if email is changing
  if (emailChanged) {
    if (!currentPassword) {
      throw new Error("Current password is required to change email");
    }
    await reauthenticateUser(currentPassword);
  }

  // Rollback tracking
  let uploadedProfilePicture: string | null = null;
  let uploadedIdBadgePhoto: string | null = null;
  const oldProfilePictureUrl = currentUserData.profilePictureUrl || null;
  const oldIdBadgePhotoUrl = currentUserData.idBadgePhotoUrl || null;
  let emailUpdated = false;

  try {
    // Step 2: Handle file uploads (profile picture)
    if (accountData.profilePicture) {
      const result = await createFile(accountData.profilePicture, "profile-pictures");
      uploadedProfilePicture = result.secure_url;
    }

    // Step 3: Handle file uploads (ID badge photo)
    if (accountData.idBadgePhoto) {
      const result = await createFile(accountData.idBadgePhoto, "id-badges");
      uploadedIdBadgePhoto = result.secure_url;
    }

    // Step 4: Update email in Firebase Auth if changed
    if (emailChanged) {
      await updateUserEmail(accountData.email);
      emailUpdated = true;
    }

    // Step 5: Prepare Firestore update data
    const updateData: Partial<AdministratorModel> = {
      firstName: accountData.firstName,
      lastName: accountData.lastName,
      middleName: accountData.middleName || "",
      email: accountData.email,
      mobileNumber: accountData.mobileNumber || "",
      departmentOfficeStation: accountData.departmentOfficeStation,
      lastUpdatedAt: new Date(),
    };

    // Update file URLs if new files were uploaded
    if (uploadedProfilePicture !== null) {
      updateData.profilePictureUrl = uploadedProfilePicture;
    }
    if (uploadedIdBadgePhoto !== null) {
      updateData.idBadgePhotoUrl = uploadedIdBadgePhoto;
    }

    // Step 6: Update Firestore document
    const userDocRef = doc(db, FirebaseCollections.users, userDoc.id);
    await updateDoc(userDocRef, updateData);

    // Step 7: Delete old files after successful update
    if (uploadedProfilePicture && oldProfilePictureUrl) {
      await deleteFileIfExists(oldProfilePictureUrl);
    }
    if (uploadedIdBadgePhoto && oldIdBadgePhotoUrl) {
      await deleteFileIfExists(oldIdBadgePhotoUrl);
    }

    // Return updated user data
    return {
      ...currentUserData,
      ...updateData,
    } as AdministratorModel;

  } catch (error) {
    console.error("Account update failed, initiating rollback:", error);

    // Rollback operations
    try {
      // Delete newly uploaded files
      if (uploadedProfilePicture) {
        await deleteFileIfExists(uploadedProfilePicture);
      }
      if (uploadedIdBadgePhoto) {
        await deleteFileIfExists(uploadedIdBadgePhoto);
      }

      // Rollback email change if it was updated
      if (emailUpdated && currentUser.email) {
        try {
          await updateUserEmail(currentUser.email);
        } catch (emailRollbackError) {
          console.error("Failed to rollback email change:", emailRollbackError);
        }
      }
    } catch (rollbackError) {
      console.error("Rollback failed:", rollbackError);
    }

    // Re-throw the original error
    throw error;
  }
};

/**
 * Get current user data from Firestore
 * @returns Promise with current user data
 */
export const getCurrentUserData = async (): Promise<AdministratorModel | null> => {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    return null;
  }

  try {
    const usersRef = collection(db, FirebaseCollections.users);
    const q = query(usersRef, where("uuid", "==", currentUser.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const userDoc = snapshot.docs[0];
    return userDoc.data() as AdministratorModel;
  } catch (error) {
    console.error("Failed to get current user data:", error);
    throw error;
  }
};
