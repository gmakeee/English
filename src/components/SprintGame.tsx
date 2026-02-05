import { useState, useEffect } from 'react';
import { Timer, Zap } from 'lucide-react';

const SprintGame = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);

    useEffect(() => {
        let interval: number;
        if (isPlaying && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsPlaying(false);
        }
        return () => window.clearInterval(interval);
    }, [isPlaying, timeLeft]);

    const startGame = () => {
        setIsPlaying(true);
        setTimeLeft(60);
        setScore(0);
    };

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <Zap className="fill-yellow-400 text-yellow-400" />
                        Sprint
                    </h3>
                    <p className="opacity-80 text-sm">Match words against time!</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg font-mono text-xl font-bold flex items-center gap-2">
                    <Timer size={18} />
                    {timeLeft}s
                </div>
            </div>

            {!isPlaying ? (
                <div className="text-center py-8">
                    <p className="text-4xl font-black mb-2">{score}</p>
                    <p className="opacity-70 text-sm mb-6">Last Score</p>
                    <button
                        onClick={startGame}
                        className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform"
                    >
                        Start Sprint 🚀
                    </button>
                </div>
            ) : (
                <div className="h-40 flex items-center justify-center border-2 border-white/20 rounded-xl bg-white/5 backdrop-blur-sm">
                    {/* Game Logic Placeholder */}
                    <div className="text-center">
                        <p className="text-sm opacity-50 uppercase tracking-widest mb-2">Translate</p>
                        <h2 className="text-3xl font-bold">Cat</h2>
                        <div className="grid grid-cols-2 gap-2 mt-4 w-full px-4">
                            <button className="bg-white/20 hover:bg-white/30 p-2 rounded-lg" onClick={() => setScore(s => s + 10)}>Кошка</button>
                            <button className="bg-white/20 hover:bg-white/30 p-2 rounded-lg">Собака</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SprintGame;
