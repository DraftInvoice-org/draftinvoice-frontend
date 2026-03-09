import { blockRegistry } from 'features/editor/registry/blockRegistry';
import { useEditorStore } from 'store/editorStore';
import { type BlockType } from 'types/document';

export const AddBlocksTab = () => {
    const { addBlock, document, selectedBlockId } = useEditorStore();

    const handleAddBlock = (type: BlockType) => {
        const selectedBlock = document.blocks.find(b => b.id === selectedBlockId);
        const parentId = selectedBlock?.type === 'container' ? selectedBlockId : undefined;
        addBlock(type, parentId || undefined);
    };

    return (
        <div>
            <div className="flex flex-col gap-2">
                {Object.entries(blockRegistry).map(([type, config]) => (
                    <button
                        key={type}
                        onClick={() => handleAddBlock(type as BlockType)}
                        className="flex items-center gap-3 p-3 bg-white border border-border rounded-base cursor-pointer hover:border-accent hover:bg-slate-50 transition text-left w-full"
                    >
                        <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center font-bold text-muted uppercase text-xs">
                            {type[0]}
                        </div>
                        <span className="font-medium text-foreground">{config.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};