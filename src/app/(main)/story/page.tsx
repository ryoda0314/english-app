'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Button,
    Input,
    Card,
    CardContent,
    Badge,
    SkeletonThemeCard,
    SkeletonStoryScene,
} from '@/components/ui';
import { createBrowserClient } from '@/lib/supabase/client';
import { InteractivePhrase } from '@/components/features/interactive-phrase';
import {
    BookMarked,
    Sparkles,
    ArrowRight,
    ArrowLeft,
    Volume2,
    Save,
    RefreshCw,
    Heart,
    Briefcase,
    Users,
    Home,
    Plane,
    Languages,
    Settings,
    Type,
    AlignLeft,
    X,
} from 'lucide-react';

// Mock data deleted

// Types
interface Theme {
    id: string;
    title: string;
    oneLineJa: string;
    genre: string;
    emotion: string;
    relationship: string;
}

interface Story {
    storyTextMixed: string;
    storyTextEn: string;
    lineExcerpt: string;
    sceneSummaryJa: string;
    nuanceNoteJa: string;
    tags: {
        genre: string;
        emotion: string;
        relationship: string;
        tone: string;
    };
}

const GENRE_ICONS: Record<string, React.ReactNode> = {
    friendship: <Users className="w-4 h-4" />,
    romance: <Heart className="w-4 h-4" />,
    work: <Briefcase className="w-4 h-4" />,
    daily: <Home className="w-4 h-4" />,
    adventure: <Plane className="w-4 h-4" />,
};

const GENRE_LABELS: Record<string, string> = {
    friendship: '友情',
    romance: '恋愛',
    work: '仕事',
    daily: '日常',
    adventure: '冒険',
};

type Step = 'input' | 'themes' | 'story';

type DisplayMode = 'mixed' | 'english';

// Display Settings Types
type FontSize = 'sm' | 'md' | 'lg' | 'xl';
type FontFamily = 'serif' | 'sans';
type LineHeight = 'normal' | 'relaxed' | 'loose';

const FONT_SIZE_CLASSES: Record<FontSize, string> = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
};

const FONT_FAMILY_CLASSES: Record<FontFamily, string> = {
    serif: 'font-[var(--font-display)]',
    sans: 'font-[var(--font-body)]',
};

const LINE_HEIGHT_CLASSES: Record<LineHeight, string> = {
    normal: 'leading-6',
    relaxed: 'leading-7',
    loose: 'leading-9',
};

export default function StoryPage() {
    const [step, setStep] = useState<Step>('input');
    const [expression, setExpression] = useState('');
    const [supplement, setSupplement] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [themes, setThemes] = useState<Theme[] | null>(null);
    const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
    const [story, setStory] = useState<Story | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [error, setError] = useState('');
    const [displayMode, setDisplayMode] = useState<DisplayMode>('mixed');
    const [savedPhrases, setSavedPhrases] = useState<Set<string>>(new Set());

    // Display Settings State
    const [showSettings, setShowSettings] = useState(false);
    const [fontSize, setFontSize] = useState<FontSize>('md');
    const [fontFamily, setFontFamily] = useState<FontFamily>('serif');
    const [lineHeight, setLineHeight] = useState<LineHeight>('relaxed');

    const supabase = createBrowserClient();

    const handleGenerateThemes = async () => {
        if (!expression.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/story/themes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expression, supplement }),
            });

            if (!response.ok) {
                throw new Error('テーマの生成に失敗しました');
            }

            const data = await response.json();
            setThemes(data.themes);
            setStep('themes');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'エラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectTheme = async (theme: Theme) => {
        setSelectedTheme(theme);
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/story/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expression, theme, supplement }),
            });

            if (!response.ok) {
                throw new Error('ストーリーの生成に失敗しました');
            }

            const data = await response.json();
            setStory(data.story);
            setStep('story');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'エラーが発生しました');
            setStep('themes');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setStep('input');
        setThemes(null);
        setSelectedTheme(null);
        setStory(null);
        setIsSaved(false);
    };

    const handleNewStory = () => {
        setStep('themes');
        setStory(null);
        setSelectedTheme(null);
        setIsSaved(false);
    };

    const handleSavePhrase = async (phrase: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError('フレーズを保存するにはログインが必要です');
                return;
            }

            // Remove ** and quotes if present
            const cleanPhrase = phrase.replace(/\*\*/g, '').replace(/^["']|["']$/g, '').trim();

            const { error: insertError } = await supabase
                .from('saved_phrases')
                .insert({
                    user_id: user.id,
                    text_en: cleanPhrase,
                    source_type: 'story',
                    explanation_ja: story?.nuanceNoteJa || null,
                    emotion: selectedTheme?.emotion || null,
                });

            if (insertError) throw insertError;

            setSavedPhrases(prev => new Set(prev).add(phrase));
        } catch (err) {
            console.error('Error saving phrase:', err);
            setError('フレーズの保存に失敗しました');
        }
    };

    const renderStoryText = () => {
        const text = displayMode === 'mixed'
            ? (story?.storyTextMixed || story?.storyTextEn)
            : story?.storyTextEn;

        if (!text) return null;

        // Split by newlines to handle paragraphs
        const paragraphs = text.split(/\n\s*\n/);

        return (
            <div className={`
                ${FONT_SIZE_CLASSES[fontSize]}
                ${FONT_FAMILY_CLASSES[fontFamily]}
                ${LINE_HEIGHT_CLASSES[lineHeight]}
                text-charcoal-800 transition-all duration-300
            `}>
                {paragraphs.map((paragraph, pIndex) => {
                    // Parse the paragraph into parts: English quoted dialogue vs Japanese text
                    // Match: "..." or '...' (English dialogue in quotes)
                    const parts = paragraph.split(/("[^"]+"|'[^']+')/g);

                    // Check if this paragraph contains any English dialogue
                    const hasEnglishDialogue = parts.some(part =>
                        (part.startsWith('"') && part.endsWith('"')) ||
                        (part.startsWith("'") && part.endsWith("'"))
                    );

                    return (
                        <div
                            key={pIndex}
                            className={`mb-6 ${hasEnglishDialogue ? 'pl-2 border-l-2 border-primary-100' : ''}`}
                        >
                            {parts.map((part, index) => {
                                // Check if this part is English dialogue (in quotes)
                                const isEnglishQuote =
                                    (part.startsWith('"') && part.endsWith('"')) ||
                                    (part.startsWith("'") && part.endsWith("'"));

                                if (isEnglishQuote) {
                                    // English dialogue - split into sentences and make each interactive
                                    // Match sentences ending with .!? or ... AND also capture remaining text
                                    const sentences = part.match(/[^.!?]+(?:[.!?]+|\.\.\.)+["']?|[^.!?]+["']?$/g) || [part];

                                    return (
                                        <React.Fragment key={index}>
                                            {sentences.map((sentence, sIndex) => (
                                                <InteractivePhrase
                                                    key={sIndex}
                                                    phrase={sentence.trim()}
                                                    isSaved={savedPhrases.has(sentence.trim())}
                                                    onSave={() => handleSavePhrase(sentence.trim())}
                                                    className="select-text mr-1"
                                                />
                                            ))}
                                        </React.Fragment>
                                    );
                                }

                                // Check for ** highlighted phrases (English phrases in Japanese narrative)
                                if (part.includes('**')) {
                                    const subParts = part.split(/(\*\*.*?\*\*)/g);
                                    return (
                                        <span key={index} className="select-none text-charcoal-600">
                                            {subParts.map((subPart, subIndex) => {
                                                if (subPart.startsWith('**') && subPart.endsWith('**')) {
                                                    return (
                                                        <InteractivePhrase
                                                            key={subIndex}
                                                            phrase={subPart}
                                                            isSaved={savedPhrases.has(subPart)}
                                                            onSave={() => handleSavePhrase(subPart)}
                                                            className="mx-1 select-text"
                                                        />
                                                    );
                                                }
                                                return <span key={subIndex}>{subPart}</span>;
                                            })}
                                        </span>
                                    );
                                }

                                // Japanese text - non-selectable
                                return (
                                    <span key={index} className="select-none text-charcoal-600">
                                        {part}
                                    </span>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
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
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <BookMarked className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h1 className="font-[var(--font-display)] text-3xl font-bold text-charcoal-900">
                            ストーリーで学ぶ
                        </h1>
                    </div>
                </div>
                <p className="text-charcoal-600 mt-4">
                    学びたい英語表現を入力すると、その表現が自然に使われる
                    <br className="hidden sm:block" />
                    短編シーンをAIが生成します。
                </p>
            </motion.div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                >
                    {error}
                    <button onClick={() => setError('')} className="ml-auto p-1 text-red-500 hover:text-red-700">
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                </motion.div>
            )}

            {/* Step 1: Expression Input */}
            <AnimatePresence mode="wait">
                {step === 'input' && !isLoading && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card variant="default" padding="lg">
                            <CardContent className="space-y-5">
                                <Input
                                    label="学びたい表現"
                                    placeholder="例: I'm confused / どう返事すればいいかわからない"
                                    value={expression}
                                    onChange={(e) => setExpression(e.target.value)}
                                    hint="英語でも日本語でも入力できます"
                                />

                                <Input
                                    label="補足情報（任意）"
                                    placeholder="例: 恋愛で焦ってる感じ / 仕事で困っている状況"
                                    value={supplement}
                                    onChange={(e) => setSupplement(e.target.value)}
                                />

                                <div className="flex justify-end pt-2">
                                    <Button
                                        onClick={handleGenerateThemes}
                                        isLoading={isLoading}
                                        disabled={!expression.trim()}
                                        leftIcon={<Sparkles className="w-5 h-5" />}
                                        size="lg"
                                    >
                                        シーンテーマを生成
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Loading Themes */}
                {step === 'input' && isLoading && (
                    <motion.div
                        key="loading-themes"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid sm:grid-cols-2 gap-4 mt-6"
                    >
                        <SkeletonThemeCard />
                        <SkeletonThemeCard />
                        <SkeletonThemeCard />
                        <SkeletonThemeCard />
                    </motion.div>
                )}

                {/* Step 2: Theme Selection */}
                {step === 'themes' && !isLoading && (
                    <motion.div
                        key="themes"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {/* Back Button */}
                        <button
                            onClick={() => setStep('input')}
                            className="flex items-center gap-2 text-charcoal-500 hover:text-charcoal-700 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">表現を変更</span>
                        </button>

                        <div className="mb-6">
                            <p className="text-charcoal-600">
                                <span className="font-medium text-charcoal-900">「{expression}」</span>
                                が使われるシーンを選んでください
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {themes?.map((theme, index) => (
                                <motion.div
                                    key={theme.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card
                                        variant="default"
                                        padding="md"
                                        className="cursor-pointer hover:border-primary-300 transition-all group"
                                        onClick={() => handleSelectTheme(theme)}
                                    >
                                        <CardContent>
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                                                    {GENRE_ICONS[theme.genre] || <BookMarked className="w-5 h-5" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-[var(--font-display)] text-lg font-medium text-charcoal-900 mb-1">
                                                        {theme.title}
                                                    </h3>
                                                    <p className="text-sm text-charcoal-600">
                                                        {theme.oneLineJa}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        <Badge variant="default">
                                                            {GENRE_LABELS[theme.genre] || theme.genre}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Loading Story */}
                {step === 'themes' && isLoading && (
                    <motion.div
                        key="loading-story"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-6"
                    >
                        <SkeletonStoryScene />
                    </motion.div>
                )}

                {/* Step 3: Story Display */}
                {step === 'story' && story && (
                    <motion.div
                        key="story"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Navigation */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setStep('themes')}
                                className="flex items-center gap-2 text-charcoal-500 hover:text-charcoal-700"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-sm">別のシーンを選ぶ</span>
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 text-charcoal-500 hover:text-charcoal-700"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span className="text-sm">新しい表現を入力</span>
                            </button>
                        </div>

                        {/* Display Controls */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
                            {/* Mode Toggle */}
                            <div className="bg-cream-200 rounded-full p-1 flex">
                                <button
                                    onClick={() => setDisplayMode('mixed')}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${displayMode === 'mixed'
                                        ? 'bg-white text-primary-700 shadow-sm'
                                        : 'text-charcoal-500 hover:text-charcoal-700'
                                        }`}
                                >
                                    日本語 + 英語
                                </button>
                                <button
                                    onClick={() => setDisplayMode('english')}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${displayMode === 'english'
                                        ? 'bg-white text-primary-700 shadow-sm'
                                        : 'text-charcoal-500 hover:text-charcoal-700'
                                        }`}
                                >
                                    English Only
                                </button>
                            </div>

                            {/* Settings Toggle */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowSettings(!showSettings)}
                                className={`text-charcoal-600 ${showSettings ? 'bg-cream-200' : ''}`}
                                leftIcon={<Settings className="w-4 h-4" />}
                            >
                                表示設定
                            </Button>
                        </div>

                        {/* Settings Panel */}
                        <AnimatePresence>
                            {showSettings && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-white/80 border border-cream-200 rounded-xl p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
                                        {/* Font Size */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-charcoal-500 mb-1">
                                                <Type className="w-4 h-4" />
                                                <span>文字サイズ</span>
                                            </div>
                                            <div className="flex gap-1 bg-cream-50 rounded-lg p-1">
                                                {(['sm', 'md', 'lg', 'xl'] as FontSize[]).map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setFontSize(size)}
                                                        className={`flex-1 py-1 rounded-md text-sm transition-all ${fontSize === size
                                                            ? 'bg-white shadow-sm text-primary-700 font-medium'
                                                            : 'text-charcoal-400 hover:text-charcoal-600'
                                                            }`}
                                                    >
                                                        {size === 'sm' && '小'}
                                                        {size === 'md' && '中'}
                                                        {size === 'lg' && '大'}
                                                        {size === 'xl' && '特大'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Font Family */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-charcoal-500 mb-1">
                                                <Type className="w-4 h-4" />
                                                <span>フォント</span>
                                            </div>
                                            <div className="flex gap-1 bg-cream-50 rounded-lg p-1">
                                                <button
                                                    onClick={() => setFontFamily('serif')}
                                                    className={`flex-1 py-1 rounded-md text-sm transition-all ${fontFamily === 'serif'
                                                        ? 'bg-white shadow-sm text-primary-700 font-medium font-[var(--font-display)]'
                                                        : 'text-charcoal-400 hover:text-charcoal-600 font-[var(--font-display)]'
                                                        }`}
                                                >
                                                    明朝体
                                                </button>
                                                <button
                                                    onClick={() => setFontFamily('sans')}
                                                    className={`flex-1 py-1 rounded-md text-sm transition-all ${fontFamily === 'sans'
                                                        ? 'bg-white shadow-sm text-primary-700 font-medium font-[var(--font-body)]'
                                                        : 'text-charcoal-400 hover:text-charcoal-600 font-[var(--font-body)]'
                                                        }`}
                                                >
                                                    ゴシック
                                                </button>
                                            </div>
                                        </div>

                                        {/* Line Height */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-charcoal-500 mb-1">
                                                <AlignLeft className="w-4 h-4" />
                                                <span>行間</span>
                                            </div>
                                            <div className="flex gap-1 bg-cream-50 rounded-lg p-1">
                                                <button
                                                    onClick={() => setLineHeight('normal')}
                                                    className={`flex-1 py-1 rounded-md text-sm transition-all ${lineHeight === 'normal'
                                                        ? 'bg-white shadow-sm text-primary-700 font-medium'
                                                        : 'text-charcoal-400 hover:text-charcoal-600'
                                                        }`}
                                                >
                                                    狭め
                                                </button>
                                                <button
                                                    onClick={() => setLineHeight('relaxed')}
                                                    className={`flex-1 py-1 rounded-md text-sm transition-all ${lineHeight === 'relaxed'
                                                        ? 'bg-white shadow-sm text-primary-700 font-medium'
                                                        : 'text-charcoal-400 hover:text-charcoal-600'
                                                        }`}
                                                >
                                                    標準
                                                </button>
                                                <button
                                                    onClick={() => setLineHeight('loose')}
                                                    className={`flex-1 py-1 rounded-md text-sm transition-all ${lineHeight === 'loose'
                                                        ? 'bg-white shadow-sm text-primary-700 font-medium'
                                                        : 'text-charcoal-400 hover:text-charcoal-600'
                                                        }`}
                                                >
                                                    広め
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Story Card */}
                        <Card variant="elevated" padding="lg" className="relative overflow-hidden">
                            {/* Decorative bookmark */}
                            <div
                                className="absolute top-0 right-8 w-6 h-14 bg-secondary-400 shadow-md"
                                style={{
                                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
                                }}
                            />
                            <CardContent>
                                <div className="mb-4">
                                    <h2 className="font-[var(--font-display)] text-xl font-semibold text-charcoal-900 mb-1">
                                        {selectedTheme?.title}
                                    </h2>
                                    <p className="text-sm text-charcoal-500">
                                        {story?.sceneSummaryJa} {/* Added optional chaining just in case */}
                                    </p>
                                </div>

                                {/* Story Text */}
                                {renderStoryText()}

                                {/* Actions Footer - Story level actions */}
                                <div className="flex items-center gap-2 mt-6 pt-6 border-t border-cream-200">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        leftIcon={<Volume2 className="w-4 h-4" />}
                                    >
                                        全文を音声で聞く
                                    </Button>
                                    {/* Story level save if needed, capable of saving the whole story to history */}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Nuance Note */}
                        <Card variant="bordered" padding="md" className="bg-primary-50/50">
                            <CardContent>
                                <h3 className="font-medium text-primary-800 mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    ニュアンス解説
                                </h3>
                                <p className="text-charcoal-700 leading-relaxed">
                                    {story.nuanceNoteJa}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Try Another */}
                        <div className="text-center pt-4">
                            <Button
                                onClick={handleNewStory}
                                variant="outline"
                                rightIcon={<ArrowRight className="w-4 h-4" />}
                            >
                                同じ表現で別のシーンを見る
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
