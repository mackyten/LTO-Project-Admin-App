import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
  Divider,
  Grid,
} from "@mui/material";
import { Transition } from "../../../../shared/transition";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateAdministrator } from "../hooks";
import { UserRoles } from "../../../../../enums/roles";
import useAdministratorsStore from "../store";
import { administratorSchema, type AdministratorFormData } from "../schema";
import { useForm } from "react-hook-form";
import { queryClient } from "../../../../../main";

export const AddModal: React.FC = () => {
  const {
    isModalOpen,
    setModalOpen,
    selectedAdmin,
    setSelectedAdmin,
    reset: resetState,
  } = useAdministratorsStore();
  const createAdministrator = useCreateAdministrator();
  const isPending = createAdministrator.isPending;

  const handleClose = () => {
    resetState();
    reset({});
    setSelectedAdmin(null);
    setModalOpen(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdministratorFormData>({
    resolver: zodResolver(administratorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      mobileNumber: "",
      departmentOfficeStation: "",
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      if (selectedAdmin !== null) {
        reset(selectedAdmin);
      } else {
        reset();
      }
    }
  }, [isModalOpen, selectedAdmin, reset]);

  const onSubmit = async (data: AdministratorFormData) => {
    try {
      // Transform form data to match AdministratorModel
      const adminData = {
        ...data,
        uuid: "",
        roles: [UserRoles.None], // Set default role
        idBadgePhoto: data.idBadgePhotoUrl,
        profilePictureUrl: data.profilePictureUrl,
      };

      await createAdministrator.mutate(adminData, {
        onSuccess: () => {
          setModalOpen(false);
          reset(); // Reset form on success
          alert("Administrator created successfully!");
          queryClient.invalidateQueries({ queryKey: ["administrators"] });
        },
        onError: (e) => {
          alert(e);
        },
      });
    } catch (error) {
      console.error("Error creating administrator:", error);
      alert("Failed to create administrator. Please try again.");
    }
  };

  const disableEmail =
    selectedAdmin?.uuid !== null &&
    selectedAdmin?.uuid !== undefined &&
    selectedAdmin?.uuid !== "";

  return (
    <>
      <Dialog
        fullWidth
        maxWidth={"md"}
        open={isModalOpen}
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
              {selectedAdmin ? "Edit Admin" : "Create New Admin"}
            </Typography>
            <Divider sx={{ mt: 1, mb: 5 }} />

            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/**add the fields here*/}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <TextField
                  InputLabelProps={{
                    shrink: selectedAdmin ? true : undefined,
                  }}
                  fullWidth
                  label="First Name"
                  {...register("firstName")}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <TextField
                  InputLabelProps={{
                    shrink: selectedAdmin ? true : undefined,
                  }}
                  fullWidth
                  label="Last Name"
                  {...register("lastName")}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <TextField
                  InputLabelProps={{
                    shrink: selectedAdmin ? true : undefined,
                  }}
                  fullWidth
                  label="Middle Name (Optional)"
                  {...register("middleName")}
                  error={!!errors.middleName}
                  helperText={errors.middleName?.message}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <TextField
                  disabled={disableEmail}
                  InputLabelProps={{
                    shrink: selectedAdmin ? true : undefined,
                  }}
                  fullWidth
                  label="Email"
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <TextField
                  InputLabelProps={{
                    shrink: selectedAdmin ? true : undefined,
                  }}
                  fullWidth
                  label="Mobile Number"
                  {...register("mobileNumber")}
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber?.message}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <TextField
                  fullWidth
                  InputLabelProps={{
                    shrink: selectedAdmin ? true : undefined,
                  }}
                  label="Department / Office / Station"
                  {...register("departmentOfficeStation")}
                  error={!!errors.departmentOfficeStation}
                  helperText={errors.departmentOfficeStation?.message}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
            <Button loading={isPending} variant="contained" type="submit">
              {selectedAdmin ? "Update Admin" : "Create Admin"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
