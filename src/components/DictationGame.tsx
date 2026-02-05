import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Volume2, Check, X, RotateCcw } from 'lucide-react';
import { getRandomDictationWords } from '../data/words';

const DictationGame = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [words, setWords] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const startGame = () => {
        setWords(getRandomDictationWords(10));
        setCurrentIndex(0);
        setScore(0);
        setIsPlaying(true);
        setIsComplete(false);
        setUserInput('');
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const speakWord = () => {
        const word = words[currentIndex];
        if (!word) return;

        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8; // Slightly slower for clarity
        window.speechSynthesis.speak(utterance);

        if ((window as any).Telegram?.WebApp?.HapticFeedback) {
            (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    };

    const checkAnswer = () => {
        const correct = userInput.trim().toLowerCase() === words[currentIndex].toLowerCase();
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
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
            if (currentIndex < words.length - 1) {
                setCurrentIndex(i => i + 1);
                setShowResult(false);
                setUserInput('');
                inputRef.current?.focus();
            } else {
                setIsComplete(true);
                setIsPlaying(false);
            }
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !showResult && userInput.trim()) {
            checkAnswer();
        }
    };

    if (isComplete) {
        const percentage = Math.round((score / words.length) * 100);
        return (
            <div className="bg-tg-secondary-bg rounded-2xl p-6 text-center">
                <div className="text-6xl mb-4">
                    {percentage >= 80 ? '🎧' : percentage >= 50 ? '👂' : '📚'}
                </div>
                <h3 className="text-2xl font-bold mb-2">Результат</h3>
                <p className="text-4xl font-black text-tg-button mb-2">{score} / {words.length}</p>
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
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                    <Headphones size={28} />
                    <h3 className="text-2xl font-bold">Диктант</h3>
                </div>
                <p className="opacity-80 mb-6">Услышь слово и напиши его правильно</p>
                <button
                    onClick={startGame}
                    className="w-full bg-white text-orange-600 font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
                >
                    Начать диктант 🎧
                </button>
            </div>
        );
    }

    return (
        <div className="bg-tg-secondary-bg rounded-2xl p-6 shadow-lg">
            {/* Progress */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-tg-hint">Слово {currentIndex + 1} / {words.length}</span>
                <span className="text-sm font-bold text-green-500">✓ {score}</span>
            </div>

            <div className="w-full h-2 bg-tg-bg rounded-full overflow-hidden mb-6">
                <motion.div
                    className="h-full bg-orange-500"
                    animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
                />
            </div>

            {/* Speak Button */}
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={speakWord}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-2xl mb-6 flex flex-col items-center gap-3 shadow-lg"
            >
                <Volume2 size={48} className="animate-pulse" />
                <span className="font-bold text-lg">Нажми, чтобы услышать</span>
            </motion.button>

            {/* Input */}
            <div className="relative mb-4">
                <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={showResult}
                    placeholder="Напиши услышанное слово..."
                    className={`w-full p-4 rounded-xl text-lg font-medium border-2 transition-all bg-tg-bg ${showResult
                            ? isCorrect
                                ? 'border-green-500 bg-green-500/10'
                                : 'border-red-500 bg-red-500/10'
                            : 'border-transparent focus:border-orange-500'
                        }`}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                />
                {showResult && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'
                            }`}
                    >
                        {isCorrect ? <Check size={20} className="text-white" /> : <X size={20} className="text-white" />}
                    </motion.div>
                )}
            </div>

            {/* Show correct answer if wrong */}
            {showResult && !isCorrect && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-tg-hint mb-4"
                >
                    Правильно: <span className="font-bold text-orange-500">{words[currentIndex]}</span>
                </motion.p>
            )}

            {/* Submit Button */}
            {!showResult && (
                <div className="flex gap-3">
                    <button
                        onClick={speakWord}
                        className="p-4 bg-tg-bg rounded-xl"
                    >
                        <RotateCcw size={20} className="text-tg-hint" />
                    </button>
                    <button
                        onClick={checkAnswer}
                        disabled={!userInput.trim()}
                        className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Проверить
                    </button>
                </div>
            )}
        </div>
    );
};

export default DictationGame;
