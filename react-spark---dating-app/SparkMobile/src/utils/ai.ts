
import type { User, Profile } from '../types';

export async function getAiIcebreaker(user: User, otherProfile: Profile): Promise<string> {
    // Simulate network delay
    await new Promise(res => setTimeout(res, 1000));
    
    const sharedInterests = user.interests.filter(i => otherProfile.interests.includes(i));
    
    if (sharedInterests.length > 0) {
        return `I saw you're also into ${sharedInterests[0]}! What's your favorite part about it?`;
    }
    
    return `Hey ${otherProfile.name}, your profile looks really interesting! How's your week going?`;
}

export async function getAiDateIdea(user: User, otherProfile: Profile): Promise<string> {
    // Simulate network delay
    await new Promise(res => setTimeout(res, 1000));
    
    const sharedInterests = user.interests.filter(i => otherProfile.interests.includes(i));

    if (sharedInterests.includes('Cooking') || sharedInterests.includes('Foodies')) {
        return "Since we both love food, how about we find the best tacos in the city sometime?";
    }
     if (sharedInterests.includes('Hiking')) {
        return "We should totally hit up a trail sometime! Know any good spots around here?";
    }
    
    return "How about we grab a coffee or a drink sometime this week and see if the vibe is as good in person? 😊";
}
