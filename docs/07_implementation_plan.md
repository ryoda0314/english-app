# 実装計画書

## 17. 開発フェーズ

### Phase 1: 基盤構築（1週目）

#### 1.1 プロジェクトセットアップ
- [ ] Next.js 14 プロジェクト初期化
- [ ] TypeScript / ESLint / Prettier 設定
- [ ] Tailwind CSS 設定
- [ ] Supabase プロジェクト作成
- [ ] 環境変数設定

#### 1.2 認証システム
- [ ] Supabase Auth 設定
- [ ] ログイン画面
- [ ] 新規登録画面
- [ ] パスワードリセット
- [ ] 認証ミドルウェア

#### 1.3 共通コンポーネント
- [ ] Button
- [ ] Card
- [ ] Input / Textarea
- [ ] Badge
- [ ] Modal
- [ ] Toast
- [ ] Loading / Skeleton

---

### Phase 2: コア機能（2-3週目）

#### 2.1 ホーム画面
- [ ] ダッシュボードレイアウト
- [ ] 学習サマリーカード
- [ ] クイックアクション
- [ ] 最近のフレーズ表示

#### 2.2 日記機能
- [ ] 日記入力フォーム
- [ ] OpenAI API連携（シーン分割）
- [ ] フレーズ提案表示
- [ ] 日記保存

#### 2.3 ストーリー機能
- [ ] 表現入力フォーム
- [ ] テーマ生成API
- [ ] テーマ選択UI
- [ ] シーン生成API
- [ ] シーン表示UI

---

### Phase 3: 学習機能（4週目）

#### 3.1 マイフレーズ帳
- [ ] フレーズ一覧
- [ ] フィルター・検索
- [ ] フレーズ詳細
- [ ] 保存・削除

#### 3.2 音声機能
- [ ] TTS API連携
- [ ] 音声再生コンポーネント
- [ ] 録音機能
- [ ] 発音判定API（基本）

---

### Phase 4: 拡張機能（5-6週目）

#### 4.1 スラング機能
- [ ] スラングマスタデータ投入
- [ ] トレンド一覧
- [ ] 検索・フィルター
- [ ] 詳細画面
- [ ] ストーリー連携

#### 4.2 設定・その他
- [ ] 設定画面
- [ ] プロフィール編集
- [ ] 通知設定
- [ ] テーマ切り替え

---

### Phase 5: 品質向上（7-8週目）

#### 5.1 テスト
- [ ] ユニットテスト
- [ ] E2Eテスト（Playwright）
- [ ] 負荷テスト

#### 5.2 最適化
- [ ] パフォーマンス最適化
- [ ] SEO対策
- [ ] アクセシビリティ改善

#### 5.3 デプロイ
- [ ] Vercel デプロイ設定
- [ ] ドメイン設定
- [ ] 本番環境テスト

---

## 18. ファイル構成詳細

```
english-app/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx          # 認証画面共通レイアウト
│   │   ├── login/
│   │   │   └── page.tsx        # ログイン画面
│   │   ├── register/
│   │   │   └── page.tsx        # 新規登録画面
│   │   └── reset-password/
│   │       └── page.tsx        # パスワードリセット
│   │
│   ├── (main)/
│   │   ├── layout.tsx          # メイン画面共通レイアウト
│   │   ├── page.tsx            # ホーム（ダッシュボード）
│   │   ├── story/
│   │   │   ├── page.tsx        # ストーリー入力・テーマ選択
│   │   │   └── [id]/
│   │   │       └── page.tsx    # シーン表示
│   │   ├── diary/
│   │   │   ├── page.tsx        # 日記入力
│   │   │   └── result/
│   │   │       └── page.tsx    # フレーズ提案結果
│   │   ├── phrases/
│   │   │   ├── page.tsx        # マイフレーズ帳一覧
│   │   │   └── [id]/
│   │   │       └── page.tsx    # フレーズ詳細・練習
│   │   ├── slang/
│   │   │   ├── page.tsx        # スラング一覧
│   │   │   └── [id]/
│   │   │       └── page.tsx    # スラング詳細
│   │   └── settings/
│   │       └── page.tsx        # 設定
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   ├── login/route.ts
│   │   │   └── callback/route.ts
│   │   ├── story/
│   │   │   ├── themes/route.ts
│   │   │   └── generate/route.ts
│   │   ├── diary/
│   │   │   └── suggest/route.ts
│   │   ├── phrases/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── slang/
│   │   │   ├── trending/route.ts
│   │   │   ├── search/route.ts
│   │   │   └── [id]/route.ts
│   │   ├── pronunciation/route.ts
│   │   └── tts/route.ts
│   │
│   ├── globals.css
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── badge.tsx
│   │   ├── modal.tsx
│   │   ├── toast.tsx
│   │   ├── skeleton.tsx
│   │   └── spinner.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   ├── diary/
│   │   │   ├── diary-form.tsx
│   │   │   ├── scene-card.tsx
│   │   │   └── phrase-list.tsx
│   │   ├── story/
│   │   │   ├── expression-input.tsx
│   │   │   ├── theme-card.tsx
│   │   │   └── story-viewer.tsx
│   │   ├── phrases/
│   │   │   ├── phrase-card.tsx
│   │   │   ├── phrase-filter.tsx
│   │   │   └── pronunciation-practice.tsx
│   │   ├── slang/
│   │   │   ├── slang-card.tsx
│   │   │   └── slang-detail.tsx
│   │   └── audio/
│   │       ├── audio-player.tsx
│   │       ├── audio-recorder.tsx
│   │       └── pronunciation-result.tsx
│   │
│   └── layouts/
│       ├── header.tsx
│       ├── sidebar.tsx
│       ├── mobile-nav.tsx
│       └── footer.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── openai/
│   │   ├── client.ts
│   │   ├── prompts.ts
│   │   └── parsers.ts
│   └── utils/
│       ├── cn.ts
│       ├── validators.ts
│       └── formatters.ts
│
├── hooks/
│   ├── use-auth.ts
│   ├── use-phrases.ts
│   ├── use-diary.ts
│   ├── use-story.ts
│   ├── use-slang.ts
│   └── use-audio.ts
│
├── types/
│   ├── database.ts
│   ├── api.ts
│   └── index.ts
│
├── public/
│   ├── icons/
│   └── images/
│
├── .env.local.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## 19. 環境変数

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 20. 依存パッケージ

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/ssr": "^0.1.0",
    "openai": "^4.20.0",
    "zustand": "^4.4.0",
    "zod": "^3.22.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.294.0",
    "framer-motion": "^10.16.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "typescript": "^5.2.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.9.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.54.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.1.0",
    "@playwright/test": "^1.40.0"
  }
}
```
