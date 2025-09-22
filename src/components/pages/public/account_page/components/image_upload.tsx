import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";

interface ImageUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  label: string;
  isEditing: boolean;
  size?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  file,
  onFileChange,
  label,
  isEditing,
  size = 120,
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  React.useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    onFileChange(selectedFile);
  };

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    onFileChange(null);
  };

  const handleContainerClick = () => {
    if (isEditing) {
      const fileInput = document.getElementById(`${label}-file-input`) as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  };

  return (
    <Box sx={{ textAlign: "center", position: "relative" }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 1, display: "block" }}
      >
        {label}
      </Typography>

      <Box 
        sx={{ 
          position: "relative", 
          display: "inline-block",
          cursor: isEditing ? 'pointer' : 'default',
          transition: 'all 0.2s ease-in-out',
          '&:hover': isEditing ? {
            transform: 'scale(1.02)',
            '& .MuiAvatar-root': {
              boxShadow: 3,
            }
          } : {}
        }}
        onClick={handleContainerClick}
      >
        <Avatar
          src={preview || undefined}
          sx={{
            width: size,
            height: size,
            bgcolor: "grey.100",
            border: "3px solid",
            borderColor: "background.paper",
            boxShadow: 2,
            transition: 'box-shadow 0.2s ease-in-out',
          }}
          variant="rounded"
        >
          {!preview && <PhotoCamera sx={{ fontSize: 40, color: "grey.400" }} />}
        </Avatar>

        {/* Hidden file input */}
        <input
          accept="image/*"
          style={{ display: "none" }}
          id={`${label}-file-input`}
          type="file"
          onChange={handleFileChange}
        />

        {/* Remove button overlay */}
        {isEditing && preview && (
          <IconButton
            color="error"
            aria-label="remove image"
            onClick={handleRemove}
            size="small"
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": { boxShadow: 3 },
              zIndex: 1,
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        )}

        {/* Caption */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            position: 'absolute',
            bottom: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            fontSize: '0.7rem',
            opacity: isEditing ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
          }}
        >
          {preview ? 'Tap to change photo' : 'Tap to choose photo'}
        </Typography>
      </Box>
    </Box>
  );
};
