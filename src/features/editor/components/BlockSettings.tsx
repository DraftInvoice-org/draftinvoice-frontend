import React, { useState } from 'react';
import { useEditorStore } from 'store/editorStore';
import { Tabs } from 'components/ui/Tabs';
import { ContentTab } from './settings/ContentTab';
import { DesignTab } from './settings/DesignTab';

type SettingsTab = 'content' | 'design';

const TABS: { label: string; id: SettingsTab }[] = [
    { id: 'content', label: 'Content' },
    { id: 'design', label: 'Design' },
];

export const BlockSettings = () => {
    const { document, updateBlockProps, updateBlockStyle, selectedBlockId } = useEditorStore();
    const [activeTab, setActiveTab] = useState<SettingsTab>('content');

    if (!selectedBlockId) {
        return (
            <div className="p-8 text-center text-muted">
                Select a block to edit its settings.
            </div>
        );
    }

    const block = document.blocks.find(b => b.id === selectedBlockId);
    if (!block) return null;

    const handlePropChange = (key: string, value: unknown) => {
        updateBlockProps(selectedBlockId, { [key]: value });
    };

    const handleStyleChange = (key: keyof React.CSSProperties, value: string) => {
        updateBlockStyle(selectedBlockId, { [key]: value });
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <Tabs
                tabs={TABS}
                activeTab={activeTab}
                onTabChange={(id) => setActiveTab(id as SettingsTab)}
            />

            <div className="p-4 flex-1 overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-foreground capitalize">
                    {block.type} Settings
                </h2>

                {activeTab === 'content' ? (
                    <ContentTab block={block} onPropChange={handlePropChange} />
                ) : (
                    <DesignTab style={block.style} onStyleChange={handleStyleChange} />
                )}

                <div className="mt-8 pt-4 border-t border-border text-xs text-muted">
                    <p>Edit properties to customize the selected {block.type} block.</p>
                </div>
            </div>
        </div>
    );
};
