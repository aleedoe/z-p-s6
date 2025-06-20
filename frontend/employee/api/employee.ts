import api from './axios';
import { ApiResponse, Schedule, Attendance } from '@/types';

// Get employee schedule
export const getSchedule = async (startDate?: string, endDate?: string) => {
    try {
        const params = { startDate, endDate };
        const response = await api.get<ApiResponse<Schedule[]>>('/employee/schedule', { params });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Get today's schedule
export const getTodaySchedule = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const response = await api.get<ApiResponse<Schedule[]>>('/employee/schedule', {
            params: { startDate: today, endDate: today }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Check in attendance with QR code
export const checkInAttendance = async (qrToken: string) => {
    try {
        const response = await api.post<ApiResponse<Attendance>>('/employee/attendance/check-in', {
            qrToken
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Get attendance history
export const getAttendanceHistory = async (month?: string, year?: string) => {
    try {
        const params = { month, year };
        const response = await api.get<ApiResponse<Attendance[]>>('/employee/attendance/history', { params });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};