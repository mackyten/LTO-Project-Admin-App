import { mainColor } from "./colors";

export const textFieldLight = {
  // Target the label
  "& .MuiInputLabel-root": {
    color: mainColor.tertiary,
  },
  // Target the notched outline border
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: mainColor.secondary,
  },
  // Target the input content
  "& .MuiInputBase-input": {
    color: mainColor.tertiary,
  },
  // Styles for focused state
  "& .Mui-focused": {
    "& .MuiInputLabel-root": {
      color: "red", // Focus label color
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "yellow", // Focus border color
    },
    "& .MuiInputBase-input": {
      color: mainColor.tertiary, // Focus content color
    },
  },
  // Styles for hover state
  "&:hover": {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "orange", // Hover border color
    },
  },
};
