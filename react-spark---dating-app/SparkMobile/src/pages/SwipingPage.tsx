import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
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
import { FilterIcon } from '../components/icons/FilterIcon';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileDetailModal } from '../components/ProfileDetailModal'; // <-- Add this import

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

  // Modal state for profile details
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ProfileWithDistance | null>(null);

  useEffect(() => {
    if (!user) return;

    const seenIds = new Set([
      ...user.likedProfiles.map(p => p.id),
      ...user.superLikedProfiles.map(p => p.id),
      ...user.matches.map(p => p.id),
      user.id,
    ]);

    const unseen = MOCK_PROFILES.filter(p => !seenIds.has(p.id));

    const searchLocation = filters.searchLocation ? filters.searchLocation.location : userLocation;

    const filtered = unseen
      .map(profile => ({
        ...profile,
        distance: searchLocation ? calculateDistance(searchLocation, profile.location) : 9999,
      }))
      .filter(p => {
        const withinAge = p.age >= filters.ageRange[0] && p.age <= filters.ageRange[1];
        const withinDistance = searchLocation ? p.distance <= filters.distance : true;
        const hasBio = !filters.mustHaveBio || (p.bio && p.bio.trim().length > 0);
        const hasInterests =
          filters.requiredInterests.length === 0 ||
          filters.requiredInterests.every(interest => p.interests.includes(interest));
        return withinAge && withinDistance && hasBio && hasInterests;
      })
      .sort((a, b) => a.distance - b.distance);

    setProfiles(filtered);
  }, [user, userLocation, filters]);

  const handleSwipe = useCallback(
    (decision: 'like' | 'dislike' | 'superlike') => {
      if (profiles.length === 0 || !user) return;

      const swiped = profiles[0];
      const rest = profiles.slice(1);

      setHistory(prev => [swiped, ...prev]);
      setProfiles(rest);

      if (decision === 'like') {
        updateUser({ likedProfiles: [...user.likedProfiles, swiped] });
      } else if (decision === 'superlike') {
        updateUser({ superLikedProfiles: [...user.superLikedProfiles, swiped] });
      }

      if ((decision === 'like' || decision === 'superlike') && swiped.id === 'jessica-match') {
        setMatchedProfile(swiped);
        setIsMatch(true);
        updateUser({ matches: [...user.matches, swiped] });
      }
    },
    [profiles, user, updateUser]
  );

  const handleRewind = useCallback(() => {
    if (!user?.isPremium) {
      setShowPremiumModal(true);
      return;
    }
    if (history.length > 0) {
      const last = history[0];
      const rest = history.slice(1);
      setHistory(rest);
      setProfiles(prev => [last, ...prev]);
    }
  }, [user, history]);

  // Handler for opening the profile modal
  const handleViewProfile = (profile: ProfileWithDistance) => {
    setSelectedProfile(profile);
    setModalVisible(true);
  };

  if (isMatch && matchedProfile && user) {
    return (
      <MatchAnimation
        user={user}
        matchedUser={matchedProfile}
        onKeepSwiping={() => setIsMatch(false)}
        onSendMessage={() => {
          setIsMatch(false);
          navigation.navigate('Chat', { matchId: matchedProfile.id });
        }}
      />
    );
  }

  return (
    <LinearGradient colors={['#FFF1F2', '#F0F9FF']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Spark</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Filters')}>
            <FilterIcon width={24} height={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.deck}>
          {profiles.length > 0 ? (
            profiles.map((profile, index) => {
              const isTop = index === 0;
              return (
                <DatingCard
                  key={profile.id}
                  profile={profile}
                  onSwipe={handleSwipe}
                  onViewProfile={handleViewProfile} // <-- Use modal handler
                  zIndex={profiles.length - index}
                  isTopCard={isTop}
                />
              );
            }).reverse()
          ) : (
            <View style={styles.noMore}>
              <Text style={styles.noMoreTitle}>That's everyone for now!</Text>
              <Text style={styles.noMoreSub}>Try adjusting your filters or check back later.</Text>
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

        <PremiumModal visible={showPremiumModal} onClose={() => setShowPremiumModal(false)} />

        {/* Profile Detail Modal */}
        {selectedProfile && (
         <ProfileDetailModal
            profile={selectedProfile}
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onLike={() => { handleSwipe('like'); setModalVisible(false); }}
            onNope={() => { handleSwipe('dislike'); setModalVisible(false); }}
            onSuperlike={() => { handleSwipe('superlike'); setModalVisible(false); }}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    paddingBottom: 16, // Add slight bottom padding for safety margin
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#f472b6',
  },
  deck: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: -10, // <-- FIX: adds space above footer to prevent overlap
  },
  noMore: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#374151',
  },
  noMoreSub: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    height: 220, // slightly reduced from 100 to improve layout
    justifyContent: 'center',
  },
});

export default SwipingPage;