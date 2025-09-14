import { Grid, Typography } from "@mui/material";
import type React from "react";
import { SearchField } from "../search_field";

interface IPageHeader {
  title: string;
  totalCount: number;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleSearchKeyDown: (event: React.KeyboardEvent<Element>) => void;
  handleSearch: () => void;
}

export const PageHeader: React.FC<IPageHeader> = ({
  totalCount,
  title,
  searchQuery,
  setSearchQuery,
  handleSearchKeyDown,
  handleSearch,
}) => {
  return (
    <>
      <Typography variant="h4" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Grid
        rowGap={1}
        container
        sx={{
          alignItems: "center",
          mb: 2,
        }}
      >
        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Typography>Total Violations: {totalCount}</Typography>
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <SearchField
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchKeyDown={handleSearchKeyDown}
            handleSearch={handleSearch}
          />
        </Grid>
      </Grid>
    </>
  );
};
