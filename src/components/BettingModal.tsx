import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEconomy } from '../context/EconomyContext';

interface BettingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number) => void;
}

const BettingModal: React.FC<BettingModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const { balance } = useEconomy();
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

    const betOptions = [10, 50, 100];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-tg-bg w-full max-w-sm rounded-2xl p-6 shadow-xl border border-tg-hint/10"
                    >
                        <h2 className="text-xl font-bold text-center mb-2">Place your bet! 🎲</h2>
                        <p className="text-center text-tg-hint text-sm mb-6">
                            Win 100% correct answers to double it. One mistake - you lose it.
                        </p>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {betOptions.map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => setSelectedAmount(amount)}
                                    disabled={balance < amount}
                                    className={`p-3 rounded-xl border-2 font-bold transition-all ${selectedAmount === amount
                                            ? 'border-yellow-400 bg-yellow-400/10 text-yellow-600'
                                            : balance < amount
                                                ? 'border-tg-hint/20 text-tg-hint opacity-50 cursor-not-allowed'
                                                : 'border-tg-hint/20 hover:border-tg-button/50'
                                        }`}
                                >
                                    {amount} 🪙
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 font-medium text-tg-hint hover:bg-tg-secondary-bg rounded-xl transition-colors"
                            >
                                Skip
                            </button>
                            <button
                                onClick={() => selectedAmount && onConfirm(selectedAmount)}
                                disabled={!selectedAmount}
                                className="flex-1 py-3 font-bold bg-tg-button text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-tg-button/30"
                            >
                                Let's Play!
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BettingModal;
