import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  alpha,
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import ProtectedRoute from "../../../router/protected_routes";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import {
  ArrowBackIos,
  ArrowForwardIos,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { sideDrawerItems } from "./components/types";
import { mainColor } from "../../../../themes/colors";
import { useLogout } from "../../auth/hooks";
import { useCurrentUser } from "./hooks";

const drawerWidth = 240;
const miniDrawerWidth = 60;

const ProtectedLayout: React.FC = () => {
  const theme = useTheme();
  const logout = useLogout();

  // Fetch and set current user
  const currentUser = useCurrentUser();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [desktopOpen, setDesktopOpen] = React.useState(true);
  const [isClosing, setIsClosing] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const handleNavigate = (route: string) => navigate(route);
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };
  const handleDrawerTransitionEnd = () => setIsClosing(false);
  const handleDrawerToggle = () => {
    if (!isClosing) setMobileOpen(!mobileOpen);
  };
  const handleLogout = () => {
    logout.mutate();
    handleClose();
  };

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar />
      <Divider />
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List>
          {sideDrawerItems
            .filter((x) => x.title !== "Account")
            .map((item) => {
              const isActive = location.pathname === item.route;
              return (
                <ListItem
                  id={item.title}
                  key={item.route}
                  disablePadding
                  sx={
                    isActive
                      ? {
                          border: "1px solid",
                          borderColor: "background.default",
                          borderRadius: "8px",
                          backgroundColor: alpha(
                            theme.palette.background.default,
                            0.1
                          ),
                        }
                      : {}
                  }
                >
                  <ListItemButton
                    onClick={() => handleNavigate(item.route)}
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
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      sx={{
                        opacity: desktopOpen || mobileOpen ? 1 : 0,
                        color: "background.default",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
        </List>
      </Box>

      <List>
        {sideDrawerItems
          .filter((x) => x.title === "Account")
          .map((item) => {
            const isActive = location.pathname === item.route;
            return (
              <ListItem
                id={item.title}
                key={item.route}
                disablePadding
                sx={
                  isActive
                    ? {
                        border: "1px solid",
                        borderColor: "background.default",
                        borderRadius: "8px",
                        backgroundColor: alpha(
                          theme.palette.background.default,
                          0.1
                        ),
                      }
                    : {}
                }
              >
                <ListItemButton
                  onClick={() => handleNavigate(item.route)}
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
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    sx={{
                      opacity: desktopOpen || mobileOpen ? 1 : 0,
                      color: "background.default",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>

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
              sx={{
                opacity: desktopOpen || mobileOpen ? 1 : 0,
                color: "background.default",
              }}
            />
          </ListItemButton>
        </ListItem>
      )}
    </Box>
  );

  return (
    <ProtectedRoute>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <AppBar
          position="fixed"
          sx={{
            bgcolor: mainColor.tertiary,
            width: {
              sm: `calc(100% - ${
                desktopOpen ? drawerWidth : miniDrawerWidth
              }px)`,
            },
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
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                visibility: "hidden",
              }}
            >
              Responsive drawer
            </Typography>
            <Box sx={{ flexGrow: 1 }} />

            <Avatar
              component="button"
              onClick={handleClick}
              src={currentUser?.data?.profilePictureUrl}
              alt={currentUser?.data?.lastName}
              sx={{
                padding: 0,
                margin: 0,
                // width: "40px",
                // height: "40px",
              }}
            />

            <Popover
              id={"account-popover"}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Box
                onClick={handleLogout}
                sx={{ display: "flex", alignItems: "center", p: 2 }}
              >
                <LogoutIcon sx={{ mr: 1 }} />
                <Typography>Logout</Typography>
              </Box>
            </Popover>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{
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
                backgroundColor: mainColor.tertiary,
              },
            }}
            slotProps={{ root: { keepMounted: true } }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            open
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: desktopOpen ? drawerWidth : miniDrawerWidth,
                backgroundColor: mainColor.tertiary,
                overflowX: "hidden",
                transition: (theme) =>
                  theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                  }),
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          sx={{
            px: { xs: "20px", sm: "50px" },
            py: "20px",
            width: {
              xs: "calc(99vw - 40px)",
              sm: `calc(100vw - ${
                desktopOpen ? drawerWidth : miniDrawerWidth
              }px - 130px)`,
            },
          }}
        >
          <Toolbar />

          <Outlet />
        </Box>

        {/* <Box
          component="main"
          sx={{
            border:"1px solid pink",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            width: {
              sm: `calc(100% - ${
                desktopOpen ? drawerWidth : miniDrawerWidth
              }px)`,
            },
          }}
        >
          <Toolbar />
          <Box
            sx={{
              width: {
                sm: `calc(100% - ${
                  desktopOpen ? drawerWidth : miniDrawerWidth
                }px)`,
              },
              transition: (theme) =>
                theme.transitions.create(["width", "margin"], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
            }}
          >
            <Outlet />
          </Box>
        </Box> */}
      </Box>
    </ProtectedRoute>
  );
};

export default ProtectedLayout;
