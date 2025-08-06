import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import type { ChatMessage, Profile } from '../types';
import { getAiIcebreaker, getAiDateIdea } from '../utils/ai';
import { MOCK_PROFILES } from '../constants';
import { WandIcon } from '../components/icons/WandIcon';
import { XIcon } from '../components/icons/XIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileDetailModal } from '../components/ProfileDetailModal';

const ChatPage: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { matchId } = route.params;

  const { user, sendMessage } = useAuth();
  const [matchProfile, setMatchProfile] = useState<Profile | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const messages: ChatMessage[] = user?.chats?.[matchId] || [];
  const isNewChat = messages.length <= 2;

  useEffect(() => {
    const profile = MOCK_PROFILES.find(p => p.id === matchId);
    if (profile) setMatchProfile(profile);
  }, [matchId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    await sendMessage(matchId, newMessage.trim());
    setNewMessage('');
    setAiSuggestion(null);
  };

  const handleGetAiSuggestion = async () => {
    if (!user || !matchProfile || isLoadingAi) return;
    setIsLoadingAi(true);
    setAiSuggestion(null);
    try {
      const suggestion = isNewChat 
        ? await getAiIcebreaker(user, matchProfile)
        : await getAiDateIdea(user, matchProfile);
      setAiSuggestion(suggestion);
    } catch (error) {
      setAiSuggestion("Sorry, I couldn't think of anything right now.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const useSuggestion = () => {
    if (aiSuggestion) {
      setNewMessage(aiSuggestion);
      setAiSuggestion(null);
    }
  }

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMyMessage = item.senderId === user?.id;
    return (
      <View style={[
        styles.messageRow,
        isMyMessage ? styles.myMessageRow : styles.theirMessageRow
      ]}>
        {!isMyMessage && matchProfile && (
          <Image source={{ uri: matchProfile.photos[0] }} style={styles.avatar} />
        )}
        <LinearGradient
          colors={isMyMessage ? ['#fb7185', '#f472b6'] : ['#f1f5f9', '#e2e8f0']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble
          ]}
        >
          <Text style={isMyMessage ? styles.myMessageText : styles.theirMessageText}>{item.text}</Text>
        </LinearGradient>
      </View>
    );
  };

  if (!matchProfile) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#f472b6" /></View>;
  }

  return (
    <>
      <LinearGradient colors={['#FFF1F2', '#F0F9FF']} style={styles.container}>
        {/* Stylish Header */}
        <SafeAreaView style={styles.headerSafe}>
          <View style={styles.header}>
            <View style={styles.headerProfile}>
              <TouchableOpacity onPress={() => setShowProfileModal(true)}>
                <Image source={{ uri: matchProfile.photos[0] }} style={styles.headerAvatar} />
              </TouchableOpacity>
              <View>
                <Text style={styles.headerName}>{matchProfile.name}</Text>
                <Text style={styles.headerSub}>{matchProfile.occupation}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerClose}>
              <XIcon width={28} height={28} color="#f472b6" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <SafeAreaView style={styles.flex}>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              style={styles.messageList}
              contentContainerStyle={styles.messageListContent}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
              onLayout={() => flatListRef.current?.scrollToEnd()}
            />

            <View style={styles.footer}>
              {aiSuggestion && (
                <TouchableOpacity onPress={useSuggestion} style={styles.suggestionBox}>
                  <Text style={styles.suggestionText}>{aiSuggestion}</Text>
                  <Text style={styles.suggestionTapText}>Tap to use</Text>
                </TouchableOpacity>
              )}
              <View style={styles.inputRow}>
                <TouchableOpacity onPress={handleGetAiSuggestion} disabled={isLoadingAi} style={styles.wandButton}>
                  {isLoadingAi ? <ActivityIndicator color="#f472b6" /> : <WandIcon width={24} height={24} color="#9ca3af" />}
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  value={newMessage}
                  onChangeText={setNewMessage}
                  placeholder="Type a message..."
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity onPress={handleSendMessage} disabled={!newMessage.trim()} style={styles.sendButton}>
                  <LinearGradient
                    colors={['#f472b6', '#fb7185']}
                    style={styles.sendButtonGradient}
                  >
                    <Text style={styles.sendText}>Send</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
      {showProfileModal && (
        <ProfileDetailModal
          profile={matchProfile}
          visible={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  headerSafe: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
    backgroundColor: 'white',
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#f472b6',
  },
  headerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f472b6',
  },
  headerSub: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },
  headerClose: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#fdf2f8',
  },
  flex: {
    flex: 1,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
    paddingBottom: 30,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  theirMessageRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#f472b6',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 14,
    borderRadius: 22,
    shadowColor: '#f472b6',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  myMessageBubble: {
    borderBottomRightRadius: 6,
    marginLeft: '20%',
  },
  theirMessageBubble: {
    borderBottomLeftRadius: 6,
    marginRight: '20%',
  },
  myMessageText: {
    color: 'white',
    fontSize: 16,
  },
  theirMessageText: {
    color: '#1f2937',
    fontSize: 16,
  },
  footer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  suggestionBox: {
    backgroundColor: '#fefce8',
    borderColor: '#fde047',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  suggestionText: {
    color: '#713f12',
    fontSize: 14,
  },
  suggestionTapText: {
    color: '#f472b6',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wandButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#f1f5f9',
    borderRadius: 22,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    fontSize: 16,
  },
  sendButton: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    paddingHorizontal: 20,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  sendText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ChatPage;