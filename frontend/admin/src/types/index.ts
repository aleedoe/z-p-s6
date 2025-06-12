export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
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

export interface DashboardStats {
  totalEmployees: number;
  todayScheduled: number;
  todayCheckedIn: number;
  pendingSchedules: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
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
  position: string;
}

export interface CreateScheduleData {
  employeeId: string;
  date: string;
  shiftStart: string;
  shiftEnd: string;
  location: string;
}