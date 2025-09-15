import { Box, CircularProgress } from "@mui/material";
import type React from "react";

export const TableLoadingIndicator: React.FC = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        zIndex: 10,
        borderRadius: "16px",
      }}
    >
      <CircularProgress />
    </Box>
  );
};
