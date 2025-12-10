'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Check, Volume2, X, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface InteractivePhraseProps {
    phrase: string;
    onSave?: () => Promise<void>;
    isSaved?: boolean;
    className?: string;
}

export function InteractivePhrase({
    phrase,
    onSave,
    isSaved = false,
    className,
}: InteractivePhraseProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const containerRef = useRef<HTMLSpanElement>(null);

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!onSave || isSaved || isSaving) return;

        try {
            setIsSaving(true);
            await onSave();
        } finally {
            setIsSaving(false);
            // Don't close immediately so user can see the "Saved" state
            setTimeout(() => setIsOpen(false), 1500);
        }
    };

    return (
        <span
            ref={containerRef}
            className={cn(
                'relative inline-block cursor-pointer font-semibold transition-colors duration-200',
                isOpen ? 'text-primary-600' : 'hover:text-primary-600',
                className
            )}
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* The parsing logic might leave ** in the text passed here, strip them if needed */}
            <span className="border-b-2 border-primary-200/50 pb-0.5 whitespace-nowrap">
                {phrase.replace(/\*\*/g, '')}
            </span>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-1/2 -mb-2 -translate-x-1/2 z-50 min-w-[140px]"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when interacting with menu
                    >
                        {/* Tooltip Arrow */}
                        <div className="absolute top-full left-1/2 -mt-[5px] -ml-[6px] border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm" />

                        <div className="bg-white rounded-lg shadow-xl border border-charcoal-100 p-2 flex flex-col gap-1 overflow-hidden">
                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                disabled={isSaved || isSaving}
                                className={cn(
                                    'flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                    isSaved
                                        ? 'bg-green-50 text-green-700'
                                        : 'hover:bg-cream-100 text-charcoal-700'
                                )}
                            >
                                {isSaved ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        <span>保存済み</span>
                                    </>
                                ) : isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>保存中...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>フレーズを保存</span>
                                    </>
                                )}
                            </button>

                            {/* Audio Button (Placeholder for now) */}
                            <button
                                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium text-charcoal-500 hover:bg-cream-100 hover:text-charcoal-700 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // TODO: Implement TTS
                                }}
                            >
                                <Volume2 className="w-4 h-4" />
                                <span>発音を聞く</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
}
