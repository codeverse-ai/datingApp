
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
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

const PhotoProgress: React.FC<{ count: number; activeIndex: number, onPress: (index: number) => void }> = ({ count, activeIndex, onPress }) => (
  <View style={styles.photoProgressContainer}>
    {Array.from({ length: count }).map((_, i) => (
      <TouchableOpacity key={i} onPress={() => onPress(i)} style={styles.photoProgressTouchable}>
        <View style={[styles.photoProgressIndicator, { opacity: i === activeIndex ? 1 : 0.5 }]} />
      </TouchableOpacity>
    ))}
  </View>
);

const ZodiacIcon: React.FC<{ sign: string, style?: object }> = ({ sign, style }) => {
  const signSymbol = sign.split(' ')[0] || '';
  return <Text style={style}>{signSymbol}</Text>
}

import { TouchableOpacity } from 'react-native-gesture-handler';

export const DatingCard: React.FC<DatingCardProps> = ({ profile, onSwipe, onViewProfile, zIndex }) => {
  const { width: screenWidth } = useWindowDimensions();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const SWIPE_THRESHOLD = screenWidth * 0.4;
  const SUPERLIKE_THRESHOLD = -120;

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number; startY: number }>({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
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
      ] as const,
    };
  });
  
  const likeOpacity = useAnimatedStyle(() => ({ opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolate.CLAMP) }));
  const nopeOpacity = useAnimatedStyle(() => ({ opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolate.CLAMP) }));
  const superLikeOpacity = useAnimatedStyle(() => ({ opacity: interpolate(translateY.value, [0, SUPERLIKE_THRESHOLD], [0, 1], Extrapolate.CLAMP) }));


  const changePhoto = (direction: 'next' | 'prev') => {
    if (profile.photos.length <= 1) return;
    if (direction === 'next') {
      setActivePhotoIndex(i => (i + 1) % profile.photos.length);
    } else {
      setActivePhotoIndex(i => (i - 1 + profile.photos.length) % profile.photos.length);
    }
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} activeOffsetX={[-30, 30]}>
      <Animated.View style={[styles.card, {zIndex}, cardStyle]}>
        <Image
          source={{ uri: profile.photos[activePhotoIndex] }}
          style={styles.image}
        />

        {profile.photos.length > 1 && (
            <>
                <PhotoProgress count={profile.photos.length} activeIndex={activePhotoIndex} onPress={setActivePhotoIndex} />
                <TouchableOpacity style={styles.prevPhoto} onPress={() => changePhoto('prev')} />
                <TouchableOpacity style={styles.nextPhoto} onPress={() => changePhoto('next')} />
            </>
        )}

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <TouchableOpacity activeOpacity={0.8} onPress={() => onViewProfile(profile)}>
            {profile.vibe && (
              <View style={styles.vibeContainer}>
                  <Text style={styles.vibeText}>{profile.vibe}</Text>
              </View>
            )}
            <View style={styles.nameRow}>
              <Text style={styles.name}>{profile.name} <Text style={styles.age}>{profile.age}</Text></Text>
              {profile.zodiac && <ZodiacIcon sign={profile.zodiac} style={styles.zodiac} />}
              <InfoIcon width={22} height={22} color="rgba(255,255,255,0.8)" />
            </View>
            <Text style={styles.detailsText}>{profile.pronouns} &bull; {profile.occupation}</Text>
            {profile.distance < 9999 && (
              <Text style={styles.detailsText}>{profile.distance.toFixed(1)} miles away</Text>
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
          </TouchableOpacity>
        </LinearGradient>

        <Animated.View style={[styles.overlay, styles.like, likeOpacity]}><Text style={styles.overlayText}>LIKE</Text></Animated.View>
        <Animated.View style={[styles.overlay, styles.nope, nopeOpacity]}><Text style={styles.overlayText}>NOPE</Text></Animated.View>
        <Animated.View style={[styles.overlay, styles.superlike, superLikeOpacity]}><Text style={styles.overlayText}>SUPER LIKE</Text></Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
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
    top: 20,
    left: 20,
    borderColor: '#F06292',
    transform: [{ rotate: '-12deg' }],
  },
  nope: {
    top: 20,
    right: 20,
    borderColor: '#64748b',
    transform: [{ rotate: '12deg' }],
  },
  superlike: {
    bottom: '50%',
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
  }
});
