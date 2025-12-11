'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Check, Volume2, AlertTriangle, Loader2, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export type RiskLevel = 'safe' | 'careful' | 'avoid';

interface SlangCardProps {
    phrase: string;
    meaning_ja: string;
    nuance_ja?: string | null;
    example_en?: string | null;
    example_ja?: string | null;
    tone?: string;
    risk_level: RiskLevel;
    region?: string;
    tags?: string[];
    onSave?: () => Promise<void>;
    isSaved?: boolean;
    className?: string;
}

const RISK_CONFIG: Record<RiskLevel, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
    safe: {
        color: 'text-green-700',
        bg: 'bg-green-100',
        icon: <Check className="w-4 h-4" />,
        label: '安全',
    },
    careful: {
        color: 'text-amber-700',
        bg: 'bg-amber-100',
        icon: <AlertTriangle className="w-4 h-4" />,
        label: '注意',
    },
    avoid: {
        color: 'text-red-700',
        bg: 'bg-red-100',
        icon: <AlertTriangle className="w-4 h-4" />,
        label: '非推奨',
    },
};

export function SlangCard({
    phrase,
    meaning_ja,
    nuance_ja,
    example_en,
    example_ja,
    tone = 'casual',
    risk_level,
    region,
    tags,
    onSave,
    isSaved = false,
    className,
}: SlangCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const riskConfig = RISK_CONFIG[risk_level];

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!onSave || isSaved || isSaving) return;

        try {
            setIsSaving(true);
            await onSave();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            className={cn(
                'relative w-full max-w-md mx-auto perspective-1000',
                className
            )}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                className="relative w-full cursor-pointer"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front of card */}
                <div
                    className={cn(
                        'absolute w-full backface-hidden',
                        'bg-white rounded-2xl shadow-lg border border-cream-200 p-6',
                        'min-h-[280px] flex flex-col items-center justify-center'
                    )}
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {/* Risk Badge */}
                    <div className={cn(
                        'absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                        riskConfig.bg, riskConfig.color
                    )}>
                        {riskConfig.icon}
                        <span>{riskConfig.label}</span>
                    </div>

                    {/* Phrase */}
                    <h2 className="font-[var(--font-display)] text-4xl font-bold text-charcoal-900 text-center mb-4">
                        {phrase}
                    </h2>

                    {/* Tone & Region */}
                    <div className="flex items-center gap-2 text-sm text-charcoal-500">
                        {tone && (
                            <span className="px-2 py-0.5 bg-cream-100 rounded-full">
                                {tone}
                            </span>
                        )}
                        {region && (
                            <span className="px-2 py-0.5 bg-cream-100 rounded-full">
                                {region}
                            </span>
                        )}
                    </div>

                    {/* Tap hint */}
                    <p className="absolute bottom-4 text-xs text-charcoal-400">
                        タップして意味を表示
                    </p>
                </div>

                {/* Back of card */}
                <div
                    className={cn(
                        'w-full backface-hidden',
                        'bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-lg border border-cream-200 p-6',
                        'min-h-[280px]'
                    )}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    {/* Risk Badge */}
                    <div className={cn(
                        'absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                        riskConfig.bg, riskConfig.color
                    )}>
                        {riskConfig.icon}
                        <span>{riskConfig.label}</span>
                    </div>

                    {/* Phrase (smaller) */}
                    <h3 className="font-[var(--font-display)] text-2xl font-bold text-charcoal-900 mb-3">
                        {phrase}
                    </h3>

                    {/* Meaning */}
                    <div className="mb-4">
                        <p className="text-lg text-charcoal-800 font-medium">
                            {meaning_ja}
                        </p>
                    </div>

                    {/* Nuance */}
                    {nuance_ja && (
                        <div className="mb-4 p-3 bg-white/60 rounded-lg">
                            <div className="flex items-center gap-1 text-xs text-charcoal-500 mb-1">
                                <Info className="w-3 h-3" />
                                ニュアンス
                            </div>
                            <p className="text-sm text-charcoal-700">
                                {nuance_ja}
                            </p>
                        </div>
                    )}

                    {/* Example */}
                    {example_en && (
                        <div className="mb-4">
                            <p className="text-sm font-medium text-primary-700 mb-1">
                                &ldquo;{example_en}&rdquo;
                            </p>
                            {example_ja && (
                                <p className="text-xs text-charcoal-500">
                                    {example_ja}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Tags */}
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                            {tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-0.5 bg-cream-200 rounded-full text-xs text-charcoal-600"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-cream-200">
                        <button
                            onClick={handleSave}
                            disabled={isSaved || isSaving}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                isSaved
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                            )}
                        >
                            {isSaved ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    保存済み
                                </>
                            ) : isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    保存中...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    保存
                                </>
                            )}
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-charcoal-600 hover:bg-cream-100 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                // TODO: TTS
                            }}
                        >
                            <Volume2 className="w-4 h-4" />
                            発音
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
