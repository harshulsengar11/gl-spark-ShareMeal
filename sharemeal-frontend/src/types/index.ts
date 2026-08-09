
export type Role = 'DONOR' | 'NGO' | 'ADMIN' | 'CUSTOMER' | 'VOLUNTEER';

export const SELECTABLE_ROLES: Role[] = ['DONOR', 'NGO'];

export type FoodStatus =
  | 'AVAILABLE_FOR_NGO'
  | 'CLAIMED_BY_NGO'
  | 'AVAILABLE_FOR_CUSTOMER'
  | 'SOLD'
  | 'EXPIRED';

export type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

// ----- Auth -----

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message: string;
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  createdAt: string;
}

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: Role;
}

// ----- Food -----

export interface FoodRequest {
  foodName: string;
  quantity: number;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  expiryDate: string;
  city: string;
  donorAddress: string;
  imageUrl?: string;
}

export interface FoodResponse {
  id: number;
  foodName: string;
  quantity: number;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  donorEmail: string;
  donorPhone: string;
  city?: string;
  donorAddress?: string;
  imageUrl?: string;
  status: FoodStatus;
  expiryDate: string;
}

// ----- Donor ranking -----

export interface DonorRanking {
  donorEmail: string;
  donorName: string;
  totalDonations: number;
  totalQuantity: number;
}

// ----- Claim -----

export interface ClaimRequest {
  foodId: number;
  claimerEmail: string;
}

export interface ClaimResponse {
  id: number;
  foodId: number;
  claimerEmail: string;
  claimerRole: string;
  claimerPhone: string;
  donorEmail: string;
  donorPhone: string;
  status: ClaimStatus;
  claimTime: string;
  rating?: number | null;
  review?: string | null;
}

export interface RatingRequest {
  ngoEmail: string;
  rating: number;
  review?: string;
}

export interface DonorRatingResponse {
  donorEmail: string;
  averageRating: number;
  totalRatings: number;
}

// ----- Notification -----

export interface NotificationRequest {
  recipientEmail: string;
  title: string;
  message: string;
}

export interface NotificationResponse {
  id: number;
  recipientEmail: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}


export interface ApiErrorBody {
  message?: string;
  status?: number;
  timestamp?: string;
  [field: string]: unknown;
}
