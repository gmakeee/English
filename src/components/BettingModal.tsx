import { useState } from 'react';
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
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    {/* Solid backdrop */}
                    <div className="absolute inset-0 bg-black/70" onClick={onClose} />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative bg-[#1c1c1e] w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-600"
                    >
                        <h2 className="text-xl font-bold text-center mb-2">Сделай ставку! 🎲</h2>
                        <p className="text-center text-tg-hint text-sm mb-6">
                            100% правильных ответов — ставка удвоится. Одна ошибка — потеряешь всё.
                        </p>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {betOptions.map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => setSelectedAmount(amount)}
                                    disabled={balance < amount}
                                    className={`p-4 rounded-xl border-2 font-bold transition-all ${selectedAmount === amount
                                        ? 'border-yellow-400 bg-yellow-500 text-white'
                                        : balance < amount
                                            ? 'border-gray-600 text-gray-500 opacity-50 cursor-not-allowed bg-[#2c2c2e]'
                                            : 'border-gray-600 hover:border-yellow-400/50 bg-[#2c2c2e] text-white'
                                        }`}
                                >
                                    {amount} 🪙
                                </button>
                            ))}
                        </div>

                        <p className="text-center text-sm text-tg-hint mb-4">
                            Баланс: <span className="font-bold text-tg-text">{balance} 🪙</span>
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 font-medium text-gray-300 hover:bg-[#3c3c3e] bg-[#2c2c2e] rounded-xl transition-colors border border-gray-600"
                            >
                                Без ставки
                            </button>
                            <button
                                onClick={() => selectedAmount && onConfirm(selectedAmount)}
                                disabled={!selectedAmount}
                                className="flex-1 py-3 font-bold bg-tg-button text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-tg-button/30"
                            >
                                Играть!
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BettingModal;
