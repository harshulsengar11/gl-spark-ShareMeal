import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  Grid,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import * as foodService from '../services/foodService';
import { extractErrorMessage } from '../services/api';
import './AddFoodPage.css';

interface FormState {
  foodName: string;
  quantity: string;
  description: string;
  originalPrice: string;
  discountedPrice: string;
  expiryDate: string;
  city: string;
  donorAddress: string;
}

interface FormErrors {
  foodName?: string;
  quantity?: string;
  description?: string;
  originalPrice?: string;
  discountedPrice?: string;
  expiryDate?: string;
  city?: string;
  donorAddress?: string;
  image?: string;
}

const INITIAL_FORM: FormState = {
  foodName: '',
  quantity: '',
  description: '',
  originalPrice: '',
  discountedPrice: '',
  expiryDate: '',
  city: '',
  donorAddress: '',
};

const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024; // 3MB

function AddFoodPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string>('');
  const [imageError, setImageError] = useState('');

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImageError('');
    if (!file) {
      setImageDataUrl('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError('Image is too large — please choose one under 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.onerror = () => setImageError('Could not read that image, please try another');
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!form.foodName.trim()) next.foodName = 'Food name cannot be empty';

    const quantityNum = Number(form.quantity);
    if (!form.quantity) next.quantity = 'Quantity is required';
    else if (!Number.isInteger(quantityNum) || quantityNum < 1)
      next.quantity = 'Quantity must be at least 1';

    if (!form.description.trim()) next.description = 'Description cannot be empty';

    const originalNum = Number(form.originalPrice);
    if (!form.originalPrice) next.originalPrice = 'Original price is required';
    else if (!(originalNum > 0)) next.originalPrice = 'Original price must be greater than 0';

    const discountedNum = Number(form.discountedPrice);
    if (!form.discountedPrice) next.discountedPrice = 'Discounted price is required';
    else if (Number.isNaN(discountedNum) || discountedNum < 0)
      next.discountedPrice = 'Discounted price cannot be negative';
    else if (form.originalPrice && discountedNum > originalNum)
      next.discountedPrice = 'Discounted price cannot be greater than original price';

    if (!form.expiryDate) next.expiryDate = 'Expiry date is required';
    else if (new Date(form.expiryDate).getTime() <= Date.now())
      next.expiryDate = 'Expiry date must be in the future';

    if (!form.city.trim()) next.city = 'City cannot be empty';
    if (!form.donorAddress.trim()) next.donorAddress = 'Address cannot be empty';

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
      await foodService.addFood({
        foodName: form.foodName.trim(),
        quantity: Number(form.quantity),
        description: form.description.trim(),
        originalPrice: Number(form.originalPrice),
        discountedPrice: Number(form.discountedPrice),
        expiryDate: form.expiryDate,
        city: form.city.trim(),
        donorAddress: form.donorAddress.trim(),
        imageUrl: imageDataUrl || undefined,
      });
      setSuccessMessage('Donation added successfully. Redirecting to your dashboard…');
      setForm(INITIAL_FORM);
      setImageDataUrl('');
      setTimeout(() => navigate('/donor-dashboard'), 1200);
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="add-food-page page-container">
      <Paper elevation={0} className="add-food-card">
        <Box className="add-food-header">
          <RestaurantMenuIcon className="add-food-icon" />
          <Box>
            <Typography variant="h4">Add a donation</Typography>
            <Typography variant="body2" color="text.secondary">
              Tell NGOs what surplus food you have available right now.
            </Typography>
          </Box>
        </Box>

        {formError && (
          <Alert severity="error" className="add-food-alert">
            {formError}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" className="add-food-alert">
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                label="Food name"
                fullWidth
                value={form.foodName}
                onChange={(e) => updateField('foodName', e.target.value)}
                error={Boolean(errors.foodName)}
                helperText={errors.foodName}
                placeholder="e.g. Vegetable biryani trays"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                value={form.quantity}
                onChange={(e) => updateField('quantity', e.target.value)}
                error={Boolean(errors.quantity)}
                helperText={errors.quantity}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} />

            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                minRows={3}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                error={Boolean(errors.description)}
                helperText={errors.description}
                placeholder="Condition, packaging, pickup notes, etc."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Original price"
                type="number"
                fullWidth
                value={form.originalPrice}
                onChange={(e) => updateField('originalPrice', e.target.value)}
                error={Boolean(errors.originalPrice)}
                helperText={errors.originalPrice}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Discounted price"
                type="number"
                fullWidth
                value={form.discountedPrice}
                onChange={(e) => updateField('discountedPrice', e.target.value)}
                error={Boolean(errors.discountedPrice)}
                helperText={errors.discountedPrice}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Expiry date & time"
                type="datetime-local"
                fullWidth
                value={form.expiryDate}
                onChange={(e) => updateField('expiryDate', e.target.value)}
                error={Boolean(errors.expiryDate)}
                helperText={errors.expiryDate || 'When this food will no longer be safe to claim'}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                fullWidth
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                error={Boolean(errors.city)}
                helperText={errors.city || 'So NGOs in your city can find this donation'}
                placeholder="e.g. Delhi"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Pickup address"
                fullWidth
                value={form.donorAddress}
                onChange={(e) => updateField('donorAddress', e.target.value)}
                error={Boolean(errors.donorAddress)}
                helperText={errors.donorAddress || 'Shown to the NGO so they know how far it is'}
                placeholder="e.g. 12 MG Road, near City Hospital"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<AddPhotoAlternateIcon />}
              >
                {imageDataUrl ? 'Change food photo' : 'Upload food photo (optional)'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              {imageError && (
                <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                  {imageError}
                </Typography>
              )}
              {imageDataUrl && (
                <Box className="add-food-image-preview">
                  <img src={imageDataUrl} alt="Food preview" />
                </Box>
              )}
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={submitting}
            className="add-food-submit-btn"
          >
            {submitting ? 'Submitting…' : 'Submit donation'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default AddFoodPage;
