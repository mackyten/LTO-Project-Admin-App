import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Skeleton,
} from "@mui/material";
import {
  Warning,
  Assessment,
  CheckCircle,
  AccessTime,
} from "@mui/icons-material";
import { useRealTimeDashboard } from "../hooks";

// Overview Cards Component - Requirements 1-4
const OverviewCards: React.FC = () => {
  const {
    totalViolationsToday,
    totalViolationsThisMonth,
    totalPaidFines,
    totalUnpaidFines,
    isLoading,
    isError,
  } = useRealTimeDashboard();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Box key={index} sx={{ flex: "1 1 200px", minWidth: "200px" }}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" height={40} />
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Failed to load overview data. Please try refreshing the page.
      </Alert>
    );
  }

  const cards = [
    {
      title: "Total Violations Today",
      value: totalViolationsToday,
      icon: (
        <Warning
          sx={{
            color: "warning.main",
          }}
        />
      ),
      color: "warning.main",
    },
    {
      title: "Total Violations This Month",
      value: totalViolationsThisMonth,
      icon: (
        <Assessment
          sx={{
            color: "info.main",
          }}
        />
      ),
      color: "info.main",
    },
    {
      title: "Total Paid Fines",
      value: totalPaidFines,
      icon: (
        <CheckCircle
          sx={{
            color: "success.main",
          }}
        />
      ),
      color: "success.main",
    },
    {
      title: "Total Unpaid Fines",
      value: totalUnpaidFines,
      icon: (
        <AccessTime
          sx={{
            color: "error.main",
          }}
        />
      ),
      color: "error.main",
    },
  ];

  return (
    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      {cards.map((card, index) => (
        <Box key={index} sx={{ flex: "1 1 200px", minWidth: "200px" }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{
              height: "71%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "start",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    mt: 0.5,
                  }}
                >
                  {card.icon}
                </Box>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ ml: 1, mt: 0.5, color: card.color, textAlign: "start" }}
                >
                  {card.title}
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" textAlign="center">
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default OverviewCards;
