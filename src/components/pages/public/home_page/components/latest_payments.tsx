import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Payment } from "@mui/icons-material";
import { useRecentActivity } from "../hooks";
import { format } from "date-fns";

// Latest Payments Component - Requirement 6
const LatestPayments: React.FC = () => {
  const { latestPayments, isLoading } = useRecentActivity();

  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Latest Payments
          </Typography>
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <Payment
            sx={{ mr: 1, verticalAlign: "middle", color: "info.main" }}
          />
          Latest Payments (5)
        </Typography>
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ mt: 2, maxHeight: 300 }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Driver Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {latestPayments.slice(0, 5).map((payment, index) => (
                <TableRow key={index} hover>
                  <TableCell>{payment.violatorFullName}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="success.main"
                    >
                      ₱{payment.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {format(new Date(payment.paidAt), "MMM dd, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default LatestPayments;
