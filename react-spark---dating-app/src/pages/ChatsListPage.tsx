import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ChatBubbleIcon } from '../components/icons/ChatBubbleIcon';
import type { AppRoute, ChatListItem } from '../types';
import { apiGetChats } from '../utils/api';

interface ChatsListPageProps {
  navigate: (path: AppRoute) => void;
}

const ChatsListPage: React.FC<ChatsListPageProps> = ({ navigate }) => {
    const { user } = useAuth();
    const [chatList, setChatList] = useState<ChatListItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const chats = await apiGetChats();
                setChatList(chats);
            } catch (error) {
                console.error("Failed to fetch chats:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchChats();
        }
    }, [user]);

    if (loading) {
        return <div className="p-4 md:p-6 bg-transparent min-h-full">
            <header className="flex-shrink-0 w-full mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-teal-500">
                    Chats
                </h1>
            </header>
            <p className="text-center text-slate-500">Loading conversations...</p>
        </div>;
    }

    return (
        <div className="p-4 md:p-6 bg-transparent min-h-full">
            <header className="flex-shrink-0 w-full mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-teal-500">
                    Chats
                </h1>
            </header>
            
            {chatList.length > 0 ? (
                <div className="space-y-3 pb-24">
                    {chatList.map(({ profile, lastMessage }) => (
                        <div 
                            key={profile.id} 
                            onClick={() => navigate(`/chat/${profile.id}`)}
                            className="flex items-center p-3 bg-white/80 rounded-lg hover:bg-white transition-colors cursor-pointer shadow-sm backdrop-blur-sm"
                        >
                            <img src={profile.photos[0]} alt={profile.name} className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-white" />
                            <div className="flex-grow overflow-hidden">
                                <h3 className="font-bold text-lg text-slate-800">{profile.name}</h3>
                                <p className="text-sm text-slate-500 truncate">
                                    {lastMessage.senderId === user?.id && 'You: '}
                                    {lastMessage.text}
                                </p>
                            </div>
                            <span className="text-xs text-slate-400 self-start mt-1">{lastMessage.timestamp}</span>
                        </div>
                    ))}
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