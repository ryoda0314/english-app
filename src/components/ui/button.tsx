'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-medium transition-all duration-200 ease-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:pointer-events-none disabled:opacity-50
      active:scale-[0.98]
    `;

        const variants = {
            primary: `
        bg-gradient-to-br from-primary-600 to-primary-700 text-white
        shadow-[0_4px_14px_-3px_rgba(13,147,117,0.4)]
        hover:from-primary-500 hover:to-primary-600
        hover:shadow-[0_6px_20px_-3px_rgba(13,147,117,0.5)]
        hover:-translate-y-0.5
        focus-visible:ring-primary-500
      `,
            secondary: `
        bg-cream-100 text-charcoal-800 border border-cream-300
        hover:bg-cream-200 hover:border-cream-400
        focus-visible:ring-cream-400
      `,
            ghost: `
        bg-transparent text-charcoal-700
        hover:bg-cream-100
        focus-visible:ring-charcoal-300
      `,
            destructive: `
        bg-gradient-to-br from-red-500 to-red-600 text-white
        shadow-[0_4px_14px_-3px_rgba(239,68,68,0.4)]
        hover:from-red-400 hover:to-red-500
        hover:shadow-[0_6px_20px_-3px_rgba(239,68,68,0.5)]
        hover:-translate-y-0.5
        focus-visible:ring-red-500
      `,
            outline: `
        bg-transparent border-2 border-primary-600 text-primary-700
        hover:bg-primary-50
        focus-visible:ring-primary-500
      `,
        };

        const sizes = {
            sm: 'h-8 px-3 text-sm rounded-lg',
            md: 'h-10 px-5 text-[0.9375rem] rounded-xl',
            lg: 'h-12 px-7 text-base rounded-xl',
            icon: 'h-10 w-10 rounded-xl',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    leftIcon
                )}
                {children}
                {!isLoading && rightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
