import { apiService } from './api';
import { Attendance } from '../types';

export const attendanceService = {
  async getDailyAttendance(date?: string): Promise<Attendance[]> {
    return await apiService.get<Attendance[]>('/admin/attendance/daily', { date });
  },

  async getMonthlyAttendance(year?: number, month?: number): Promise<any> {
    return await apiService.get<any>('/admin/attendance/monthly', { year, month });
  },
};