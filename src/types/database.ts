// ===================================
// Database Types for Emotion English
// ===================================

// Supabase Database type for type-safe client
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Database { }
// === User Profile ===
export type Profile = {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string | null;
    native_language: 'ja' | 'en' | 'zh' | 'ko';
    english_level: 'beginner' | 'intermediate' | 'advanced';
    daily_reminder: boolean;
    reminder_time: string;
    voice_speed: number;
    theme: 'light' | 'dark' | 'system';
    streak_days: number;
    last_activity_date: string | null;
    created_at: string;
    updated_at: string;
};

// === Saved Phrases ===
export type SavedPhrase = {
    id: string;
    user_id: string;
    text_en: string;
    explanation_ja: string | null;
    source_type: 'diary' | 'story' | 'slang';
    source_scene_id: string | null;
    emotion: string | null;
    tone: string | null;
    practiced_count: number;
    last_practiced_at: string | null;
    pronunciation_score: number | null;
    created_at: string;
};

// === Diary Entries ===
export type DiaryEntry = {
    id: string;
    user_id: string;
    diary_date: string;
    content_ja: string;
    emotion_tags: string[];
    scenes: DiaryScene[] | null;
    created_at: string;
    updated_at: string;
};

export type DiaryScene = {
    sceneId: string;
    sceneSummaryJa: string;
    originalExcerptJa: string;
    emotion: Emotion;
    relationship?: Relationship;
    place?: string;
    phrases: PhraseCandidate[];
};

export type PhraseCandidate = {
    id: string;
    textEn: string;
    explanationJa: string;
    tone: Tone;
};

// === Story Sessions ===
export type StorySession = {
    id: string;
    user_id: string;
    target_expression: string;
    supplement: string | null;
    selected_theme: SceneTheme | null;
    generated_story: GeneratedStory | null;
    created_at: string;
};

export type SceneTheme = {
    id: string;
    title: string;
    oneLineJa: string;
    genre: Genre;
    emotion: string;
    relationship: string;
};

export type GeneratedStory = {
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
};

// === Slang Entries ===
export type SlangEntry = {
    id: string;
    phrase: string;
    reading_hint_ja: string | null;
    meaning_ja: string;
    nuance_ja: string | null;
    example_en: string | null;
    example_ja: string | null;
    tone: string;
    risk_level: RiskLevel;
    region: string;
    tags: string[];
    popularity_score: number;
    first_seen_at: string | null;
    last_seen_at: string | null;
    is_reviewed: boolean;
    created_at: string;
    updated_at: string;
};

// === Pronunciation Records ===
export type PronunciationRecord = {
    id: string;
    user_id: string;
    phrase_id: string | null;
    target_text: string;
    overall_score: number | null;
    word_scores: WordScore[] | null;
    tips: string[] | null;
    audio_url: string | null;
    created_at: string;
};

export type WordScore = {
    word: string;
    score: number;
    feedbackJa?: string;
};

// === Learning Stats ===
export type LearningStats = {
    id: string;
    user_id: string;
    stat_date: string;
    phrases_saved: number;
    phrases_practiced: number;
    diaries_written: number;
    stories_generated: number;
    avg_pronunciation_score: number | null;
    created_at: string;
};

// === Enums ===
export type Emotion =
    | 'anxiety'
    | 'joy'
    | 'sadness'
    | 'anger'
    | 'surprise'
    | 'fear'
    | 'mixed'
    | 'excitement'
    | 'tiredness'
    | 'relief';

export type Relationship =
    | 'friend'
    | 'family'
    | 'coworker'
    | 'stranger'
    | 'self'
    | 'romantic'
    | 'boss'
    | 'teacher';

export type Tone = 'casual' | 'polite' | 'playful' | 'serious';

export type Genre =
    | 'romance'
    | 'friendship'
    | 'work'
    | 'family'
    | 'daily'
    | 'adventure';

export type RiskLevel = 'safe' | 'careful' | 'avoid';

export type SourceType = 'diary' | 'story' | 'slang';
