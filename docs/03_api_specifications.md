# スラング・設定機能 & API仕様

## 7. スラング探索機能

### 7.1 スラング一覧画面
| 項目 | 詳細 |
|------|------|
| 画面ID | SLANG-001 |
| パス | `/slang` |

#### 表示要素
- **トレンドスラングセクション**
  - 人気スラングカード（上位10件）
- **検索・フィルター**
  - キーワード検索
  - タグフィルター
  - トーン/リスクレベル
- **スラングカード**
  - フレーズ
  - 読み方ヒント
  - 意味（1行）
  - トーンバッジ
  - リスクレベルバッジ

### 7.2 スラング詳細画面
| 項目 | 詳細 |
|------|------|
| 画面ID | SLANG-002 |
| パス | `/slang/[id]` |

#### 表示要素
1. フレーズ（大）
2. 読み方ヒント
3. 意味（日本語）
4. ニュアンス解説
5. 例文（英語・日本語）
6. タグ一覧
7. トーン・リスクレベル
8. 流行度スコア
9. **アクションボタン**
   - 「ストーリーで見る」→ Story機能連携
   - 「保存する」→ マイフレーズ帳

---

## 8. 設定画面

| 項目 | 詳細 |
|------|------|
| 画面ID | SETTINGS-001 |
| パス | `/settings` |

### 設定項目
| 項目 | 型 | 説明 |
|------|-----|------|
| displayName | string | 表示名 |
| englishLevel | enum | 英語レベル |
| dailyReminder | boolean | 毎日の通知 |
| reminderTime | time | 通知時刻 |
| voiceSpeed | number | 音声速度 (0.5-2.0) |
| theme | enum | 'light' \| 'dark' \| 'system' |

---

## 9. API仕様

### 9.1 認証API

#### POST `/api/auth/register`
```typescript
// Request
{
  email: string;
  password: string;
  displayName: string;
  nativeLanguage: 'ja' | 'en' | 'zh' | 'ko';
  englishLevel: 'beginner' | 'intermediate' | 'advanced';
}

// Response 201
{
  user: { id: string; email: string; displayName: string; }
  message: "確認メールを送信しました"
}

// Error 400
{ error: "メールアドレスは既に使用されています" }
```

#### POST `/api/auth/login`
```typescript
// Request
{ email: string; password: string; }

// Response 200
{
  user: { id: string; email: string; displayName: string; }
  session: { accessToken: string; refreshToken: string; }
}
```

### 9.2 ストーリーAPI

#### POST `/api/story/themes`
```typescript
// Request
{
  targetExpression: string;
  supplement?: string;
}

// Response 200
{
  themes: Array<{
    id: string;
    title: string;
    oneLineJa: string;
    genre: 'romance' | 'friendship' | 'work' | 'family' | 'daily';
    emotion: string;
    relationship: string;
  }>
}
```

#### POST `/api/story/generate`
```typescript
// Request
{
  targetExpression: string;
  selectedTheme: {
    id: string;
    title: string;
    genre: string;
    emotion: string;
    relationship: string;
  }
}

// Response 200
{
  storyTextEn: string;          // 180-260 words
  lineExcerpt: string;          // ハイライトすべきセリフ
  sceneSummaryJa: string;
  nuanceNoteJa: string;
  tags: {
    genre: string;
    emotion: string;
    relationship: string;
    tone: string;
  }
}
```

### 9.3 日記API

#### POST `/api/diary/suggest`
```typescript
// Request
{
  diaryTextJa: string;
  emotionTags?: string[];
  useSlang?: boolean;
}

// Response 200
{
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
    }>
  }>
}
```

### 9.4 フレーズAPI

#### GET `/api/phrases`
```typescript
// Query Parameters
?source=diary|story|slang
&emotion=anxiety|happy|...
&practiced=true|false
&limit=20
&offset=0

// Response 200
{
  phrases: Array<SavedPhrase>;
  total: number;
}
```

#### POST `/api/phrases`
```typescript
// Request
{
  textEn: string;
  sourceType: 'diary' | 'story' | 'slang';
  sourceSceneId?: string;
  explanationJa?: string;
  emotion?: string;
  tone?: string;
}

// Response 201
{ id: string; createdAt: string; }
```

#### DELETE `/api/phrases/[id]`
```typescript
// Response 204 No Content
```

### 9.5 発音判定API

#### POST `/api/pronunciation`
```typescript
// Request (multipart/form-data)
{
  audioFile: File;           // webm or wav
  targetTextEn: string;
}

// Response 200
{
  overallScore: number;      // 0-100
  wordScores: Array<{
    word: string;
    score: number;
    feedbackJa?: string;
  }>;
  tipsJa: string[];
}
```

### 9.6 スラングAPI

#### GET `/api/slang/trending`
```typescript
// Query: ?limit=20

// Response 200
{
  items: Array<{
    id: string;
    phrase: string;
    readingHintJa: string;
    meaningJa: string;
    tone: string;
    riskLevel: 'safe' | 'careful' | 'avoid';
    tags: string[];
    popularityScore: number;
  }>
}
```

#### GET `/api/slang/search`
```typescript
// Query
?q=keyword
&tag=恋愛
&tone=casual
&riskLevel=safe

// Response 200 (same as trending)
```

#### GET `/api/slang/[id]`
```typescript
// Response 200
{
  id: string;
  phrase: string;
  readingHintJa: string;
  meaningJa: string;
  nuanceJa: string;
  exampleEn: string;
  exampleJa: string;
  tone: string;
  riskLevel: string;
  tags: string[];
  region: string;
  popularityScore: number;
  firstSeenAt: string;
  lastSeenAt: string;
}
```

### 9.7 TTS API

#### POST `/api/tts`
```typescript
// Request
{
  text: string;
  speed?: number;  // 0.5-2.0, default 1.0
}

// Response 200
// Content-Type: audio/mpeg
// Binary audio data
```
