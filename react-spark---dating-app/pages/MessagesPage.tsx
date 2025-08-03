import React from 'react';
import { useAuth } from '../hooks/useAuth';
import type { AppRoute } from '../types';
import { HeartIcon } from '../components/icons/HeartIcon';

interface MatchesPageProps {
  navigate: (path: AppRoute) => void;
}

const MatchesPage: React.FC<MatchesPageProps> = ({ navigate }) => {
    const { user } = useAuth();
    const matches = user?.matches || [];

    return (
        <div className="p-4 md:p-6 bg-transparent min-h-full">
            <header className="flex-shrink-0 w-full mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-teal-500">
                    Matches
                </h1>
            </header>
            
            {matches.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-24">
                    {matches.map(profile => (
                        <div 
                            key={profile.id} 
                            onClick={() => navigate(`/chat/${profile.id}`)}
                            className="relative aspect-[3/4] rounded-lg overflow-hidden group shadow-lg bg-slate-200 cursor-pointer"
                        >
                            <img src={profile.photos[0]} alt={profile.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-3 text-white">
                                <h3 className="font-bold text-lg">{profile.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-4 mt-20">
                     <HeartIcon className="w-24 h-24 text-black/10 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-700">
                        No Matches Yet
                    </h2>
                    <p className="text-slate-500 max-w-sm mt-2">
                        Keep swiping to find your spark! When you and another person both like each other, they'll show up here.
                    </p>
                </div>
            )}
        </div>
    );
};

export default MatchesPage;