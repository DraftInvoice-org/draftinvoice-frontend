import { ArrowLeftFromLineIcon, DownloadIcon, SaveIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BlockSettings } from 'features/editor/components/BlockSettings';
import { CanvasRenderer } from 'features/editor/components/CanvasRenderer';
import { EditorControls } from 'features/editor/components/EditorControls';
import { useWalkthrough } from 'features/editor/hooks/useWalkthrough';
import { useZoom } from 'features/editor/hooks/useZoom';
import { useEditorStore } from 'store/editorStore';
import { pdfService } from 'services/pdfService';
import { Button } from 'components/ui/Button';
import { useAuthStore } from 'store/authStore';

export const Editor = () => {
    const { templateId } = useParams<{ templateId: string }>();
    const { showWalkthrough, completeWalkthrough } = useWalkthrough();
    const { zoom, zoomIn, zoomOut, resetZoom } = useZoom();
    const { fetchTemplateById, isLoading, error, selectBlock, saveDocument, saved } = useEditorStore();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [copiedId, setCopiedId] = useState(false);

    const handleCopyId = () => {
        if (templateId && templateId !== 'new') {
            globalThis.window.navigator.clipboard.writeText(templateId);
            setCopiedId(true);
            setTimeout(() => setCopiedId(false), 2000);
        }
    };

    useEffect(() => {
        document.title = 'Editor - InvoiceBuilder';
        if (templateId) {
            fetchTemplateById(templateId);
        }
    }, [templateId, fetchTemplateById]);

    if (isLoading) return <div className="p-8 text-center text-muted">Loading template...</div>;
    if (error) return <div className="p-8 text-center text-destructive font-bold">Error: {error}</div>;

    const handleExportPDF = () => {
        pdfService.exportToPDF({
            elementId: 'invoice-document-canvas',
            filename: `invoice-${templateId}.pdf`,
            onBeforeExport: () => selectBlock(null)
        });
    };

    const walkthroughContent = (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white p-6 rounded-base z-50 max-w-[350px] shadow-lg">
            <h3 className="mt-0 mb-2 text-lg font-bold">Welcome to the Editor!</h3>
            <ul className="pl-6 mb-4 text-sm leading-relaxed list-disc">
                <li><strong className="text-secondary">Left panel:</strong> Click to add new blocks.</li>
                <li><strong className="text-secondary">Canvas:</strong> Drag blocks to reorder or click to select them.</li>
                <li><strong className="text-secondary">Right panel:</strong> Edit the selected block's content here.</li>
            </ul>
            <Button onClick={completeWalkthrough} className="w-full">Got it</Button>
        </div>
    );

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <header className="h-[60px] border-b border-border flex items-center justify-between px-4 bg-white z-10">
                <div className="flex items-center gap-4">
                    <Link to="/templates" className="text-muted hover:text-foreground transition"><ArrowLeftFromLineIcon className="w-5 h-5" /></Link>
                    <div className="flex items-center gap-2">
                        <h1 className="max-w-[30vw] truncate text-xl font-bold m-0">Editing: {templateId === 'new' ? 'Blank Invoice' : templateId}</h1>
                        {templateId && templateId !== 'new' && (
                            <button
                                onClick={handleCopyId}
                                className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors"
                                title="Copy Template ID for API Usage"
                            >
                                {copiedId ? <CheckIcon className="w-3 h-3 text-emerald-600" /> : <CopyIcon className="w-3 h-3" />}
                                {copiedId ? <span className="text-emerald-700">Copied</span> : 'Copy ID'}
                            </button>
                        )}
                    </div>
                    {isAuthenticated && <Button
                        onClick={saveDocument}
                        isLoading={isLoading}
                        variant={saved ? "secondary" : "primary"}
                        className={saved ? "text-green-700 bg-green-100 hover:bg-green-200" : ""}
                    >
                        <SaveIcon className="w-4 h-4 mr-2" />
                        {saved ? "Saved" : "Save Template"}
                    </Button>}
                </div>
                <Button
                    onClick={handleExportPDF}
                >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Export PDF
                </Button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-[300px] bg-slate-50 overflow-y-auto">
                    <EditorControls />
                </aside>

                <main className="flex-1 bg-slate-200 overflow-auto relative">
                    <div className="p-16 min-w-max min-h-max flex justify-center">
                        <div style={{
                            transform: `scale(${zoom / 100})`, // Fixed zoom scale from 1000 to 100
                            transformOrigin: 'top center',
                            transition: 'transform 0.1s ease-out'
                        }}>
                            <CanvasRenderer />
                        </div>
                    </div>
                </main>

                <aside className="w-[300px] border-l border-border bg-slate-50 flex flex-col z-10">
                    <div className="flex-1 overflow-y-auto">
                        <BlockSettings />
                    </div>
                </aside>
            </div>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center bg-white p-2 rounded-lg shadow-md z-40 gap-1 border border-border">
                <Button onClick={() => zoomOut()} variant="ghost" size="icon" aria-label="Zoom Out">-</Button>
                <div className="text-sm font-semibold w-[60px] text-center select-none">{zoom}%</div>
                <Button onClick={() => zoomIn()} variant="ghost" size="icon" aria-label="Zoom In">+</Button>
                <div className="w-px h-6 bg-border mx-2"></div>
                <Button onClick={() => resetZoom()} variant="secondary" size="sm">Reset</Button>
            </div>

            {showWalkthrough && walkthroughContent}
        </div>
    );
};
