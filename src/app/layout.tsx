import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emotion English | 感情で学ぶ英会話",
  description:
    "言葉は状況と感情で覚える。小説的シーン・日記・実生活の文脈から英語を身につける新しい言語学習アプリ。",
  keywords: [
    "英語学習",
    "英会話",
    "感情",
    "日記",
    "ストーリー",
    "フレーズ",
    "English learning",
  ],
  authors: [{ name: "Emotion English" }],
  openGraph: {
    title: "Emotion English | 感情で学ぶ英会話",
    description: "言葉は状況と感情で覚える。新しい英語学習体験。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
