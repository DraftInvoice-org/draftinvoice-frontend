import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Button } from '../../components/ui/Button';
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Valid reset token is required. Please request a new one.');
        }
    }, [token]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(token, password);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. Link may be expired.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-[#1e1b4b] mb-4 font-sans tracking-tight">Password Reset!</h2>
                    <p className="text-slate-600 mb-8">
                        Your password has been changed successfully. You can now log in with your new credentials.
                    </p>
                    <Button onClick={() => navigate('/login')} className="w-full bg-indigo-600">
                        Log in now
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h2 className="text-3xl font-extrabold text-[#1e1b4b] mb-2 font-sans tracking-tight">
                    Set a new password
                </h2>
                <p className="text-slate-500">Pick something strong that you don't use elsewhere.</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-6 shadow-xl rounded-2xl sm:px-12 border border-slate-100 text-left">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {token ? (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <Label htmlFor="password font-bold text-slate-700">New Password</Label>
                                <div className="mt-2 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 h-12 pr-10"
                                        placeholder="Min 8 characters"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="confirm-password font-bold text-slate-700">Confirm New Password</Label>
                                <div className="mt-2 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                    <Input
                                        id="confirm-password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 h-12"
                                        placeholder="Repeat your password"
                                    />
                                </div>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    className="w-full h-12 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
                                    isLoading={loading}
                                >
                                    Reset Password
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center">
                            <Link to="/forgot-password" title="Request new link" className="text-indigo-600 font-bold hover:text-indigo-500">
                                Request a new reset link
                            </Link>
                        </div>
                    )}

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center text-sm font-bold text-slate-500">
                        <Link to="/login" className="hover:text-indigo-600 flex items-center justify-center gap-2">
                            <ArrowLeft size={16} /> Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
