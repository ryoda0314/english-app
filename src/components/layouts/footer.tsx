'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="mt-auto border-t border-cream-200 bg-cream-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo & Tagline */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                            <span className="text-white font-[var(--font-display)] text-sm font-bold">E</span>
                        </div>
                        <div>
                            <p className="font-[var(--font-display)] font-semibold text-charcoal-800">
                                Emotion English
                            </p>
                            <p className="text-xs text-charcoal-500">
                                言葉は状況と感情で覚える
                            </p>
                        </div>
                    </div>

                    {/* Links */}
                    <nav className="flex items-center gap-6 text-sm text-charcoal-600">
                        <Link href="/about" className="hover:text-primary-600 transition-colors">
                            About
                        </Link>
                        <Link href="/privacy" className="hover:text-primary-600 transition-colors">
                            Privacy
                        </Link>
                        <Link href="/terms" className="hover:text-primary-600 transition-colors">
                            Terms
                        </Link>
                        <Link href="/contact" className="hover:text-primary-600 transition-colors">
                            Contact
                        </Link>
                    </nav>

                    {/* Copyright */}
                    <p className="flex items-center gap-1.5 text-xs text-charcoal-400">
                        Made with <Heart className="w-3 h-3 text-secondary-400 fill-secondary-400" /> in Tokyo
                    </p>
                </div>
            </div>
        </footer>
    );
}
