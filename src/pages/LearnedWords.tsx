import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookCheck, RefreshCw } from 'lucide-react';
import SpeakerButton from '../components/SpeakerButton';
import { useUser } from '../context/UserContext';
import { getLearnedWords } from '../lib/wordStats';
import { WORDS_A2_B1 } from '../data/words';
import type { Word } from '../data/words';

interface LearnedWordsProps {
    onBack: () => void;
}

const LearnedWords = ({ onBack }: LearnedWordsProps) => {
    const { userId } = useUser();
    const [learnedWords, setLearnedWords] = useState<Word[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchLearnedWords() {
            if (!userId) {
                setIsLoading(false);
                return;
            }

            const stats = await getLearnedWords(userId);
            const wordIds = new Set(stats.map(s => s.word_id));
            const words = WORDS_A2_B1.filter(w => wordIds.has(w.id));
            setLearnedWords(words);
            setIsLoading(false);
        }

        fetchLearnedWords();
    }, [userId]);

    const refresh = async () => {
        setIsLoading(true);
        if (!userId) return;

        const stats = await getLearnedWords(userId);
        const wordIds = new Set(stats.map(s => s.word_id));
        const words = WORDS_A2_B1.filter(w => wordIds.has(w.id));
        setLearnedWords(words);
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tg-button"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-2 text-tg-hint">
                    <ArrowLeft size={20} />
                    Назад
                </button>
                <button onClick={refresh} className="p-2 text-tg-hint hover:text-tg-text transition-colors">
                    <RefreshCw size={20} />
                </button>
            </div>

            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <BookCheck className="text-green-500" />
                    Выученные слова
                </h1>
                <p className="text-tg-hint text-sm mt-1">
                    {learnedWords.length} слов с точностью 80%+
                </p>
            </div>

            {learnedWords.length === 0 ? (
                <div className="bg-tg-secondary-bg rounded-2xl p-8 text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <h2 className="text-xl font-bold mb-2">Пока пусто</h2>
                    <p className="text-tg-hint">
                        Решай квизы, чтобы слова появились здесь!<br />
                        Слово считается выученным при 80%+ точности.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {learnedWords.map((word, index) => (
                        <motion.div
                            key={word.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-tg-secondary-bg rounded-xl p-4 border border-[--tg-theme-hint-color]/10"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg">{word.word}</h3>
                                        <SpeakerButton text={word.word} size={16} className="text-tg-button hover:bg-tg-button/10" />
                                    </div>
                                    <p className="text-tg-hint text-sm">{word.translation}</p>
                                </div>
                                <span className="text-green-500 text-2xl">✓</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LearnedWords;
