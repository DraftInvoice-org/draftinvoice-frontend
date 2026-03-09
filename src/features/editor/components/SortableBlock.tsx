import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { blockRegistry } from 'features/editor/registry/blockRegistry';
import { useEditorStore } from 'store/editorStore';
import type { Block } from 'types/document';

export const SortableBlock = ({ block, isSelected, onSelect }: { block: Block, isSelected: boolean, onSelect: () => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
    const BlockComponent = blockRegistry[block.type]?.component;
    const { removeBlock } = useEditorStore();

    const containerStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    if (!BlockComponent) return null;

    return (
        <div
            ref={setNodeRef}
            style={containerStyle}
            onClick={onSelect}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onSelect();
                }
            }}
            className={`relative mb-2 p-2 rounded-base transition-all ${isSelected ? 'border-2 border-dashed border-muted' : 'border-2 border-transparent'}`}
            aria-label={`Block of type ${block.type}`}
            tabIndex={0}
        >
            {isSelected && (
                <div className="absolute top-[-16px] right-2 flex gap-1 bg-white border border-border rounded-base p-0.5 z-10 shadow-sm">
                    <button {...attributes} {...listeners} className="cursor-grab bg-none border-none p-1 text-foreground hover:bg-slate-50 rounded" aria-label="Drag to reorder">
                        <GripVertical size={16} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} className="cursor-pointer bg-none border-none p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded" aria-label="Delete block">
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
            <div className={isSelected ? 'pointer-events-auto' : 'pointer-events-none'}>
                <BlockComponent block={block} />
            </div>
        </div>
    );
};
