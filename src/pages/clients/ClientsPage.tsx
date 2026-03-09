import { useState, useEffect } from 'react';
import { Users, Plus, Building2, Mail, Phone, Trash2, Pencil, Search } from 'lucide-react';
import { clientService } from '../../services/clientService';
import { useCanAccess } from '../../hooks/useCanAccess';
import { ProUpgradePrompt } from '../../components/ui/ProUpgradePrompt';
import { ClientModal } from './ClientModal';
import type { ClientRecord } from 'types/shared';

export const ClientsPage = () => {
    const canAccess = useCanAccess('client_list');
    const [clients, setClients] = useState<ClientRecord[]>([]);
    const [filtered, setFiltered] = useState<ClientRecord[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<ClientRecord | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!canAccess) { setLoading(false); return; }
        clientService.list()
            .then((data) => { setClients(data); setFiltered(data); })
            .catch(() => setError('Failed to load clients'))
            .finally(() => setLoading(false));
    }, [canAccess]);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(clients.filter((c) =>
            c.company_name.toLowerCase().includes(q) ||
            (c.contact_name ?? '').toLowerCase().includes(q) ||
            (c.email ?? '').toLowerCase().includes(q)
        ));
    }, [search, clients]);

    const handleSaved = (saved: ClientRecord) => {
        setClients((prev) => {
            const exists = prev.find((c) => c.id === saved.id);
            return exists ? prev.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...prev];
        });
        setModalOpen(false);
        setEditing(null);
    };

    const handleDelete = async (id: string) => {
        if (!globalThis.window.confirm('Delete this client? Their invoices will be unlinked but not deleted.')) return;
        await clientService.delete(id);
        setClients((prev) => prev.filter((c) => c.id !== id));
    };

    const openEdit = (client: ClientRecord) => { setEditing(client); setModalOpen(true); };
    const openCreate = () => { setEditing(null); setModalOpen(true); };

    if (!canAccess) {
        return (
            <div className="max-w-4xl mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Client List</h1>
                    <p className="text-slate-500 mt-1">Save client profiles and auto-fill invoices.</p>
                </div>
                <ProUpgradePrompt
                    feature="Client List"
                    description="Save client profiles once and auto-populate their details in every invoice you create. Track all invoices per client and never retype an address again."
                />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 text-left">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Clients</h1>
                    <p className="text-slate-500 mt-1 text-sm">{clients.length} saved client{clients.length === 1 ? '' : 's'}</p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/25"
                >
                    <Plus size={16} /> New Client
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search clients…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
            </div>

            {/* Error */}
            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">{error}</div>}

            {/* Loading */}
            {loading && (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />)}
                </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Users size={28} className="text-indigo-400" />
                    </div>
                    <h3 className="text-slate-700 font-semibold mb-1">{search ? 'No results found' : 'No clients yet'}</h3>
                    <p className="text-slate-400 text-sm mb-5">{search ? 'Try a different search term.' : 'Add your first client to get started.'}</p>
                    {!search && (
                        <button onClick={openCreate} className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
                            Add Client
                        </button>
                    )}
                </div>
            )}

            {/* Client Cards */}
            {!loading && filtered.length > 0 && (
                <div className="space-y-3">
                    {filtered.map((client) => (
                        <div key={client.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 flex items-center gap-4 group hover:border-indigo-100 hover:shadow-md transition-all">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 text-white font-bold text-lg shadow">
                                {client.company_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-800 truncate">{client.company_name}</p>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-0.5">
                                    {client.contact_name && <span className="text-xs text-slate-500 flex items-center gap-1"><Building2 size={11} />{client.contact_name}</span>}
                                    {client.email && <span className="text-xs text-slate-500 flex items-center gap-1"><Mail size={11} />{client.email}</span>}
                                    {client.phone && <span className="text-xs text-slate-500 flex items-center gap-1"><Phone size={11} />{client.phone}</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEdit(client)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors" title="Edit">
                                    <Pencil size={15} />
                                </button>
                                <button onClick={() => handleDelete(client.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modalOpen && (
                <ClientModal
                    client={editing}
                    onClose={() => { setModalOpen(false); setEditing(null); }}
                    onSaved={handleSaved}
                />
            )}
        </div>
    );
};
