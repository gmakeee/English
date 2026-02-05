import React from 'react';
import { Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SpeakerButtonProps {
    text: string;
    className?: string;
    size?: number;
}

const SpeakerButton: React.FC<SpeakerButtonProps> = ({ text, className = "", size = 20 }) => {
    const speak = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent parent clicks (e.g., card flip)

        if ('speechSynthesis' in window) {
            // Cancel any current speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US'; // Default to US English
            utterance.rate = 0.9; // Slightly slower for clarity

            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={speak}
            className={`p-2 rounded-full hover:bg-black/10 transition-colors ${className}`}
            title="Listen"
        >
            <Volume2 size={size} />
        </motion.button>
    );
};

export default SpeakerButton;
