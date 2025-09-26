import {
  Avatar,
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
import { MoreVert, Person } from "@mui/icons-material";
import { useRef } from "react";
import { mainColor } from "../../../../../themes/colors";

import type { DriverModel } from "../../../../../models/driver_model";
import useDriversStore from "../store";

interface IDataTable {
  drivers: DriverModel[];
}
export const DataTable: React.FC<IDataTable> = ({ drivers }) => {
  const anchorRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const { openMenuId, setOpenMenuId, setSelectedDriver, setProfileModalOpen } =
    useDriversStore();

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

  const handleViewDriverProfile = (driver: DriverModel) => {
    setSelectedDriver(driver);
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

            <TableCell
              sx={{
                width: "300px",
              }}
              colSpan={2}
            >
              Full Name
            </TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Plate Number</TableCell>
            <TableCell sx={TableStyleProps.tableHeadRight} width={50}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {drivers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No driver found.
              </TableCell>
            </TableRow>
          ) : (
            drivers.map((driver, index) => {
              const isOpen = openMenuId === driver.documentId;
              return (
                <TableRow key={driver.documentId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ width: 50, paddingRight: 0 }}>
                    <Avatar
                      src={driver.profilePictureUrl}
                      alt={driver.lastName}
                      sx={{ width: "40px", height: "40px" }}
                    />
                  </TableCell>
                  <TableCell>
                    {driver.lastName}, {driver.firstName}
                  </TableCell>
                  <TableCell>{driver.email}</TableCell>
                  <TableCell>{driver.plateNumber || "N/A"}</TableCell>
                  <TableCell>
                    <IconButton
                      ref={(el) => {
                        if (driver.documentId) {
                          anchorRefs.current[driver.documentId] = el;
                        }
                      }}
                      id={`composition-button-${
                        driver.documentId || driver.uuid
                      }`}
                      aria-controls={
                        isOpen
                          ? `composition-menu-${
                              driver.documentId || driver.uuid
                            }`
                          : undefined
                      }
                      aria-expanded={isOpen ? "true" : undefined}
                      aria-haspopup="true"
                      onClick={() =>
                        handleToggle(driver.documentId || driver.uuid)
                      }
                    >
                      <MoreVert
                        sx={{
                          color: mainColor.tertiary,
                        }}
                      />
                    </IconButton>
                    <Popper
                      open={isOpen}
                      anchorEl={anchorRefs.current[driver.documentId ?? index]}
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
                                id={`composition-menu-${driver.documentId}`}
                                aria-labelledby={`composition-button-${driver.documentId}`}
                                onKeyDown={handleListKeyDown}
                                sx={{
                                  color: "secondary.main",
                                }}
                              >
                                <MenuItem
                                  onClick={() =>
                                    handleViewDriverProfile(driver)
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
