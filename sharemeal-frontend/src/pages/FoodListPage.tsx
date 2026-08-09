import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
  Alert,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useAuth } from '../contexts/AuthContext';
import * as foodService from '../services/foodService';
import * as claimService from '../services/claimService';
import { extractErrorMessage } from '../services/api';
import type { ClaimResponse, DonorRatingResponse, FoodResponse, FoodStatus } from '../types';
import FoodCard from '../components/FoodCard';
import Loader from '../components/Loader';
import './FoodListPage.css';

const STATUS_FILTERS: { value: FoodStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'AVAILABLE_FOR_NGO', label: 'Available for NGOs' },
  { value: 'CLAIMED_BY_NGO', label: 'Claimed by NGO' },
  { value: 'AVAILABLE_FOR_CUSTOMER', label: 'Available for purchase' },
  { value: 'SOLD', label: 'Sold' },
  { value: 'EXPIRED', label: 'Expired' },
];

function FoodListPage() {
  const { user } = useAuth();
  const isNgo = user?.role === 'NGO';
  const isDonor = user?.role === 'DONOR';

  const [searchParams] = useSearchParams();
  const initialStatus = (searchParams.get('status') as FoodStatus | null) || 'ALL';
  const ownerIsMe = searchParams.get('owner') === 'me' && isDonor;
  const claimedByMe = searchParams.get('claimedByMe') === 'true' && isNgo;

  const [foods, setFoods] = useState<FoodResponse[]>([]);
  const [claimsByFoodId, setClaimsByFoodId] = useState<Record<number, ClaimResponse>>({});
  const [donorRatings, setDonorRatings] = useState<Record<string, DonorRatingResponse>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<FoodStatus | 'ALL'>(initialStatus);
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [ratingId, setRatingId] = useState<number | null>(null);

  const loadFoods = async () => {
    setLoading(true);
    setError('');
    try {
      const [foodData, claimData] = await Promise.all([
        foodService.getAllFoods(),
        claimService.getAllClaims(),
      ]);
      setFoods(foodData);
      const map: Record<number, ClaimResponse> = {};
      claimData.forEach((c) => {
        map[c.foodId] = c;
      });
      setClaimsByFoodId(map);

      if (isNgo) {
        const donorEmails = Array.from(new Set(foodData.map((f) => f.donorEmail)));
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
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesSearch =
        !search.trim() ||
        food.foodName.toLowerCase().includes(search.trim().toLowerCase()) ||
        food.description.toLowerCase().includes(search.trim().toLowerCase()) ||
        food.donorEmail.toLowerCase().includes(search.trim().toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || food.status === statusFilter;

      const matchesCity =
        !cityFilter.trim() ||
        (food.city ?? '').toLowerCase().includes(cityFilter.trim().toLowerCase());

      const matchesOwner = !ownerIsMe || food.donorEmail === user?.email;

      const matchesClaimedByMe =
        !claimedByMe || claimsByFoodId[food.id]?.claimerEmail === user?.email;

      return matchesSearch && matchesStatus && matchesCity && matchesOwner && matchesClaimedByMe;
    });
  }, [foods, search, cityFilter, statusFilter, ownerIsMe, claimedByMe, claimsByFoodId, user?.email]);

  const handleClaim = async (food: FoodResponse) => {
    if (!user?.email) return;
    setActionMessage('');
    setError('');
    setClaimingId(food.id);
    try {
      await claimService.claimFood({ foodId: food.id, claimerEmail: user.email });
      setActionMessage(`Claimed "${food.foodName}" successfully.`);
      await loadFoods();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setClaimingId(null);
    }
  };

  const handleRate = async (food: FoodResponse, rating: number) => {
    if (!user?.email) return;
    const claim = claimsByFoodId[food.id];
    if (!claim) return;
    setActionMessage('');
    setError('');
    setRatingId(claim.id);
    try {
      await claimService.rateClaim(claim.id, { ngoEmail: user.email, rating });
      setActionMessage(`Thanks! You rated "${food.foodName}".`);
      await loadFoods();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setRatingId(null);
    }
  };

  return (
    <Box className="food-list-page page-container">
      <Box className="food-list-header">
        <Box>
          <Typography variant="overline" className="food-list-eyebrow">
            Browse listings
          </Typography>
          <Typography variant="h4" className="food-list-title">
            Available food donations
          </Typography>
        </Box>
        <Chip label={`${filteredFoods.length} listing${filteredFoods.length === 1 ? '' : 's'}`} className="food-list-count" />
      </Box>

      <Box className="food-list-filters">
        <TextField
          placeholder="Search by food name, description or donor"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          placeholder="Filter by city (e.g. Delhi)"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          size="small"
          className="food-list-city-filter"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FoodStatus | 'ALL')}
          className="food-list-status-filter"
        >
          {STATUS_FILTERS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {error && (
        <Alert severity="error" className="food-list-alert">
          {error}
        </Alert>
      )}
      {actionMessage && (
        <Alert severity="success" className="food-list-alert">
          {actionMessage}
        </Alert>
      )}

      {loading ? (
        <Loader label="Loading food listings…" />
      ) : filteredFoods.length === 0 ? (
        <Box className="food-list-empty">
          <Typography variant="body1" color="text.secondary">
            No food listings match your search.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2.5} className="food-list-grid">
          {filteredFoods.map((food) => {
            const claim = claimsByFoodId[food.id];
            const canRate =
              isNgo &&
              !!claim &&
              claim.claimerEmail === user?.email &&
              claim.rating == null;

            return (
              <Grid item xs={12} sm={6} md={4} key={food.id}>
                <FoodCard
                  food={food}
                  canClaim={isNgo}
                  claiming={claimingId === food.id}
                  onClaim={handleClaim}
                  rating={claim?.rating ?? null}
                  review={claim?.review ?? null}
                  canRate={canRate}
                  ratingSubmitting={ratingId === claim?.id}
                  onRate={handleRate}
                  donorRating={isNgo ? donorRatings[food.donorEmail] ?? null : null}
                  showDonorPhone={isNgo}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}

export default FoodListPage;
