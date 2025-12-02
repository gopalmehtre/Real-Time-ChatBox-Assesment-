import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Authentication() {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [formState, setFormState] = React.useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      setError('');
      setMessage('');
      setLoading(true);

      // Login
      if (formState === 'login') {
        if (!email || !password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }

        const result = await login({ email, password });
        if (result.success) {
          navigate('/chat');
        } else {
          setError('Invalid email or password');
        }
      }

      // Signup
      if (formState === 'signup') {
        if (!username || !email || !password || !confirmPassword) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }

        const result = await signup({ username, email, password });
        if (result.success) {
          navigate('/chat');
        } else {
          setError(result.message||'signup failed');
        }
      }
    } catch (err) {
      if (formState === 'login') {
      setError('Invalid email or password');
    } else {
      setError('An error occurred. Please try again.');
    }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAuth();
    }
  };

  const handleToggle = (event, newState) => {
    if (newState !== null) {
      setFormState(newState);
      setError('');
      setMessage('');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 1 }}>
          Real-Time ChatBox.
        </Typography>
        <Paper elevation={3} sx={{ p: 4 }}>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <ToggleButtonGroup
              value={formState}
              exclusive
              onChange={handleToggle}
              aria-label="auth mode"
            >
              <ToggleButton value="login" aria-label="login">
                Sign In
              </ToggleButton>
              <ToggleButton value="signup" aria-label="signup">
                Sign Up
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Typography variant="h4" align="center" gutterBottom>
            {formState === 'login' ? 'Welcome Back !' : 'Create Account.'}
          </Typography>

          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

         
          <Box component="form" onSubmit={(e) => e.preventDefault()}>
           
            {formState === 'signup' && (
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                margin="normal"
                required
              />
            )}

            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              margin="normal"
              required
            />

          
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

         
            {formState === 'signup' && (
              <TextField
                fullWidth
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                margin="normal"
                required
              />
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={handleAuth}
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading
                ? formState === 'login'
                  ? 'Logging in...'
                  : 'Creating account...'
                : formState === 'login'
                ? 'Login'
                : 'Sign Up'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}