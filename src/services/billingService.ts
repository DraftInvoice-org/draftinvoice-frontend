import { fetchWithAuth } from './apiService';

export const billingService = {
    /**
     * Initializes a Paystack transaction and redirects the user to the checkout page.
     */
    async upgradeToPro() {
        const response = await fetchWithAuth('/billing/initialize', {
            method: 'POST',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to initialize upgrade');
        }

        const data = await response.json() as { authorizationUrl: string; reference: string };

        // Redirect the user to Paystack's safe checkout page
        globalThis.window.location.href = data.authorizationUrl;
    },

    /**
     * Verifies the status of a specific payment reference.
     */
    async verifyPayment(reference: string) {
        const response = await fetchWithAuth(`/billing/verify?reference=${encodeURIComponent(reference)}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Payment verification failed');
        }

        return await response.json() as { success: boolean; alreadyPro: boolean };
    },

    /**
     * Checks if the user has any pending payments and attempts to resolve them.
     */
    async checkBillingStatus() {
        const response = await fetchWithAuth('/billing/status');
        if (!response.ok) return { found: false, success: false };
        return await response.json() as { found: boolean; success: boolean };
    }
};
