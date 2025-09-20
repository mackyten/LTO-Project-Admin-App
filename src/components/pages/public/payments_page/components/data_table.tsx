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
import type { PaymentModel } from "../../../../../models/payment_model";
import { FormatDate } from "../../../../../utils/date_formatter";

interface IDataTable {
  data: PaymentModel[];
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
            <TableCell align="center">Violation Tracking No.</TableCell>
            <TableCell>Violator</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="center">Payment Method</TableCell>
            <TableCell align="center">Reference No.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No payments found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((payment, index) => {
              return (
                <TableRow key={payment.documentId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell align="center">
                    {payment.violationTrackingNumber || "N/A"}
                  </TableCell>
                  <TableCell>{payment.violatorFullName || "N/A"}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{FormatDate(payment.createdAt)}</TableCell>
                  <TableCell align="center">
                    {payment.paymentMethod || "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {payment.referenceNumber || "N/A"}
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
