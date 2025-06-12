import { apiService } from './api';
import { LoginCredentials, AuthResponse, User } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await apiService.post<AuthResponse>('/auth/login', credentials);
  },

  async logout(): Promise<void> {
    return await apiService.post<void>('/auth/logout');
  },

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    return await apiService.post<{ token: string }>('/auth/refresh', {
      refreshToken,
    });
  },

  async getCurrentUser(): Promise<User> {
    return await apiService.get<User>('/auth/me');
  },
};