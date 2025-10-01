import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type React from "react";
import { TableStyleProps } from "../../../../shared/style_props/table";
import type { AppealsModel } from "../../../../../models/appeals_model";
import { FormatDate } from "../../../../../utils/date_formatter";

interface IDataTable {
  data: AppealsModel[];
}
export const DataTable: React.FC<IDataTable> = ({ data }) => {
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
            <TableCell>Violation Tracking No.</TableCell>
            <TableCell>Violator</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
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
                  <TableCell>{appeal.status}</TableCell>
                  <TableCell>{FormatDate(appeal.createdAt)}</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
