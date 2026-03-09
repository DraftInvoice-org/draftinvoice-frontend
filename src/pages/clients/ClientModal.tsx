import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { clientService, type CreateClientInput } from '../../services/clientService';
import type { ClientRecord } from 'types/shared';

interface ClientModalProps {
    client?: ClientRecord | null;
    onClose: () => void;
    onSaved: (client: ClientRecord) => void;
}

interface FieldProps {
    label: string;
    field: keyof CreateClientInput;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (key: keyof CreateClientInput, value: string) => void;
}

const FormField = ({ label, field, type = 'text', placeholder = '', value, onChange }: FieldProps) => (
    <div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</div>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
    </div>
);

const EMPTY: Partial<CreateClientInput> = {
    company_name: '', contact_name: '', email: '', phone: '',
    address_line1: '', address_line2: '', city: '', state: '', zip: '',
    country: 'NG', tax_id: '',
};

export const ClientModal = ({ client, onClose, onSaved }: ClientModalProps) => {
    const [form, setForm] = useState<Partial<CreateClientInput>>(client ?? EMPTY);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => { setForm(client ?? EMPTY); }, [client]);

    const handleChange = (key: keyof CreateClientInput, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.company_name?.trim()) { setError('Company name is required'); return; }
        setLoading(true); setError(null);
        try {
            const saved = client
                ? await clientService.update(client.id, form)
                : await clientService.create(form);
            onSaved(saved);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to save client');
        } finally {
            setLoading(false);
        }
    };

    const val = (field: keyof CreateClientInput) => (form[field] as string) ?? '';
    const addCl_saveChanges = client ? 'Save Changes' : 'Add Client';
    const submitLabel = loading ? 'Saving…' : addCl_saveChanges;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">{client ? 'Edit Client' : 'New Client'}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                        <X size={18} className="text-slate-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
                    {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

                    <FormField label="Company Name *" field="company_name" placeholder="Acme Inc." value={val('company_name')} onChange={handleChange} />
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Contact Name" field="contact_name" placeholder="John Smith" value={val('contact_name')} onChange={handleChange} />
                        <FormField label="Email" field="email" type="email" placeholder="john@acme.com" value={val('email')} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Phone" field="phone" placeholder="+234..." value={val('phone')} onChange={handleChange} />
                        <FormField label="Tax / VAT ID" field="tax_id" placeholder="Optional" value={val('tax_id')} onChange={handleChange} />
                    </div>
                    <FormField label="Address Line 1" field="address_line1" placeholder="123 Main St" value={val('address_line1')} onChange={handleChange} />
                    <FormField label="Address Line 2" field="address_line2" placeholder="Suite 400 (optional)" value={val('address_line2')} onChange={handleChange} />
                    <div className="grid grid-cols-3 gap-3">
                        <FormField label="City" field="city" placeholder="Lagos" value={val('city')} onChange={handleChange} />
                        <FormField label="State" field="state" placeholder="Lagos" value={val('state')} onChange={handleChange} />
                        <FormField label="ZIP" field="zip" placeholder="100001" value={val('zip')} onChange={handleChange} />
                    </div>
                    <FormField label="Country" field="country" placeholder="NG" value={val('country')} onChange={handleChange} />
                </form>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
                    <button onClick={onClose} type="button" className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm">
                        Cancel
                    </button>
                    <button type="submit" onClick={handleSubmit} disabled={loading} className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors text-sm disabled:opacity-60">
                        {submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};
