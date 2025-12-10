'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    BookOpen,
    PenLine,
    BookMarked,
    Flame,
    Settings,
    Menu,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { href: '/', label: 'ホーム', icon: <BookOpen className="w-5 h-5" /> },
    { href: '/story', label: 'ストーリー', icon: <BookMarked className="w-5 h-5" /> },
    { href: '/diary', label: '日記', icon: <PenLine className="w-5 h-5" /> },
    { href: '/phrases', label: 'フレーズ帳', icon: <BookOpen className="w-5 h-5" /> },
    { href: '/slang', label: 'スラング', icon: <Flame className="w-5 h-5" /> },
];

export function Header() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-cream-50/80 backdrop-blur-lg border-b border-cream-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
                            <span className="text-white font-[var(--font-display)] text-xl font-bold">E</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="font-[var(--font-display)] text-xl font-semibold text-charcoal-900">
                                Emotion English
                            </h1>
                            <p className="text-[10px] text-charcoal-500 -mt-0.5 tracking-wide">
                                感情で学ぶ英会話
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                                        isActive
                                            ? 'bg-primary-100 text-primary-700'
                                            : 'text-charcoal-600 hover:bg-cream-200 hover:text-charcoal-900'
                                    )}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/settings"
                            className="p-2 rounded-xl text-charcoal-500 hover:bg-cream-200 hover:text-charcoal-700 transition-colors"
                        >
                            <Settings className="w-5 h-5" />
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-xl text-charcoal-600 hover:bg-cream-200 transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden border-t border-cream-200 bg-cream-50"
                    >
                        <nav className="px-4 py-3 space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                                            isActive
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'text-charcoal-600 hover:bg-cream-200'
                                        )}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
