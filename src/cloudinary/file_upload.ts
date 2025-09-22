// Cloudinary configuration
// Note: You need to create an unsigned upload preset in your Cloudinary dashboard
// Go to Settings -> Upload -> Add upload preset
// Set "Signing Mode" to "Unsigned" and configure your upload settings
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload a file to Cloudinary using unsigned upload
 * @param file - The file to upload
 * @param folder - Optional folder path in Cloudinary
 * @returns Promise with the upload result containing the secure URL
 */
export const createFile = async (
  file: File,
  folder?: string
): Promise<{ secure_url: string; public_id: string }> => {
  try {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary configuration missing. Please check your environment variables.');
    }

    // Create FormData for the upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    if (folder) {
      formData.append('folder', folder);
    }

    // Upload to Cloudinary using fetch API
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const result = await response.json();

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Note: File deletion from Cloudinary requires server-side implementation
 * for security reasons. This function extracts the public_id for potential
 * server-side deletion or returns a success response for development.
 * 
 * @param url - The Cloudinary URL of the file to delete
 * @returns Promise with the deletion result
 */
export const deleteFile = async (url: string): Promise<{ result: string; public_id?: string }> => {
  try {
    const publicId = extractPublicIdFromUrl(url);
    
    if (!publicId) {
      throw new Error('Invalid Cloudinary URL provided');
    }

    // For client-side implementation, we'll return the public_id
    // In a real implementation, you would send this to your backend
    console.log('File deletion requested for public_id:', publicId);
    
    // TODO: Implement server-side deletion endpoint
    // Example: await fetch('/api/cloudinary/delete', { method: 'POST', body: JSON.stringify({ public_id: publicId }) })
    
    return {
      result: 'ok',
      public_id: publicId
    };
  } catch (error) {
    console.error('Error preparing file deletion:', error);
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Note: File deletion from Cloudinary requires server-side implementation
 * for security reasons. This function won't throw an error if the operation fails.
 * 
 * @param url - The Cloudinary URL of the file to delete
 * @returns Promise with the deletion result or null if file doesn't exist
 */
export const deleteFileIfExists = async (url: string): Promise<{ result: string; public_id?: string } | null> => {
  try {
    const publicId = extractPublicIdFromUrl(url);
    
    if (!publicId) {
      console.warn('Invalid Cloudinary URL provided:', url);
      return null;
    }

    // For client-side implementation, we'll return the public_id
    console.log('File deletion (if exists) requested for public_id:', publicId);
    
    // TODO: Implement server-side deletion endpoint
    return {
      result: 'ok',
      public_id: publicId
    };
  } catch (error) {
    console.warn('Error preparing file deletion (ignoring):', error);
    return null;
  }
};

/**
 * Helper function to extract public_id from Cloudinary URL
 * @param url - The Cloudinary URL
 * @returns The public_id or null if invalid URL
 */
const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    // Example URL: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/filename.jpg
    // We need to extract everything after the version number up to the file extension
    
    const urlParts = url.split('/');
    const cloudinaryIndex = urlParts.findIndex(part => part === 'res.cloudinary.com');
    
    if (cloudinaryIndex === -1) {
      return null;
    }

    // Find the upload part
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      return null;
    }

    // Get everything after upload/version/
    const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
    
    // Remove file extension
    const lastDotIndex = pathAfterUpload.lastIndexOf('.');
    const publicId = lastDotIndex !== -1 
      ? pathAfterUpload.substring(0, lastDotIndex)
      : pathAfterUpload;

    return publicId;
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
};

/**
 * Type definitions for better TypeScript support
 */
export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export interface CloudinaryDeleteResult {
  result: string;
}
