import { apiService } from './api';
import { Notification } from '../types';

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    return await apiService.get<Notification[]>('/admin/notifications');
  },

  async markAsRead(id: string): Promise<void> {
    return await apiService.put<void>(`/admin/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    return await apiService.put<void>('/admin/notifications/read-all');
  },
};