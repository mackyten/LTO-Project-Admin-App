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
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { Transition } from "../../../../shared/transition";
import React, { useCallback, useEffect } from "react";
import useEnforcersStore from "../store";
import { FileUploadComponent } from "../../../../shared/file_upload/file_upload_component";
import type { UpdateEnforcerData } from "../../../../../firebase/enforcers";
import { mainColor } from "../../../../../themes/colors";
import { useUpdateEnforcer } from "../hooks";

export const EnforcerDetailsDialog: React.FC = () => {
  const {
    isProfileModalOpen,
    selectedEnforcer,
    setProfileModalOpen,
    setSelectedEnforcer,
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
    idBadgePhoto,
    setIdBadgePhoto,
    initializeFormData,
    resetDialogState,
  } = useEnforcersStore();

  const updateEnforcerMutation = useUpdateEnforcer();

  // Initialize form data when enforcer is selected
  useEffect(() => {
    if (selectedEnforcer) {
      initializeFormData(selectedEnforcer);
    }
  }, [selectedEnforcer, initializeFormData]);

  const handleClose = useCallback(() => {
    setProfileModalOpen(false);
    setSelectedEnforcer(undefined);
    resetDialogState();
  }, [setProfileModalOpen, setSelectedEnforcer, resetDialogState]);

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
    setIdBadgePhoto(null);
    // Reset form data
    if (selectedEnforcer) {
      initializeFormData(selectedEnforcer);
    }
  }, [selectedEnforcer, setIsEditing, setError, setSuccess, setProfilePicture, setIdBadgePhoto, initializeFormData]);

  const handleInputChange = useCallback((field: string, value: string) => {
    updateFormField(field, value);
  }, [updateFormField]);

  const handleSave = useCallback(async () => {
    if (!selectedEnforcer?.documentId) return;

    setError(null);

    try {
      const updateData: UpdateEnforcerData = {
        ...formData,
        profilePicture: profilePicture,
        idBadgePhoto: idBadgePhoto,
      };

      const result = await updateEnforcerMutation.mutateAsync({
        documentId: selectedEnforcer.documentId,
        enforcerData: updateData,
      });

      if (result.isSuccess) {
        setSuccess("Enforcer updated successfully!");
        setIsEditing(false);
        setProfilePicture(null);
        setIdBadgePhoto(null);

        // Update the selected enforcer with the new data
        if (selectedEnforcer) {
          const updatedEnforcer = {
            ...selectedEnforcer,
            ...formData,
            // Note: Keep existing file URLs since backend doesn't return new URLs
          };
          setSelectedEnforcer(updatedEnforcer);
        }

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update enforcer"
      );
    }
  }, [
    selectedEnforcer,
    formData,
    profilePicture,
    idBadgePhoto,
    setSelectedEnforcer,
    updateEnforcerMutation,
    setError,
    setIdBadgePhoto,
    setIsEditing,
    setProfilePicture,
    setSuccess,
  ]);

  const isEmailDisabled = selectedEnforcer?.uuid !== null;

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="xl"
        open={isProfileModalOpen}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="enforcer-profile-dialog"
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundImage: "none",
          },
        }}
      >
        <DialogContent sx={{ p: 4 }}>
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight={700}
                color="primary"
                sx={{ mb: 1 }}
              >
                {isEditing ? "Edit Enforcer Profile" : "Enforcer Profile"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isEditing
                  ? "Update enforcer information and details"
                  : "Complete enforcer information and details"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={handleClose}
                sx={{ color: "text.secondary" }}
              >
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
            {/* Profile Picture and Badge Photo */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  background:
                    "linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)",
                  textAlign: "center",
                  p: 3,
                  height: "fit-content",
                }}
              >
                {/* Profile Picture */}
                {isEditing ? (
                  <FileUploadComponent
                    label="Profile Picture"
                    currentImageUrl={selectedEnforcer?.profilePictureUrl}
                    onFileChange={setProfilePicture}
                    width={200}
                    height={200}
                    borderRadius="50%"
                  />
                ) : (
                  <>
                    <Avatar
                      src={selectedEnforcer?.profilePictureUrl}
                      alt={selectedEnforcer?.lastName}
                      sx={{
                        width: 200,
                        height: 200,
                        mx: "auto",
                        mb: 2,
                        border: "4px solid",
                        borderColor: "primary.main",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      color="primary"
                      sx={{ mb: 0.5 }}
                    >
                      {selectedEnforcer?.firstName} {selectedEnforcer?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedEnforcer?.middleName &&
                        `${selectedEnforcer.middleName}`}
                    </Typography>
                  </>
                )}

                {/* Badge Photo Section */}
                <Box sx={{ mt: 4 }}>
                  {isEditing ? (
                    <FileUploadComponent
                      label="ID/Badge Photo"
                      currentImageUrl={selectedEnforcer?.badgePhoto}
                      onFileChange={setIdBadgePhoto}
                      width={180}
                      height={120}
                      borderRadius={8}
                      placeholder={
                        <BadgeIcon
                          sx={{ fontSize: 40, color: "text.secondary" }}
                        />
                      }
                    />
                  ) : (
                    <>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{ mb: 2, color: "text.primary" }}
                      >
                        ID Badge Photo
                      </Typography>
                      {selectedEnforcer?.badgePhoto ? (
                        <Box
                          component="img"
                          src={selectedEnforcer.badgePhoto}
                          alt="ID Badge"
                          sx={{
                            width: 180,
                            height: 120,
                            borderRadius: 2,
                            objectFit: "cover",
                            border: "2px solid",
                            borderColor: "divider",
                            mx: "auto",
                            display: "block",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 180,
                            height: 120,
                            borderRadius: 2,
                            border: "2px dashed",
                            borderColor: "divider",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: alpha("#f5f5f5", 0.5),
                            mx: "auto",
                          }}
                        >
                          <Box sx={{ textAlign: "center" }}>
                            <BadgeIcon
                              sx={{ fontSize: 30, color: "text.secondary" }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                color: "text.secondary",
                                mt: 1,
                              }}
                            >
                              No badge photo
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Card>
            </Grid>

            {/* Enforcer Details */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  background:
                    "linear-gradient(145deg, #fff7ed 0%, #ffffff 100%)",
                  height: "fit-content",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 4,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${mainColor.secondary}, ${mainColor.primary})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 4px 15px ${alpha(
                          mainColor.secondary,
                          0.3
                        )}`,
                      }}
                    >
                      <PersonIcon sx={{ color: "white", fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={700} color="primary">
                        Personal Information
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Enforcer profile and contact details
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
                          value={selectedEnforcer?.firstName}
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
                          value={selectedEnforcer?.lastName}
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
                          value={selectedEnforcer?.middleName || "N/A"}
                        />
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {isEditing ? (
                        <Tooltip
                          title={
                            isEmailDisabled
                              ? "This enforcer is already registered. Only the account owner can update the email."
                              : ""
                          }
                          arrow
                        >
                          <TextField
                            fullWidth
                            label="Email Address"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            variant="outlined"
                            size="medium"
                            disabled={isEmailDisabled}
                            InputProps={{
                              endAdornment: isEmailDisabled ? (
                                <InfoIcon
                                  sx={{ color: "text.secondary", mr: 1 }}
                                />
                              ) : null,
                            }}
                          />
                        </Tooltip>
                      ) : (
                        <ModernDetailItem
                          icon={<EmailIcon />}
                          label="Email Address"
                          value={selectedEnforcer?.email}
                        />
                      )}
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
                          value={selectedEnforcer?.mobileNumber || "N/A"}
                        />
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          label="Enforcer ID Number"
                          value={formData.enforcerIdNumber}
                          onChange={(e) =>
                            handleInputChange(
                              "enforcerIdNumber",
                              e.target.value
                            )
                          }
                          variant="outlined"
                          size="medium"
                        />
                      ) : (
                        <ModernDetailItem
                          icon={<BadgeIcon />}
                          label="Enforcer ID Number"
                          value={selectedEnforcer?.enforcerIdNumber || "N/A"}
                        />
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, backgroundColor: alpha("#f8fafc", 0.5) }}>
          {isEditing ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={updateEnforcerMutation.isPending}
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
                disabled={updateEnforcerMutation.isPending}
                startIcon={
                  updateEnforcerMutation.isPending ? <CircularProgress size={20} /> : <SaveIcon />
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
                {updateEnforcerMutation.isPending ? "Saving..." : "Save Changes"}
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
  value,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 1.5,
        borderRadius: 1.5,
        backgroundColor: alpha("#f8fafc", 0.5),
        border: "1px solid",
        borderColor: alpha("#e2e8f0", 0.8),
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: alpha("#f1f5f9", 0.8),
          borderColor: alpha("#cbd5e1", 0.8),
        },
      }}
    >
      <Box
        sx={{
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          minWidth: 20,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          fontWeight={600}
          sx={{
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            fontSize: "0.7rem",
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            fontWeight: 500,
            mt: 0.25,
          }}
        >
          {value || "N/A"}
        </Typography>
      </Box>
    </Box>
  );
};
