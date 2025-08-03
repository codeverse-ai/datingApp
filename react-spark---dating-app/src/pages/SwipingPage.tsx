
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import type { Profile, ProfileWithDistance, AppRoute, Location as LocationType } from '../types';
import { DatingCard } from '../components/DatingCard';
import { ActionButtons } from '../components/ActionButtons';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from '../hooks/useLocation';
import { calculateDistance } from '../utils/location';
import { useFilters } from '../hooks/useFilters';
import { FilterIcon } from '../components/icons/FilterIcon';
import { MatchAnimation } from '../components/MatchAnimation';
import { PremiumModal } from '../components/PremiumModal';
import { ProfileDetailModal } from '../components/ProfileDetailModal';
import { apiGetDiscoverProfiles, apiSwipe } from '../utils/api';

interface SwipingPageProps {
  navigate: (path: AppRoute) => void;
}

type BannerInfo = { id: string; type: 'error' | 'info'; title: string; message: string };

const SwipingPage: React.FC<SwipingPageProps> = ({ navigate }) => {
  const { user, updateUser, token } = useAuth();
  const { location: userLocation, error: locationError } = useLocation();
  const { filters } = useFilters();
  
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<ProfileWithDistance[]>([]);
  const [history, setHistory] = useState<ProfileWithDistance[]>([]);
  
  const [isMatch, setIsMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<ProfileWithDistance | null>(null);
  const [isShowingGlobal, setIsShowingGlobal] = useState(false);
  const [activeBanner, setActiveBanner] = useState<BannerInfo | null>(null);

  const animationControls = useAnimationControls();
  
  useEffect(() => {
    const fetchProfiles = async () => {
        try {
            const profiles = await apiGetDiscoverProfiles();
            setAllProfiles(profiles);
        } catch (error) {
            console.error("Failed to fetch profiles:", error);
        }
    }
    // Only fetch profiles if we have an auth token.
    // This prevents 401 errors during login/logout transitions.
    if(token) {
        fetchProfiles();
    } else {
        setAllProfiles([]);
    }
  }, [token]);

  useEffect(() => {
    if (user && allProfiles.length > 0) {
        const getFiltered = (sourceProfiles: Profile[], applyDistanceFilter: boolean, searchOrigin: LocationType | null): ProfileWithDistance[] => {
             return sourceProfiles
                .map(profile => ({
                    ...profile,
                    distance: searchOrigin ? calculateDistance(searchOrigin, profile.location) : 9999,
                }))
                .filter(p => {
                    const withinAge = p.age >= filters.ageRange[0] && p.age <= filters.ageRange[1];
                    const withinDistance = applyDistanceFilter ? (searchOrigin ? p.distance <= filters.maxDistance : true) : true;
                    const hasBio = !filters.mustHaveBio || (p.bio && p.bio.trim().length > 0);
                    const hasInterests = filters.requiredInterests.length === 0 || filters.requiredInterests.every(interest => p.interests.includes(interest));
                    
                    return withinAge && withinDistance && hasBio && hasInterests;
                })
                .sort((a, b) => a.distance - b.distance);
        };
        
        const searchLocation = filters.searchLocation ? filters.searchLocation.location : userLocation;
        let localProfiles = getFiltered(allProfiles, true, searchLocation);
        
        if (localProfiles.length > 0) {
            setFilteredProfiles(localProfiles.reverse()); // Reverse to pop from the end (closest first)
            setIsShowingGlobal(false);
        } else {
            let globalProfiles = getFiltered(allProfiles, false, null);
            setFilteredProfiles(globalProfiles.sort(() => Math.random() - 0.5));
            setIsShowingGlobal(globalProfiles.length > 0);
        }

    } else {
        setFilteredProfiles([]);
    }
  }, [allProfiles, userLocation, user, filters]);

  // Banner logic remains the same...
  useEffect(() => {
    const bannerId = 'locationError';
    if (locationError && !sessionStorage.getItem(bannerId)) {
        const banner: BannerInfo = {id: bannerId, type: 'error', title: locationError, message: 'Showing profiles based on default settings.'};
        setActiveBanner(banner);
        sessionStorage.setItem(bannerId, 'true');
        const timer = setTimeout(() => {
            setActiveBanner(current => (current?.id === bannerId ? null : current));
        }, 2000);
        return () => clearTimeout(timer);
    }
  }, [locationError]);

  useEffect(() => {
    const bannerId = 'globalProfiles';
    if (isShowingGlobal && filteredProfiles.length > 0 && !sessionStorage.getItem(bannerId)) {
        const banner: BannerInfo = {id: bannerId, type: 'info', title: "You've seen everyone nearby!", message: 'Now showing profiles from around the world.'};
        setActiveBanner(banner);
        sessionStorage.setItem(bannerId, 'true');
        const timer = setTimeout(() => {
            setActiveBanner(current => (current?.id === bannerId ? null : current));
        }, 2000);
        return () => clearTimeout(timer);
    }
  }, [isShowingGlobal, filteredProfiles.length]);


  const activeIndex = filteredProfiles.length - 1;
  const activeProfile = filteredProfiles[activeIndex];

  const handleSwipe = useCallback(async (decision: 'like' | 'dislike' | 'superlike') => {
    if (!activeProfile || !user) return;
    
    try {
      const { user: updatedUser, isMatch: newMatch } = await apiSwipe(activeProfile.id, decision);
      updateUser(updatedUser); // Update frontend state with backend's response

      if (newMatch) {
        setMatchedProfile(activeProfile);
        setIsMatch(true);
      }

    } catch(error) {
      console.error("Swipe failed:", error);
    }
    
    setHistory(prev => [...prev, activeProfile]);
    setFilteredProfiles(prev => prev.slice(0, prev.length - 1));
  }, [activeProfile, user, updateUser]);

  const swipeAndRemove = useCallback(async (direction: 'left' | 'right' | 'up') => {
    if (!activeProfile) return;

    const x = direction === 'right' ? 300 : direction === 'left' ? -300 : 0;
    const y = direction === 'up' ? -500 : 0;
    const rotate = direction === 'right' ? 20 : direction === 'left' ? -20 : 0;

    await animationControls.start({ x, y, rotate, opacity: 0, transition: { duration: 0.5 } });
    
    await handleSwipe(direction === 'up' ? 'superlike' : direction === 'right' ? 'like' : 'dislike');
  }, [animationControls, activeProfile, handleSwipe]);
  
  const handleRewind = useCallback(() => {
    if (!user?.isPremium) {
      setShowPremiumModal(true);
      return;
    }
    // In a fullstack app, rewind would be a backend call to undo the last swipe.
    // For now, this local implementation is fine for premium users.
    if (history.length > 0) {
      const lastProfile = history[history.length - 1];
      const newHistory = history.slice(0, history.length - 1);
      
      setHistory(newHistory);
      setFilteredProfiles(prev => [...prev, lastProfile]);
    }
  }, [user, history]);
  
  const handleBoost = () => {
    setShowPremiumModal(true);
  };

  const memoizedProfiles = useMemo(() => {
    return filteredProfiles.slice(-3).map((profile, index) => {
        const isTopCard = index === filteredProfiles.slice(-3).length - 1;
        const zIndex = filteredProfiles.length - (filteredProfiles.slice(-3).length - index);
        return (
          <DatingCard
            key={profile.id}
            profile={profile}
            onSwipe={handleSwipe}
            onViewProfile={setViewingProfile}
            isTopCard={isTopCard}
            animationControls={isTopCard ? animationControls : undefined}
            zIndex={zIndex}
          />
        );
      });
  }, [filteredProfiles, animationControls, handleSwipe]);
  
  if (isMatch && matchedProfile && user) {
    return <MatchAnimation 
              user={user} 
              matchedUser={matchedProfile}
              onKeepSwiping={() => setIsMatch(false)}
              onSendMessage={() => {
                setIsMatch(false);
                navigate(`/chat/${matchedProfile.id}`);
              }}
           />
  }

  return (
    <div className="flex flex-col h-full bg-transparent">
      <header className="flex-shrink-0 w-full p-4 flex items-center justify-between z-10">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-teal-500">
            Discover
        </h1>
        <button onClick={() => navigate('/filters')} className="p-2 rounded-full hover:bg-black/10 transition-colors">
            <FilterIcon className="w-6 h-6 text-slate-600" />
        </button>
      </header>

      <main className="flex-1 relative flex flex-col items-center justify-center px-4 overflow-hidden">
        
        <div className="absolute top-0 w-full px-4 pt-2 z-30 space-y-2">
            <AnimatePresence>
                {activeBanner && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                        className={`text-center p-3 rounded-lg text-xs shadow-md ${activeBanner.type === 'error' ? 'text-orange-600 bg-orange-100 border border-orange-300' : 'text-sky-600 bg-sky-100 border border-sky-300'}`}
                    >
                        <p className="font-semibold">{activeBanner.title}</p>
                        <p>{activeBanner.message}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="relative w-full max-w-md aspect-[3/5] flex items-center justify-center">
          {filteredProfiles.length > 0 ? (
            memoizedProfiles
          ) : (
            <div className="text-center text-slate-500 bg-white/50 p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-slate-700">That's everyone for now!</h2>
              <p className="mt-2">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="flex-shrink-0 p-4 pb-8">
        <ActionButtons
            onRewind={handleRewind}
            onDislike={() => swipeAndRemove('left')}
            onSuperLike={() => swipeAndRemove('up')}
            onLike={() => swipeAndRemove('right')}
            onBoost={handleBoost}
            canRewind={!!user?.isPremium && history.length > 0}
            hasProfiles={filteredProfiles.length > 0}
        />
      </footer>

      {showPremiumModal && (
        <PremiumModal 
            onClose={() => setShowPremiumModal(false)}
            navigate={navigate}
        />
      )}
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

export default SwipingPage;