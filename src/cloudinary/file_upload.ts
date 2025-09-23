// Cloudinary configuration - hybrid approach (upload preset + API key)
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

/**
 * Upload a file to Cloudinary using hybrid approach (upload preset + API key)
 * This matches the Flutter implementation exactly
 * @param file - The file to upload
 * @param folder - Optional folder path in Cloudinary
 * @returns Promise with the upload result containing the secure URL
 */
export const createFile = async (
  file: File,
  folder?: string
): Promise<{ secure_url: string; public_id: string }> => {
  try {
    // 1. Validate configuration
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY) {
      throw new Error('Cloudinary cloud name or API key not configured.');
    }

    // 2. Prepare the request
    const formData = new FormData();
    formData.append('file', file); // The field name for the file is always 'file'
    formData.append('upload_preset', CLOUDINARY_CLOUD_NAME); // Using cloud name as preset (like Flutter)
    formData.append('api_key', CLOUDINARY_API_KEY);
    
    if (folder) {
      formData.append('folder', folder);
    }

    // 3. Send the request
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    // 4. Handle the response
    if (response.status === 200) {
      const responseData = await response.json();
      const imageUrl = responseData.secure_url as string;
      return {
        secure_url: imageUrl,
        public_id: responseData.public_id,
      };
    } else {
      const errorBody = await response.text();
      throw new Error(`Failed to upload photo: ${errorBody}`);
    }
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw new Error(`Failed to upload photo: ${error}`);
  }
};

/**
 * Generates the signature required for Cloudinary API authentication
 * @param publicId - The public ID of the file
 * @param timestamp - The timestamp
 * @param apiSecret - The API secret
 * @returns The signature string
 */
const generateSignature = async (
  publicId: string,
  timestamp: number,
  apiSecret: string
): Promise<string> => {
  // Create the string to sign
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;

  // Generate SHA1 hash
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return signature;
};

/**
 * Validates if the URL is from your Cloudinary cloud
 * @param url - The URL to validate
 * @returns True if valid Cloudinary URL
 */
const isValidCloudinaryUrl = (url: string): boolean => {
  try {
    const uri = new URL(url);
    return uri.hostname === 'res.cloudinary.com' &&
           uri.pathname.includes(`/${CLOUDINARY_CLOUD_NAME}/`);
  } catch {
    return false;
  }
};

/**
 * Deletes a photo using environment variables (matches Flutter implementation)
 * @param imageUrl - The Cloudinary URL of the image to delete
 * @returns Promise with boolean indicating success
 */
export const deletePhoto = async (imageUrl: string): Promise<boolean> => {
  // Validate configuration
  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error('Error: Cloudinary credentials not configured properly');
    return false;
  }

  return await deletePhotoWithCredentials(
    imageUrl,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
  );
};

/**
 * Internal method that handles the actual deletion (matches Flutter implementation)
 * @param imageUrl - The image URL
 * @param apiKey - The API key
 * @param apiSecret - The API secret
 * @returns Promise with boolean indicating success
 */
const deletePhotoWithCredentials = async (
  imageUrl: string,
  apiKey: string,
  apiSecret: string,
): Promise<boolean> => {
  try {
    // Validate that this is actually a Cloudinary URL from your cloud
    if (!isValidCloudinaryUrl(imageUrl)) {
      console.log('Invalid Cloudinary URL:', imageUrl);
      return false;
    }

    // Extract public ID from the Cloudinary URL
    const publicId = extractPublicIdFromUrl(imageUrl);

    if (!publicId) {
      console.log('Could not extract public ID from URL:', imageUrl);
      return false;
    }

    console.log('Attempting to delete:', publicId);

    // Generate timestamp
    const timestamp = Math.floor(Date.now() / 1000);

    // Create signature
    const signature = await generateSignature(publicId, timestamp, apiSecret);

    // Prepare the request
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`;

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', apiKey);
    formData.append('signature', signature);

    // Make the HTTP request
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (response.status === 200) {
      const responseData = await response.json();
      console.log('Delete response:', responseData);

      // Check if the deletion was successful
      const success = responseData.result === 'ok';

      if (!success && responseData.result === 'not found') {
        console.log('Image was already deleted or never existed');
        // You might want to return true here if you consider this successful
      }

      return success;
    } else {
      const errorBody = await response.text();
      console.log(`HTTP Error: ${response.status} - ${errorBody}`);
      return false;
    }
  } catch (error) {
    console.log('Error during deletion:', error);
    return false;
  }
};

/**
 * Delete multiple photos with rate limiting (matches Flutter implementation)
 * @param imageUrls - Array of image URLs to delete
 * @returns Promise with map of URLs to success status
 */
export const deleteMultiplePhotos = async (
  imageUrls: string[]
): Promise<Record<string, boolean>> => {
  const results: Record<string, boolean> = {};

  for (const url of imageUrls) {
    const success = await deletePhoto(url);
    results[url] = success;

    // Rate limiting to avoid API limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return results;
};

/**
 * Delete a file from Cloudinary if it exists (won't throw error if file doesn't exist)
 * @param url - The Cloudinary URL of the file to delete
 * @returns Promise with the deletion result or null if file doesn't exist
 */
export const deleteFileIfExists = async (url: string): Promise<{ result: string; public_id?: string } | null> => {
  try {
    const success = await deletePhoto(url);
    const publicId = extractPublicIdFromUrl(url);
    return success ? { result: 'ok', public_id: publicId || undefined } : null;
  } catch (error) {
    console.warn('Error deleting file (ignoring):', error);
    return null;
  }
};

/**
 * Legacy deleteFile function for backward compatibility
 * @param url - The Cloudinary URL of the file to delete
 * @returns Promise with the deletion result
 */
export const deleteFile = async (url: string): Promise<{ result: string; public_id?: string }> => {
  const success = await deletePhoto(url);
  const publicId = extractPublicIdFromUrl(url);
  
  if (success) {
    return { result: 'ok', public_id: publicId || undefined };
  } else {
    throw new Error('Failed to delete file');
  }
};

/**
 * Extracts the public ID from a Cloudinary URL (matches Flutter implementation)
 * @param url - The Cloudinary URL
 * @returns The public_id or null if invalid URL
 */
const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const uri = new URL(url);
    const pathSegments = uri.pathname.split('/').filter(segment => segment.length > 0);

    const uploadIndex = pathSegments.indexOf('upload');

    if (uploadIndex === -1 || uploadIndex >= pathSegments.length - 1) {
      return null;
    }

    let relevantSegments = pathSegments.slice(uploadIndex + 1);

    // Remove version parameter if it exists
    if (relevantSegments.length > 0 && /^v\d+$/.test(relevantSegments[0])) {
      relevantSegments = relevantSegments.slice(1);
    }

    if (relevantSegments.length === 0) {
      return null;
    }

    let publicId = relevantSegments.join('/');

    // Remove file extension
    const lastDotIndex = publicId.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      publicId = publicId.substring(0, lastDotIndex);
    }

    return publicId;
  } catch (error) {
    console.log('Error extracting public ID from URL:', error);
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
