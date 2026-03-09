/**
 * Formats a number as a currency string.
 * @param amount - The number to format
 * @param currency - The ISO 4217 currency code (default: 'USD')
 * @param locale - The locale string (default: 'en-US')
 */
export const formatCurrency = (amount: number, currency = 'USD', locale = 'en-US'): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount);
};

/**
 * Calculates the total from a list of invoice items.
 */
export const calculateTotal = (items: { qty: number; price: number }[]): number => {
    return items.reduce((sum, item) => sum + item.qty * item.price, 0);
};
