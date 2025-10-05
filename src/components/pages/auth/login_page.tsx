import React from "react";
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
  Stack,
  Fade,
  IconButton,
  Divider,
} from "@mui/material";
import {
  MailOutline,
  LockOutlined,
  AdminPanelSettings,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { loginSchema, type LoginSchemaType } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { mainColor } from "../../../themes/colors";
import { useLogin } from "./hooks";
import ForgotPasswordModal from "./forgot_password_modal";

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useLogin();

  const onSubmit = (data: LoginSchemaType) => {
    mutate(data);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: `linear-gradient(135deg, ${mainColor.primary} 0%, ${mainColor.secondary} 50%, ${mainColor.tertiary} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${alpha(mainColor.highlight, 0.15)} 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, ${alpha(mainColor.primary, 0.3)} 0%, transparent 50%),
                       radial-gradient(circle at 40% 40%, ${alpha(mainColor.secondary, 0.2)} 0%, transparent 50%)`,
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={800}>
          <Card
            elevation={24}
            sx={{
              borderRadius: 4,
              background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.85)})`,
              backdropFilter: "blur(20px)",
              border: `1px solid ${alpha(mainColor.highlight, 0.2)}`,
              overflow: "visible",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                background: `linear-gradient(45deg, ${mainColor.primary}, ${mainColor.secondary}, ${mainColor.tertiary})`,
                borderRadius: "inherit",
                zIndex: -1,
                opacity: 0.5,
              },
            }}
          >
            <CardContent sx={{ p: 6 }}>
              <Stack spacing={4} alignItems="center">
                {/* Header Section */}
                <Box textAlign="center">
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${mainColor.primary}, ${mainColor.tertiary})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      mx: "auto",
                      boxShadow: `0 8px 32px ${alpha(mainColor.highlight, 0.3)}`,
                    }}
                  >
                    <AdminPanelSettings 
                      sx={{ 
                        fontSize: 40, 
                        color: "white",
                      }} 
                    />
                  </Box>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color="text.primary"
                    sx={{
                      background: `linear-gradient(135deg, ${mainColor.primary}, ${mainColor.secondary})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Sign in to access your admin dashboard
                  </Typography>
                </Box>

                {/* Login Form */}
                <Stack
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  spacing={3}
                  sx={{ width: "100%" }}
                >
                  <TextField
                    {...register("email")}
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message}
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

                  <TextField
                    {...register("password")}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="outlined"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined sx={{ color: mainColor.secondary }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{ color: mainColor.secondary }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
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

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isPending}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      background: `linear-gradient(135deg, ${mainColor.secondary}, ${mainColor.primary})`,
                      boxShadow: `0 8px 32px ${alpha(mainColor.primary, 0.4)}`,
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      textTransform: "none",
                      "&:hover": {
                        background: `linear-gradient(135deg, ${mainColor.primary}, ${mainColor.tertiary})`,
                        boxShadow: `0 12px 40px ${alpha(mainColor.primary, 0.5)}`,
                        transform: "translateY(-2px)",
                      },
                      "&:active": {
                        transform: "translateY(0)",
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {isPending ? "Signing In..." : "Sign In"}
                  </Button>

                  <Divider sx={{ my: 2 }} />

                  <Button
                    variant="text"
                    fullWidth
                    onClick={handleForgotPasswordOpen}
                    sx={{
                      color: mainColor.secondary,
                      fontWeight: 500,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: alpha(mainColor.secondary, 0.1),
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Forgot your password?
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Fade>

        {/* Footer */}
        <Box
          textAlign="center"
          sx={{
            mt: 4,
            color: alpha(mainColor.textPrimary, 0.7),
          }}
        >
          <Typography variant="body2">
            © 2025 LTO Admin Portal. All rights reserved.
          </Typography>
        </Box>
      </Container>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        open={forgotPasswordOpen}
        onClose={handleForgotPasswordClose}
      />
    </Box>
  );
};

export default LoginPage;
