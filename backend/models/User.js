const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        // Default role set to Administrator as per your request
        default: 'Administrator' 
    },
    phone: { 
        type: String 
    },
    twoFactorEnabled: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Export the model for use in server.js
module.exports = mongoose.model('User', UserSchema);