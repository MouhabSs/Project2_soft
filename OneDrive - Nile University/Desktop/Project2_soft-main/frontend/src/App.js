import React, { useState, useMemo } from "react";
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
  CircularProgress,
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ThemeToggle from './components/ThemeToggle';

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

const drawerWidth = 240;

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
      background: {
        default: isDarkMode ? "#23272f" : "#f5f5f5",
        paper: isDarkMode ? "#23272f" : "#ffffff",
      },
      text: {
        primary: isDarkMode ? "#e0eafc" : "#2c3e50",
        secondary: isDarkMode ? "#b6c6e3" : "#7f8c8d",
      },
    },
    typography: {
      fontFamily: 'Inter, "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDarkMode ? "#23272f" : "#ffffff",
            color: isDarkMode ? "#e0eafc" : "#2c3e50",
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            '&.Mui-selected, &.Mui-selected:hover': {
              backgroundColor: isDarkMode ? '#4ea8de' : '#1976d2',
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
            color: isDarkMode ? '#4ea8de' : '#1976d2',
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: isDarkMode ? '#e0eafc' : '#2c3e50',
          },
        },
      },
    },
  }), [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Notifications />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout theme={theme} toggleTheme={toggleTheme}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/patients" element={<PatientList />} />
                    <Route path="/patients/add" element={<AddPatient />} />
                    <Route path="/patients/:id" element={<PatientView />} />
                    <Route path="/patients/:id/edit" element={<EditPatient />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/nutrition-plan" element={<NutritionPlan />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

function Layout({ children, theme, toggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  const showSuccess = (message) => toast.success(message);
  const showError = (message) => toast.error(message);
  const showInfo = (message) => toast.info(message);

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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme.palette.mode === 'dark' ? "dark" : "light"}
      />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find((item) => item.path === location.pathname)?.text || "HealthCare"}
          </Typography>
          <ThemeToggle isDarkMode={theme.palette.mode === 'dark'} onToggle={toggleTheme} />
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
          position: 'relative',
        }}
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
            }}
          >
            <CircularProgress sx={{ color: '#4ea8de' }} />
          </Box>
        )}
        {children}
      </Box>
    </Box>
  );
}

const menuItems = [
  { text: "Home", icon: <HomeIcon />, path: "/" },
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Patients", icon: <PeopleIcon />, path: "/patients" },
  { text: "Appointments", icon: <EventNoteIcon />, path: "/appointments" },
  { text: "Nutrition Plan", icon: <RestaurantIcon />, path: "/nutrition-plan" },
  { text: "Reports", icon: <AssessmentIcon />, path: "/reports" },
  { text: "Messages", icon: <MessageIcon />, path: "/messages" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

export default App;