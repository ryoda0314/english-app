'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Card,
    CardContent,
    Button,
    Input,
    EmotionBadge,
    ToneBadge,
} from '@/components/ui';
import {
    BookOpen,
    Search,
    Filter,
    Volume2,
    MoreVertical,
    Trash2,
    Star,
    ChevronRight,
    Loader2,
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';

// Types
type Phrase = {
    id: string;
    textEn: string;
    explanationJa: string;
    sourceType: 'diary' | 'story' | 'slang';
    emotion: string;
    tone: 'casual' | 'polite' | 'serious' | 'playful';
    practicedCount: number;
    pronunciationScore: number | null;
    createdAt: string;
};

const SOURCE_ICONS: Record<string, { icon: string; label: string }> = {
    diary: { icon: '📓', label: '日記' },
    story: { icon: '📖', label: 'ストーリー' },
    slang: { icon: '🔥', label: 'スラング' },
};

const FILTER_OPTIONS = [
    { value: 'all', label: 'すべて' },
    { value: 'diary', label: '📓 日記' },
    { value: 'story', label: '📖 ストーリー' },
    { value: 'slang', label: '🔥 スラング' },
];

export default function PhrasesPage() {
    const supabase = createBrowserClient();
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPhrases();
    }, []);

    const fetchPhrases = async () => {
        try {
            const { data, error } = await supabase
                .from('saved_phrases')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const formattedPhrases: Phrase[] = data.map((item) => ({
                    id: item.id,
                    textEn: item.text_en,
                    explanationJa: item.explanation_ja || '',
                    sourceType: (item.source_type as any) || 'story',
                    emotion: item.emotion || 'neutral',
                    tone: 'casual', // DBにないためデフォルト
                    practicedCount: 0, // DBにないためデフォルト
                    pronunciationScore: null, // DBにないためデフォルト
                    createdAt: item.created_at,
                }));
                setPhrases(formattedPhrases);
            }
        } catch (error) {
            console.error('Error fetching phrases:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // リンク遷移を防ぐ
        if (!confirm('このフレーズを削除してもよろしいですか？')) return;

        setDeletingId(id);
        try {
            const { error } = await supabase
                .from('saved_phrases')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setPhrases((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Error deleting phrase:', error);
            alert('削除に失敗しました');
        } finally {
            setDeletingId(null);
        }
    };

    const filteredPhrases = phrases.filter((phrase) => {
        const matchesSearch =
            phrase.textEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
            phrase.explanationJa.includes(searchQuery);
        const matchesFilter =
            activeFilter === 'all' || phrase.sourceType === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric',
        });
    };

    const getScoreColor = (score: number | null) => {
        if (score === null) return 'text-charcoal-400';
        if (score >= 90) return 'text-green-600';
        if (score >= 70) return 'text-accent-600';
        return 'text-orange-600';
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
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-accent-600" />
                    </div>
                    <div>
                        <h1 className="font-[var(--font-display)] text-3xl font-bold text-charcoal-900">
                            マイフレーズ帳
                        </h1>
                        <p className="text-charcoal-500 text-sm">
                            {phrases.length}個のフレーズを保存中
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
            >
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <Input
                            placeholder="フレーズを検索..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon={<Search className="w-5 h-5" />}
                        />
                    </div>
                    <div className="relative">
                        <Button
                            variant="secondary"
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            leftIcon={<Filter className="w-4 h-4" />}
                        >
                            フィルター
                        </Button>
                        {showFilterMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-cream-200 py-2 z-10">
                                {FILTER_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setActiveFilter(option.value);
                                            setShowFilterMenu(false);
                                        }}
                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-cream-100 transition-colors ${activeFilter === option.value
                                            ? 'text-primary-600 font-medium bg-primary-50'
                                            : 'text-charcoal-700'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Filter Badge */}
                {activeFilter !== 'all' && (
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm text-charcoal-500">フィルター:</span>
                        <button
                            onClick={() => setActiveFilter('all')}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium hover:bg-primary-200 transition-colors"
                        >
                            {FILTER_OPTIONS.find((f) => f.value === activeFilter)?.label}
                            <span className="ml-1">×</span>
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Phrases List */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredPhrases.map((phrase, index) => (
                            <motion.div
                                key={phrase.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    variant="default"
                                    padding="md"
                                    className="group cursor-pointer hover:border-primary-200 relative overflow-hidden"
                                >
                                    <CardContent>
                                        <div className="flex items-start gap-4">
                                            {/* Source Icon */}
                                            <div className="text-2xl mt-1">
                                                {SOURCE_ICONS[phrase.sourceType]?.icon}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-[var(--font-display)] text-lg text-charcoal-900 mb-1 group-hover:text-primary-700 transition-colors">
                                                    "{phrase.textEn}"
                                                </p>
                                                {phrase.explanationJa && (
                                                    <p className="text-sm text-charcoal-600 mb-3 line-clamp-1">
                                                        {phrase.explanationJa}
                                                    </p>
                                                )}

                                                <div className="flex flex-wrap items-center gap-2">
                                                    {phrase.emotion && <EmotionBadge emotion={phrase.emotion} />}
                                                    <ToneBadge tone={phrase.tone} />

                                                    {phrase.pronunciationScore !== null && (
                                                        <span
                                                            className={`text-xs font-medium ${getScoreColor(
                                                                phrase.pronunciationScore
                                                            )}`}
                                                        >
                                                            発音: {phrase.pronunciationScore}点
                                                        </span>
                                                    )}

                                                    {phrase.practicedCount > 0 && (
                                                        <span className="text-xs text-charcoal-400 flex items-center gap-1">
                                                            <Star className="w-3 h-3" />
                                                            {phrase.practicedCount}回練習
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        // Play audio
                                                    }}
                                                    className="p-2 text-charcoal-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Volume2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(e, phrase.id)}
                                                    disabled={deletingId === phrase.id}
                                                    className="p-2 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    {deletingId === phrase.id ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>

                                            {/* Chevron */}
                                            <ChevronRight className="w-5 h-5 text-charcoal-300 group-hover:text-primary-500 transition-colors self-center" />
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-3 pt-3 border-t border-cream-100 flex items-center justify-between">
                                            <span className="text-xs text-charcoal-400">
                                                {formatDate(phrase.createdAt)}に保存
                                            </span>
                                            <span className="text-xs text-charcoal-400">
                                                {SOURCE_ICONS[phrase.sourceType]?.label}から
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )
            }

            {/* Empty State */}
            {
                !isLoading && filteredPhrases.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-10 h-10 text-charcoal-400" />
                        </div>
                        <h3 className="font-[var(--font-display)] text-xl font-medium text-charcoal-700 mb-2">
                            フレーズが見つかりません
                        </h3>
                        <p className="text-charcoal-500 mb-6">
                            {searchQuery
                                ? '検索条件を変更してみてください'
                                : '日記やストーリーからフレーズを保存しましょう'}
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <Link href="/diary">
                                <Button variant="secondary">日記を書く</Button>
                            </Link>
                            <Link href="/story">
                                <Button variant="primary">ストーリーで学ぶ</Button>
                            </Link>
                        </div>
                    </motion.div>
                )
            }
        </div >
    );
}
