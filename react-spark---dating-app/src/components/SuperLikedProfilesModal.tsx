import React from 'react';
import { motion } from 'framer-motion';
import type { AppRoute, Profile } from '../types';
import { XIcon } from './icons/XIcon';
import { StarIcon } from './icons/StarIcon';

interface SuperLikedProfilesModalProps {
    profiles: Profile[];
    onClose: () => void;
    navigate: (path: AppRoute) => void;
}

export const SuperLikedProfilesModal: React.FC<SuperLikedProfilesModalProps> = ({ profiles, onClose, navigate }) => {
    const handleProfileClick = (profileId: string) => {
        onClose();
        navigate(`/chat/${profileId}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="bg-slate-50 rounded-2xl w-full max-w-md h-full max-h-[70vh] flex flex-col overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Your Super Likes</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-grow p-4 overflow-y-auto">
                    {profiles.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4">
                            {profiles.map(profile => (
                                <div 
                                    key={profile.id} 
                                    onClick={() => handleProfileClick(profile.id)} 
                                    className="relative aspect-[3/4] rounded-lg overflow-hidden group shadow-md bg-slate-200 cursor-pointer"
                                >
                                    <img src={profile.photos[0]} alt={profile.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <StarIcon className="absolute top-2 right-2 w-6 h-6 text-yellow-300 drop-shadow-lg" />
                                    <div className="absolute bottom-0 left-0 p-2 text-white">
                                        <h3 className="font-bold text-sm truncate">{profile.name}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-center text-slate-500">
                            <p>You haven't Super Liked anyone yet!</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};