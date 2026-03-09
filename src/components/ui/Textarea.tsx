import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = '', error, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={`flex min-h-[80px] w-full rounded-base border border-border bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500 focus-visible:ring-red-500' : ''} ${className}`}
                {...props}
            />
        );
    }
);

Textarea.displayName = 'Textarea';
