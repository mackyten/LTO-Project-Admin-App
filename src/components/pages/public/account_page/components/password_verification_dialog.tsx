import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Security } from "@mui/icons-material";

interface PasswordVerificationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  isLoading?: boolean;
  newEmail: string;
  externalError?: string; // New prop for external errors
}

export const PasswordVerificationDialog: React.FC<PasswordVerificationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  newEmail,
  externalError,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setError("");
    onConfirm(password);
  };

  const handleClose = () => {
    if (!isLoading) {
      setPassword("");
      setError("");
      onClose();
    }
  };

  // Use external error if provided, otherwise use local error
  const displayError = externalError || error;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isLoading}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Security color="warning" />
            <Typography variant="h6">Verify Account Security</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            You are about to change your email address to <strong>{newEmail}</strong>. 
            For security purposes, please enter your current password to confirm this change.
          </Alert>

          {displayError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {displayError}
            </Alert>
          )}

          <TextField
            autoFocus
            fullWidth
            label="Current Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            variant="outlined"
            sx={{ mt: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleClose} 
            disabled={isLoading}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !password.trim()}
            color="warning"
          >
            {isLoading ? "Verifying..." : "Verify & Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
