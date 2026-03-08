// Chatbot logic
const API_KEY = 'YOUR_API_KEY_HERE'; // Placeholder for Gemini or Groq API

document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const message = chatInput.value.trim();
            if (!message) return;

            // Add User Message
            addMessage(message, 'user');
            chatInput.value = '';

            // Add Bot Loading State
            const loadingId = addMessage('...', 'bot', true);

            try {
                // Mock implementation of AI response
                // In a real app, you'd fetch from an AI endpoint:
                /*
                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ... })
                });
                */

                await new Promise(resolve => setTimeout(resolve, 1500));

                let botResponse = '';
                const lowerMsg = message.toLowerCase();

                if (lowerMsg.includes('product') || lowerMsg.includes('buy')) {
                    botResponse = "You can browse our full range of products in the Products section. We have electronics, fashion, and home goods!";
                } else if (lowerMsg.includes('order') || lowerMsg.includes('status')) {
                    botResponse = "To check your order status, please visit the History page. If you just placed an order, it will show up there.";
                } else if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
                    botResponse = "Our prices are very competitive because we work directly with local vendors. Check individual items for pricing!";
                } else {
                    botResponse = "That's a great question! As an AI assistant, I'm here to help you navigate LocalShop. Feel free to ask about products, orders, or our store policies.";
                }

                updateMessage(loadingId, botResponse);
            } catch (error) {
                updateMessage(loadingId, "I'm sorry, I'm having trouble connecting to the AI brain right now. Please try again later.");
            }
        });
    }

    function addMessage(text, sender, isLoading = false) {
        const id = Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.id = `msg-${id}`;

        const isUser = sender === 'user';
        msgDiv.style.alignSelf = isUser ? 'flex-end' : 'flex-start';
        msgDiv.style.maxWidth = '80%';
        msgDiv.style.padding = '1rem';
        msgDiv.style.borderRadius = isUser ? '1rem 0 1rem 1rem' : '0 1rem 1rem 1rem';
        msgDiv.style.background = isUser ? 'var(--primary)' : 'var(--bg-light)';
        msgDiv.style.color = isUser ? 'white' : 'var(--text-dark)';

        msgDiv.textContent = text;
        if (isLoading) msgDiv.style.opacity = '0.5';

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        return id;
    }

    function updateMessage(id, text) {
        const msgDiv = document.getElementById(`msg-${id}`);
        if (msgDiv) {
            msgDiv.textContent = text;
            msgDiv.style.opacity = '1';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
});
