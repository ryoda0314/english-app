'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, Card, CardContent } from '@/components/ui';
import {
    Settings,
    User,
    Bell,
    Volume2,
    Palette,
    LogOut,
    ChevronRight,
    Check,
} from 'lucide-react';

const ENGLISH_LEVELS = [
    { value: 'beginner', label: '初級' },
    { value: 'intermediate', label: '中級' },
    { value: 'advanced', label: '上級' },
];

const THEMES = [
    { value: 'light', label: 'ライト' },
    { value: 'dark', label: 'ダーク' },
    { value: 'system', label: 'システム' },
];

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        displayName: 'テストユーザー',
        email: 'test@example.com',
        englishLevel: 'intermediate',
        dailyReminder: true,
        reminderTime: '20:00',
        voiceSpeed: 1.0,
        theme: 'system',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const updateSetting = (key: string, value: unknown) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-charcoal-100 to-charcoal-200 flex items-center justify-center">
                        <Settings className="w-6 h-6 text-charcoal-600" />
                    </div>
                    <h1 className="font-[var(--font-display)] text-3xl font-bold text-charcoal-900">
                        設定
                    </h1>
                </div>
            </motion.div>

            {/* Success Toast */}
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
                >
                    <Check className="w-5 h-5" />
                    設定を保存しました
                </motion.div>
            )}

            <div className="space-y-6">
                {/* Profile Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card variant="default" padding="lg">
                        <CardContent>
                            <div className="flex items-center gap-3 mb-6">
                                <User className="w-5 h-5 text-charcoal-500" />
                                <h2 className="font-[var(--font-display)] text-xl font-semibold text-charcoal-900">
                                    プロフィール
                                </h2>
                            </div>

                            <div className="space-y-5">
                                <Input
                                    label="表示名"
                                    value={settings.displayName}
                                    onChange={(e) =>
                                        updateSetting('displayName', e.target.value)
                                    }
                                />

                                <Input
                                    label="メールアドレス"
                                    value={settings.email}
                                    disabled
                                    hint="メールアドレスは変更できません"
                                />

                                <div>
                                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                                        英語レベル
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {ENGLISH_LEVELS.map((level) => (
                                            <button
                                                key={level.value}
                                                onClick={() =>
                                                    updateSetting('englishLevel', level.value)
                                                }
                                                className={`p-3 rounded-xl border-2 text-center transition-all ${settings.englishLevel === level.value
                                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                        : 'border-cream-300 hover:border-cream-400 text-charcoal-700'
                                                    }`}
                                            >
                                                {level.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Notification Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card variant="default" padding="lg">
                        <CardContent>
                            <div className="flex items-center gap-3 mb-6">
                                <Bell className="w-5 h-5 text-charcoal-500" />
                                <h2 className="font-[var(--font-display)] text-xl font-semibold text-charcoal-900">
                                    通知
                                </h2>
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-charcoal-900">
                                            毎日のリマインダー
                                        </p>
                                        <p className="text-sm text-charcoal-500">
                                            学習を続けるためのリマインダー
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            updateSetting('dailyReminder', !settings.dailyReminder)
                                        }
                                        className={`relative w-14 h-8 rounded-full transition-colors ${settings.dailyReminder
                                                ? 'bg-primary-500'
                                                : 'bg-charcoal-300'
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${settings.dailyReminder ? 'translate-x-6' : ''
                                                }`}
                                        />
                                    </button>
                                </div>

                                {settings.dailyReminder && (
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal-700 mb-2">
                                            通知時刻
                                        </label>
                                        <input
                                            type="time"
                                            value={settings.reminderTime}
                                            onChange={(e) =>
                                                updateSetting('reminderTime', e.target.value)
                                            }
                                            className="w-full px-4 py-3 border-2 border-cream-300 rounded-xl focus:outline-none focus:border-primary-500"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Audio Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card variant="default" padding="lg">
                        <CardContent>
                            <div className="flex items-center gap-3 mb-6">
                                <Volume2 className="w-5 h-5 text-charcoal-500" />
                                <h2 className="font-[var(--font-display)] text-xl font-semibold text-charcoal-900">
                                    音声
                                </h2>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-charcoal-700">
                                        再生速度
                                    </label>
                                    <span className="text-sm font-mono text-charcoal-600">
                                        {settings.voiceSpeed}x
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={settings.voiceSpeed}
                                    onChange={(e) =>
                                        updateSetting('voiceSpeed', parseFloat(e.target.value))
                                    }
                                    className="w-full h-2 bg-cream-300 rounded-lg appearance-none cursor-pointer accent-primary-500"
                                />
                                <div className="flex justify-between text-xs text-charcoal-400 mt-1">
                                    <span>0.5x</span>
                                    <span>1.0x</span>
                                    <span>1.5x</span>
                                    <span>2.0x</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Theme Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card variant="default" padding="lg">
                        <CardContent>
                            <div className="flex items-center gap-3 mb-6">
                                <Palette className="w-5 h-5 text-charcoal-500" />
                                <h2 className="font-[var(--font-display)] text-xl font-semibold text-charcoal-900">
                                    テーマ
                                </h2>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {THEMES.map((theme) => (
                                    <button
                                        key={theme.value}
                                        onClick={() => updateSetting('theme', theme.value)}
                                        className={`p-4 rounded-xl border-2 text-center transition-all ${settings.theme === theme.value
                                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                : 'border-cream-300 hover:border-cream-400 text-charcoal-700'
                                            }`}
                                    >
                                        {theme.label}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Save Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-end"
                >
                    <Button onClick={handleSave} isLoading={isSaving} size="lg">
                        設定を保存
                    </Button>
                </motion.div>

                {/* Logout */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <button className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl text-red-600 transition-colors">
                        <div className="flex items-center gap-3">
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">ログアウト</span>
                        </div>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
