import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Check, X } from 'lucide-react';
import { getRandomSentences } from '../data/words';
import type { SentenceGap } from '../data/words';

const FillGapGame = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [sentences, setSentences] = useState<SentenceGap[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    const startGame = () => {
        setSentences(getRandomSentences(10));
        setCurrentIndex(0);
        setScore(0);
        setIsPlaying(true);
        setIsComplete(false);
    };

    const handleAnswer = (answer: string) => {
        if (showResult) return;

        setSelectedAnswer(answer);
        setShowResult(true);

        const isCorrect = answer === sentences[currentIndex].correctWord;
        if (isCorrect) {
            setScore(s => s + 1);
            if ((window as any).Telegram?.WebApp?.HapticFeedback) {
                (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
        } else {
            if ((window as any).Telegram?.WebApp?.HapticFeedback) {
                (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            }
        }

        setTimeout(() => {
            if (currentIndex < sentences.length - 1) {
                setCurrentIndex(i => i + 1);
                setShowResult(false);
                setSelectedAnswer(null);
            } else {
                setIsComplete(true);
                setIsPlaying(false);
            }
        }, 1000);
    };

    const currentSentence = sentences[currentIndex];

    if (isComplete) {
        const percentage = Math.round((score / sentences.length) * 100);
        return (
            <div className="bg-tg-secondary-bg rounded-2xl p-6 text-center">
                <div className="text-6xl mb-4">
                    {percentage >= 80 ? '🏆' : percentage >= 50 ? '👍' : '📚'}
                </div>
                <h3 className="text-2xl font-bold mb-2">Результат</h3>
                <p className="text-4xl font-black text-tg-button mb-2">{score} / {sentences.length}</p>
                <p className="text-tg-hint mb-6">{percentage}% правильно</p>
                <button
                    onClick={startGame}
                    className="w-full bg-tg-button text-white py-3 rounded-xl font-bold"
                >
                    Играть снова
                </button>
            </div>
        );
    }

    if (!isPlaying) {
        return (
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                    <BookOpen size={28} />
                    <h3 className="text-2xl font-bold">Контекст</h3>
                </div>
                <p className="opacity-80 mb-6">Выбери правильное слово для предложения</p>
                <button
                    onClick={startGame}
                    className="w-full bg-white text-emerald-600 font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
                >
                    Начать игру 📝
                </button>
            </div>
        );
    }

    return (
        <div className="bg-tg-secondary-bg rounded-2xl p-6 shadow-lg">
            {/* Progress */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-tg-hint">Вопрос {currentIndex + 1} / {sentences.length}</span>
                <span className="text-sm font-bold text-green-500">✓ {score}</span>
            </div>

            <div className="w-full h-2 bg-tg-bg rounded-full overflow-hidden mb-6">
                <motion.div
                    className="h-full bg-emerald-500"
                    animate={{ width: `${((currentIndex + 1) / sentences.length) * 100}%` }}
                />
            </div>

            {/* Sentence */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-tg-bg p-4 rounded-xl mb-6"
                >
                    <p className="text-lg leading-relaxed">
                        {currentSentence?.sentence.split('___').map((part, i, arr) => (
                            <span key={i}>
                                {part}
                                {i < arr.length - 1 && (
                                    <span className="inline-block bg-emerald-500 text-white px-3 py-1 rounded-lg mx-1 font-bold">
                                        {showResult ? currentSentence.correctWord : '???'}
                                    </span>
                                )}
                            </span>
                        ))}
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
                {currentSentence?.options.map((option, index) => {
                    const isCorrect = option === currentSentence.correctWord;
                    const isSelected = selectedAnswer === option;

                    let className = "p-4 rounded-xl font-medium transition-all border-2 flex items-center justify-center gap-2 ";

                    if (showResult) {
                        if (isCorrect) {
                            className += "bg-green-500 text-white border-green-500";
                        } else if (isSelected && !isCorrect) {
                            className += "bg-red-500 text-white border-red-500";
                        } else {
                            className += "bg-tg-bg border-transparent opacity-50";
                        }
                    } else {
                        className += "bg-tg-bg border-transparent hover:border-emerald-500 active:scale-95";
                    }

                    return (
                        <motion.button
                            key={index}
                            whileTap={{ scale: showResult ? 1 : 0.95 }}
                            onClick={() => handleAnswer(option)}
                            disabled={showResult}
                            className={className}
                        >
                            {showResult && isCorrect && <Check size={18} />}
                            {showResult && isSelected && !isCorrect && <X size={18} />}
                            {option}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default FillGapGame;
