
document.addEventListener('DOMContentLoaded', () => {
    const chatOutput = document.getElementById('chat-output');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // Function to add messages to the chat
    function addMessage(content, sender, links = []) {
        const message = document.createElement('div');
        message.classList.add('message', sender);

        // Add the content text
        const messageText = document.createElement('span');
        messageText.textContent = content;
        message.appendChild(messageText);

        // Add any associated links
        links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.target = '_blank';
            linkElement.textContent = link.url; // Use the URL as the link text
            message.appendChild(document.createElement('br')); // Add a line break before each link
            message.appendChild(linkElement);
        });

        chatOutput.prepend(message); // Add new messages at the top

        // Scroll to the bottom of the chat output box
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    // Function to handle sending a message
    function handleSend() {
        const input = userInput.value.trim();
        if (!input) return;

        // Add user message
        addMessage(input, 'user');

        // Check for a response from the bot
        const response = botResponses[input.toLowerCase()];
        if (response) {
            if (typeof response === "object" && response.text && response.url) {
                // Handle case where response is an object with a text and URL (e.g., "youtube")
                setTimeout(() => addMessage(response.text, 'bot', [{ url: response.url }]), 500);
            } else if (Array.isArray(response)) {
                // Handle case where response is an array (e.g., "contact")
                setTimeout(() => addMessage(response[0].text, 'bot', response), 500);
            } else {
                // Handle case where the response is a simple string
                setTimeout(() => addMessage(response, 'bot'), 500);
            }
        } else {
            setTimeout(() => addMessage(botResponses["default"], 'bot'), 500);
        }

        userInput.value = '';
    }

    // Event listeners for the send button and Enter key
    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    });
});
