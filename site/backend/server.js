const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const User = require('./models/User');
const Chat = require('./models/Chat');

const app = express();
const PORT = process.env.PORT || 5000; 
const API_PREFIX = '/api'; // This must match the cPanel App URL setting

// --- CONFIGURATION ---
const MONGO_URI = 'mongodb://localhost:27017/nalian_db'; // 🚨 CHANGE THIS!
const JWT_SECRET = 'TRIGGER_NALIAN_SUPER_SECRET_12345_FOR_TSGTTC'; 

// Use the exact subdomain for CORS origin for security
app.use(cors({ origin: 'https://triggersoftwarecompany.gt.tc' })); 
app.use(express.json()); 

// --- DATABASE CONNECTION ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// =======================================================
//                  S E C U R I T Y   &   U T I L S
// =======================================================

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password'); 
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// =======================================================
//                   A P I   R O U T E S 
// The routes are prefixed with '/api' to match cPanel setup
// =======================================================

// @route   POST /api/auth/signup
app.post(`${API_PREFIX}/auth/signup`, async (req, res) => {
    const { fullName, email, password } = req.body;
    // ... (rest of the signup logic) ...
    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ fullName, email, password: hashedPassword });
        if (user) {
            await Chat.create({
                user: user._id,
                messages: [{ type: 'received', text: 'Welcome to your private support chat!', timestamp: Date.now() }]
            });
            res.status(201).json({
                token: generateToken(user._id),
                user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
                message: 'Account created and logged in successfully!'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// @route   POST /api/auth/login
app.post(`${API_PREFIX}/auth/login`, async (req, res) => {
    const { email, password } = req.body;
    // ... (rest of the login logic) ...
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                token: generateToken(user._id),
                user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
                message: 'Login successful'
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @route   GET /api/users/profile
app.get(`${API_PREFIX}/users/profile`, protect, (req, res) => {
    res.json(req.user);
});

// @route   PUT /api/users/profile
app.put(`${API_PREFIX}/users/profile`, protect, async (req, res) => {
    const { fullName, phone, twoFactorEnabled } = req.body;
    // ... (rest of the update profile logic) ...
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.fullName = fullName !== undefined ? fullName : user.fullName;
            user.phone = phone !== undefined ? phone : user.phone;
            user.twoFactorEnabled = twoFactorEnabled !== undefined ? twoFactorEnabled : user.twoFactorEnabled;
            const updatedUser = await user.save();
            res.json({ id: updatedUser._id, fullName: updatedUser.fullName, phone: updatedUser.phone, twoFactorEnabled: updatedUser.twoFactorEnabled, message: 'Profile updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error updating profile' });
    }
});

// @route   GET /api/chats
app.get(`${API_PREFIX}/chats`, protect, async (req, res) => {
    try {
        const chat = await Chat.findOne({ user: req.user.id });
        if (!chat) {
             return res.status(404).json({ message: 'Chat not initialized' });
        }
        res.json([chat]); 
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching chats' });
    }
});

// @route   POST /api/chats/:chatId/messages
app.post(`${API_PREFIX}/chats/:chatId/messages`, protect, async (req, res) => {
    const { text } = req.body;
    const { chatId } = req.params;
    // ... (rest of the send message logic) ...
    if (!text) {
        return res.status(400).json({ message: 'Message text is required' });
    }
    try {
        const chat = await Chat.findOne({ _id: chatId, user: req.user.id });
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        const newMessage = { type: 'sent', text: text, timestamp: new Date() };
        chat.messages.push(newMessage);
        await chat.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ message: 'Server error sending message' });
    }
});


// =======================================================
//                   S T A R T   S E R V E R
// =======================================================

app.listen(PORT, () => {
    console.log(`Server running on internal port ${PORT} with API prefix ${API_PREFIX}`);
});