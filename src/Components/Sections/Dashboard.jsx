// src/components/Dashboard.js
import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom'; // Import Outlet from react-router-dom
import Sidebar from './Sidebar';
import Header from './Header';

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Box sx={{ display: 'flex', height: "100%", backgroundColor: "#f3f5f7" }}>
      <CssBaseline />
      <Header handleDrawerToggle={handleDrawerToggle} handleSidebarToggle={handleSidebarToggle} />
      <Sidebar mobileOpen={mobileOpen} isSidebarCollapsed={isSidebarCollapsed} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${isSidebarCollapsed ? 60 : 240}px)` } }}
      >
        <Toolbar />
        {/* Replace {children} with Outlet for nested routing */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
