import { useState, type FormEvent } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useAuth } from '../contexts/AuthContext';
import { extractErrorMessage } from '../services/api';
import './AuthPages.css';

interface LocationState {
  from?: { pathname: string };
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email address';
    if (!password) errors.password = 'Password is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await login({ email, password });
      const state = location.state as LocationState | null;
      const redirectTo =
        state?.from?.pathname ?? (user.role === 'NGO' ? '/ngo-dashboard' : '/donor-dashboard');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(extractErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="auth-page">
      <Box className="auth-page-inner page-container">
        <Paper elevation={0} className="auth-card">
          <Box className="auth-card-header">
            <VolunteerActivismIcon className="auth-card-icon" />
            <Typography variant="h4" className="auth-card-title">
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Log in to manage donations and claims.
            </Typography>
          </Box>

          {formError && (
            <Alert severity="error" className="auth-alert">
              {formError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate className="auth-form">
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(fieldErrors.email)}
              helperText={fieldErrors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(fieldErrors.password)}
              helperText={fieldErrors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={submitting}
              className="auth-submit-btn"
            >
              {submitting ? 'Logging in…' : 'Log in'}
            </Button>
          </Box>

          <Typography variant="body2" className="auth-footer-text">
            Don't have an account?{' '}
            <RouterLink to="/register" className="auth-footer-link">
              Register
            </RouterLink>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default LoginPage;
