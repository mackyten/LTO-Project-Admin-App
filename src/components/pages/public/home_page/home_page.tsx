import React from "react";
import { Box, Typography, Button, Container, Paper, alpha, Fade } from "@mui/material";
import { Refresh, Dashboard as DashboardIcon } from "@mui/icons-material";
import { useDashboardState } from "./hooks";
import { mainColor } from "../../../../themes/colors";

// Import all extracted components
import OverviewCards from "./components/overview_cards";
import LatestViolations from "./components/latest_violations";
import LatestPayments from "./components/latest_payments";
import ViolationsByAddressChart from "./components/violations_by_address_chart";
import ViolationsPerMonthChart from "./components/violations_per_month_chart";
import PaidVsUnpaidChart from "./components/paid_vs_unpaid_chart";
import ReportsWithAppeals from "./components/reports_with_appeals";
import TodaysPayments from "./components/todays_payments";
import SearchBar from "./components/search_bar";

// Main Dashboard Component
const HomePage: React.FC = () => {
  const { refetchAll, isLoading } = useDashboardState();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
    
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: 4 }}>
        <Fade in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              background: `linear-gradient(145deg, ${alpha(mainColor.background, 0.8)}, ${alpha(mainColor.background, 0.6)})`,
              backdropFilter: "blur(20px)",
              border: `1px solid ${alpha(mainColor.secondary, 0.1)}`,
              borderRadius: 4,
              p: 4,
              mb: 3,
            }}
          >
            {/* Enhanced Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
                pb: 3,
                borderBottom: `2px solid ${alpha(mainColor.secondary, 0.1)}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, ${mainColor.secondary}, ${mainColor.tertiary})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 8px 32px ${alpha(mainColor.secondary, 0.3)}`,
                  }}
                >
                  <DashboardIcon sx={{ fontSize: 24, color: "white" }} />
                </Box>
                <Box>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{
                      background: `linear-gradient(135deg, ${mainColor.primary}, ${mainColor.secondary})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Dashboard
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Monitor and manage LTO operations
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={() => refetchAll()}
                disabled={isLoading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  background: `linear-gradient(135deg, ${mainColor.secondary}, ${mainColor.primary})`,
                  boxShadow: `0 8px 24px ${alpha(mainColor.secondary, 0.3)}`,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${mainColor.primary}, ${mainColor.tertiary})`,
                    boxShadow: `0 12px 32px ${alpha(mainColor.secondary, 0.4)}`,
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {isLoading ? "Refreshing..." : "Refresh Data"}
              </Button>
            </Box>

            <SearchBar />
          </Paper>
        </Fade>

        {/* Overview Cards - Requirements 1-4 */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 4 }}>
            <OverviewCards />
          </Box>
        </Fade>

        {/* Latest Activities - Requirements 5 & 6 */}
        <Fade in timeout={1000}>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 4 }}>
            <Box sx={{ flex: "1 1 500px", minWidth: "500px" }}>
              <LatestViolations />
            </Box>
            <Box sx={{ flex: "1 1 500px", minWidth: "500px" }}>
              <LatestPayments />
            </Box>
          </Box>
        </Fade>

        {/* Charts - Requirements 7, 8, 9 */}
        <Fade in timeout={1200}>
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
        </Fade>

        {/* Special Reports - Requirements 10 & 11 */}
        <Fade in timeout={1400}>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <Box sx={{ flex: "1 1 500px", minWidth: "500px" }}>
              <ReportsWithAppeals />
            </Box>
            <Box sx={{ flex: "1 1 500px", minWidth: "500px" }}>
              <TodaysPayments />
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default HomePage;
