import React from "react";
import { Box, Typography } from "@mui/material";
import { ImageUpload } from "./image_upload";

interface AccountHeaderProps {
  profilePicture: File | null;
  onProfilePictureChange: (file: File | null) => void;
  isEditing: boolean;
  firstName: string;
  lastName: string;
  middleName?: string;
  departmentOfficeStation: string;
}

export const AccountHeader: React.FC<AccountHeaderProps> = ({
  profilePicture,
  onProfilePictureChange,
  isEditing,
  firstName,
  lastName,
  middleName,
  departmentOfficeStation,
}) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        mb: 4,
        pb: 3,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <ImageUpload
        file={profilePicture}
        onFileChange={onProfilePictureChange}
        label="Profile Picture"
        isEditing={isEditing}
        size={140}
      />

      <Typography variant="h4" sx={{ mt: 2, fontWeight: 600 }}>
        {isEditing ? "Edit Account Information" : [firstName, middleName, lastName].filter(Boolean).join(" ")}
      </Typography>

      {!isEditing && (
        <Typography variant="body1" color="text.secondary">
          {departmentOfficeStation}
        </Typography>
      )}
    </Box>
  );
};
