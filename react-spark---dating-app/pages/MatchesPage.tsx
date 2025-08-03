import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ChatBubbleIcon } from '../components/icons/ChatBubbleIcon';
import type { AppRoute, Profile } from '../types';
import { MOCK_PROFILES } from '../constants';

interface ChatsListPageProps {
  navigate: (path: AppRoute) => void;
}

const ChatsListPage: React.FC<ChatsListPageProps> = ({ navigate }) => {
    const { user } = useAuth();
    const chats = user?.chats || {};
    const chatEntries = Object.entries(chats);
    
    // Create a map for quick profile lookups
    const profileMap: Record<string, Profile> = [...MOCK_PROFILES, ...(user?.matches || [])].reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
    }, {} as Record<string, Profile>);

    return (
        <div className="p-4 md:p-6 bg-transparent min-h-full">
            <header className="flex-shrink-0 w-full mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-teal-500">
                    Chats
                </h1>
            </header>
            
            {chatEntries.length > 0 ? (
                <div className="space-y-3 pb-24">
                    {chatEntries.sort(([, a], [, b]) => {
                        const lastMsgA = a[a.length - 1]?.timestamp || '0';
                        const lastMsgB = b[b.length - 1]?.timestamp || '0';
                        return lastMsgB.localeCompare(lastMsgA); // Sort by most recent message
                    }).map(([chatId, messages]) => {
                        const otherProfile = profileMap[chatId];
                        const lastMessage = messages[messages.length - 1];
                        if (!otherProfile) return null;

                        return (
                            <div 
                                key={chatId} 
                                onClick={() => navigate(`/chat/${chatId}`)}
                                className="flex items-center p-3 bg-white/80 rounded-lg hover:bg-white transition-colors cursor-pointer shadow-sm backdrop-blur-sm"
                            >
                                <img src={otherProfile.photos[0]} alt={otherProfile.name} className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-white" />
                                <div className="flex-grow overflow-hidden">
                                    <h3 className="font-bold text-lg text-slate-800">{otherProfile.name}</h3>
                                    <p className="text-sm text-slate-500 truncate">
                                        {lastMessage.senderId === user?.id && 'You: '}
                                        {lastMessage.text}
                                    </p>
                                </div>
                                <span className="text-xs text-slate-400 self-start mt-1">{lastMessage.timestamp}</span>
                            </div>
                        )
                    })}
                </div>
            ) : (
                 <div className="flex flex-col items-center justify-center text-center p-4 mt-20">
                     <ChatBubbleIcon className="w-24 h-24 text-black/10 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-700">
                        No Chats Yet
                    </h2>
                    <p className="text-slate-500 max-w-sm mt-2">
                        Your conversations will appear here. Start a chat from someone's profile or after you match!
                    </p>
                </div>
            )}
        </div>
    );
};

export default ChatsListPage;