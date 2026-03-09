import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { invoiceService } from '../../services/invoiceService';
import { FileText, Plus, ArrowRight, AlertCircle } from 'lucide-react';
import type { InvoiceRecord } from 'types/shared';
import { DueAlertCard } from '../../components/invoices/DueAlertCard';
import { getDueStatus } from '../../utils/invoiceDueStatus';
import { useCanAccess } from '../../hooks/useCanAccess';

export const Dashboard = () => {
    const navigate = useNavigate();
    const canSendEmail = useCanAccess('email_dispatch');
    const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const data = await invoiceService.getInvoices();
            setInvoices(data);
        } catch (err) {
            console.error('Failed to load invoices', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleMarkPaid = async (id: string) => {
        try {
            await invoiceService.markPaid(id);
            await load();
        } catch (err: unknown) {
            console.error('Failed to mark invoice as paid', err);
        }
    };

    const attentionRequired = invoices.filter(inv => {
        const st = getDueStatus(inv.due_date, inv.payment_status);
        return st === 'overdue' || st === 'due-soon';
    });

    let content;
    if (loading) {
        content = <div className="text-center py-10 text-slate-500 font-medium">Loading invoices...</div>;
    } else if (invoices.length === 0) {
        content = (
            <div className="text-center bg-white py-20 px-6 rounded-2xl border border-dashed border-slate-300 w-full max-w-2xl mx-auto mt-10 shadow-sm">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform hover:scale-110 duration-300">
                    <FileText className="h-10 w-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No invoices yet</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">You haven't created any invoices. Get started by jumping into the editor and creating your first professional document to get paid.</p>
                <div className="flex justify-center">
                    <button
                        onClick={() => navigate('/editor/new')}
                        className="inline-flex items-center px-8 py-3.5 border border-transparent shadow-xl shadow-indigo-500/25 text-sm font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95"
                    >
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        Create New Invoice
                    </button>
                </div>
            </div>
        );
    } else {
        content = (
            <div className="space-y-10">
                {/* Attention Required Section */}
                {attentionRequired.length > 0 && (
                    <section className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle size={18} className="text-amber-500" />
                            <h2 className="text-lg font-bold text-slate-800">Attention Required</h2>
                            <span className="bg-amber-100 text-amber-600 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">{attentionRequired.length}</span>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                            {attentionRequired.map(inv => (
                                <DueAlertCard
                                    key={inv.id}
                                    invoice={inv}
                                    onMarkPaid={handleMarkPaid}
                                    onSendEmail={(id) => navigate(`/editor/${id}?send=true`)}
                                    canSendEmail={canSendEmail}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* All Documents */}
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Documents</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {invoices.map((invoice) => (
                            <Link
                                key={invoice.id}
                                to={`/editor/${invoice.id}`}
                                className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all hover:-translate-y-1.5 flex flex-col h-full cursor-pointer relative overflow-hidden"
                            >
                                {/* Decorative Top Accent */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                                    <FileText size={24} />
                                </div>

                                <h4 className="text-lg font-bold text-slate-800 mb-1 truncate group-hover:text-indigo-600 transition-colors">
                                    {invoice.title || 'Untitled Invoice'}
                                </h4>

                                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
                                    <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">STATUS:</span>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${invoice.status === 'draft' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
                                        {invoice.status}
                                    </span>
                                    {invoice.payment_status === 'paid' && (
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 uppercase">PAID</span>
                                    )}
                                </div>

                                <div className="mt-auto flex items-center justify-between text-slate-400 text-xs font-semibold">
                                    <span>{new Date(invoice.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 shadow-sm">
                                        <ArrowRight size={16} className="text-indigo-600" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-10 text-left min-h-screen">
            {/* Top Bar */}
            <div className="hidden md:flex justify-between items-center mb-10 pb-6 border-b border-slate-200/50">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Manage and track your pro-grade documents.</p>
                </div>
                <button
                    onClick={() => navigate('/editor/new')}
                    className="inline-flex items-center px-6 py-2.5 border border-transparent shadow-lg shadow-indigo-500/20 text-sm font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-95"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    New Document
                </button>
            </div>

            {/* Mobile Header Replica */}
            <div className="md:hidden flex justify-between items-center mb-8 mt-4">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Documents</h1>
                <button
                    onClick={() => navigate('/editor/new')}
                    className="inline-flex items-center p-2.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 active:scale-90"
                >
                    <Plus className="h-6 w-6" />
                </button>
            </div>

            {/* Content Feed */}
            {content}
        </div>
    );
};

