import React from 'react';
import { motion } from 'framer-motion';
import { XIcon } from './icons/XIcon';
import { StarIcon } from './icons/StarIcon';
import { RewindIcon } from './icons/RewindIcon';
import { BoostIcon } from './icons/BoostIcon';
import type { AppRoute } from '../types';

interface PremiumModalProps {
    onClose: () => void;
    navigate: (path: AppRoute) => void;
}

const Plan: React.FC<{ duration: string; price: string; popular?: boolean }> = ({ duration, price, popular }) => (
    <div className={`relative border-2 p-4 rounded-lg text-left ${popular ? 'border-rose-400' : 'border-slate-200'}`}>
        {popular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-rose-400 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
        <p className="text-lg font-bold text-slate-800">{duration}</p>
        <p className="text-slate-500">{price}</p>
    </div>
);

export const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, navigate }) => {
    
    const handleUpgrade = () => {
        onClose();
        navigate('/payment');
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full text-slate-500 hover:bg-slate-100">
                    <XIcon className="w-5 h-5" />
                </button>

                <div className="flex justify-center items-center gap-4 mb-4">
                    <StarIcon className="w-8 h-8 text-yellow-400" />
                    <RewindIcon className="w-8 h-8 text-gray-400" />
                    <BoostIcon className="w-8 h-8 text-orange-400" />
                </div>
                
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-teal-500 mb-2">
                    Get Spark Premium
                </h2>
                <p className="text-slate-600 mb-6">Unlock Rewinds, Boosts, Super Likes, and more!</p>

                <div className="space-y-4 mb-6">
                    <Plan duration="12 Months" price="$8.33/mo" popular />
                    <Plan duration="6 Months" price="$11.99/mo" />
                    <Plan duration="1 Month" price="$19.99/mo" />
                </div>
                
                <button 
                    onClick={handleUpgrade}
                    className="w-full p-4 font-semibold text-white bg-gradient-to-r from-rose-500 to-teal-500 rounded-full hover:shadow-lg transition-all transform hover:scale-105"
                >
                    Upgrade Now
                </button>
            </motion.div>
        </motion.div>
    );
};