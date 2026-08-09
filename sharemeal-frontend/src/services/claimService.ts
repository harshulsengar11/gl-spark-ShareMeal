import api from './api';
import type { ClaimRequest, ClaimResponse, DonorRatingResponse, RatingRequest } from '../types';

export async function claimFood(payload: ClaimRequest): Promise<ClaimResponse> {
  const { data } = await api.post<ClaimResponse>('/claims', payload);
  return data;
}

export async function getAllClaims(): Promise<ClaimResponse[]> {
  const { data } = await api.get<ClaimResponse[]>('/claims');
  return data;
}

export async function getClaimById(id: number): Promise<ClaimResponse> {
  const { data } = await api.get<ClaimResponse>(`/claims/${id}`);
  return data;
}

export async function getClaimByFoodId(foodId: number): Promise<ClaimResponse | null> {
  try {
    const { data } = await api.get<ClaimResponse>(`/claims/food/${foodId}`);
    return data;
  } catch {
    return null;
  }
}

export async function rateClaim(id: number, payload: RatingRequest): Promise<ClaimResponse> {
  const { data } = await api.put<ClaimResponse>(`/claims/${id}/rate`, payload);
  return data;
}

export async function getDonorRating(email: string): Promise<DonorRatingResponse> {
  const { data } = await api.get<DonorRatingResponse>(`/claims/donor-rating/${encodeURIComponent(email)}`);
  return data;
}
