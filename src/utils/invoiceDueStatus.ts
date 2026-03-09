export type DueStatus = 'paid' | 'overdue' | 'due-soon' | 'on-track' | 'none';

/**
 * Pure utility — no side effects, no imports.
 * Determines the payment due status for visual UI indicators.
 *
 * @param dueDate    ISO date string (YYYY-MM-DD) or null
 * @param paymentStatus  'unpaid' | 'paid' | 'overdue'
 */
export function getDueStatus(
    dueDate: string | null,
    paymentStatus: string
): DueStatus {
    if (paymentStatus === 'paid') return 'paid';
    if (paymentStatus === 'overdue') return 'overdue';
    if (!dueDate) return 'none';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const daysUntilDue = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 7) return 'due-soon';
    return 'on-track';
}

export const DUE_STATUS_LABEL: Record<DueStatus, string> = {
    'paid': 'Paid',
    'overdue': 'Overdue',
    'due-soon': 'Due Soon',
    'on-track': 'On Track',
    'none': '',
};

export const DUE_STATUS_COLOR: Record<DueStatus, string> = {
    'paid': 'bg-green-100 text-green-700',
    'overdue': 'bg-red-100 text-red-700',
    'due-soon': 'bg-amber-100 text-amber-700',
    'on-track': 'bg-blue-50 text-blue-600',
    'none': 'bg-slate-100 text-slate-500',
};

export const DUE_STATUS_DOT: Record<DueStatus, string> = {
    'paid': 'bg-green-500',
    'overdue': 'bg-red-500',
    'due-soon': 'bg-amber-400',
    'on-track': 'bg-blue-400',
    'none': 'bg-slate-300',
};
