'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Card,
    CardContent,
    Button,
    Input,
    Badge,
    RiskBadge,
} from '@/components/ui';
import {
    Flame,
    Search,
    TrendingUp,
    ChevronRight,
    BookMarked,
    Save,
} from 'lucide-react';

// Mock data
const mockSlangs = [
    {
        id: '1',
        phrase: 'lowkey',
        readingHintJa: 'ローキー',
        meaningJa: '少し〜、内心〜、控えめに本音を言う時に使う',
        tone: 'casual',
        riskLevel: 'safe' as const,
        tags: ['友達', '恋愛', 'SNS'],
        popularityScore: 9.2,
        emoji: '🤫',
    },
    {
        id: '2',
        phrase: 'no cap',
        readingHintJa: 'ノーキャップ',
        meaningJa: 'マジで、嘘じゃなく、本当に',
        tone: 'casual',
        riskLevel: 'safe' as const,
        tags: ['友達', 'SNS'],
        popularityScore: 8.8,
        emoji: '🧢',
    },
    {
        id: '3',
        phrase: 'slay',
        readingHintJa: 'スレイ',
        meaningJa: '最高、やばい（褒め言葉）、かっこいい',
        tone: 'casual',
        riskLevel: 'safe' as const,
        tags: ['SNS', 'ファッション'],
        popularityScore: 8.5,
        emoji: '✨',
    },
    {
        id: '4',
        phrase: 'rizz',
        readingHintJa: 'リズ',
        meaningJa: '異性を惹きつける魅力、口説きスキル',
        tone: 'casual',
        riskLevel: 'careful' as const,
        tags: ['恋愛', 'SNS'],
        popularityScore: 8.3,
        emoji: '😏',
    },
    {
        id: '5',
        phrase: 'simp',
        readingHintJa: 'シンプ',
        meaningJa: '誰かに夢中になりすぎている人（やや揶揄）',
        tone: 'casual',
        riskLevel: 'careful' as const,
        tags: ['恋愛', 'ネット'],
        popularityScore: 7.9,
        emoji: '🥺',
    },
    {
        id: '6',
        phrase: 'vibe',
        readingHintJa: 'バイブ',
        meaningJa: '雰囲気、フィーリング、空気感',
        tone: 'casual',
        riskLevel: 'safe' as const,
        tags: ['日常', '音楽'],
        popularityScore: 9.0,
        emoji: '🌊',
    },
    {
        id: '7',
        phrase: 'sus',
        readingHintJa: 'サス',
        meaningJa: '怪しい、疑わしい（suspiciousの略）',
        tone: 'casual',
        riskLevel: 'safe' as const,
        tags: ['ゲーム', '日常'],
        popularityScore: 7.5,
        emoji: '🤨',
    },
    {
        id: '8',
        phrase: 'bet',
        readingHintJa: 'ベット',
        meaningJa: 'OK、了解、いいよ（肯定の返事）',
        tone: 'casual',
        riskLevel: 'safe' as const,
        tags: ['日常', '友達'],
        popularityScore: 8.0,
        emoji: '👍',
    },
];

const TAGS = ['すべて', '友達', '恋愛', 'SNS', '日常', 'ゲーム', 'ファッション'];

export default function SlangPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTag, setActiveTag] = useState('すべて');
    const [savedSlangs, setSavedSlangs] = useState<string[]>([]);

    const filteredSlangs = mockSlangs.filter((slang) => {
        const matchesSearch =
            slang.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
            slang.meaningJa.includes(searchQuery);
        const matchesTag =
            activeTag === 'すべて' || slang.tags.includes(activeTag);
        return matchesSearch && matchesTag;
    });

    const trendingSlangs = [...mockSlangs]
        .sort((a, b) => b.popularityScore - a.popularityScore)
        .slice(0, 3);

    const handleSave = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (savedSlangs.includes(id)) {
            setSavedSlangs((prev) => prev.filter((s) => s !== id));
        } else {
            setSavedSlangs((prev) => [...prev, id]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center">
                        <Flame className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <h1 className="font-[var(--font-display)] text-3xl font-bold text-charcoal-900">
                            トレンドスラング
                        </h1>
                        <p className="text-charcoal-500 text-sm">
                            ネイティブが使う最新の表現を学ぼう
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Trending Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
            >
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <h2 className="font-[var(--font-display)] text-xl font-semibold text-charcoal-900">
                        今週のトップ3
                    </h2>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                    {trendingSlangs.map((slang, index) => (
                        <motion.div
                            key={slang.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                        >
                            <Link href={`/slang/${slang.id}`}>
                                <Card
                                    variant="default"
                                    padding="md"
                                    className="group cursor-pointer hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 transition-all"
                                >
                                    <CardContent>
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-3xl">{slang.emoji}</span>
                                            <span className="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">
                                                #{index + 1}
                                            </span>
                                        </div>
                                        <h3 className="font-mono text-xl font-bold text-charcoal-900 group-hover:text-orange-600 transition-colors">
                                            {slang.phrase}
                                        </h3>
                                        <p className="text-xs text-charcoal-400 mb-2">
                                            {slang.readingHintJa}
                                        </p>
                                        <p className="text-sm text-charcoal-600 line-clamp-2">
                                            {slang.meaningJa}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
            >
                <Input
                    placeholder="スラングを検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-5 h-5" />}
                />

                {/* Tag Filter */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {TAGS.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${activeTag === tag
                                    ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-300'
                                    : 'bg-cream-100 text-charcoal-600 hover:bg-cream-200'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* All Slangs */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h2 className="font-[var(--font-display)] text-xl font-semibold text-charcoal-900 mb-4">
                    すべてのスラング
                </h2>
                <div className="space-y-3">
                    {filteredSlangs.map((slang, index) => (
                        <motion.div
                            key={slang.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <Link href={`/slang/${slang.id}`}>
                                <Card
                                    variant="default"
                                    padding="md"
                                    className="group cursor-pointer hover:border-orange-200"
                                >
                                    <CardContent>
                                        <div className="flex items-center gap-4">
                                            {/* Emoji */}
                                            <span className="text-3xl flex-shrink-0">
                                                {slang.emoji}
                                            </span>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-mono text-lg font-bold text-charcoal-900 group-hover:text-orange-600 transition-colors">
                                                        {slang.phrase}
                                                    </h3>
                                                    <span className="text-xs text-charcoal-400">
                                                        {slang.readingHintJa}
                                                    </span>
                                                    <RiskBadge level={slang.riskLevel} />
                                                </div>
                                                <p className="text-sm text-charcoal-600 line-clamp-1">
                                                    {slang.meaningJa}
                                                </p>
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {slang.tags.map((tag) => (
                                                        <Badge key={tag} variant="default">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => handleSave(slang.id, e)}
                                                    className={`p-2 rounded-lg transition-colors ${savedSlangs.includes(slang.id)
                                                            ? 'text-accent-500 bg-accent-50'
                                                            : 'text-charcoal-400 hover:text-accent-500 hover:bg-accent-50'
                                                        }`}
                                                    title="保存"
                                                >
                                                    <Save
                                                        className={`w-5 h-5 ${savedSlangs.includes(slang.id) ? 'fill-current' : ''
                                                            }`}
                                                    />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        // Navigate to story with this slang
                                                    }}
                                                    className="p-2 text-charcoal-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                    title="ストーリーで見る"
                                                >
                                                    <BookMarked className="w-5 h-5" />
                                                </button>
                                                <ChevronRight className="w-5 h-5 text-charcoal-300 group-hover:text-orange-500 transition-colors" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Empty State */}
            {filteredSlangs.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                >
                    <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-4">
                        <Flame className="w-10 h-10 text-charcoal-400" />
                    </div>
                    <h3 className="font-[var(--font-display)] text-xl font-medium text-charcoal-700 mb-2">
                        スラングが見つかりません
                    </h3>
                    <p className="text-charcoal-500">
                        検索条件を変更してみてください
                    </p>
                </motion.div>
            )}
        </div>
    );
}
