import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names with Tailwind CSS conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to Japanese locale
 */
export function formatDateJa(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format relative time (e.g., "3日前")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'たった今';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分前`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}時間前`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}日前`;
  return formatDateJa(d);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sleep utility for animations/delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Emotion label mappings
 */
export const EMOTION_LABELS: Record<string, { ja: string; emoji: string }> = {
  anxiety: { ja: '不安', emoji: '😰' },
  joy: { ja: '喜び', emoji: '😊' },
  sadness: { ja: '悲しみ', emoji: '😢' },
  anger: { ja: '怒り', emoji: '😠' },
  surprise: { ja: '驚き', emoji: '😲' },
  fear: { ja: '恐れ', emoji: '😨' },
  mixed: { ja: '複雑', emoji: '🤔' },
  excitement: { ja: 'ワクワク', emoji: '🤩' },
  tiredness: { ja: '疲労', emoji: '😩' },
  relief: { ja: '安心', emoji: '😌' },
};

/**
 * Tone label mappings
 */
export const TONE_LABELS: Record<string, { ja: string }> = {
  casual: { ja: 'カジュアル' },
  polite: { ja: '丁寧' },
  playful: { ja: 'おちゃめ' },
  serious: { ja: '真剣' },
};

/**
 * Source type icons
 */
export const SOURCE_ICONS: Record<string, string> = {
  diary: '📓',
  story: '📖',
  slang: '🔥',
};
