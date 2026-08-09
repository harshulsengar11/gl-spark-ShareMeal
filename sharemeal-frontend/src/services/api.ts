import axios, { AxiosError } from 'axios';
import type { ApiErrorBody } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shareMealToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody | Record<string, string>>) => {
    if (error.response?.status === 401) {
      // Token missing/expired/invalid — force a clean login.
      localStorage.removeItem('shareMealToken');
      localStorage.removeItem('shareMealUser');
    }
    return Promise.reject(error);
  }
);

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | Record<string, string> | undefined;

    if (data) {
      if (typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
        return data.message;
      }

      const values = Object.values(data).filter((v) => typeof v === 'string');
      if (values.length > 0) {
        return values.join(' ');
      }
    }

    if (error.code === 'ERR_NETWORK') {
      return 'Cannot reach the server. Make sure the API Gateway and services are running.';
    }

    if (error.message) {
      return error.message;
    }
  }

  return 'Something went wrong. Please try again.';
}

export default api;
