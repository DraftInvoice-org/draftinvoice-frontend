import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useUIStore } from '../../store/uiStore';
import { CheckCircle, XCircle, Info, X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export const Dialog: React.FC = () => {
    const { dialog, hideDialog } = useUIStore();
    const { isOpen, title, message, type } = dialog;

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') hideDialog();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, hideDialog]);

    if (!isOpen) return null;

    const icons = {
        info: <Info className="w-12 h-12 text-blue-500 mb-4" />,
        error: <XCircle className="w-12 h-12 text-red-500 mb-4" />,
        success: <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />,
        confirm: <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />,
    };

    const colors = {
        info: 'border-blue-100',
        error: 'border-red-100',
        success: 'border-emerald-100',
        confirm: 'border-amber-100',
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className={`bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border ${colors[type]} animate-in zoom-in-95 duration-200`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative p-8 flex flex-col items-center text-center">
                    <button
                        onClick={hideDialog}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {icons[type]}

                    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">{message}</p>

                    {type === 'confirm' ? (
                        <div className="flex gap-3 w-full">
                            <Button
                                onClick={hideDialog}
                                variant="secondary"
                                className="flex-1 py-6 text-base font-semibold"
                            >
                                {dialog.cancelText || 'Cancel'}
                            </Button>
                            <Button
                                onClick={() => {
                                    dialog.onConfirm?.();
                                    hideDialog();
                                }}
                                className="flex-1 py-6 text-base font-semibold bg-rose-600 hover:bg-rose-700"
                            >
                                {dialog.confirmText || 'Confirm'}
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={hideDialog}
                            className="w-full py-6 text-base font-semibold"
                            variant={type === 'error' ? 'primary' : 'secondary'}
                        >
                            Close
                        </Button>
                    )}
                </div>
            </div>
            <div className="absolute inset-0 -z-10" onClick={hideDialog} />
        </div>,
        document.body
    );
};
