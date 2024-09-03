import React, { useState } from 'react';
import { TextField, Button, Box, Container, Alert } from '@mui/material';
import DOMAIN_NAME from '../../Config/Config';

const NotificationForm = () => {
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    const payload = {
      user_id: userId,
      notification_title: title,
      notification_message: message,
    };

    try {
      const response = await fetch(`${DOMAIN_NAME}api/sendNotification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the request headers
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Notification sent successfully!' });
        setUserId('');  // Clear the form fields
        setTitle('');
        setMessage('');
      } else {
        const errorData = await response.json();
        setStatus({ type: 'error', message: errorData.message || 'Failed to send notification.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An error occurred. Please try again later.' });
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 400,
        p: 3,
        borderRadius: 2,
        boxShadow: '0 0 15px rgba(0,0,0,0.1)',
        bgcolor: 'white',
      }}
    >
      {status && (
        <Alert severity={status.type} sx={{ mb: 2 }}>
          {status.message}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="User ID"
          variant="outlined"
          margin="normal"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Notification Title"
          variant="outlined"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Notification Message"
          variant="outlined"
          margin="normal"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="contained" color="primary" type="submit">
            Send
          </Button>
        </Box>
      </form>
    </Box>
  );
};

const App = () => {
  return (
    <Container 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '90vh',
      }}
    >
      <NotificationForm />
    </Container>
  );
};

export default App;
