import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Create a mock secure storage for web
const webStorage = {
    getItemAsync: async (key: string) => {
        return localStorage.getItem(key);
    },
    setItemAsync: async (key: string, value: string) => {
        localStorage.setItem(key, value);
        return;
    },
    deleteItemAsync: async (key: string) => {
        localStorage.removeItem(key);
        return;
    },
};

// Use appropriate storage based on platform
const storage = Platform.OS === 'web' ? webStorage : SecureStore;

// Base API configuration
const API_URL = 'http://192.168.2.3:3000'; // Replace with actual API URL

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await storage.getItemAsync('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await storage.getItemAsync('refreshToken');

                if (!refreshToken) {
                    // No refresh token, redirect to login
                    throw new Error('No refresh token available');
                }

                // Call refresh token endpoint
                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data.data;

                // Store new tokens
                await storage.setItemAsync('accessToken', accessToken);
                await storage.setItemAsync('refreshToken', newRefreshToken);

                // Update authorization header and retry
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }
                return api(originalRequest);
            } catch (refreshError) {
                // Clear tokens and redirect to login
                await storage.deleteItemAsync('accessToken');
                await storage.deleteItemAsync('refreshToken');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;