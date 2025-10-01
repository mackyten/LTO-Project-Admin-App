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
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  DirectionsCar as DirectionsCarIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import useViolationsStore from "../store";
import { Transition } from "../../../../shared/transition";
import { useDriverByPlateNumber } from "../hooks";
import type React from "react";
import { PageLoadingIndicator } from "../../../../shared/loading_indicator/page_loading";
import { NotFoundOne } from "../../../../shared/not_found/not_found_one";
import { getStatusColor, getDisplayStatus, statusChipStyles } from "../../../../../utils/status_utils";

export const DriverDetailsDialog: React.FC = () => {
  const {
    selectedReport,
    isDriverDialogOpen,
    setDriverDialogOpen,
    setSelectedReport,
  } = useViolationsStore();

  const { data, isLoading } = useDriverByPlateNumber(
    selectedReport?.plateNumber || ""
  );

  const handleClose = () => {
    setDriverDialogOpen(false);
    setSelectedReport(undefined);
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={isDriverDialogOpen}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="driver-details-dialog"
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundImage: 'none',
          }
        }}
      >
        {isLoading ? (
          <PageLoadingIndicator />
        ) : data === undefined || data === null ? (
          <Box sx={{ p: 6 }}>
            <NotFoundOne
              caption={`The driver for plate number ${selectedReport?.plateNumber} could not be found`}
            />
          </Box>
        ) : (
          <>
            <DialogContent sx={{ p: 4 }}>
              {/* Header Section */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                  <Typography variant="h5" fontWeight={700} color="primary" sx={{ mb: 1 }}>
                    Driver Profile
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Driver information for violation report
                  </Typography>
                </Box>
                <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}>
                  <CloseIcon />
                </IconButton>
              </Box>

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
                    <Avatar
                      src={data.profilePictureUrl}
                      alt={data.lastName}
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
                      {data.firstName} {data.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {data.middleName && `${data.middleName}`}
                    </Typography>
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
                          background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
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
                          <ModernDetailItem 
                            icon={<PersonIcon />}
                            label="Full Name" 
                            value={`${data.lastName}, ${data.firstName} ${data.middleName || ''}`.trim()}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <ModernDetailItem 
                            icon={<EmailIcon />}
                            label="Email Address" 
                            value={data.email} 
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <ModernDetailItem 
                            icon={<PhoneIcon />}
                            label="Mobile Number" 
                            value={data.mobileNumber} 
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <ModernDetailItem 
                            icon={<BadgeIcon />}
                            label="License Number" 
                            value={data.driverLicenseNumber} 
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <ModernDetailItem 
                            icon={<DirectionsCarIcon />}
                            label="Plate Number" 
                            value={data.plateNumber} 
                          />
                        </Grid>

                        {selectedReport && (
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ 
                              p: 1.5,
                              borderRadius: 1.5,
                              backgroundColor: alpha('#f59e0b', 0.05),
                              border: '1px solid',
                              borderColor: alpha('#f59e0b', 0.2),
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 2,
                            }}>
                              <Box sx={{ 
                                color: '#f59e0b', 
                                display: 'flex', 
                                alignItems: 'center',
                                minWidth: 20
                              }}>
                                <AssignmentIcon />
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
                                  Report Status
                                </Typography>
                                <Box sx={{ mt: 0.25 }}>
                                  <Chip 
                                    label={getDisplayStatus(selectedReport.status)}
                                    color={getStatusColor(selectedReport.status)}
                                    size="small"
                                    sx={statusChipStyles}
                                  />
                                </Box>
                              </Box>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, backgroundColor: alpha('#f8fafc', 0.5) }}>
              <Button 
                variant="outlined" 
                onClick={handleClose}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
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
