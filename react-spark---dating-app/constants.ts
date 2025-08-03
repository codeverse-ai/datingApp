import type { Profile, User, ChatMessage, NamedLocation, ExploreCategory } from './types';

export const INTERESTS = [
  "Travel", "Hiking", "Photography", "Cooking", "Music", "Movies", "Art",
  "Gaming", "Reading", "Yoga", "Fitness", "Dancing", "Sports", "Wine",
  "Craft Beer", "Technology", "Fashion", "Animals", "Volunteering", "Podcasts",
  "Startups", "History", "Politics", "Writing", "Comedy"
];

export const ORIENTATIONS = ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Asexual', 'Pansexual', 'Queer', 'Questioning'];

export const VIBES = ['❤️ Serious', '🗓️ Casual dates', '💬 Just chatting', '👯 New friends', '🤔 Figuring it out'];
export const ZODIAC_SIGNS = ['♈ Aries', '♉ Taurus', '♊ Gemini', '♋ Cancer', '♌ Leo', '♍ Virgo', '♎ Libra', '♏ Scorpio', '♐ Sagittarius', '♑ Capricorn', '♒ Aquarius', '♓ Pisces'];

export const PREDEFINED_LOCATIONS: NamedLocation[] = [
  { name: 'Los Angeles', location: { lat: 34.0522, lon: -118.2437 } },
  { name: 'New York City', location: { lat: 40.7128, lon: -74.0060 } },
  { name: 'Chicago', location: { lat: 41.8781, lon: -87.6298 } },
  { name: 'Miami', location: { lat: 25.7617, lon: -80.1918 } },
  { name: 'London', location: { lat: 51.5074, lon: -0.1278 } },
  { name: 'Tokyo', location: { lat: 35.6895, lon: 139.6917 } },
];

export const EXPLORE_CATEGORIES: ExploreCategory[] = [
  { name: 'All', interests: [] },
  { name: 'Foodies', interests: ['Cooking', 'Wine', 'Craft Beer'] },
  { name: 'Travelers', interests: ['Travel', 'Hiking'] },
  { name: 'Creatives', interests: ['Art', 'Photography', 'Music', 'Writing', 'Fashion'] },
  { name: 'Night Owls', interests: ['Movies', 'Gaming', 'Comedy', 'Dancing'] },
  { name: 'Activists', interests: ['Volunteering', 'Politics', 'Animals'] },
];

export const DAILY_AFFIRMATIONS = [
  "You are worthy of love and connection.",
  "Your authentic self is your greatest attraction.",
  "Patience in dating is a form of self-respect.",
  "Every interaction is a chance to learn and grow.",
  "You deserve a relationship that feels like peace.",
  "Being single is an opportunity for self-discovery.",
  "You are complete, with or without a partner."
];


export const MOCK_PROFILES: Profile[] = [
  {
    id: 'jessica-match', // Special ID to trigger a match
    name: 'Jessica',
    age: 28,
    pronouns: 'she/her',
    occupation: 'Marketing Manager',
    bio: 'Lover of hiking, dogs, and trying new craft breweries. Looking for someone to join me on my next adventure! 🏔️🍺',
    photos: ['https://picsum.photos/seed/jessica/400/600', 'https://picsum.photos/seed/jessica2/400/600'],
    location: { lat: 34.0522, lon: -118.2437 }, // Los Angeles
    gender: 'Woman',
    interests: ['Hiking', 'Animals', 'Craft Beer', 'Travel'],
    orientation: ['Straight'],
    vibe: VIBES[0],
    zodiac: ZODIAC_SIGNS[3],
  },
  {
    id: '2',
    name: 'Alex',
    age: 31,
    pronouns: 'they/them',
    occupation: 'Musician',
    bio: 'Software engineer by day, musician by night. My life is a mix of code and chords. Let\'s write our own song.',
    photos: ['https://picsum.photos/seed/alex/400/600', 'https://picsum.photos/seed/alex2/400/600', 'https://picsum.photos/seed/alex3/400/600'],
    location: { lat: 34.0622, lon: -118.2537 }, // Near LA
    gender: 'Non-binary',
    interests: ['Music', 'Technology', 'Reading', 'Creatives'],
    orientation: ['Pansexual'],
    vibe: VIBES[1],
    zodiac: ZODIAC_SIGNS[10],
  },
  {
    id: '3',
    name: 'Chloe',
    age: 25,
    pronouns: 'she/her',
    occupation: 'Graphic Designer',
    bio: 'Graphic designer with a passion for vintage films and spicy food. Tell me your favorite movie and I\'ll tell you mine.',
    photos: ['https://picsum.photos/seed/chloe/400/600'],
    location: { lat: 40.7128, lon: -74.0060 }, // New York
    gender: 'Woman',
    interests: ['Movies', 'Art', 'Cooking', 'Foodies', 'Creatives'],
    orientation: ['Bisexual'],
    vibe: VIBES[2],
    zodiac: ZODIAC_SIGNS[1],
  },
  {
    id: '4',
    name: 'Marcus',
    age: 29,
    pronouns: 'he/him',
    occupation: 'Personal Trainer',
    bio: 'Fitness enthusiast and personal trainer. I can probably lift more than you. 😉 Looking for a workout partner and more.',
    photos: ['https://picsum.photos/seed/marcus/400/600', 'https://picsum.photos/seed/marcus2/400/600'],
    location: { lat: 34.1522, lon: -118.2437 }, // A bit further from LA
    gender: 'Man',
    interests: ['Fitness', 'Sports', 'Cooking'],
    orientation: ['Straight'],
    vibe: VIBES[1],
    zodiac: ZODIAC_SIGNS[0],
  },
  {
    id: '5',
    name: 'Sophia',
    age: 33,
    pronouns: 'she/her',
    occupation: 'Chef',
    bio: 'World traveler and foodie. I have a story for every stamp in my passport. What\'s your dream destination?',
    photos: ['https://picsum.photos/seed/sophia/400/600', 'https://picsum.photos/seed/sophia2/400/600', 'https://picsum.photos/seed/sophia3/400/600'],
    location: { lat: 34.0522, lon: -118.4437 }, // Santa Monica
    gender: 'Woman',
    interests: ['Travel', 'Cooking', 'Photography', 'Foodies', 'Travelers'],
    orientation: ['Straight'],
    vibe: VIBES[4],
    zodiac: ZODIAC_SIGNS[6],
  },
  {
    id: '6',
    name: 'Liam',
    age: 27,
    pronouns: 'he/him',
    occupation: 'Librarian',
    bio: 'Just a simple guy who loves to read, cook, and enjoy quiet nights in. If you appreciate a good book and a home-cooked meal, we\'ll get along great.',
    photos: ['https://picsum.photos/seed/liam/400/600', 'https://picsum.photos/seed/liam2/400/600'],
    location: { lat: 36.1699, lon: -115.1398 }, // Las Vegas
    gender: 'Man',
    interests: ['Reading', 'Cooking', 'Movies', 'Foodies'],
    orientation: ['Bisexual'],
    vibe: VIBES[0],
    zodiac: ZODIAC_SIGNS[8],
  },
  {
    id: '7',
    name: 'Aria',
    age: 26,
    pronouns: 'she/her',
    occupation: 'Yoga Instructor',
    bio: '',
    photos: ['https://picsum.photos/seed/aria/400/600'],
    location: { lat: 34.0582, lon: -118.2497 }, // LA
    gender: 'Woman',
    interests: ['Yoga', 'Animals', 'Reading', 'Activists'],
    orientation: ['Lesbian'],
    vibe: VIBES[3],
    zodiac: ZODIAC_SIGNS[11],
  },
  {
    id: '8',
    name: 'Leo',
    age: 35,
    pronouns: 'he/him',
    occupation: 'Architect',
    bio: 'Architect who enjoys sketching cityscapes and weekend getaways to the mountains. Let\'s build something together.',
    photos: ['https://picsum.photos/seed/leo/400/600', 'https://picsum.photos/seed/leo2/400/600'],
    location: { lat: 41.8781, lon: -87.6298 }, // Chicago
    gender: 'Man',
    interests: ['Art', 'Travel', 'Hiking', 'Creatives', 'Travelers'],
    orientation: ['Gay'],
    vibe: VIBES[0],
    zodiac: ZODIAC_SIGNS[4],
  },
  {
    id: '9',
    name: 'Maya',
    age: 29,
    pronouns: 'she/her',
    occupation: 'Veterinarian',
    bio: 'Veterinarian with a big heart for all creatures. My dog is my co-pilot. Adventure awaits!',
    photos: ['https://picsum.photos/seed/maya/400/600', 'https://picsum.photos/seed/maya2/400/600'],
    location: { lat: 33.7490, lon: -84.3880 }, // Atlanta
    gender: 'Woman',
    interests: ['Animals', 'Volunteering', 'Hiking', 'Activists'],
    orientation: ['Straight'],
    vibe: VIBES[3],
    zodiac: ZODIAC_SIGNS[7],
  },
  {
    id: '10',
    name: 'Finn',
    age: 24,
    pronouns: 'he/him',
    occupation: 'Musician',
    bio: 'Musician and surfer. Chasing waves by day and writing songs by night. Let\'s find a rhythm.',
    photos: ['https://picsum.photos/seed/finn/400/600'],
    location: { lat: 32.7157, lon: -117.1611 }, // San Diego
    gender: 'Man',
    interests: ['Music', 'Sports', 'Travel', 'Creatives'],
    orientation: ['Straight'],
    vibe: VIBES[2],
    zodiac: ZODIAC_SIGNS[5],
  }
];

// Mock user database
export const MOCK_USERS: User[] = [
    {
      id: 'user-0',
      name: 'Chris',
      age: 30,
      pronouns: 'he/him',
      occupation: 'Software Engineer',
      bio: 'Developer building cool things. Let\'s connect!',
      photos: ['https://picsum.photos/seed/chris/400/600'],
      email: 'chris@example.com',
      location: { lat: 34.0522, lon: -118.2437 }, // Los Angeles
      gender: 'Man',
      interests: ['Technology', 'Gaming', 'Hiking', 'Travel'],
      orientation: ['Straight'],
      onboardingCompleted: true,
      likedProfiles: MOCK_PROFILES.slice(3, 7),
      vibe: VIBES[0],
      zodiac: ZODIAC_SIGNS[9],
      matches: [
         MOCK_PROFILES.find(p => p.id === '2')!,
         MOCK_PROFILES.find(p => p.id === '5')!,
         MOCK_PROFILES.find(p => p.id === '9')!,
      ],
      isPremium: false,
      chats: {
        '2': [
            { id: 'msg1', senderId: 'user-0', text: 'Hey Alex! You matched with me. I love your music vibe.', timestamp: '10:30 AM' },
            { id: 'msg2', senderId: '2', text: 'Hey Chris! Thanks, right back at you. That photo of you hiking looks awesome.', timestamp: '10:32 AM' },
            { id: 'msg3', senderId: 'user-0', text: 'Thanks! We should definitely talk more about tech and tunes sometime.', timestamp: '10:33 AM' },
            { id: 'msg4', senderId: '2', text: 'For sure! What kind of music are you into?', timestamp: '10:35 AM' },
        ],
        '9': [
            { id: 'msg5', senderId: 'user-0', text: 'Hey Maya, saw we matched. Your dog is adorable!', timestamp: 'Yesterday' },
            { id: 'msg6', senderId: '9', text: 'Thanks! He\'s my best friend. You seem like an adventurer!', timestamp: 'Yesterday' },
        ]
      },
      zenMode: { enabled: false, lastAffirmation: '' },
    }
];