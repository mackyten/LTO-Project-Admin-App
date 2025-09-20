import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Transition } from "../../../../shared/transition";
import type React from "react";
import useEnforcersStore from "../store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { enforcerSchema, type EnforcerSchemaType } from "../schema";
import { Email, Person, Phone } from "@mui/icons-material";
import { useAddEnforcer } from "../hooks";

export const AddModal: React.FC = () => {
  const { isAddModalOpen, setAddModalOpen } = useEnforcersStore();
  const addEnforcer = useAddEnforcer();
  const isPending = addEnforcer.isPending;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnforcerSchemaType>({
    resolver: zodResolver(enforcerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      mobileNumber: "",
      profilePicture: "",
    },
  });

  const handleClose = () => {
    reset();
    setAddModalOpen(false);
  };

  const onSubmit = (data: EnforcerSchemaType) => {
    addEnforcer.mutate(data, {
      onSuccess(data) {
        if (data.isSuccess) {
          handleClose();
        } else {
          alert(data.message || "Failed to add enforcer.");
        }
      },
    });
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth={"md"}
        open={isAddModalOpen}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          color: "primary.main",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Typography
              variant="h6"
              sx={{
                mb: 1,
              }}
              fontWeight={600}
            >
              Create New Enforcer
            </Typography>
            <Divider sx={{ mt: 1, mb: 5 }} />

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled={isPending}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="First Name"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      disabled={isPending}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Last Name"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      disabled={isPending}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="middleName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Middle Name"
                      error={!!errors.middleName}
                      helperText={errors.middleName?.message}
                      disabled={isPending}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="mobileNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Mobile Number"
                      error={!!errors.mobileNumber}
                      helperText={errors.mobileNumber?.message}
                      disabled={isPending}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
            <Button
              loading={isPending}
              variant="contained"
              type="submit"
            >
              Create Enforcer
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
