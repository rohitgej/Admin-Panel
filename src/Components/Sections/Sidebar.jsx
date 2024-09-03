import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Divider,
  Box,
  Collapse,
  ListItemButton,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
const drawerWidth = 240;
const collapsedWidth = 60;

const Sidebar = ({ mobileOpen, isSidebarCollapsed, handleDrawerToggle }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [open, setOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  
  const handleClick = () => {
    setOpen(!open);
  };

  const drawerContent = (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flexGrow: 1 }}>
        <Toolbar />
        <Divider />
        <List>
          <ListItemButton
            component={Link}
            to="/"
            onClick={handleDrawerToggle}
            sx={{
              position: "relative",
              pl: "16px",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                width: "4px",
                height: "100%",
                backgroundColor:
                  currentPath === "/" ? "#585ce4" : "transparent",
                transition: "background-color 0.3s ease",
              },
              "&:hover::before": {
                backgroundColor:
                  currentPath === "/" ? "#585ce4" : "rgba(88, 92, 228, 0.5)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <HomeOutlinedIcon />
            </ListItemIcon>
            <Collapse in={!isSidebarCollapsed}>
              <ListItemText primary="Dashboard" />
            </Collapse>
          </ListItemButton>
          <ListItemButton
            onClick={handleClick}
            sx={{
              position: "relative",
              pl: "16px",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                width: "4px",
                height: "100%",
                backgroundColor: currentPath.startsWith("/add-inventory")
                  ? "#585ce4"
                  : "transparent",
                transition: "background-color 0.3s ease",
              },
              "&:hover::before": {
                backgroundColor: currentPath.startsWith("/add-inventory")
                  ? "#585ce4"
                  : "rgba(88, 92, 228, 0.5)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <ShoppingCartOutlinedIcon />
            </ListItemIcon>
            <Collapse in={!isSidebarCollapsed || open}>
              <ListItemText primary="All Inventory" />
            </Collapse>
            {open ? (
              <ExpandLessIcon sx={{ color: "inherit", ml: "auto" }} />
            ) : (
              <ExpandMoreIcon sx={{ color: "inherit", ml: "auto" }} />
            )}
          </ListItemButton>
          <Collapse in={!isSidebarCollapsed && open}>
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/AddLaundry"
                sx={{
                  position: "relative",
                  pl: isSidebarCollapsed ? "8px" : "32px",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "4px",
                    height: "100%",
                    backgroundColor:
                      currentPath === "/AddLaundry"
                        ? "#585ce4"
                        : "transparent",
                    transition: "background-color 0.3s ease",
                  },
                  "&:hover::before": {
                    backgroundColor:
                      currentPath === "/AddLaundry"
                        ? "#585ce4"
                        : "rgba(88, 92, 228, 0.5)",
                  },
                }}
              >
                <ListItemText primary="Laundry" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/AddCategories"
                sx={{
                  position: "relative",
                  pl: isSidebarCollapsed ? "8px" : "32px",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "4px",
                    height: "100%",
                    backgroundColor:
                      currentPath === "/AddCategories"
                        ? "#585ce4"
                        : "transparent",
                    transition: "background-color 0.3s ease",
                  },
                  "&:hover::before": {
                    backgroundColor:
                      currentPath === "/AddCategories"
                        ? "#585ce4"
                        : "rgba(88, 92, 228, 0.5)",
                  },
                }}
              >
                <ListItemText primary="Categories" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/AddItems"
                sx={{
                  position: "relative",
                  pl: isSidebarCollapsed ? "8px" : "32px",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "4px",
                    height: "100%",
                    backgroundColor:
                      currentPath === "/AddItems"
                        ? "#585ce4"
                        : "transparent",
                    transition: "background-color 0.3s ease",
                  },
                  "&:hover::before": {
                    backgroundColor:
                      currentPath === "/AddItems"
                        ? "#585ce4"
                        : "rgba(88, 92, 228, 0.5)",
                  },
                }}
              >
                <ListItemText primary="Items" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            component={Link}
            to="/Orders"
            onClick={handleDrawerToggle}
            sx={{
              position: "relative",
              pl: "16px",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                width: "4px",
                height: "100%",
                backgroundColor:
                  currentPath === "/Orders" ? "#585ce4" : "transparent",
                transition: "background-color 0.3s ease",
              },
              "&:hover::before": {
                backgroundColor:
                  currentPath === "/Orders"
                    ? "#585ce4"
                    : "rgba(88, 92, 228, 0.5)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <ShoppingBagOutlinedIcon />
            </ListItemIcon>
            <Collapse in={!isSidebarCollapsed}>
              <ListItemText primary="Orders" />
            </Collapse>
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/Customers"
            onClick={handleDrawerToggle}
            sx={{
              position: "relative",
              pl: "16px",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                width: "4px",
                height: "100%",
                backgroundColor:
                  currentPath === "/Customers" ? "#585ce4" : "transparent",
                transition: "background-color 0.3s ease",
              },
              "&:hover::before": {
                backgroundColor:
                  currentPath === "/Customers"
                    ? "#585ce4"
                    : "rgba(88, 92, 228, 0.5)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <PersonOutlineOutlinedIcon />
            </ListItemIcon>
            <Collapse in={!isSidebarCollapsed}>
              <ListItemText primary="Customers" />
            </Collapse>
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/DeliveryPartner"
            onClick={handleDrawerToggle}
            sx={{
              position: "relative",
              pl: "16px",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                width: "4px",
                height: "100%",
                backgroundColor:
                  currentPath === "/DeliveryPartner"
                    ? "#585ce4"
                    : "transparent",
                transition: "background-color 0.3s ease",
              },
              "&:hover::before": {
                backgroundColor:
                  currentPath === "/DeliveryPartner"
                    ? "#585ce4"
                    : "rgba(88, 92, 228, 0.5)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <LocalShippingOutlinedIcon />
            </ListItemIcon>
            <Collapse in={!isSidebarCollapsed}>
              <ListItemText primary="Delivery Partner" />
            </Collapse>
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/TimeSlot"
            onClick={handleDrawerToggle}
            sx={{
              position: "relative",
              pl: "16px",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                width: "4px",
                height: "100%",
                backgroundColor:
                  currentPath === "/TimeSlot" ? "#585ce4" : "transparent",
                transition: "background-color 0.3s ease",
              },
              "&:hover::before": {
                backgroundColor:
                  currentPath === "/TimeSlot"
                    ? "#585ce4"
                    : "rgba(88, 92, 228, 0.5)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <AccessTimeIcon />
            </ListItemIcon>
            <Collapse in={!isSidebarCollapsed}>
              <ListItemText primary="Time Sloting" />
            </Collapse>
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/complain"
            onClick={handleDrawerToggle}
            sx={{
              position: "relative",
              pl: "16px",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                width: "4px",
                height: "100%",
                backgroundColor:
                  currentPath === "/complain" ? "#585ce4" : "transparent",
                transition: "background-color 0.3s ease",
              },
              "&:hover::before": {
                backgroundColor:
                  currentPath === "/complain"
                    ? "#585ce4"
                    : "rgba(88, 92, 228, 0.5)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <FactCheckOutlinedIcon/>
            </ListItemIcon>
            <Collapse in={!isSidebarCollapsed}>
              <ListItemText primary="Complain" />
            </Collapse>
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/SendNotification"
            onClick={handleDrawerToggle}
            sx={{
              position: "relative",
              pl: "16px",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                width: "4px",
                height: "100%",
                backgroundColor:
                  currentPath === "/SendNotification" ? "#585ce4" : "transparent",
                transition: "background-color 0.3s ease",
              },
              "&:hover::before": {
                backgroundColor:
                  currentPath === "/SendNotification"
                    ? "#585ce4"
                    : "rgba(88, 92, 228, 0.5)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <EmailOutlinedIcon />
            </ListItemIcon>
            <Collapse in={!isSidebarCollapsed}>
              <ListItemText primary="Send Notification" />
            </Collapse>
          </ListItemButton>
        
        </List>
      </div>
      <div>
        <List>
          <ListItemButton
          
            component={Link}
            to="/Login"
            onClick={handleLogout}
            sx={{
              position: "relative",
              pl: "16px",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                width: "4px",
                height: "100%",
                backgroundColor:
                  currentPath === "/logout" ? "#585ce4" : "transparent",
                transition: "background-color 0.3s ease",
              },
              "&:hover::before": {
                backgroundColor:
                  currentPath === "/logout"
                    ? "#585ce4"
                    : "rgba(88, 92, 228, 0.5)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <Collapse in={!isSidebarCollapsed}>
              <ListItemText primary="Logout" />
            </Collapse>
          </ListItemButton>
        </List>
      </div>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: isSidebarCollapsed ? collapsedWidth : drawerWidth },
        flexShrink: { sm: 0 },
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: isSidebarCollapsed ? collapsedWidth : drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: isSidebarCollapsed ? collapsedWidth : drawerWidth,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
