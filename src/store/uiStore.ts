import { create } from 'zustand';

interface DialogState {
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'error' | 'success' | 'confirm';
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

interface UIStore {
    dialog: DialogState;
    showDialog: (options: {
        title: string;
        message: string;
        type?: 'info' | 'error' | 'success' | 'confirm';
        onClose?: () => void;
        onConfirm?: () => void;
        confirmText?: string;
        cancelText?: string;
    }) => void;
    hideDialog: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    dialog: {
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onClose: () => { },
    },
    showDialog: ({ title, message, type = 'info', onClose, onConfirm, confirmText, cancelText }) => set({
        dialog: {
            isOpen: true,
            title,
            message,
            type,
            onClose: onClose || (() => { }),
            onConfirm,
            confirmText,
            cancelText,
        }
    }),
    hideDialog: () => set((state) => {
        state.dialog.onClose();
        return {
            dialog: { ...state.dialog, isOpen: false }
        };
    }),
}));
