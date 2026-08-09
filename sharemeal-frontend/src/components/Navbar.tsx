import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const dashboardPath = user?.role === 'NGO' ? '/ngo-dashboard' : '/donor-dashboard';

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    setDrawerOpen(false);
    navigate('/');
  };

  const guestLinks = (
    <>
      <Button component={RouterLink} to="/login" color="inherit">
        Log in
      </Button>
      <Button component={RouterLink} to="/register" variant="contained" color="secondary">
        Register
      </Button>
    </>
  );

  const memberLinks = (
    <>
      <Button component={RouterLink} to={dashboardPath} color="inherit">
        Dashboard
      </Button>
      <Button component={RouterLink} to="/foods" color="inherit">
        Browse food
      </Button>
      <Button component={RouterLink} to="/ranking" color="inherit">
        Ranking
      </Button>
      <Button component={RouterLink} to="/notifications" color="inherit">
        Notifications
      </Button>
    </>
  );

  return (
    <AppBar position="sticky" color="default" elevation={0} className="navbar">
      <Toolbar className="navbar-toolbar page-container">
        <Box component={RouterLink} to="/" className="navbar-brand">
          <VolunteerActivismIcon className="navbar-brand-icon" />
          <Typography variant="h6" component="span" className="navbar-brand-text">
            ShareMeal
          </Typography>
        </Box>

        <Box className="navbar-links navbar-links--desktop">
          {isAuthenticated ? memberLinks : guestLinks}
        </Box>

        {isAuthenticated && user && (
          <Box className="navbar-links--desktop">
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} className="navbar-avatar-btn">
              <Avatar className="navbar-avatar">{user.fullName?.[0]?.toUpperCase() ?? 'U'}</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem disabled className="navbar-menu-info">
                <Box>
                  <Typography variant="subtitle2">{user.fullName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.role}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </Menu>
          </Box>
        )}

        <IconButton
          className="navbar-menu-toggle"
          edge="end"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box className="navbar-drawer" role="presentation">
          {isAuthenticated && user && (
            <>
              <Box className="navbar-drawer-user">
                <Avatar className="navbar-avatar">{user.fullName?.[0]?.toUpperCase() ?? 'U'}</Avatar>
                <Box>
                  <Typography variant="subtitle2">{user.fullName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.role}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </>
          )}
          <List>
            <ListItemButton component={RouterLink} to="/" onClick={() => setDrawerOpen(false)}>
              <ListItemText primary="Home" />
            </ListItemButton>

            {isAuthenticated ? (
              <>
                <ListItemButton
                  component={RouterLink}
                  to={dashboardPath}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton
                  component={RouterLink}
                  to="/foods"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary="Browse food" />
                </ListItemButton>
                <ListItemButton
                  component={RouterLink}
                  to="/ranking"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary="Ranking" />
                </ListItemButton>
                <ListItemButton
                  component={RouterLink}
                  to="/notifications"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary="Notifications" />
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Log out" />
                </ListItemButton>
              </>
            ) : (
              <>
                <ListItemButton
                  component={RouterLink}
                  to="/login"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary="Log in" />
                </ListItemButton>
                <ListItemButton
                  component={RouterLink}
                  to="/register"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary="Register" />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
