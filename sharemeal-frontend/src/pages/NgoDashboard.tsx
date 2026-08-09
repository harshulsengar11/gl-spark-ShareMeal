import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button, Alert } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HandshakeIcon from '@mui/icons-material/Handshake';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useAuth } from '../contexts/AuthContext';
import * as foodService from '../services/foodService';
import * as claimService from '../services/claimService';
import * as notificationService from '../services/notificationService';
import { extractErrorMessage } from '../services/api';
import type { ClaimResponse, DonorRatingResponse, FoodResponse, NotificationResponse } from '../types';
import FoodCard from '../components/FoodCard';
import Loader from '../components/Loader';
import './DashboardPage.css';

function NgoDashboard() {
  const { user } = useAuth();
  const [allFoods, setAllFoods] = useState<FoodResponse[]>([]);
  const [myClaims, setMyClaims] = useState<ClaimResponse[]>([]);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [donorRatings, setDonorRatings] = useState<Record<string, DonorRatingResponse>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [ratingId, setRatingId] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [foods, claims, notifs] = await Promise.all([
        foodService.getAllFoods(),
        claimService.getAllClaims(),
        user?.email ? notificationService.getNotificationsByEmail(user.email) : Promise.resolve([]),
      ]);

      setAllFoods(foods);
      setMyClaims(user?.email ? claims.filter((c) => c.claimerEmail === user.email) : claims);
      setNotifications(notifs);

      const donorEmails = Array.from(new Set(foods.map((f) => f.donorEmail)));
      const ratingEntries = await Promise.all(
        donorEmails.map(async (email) => {
          try {
            return [email, await claimService.getDonorRating(email)] as const;
          } catch {
            return null;
          }
        })
      );
      const ratingsMap: Record<string, DonorRatingResponse> = {};
      ratingEntries.forEach((entry) => {
        if (entry) ratingsMap[entry[0]] = entry[1];
      });
      setDonorRatings(ratingsMap);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

  }, [user?.email]);

  const availableFoods = useMemo(
    () => allFoods.filter((f) => f.status === 'AVAILABLE_FOR_NGO'),
    [allFoods]
  );

  const foodsById = useMemo(() => {
    const map: Record<number, FoodResponse> = {};
    allFoods.forEach((f) => {
      map[f.id] = f;
    });
    return map;
  }, [allFoods]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const handleClaim = async (food: FoodResponse) => {
    if (!user?.email) return;
    setActionMessage('');
    setClaimingId(food.id);
    try {
      await claimService.claimFood({ foodId: food.id, claimerEmail: user.email });
      setActionMessage(`Claimed "${food.foodName}" successfully.`);
      await loadData();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setClaimingId(null);
    }
  };

  const handleRate = async (food: FoodResponse, rating: number) => {
    if (!user?.email) return;
    const claim = myClaims.find((c) => c.foodId === food.id);
    if (!claim) return;
    setActionMessage('');
    setRatingId(claim.id);
    try {
      await claimService.rateClaim(claim.id, { ngoEmail: user.email, rating });
      setActionMessage(`Thanks! You rated "${food.foodName}".`);
      await loadData();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setRatingId(null);
    }
  };

  return (
    <Box className="dashboard-page page-container">
      <Box className="dashboard-header">
        <Box>
          <Typography variant="overline" className="dashboard-eyebrow">
            NGO dashboard
          </Typography>
          <Typography variant="h4" className="dashboard-title">
            Welcome back{user?.fullName ? `, ${user.fullName}` : ''}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Claim available surplus food and keep track of your organization's activity.
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
          <Button component={RouterLink} to="/foods" variant="contained" color="secondary">
            Browse all food
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2.5} className="dashboard-stats">
        <Grid item xs={6} md={3}>
          <Card
            elevation={0}
            className="stat-card stat-card--clickable"
            component={RouterLink}
            to="/foods?status=AVAILABLE_FOR_NGO"
          >
            <CardContent>
              <RestaurantIcon className="stat-card-icon stat-card-icon--available" />
              <Typography variant="h4">{availableFoods.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Available now
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            elevation={0}
            className="stat-card stat-card--clickable"
            component={RouterLink}
            to="/foods?claimedByMe=true"
          >
            <CardContent>
              <HandshakeIcon className="stat-card-icon stat-card-icon--claimed" />
              <Typography variant="h4">{myClaims.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Items claimed till date
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            elevation={0}
            className="stat-card stat-card--clickable"
            component={RouterLink}
            to="/notifications"
          >
            <CardContent>
              <NotificationsNoneIcon className="stat-card-icon" />
              <Typography variant="h4">{unreadCount}</Typography>
              <Typography variant="body2" color="text.secondary">
                Unread alerts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            elevation={0}
            className="stat-card stat-card--clickable"
            component={RouterLink}
            to="/notifications"
          >
            <CardContent>
              <ListAltIcon className="stat-card-icon" />
              <Typography variant="h4">{notifications.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total notifications
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box className="dashboard-section">
        <Box className="dashboard-section-header">
          <Typography variant="h6">Available food near you</Typography>
          <Button component={RouterLink} to="/foods" size="small">
            View all
          </Button>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}
        {actionMessage && <Alert severity="success">{actionMessage}</Alert>}

        {loading ? (
          <Loader label="Loading available food…" fullHeight={false} />
        ) : availableFoods.length === 0 ? (
          <Card elevation={0} className="empty-state">
            <CardContent>
              <Typography variant="body1">No food is available to claim right now. Check back soon.</Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2.5}>
            {availableFoods.slice(0, 6).map((food) => (
              <Grid item xs={12} sm={6} md={4} key={food.id}>
                <FoodCard
                  food={food}
                  canClaim
                  claiming={claimingId === food.id}
                  onClaim={handleClaim}
                  donorRating={donorRatings[food.donorEmail] ?? null}
                  showDonorPhone
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {!loading && myClaims.length > 0 && (
        <Box className="dashboard-section">
          <Box className="dashboard-section-header">
            <Typography variant="h6">Your claimed items</Typography>
          </Box>

          <Grid container spacing={2.5}>
            {myClaims
              .slice()
              .sort((a, b) => new Date(b.claimTime).getTime() - new Date(a.claimTime).getTime())
              .map((claim) => {
                const food = foodsById[claim.foodId];
                if (!food) return null;
                return (
                  <Grid item xs={12} sm={6} md={4} key={claim.id}>
                    <FoodCard
                      food={food}
                      rating={claim.rating ?? null}
                      review={claim.review ?? null}
                      canRate={claim.rating == null}
                      ratingSubmitting={ratingId === claim.id}
                      onRate={handleRate}
                    />
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default NgoDashboard;
