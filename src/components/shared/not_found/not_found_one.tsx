import {  Grid, Typography } from "@mui/material";
import type React from "react";
import notFoundLogo from "/not_found.svg";

interface NotFoundOne {
  title?: string;
  caption: string;
}

export const NotFoundOne: React.FC<NotFoundOne> = ({
  title = "Ooops, Sorry!",
  caption,
}) => {
  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Grid
        size={{
          xs: 12,
          sm: 5,
        }}
      >
        <img src={notFoundLogo} className="logo" alt="not_found" />
      </Grid>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: {
            xs: "center",
            sm: "flex-start",
          },
          justifyContent: "center",
        }}
      >
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body1">{caption}</Typography>
      </Grid>
    </Grid>
  );
};
