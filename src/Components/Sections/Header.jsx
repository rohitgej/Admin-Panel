import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { AppBar, Toolbar, Typography, IconButton, useMediaQuery, useTheme, Box, Badge, CircularProgress, Popover } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Profile from './Profile'; // Assuming you have a Profile component
import DOMAIN_NAME from '../../Config/Config';

const Header = ({ handleDrawerToggle, handleSidebarToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to manage the profile popover
  const [anchorEl, setAnchorEl] = useState(null);
  // Reference for the profile button
  const profileButtonRef = useRef(null);

  // Initialize the navigation hook
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${DOMAIN_NAME}api/getcheckout`, {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('API response:', result);

        if (result && Array.isArray(result.orders)) {
          const filteredOrders = result.orders.filter(order => order.delivery_status < 2);
          setOrderCount(filteredOrders.length);
        } else {
          console.error('Unexpected API response structure:', result);
        }
      } catch (error) {
        console.error('Error fetching order count:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderCount();
  }, []);

  // Toggle profile popover
  const handleProfileClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  // Close the popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Navigate to the orders page
  const handleNotificationClick = () => {
    navigate('/orders'); // Replace '/orders' with the route for your orders page
  };

  const open = Boolean(anchorEl);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#585ce4' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '70px' }}>
          <Typography variant="h6" noWrap>
            Company Name
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={isMobile ? handleDrawerToggle : handleSidebarToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <IconButton color="inherit" aria-label="notifications" onClick={handleNotificationClick}>
            {loading ? (
              <CircularProgress color="inherit" size={24} />
            ) : error ? (
              <Badge badgeContent="!" color="error">
                <NotificationsIcon />
              </Badge>
            ) : (
              <Badge badgeContent={orderCount} color="error">
                <NotificationsIcon />
              </Badge>
            )}
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="user profile"
            onClick={handleProfileClick}
            ref={profileButtonRef}
          >
            <AccountCircleIcon />
          </IconButton>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Profile />
          </Popover>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
