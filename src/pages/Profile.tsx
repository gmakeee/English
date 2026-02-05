import { useState, useEffect } from 'react';
import { useEconomy } from '../context/EconomyContext';
import { useUser } from '../context/UserContext';
import DevTools from '../components/DevTools';
import WeeklyStats from '../components/WeeklyStats';
import { getUserStatsSummary } from '../lib/wordStats';

const Profile = () => {
    const { balance } = useEconomy();
    const { firstName, isCuteMode, userId, streak, user, isDevMode } = useUser();
    const [stats, setStats] = useState({ learnedWords: 0, accuracy: 0, totalWords: 0 });

    useEffect(() => {
        if (userId) {
            getUserStatsSummary(userId).then(setStats);
        }
    }, [userId]);

    // Choose avatar based on mode
    const avatarEmoji = isCuteMode ? '👸' : '🎓';
    const subtitle = isCuteMode ? 'Королева английского' : 'Изучаю английский';

    return (
        <div className="space-y-6 pb-24">
            <h1 className="text-2xl font-bold">Профиль</h1>

            <div className="bg-tg-secondary-bg p-6 rounded-xl space-y-4 border border-[--tg-theme-hint-color]/10">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-3xl">
                        {avatarEmoji}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{firstName}</h2>
                        <p className="text-tg-hint text-sm">{subtitle}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-tg-secondary-bg p-4 rounded-xl text-center border border-[--tg-theme-hint-color]/10">
                    <p className="text-3xl font-bold">{balance}</p>
                    <p className="text-tg-hint text-sm">LingoCoins 🪙</p>
                </div>
                <div className="bg-tg-secondary-bg p-4 rounded-xl text-center border border-[--tg-theme-hint-color]/10">
                    <p className="text-3xl font-bold">{streak}</p>
                    <p className="text-tg-hint text-sm">Дней подряд 🔥</p>
                </div>
            </div>

            <div className="bg-tg-secondary-bg p-4 rounded-xl border border-[--tg-theme-hint-color]/10">
                <h3 className="font-bold mb-3">Достижения</h3>
                <div className="flex gap-3 flex-wrap">
                    <span className="text-3xl" title="Первая победа">🏆</span>
                    <span className="text-3xl" title="5 дней подряд">🔥</span>
                    <span className="text-3xl" title="100 слов">📚</span>
                    <span className="text-3xl opacity-30" title="Заблокировано">🔒</span>
                    <span className="text-3xl opacity-30" title="Заблокировано">🔒</span>
                </div>
            </div>

            {/* Weekly Activity Chart */}
            <WeeklyStats />

            <div className="bg-tg-secondary-bg p-4 rounded-xl border border-[--tg-theme-hint-color]/10">
                <h3 className="font-bold mb-3">Статистика</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-tg-hint">Слов изучено</span>
                        <span className="font-medium">{stats.learnedWords}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-tg-hint">Точность ответов</span>
                        <span className="font-medium">{stats.accuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-tg-hint">Боссов повержено</span>
                        <span className="font-medium">3</span>
                    </div>
                </div>
            </div>

            {/* DEV Tools - only shown for DEV mode users */}
            <DevTools />

            {/* Debug Info for User Feedback */}
            <div className="mt-8 p-4 bg-black/5 rounded-lg text-xs font-mono text-tg-hint break-all">
                <p>Debug Info:</p>
                <p>ID: {userId || 'null'}</p>
                <p>Username: {user?.username || 'undefined'}</p>
                <p>Dev: {isDevMode ? 'YES' : 'NO'}</p>
                <p>Cute: {isCuteMode ? 'YES' : 'NO'}</p>
                <p>Streak: {streak}</p>
            </div>
        </div>
    );
};

export default Profile;
