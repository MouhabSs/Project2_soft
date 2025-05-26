import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
// Removed original react-icons
// import { FaTachometerAlt, FaUserInjured, FaCalendarAlt, FaAppleAlt, FaCog, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import "../styles/global.css"; // Keep global styles for now

// Import MUI components
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';

// Import MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';

const drawerWidth = 220; // Define drawer width

// Styled Drawer for custom styling if needed
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper, // Use theme background
    color: theme.palette.text.primary, // Use theme text color
    boxShadow: theme.shadows[3], // Use theme shadow
    borderRight: 'none', // Remove default border
  },
}));

function ProfileMenu() {
  // Use MUI Menu component
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleMenu} sx={{ p: 0 }} color="inherit">
          <Avatar alt="User Avatar" >
             <AccountCircle /> {/* Use MUI user icon */}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} component={Link} to="/settings">
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        {/* Add Logout MenuItem */}
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default function NavBar() {
  const theme = useTheme(); // Access the theme

  // Map your routes to list items
  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
    { text: 'Appointments', icon: <EventNoteIcon />, path: '/appointments' },
    { text: 'Nutrition Plan', icon: <RestaurantIcon />, path: '/nutrition-plan' },
    { text: 'Reports', icon: <DashboardIcon />, path: '/reports' }, // Using DashboardIcon for Reports for now
    // { text: 'Messages', icon: <MailIcon />, path: '/messages' }, // Uncomment if messages page is active
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline /> {/* Provides a baseline CSS reset */}
      <StyledDrawer
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ padding: theme.spacing(2), textAlign: 'center', marginBottom: theme.spacing(3) }}>
           <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: theme.spacing(1) }}>
             {/* Replace SVG with a simple text or MUI icon for the logo */}
              <Typography variant="h6" noWrap component="div" sx={{ color: theme.palette.text.primary, fontWeight: 700, letterSpacing: 1 }}>
                NutriClinic
              </Typography>
           </Link>
        </Box>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.path}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ marginTop: 'auto', padding: theme.spacing(2), textAlign: 'center' }}>
           <ProfileMenu />
        </Box>
      </StyledDrawer>
      {/* Content will be placed next to the drawer */}
       <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: `${drawerWidth}px`, // Add margin to content to not be covered by drawer
          width: `calc(100% - ${drawerWidth}px)`, // Adjust width
        }}
      >
        {/* Content of the specific page will be rendered here by react-router */}
      </Box>
    </Box>
  );
}