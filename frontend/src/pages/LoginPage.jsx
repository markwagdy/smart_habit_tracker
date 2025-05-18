import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert, Stack, Paper } from '@mui/material';
import { login } from '../apis/auth';

function LoginPage({ darkMode, setDarkMode }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (error) {
      setErrorMsg('Invalid username or password');
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: '100vh',
        width: '100vw',
        background: darkMode
          ? '#121212'
          : 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 6,
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
          boxShadow: darkMode
            ? '0 15px 30px rgba(255,255,255,0.15)'
            : '0 15px 30px rgba(0,0,0,0.25)',
          backgroundColor: darkMode ? '#1e1e1e' : '#fff',
          color: darkMode ? '#fff' : '#000',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: darkMode
              ? '0 25px 40px rgba(255,255,255,0.2)'
              : '0 25px 40px rgba(0,0,0,0.3)',
          },
        }}
      >
        {/* Toggle Button */}
        <Box sx={{ textAlign: 'right', mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setDarkMode(prev => !prev)}
            sx={{ color: darkMode ? '#fff' : '#2575fc', borderColor: darkMode ? '#fff' : '#2575fc' }}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="700" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight="500">
            Sign in to continue to Smart Habit Tracker
          </Typography>
        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontWeight: '600' }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              label="Username"
              fullWidth
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="medium"
              InputProps={{
                style: {
                  color: darkMode ? '#fff' : undefined
                }
              }}
              InputLabelProps={{
                style: {
                  color: darkMode ? '#ccc' : undefined
                }
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="medium"
              InputProps={{
                style: {
                  color: darkMode ? '#fff' : undefined
                }
              }}
              InputLabelProps={{
                style: {
                  color: darkMode ? '#ccc' : undefined
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                fontWeight: '700',
                fontSize: '1.1rem',
                backgroundColor: '#2575fc',
                borderRadius: 2,
                boxShadow: '0 8px 16px rgba(37,117,252,0.6)',
                '&:hover': {
                  backgroundColor: '#185bcc',
                  boxShadow: '0 10px 20px rgba(24,91,204,0.7)',
                },
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Box>

        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Don't have an account?
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/register')}
            size="small"
            sx={{
              fontWeight: '600',
              color: '#2575fc',
              borderColor: '#2575fc',
              borderRadius: 2,
              paddingX: 2,
              '&:hover': {
                backgroundColor: '#e3f2fd',
                borderColor: '#185bcc',
              },
            }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
