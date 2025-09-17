import { Box, Button, Typography } from "@mui/material";
import type React from "react";
import { TableStyleProps } from "../style_props/table";
import { ArrowForwardIos } from "@mui/icons-material";

interface IPagination {
  dataSeen: number;
  totalCount: number;
  onLoadMore: () => void;
  isFetchingNextPage: boolean;
}

export const Pagination: React.FC<IPagination> = ({
  dataSeen,
  totalCount,
  isFetchingNextPage,
  onLoadMore,
}) => {
  return (
    <Box id="pagination-container" sx={TableStyleProps.paginationContainer}>
      <Typography
        variant="body2"
        sx={TableStyleProps.paginationContainer.dataNumber}
      >
        {`Showing ${dataSeen} of ${totalCount} reports`}
      </Typography>
      <Button
        onClick={onLoadMore}
        disabled={dataSeen === totalCount || isFetchingNextPage}
        variant="outlined"
        endIcon={<ArrowForwardIos />}
        sx={TableStyleProps.paginationContainer.button}
      >
        {isFetchingNextPage ? (
          "Loading..."
        ) : (
          <Box sx={{ display: { xs: "none", sm: "block" } }}>See More...</Box>
        )}
        {isFetchingNextPage ? (
          "Loading..."
        ) : (
          <Box sx={{ display: { xs: "block", sm: "none" } }}>More...</Box>
        )}
      </Button>
    </Box>
  );
};
