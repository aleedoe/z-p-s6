import { apiService } from './api';
import { DashboardStats } from '../types';

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    return await apiService.get<DashboardStats>('/admin/dashboard/stats');
  },
};