import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  alpha,
  IconButton,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  DirectionsCar as DirectionsCarIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { Transition } from "../../../../shared/transition";
import React, { useCallback, useEffect } from "react";
import useDriversStore from "../store";
import { FileUploadComponent } from "../../../../shared/file_upload/file_upload_component";
import type { UpdateDriverData } from "../../../../../firebase/drivers";
import { mainColor } from "../../../../../themes/colors";
import { useUpdateDriver } from "../hooks";

export const DriverProfileDialog: React.FC = () => {
  const {
    isProfileModalOpen,
    selectedDriver,
    setProfileModalOpen,
    setSelectedDriver,
    isEditing,
    setIsEditing,
    error,
    setError,
    success,
    setSuccess,
    formData,
    updateFormField,
    profilePicture,
    setProfilePicture,
    initializeFormData,
    resetDialogState,
  } = useDriversStore();

  const updateDriverMutation = useUpdateDriver();

  // Initialize form data when driver is selected
  useEffect(() => {
    if (selectedDriver) {
      initializeFormData(selectedDriver);
    }
  }, [selectedDriver, initializeFormData]);

  const handleClose = useCallback(() => {
    setProfileModalOpen(false);
    setSelectedDriver(undefined);
    resetDialogState();
  }, [setProfileModalOpen, setSelectedDriver, resetDialogState]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  }, [setIsEditing, setError, setSuccess]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    setProfilePicture(null);
    // Reset form data
    if (selectedDriver) {
      initializeFormData(selectedDriver);
    }
  }, [selectedDriver, setIsEditing, setError, setSuccess, setProfilePicture, initializeFormData]);

  const handleInputChange = useCallback((field: string, value: string) => {
    updateFormField(field, value);
  }, [updateFormField]);

  const handleSave = useCallback(async () => {
    console.log("HandleSave called");
    console.log("Selected driver:", selectedDriver);
    console.log("Selected driver keys:", selectedDriver ? Object.keys(selectedDriver) : "No selectedDriver");
    console.log("documentId value:", selectedDriver?.documentId);
    console.log("uuid value:", selectedDriver?.uuid);
    console.log("Form data:", formData);
    
    if (!selectedDriver?.documentId) {
      console.log("No documentId found, trying to use uuid instead");
      if (!selectedDriver?.uuid) {
        console.log("No uuid found either");
        return;
      }
      // Use uuid as fallback
      console.log("Using uuid as documentId:", selectedDriver.uuid);
    }

    setError(null);

    try {
      const updateData: UpdateDriverData = {
        ...formData,
        profilePicture: profilePicture,
      };

      console.log("Update data:", updateData);

      // Use documentId if available, otherwise use uuid
      const docId = selectedDriver.documentId || selectedDriver.uuid;
      if (!docId) {
        console.log("No documentId or uuid found");
        setError("Cannot identify driver to update");
        return;
      }

      const result = await updateDriverMutation.mutateAsync({
        documentId: docId,
        driverData: updateData,
      });

      console.log("Update result:", result);

      if (result.isSuccess) {
        setSuccess("Driver updated successfully!");
        setIsEditing(false);
        setProfilePicture(null);

        // Update the selected driver with the new data
        if (selectedDriver) {
          const updatedDriver = {
            ...selectedDriver,
            ...formData,
            // Note: Keep existing file URLs since backend doesn't return new URLs
          };
          setSelectedDriver(updatedDriver);
        }

        setTimeout(() => {
          setSuccess(null);
        }, 3000);

        handleClose();
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("HandleSave error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update driver"
      );
    }
  }, [
    selectedDriver,
    formData,
    profilePicture,
    setSelectedDriver,
    updateDriverMutation,
    setError,
    setIsEditing,
    setProfilePicture,
    setSuccess,
  ]);

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={isProfileModalOpen}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="driver-profile-dialog"
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundImage: 'none',
          }
        }}
      >
        <DialogContent sx={{ p: 4 }}>
          {/* Header Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
            <Box>
              <Typography variant="h5" fontWeight={700} color="primary" sx={{ mb: 1 }}>
                {isEditing ? "Edit Driver Profile" : "Driver Profile"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isEditing
                  ? "Update driver information and details"
                  : "Complete driver information and details"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Alert Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Grid container spacing={4}>
            {/* Profile Picture */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card 
                elevation={0}
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  background: 'linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)',
                  textAlign: 'center',
                  p: 3,
                  height: 'fit-content'
                }}
              >
                {/* Profile Picture */}
                {isEditing ? (
                  <FileUploadComponent
                    label="Profile Picture"
                    currentImageUrl={selectedDriver?.profilePictureUrl}
                    onFileChange={setProfilePicture}
                    width={200}
                    height={200}
                    borderRadius="50%"
                  />
                ) : (
                  <>
                    <Avatar
                      src={selectedDriver?.profilePictureUrl}
                      alt={selectedDriver?.lastName}
                      sx={{ 
                        width: 200, 
                        height: 200, 
                        mx: 'auto',
                        mb: 2,
                        border: '4px solid',
                        borderColor: 'primary.main',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 0.5 }}>
                      {selectedDriver?.firstName} {selectedDriver?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedDriver?.middleName && `${selectedDriver.middleName}`}
                    </Typography>
                  </>
                )}
              </Card>
            </Grid>

            {/* Driver Details */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card 
                elevation={0}
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  background: 'linear-gradient(145deg, #fff7ed 0%, #ffffff 100%)',
                  height: 'fit-content'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 3, 
                      background: `linear-gradient(135deg, ${mainColor.secondary}, ${mainColor.primary})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 15px ${alpha(mainColor.secondary, 0.3)}`,
                    }}>
                      <PersonIcon sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={700} color="primary">
                        Personal Information
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Driver profile and contact details
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          label="First Name"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          variant="outlined"
                          size="medium"
                        />
                      ) : (
                        <ModernDetailItem 
                          icon={<PersonIcon />}
                          label="First Name" 
                          value={selectedDriver?.firstName}
                        />
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          variant="outlined"
                          size="medium"
                        />
                      ) : (
                        <ModernDetailItem 
                          icon={<PersonIcon />}
                          label="Last Name" 
                          value={selectedDriver?.lastName}
                        />
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          label="Middle Name"
                          value={formData.middleName}
                          onChange={(e) =>
                            handleInputChange("middleName", e.target.value)
                          }
                          variant="outlined"
                          size="medium"
                        />
                      ) : (
                        <ModernDetailItem 
                          icon={<PersonIcon />}
                          label="Middle Name" 
                          value={selectedDriver?.middleName || "N/A"}
                        />
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <ModernDetailItem 
                        icon={<EmailIcon />}
                        label="Email Address" 
                        value={selectedDriver?.email} 
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          label="Mobile Number"
                          value={formData.mobileNumber}
                          onChange={(e) =>
                            handleInputChange("mobileNumber", e.target.value)
                          }
                          variant="outlined"
                          size="medium"
                        />
                      ) : (
                        <ModernDetailItem 
                          icon={<PhoneIcon />}
                          label="Mobile Number" 
                          value={selectedDriver?.mobileNumber || "N/A"} 
                        />
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          label="License Number"
                          value={formData.driverLicenseNumber}
                          onChange={(e) =>
                            handleInputChange("driverLicenseNumber", e.target.value)
                          }
                          variant="outlined"
                          size="medium"
                        />
                      ) : (
                        <ModernDetailItem 
                          icon={<BadgeIcon />}
                          label="License Number" 
                          value={selectedDriver?.driverLicenseNumber || "N/A"} 
                        />
                      )}
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          label="Plate Number"
                          value={formData.plateNumber}
                          onChange={(e) =>
                            handleInputChange("plateNumber", e.target.value)
                          }
                          variant="outlined"
                          size="medium"
                        />
                      ) : (
                        <ModernDetailItem 
                          icon={<DirectionsCarIcon />}
                          label="Plate Number" 
                          value={selectedDriver?.plateNumber || "N/A"} 
                        />
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, backgroundColor: alpha('#f8fafc', 0.5) }}>
          {isEditing ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={updateDriverMutation.isPending}
                startIcon={<CancelIcon />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={updateDriverMutation.isPending}
                startIcon={
                  updateDriverMutation.isPending ? <CircularProgress size={20} /> : <SaveIcon />
                }
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${mainColor.secondary}, ${mainColor.primary})`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${mainColor.primary}, ${mainColor.tertiary})`,
                  },
                }}
              >
                {updateDriverMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              {!isEditing && (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  sx={{
                    background: `linear-gradient(135deg, ${mainColor.secondary}, ${mainColor.primary})`,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${mainColor.primary}, ${mainColor.tertiary})`,
                    },
                  }}
                >
                  Edit
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                }}
              >
                Close
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

interface IModernDetailItem {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}

const ModernDetailItem: React.FC<IModernDetailItem> = ({ 
  icon, 
  label, 
  value
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2,
      p: 1.5,
      borderRadius: 1.5,
      backgroundColor: alpha('#f8fafc', 0.5),
      border: '1px solid',
      borderColor: alpha('#e2e8f0', 0.8),
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: alpha('#f1f5f9', 0.8),
        borderColor: alpha('#cbd5e1', 0.8),
      }
    }}>
      <Box sx={{ 
        color: 'primary.main', 
        display: 'flex', 
        alignItems: 'center',
        minWidth: 20
      }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography 
          variant="caption" 
          fontWeight={600} 
          sx={{ 
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            fontSize: '0.7rem'
          }}
        >
          {label}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 500,
            mt: 0.25
          }}
        >
          {value || "N/A"}
        </Typography>
      </Box>
    </Box>
  );
};
