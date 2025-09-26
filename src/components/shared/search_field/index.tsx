import { Cancel, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React from "react";
import { mainColor } from "../../../themes/colors";
import { textFieldLight } from "../../../themes/textfield";

interface ISearchField {
  searchQuery: string;
  searchPlaceholder: string;
  handleClear?: () => void;
  setSearchQuery: (value: string) => void;
  handleSearchKeyDown: (event: React.KeyboardEvent<Element>) => void;
  handleSearch: () => void;
}

export const SearchField: React.FC<ISearchField> = ({
  searchQuery,
  searchPlaceholder,
  handleClear,
  setSearchQuery,
  handleSearchKeyDown,
  handleSearch,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <TextField
        fullWidth
        placeholder={searchPlaceholder || "Search..."}
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearchKeyDown}
        sx={{
          ...textFieldLight,
          height: "55px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderTopLeftRadius: "16px",
            borderBottomLeftRadius: "16px",
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  if (searchQuery !== "") {
                    setSearchQuery("");
                    if (handleClear) {
                      handleClear();
                    } else {
                      setTimeout(() => {
                        handleSearch();
                      }, 500);
                    }
                  }
                }}
              >
                <Cancel />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{
          bgcolor: mainColor.accent,
          height: "55px",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: "16px",
          borderBottomRightRadius: "16px",
        }}
      >
        Search
      </Button>
    </Box>
  );
};
