import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, ChevronRight, ChevronDown, Box, Type, Minus } from 'lucide-react';
import { useEditorStore } from 'store/editorStore';
import type { Block } from 'types/document';

interface LayerItemProps {
    block: Block;
    depth: number;
    isExpanded: boolean;
    onToggleExpand: (id: string) => void;
}

export const LayerItem = ({ block, depth, isExpanded, onToggleExpand }: LayerItemProps) => {
    const { document, selectedBlockId, selectBlock } = useEditorStore();
    const children = document.blocks.filter(b => b.parentId === block.id);
    const hasChildren = children.length > 0;
    const isSelected = selectedBlockId === block.id;

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: block.id,
        data: { type: 'layer', block }
    });

    const containerStyle = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 1,
        paddingLeft: `${depth * 16 + 8}px`
    };

    const getIcon = () => {
        switch (block.type) {
            case 'container': return <Box size={14} />;
            case 'text':
            case 'header': return <Type size={14} />;
            case 'divider': return <Minus size={14} />;
            case 'invoice-items':
            case 'totals': return <Box size={14} />;
            default: return <Box size={14} />;
        }
    };

    return (
        <div ref={setNodeRef} style={containerStyle}>
            <div
                onClick={() => selectBlock(block.id)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        selectBlock(block.id);
                    }
                }}
                className={`flex text-left items-center p-2 gap-2 text-sm cursor-pointer select-none transition-colors border-l-2
                    ${isSelected ? 'bg-primary/5 border-primary text-primary font-bold' : 'border-transparent text-foreground'}
                    hover:bg-slate-50`}
                aria-label={`Layer: ${block.type}`}
                tabIndex={0}
            >
                <div {...attributes} {...listeners} className="flex items-center cursor-grab">
                    <GripVertical size={14} className="text-muted" />
                </div>

                {hasChildren ? (
                    <div
                        onClick={(e) => { e.stopPropagation(); onToggleExpand(block.id); }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.stopPropagation();
                                onToggleExpand(block.id);
                            }
                        }}
                        className="flex items-center"
                        tabIndex={0}
                        role="button"
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                ) : (
                    <div className="w-3.5" />
                )}

                <span className="text-muted flex items-center">
                    {getIcon()}
                </span>

                <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {block.props.text || block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                </span>

                <div className="flex gap-1">
                    <Eye size={14} className="text-muted" />
                </div>
            </div>

            {hasChildren && isExpanded && (
                <div>
                    {children.map(child => (
                        <LayerItem
                            key={child.id}
                            block={child}
                            depth={depth + 1}
                            isExpanded={isExpanded}
                            onToggleExpand={onToggleExpand}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
