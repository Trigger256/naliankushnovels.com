/**
 * login-signup.js
 * * Handles form logic, tab switching, and simulated signup/login for login-signup.html.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // Elements
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');

    // --- Tab Switching Logic ---
    function switchToLogin() {
        loginTab.classList.add('active-tab');
        signupTab.classList.remove('active-tab');
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    }
    
    function switchToSignup() {
        signupTab.classList.add('active-tab');
        loginTab.classList.remove('active-tab');
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
    }

    loginTab.addEventListener('click', switchToLogin);
    signupTab.addEventListener('click', switchToSignup);

    // --- Form Submission Logic ---
    
    // 1. Login Submission (Uses global simulateLogin from app.js)
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        window.simulateLogin(email, password);
    });

    // 2. Signup Submission (Simulated)
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Grab new user details
        const newName = document.getElementById('signup-name').value;
        const newEmail = document.getElementById('signup-email').value;
        const newPassword = document.getElementById('signup-password').value;
        
        if (!newName || !newEmail || !newPassword) {
            alert("Please fill out all fields for the simulated signup.");
            return;
        }

        // Create a new simulated user object
        const newUser = {
            role: "Customer",
            fullName: newName,
            email: newEmail,
            password: newPassword,
            phone: "",
            twoFactorEnabled: false
        };
        
        // Save the new user to storage, replacing the old one
        saveUser(newUser); 
        
        alert(`Simulated Sign Up Successful! The new user (${newName}) is now saved in your browser storage. Please log in with your new credentials.`);
        
        // Switch back to login tab after simulated signup
        switchToLogin();
        
        // Pre-fill login form with new credentials (optional helper)
        document.getElementById('login-email').value = newEmail;
        document.getElementById('login-password').value = newPassword;
    });

});