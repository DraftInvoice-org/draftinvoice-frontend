import { useState } from 'react';
import { SnapLines, type SnapLine } from 'lib/react-magnetic-dnd';
import { useEditorStore } from 'store/editorStore';
import { DraggableBlock } from './DraggableBlock';

export const CanvasRenderer = () => {
    const { document, selectBlock } = useEditorStore();
    const [globalSnapLines, setGlobalSnapLines] = useState<SnapLine[]>([]);

    return (
        <div
            aria-label="Invoice document"
            id="invoice-document-canvas"
            className="w-[794px] min-h-[1123px] p-10 shadow-lg mx-auto focus:outline-none"
            style={{
                backgroundColor: document.background || 'white',
            }}
            onClick={() => selectBlock(null)}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectBlock(null); }}
        >
            <SnapLines lines={globalSnapLines} />
            {document.blocks.filter(b => !b.parentId).map((block) => (
                <DraggableBlock
                    key={block.id}
                    block={block}
                    onSnapLinesChange={setGlobalSnapLines}
                />
            ))}
        </div >
    );
};
