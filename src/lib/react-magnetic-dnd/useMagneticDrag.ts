import { useState, useRef, useCallback, useEffect } from 'react';

export interface Box {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface SnapLine {
    axis: 'x' | 'y';
    position: number;
}

export interface UseMagneticDragOptions {
    id: string;
    initialX: number;
    initialY: number;
    snapThreshold?: number;
    onDragEnd?: (id: string, x: number, y: number) => void;
    disabled?: boolean;
}

export const useMagneticDrag = ({
    id,
    initialX,
    initialY,
    snapThreshold = 8,
    onDragEnd,
    disabled = false
}: UseMagneticDragOptions) => {
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const [snapLines, setSnapLines] = useState<SnapLine[]>([]);
    const nodeRef = useRef<HTMLElement | null>(null);
    const dragState = useRef({
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0,
        width: 0,
        height: 0,
        siblings: [] as Box[],
    });

    // Sync external changes if not dragging
    useEffect(() => {
        if (!isDragging) {
            setPosition({ x: initialX, y: initialY });
        }
    }, [initialX, initialY, isDragging]);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        if (disabled || e.button !== 0) return; // Only left click
        e.stopPropagation();

        const node = nodeRef.current;
        if (node) {
            const rect = node.getBoundingClientRect();
            dragState.current.width = rect.width;
            dragState.current.height = rect.height;
        }

        dragState.current.startX = e.clientX;
        dragState.current.startY = e.clientY;
        dragState.current.initialX = position.x;
        dragState.current.initialY = position.y;
        setIsDragging(true);
        setSnapLines([]);

        try {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch (err) {
            console.error('Failed to set pointer capture', err);
        }
    }, [disabled, position.x, position.y]);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging) return;
        e.stopPropagation();

        const deltaX = e.clientX - dragState.current.startX;
        const deltaY = e.clientY - dragState.current.startY;

        // Apply scale factor if canvas is zoomed (assuming it's in a CSS transform)
        // For a generic library, we might need a zoom prop, but for simplicity we assume 1:1 screen-to-coord ratio, 
        // or we expect the user to pass a zoom scalar. For now, we will add a basic 1:1 mapping.
        // Wait, if the canvas is zoomed, e.clientX delta will be smaller. 
        // Let's get the zoom from the parent element's transform.
        let scale = 1;
        if (nodeRef.current) {
            const parent = nodeRef.current.parentElement;
            if (parent) {
                const style = globalThis.window.getComputedStyle(parent);
                const match = style.transform.match(/matrix\(([^,]+)/);
                if (match) {
                    scale = Number.parseFloat(match[1]) || 1;
                }
            }
        }

        let nextX = dragState.current.initialX + (deltaX / scale);
        let nextY = dragState.current.initialY + (deltaY / scale);
        const width = dragState.current.width;
        const height = dragState.current.height;

        const activeSnapLines: SnapLine[] = [];

        // Center points of dragging element
        const centerX = nextX + width / 2;
        const centerY = nextY + height / 2;

        let snappedX = false;
        let snappedY = false;

        const siblings = dragState.current.siblings;

        // Check siblings
        for (const sib of siblings) {
            if (sib.id === id) continue; // Skip self

            const sibCenterX = sib.x + sib.width / 2;
            const sibCenterY = sib.y + sib.height / 2;

            // Simplify: We just check dragging centers vs sibling centers/edges
            // 1. Center X alignment
            if (!snappedX && Math.abs(centerX - sibCenterX) < snapThreshold) {
                nextX = sibCenterX - width / 2;
                activeSnapLines.push({ axis: 'x', position: sibCenterX });
                snappedX = true;
            }
            // 2. Left alignment
            if (!snappedX && Math.abs(nextX - sib.x) < snapThreshold) {
                nextX = sib.x;
                activeSnapLines.push({ axis: 'x', position: sib.x });
                snappedX = true;
            }
            // 3. Right alignment
            if (!snappedX && Math.abs((nextX + width) - (sib.x + sib.width)) < snapThreshold) {
                nextX = sib.x + sib.width - width;
                activeSnapLines.push({ axis: 'x', position: sib.x + sib.width });
                snappedX = true;
            }

            // Y-Axis Snapping
            // 1. Center Y alignment
            if (!snappedY && Math.abs(centerY - sibCenterY) < snapThreshold) {
                nextY = sibCenterY - height / 2;
                activeSnapLines.push({ axis: 'y', position: sibCenterY });
                snappedY = true;
            }
            // 2. Top alignment
            if (!snappedY && Math.abs(nextY - sib.y) < snapThreshold) {
                nextY = sib.y;
                activeSnapLines.push({ axis: 'y', position: sib.y });
                snappedY = true;
            }
            // 3. Bottom alignment
            if (!snappedY && Math.abs((nextY + height) - (sib.y + sib.height)) < snapThreshold) {
                nextY = sib.y + sib.height - height;
                activeSnapLines.push({ axis: 'y', position: sib.y + sib.height });
                snappedY = true;
            }

            if (snappedX && snappedY) break; // Break early if fully snapped
        }

        setPosition({ x: nextX, y: nextY });
        setSnapLines(activeSnapLines);
    }, [isDragging, id, snapThreshold]);

    const onPointerUp = useCallback((e: React.PointerEvent) => {
        if (!isDragging) return;
        e.stopPropagation();

        setIsDragging(false);
        setSnapLines([]);

        try {
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch (err) {
            // ignore
        }

        if (onDragEnd) {
            onDragEnd(id, position.x, position.y);
        }
    }, [isDragging, id, position.x, position.y, onDragEnd]);

    return {
        x: position.x,
        y: position.y,
        isDragging,
        snapLines,
        setNodeRef: (node: HTMLElement | null) => {
            nodeRef.current = node;
        },
        listeners: {
            onPointerDown,
            onPointerMove,
            onPointerUp,
            onPointerCancel: onPointerUp,
        }
    };
};
