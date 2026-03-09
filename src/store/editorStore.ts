import { create } from 'zustand';
import type { Block, BlockType, InvoiceDocument } from 'types/document';
import { apiService } from 'services/apiService';

interface EditorState {
    document: InvoiceDocument;
    templates: InvoiceDocument[];
    isLoading: boolean;
    error: string | null;
    saved: boolean;
    selectedBlockId: string | null;
    maxZoom: number;
    minZoom: number;
    addBlock: (type: BlockType, parentId?: string) => void;
    selectBlock: (id: string | null) => void;
    removeBlock: (id: string) => void;
    updateBlockProps: (id: string, props: Record<string, any>) => void;
    updateBlockStyle: (id: string, style: React.CSSProperties) => void;
    updateBlockPosition: (id: string, x: number, y: number) => void;
    reparentBlock: (id: string, newParentId: string | undefined) => void;
    moveBlock: (id: string, newIndex: number) => void;
    loadTemplate: (blocks: Block[], background?: string) => void;
    fetchTemplates: () => Promise<void>;
    fetchTemplateById: (id: string) => Promise<void>;
    saveDocument: () => Promise<void>;
    resetDocument: () => void;
    zoom: number;
    setZoom: (zoom: number | ((z: number) => number)) => void;
}

const generateId = () => crypto.randomUUID();

const createEmptyDocument = (): InvoiceDocument => ({
    id: generateId(),
    blocks: [],
});

/** Returns a flat list of all descendant block IDs for a given parent block ID. */
const getDescendants = (blocks: import('types/document').Block[], parentId: string): string[] => {
    const children = blocks.filter(b => b.parentId === parentId).map(b => b.id);
    return [...children, ...children.flatMap(childId => getDescendants(blocks, childId))];
};

export const useEditorStore = create<EditorState>()((set, get) => ({
    document: createEmptyDocument(),
    templates: [],
    isLoading: false,
    error: null,
    zoom: 100,
    selectedBlockId: null,
    saved: false,
    maxZoom: 200,
    minZoom: 10,


    addBlock: (type: BlockType, parentId?: string) => set((state: EditorState) => {
        const newBlock: Block = {
            id: generateId(),
            type,
            props: {},
            style: type === 'container' ? { minWidth: 200, minHeight: 200, border: '1px solid #e5e7eb', backgroundColor: 'transparent' } : {},
            x: 0,
            y: 0,
            parentId,
        };

        const newBlocks = [...state.document.blocks, newBlock];

        return {
            document: {
                ...state.document,
                blocks: newBlocks,
            },
            saved: false
        };
    }),

    removeBlock: (id: string) => set((state: EditorState) => {
        const toDelete = new Set([id, ...getDescendants(state.document.blocks, id)]);

        return {
            document: {
                ...state.document,
                blocks: state.document.blocks.filter(b => !toDelete.has(b.id)),
            },
            saved: false
        };
    }),

    updateBlockProps: (id: string, props: Record<string, any>) => set((state: EditorState) => ({
        document: {
            ...state.document,
            blocks: state.document.blocks.map(b =>
                b.id === id ? { ...b, props: { ...b.props, ...props } } : b
            ),
        },
        saved: false
    })),

    updateBlockStyle: (id: string, style: React.CSSProperties) => set((state: EditorState) => ({
        document: {
            ...state.document,
            blocks: state.document.blocks.map(b =>
                b.id === id ? { ...b, style: { ...b.style, ...style } } : b
            ),
        },
        saved: false
    })),

    updateBlockPosition: (id: string, x: number, y: number) => set((state: EditorState) => ({
        document: {
            ...state.document,
            blocks: state.document.blocks.map(b =>
                b.id === id ? { ...b, x, y } : b
            ),
        },
        saved: false
    })),

    reparentBlock: (id: string, newParentId: string | undefined) => set((state: EditorState) => ({
        document: {
            ...state.document,
            blocks: state.document.blocks.map(b =>
                b.id === id ? { ...b, parentId: newParentId } : b
            ),
        },
        saved: false
    })),

    moveBlock: (id: string, newIndex: number) => set((state: EditorState) => {
        const blocks = [...state.document.blocks];
        const oldIndex = blocks.findIndex(b => b.id === id);
        if (oldIndex === -1) return state;

        const [movedBlock] = blocks.splice(oldIndex, 1);
        blocks.splice(newIndex, 0, movedBlock);

        return {
            document: {
                ...state.document,
                blocks,
            }
        };
    }),

    loadTemplate: (blocks: Block[], background?: string) => set((_state: EditorState) => ({
        document: {
            ...get().document,
            blocks: structuredClone(blocks),
            background: background || 'white',
        }
    })),

    fetchTemplates: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await apiService.fetchTemplates();
            set({ templates: data, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    fetchTemplateById: async (id: string) => {
        if (id === 'new') {
            get().resetDocument();
            return;
        }
        set({ isLoading: true, error: null });
        try {
            const data = await apiService.fetchTemplateById(id);
            set({
                document: {
                    id: data.id,
                    name: data.name,
                    blocks: typeof data.blocks === 'string' ? JSON.parse(data.blocks) : data.blocks,
                    background: data.background || 'white',
                },
                isLoading: false
            });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    saveDocument: async () => {
        const { document } = get();
        set({ isLoading: true, error: null });
        try {
            await apiService.saveTemplate({
                id: document.id,
                name: document.name || 'Untitled Invoice',
                background: document.background,
                blocks: document.blocks,
            });
            set({ isLoading: false, saved: true });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    resetDocument: () => set({
        document: createEmptyDocument(),
        zoom: 100,
        saved: false
    }),

    setZoom: (zoom: number | ((z: number) => number)) => set((state: EditorState) => ({
        zoom: typeof zoom === 'function' ? zoom(state.zoom) : zoom,
    })),

    selectBlock(id) {
        set(() => ({
            selectedBlockId: id
        }))
    },
}));
