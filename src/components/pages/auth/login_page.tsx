import React from "react";
// Remove the BackgroundSVG import
import {
  alpha,
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { LockOutlineRounded } from "@mui/icons-material";
import { loginSchema, type LoginSchemaType } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { mainColor } from "../../../themes/colors";
import { useLogin } from "./hooks";

const LoginPage: React.FC = () => {
  const theme = useTheme();
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

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh", // Use height: 100vh for full viewport height
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        // Apply the background image using CSS properties
        backgroundImage: 'url("/app_bg.svg")', // Adjust the path as needed
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Remove the fixed positioning Box for the SVG */}
      
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          minHeight: "100vh",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant={theme.breakpoints.down("sm") ? "h3" : "h1"}
          color="background.default"
        >
          Welcome Back!
        </Typography>

        <Grid
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          container
          rowGap={4}
          sx={{
            mt: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: { xs: "90vw", sm: "420px" },
            maxWidth: 420,
            border: "1px solid",
            borderColor: "background.default",
            backgroundColor: alpha(theme.palette.background.default, 0.1),
            padding: 4,
            borderRadius: 8,
          }}
        >
          {/* No need for nested grids, just place the items directly */}
          <TextField
            id="login-email"
            label="Email"
            variant="outlined"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="login-password"
            label="Password"
            variant="outlined"
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlineRounded />
                </InputAdornment>
              ),
            }}
          />
          <Divider />
          <Button
            // loading prop is not a standard prop on MUI Button. Use a state variable or a custom component.
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: mainColor.accent,
            }}
          >
            Login
          </Button>

          <Divider />
          <Button
            sx={{
              color: "background.default",
            }}
          >
            Forgot Password? Click here
          </Button>
        </Grid>
      </Box>
    </Box>
  );
};

export default LoginPage;