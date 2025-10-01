import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import type React from "react";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { TableStyleProps } from "../../../../shared/style_props/table";
import type { AppealsModel } from "../../../../../models/appeals_model";
import { FormatDate } from "../../../../../utils/date_formatter";
import { getStatusColor, statusChipStyles } from "../../../../../utils/status_utils";

interface IDataTable {
  data: AppealsModel[];
  onOpenAppeal: (appeal: AppealsModel) => void;
  onApproveAppeal: (appeal: AppealsModel) => void;
  onRejectAppeal: (appeal: AppealsModel) => void;
}
export const DataTable: React.FC<IDataTable> = ({
  data,
  onOpenAppeal,
  onApproveAppeal,
  onRejectAppeal,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAppeal, setSelectedAppeal] = useState<AppealsModel | null>(
    null
  );

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    appeal: AppealsModel
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppeal(appeal);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAppeal(null);
  };

  const handleOpen = () => {
    if (selectedAppeal) {
      onOpenAppeal(selectedAppeal);
    }
    handleMenuClose();
  };

  const handleApprove = () => {
    if (selectedAppeal) {
      onApproveAppeal(selectedAppeal);
    }
    handleMenuClose();
  };

  const handleReject = () => {
    if (selectedAppeal) {
      onRejectAppeal(selectedAppeal);
    }
    handleMenuClose();
  };

  return (
    <>
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
              <TableCell>Violation Tracking No.</TableCell>
              <TableCell>Violator</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No appeals found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((appeal, index) => {
                return (
                  <TableRow key={appeal.documentId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{appeal.violationTrackingNumber}</TableCell>
                    <TableCell>{appeal.violatorFullName}</TableCell>
                    <TableCell>
                      <Chip 
                        label={appeal.status}
                        color={getStatusColor(appeal.status)}
                        size="small"
                        sx={statusChipStyles}
                      />
                    </TableCell>
                    <TableCell>{FormatDate(appeal.createdAt)}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(event) => handleMenuClick(event, appeal)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleOpen}>
          <ListItemIcon>
            <OpenInNewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Open</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleApprove}
          disabled={
            selectedAppeal?.status === "Rejected" ||
            selectedAppeal?.status === "Approved"
          }
        >
          <ListItemIcon>
            <CheckIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Approve</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleReject}
          disabled={
            selectedAppeal?.status === "Approved" ||
            selectedAppeal?.status === "Rejected"
          }
        >
          <ListItemIcon>
            <CloseIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reject</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
