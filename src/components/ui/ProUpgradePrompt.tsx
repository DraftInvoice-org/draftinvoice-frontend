import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProUpgradePromptProps {
    feature: string;
    description?: string;
}

/**
 * Rendered in place of any Pro-gated feature when the user is on the Free plan.
 * Provides a clear, non-blocking upgrade call-to-action.
 */
export const ProUpgradePrompt = ({ feature, description }: ProUpgradePromptProps) => {
    return (
        <div className="relative w-full rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-10 flex flex-col items-center text-center overflow-hidden">
            {/* Blurred background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 via-white/0 to-purple-50/60 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/25">
                    <Lock className="text-white" size={24} />
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {feature} is a Pro Feature
                </h3>

                {description && (
                    <p className="text-slate-500 text-sm max-w-sm mb-6">{description}</p>
                )}
                {!description && (
                    <p className="text-slate-500 text-sm max-w-sm mb-6">
                        Upgrade to the Pro plan to unlock {feature} and other premium features.
                    </p>
                )}

                <Link
                    to="/settings"
                    className="inline-flex items-center px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all"
                >
                    Upgrade to Pro
                </Link>
            </div>
        </div>
    );
};
