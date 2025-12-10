import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex">
            {/* Left side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-400/10 rounded-full blur-2xl" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
                    <div className="mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6">
                            <span className="text-white font-[var(--font-display)] text-3xl font-bold">E</span>
                        </div>
                        <h1 className="font-[var(--font-display)] text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
                            言葉は<br />
                            感情で覚える
                        </h1>
                        <p className="text-primary-100 text-lg max-w-md">
                            小説的シーン・日記・実生活の文脈から、本当に使える英語を身につける新しい学習体験。
                        </p>
                    </div>

                    {/* Testimonial-like quote */}
                    <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-w-md">
                        <p className="font-[var(--font-display)] text-white/90 text-lg italic mb-4">
                            "日記を書くだけで自分の日常に合った英語が学べる。この体験は他にはない。"
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600" />
                            <div>
                                <p className="text-white font-medium text-sm">早期ユーザー</p>
                                <p className="text-primary-200 text-xs">英語学習歴3年</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Header */}
                <div className="lg:hidden p-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                        <span className="text-white font-[var(--font-display)] text-xl font-bold">E</span>
                    </div>
                    <span className="font-[var(--font-display)] text-xl font-semibold text-charcoal-900">
                        Emotion English
                    </span>
                </div>

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 text-center text-sm text-charcoal-400">
                    © 2024 Emotion English. All rights reserved.
                </div>
            </div>
        </div>
    );
}
