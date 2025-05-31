import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, Link } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  Avatar,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  Restaurant as RestaurantIcon,
  Assessment as AssessmentIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
} from "@mui/icons-material";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import PatientList from "./pages/PatientList";
import AddPatient from "./pages/AddPatient";
import PatientView from "./pages/PatientView";
import EditPatient from "./pages/EditPatient";
import Appointments from "./pages/Appointments";
import NutritionPlan from "./pages/NutritionPlan";
import Reports from "./pages/Reports";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import { useAuth } from "./auth/AuthProvider";
import Notifications from "./components/Notifications";
import SendMedicationRequestPage from "./pages/SendMedicationRequestPage";

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#23272f",
      paper: "#23272f",
    },
    text: {
      primary: "#e0eafc",
      secondary: "#b6c6e3",
    },
  },
  typography: {
    fontFamily: 'Inter, "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#23272f",
          color: "#e0eafc",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: '#4ea8de',
            color: '#fff',
            '& .MuiListItemIcon-root': {
              color: '#fff',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#4ea8de',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#e0eafc',
        },
      },
    },
  },
});

const menuItems = [
  { text: "Home", icon: <HomeIcon />, path: "/" },
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Patients", icon: <PeopleIcon />, path: "/patients" },
  { text: "Appointments", icon: <EventNoteIcon />, path: "/appointments" },
  { text: "Nutrition Plan", icon: <RestaurantIcon />, path: "/nutrition-plan" },
  { text: "Reports", icon: <AssessmentIcon />, path: "/reports" },
  { text: "Messages", icon: <MessageIcon />, path: "/messages" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  { text: "Send Med Request", icon: <MessageIcon />, path: "/send-medication-request" },
];

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ color: '#e0eafc', fontWeight: 700 }}>
            HealthCare
          </Typography>
        </Toolbar>
        <Divider sx={{ background: '#414345' }} />
        <List>
          {menuItems.map((item) => (
            <Tooltip title={item.text} placement="right" arrow key={item.text}>
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: '#4ea8de',
                    color: '#fff',
                  },
                  '&:hover': {
                    backgroundColor: '#414345',
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </div>
      <Box sx={{ p: 2, borderTop: '1px solid #414345', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: '#4ea8de', width: 40, height: 40 }}>U</Avatar>
        <Box>
          <Typography variant="body1" sx={{ color: '#e0eafc', fontWeight: 600 }}>
            User Name
          </Typography>
          <Typography variant="body2" sx={{ color: '#b6c6e3' }}>
            user@email.com
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#23272f',
          color: '#e0eafc',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
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
            {menuItems.find((item) => item.path === location.pathname)?.text || "HealthCare"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#23272f",
              color: "#e0eafc",
              borderRight: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: "64px",
          background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function App() {
  const easterEggAudioRef = useRef(null);
  const handleEasterEggClick = () => {
    if (easterEggAudioRef.current) {
      easterEggAudioRef.current.currentTime = 0;
      easterEggAudioRef.current.play();
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && (e.key === 'e' || e.key === 'E')) {
        if (easterEggAudioRef.current) {
          easterEggAudioRef.current.currentTime = 0;
          easterEggAudioRef.current.play();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Notifications />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <HomePage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <PrivateRoute>
                <Layout>
                  <PatientList />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/patients/add"
            element={
              <PrivateRoute>
                <Layout>
                  <AddPatient />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/patients/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <PatientView />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/patients/:id/edit"
            element={
              <PrivateRoute>
                <Layout>
                  <EditPatient />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <PrivateRoute>
                <Layout>
                  <Appointments />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/nutrition-plan"
            element={
              <PrivateRoute>
                <Layout>
                  <NutritionPlan />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Layout>
                  <Reports />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <Layout>
                  <Messages />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Layout>
                  <Settings />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/send-medication-request"
            element={
              <PrivateRoute>
                <Layout>
                  <SendMedicationRequestPage />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
  return (
    <>
      <audio ref={easterEggAudioRef} src={process.env.PUBLIC_URL + '/easter egg.ogg'} preload="auto" />
      {/* More visible clickable text for the easter egg */}
      <div style={{ position: 'fixed', bottom: 16, right: 24, opacity: 0.7, cursor: 'pointer', zIndex: 9999, background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 14px' }} onClick={handleEasterEggClick} title="Click for a surprise!">
        <span style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#1976d2', fontWeight: 600 }}>Nutrition is fun! 🎵</span>
      </div>
    </>
  );
}

export default App;