import WordOfDay from '../components/WordOfDay';
import BossBattle from '../components/BossBattle';
import DailyWarmth from '../components/DailyWarmth';
import toast from 'react-hot-toast';
import { useEconomy } from '../context/EconomyContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const { balance } = useEconomy();

    const handleEasterEgg = () => {
        if ((window as any).Telegram?.WebApp?.HapticFeedback) {
            (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
        toast("Вау! 5 тапов! Ты самая лучшая! ❤️✨🌟", {
            duration: 5000,
            icon: '🎉'
        });
    };

    return (
        <div className="space-y-6 pb-24">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Привет, Лиза! ❤️</h1>
                    <p className="text-tg-hint text-sm">Готова учиться?</p>
                </div>
                <div className="bg-tg-secondary-bg px-3 py-1 rounded-full text-sm font-medium">
                    {balance} 🪙
                </div>
            </header>

            <DailyWarmth />

            <WordOfDay
                word="Serendipity"
                translation="Счастливая случайность"
                example="Finding you was pure serendipity."
                onEasterEggTrigger={handleEasterEgg}
            />

            <Link to="/learn" className="block">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl text-white shadow-lg hover:scale-[1.02] transition-transform">
                    <p className="text-sm opacity-80">Ежедневный квиз</p>
                    <p className="text-xl font-bold">Начать обучение →</p>
                </div>
            </Link>

            <BossBattle />

            <div className="bg-tg-secondary-bg p-4 rounded-xl shadow-sm">
                <p className="text-tg-hint text-sm">Цель на сегодня</p>
                <p className="text-xl font-semibold">Выучить 10 новых слов</p>
                <div className="mt-3">
                    <div className="flex justify-between text-xs text-tg-hint mb-1">
                        <span>Прогресс</span>
                        <span>0 / 10</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: '0%' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
