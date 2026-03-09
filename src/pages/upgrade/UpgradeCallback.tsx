import { ArrowRight, Loader2, RefreshCcw, ShieldCheck, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchWithAuth } from '../../services/apiService';
import { authService } from '../../services/authService';

type Status = 'loading' | 'success' | 'failed' | 'idle';

export const UpgradeCallback = () => {
    const [searchParams] = useSearchParams();
    const reference = searchParams.get('reference') ?? '';
    const trxref = searchParams.get('trxref') ?? ''; // Sometimes passed by Paystack
    const activeRef = reference || trxref;

    const [status, setStatus] = useState<Status>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const verifiedRef = useRef(false);

    useEffect(() => {
        if (!activeRef) {
            setStatus('failed');
            setErrorMsg('No payment reference found in URL.');
            return;
        }

        if (verifiedRef.current) return;
        verifiedRef.current = true;

        const verifyPayment = async () => {
            setStatus('loading');
            try {
                const res = await fetchWithAuth(`/billing/verify?reference=${encodeURIComponent(activeRef)}`);
                if (res && res.success) {
                    // Refetch user to update plan in store
                    await authService.me();
                    setStatus('success');
                } else {
                    setStatus('failed');
                    setErrorMsg('Payment verification failed or was not successful.');
                }
            } catch (err: unknown) {
                setStatus('failed');
                setErrorMsg(err instanceof Error ? err.message : 'Error verifying payment.');
            }
        };

        verifyPayment();
    }, [activeRef]);

    const handleCheckStatus = async () => {
        setStatus('loading');
        setErrorMsg('');
        try {
            const res = await fetchWithAuth(`/billing/status`);
            if (res && res.success) {
                await authService.me();
                setStatus('success');
            } else {
                setStatus('failed');
                setErrorMsg('Payment is still pending or failed.');
            }
        } catch {
            setStatus('failed');
            setErrorMsg('Could not check status right now.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
                            <Loader2 className="text-indigo-600 animate-spin" size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Verifying Payment...</h2>
                        <p className="text-slate-500 text-sm">Please do not close this window while we securely confirm your transaction with the provider.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-6 text-emerald-500 shadow-sm">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Upgrade Complete!</h2>
                        <p className="text-slate-500 text-sm mb-8">
                            Thank you for going Pro. Your account has been upgraded and all premium features are now unlocked for life.
                        </p>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition"
                        >
                            Go to Dashboard <ArrowRight size={18} />
                        </Link>
                    </div>
                )}

                {(status === 'failed' || status === 'idle') && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-6 text-rose-500 shadow-sm">
                            <XCircle size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Verification Failed</h2>
                        <p className="text-slate-500 text-sm mb-6">
                            {errorMsg || 'We could not verify your payment at this moment.'}
                        </p>

                        <div className="w-full space-y-3">
                            <button
                                onClick={handleCheckStatus}
                                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition"
                            >
                                <RefreshCcw size={16} /> Check Status Again
                            </button>
                            <Link
                                to="/settings"
                                className="block w-full py-3 text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl transition"
                            >
                                Return to Settings
                            </Link>
                        </div>
                        <p className="text-xs text-slate-400 mt-6">
                            If you were charged but the upgrade is not showing, your payment reference has been securely saved. It will auto-verify later or you can check status again.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
