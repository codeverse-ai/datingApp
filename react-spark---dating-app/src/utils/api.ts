import type { User, Profile, SocialLoginProvider, ChatListItem } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('spark_auth_token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

// --- Auth ---
export const apiLogin = async (email: string, pass: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, pass }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
};

export const apiRegister = async (name: string, email: string, pass: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, email, pass }),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
};

export const apiGetMe = async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
};

// --- Profiles & Chats ---
export const apiGetDiscoverProfiles = async (): Promise<Profile[]> => {
    const response = await fetch(`${API_BASE_URL}/profiles/discover`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch profiles');
    return response.json();
};

export const apiGetExploreProfiles = async (categoryInterests: string[]): Promise<Profile[]> => {
    const params = new URLSearchParams();
    if (categoryInterests.length > 0) {
        params.append('categoryInterests', categoryInterests.join(','));
    }
    const response = await fetch(`${API_BASE_URL}/profiles/explore?${params.toString()}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch explore profiles');
    return response.json();
};

export const apiGetProfileById = async (id: string): Promise<Profile> => {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, { headers: getAuthHeaders() });
     if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
}

export const apiGetChats = async (): Promise<ChatListItem[]> => {
    const response = await fetch(`${API_BASE_URL}/chats`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch chats');
    return response.json();
}

// --- User Actions ---
export const apiUpdateUser = async (updatedData: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
};

export const apiSwipe = async (profileId: string, decision: 'like' | 'dislike' | 'superlike') => {
    const response = await fetch(`${API_BASE_URL}/swipes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ profileId, decision }),
    });
    if (!response.ok) throw new Error('Swipe action failed');
    return response.json();
};

export const apiSendMessage = async (recipientId: string, text: string) => {
    const response = await fetch(`${API_BASE_URL}/chats/${recipientId}/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
};

// --- AI ---
export const apiGetAiIcebreaker = async (user: User, otherProfile: Profile): Promise<{ suggestion: string }> => {
    const response = await fetch(`${API_BASE_URL}/ai/icebreaker`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ user, otherProfile }),
    });
    if (!response.ok) throw new Error('Failed to get AI icebreaker');
    return response.json();
};

export const apiGetAiDateIdea = async (user: User, otherProfile: Profile): Promise<{ suggestion: string }> => {
    const response = await fetch(`${API_BASE_URL}/ai/date-idea`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ user, otherProfile }),
    });
    if (!response.ok) throw new Error('Failed to get AI date idea');
    return response.json();
};