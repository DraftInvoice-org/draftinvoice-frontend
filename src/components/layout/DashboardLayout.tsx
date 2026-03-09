import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, LayoutTemplate, Briefcase, Settings, Users } from 'lucide-react';
import { authService } from '../../services/authService';

export const DashboardLayout = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch {
            // Ignore error, clear local state anyway
        }
        logout();
    };

    const isCurrentPath = (path: string) => location.pathname === path;

    return (
        <div className="text-left min-h-screen bg-[#f3f5f9] flex flex-col md:flex-row font-sans">
            {/* Sidebar (Desktop) */}
            <aside className="w-64 bg-white border-r border-slate-200 flex-col hidden md:flex sticky top-0 h-screen">
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
                            <span className="text-white font-black text-sm">D</span>
                        </div>
                        <span className="text-lg font-bold text-slate-800 tracking-tight">DraftInvoice</span>
                    </Link>
                </div>

                <div className="p-4 flex-1">
                    <nav className="space-y-1">
                        <Link
                            to="/dashboard"
                            className={`flex items-center px-3 py-2.5 rounded-xl font-semibold gap-3 group transition-colors ${isCurrentPath('/dashboard') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                            <LayoutTemplate size={20} className={isCurrentPath('/dashboard') ? 'text-indigo-500' : 'text-slate-400'} />
                            My Documents
                        </Link>
                        <Link
                            to="/templates"
                            className={`flex items-center px-3 py-2.5 rounded-xl font-semibold gap-3 group transition-colors ${isCurrentPath('/templates') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                            <Briefcase size={20} className={isCurrentPath('/templates') ? 'text-indigo-500' : 'text-slate-400'} />
                            Templates
                        </Link>
                        <Link
                            to="/clients"
                            className={`flex items-center px-3 py-2.5 rounded-xl font-semibold gap-3 group transition-colors ${isCurrentPath('/clients') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                            <Users size={20} className={`${isCurrentPath('/clients') ? 'text-indigo-500' : 'text-slate-400'}`} />
                            Clients List
                        </Link>
                    </nav>

                    <div className="text-xs font-bold text-slate-400 mb-4 px-2 tracking-wider mt-8">ACCOUNT</div>
                    <nav className="space-y-1">
                        <Link
                            to="/settings"
                            className={`flex items-center px-3 py-2.5 rounded-xl font-semibold gap-3 group transition-colors ${isCurrentPath('/settings') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                            <Settings size={20} className={isCurrentPath('/settings') ? 'text-indigo-500' : 'text-slate-400'} />
                            Settings
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center px-3 py-2.5 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl font-semibold gap-3 transition-colors text-left">
                            <LogOut size={20} className="text-slate-400 group-hover:text-red-500" />
                            Sign out
                        </button>
                    </nav>
                </div>

                {/* Sidebar User Profile Mini */}
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-100 to-teal-100 border border-slate-200"></div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 truncate max-w-[140px]">{user?.email?.split('@')[0] || 'User'}</span>
                            <span className="text-xs font-medium text-indigo-500 capitalize">{user?.plan || 'Free'} Plan</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Mobile Header */}
            <header className="md:hidden bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sticky top-0 z-30 w-full">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-sm">D</span>
                    </div>
                    <span className="text-lg font-bold text-slate-800 tracking-tight">DraftInvoice</span>
                </Link>
                <div className="flex items-center gap-3">
                    <Link to="/templates" className="text-sm font-bold text-slate-600">Templates</Link>
                    <button onClick={handleLogout} className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200" aria-label="Logout"></button>
                </div>
            </header>

            {/* Dashboard Content */}
            <main className="flex-1 w-full overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};
