import React from "react";
import { Button, Stack, Fab } from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";

interface FloatingActionButtonsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  isEditing,
  isSubmitting,
  onEditToggle,
  onSave,
  onCancel,
}) => {
  return isEditing ? (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
      }}
    >
      <Button
        variant="outlined"
        onClick={onCancel}
        disabled={isSubmitting}
        startIcon={<Cancel />}
        sx={{ minWidth: 120 }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={onSave}
        disabled={isSubmitting}
        startIcon={<Save />}
        sx={{ minWidth: 120 }}
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </Stack>
  ) : (
    <Fab
      color="primary"
      aria-label="edit"
      onClick={onEditToggle}
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
      }}
    >
      <Edit />
    </Fab>
  );
};
