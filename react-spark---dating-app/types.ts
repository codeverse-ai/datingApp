export interface Location {
  lat: number;
  lon: number;
}

export interface NamedLocation {
  name: string;
  location: Location;
}

export type Gender = 'Man' | 'Woman' | 'Non-binary' | 'Other' | 'Prefer not to say';

export interface Profile {
  id: string;
  name: string;
  age: number;
  pronouns: string;
  occupation: string;
  bio: string;
  photos: string[];
  location: Location;
  gender: Gender | null;
  interests: string[];
  orientation: string[];
  vibe: string;
  zodiac: string;
}

export interface ProfileWithDistance extends Profile {
  distance: number;
}

// User will have more private info, like email
export interface User extends Profile {
  email: string;
  onboardingCompleted: boolean;
  likedProfiles: Profile[];
  matches: Profile[];
  isPremium: boolean;
  chats: Record<string, ChatMessage[]>;
  zenMode: {
    enabled: boolean;
    lastAffirmation: string;
  };
}

export type SocialLoginProvider = 'google' | 'facebook';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  socialLogin: (provider: SocialLoginProvider) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  upgradeToPremium: () => Promise<void>;
  sendMessage: (recipientId: string, text: string) => Promise<void>;
  toggleZenMode: () => Promise<void>;
}

export interface FilterState {
  ageRange: [number, number];
  maxDistance: number;
  requiredInterests: string[];
  mustHaveBio: boolean;
  searchLocation: NamedLocation | null;
}

export interface FilterContextType {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export type AppRoute = 
  | '/' 
  | '/login' 
  | '/register' 
  | '/onboarding/gender'
  | '/onboarding/orientation'
  | '/onboarding/interests'
  | '/app' 
  | '/explore'
  | '/matches'
  | '/chats'
  | '/chat' // Base for dynamic route
  | `/chat/${string}`
  | '/profile'
  | '/filters'
  | '/payment'
  | '/zen';

export type NavbarRoute = '/app' | '/explore' | '/matches' | '/chats' | '/profile';

export interface IconProps {
  className?: string;
  variant?: 'outline' | 'solid';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ExploreCategory {
  name: string;
  interests: string[];
}