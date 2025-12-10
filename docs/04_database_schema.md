# データベース設計

## 10. Supabase テーブル設計

### 10.1 profiles（ユーザープロファイル）
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  native_language TEXT NOT NULL DEFAULT 'ja',
  english_level TEXT NOT NULL DEFAULT 'beginner',
  daily_reminder BOOLEAN DEFAULT true,
  reminder_time TIME DEFAULT '20:00',
  voice_speed NUMERIC DEFAULT 1.0,
  theme TEXT DEFAULT 'system',
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 10.2 saved_phrases（保存フレーズ）
```sql
CREATE TABLE saved_phrases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  text_en TEXT NOT NULL,
  explanation_ja TEXT,
  source_type TEXT NOT NULL, -- 'diary' | 'story' | 'slang'
  source_scene_id TEXT,
  emotion TEXT,
  tone TEXT,
  practiced_count INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  pronunciation_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_phrases_user ON saved_phrases(user_id);
CREATE INDEX idx_saved_phrases_source ON saved_phrases(source_type);

-- RLS
ALTER TABLE saved_phrases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own phrases" ON saved_phrases
  FOR ALL USING (auth.uid() = user_id);
```

### 10.3 diary_entries（日記エントリー）
```sql
CREATE TABLE diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  diary_date DATE NOT NULL,
  content_ja TEXT NOT NULL,
  emotion_tags TEXT[],
  scenes JSONB, -- 解析結果をJSON保存
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_diary_user ON diary_entries(user_id);
CREATE INDEX idx_diary_date ON diary_entries(diary_date);

-- RLS
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own diaries" ON diary_entries
  FOR ALL USING (auth.uid() = user_id);
```

### 10.4 story_sessions（ストーリーセッション）
```sql
CREATE TABLE story_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_expression TEXT NOT NULL,
  supplement TEXT,
  selected_theme JSONB,
  generated_story JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_story_user ON story_sessions(user_id);

-- RLS
ALTER TABLE story_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own stories" ON story_sessions
  FOR ALL USING (auth.uid() = user_id);
```

### 10.5 slang_entries（スラングマスタ）
```sql
CREATE TABLE slang_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phrase TEXT NOT NULL UNIQUE,
  reading_hint_ja TEXT,
  meaning_ja TEXT NOT NULL,
  nuance_ja TEXT,
  example_en TEXT,
  example_ja TEXT,
  tone TEXT DEFAULT 'casual',
  risk_level TEXT DEFAULT 'safe',
  region TEXT DEFAULT 'global',
  tags TEXT[],
  popularity_score NUMERIC DEFAULT 0,
  first_seen_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  is_reviewed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_slang_phrase ON slang_entries(phrase);
CREATE INDEX idx_slang_popularity ON slang_entries(popularity_score DESC);
CREATE INDEX idx_slang_tags ON slang_entries USING GIN(tags);

-- RLS (読み取りは全員可、書き込みは管理者のみ)
ALTER TABLE slang_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read slang" ON slang_entries
  FOR SELECT USING (true);
```

### 10.6 pronunciation_records（発音記録）
```sql
CREATE TABLE pronunciation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  phrase_id UUID REFERENCES saved_phrases(id) ON DELETE SET NULL,
  target_text TEXT NOT NULL,
  overall_score INTEGER,
  word_scores JSONB,
  tips JSONB,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pronunciation_user ON pronunciation_records(user_id);

-- RLS
ALTER TABLE pronunciation_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own records" ON pronunciation_records
  FOR ALL USING (auth.uid() = user_id);
```

### 10.7 learning_stats（学習統計）
```sql
CREATE TABLE learning_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stat_date DATE NOT NULL,
  phrases_saved INTEGER DEFAULT 0,
  phrases_practiced INTEGER DEFAULT 0,
  diaries_written INTEGER DEFAULT 0,
  stories_generated INTEGER DEFAULT 0,
  avg_pronunciation_score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, stat_date)
);

CREATE INDEX idx_stats_user_date ON learning_stats(user_id, stat_date);

-- RLS
ALTER TABLE learning_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own stats" ON learning_stats
  FOR SELECT USING (auth.uid() = user_id);
```

---

## 11. TypeScript型定義

```typescript
// types/database.ts

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
  emotion: string;
  relationship?: string;
  place?: string;
  phrases: PhraseCandidate[];
};

export type PhraseCandidate = {
  id: string;
  textEn: string;
  explanationJa: string;
  tone: 'casual' | 'polite' | 'playful' | 'serious';
};

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
  genre: string;
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

export type SlangEntry = {
  id: string;
  phrase: string;
  reading_hint_ja: string | null;
  meaning_ja: string;
  nuance_ja: string | null;
  example_en: string | null;
  example_ja: string | null;
  tone: string;
  risk_level: 'safe' | 'careful' | 'avoid';
  region: string;
  tags: string[];
  popularity_score: number;
  first_seen_at: string | null;
  last_seen_at: string | null;
  is_reviewed: boolean;
  created_at: string;
  updated_at: string;
};

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
```
