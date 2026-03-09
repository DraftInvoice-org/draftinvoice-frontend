import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEditorStore } from 'store/editorStore';

export const Templates = () => {
    const navigate = useNavigate();
    const { fetchTemplates, templates, isLoading, error, loadTemplate, resetDocument } = useEditorStore();

    useEffect(() => {
        document.title = 'Templates - InvoiceBuilder';
        fetchTemplates();
    }, [fetchTemplates]);

    const handleSelectTemplate = (templateId: string) => {
        if (templateId === 'new') {
            resetDocument();
            navigate(`/editor/new`);
        } else {
            const template = templates.find(t => t.id === templateId);
            if (template) {
                loadTemplate(template.blocks, template.background);
                navigate(`/editor/${templateId}`);
            }
        }
    };

    if (isLoading) return <div className="p-8 text-center text-muted">Loading templates...</div>;
    if (error) return <div className="p-8 text-center text-destructive font-bold">Error: {error}</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold m-0">Choose a Template</h1>
                <Link to="/" className="text-primary hover:underline">Back to Home</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <button
                    onClick={() => handleSelectTemplate('new')}
                    className="border-2 border-dashed border-border rounded-base p-8 cursor-pointer flex flex-col items-center justify-center min-h-[400px] bg-white hover:border-accent hover:bg-slate-50 transition"
                >
                    <h3 className="m-0 text-muted font-bold text-xl">+ Blank Invoice</h3>
                </button>

                {templates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template.id)}
                        className="border border-border rounded-base p-8 cursor-pointer bg-white min-h-[400px] hover:border-accent hover:shadow-md transition text-left"
                    >
                        <h3 className="mt-0 mb-4 capitalize font-bold text-xl">{template.name || 'Untitled'}</h3>
                        <div
                            className="w-full aspect-[1/1.4] bg-slate-50 relative overflow-hidden transition-transform group-hover:scale-105"
                            style={{ backgroundColor: template.background || 'white' }}
                        >
                            <span className="text-muted font-medium">
                                {template.name ? 'Premium Template' : 'Preview not available'}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
