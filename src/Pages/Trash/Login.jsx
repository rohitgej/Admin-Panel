import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Link,
} from "@mui/material";
//, MailOutline
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Reset previous error and success messages
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3000/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const text = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", text);

      // Check if response is HTML or JSON
      try {
        const data = JSON.parse(text);
        if (response.ok) {
          localStorage.setItem("token", data.token);
          setSuccess(data.message);
          window.location.href = "/";
        } else {
          setError(data.message || "An error occurred");
        }
      } catch (error) {
        setError("Unexpected response format. Please try again.");
      }
    } catch (err) {
      setError("An error occurred: " + err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        padding: 2,
      }}
    >
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
        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 5 }}>
          Welcome back!
        </Typography>
        <Box sx={{ width: "80%", marginBottom: 3 }}>
          {/* Error and Success Messages */}
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success">{success}</Typography>}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ marginBottom: 2 }}
            />

            {/* Password Input */}
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ marginBottom: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{ marginBottom: 3, backgroundColor: "#6d48e5", width: "80%" }}
            >
              Log In
            </Button>
          </form>

          <br />
          <Link href="/forgot-password" underline="hover">
            Forgot your password?
          </Link>
        </Box>

        {/* Register Link */}
        <Typography variant="body2">
          Don’t have an account?{" "}
          <Link href="/register" underline="hover">
            Register here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
