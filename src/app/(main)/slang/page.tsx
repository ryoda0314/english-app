'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Card,
    CardContent,
    Button,
    Input,
    Badge,
} from '@/components/ui';
import {
    Flame,
    Search,
    TrendingUp,
    Shuffle,
    Sparkles,
    RefreshCw,
    AlertCircle,
    Save,
    Check,
    Volume2,
    Info,
    AlertTriangle,
    MessageCircle,
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';

type RiskLevel = 'safe' | 'careful' | 'avoid';

interface SlangEntry {
    id?: string;
    phrase: string;
    reading_hint_ja?: string;
    meaning_ja: string;
    nuance_ja?: string | null;
    example_en?: string | null;
    example_ja?: string | null;
    tone?: string;
    risk_level: RiskLevel;
    region?: string;
    tags?: string[];
    popularity_score?: number;
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

const STACK_SIZE = 4; // Always keep 4 slangs in stack
const INITIAL_FETCH_COUNT = 5; // Fetch 5 on initial load

type RiskFilterType = 'all' | RiskLevel;
type SlangSourceType = 'curated' | 'random';

const STACK_SIZE_PER_RISK = 5; // 5 items per risk level

interface RiskStacks {
    safe: SlangEntry[];
    careful: SlangEntry[];
    avoid: SlangEntry[];
}

export default function SlangPage() {
    const [slang, setSlang] = useState<SlangEntry | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [mode, setMode] = useState<'discover' | 'search'>('discover');
    const [isFlipped, setIsFlipped] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [riskFilter, setRiskFilter] = useState<RiskFilterType>('all');
    const [slangSource, setSlangSource] = useState<SlangSourceType>('curated');
    const [stackCounts, setStackCounts] = useState({ safe: 0, careful: 0, avoid: 0 });

    const riskStacksRef = useRef<RiskStacks>({ safe: [], careful: [], avoid: [] });
    const isFetchingRef = useRef(false);
    const supabase = createBrowserClient();

    // Update stack counts from ref
    const updateStackCounts = useCallback(() => {
        setStackCounts({
            safe: riskStacksRef.current.safe.length,
            careful: riskStacksRef.current.careful.length,
            avoid: riskStacksRef.current.avoid.length,
        });
    }, []);

    // Fetch a single slang and return it
    const fetchOneSlang = useCallback(async (source: SlangSourceType = 'curated'): Promise<SlangEntry | null> => {
        try {
            const fetchResponse = await fetch(`/api/slang/fetch?term=random&source=${source}`);
            if (!fetchResponse.ok) return null;

            const fetchData = await fetchResponse.json();
            if (fetchData.slang) {
                // Save to DB in background
                fetch('/api/slang', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(fetchData.slang),
                }).catch(() => { });

                return fetchData.slang;
            }
            return null;
        } catch {
            return null;
        }
    }, []);

    // Add slang to appropriate risk stack
    const addToRiskStack = useCallback((slangItem: SlangEntry) => {
        const risk = slangItem.risk_level as RiskLevel;
        if (riskStacksRef.current[risk].length < STACK_SIZE_PER_RISK) {
            riskStacksRef.current[risk].push(slangItem);
            updateStackCounts();
        }
    }, [updateStackCounts]);

    // Fill stacks that need more items
    const fillStacks = useCallback(async (source: SlangSourceType = 'curated') => {
        if (isFetchingRef.current) return;

        const neededCount =
            Math.max(0, STACK_SIZE_PER_RISK - riskStacksRef.current.safe.length) +
            Math.max(0, STACK_SIZE_PER_RISK - riskStacksRef.current.careful.length) +
            Math.max(0, STACK_SIZE_PER_RISK - riskStacksRef.current.avoid.length);

        if (neededCount === 0) return;

        isFetchingRef.current = true;

        try {
            // Fetch more to ensure we fill all stacks
            const fetchCount = Math.min(neededCount + 3, 10);
            const promises = Array(fetchCount).fill(null).map(() => fetchOneSlang(source));
            const results = await Promise.all(promises);

            for (const result of results) {
                if (result) {
                    addToRiskStack(result);
                }
            }
        } finally {
            isFetchingRef.current = false;
        }
    }, [fetchOneSlang, addToRiskStack]);

    // Get current stack count based on filter
    const getCurrentStackCount = useCallback(() => {
        if (riskFilter === 'all') {
            return stackCounts.safe + stackCounts.careful + stackCounts.avoid;
        }
        return stackCounts[riskFilter];
    }, [riskFilter, stackCounts]);

    // Get next slang from appropriate stack
    const getNextFromStack = useCallback((filter: RiskFilterType): SlangEntry | null => {
        if (filter === 'all') {
            // Get from any stack that has items, prioritizing safe
            for (const risk of ['safe', 'careful', 'avoid'] as RiskLevel[]) {
                if (riskStacksRef.current[risk].length > 0) {
                    const next = riskStacksRef.current[risk].shift()!;
                    updateStackCounts();
                    return next;
                }
            }
        } else {
            if (riskStacksRef.current[filter].length > 0) {
                const next = riskStacksRef.current[filter].shift()!;
                updateStackCounts();
                return next;
            }
        }
        return null;
    }, [updateStackCounts]);

    // Show next slang
    const showNextSlang = useCallback(() => {
        setIsSaved(false);
        setIsFlipped(false);

        const next = getNextFromStack(riskFilter);
        if (next) {
            setSlang(next);
            // Background refill
            fillStacks(slangSource);
        }
    }, [riskFilter, getNextFromStack, fillStacks, slangSource]);

    // Handle filter change - immediately show from that stack
    const handleFilterChange = useCallback((newFilter: RiskFilterType) => {
        setRiskFilter(newFilter);
        setIsSaved(false);
        setIsFlipped(false);

        // Immediately show from the new filter's stack
        const next = getNextFromStack(newFilter);
        if (next) {
            setSlang(next);
        }
        // Refill in background
        fillStacks(slangSource);
    }, [getNextFromStack, fillStacks, slangSource]);

    // Initial load
    useEffect(() => {
        const initializeStacks = async () => {
            riskStacksRef.current = { safe: [], careful: [], avoid: [] };
            updateStackCounts();
            setIsLoading(true);
            setError('');

            try {
                // Fetch 15 initially to fill all stacks
                const promises = Array(15).fill(null).map(() => fetchOneSlang(slangSource));

                let firstDisplayed = false;
                for (const promise of promises) {
                    const result = await promise;
                    if (result) {
                        if (!firstDisplayed) {
                            setSlang(result);
                            setIsLoading(false);
                            firstDisplayed = true;
                        } else {
                            addToRiskStack(result);
                        }
                    }
                }

                if (!firstDisplayed) {
                    setError('スラングの取得に失敗しました');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'エラーが発生しました');
            } finally {
                setIsLoading(false);
            }
        };

        initializeStacks();
    }, [fetchOneSlang, slangSource, addToRiskStack, updateStackCounts]);

    const searchSlang = async () => {
        if (!searchTerm.trim()) return;

        setIsLoading(true);
        setError('');
        setIsSaved(false);
        setIsFlipped(false);

        try {
            const response = await fetch(`/api/slang/fetch?term=${encodeURIComponent(searchTerm)}`);
            if (!response.ok) {
                throw new Error('スラングが見つかりませんでした');
            }

            const data = await response.json();
            if (data.slang) {
                setSlang(data.slang);

                // Save to DB
                await fetch('/api/slang', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data.slang),
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'エラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveToPhrasebook = async () => {
        if (!slang || isSaved || isSaving) return;

        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError('フレーズを保存するにはログインが必要です');
                return;
            }

            const { error: insertError } = await supabase
                .from('saved_phrases')
                .insert({
                    user_id: user.id,
                    text_en: slang.phrase,
                    explanation_ja: slang.meaning_ja,
                    source_type: 'slang',
                    tone: slang.tone,
                });

            if (insertError) throw insertError;

            setIsSaved(true);
        } catch (err) {
            console.error('Error saving slang:', err);
            setError('保存に失敗しました');
        } finally {
            setIsSaving(false);
        }
    };

    const riskConfig = slang ? RISK_CONFIG[slang.risk_level] : RISK_CONFIG.safe;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="font-[var(--font-display)] text-3xl font-bold text-charcoal-900">
                            Slang Discovery
                        </h1>
                    </div>
                </div>
                <p className="text-charcoal-600 mt-4">
                    ネイティブが使う最新のスラングを発見しよう。
                    <br className="hidden sm:block" />
                    カードをタップして意味を確認、気に入ったら保存！
                </p>
            </motion.div>

            {/* Mode Tabs */}
            <div className="flex items-center gap-2 mb-4">
                <Button
                    variant={mode === 'discover' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setMode('discover')}
                    leftIcon={<Shuffle className="w-4 h-4" />}
                >
                    発見モード
                </Button>
                <Button
                    variant={mode === 'search' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setMode('search')}
                    leftIcon={<Search className="w-4 h-4" />}
                >
                    検索
                </Button>
            </div>

            {/* Options Row */}
            {mode === 'discover' && (
                <div className="flex flex-wrap items-center gap-4 mb-6 p-3 bg-cream-50 rounded-xl">
                    {/* Source toggle */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-charcoal-500">ソース</span>
                        <div className="flex items-center gap-1 bg-white rounded-full p-0.5 shadow-sm">
                            <button
                                onClick={() => setSlangSource('curated')}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${slangSource === 'curated'
                                    ? 'bg-primary-500 text-white'
                                    : 'text-charcoal-500 hover:bg-cream-100'
                                    }`}
                            >
                                📚 人気
                            </button>
                            <button
                                onClick={() => setSlangSource('random')}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${slangSource === 'random'
                                    ? 'bg-purple-500 text-white'
                                    : 'text-charcoal-500 hover:bg-cream-100'
                                    }`}
                            >
                                🎲 探索
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-6 bg-cream-200" />

                    {/* Risk filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-charcoal-500">安全度</span>
                        <div className="flex items-center gap-1 bg-white rounded-full p-0.5 shadow-sm">
                            <button
                                onClick={() => handleFilterChange('all')}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${riskFilter === 'all'
                                    ? 'bg-charcoal-700 text-white'
                                    : 'text-charcoal-500 hover:bg-cream-100'
                                    }`}
                            >
                                全て
                            </button>
                            <button
                                onClick={() => handleFilterChange('safe')}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${riskFilter === 'safe'
                                    ? 'bg-green-500 text-white'
                                    : 'text-green-600 hover:bg-green-50'
                                    }`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                安全
                                {stackCounts.safe > 0 && <span className="text-[10px] opacity-70">({stackCounts.safe})</span>}
                            </button>
                            <button
                                onClick={() => handleFilterChange('careful')}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${riskFilter === 'careful'
                                    ? 'bg-amber-500 text-white'
                                    : 'text-amber-600 hover:bg-amber-50'
                                    }`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                注意
                                {stackCounts.careful > 0 && <span className="text-[10px] opacity-70">({stackCounts.careful})</span>}
                            </button>
                            <button
                                onClick={() => handleFilterChange('avoid')}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${riskFilter === 'avoid'
                                    ? 'bg-red-500 text-white'
                                    : 'text-red-600 hover:bg-red-50'
                                    }`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                NG
                                {stackCounts.avoid > 0 && <span className="text-[10px] opacity-70">({stackCounts.avoid})</span>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Mode */}
            <AnimatePresence mode="wait">
                {mode === 'search' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6"
                    >
                        <div className="flex gap-2">
                            <Input
                                placeholder="スラングを検索..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && searchSlang()}
                                className="flex-1"
                            />
                            <Button
                                onClick={searchSlang}
                                isLoading={isLoading}
                                disabled={!searchTerm.trim()}
                            >
                                検索
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2"
                >
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </motion.div>
            )}

            {/* Slang Card */}
            <div className="mb-8">
                {isLoading ? (
                    <Card variant="default" padding="lg" className="min-h-[320px] flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <RefreshCw className="w-8 h-8 text-primary-500 animate-spin" />
                            <p className="text-charcoal-500">スラングを探しています...</p>
                        </div>
                    </Card>
                ) : slang ? (
                    <div
                        className="relative w-full max-w-md mx-auto cursor-pointer"
                        onClick={() => setIsFlipped(!isFlipped)}
                        style={{ perspective: '1000px' }}
                    >
                        <motion.div
                            className="relative w-full"
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Front of card */}
                            <div
                                className="w-full bg-white rounded-2xl shadow-lg border border-cream-200 p-6 min-h-[320px] flex flex-col items-center justify-center"
                                style={{ backfaceVisibility: 'hidden' }}
                            >
                                {/* Risk Badge */}
                                <div className={`absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${riskConfig.bg} ${riskConfig.color}`}>
                                    {riskConfig.icon}
                                    <span>{riskConfig.label}</span>
                                </div>

                                {/* Phrase */}
                                <h2 className="font-[var(--font-display)] text-4xl font-bold text-charcoal-900 text-center mb-4">
                                    {slang.phrase}
                                </h2>

                                {/* Reading Hint */}
                                {slang.reading_hint_ja && (
                                    <p className="text-charcoal-400 text-sm mb-4">
                                        {slang.reading_hint_ja}
                                    </p>
                                )}

                                {/* Tone & Region */}
                                <div className="flex items-center gap-2 text-sm text-charcoal-500">
                                    {slang.tone && (
                                        <span className="px-2 py-0.5 bg-cream-100 rounded-full">
                                            {slang.tone}
                                        </span>
                                    )}
                                    {slang.region && (
                                        <span className="px-2 py-0.5 bg-cream-100 rounded-full">
                                            {slang.region}
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
                                className="absolute top-0 left-0 w-full bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-lg border border-cream-200 p-6 min-h-[320px]"
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                            >
                                {/* Risk Badge */}
                                <div className={`absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${riskConfig.bg} ${riskConfig.color}`}>
                                    {riskConfig.icon}
                                    <span>{riskConfig.label}</span>
                                </div>

                                {/* Phrase (smaller) */}
                                <h3 className="font-[var(--font-display)] text-2xl font-bold text-charcoal-900 mb-3">
                                    {slang.phrase}
                                </h3>

                                {/* Meaning */}
                                <div className="mb-4">
                                    <p className="text-lg text-charcoal-800 font-medium">
                                        {slang.meaning_ja}
                                    </p>
                                </div>

                                {/* Nuance */}
                                {slang.nuance_ja && (
                                    <div className="mb-4 p-3 bg-white/60 rounded-lg">
                                        <div className="flex items-center gap-1 text-xs text-charcoal-500 mb-1">
                                            <Info className="w-3 h-3" />
                                            ニュアンス
                                        </div>
                                        <p className="text-sm text-charcoal-700">
                                            {slang.nuance_ja}
                                        </p>
                                    </div>
                                )}

                                {/* Example */}
                                {slang.example_en && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-primary-700 mb-1">
                                            "{slang.example_en}"
                                        </p>
                                        {slang.example_ja && (
                                            <p className="text-xs text-charcoal-500">
                                                {slang.example_ja}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Tags */}
                                {slang.tags && slang.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {slang.tags.map((tag, i) => (
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSaveToPhrasebook();
                                        }}
                                        disabled={isSaved || isSaving}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isSaved
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                                            }`}
                                    >
                                        {isSaved ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                保存済み
                                            </>
                                        ) : isSaving ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
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
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Volume2 className="w-4 h-4" />
                                        発音
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </div>

            {/* Action Buttons */}
            {mode === 'discover' && !isLoading && (
                <div className="flex flex-col items-center gap-2">
                    <Button
                        onClick={showNextSlang}
                        disabled={getCurrentStackCount() === 0}
                        size="lg"
                        leftIcon={<Sparkles className="w-5 h-5" />}
                    >
                        次のスラングを見る
                    </Button>
                    {/* Stack indicator */}
                    <p className="text-xs text-charcoal-400">
                        {riskFilter === 'all'
                            ? `ストック: 🟢${stackCounts.safe} 🟡${stackCounts.careful} 🔴${stackCounts.avoid}`
                            : `${getCurrentStackCount()}個 準備中`
                        }
                    </p>
                </div>
            )}

            {/* Risk Level Legend */}
            <div className="mt-12 p-4 bg-cream-50 rounded-xl">
                <h3 className="text-sm font-medium text-charcoal-700 mb-3">リスクレベルについて</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-charcoal-600">安全 - 誰とでも使える</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-charcoal-600">注意 - 場面を選ぶ</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-charcoal-600">非推奨 - 使わない方が良い</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

