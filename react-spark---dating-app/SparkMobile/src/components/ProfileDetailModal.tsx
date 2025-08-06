import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { ProfileWithDistance } from '../types';
import { useAuth } from '../hooks/useAuth';
import { XIcon } from './icons/XIcon';
import { PlayCircleIcon, MicrophoneIcon } from './icons/MediaIcons';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileDetailModalProps {
    profile: ProfileWithDistance;
    visible: boolean;
    onClose: () => void;
    onLike?: (profile: ProfileWithDistance) => void;
    onNope?: (profile: ProfileWithDistance) => void;
    onSuperlike?: (profile: ProfileWithDistance) => void;
}

const ZodiacIcon: React.FC<{ sign: string, style?: object }> = ({ sign, style }) => {
  const signSymbol = sign.split(' ')[0] || '';
  return <Text style={style}>{signSymbol}</Text>
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
    profile,
    visible,
    onClose,
    onLike,
    onNope,
    onSuperlike,
}) => {
    const navigation = useNavigation<any>();
    const [activePhotoIndex, setActivePhotoIndex] = useState(0);
    const [newMessage, setNewMessage] = useState('');
    const { sendMessage, user } = useAuth();
    const [isSending, setIsSending] = useState(false);

    const nextPhoto = () => setActivePhotoIndex(i => (i + 1) % profile.photos.length);
    const prevPhoto = () => setActivePhotoIndex(i => (i - 1 + profile.photos.length) % profile.photos.length);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user || isSending) return;

        setIsSending(true);
        await sendMessage(profile.id, newMessage.trim());
        setIsSending(false);
        onClose();
        navigation.navigate('Chat', { matchId: profile.id });
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView 
                style={styles.flex} 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <View style={styles.flex}>
                    <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
                        <View style={styles.imageContainer}>
                            <Image
                                key={activePhotoIndex}
                                source={{ uri: profile.photos[activePhotoIndex] }}
                                style={styles.image}
                            />
                            {profile.photos.length > 1 && (
                                <View style={styles.photoNav}>
                                    <TouchableOpacity onPress={prevPhoto} style={styles.photoArrow}>
                                        <Text style={styles.arrowText}>‹</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={nextPhoto} style={styles.photoArrow}>
                                        <Text style={styles.arrowText}>›</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <XIcon width={24} height={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.content}>
                            <View style={styles.section}>
                                <View style={styles.nameRow}>
                                    <Text style={styles.name}>{profile.name}, {profile.age}</Text>
                                    {profile.zodiac && <ZodiacIcon sign={profile.zodiac} style={styles.zodiac} />}
                                </View>
                                <Text style={styles.detailsText}>{profile.occupation}</Text>
                                {profile.distance < 9999 && (
                                    <Text style={styles.detailsText}>{profile.distance.toFixed(1)} miles away</Text>
                                )}
                                {profile.vibe && (
                                    <View style={styles.vibeContainer}>
                                        <Text style={styles.vibeText}>{profile.vibe}</Text>
                                    </View>
                                )}
                            </View>
                                  {/* ACTION BUTTONS */}
                            <View style={styles.actionRow}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.nopeButton]}
                                    onPress={() => {
                                        onNope && onNope(profile);
                                        onClose();
                                    }}
                                >
                                    <Text style={styles.actionIcon}>✖️</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.superlikeButton]}
                                    onPress={() => {
                                        onSuperlike && onSuperlike(profile);
                                        onClose();
                                    }}
                                >
                                    <Text style={styles.actionIcon}>⭐️</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.likeButton]}
                                    onPress={() => {
                                        onLike && onLike(profile);
                                        onClose();
                                    }}
                                >
                                    <Text style={styles.actionIcon}>❤️</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.separator} />

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Video Intro</Text>
                                <TouchableOpacity style={styles.videoPlaceholder}>
                                    <PlayCircleIcon width={48} height={48} color="#9ca3af" />
                                </TouchableOpacity>
                            </View>
                            
                            {profile.bio ? (
                                <View style={styles.section}>
                                    <Text style={styles.bio}>{profile.bio}</Text>
                                </View>
                            ) : null}

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Voice Prompts</Text>
                                <TouchableOpacity style={styles.promptContainer}>
                                    <MicrophoneIcon width={24} height={24} color="#f472b6" />
                                    <View style={styles.promptTextContainer}>
                                        <Text style={styles.promptQuestion}>My perfect date would be...</Text>
                                        <Text style={styles.promptAnswer}>No answer yet.</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.promptContainer}>
                                    <MicrophoneIcon width={24} height={24} color="#f472b6" />
                                    <View style={styles.promptTextContainer}>
                                        <Text style={styles.promptQuestion}>If I were a meme...</Text>
                                        <Text style={styles.promptAnswer}>No answer yet.</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Interests</Text>
                                <View style={styles.interestsContainer}>
                                    {profile.interests.map(interest => (
                                        <View key={interest} style={styles.interestChip}>
                                            <Text style={styles.interestText}>{interest}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                          
                        </View>
                    </ScrollView>

                    <SafeAreaView style={styles.footer} edges={['bottom']}>
                        <TextInput
                            value={newMessage}
                            onChangeText={setNewMessage}
                            placeholder={`Message ${profile.name}...`}
                            style={styles.input}
                            placeholderTextColor="#9ca3af"
                        />
                        <TouchableOpacity onPress={handleSendMessage} disabled={!newMessage.trim() || isSending} style={[styles.sendButton, (!newMessage.trim() || isSending) && styles.disabledButton]}>
                             <LinearGradient
                                colors={['#f472b6', '#2dd4bf']}
                                style={styles.sendButtonGradient}
                            >
                                <Text style={styles.sendText}>Send</Text>
                             </LinearGradient>
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    imageContainer: {
        width: '100%',
        height: 500,
        backgroundColor: '#d1d5db',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 8,
        borderRadius: 20,
    },
    photoNav: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
    },
    photoArrow: {
        flex: 1,
        justifyContent: 'center',
    },
    arrowText: {
        color: 'white',
        fontSize: 50,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowRadius: 5,
        paddingHorizontal: 10,
    },
    content: {
        padding: 20,
        backgroundColor: '#f8fafc',
    },
    section: {
        marginBottom: 24,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 12,
        marginBottom: 4,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
    },
    zodiac: {
        fontSize: 24,
        color: '#6b7280',
    },
    detailsText: {
        fontSize: 16,
        color: '#4b5563',
        textTransform: 'capitalize',
        lineHeight: 22,
    },
    vibeContainer: {
        backgroundColor: '#fce7f3',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 12,
    },
    vibeText: {
        color: '#be185d',
        fontWeight: '600',
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        marginVertical: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 12,
    },
    videoPlaceholder: {
        width: '100%',
        aspectRatio: 16/9,
        backgroundColor: '#e5e7eb',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bio: {
        fontSize: 16,
        lineHeight: 24,
        color: '#374151',
    },
    promptContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    promptTextContainer: {
        marginLeft: 12,
    },
    promptQuestion: {
        fontSize: 12,
        color: '#6b7280',
    },
    promptAnswer: {
        fontSize: 14,
        color: '#374151',
        fontStyle: 'italic',
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    interestChip: {
        backgroundColor: '#ffe4e6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    interestText: {
        color: '#db2777',
        fontWeight: '500',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginVertical: 24,
    },
    actionButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 4,
        marginHorizontal: 8,
    },
    actionIcon: {
        fontSize: 32,
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
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    input: {
        flex: 1,
        height: 44,
        backgroundColor: '#f3f4f6',
        borderRadius: 22,
        paddingHorizontal: 16,
        marginRight: 12,
        fontSize: 16,
    },
    sendButton: {
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonGradient: {
        paddingHorizontal: 20,
        height: '100%',
        justifyContent: 'center',
        borderRadius: 22,
    },
    sendText: {
        color: 'white',
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.5,
    },
});