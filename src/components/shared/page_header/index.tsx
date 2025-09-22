import { Box, Grid, Typography } from "@mui/material";
import type React from "react";
import { SearchField } from "../search_field";

export type PageHeaderVariant = "default" | "simple";

interface IPageHeaderBase {
  title: string;
  variant?: PageHeaderVariant;
}

interface IPageHeaderWithSearch extends IPageHeaderBase {
  variant?: "default";
  totalCount: number;
  totalCountLabel: string;
  searchQuery: string;
  searchPlaceholder: string;
  setSearchQuery: (value: string) => void;
  handleSearchKeyDown: (event: React.KeyboardEvent<Element>) => void;
  handleSearch: () => void;
}

interface IPageHeaderSimple extends IPageHeaderBase {
  variant: "simple";
  totalCount?: never;
  totalCountLabel?: never;
  searchQuery?: never;
  searchPlaceholder?: never;
  setSearchQuery?: never;
  handleSearchKeyDown?: never;
  handleSearch?: never;
}

type IPageHeader = IPageHeaderWithSearch | IPageHeaderSimple;

export const PageHeader: React.FC<IPageHeader> = (props) => {
  const { title, variant = "default" } = props;

  return (
    <Box sx={{
      width: "100%",
    }}>
      <Typography
        sx={{
          mb: 1,
          fontSize: {
            xs: "h6.fontSize",
            sm: "h5.fontSize",
            md: "h4.fontSize",
        
          },
        }}
      >
        {title}
      </Typography>
      
      {variant === "default" && (
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
            <Typography>
              {(props as IPageHeaderWithSearch).totalCountLabel}: {(props as IPageHeaderWithSearch).totalCount}
            </Typography>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <SearchField
              searchPlaceholder={(props as IPageHeaderWithSearch).searchPlaceholder}
              searchQuery={(props as IPageHeaderWithSearch).searchQuery}
              setSearchQuery={(props as IPageHeaderWithSearch).setSearchQuery}
              handleSearchKeyDown={(props as IPageHeaderWithSearch).handleSearchKeyDown}
              handleSearch={(props as IPageHeaderWithSearch).handleSearch}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
