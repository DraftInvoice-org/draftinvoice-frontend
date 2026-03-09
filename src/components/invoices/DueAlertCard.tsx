import { AlertTriangle, Clock } from 'lucide-react';
import { getDueStatus, DUE_STATUS_LABEL } from '../../utils/invoiceDueStatus';
import type { InvoiceRecord } from '../../types/shared';

interface DueAlertCardProps {
    invoice: InvoiceRecord;
    onMarkPaid?: (id: string) => void;
    onSendEmail?: (id: string) => void;
    canSendEmail?: boolean;
}

export const DueAlertCard = ({ invoice, onMarkPaid, onSendEmail, canSendEmail }: DueAlertCardProps) => {
    const status = getDueStatus(invoice.due_date, invoice.payment_status);
    const isOverdue = status === 'overdue';
    const clientName = invoice.client_snapshot?.company_name ?? invoice.title;

    const daysText = (() => {
        if (!invoice.due_date) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(invoice.due_date);
        due.setHours(0, 0, 0, 0);
        const days = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days > 0) return `in ${days} day${days === 1 ? '' : 's'}`;
        return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`;
    })();

    return (
        <div className={`flex-shrink-0 w-64 rounded-2xl border p-4 ${isOverdue ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-start gap-2 mb-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isOverdue ? 'bg-red-100' : 'bg-amber-100'}`}>
                    {isOverdue
                        ? <AlertTriangle size={14} className="text-red-600" />
                        : <Clock size={14} className="text-amber-600" />
                    }
                </div>
                <div className="min-w-0">
                    <p className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${isOverdue ? 'text-red-600' : 'text-amber-600'}`}>
                        {DUE_STATUS_LABEL[status]}
                    </p>
                    <p className="text-sm font-semibold text-slate-800 truncate">{clientName}</p>
                    {invoice.invoice_number && <p className="text-xs text-slate-500">#{invoice.invoice_number}</p>}
                </div>
            </div>

            <div className="space-y-1 mb-3">
                {invoice.amount_due != null && (
                    <p className="text-xs text-slate-600 font-medium">
                        {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(invoice.amount_due)}
                    </p>
                )}
                {daysText && (
                    <p className={`text-xs font-semibold ${isOverdue ? 'text-red-600' : 'text-amber-700'}`}>Due {daysText}</p>
                )}
            </div>

            <div className="flex gap-2">
                {canSendEmail && onSendEmail && (
                    <button onClick={() => onSendEmail(invoice.id)} className="flex-1 text-xs py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors">
                        Send
                    </button>
                )}
                {onMarkPaid && (
                    <button onClick={() => onMarkPaid(invoice.id)} className="flex-1 text-xs py-1.5 rounded-lg border border-current font-semibold transition-colors text-slate-600 hover:bg-slate-100">
                        Mark Paid
                    </button>
                )}
            </div>
        </div>
    );
};
