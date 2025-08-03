require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'db.json');
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-key-for-spark-app';

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit for base64 images

// --- DB Helper Functions ---
const readDb = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const writeDb = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// --- AI Setup ---
let ai;
if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} else {
    console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const getModel = () => {
    if (!ai) {
        throw new Error("Gemini AI not initialized. Please set the API_KEY environment variable.");
    }
    return 'gemini-2.5-flash';
};

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Hydration Helper ---
const hydrateUser = (user, db) => {
    const matches = (user.matchIds || []).map(id => db.profiles.find(p => p.id === id)).filter(Boolean);
    const likedProfiles = (user.likedProfileIds || []).map(id => db.profiles.find(p => p.id === id)).filter(Boolean);
    const superLikedProfiles = (user.superLikedProfileIds || []).map(id => db.profiles.find(p => p.id === id)).filter(Boolean);

    const { password, likedProfileIds, matchIds, superLikedProfileIds, ...userForToken } = user;
    return { ...userForToken, matches, likedProfiles, superLikedProfiles };
};


// --- Auth Routes ---
app.post('/api/auth/register', (req, res) => {
    const { name, email, pass } = req.body;
    const db = readDb();
    if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = {
        id: `user-${Date.now()}`,
        password: pass, // In real app, hash this!
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
        likedProfileIds: [],
        superLikedProfileIds: [],
        matchIds: [],
        isPremium: false,
        chats: {},
        vibe: '🤔 Figuring it out',
        zodiac: '♈ Aries',
        zenMode: { enabled: false, lastAffirmation: '' },
    };
    db.users.push(newUser);
    writeDb(db);
    
    const userToSend = hydrateUser(newUser, db);
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: userToSend });
});

app.post('/api/auth/login', (req, res) => {
    const { email, pass } = req.body;
    const db = readDb();
    const user = db.users.find(u => u.email === email && u.password === pass);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const userToSend = hydrateUser(user, db);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: userToSend });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
    const db = readDb();
    const user = db.users.find(u => u.id === req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userToSend = hydrateUser(user, db);
    res.json(userToSend);
});

// --- Main API Routes ---

app.get('/api/profiles/discover', authenticateToken, (req, res) => {
    const db = readDb();
    const currentUser = db.users.find(u => u.id === req.user.userId);
    if (!currentUser) return res.sendStatus(404);

    const seenIds = new Set([...currentUser.likedProfileIds, ...currentUser.superLikedProfileIds, ...currentUser.matchIds, currentUser.id]);
    const unseenProfiles = db.profiles.filter(p => !seenIds.has(p.id));
    res.json(unseenProfiles);
});

app.get('/api/profiles/explore', authenticateToken, (req, res) => {
    const db = readDb();
    const currentUser = db.users.find(u => u.id === req.user.userId);
    if (!currentUser) return res.sendStatus(404);
    
    const { categoryInterests } = req.query; // e.g., 'Cooking,Wine'
    let interests = [];
    if (categoryInterests && typeof categoryInterests === 'string') {
        interests = categoryInterests.split(',');
    }
    
    const profiles = db.profiles.filter(p => {
        if (p.id === currentUser.id) return false;
        if (interests.length > 0) {
            return interests.some(interest => p.interests.includes(interest));
        }
        return true;
    });

    res.json(profiles);
});


app.get('/api/profiles/:id', authenticateToken, (req, res) => {
    const db = readDb();
    const profile = db.profiles.find(p => p.id === req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
});

app.post('/api/swipes', authenticateToken, (req, res) => {
    const { profileId, decision } = req.body;
    const db = readDb();
    const userIndex = db.users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) return res.sendStatus(404);

    const currentUser = db.users[userIndex];
    if (decision === 'like') {
        if (!currentUser.likedProfileIds.includes(profileId)) {
            currentUser.likedProfileIds.push(profileId);
        }
    } else if (decision === 'superlike') {
        if (!currentUser.superLikedProfileIds.includes(profileId)) {
            currentUser.superLikedProfileIds.push(profileId);
        }
    }
    
    // Match logic (for demo)
    let isMatch = false;
    if ((decision === 'like' || decision === 'superlike') && profileId === 'jessica-match') {
         if (!currentUser.matchIds.includes(profileId)) {
            currentUser.matchIds.push(profileId);
            isMatch = true;
         }
    }
    
    writeDb(db);
    
    const userToSend = hydrateUser(currentUser, db);
    res.json({ user: userToSend, isMatch });
});


app.put('/api/user', authenticateToken, (req, res) => {
    const updatedData = req.body;
    const db = readDb();
    const userIndex = db.users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) return res.sendStatus(404);

    // Update user data, but don't allow changing protected fields
    const { id, email, password, matches, likedProfiles, superLikedProfiles, ...safeData } = updatedData;
    db.users[userIndex] = { ...db.users[userIndex], ...safeData };
    writeDb(db);
    
    const userToSend = hydrateUser(db.users[userIndex], db);
    res.json(userToSend);
});

app.get('/api/chats', authenticateToken, (req, res) => {
    const db = readDb();
    const user = db.users.find(u => u.id === req.user.userId);
    if (!user || !user.chats) return res.json([]);

    const chatList = Object.entries(user.chats).map(([recipientId, messages]) => {
        const profile = db.profiles.find(p => p.id === recipientId);
        if (!profile || messages.length === 0) return null;
        return {
            profile,
            lastMessage: messages[messages.length - 1]
        };
    }).filter(Boolean);

    res.json(chatList);
});


app.post('/api/chats/:recipientId/messages', authenticateToken, (req, res) => {
    const { recipientId } = req.params;
    const { text } = req.body;
    const db = readDb();
    const userIndex = db.users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) return res.sendStatus(404);

    const newMessage = {
        id: `msg-${Date.now()}`,
        senderId: req.user.userId,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    const currentUser = db.users[userIndex];
    if (!currentUser.chats) currentUser.chats = {};
    if (!currentUser.chats[recipientId]) currentUser.chats[recipientId] = [];
    
    currentUser.chats[recipientId].push(newMessage);
    
    writeDb(db);
    res.status(201).json(newMessage);
});

// --- AI Routes ---
app.post('/api/ai/icebreaker', authenticateToken, async (req, res) => {
    if (!ai) return res.status(503).json({ message: 'AI service unavailable' });
    
    const { user, otherProfile } = req.body;
    const model = getModel();
    const prompt = `You are a fun and flirty dating assistant. Generate a short, clever, and engaging icebreaker message (1-2 sentences) from ${user.name} to ${otherProfile.name}.

User's Profile (${user.name}):
- Interests: ${user.interests.join(', ')}
- Bio: ${user.bio}

Their Profile (${otherProfile.name}):
- Interests: ${otherProfile.interests.join(', ')}
- Bio: ${otherProfile.bio}

The icebreaker should be a question to encourage a reply. Do not use hashtags. Be creative and avoid generic questions. The response should be ONLY the suggested message text, with no extra formatting or quotation marks.`;

    try {
        const response = await ai.models.generateContent({ model, contents: prompt, config: { temperature: 0.8 } });
        res.json({ suggestion: response.text.replace(/[*_`]/g, '').trim() });
    } catch (error) {
        console.error("AI icebreaker error:", error);
        res.status(500).json({ message: "Failed to generate AI suggestion." });
    }
});

app.post('/api/ai/date-idea', authenticateToken, async (req, res) => {
    if (!ai) return res.status(503).json({ message: 'AI service unavailable' });
    
    const { user, otherProfile } = req.body;
    const model = getModel();
    const sharedInterests = user.interests.filter(i => otherProfile.interests.includes(i)).join(', ') || 'None listed, be creative!';
    const prompt = `You are a creative date planning assistant. Based on the shared interests of ${user.name} and ${otherProfile.name}, suggest one fun and specific date idea.

Shared Interests: ${sharedInterests}

The suggestion should be phrased as a casual, fun message from ${user.name} to ${otherProfile.name}, framed as a question. The response should be ONLY the suggested message text, with no extra formatting or quotation marks.`;

    try {
        const response = await ai.models.generateContent({ model, contents: prompt, config: { temperature: 0.7 } });
        res.json({ suggestion: response.text.replace(/[*_`]/g, '').trim() });
    } catch (error) {
        console.error("AI date idea error:", error);
        res.status(500).json({ message: "Failed to generate AI suggestion." });
    }
});


app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});