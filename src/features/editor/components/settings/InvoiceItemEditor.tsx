import { X, Plus } from 'lucide-react';
import { Input } from 'components/ui/Input';
import { Button } from 'components/ui/Button';

interface InvoiceItem {
    desc: string;
    qty: number;
    price: number;
}

interface InvoiceItemEditorProps {
    items: InvoiceItem[];
    onChange: (items: InvoiceItem[]) => void;
}

export const InvoiceItemEditor = ({ items, onChange }: InvoiceItemEditorProps) => {
    const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const addItem = () => {
        onChange([...items, { desc: 'New Item', qty: 1, price: 0 }]);
    };

    return (
        <div>
            {items.length === 0 ? (
                <p className="text-sm text-muted mb-4">No items defined.</p>
            ) : (
                <div className="flex flex-col gap-3 mb-4">
                    {items.map((item, i) => (
                        <div key={`item-${item.desc}-${i}`} className="p-3 border border-border rounded-base bg-slate-50 relative group">
                            <button
                                onClick={() => removeItem(i)}
                                className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-red-200"
                                title="Remove Item"
                                aria-label="Remove Item"
                            >
                                <X size={12} />
                            </button>
                            <div className="mb-2">
                                <Input
                                    placeholder="Item description"
                                    value={item.desc}
                                    onChange={(e) => updateItem(i, 'desc', e.target.value)}
                                    className="h-8 text-xs"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    placeholder="Qty"
                                    value={item.qty}
                                    onChange={(e) => updateItem(i, 'qty', Number.parseInt(e.target.value) || 0)}
                                    className="h-8 text-xs"
                                />
                                <Input
                                    type="number"
                                    placeholder="Price"
                                    value={item.price}
                                    onChange={(e) => updateItem(i, 'price', Number.parseFloat(e.target.value) || 0)}
                                    className="h-8 text-xs"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Button onClick={addItem} variant="secondary" size="sm" className="w-full">
                <Plus size={14} className="mr-1" /> Add Item
            </Button>
        </div>
    );
};
