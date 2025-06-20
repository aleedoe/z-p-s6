import api from './axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { ApiResponse, User } from '@/types';

// Use appropriate storage based on platform
const storage = Platform.OS === 'web'
    ? {
        getItemAsync: async (key: string) => localStorage.getItem(key),
        setItemAsync: async (key: string, value: string) => { localStorage.setItem(key, value); },
        deleteItemAsync: async (key: string) => { localStorage.removeItem(key); }
    }
    : SecureStore;

interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export const login = async (email: string, password: string) => {
    try {
        const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
            email,
            password,
        });

        const { accessToken, refreshToken, user } = response.data.data;

        // Store tokens securely
        await storage.setItemAsync('accessToken', accessToken);
        await storage.setItemAsync('refreshToken', refreshToken);

        return { user, accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        await api.post('/auth/logout');

        // Clear stored tokens
        await storage.deleteItemAsync('accessToken');
        await storage.deleteItemAsync('refreshToken');

        return true;
    } catch (error) {
        // Still clear tokens even if API call fails
        await storage.deleteItemAsync('accessToken');
        await storage.deleteItemAsync('refreshToken');
        throw error;
    }
};

export const refreshAuthToken = async () => {
    try {
        const refreshToken = await storage.getItemAsync('refreshToken');

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await api.post<ApiResponse<{ accessToken: string, refreshToken: string }>>('/auth/refresh', {
            refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Store new tokens
        await storage.setItemAsync('accessToken', accessToken);
        await storage.setItemAsync('refreshToken', newRefreshToken);

        return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
        throw error;
    }
};

export const checkAuthStatus = async (): Promise<boolean> => {
    try {
        const accessToken = await storage.getItemAsync('accessToken');
        return !!accessToken;
    } catch (error) {
        return false;
    }
};