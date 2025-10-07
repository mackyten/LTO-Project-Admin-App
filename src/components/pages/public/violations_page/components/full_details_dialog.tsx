import type React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  Box,
  Button,
  Divider,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  alpha,
  IconButton,
  CircularProgress,
} from "@mui/material";
import useViolationsStore from "../store";
import { FormatDate } from "../../../../../utils/date_formatter";
import {
  getStatusColor,
  getDisplayStatus,
  statusChipStyles,
} from "../../../../../utils/status_utils";
import {
  CheckBox,
  Close as CloseIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Gavel as GavelIcon,
  CameraAlt as CameraAltIcon,
  Assignment as AssignmentIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import { mainColor } from "../../../../../themes/colors";
import { Transition } from "../../../../shared/transition";
import type { ViolationModel } from "../../../../../models/violation_model";
import jsPDF from "jspdf";
import { useRef, useState } from "react";

export const FullDetailsDialog: React.FC = () => {
  const {
    isFullDetailDialogOpen,
    selectedReport,
    setFullDetailDialogOpen,
    setSelectedReport,
  } = useViolationsStore();

  const [isExporting, setIsExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setFullDetailDialogOpen(false);
    setSelectedReport(undefined);
  };

  const handleExportToPDF = async () => {
    if (!selectedReport) return;

    try {
      setIsExporting(true);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      
      let yPosition = margin;

      // Helper function to add text with automatic line wrapping
      const addText = (text: string, x: number, y: number, options: {
        fontSize?: number;
        maxWidth?: number;
        align?: 'left' | 'center' | 'right';
        bold?: boolean;
      } = {}) => {
        const fontSize = options.fontSize || 10;
        const maxWidth = options.maxWidth || contentWidth;
        const align = options.align || 'left';
        
        pdf.setFontSize(fontSize);
        if (options.bold) pdf.setFont('helvetica', 'bold');
        else pdf.setFont('helvetica', 'normal');
        
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y, { align });
        
        return y + (lines.length * fontSize * 0.35277778); // Convert pt to mm
      };

      // Helper function to draw a box
      const drawBox = (x: number, y: number, width: number, height: number) => {
        pdf.rect(x, y, width, height);
      };

      // Header Section
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPosition, contentWidth, 15, 'F');
      yPosition = addText('REPUBLIC OF THE PHILIPPINES', margin + 5, yPosition + 5, { fontSize: 12, bold: true, align: 'center', maxWidth: contentWidth });
      yPosition = addText('Department of Transportation', margin + 5, yPosition, { fontSize: 10, align: 'center', maxWidth: contentWidth });
      yPosition = addText('LAND TRANSPORTATION OFFICE', margin + 5, yPosition, { fontSize: 11, bold: true, align: 'center', maxWidth: contentWidth });
      
      yPosition += 10;

      // Title
      yPosition = addText('TRAFFIC VIOLATION REPORT', margin, yPosition, { fontSize: 14, bold: true, align: 'center', maxWidth: contentWidth });
      yPosition += 10;

      // Report Information Box
      drawBox(margin, yPosition, contentWidth, 25);
      yPosition = addText('REPORT INFORMATION', margin + 5, yPosition + 5, { fontSize: 11, bold: true });
      yPosition += 3;
      
      // Report details in two columns
      const col1Width = contentWidth / 2 - 5;
      const col2X = margin + col1Width + 10;
      
      yPosition = addText(`Tracking Number: ${selectedReport.trackingNumber || 'N/A'}`, margin + 5, yPosition, { fontSize: 9, maxWidth: col1Width });
      addText(`Date: ${FormatDate(selectedReport.createdAt) || 'N/A'}`, col2X, yPosition - 3, { fontSize: 9, maxWidth: col1Width });
      yPosition = addText(`Status: ${getDisplayStatus(selectedReport.status) || 'N/A'}`, margin + 5, yPosition, { fontSize: 9, maxWidth: col1Width });
      
      yPosition += 10;

      // Personal Information Section
      drawBox(margin, yPosition, contentWidth, 30);
      yPosition = addText('PERSONAL INFORMATION', margin + 5, yPosition + 5, { fontSize: 11, bold: true });
      yPosition += 3;
      
      yPosition = addText(`Full Name: ${selectedReport.fullname || 'N/A'}`, margin + 5, yPosition, { fontSize: 9, maxWidth: contentWidth - 10 });
      yPosition = addText(`Phone Number: ${selectedReport.phoneNumber || 'N/A'}`, margin + 5, yPosition, { fontSize: 9, maxWidth: col1Width });
      addText(`License Number: ${selectedReport.licenseNumber || 'N/A'}`, col2X, yPosition - 3, { fontSize: 9, maxWidth: col1Width });
      yPosition = addText(`Address: ${selectedReport.address || 'N/A'}`, margin + 5, yPosition, { fontSize: 9, maxWidth: contentWidth - 10 });
      yPosition = addText(`Plate Number: ${selectedReport.plateNumber || 'N/A'}`, margin + 5, yPosition, { fontSize: 9, maxWidth: contentWidth - 10 });
      
      yPosition += 10;

      // Violations Section
      const violationsHeight = Math.max(40, (selectedReport.violations?.length || 0) * 8 + 15);
      drawBox(margin, yPosition, contentWidth, violationsHeight);
      yPosition = addText('VIOLATIONS COMMITTED', margin + 5, yPosition + 5, { fontSize: 11, bold: true });
      yPosition += 5;

      if (selectedReport.violations && selectedReport.violations.length > 0) {
        selectedReport.violations.forEach((violation, index) => {
          // Format repetition as ordinal numbers
          const formatRepetition = (repetition: string | number): string => {
            const num = typeof repetition === 'string' ? parseInt(repetition) : repetition;
            if (isNaN(num) || num <= 0) return '1st';
            const cappedNum = Math.min(num, 3);
            switch (cappedNum) {
              case 1: return '1st';
              case 2: return '2nd';
              case 3: return '3rd';
              default: return '1st';
            }
          };

          // Format price in Philippine currency
          const formatPrice = (price: string | number): string => {
            const numPrice = typeof price === 'string' ? parseFloat(price) : price;
            if (isNaN(numPrice)) return '₱0.00';
            return new Intl.NumberFormat('en-PH', {
              style: 'currency',
              currency: 'PHP',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(numPrice);
          };

          yPosition = addText(`${index + 1}. ${violation.violationName} - ${formatRepetition(violation.repetition)} - ${formatPrice(violation.price)}`, margin + 5, yPosition, { fontSize: 9, maxWidth: contentWidth - 10 });
        });
      } else {
        yPosition = addText('No violations recorded', margin + 5, yPosition, { fontSize: 9, maxWidth: contentWidth - 10 });
      }

      yPosition = Math.max(yPosition, yPosition + violationsHeight - 15);
      yPosition += 10;

      // Evidence Section
      drawBox(margin, yPosition, contentWidth, 20);
      yPosition = addText('EVIDENCE AND DOCUMENTATION', margin + 5, yPosition + 5, { fontSize: 11, bold: true });
      yPosition += 3;
      yPosition = addText('☐ License Photo Available', margin + 5, yPosition, { fontSize: 9 });
      yPosition = addText('☐ Plate Photo Available', margin + 5, yPosition, { fontSize: 9 });
      yPosition = addText('☐ Evidence Photo Available', margin + 5, yPosition, { fontSize: 9 });
      
      yPosition += 15;

      // Certification Section
      drawBox(margin, yPosition, contentWidth, 30);
      yPosition = addText('CERTIFICATION', margin + 5, yPosition + 5, { fontSize: 11, bold: true });
      yPosition += 5;
      yPosition = addText('I certify that:', margin + 5, yPosition, { fontSize: 9, bold: true });
      yPosition = addText('1. The information provided in this report is true and correct.', margin + 5, yPosition, { fontSize: 9 });
      yPosition = addText('2. The evidence attached supports the violations listed above.', margin + 5, yPosition, { fontSize: 9 });
      yPosition = addText('3. This report was generated electronically and is valid without signature.', margin + 5, yPosition, { fontSize: 9 });
      
      yPosition += 15;

      // Footer
      drawBox(margin, yPosition, contentWidth / 2 - 5, 25);
      addText('ENFORCER INFORMATION', margin + 5, yPosition + 5, { fontSize: 10, bold: true });
      addText('Name: ________________', margin + 5, yPosition + 10, { fontSize: 9 });
      addText('Badge No: ____________', margin + 5, yPosition + 15, { fontSize: 9 });
      addText('Signature: ____________', margin + 5, yPosition + 20, { fontSize: 9 });

      drawBox(col2X, yPosition, contentWidth / 2 - 5, 25);
      addText('REPORT DETAILS', col2X + 5, yPosition + 5, { fontSize: 10, bold: true });
      addText(`Generated: ${new Date().toLocaleDateString()}`, col2X + 5, yPosition + 10, { fontSize: 9 });
      addText(`Time: ${new Date().toLocaleTimeString()}`, col2X + 5, yPosition + 15, { fontSize: 9 });
      addText('System: LTO AutoFine', col2X + 5, yPosition + 20, { fontSize: 9 });

      // Generate filename with tracking number and date
      const filename = `violation_report_${selectedReport.trackingNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Download the PDF
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // You can add a toast notification here if you have one
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth={"lg"}
        open={isFullDetailDialogOpen}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundImage: "none",
          },
        }}
      >
        <DialogContent sx={{ p: 4 }} ref={contentRef}>
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
                Violation Report Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete information about the violation report
              </Typography>
            </Box>
            <IconButton onClick={handleClose} sx={{ color: "text.secondary" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Report Overview Card */}
          <Card
            elevation={0}
            sx={{
              mb: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: alpha("#1976d2", 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AssignmentIcon sx={{ color: "#1976d2", fontSize: 24 }} />
                </Box>
                <Typography variant="h6" fontWeight={600} color="primary">
                  Report Overview
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ModernDetailItem
                    label="Tracking Number"
                    value={selectedReport?.trackingNumber}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ModernDetailItem
                    label="Date Created"
                    value={FormatDate(selectedReport?.createdAt)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      sx={{
                        color: "text.secondary",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        fontSize: "0.7rem",
                        mb: 1,
                        display: "block",
                      }}
                    >
                      Status
                    </Typography>
                    <Chip
                      label={getDisplayStatus(selectedReport?.status)}
                      color={getStatusColor(selectedReport?.status)}
                      sx={statusChipStyles}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Personal Information Card */}
          <Card
            elevation={0}
            sx={{
              mb: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: alpha("#2e7d32", 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PersonIcon sx={{ color: "#2e7d32", fontSize: 24 }} />
                </Box>
                <Typography variant="h6" fontWeight={600} color="primary">
                  Personal Information
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ModernDetailItem
                    label="Full Name"
                    value={selectedReport?.fullname}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ModernDetailItem
                    label="Phone Number"
                    value={selectedReport?.phoneNumber}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ModernDetailItem
                    label="Address"
                    value={selectedReport?.address}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {/* License and Plate Information Card */}
          <Card
            elevation={0}
            sx={{
              mb: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: alpha("#ed6c02", 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BadgeIcon sx={{ color: "#ed6c02", fontSize: 24 }} />
                </Box>
                <Typography variant="h6" fontWeight={600} color="primary">
                  License and Plate Information
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ModernPhotoItem
                    label="License Number"
                    value={selectedReport?.licenseNumber}
                    imageUrl={selectedReport?.licensePhoto}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ModernPhotoItem
                    label="Plate Number"
                    value={selectedReport?.plateNumber}
                    imageUrl={selectedReport?.platePhoto}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Violations Card */}
          <Card
            elevation={0}
            sx={{
              mb: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: alpha("#d32f2f", 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <GavelIcon sx={{ color: "#d32f2f", fontSize: 24 }} />
                </Box>
                <Typography variant="h6" fontWeight={600} color="primary">
                  Violations ({selectedReport?.violations.length || 0})
                </Typography>
              </Box>

              <Stack spacing={2}>
                {selectedReport?.violations.map((violation, index) => (
                  <ModernViolationItem key={index} violation={violation} />
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* Evidence Card */}
          <Card
            elevation={0}
            sx={{
              mb: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: alpha("#7b1fa2", 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CameraAltIcon sx={{ color: "#7b1fa2", fontSize: 24 }} />
                </Box>
                <Typography variant="h6" fontWeight={600} color="primary">
                  Evidence Photo
                </Typography>
              </Box>

              {selectedReport?.evidencePhoto && (
                <Box
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <img
                    src={selectedReport.evidencePhoto}
                    alt="Evidence photo"
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "400px",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3, backgroundColor: alpha("#f8fafc", 0.5) }}>
          {/* <Button
            variant="contained"
            onClick={handleExportToPDF}
            disabled={isExporting}
            startIcon={isExporting ? <CircularProgress size={16} /> : <PdfIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              mr: 'auto',
            }}
          >
            {isExporting ? 'Generating PDF...' : 'Export to PDF'}
          </Button> */}
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
        </DialogActions>
      </Dialog>
    </>
  );
};

interface IModernDetailItem {
  label: string;
  value?: string | null;
}

const ModernDetailItem: React.FC<IModernDetailItem> = ({ label, value }) => {
  return (
    <Box>
      <Typography
        variant="caption"
        fontWeight={600}
        sx={{
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          fontSize: "0.7rem",
          mb: 1,
          display: "block",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.primary",
          fontWeight: 500,
        }}
      >
        {value || "N/A"}
      </Typography>
    </Box>
  );
};

interface IModernPhotoItem {
  label: string;
  value?: string | null;
  imageUrl?: string | null;
}

const ModernPhotoItem: React.FC<IModernPhotoItem> = ({
  label,
  value,
  imageUrl,
}) => {
  return (
    <Box>
      <Typography
        variant="caption"
        fontWeight={600}
        sx={{
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          fontSize: "0.7rem",
          mb: 1,
          display: "block",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.primary",
          fontWeight: 500,
          mb: 2,
        }}
      >
        {value || "N/A"}
      </Typography>

      {imageUrl && (
        <Box
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "#f5f5f5",
            maxWidth: "300px",
          }}
        >
          <img
            src={imageUrl}
            alt={`${label} photo`}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "200px",
              objectFit: "cover",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

interface IModernViolationItem {
  violation: ViolationModel;
}

const ModernViolationItem: React.FC<IModernViolationItem> = ({ violation }) => {
  // Helper function to format repetition as ordinal numbers
  const formatRepetition = (repetition: string | number): string => {
    const num = typeof repetition === 'string' ? parseInt(repetition) : repetition;
    
    if (isNaN(num) || num <= 0) return '1st';
    
    // Cap at 3rd for any number exceeding 3
    const cappedNum = Math.min(num, 3);
    
    switch (cappedNum) {
      case 1:
        return '1st';
      case 2:
        return '2nd';
      case 3:
        return '3rd';
      default:
        return '3rd';
    }
  };

  // Helper function to format price in Philippine currency
  const formatPrice = (price: string | number): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numPrice)) return '₱0.00';
    
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numPrice);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        borderRadius: 2,
        backgroundColor: alpha("#f5f5f5", 0.5),
        border: "1px solid",
        borderColor: alpha("#e0e0e0", 0.8),
      }}
    >
      <CheckBox
        sx={{
          color: mainColor.tertiary,
        }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          {violation.violationName}
        </Typography>
      </Box>
      <Chip 
        label={formatRepetition(violation.repetition)} 
        size="small"
        color="warning"
        sx={{ fontWeight: 600 }}
      />
      <Typography variant="body2" fontWeight={600} color="error.main">
        {formatPrice(violation.price)}
      </Typography>
    </Box>
  );
};
