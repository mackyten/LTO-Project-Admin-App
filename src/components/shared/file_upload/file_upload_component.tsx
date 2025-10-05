import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Avatar,
  Typography,
  Paper,
  alpha,
} from '@mui/material';
import {
  CloudUpload,
  PhotoCamera,
} from '@mui/icons-material';

interface FileUploadComponentProps {
  label: string;
  currentImageUrl?: string;
  onFileChange: (file: File | null) => void;
  accept?: string;
  width?: number;
  height?: number;
  borderRadius?: string | number;
  placeholder?: React.ReactNode;
}

export const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  label,
  currentImageUrl,
  onFileChange,
  accept = "image/*",
  width = 200,
  height = 200,
  borderRadius = "50%",
  placeholder = <PhotoCamera sx={{ fontSize: 40, color: 'text.secondary' }} />,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileChange(file);
    }
  };



  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
        {label}
      </Typography>
      
      <Paper
        elevation={0}
        sx={{
          width,
          height,
          borderRadius,
          border: '2px dashed',
          borderColor: displayImageUrl ? 'transparent' : alpha('#ccc', 0.5),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: displayImageUrl ? 'transparent' : alpha('#f5f5f5', 0.5),
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: displayImageUrl ? 'transparent' : alpha('#f0f0f0', 0.8),
          },
          mx: 'auto',
        }}
        onClick={handleBoxClick}
      >
        {displayImageUrl ? (
          <>
            <Avatar
              src={displayImageUrl}
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: borderRadius === "50%" ? '50%' : `${borderRadius}px`,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: alpha('#000', 0.5),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.2s ease',
                '&:hover': {
                  opacity: 1,
                },
              }}
            >
              <CloudUpload sx={{ fontSize: 30, color: 'white' }} />
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', p: 2 }}>
            {placeholder}
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
              Click to upload
            </Typography>
          </Box>
        )}
      </Paper>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<CloudUpload />}
          onClick={handleBoxClick}
          sx={{ fontSize: '0.75rem', py: 0.5, px: 2 }}
        >
          Upload
        </Button>

      </Box>
    </Box>
  );
};
