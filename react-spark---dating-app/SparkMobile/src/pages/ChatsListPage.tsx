
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import type { Profile } from '../types';
import { MOCK_PROFILES } from '../constants';
import { ChatBubbleIcon } from '../components/icons/ChatBubbleIcon';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';

type RootStackParamList = {
  Chat: { matchId: string };
};
type ChatsNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;


const ChatsListPage: React.FC = () => {
    const navigation = useNavigation<ChatsNavigationProp>();
    const { user } = useAuth();
    const chats = user?.chats || {};
    const chatEntries = Object.entries(chats);
    
    // Create a map for quick profile lookups from all mock profiles
    const profileMap: Record<string, Profile> = [...MOCK_PROFILES, ...(user?.matches || [])].reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
    }, {} as Record<string, Profile>);

    const sortedChats = chatEntries.sort(([, a], [, b]) => {
        // Mock timestamp sorting - in a real app, use Date objects
        return b.length - a.length;
    }).map(([chatId, messages]) => ({
        chatId,
        otherProfile: profileMap[chatId],
        lastMessage: messages[messages.length - 1]
    })).filter(chat => chat.otherProfile);


    if (chatEntries.length === 0) {
        return (
            <LinearGradient colors={['#FFF1F2', '#F0F9FF']} style={styles.emptyContainer}>
                <SafeAreaView style={styles.safeArea}>
                    <Text style={styles.headerTitle}>Chats</Text>
                    <View style={styles.centered}>
                        <ChatBubbleIcon width={100} height={100} color="#e5e7eb" />
                        <Text style={styles.emptyTitle}>No Chats Yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Your conversations will appear here. Start a chat from someone's profile or after you match!
                        </Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#FFF1F2', '#F0F9FF']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <Text style={styles.headerTitle}>Chats</Text>
                <FlatList
                    data={sortedChats}
                    keyExtractor={item => item.chatId}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                         <TouchableOpacity 
                            style={styles.chatItem}
                            onPress={() => navigation.navigate('Chat', { matchId: item.chatId })}
                         >
                            <Image source={{ uri: item.otherProfile.photos[0] }} style={styles.avatar} />
                            <View style={styles.chatContent}>
                                <Text style={styles.profileName}>{item.otherProfile.name}</Text>
                                <Text style={styles.lastMessage} numberOfLines={1}>
                                    {item.lastMessage.senderId === user?.id && 'You: '}
                                    {item.lastMessage.text}
                                </Text>
                            </View>
                            <Text style={styles.timestamp}>{item.lastMessage.timestamp}</Text>
                        </TouchableOpacity>
                    )}
                />
            </SafeAreaView>
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
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        color: '#f472b6',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2.22,
        elevation: 3,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 16,
        borderWidth: 2,
        borderColor: '#fff',
    },
    chatContent: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    lastMessage: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 2,
    },
    timestamp: {
        fontSize: 12,
        color: '#9ca3af',
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#374151',
        marginTop: 20,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 10,
    }
});

export default ChatsListPage;
