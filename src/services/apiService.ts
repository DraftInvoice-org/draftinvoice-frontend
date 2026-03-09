import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = useAuthStore.getState().token;
    const headers = new Headers(options.headers);

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Default to JSON if not specified
    if (!headers.has('Content-Type') && options.method !== 'GET') {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || errorData?.message || response.statusText;
        throw Object.assign(new Error(errorMessage), {
            status: response.status,
            ...errorData
        });
    }

    // Some endpoints return 204 No Content
    if (response.status === 204) return null;
    return response.json();
};

export const apiService = {
    fetchTemplates: () => fetchWithAuth('/templates'),

    fetchTemplateById: (id: string) => fetchWithAuth(`/templates/${id}`),

    saveTemplate: (data: any) => fetchWithAuth('/templates', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};

export { fetchWithAuth };
