import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEconomy } from '../context/EconomyContext';
import { useBoss } from '../context/BossContext';
import BettingModal from '../components/BettingModal';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { getRandomWords } from '../data/words';
import type { Word } from '../data/words';
import { ArrowLeft, Check, X } from 'lucide-react';

interface QuizGameProps {
    onBack: () => void;
}

const QuizGame = ({ onBack }: QuizGameProps) => {
    const { updateBalance } = useEconomy();
    const { damageBoss } = useBoss();
    const [showBetting, setShowBetting] = useState(true);
    const [currentBet, setCurrentBet] = useState(0);
    const [words, setWords] = useState<Word[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [answerResults, setAnswerResults] = useState<boolean[]>([]);
    const [isQuizComplete, setIsQuizComplete] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);

    const startQuiz = () => {
        setWords(getRandomWords(5));
        setCurrentIndex(0);
        setCorrectAnswers(0);
        setWrongAnswers(0);
        setAnswerResults([]);
        setIsQuizComplete(false);
    };

    const handleBetConfirm = async (amount: number) => {
        setCurrentBet(amount);
        await updateBalance(-amount);
        setShowBetting(false);
        startQuiz();
    };

    const handleSkipBet = () => {
        setShowBetting(false);
        startQuiz();
    };

    const handleAnswer = (answer: string) => {
        if (showResult) return;

        setSelectedAnswer(answer);
        setShowResult(true);

        const isCorrect = answer === words[currentIndex].translation;
        setAnswerResults(prev => [...prev, isCorrect]);

        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
            damageBoss(); // Damage boss on correct answer!
            if ((window as any).Telegram?.WebApp?.HapticFeedback) {
                (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
        } else {
            setWrongAnswers(prev => prev + 1);
            if ((window as any).Telegram?.WebApp?.HapticFeedback) {
                (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            }
        }

        setTimeout(() => {
            if (currentIndex < words.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setShowResult(false);
            } else {
                finishQuiz();
            }
        }, 1000);
    };

    const finishQuiz = async () => {
        setIsQuizComplete(true);

        if (currentBet > 0) {
            if (wrongAnswers === 0) {
                const winnings = currentBet * 2;
                await updateBalance(winnings);
                confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
                toast.success(`Идеально! +${winnings} 🪙`);
            } else {
                toast.error(`Ставка сгорела! -${currentBet} 🪙`);
            }
        }
    };

    const restartQuiz = () => {
        setShowBetting(true);
        setCurrentBet(0);
        setSelectedAnswer(null);
        setShowResult(false);
    };

    if (showBetting) {
        return (
            <>
                <button onClick={onBack} className="flex items-center gap-2 text-tg-hint mb-4">
                    <ArrowLeft size={20} />
                    Назад
                </button>
                <BettingModal
                    isOpen={true}
                    onClose={handleSkipBet}
                    onConfirm={handleBetConfirm}
                />
            </>
        );
    }

    if (isQuizComplete) {
        const accuracy = Math.round((correctAnswers / words.length) * 100);
        return (
            <div className="space-y-6">
                <button onClick={onBack} className="flex items-center gap-2 text-tg-hint">
                    <ArrowLeft size={20} />
                    Назад
                </button>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-tg-secondary-bg rounded-2xl p-8 text-center"
                >
                    <div className="text-6xl mb-4">
                        {wrongAnswers === 0 ? '🏆' : accuracy >= 70 ? '🎉' : '📚'}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Квиз завершён!</h2>
                    <p className="text-tg-hint mb-6">
                        {wrongAnswers === 0
                            ? 'Идеально! Ты невероятная! ✨'
                            : accuracy >= 70
                                ? 'Отличный результат! Продолжай!'
                                : 'Практика делает мастера!'}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-green-500/20 p-3 rounded-xl">
                            <p className="text-2xl font-bold text-green-500">{correctAnswers}</p>
                            <p className="text-xs text-tg-hint">Правильно</p>
                        </div>
                        <div className="bg-red-500/20 p-3 rounded-xl">
                            <p className="text-2xl font-bold text-red-500">{wrongAnswers}</p>
                            <p className="text-xs text-tg-hint">Ошибки</p>
                        </div>
                        <div className="bg-blue-500/20 p-3 rounded-xl">
                            <p className="text-2xl font-bold text-blue-500">{accuracy}%</p>
                            <p className="text-xs text-tg-hint">Точность</p>
                        </div>
                    </div>

                    <button
                        onClick={restartQuiz}
                        className="w-full bg-tg-button text-white py-3 rounded-xl font-bold"
                    >
                        Играть снова
                    </button>
                </motion.div>
            </div>
        );
    }

    const currentWord = words[currentIndex];
    if (!currentWord) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <button onClick={onBack} className="flex items-center gap-2 text-tg-hint">
                    <ArrowLeft size={20} />
                    Назад
                </button>
                {currentBet > 0 && (
                    <div className="bg-yellow-500/20 text-yellow-600 px-3 py-1 rounded-full text-sm font-bold">
                        Ставка: {currentBet} 🪙
                    </div>
                )}
            </div>

            <div>
                <h1 className="text-2xl font-bold">Квиз</h1>
                <p className="text-tg-hint text-sm">Вопрос {currentIndex + 1} из {words.length}</p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-tg-secondary-bg rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-tg-button"
                    animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
                />
            </div>

            {/* Word Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentWord.id}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    className="bg-gradient-to-br from-tg-button to-blue-600 rounded-2xl p-8 text-white text-center"
                >
                    <p className="text-sm opacity-70 uppercase tracking-wider mb-2">Переведи слово</p>
                    <h2 className="text-4xl font-bold">{currentWord.word}</h2>
                </motion.div>
            </AnimatePresence>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-3">
                {currentWord.options.map((option, index) => {
                    const isCorrect = option === currentWord.translation;
                    const isSelected = selectedAnswer === option;

                    let buttonClass = "p-4 rounded-xl font-medium transition-all border-2 flex items-center justify-center gap-2 ";

                    if (showResult) {
                        if (isCorrect) {
                            buttonClass += "bg-green-500 text-white border-green-500";
                        } else if (isSelected && !isCorrect) {
                            buttonClass += "bg-red-500 text-white border-red-500";
                        } else {
                            buttonClass += "bg-tg-secondary-bg border-transparent opacity-50";
                        }
                    } else {
                        buttonClass += "bg-tg-secondary-bg border-transparent hover:border-tg-button active:scale-95";
                    }

                    return (
                        <motion.button
                            key={index}
                            whileTap={{ scale: showResult ? 1 : 0.95 }}
                            onClick={() => handleAnswer(option)}
                            disabled={showResult}
                            className={buttonClass}
                        >
                            {showResult && isCorrect && <Check size={18} />}
                            {showResult && isSelected && !isCorrect && <X size={18} />}
                            {option}
                        </motion.button>
                    );
                })}
            </div>

            {/* Progress dots with correct/wrong colors */}
            <div className="flex justify-center gap-2">
                {Array.from({ length: words.length }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all ${i < answerResults.length
                            ? answerResults[i]
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            : i === currentIndex
                                ? 'bg-tg-button scale-125'
                                : 'bg-tg-hint/30'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default QuizGame;
