
import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { User, Profile } from '../types';

interface MatchAnimationProps {
    user: User;
    matchedUser: Profile;
    onKeepSwiping: () => void;
    onSendMessage: () => void;
}

export const MatchAnimation: React.FC<MatchAnimationProps> = ({ user, matchedUser, onKeepSwiping, onSendMessage }) => {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.exp) });
    }, []);

    const sharedInterests = useMemo(() => {
        const userInterests = new Set(user.interests);
        return matchedUser.interests.filter(interest => userInterests.has(interest));
    }, [user.interests, matchedUser.interests]);

    const titleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(progress.value, [0, 0.5], [0.5, 1], Extrapolate.CLAMP) }],
        opacity: interpolate(progress.value, [0, 0.5], [0, 1])
    }));
    
    const userImageStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: interpolate(progress.value, [0.3, 0.8], [-100, 0], Extrapolate.CLAMP) },
            { rotate: `${interpolate(progress.value, [0.3, 0.8], [-20, -10], Extrapolate.CLAMP)}deg` }
        ],
        opacity: interpolate(progress.value, [0.3, 0.8], [0, 1])
    }));
    
    const matchedImageStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: interpolate(progress.value, [0.3, 0.8], [100, 0], Extrapolate.CLAMP) },
            { rotate: `${interpolate(progress.value, [0.3, 0.8], [20, 10], Extrapolate.CLAMP)}deg` }
        ],
        opacity: interpolate(progress.value, [0.3, 0.8], [0, 1])
    }));
    
    const bottomButtonsStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: interpolate(progress.value, [0.7, 1], [100, 0], Extrapolate.CLAMP) }],
        opacity: interpolate(progress.value, [0.7, 1], [0, 1])
    }));


    return (
        <LinearGradient colors={['rgba(253, 230, 138, 0.7)', 'rgba(252, 211, 77, 0.7)']} style={styles.container}>
            <Animated.Text style={[styles.title, titleStyle]}>It's a Match!</Animated.Text>
            <Text style={styles.subtitle}>You and {matchedUser.name} have liked each other.</Text>

            <View style={styles.imagesContainer}>
                <Animated.View style={userImageStyle}>
                    <Image source={{ uri: user.photos[0] }} style={styles.image} />
                </Animated.View>
                <Animated.View style={matchedImageStyle}>
                    <Image source={{ uri: matchedUser.photos[0] }} style={styles.image} />
                </Animated.View>
            </View>

            {sharedInterests.length > 0 && (
                <View style={styles.interestsSection}>
                    <Text style={styles.interestsTitle}>You both love:</Text>
                    <View style={styles.interestsContainer}>
                        {sharedInterests.map((interest, index) => (
                            <View key={interest} style={styles.interestChip}>
                                <Text style={styles.interestText}>{interest}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            <Animated.View style={[styles.buttonsContainer, bottomButtonsStyle]}>
                <TouchableOpacity onPress={onSendMessage} style={styles.sendMessageButton}>
                    <Text style={styles.sendMessageText}>Send a Message</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onKeepSwiping} style={styles.keepSwipingButton}>
                    <Text style={styles.keepSwipingText}>Keep Swiping</Text>
                </TouchableOpacity>
            </Animated.View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 100,
    },
    title: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#444',
        marginBottom: 40,
    },
    imagesContainer: {
        flexDirection: 'row',
        marginHorizontal: -30,
    },
    image: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: 'white',
        marginHorizontal: -15,
    },
    interestsSection: {
        marginTop: 40,
        alignItems: 'center',
    },
    interestsTitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    interestChip: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    interestText: {
        color: '#c026d3',
        fontWeight: '600',
    },
    buttonsContainer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        alignItems: 'center',
    },
    sendMessageButton: {
        width: '90%',
        padding: 16,
        borderRadius: 50,
        backgroundColor: '#f472b6',
        alignItems: 'center',
        marginBottom: 16,
    },
    sendMessageText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    keepSwipingButton: {
        width: '90%',
        padding: 16,
        borderRadius: 50,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    keepSwipingText: {
        color: '#444',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
