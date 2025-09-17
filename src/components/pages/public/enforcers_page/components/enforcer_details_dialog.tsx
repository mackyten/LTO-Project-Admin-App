import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { Transition } from "../../../../shared/transition";
import type React from "react";
import useEnforcersStore from "../store";

export const EnforcerDetailsDialog: React.FC = () => {
  const {
    isProfileModalOpen,
    selectedEnforcer,
    setProfileModalOpen,
    setSelectedEnforcer,
  } = useEnforcersStore();

  const handleClose = () => {
    setProfileModalOpen(false);
    setSelectedEnforcer(undefined);
  };
  return (
    <>
      <Dialog
        fullWidth
        maxWidth={"md"}
        open={isProfileModalOpen}
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
        {
          <DialogContent>
            <Typography
              variant="h6"
              sx={{
                mb: 1,
              }}
              fontWeight={600}
            >
              Enforcers's Profile
            </Typography>

            <Grid container>
              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Avatar
                  src={selectedEnforcer?.profilePictureUrl}
                  alt={selectedEnforcer?.lastName}
                  sx={{ width: "200px", height: "200px" }}
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 8,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                  }}
                  fontWeight={600}
                >
                  {selectedEnforcer?.lastName}, {selectedEnforcer?.firstName}{" "}
                  {selectedEnforcer?.middleName}
                </Typography>
                <Divider
                  sx={{
                    my: 2,
                  }}
                />

                <DetailItem name={"Email"} value={selectedEnforcer?.email} />
                <DetailItem
                  name={"Mobile Number"}
                  value={selectedEnforcer?.mobileNumber}
                />
                <DetailItem
                  name={"ID Number"}
                  value={selectedEnforcer?.enforcerIdNumber}
                />
              </Grid>
            </Grid>
          </DialogContent>
        }

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

interface IDetailItem {
  name: string;
  value?: string;
}

const DetailItem: React.FC<IDetailItem> = ({ name, value }) => {
  return (
    <Grid container>
      <Grid size={3.5}>
        <Typography fontWeight={600}>{name} :</Typography>
      </Grid>
      <Grid>{value}</Grid>
    </Grid>
  );
};
