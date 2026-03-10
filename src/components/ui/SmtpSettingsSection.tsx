import { useState, useEffect } from 'react';
import { Server, Loader2, CheckCircle2, Trash2 } from 'lucide-react';
import { fetchWithAuth } from '../../services/apiService';
import { useCanAccess } from '../../hooks/useCanAccess';
import { useUIStore } from '../../store/uiStore';
import { ProUpgradePrompt } from '../ui/ProUpgradePrompt';

interface SmtpForm {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
    from_name: string;
    from_email: string;
}

const EMPTY_FORM: SmtpForm = {
    host: '', port: 587, secure: false,
    username: '', password: '',
    from_name: '', from_email: '',
};

export const SmtpSettingsSection = () => {
    const canAccess = useCanAccess('custom_smtp');
    const [form, setForm] = useState<SmtpForm>(EMPTY_FORM);
    const [hasConfig, setHasConfig] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (!canAccess) { setLoading(false); return; }
        fetchWithAuth('/smtp')
            .then((data) => {
                if (data) {
                    setHasConfig(true);
                    setForm({ ...EMPTY_FORM, ...data, password: '' });
                }
            })
            .catch(() => { /* no config yet */ })
            .finally(() => setLoading(false));
    }, [canAccess]);

    const set = <K extends keyof SmtpForm>(key: K, value: SmtpForm[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSave = async (verify = false) => {
        setSaving(true); setStatus('idle'); setMsg('');
        try {
            await fetchWithAuth(`/smtp${verify ? '?verify=true' : ''}`, {
                method: 'PUT',
                body: JSON.stringify(form),
            });
            setHasConfig(true);
            setStatus('success');
            setMsg(verify ? 'Connection verified and settings saved!' : 'SMTP settings saved.');
        } catch (err: unknown) {
            setStatus('error');
            setMsg(err instanceof Error ? err.message : 'Failed to save SMTP settings');
        } finally {
            setSaving(false);
        }
    };

    const showDialog = useUIStore((state) => state.showDialog);

    const handleDelete = async () => {
        showDialog({
            type: 'confirm',
            title: 'Remove SMTP',
            message: 'Remove your custom SMTP configuration? The platform default will be used.',
            confirmText: 'Remove',
            onConfirm: async () => {
                try {
                    await fetchWithAuth('/smtp', { method: 'DELETE' });
                    setHasConfig(false);
                    setForm(EMPTY_FORM);
                    setStatus('idle');
                    setMsg('');
                } catch {
                    setMsg('Failed to remove SMTP settings.');
                }
            }
        });
    };

    if (!canAccess) {
        return (
            <ProUpgradePrompt
                feature="Bring Your Own SMTP"
                description="Use your own email address to send invoices to clients. Configure Gmail, Outlook, or any compatible SMTP provider."
            />
        );
    }

    if (loading) {
        return <div className="h-24 bg-slate-100 rounded-2xl animate-pulse" />;
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            {hasConfig && (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl text-sm">
                    <span className="flex items-center gap-2 text-green-700 font-semibold">
                        <CheckCircle2 size={16} /> Custom SMTP is active
                    </span>
                    <button onClick={handleDelete} className="text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label htmlFor="smtp-host" className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">SMTP Host</label>
                    <input id="smtp-host" value={form.host} onChange={(e) => set('host', e.target.value)} placeholder="smtp.gmail.com"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
                <div>
                    <label htmlFor="smtp-port" className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Port</label>
                    <input type="number" value={form.port} onChange={(e) => set('port', Number(e.target.value))} placeholder="587"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
                <div className="flex items-center gap-3 pt-6">
                    <button
                        type="button"
                        role="switch"
                        aria-checked={form.secure}
                        onClick={() => set('secure', !form.secure)}
                        className={`relative w-10 h-6 rounded-full transition-colors ${form.secure ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.secure ? 'translate-x-4' : ''}`} />
                    </button>
                    <span className="text-sm font-medium text-slate-700">Use SSL/TLS (port 465)</span>
                </div>
                <div>
                    <label htmlFor="smtp-username" className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Username</label>
                    <input id="smtp-username" value={form.username} onChange={(e) => set('username', e.target.value)} placeholder="you@gmail.com"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
                <div>
                    <label htmlFor="smtp-password" className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                        {hasConfig ? 'New Password (leave blank to keep current)' : 'Password / App Password'}
                    </label>
                    <input id="smtp-password" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="••••••••"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
                <div>
                    <label htmlFor="smtp-from-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Sender Name</label>
                    <input id="smtp-from-name" value={form.from_name} onChange={(e) => set('from_name', e.target.value)} placeholder="Your Business"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
                <div>
                    <label htmlFor="smtp-from-email" className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Sender Email</label>
                    <input type="email" value={form.from_email} onChange={(e) => set('from_email', e.target.value)} placeholder="billing@yourbiz.com"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
            </div>

            {/* Status feedback */}
            {status === 'success' && <p className="text-sm text-green-700 font-semibold">{msg}</p>}
            {status === 'error' && <p className="text-sm text-red-600">{msg}</p>}

            <div className="flex flex-wrap gap-3 pt-2">
                <button
                    onClick={() => handleSave(true)}
                    disabled={saving}
                    className="px-5 py-2.5 border border-indigo-200 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <Server size={15} />}
                    Verify &amp; Save
                </button>
                <button
                    onClick={() => handleSave(false)}
                    disabled={saving}
                    className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                    Save Without Verifying
                </button>
            </div>
        </div>
    );
};
