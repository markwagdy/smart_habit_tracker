import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert, Stack, Paper } from '@mui/material';
import { register } from '../apis/auth'; 

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== password2) {
      setErrorMsg("Passwords don't match");
      setIsLoading(false);
      return;
    }
    
    if(email === '' || username === '' || password === '') {   
      setErrorMsg('All fields are required');
      setIsLoading(false);
      return;
    } 
    
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg('Invalid email format');
      setIsLoading(false);
      return;
    }
    
    if (!/^[a-zA-Z0-9]+$/.test(username)) { 
      setErrorMsg('Username can only contain letters and numbers');
      setIsLoading(false);
      return;
    }
    
    if (username.length < 3 || username.length > 20) {  
      setErrorMsg('Username must be between 3 and 20 characters');
      setIsLoading(false);
      return;
    }

   try {
    const result = await register({ email, username, password });
    
    if (result.success) {
      // Optional: You might want to login the user immediately after registration
      // by using the tokens if they were returned
      navigate('/login'); // Or wherever you want to redirect after registration
    } else {
      setErrorMsg(result.message);
    }
  } catch (error) {
    setErrorMsg(error.message || 'An unexpected error occurred');
  } finally {
    setIsLoading(false);
  }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
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
          boxShadow: '0 15px 30px rgba(0,0,0,0.25)',
          backgroundColor: '#fff',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 25px 40px rgba(0,0,0,0.3)',
          },
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="700" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight="500">
            Sign up to get started with Smart Habit Tracker
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
              label="Email"
              fullWidth
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="medium"
              sx={{
                input: { fontSize: '1rem' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&.Mui-focused fieldset': {
                    borderColor: '#2575fc',
                    boxShadow: '0 0 8px rgba(37,117,252,0.3)',
                  },
                },
              }}
            />
            <TextField
              label="Username"
              fullWidth
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="medium"
              sx={{
                input: { fontSize: '1rem' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&.Mui-focused fieldset': {
                    borderColor: '#2575fc',
                    boxShadow: '0 0 8px rgba(37,117,252,0.3)',
                  },
                },
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
              sx={{
                input: { fontSize: '1rem' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&.Mui-focused fieldset': {
                    borderColor: '#2575fc',
                    boxShadow: '0 0 8px rgba(37,117,252,0.3)',
                  },
                },
              }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              required
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              size="medium"
              error={!!errorMsg}
              helperText={errorMsg}
              sx={{
                input: { fontSize: '1rem' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&.Mui-focused fieldset': {
                    borderColor: '#2575fc',
                    boxShadow: '0 0 8px rgba(37,117,252,0.3)',
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                fontWeight: '700',
                fontSize: '1.1rem',
                backgroundColor: '#2575fc',
                borderRadius: 2,
                boxShadow: '0 8px 16px rgba(37,117,252,0.6)',
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  backgroundColor: '#185bcc',
                  boxShadow: '0 10px 20px rgba(24,91,204,0.7)',
                },
              }}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </Stack>
        </Box>

        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Already have an account?
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/login')}
            size="small"
            sx={{
              fontWeight: '600',
              color: '#2575fc',
              borderColor: '#2575fc',
              borderRadius: 2,
              paddingX: 2,
              transition: 'background-color 0.3s ease, border-color 0.3s ease',
              '&:hover': {
                backgroundColor: '#e3f2fd',
                borderColor: '#185bcc',
              },
            }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterPage;