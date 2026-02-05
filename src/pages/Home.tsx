import WordOfDay from '../components/WordOfDay';
import BossBattle from '../components/BossBattle';
import DailyWarmth from '../components/DailyWarmth';
import toast from 'react-hot-toast';

const Home = () => {
    const handleEasterEgg = () => {
        if ((window as any).Telegram?.WebApp?.HapticFeedback) {
            (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
        toast("Wow! 5 Taps! I love you so much! ❤️❤️❤️", {
            duration: 5000,
            icon: '🎉'
        });
    };

    return (
        <div className="space-y-6 pb-24">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Hello, Liza! ❤️</h1>
                    <p className="text-tg-hint text-sm">Ready to learn?</p>
                </div>
                <div className="bg-tg-secondary-bg px-3 py-1 rounded-full text-sm font-medium">
                    100 🪙
                </div>
            </header>

            <DailyWarmth />

            <WordOfDay
                word="Serendipity"
                translation="Интуитивная прозорливость"
                example="Finding you was pure serendipity."
                onEasterEggTrigger={handleEasterEgg}
            />

            <BossBattle />

            <div className="bg-tg-secondary-bg p-4 rounded-xl shadow-sm">
                <p className="text-tg-hint text-sm">Today's goal</p>
                <p className="text-xl font-semibold">Learn 10 new words</p>
            </div>
        </div>
    );
};

export default Home;
