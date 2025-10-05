import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  Alert,
  CircularProgress,
  alpha,
} from "@mui/material";
import { MailOutline, Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordSchemaType } from "./schema";
import { useForgotPassword } from "./hooks";
import { mainColor } from "../../../themes/colors";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  open,
  onClose,
}) => {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate, isPending, error, isError } = useForgotPassword();

  const onSubmit = (data: ForgotPasswordSchemaType) => {
    mutate(data.email, {
      onSuccess: () => {
        setIsSuccess(true);
      },
    });
  };

  const handleClose = () => {
    reset();
    setIsSuccess(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: `linear-gradient(145deg, ${alpha("#ffffff", 0.95)}, ${alpha("#ffffff", 0.85)})`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha(mainColor.highlight, 0.2)}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 2,
          position: "relative",
          textAlign: "center",
          background: `linear-gradient(135deg, ${mainColor.primary}, ${mainColor.secondary})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold",
        }}
      >
        {isSuccess ? "Check Your Email" : "Reset Password"}
        <Button
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            minWidth: "auto",
            color: "text.secondary",
            "&:hover": {
              backgroundColor: alpha(mainColor.secondary, 0.1),
            },
          }}
        >
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {isSuccess ? (
          <Box textAlign="center" sx={{ py: 2 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${mainColor.secondary}, ${mainColor.tertiary})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <MailOutline sx={{ fontSize: 30, color: "#ffffff" }} />
            </Box>
            <Typography variant="h6" gutterBottom color="text.primary">
              Password Reset Email Sent!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              We've sent you an email with instructions to reset your password.
              Please check your inbox and follow the link provided.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Didn't receive the email? Check your spam folder or try again.
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Enter your email address and we'll send you a link to reset your
              password.
            </Typography>

            {isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error?.message || "Failed to send reset email. Please try again."}
              </Alert>
            )}

            <TextField
              {...register("email")}
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isPending}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutline sx={{ color: mainColor.secondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: alpha(mainColor.secondary, 0.4),
                  },
                  "&:hover fieldset": {
                    borderColor: mainColor.secondary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: mainColor.tertiary,
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: mainColor.tertiary,
                },
              }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {isSuccess ? (
          <Button
            onClick={handleClose}
            variant="contained"
            fullWidth
            sx={{
              borderRadius: 2,
              py: 1.5,
              background: `linear-gradient(135deg, ${mainColor.secondary}, ${mainColor.primary})`,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                background: `linear-gradient(135deg, ${mainColor.primary}, ${mainColor.tertiary})`,
              },
            }}
          >
            Close
          </Button>
        ) : (
          <>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                borderRadius: 2,
                py: 1.5,
                borderColor: alpha(mainColor.secondary, 0.4),
                color: mainColor.secondary,
                fontWeight: 500,
                textTransform: "none",
                "&:hover": {
                  borderColor: mainColor.secondary,
                  backgroundColor: alpha(mainColor.secondary, 0.1),
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              onClick={handleSubmit(onSubmit)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                background: `linear-gradient(135deg, ${mainColor.secondary}, ${mainColor.primary})`,
                fontWeight: 600,
                textTransform: "none",
                minWidth: 120,
                "&:hover": {
                  background: `linear-gradient(135deg, ${mainColor.primary}, ${mainColor.tertiary})`,
                },
                "&:disabled": {
                  background: alpha(mainColor.secondary, 0.3),
                },
              }}
            >
              {isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPasswordModal;
