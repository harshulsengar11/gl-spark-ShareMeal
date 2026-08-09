import api from './api';
import type { NotificationRequest, NotificationResponse } from '../types';

export async function createNotification(
  payload: NotificationRequest
): Promise<NotificationResponse> {
  const { data } = await api.post<NotificationResponse>('/notifications', payload);
  return data;
}

export async function getAllNotifications(): Promise<NotificationResponse[]> {
  const { data } = await api.get<NotificationResponse[]>('/notifications');
  return data;
}

export async function getNotificationById(id: number): Promise<NotificationResponse> {
  const { data } = await api.get<NotificationResponse>(`/notifications/${id}`);
  return data;
}

export async function getNotificationsByEmail(email: string): Promise<NotificationResponse[]> {
  const { data } = await api.get<NotificationResponse[]>(
    `/notifications/user/${encodeURIComponent(email)}`
  );
  return data;
}

export async function markNotificationAsRead(id: number): Promise<NotificationResponse> {
  const { data } = await api.put<NotificationResponse>(`/notifications/read/${id}`);
  return data;
}
