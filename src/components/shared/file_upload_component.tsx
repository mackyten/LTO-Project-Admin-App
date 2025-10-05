import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  alpha,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface FileUploadComponentProps {
  label: string;
  currentImageUrl?: string | null;
  onFileChange: (file: File | null) => void;
  width?: number;
  height?: number;
  borderRadius?: string | number;
  placeholder?: React.ReactNode;
}

export const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  label,
  currentImageUrl,
  onFileChange,
  width = 200,
  height = 200,
  borderRadius = 8,
  placeholder,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileChange(file);
  }, [onFileChange]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  const displayUrl = previewUrl || currentImageUrl;

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
        {label}
      </Typography>
      
      {displayUrl ? (
        <Box sx={{ display: 'inline-block' }}>
          <Box
            component="img"
            src={displayUrl}
            alt={label}
            sx={{
              width,
              height,
              borderRadius,
              objectFit: 'cover',
              border: '2px solid',
              borderColor: 'divider',
              display: 'block',
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width,
            height,
            borderRadius,
            border: '2px dashed',
            borderColor: dragOver ? 'primary.main' : 'divider',
            backgroundColor: dragOver ? alpha('#1976d2', 0.1) : alpha('#f5f5f5', 0.5),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            mx: 'auto',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: alpha('#1976d2', 0.05),
            },
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById(`file-input-${label}`)?.click()}
        >
          {placeholder || <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />}
          <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', px: 2 }}>
            Drop image here or click to upload
          </Typography>
        </Box>
      )}

      <input
        id={`file-input-${label}`}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <Button
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        onClick={() => document.getElementById(`file-input-${label}`)?.click()}
        sx={{ mt: 2 }}
      >
        {displayUrl ? "Change File" : "Choose File"}
      </Button>
    </Box>
  );
};
