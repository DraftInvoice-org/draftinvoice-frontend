import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className = '', required, children, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={`text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground mb-2 block ${className}`}
                {...props}
            >
                {children}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
        );
    }
);

Label.displayName = 'Label';
