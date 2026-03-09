import { Link } from 'react-router-dom';

export const Footer = () => (
    <footer className="border-t border-slate-100 bg-white mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
            <span>© {new Date().getFullYear()} DraftInvoice. All rights reserved.</span>
            <div className="flex items-center gap-5">
                <Link to="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
                <Link to="/cookies" className="hover:text-slate-600 transition-colors">Cookies</Link>
            </div>
        </div>
    </footer>
);
