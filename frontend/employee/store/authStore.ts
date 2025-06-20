import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User } from '@/types';
import * as authApi from '@/api/auth';

interface AuthStoreState extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuthToken: () => Promise<void>;
    clearError: () => void;
    setUser: (user: User) => void;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set) => ({
            ...initialState,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const { user, accessToken, refreshToken } = await authApi.login(email, password);
                    set({
                        user,
                        accessToken,
                        refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        ...initialState,
                        isLoading: false,
                        error: error instanceof Error ? error.message : "Login failed",
                    });
                    throw error;
                }
            },

            logout: async () => {
                set({ isLoading: true });
                try {
                    await authApi.logout();
                    set({ ...initialState });
                } catch (error) {
                    set({
                        ...initialState,
                        error: error instanceof Error ? error.message : "Logout failed",
                    });
                }
            },

            refreshAuthToken: async () => {
                set({ isLoading: true });
                try {
                    const { accessToken, refreshToken } = await authApi.refreshAuthToken();
                    set({
                        accessToken,
                        refreshToken,
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        ...initialState,
                        error: error instanceof Error ? error.message : "Token refresh failed",
                    });
                }
            },

            clearError: () => set({ error: null }),

            setUser: (user: User) => set({ user }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);