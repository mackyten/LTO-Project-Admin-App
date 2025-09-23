import React from "react";
import { Grid, TextField, Typography, Divider } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import { ImageUpload } from "./image_upload";
import type { AccountData } from "./types";

interface AccountEditFormProps {
  control: Control<AccountData>;
  errors: FieldErrors<AccountData>;
  idBadgePhoto: File | null;
  idBadgePhotoUrl?: string;
  onIdBadgePhotoChange: (file: File | null) => void;
  isEditing: boolean;
}

export const AccountEditForm: React.FC<AccountEditFormProps> = ({
  control,
  errors,
  idBadgePhoto,
  idBadgePhotoUrl,
  onIdBadgePhotoChange,
  isEditing,
}) => {
  return (
    <Grid container spacing={3}>
      {/* Personal Information */}
      <Grid size={12}>
        <Typography
          variant="h6"
          sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
        >
          Personal Information
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="First Name"
              fullWidth
              variant="outlined"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              required
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Last Name"
              fullWidth
              variant="outlined"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              required
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="middleName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Middle Name"
              fullWidth
              variant="outlined"
              error={!!errors.middleName}
              helperText={errors.middleName?.message}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message}
              required
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="mobileNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Mobile Number"
              type="tel"
              fullWidth
              variant="outlined"
              error={!!errors.mobileNumber}
              helperText={errors.mobileNumber?.message}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="departmentOfficeStation"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Department/Office/Station"
              fullWidth
              variant="outlined"
              error={!!errors.departmentOfficeStation}
              helperText={errors.departmentOfficeStation?.message}
              required
            />
          )}
        />
      </Grid>

      {/* ID Badge Photo */}
      <Grid size={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          ID Badge Photo
        </Typography>
      </Grid>

      <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
        <ImageUpload
          file={idBadgePhoto}
          existingUrl={idBadgePhotoUrl}
          onFileChange={onIdBadgePhotoChange}
          label="ID Badge Photo"
          isEditing={isEditing}
          size={120}
        />
      </Grid>
    </Grid>
  );
};
