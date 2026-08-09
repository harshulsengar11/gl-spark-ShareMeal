import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest, UserResponse } from '../types';

export async function register(payload: RegisterRequest): Promise<UserResponse> {
  const { data } = await api.post<UserResponse>('/auth/register', payload);
  return data;
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function getProfile(): Promise<UserResponse> {
  const { data } = await api.get<UserResponse>('/auth/profile');
  return data;
}

export async function updateProfile(payload: RegisterRequest): Promise<UserResponse> {
  const { data } = await api.put<UserResponse>('/auth/profile', payload);
  return data;
}

export async function getUserByEmail(email: string): Promise<UserResponse> {
  const { data } = await api.get<UserResponse>(`/auth/internal/user/${encodeURIComponent(email)}`);
  return data;
}
