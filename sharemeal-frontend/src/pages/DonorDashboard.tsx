import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button, Alert, Chip } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useAuth } from '../contexts/AuthContext';
import * as foodService from '../services/foodService';
import { extractErrorMessage } from '../services/api';
import type { FoodResponse } from '../types';
import Loader from '../components/Loader';
import './DashboardPage.css';

function DonorDashboard() {
  const { user } = useAuth();
  const [myFoods, setMyFoods] = useState<FoodResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const all = await foodService.getAllFoods();
        if (active) {
          setMyFoods(all.filter((f) => f.donorEmail === user?.email));
        }
      } catch (err) {
        if (active) setError(extractErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [user?.email]);

  const stats = useMemo(() => {
    const total = myFoods.length;
    const available = myFoods.filter((f) => f.status === 'AVAILABLE_FOR_NGO').length;
    const claimed = myFoods.filter((f) => f.status === 'CLAIMED_BY_NGO').length;
    // "Donated" = quantity of food that has actually reached someone
    // (claimed by an NGO or sold), summed across all listings.
    const donatedQuantity = myFoods
      .filter((f) => f.status === 'CLAIMED_BY_NGO' || f.status === 'SOLD')
      .reduce((sum, f) => sum + f.quantity, 0);
    return { total, available, claimed, donatedQuantity };
  }, [myFoods]);

  return (
    <Box className="dashboard-page page-container">
      <Box className="dashboard-header">
        <Box>
          <Typography variant="overline" className="dashboard-eyebrow">
            Donor dashboard
          </Typography>
          <Typography variant="h4" className="dashboard-title">
            Welcome back{user?.fullName ? `, ${user.fullName}` : ''}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track what you've listed and add new surplus food for NGOs to claim.
          </Typography>
        </Box>
        <Box className="dashboard-header-actions">
          <Button
            component={RouterLink}
            to="/ranking"
            variant="outlined"
            color="primary"
            startIcon={<EmojiEventsIcon />}
          >
            Top donors
          </Button>
          <Button
            component={RouterLink}
            to="/add-food"
            variant="contained"
            color="secondary"
            startIcon={<AddCircleOutlineIcon />}
          >
            Add donation
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2.5} className="dashboard-stats">
        <Grid item xs={6} md={3}>
          <Card
            elevation={0}
            className="stat-card stat-card--clickable"
            component={RouterLink}
            to="/foods?owner=me"
          >
            <CardContent>
              <ListAltIcon className="stat-card-icon" />
              <Typography variant="h4">{stats.total}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total listings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            elevation={0}
            className="stat-card stat-card--clickable"
            component={RouterLink}
            to="/foods?owner=me&status=AVAILABLE_FOR_NGO"
          >
            <CardContent>
              <Inventory2Icon className="stat-card-icon stat-card-icon--available" />
              <Typography variant="h4">{stats.available}</Typography>
              <Typography variant="body2" color="text.secondary">
                Awaiting claim
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            elevation={0}
            className="stat-card stat-card--clickable"
            component={RouterLink}
            to="/foods?owner=me&status=CLAIMED_BY_NGO"
          >
            <CardContent>
              <CheckCircleOutlineIcon className="stat-card-icon stat-card-icon--claimed" />
              <Typography variant="h4">{stats.claimed}</Typography>
              <Typography variant="body2" color="text.secondary">
                Claimed by NGOs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            elevation={0}
            className="stat-card stat-card--clickable"
            component={RouterLink}
            to="/foods?owner=me"
          >
            <CardContent>
              <VolunteerActivismIcon className="stat-card-icon stat-card-icon--sold" />
              <Typography variant="h4">{stats.donatedQuantity}</Typography>
              <Typography variant="body2" color="text.secondary">
                Items donated
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box className="dashboard-section">
        <Box className="dashboard-section-header">
          <Typography variant="h6">Your recent donations</Typography>
          <Button component={RouterLink} to="/foods" size="small">
            View all food
          </Button>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {loading ? (
          <Loader label="Loading your donations…" fullHeight={false} />
        ) : myFoods.length === 0 ? (
          <Card elevation={0} className="empty-state">
            <CardContent>
              <Typography variant="body1" gutterBottom>
                You haven't listed any food yet.
              </Typography>
              <Button
                component={RouterLink}
                to="/add-food"
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
              >
                Add your first donation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box className="donation-list">
            {myFoods.slice(0, 6).map((food) => (
              <Card elevation={0} key={food.id} className="donation-row">
                <CardContent className="donation-row-content">
                  <Box>
                    <Typography variant="subtitle1">{food.foodName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty {food.quantity} • ₹{food.discountedPrice.toFixed(2)}
                    </Typography>
                  </Box>
                  <Chip label={food.status.replace(/_/g, ' ')} size="small" className="donation-row-chip" />
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default DonorDashboard;
