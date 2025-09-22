import React from "react";
import { Box, Grid, Typography, Divider } from "@mui/material";
import { InfoField } from "./info_field";
import { ImageUpload } from "./image_upload";
import type { AccountData } from "./types";

interface AccountDisplayViewProps {
  accountData: AccountData;
  idBadgePhoto: File | null;
  onIdBadgePhotoChange: (file: File | null) => void;
}

export const AccountDisplayView: React.FC<AccountDisplayViewProps> = ({
  accountData,
  idBadgePhoto,
  onIdBadgePhotoChange,
}) => {
  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography
          variant="h6"
          sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
        >
          Personal Information
        </Typography>

        <InfoField label="First Name" value={accountData.firstName} />
        <InfoField label="Last Name" value={accountData.lastName} />
        <InfoField label="Middle Name" value={accountData.middleName} />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Typography
          variant="h6"
          sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
        >
          Contact Information
        </Typography>

        <InfoField label="Email Address" value={accountData.email} />
        <InfoField label="Mobile Number" value={accountData.mobileNumber} />
        <InfoField
          label="Department/Office/Station"
          value={accountData.departmentOfficeStation}
        />
      </Grid>

      <Grid size={12}>
        <Divider sx={{ my: 2 }} />
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            color: "primary.main",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          ID Badge Photo
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <ImageUpload
            file={idBadgePhoto}
            onFileChange={onIdBadgePhotoChange}
            label=""
            isEditing={false}
            size={120}
          />
        </Box>
      </Grid>
    </Grid>
  );
};
