import { fetchWithAuth } from './apiService';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const authService = {
    async signup(email: string, password: string) {
        const data = await fetchWithAuth('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        useAuthStore.getState().login(data.user, data.token);
        return data;
    },

    async login(email: string, password: string) {
        const data = await fetchWithAuth('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        useAuthStore.getState().login(data.user, data.token);
        return data;
    },

    async logout() {
        await fetchWithAuth('/auth/logout', { method: 'POST' });
        useAuthStore.getState().logout();
    },

    async forgotPassword(email: string) {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to send reset link');
        }
        return response.json();
    },

    async resetPassword(token: string, password: string) {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to reset password');
        }
        return response.json();
    },

    async me() {
        const user = await fetchWithAuth('/auth/me');
        // Update user data in store but keep existing token
        useAuthStore.setState({ user });
        return user;
    }
};
