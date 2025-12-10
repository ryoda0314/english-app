'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
    variant?: 'default' | 'diary';
    showCharCount?: boolean;
    maxLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            className,
            label,
            error,
            hint,
            variant = 'default',
            showCharCount = false,
            maxLength,
            value,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
        const charCount = typeof value === 'string' ? value.length : 0;

        const variants = {
            default: '',
            diary: `
        min-h-[250px] leading-8
        bg-[linear-gradient(transparent,transparent_31px,var(--cream-200)_31px,var(--cream-200)_32px)]
        bg-[length:100%_32px]
        bg-local
        pt-2
      `,
        };

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-charcoal-700 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <textarea
                        ref={ref}
                        id={inputId}
                        value={value}
                        maxLength={maxLength}
                        className={cn(
                            `w-full px-4 py-3 
              font-[var(--font-body)] text-base
              bg-white border-2 border-cream-300 rounded-xl
              placeholder:text-charcoal-400
              transition-all duration-200
              resize-y min-h-[120px]
              focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-cream-100`,
                            variants[variant],
                            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10',
                            className
                        )}
                        {...props}
                    />
                </div>
                <div className="flex justify-between mt-1.5">
                    <p
                        className={cn(
                            'text-sm',
                            error ? 'text-red-600' : 'text-charcoal-500'
                        )}
                    >
                        {error || hint}
                    </p>
                    {showCharCount && maxLength && (
                        <p
                            className={cn(
                                'text-sm',
                                charCount > maxLength * 0.9
                                    ? 'text-red-600'
                                    : 'text-charcoal-400'
                            )}
                        >
                            {charCount}/{maxLength}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export { Textarea };
