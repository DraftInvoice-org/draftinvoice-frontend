import { fetchWithAuth } from './apiService';

export interface ApiKey {
    id: string;
    user_id: string;
    name: string;
    key_prefix: string;
    last_used_at: string | null;
    created_at: string;
}

export const apiKeyService = {
    async listKeys(): Promise<ApiKey[]> {
        const res = await fetchWithAuth('/apikeys');
        return res?.keys || [];
    },

    async generateKey(name: string): Promise<{ apiKey: ApiKey, rawKey: string }> {
        return await fetchWithAuth('/apikeys', {
            method: 'POST',
            body: JSON.stringify({ name })
        });
    },

    async revokeKey(id: string): Promise<void> {
        await fetchWithAuth(`/apikeys/${id}`, { method: 'DELETE' });
    }
};
