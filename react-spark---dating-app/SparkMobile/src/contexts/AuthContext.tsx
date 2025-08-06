
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { User, AuthContextType, SocialLoginProvider, Profile } from '../types';
import { MOCK_USERS, DAILY_AFFIRMATIONS, VIBES, ZODIAC_SIGNS } from '../constants';
import * as api from '../utils/api';
export const AuthContext = createContext<AuthContextType | null>(null);

// This is a mock AuthProvider that simulates a backend using local state.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate initial auth check
  useEffect(() => {
    // For this mock version, we'll just start logged out.
    // In a real app with persistence, you'd check AsyncStorage here.
    setTimeout(() => {
      // To test the authenticated flow immediately, uncomment the line below:
      // setUser(MOCK_USERS[0]);
      setLoading(false);
    }, 1000);
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    // This is a mock login.
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  }, []);
  
  const socialLogin = useCallback(async (provider: SocialLoginProvider): Promise<boolean> => {
    // Simulate finding or creating a social user
    return login(`${provider}_user@example.com`, 'password');
  }, [login]);

  const register = useCallback(async (name: string, email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        setLoading(false);
        return false;
    }
    
    const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        age: 18,
        pronouns: '',
        occupation: '',
        bio: '',
        photos: [],
        location: { lat: 34.0522, lon: -118.2437 },
        gender: null,
        orientation: [],
        interests: [],
        onboardingCompleted: false,
        onboardingStep: 'interests',
        likedProfiles: [],
        superLikedProfiles: [],
        matches: [],
        isPremium: false,
        chats: {},
        vibe: VIBES[4],
        zodiac: ZODIAC_SIGNS[0],
        zenMode: { enabled: false, lastAffirmation: '' },
    };
    
    // In a real app, this would be an API call. Here we just update our mock array.
    MOCK_USERS.push(newUser);
    setUser(newUser);
    setLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUser = useCallback(async (updatedData: Partial<User>): Promise<void> => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    // Also update the user in our "database"
    const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        MOCK_USERS[userIndex] = updatedUser;
    }
  }, [user]);

  const upgradeToPremium = useCallback(async (): Promise<void> => {
    if (!user) return;
    await updateUser({ isPremium: true });
  }, [user, updateUser]);

  const sendMessage = useCallback(async (recipientId: string, text: string): Promise<void> => {
    if (!user) return;
    
    const newMessage = {
        id: `msg-${Date.now()}`,
        senderId: user.id,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newChats = { ...(user.chats || {}) };
    if (!newChats[recipientId]) {
        newChats[recipientId] = [];
    }
    newChats[recipientId].push(newMessage);
    
    await updateUser({ chats: newChats });
  }, [user, updateUser]);
  
  const toggleZenMode = useCallback(async (): Promise<void> => {
    if(!user) return;
    const newZenState = !user.zenMode.enabled;
    const affirmation = newZenState ? DAILY_AFFIRMATIONS[Math.floor(Math.random() * DAILY_AFFIRMATIONS.length)] : '';
    await updateUser({ zenMode: { enabled: newZenState, lastAffirmation: affirmation }});
  }, [user, updateUser]);
  
  const value = useMemo(() => ({ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      updateUser, 
      socialLogin, 
      upgradeToPremium, 
      sendMessage, 
      toggleZenMode,
  }), [user, loading, login, register, logout, updateUser, socialLogin, upgradeToPremium, sendMessage, toggleZenMode]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
