// src/theme/theme.ts

import { alpha, createTheme } from "@mui/material/styles";
import { mainColor } from "./colors";

export const theme = createTheme({
  palette: {
    primary: {
      main: mainColor.primary,
    },
    secondary: {
      main: mainColor.secondary,
    },
    error: {
      main: mainColor.error,
    },
    background: {
      default: mainColor.background,
    },
    text: {
      primary: mainColor.tertiary, //mainColor.textPrimary,

    },
    // Add more colors from your palette
  },

  components: {
    MuiTableCell: {
      styleOverrides: {
        // This targets all table cells
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper, // Example default color
          borderBottom: `1px solid ${theme.palette.divider}`,
        }),
        // This targets cells specifically inside the TableHead
        head: ({ theme }) => ({
          backgroundColor: mainColor.tertiary, // 👈 Set the color here
          color: theme.palette.common.white, // Optional: change text color for readability
          fontWeight: "bold",
        }),
        body: ({ theme }) => ({
          color: theme.palette.primary.main, // Set the text color here
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // This applies to all buttons (text, contained, outlined)
          height: "48px", // Set a uniform height for all buttons
          borderRadius: "16px", // Set a uniform border radius for all buttons
          // You can also add other universal styles here
          textTransform: "none", // Prevents uppercase text
          fontWeight: "bold",
        },
      },
    },
    // 🎯 Target the TextField component
    MuiTextField: {
      styleOverrides: {
        root: {
          // This affects the container of the TextField
          "& .MuiOutlinedInput-root": {
            backgroundColor: alpha(mainColor.background, 0.1),
            "& fieldset": {
              borderColor: mainColor.textSecondary, // Change the border color
            },
            "&:hover fieldset": {
              borderColor: mainColor.textPrimary, // Change border on hover
            },

            "&.Mui-focused fieldset": {
              borderColor: mainColor.highlight, // Change border when focused
            },
          },
          "& .MuiInputBase-input": {
            color: mainColor.textPrimary, // Change the input text color
          },
        },
      },
    },
    // 🎯 Target the InputLabel component
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: mainColor.textSecondary, // Change the label color
          "&.Mui-focused": {
            color: mainColor.highlight, // Change label color when focused
          },
        },
      },
    },
    // 🎯 Target the InputAdornment component for the icon
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          color: mainColor.textSecondary, // Change the icon color
        },
      },
    },
    // If you need to change icon colors specifically
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: mainColor.textSecondary, // A universal approach for all icons
        },
      },
    },
  },
});
