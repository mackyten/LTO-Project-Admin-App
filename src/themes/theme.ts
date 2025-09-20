import { alpha, createTheme } from "@mui/material/styles";
import { mainColor } from "./colors";

export const theme = createTheme({
  palette: {
    mode: "light",
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
      primary: mainColor.tertiary,
    },
  },

  components: {
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }),
        head: ({ theme }) => ({
          backgroundColor: mainColor.tertiary,
          color: theme.palette.common.white,
          fontWeight: "bold",
        }),
        body: ({ theme }) => ({
          color: theme.palette.primary.main,
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          height: "48px",
          borderRadius: "16px",
          textTransform: "none",
          fontWeight: "bold",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: alpha(mainColor.background, 0.1),
            "& fieldset": {
              borderColor: alpha(mainColor.tertiary, 0.5),
            },
            "&:hover fieldset": {
              borderColor: mainColor.tertiary,
            },
            "&.Mui-focused fieldset": {
              borderColor: mainColor.highlight,
            },
          },
          "& .MuiInputBase-input": {
            color: mainColor.tertiary,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: mainColor.tertiary,
          "&.Mui-focused": {
            color: mainColor.highlight,
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          color: mainColor.tertiary,
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: mainColor.textSecondary,
        },
      },
    },
  },
});
