import { Tabs } from 'components/ui/Tabs';
import { AuthModal } from 'features/auth/components/AuthModal';
import { useState } from 'react';
import { AddBlocksTab } from './AddBlocksTab';
import { LayersPanel } from './LayersPanel';

type SidebarTabsIds = "layers" | "add_blocks";

const sidebarTabs: { label: string; id: SidebarTabsIds }[] = [
    { label: "Layers", id: "layers" },
    { label: "Add Blocks", id: "add_blocks" }
];

export const EditorControls = () => {
    const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTabsIds>("layers");


    const [showAuthModal, setShowAuthModal] = useState(false);


    return (
        <>
            <div className="flex flex-col h-full overflow-hidden">
                <Tabs
                    tabs={sidebarTabs}
                    activeTab={activeSidebarTab}
                    onTabChange={(id) => setActiveSidebarTab(id as SidebarTabsIds)}
                />
                <div className="flex-1 overflow-y-auto p-4">
                    {activeSidebarTab === 'layers' ? (
                        <LayersPanel />
                    ) : (
                        <AddBlocksTab />
                    )}
                </div>
            </div>

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </>
    );
};