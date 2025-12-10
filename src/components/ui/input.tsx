'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type = 'text',
            label,
            error,
            hint,
            leftIcon,
            rightIcon,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

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
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        type={type}
                        className={cn(
                            `w-full px-4 py-3 
              font-[var(--font-body)] text-base
              bg-white border-2 border-cream-300 rounded-xl
              placeholder:text-charcoal-400
              transition-all duration-200
              focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-cream-100`,
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10',
                            className
                        )}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {(error || hint) && (
                    <p
                        className={cn(
                            'mt-1.5 text-sm',
                            error ? 'text-red-600' : 'text-charcoal-500'
                        )}
                    >
                        {error || hint}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
