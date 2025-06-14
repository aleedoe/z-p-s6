import { apiService } from './api';
import { DashboardStats } from '../types';

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiService.get<DashboardStats>('/admin/dashboard/stats');
      return response;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
};