import React from "react";
import BackgroundSVG from "../../app_background";
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

  const { mutate, isPending } = useLogin(); // 👈 Use the mutation hook

  const onSubmit = (data: LoginSchemaType) => {
    mutate(data);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
    >
      <BackgroundSVG className="background-svg" />

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h1" color="text.primary">
          Welcome Back!
        </Typography>

        <Grid
          component="form" // 👈 Add this component prop
          onSubmit={handleSubmit(onSubmit)} // 👈 Handle form submission
          container // The parent Grid should be a container
          rowGap={4}
          sx={{
            mt: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "420px",
            border: "1px solid",
            borderColor: "text.primary",
            backgroundColor: alpha(theme.palette.text.primary, 0.1),
            padding: 8,
            borderRadius: 8,
          }}
        >
          {/* No need for nested grids, just place the items directly */}
          <TextField
            id="login-email"
            label="Email"
            variant="outlined"
            fullWidth // Makes the TextField fill the width of the container
            {...register("email")} // 👈 Register the field
            error={!!errors.email} // 👈 Show error state
            helperText={errors.email?.message} // 👈 Display error message
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            id="login-password"
            label="Password"
            variant="outlined"
            fullWidth // Makes the TextField fill the width of the container
            {...register("password")} // 👈 Register the field
            error={!!errors.password} // 👈 Show error state
            helperText={errors.password?.message} // 👈 Display error message
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlineRounded />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Divider />
          <Button
            loading={isPending}
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
              color: "text.primary",
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
