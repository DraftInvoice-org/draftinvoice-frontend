import { Input } from 'components/ui/Input';
import { Label } from 'components/ui/Label';
import { Textarea } from 'components/ui/Textarea';
import { InvoiceItemEditor } from './InvoiceItemEditor';
import type { Block } from 'types/document';

interface ContentTabProps {
    block: Block;
    onPropChange: (key: string, value: unknown) => void;
}

export const ContentTab = ({ block, onPropChange }: ContentTabProps) => {
    return (
        <div className="flex flex-col gap-4">

            {(block.type === 'text' || block.type === 'header') && (
                <div>
                    <Label htmlFor="text-input">Text</Label>
                    <Textarea
                        id="text-input"
                        value={block.props.text || ''}
                        onChange={(e) => onPropChange('text', e.target.value)}
                        rows={4}
                    />
                </div>
            )}

            {block.type === 'logo' && (
                <>
                    <div>
                        <Label htmlFor="logo-url-input">Image URL</Label>
                        <Input
                            id="logo-url-input"
                            type="text"
                            value={block.props.url || ''}
                            onChange={(e) => onPropChange('url', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="logo-width-input">Width (e.g. 150px)</Label>
                        <Input
                            id="logo-width-input"
                            type="text"
                            value={block.props.width || '150px'}
                            onChange={(e) => onPropChange('width', e.target.value)}
                        />
                    </div>
                </>
            )}

            {block.type === 'totals' && (
                <>
                    <div>
                        <Label htmlFor="subtotal-input">Subtotal</Label>
                        <Input
                            id="subtotal-input"
                            type="number"
                            value={block.props.subtotal || 0}
                            onChange={(e) => onPropChange('subtotal', Number.parseFloat(e.target.value) || 0)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="tax-input">Tax</Label>
                        <Input
                            id="tax-input"
                            type="number"
                            value={block.props.tax || 0}
                            onChange={(e) => onPropChange('tax', Number.parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </>
            )}

            {block.type === 'invoice-items' && (
                <div>
                    <Label>Items</Label>
                    <InvoiceItemEditor
                        items={block.props.items || []}
                        onChange={(items) => onPropChange('items', items)}
                    />
                </div>
            )}

        </div>
    );
};
