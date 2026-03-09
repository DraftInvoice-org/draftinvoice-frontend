export type BlockType = 'text' | 'header' | 'divider' | 'invoice-items' | 'totals' | 'container' | 'logo';

export interface Block {
    id: string;
    type: BlockType;
    props: Record<string, any>;
    style: React.CSSProperties;
    x: number;
    y: number;
    parentId?: string;
}

export interface InvoiceDocument {
    id: string;
    name?: string; // Added for template names
    blocks: Block[];
    background?: string;
}
