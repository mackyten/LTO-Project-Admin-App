import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  alpha,
  AppBar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import ProtectedRoute from "../../../router/protected_routes";
import MenuIcon from "@mui/icons-material/Menu";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import Drawer from "@mui/material/Drawer";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { sideDrawerItems } from "./components/types";

const drawerWidth = 240;
const miniDrawerWidth = 60;

const ProtectedLayout: React.FC = () => {
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [desktopOpen, setDesktopOpen] = React.useState(true);
  const [isClosing, setIsClosing] = React.useState(false);

  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Toolbar />
      <Divider />

      {/* This Box will grow and push the button down */}
      <Box sx={{ flexGrow: 1 }}>
        <List>
          {sideDrawerItems
            .filter(
              (x) => x.title !== "Administrators" && x.title !== "Account"
            )
            .map((item, index) => {
              const isActive = location.pathname === item.route;
              return (
                <ListItem
                  key={item.route}
                  disablePadding
                  sx={
                    isActive
                      ? {
                          border: "1px solid",
                          borderColor: "text.primary",
                          borderRadius: "8px",
                          backgroundColor: alpha(
                            theme.palette.text.primary,
                            0.1
                          ),
                        }
                      : {}
                  }
                >
                  <ListItemButton
                    onClick={() => {
                      handleNavigate(item.route);
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: desktopOpen ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: desktopOpen ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {index % 2 === 0 ? <InboxIcon /> : <AccessAlarmIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      sx={{ opacity: desktopOpen ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
        </List>
        <Divider />
        <List>
          {sideDrawerItems
            .filter(
              (x) => x.title === "Administrators" || x.title === "Account"
            )
            .map((item, index) => {
              const isActive = location.pathname === item.route;
              return (
                <ListItem
                  key={item.route}
                  disablePadding
                  sx={
                    isActive
                      ? {
                          border: "1px solid",
                          borderColor: "text.primary",
                          borderRadius: "8px",
                          backgroundColor: alpha(
                            theme.palette.text.primary,
                            0.1
                          ),
                        }
                      : {}
                  }
                >
                  <ListItemButton
                    onClick={() => {
                      handleNavigate(item.route);
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: desktopOpen ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: desktopOpen ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {index % 2 === 0 ? <InboxIcon /> : <AccessAlarmIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      sx={{ opacity: desktopOpen ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
        </List>
      </Box>

      {/* This ListItem will stay at the bottom of the flex container */}
      {!mobileOpen && (
        <ListItem disablePadding sx={{ mt: "auto" }}>
          <ListItemButton
            onClick={() => setDesktopOpen(!desktopOpen)}
            sx={{
              minHeight: 48,
              justifyContent: desktopOpen ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: desktopOpen ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              {desktopOpen ? (
                <ArrowBackIos sx={{ fontSize: 20 }} />
              ) : (
                <ArrowForwardIos sx={{ fontSize: 20 }} />
              )}
            </ListItemIcon>
            <ListItemText
              primary="Minimize Drawer"
              sx={{ opacity: desktopOpen ? 1 : 0 }}
            />
          </ListItemButton>
        </ListItem>
      )}
    </Box>
  );

  return (
    <ProtectedRoute>
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{
            // Correct conditional width
            width: {
              sm: `calc(100% - ${
                desktopOpen ? drawerWidth : miniDrawerWidth
              }px)`,
            },
            // Correct conditional margin-left
            ml: { sm: `${desktopOpen ? drawerWidth : miniDrawerWidth}px` },
            transition: (theme) =>
              theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Responsive drawer
            </Typography>{" "}
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{
            // Correct conditional width
            width: { sm: desktopOpen ? drawerWidth : miniDrawerWidth },
            flexShrink: { sm: 0 },
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }}
          aria-label="mailbox folders"
        >
          {/* Temporary Drawer (for mobile) */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                backgroundColor: "secondary.main",
              },
            }}
            slotProps={{
              root: {
                keepMounted: true,
              },
            }}
          >
            {drawer}
          </Drawer>
          {/* Permanent Drawer (for desktop) */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              // Correct conditional width for the paper
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: desktopOpen ? drawerWidth : miniDrawerWidth,
                backgroundColor: "secondary.main",
                overflowX: "hidden",
                transition: (theme) =>
                  theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                  }),
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            // Correct conditional width
            width: {
              sm: `calc(100% - ${
                desktopOpen ? drawerWidth : miniDrawerWidth
              }px)`,
            },
            // This ml is not needed if you have ml on AppBar, but it can be useful for padding
            ml: { sm: `${desktopOpen ? drawerWidth : miniDrawerWidth}px` },
            transition: (theme) =>
              theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default ProtectedLayout;
