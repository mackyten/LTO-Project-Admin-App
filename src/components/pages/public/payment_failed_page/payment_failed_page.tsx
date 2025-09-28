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
  ErrorOutline,
  Payment,
} from "@mui/icons-material";

const PaymentFailedPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: `linear-gradient(135deg, ${theme.palette.error.light}20 0%, ${theme.palette.warning.light}20 100%)`,
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
            {/* Error Icon */}
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
                  background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "shake 2s infinite",
                  "@keyframes shake": {
                    "0%, 100%": {
                      transform: "translateX(0)",
                    },
                    "10%, 30%, 50%, 70%, 90%": {
                      transform: "translateX(-2px)",
                    },
                    "20%, 40%, 60%, 80%": {
                      transform: "translateX(2px)",
                    },
                  },
                }}
              >
                <ErrorOutline
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
              color="error.main"
              gutterBottom
              sx={{
                mb: 2,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Payment Failed!
            </Typography>

            {/* Subtitle */}
            <Typography
              variant={isMobile ? "h6" : "h5"}
              color="text.secondary"
              gutterBottom
              sx={{ mb: 3 }}
            >
              We couldn't process your payment
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
                backgroundColor: theme.palette.error.light + "20",
                border: `1px solid ${theme.palette.error.light}`,
              }}
            >
              <Payment color="error" />
              <Typography
                variant="body1"
                color="error.dark"
                fontWeight="medium"
              >
                Transaction could not be completed
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
              Unfortunately, your payment could not be processed. Please try again or contact support if the problem persists.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PaymentFailedPage;
