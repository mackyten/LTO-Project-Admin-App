import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import { Assessment } from "@mui/icons-material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useRealTimeDashboard } from "../hooks";

// Paid vs Unpaid Pie Chart - Requirement 9
const PaidVsUnpaidChart: React.FC = () => {
  const { totalPaidFines, totalUnpaidFines, isLoading } =
    useRealTimeDashboard();

  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Paid vs. Unpaid Fines
          </Typography>
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    );
  }

  const data = [
    { name: "Paid", value: totalPaidFines, fill: "#4caf50" },
    { name: "Unpaid", value: totalUnpaidFines, fill: "#f44336" },
  ];

  const COLORS = ["#4caf50", "#f44336"];

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <Assessment
            sx={{ mr: 1, verticalAlign: "middle", color: "success.main" }}
          />
          Paid vs. Unpaid Fines
        </Typography>
        <Box sx={{ width: "100%", height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaidVsUnpaidChart;
