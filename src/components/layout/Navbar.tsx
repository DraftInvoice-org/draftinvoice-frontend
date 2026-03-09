import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, User as UserIcon } from 'lucide-react';
import { authService } from '../../services/authService';

export const Navbar = () => {
    const { isAuthenticated, logout } = useAuthStore();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch {
            // Ignore error
        }
        logout();
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100/50 sticky top-0 z-50 transition-all duration-300 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                                <span className="text-white font-black text-lg">D</span>
                            </div>
                            <span className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">DraftInvoice</span>
                        </Link>
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-1">
                            <Link to="/templates" className="px-4 py-2 rounded-full text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">
                                Templates
                            </Link>
                            <Link to="/editor/new" className="px-4 py-2 rounded-full text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">
                                Editor
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link to="/dashboard" className="text-sm font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition-colors">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <UserIcon size={14} />
                                    </div>
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-full hover:bg-slate-50 transition-colors">
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full shadow-md shadow-indigo-500/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
