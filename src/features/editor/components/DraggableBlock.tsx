import { GripVertical, Trash2, RotateCw } from 'lucide-react';
import { blockRegistry } from 'features/editor/registry/blockRegistry';
import { useEditorStore } from 'store/editorStore';
import type { Block } from 'types/document';
import { useMagneticDrag } from 'lib/react-magnetic-dnd';
import React, { useState, useCallback, useRef } from 'react';

export const DraggableBlock = ({ block, onSnapLinesChange }: { block: Block, onSnapLinesChange: (lines: any[]) => void }) => {
    const { document, updateBlockPosition, updateBlockStyle, removeBlock } = useEditorStore();
    const BlockComponent = blockRegistry[block.type]?.component;
    const [isResizing, setIsResizing] = useState<string | null>(null);
    const [isRotating, setIsRotating] = useState(false);
    const blockRef = useRef<HTMLDivElement>(null);
    const { selectBlock, selectedBlockId } = useEditorStore()

    const isSelected = selectedBlockId === block.id


    // Find children
    const childrenBlocks = document.blocks.filter(b => b.parentId === block.id);


    const handleDragEnd = (id: string, x: number, y: number) => {
        updateBlockPosition(id, x, y);
        onSnapLinesChange([]);
    };

    const drag = useMagneticDrag({
        id: block.id,
        initialX: block.x || 0,
        initialY: block.y || 0,
        snapThreshold: 5,
        onDragEnd: handleDragEnd
    });

    const handleResizeStart = (e: React.MouseEvent, direction: string) => {
        e.stopPropagation();
        e.preventDefault();
        setIsResizing(direction);
    };

    const handleRotateStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsRotating(true);
    };

    const handleTransformMove = useCallback((e: MouseEvent) => {
        if (isResizing && blockRef.current) {
            const rect = blockRef.current.getBoundingClientRect();
            let newWidth = block.style.width as number || rect.width;
            let newHeight = block.style.height as number || rect.height;

            if (isResizing.includes('r')) {
                newWidth = (e.clientX - rect.left);
            }
            if (isResizing.includes('b')) {
                newHeight = (e.clientY - rect.top);
            }

            updateBlockStyle(block.id, {
                width: Math.max(20, newWidth),
                height: Math.max(20, newHeight)
            });
        }

        if (isRotating && blockRef.current) {
            const rect = blockRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90;
            updateBlockStyle(block.id, {
                transform: `rotate(${angle}deg)`
            });
        }
    }, [isResizing, isRotating, block.id, block.style.width, block.style.height, updateBlockStyle]);

    const handleTransformEnd = useCallback(() => {
        setIsResizing(null);
        setIsRotating(false);
    }, []);

    React.useEffect(() => {
        if (isResizing || isRotating) {
            globalThis.window.addEventListener('mousemove', handleTransformMove);
            globalThis.window.addEventListener('mouseup', handleTransformEnd);
        }
        return () => {
            globalThis.window.removeEventListener('mousemove', handleTransformMove);
            globalThis.window.removeEventListener('mouseup', handleTransformEnd);
        };
    }, [isResizing, isRotating, handleTransformMove, handleTransformEnd]);

    // Notify parent of active snap lines when dragging
    React.useEffect(() => {
        if (drag.isDragging) {
            onSnapLinesChange(drag.snapLines);
        }
    }, [drag.snapLines, drag.isDragging, onSnapLinesChange]);

    if (!BlockComponent) return null;

    let zIndex = 10;
    if (drag.isDragging) {
        zIndex = 50;
    } else if (isSelected) {
        zIndex = 40;
    }

    let cursor = 'pointer';
    if (drag.isDragging) {
        cursor = 'grabbing';
    } else if (isResizing) {
        cursor = 'nwse-resize';
    }

    const containerStyle = {
        transform: `translate3d(${drag.x}px, ${drag.y}px, 0) ${block.style.transform || ''}`,
        transformOrigin: block.style.transformOrigin || 'center center',
        width: block.style.width,
        height: block.style.height,
        minWidth: block.style.minWidth || '50px',
        minHeight: block.style.minHeight || '20px',
        zIndex,
        padding: block.style.padding || '8px',
        margin: block.style.margin,
        borderRadius: block.style.borderRadius || '4px',
        cursor,
        backgroundColor: block.style.backgroundColor,
        color: block.style.color,
    };

    // Filter out layout styles from the block object passed to components
    const componentStyle = { ...block.style };
    delete componentStyle.width;
    delete componentStyle.height;
    delete componentStyle.position;
    delete componentStyle.left;
    delete componentStyle.top;
    delete componentStyle.transform;
    delete componentStyle.transformOrigin;
    delete componentStyle.margin;
    delete componentStyle.padding;
    delete componentStyle.backgroundColor;

    const filteredBlock = { ...block, style: componentStyle };

    return (
        <div
            ref={(el) => {
                drag.setNodeRef(el);
                (blockRef as any).current = el;
            }}
            style={containerStyle}
            className={`absolute left-0 top-0 transition-all ${isSelected ? 'border-2 border-dashed border-primary' : 'border-2 border-transparent'}`}
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); selectBlock(block.id); }}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    e.preventDefault();
                    selectBlock(block.id);
                }
            }}
            data-block-id={block.id}
            tabIndex={0}
        >
            {isSelected && (
                <>
                    <div className="absolute top-[-28px] left-[-2px] flex gap-1 bg-white border border-border rounded-base p-1 z-[60] shadow-sm transform-none">
                        <div {...drag.listeners} className={`p-1 flex items-center ${drag.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} aria-label="Drag to move">
                            <GripVertical size={16} className="text-muted" />
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} className="cursor-pointer bg-none border-none p-1 text-red-500 hover:text-red-700 flex items-center" aria-label="Delete block">
                            <Trash2 size={16} />
                        </button>
                    </div>

                    {/* Rotation Handle */}
                    <div
                        onMouseDown={handleRotateStart}
                        className="absolute top-[-40px] left-1/2 -translate-x-1/2 cursor-grab bg-white border border-primary rounded-full p-1 z-[60] flex items-center justify-center"
                    >
                        <RotateCw size={14} className="text-primary" />
                    </div>

                    {/* Resize Handles */}
                    <div onMouseDown={(e) => handleResizeStart(e, 'r')} className="absolute right-[-4px] top-0 bottom-0 w-2 cursor-ew-resize z-[60]" />
                    <div onMouseDown={(e) => handleResizeStart(e, 'b')} className="absolute left-0 right-0 bottom-[-4px] h-2 cursor-ns-resize z-[60]" />
                    <div onMouseDown={(e) => handleResizeStart(e, 'br')} className="absolute right-[-6px] bottom-[-6px] w-3 h-3 cursor-nwse-resize bg-white border-2 border-primary rounded-sm z-[61]" />
                </>
            )}
            <div
                className={`w-full h-full ${(drag.isDragging || isResizing || isRotating) ? 'pointer-events-none' : 'pointer-events-auto'}`}
            >
                <BlockComponent block={filteredBlock}>
                    {childrenBlocks.map(child => (
                        <DraggableBlock
                            key={child.id}
                            block={child}
                            onSnapLinesChange={onSnapLinesChange}
                        />
                    ))}
                </BlockComponent>
            </div>
        </div>
    );
};
