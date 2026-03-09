import React from 'react';
import { useEditorStore } from 'store/editorStore';
import type { Block } from 'types/document';

export const HeaderBlock = ({ block }: { block: Block }) => {
    return <h1 className="m-0 font-bold" style={block.style}>{block.props.text || 'Invoice Header'}</h1>;
};

export const ContainerBlock = ({ block, children }: { block: Block, children?: React.ReactNode }) => {
    return (
        <div className="relative w-full h-full min-h-[50px]" style={block.style}>
            {children}
            {(!children || (Array.isArray(children) && children.length === 0)) && !block.props.hidePlaceholder && (
                <div className="absolute inset-0 flex items-center justify-center text-muted pointer-events-none text-[10px]">
                    Empty Container
                </div>
            )}
        </div>
    );
};

export const TextBlock = ({ block }: { block: Block }) => {
    return <p className="m-0" style={block.style}>{block.props.text || 'New text'}</p>;
};

export const LogoBlock = ({ block }: { block: Block }) => {
    return (
        <div style={block.style}>
            {block.props.url ? (
                <img src={block.props.url} alt="Logo" className="max-w-full" style={{ width: block.props.width || '150px' }} />
            ) : (
                <div className="w-[150px] h-[50px] bg-slate-100 flex items-center justify-center text-muted">
                    Logo Placeholder
                </div>
            )}
        </div>
    );
};

export const DividerBlock = ({ block }: { block: Block }) => {
    return <hr className="my-4 border-t-2 border-border" style={block.style} />;
};

export const InvoiceItemsBlock = ({ block }: { block: Block }) => {
    const { updateBlockProps } = useEditorStore();
    const items = block.props.items || [{ desc: 'Item 1', qty: 1, price: 0 }];
    const rowHeights = block.props.rowHeights || {};
    const [resizingRow, setResizingRow] = React.useState<number | null>(null);

    const handleRowResizeStart = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        setResizingRow(index);
    };

    React.useEffect(() => {
        if (resizingRow === null) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rowElement = globalThis.window.document.querySelector(`[data-row-index="${resizingRow}"]`);
            if (rowElement) {
                const rect = rowElement.getBoundingClientRect();
                const newHeight = Math.max(30, e.clientY - rect.top);
                updateBlockProps(block.id, {
                    rowHeights: { ...rowHeights, [resizingRow]: newHeight }
                });
            }
        };

        const handleMouseUp = () => setResizingRow(null);

        globalThis.window.addEventListener('mousemove', handleMouseMove);
        globalThis.window.addEventListener('mouseup', handleMouseUp);
        return () => {
            globalThis.window.removeEventListener('mousemove', handleMouseMove);
            globalThis.window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizingRow, block.id, rowHeights, updateBlockProps]);

    return (
        <table className="w-full border-collapse" style={block.style}>
            <thead>
                <tr className="border-b-2 border-border text-left">
                    <th className="p-2">Description</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Price</th>
                    <th className="p-2 text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item: any, i: number) => {
                    const key = 'core-blocks-item-' + i;
                    const height = rowHeights[i] || 'auto';
                    const rowStyle = {
                        borderBottom: block.style.borderBottom ? 'none' : '1px solid #f3f4f6',
                        height: typeof height === 'number' ? `${height}px` : height,
                        position: 'relative' as const,
                        ...block.props.rowStyle
                    };
                    return (
                        <tr key={key} style={rowStyle} data-row-index={i}>
                            <td className="p-2 vertical-top" style={block.props.cellStyle}>{item.desc}</td>
                            <td className="p-2 vertical-top" style={block.props.cellStyle}>{item.qty}</td>
                            <td className="p-2 vertical-top" style={block.props.cellStyle}>${item.price.toFixed(2)}</td>
                            <td className="p-2 vertical-top text-right" style={block.props.cellStyle}>${(item.qty * item.price).toFixed(2)}</td>

                            {/* Row Resize Handle */}
                            <div
                                onMouseDown={(e) => handleRowResizeStart(e, i)}
                                className={`absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize z-10 transition-colors duration-200 ${resizingRow === i ? 'bg-primary' : 'bg-transparent'}`}
                                title="Drag to resize row"
                            />
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
};

export const TotalsBlock = ({ block }: { block: Block }) => {
    const subtotal = block.props.subtotal || 0;
    const tax = block.props.tax || 0;
    const total = subtotal + tax;

    const rowWidth = block.style.width || '250px';

    return (
        <div className="flex flex-col items-end gap-1" style={block.style}>
            <div className="flex justify-between py-1" style={{ width: rowWidth }}>
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1" style={{ width: rowWidth }}>
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-border font-bold" style={{ width: rowWidth, ...block.props.totalRowStyle }}>
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
            </div>
        </div>
    );
};
