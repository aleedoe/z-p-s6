export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
}

export interface Employee {
  role: string;
  isActive: undefined;
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  shiftStart: string;
  shiftEnd: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  shiftStart: string;
  shiftEnd: string;
  status: 'present' | 'late' | 'absent';
}

export interface Notification {
  id: string;
  type: 'check-in' | 'check-out' | 'schedule' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export type RecentActivity = {
  type: string;
  employeeName: string;
  time: Date;
  createdAt: Date;
};

export type DashboardStats = {
  totalEmployees: number;
  todayScheduled: number;
  todayCheckedIn: number;
  pendingSchedules: number;
  recentActivities: RecentActivity[];
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CreateEmployeeData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

export interface CreateScheduleData {
  employeeId: string;
  date: string;
  shiftStart: string;
  shiftEnd: string;
  location: string;
}