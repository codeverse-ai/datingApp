
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from '../hooks/useLocation';
import { useFilters } from '../hooks/useFilters';
import { calculateDistance } from '../utils/location';
import { MOCK_PROFILES } from '../constants';
import type { Profile, ProfileWithDistance, Location as LocationType } from '../types';

import { DatingCard } from '../components/DatingCard';
import { ActionButtons } from '../components/ActionButtons';
import { MatchAnimation } from '../components/MatchAnimation';
import { PremiumModal } from '../components/PremiumModal';
import { ProfileDetailModal } from '../components/ProfileDetailModal';
import { FilterIcon } from '../components/icons/FilterIcon';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const SwipingPage: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, updateUser } = useAuth();
  const { location: userLocation } = useLocation();
  const { filters } = useFilters();
  
  const [profiles, setProfiles] = useState<ProfileWithDistance[]>([]);
  const [history, setHistory] = useState<ProfileWithDistance[]>([]);
  
  const [isMatch, setIsMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<ProfileWithDistance | null>(null);

  useEffect(() => {
    if (user) {
        const seenIds = new Set([
            ...user.likedProfiles.map(p => p.id), 
            ...user.superLikedProfiles.map(p => p.id), 
            ...user.matches.map(p => p.id), 
            user.id
        ]);
        
        const unseenProfiles = MOCK_PROFILES.filter(p => !seenIds.has(p.id));

        const searchLocation = filters.searchLocation ? filters.searchLocation.location : userLocation;
        
        const filtered = unseenProfiles
            .map(profile => ({
                ...profile,
                distance: searchLocation ? calculateDistance(searchLocation, profile.location) : 9999,
            }))
            .filter(p => {
                const withinAge = p.age >= filters.ageRange[0] && p.age <= filters.ageRange[1];
                const withinDistance = searchLocation ? p.distance <= filters.distance : true;
                const hasBio = !filters.mustHaveBio || (p.bio && p.bio.trim().length > 0);
                const hasInterests = filters.requiredInterests.length === 0 || filters.requiredInterests.every(interest => p.interests.includes(interest));
                return withinAge && withinDistance && hasBio && hasInterests;
            })
            .sort((a, b) => a.distance - b.distance);

        setProfiles(filtered);
    }
  }, [user, userLocation, filters]);

  const handleSwipe = useCallback((decision: 'like' | 'dislike' | 'superlike') => {
    if (profiles.length === 0 || !user) return;

    const swipedProfile = profiles[0];
    const newProfiles = profiles.slice(1);
    
    setHistory(prev => [swipedProfile, ...prev]);
    setProfiles(newProfiles);

    if (decision === 'like') {
        updateUser({ likedProfiles: [...user.likedProfiles, swipedProfile] });
    } else if (decision === 'superlike') {
        updateUser({ superLikedProfiles: [...user.superLikedProfiles, swipedProfile] });
    }
    
    if ((decision === 'like' || decision === 'superlike') && swipedProfile.id === 'jessica-match') {
      setMatchedProfile(swipedProfile);
      setIsMatch(true);
      updateUser({ matches: [...user.matches, swipedProfile] });
    }
  }, [profiles, user, updateUser]);

  const handleRewind = useCallback(() => {
    if (!user?.isPremium) {
      setShowPremiumModal(true);
      return;
    }
    if (history.length > 0) {
      const lastProfile = history[0];
      const newHistory = history.slice(1);
      
      setHistory(newHistory);
      setProfiles(prev => [lastProfile, ...prev]);
    }
  }, [user, history]);

  if (isMatch && matchedProfile && user) {
    return <MatchAnimation 
              user={user} 
              matchedUser={matchedProfile}
              onKeepSwiping={() => setIsMatch(false)}
              onSendMessage={() => {
                setIsMatch(false);
                navigation.navigate('Chat', { matchId: matchedProfile.id });
              }}
           />
  }

  return (
    <LinearGradient colors={['#FFF1F2', '#F0F9FF']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Discover</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Filters')}>
                <FilterIcon width={24} height={24} color="#6b7280" />
            </TouchableOpacity>
        </View>

        <View style={styles.deckContainer}>
          {profiles.length > 0 ? (
            profiles.map((profile, index) => {
              const isTopCard = index === 0;
              return (
                <DatingCard
                  key={profile.id}
                  profile={profile}
                  onSwipe={handleSwipe}
                  onViewProfile={setViewingProfile}
                  zIndex={profiles.length - index}
                />
              );
            }).reverse() // render last card on top
          ) : (
            <View style={styles.noMoreCards}>
              <Text style={styles.noMoreCardsTitle}>That's everyone for now!</Text>
              <Text style={styles.noMoreCardsSubtitle}>Try adjusting your filters or check back later.</Text>
            </View>
          )}
        </View>
        
        <View style={styles.footer}>
          <ActionButtons
              onRewind={handleRewind}
              onDislike={() => handleSwipe('dislike')}
              onSuperLike={() => handleSwipe('superlike')}
              onLike={() => handleSwipe('like')}
              onBoost={() => setShowPremiumModal(true)}
              canRewind={!!user?.isPremium && history.length > 0}
              hasProfiles={profiles.length > 0}
          />
        </View>
      </SafeAreaView>

      <PremiumModal visible={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
      {viewingProfile && (
        <ProfileDetailModal
          profile={viewingProfile}
          visible={!!viewingProfile}
          onClose={() => setViewingProfile(null)}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#f472b6',
  },
  deckContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20,
  },
  noMoreCardsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#374151',
  },
  noMoreCardsSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    height: 100,
    justifyContent: 'center',
  },
});

export default SwipingPage;
