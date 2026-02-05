import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const BOSS_EMOJIS = ['👾', '👹', '🤖', '🐲', '🧛'];

const BossBattle = () => {
    const [hp, setHp] = useState(5);
    const [isDefeated, setIsDefeated] = useState(false);
    const [bossEmoji, setBossEmoji] = useState(BOSS_EMOJIS[0]);

    useEffect(() => {
        const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
        setBossEmoji(BOSS_EMOJIS[weekNum % BOSS_EMOJIS.length]);
    }, []);

    const handleHit = () => {
        if (isDefeated) return;

        const newHp = hp - 1;
        setHp(newHp);

        if (newHp === 0) {
            setIsDefeated(true);
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 }
            });
        }
    };

    if (isDefeated) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/50 rounded-xl p-6 text-center"
            >
                <div className="text-4xl mb-2">🏆</div>
                <h3 className="text-xl font-bold text-green-500">Босс побеждён!</h3>
                <p className="text-sm opacity-80">+50 бонусных монет</p>
            </motion.div>
        );
    }

    return (
        <div className="bg-tg-secondary-bg rounded-xl p-6 relative overflow-hidden">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-red-500 font-black">БОСС НЕДЕЛИ</span>
                <span className="text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full">Еженедельно</span>
            </h3>

            <div className="flex justify-center items-center py-8 relative">
                <motion.div
                    key={hp}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 0.9, 1] }}
                    transition={{ duration: 0.3 }}
                    className="text-8xl cursor-pointer"
                    onClick={handleHit}
                >
                    {bossEmoji}
                </motion.div>

                <span className="absolute -top-2 right-10 text-4xl font-black text-red-500/20">
                    {hp}/5
                </span>
            </div>

            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-red-500"
                    initial={{ width: '100%' }}
                    animate={{ width: `${(hp / 5) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 100 }}
                />
            </div>

            <p className="text-center text-xs text-tg-hint mt-3">
                Ответь правильно 5 раз подряд, чтобы победить!
            </p>
        </div>
    );
};

export default BossBattle;
