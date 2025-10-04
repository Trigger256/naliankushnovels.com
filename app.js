/**
 * app.js
 * * Global application logic: header state, login/logout, and utility functions.
 * Must be loaded AFTER data.js and storage.js.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Update Header/Footer with static data
    updateGlobalContent();

    // 2. Manage the Login/Settings button state and redirect if necessary
    updateAuthButtonAndCheckRedirect();

    // Attach listener for the logout action (if element exists)
    document.querySelector('.nav-item.logout')?.addEventListener('click', handleLogout);

    // --- Core Functions ---

    function updateGlobalContent() {
        document.querySelector('header .logo').textContent = NALIAN_DATA.ui.companyName;
        document.querySelector('.footer-logo').textContent = NALIAN_DATA.ui.companyName;
        const copyrightElement = document.querySelector('.copyright');
        if (copyrightElement) {
             copyrightElement.textContent = NALIAN_DATA.ui.footerCopyright;
        }
    }

    function updateAuthButtonAndCheckRedirect() {
        const isUserLoggedIn = checkLoginStatus();
        
        // Find the main Login/Settings button
        const authLink = document.querySelector('a[href$="settings.html"], a[href$="login-signup.html"]');
        if (!authLink) return;

        if (isUserLoggedIn) {
            // Logged In: Link should go to Settings, text should be 'Settings'
            authLink.textContent = 'Settings';
            authLink.href = 'settings.html';
            
            // Redirect logged-in user away from the login page
            if (window.location.pathname.endsWith('login-signup.html')) {
                window.location.href = 'settings.html';
            }

        } else {
            // Logged Out: Link should go to Login/Signup, text should be 'Login/Settings'
            authLink.textContent = 'Login/Settings';
            authLink.href = 'login-signup.html';
            
            // Redirect logged-out user away from the settings/chat pages
            if (window.location.pathname.endsWith('settings.html') || window.location.pathname.endsWith('chats.html')) {
                // Allow them to see chats page, but block dashboard content
                if (window.location.pathname.endsWith('settings.html')) {
                     window.location.href = 'login-signup.html';
                }
            }
        }
    }

    // --- Authentication Handlers (Exposed globally) ---

    function handleLogout(e) {
        e.preventDefault();
        
        setLoginStatus(false); 
        
        alert(NALIAN_DATA.ui.messages.logoutSuccess);

        // Redirect to the new login page after logout
        window.location.href = 'login-signup.html';
    }

    window.simulateLogin = function(username, password) {
        const storedUser = getStoredUser();
        
        if (username === storedUser.email && password === storedUser.password) {
            setLoginStatus(true);
            alert(NALIAN_DATA.ui.messages.loginSuccess);
            window.location.href = 'settings.html'; // Redirect to the dashboard
        } else {
            alert(NALIAN_DATA.ui.messages.loginFailed);
        }
    }
});