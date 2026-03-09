import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { fetchWithAuth } from '../../services/apiService';
import type { InvoiceRecord } from '../../types/shared';

interface SendEmailModalProps {
    invoice: InvoiceRecord;
    onClose: () => void;
    onSent: () => void;
    getPdfBase64: () => Promise<string>;
}

export const SendEmailModal = ({ invoice, onClose, onSent, getPdfBase64 }: SendEmailModalProps) => {
    const clientEmail = invoice.client_snapshot?.email ?? '';
    const clientName = invoice.client_snapshot?.contact_name ?? invoice.client_snapshot?.company_name ?? '';
    const defaultSubject = `Invoice${invoice.invoice_number ? ` #${invoice.invoice_number}` : ''} — ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`;

    const [subject, setSubject] = useState(defaultSubject);
    const [note, setNote] = useState('');
    const [status, setStatus] = useState<'idle' | 'generating' | 'sending' | 'done' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSend = async () => {
        if (!clientEmail) { setErrorMsg('No client email on this invoice.'); return; }
        try {
            setStatus('generating'); setErrorMsg('');
            const pdfBase64 = await getPdfBase64();

            setStatus('sending');
            await fetchWithAuth(`/invoices/${invoice.id}/send-email`, {
                method: 'POST',
                body: JSON.stringify({
                    pdfBase64,
                    filename: `Invoice${invoice.invoice_number ? `-${invoice.invoice_number}` : ''}.pdf`,
                    note: note.trim() || undefined,
                }),
            });
            setStatus('done');
            setTimeout(onSent, 1200);
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : 'Failed to send email');
            setStatus('error');
        }
    };

    const isBusy = status === 'generating' || status === 'sending';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">Send Invoice to Client</h2>
                    <button onClick={onClose} disabled={isBusy} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50">
                        <X size={18} className="text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* To */}
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">To</div>
                        <div className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 font-medium">
                            {clientName ? `${clientName} — ` : ''}{clientEmail || <span className="text-red-500 italic">No email on file</span>}
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Subject</div>
                        <input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>

                    {/* Note */}
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Personal Note (optional)</div>
                        <textarea
                            rows={3}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="e.g. Please find your invoice attached. Let me know if you have questions."
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>

                    {/* Status messages */}
                    {status === 'generating' && (
                        <div className="flex items-center gap-2 text-sm text-indigo-600"><Loader2 size={15} className="animate-spin" /> Generating PDF…</div>
                    )}
                    {status === 'sending' && (
                        <div className="flex items-center gap-2 text-sm text-indigo-600"><Loader2 size={15} className="animate-spin" /> Sending email…</div>
                    )}
                    {status === 'done' && (
                        <div className="text-sm text-green-600 font-semibold">✓ Email sent successfully!</div>
                    )}
                    {status === 'error' && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{errorMsg}</div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
                    <button onClick={onClose} disabled={isBusy} type="button" className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm disabled:opacity-50">
                        {status === 'done' ? 'Close' : 'Cancel'}
                    </button>
                    {status !== 'done' && (
                        <button onClick={handleSend} disabled={isBusy || !clientEmail} className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                            <Send size={14} /> {isBusy ? 'Working…' : 'Send Invoice'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
