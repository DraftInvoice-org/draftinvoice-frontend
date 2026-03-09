import { useAuthStore } from '../../store/authStore';
import { User, CreditCard, Shield, Activity, LogOut, AlertTriangle, Key, Mail, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { SmtpSettingsSection } from '../../components/ui/SmtpSettingsSection';
import { ApiKeysSection } from '../../components/ui/ApiKeysSection';
import { fetchWithAuth } from '../../services/apiService';


export const Settings = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.error('Logout error:', err);
        }
        logout();
        navigate('/');
    };

    const handleUpgrade = () => {
        navigate('/pricing');
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you absolutely sure? All your templates and invoices will be permanently deleted.')) return;

        try {
            const res = await fetchWithAuth('/users/me', { method: 'DELETE' });
            if (res.ok) {
                logout();
                navigate('/');
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to delete account');
            }
        } catch {
            alert('Something went wrong while deleting your account.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-10 font-sans text-left">
            <div className="mb-10 pb-6 border-b border-slate-200/50">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Account Settings</h1>
                <p className="text-slate-500 text-sm mt-1">Manage your profile, billing, and system preferences.</p>
            </div>

            <div className="space-y-12">
                {/* Profile Section */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <User className="text-indigo-500" size={20} />
                        <h2 className="text-lg font-bold text-slate-800">Your Profile</h2>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-start md:items-center gap-6 flex-col md:flex-row">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-100 to-teal-100 border-2 border-white shadow-md flex items-center justify-center text-2xl font-black text-slate-400">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 space-y-4 w-full">
                                <div>
                                    <div className="block text-xs font-bold tracking-wide text-slate-500 uppercase mb-1">Email Address</div>
                                    <input
                                        type="email"
                                        disabled
                                        value={user?.email || ''}
                                        className="w-full max-w-md px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium cursor-not-allowed"
                                    />
                                    <div className="flex items-center gap-4 mt-3">
                                        <p className="text-xs text-slate-400">Your email is tied to your identity.</p>
                                        <Link to="/verification" className="text-xs font-bold text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
                                            <ShieldCheck size={12} /> Verification Status
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 max-w-md">
                            <div className="text-xs font-bold tracking-wide text-slate-500 uppercase mb-3 flex items-center gap-2">
                                <Key size={14} /> Password Reset
                            </div>
                            <button className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm">
                                Send Password Reset Link
                            </button>
                        </div>
                    </div>
                </section>

                {/* Plan & Billing */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <CreditCard className="text-emerald-500" size={20} />
                        <h2 className="text-lg font-bold text-slate-800">Plan & Billing</h2>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-slate-800 capitalize">{user?.plan || 'Free'} Plan</h3>
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">Active</span>
                            </div>
                            <p className="text-slate-500 text-sm">
                                You are currently on the free tier. You have strict download limits and cannot access premium templates.
                            </p>
                        </div>
                        {user?.plan === 'free' ? (
                            <button
                                onClick={handleUpgrade}
                                className="shrink-0 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5 whitespace-nowrap"
                            >
                                Upgrade to Pro
                            </button>
                        ) : (
                            <div className="shrink-0 px-6 py-3 bg-emerald-50 text-emerald-600 font-bold rounded-xl border border-emerald-100 whitespace-nowrap flex items-center gap-2">
                                <Shield size={18} /> Pro Enabled
                            </div>
                        )}
                    </div>
                </section>

                {/* Email Configuration (BYOS) */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Mail className="text-indigo-500" size={20} />
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Email Configuration</h2>
                            <p className="text-slate-400 text-xs">Bring your own SMTP to send invoices from your own domain. <span className="text-indigo-500 font-bold">Pro feature.</span></p>
                        </div>
                    </div>
                    <SmtpSettingsSection />
                </section>

                {/* Developer API */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Key className="text-slate-800" size={20} />
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Developer API</h2>
                            <p className="text-slate-400 text-xs">Generate API keys to construct invoices programmatically. <span className="text-indigo-500 font-bold">Pro feature.</span></p>
                        </div>
                    </div>
                    <ApiKeysSection />
                </section>

                {/* Usage & Limits */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="text-blue-500" size={20} />
                        <h2 className="text-lg font-bold text-slate-800">Data Usage & Limits</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Saved Invoices</h4>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-3xl font-black text-slate-800">Unlimited</span>
                            </div>
                            <p className="text-xs text-slate-400">Authenticated users have no limits on saving templates to the cloud.</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <Activity size={100} />
                            </div>
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4 relative z-10">Export Rate Limit</h4>
                            <div className="flex flex-col gap-2 relative z-10">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-700">Downloads this hour</span>
                                    <span className="text-blue-600">0 / 50</span>
                                </div>
                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full w-[2%]" />
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Limits reset continuously every 60 minutes to prevent abuse.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Shield className="text-rose-500" size={20} />
                        <h2 className="text-lg font-bold text-slate-800"> Security & Danger Zone</h2>
                    </div>

                    <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-6">
                            <div>
                                <h4 className="text-base font-bold text-slate-800 mb-1">Sign Out Everywhere</h4>
                                <p className="text-sm text-slate-500">Log out of your account on this device and clear local data.</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="shrink-0 px-5 py-2.5 border border-slate-200 text-slate-700 hover:text-rose-600 hover:bg-rose-50 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <LogOut size={16} /> Sign out
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h4 className="text-base font-bold text-rose-600 mb-1 flex items-center gap-2">
                                    Delete Account
                                </h4>
                                <p className="text-sm text-slate-500">Permanently delete your account, all saved invoices, and billing data. This action cannot be undone.</p>
                            </div>
                            <button
                                className="shrink-0 px-5 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                onClick={handleDeleteAccount}
                            >
                                <AlertTriangle size={16} /> Delete Account
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};
