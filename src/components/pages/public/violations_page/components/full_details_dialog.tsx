import type React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import useViolationsStore from "../store";
import { FormatDate } from "../../../../../utils/date_formatter";
import { CheckBox } from "@mui/icons-material";
import { mainColor } from "../../../../../themes/colors";
import { Transition } from "../../../../shared/transition";



export const FullDetailsDialog: React.FC = () => {
  const {
    isFullDetailDialogOpen,
    selectedReport,
    setFullDetailDialogOpen,
    setSelectedReport,
  } = useViolationsStore();

  const handleClose = () => {
    setFullDetailDialogOpen(false);
    setSelectedReport(undefined);
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth={"md"}
        open={isFullDetailDialogOpen}
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
        <DialogContent>
          <Title name={"Violation"} />
          <Grid container>
            <Grid
              size={{
                xs: 12,
                md: 7,
              }}
            >
              <Typography>
                Tracking No: {selectedReport?.trackingNumber}
              </Typography>
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 5,
              }}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: {
                  xs: "flex-start",
                  md: "flex-end",
                },
              }}
            >
              <Typography>
                Date: {FormatDate(selectedReport?.createdAt)}
              </Typography>
            </Grid>
          </Grid>
          <Divider
            sx={{
              my: "20px",
            }}
          />
          <Title name={"Personal Information"} />
          <DetailItem name={"Fullname:"} value={selectedReport?.fullname} />
          <DetailItem name={"Address:"} value={selectedReport?.address} />
          <DetailItem
            name={"Phone Number:"}
            value={selectedReport?.phoneNumber}
          />
          <Divider
            sx={{
              my: "20px",
            }}
          />
          <Title name={"License and Plate Information"} />
          <PhotoItem
            name={"License Number:"}
            value={selectedReport?.licenseNumber}
            imageUrl={selectedReport?.licensePhoto}
          />
          <PhotoItem
            name={"Plate Number:"}
            value={selectedReport?.plateNumber}
            imageUrl={selectedReport?.platePhoto}
          />

          <Divider
            sx={{
              my: "20px",
            }}
          />
          <Title name={"Violations"} />
          {selectedReport?.violations.map((violation: string, index) => {
            return <ViolationItem key={index} name={violation} />;
          })}
          <Divider
            sx={{
              my: "20px",
            }}
          />
          <Title name={"Evidence"} />
          <PhotoItem name={""} imageUrl={selectedReport?.evidencePhoto} />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
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
      <Grid
        size={{
          xs: 4,
          md: 3,
        }}
      >
        {" "}
        <Typography>{name}</Typography>
      </Grid>
      <Grid
        size={{
          xs: 8,
          md: 9,
        }}
      >
        <Typography>{value}</Typography>
      </Grid>
    </Grid>
  );
};

interface ITitle {
  name: string;
}
const Title: React.FC<ITitle> = ({ name }) => {
  return (
    <Typography fontWeight={600} sx={{ mb: 2 }} variant="h6">
      {name}
    </Typography>
  );
};

interface IPhotoItem {
  name: string;
  value?: string;
  imageUrl?: string;
}
const PhotoItem: React.FC<IPhotoItem> = ({ name, value, imageUrl }) => {
  return (
    <Grid
      container
      sx={{
        mb: 3,
      }}
    >
      <Grid
        size={{
          xs: 4,
          md: 3,
        }}
      >
        <Typography>{name}</Typography>
      </Grid>
      <Grid
        size={{
          xs: 8,
          md: 9,
        }}
      >
        <Typography>{value}</Typography>
      </Grid>

      {imageUrl && (
        <Grid size={12} sx={{ mt: 2 }}>
          <Box
            sx={{
              mx: 2,
              width: "100%",
              //  height: "300px", // You need to define a height for the box to be effective
              border: "1px solid black", // For visualization
            }}
          >
            <img
              src={imageUrl}
              alt={`${name} photo - ${imageUrl}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // This is the key property
              }}
            />
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

interface IViolationItem {
  name: string;
}
const ViolationItem: React.FC<IViolationItem> = ({ name }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <CheckBox
        sx={{
          color: mainColor.tertiary,
          mx: 2,
        }}
      />
      <Typography>{name}</Typography>
    </Box>
  );
};
