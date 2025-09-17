import { Box, Typography } from "@mui/material";
import type React from "react";
import { PageMainCont } from "../../../shared/style_props/page_container";
import { PageHeader } from "../../../shared/page_header";
import { useEnforcers } from "./hooks";
import useEnforcersStore from "./store";
import { TableLoadingIndicator } from "../../../shared/loading_indicator/table_loading";
import { Pagination } from "../../../shared/pagination";
import { PageLoadingIndicator } from "../../../shared/loading_indicator/page_loading";
import { DataTable } from "./components/data_table";
import { EnforcerDetailsDialog } from "./components/enforcer_details_dialog";

const EnforcerPage: React.FC = () => {
  const { pageSize, searchQuery, setSearchQuery } = useEnforcersStore();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = useEnforcers({ pageSize, searchQuery });

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const handleSearch = () => {
    refetch();
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  if (isLoading) {
    return <PageLoadingIndicator />;
  }

  if (isError) {
    return <Typography color="error">Error fetching data.</Typography>;
  }

  const totalCount = data?.pages?.[0]?.totalCount ?? 0;
  const allEnforcers = data?.pages?.flatMap((page) => page.users) || [];
  const enforcersSeen = allEnforcers.length;

  return (
    <Box sx={PageMainCont}>
      <Box sx={PageMainCont.SubCont}>
        <PageHeader
          title="Enforcers"
          totalCountLabel="Total Enforcers"
          searchPlaceholder="Search by name"
          totalCount={totalCount}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchKeyDown={handleSearchKeyDown}
          handleSearch={handleSearch}
        />

        <Box sx={{ position: "relative" }}>
          {isRefetching && <TableLoadingIndicator />}
          <DataTable enforcers={allEnforcers} />
        </Box>

        <Pagination
          dataSeen={enforcersSeen}
          totalCount={totalCount}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={handleLoadMore}
        />
      </Box>
      <EnforcerDetailsDialog />
    </Box>
  );
};

export default EnforcerPage;
