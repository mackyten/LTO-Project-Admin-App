import React from "react";
import { Box, Typography } from "@mui/material";

interface InfoFieldProps {
  label: string;
  value?: string;
}

export const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      {label}
    </Typography>
    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
      {value || "—"}
    </Typography>
  </Box>
);
