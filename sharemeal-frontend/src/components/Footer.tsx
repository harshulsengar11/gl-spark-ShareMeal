import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" className="footer">
      <Box className="footer-inner page-container">
        <Box className="footer-brand">
          <VolunteerActivismIcon fontSize="small" />
          <Typography variant="subtitle1" className="footer-brand-text">
            ShareMeal
          </Typography>
        </Box>

        <Typography variant="body2" className="footer-tagline">
          Surplus food, rescued before it's wasted, put in reach of the people who need it.
        </Typography>

        <Box className="footer-links">
          <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">
            Home
          </MuiLink>
          <MuiLink component={RouterLink} to="/foods" underline="hover" color="inherit">
            Browse food
          </MuiLink>
          <MuiLink component={RouterLink} to="/login" underline="hover" color="inherit">
            Log in
          </MuiLink>
        </Box>

        <Typography variant="caption" className="footer-copy">
          © {year} ShareMeal. Built for donors and NGOs working to end food waste.
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer;
