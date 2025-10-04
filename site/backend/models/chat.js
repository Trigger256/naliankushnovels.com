const mongoose = require('mongoose');

// Schema for individual messages within the chat array
const MessageSchema = new mongoose.Schema({
    type: { 
        type: String, 
        required: true // 'sent' (user to support) or 'received' (support to user)
    }, 
    text: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
}, { _id: false }); // Prevents Mongoose from creating redundant IDs for sub-documents

// Main Chat Schema
const ChatSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true // Ensures a user has only one support chat entry
    },
    room_name: { 
        type: String, 
        default: 'Support Team Room' 
    },
    messages: [MessageSchema] // Array of messages
});

// Export the model for use in server.js
module.exports = mongoose.model('Chat', ChatSchema);