/**
 * Universal status utility functions for consistent status display across the app
 */

export type StatusColor = "warning" | "success" | "error" | "info" | "default";

/**
 * Get the appropriate chip color based on status value
 * @param status - The status string (can be null or undefined)
 * @returns The Material-UI chip color
 */
export const getStatusColor = (status: string | null | undefined): StatusColor => {
  const displayStatus = getDisplayStatus(status);
  
  switch (displayStatus.toLowerCase()) {
    // Success states
    case "completed":
    case "success":
    case "paid":
    case "approved":
    case "registered":
      return "success";
    
    // Warning states  
    case "pending":
    case "overturned":
      return "warning";
    
    // Error states
    case "failed":
    case "cancelled":
    case "rejected":
      return "error";
    
    // Info states
    case "submitted":
    case "processing":
      return "info";
    
    // Default state
    default:
      return "default";
  }
};

/**
 * Get the display text for status, handling null/undefined/empty values
 * @param status - The status string (can be null or undefined)
 * @returns The status text to display (defaults to "Pending" for empty values)
 */
export const getDisplayStatus = (status: string | null | undefined): string => {
  if (!status || status.trim() === "") {
    return "Pending";
  }
  return status;
};

/**
 * Standard styling for status chips across the app
 */
export const statusChipStyles = {
  fontWeight: 600,
} as const;
