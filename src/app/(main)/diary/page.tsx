'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Button,
    Textarea,
    Card,
    CardContent,
    EmotionBadge,
    ToneBadge,
    SkeletonCard,
} from '@/components/ui';
import {
    PenLine,
    Sparkles,
    Save,
    Volume2,
    ChevronDown,
    ChevronUp,
    Calendar,
    Loader2,
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';

// Types
type Tone = 'casual' | 'polite' | 'serious' | 'playful';

interface Phrase {
    id: string;
    textEn: string;
    explanationJa: string;
    tone: Tone;
}

interface Scene {
    sceneId: string;
    sceneSummaryJa: string;
    originalExcerptJa: string;
    emotion: string;
    relationship: string;
    place: string;
    phrases: Phrase[];
}

interface AnalyzeResponse {
    scenes: Scene[];
}

const EMOTION_TAGS = [
    { id: 'anxiety', label: '緊張', emoji: '😰' },
    { id: 'joy', label: '喜び', emoji: '😊' },
    { id: 'sadness', label: '悲しみ', emoji: '😢' },
    { id: 'anger', label: '怒り', emoji: '😠' },
    { id: 'tiredness', label: '疲労', emoji: '😩' },
    { id: 'relief', label: '安心', emoji: '😌' },
    { id: 'mixed', label: '複雑', emoji: '🤔' },
];

export default function DiaryPage() {
    const supabase = createBrowserClient();
    const [diaryText, setDiaryText] = useState('');
    const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalyzeResponse | null>(null);
    const [expandedScenes, setExpandedScenes] = useState<string[]>([]);
    const [savedPhrases, setSavedPhrases] = useState<Set<string>>(new Set());
    const [error, setError] = useState('');

    const toggleEmotion = (emotionId: string) => {
        setSelectedEmotions((prev) =>
            prev.includes(emotionId)
                ? prev.filter((e) => e !== emotionId)
                : [...prev, emotionId]
        );
    };

    const handleAnalyze = async () => {
        if (!diaryText.trim()) return;

        setIsAnalyzing(true);
        setError('');
        setResult(null);

        try {
            // Analayze API call
            const response = await fetch('/api/diary/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    diary_text: diaryText,
                    emotions: selectedEmotions,
                }),
            });

            if (!response.ok) throw new Error('分析に失敗しました');

            const data: AnalyzeResponse = await response.json();
            setResult(data);
            setExpandedScenes([data.scenes[0]?.sceneId || '']);

            // Automatically save diary entry
            await saveDiaryEntry(data);

        } catch (err) {
            console.error('Error analyzing diary:', err);
            setError('日記の分析中にエラーが発生しました。もう一度お試しください。');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const saveDiaryEntry = async (analysisResult: AnalyzeResponse) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return; // Silent fail if not logged in (or handle otherwise)

            const { error: insertError } = await supabase
                .from('diary_entries')
                .insert({
                    user_id: user.id,
                    content_ja: diaryText,
                    emotion_tags: selectedEmotions,
                    scenes: analysisResult.scenes,
                    diary_date: new Date().toISOString(), // Or just let DB default to CURRENT_DATE if needed, but explicit is safer for timezones
                });

            if (insertError) throw insertError;
        } catch (err) {
            console.error('Error saving diary entry:', err);
            // Non-blocking error for UI
        }
    };

    const toggleScene = (sceneId: string) => {
        setExpandedScenes((prev) =>
            prev.includes(sceneId)
                ? prev.filter((s) => s !== sceneId)
                : [...prev, sceneId]
        );
    };

    const handleSavePhrase = async (sceneId: string, phrase: Phrase, emotion: string) => {
        if (savedPhrases.has(phrase.id)) return; // Already saved

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert('フレーズを保存するにはログインが必要です');
                return;
            }

            const { error: insertError } = await supabase
                .from('saved_phrases')
                .insert({
                    user_id: user.id,
                    text_en: phrase.textEn,
                    explanation_ja: phrase.explanationJa,
                    source_type: 'diary',
                    source_scene_id: sceneId,
                    emotion: emotion,
                    tone: phrase.tone,
                });

            if (insertError) throw insertError;

            setSavedPhrases((prev) => new Set(prev).add(phrase.id));
        } catch (err) {
            console.error('Error saving phrase:', err);
            alert('フレーズの保存に失敗しました');
        }
    };

    const today = new Date().toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary-100 to-secondary-200 flex items-center justify-center">
                        <PenLine className="w-6 h-6 text-secondary-600" />
                    </div>
                    <div>
                        <h1 className="font-[var(--font-display)] text-3xl font-bold text-charcoal-900">
                            今日の日記
                        </h1>
                        <div className="flex items-center gap-2 text-charcoal-500 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{today}</span>
                        </div>
                    </div>
                </div>
                <p className="text-charcoal-600 mt-4">
                    今日あったことを日本語で書いてみてください。
                    <br className="hidden sm:block" />
                    AIがシーンを分析し、使える英語フレーズを提案します。
                </p>
            </motion.div>

            {/* Diary Input Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
            >
                <Card variant="default" padding="lg">
                    <CardContent>
                        <Textarea
                            variant="diary"
                            placeholder="今日はゼミで発表があって、朝からずっと緊張していた。でも発表が終わったら、先生が「よくできたね」と言ってくれて、すごく嬉しかった..."
                            value={diaryText}
                            onChange={(e) => setDiaryText(e.target.value)}
                            showCharCount
                            maxLength={1000}
                            className="min-h-[200px]"
                        />

                        {/* Emotion Tag Selection */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-charcoal-700 mb-3">
                                今日の気持ち（任意）
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {EMOTION_TAGS.map((tag) => (
                                    <button
                                        key={tag.id}
                                        onClick={() => toggleEmotion(tag.id)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedEmotions.includes(tag.id)
                                            ? 'bg-secondary-100 text-secondary-700 ring-2 ring-secondary-300'
                                            : 'bg-cream-100 text-charcoal-600 hover:bg-cream-200'
                                            }`}
                                    >
                                        <span className="mr-1">{tag.emoji}</span>
                                        {tag.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Analyze Button */}
                        <div className="mt-6 flex justify-end">
                            <Button
                                onClick={handleAnalyze}
                                isLoading={isAnalyzing}
                                disabled={!diaryText.trim() || isAnalyzing}
                                leftIcon={<Sparkles className="w-5 h-5" />}
                                size="lg"
                            >
                                英語フレーズを提案
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Loading State */}
            <AnimatePresence>
                {isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        <SkeletonCard />
                        <SkeletonCard />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
                {result && !isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h2 className="font-[var(--font-display)] text-xl font-semibold text-charcoal-900 mb-4">
                            シーン別フレーズ提案
                        </h2>

                        {result.scenes.map((scene, index) => (
                            <motion.div
                                key={scene.sceneId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card variant="default" padding="none">
                                    {/* Scene Header */}
                                    <button
                                        onClick={() => toggleScene(scene.sceneId)}
                                        className="w-full p-5 flex items-start justify-between text-left hover:bg-cream-50 transition-colors rounded-t-2xl"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-charcoal-400 text-sm font-medium">
                                                    シーン {index + 1}
                                                </span>
                                                <EmotionBadge emotion={scene.emotion} />
                                            </div>
                                            <h3 className="font-[var(--font-display)] text-lg font-medium text-charcoal-900">
                                                {scene.sceneSummaryJa}
                                            </h3>
                                            <p className="text-sm text-charcoal-500 mt-1 line-clamp-1">
                                                「{scene.originalExcerptJa}」
                                            </p>
                                        </div>
                                        <div className="ml-4 text-charcoal-400">
                                            {expandedScenes.includes(scene.sceneId) ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Phrases */}
                                    <AnimatePresence>
                                        {expandedScenes.includes(scene.sceneId) && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 space-y-3 border-t border-cream-200">
                                                    {scene.phrases.map((phrase, phraseIndex) => (
                                                        <motion.div
                                                            key={phrase.id}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: phraseIndex * 0.05 }}
                                                            className="p-4 bg-cream-50 rounded-xl mt-4 first:mt-4"
                                                        >
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="flex-1">
                                                                    <p className="font-[var(--font-display)] text-lg text-charcoal-900 italic">
                                                                        "{phrase.textEn}"
                                                                    </p>
                                                                    <p className="text-sm text-charcoal-600 mt-2">
                                                                        {phrase.explanationJa}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-3">
                                                                        <ToneBadge tone={phrase.tone} />
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <button
                                                                        className="p-2 text-charcoal-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                                        title="音声を聞く"
                                                                    >
                                                                        <Volume2 className="w-5 h-5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleSavePhrase(scene.sceneId, phrase, scene.emotion)}
                                                                        disabled={savedPhrases.has(phrase.id)}
                                                                        className={`p-2 rounded-lg transition-colors ${savedPhrases.has(phrase.id)
                                                                            ? 'text-accent-500 bg-accent-50'
                                                                            : 'text-charcoal-400 hover:text-accent-500 hover:bg-accent-50'
                                                                            }`}
                                                                        title="保存"
                                                                    >
                                                                        {savedPhrases.has(phrase.id) ? (
                                                                            <Save className="w-5 h-5 fill-current" />
                                                                        ) : (
                                                                            <Save className="w-5 h-5" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
