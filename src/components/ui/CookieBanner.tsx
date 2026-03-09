import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONSENT_KEY = 'cookie_consent';

export const CookieBanner = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    }, []);

    const accept = () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-6 md:max-w-sm">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-black/10 p-4 flex items-start gap-3">
                <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Cookie size={18} className="text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 mb-0.5">We use cookies</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        We use localStorage for your session and editor state.{' '}
                        <Link to="/cookies" className="text-indigo-600 hover:underline">Learn more</Link>.
                    </p>
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={accept}
                            className="flex-1 py-1.5 px-3 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Accept
                        </button>
                        <Link
                            to="/cookies"
                            className="flex-1 py-1.5 px-3 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors text-center"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
