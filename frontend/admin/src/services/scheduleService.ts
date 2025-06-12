import { apiService } from './api';
import { Schedule, CreateScheduleData } from '../types';

export const scheduleService = {
  async getSchedules(params?: { date?: string; employeeId?: string }): Promise<Schedule[]> {
    return await apiService.get<Schedule[]>('/admin/schedules', params);
  },

  async createSchedule(data: CreateScheduleData): Promise<Schedule> {
    return await apiService.post<Schedule>('/admin/schedules', data);
  },

  async updateSchedule(id: string, data: Partial<CreateScheduleData>): Promise<Schedule> {
    return await apiService.put<Schedule>(`/admin/schedules/${id}`, data);
  },

  async deleteSchedule(id: string): Promise<void> {
    return await apiService.delete<void>(`/admin/schedules/${id}`);
  },
};