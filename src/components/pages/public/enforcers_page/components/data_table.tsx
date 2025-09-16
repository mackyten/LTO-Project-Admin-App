import {
  ClickAwayListener,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type React from "react";
import { TableStyleProps } from "../../../../shared/style_props/table";
import { Delete, DriveEta, MoreVert, Person } from "@mui/icons-material";
import { useRef } from "react";
import { mainColor } from "../../../../../themes/colors";
import useEnforcersStore from "../store";
import type { EnforcerModel } from "../../../../../models/enforcer_model";

interface IDataTable {
  enforcers: EnforcerModel[];
}
export const DataTable: React.FC<IDataTable> = ({ enforcers }) => {
  const anchorRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const {
    openMenuId,
    setOpenMenuId,
    setDeleteConfirmationDialog,
    setSelectedEnforcer,
    setProfileModalOpen,
  } = useEnforcersStore();

  const handleToggle = (reportId: string) => {
    setOpenMenuId(openMenuId === reportId ? null : reportId);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenMenuId(null);
    } else if (event.key === "Escape") {
      setOpenMenuId(null);
    }
  }

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      openMenuId &&
      anchorRefs.current[openMenuId]?.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpenMenuId(null);
  };

  const handleDeleteReport = (enforcer: EnforcerModel) => {
    setSelectedEnforcer(enforcer);
    setDeleteConfirmationDialog(true);
  };

  const handleViewEnforcerProfile = (enforcer: EnforcerModel) => {
    setSelectedEnforcer(enforcer);
    setProfileModalOpen(true);
  };
  return (
    <TableContainer component={Paper} sx={TableStyleProps.container}>
      <Table
        stickyHeader
        sx={{
          minWidth: 650,
        }}
        aria-label="simple table"
      >
        <TableHead sx={TableStyleProps.tableHead}>
          <TableRow sx={TableStyleProps.tableRow}>
            <TableCell sx={TableStyleProps.tableHeadLeft}>#</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell sx={TableStyleProps.tableHeadRight}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {enforcers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No reports found.
              </TableCell>
            </TableRow>
          ) : (
            enforcers.map((enforcer, index) => {
              const isOpen = openMenuId === enforcer.documentId;
              return (
                <TableRow key={enforcer.documentId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{enforcer.enforcerIdNumber || "N/A"}</TableCell>
                  <TableCell>
                    {enforcer.lastName}, {enforcer.firstName}
                  </TableCell>
                  <TableCell>{enforcer.email}</TableCell>
                  <TableCell>
                    <IconButton
                      ref={(el) => {
                        anchorRefs.current[enforcer.documentId] = el;
                      }}
                      id={`composition-button-${enforcer.documentId}`}
                      aria-controls={
                        isOpen
                          ? `composition-menu-${enforcer.documentId}`
                          : undefined
                      }
                      aria-expanded={isOpen ? "true" : undefined}
                      aria-haspopup="true"
                      onClick={() => handleToggle(enforcer.documentId)}
                    >
                      <MoreVert
                        sx={{
                          color: mainColor.tertiary,
                        }}
                      />
                    </IconButton>
                    <Popper
                      open={isOpen}
                      anchorEl={
                        anchorRefs.current[enforcer.documentId ?? index]
                      }
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
                                id={`composition-menu-${enforcer.documentId}`}
                                aria-labelledby={`composition-button-${enforcer.documentId}`}
                                onKeyDown={handleListKeyDown}
                                sx={{
                                  color: "secondary.main",
                                }}
                              >
                                <MenuItem
                                  onClick={() =>
                                    handleViewEnforcerProfile(enforcer)
                                  }
                                >
                                  <Person
                                    sx={{
                                      color: mainColor.highlight,
                                    }}
                                  />

                                  <Typography variant="body2" sx={{ ml: 1 }}>
                                    View Profile
                                  </Typography>
                                </MenuItem>

                                <MenuItem
                                  onClick={() => handleDeleteReport(enforcer)}
                                >
                                  <Delete
                                    sx={{
                                      color: "error.main",
                                    }}
                                  />
                                  <Typography variant="body2" sx={{ ml: 1 }}>
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
  );
};
