
import React, { useMemo, useState, useEffect } from 'react';
import { EXPLORE_CATEGORIES } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { useFilters } from '../hooks/useFilters';
import { useLocation } from '../hooks/useLocation';
import { calculateDistance } from '../utils/location';
import type { AppRoute, Profile, ProfileWithDistance } from '../types';
import { apiGetExploreProfiles } from '../utils/api';
import { ProfileDetailModal } from '../components/ProfileDetailModal';

interface ExplorePageProps {
  navigate: (path: AppRoute) => void;
}


const ExplorePage: React.FC<ExplorePageProps> = ({ navigate }) => {
    const { user } = useAuth();
    const { location: userLocation } = useLocation();
    const { filters } = useFilters();
    const [activeCategory, setActiveCategory] = useState(EXPLORE_CATEGORIES[0].name);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [viewingProfile, setViewingProfile] = useState<ProfileWithDistance | null>(null);

    useEffect(() => {
        const fetchExploreProfiles = async () => {
            const currentCategory = EXPLORE_CATEGORIES.find(c => c.name === activeCategory);
            const interestsToFilter = currentCategory?.interests || [];
            try {
                const fetchedProfiles = await apiGetExploreProfiles(interestsToFilter);
                setProfiles(fetchedProfiles);
            } catch (error) {
                console.error("Failed to fetch explore profiles:", error);
            }
        };

        if (user) {
            fetchExploreProfiles();
        }
    }, [user, activeCategory]);

    const filteredProfiles: ProfileWithDistance[] = useMemo(() => {
        if (!user) return [];

        return profiles
            .filter(p => {
                 const withinAge = p.age >= filters.ageRange[0] && p.age <= filters.ageRange[1];
                 const hasBio = !filters.mustHaveBio || (p.bio && p.bio.trim().length > 0);
                 const hasRequiredInterests = filters.requiredInterests.length === 0 || filters.requiredInterests.every(interest => p.interests.includes(interest));
                 return withinAge && hasBio && hasRequiredInterests;
            })
            .map(profile => ({
                ...profile,
                distance: userLocation ? calculateDistance(userLocation, profile.location) : 9999,
            }))
            .sort(() => Math.random() - 0.5);
    }, [user, userLocation, filters, profiles]);

    return (
        <div className="bg-transparent min-h-full">
            <header className="sticky top-0 bg-gradient-to-b from-rose-100/90 to-rose-100/70 backdrop-blur-md z-10 p-4 pt-6">
                <div className="flex-shrink-0 w-full mb-4 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-teal-500">
                        Explore
                    </h1>
                </div>
                <div className="flex space-x-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
                    {EXPLORE_CATEGORIES.map(category => (
                        <button 
                            key={category.name}
                            onClick={() => setActiveCategory(category.name)}
                            className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${
                                activeCategory === category.name 
                                ? 'bg-rose-500 text-white shadow' 
                                : 'bg-white/70 text-slate-700 hover:bg-white'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </header>
            
            <main className="p-4">
                {filteredProfiles.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-24">
                        {filteredProfiles.map(profile => (
                            <div 
                                key={profile.id} 
                                onClick={() => setViewingProfile(profile)}
                                className="relative aspect-[3/4] rounded-lg overflow-hidden group shadow-lg bg-slate-200 cursor-pointer"
                            >
                                <img src={profile.photos[0]} alt={profile.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-3 text-white">
                                    <h3 className="font-bold text-lg">{profile.name}, {profile.age}</h3>
                                    {profile.distance < 9999 && (
                                        <p className="text-xs text-white/80">{profile.distance.toFixed(1)} miles away</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-slate-500 mt-20 bg-white/50 p-8 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold text-slate-700">No one matches that vibe.</h2>
                        <p className="mt-2 text-slate-500">Try a different category or adjust your main filters!</p>
                    </div>
                )}
            </main>

            {viewingProfile && (
                <ProfileDetailModal 
                    profile={viewingProfile}
                    onClose={() => setViewingProfile(null)}
                    navigate={navigate}
                />
            )}
        </div>
    );
};

export default ExplorePage;