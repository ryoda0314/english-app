'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, UserPlus } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';

// Animation variants
const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

const ENGLISH_LEVELS = [
    { value: 'beginner', label: '初級', description: '基本的な挨拶ができる' },
    { value: 'intermediate', label: '中級', description: '日常会話ができる' },
    { value: 'advanced', label: '上級', description: 'ビジネス英語もOK' },
];

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createBrowserClient();
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
        englishLevel: 'beginner',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('パスワードが一致しません');
            return;
        }

        if (formData.password.length < 8) {
            setError('パスワードは8文字以上で入力してください');
            return;
        }

        setIsLoading(true);

        try {
            const { error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        display_name: formData.displayName,
                        english_level: formData.englishLevel,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (authError) {
                throw authError;
            }

            router.push('/login?registered=true');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('登録に失敗しました。もう一度お試しください。');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
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
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center lg:text-left">
                <h1 className="font-[var(--font-display)] text-3xl font-bold text-charcoal-900 mb-2">
                    アカウント作成
                </h1>
                <p className="text-charcoal-500">
                    新しい英語学習を始めましょう
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div variants={itemVariants}>
                    <Input
                        label="表示名"
                        type="text"
                        placeholder="あなたのニックネーム"
                        value={formData.displayName}
                        onChange={(e) => handleChange('displayName', e.target.value)}
                        leftIcon={<User className="w-5 h-5" />}
                        required
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Input
                        label="メールアドレス"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        leftIcon={<Mail className="w-5 h-5" />}
                        required
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Input
                        label="パスワード"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="8文字以上"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
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

                <motion.div variants={itemVariants}>
                    <Input
                        label="パスワード（確認）"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="もう一度入力"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        leftIcon={<Lock className="w-5 h-5" />}
                        required
                    />
                </motion.div>

                {/* English Level Selection */}
                <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        <GraduationCap className="w-4 h-4 inline-block mr-1" />
                        現在の英語レベル
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {ENGLISH_LEVELS.map((level) => (
                            <button
                                key={level.value}
                                type="button"
                                onClick={() => handleChange('englishLevel', level.value)}
                                className={`p-3 rounded-xl border-2 text-center transition-all ${formData.englishLevel === level.value
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-cream-300 hover:border-cream-400 text-charcoal-700'
                                    }`}
                            >
                                <div className="font-medium text-sm">{level.label}</div>
                                <div className="text-xs text-charcoal-500 mt-0.5">
                                    {level.description}
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-2">
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={isLoading}
                        leftIcon={<UserPlus className="w-5 h-5" />}
                    >
                        アカウントを作成
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

            {/* Social Sign Up */}
            <motion.div variants={itemVariants}>
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    size="lg"
                    onClick={handleGoogleSignUp}
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
                    Googleで登録
                </Button>
            </motion.div>

            {/* Login Link */}
            <motion.p
                variants={itemVariants}
                className="text-center text-charcoal-600"
            >
                すでにアカウントをお持ちの方は{' '}
                <Link
                    href="/login"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                >
                    ログイン
                </Link>
            </motion.p>

            {/* Terms */}
            <motion.p
                variants={itemVariants}
                className="text-center text-xs text-charcoal-400"
            >
                登録することで、
                <Link href="/terms" className="underline hover:text-charcoal-600">
                    利用規約
                </Link>
                と
                <Link href="/privacy" className="underline hover:text-charcoal-600">
                    プライバシーポリシー
                </Link>
                に同意したことになります。
            </motion.p>
        </motion.div>
    );
}
