import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../services/apiService';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Button } from '../../components/ui/Button';
import { Building2, FileText, MapPin, CheckCircle2, Clock, AlertCircle, ShieldCheck } from 'lucide-react';

interface KycStatus {
    id: string;
    business_name: string;
    registration_number: string;
    business_address: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes?: string;
}

export const BusinessVerification = () => {
    const [kyc, setKyc] = useState<KycStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [businessName, setBusinessName] = useState('');
    const [regNumber, setRegNumber] = useState('');
    const [address, setAddress] = useState('');
    const [docUrl, setDocUrl] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const data = await fetchWithAuth('/kyc/status');
            if (data) {
                setKyc(data);
                setBusinessName(data.business_name);
                setRegNumber(data.registration_number);
                setAddress(data.business_address);
            }
        } catch (err) {
            console.error('Failed to fetch KYC status:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const result = await fetchWithAuth('/kyc/submit', {
                method: 'POST',
                body: JSON.stringify({
                    business_name: businessName,
                    registration_number: regNumber,
                    business_address: address,
                    document_url: docUrl
                })
            });
            setKyc(result);
            alert('Verification request submitted successfully!');
        } catch (err: any) {
            setError(err.message || 'Failed to submit verification');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-10 font-sans text-left">
            <div className="mb-10 pb-6 border-b border-slate-200/50">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                    <ShieldCheck className="text-indigo-600" size={28} />
                    Business Verification (KYC)
                </h1>
                <p className="text-slate-500 text-sm mt-1">Verify your business to unlock higher limits and build trust with your clients.</p>
            </div>

            {kyc?.status === 'approved' && (
                <div className="mb-8 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4 text-emerald-800 shadow-sm">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={24} className="text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Verified Business</h3>
                        <p className="text-emerald-700/80 text-sm">Your business has been successfully verified. Your details are now locked.</p>
                    </div>
                </div>
            )}

            {kyc?.status === 'pending' && (
                <div className="mb-8 p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-4 text-amber-800 shadow-sm">
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <Clock size={24} className="text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Verification Pending</h3>
                        <p className="text-amber-700/80 text-sm">We are reviewing your business details. This typically takes 24-48 hours. You can update your details if needed.</p>
                    </div>
                </div>
            )}

            {kyc?.status === 'rejected' && (
                <div className="mb-8 p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-800 shadow-sm">
                    <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                        <AlertCircle size={24} className="text-rose-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Verification Rejected</h3>
                        <p className="text-rose-700/80 text-sm">Notes: {kyc.admin_notes || 'Please provide clearer documentation.'}</p>
                    </div>
                </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">Business Details</h2>
                    <p className="text-slate-500 text-xs">These details will be used for your official business profile.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-sm flex items-center gap-2">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <Label htmlFor="biz-name" className="text-slate-700 font-bold flex items-center gap-2">
                                <Building2 size={16} className="text-slate-400" /> Legal Business Name
                            </Label>
                            <Input
                                id="biz-name"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                disabled={kyc?.status === 'approved'}
                                placeholder="DraftInvoice Inc."
                                className="h-12"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reg-num" className="text-slate-700 font-bold flex items-center gap-2">
                                <FileText size={16} className="text-slate-400" /> Registration Number (CAC/TIN)
                            </Label>
                            <Input
                                id="reg-num"
                                value={regNumber}
                                onChange={(e) => setRegNumber(e.target.value)}
                                disabled={kyc?.status === 'approved'}
                                placeholder="RC1234567"
                                className="h-12"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-slate-700 font-bold flex items-center gap-2">
                            <MapPin size={16} className="text-slate-400" /> Registered Business Address
                        </Label>
                        <textarea
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            disabled={kyc?.status === 'approved'}
                            placeholder="Enter full physical address..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none disabled:bg-slate-50 disabled:text-slate-500"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="doc-url" className="text-slate-700 font-bold flex items-center gap-2">
                            <FileText size={16} className="text-slate-400" /> Proof of Registration (Link)
                        </Label>
                        <Input
                            id="doc-url"
                            value={docUrl}
                            onChange={(e) => setDocUrl(e.target.value)}
                            disabled={kyc?.status === 'approved'}
                            placeholder="https://storage.provider.com/my-doc.pdf"
                            className="h-12"
                        />
                        <p className="text-[10px] text-slate-400">Please provide a direct link to your Certificate of Incorporation or equivalent.</p>
                    </div>

                    <div className="pt-4 flex justify-end">
                        {(() => {
                            let buttonText = 'Submit for Verification';
                            if (kyc?.status === 'approved') buttonText = 'Verification Complete';
                            else if (kyc) buttonText = 'Update Request';

                            return (
                                <Button
                                    type="submit"
                                    disabled={kyc?.status === 'approved' || submitting}
                                    isLoading={submitting}
                                    className={`px-8 h-12 text-lg font-bold shadow-lg transition-all ${kyc?.status === 'approved'
                                        ? 'bg-emerald-500 hover:bg-emerald-500 opacity-50 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                                        }`}
                                >
                                    {buttonText}
                                </Button>
                            );
                        })()}
                    </div>
                </form>
            </div>

            <div className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                <h4 className="font-bold text-slate-700 mb-2">Why verify?</h4>
                <ul className="text-sm text-slate-500 space-y-2">
                    <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-indigo-500" /> Remove daily download limits
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-indigo-500" /> Access premium and sector-specific invoice templates
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-indigo-500" /> Increased API rate limits for pro users
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-indigo-500" /> Trust badge on public invoice links
                    </li>
                </ul>
            </div>
        </div>
    );
};
