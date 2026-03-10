import { useState, useEffect } from 'react';
import { apiKeyService, type ApiKey } from '../../services/apiKeyService';
import { Plus, Trash2, Copy, Check, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

export const ApiKeysSection = () => {
    const user = useAuthStore((state) => state.user);
    const showDialog = useUIStore((state) => state.showDialog);
    const isPro = user?.plan === 'pro';

    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [newRawKey, setNewRawKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isPro) {
            loadKeys();
        } else {
            setLoading(false);
        }
    }, [isPro]);

    const loadKeys = async () => {
        try {
            const data = await apiKeyService.listKeys();
            setKeys(data);
        } catch (error) {
            console.error('Failed to load API keys', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!newKeyName.trim()) return;
        setGenerating(true);
        try {
            const data = await apiKeyService.generateKey(newKeyName.trim());
            setNewRawKey(data.rawKey);
            setKeys((prev) => [data.apiKey, ...prev]);
            setNewKeyName('');
        } catch (error) {
            console.error(error);
            showDialog({
                type: 'error',
                title: 'Generation Failed',
                message: 'Failed to generate API key'
            });
        } finally {
            setGenerating(false);
        }
    };

    const handleRevoke = async (id: string) => {
        showDialog({
            type: 'confirm',
            title: 'Revoke API Key',
            message: 'Are you sure you want to revoke this key? Any integrations using it will immediately break.',
            confirmText: 'Revoke Key',
            onConfirm: async () => {
                try {
                    await apiKeyService.revokeKey(id);
                    setKeys((prev) => prev.filter(k => k.id !== id));
                    showDialog({
                        type: 'success',
                        title: 'Key Revoked',
                        message: 'The API key has been successfully revoked.'
                    });
                } catch (error) {
                    console.error(error);
                    showDialog({
                        type: 'error',
                        title: 'Revocation Failed',
                        message: 'Failed to revoke API key'
                    });
                }
            }
        });
    };

    const handleCopy = () => {
        if (newRawKey) {
            globalThis.window.navigator.clipboard.writeText(newRawKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const StatusIcon = copied ? Check : Copy;
    const statusText = copied ? 'Copied' : 'Copy';

    const renderTableContent = () => {
        if (loading) {
            return <div className="p-8 text-center text-slate-400 text-sm font-medium">Loading API keys...</div>;
        }

        if (keys.length === 0) {
            return <div className="p-8 text-center text-slate-400 text-sm font-medium">No API keys generated yet.</div>;
        }

        return (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-bold uppercase tracking-wide text-xs">Name</th>
                            <th className="px-6 py-3 font-bold uppercase tracking-wide text-xs">Prefix</th>
                            <th className="px-6 py-3 font-bold uppercase tracking-wide text-xs">Created</th>
                            <th className="px-6 py-3 font-bold uppercase tracking-wide text-xs">Last Used</th>
                            <th className="px-6 py-3 text-right font-bold uppercase tracking-wide text-xs">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {keys.map(key => (
                            <ApiKeyRow key={key.id} keyData={key} onRevoke={handleRevoke} />
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    if (!isPro) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden relative">
                <div className="flex flex-col items-center justify-center py-8 text-center relative z-10">
                    <ShieldAlert size={40} className="text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Developer API Access</h3>
                    <p className="text-slate-500 max-w-sm text-sm mb-6">
                        Programmatically generate and dispatch PDF invoices using the highly scalable DraftInvoice API. Upgrade to the Pro plan to unlock your API keys.
                    </p>
                    <button className="px-5 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl transition-colors hover:bg-indigo-100 flex items-center gap-2 text-sm">
                        Upgrade to Unlock API
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Generate API Key</h3>
                        <p className="text-xs text-slate-400 mb-3 max-w-md">Create a new key to authenticate your server's requests. Treat your API keys like passwords—do not embed them in client-side code.</p>

                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="e.g. Production Web Backend"
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 w-full max-w-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={generating || !newKeyName.trim()}
                                className="shrink-0 px-4 py-2 bg-slate-800 text-white font-bold rounded-lg shadow-sm transition-colors hover:bg-slate-700 flex items-center gap-2 text-sm disabled:opacity-50"
                            >
                                <Plus size={16} /> {generating ? 'Creating...' : 'Create Key'}
                            </button>
                        </div>
                    </div>
                </div>

                {newRawKey && (
                    <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl relative">
                        <h4 className="text-sm font-bold text-emerald-800 mb-2">Save this key now!</h4>
                        <p className="text-xs text-emerald-600 mb-3">Make sure to copy your API key now. You won't be able to see it again!</p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 bg-white border border-emerald-200 px-4 py-2 rounded-lg text-sm font-mono text-slate-800 break-all">
                                {newRawKey}
                            </code>
                            <button
                                onClick={handleCopy}
                                className="shrink-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 text-sm"
                            >
                                <StatusIcon size={16} />
                                {statusText}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-0">
                {renderTableContent()}
            </div>
        </div>
    );
};

const ApiKeyRow = ({ keyData, onRevoke }: { keyData: ApiKey; onRevoke: (id: string) => void }) => {
    return (
        <tr className="hover:bg-slate-50/50">
            <td className="px-6 py-4 font-bold text-slate-700">{keyData.name}</td>
            <td className="px-6 py-4 font-mono text-slate-500">{keyData.key_prefix}••••••••</td>
            <td className="px-6 py-4 text-slate-500">{new Date(keyData.created_at).toLocaleDateString()}</td>
            <td className="px-6 py-4 text-slate-500">
                {keyData.last_used_at ? new Date(keyData.last_used_at).toLocaleDateString() : 'Never'}
            </td>
            <td className="px-6 py-4 text-right">
                <button
                    onClick={() => onRevoke(keyData.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Revoke Key"
                >
                    <Trash2 size={16} />
                </button>
            </td>
        </tr>
    );
};
