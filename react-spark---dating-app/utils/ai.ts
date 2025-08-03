
import type { User, Profile } from '../types';
import { apiGetAiIcebreaker, apiGetAiDateIdea } from './api';

export async function getAiIcebreaker(user: User, otherProfile: Profile): Promise<string> {
    try {
        const { suggestion } = await apiGetAiIcebreaker(user, otherProfile);
        return suggestion;
    } catch (error) {
        console.error("Error fetching AI icebreaker:", error);
        return "I was going to say something clever about your profile, but I got lost in your eyes. 😉 How's your week going?";
    }
}

export async function getAiDateIdea(user: User, otherProfile: Profile): Promise<string> {
    try {
        const { suggestion } = await apiGetAiDateIdea(user, otherProfile);
        return suggestion;
    } catch (error) {
        console.error("Error fetching AI date idea:", error);
        return "How about we grab a coffee or a drink sometime this week and see if the vibe is as good in person? 😊";
    }
}
