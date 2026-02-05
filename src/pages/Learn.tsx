import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, BookOpen, Headphones } from 'lucide-react';
import QuizGame from '../components/QuizGame';
import SprintGame from '../components/SprintGame';
import FillGapGame from '../components/FillGapGame';
import DictationGame from '../components/DictationGame';

type GameMode = 'hub' | 'quiz' | 'sprint' | 'context' | 'dictation';

const GAME_CARDS = [
    {
        id: 'quiz' as const,
        title: 'Квиз',
        description: 'Переводи слова и зарабатывай монеты',
        icon: Brain,
        gradient: 'from-blue-500 to-indigo-600',
        emoji: '🎯'
    },
    {
        id: 'sprint' as const,
        title: 'Спринт',
        description: 'Отвечай на скорость за 60 секунд',
        icon: Zap,
        gradient: 'from-purple-500 to-pink-600',
        emoji: '⚡'
    },
    {
        id: 'context' as const,
        title: 'Контекст',
        description: 'Выбери правильное слово в предложении',
        icon: BookOpen,
        gradient: 'from-emerald-500 to-teal-600',
        emoji: '📝'
    },
    {
        id: 'dictation' as const,
        title: 'Диктант',
        description: 'Услышь слово и напиши его',
        icon: Headphones,
        gradient: 'from-orange-500 to-red-600',
        emoji: '🎧'
    },
];

const Learn = () => {
    const [gameMode, setGameMode] = useState<GameMode>('hub');

    const renderGame = () => {
        switch (gameMode) {
            case 'quiz':
                return <QuizGame onBack={() => setGameMode('hub')} />;
            case 'sprint':
                return (
                    <div className="space-y-6">
                        <button
                            onClick={() => setGameMode('hub')}
                            className="text-tg-hint text-sm"
                        >
                            ← Назад к играм
                        </button>
                        <SprintGame />
                    </div>
                );
            case 'context':
                return (
                    <div className="space-y-6">
                        <button
                            onClick={() => setGameMode('hub')}
                            className="text-tg-hint text-sm"
                        >
                            ← Назад к играм
                        </button>
                        <FillGapGame />
                    </div>
                );
            case 'dictation':
                return (
                    <div className="space-y-6">
                        <button
                            onClick={() => setGameMode('hub')}
                            className="text-tg-hint text-sm"
                        >
                            ← Назад к играм
                        </button>
                        <DictationGame />
                    </div>
                );
            default:
                return null;
        }
    };

    if (gameMode !== 'hub') {
        return <div className="pb-24">{renderGame()}</div>;
    }

    return (
        <div className="space-y-6 pb-24">
            <header>
                <h1 className="text-2xl font-bold">Учить</h1>
                <p className="text-tg-hint text-sm">Выбери режим обучения</p>
            </header>

            <div className="grid grid-cols-2 gap-4">
                {GAME_CARDS.map((game, index) => (
                    <motion.button
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setGameMode(game.id)}
                        className={`bg-gradient-to-br ${game.gradient} rounded-2xl p-4 text-white text-left shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <game.icon size={28} className="opacity-90" />
                            <span className="text-2xl">{game.emoji}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{game.title}</h3>
                        <p className="text-xs opacity-80 leading-tight">{game.description}</p>
                    </motion.button>
                ))}
            </div>

            <div className="bg-tg-secondary-bg rounded-xl p-4">
                <h3 className="font-bold mb-2">💡 Совет</h3>
                <p className="text-sm text-tg-hint">
                    Правильные ответы в квизе наносят урон Боссу недели! Победи его, чтобы получить награду.
                </p>
            </div>
        </div>
    );
};

export default Learn;
