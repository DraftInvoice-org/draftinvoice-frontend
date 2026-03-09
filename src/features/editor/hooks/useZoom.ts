import { useEditorStore } from 'store/editorStore';

/**
 * Encapsulates zoom control logic for the editor canvas.
 * Provides helpers to zoom in, out, reset, and read current state.
 */
export const useZoom = () => {
    const { zoom, setZoom, maxZoom, minZoom } = useEditorStore();

    const zoomIn = (step = 10) => setZoom(z => Math.min(z + step, maxZoom));
    const zoomOut = (step = 10) => setZoom(z => Math.max(z - step, minZoom));
    const resetZoom = () => setZoom(100);

    return { zoom, zoomIn, zoomOut, resetZoom, maxZoom, minZoom };
};
