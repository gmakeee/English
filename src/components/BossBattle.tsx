import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useBoss } from '../context/BossContext';
import { useEffect, useState } from 'react';

const BOSS_EMOJIS = ['👾', '👹', '🤖', '🐲', '🧛'];

const BossBattle = () => {
    const { bossHP, isDefeated, resetBoss } = useBoss();
    const [bossEmoji, setBossEmoji] = useState(BOSS_EMOJIS[0]);
    const [showDamage, setShowDamage] = useState(false);
    const [lastHP, setLastHP] = useState(5);

    useEffect(() => {
        const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
        setBossEmoji(BOSS_EMOJIS[weekNum % BOSS_EMOJIS.length]);
    }, []);

    // Detect damage
    useEffect(() => {
        if (bossHP < lastHP) {
            setShowDamage(true);
            setTimeout(() => setShowDamage(false), 500);
        }
        setLastHP(bossHP);
    }, [bossHP, lastHP]);

    // Victory effect
    useEffect(() => {
        if (isDefeated) {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 }
            });
        }
    }, [isDefeated]);

    if (isDefeated) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/20 border-2 border-green-500 rounded-xl p-6 text-center"
            >
                <div className="text-5xl mb-3">🏆</div>
                <h3 className="text-xl font-bold text-green-500">Босс побеждён!</h3>
                <p className="text-sm text-tg-hint mb-4">+50 бонусных монет</p>
                <button
                    onClick={resetBoss}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium"
                >
                    Следующий босс
                </button>
            </motion.div>
        );
    }

    return (
        <div className="bg-tg-secondary-bg rounded-xl p-6 relative overflow-hidden border border-tg-hint/10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-red-500 font-black">БОСС НЕДЕЛИ</span>
                <span className="text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full">Еженедельно</span>
            </h3>

            <div className="flex justify-center items-center py-6 relative">
                <motion.div
                    animate={showDamage ? {
                        scale: [1, 1.3, 0.8, 1],
                        rotate: [0, -10, 10, 0]
                    } : {}}
                    transition={{ duration: 0.4 }}
                    className="text-8xl relative"
                >
                    {bossEmoji}
                    {showDamage && (
                        <motion.span
                            initial={{ opacity: 1, y: 0 }}
                            animate={{ opacity: 0, y: -40 }}
                            className="absolute -top-2 right-0 text-2xl font-black text-red-500"
                        >
                            -1
                        </motion.span>
                    )}
                </motion.div>
            </div>

            {/* HP Bar */}
            <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-red-500">HP</span>
                    <span className="text-sm font-bold">{bossHP}/5</span>
                </div>
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-red-500 to-red-600"
                        animate={{ width: `${(bossHP / 5) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 100 }}
                    />
                </div>
            </div>

            {/* HP Hearts */}
            <div className="flex justify-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <motion.span
                        key={i}
                        animate={{ scale: i < bossHP ? 1 : 0.7 }}
                        className={`text-xl ${i < bossHP ? '' : 'grayscale opacity-30'}`}
                    >
                        ❤️
                    </motion.span>
                ))}
            </div>

            <p className="text-center text-xs text-tg-hint">
                Отвечай правильно в квизе, чтобы нанести урон!
            </p>
        </div>
    );
};

export default BossBattle;
