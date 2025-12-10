'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'error';
    size?: 'sm' | 'md';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
        const variants = {
            default: 'bg-cream-200 text-charcoal-700',
            primary: 'bg-primary-100 text-primary-700',
            secondary: 'bg-secondary-100 text-secondary-700',
            accent: 'bg-accent-100 text-accent-700',
            success: 'bg-green-100 text-green-700',
            warning: 'bg-amber-100 text-amber-700',
            error: 'bg-red-100 text-red-700',
        };

        const sizes = {
            sm: 'px-2 py-0.5 text-xs',
            md: 'px-2.5 py-1 text-xs',
        };

        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center gap-1 font-medium rounded-full',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';

// === EmotionBadge ===
export interface EmotionBadgeProps extends HTMLAttributes<HTMLSpanElement> {
    emotion: string;
    showEmoji?: boolean;
}

const EMOTION_STYLES: Record<string, { bg: string; text: string; emoji: string }> = {
    anxiety: { bg: 'bg-secondary-100', text: 'text-secondary-700', emoji: '😰' },
    joy: { bg: 'bg-accent-100', text: 'text-accent-700', emoji: '😊' },
    sadness: { bg: 'bg-blue-100', text: 'text-blue-700', emoji: '😢' },
    anger: { bg: 'bg-red-100', text: 'text-red-700', emoji: '😠' },
    surprise: { bg: 'bg-purple-100', text: 'text-purple-700', emoji: '😲' },
    fear: { bg: 'bg-slate-100', text: 'text-slate-700', emoji: '😨' },
    mixed: { bg: 'bg-cream-200', text: 'text-charcoal-700', emoji: '🤔' },
    excitement: { bg: 'bg-orange-100', text: 'text-orange-700', emoji: '🤩' },
    tiredness: { bg: 'bg-gray-100', text: 'text-gray-700', emoji: '😩' },
    relief: { bg: 'bg-teal-100', text: 'text-teal-700', emoji: '😌' },
};

const EmotionBadge = forwardRef<HTMLSpanElement, EmotionBadgeProps>(
    ({ className, emotion, showEmoji = true, ...props }, ref) => {
        const style = EMOTION_STYLES[emotion] || EMOTION_STYLES.mixed;

        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full',
                    style.bg,
                    style.text,
                    className
                )}
                {...props}
            >
                {showEmoji && <span>{style.emoji}</span>}
                <span className="capitalize">{emotion}</span>
            </span>
        );
    }
);

EmotionBadge.displayName = 'EmotionBadge';

// === ToneBadge ===
export interface ToneBadgeProps extends HTMLAttributes<HTMLSpanElement> {
    tone: 'casual' | 'polite' | 'playful' | 'serious';
}

const TONE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    casual: { bg: 'bg-primary-100', text: 'text-primary-700', label: 'カジュアル' },
    polite: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: '丁寧' },
    playful: { bg: 'bg-pink-100', text: 'text-pink-700', label: 'おちゃめ' },
    serious: { bg: 'bg-charcoal-200', text: 'text-charcoal-800', label: '真剣' },
};

const ToneBadge = forwardRef<HTMLSpanElement, ToneBadgeProps>(
    ({ className, tone, ...props }, ref) => {
        const style = TONE_STYLES[tone] || TONE_STYLES.casual;

        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded',
                    style.bg,
                    style.text,
                    className
                )}
                {...props}
            >
                {style.label}
            </span>
        );
    }
);

ToneBadge.displayName = 'ToneBadge';

// === RiskBadge ===
export interface RiskBadgeProps extends HTMLAttributes<HTMLSpanElement> {
    level: 'safe' | 'careful' | 'avoid';
}

const RISK_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    safe: { bg: 'bg-green-100', text: 'text-green-700', label: '安全' },
    careful: { bg: 'bg-amber-100', text: 'text-amber-700', label: '注意' },
    avoid: { bg: 'bg-red-100', text: 'text-red-700', label: '避ける' },
};

const RiskBadge = forwardRef<HTMLSpanElement, RiskBadgeProps>(
    ({ className, level, ...props }, ref) => {
        const style = RISK_STYLES[level] || RISK_STYLES.safe;

        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded',
                    style.bg,
                    style.text,
                    className
                )}
                {...props}
            >
                {style.label}
            </span>
        );
    }
);

RiskBadge.displayName = 'RiskBadge';

export { Badge, EmotionBadge, ToneBadge, RiskBadge };
