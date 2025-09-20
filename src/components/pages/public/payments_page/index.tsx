import { Box, Typography } from "@mui/material";
import usePaymentsStore from "./store";
import { usePayments } from "./hooks";
import { PageLoadingIndicator } from "../../../shared/loading_indicator/page_loading";
import { PageMainCont } from "../../../shared/style_props/page_container";
import { PageHeader } from "../../../shared/page_header";
import { TableLoadingIndicator } from "../../../shared/loading_indicator/table_loading";
import { Pagination } from "../../../shared/pagination";
import { DataTable } from "./components/data_table";

const PaymentsPage: React.FC = () => {
  const { pageSize, searchQuery, setSearchQuery } = usePaymentsStore();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = usePayments({ pageSize, searchQuery });

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
  const allData = data?.pages?.flatMap((page) => page.payments) || [];
  const dataSeen = allData.length;

  return (
    <Box sx={PageMainCont}>
      <Box sx={PageMainCont.SubCont}>
        <PageHeader
          title="Payments"
          totalCountLabel="Total Payments"
          searchPlaceholder="Search by tracking number or payment reference number"
          totalCount={totalCount}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchKeyDown={handleSearchKeyDown}
          handleSearch={handleSearch}
        />
        <Box sx={{ position: "relative" }}>
          {isRefetching && <TableLoadingIndicator />}
          <DataTable data={allData} />
        </Box>
        <Pagination
          dataSeen={dataSeen}
          totalCount={totalCount}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={handleLoadMore}
        />
      </Box>
    </Box>
  );
};
export default PaymentsPage;
