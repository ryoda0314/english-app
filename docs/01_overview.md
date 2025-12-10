# 感情英会話アプリ 詳細仕様書

## 1. プロジェクト概要

### 1.1 サービス名
**Emotion English（感情英会話アプリ）**

### 1.2 コンセプト
"言葉は状況と感情で覚える。" - 単語や文法ではなく、小説的シーン・日記・実生活の文脈から英語を身につける言語学習アプリ。

### 1.3 技術スタック
| レイヤー | 技術 |
|---------|------|
| フロントエンド | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| バックエンド | Next.js API Routes |
| データベース | Supabase (PostgreSQL) |
| 認証 | Supabase Auth |
| AI | OpenAI API (GPT-4) |
| 音声 | Web Speech API, OpenAI TTS/Whisper |
| ホスティング | Vercel |

### 1.4 ディレクトリ構造
```
english-app/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── page.tsx (ホーム)
│   │   ├── story/
│   │   │   ├── page.tsx (テーマ選択)
│   │   │   └── [themeId]/page.tsx (シーン表示)
│   │   ├── diary/
│   │   │   ├── page.tsx (日記入力)
│   │   │   └── result/page.tsx (フレーズ提案)
│   │   ├── phrases/
│   │   │   ├── page.tsx (マイフレーズ帳)
│   │   │   └── [id]/page.tsx (詳細・練習)
│   │   ├── slang/
│   │   │   ├── page.tsx (スラング一覧)
│   │   │   └── [id]/page.tsx (詳細)
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── story/
│   │   │   ├── themes/route.ts
│   │   │   └── generate/route.ts
│   │   ├── diary/
│   │   │   └── suggest/route.ts
│   │   ├── phrases/route.ts
│   │   ├── slang/
│   │   │   ├── trending/route.ts
│   │   │   ├── search/route.ts
│   │   │   └── [id]/route.ts
│   │   └── pronunciation/route.ts
│   └── globals.css
├── components/
│   ├── ui/ (共通UIコンポーネント)
│   ├── features/ (機能別コンポーネント)
│   └── layouts/ (レイアウト)
├── lib/
│   ├── supabase/
│   ├── openai/
│   └── utils/
├── hooks/
├── types/
└── public/
```
