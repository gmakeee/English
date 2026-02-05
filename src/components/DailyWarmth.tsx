import { useMemo } from 'react';
import { Heart } from 'lucide-react';

const MESSAGES = [
    "Лиза, ты умничка, у тебя всё получается!",
    "Твой английский становится perfect, как и ты сама ❤️",
    "Горжусь твоим прогрессом, Лиза!",
    "Самая красивая девушка в мире учит английский прямо сейчас!",
    "Ты делаешь этот мир лучше, просто будучи собой.",
    "Every day you get better and better!",
    "I believe in you, my love!",
];

const DailyWarmth = () => {
    const message = useMemo(() => {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        return MESSAGES[dayOfYear % MESSAGES.length];
    }, []);

    return (
        <div className="bg-pink-100 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-500/20 rounded-xl p-4 flex items-start gap-3">
            <Heart className="text-pink-500 fill-pink-500 shrink-0 mt-1" size={20} />
            <div>
                <h4 className="font-bold text-pink-700 dark:text-pink-300 text-sm mb-1">Message for Liza</h4>
                <p className="text-pink-900 dark:text-pink-100 font-medium italic text-lg leading-tight">
                    "{message}"
                </p>
            </div>
        </div>
    );
};

export default DailyWarmth;
