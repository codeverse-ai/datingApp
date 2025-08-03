

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { AppRoute, ChatMessage, Profile } from '../types';
import { getAiIcebreaker, getAiDateIdea } from '../utils/ai';
import { WandIcon } from '../components/icons/WandIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { apiGetProfileById } from '../utils/api';

interface ChatPageProps {
  matchId: string;
  navigate: (path: AppRoute) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ matchId, navigate }) => {
  const { user, sendMessage, updateUser } = useAuth();
  const [matchProfile, setMatchProfile] = useState<Profile | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  const messages = user?.chats?.[matchId] || [];
  const isNewChat = messages.length <= 2;

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const profile = await apiGetProfileById(matchId);
            setMatchProfile(profile);
        } catch (error) {
            console.error("Failed to fetch match profile:", error);
            navigate('/chats');
        }
    };
    fetchProfile();
  }, [matchId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    await sendMessage(matchId, newMessage.trim());
    setNewMessage('');
  };
  
  const handleGetAiSuggestion = async () => {
    if (!user || !matchProfile || isLoadingAi) return;
    setIsLoadingAi(true);
    setAiSuggestion(null);
    try {
      const suggestion = isNewChat 
        ? await getAiIcebreaker(user, matchProfile)
        : await getAiDateIdea(user, matchProfile);
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error("AI suggestion failed:", error);
      setAiSuggestion("Sorry, I couldn't think of anything right now.");
    } finally {
      setIsLoadingAi(false);
    }
  };
  
  const useSuggestion = () => {
    if (aiSuggestion) {
      setNewMessage(aiSuggestion);
      setAiSuggestion(null);
    }
  }

  if (!matchProfile || !user) {
    return <div className="flex h-screen w-full items-center justify-center bg-slate-100">Loading chat...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-transparent">
      <header className="flex-shrink-0 w-full p-3 flex items-center bg-white/60 backdrop-blur-lg border-b border-white/30 z-10 sticky top-0">
        <button onClick={() => navigate('/chats')} className="text-slate-600 p-2 rounded-full hover:bg-black/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <img src={matchProfile.photos[0]} alt={matchProfile.name} className="w-10 h-10 rounded-full object-cover ml-2 border-2 border-white" />
        <h2 className="text-lg font-bold ml-3 text-slate-800">{matchProfile.name}</h2>
      </header>
      
      <main className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/80">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2.5 ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
            {msg.senderId !== user.id && (
              <img src={matchProfile.photos[0]} alt={matchProfile.name} className="w-8 h-8 rounded-full self-start" />
            )}
            <div className={`max-w-xs md:max-w-md p-3 px-4 rounded-2xl shadow-sm ${msg.senderId === user.id ? 'bg-gradient-to-br from-rose-500 to-rose-400 text-white rounded-br-lg' : 'bg-white text-slate-800 rounded-bl-lg'}`}>
              <p className="text-base">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>
      
      <footer className="flex-shrink-0 p-3 bg-white/60 backdrop-blur-lg border-t border-white/30 sticky bottom-0">
         <AnimatePresence>
          {aiSuggestion && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white p-3 rounded-lg mb-3 shadow-md border border-slate-200 cursor-pointer"
              onClick={useSuggestion}
            >
              <p className="text-sm text-slate-700">{aiSuggestion}</p>
              <p className="text-xs text-rose-500 font-semibold mt-1 text-right">Tap to use</p>
            </motion.div>
          )}
        </AnimatePresence>
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <button type="button" onClick={handleGetAiSuggestion} disabled={isLoadingAi} className="p-3 text-slate-500 hover:text-rose-500 transition-colors disabled:opacity-50">
             <WandIcon className={`w-6 h-6 ${isLoadingAi ? 'animate-pulse' : ''}`} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-3 px-4 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder-slate-400"
            aria-label="Chat input"
          />
          <button type="submit" className="bg-gradient-to-r from-rose-500 to-teal-500 text-white rounded-full p-3 hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed" disabled={!newMessage.trim()} aria-label="Send message">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatPage;