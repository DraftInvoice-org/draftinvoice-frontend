import { Footer } from '../../components/layout/Footer';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-4">{title}</h2>
        <div className="text-slate-600 space-y-4 leading-relaxed">{children}</div>
    </section>
);

export const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
            <div className="flex-1 max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 shadow-sm">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Privacy Policy</h1>
                    <p className="text-slate-400 text-sm mb-10 italic">Last Updated: March 8, 2026</p>

                    <Section title="1. Introduction">
                        <p>DraftInvoice ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our invoice generation platform.</p>
                    </Section>

                    <Section title="2. Information We Collect">
                        <p><strong>Account Information:</strong> When you sign up, we collect your email address and password hash.</p>
                        <p><strong>Business Data:</strong> We store the invoices you create, which include your business details (logo, name, address) and your client details.</p>
                        <p><strong>Client PII:</strong> As a user, you may provide Personal Identifiable Information (PII) of your clients. We act as a data processor for this information.</p>
                    </Section>

                    <Section title="3. How We Use Information">
                        <p>We use your data solely to provide the services offered by DraftInvoice, including document persistence, client management, and email dispatch of invoices.</p>
                    </Section>

                    <Section title="4. Data Retention">
                        <p>We retain your data as long as your account is active. When you delete your account via the Settings page, we permanently purge your profile, saved invoices, and client lists from our active databases.</p>
                    </Section>

                    <Section title="5. Security">
                        <p>We use industry-standard encryption (AES-256-GCM) for sensitive configuration like your custom SMTP credentials. However, no method of transmission over the Internet is 100% secure.</p>
                    </Section>
                </div>
            </div>
            <Footer />
        </div>
    );
};
