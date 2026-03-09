import { fetchWithAuth } from './apiService';
import { type ClientRecord } from '../types/shared';

export type CreateClientInput = Pick<ClientRecord,
    'company_name' | 'contact_name' | 'email' | 'phone' |
    'address_line1' | 'address_line2' | 'city' | 'state' | 'zip' | 'country' | 'tax_id'
>;

export const clientService = {
    list: (): Promise<ClientRecord[]> =>
        fetchWithAuth('/clients'),

    get: (id: string): Promise<ClientRecord> =>
        fetchWithAuth(`/clients/${id}`),

    create: (data: Partial<CreateClientInput>): Promise<ClientRecord> =>
        fetchWithAuth('/clients', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: Partial<CreateClientInput>): Promise<ClientRecord> =>
        fetchWithAuth(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    delete: (id: string): Promise<null> =>
        fetchWithAuth(`/clients/${id}`, { method: 'DELETE' }),
};
