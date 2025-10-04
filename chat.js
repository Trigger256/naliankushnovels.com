/**
 * chats.js
 * * Handles chat communication with the API.
 * Depends on data.js and app.js for configuration and API fetching utilities.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Protection: Ensure user is logged in before running chat logic
    if (!isLoggedIn()) return; 

    const chatListElement = document.querySelector('.chat-list');
    const messageArea = document.querySelector('.message-area');
    const chatHeaderTitle = document.querySelector('.chat-header h3');
    const chatInputField = document.getElementById('chat-input-field');
    const sendButton = document.querySelector('.send-btn');
    
    let currentChatId = null;

    // --- Initialization: Fetch Chats ---
    async function fetchChats() {
        // The API is designed to return the *single* chat associated with the current user.
        const res = await apiFetch('/api/chats');

        if (res.ok) {
            const chats = await res.json();
            renderChatList(chats);
            
            // Auto-select the first chat found
            if (chats.length > 0) {
                // The API gives us the chat object directly
                switchChat(chats[0]._id, chats[0].room_name, chats[0].messages);
            }
        } else {
            console.error('Failed to fetch chats. API response:', await res.json());
            chatListElement.innerHTML = '<p class="text-muted" style="padding: 15px;">Could not load chats. Server error.</p>';
        }
    }

    // --- Rendering Functions ---
    
    function renderChatList(chats) {
        chatListElement.innerHTML = '';
        if (chats.length === 0) {
             chatListElement.innerHTML = '<p class="text-muted" style="padding: 15px;">No chats found.</p>';
             return;
        }

        chats.forEach(chat => {
            const lastMessage = chat.messages[chat.messages.length - 1];
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            chatItem.setAttribute('data-id', chat._id);
            chatItem.innerHTML = `
                <div class="user-avatar" style="background-color: var(--primary-blue);">
                    ${chat.room_name.substring(0, 2).toUpperCase()}
                </div>
                <div class="chat-info">
                    <h4>${chat.room_name}</h4>
                    <p class="last-message">${lastMessage ? lastMessage.text : 'No messages yet.'}</p>
                </div>
            `;
            chatListElement.appendChild(chatItem);
        });

        // Add event listeners for switching chats (although currently only one chat exists)
        document.querySelectorAll('.chat-item').forEach(item => {
            item.addEventListener('click', async () => {
                const chatId = item.getAttribute('data-id');
                const chatName = item.querySelector('h4').textContent;
                
                // Refetch all chats to get the latest messages for the selected chat
                const res = await apiFetch(`/api/chats`);
                const allChats = await res.json();
                const selectedChat = allChats.find(c => c._id === chatId);

                if (selectedChat) {
                     switchChat(selectedChat._id, selectedChat.room_name, selectedChat.messages);
                }
            });
        });
    }

    function renderMessages(messages) {
        messageArea.innerHTML = '';
        
        if (messages.length === 0) {
            messageArea.innerHTML = '<p class="text-muted" style="text-align: center; margin-top: 50px;">Start a conversation!</p>';
            return;
        }

        messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            // 'sent' class aligns right, 'received' aligns left
            messageDiv.className = `message ${msg.type}`; 
            
            // Avatar for the 'received' (support) messages
            const avatarHtml = msg.type === 'received' 
                ? `<div class="user-avatar small" style="background-color: var(--accent-cyan);">ST</div>`
                : '';
            
            messageDiv.innerHTML = `
                ${avatarHtml}
                <div>
                    <p>${msg.text}</p>
                    <span class="timestamp">${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            `;
            messageArea.appendChild(messageDiv);
        });
        messageArea.scrollTop = messageArea.scrollHeight; // Scroll to bottom
    }

    // --- Main Actions ---
    
    // Loads chat and updates UI
    function switchChat(chatId, chatName, messages) {
        currentChatId = chatId;
        chatHeaderTitle.textContent = chatName;
        
        // Update active class in sidebar
        document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`.chat-item[data-id="${chatId}"]`)?.classList.add('active');

        renderMessages(messages); 
    }
    
    // Handles sending a message via API
    async function handleSendMessage(e) {
        e.preventDefault();
        const text = chatInputField.value.trim();

        if (!text || !currentChatId) return;

        chatInputField.value = ''; // Clear input immediately
        
        // Optimistically add the message to the UI before API confirmation
        const tempMessage = {
            type: 'sent',
            text: text,
            timestamp: new Date()
        };
        
        // Temporarily render the new message along with existing ones
        const existingMessages = Array.from(messageArea.querySelectorAll('.message')).map(m => ({
            text: m.querySelector('p')?.textContent,
            type: m.classList.contains('sent') ? 'sent' : 'received',
            // Note: We use the server to re-render, so this temp timestamp is for instant display only
            timestamp: new Date() 
        })).filter(m => m.text); 
        
        renderMessages([...existingMessages, tempMessage]);


        const res = await apiFetch(`/