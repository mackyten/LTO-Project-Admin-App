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
import useViolationsStore from "../store";
import { Transition } from "../../../../shared/transition";
import { useDriverByPlateNumber } from "../hooks";
import type React from "react";
import { PageLoadingIndicator } from "../../../../shared/loading_indicator/page_loading";
import { NotFoundOne } from "../../../../shared/not_found/not_found_one";

export const DriverDetailsDialog: React.FC = () => {
  const {
    selectedReport,
    isDriverDialogOpen,
    setDriverDialogOpen,
    setSelectedReport,
  } = useViolationsStore();

  const { data, isLoading } = useDriverByPlateNumber(
    selectedReport?.plateNumber || ""
  );
  const handleClose = () => {
    setDriverDialogOpen(false);
    setSelectedReport(undefined);
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth={"md"}
        open={isDriverDialogOpen}
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
        {isLoading ? (
          <PageLoadingIndicator />
        ) : data === undefined || data === null ? (
          <NotFoundOne
            caption={`The driver for plate number ${selectedReport?.plateNumber} could not be found`}
          />
        ) : (
          <DialogContent>
            <Typography
              variant="h6"
              sx={{
                mb: 1,
              }}
              fontWeight={600}
            >
              Driver's Profile
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
                  src={data?.profilePictureUrl}
                  alt={data?.lastName}
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
                  {data?.lastName}, {data?.firstName} {data?.middleName}
                </Typography>
                <Divider
                  sx={{
                    my: 2,
                  }}
                />

                <DetailItem name={"Email"} value={data?.email} />
                <DetailItem name={"Mobile Number"} value={data?.mobileNumber} />
                <DetailItem
                  name={"License Number"}
                  value={data?.driverLicenseNumber}
                />
                <DetailItem name={"Plate Number"} value={data?.plateNumber} />
              </Grid>
            </Grid>
          </DialogContent>
        )}

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
