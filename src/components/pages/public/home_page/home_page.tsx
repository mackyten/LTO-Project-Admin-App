import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { useDashboardState } from "./hooks";

// Import all extracted components
import OverviewCards from "./components/overview_cards";
import LatestViolations from "./components/latest_violations";
import LatestPayments from "./components/latest_payments";
import ViolationsByAddressChart from "./components/violations_by_address_chart";
import ViolationsPerMonthChart from "./components/violations_per_month_chart";
import PaidVsUnpaidChart from "./components/paid_vs_unpaid_chart";
import OverturnedViolations from "./components/overturned_violations";
import TodaysPayments from "./components/todays_payments";



// Main Dashboard Component
const HomePage: React.FC = () => {
  const { refetchAll, isLoading } = useDashboardState();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh sx={{ color: "primary.main" }} />}
          onClick={() => refetchAll()}
          disabled={isLoading}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Overview Cards - Requirements 1-4 */}
      <Box sx={{ mb: 4 }}>
        <OverviewCards />
      </Box>

      {/* Latest Activities - Requirements 5 & 6 */}
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 4 }}>
        <Box sx={{ flex: "1 1 500px", minWidth: "500px" }}>
          <LatestViolations />
        </Box>
        <Box sx={{ flex: "1 1 500px", minWidth: "500px" }}>
          <LatestPayments />
        </Box>
      </Box>

      {/* Charts - Requirements 7, 8, 9 */}
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 4 }}>
        <Box sx={{ flex: "1 1 400px", minWidth: "400px" }}>
          <ViolationsByAddressChart />
        </Box>
        <Box sx={{ flex: "1 1 400px", minWidth: "400px" }}>
          <ViolationsPerMonthChart />
        </Box>
        <Box sx={{ flex: "1 1 400px", minWidth: "400px" }}>
          <PaidVsUnpaidChart />
        </Box>
      </Box>

      {/* Special Reports - Requirements 10 & 11 */}
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        <Box sx={{ flex: "1 1 500px", minWidth: "500px" }}>
          <OverturnedViolations />
        </Box>
        <Box sx={{ flex: "1 1 500px", minWidth: "500px" }}>
          <TodaysPayments />
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
