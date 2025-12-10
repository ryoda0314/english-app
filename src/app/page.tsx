'use client';

import { Header, Footer } from '@/components/layouts';
import { Button, Card, CardContent, EmotionBadge } from '@/components/ui';
import { motion, Variants } from 'framer-motion';
import {
  BookMarked,
  PenLine,
  Star,
  Flame,
  ArrowRight,
  Quote,
  Sparkles,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Mock data for demonstration
const recentPhrases = [
  {
    id: '1',
    textEn: "I'm really nervous about my presentation tomorrow.",
    emotion: 'anxiety',
    source: 'diary',
  },
  {
    id: '2',
    textEn: "That's totally understandable.",
    emotion: 'relief',
    source: 'story',
  },
  {
    id: '3',
    textEn: "I've been meaning to tell you something.",
    emotion: 'mixed',
    source: 'story',
  },
];

const trendingSlangs = [
  { id: '1', phrase: 'lowkey', meaningJa: '少し〜、内心〜', emoji: '🤫' },
  { id: '2', phrase: 'no cap', meaningJa: 'マジで', emoji: '🧢' },
  { id: '3', phrase: 'slay', meaningJa: '最高', emoji: '✨' },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl" />
            <div className="absolute top-40 right-20 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/2 w-[800px] h-[400px] bg-accent-200/20 rounded-full blur-3xl -translate-x-1/2" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center max-w-3xl mx-auto"
            >
              {/* Tagline */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                <span>新しい英語学習のカタチ</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={itemVariants}
                className="font-[var(--font-display)] text-4xl md:text-6xl font-bold text-charcoal-900 leading-tight mb-6"
              >
                言葉は<span className="text-primary-600">状況</span>と
                <br />
                <span className="text-secondary-500">感情</span>で覚える
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-charcoal-600 mb-8 max-w-2xl mx-auto"
              >
                小説的シーン・日記・実生活の文脈から
                <br className="hidden md:block" />
                本当に使える英語を身につける
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  無料で始める
                </Button>
                <Button variant="secondary" size="lg">
                  詳しく見る
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Story Feature */}
            <Link href="/story" className="group">
              <Card
                variant="default"
                padding="lg"
                className="h-full border-2 border-transparent hover:border-primary-200 relative overflow-hidden"
              >
                {/* Decorative bookmark */}
                <div className="absolute top-0 right-8 w-6 h-14 bg-secondary-400 shadow-md"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}
                />
                <CardContent className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <BookMarked className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="font-[var(--font-display)] text-2xl font-semibold text-charcoal-900 mb-3">
                    小説的ストーリーで学ぶ
                  </h3>
                  <p className="text-charcoal-600 mb-4">
                    学びたい表現を入力すると、その表現が自然に使われる短編シーンをAIが生成。
                    情景の中で言葉のニュアンスを体感できます。
                  </p>
                  <div className="flex items-center gap-2 text-primary-600 font-medium group-hover:gap-3 transition-all">
                    <span>ストーリーを読む</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Diary Feature */}
            <Link href="/diary" className="group">
              <Card
                variant="default"
                padding="lg"
                className="h-full border-2 border-transparent hover:border-secondary-200 relative overflow-hidden"
              >
                {/* Decorative ink splatter */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary-100 rounded-full opacity-50" />
                <CardContent className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-100 to-secondary-200 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <PenLine className="w-7 h-7 text-secondary-600" />
                  </div>
                  <h3 className="font-[var(--font-display)] text-2xl font-semibold text-charcoal-900 mb-3">
                    日記から英語フレーズ
                  </h3>
                  <p className="text-charcoal-600 mb-4">
                    今日の出来事を日本語で書くだけ。AIがシーンを分析し、
                    そのとき使える自然な英語フレーズを提案します。
                  </p>
                  <div className="flex items-center gap-2 text-secondary-600 font-medium group-hover:gap-3 transition-all">
                    <span>日記を書く</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </section>

        {/* Recent Phrases Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent-500" />
                <h2 className="font-[var(--font-display)] text-2xl font-semibold text-charcoal-900">
                  最近のフレーズ
                </h2>
              </div>
              <Link
                href="/phrases"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                すべて見る
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentPhrases.map((phrase, index) => (
                <motion.div
                  key={phrase.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card variant="default" padding="md" className="group cursor-pointer">
                    <CardContent>
                      <div className="flex items-start gap-3 mb-3">
                        <Quote className="w-5 h-5 text-secondary-300 flex-shrink-0 mt-1" />
                        <p className="font-[var(--font-display)] text-lg text-charcoal-800 italic leading-snug">
                          {phrase.textEn}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <EmotionBadge emotion={phrase.emotion} />
                        <span className="text-xs text-charcoal-400">
                          {phrase.source === 'diary' ? '📓 日記' : '📖 ストーリー'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Trending Slang Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h2 className="font-[var(--font-display)] text-2xl font-semibold text-charcoal-900">
                  トレンドスラング
                </h2>
                <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-medium rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Hot
                </span>
              </div>
              <Link
                href="/slang"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                もっと見る
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {trendingSlangs.map((slang, index) => (
                <motion.div
                  key={slang.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Link href={`/slang/${slang.id}`}>
                    <Card
                      variant="default"
                      padding="md"
                      className="group cursor-pointer hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50"
                    >
                      <CardContent>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{slang.emoji}</span>
                          <h3 className="font-mono text-xl font-bold text-charcoal-900 group-hover:text-orange-600 transition-colors">
                            {slang.phrase}
                          </h3>
                        </div>
                        <p className="text-charcoal-600 text-sm">
                          {slang.meaningJa}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
