import React from 'react';
import { Input } from 'components/ui/Input';
import { Label } from 'components/ui/Label';
import { Select } from 'components/ui/Select';

interface DesignTabProps {
    style: React.CSSProperties;
    onStyleChange: (key: keyof React.CSSProperties, value: string) => void;
}

export const DesignTab = ({ style, onStyleChange }: DesignTabProps) => {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <Label htmlFor="font-size-input">Font Size</Label>
                <Input
                    id="font-size-input"
                    type="text"
                    placeholder="e.g. 16px, 1.5rem"
                    value={style.fontSize as string || ''}
                    onChange={(e) => onStyleChange('fontSize', e.target.value)}
                />
            </div>

            <div>
                <Label htmlFor="text-color-input">Text Color</Label>
                <div className="flex gap-2">
                    <Input
                        id="text-color-input"
                        type="color"
                        value={style.color as string || '#000000'}
                        onChange={(e) => onStyleChange('color', e.target.value)}
                        className="w-12 h-10 p-1"
                    />
                    <Input
                        type="text"
                        placeholder="#000000"
                        value={style.color as string || ''}
                        onChange={(e) => onStyleChange('color', e.target.value)}
                        className="flex-1"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="background-color-input">Background Color</Label>
                <div className="flex gap-2">
                    <Input
                        id="background-color-input"
                        type="color"
                        value={style.backgroundColor as string || '#ffffff'}
                        onChange={(e) => onStyleChange('backgroundColor', e.target.value)}
                        className="w-12 h-10 p-1"
                    />
                    <Input
                        type="text"
                        placeholder="transparent"
                        value={style.backgroundColor as string || ''}
                        onChange={(e) => onStyleChange('backgroundColor', e.target.value)}
                        className="flex-1"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <Label htmlFor="width-input">Width</Label>
                    <Input
                        id="width-input"
                        type="text"
                        placeholder="auto, 100%"
                        value={style.width as string || ''}
                        onChange={(e) => onStyleChange('width', e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="height-input">Height</Label>
                    <Input
                        id="height-input"
                        type="text"
                        placeholder="auto"
                        value={style.height as string || ''}
                        onChange={(e) => onStyleChange('height', e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <Label htmlFor="padding-input">Padding</Label>
                    <Input
                        id="padding-input"
                        type="text"
                        value={style.padding as string || ''}
                        onChange={(e) => onStyleChange('padding', e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="margin-input">Margin</Label>
                    <Input
                        id="margin-input"
                        type="text"
                        value={style.margin as string || ''}
                        onChange={(e) => onStyleChange('margin', e.target.value)}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="border-input">Border</Label>
                <Input
                    id="border-input"
                    type="text"
                    placeholder="1px solid #e2e8f0"
                    value={style.border as string || ''}
                    onChange={(e) => onStyleChange('border', e.target.value)}
                />
            </div>

            <div>
                <Label htmlFor="border-radius-input">Border Radius</Label>
                <Input
                    id="border-radius-input"
                    type="text"
                    placeholder="4px, 50%"
                    value={style.borderRadius as string || ''}
                    onChange={(e) => onStyleChange('borderRadius', e.target.value)}
                />
            </div>

            <div>
                <Label htmlFor="text-align-input">Text Align</Label>
                <Select
                    id="text-align-input"
                    value={style.textAlign as string || 'left'}
                    onChange={(e) => onStyleChange('textAlign', e.target.value)}
                >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="justify">Justify</option>
                </Select>
            </div>
        </div>
    );
};
