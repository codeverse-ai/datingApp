

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { User, AuthContextType, SocialLoginProvider } from '../types';
import { apiLogin, apiRegister, apiGetMe, apiUpdateUser, apiSendMessage } from '../utils/api';
import { DAILY_AFFIRMATIONS } from '../constants';

export const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'spark_auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const fetchedUser = await apiGetMe();
          setUser(fetchedUser);
        } catch (error) {
          console.error("Session token is invalid, logging out.", error);
          logout();
        }
      }
      setLoading(false);
    };
    validateToken();
  }, [token]);

  const setSession = useCallback((user: User, authToken: string) => {
    setUser(user);
    setToken(authToken);
    localStorage.setItem(TOKEN_KEY, authToken);
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    try {
      const { user: loggedInUser, token: authToken } = await apiLogin(email, pass);
      setSession(loggedInUser, authToken);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }, [setSession]);

  const socialLogin = useCallback(async (provider: SocialLoginProvider): Promise<boolean> => {
    // This is a mock implementation. In a real app, this would involve a complex OAuth2 flow.
    // We'll simulate it by calling our register/login endpoints.
    const email = `${provider}_user@example.com`;
    try {
      const { user: loggedInUser, token: authToken } = await apiLogin(email, 'social_password');
      setSession(loggedInUser, authToken);
      return true;
    } catch {
      // User doesn't exist, so register them.
      const { user: newUser, token: authToken } = await apiRegister(`${provider} User`, email, 'social_password');
      setSession(newUser, authToken);
      return true;
    }
  }, [setSession]);

  const register = useCallback(async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      const { user: newUser, token: authToken } = await apiRegister(name, email, pass);
      setSession(newUser, authToken);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  }, [setSession]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    window.location.hash = '/login';
  }, []);

  const updateUser = useCallback(async (updatedData: Partial<User>): Promise<void> => {
    if (!user) return;
    try {
      const updatedUser = await apiUpdateUser(updatedData);
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  }, [user]);

  const upgradeToPremium = useCallback(async (): Promise<void> => {
    if (!user) return;
    await updateUser({ isPremium: true });
  }, [user, updateUser]);

  const sendMessage = useCallback(async (recipientId: string, text: string): Promise<void> => {
    if (!user) return;
    try {
      await apiSendMessage(recipientId, text);
      // Re-fetch user to get updated chats
      const updatedUser = await apiGetMe();
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [user]);
  
  const toggleZenMode = useCallback(async (): Promise<void> => {
    if(!user) return;
    const newZenState = !user.zenMode.enabled;
    const affirmation = newZenState ? DAILY_AFFIRMATIONS[Math.floor(Math.random() * DAILY_AFFIRMATIONS.length)] : '';
    await updateUser({ zenMode: { enabled: newZenState, lastAffirmation: affirmation }});
  }, [user, updateUser]);

  const value = useMemo(() => ({ user, token, loading, login, register, logout, updateUser, socialLogin, upgradeToPremium, sendMessage, toggleZenMode }), [user, token, loading, login, register, logout, updateUser, socialLogin, upgradeToPremium, sendMessage, toggleZenMode]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};