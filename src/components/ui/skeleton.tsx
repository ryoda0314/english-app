'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-lg bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 bg-[length:200%_100%]',
                className
            )}
            style={{
                animation: 'shimmer 1.5s infinite',
            }}
        />
    );
}

// === SkeletonCard ===
export function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-cream-200 p-5 space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="pt-2">
                <Skeleton className="h-20 w-full" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
        </div>
    );
}

// === SkeletonPhraseCard ===
export function SkeletonPhraseCard() {
    return (
        <div className="bg-white rounded-2xl border border-cream-200 p-5 space-y-3">
            <div className="flex items-start justify-between">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 pt-2">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
        </div>
    );
}

// === SkeletonStoryScene ===
export function SkeletonStoryScene() {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-cream-200 p-6 space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="space-y-2 pt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
            <div className="bg-cream-100 rounded-2xl p-5 space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}

// === SkeletonThemeCard ===
export function SkeletonThemeCard() {
    return (
        <div className="bg-white rounded-2xl border border-cream-200 p-5 space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2 pt-2">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
            </div>
        </div>
    );
}
