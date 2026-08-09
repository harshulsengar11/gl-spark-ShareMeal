import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import './NotFoundPage.css';

function NotFoundPage() {
  return (
    <Box className="not-found-page">
      <RestaurantIcon className="not-found-icon" />
      <Typography variant="h2" className="not-found-code">
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        This plate's empty.
      </Typography>
      <Typography variant="body1" color="text.secondary" className="not-found-copy">
        We couldn't find the page you're looking for.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained" color="primary" size="large">
        Back to home
      </Button>
    </Box>
  );
}

export default NotFoundPage;
