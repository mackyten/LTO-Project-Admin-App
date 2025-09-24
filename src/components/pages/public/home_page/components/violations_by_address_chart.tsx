import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboardCharts } from "../hooks";

// Violations by Address Bar Chart - Requirement 7
const ViolationsByAddressChart: React.FC = () => {
  const { violationsByLocation, isLoading } = useDashboardCharts();

  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Violations by Address
          </Typography>
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.entries(violationsByLocation)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([address, count]) => ({
      address: address.length > 20 ? address.substring(0, 20) + "..." : address,
      violations: count,
    }));

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <LocationOn sx={{ mr: 1, verticalAlign: "middle", color: "red" }} />
          Violations by Address
        </Typography>
        <Box sx={{ width: "100%", height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="address"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="violations" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ViolationsByAddressChart;
