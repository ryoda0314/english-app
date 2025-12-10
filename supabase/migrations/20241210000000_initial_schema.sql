-- =============================================
-- Emotion English App - Supabase Schema
-- =============================================
-- 実行方法:
-- 1. Supabaseダッシュボードで SQL Editor を開く
-- 2. このファイルの内容を貼り付けて実行
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE (ユーザープロフィール)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    native_language TEXT DEFAULT 'ja',
    english_level TEXT DEFAULT 'beginner' CHECK (english_level IN ('beginner', 'intermediate', 'advanced')),
    daily_reminder BOOLEAN DEFAULT false,
    reminder_time TIME DEFAULT '09:00',
    voice_speed DECIMAL(2,1) DEFAULT 1.0,
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    streak_days INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SAVED PHRASES TABLE (保存したフレーズ)
-- =============================================
CREATE TABLE IF NOT EXISTS saved_phrases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    text_en TEXT NOT NULL,
    explanation_ja TEXT,
    source_type TEXT NOT NULL CHECK (source_type IN ('diary', 'story', 'slang')),
    source_scene_id TEXT,
    emotion TEXT,
    tone TEXT,
    practiced_count INTEGER DEFAULT 0,
    last_practiced_at TIMESTAMP WITH TIME ZONE,
    pronunciation_score DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- DIARY ENTRIES TABLE (日記エントリー)
-- =============================================
CREATE TABLE IF NOT EXISTS diary_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    diary_date DATE NOT NULL DEFAULT CURRENT_DATE,
    content_ja TEXT NOT NULL,
    emotion_tags TEXT[] DEFAULT '{}',
    scenes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- STORY SESSIONS TABLE (ストーリーセッション)
-- =============================================
CREATE TABLE IF NOT EXISTS story_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    target_expression TEXT NOT NULL,
    supplement TEXT,
    selected_theme JSONB,
    generated_story JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SLANG ENTRIES TABLE (スラング辞書)
-- =============================================
CREATE TABLE IF NOT EXISTS slang_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phrase TEXT NOT NULL UNIQUE,
    reading_hint_ja TEXT,
    meaning_ja TEXT NOT NULL,
    nuance_ja TEXT,
    example_en TEXT,
    example_ja TEXT,
    tone TEXT DEFAULT 'casual',
    risk_level TEXT DEFAULT 'safe' CHECK (risk_level IN ('safe', 'careful', 'avoid')),
    region TEXT DEFAULT 'US',
    tags TEXT[] DEFAULT '{}',
    popularity_score INTEGER DEFAULT 0,
    first_seen_at TIMESTAMP WITH TIME ZONE,
    last_seen_at TIMESTAMP WITH TIME ZONE,
    is_reviewed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PRONUNCIATION RECORDS TABLE (発音記録)
-- =============================================
CREATE TABLE IF NOT EXISTS pronunciation_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    phrase_id UUID REFERENCES saved_phrases(id) ON DELETE SET NULL,
    target_text TEXT NOT NULL,
    overall_score DECIMAL(5,2),
    word_scores JSONB,
    tips TEXT[],
    audio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- LEARNING STATS TABLE (学習統計)
-- =============================================
CREATE TABLE IF NOT EXISTS learning_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    stat_date DATE NOT NULL DEFAULT CURRENT_DATE,
    phrases_saved INTEGER DEFAULT 0,
    phrases_practiced INTEGER DEFAULT 0,
    diaries_written INTEGER DEFAULT 0,
    stories_generated INTEGER DEFAULT 0,
    avg_pronunciation_score DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, stat_date)
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_saved_phrases_user ON saved_phrases(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_phrases_source ON saved_phrases(source_type);
CREATE INDEX IF NOT EXISTS idx_diary_entries_user ON diary_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_date ON diary_entries(diary_date);
CREATE INDEX IF NOT EXISTS idx_story_sessions_user ON story_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_slang_entries_phrase ON slang_entries(phrase);
CREATE INDEX IF NOT EXISTS idx_slang_entries_tags ON slang_entries USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_pronunciation_records_user ON pronunciation_records(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_stats_user_date ON learning_stats(user_id, stat_date);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE slang_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE pronunciation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_stats ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Saved phrases policies
CREATE POLICY "Users can view their own phrases"
    ON saved_phrases FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own phrases"
    ON saved_phrases FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own phrases"
    ON saved_phrases FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own phrases"
    ON saved_phrases FOR DELETE
    USING (auth.uid() = user_id);

-- Diary entries policies
CREATE POLICY "Users can view their own diaries"
    ON diary_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diaries"
    ON diary_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diaries"
    ON diary_entries FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diaries"
    ON diary_entries FOR DELETE
    USING (auth.uid() = user_id);

-- Story sessions policies
CREATE POLICY "Users can view their own stories"
    ON story_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stories"
    ON story_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Slang entries policies (public read, admin write)
CREATE POLICY "Anyone can view slang entries"
    ON slang_entries FOR SELECT
    TO authenticated
    USING (true);

-- Pronunciation records policies
CREATE POLICY "Users can view their own pronunciation records"
    ON pronunciation_records FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pronunciation records"
    ON pronunciation_records FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Learning stats policies
CREATE POLICY "Users can view their own stats"
    ON learning_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
    ON learning_stats FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
    ON learning_stats FOR UPDATE
    USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diary_entries_updated_at
    BEFORE UPDATE ON diary_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_slang_entries_updated_at
    BEFORE UPDATE ON slang_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- DONE!
-- =============================================
