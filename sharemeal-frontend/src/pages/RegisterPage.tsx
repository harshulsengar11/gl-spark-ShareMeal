import { useState, type FormEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  MenuItem,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useAuth } from '../contexts/AuthContext';
import { extractErrorMessage } from '../services/api';
import type { Role } from '../types';
import './AuthPages.css';

const FULL_NAME_PATTERN = /^[A-Za-z ]+$/;

const PASSWORD_PATTERN = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,20}$/;

const PHONE_PATTERN = /^[6-9][0-9]{9}$/;

interface FormState {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: Role;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
}

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'DONOR',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!form.fullName.trim()) {
      next.fullName = 'Full name is required';
    } else if (form.fullName.trim().length < 3 || form.fullName.trim().length > 100) {
      next.fullName = 'Full name must be between 3 and 100 characters';
    } else if (!FULL_NAME_PATTERN.test(form.fullName.trim())) {
      next.fullName = 'Full name can contain only letters and spaces';
    }

    if (!form.email.trim()) {
      next.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = 'Enter a valid email address';
    }

    if (!form.password) {
      next.password = 'Password is required';
    } else if (!PASSWORD_PATTERN.test(form.password)) {
      next.password = 'Use 8-20 characters with at least one digit and one special character';
    }

    if (!form.phoneNumber.trim()) {
      next.phoneNumber = 'Phone number is required';
    } else if (!PHONE_PATTERN.test(form.phoneNumber.trim())) {
      next.phoneNumber = 'Enter a valid 10-digit phone number';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phoneNumber: form.phoneNumber.trim(),
        role: form.role,
      });
      setSuccessMessage('Account created successfully. Redirecting to login…');
      setTimeout(() => navigate('/login'), 1200);
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
              Create your account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join as a donor to give surplus food a second chance, or as an NGO to claim it.
            </Typography>
          </Box>

          {formError && (
            <Alert severity="error" className="auth-alert">
              {formError}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" className="auth-alert">
              {successMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate className="auth-form">
            <TextField
              label="Full name"
              fullWidth
              margin="normal"
              value={form.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              error={Boolean(errors.fullName)}
              helperText={errors.fullName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              error={Boolean(errors.email)}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Phone number"
              fullWidth
              margin="normal"
              value={form.phoneNumber}
              onChange={(e) => updateField('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
              error={Boolean(errors.phoneNumber)}
              helperText={errors.phoneNumber || '10-digit mobile number — NGOs/donors use this to contact each other'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              error={Boolean(errors.password)}
              helperText={errors.password || '8-20 characters, at least 1 digit and 1 special character'}
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

            <TextField
              select
              label="Role"
              fullWidth
              margin="normal"
              value={form.role}
              onChange={(e) => updateField('role', e.target.value as Role)}
              className="auth-role-select"
            >
              <MenuItem value="DONOR">Donor</MenuItem>
              <MenuItem value="NGO">NGO</MenuItem>
            </TextField>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={submitting}
              className="auth-submit-btn"
            >
              {submitting ? 'Creating account…' : 'Register'}
            </Button>
          </Box>

          <Typography variant="body2" className="auth-footer-text">
            Already have an account?{' '}
            <RouterLink to="/login" className="auth-footer-link">
              Log in
            </RouterLink>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default RegisterPage;
