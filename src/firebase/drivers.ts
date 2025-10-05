// src/firebase/drivers.ts
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { FirebaseCollections } from "../enums/collections";
import { createFile, deleteFileIfExists } from "../cloudinary/file_upload";

export interface UpdateDriverData {
  firstName: string;
  lastName: string;
  middleName?: string;
  mobileNumber?: string;
  driverLicenseNumber?: string;
  plateNumber?: string;
  profilePicture?: File | null;
}

export interface UpdateDriverParams {
  documentId: string;
  driverData: UpdateDriverData;
}

interface DriverUpdateFields {
  firstName: string;
  lastName: string;
  middleName?: string;
  mobileNumber?: string;
  driverLicenseNumber?: string;
  plateNumber?: string;
  profilePictureUrl?: string;
  lastUpdatedAt: Date;
}

/**
 * Update driver details with proper file handling
 * @param params - Document ID and driver data
 * @returns Promise with success status
 */
export const updateDriver = async (params: UpdateDriverParams): Promise<{ isSuccess: boolean; message: string }> => {
  const { documentId, driverData } = params;
  
  console.log("updateDriver called with:", { documentId, driverData });
  
  if (!documentId) {
    throw new Error("Document ID is required to update driver");
  }

  try {
    // Get current driver document
    const userRef = doc(db, FirebaseCollections.users, documentId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("Driver not found");
    }

    const currentData = userDoc.data();
    console.log("Current driver data:", currentData);
    
    const oldProfilePictureUrl = currentData.profilePictureUrl || null;

    // Rollback tracking
    let uploadedProfilePicture: string | null = null;

    try {
      // Handle file uploads (profile picture)
      if (driverData.profilePicture) {
        const result = await createFile(driverData.profilePicture, "profile-pictures");
        uploadedProfilePicture = result.secure_url;
      }

      // Prepare update data
      const updateData: Partial<DriverUpdateFields> = {
        firstName: driverData.firstName,
        lastName: driverData.lastName,
        middleName: driverData.middleName || "",
        mobileNumber: driverData.mobileNumber || "",
        driverLicenseNumber: driverData.driverLicenseNumber || "",
        plateNumber: driverData.plateNumber || "",
        lastUpdatedAt: new Date(),
      };

      // Update file URLs if new files were uploaded
      if (uploadedProfilePicture !== null) {
        updateData.profilePictureUrl = uploadedProfilePicture;
      }

      console.log("Final update data:", updateData);

      // Update Firestore document
      await updateDoc(userRef, updateData);

      console.log("Document updated successfully");

      // Delete old files after successful update
      if (uploadedProfilePicture && oldProfilePictureUrl) {
        await deleteFileIfExists(oldProfilePictureUrl);
      }

      return { isSuccess: true, message: "Driver updated successfully" };

    } catch (error) {
      console.error("Driver update failed, initiating rollback:", error);

      // Rollback operations - delete newly uploaded files
      try {
        if (uploadedProfilePicture) {
          await deleteFileIfExists(uploadedProfilePicture);
        }
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }

      throw error;
    }
  } catch (error) {
    console.error("Error updating driver:", error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
};
