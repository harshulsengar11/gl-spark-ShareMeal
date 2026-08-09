import { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  Rating,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import type { DonorRatingResponse, FoodResponse, FoodStatus } from '../types';
import './FoodCard.css';

interface FoodCardProps {
  food: FoodResponse;
  canClaim?: boolean;
  claiming?: boolean;
  onClaim?: (food: FoodResponse) => void;
  rating?: number | null;
  review?: string | null;
  canRate?: boolean;
  ratingSubmitting?: boolean;
  onRate?: (food: FoodResponse, rating: number) => void;

  donorRating?: DonorRatingResponse | null;
  showDonorPhone?: boolean;
}

const STATUS_META: Record<FoodStatus, { label: string; className: string }> = {
  AVAILABLE_FOR_NGO: { label: 'Available for NGOs', className: 'status-available' },
  CLAIMED_BY_NGO: { label: 'Claimed by NGO', className: 'status-claimed' },
  AVAILABLE_FOR_CUSTOMER: { label: 'Available for purchase', className: 'status-customer' },
  SOLD: { label: 'Sold', className: 'status-sold' },
  EXPIRED: { label: 'Expired', className: 'status-expired' },
};

function formatExpiry(value: string): { text: string; expired: boolean } {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { text: '', expired: false };

  const diffMs = date.getTime() - Date.now();
  const formatted = date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

  if (diffMs <= 0) {
    return { text: `Expired on ${formatted}`, expired: true };
  }

  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) {
    return { text: `Expires in ~${diffHours}h (${formatted})`, expired: false };
  }
  const diffDays = Math.round(diffHours / 24);
  return { text: `Expires in ~${diffDays}d (${formatted})`, expired: false };
}

function FoodCard({
  food,
  canClaim = false,
  claiming = false,
  onClaim,
  rating,
  review,
  canRate = false,
  ratingSubmitting = false,
  onRate,
  donorRating,
  showDonorPhone = false,
}: FoodCardProps) {
  const [pendingRating, setPendingRating] = useState<number | null>(null);
  const statusMeta = STATUS_META[food.status];
  const savings =
    food.originalPrice > 0
      ? Math.round(((food.originalPrice - food.discountedPrice) / food.originalPrice) * 100)
      : 0;

  const expiry = food.expiryDate ? formatExpiry(food.expiryDate) : null;

  return (
    <Card className="food-card" elevation={0}>
      <Box className="food-card-media">
        {food.imageUrl ? (
          <img src={food.imageUrl} alt={food.foodName} className="food-card-image" />
        ) : (
          <RestaurantIcon className="food-card-media-icon" />
        )}
        <Chip label={statusMeta.label} size="small" className={`food-card-status ${statusMeta.className}`} />
      </Box>

      <CardContent className="food-card-content">
        <Typography variant="h6" className="food-card-title">
          {food.foodName}
        </Typography>

        <Typography variant="body2" color="text.secondary" className="food-card-description">
          {food.description}
        </Typography>

        <Box className="food-card-meta">
          <Box className="food-card-meta-item">
            <Inventory2Icon fontSize="small" />
            <Typography variant="body2">Qty: {food.quantity}</Typography>
          </Box>
          <Box className="food-card-meta-item">
            <PersonOutlineIcon fontSize="small" />
            <Typography variant="body2" noWrap>
              {food.donorEmail}
            </Typography>
          </Box>
          {showDonorPhone && food.donorPhone && (
            <Box className="food-card-meta-item">
              <PhoneOutlinedIcon fontSize="small" />
              <Typography variant="body2" noWrap>
                {food.donorPhone}
              </Typography>
            </Box>
          )}
        </Box>

        {food.city && (
          <Box className="food-card-meta-item">
            <LocationOnOutlinedIcon fontSize="small" />
            <Typography variant="body2" noWrap>
              {food.city}
            </Typography>
          </Box>
        )}

        {showDonorPhone && food.donorAddress && (
          <Box className="food-card-meta-item">
            <PlaceOutlinedIcon fontSize="small" />
            <Typography variant="body2" className="food-card-address" noWrap>
              {food.donorAddress}
            </Typography>
          </Box>
        )}

        {donorRating && (
          <Box className="food-card-rating-row">
            {donorRating.totalRatings > 0 ? (
              <>
                <Rating value={donorRating.averageRating} precision={0.1} readOnly size="small" />
                <Typography variant="caption" color="text.secondary">
                  {donorRating.averageRating.toFixed(1)} / 5 (Based on {donorRating.totalRatings}{' '}
                  review{donorRating.totalRatings === 1 ? '' : 's'})
                </Typography>
              </>
            ) : (
              <Typography variant="caption" color="text.secondary">
                No ratings yet for this donor
              </Typography>
            )}
          </Box>
        )}

        {expiry && (
          <Box
            className={`food-card-meta-item food-card-expiry ${
              expiry.expired ? 'food-card-expiry--expired' : ''
            }`}
          >
            <AccessTimeIcon fontSize="small" />
            <Typography variant="body2">{expiry.text}</Typography>
          </Box>
        )}

        <Box className="food-card-price-row">
          <Typography variant="h6" className="food-card-price">
            ₹{food.discountedPrice.toFixed(2)}
          </Typography>
          {food.discountedPrice < food.originalPrice && (
            <>
              <Typography variant="body2" className="food-card-price-original">
                ₹{food.originalPrice.toFixed(2)}
              </Typography>
              {savings > 0 && (
                <Chip label={`${savings}% off`} size="small" className="food-card-savings-chip" />
              )}
            </>
          )}
        </Box>

        {typeof rating === 'number' && (
          <Box className="food-card-rating-row">
            <Rating value={rating} precision={0.5} readOnly size="small" />
            <Typography variant="caption" color="text.secondary">
              ({rating.toFixed(1)})
            </Typography>
          </Box>
        )}
        {review && (
          <Typography variant="caption" color="text.secondary" className="food-card-review">
            “{review}”
          </Typography>
        )}

        {canRate && (
          <Box className="food-card-rating-row food-card-rate-form">
            <Typography variant="body2">Rate this donation:</Typography>
            <Rating
              value={pendingRating}
              onChange={(_, value) => setPendingRating(value)}
              size="small"
            />
            <Button
              size="small"
              variant="outlined"
              disabled={!pendingRating || ratingSubmitting}
              onClick={() => pendingRating && onRate?.(food, pendingRating)}
            >
              {ratingSubmitting ? 'Submitting…' : 'Submit'}
            </Button>
          </Box>
        )}
      </CardContent>

      {canClaim && (
        <CardActions className="food-card-actions">
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={food.status !== 'AVAILABLE_FOR_NGO' || claiming}
            onClick={() => onClaim?.(food)}
          >
            {claiming
              ? 'Claiming…'
              : food.status === 'AVAILABLE_FOR_NGO'
                ? 'Claim this food'
                : statusMeta.label}
          </Button>
        </CardActions>
      )}
    </Card>
  );
}

export default FoodCard;
