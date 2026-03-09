

interface TabsProps {
    tabs: { label: string; id: string }[];
    activeTab: string;
    onTabChange: (id: string) => void;
    className?: string;
}

export const Tabs = ({ tabs, activeTab, onTabChange, className = '' }: TabsProps) => {
    return (
        <ul className={`grid border-b border-border ${className}`} style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
            {tabs.map((tab) => {
                const active = activeTab === tab.id;
                return (
                    <li key={tab.id}>
                        <button
                            onClick={() => onTabChange(tab.id)}
                            className={`w-full py-3 text-sm font-bold transition-all
                            ${active
                                    ? "text-primary border-b-2 border-primary bg-primary/5"
                                    : "text-muted hover:text-foreground hover:bg-slate-50"}
                            `}
                        >
                            {tab.label}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};
