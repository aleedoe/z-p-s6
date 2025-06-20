import { create } from 'zustand';

interface UIState {
    isLoading: boolean;
    loadingMessage: string;
    toast: {
        visible: boolean;
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
    };
}

export const useUIStore = create<
    UIState & {
        showLoading: (message?: string) => void;
        hideLoading: () => void;
        showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
        hideToast: () => void;
    }
>((set) => ({
    isLoading: false,
    loadingMessage: '',
    toast: {
        visible: false,
        message: '',
        type: 'info',
    },

    showLoading: (message = 'Loading...') => set({ isLoading: true, loadingMessage: message }),
    hideLoading: () => set({ isLoading: false, loadingMessage: '' }),

    showToast: (message, type) => set({
        toast: {
            visible: true,
            message,
            type,
        },
    }),

    hideToast: () => set({
        toast: {
            visible: false,
            message: '',
            type: 'info',
        },
    }),
}));