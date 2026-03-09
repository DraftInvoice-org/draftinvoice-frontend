import { Button } from 'components/ui/Button';
import { Check, Info, Shield, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { billingService } from 'services/billingService';
import { useAuthStore } from 'store/authStore';

export const Pricing = () => {
    const { user, isAuthenticated } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpgrade = async () => {
        if (!isAuthenticated) return;
        setIsLoading(true);
        setError(null);
        try {
            await billingService.upgradeToPro();
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
            setIsLoading(false);
        }
    };

    const plans = [
        {
            name: 'Free Starter',
            price: '₦0',
            description: 'Perfect for exploring the platform and creating occasional invoices.',
            features: [
                'Full access to block editor',
                'Download up to 5 invoices/mo',
                'Basic templates included',
                'Save up to 3 client profiles',
                'Client-side PDF generation'
            ],
            cta: isAuthenticated ? 'Current Plan' : 'Get Started',
            highlight: false,
            disabled: isAuthenticated && user?.plan === 'free'
        },
        {
            name: 'Pro Professional',
            price: '₦9,990',
            period: 'One-time Payment',
            description: 'Designed for serious freelancers and agencies who need white-labeling.',
            features: [
                'Unlimited PDF exports',
                'Programmable B2B API access',
                'Custom SMTP (Send from your email)',
                'Priority background rendering',
                'Advanced premium templates',
                'No DraftInvoice watermarks ever',
                'Manage unlimited clients'
            ],
            cta: user?.plan === 'pro' ? 'Already Pro' : 'Upgrade to Pro',
            highlight: true,
            disabled: user?.plan === 'pro'
        }
    ];

    return (
        <div className="min-h-screen bg-[#fafbff] py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#1e1b4b] mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Choose the plan that fits your business. Upgrade to Pro for full B2B API access and custom email delivery.
                    </p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative p-8 rounded-3xl border transition-all duration-300 ${plan.highlight
                                ? 'bg-white border-purple-500 shadow-2xl scale-105 z-10'
                                : 'bg-slate-50 border-slate-200 shadow-md'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                                        <Sparkles size={14} /> MOST POPULAR
                                    </div>
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-5xl font-extrabold text-[#1e1b4b]">{plan.price}</span>
                                    {plan.period && <span className="text-slate-500 font-medium">{plan.period}</span>}
                                </div>
                                <p className="text-slate-600 leading-relaxed min-h-[60px]">
                                    {plan.description}
                                </p>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-slate-700 font-medium">
                                        <div className={`mt-1 p-0.5 rounded-full ${plan.highlight ? 'bg-purple-100 text-purple-600' : 'bg-slate-200 text-slate-500'}`}>
                                            <Check size={14} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {plan.highlight ? (
                                <Button
                                    onClick={handleUpgrade}
                                    isLoading={isLoading}
                                    disabled={plan.disabled}
                                    className="w-full h-14 text-lg font-bold bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-600/20"
                                >
                                    <Zap size={20} className="mr-2" />
                                    {plan.cta}
                                </Button>
                            ) : (
                                <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                                    <Button
                                        variant="secondary"
                                        disabled={plan.disabled}
                                        className="w-full h-14 text-lg font-bold border-2"
                                    >
                                        {plan.cta}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-slate-600">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center mb-4 text-emerald-500">
                            <Shield size={24} />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-2">Secure Payments</h4>
                        <p className="text-sm">Processed by Paystack, the African standard for safe online payments.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center mb-4 text-blue-500">
                            <Info size={24} />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-2">One-time Upgrade</h4>
                        <p className="text-sm">No monthly recurring fees. Pay once, own Pro features forever.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center mb-4 text-purple-500">
                            <Sparkles size={24} />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-2">Instant Access</h4>
                        <p className="text-sm">Features are unlocked automatically the moment your payment is confirmed.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
