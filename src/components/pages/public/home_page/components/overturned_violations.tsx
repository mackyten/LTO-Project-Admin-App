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
  Chip,
} from "@mui/material";
import { Gavel } from "@mui/icons-material";
import { useRecentActivity } from "../hooks";
import { format } from "date-fns";
import { statusChipStyles } from "../../../../../utils/status_utils";

// Overturned Violations Component - Requirement 10
const OverturnedViolations: React.FC = () => {
  const { overturnedViolations, isLoading } = useRecentActivity();

  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent violations need to review
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
          <Gavel
            sx={{ mr: 1, verticalAlign: "middle", color: "warning.main" }}
          />
          Recent Violations Need to Review
        </Typography>
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ mt: 2, maxHeight: 300 }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Plate Number</TableCell>
                <TableCell>Driver Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {overturnedViolations.slice(0, 5).map((violation, index) => (
                <TableRow key={index} hover>
                  <TableCell>{violation.plateNumber}</TableCell>
                  <TableCell>{violation.fullname}</TableCell>
                  <TableCell>
                    {violation.createdAt
                      ? format(new Date(violation.createdAt), "MMM dd, yyyy")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Overturned"
                      size="small"
                      color="primary"
                      icon={<Gavel sx={{ color: "primary.main" }} />}
                      sx={statusChipStyles}
                    />
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

export default OverturnedViolations;
