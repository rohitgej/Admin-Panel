import React, { useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
  Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (validateEmail(email)) {
      try {
        const response = await fetch("http://localhost:3000/api/otp-sending-toadmin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (response.ok) {
          navigate("/otp-verification", { state: { email } });
          setMessage(result.message); // Display success message
        } else {
          setError(result.message || "Failed to generate OTP"); // Display error message
        }
      } catch (err) {
        setError("An error occurred while sending OTP");
      }
    } else {
      setError("Please enter a valid email address.");
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
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
        <Typography variant="body" sx={{ marginBottom: 2 }}>
          Enter the email address associated with your account and we will send you an OTP to reset the password
        </Typography>
        <Box sx={{ width: "80%", marginBottom: 3 }}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            sx={{ marginBottom: 4 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end"></InputAdornment>,
            }}
          />

          <Button 
            variant="contained"
            sx={{ marginBottom: 3, backgroundColor: "#6d48e5", width: "80%" }}
            onClick={handleSubmit}
          >
            Send OTP
          </Button>

          {message && <Typography variant="body2" sx={{ color: "green" }}>{message}</Typography>}
          {error && <Typography variant="body2" sx={{ color: "red" }}>{error}</Typography>}

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

export default ForgotPassword;
