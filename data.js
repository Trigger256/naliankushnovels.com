/**
 * data.js
 * * CENTRALIZED CONFIGURATION & STATIC DATA.
 */

const API_BASE_URL = 'https://triggersoftwarecompany.gt.tc/api'; // FINAL API URL

const NALIAN_DATA = {

    // --- 1. GLOBAL UI & NAVIGATION TEXT ---
    ui: {
        companyName: "TRIGGER NALIAN",
        footerCopyright: "© 2024 TRIGGER NALIAN SOFTWARE COMPANY. All Rights Reserved.",
        // ... (rest of the ui object) ...
        buttons: {
            explore: "Explore Our Software",
            consultation: "Start a Consultation",
            addToCart: "Add to Cart",
            getInTouch: "Get in Touch Today",
            saveChanges: "Save Changes",
            updateSecurity: "Update Security",
            manage2FA: "Manage 2FA Settings",
            newChat: "New Chat",
            sendMessage: "Send",
            login: "Login",
            signup: "Sign Up"
        },
        messages: {
            noProducts: "No products match your current filters. Try adjusting your search.",
            securityEnabled: "Enabled",
            securityDisabled: "Disabled",
            loginFailed: "Invalid username or password.",
            logoutSuccess: "You have been logged out.",
            profileUpdated: "Profile updated successfully!",
            passwordMismatch: "New password and confirmation do not match."
        }
    },

    // --- 2. STATIC SHOP SOFTWARE PRODUCTS ---
    products: [
        { id: "alpha-ai-suite", name: "Alpha AI Suite", description: "Advanced ML platform.", category: "AI", price: 499.99, rating: 4.8, features: ["Custom ML Models", "Real-time Processing"] },
        { id: "secure-vault-360", name: "Secure Vault 360", description: "Enterprise-grade database encryption.", category: "Security", price: 299.00, rating: 4.5, features: ["AES-256 Encryption", "Audit Trails"] },
        { id: "project-nexus", name: "Project Nexus Manager", description: "Collaborative project management tool.", category: "Management", price: 99.99, rating: 4.2, features: ["Gantt Charts", "Kanban Boards"] }
    ],
};