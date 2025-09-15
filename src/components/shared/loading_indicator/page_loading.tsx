import { Box, CircularProgress } from "@mui/material";
import type React from "react";

export const PageLoadingIndicator: React.FC = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
      <CircularProgress />
    </Box>
  );
};
