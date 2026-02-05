import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WordOfDayProps {
    word: string;
    translation: string;
    example: string;
    onEasterEggTrigger?: () => void;
}

const WordOfDay: React.FC<WordOfDayProps> = ({ word, translation, example, onEasterEggTrigger }) => {
    const [tapCount, setTapCount] = useState(0);

    const handleSpeak = (e: React.MouseEvent) => {
        e.stopPropagation();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const handleCardTap = () => {
        const newCount = tapCount + 1;
        setTapCount(newCount);

        if (newCount === 5) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff0000', '#ff69b4', '#ffc0cb']
            });
            if (onEasterEggTrigger) onEasterEggTrigger();
            setTapCount(0);
        }
    };

    return (
        <div
            className="bg-gradient-to-br from-tg-button to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden cursor-pointer select-none"
            onClick={handleCardTap}
        >
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Volume2 size={48} />
            </div>

            <span className="text-xs uppercase tracking-wider opacity-80 font-semibold">Слово дня</span>

            <div className="mt-4 mb-2">
                <h2 className="text-3xl font-bold tracking-tight">{word}</h2>
                <p className="text-lg opacity-90 font-medium">{translation}</p>
            </div>

            <p className="text-sm opacity-80 italic mt-4 border-l-2 border-white/30 pl-3">
                "{example}"
            </p>

            <button
                onClick={handleSpeak}
                className="absolute bottom-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm"
            >
                <Volume2 size={20} />
            </button>
        </div>
    );
};

export default WordOfDay;
