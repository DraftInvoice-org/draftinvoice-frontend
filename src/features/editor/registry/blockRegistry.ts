import { HeaderBlock, TextBlock, LogoBlock, DividerBlock, InvoiceItemsBlock, TotalsBlock, ContainerBlock } from 'features/editor/blocks/coreBlocks';
import type { BlockType } from 'types/document';

export interface BlockConfig {
    component: React.FC<{ block: any, children?: React.ReactNode }>;
    defaultProps: Record<string, any>;
    label: string;
}

export const blockRegistry: Record<BlockType, BlockConfig> = {
    header: {
        component: HeaderBlock,
        defaultProps: { text: 'Invoice Header' },
        label: 'Header'
    },
    text: {
        component: TextBlock,
        defaultProps: { text: 'Enter text here...' },
        label: 'Text'
    },
    logo: {
        component: LogoBlock,
        defaultProps: { url: '', width: '150px' },
        label: 'Logo'
    },
    divider: {
        component: DividerBlock,
        defaultProps: {},
        label: 'Divider'
    },
    'invoice-items': {
        component: InvoiceItemsBlock,
        defaultProps: {
            items: [
                { desc: 'Web Development Services', qty: 1, price: 1500 }
            ]
        },
        label: 'Invoice Items'
    },
    totals: {
        component: TotalsBlock,
        defaultProps: { subtotal: 1500, tax: 150 },
        label: 'Totals'
    },
    container: {
        component: ContainerBlock,
        defaultProps: {},
        label: 'Container'
    }
};
