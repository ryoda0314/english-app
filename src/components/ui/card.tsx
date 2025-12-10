'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

// === Card ===
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'bordered' | 'glass';
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            className,
            variant = 'default',
            hover = true,
            padding = 'md',
            children,
            ...props
        },
        ref
    ) => {
        const variants = {
            default: `
        bg-white border border-cream-200
        shadow-[0_2px_15px_-3px_rgba(67,16,31,0.05),0_4px_6px_-4px_rgba(67,16,31,0.03)]
      `,
            elevated: `
        bg-white border border-cream-100
        shadow-[0_10px_40px_-10px_rgba(67,16,31,0.12),0_4px_6px_-4px_rgba(67,16,31,0.05)]
      `,
            bordered: `
        bg-white border-2 border-cream-300
        shadow-none
      `,
            glass: `
        bg-white/70 backdrop-blur-md border border-white/30
        shadow-[0_4px_25px_-5px_rgba(67,16,31,0.08)]
      `,
        };

        const paddings = {
            none: '',
            sm: 'p-3',
            md: 'p-5',
            lg: 'p-7',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl transition-all duration-300',
                    variants[variant],
                    paddings[padding],
                    hover && 'hover:shadow-[0_4px_25px_-5px_rgba(67,16,31,0.08),0_8px_10px_-6px_rgba(67,16,31,0.04)] hover:-translate-y-0.5',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

// === CardHeader ===
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> { }

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn('flex flex-col space-y-1.5 mb-4', className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

CardHeader.displayName = 'CardHeader';

// === CardTitle ===
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> { }

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={cn(
                    'font-[var(--font-display)] text-xl font-semibold text-charcoal-900 leading-tight',
                    className
                )}
                {...props}
            >
                {children}
            </h3>
        );
    }
);

CardTitle.displayName = 'CardTitle';

// === CardDescription ===
export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> { }

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <p
                ref={ref}
                className={cn('text-sm text-charcoal-500', className)}
                {...props}
            >
                {children}
            </p>
        );
    }
);

CardDescription.displayName = 'CardDescription';

// === CardContent ===
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> { }

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div ref={ref} className={cn('', className)} {...props}>
                {children}
            </div>
        );
    }
);

CardContent.displayName = 'CardContent';

// === CardFooter ===
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> { }

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'flex items-center gap-3 mt-4 pt-4 border-t border-cream-200',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
