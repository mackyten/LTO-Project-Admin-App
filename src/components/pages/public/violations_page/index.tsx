import { Box, Typography } from "@mui/material";
import { useReports } from "./hooks";
import { PageHeader } from "../../../shared/page_header";
import useViolationsStore from "./store";
import { FullDetailsDialog } from "./components/full_details_dialog";
import { DeleteConfimationDialog } from "./components/delete_confirmation_dialog";
import { DriverDetailsDialog } from "./components/driver_details_dialog";
import { TableLoadingIndicator } from "../../../shared/loading_indicator/table_loading";
import { DataTable } from "./components/data_table";
import { Pagination } from "../../../shared/pagination";
import { PageLoadingIndicator } from "../../../shared/loading_indicator/page_loading";
import { PageMainCont } from "../../../shared/style_props/page_container";

export default function ViolationsPage() {
  const { pageSize, searchQuery, setSearchQuery } = useViolationsStore();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = useReports({ pageSize, searchQuery });

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

  // Access the total count from the first page's data
  const totalCount = data?.pages?.[0]?.totalCount ?? 0;
  const allReports = data?.pages?.flatMap((page) => page.reports) || [];
  const reportsSeen = allReports.length;

  return (
    <Box sx={PageMainCont}>
      <Box sx={PageMainCont.SubCont}>
        <PageHeader
          title="Violations"
          totalCountLabel="Total Violations"
          totalCount={totalCount}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchKeyDown={handleSearchKeyDown}
          handleSearch={handleSearch}
        />

        <Box sx={{ position: "relative" }}>
          {isRefetching && <TableLoadingIndicator />}
          <DataTable allReports={allReports} />
        </Box>

        <Pagination
          dataSeen={reportsSeen}
          totalCount={totalCount}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={handleLoadMore}
        />
      </Box>
      <FullDetailsDialog />
      <DeleteConfimationDialog />
      <DriverDetailsDialog />
    </Box>
  );
}
