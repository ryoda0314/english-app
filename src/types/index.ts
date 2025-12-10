// Re-export all types
export * from './database';

// === API Request/Response Types ===

// --- Auth ---
export interface RegisterRequest {
    email: string;
    password: string;
    displayName: string;
    nativeLanguage: 'ja' | 'en' | 'zh' | 'ko';
    englishLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        displayName: string;
    };
    message?: string;
}

// --- Story ---
export interface StoryThemesRequest {
    targetExpression: string;
    supplement?: string;
}

export interface StoryThemesResponse {
    themes: Array<{
        id: string;
        title: string;
        oneLineJa: string;
        genre: string;
        emotion: string;
        relationship: string;
    }>;
}

export interface StoryGenerateRequest {
    targetExpression: string;
    selectedTheme: {
        id: string;
        title: string;
        genre: string;
        emotion: string;
        relationship: string;
    };
}

export interface StoryGenerateResponse {
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

// --- Diary ---
export interface DiarySuggestRequest {
    diaryTextJa: string;
    emotionTags?: string[];
    useSlang?: boolean;
}

export interface DiarySuggestResponse {
    scenes: Array<{
        sceneId: string;
        sceneSummaryJa: string;
        originalExcerptJa: string;
        emotion: string;
        relationship?: string;
        place?: string;
        phrases: Array<{
            id: string;
            textEn: string;
            explanationJa: string;
            tone: 'casual' | 'polite' | 'playful' | 'serious';
        }>;
    }>;
}

// --- Phrases ---
export interface SavePhraseRequest {
    textEn: string;
    sourceType: 'diary' | 'story' | 'slang';
    sourceSceneId?: string;
    explanationJa?: string;
    emotion?: string;
    tone?: string;
}

export interface PhrasesListResponse {
    phrases: Array<{
        id: string;
        textEn: string;
        explanationJa: string | null;
        sourceType: 'diary' | 'story' | 'slang';
        emotion: string | null;
        tone: string | null;
        practicedCount: number;
        pronunciationScore: number | null;
        createdAt: string;
    }>;
    total: number;
}

// --- Pronunciation ---
export interface PronunciationRequest {
    audioFile: File;
    targetTextEn: string;
}

export interface PronunciationResponse {
    overallScore: number;
    wordScores: Array<{
        word: string;
        score: number;
        feedbackJa?: string;
    }>;
    tipsJa: string[];
}

// --- Slang ---
export interface SlangListResponse {
    items: Array<{
        id: string;
        phrase: string;
        readingHintJa: string | null;
        meaningJa: string;
        tone: string;
        riskLevel: 'safe' | 'careful' | 'avoid';
        tags: string[];
        popularityScore: number;
    }>;
}

export interface SlangDetailResponse {
    id: string;
    phrase: string;
    readingHintJa: string | null;
    meaningJa: string;
    nuanceJa: string | null;
    exampleEn: string | null;
    exampleJa: string | null;
    tone: string;
    riskLevel: 'safe' | 'careful' | 'avoid';
    tags: string[];
    region: string;
    popularityScore: number;
    firstSeenAt: string | null;
    lastSeenAt: string | null;
}

// --- TTS ---
export interface TTSRequest {
    text: string;
    speed?: number;
}

// === Error Types ===
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}
