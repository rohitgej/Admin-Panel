import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Paper,
  CircularProgress,
  TextField,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoneIcon from '@mui/icons-material/Done';
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import DOMAIN_NAME from "../../Config/Config";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const adminId = localStorage.getItem("adminId");

        if (!adminId) {
          throw new Error("Admin ID not found in local storage.");
        }

        const response = await fetch(`${DOMAIN_NAME}api/view_adminprofile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ _id: adminId }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProfile(data);
        setUsername(data.username);
        setEmail(data.email_id);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleSaveClick = async () => {
    try {
      const adminId = localStorage.getItem("adminId");
      const token = localStorage.getItem("token");

      if (!adminId) {
        throw new Error("Admin ID not found in local storage.");
      }

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = JSON.stringify({
        _id: adminId,
        username,
        email: email,
      });

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(`${DOMAIN_NAME}api/update_admin`, requestOptions);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.text();
      console.log(result);
      setProfile({ ...profile, username, email });
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "40vh",
        width: "400px",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">Error loading profile: {error}</Typography>
      ) : profile ? (
        <Paper
          elevation={3}
          sx={{
            padding: "24px",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: "16px" }}>
            <Avatar
              src="/path/to/default-avatar.jpg"
              alt={profile.username}
              sx={{
                width: 100,
                height: 100,
                mr: "16px",
                border: "4px solid #585ce4",
              }}
            />
            <Box sx={{ flexGrow: 1 }}>
              {editMode ? (
                <>
                  <TextField
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    label="Username"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: "8px" }}
                  />
                  <TextField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: "8px" }}
                  />
                </>
              ) : (
                <>
                  <Typography variant="h5" component="div">
                    {profile.username}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {profile.email_id}
                  </Typography>
                </>
              )}
            </Box>
            <IconButton
              sx={{ color: "#585ce4" }}
              aria-label={editMode ? "save profile" : "edit profile"}
              size="large"
              onClick={editMode ? handleSaveClick : handleEditClick}
            >
              {editMode ? <DoneIcon/> : <EditOutlinedIcon />}
            </IconButton>
          </Box>

          <Divider sx={{ mb: "16px" }} />
          <List>
            <ListItem>
              <ListItemIcon sx={{ color: "#585ce4" }}>
                <EmailOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Email" secondary={profile.email_id} />
            </ListItem>

            <ListItem>
              <ListItemIcon sx={{ color: "#585ce4" }}>
                <AssignmentIndOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Role" secondary={profile.role} />
            </ListItem>
          </List>
        </Paper>
      ) : (
        <Typography>No profile data available</Typography>
      )}
    </Box>
  );
};

export default Profile;
