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

// Today's Payments Component - Requirement 11
const TodaysPayments: React.FC = () => {
  const { todaysPayments, isLoading } = useRecentActivity();

  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Drivers Who Paid Today
          </Typography>
          <Skeleton variant="rectangular" height={200} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <Payment
            sx={{ mr: 1, verticalAlign: "middle", color: "success.main" }}
          />
          Drivers Who Paid Today
        </Typography>
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ mt: 2, maxHeight: 200 }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Driver Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {todaysPayments.slice(0, 3).map((payment, index) => (
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
                    {format(new Date(payment.paidAt), "h:mm a")}
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

export default TodaysPayments;
