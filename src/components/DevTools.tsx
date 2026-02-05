import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, BarChart3, RefreshCw, AlertTriangle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { clearUserStats, clearAllStats, getUserStatsSummary } from '../lib/wordStats';
import toast from 'react-hot-toast';

const DevTools = () => {
    const { userId, isDevMode, username } = useUser();
    const [stats, setStats] = useState<{ totalWords: number; learnedWords: number; accuracy: number } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Only render for DEV mode users
    if (!isDevMode) {
        return null;
    }

    const handleLoadStats = async () => {
        if (!userId) return;
        setIsLoading(true);
        const summary = await getUserStatsSummary(userId);
        setStats(summary);
        setIsLoading(false);
    };

    const handleClearMyStats = async () => {
        if (!userId) return;

        if (!window.confirm('Очистить свою статистику? Это действие нельзя отменить.')) {
            return;
        }

        setIsLoading(true);
        const success = await clearUserStats(userId);
        setIsLoading(false);

        if (success) {
            toast.success('Статистика очищена');
            setStats(null);
        } else {
            toast.error('Ошибка очистки');
        }
    };

    const handleClearAllStats = async () => {
        if (!window.confirm('⚠️ ВНИМАНИЕ! Очистить ВСЮ статистику ВСЕХ пользователей? Это действие нельзя отменить!')) {
            return;
        }

        if (!window.confirm('Вы уверены? Это удалит ВСЕ данные обучения ВСЕХ пользователей!')) {
            return;
        }

        setIsLoading(true);
        const success = await clearAllStats();
        setIsLoading(false);

        if (success) {
            toast.success('Вся статистика очищена');
            setStats(null);
        } else {
            toast.error('Ошибка очистки');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-xl p-4 border border-purple-500/30"
        >
            <div className="flex items-center gap-2 mb-4">
                <span className="text-purple-400 font-mono text-xs bg-purple-500/20 px-2 py-1 rounded">DEV</span>
                <h3 className="font-bold text-purple-200">Developer Tools</h3>
            </div>

            <div className="text-xs text-purple-300/70 mb-4">
                @{username} • ID: {userId || 'N/A'}
            </div>

            {/* Stats Display */}
            {stats && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-purple-500/20 p-2 rounded-lg text-center">
                        <p className="text-lg font-bold text-purple-200">{stats.totalWords}</p>
                        <p className="text-xs text-purple-300/70">Слов</p>
                    </div>
                    <div className="bg-green-500/20 p-2 rounded-lg text-center">
                        <p className="text-lg font-bold text-green-200">{stats.learnedWords}</p>
                        <p className="text-xs text-green-300/70">Выучено</p>
                    </div>
                    <div className="bg-blue-500/20 p-2 rounded-lg text-center">
                        <p className="text-lg font-bold text-blue-200">{stats.accuracy}%</p>
                        <p className="text-xs text-blue-300/70">Точность</p>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
                <button
                    onClick={handleLoadStats}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-purple-500/30 hover:bg-purple-500/40 text-purple-200 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                    <BarChart3 size={16} />
                    <span>Загрузить статистику</span>
                </button>

                <button
                    onClick={handleClearMyStats}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-orange-500/30 hover:bg-orange-500/40 text-orange-200 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={16} />
                    <span>Очистить мою статистику</span>
                </button>

                <button
                    onClick={handleClearAllStats}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-red-500/30 hover:bg-red-500/40 text-red-200 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                    <Trash2 size={16} />
                    <span>Очистить ВСЮ БД</span>
                    <AlertTriangle size={14} className="text-red-400" />
                </button>
            </div>
        </motion.div>
    );
};

export default DevTools;
