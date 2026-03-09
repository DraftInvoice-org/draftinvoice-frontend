import { Footer } from '../../components/layout/Footer';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-4">{title}</h2>
        <div className="text-slate-600 space-y-4 leading-relaxed">{children}</div>
    </section>
);

export const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
            <div className="flex-1 max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 shadow-sm">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Terms of Service</h1>
                    <p className="text-slate-400 text-sm mb-10 italic">Last Updated: March 8, 2026</p>

                    <Section title="1. Acceptance of Terms">
                        <p>By accessing or using DraftInvoice, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
                    </Section>

                    <Section title="2. Account Responsibility">
                        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                    </Section>

                    <Section title="3. Email Usage">
                        <p>Our Pro plan allows you to send emails to your clients. You represent and warrant that you have obtained the necessary consent from your clients to contact them via email for invoicing purposes.</p>
                        <p>You may not use DraftInvoice for spam, phishing, or any form of unsolicited commercial communication.</p>
                    </Section>

                    <Section title="4. Pro Plan Subscriptions">
                        <p>Pro features are unlocked upon valid subscription. We reserve the right to modify or terminate Pro features at any time with appropriate notice to active subscribers.</p>
                    </Section>

                    <Section title="5. Limitation of Liability">
                        <p>DraftInvoice is provided "as is" without warranties of any kind. We are not liable for any financial losses or damages resulting from the use of our generated documents or system errors.</p>
                    </Section>
                </div>
            </div>
            <Footer />
        </div>
    );
};
