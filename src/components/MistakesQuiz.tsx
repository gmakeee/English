import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, AlertTriangle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import SpeakerButton from '../components/SpeakerButton';
import { getMistakeWords, recordAnswer } from '../lib/wordStats';
import { WORDS_A2_B1 } from '../data/words';
import type { Word } from '../data/words';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

interface MistakesQuizProps {
    onBack: () => void;
}

const MistakesQuiz = ({ onBack }: MistakesQuizProps) => {
    const { userId } = useUser();
    const [words, setWords] = useState<Word[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [answerResults, setAnswerResults] = useState<boolean[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isQuizComplete, setIsQuizComplete] = useState(false);
    const [noMistakes, setNoMistakes] = useState(false);

    useEffect(() => {
        async function fetchMistakeWords() {
            if (!userId) {
                setNoMistakes(true);
                setIsLoading(false);
                return;
            }

            const stats = await getMistakeWords(userId, 10);
            if (stats.length === 0) {
                setNoMistakes(true);
                setIsLoading(false);
                return;
            }

            const wordIds = new Set(stats.map(s => s.word_id));
            const mistakeWords = WORDS_A2_B1.filter(w => wordIds.has(w.id));

            // Shuffle options for each word
            const shuffledWords = mistakeWords.map(word => ({
                ...word,
                options: [...word.options].sort(() => Math.random() - 0.5)
            }));

            setWords(shuffledWords);
            setIsLoading(false);
        }

        fetchMistakeWords();
    }, [userId]);

    const handleAnswer = (answer: string) => {
        if (showResult || words.length === 0) return;

        setSelectedAnswer(answer);
        setShowResult(true);

        const isCorrect = answer === words[currentIndex].translation;
        setAnswerResults(prev => [...prev, isCorrect]);

        // Record answer
        if (userId) {
            recordAnswer(userId, words[currentIndex].id, isCorrect).catch(console.error);
        }

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
            if (currentIndex < words.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setShowResult(false);
            } else {
                finishQuiz();
            }
        }, 1000);
    };

    const finishQuiz = () => {
        setIsQuizComplete(true);
        const accuracy = Math.round((correctAnswers / words.length) * 100);

        if (accuracy >= 80) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            toast.success('Отлично! Ты исправляешь ошибки! 🎉');
        }
    };

    const restartQuiz = () => {
        setCurrentIndex(0);
        setCorrectAnswers(0);
        setWrongAnswers(0);
        setAnswerResults([]);
        setSelectedAnswer(null);
        setShowResult(false);
        setIsQuizComplete(false);

        // Reshuffle options
        setWords(prev => prev.map(word => ({
            ...word,
            options: [...word.options].sort(() => Math.random() - 0.5)
        })));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tg-button"></div>
            </div>
        );
    }

    if (noMistakes) {
        return (
            <div className="space-y-6 pb-24">
                <button onClick={onBack} className="flex items-center gap-2 text-tg-hint">
                    <ArrowLeft size={20} />
                    Назад
                </button>

                <div className="bg-tg-secondary-bg rounded-2xl p-8 text-center">
                    <div className="text-6xl mb-4">🏆</div>
                    <h2 className="text-xl font-bold mb-2">Нет ошибок!</h2>
                    <p className="text-tg-hint">
                        Ты пока не делал ошибок или уже всё исправил!<br />
                        Продолжай решать квизы.
                    </p>
                </div>
            </div>
        );
    }

    if (isQuizComplete) {
        const accuracy = Math.round((correctAnswers / words.length) * 100);
        return (
            <div className="space-y-6 pb-24">
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
                        {accuracy >= 80 ? '🎉' : accuracy >= 50 ? '💪' : '📚'}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Работа над ошибками!</h2>
                    <p className="text-tg-hint mb-6">
                        {accuracy >= 80 ? 'Супер результат!' : 'Продолжай практиковаться!'}
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
                        Ещё раз
                    </button>
                </motion.div>
            </div>
        );
    }

    const currentWord = words[currentIndex];
    if (!currentWord) return null;

    return (
        <div className="space-y-6 pb-24">
            <div className="flex justify-between items-center">
                <button onClick={onBack} className="flex items-center gap-2 text-tg-hint">
                    <ArrowLeft size={20} />
                    Назад
                </button>
            </div>

            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <AlertTriangle className="text-orange-500" />
                    Работа над ошибками
                </h1>
                <p className="text-tg-hint text-sm">Вопрос {currentIndex + 1} из {words.length}</p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-tg-secondary-bg rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-orange-500"
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
                    className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center"
                >
                    <div className="relative">
                        <p className="text-sm opacity-70 uppercase tracking-wider mb-2">Переведи слово</p>
                        <h2 className="text-4xl font-bold mb-4">{currentWord.word}</h2>
                        <SpeakerButton text={currentWord.word} className="bg-white/20 hover:bg-white/30 text-white mx-auto" />
                    </div>
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
                        buttonClass += "bg-tg-secondary-bg border-transparent hover:border-orange-500 active:scale-95";
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

            {/* Progress dots */}
            <div className="flex justify-center gap-2">
                {Array.from({ length: words.length }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all ${i < answerResults.length
                            ? answerResults[i]
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            : i === currentIndex
                                ? 'bg-orange-500 scale-125'
                                : 'bg-tg-hint/30'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default MistakesQuiz;
