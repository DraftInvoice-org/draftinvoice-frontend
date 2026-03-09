import React from 'react';
import type { SnapLine } from './useMagneticDrag';

export const SnapLines = ({ lines }: { lines: SnapLine[] }) => {
    if (!lines || lines.length === 0) return null;

    return (
        <React.Fragment>
            {lines.map((line, i) => {
                if (line.axis === 'x') {
                    const key = `snap-x-${i}`;
                    // Vertical line at x position
                    return (
                        <div
                            key={key}
                            style={{ left: `${line.position}px` }}
                            className="absolute inset-y-0 w-px border-l border-dashed border-destructive z-[100] pointer-events-none"
                        />
                    );
                } else {
                    const key = `snap-y-${i}`;
                    // Horizontal line at y position
                    return (
                        <div
                            key={key}
                            style={{ top: `${line.position}px` }}
                            className="absolute inset-x-0 h-px border-t border-dashed border-destructive z-[100] pointer-events-none"
                        />
                    );
                }
            })}
        </React.Fragment>
    );
};
