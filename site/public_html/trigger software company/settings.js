/**
 * settings.js
 * * Handles navigation logic for the Settings Dashboard (settings.html).
 * This script ensures that when a sidebar link is clicked, the corresponding 
 * content panel is shown and the link itself is highlighted as active.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Select all navigation links in the sidebar that have a data-target attribute
    const navItems = document.querySelectorAll('.settings-nav .nav-item[data-target]');
    // Select all the content divs
    const contentTabs = document.querySelectorAll('.settings-tab');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // 1. Remove active class from all navigation links
            navItems.forEach(i => i.classList.remove('active'));

            // 2. Add active class to the clicked link
            this.classList.add('active');

            // 3. Get the ID of the target content section
            const targetId = this.dataset.target;

            // 4. Hide all content tabs
            contentTabs.forEach(t => t.classList.remove('active-content'));

            // 5. Show the targeted content tab
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active-content');
            }
        });
    });

    // Optional: Log Out functionality placeholder
    const logoutLink = document.querySelector('.nav-item.logout');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Logging out... (Backend logout process would happen here)');
            // In a real app: window.location.href = 'index.html';
        });
    }
});