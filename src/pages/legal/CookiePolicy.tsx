import { Footer } from '../../components/layout/Footer';

export const CookiePolicy = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
            <div className="flex-1 max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 shadow-sm">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Cookie Policy</h1>
                    <p className="text-slate-400 text-sm mb-10 italic">Last Updated: March 8, 2026</p>

                    <div className="text-slate-600 space-y-6 leading-relaxed">
                        <p>DraftInvoice uses minimal cookies and web storage to provide a secure and functional experience.</p>

                        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">What we use</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3 px-2">Key</th>
                                        <th className="py-3 px-2">Type</th>
                                        <th className="py-3 px-2">Purpose</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <tr>
                                        <td className="py-3 px-2 font-mono text-indigo-600">auth_token</td>
                                        <td className="py-3 px-2">LocalStorage</td>
                                        <td className="py-3 px-2">Keeps you signed in between sessions.</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-2 font-mono text-indigo-600">editor_state</td>
                                        <td className="py-3 px-2">LocalStorage</td>
                                        <td className="py-3 px-2">Saves your current draft while editing.</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-2 font-mono text-indigo-600">cookie_consent</td>
                                        <td className="py-3 px-2">LocalStorage</td>
                                        <td className="py-3 px-2">Remembers your cookie banner preference.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Strictly Necessary</h2>
                        <p>All items mentioned above are strictly necessary for the technical operation of the platform. We do not use third-party tracking or advertising cookies at this time.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
