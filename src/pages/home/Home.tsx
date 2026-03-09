import { CheckCircle2, Cloud, FileText, LayoutTemplate, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const Home = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    useEffect(() => {
        document.title = 'DraftInvoice - Modern Cloud Invoice Generator';
    }, []);

    return (
        <div className="min-h-screen bg-[#fafbff] text-slate-900 font-sans overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-16 pb-20 md:pt-20 md:pb-32 w-full flex flex-col items-center text-center z-10 px-4 md:px-0">
                {/* Background Gradients */}
                <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] md:w-[50%] md:h-[50%] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 -z-10 animate-blob"></div>
                <div className="absolute top-[0%] right-[-10%] w-[80%] h-[80%] md:w-[50%] md:h-[50%] bg-purple-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 -z-10 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[80%] h-[80%] md:w-[50%] md:h-[50%] bg-rose-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 -z-10 animate-blob animation-delay-4000"></div>

                <div className="max-w-4xl mx-auto px-4 z-10 relative">
                    <p className="text-xs md:text-sm font-bold text-purple-700 tracking-wide uppercase mb-4 flex items-center justify-center gap-2">
                        <Sparkles size={16} />
                        Professional, easy, and fast
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#1e1b4b] tracking-tight mb-6 leading-[1.1]">
                        Billing made simple with<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                            DraftInvoice
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                        Create beautiful, professional PDF invoices directly in your browser.
                        No complex software. No watermarks. Just a simple block editor that gets you paid faster.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
                        {!isAuthenticated && (
                            <Link
                                to="/signup"
                                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-purple-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
                            >
                                Create Free Account
                            </Link>
                        )}
                        <Link
                            to="/templates"
                            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-bold py-4 px-8 rounded-full shadow-md border border-slate-200 transition-all flex items-center justify-center"
                        >
                            View Templates
                        </Link>
                    </div>
                </div>

                {/* Hero Mockup (The App UI) */}
                <div className="mt-12 md:mt-20 relative w-full max-w-5xl mx-auto px-4 perspective-1000 z-20 hidden sm:block">
                    <div className="relative rounded-2xl bg-white shadow-2xl p-2 border border-slate-100/50 backdrop-blur-xl transform-gpu rotate-x-12 hover:rotate-x-0 transition-transform duration-700">
                        {/* Browser Window Chrome */}
                        <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-t-xl border-b border-slate-100">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        {/* Editor Mockup Content */}
                        <div className="bg-[#f8fafc] rounded-b-xl p-6 flex flex-col md:flex-row gap-6">
                            {/* Editor Sidebar Mock */}
                            <div className="hidden md:flex flex-col gap-4 w-56 border-r border-slate-200 pr-6">
                                <div className="h-8 w-24 bg-purple-600/10 rounded-md mb-2 flex items-center px-2"><span className="text-xs font-bold text-purple-600">BLOCKS</span></div>
                                <div className="h-10 w-full bg-white border border-slate-200 rounded flex items-center px-3 shadow-sm"><span className="w-4 h-4 rounded bg-slate-200 mr-2"></span><span className="h-2 w-16 bg-slate-200 rounded"></span></div>
                                <div className="h-10 w-full bg-white border border-slate-200 rounded flex items-center px-3 shadow-sm"><span className="w-4 h-4 rounded bg-slate-200 mr-2"></span><span className="h-2 w-20 bg-slate-200 rounded"></span></div>
                                <div className="h-10 w-full bg-white border border-slate-200 rounded flex items-center px-3 shadow-sm"><span className="w-4 h-4 rounded bg-slate-200 mr-2"></span><span className="h-2 w-12 bg-slate-200 rounded"></span></div>
                                <div className="h-10 w-full bg-white border border-slate-200 rounded flex items-center px-3 shadow-sm"><span className="w-4 h-4 rounded bg-slate-200 mr-2"></span><span className="h-2 w-16 bg-slate-200 rounded"></span></div>
                            </div>
                            {/* Document Mock */}
                            <div className="flex-1 flex justify-center">
                                <div className="bg-white p-8 rounded-sm shadow-md border border-slate-100 w-full max-w-lg aspect-[1/1.4] flex flex-col">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-16 h-16 bg-blue-100 rounded-lg"></div>
                                        <div className="text-right space-y-2">
                                            <div className="h-6 w-32 bg-slate-800 rounded ml-auto"></div>
                                            <div className="h-3 w-24 bg-slate-300 rounded ml-auto"></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-8 mb-8 border-t border-slate-100 pt-6">
                                        <div className="space-y-2 flex-1">
                                            <div className="h-3 w-16 bg-slate-200 rounded"></div>
                                            <div className="h-4 w-32 bg-slate-800 rounded"></div>
                                            <div className="h-3 w-40 bg-slate-300 rounded"></div>
                                        </div>
                                        <div className="space-y-2 flex-1">
                                            <div className="h-3 w-16 bg-slate-200 rounded"></div>
                                            <div className="h-4 w-32 bg-slate-800 rounded"></div>
                                            <div className="h-3 w-40 bg-slate-300 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="w-full h-8 bg-slate-50 border-y border-slate-200 mb-4 flex items-center px-2">
                                        <div className="h-2 w-1/2 bg-slate-300 rounded"></div>
                                        <div className="h-2 w-16 bg-slate-300 rounded ml-auto"></div>
                                    </div>
                                    <div className="w-full space-y-4 flex-1">
                                        <div className="flex items-center px-2"><div className="h-3 w-1/3 bg-slate-800 rounded"></div><div className="h-3 w-16 bg-slate-800 rounded ml-auto"></div></div>
                                        <div className="flex items-center px-2"><div className="h-3 w-1/4 bg-slate-800 rounded"></div><div className="h-3 w-16 bg-slate-800 rounded ml-auto"></div></div>
                                        <div className="flex items-center px-2"><div className="h-3 w-2/5 bg-slate-800 rounded"></div><div className="h-3 w-16 bg-slate-800 rounded ml-auto"></div></div>
                                    </div>
                                    <div className="w-full flex justify-end mt-4 pt-4 border-t border-slate-200">
                                        <div className="w-48 bg-purple-50 p-3 rounded flex justify-between">
                                            <span className="h-4 w-12 bg-purple-200 rounded"></span>
                                            <span className="h-4 w-20 bg-purple-600 rounded"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dark slanted background shape behind mockup */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[20%] w-[120vw] h-[800px] bg-[#1e1b4b] -rotate-3 -z-20 clip-path-slant"></div>
                </div>
            </section>

            {/* Why DraftInvoice Section */}
            <section className="py-16 md:py-24 bg-white relative z-10 mt-6 md:mt-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#1e1b4b] mb-4">Everything you need to bill clients</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto mb-10 md:mb-16 text-md md:text-lg">
                        Skip the cumbersome spreadsheets and bloated accounting software. DraftInvoice focuses purely on making document generation fast and completely customizable.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                        {/* Feature Card 1 */}
                        <div className="bg-indigo-50/50 p-8 rounded-2xl text-left border border-indigo-100 hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-500 rounded-xl flex items-center justify-center mb-6">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Live Block Editor</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Add text blocks, standard line items, images, and notes exactly where you want them. Customize colors instantly.
                            </p>
                        </div>

                        {/* Feature Card 2 */}
                        <div className="bg-purple-50/50 p-8 rounded-2xl text-left border border-purple-100 hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                                <LayoutTemplate size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Starting Templates</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Don't want to start from scratch? Choose a professional layout and simply fill in your details to export a PDF in 1 minute.
                            </p>
                        </div>

                        {/* Feature Card 3 */}
                        <div className="bg-blue-50/50 p-8 rounded-2xl text-left border border-blue-100 hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                                <Cloud size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Cloud Storage</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Make an account to save templates, track your generated history, and drastically increase your download limits.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Feature 1 */}
            <section className="py-16 md:py-24 bg-[#fafbff] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 md:gap-16">
                    <div className="flex-1 space-y-6 md:space-y-8 z-10 order-1 md:order-1 text-center md:text-left">
                        <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mx-auto md:mx-0">
                            <LayoutTemplate size={24} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-[#1e1b4b] leading-tight md:mt-6">
                            Export directly to PDF without watermarks
                        </h2>
                        <p className="text-md md:text-lg text-slate-600">
                            Download limits are generous for both absolute guests and power users. You own the layout, your brand retains focus, and your clients receive a professional piece of document.
                        </p>
                        <ul className="space-y-4 pt-4 text-left">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="text-pink-500 mt-1" size={20} />
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">No Sign-up Friction</h4>
                                    <p className="text-slate-500">Need a quick invoice right now? Jump straight to the editor. We'll only ask you to create an account if you hit our anti-abuse rate limits.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="text-pink-500 mt-1" size={20} />
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">Clean Output</h4>
                                    <p className="text-slate-500">The PDF you export is pixel-perfect to what you see in the builder interface, without any unwanted "Created with DraftInvoice" text appended.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    {/* Abstract PDF Graphic */}
                    <div className="flex-1 relative z-10 w-full max-w-lg order-1 md:order-2 flex justify-center">
                        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-pink-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 -z-10"></div>
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 w-72 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <div className="text-3xl font-bold text-slate-800">INVOICE</div>
                                <div className="w-10 h-10 bg-slate-900 rounded-lg"></div>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                                <div className="h-2 w-1/3 bg-slate-200 rounded"></div>
                            </div>
                            <div className="h-32 bg-slate-50 border border-slate-100 mb-6 flex flex-col justify-end p-2">
                                <div className="h-8 w-full bg-slate-200 rounded-sm mb-2"></div>
                                <div className="h-8 w-full bg-slate-800 rounded-sm"></div>
                            </div>
                            <div className="bg-pink-500 text-white text-center py-3 rounded-xl font-bold shadow-md cursor-pointer hover:bg-pink-600 transition-colors flex items-center justify-center gap-2">
                                <FileText size={18} /> Export PDF
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 bg-white text-center text-slate-400 border-t border-slate-100">
                <p>&copy; {new Date().getFullYear()} DraftInvoice. Beautifully crafted for freelancers and professionals.</p>
            </footer>
        </div>
    );
};
