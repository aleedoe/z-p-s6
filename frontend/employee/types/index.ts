export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface Schedule {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Attendance {
    id: string;
    date: string;
    checkInTime: string;
    checkOutTime?: string;
    status: 'on-time' | 'late' | 'absent';
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}