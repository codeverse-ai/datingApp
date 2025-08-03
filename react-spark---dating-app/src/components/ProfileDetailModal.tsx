import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppRoute, ProfileWithDistance } from '../types';
import { XIcon } from './icons/XIcon';
import { useAuth } from '../hooks/useAuth';
import { PlayCircleIcon, MicrophoneIcon } from './icons/MediaIcons';

interface ProfileDetailModalProps {
    profile: ProfileWithDistance;
    onClose: () => void;
    navigate: (path: AppRoute) => void;
}

const ZodiacIcon: React.FC<{ sign: string, className?: string }> = ({ sign, className }) => {
  const signSymbol = sign.split(' ')[0] || '';
  return <span className={className} role="img" aria-label={sign}>{signSymbol}</span>
}


export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({ profile, onClose, navigate }) => {
    const [activePhotoIndex, setActivePhotoIndex] = useState(0);
    const [newMessage, setNewMessage] = useState('');
    const { sendMessage, user } = useAuth();
    const [isSending, setIsSending] = useState(false);

    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActivePhotoIndex(i => (i + 1) % profile.photos.length);
    };

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActivePhotoIndex(i => (i - 1 + profile.photos.length) % profile.photos.length);
    };
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || isSending) return;
        
        setIsSending(true);
        await sendMessage(profile.id, newMessage.trim());
        setIsSending(false);
        onClose();
        navigate(`/chat/${profile.id}`);
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
                className="bg-slate-50 rounded-2xl w-full max-w-md h-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0 relative w-full h-2/5 bg-slate-200">
                    <AnimatePresence initial={false}>
                        <motion.img
                            key={activePhotoIndex}
                            src={profile.photos[activePhotoIndex]}
                            alt={`${profile.name}'s photo ${activePhotoIndex + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        />
                    </AnimatePresence>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                    {profile.photos.length > 1 && (
                        <>
                            <div className="absolute top-2 left-2 right-2 flex space-x-1 p-1 z-20">
                                {profile.photos.map((_, i) => (
                                <div
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); setActivePhotoIndex(i); }}
                                    className={`h-1 flex-1 rounded-full cursor-pointer ${i === activePhotoIndex ? 'bg-white' : 'bg-white/50'}`}
                                />
                                ))}
                            </div>
                            <button onClick={prevPhoto} className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-white/30 hover:bg-white/50 rounded-full backdrop-blur-sm text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                            </button>
                             <button onClick={nextPhoto} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/30 hover:bg-white/50 rounded-full backdrop-blur-sm text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                            </button>
                        </>
                    )}
                    <button onClick={onClose} className="absolute top-2 right-2 p-1 bg-black/30 hover:bg-black/50 rounded-full backdrop-blur-sm text-white z-20 transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-grow p-6 overflow-y-auto space-y-5">
                    <div>
                        <div className="flex items-baseline gap-3">
                            <h2 className="text-3xl font-bold text-slate-900">{profile.name}, {profile.age}</h2>
                             {profile.zodiac && <ZodiacIcon sign={profile.zodiac} className="text-2xl opacity-60" />}
                        </div>
                        <p className="text-md text-slate-500 capitalize">{profile.occupation}</p>
                        {profile.distance < 9999 && (
                             <p className="text-sm text-slate-500 font-medium">{profile.distance.toFixed(1)} miles away</p>
                        )}
                         {profile.vibe && (
                            <div className="mt-3 inline-block px-3 py-1 text-sm bg-black/10 text-slate-600 rounded-full font-semibold">
                                {profile.vibe}
                            </div>
                         )}
                    </div>

                    <div className="border-t border-slate-200"></div>

                     <div>
                        <h3 className="font-semibold mb-2 text-slate-800">Video Intro</h3>
                        <div className="bg-slate-200 aspect-video rounded-lg flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-300 transition-colors">
                            <PlayCircleIcon className="w-12 h-12" />
                        </div>
                    </div>

                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed bg-white/50 p-4 rounded-lg">{profile.bio || 'No bio yet.'}</p>
                    
                     <div>
                        <h3 className="font-semibold mb-2 text-slate-800">Voice Prompts</h3>
                        <div className="space-y-3">
                            <div className="bg-white p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors">
                                <MicrophoneIcon className="w-6 h-6 text-rose-500 flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className="text-xs text-slate-500">My perfect date would be...</p>
                                    <p className="text-slate-400 italic">No answer yet.</p>
                                </div>
                            </div>
                             <div className="bg-white p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors">
                                <MicrophoneIcon className="w-6 h-6 text-rose-500 flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className="text-xs text-slate-500">If I were a meme...</p>
                                    <p className="text-slate-400 italic">No answer yet.</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div>
                        <h3 className="font-semibold mb-3 text-slate-800">Interests</h3>
                         <div className="flex flex-wrap gap-2">
                            {profile.interests.map(interest => (
                                <div key={interest} className="px-3 py-1 text-sm font-medium bg-rose-100 text-rose-600 rounded-full">
                                {interest}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="flex-shrink-0 p-3 bg-white/80 backdrop-blur-lg border-t border-slate-200/80">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={`Message ${profile.name}...`}
                            className="flex-grow p-3 px-4 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder-slate-400"
                            aria-label="Chat input"
                        />
                        <button type="submit" className="bg-gradient-to-r from-rose-500 to-teal-500 text-white rounded-full p-3 hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed" disabled={!newMessage.trim() || isSending} aria-label="Send message">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};