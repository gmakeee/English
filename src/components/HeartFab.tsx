import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const CUTE_PHRASES = [
    "You are amazing! ✨",
    "Keep going, sunshine! ☀️",
    "Smart & Beautiful! 🧠💅",
    "My heart beats for you! 💓",
    "English Queen! 👑",
    "Don't give up! 💪",
    "I love you! ❤️",
];

const HeartFab = () => {
    const handleClick = () => {
        if ((window as any).Telegram?.WebApp?.HapticFeedback) {
            (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }

        confetti({
            particleCount: 30,
            spread: 50,
            origin: { x: 0.85, y: 0.85 },
            colors: ['#ff0000', '#ff69b4'],
            scalar: 0.7
        });

        const phrase = CUTE_PHRASES[Math.floor(Math.random() * CUTE_PHRASES.length)];
        toast(phrase, {
            icon: '💖',
            style: {
                borderRadius: '20px',
                background: '#333',
                color: '#fff',
            },
        });
    };

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClick}
            className="fixed bottom-24 right-6 bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-full shadow-lg shadow-pink-500/40 z-50 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
            <Heart className="fill-white animate-pulse" size={28} />
        </motion.button>
    );
};

export default HeartFab;
