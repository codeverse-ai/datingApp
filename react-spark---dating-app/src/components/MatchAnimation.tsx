import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User, Profile } from '../types';

interface MatchAnimationProps {
    user: User;
    matchedUser: Profile;
    onKeepSwiping: () => void;
    onSendMessage: () => void;
}

export const MatchAnimation: React.FC<MatchAnimationProps> = ({ user, matchedUser, onKeepSwiping, onSendMessage }) => {
    const sharedInterests = useMemo(() => {
        const userInterests = new Set(user.interests);
        return matchedUser.interests.filter(interest => userInterests.has(interest));
    }, [user.interests, matchedUser.interests]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-100/80 backdrop-blur-xl flex flex-col items-center justify-center z-50 p-4"
        >
            <motion.h1 
                initial={{ scale: 0.5, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
                className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F06292] to-[#FFB6C1] mb-8"
            >
                It's a Match!
            </motion.h1>
            <p className="text-slate-600 text-lg mb-8 -mt-4">You and {matchedUser.name} have liked each other.</p>

            <div className="flex items-center justify-center space-x-[-3rem]">
                <motion.img 
                    src={user.photos[0]} 
                    alt={user.name} 
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                    initial={{ x: -100, opacity: 0, rotate: -20 }}
                    animate={{ x: 0, opacity: 1, rotate: -10 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
                />
                <motion.img 
                    src={matchedUser.photos[0]} 
                    alt={matchedUser.name} 
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                    initial={{ x: 100, opacity: 0, rotate: 20 }}
                    animate={{ x: 0, opacity: 1, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
                />
            </div>
            
            {sharedInterests.length > 0 && (
                <div className="mt-8 text-center">
                    <p className="text-slate-500 mb-3">You both love:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <AnimatePresence>
                        {sharedInterests.map((interest, index) => (
                            <motion.div
                                key={interest}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + index * 0.2 }}
                                className="px-3 py-1 text-sm bg-teal-400/20 text-teal-600 font-semibold rounded-full"
                            >
                                {interest}
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            <motion.button
                onClick={onSendMessage}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', delay: 1.2 }}
                className="mt-8 w-full max-w-sm p-4 text-lg font-semibold text-white bg-gradient-to-r from-[#F06292] to-rose-500 rounded-full"
            >
                Send a Message
            </motion.button>
             <motion.button
                onClick={onKeepSwiping}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', delay: 1.3 }}
                className="mt-4 w-full max-w-sm p-3 text-lg font-semibold text-slate-700 bg-transparent rounded-full hover:bg-black/5"
            >
                Keep Swiping
            </motion.button>
        </motion.div>
    );
};