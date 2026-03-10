import { fetchWithAuth } from './apiService';

export const billingService = {
    /**
     * Initializes a Paystack transaction and redirects the user to the checkout page.
     */
    async upgradeToPro() {
        const data = await fetchWithAuth('/billing/initialize', {
            method: 'POST',
        }) as { authorizationUrl: string; reference: string };

        // Redirect the user to Paystack's safe checkout page
        globalThis.window.location.href = data.authorizationUrl;
    },

    /**
     * Verifies the status of a specific payment reference.
     */
    async verifyPayment(reference: string) {
        return await fetchWithAuth(`/billing/verify?reference=${encodeURIComponent(reference)}`) as { success: boolean; alreadyPro: boolean };
    },

    /**
     * Checks if the user has any pending payments and attempts to resolve them.
     */
    async checkBillingStatus() {
        try {
            return await fetchWithAuth('/billing/status') as { found: boolean; success: boolean };
        } catch {
            return { found: false, success: false };
        }
    }
};
