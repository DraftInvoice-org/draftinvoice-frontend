import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEditorStore } from 'store/editorStore';
import type { Block } from 'types/document';
import { LayerItem } from './LayerItem';

export const LayersPanel = () => {
    const { document, moveBlock, reparentBlock } = useEditorStore();
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const toggleExpand = (id: string) => {
        setExpandedIds((prev: Set<string>) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId === overId) return;

        const overBlock = document.blocks.find((b: Block) => b.id === overId);

        if (overBlock?.type === 'container') {
            reparentBlock(activeId, overId);
        } else {
            const newIndex = document.blocks.findIndex((b: Block) => b.id === overId);
            moveBlock(activeId, newIndex);
        }
    };



    return (
        <div className="flex flex-col h-full overflow-x-hidden">
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={document.blocks.map((b: Block) => b.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="flex flex-col gap-1 px-2">
                            {document.blocks.filter(b => !b.parentId).map((block: Block) => (
                                <LayerItem
                                    key={block.id}
                                    block={block}
                                    depth={0}
                                    isExpanded={expandedIds.has(block.id)}
                                    onToggleExpand={toggleExpand}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

            </div>

        </div>
    );
};