import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Popper,
  Typography,
} from "@mui/material";
import { useReports } from "./hooks";
import { useRef } from "react";
import { FormatDate } from "../../../../utils/date_formatter";
import {
  ArrowForwardIos,
  Delete,
  DriveEta,
  Info,
  MoreVert,
} from "@mui/icons-material";
import { mainColor } from "../../../../themes/colors";
import { PageHeader } from "../../../shared/page_header";
import useViolationsStore from "./store";
import type { ReportModel } from "../../../../models/report_model";
import { FullDetailsDialog } from "./components/full_details_dialog";
import { DeleteConfimationDialog } from "./components/delete_confirmation_dialog";

export default function ViolationsPage() {
  const {
    pageSize,
    searchQuery,
    openMenuId,
    setSearchQuery,
    setOpenMenuId,
    setFullDetailDialogOpen,
    setSelectedReport,
    setDeleteConfirmationDialog
  } = useViolationsStore();

  const anchorRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const handleToggle = (reportId: string) => {
    setOpenMenuId(openMenuId === reportId ? null : reportId);
  };

  const handleOpenFullDetails = (report: ReportModel) => {
    setFullDetailDialogOpen(true);
    setSelectedReport(report);
  };
  const handleDeleteReport = (report: ReportModel) => {
    setSelectedReport(report);
    setDeleteConfirmationDialog(true);
  };

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

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      openMenuId &&
      anchorRefs.current[openMenuId]?.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpenMenuId(null);
  };

  const handleMenuAction = (action: string, reportId: string) => {
    console.log(`${action} for report ${reportId}`);
    // Handle the menu action here
    setOpenMenuId(null); // Close the menu after action
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenMenuId(null);
    } else if (event.key === "Escape") {
      setOpenMenuId(null);
    }
  }

  const handleSearch = () => {
    refetch();
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Typography color="error">Error fetching data.</Typography>;
  }

  // Access the total count from the first page's data
  const totalCount = data?.pages?.[0]?.totalCount ?? 0;
  const allReports = data?.pages?.flatMap((page) => page.reports) || [];
  const reportsSeen = allReports.length;

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "90%",
      }}
    >
      <Box
        sx={{
          width: "100%",
        }}
      >
        <PageHeader
          title="Violations"
          totalCount={totalCount}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchKeyDown={handleSearchKeyDown}
          handleSearch={handleSearch}
        />

        <Box sx={{ position: "relative" }}>
          {isRefetching && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                zIndex: 10,
                borderRadius: "16px",
              }}
            >
              <CircularProgress />
            </Box>
          )}

          <TableContainer
            component={Paper}
            sx={{
              maxHeight: `calc(100vh - 350px)`,
              width: "100%",
              borderTopRightRadius: "16px",
              borderTopLeftRadius: "16px",
            }}
          >
            <Table
              stickyHeader
              sx={{
                minWidth: 650,
              }}
              aria-label="simple table"
            >
              <TableHead
                sx={{
                  backgroundColor: mainColor.tertiary,
                  borderTopLeftRadius: "16px",
                }}
              >
                <TableRow
                  sx={{
                    bgcolor: "tertiary.main",
                    boxShadow: 3,
                  }}
                >
                  <TableCell
                    sx={{
                      borderTopLeftRadius: "16px",
                    }}
                  >
                    #
                  </TableCell>
                  <TableCell>Tracking Number</TableCell>
                  <TableCell width="15%">Full Name</TableCell>
                  <TableCell>Plate Number</TableCell>
                  <TableCell>Violations</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell
                    sx={{
                      borderTopRightRadius: "16px",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No reports found.
                    </TableCell>
                  </TableRow>
                ) : (
                  allReports.map((report, index) => {
                    const isOpen = openMenuId === report.documentId;
                    return (
                      <TableRow key={report.documentId}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{report.trackingNumber || "N/A"}</TableCell>
                        <TableCell>{report.fullname}</TableCell>
                        <TableCell>{report.plateNumber}</TableCell>
                        <TableCell>{report.violations.join(", ")}</TableCell>
                        <TableCell>{FormatDate(report.createdAt)}</TableCell>
                        <TableCell>
                          <IconButton
                            ref={(el) => {
                              anchorRefs.current[report.documentId] = el;
                            }}
                            id={`composition-button-${report.documentId}`}
                            aria-controls={
                              isOpen
                                ? `composition-menu-${report.documentId}`
                                : undefined
                            }
                            aria-expanded={isOpen ? "true" : undefined}
                            aria-haspopup="true"
                            onClick={() => handleToggle(report.documentId)}
                          >
                            <MoreVert
                              sx={{
                                color: mainColor.tertiary,
                              }}
                            />
                          </IconButton>
                          <Popper
                            open={isOpen}
                            anchorEl={anchorRefs.current[report.documentId]}
                            role={undefined}
                            placement="bottom-start"
                            transition
                            disablePortal
                            style={{ zIndex: 1300 }}
                          >
                            {({ TransitionProps, placement }) => (
                              <Grow
                                {...TransitionProps}
                                style={{
                                  transformOrigin:
                                    placement === "bottom-start"
                                      ? "left top"
                                      : "left bottom",
                                }}
                              >
                                <Paper>
                                  <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList
                                      autoFocusItem={isOpen}
                                      id={`composition-menu-${report.documentId}`}
                                      aria-labelledby={`composition-button-${report.documentId}`}
                                      onKeyDown={handleListKeyDown}
                                      sx={{
                                        color: "secondary.main",
                                      }}
                                    >
                                      <MenuItem
                                        onClick={() =>
                                          handleOpenFullDetails(report)
                                        }
                                      >
                                        <Info
                                          sx={{
                                            color: "success.main",
                                          }}
                                        />
                                        <Typography
                                          variant="body2"
                                          sx={{ ml: 1 }}
                                        >
                                          Full Details
                                        </Typography>
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() =>
                                          handleMenuAction(
                                            "View Driver's Profile",
                                            report.documentId
                                          )
                                        }
                                      >
                                        <DriveEta
                                          sx={{
                                            color: mainColor.highlight,
                                          }}
                                        />

                                        <Typography
                                          variant="body2"
                                          sx={{ ml: 1 }}
                                        >
                                          View Driver's Profile
                                        </Typography>
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() =>
                                          handleDeleteReport(report)
                                        }
                                      >
                                        <Delete
                                          sx={{
                                            color: "error.main",
                                          }}
                                        />
                                        <Typography
                                          variant="body2"
                                          sx={{ ml: 1 }}
                                        >
                                          Delete
                                        </Typography>
                                      </MenuItem>
                                    </MenuList>
                                  </ClickAwayListener>
                                </Paper>
                              </Grow>
                            )}
                          </Popper>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            boxShadow: 3,
            padding: "16px",
            backgroundColor: "white",
            borderBottomLeftRadius: "16px",
            borderBottomRightRadius: "16px",
          }}
        >
          <Typography variant="body2" sx={{ mr: 5 }}>
            {`Showing ${reportsSeen} of ${totalCount} reports`}
          </Typography>
          <Button
            onClick={handleLoadMore}
            disabled={reportsSeen === totalCount || isFetchingNextPage}
            variant="outlined"
            endIcon={<ArrowForwardIos />}
            sx={{
              height: "30px",
            }}
          >
            {isFetchingNextPage ? "Loading..." : "See More..."}
          </Button>
        </Box>
      </Box>
      <FullDetailsDialog />
      <DeleteConfimationDialog />
    </Box>
  );
}
