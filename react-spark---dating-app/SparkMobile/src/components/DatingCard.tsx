import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { ProfileWithDistance } from '../types';
import { InfoIcon } from './icons/InfoIcon';

interface DatingCardProps {
  profile: ProfileWithDistance;
  onSwipe: (decision: 'like' | 'dislike' | 'superlike') => void;
  onViewProfile: (profile: ProfileWithDistance) => void;
  zIndex: number;
}

export const DatingCard: React.FC<DatingCardProps> = ({ profile, onSwipe, onViewProfile, zIndex }) => {
  const { width: screenWidth } = useWindowDimensions();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // For tap animation overlays
  const [actionOverlay, setActionOverlay] = useState<null | 'like' | 'dislike' | 'superlike'>(null);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const SWIPE_THRESHOLD = screenWidth * 0.4;
  const SUPERLIKE_THRESHOLD = -120;

  // Reset swipe position and photo index when profile changes
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    setActivePhotoIndex(0);
    setActionOverlay(null);
  }, [profile.id]);

  const handleManualSwipe = (decision: 'like' | 'dislike' | 'superlike') => {
    setActionOverlay(decision);
    setTimeout(() => setActionOverlay(null), 500);
    onSwipe(decision);
  };

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number; startY: number }>({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      if (translateY.value < SUPERLIKE_THRESHOLD) {
        runOnJS(onSwipe)('superlike');
      } else if (translateX.value > SWIPE_THRESHOLD) {
        runOnJS(onSwipe)('like');
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        runOnJS(onSwipe)('dislike');
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(translateX.value, [-screenWidth / 2, screenWidth / 2], [-15, 15], Extrapolate.CLAMP);
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const likeOpacity = useAnimatedStyle(() => ({ opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolate.CLAMP) }));
  const nopeOpacity = useAnimatedStyle(() => ({ opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolate.CLAMP) }));
  const superLikeOpacity = useAnimatedStyle(() => ({ opacity: interpolate(translateY.value, [0, SUPERLIKE_THRESHOLD], [0, 1], Extrapolate.CLAMP) }));

  const changePhoto = (direction: 'next' | 'prev') => {
    if (profile.photos.length <= 1) return;
    setActivePhotoIndex(i =>
      direction === 'next'
        ? (i + 1) % profile.photos.length
        : (i - 1 + profile.photos.length) % profile.photos.length
    );
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} activeOffsetX={[-30, 30]}>
      <Animated.View style={[styles.card, { zIndex }, cardStyle]}>
        <Image source={{ uri: profile.photos[activePhotoIndex] }} style={styles.image} />

        <View style={styles.photoProgressContainer}>
          {profile.photos.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setActivePhotoIndex(i)} style={styles.photoProgressTouchable}>
              <View style={[styles.photoProgressIndicator, { opacity: i === activePhotoIndex ? 1 : 0.5 }]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Info icon absolutely positioned above everything */}
        <TouchableOpacity
          style={styles.infoIconButton}
          onPress={() => onViewProfile(profile)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <InfoIcon width={28} height={28} color="rgba(255,255,255,0.95)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.prevPhoto} onPress={() => changePhoto('prev')} />
        <TouchableOpacity style={styles.nextPhoto} onPress={() => changePhoto('next')} />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          {profile.vibe && (
            <View style={styles.vibeContainer}>
              <Text style={styles.vibeText}>{profile.vibe}</Text>
            </View>
          )}
          <View style={styles.nameRow}>
            <Text style={styles.name}>
              {profile.name} <Text style={styles.age}>{profile.age}</Text>
            </Text>
            {profile.zodiac && <Text style={styles.zodiac}>{profile.zodiac.split(' ')[0]}</Text>}
          </View>
          <Text style={styles.detailsText}>{profile.pronouns} · {profile.occupation}</Text>
          {profile.distance < 9999 && (
            <Text style={styles.detailsText}>📍 {profile.distance.toFixed(1)} miles away</Text>
          )}
          <Text style={styles.bio} numberOfLines={2}>{profile.bio}</Text>
          {profile.interests.length > 0 && (
            <View style={styles.interestsContainer}>
              {profile.interests.slice(0, 3).map(interest => (
                <View key={interest} style={styles.interestChip}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          )}
        </LinearGradient>

        {/* Animated overlays for tap actions */}
        {actionOverlay === 'like' && (
          <Animated.View style={[styles.overlay, styles.like, { opacity: 1, transform: [{ scale: 1.2 }] }]}>
            <Text style={styles.overlayText}>LIKE</Text>
          </Animated.View>
        )}
        {actionOverlay === 'dislike' && (
          <Animated.View style={[styles.overlay, styles.nope, { opacity: 1, transform: [{ scale: 1.2 }] }]}>
            <Text style={styles.overlayText}>NOPE</Text>
          </Animated.View>
        )}
        {actionOverlay === 'superlike' && (
          <Animated.View style={[styles.overlay, styles.superlike, { opacity: 1, transform: [{ scale: 1.2 }] }]}>
            <Text style={styles.overlayText}>SUPERLIKE</Text>
          </Animated.View>
        )}

        {/* Swipe Feedback Labels (for gestures) */}
        <Animated.View style={[styles.overlay, styles.like, likeOpacity]}>
          <Text style={styles.overlayText}>LIKE</Text>
        </Animated.View>
        <Animated.View style={[styles.overlay, styles.nope, nopeOpacity]}>
          <Text style={styles.overlayText}>NOPE</Text>
        </Animated.View>
        <Animated.View style={[styles.overlay, styles.superlike, superLikeOpacity]}>
          <Text style={styles.overlayText}>SUPERLIKE</Text>
        </Animated.View>

        {/* Action Buttons */}
        {/* <View style={styles.bottomActionContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.nopeButton]} onPress={() => handleManualSwipe('dislike')}>
            <Text style={styles.actionText}>✖️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.superlikeButton]} onPress={() => handleManualSwipe('superlike')}>
            <Text style={styles.actionText}>⭐️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={() => handleManualSwipe('like')}>
            <Text style={styles.actionText}>❤️</Text>
          </TouchableOpacity>
        </View> */}
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '115%',
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    position: 'absolute',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  gradient: {
    padding: 20,
    paddingTop: 10,
  },
  vibeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  vibeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  age: {
    fontWeight: '300',
  },
  zodiac: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.8)',
  },
  detailsText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  bio: {
    color: '#e2e8f0',
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  interestChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  interestText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  overlay: {
    position: 'absolute',
    borderRadius: 8,
    borderWidth: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  overlayText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  like: {
    top: 12,
    left: 20,
    borderColor: '#F06292',
    transform: [{ rotate: '-12deg' }],
  },
  nope: {
    top: 12,
    right: 20,
    borderColor: '#64748b',
    transform: [{ rotate: '12deg' }],
  },
  superlike: {
    bottom: '55%',
    alignSelf: 'center',
    borderColor: '#FFC107',
  },
  photoProgressContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    gap: 4,
    zIndex: 2,
  },
  photoProgressTouchable: {
    flex: 1,
    height: '100%',
  },
  photoProgressIndicator: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  prevPhoto: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '50%',
    zIndex: 1,
  },
  nextPhoto: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: '50%',
    zIndex: 1,
  },
  infoIconButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 20,
    padding: 4,
  },
  bottomActionContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  actionText: {
    fontSize: 28,
  },
  likeButton: {
    backgroundColor: '#d1fae5',
  },
  nopeButton: {
    backgroundColor: '#fee2e2',
  },
  superlikeButton: {
    backgroundColor: '#e0e7ff',
  },
});