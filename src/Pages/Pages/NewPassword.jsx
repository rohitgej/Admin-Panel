import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

function NewPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const email= useState(location.state?.email || localStorage.getItem('email_id'));

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const payload = {
      newPassword,
      confirmPassword,
      email_id: email,
    };

    try {
      const response = await fetch("http://localhost:3000/api/admin-resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      alert("An error occurred while resetting the password.");
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
          backgroundColor: "white",
          padding: "40px",
          boxShadow: 2,
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Enter your new password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "80%", marginBottom: 3 }}>
          <TextField
            fullWidth
            label="New Password"
            variant="outlined"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ marginBottom: 4 }}
            autoComplete="new-password"
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            variant="outlined"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ marginBottom: 4 }}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ marginBottom: 3, backgroundColor: "#6d48e5", width: "80%" }}
          >
            Done
          </Button>

          <Typography variant="body2">
            Don’t have an account?{" "}
            <Link href="/otp-verification" underline="hover">
              Register here
            </Link>
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
};

export default NewPassword;
