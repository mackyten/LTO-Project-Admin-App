import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboardCharts } from "../hooks";

// Violations per Month Line Chart - Requirement 8
const ViolationsPerMonthChart: React.FC = () => {
  const { monthlyTrends, isLoading } = useDashboardCharts();

  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Violations per Month
          </Typography>
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.entries(monthlyTrends)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      violations: count,
    }));

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <TrendingUp
            sx={{ mr: 1, verticalAlign: "middle", color: "info.main" }}
          />
          Violations per Month
        </Typography>
        <Box sx={{ width: "100%", height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="violations"
                stroke="#1976d2"
                strokeWidth={2}
                dot={{ fill: "#1976d2" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ViolationsPerMonthChart;
