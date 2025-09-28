import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  CheckCircle,
  Payment,
} from "@mui/icons-material";

const PaymentSuccessPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: `linear-gradient(135deg, ${theme.palette.success.light}20 0%, ${theme.palette.primary.light}20 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            margin: "auto",
            transform: "translateY(-5vh)",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, sm: 4, md: 6 },
              textAlign: "center",
            }}
          >
            {/* Success Icon */}
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: { xs: 80, sm: 100, md: 120 },
                  height: { xs: 80, sm: 100, md: 120 },
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": {
                      transform: "scale(1)",
                      boxShadow: `0 0 0 0 ${theme.palette.success.main}40`,
                    },
                    "70%": {
                      transform: "scale(1.05)",
                      boxShadow: `0 0 0 20px ${theme.palette.success.main}00`,
                    },
                    "100%": {
                      transform: "scale(1)",
                      boxShadow: `0 0 0 0 ${theme.palette.success.main}00`,
                    },
                  },
                }}
              >
                <CheckCircle
                  sx={{
                    fontSize: { xs: 40, sm: 50, md: 60 },
                    color: "white",
                  }}
                />
              </Box>
            </Box>

            {/* Title */}
            <Typography
              variant={isMobile ? "h4" : "h3"}
              fontWeight="bold"
              color="success.main"
              gutterBottom
              sx={{
                mb: 2,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Payment Successful!
            </Typography>

            {/* Subtitle */}
            <Typography
              variant={isMobile ? "h6" : "h5"}
              color="text.secondary"
              gutterBottom
              sx={{ mb: 3 }}
            >
              Your payment has been processed successfully
            </Typography>

            {/* Payment Icon with Message */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 4,
                p: 2,
                borderRadius: 2,
                backgroundColor: theme.palette.success.light + "20",
                border: `1px solid ${theme.palette.success.light}`,
              }}
            >
              <Payment color="success" />
              <Typography
                variant="body1"
                color="success.dark"
                fontWeight="medium"
              >
                Transaction completed securely
              </Typography>
            </Box>

            {/* Description */}
            <Typography
              variant="body1"  
              color="text.secondary"
              sx={{
                maxWidth: 500,
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Thank you for your payment! Your transaction has been completed
              successfully. You can now go back to the app!
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PaymentSuccessPage;
