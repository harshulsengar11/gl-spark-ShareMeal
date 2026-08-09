
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import BoltIcon from '@mui/icons-material/Bolt';
import PublicIcon from '@mui/icons-material/Public';
import HandshakeIcon from '@mui/icons-material/Handshake';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';

const STEPS = [
  {
    icon: <RestaurantIcon />,
    title: 'Donors list surplus food',
    body: 'Restaurants, caterers and kitchens post what they have left — quantity, description and price — in under a minute.',
  },
  {
    icon: <NotificationsActiveIcon />,
    title: 'NGOs get notified',
    body: 'Verified NGOs see new listings the moment they go live and can claim what their community needs.',
  },
  {
    icon: <HandshakeIcon />,
    title: 'Food changes hands, not the bin',
    body: 'Claims are tracked end-to-end, so donors and NGOs both know exactly what happened to every listing.',
  },
];

const WHY = [
  {
    icon: <BoltIcon />,
    title: 'Fast handoffs',
    body: 'Listings default to a short reservation window so surplus food moves before it spoils.',
  },
  {
    icon: <Diversity3Icon />,
    title: 'Built for both sides',
    body: 'Separate dashboards for donors and NGOs, each tuned to the actions that role actually needs.',
  },
  {
    icon: <PublicIcon />,
    title: 'Full visibility',
    body: 'Every claim and notification is logged, so nothing about a donation is a mystery after the fact.',
  },
];

function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const dashboardPath =
      user?.role === 'NGO' ? '/ngo-dashboard' : '/donor-dashboard';

  return (
      <Box>
        <Box className="hero">
          <Box className="page-container hero-inner">
            <Box className="hero-copy">
              <Box className="hero-eyebrow">Food Rescue Platform</Box>

              <Typography variant="h1" className="hero-title">
                Reduce Food Waste.
                <br />
                Feed More People.
              </Typography>

              <Typography variant="body1" className="hero-subtitle">
                ShareMeal connects food donors with NGOs, helping surplus food
                reach communities in need through a simple and transparent process.
              </Typography>

              <Box className="hero-actions">
                {isAuthenticated ? (
                    <Button
                        component={RouterLink}
                        to={dashboardPath}
                        variant="contained"
                        color="secondary"
                        size="large"
                    >
                      Go to Dashboard
                    </Button>
                ) : (
                    <>
                      <Button
                          component={RouterLink}
                          to="/register"
                          variant="contained"
                          color="secondary"
                          size="large"
                      >
                        Get Started
                      </Button>

                      <Button
                          component={RouterLink}
                          to="/login"
                          variant="outlined"
                          size="large"
                          className="hero-outline-btn"
                      >
                        Log In
                      </Button>
                    </>
                )}
              </Box>
            </Box>

            <Box className="hero-visual" aria-hidden="true">
              <Box className="hero-visual-ring" />
              <RestaurantIcon className="hero-visual-icon" />
            </Box>
          </Box>
        </Box>

        <Box className="page-container section">
          <Typography variant="overline" className="section-eyebrow">
            How it works
          </Typography>

          <Typography variant="h3" className="section-title">
            Three simple steps
          </Typography>

          <Grid container spacing={3} className="section-grid">
            {STEPS.map((step, index) => (
                <Grid item xs={12} md={4} key={step.title}>
                  <Card elevation={0} className="feature-card">
                    <CardContent>
                      <Box className="feature-card-index">
                        {String(index + 1).padStart(2, '0')}
                      </Box>

                      <Box className="feature-card-icon">
                        {step.icon}
                      </Box>

                      <Typography variant="h6" gutterBottom>
                        {step.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {step.body}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
            ))}
          </Grid>
        </Box>

        <Box className="section-alt">
          <Box className="page-container section">
            <Typography variant="overline" className="section-eyebrow">
              Why ShareMeal
            </Typography>

            <Typography variant="h3" className="section-title">
              Made for real impact
            </Typography>

            <Grid container spacing={3} className="section-grid">
              {WHY.map((item) => (
                  <Grid item xs={12} md={4} key={item.title}>
                    <Box className="why-item">
                      <Box className="why-icon">
                        {item.icon}
                      </Box>

                      <Typography variant="h6" gutterBottom>
                        {item.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {item.body}
                      </Typography>
                    </Box>
                  </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {!isAuthenticated && (
            <Box className="page-container cta-section">
              <Box className="cta-card">
                <Box>
                  <Typography variant="h4" className="cta-title">
                    Ready to make a difference?
                  </Typography>

                  <Typography variant="body1" className="cta-subtitle">
                    Join ShareMeal today and help reduce food waste while supporting communities.
                  </Typography>
                </Box>

                <Box className="cta-actions">
                  <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      color="secondary"
                      size="large"
                  >
                    Create Account
                  </Button>
                </Box>
              </Box>
            </Box>
        )}
      </Box>
  );
}

export default HomePage;

