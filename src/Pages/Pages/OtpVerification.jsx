import React, { useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email_id = location.state?.email || localStorage.getItem('email_id'); // Retrieve email_id from state or localStorage

  const [otp, setOtp] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
  });

  const [successMessage, setSuccessMessage] = useState(""); 
  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const input4 = useRef(null);

  const handleChange = (value, ref, nextRef, index) => {
    const newOtp = { ...otp, [`input${index}`]: value };
    setOtp(newOtp);
    if (value.length === 1 && nextRef.current) {
      nextRef.current.focus();
    }
  };

  const handleKeyPress = (e, ref, prevRef) => {
    if (e.nativeEvent.key === "Backspace" && ref.current.value === "" && prevRef.current) {
      prevRef.current.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = `${otp.input1}${otp.input2}${otp.input3}${otp.input4}`;

    try {
      const response = await fetch('http://localhost:3000/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_id, otp: fullOtp }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === "OTP verified successfully") {
          setSuccessMessage("OTP verified successfully!");
          setTimeout(() => {
            navigate('/new-password');
          }, 1000);
        } else {
          alert(data.message || "An error occurred while verifying the OTP.");
        }
      } else {
        alert(`Error verifying OTP: ${response.statusText}`);
      }
    } catch (error) {
      alert("Error verifying OTP: " + error.message);
    }
  };
  return (
    <div style={styles.otpMainContainer}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
          padding: "40px",
          boxShadow: 2,
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="body" sx={{ marginBottom: 2 }}>Enter your OTP</Typography>
        <div style={styles.inputSection}>
          <input
            ref={input1}
            style={styles.otinput}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, input1, input2, 1)}
            onKeyUp={(e) => handleKeyPress(e, input1, input1)}
          />
          <input
            ref={input2}
            style={styles.otinput}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, input2, input3, 2)}
            onKeyUp={(e) => handleKeyPress(e, input2, input1)}
          />
          <input
            ref={input3}
            style={styles.otinput}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, input3, input4, 3)}
            onKeyUp={(e) => handleKeyPress(e, input3, input2)}
          />
          <input
            ref={input4}
            style={styles.otinput}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, input4, input4, 4)}
            onKeyUp={(e) => handleKeyPress(e, input4, input3)}
          />
        </div>
        <div>
          <p style={styles.otpsubtitle}>I didn't receive a code</p>
          <p style={styles.resend}>Resend OTP</p>
        </div>

        <Button onClick={handleVerify}
          variant="contained"
          sx={{ marginBottom: 3, backgroundColor: "#6d48e5", width: "60%" }}
        >
          Verify
        </Button>

        {successMessage && (
          <Typography variant="body1" sx={{ color: "green", marginTop: 2 }}>
            {successMessage}
          </Typography>
        )}
      </Box>
    </div>
  );
};

const styles = {
  otpMainContainer: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  inputSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "80%",
  },
  otinput: {
    width: "35px",
    height: "40px",
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
    textAlign: "center",
    margin: 5,
    fontSize: 18,
    backgroundColor: "white",
  },
  otpsubtitle: {
    textAlign: "center",
  },
  resend: {
    color: "#007BFF",
    textDecoration: "underline",
    cursor: "pointer",
    marginTop: 10,
    fontSize: 14,
  },
};

export default OtpVerification;
