import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Zap, Check, X } from 'lucide-react';
import { WORDS_A2_B1, shuffleArray } from '../data/words';

interface SprintWord {
    word: string;
    translation: string;
    shown: string; // What we show as the "answer" (may be wrong)
    isCorrect: boolean;
}

const SprintGame = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [currentWord, setCurrentWord] = useState<SprintWord | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [highScore, setHighScore] = useState(0);

    const generateWord = useCallback(() => {
        const words = shuffleArray(WORDS_A2_B1);
        const word = words[0];
        const isCorrect = Math.random() > 0.5;

        let shown = word.translation;
        if (!isCorrect) {
            // Pick a random wrong translation
            const otherWords = words.filter(w => w.id !== word.id);
            shown = otherWords[Math.floor(Math.random() * otherWords.length)].translation;
        }

        setCurrentWord({
            word: word.word,
            translation: word.translation,
            shown,
            isCorrect,
        });
        setFeedback(null);
    }, []);

    useEffect(() => {
        let interval: number;
        if (isPlaying && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isPlaying) {
            setIsPlaying(false);
            if (score > highScore) {
                setHighScore(score);
            }
        }
        return () => window.clearInterval(interval);
    }, [isPlaying, timeLeft, score, highScore]);

    const startGame = () => {
        setIsPlaying(true);
        setTimeLeft(60);
        setScore(0);
        setCombo(0);
        generateWord();
    };

    const handleAnswer = (userSaysCorrect: boolean) => {
        if (!currentWord || feedback) return;

        const isRight = userSaysCorrect === currentWord.isCorrect;

        if (isRight) {
            const points = 10 + combo * 2;
            setScore(s => s + points);
            setCombo(c => c + 1);
            setFeedback('correct');

            if ((window as any).Telegram?.WebApp?.HapticFeedback) {
                (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }
        } else {
            setCombo(0);
            setFeedback('wrong');

            if ((window as any).Telegram?.WebApp?.HapticFeedback) {
                (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            }
        }

        setTimeout(() => {
            generateWord();
        }, 300);
    };

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <Zap className="fill-yellow-400 text-yellow-400" />
                        Спринт
                    </h3>
                    <p className="opacity-80 text-sm">Верно ли переведено слово?</p>
                </div>
                {isPlaying && (
                    <div className="flex gap-3 items-center">
                        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg font-mono text-xl font-bold flex items-center gap-2">
                            <Timer size={18} />
                            {timeLeft}с
                        </div>
                        {combo > 1 && (
                            <div className="bg-yellow-500 text-black px-2 py-1 rounded font-bold text-sm animate-pulse">
                                x{combo}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {!isPlaying ? (
                <div className="text-center py-8">
                    <p className="text-6xl font-black mb-2">{score}</p>
                    <p className="opacity-70 text-sm mb-2">Последний результат</p>
                    {highScore > 0 && (
                        <p className="text-yellow-300 text-sm mb-4">🏆 Рекорд: {highScore}</p>
                    )}
                    <button
                        onClick={startGame}
                        className="w-full bg-white text-indigo-600 font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform text-lg"
                    >
                        Начать спринт 🚀
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Current Word Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentWord?.word}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className={`relative rounded-xl p-6 text-center ${feedback === 'correct'
                                    ? 'bg-green-500'
                                    : feedback === 'wrong'
                                        ? 'bg-red-500'
                                        : 'bg-white/10 backdrop-blur-sm'
                                }`}
                        >
                            <p className="text-3xl font-bold mb-2">{currentWord?.word}</p>
                            <p className="text-xl opacity-90">= {currentWord?.shown}?</p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Score Display */}
                    <div className="text-center">
                        <span className="text-4xl font-black">{score}</span>
                        <span className="text-sm opacity-70 ml-2">очков</span>
                    </div>

                    {/* Answer Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAnswer(false)}
                            className="bg-red-500 hover:bg-red-600 py-6 rounded-xl font-bold text-xl flex items-center justify-center gap-2 shadow-lg"
                        >
                            <X size={28} />
                            Неверно
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAnswer(true)}
                            className="bg-green-500 hover:bg-green-600 py-6 rounded-xl font-bold text-xl flex items-center justify-center gap-2 shadow-lg"
                        >
                            <Check size={28} />
                            Верно
                        </motion.button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SprintGame;
