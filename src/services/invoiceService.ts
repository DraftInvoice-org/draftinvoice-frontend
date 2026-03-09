import { fetchWithAuth } from './apiService';

export const invoiceService = {
    getInvoices: () => fetchWithAuth('/invoices'),

    getInvoiceById: (id: string) => fetchWithAuth(`/invoices/${id}`),

    createInvoice: (data: any) => fetchWithAuth('/invoices', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    updateInvoice: (id: string, data: any) => fetchWithAuth(`/invoices/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    deleteInvoice: (id: string) => fetchWithAuth(`/invoices/${id}`, {
        method: 'DELETE',
    }),

    markPaid: (id: string) => fetchWithAuth(`/invoices/${id}/mark-paid`, {
        method: 'PATCH',
    }),
};
