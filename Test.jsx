// src/components/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Divider,
  Box,
  Collapse,
  ListItemButton
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';

const drawerWidth = 240;
const collapsedWidth = 60;

const Sidebar = ({ mobileOpen, isSidebarCollapsed, handleDrawerToggle }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const drawerContent = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItemButton 
          component={Link} 
          to="/" 
          onClick={handleDrawerToggle}
          sx={{ 
            position: 'relative',
            '&.Mui-selected': {
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                width: '4px',
                height: '100%',
                backgroundColor: '#585ce4',
              },
            },
            '&:hover': {
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                width: '4px',
                height: '100%',
                backgroundColor: '#585ce4',
              },
            },
            pl: isSidebarCollapsed ? '8px' : '16px',
          }}
        >
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <Collapse in={!isSidebarCollapsed}>
            <ListItemText primary="Home" />
          </Collapse>
        </ListItemButton>
        <ListItemButton 
          component={Link} 
          to="/analytics" 
          onClick={handleDrawerToggle}
          sx={{ 
            position: 'relative',
            '&.Mui-selected': {
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                width: '4px',
                height: '100%',
                backgroundColor: '#585ce4',
              },
            },
            '&:hover': {
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                width: '4px',
                height: '100%',
                backgroundColor: '#585ce4',
              },
            },
            pl: isSidebarCollapsed ? '8px' : '16px',
          }}
        >
          <ListItemIcon><BarChartIcon /></ListItemIcon>
          <Collapse in={!isSidebarCollapsed}>
            <ListItemText primary="Analytics" />
          </Collapse>
        </ListItemButton>
        <ListItemButton 
          component={Link} 
          to="/reports" 
          onClick={handleDrawerToggle}
          sx={{ 
            position: 'relative',
            '&.Mui-selected': {
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                width: '4px',
                height: '100%',
                backgroundColor: '#585ce4',
              },
            },
            '&:hover': {
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                width: '4px',
                height: '100%',
                backgroundColor: '#585ce4',
              },
            },
            pl: isSidebarCollapsed ? '8px' : '16px',
          }}
        >
          <ListItemIcon><BarChartIcon /></ListItemIcon>
          <Collapse in={!isSidebarCollapsed}>
            <ListItemText primary="Reports" />
          </Collapse>
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Box component="nav" sx={{ width: { sm: isSidebarCollapsed ? collapsedWidth : drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: isSidebarCollapsed ? collapsedWidth : drawerWidth } }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: isSidebarCollapsed ? collapsedWidth : drawerWidth } }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
    