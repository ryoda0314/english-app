'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';

// Animation variants
const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

export default function LoginPage() {
    const router = useRouter();
    const supabase = createBrowserClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                throw authError;
            }

            router.push('/');
            router.refresh();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message === 'Invalid login credentials'
                    ? 'メールアドレスまたはパスワードが正しくありません'
                    : err.message);
            } else {
                setError('ログインに失敗しました');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setIsGoogleLoading(true);

        try {
            const { error: authError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (authError) {
                throw authError;
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Googleログインに失敗しました');
            }
            setIsGoogleLoading(false);
        }
    };

    return (
        <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center lg:text-left">
                <h1 className="font-[var(--font-display)] text-3xl font-bold text-charcoal-900 mb-2">
                    おかえりなさい
                </h1>
                <p className="text-charcoal-500">
                    アカウントにログインして学習を続けましょう
                </p>
            </motion.div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                >
                    {error}
                </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div variants={itemVariants}>
                    <Input
                        label="メールアドレス"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        leftIcon={<Mail className="w-5 h-5" />}
                        required
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Input
                        label="パスワード"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        leftIcon={<Lock className="w-5 h-5" />}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-charcoal-400 hover:text-charcoal-600 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        }
                        required
                    />
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-cream-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-charcoal-600">ログイン状態を保持</span>
                    </label>
                    <Link
                        href="/reset-password"
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                        パスワードを忘れた？
                    </Link>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={isLoading}
                        leftIcon={<LogIn className="w-5 h-5" />}
                    >
                        ログイン
                    </Button>
                </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-cream-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-cream-50 text-charcoal-500">または</span>
                </div>
            </motion.div>

            {/* Social Login */}
            <motion.div variants={itemVariants}>
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    size="lg"
                    onClick={handleGoogleLogin}
                    isLoading={isGoogleLoading}
                    leftIcon={
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                    }
                >
                    Googleでログイン
                </Button>
            </motion.div>

            {/* Sign Up Link */}
            <motion.p
                variants={itemVariants}
                className="text-center text-charcoal-600"
            >
                アカウントをお持ちでない方は{' '}
                <Link
                    href="/register"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                >
                    新規登録
                </Link>
            </motion.p>
        </motion.div>
    );
}
