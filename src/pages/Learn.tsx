import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEconomy } from '../context/EconomyContext';
import BettingModal from '../components/BettingModal';
import SprintGame from '../components/SprintGame';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

// Sample words - in a real app, these would come from Supabase
const WORDS = [
    { id: 1, word: 'Serendipity', translation: 'Счастливая случайность', options: ['Счастливая случайность', 'Грусть', 'Злость', 'Радость'] },
    { id: 2, word: 'Ephemeral', translation: 'Мимолётный', options: ['Вечный', 'Мимолётный', 'Большой', 'Маленький'] },
    { id: 3, word: 'Resilience', translation: 'Стойкость', options: ['Слабость', 'Красота', 'Стойкость', 'Скорость'] },
    { id: 4, word: 'Eloquent', translation: 'Красноречивый', options: ['Тихий', 'Красноречивый', 'Грустный', 'Злой'] },
    { id: 5, word: 'Whimsical', translation: 'Причудливый', options: ['Скучный', 'Серьёзный', 'Причудливый', 'Простой'] },
];

const Learn = () => {
    const { updateBalance } = useEconomy();
    const [showBetting, setShowBetting] = useState(true);
    const [currentBet, setCurrentBet] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [isQuizComplete, setIsQuizComplete] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);

    const currentWord = WORDS[currentWordIndex];
    const totalQuestions = WORDS.length;

    const handleBetConfirm = async (amount: number) => {
        setCurrentBet(amount);
        await updateBalance(-amount);
        setShowBetting(false);
    };

    const handleSkipBet = () => {
        setShowBetting(false);
    };

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setShowResult(true);

        const isCorrect = answer === currentWord.translation;

        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
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
            if (currentWordIndex < totalQuestions - 1) {
                setCurrentWordIndex(prev => prev + 1);
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
                // Perfect score - double the bet!
                const winnings = currentBet * 2;
                await updateBalance(winnings);
                confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
                toast.success(`Идеально! +${winnings} 🪙`);
            } else {
                // Lost the bet
                toast.error(`Ставка сгорела! -${currentBet} 🪙`);
            }
        }
    };

    const restartQuiz = () => {
        setCurrentWordIndex(0);
        setCorrectAnswers(0);
        setWrongAnswers(0);
        setIsQuizComplete(false);
        setShowBetting(true);
        setCurrentBet(0);
        setSelectedAnswer(null);
        setShowResult(false);
    };

    if (isQuizComplete) {
        const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
        return (
            <div className="space-y-6">
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
                        <div className="bg-green-500/10 p-3 rounded-xl">
                            <p className="text-2xl font-bold text-green-500">{correctAnswers}</p>
                            <p className="text-xs text-tg-hint">Правильно</p>
                        </div>
                        <div className="bg-red-500/10 p-3 rounded-xl">
                            <p className="text-2xl font-bold text-red-500">{wrongAnswers}</p>
                            <p className="text-xs text-tg-hint">Ошибки</p>
                        </div>
                        <div className="bg-blue-500/10 p-3 rounded-xl">
                            <p className="text-2xl font-bold text-blue-500">{accuracy}%</p>
                            <p className="text-xs text-tg-hint">Точность</p>
                        </div>
                    </div>

                    <button
                        onClick={restartQuiz}
                        className="w-full bg-tg-button text-white py-3 rounded-xl font-bold"
                    >
                        Начать заново
                    </button>
                </motion.div>

                <SprintGame />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <BettingModal
                isOpen={showBetting}
                onClose={handleSkipBet}
                onConfirm={handleBetConfirm}
            />

            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Квиз</h1>
                    <p className="text-tg-hint text-sm">Вопрос {currentWordIndex + 1} из {totalQuestions}</p>
                </div>
                {currentBet > 0 && (
                    <div className="bg-yellow-500/20 text-yellow-600 px-3 py-1 rounded-full text-sm font-bold">
                        Ставка: {currentBet} 🪙
                    </div>
                )}
            </header>

            {/* Progress bar */}
            <div className="w-full h-2 bg-tg-secondary-bg rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-tg-button"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentWordIndex + 1) / totalQuestions) * 100}%` }}
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

                    let buttonClass = "p-4 rounded-xl font-medium transition-all border-2 ";

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
                            onClick={() => !showResult && handleAnswer(option)}
                            disabled={showResult}
                            className={buttonClass}
                        >
                            {option}
                        </motion.button>
                    );
                })}
            </div>

            {/* Score indicator */}
            <div className="flex justify-center gap-2">
                {Array.from({ length: totalQuestions }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i < currentWordIndex
                            ? 'bg-green-500'
                            : i === currentWordIndex
                                ? 'bg-tg-button'
                                : 'bg-tg-hint/30'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Learn;
