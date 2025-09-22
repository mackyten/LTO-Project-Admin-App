import {
  Box,
  Button,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type React from "react";
import { PageMainCont } from "../../../shared/style_props/page_container";
import { PageHeader } from "../../../shared/page_header";
import { Pagination } from "../../../shared/pagination";
import { PageLoadingIndicator } from "../../../shared/loading_indicator/page_loading";
import { mainColor } from "../../../../themes/colors";
import { useAdministrators } from "./hooks";
import useAdministratorsStore from "./store";
import AdminItem from "./components/item";
import { AddModal } from "./components/main_modal";
import { DeleteConfimationDialog } from "./components/delete_confirmation_dialog";

const EnforcerPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const {
    pageSize,
    searchQuery,
    setSearchQuery,
    setModalOpen,
    setSelectedAdmin,
    setDeleteConfirmationDialog,
  } = useAdministratorsStore();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isError,
  } = useAdministrators(pageSize, searchQuery);

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

  const handleOpenAddModal = () => {
    setModalOpen(true);
  };

  if (isLoading) {
    return <PageLoadingIndicator />;
  }

  if (isError) {
    return <Typography color="error">Error fetching data.</Typography>;
  }

  const totalCount = data?.pages?.[0]?.totalCount ?? 0;
  const allData = data?.pages?.flatMap((page) => page.administrators) || [];
  const dataSeen = allData.length;

  return (
    <Box sx={PageMainCont}>
      <Box
        sx={{
          ...PageMainCont.SubCont,
          // Change alignItems to flex-start or remove it for proper stretching
          // You could also set it to 'stretch'
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: {
              xs: 1,
              md: 2,
            },
          }}
        >
          <PageHeader
            title="Administrators"
            totalCountLabel="Total Administrators"
            searchPlaceholder="Search by name"
            totalCount={totalCount}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchKeyDown={handleSearchKeyDown}
            handleSearch={handleSearch}
          />
          <Box sx={{ mb: 2 }}>
            <Button
              onClick={handleOpenAddModal}
              variant="contained"
              sx={{
                bgcolor: mainColor.tertiary,
                height: 55,
                minWidth: isMobile ? 55 : undefined,
                p: isMobile ? 0 : undefined,
              }}
            >
              {isMobile ? (
                <Tooltip title="Add Administrator">
                  <AddIcon />
                </Tooltip>
              ) : (
                "Add Administrator"
              )}
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            maxHeight: `calc(100vh - 350px)`,
            minHeight: `calc(100vh - 350px)`,
            overflowY: "auto",
          }}
        >
          {allData.map((admin, index) => (
            <AdminItem
              key={index}
              item={admin}
              onEdit={(item) => {
                setSelectedAdmin(item);
                setModalOpen(true);
              }}
              onDelete={(item) => {
                setSelectedAdmin(item);
                setDeleteConfirmationDialog(true);
              }}
            />
          ))}
        </Box>
        <Pagination
          dataSeen={dataSeen}
          totalCount={totalCount}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={handleLoadMore}
        />
      </Box>
      <AddModal />
      <DeleteConfimationDialog />
    </Box>
  );
};

export default EnforcerPage;
