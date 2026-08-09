import api from './api';
import type { DonorRanking, FoodRequest, FoodResponse } from '../types';

export async function addFood(payload: FoodRequest): Promise<FoodResponse> {
  const { data } = await api.post<FoodResponse>('/foods', payload);
  return data;
}

export async function getAllFoods(): Promise<FoodResponse[]> {
  const { data } = await api.get<FoodResponse[]>('/foods');
  return data;
}

export async function getFoodById(id: number): Promise<FoodResponse> {
  const { data } = await api.get<FoodResponse>(`/foods/${id}`);
  return data;
}

export async function updateFood(id: number, payload: FoodRequest): Promise<FoodResponse> {
  const { data } = await api.put<FoodResponse>(`/foods/${id}`, payload);
  return data;
}

export async function deleteFood(id: number): Promise<void> {
  await api.delete(`/foods/${id}`);
}

export async function markFoodClaimed(id: number): Promise<FoodResponse> {
  const { data } = await api.put<FoodResponse>(`/foods/claim/${id}`);
  return data;
}


export async function markFoodPurchased(id: number): Promise<FoodResponse> {
  const { data } = await api.put<FoodResponse>(`/foods/purchase/${id}`);
  return data;
}

export async function getDonorRanking(): Promise<DonorRanking[]> {
  const { data } = await api.get<DonorRanking[]>('/foods/ranking/donors');
  return data;
}
