// List of common English words to filter out
const commonWords = ["what", "is", "by", "the", "of", "to", "in", "and", "that", "it", "on", "for", "knew","know","known","define","tell","about"];

// Function to process the input
function processInput() {
    const inputElement = document.getElementById('user-input');
    const query = inputElement.value.trim().toLowerCase();  // Trim extra spaces
    let words = query.split(/\s+/).filter(word => !commonWords.includes(word));  // Split by one or more spaces

    let keyword = words.length > 0 ? words[0] : '';

    displayMessage(query, 'user');

    console.log('Keyword:', keyword); // Add this line to debug

    if (keyword) {
        loadData(keyword);
    } else {
        displayMessage('Please provide a more specific query.', 'bot');
    }

    inputElement.value = '';
    inputElement.focus();
}

// Function to load the data from the corresponding data file
function loadData(keyword) {
    let firstLetter = keyword.charAt(0);
    console.log('First letter:', firstLetter); // Debugging the first letter

    let scriptTag = document.createElement('script');
    scriptTag.src = `celestialdata.js`;

    scriptTag.onload = () => {
        console.log('Data loaded:', window.data); // Ensure the data is loaded
        if (window.data && window.data[keyword]) {
            // Check if the 'url' exists in the data
            const moreInfoUrl = window.data[keyword].url ? window.data[keyword].url : `https://www.ecosia.org/search?q=${keyword}`;
            displayMessage(window.data[keyword].text, 'bot', [], window.data[keyword].imageUrl, moreInfoUrl);
        } else {
            const defaultText = `
                The Celestial Box project aims to provide a comprehensive platform to answer all astronomical questions while also supporting the fight against global warming. 
                This project is designed to make astronomical knowledge more accessible, offering detailed insights into celestial bodies, phenomena, and space exploration. 
                While Celestial Box is not an official partner of Ecosia, Bhuvanesh M supports Ecosia’s mission to plant trees worldwide. 
                To encourage this environmental initiative, the Celestial Box incorporates Ecosia’s search engine model, allowing users to contribute to tree planting with every search they make. 
                This innovative blend of astronomical education and environmental responsibility creates a space where knowledge and positive action come together to benefit both our planet and the universe.
            `;
            const moreInfoUrl = `https://www.ecosia.org/search?q=${keyword}`;
            displayMessage(defaultText, 'bot', [{ url: moreInfoUrl }]);
        }
        document.head.removeChild(scriptTag);
    };

    scriptTag.onerror = () => {
        const errorText = `
            The Celestial Box project aims to provide a comprehensive platform to answer all astronomical questions while also supporting the fight against global warming. 
            This project is designed to make astronomical knowledge more accessible, offering detailed insights into celestial bodies, phenomena, and space exploration. 
            While Celestial Box is not an official partner of Ecosia, Bhuvanesh M supports Ecosia’s mission to plant trees worldwide. 
            To encourage this environmental initiative, the Celestial Box incorporates Ecosia’s search engine model, allowing users to contribute to tree planting with every search they make. 
            This innovative blend of astronomical education and environmental responsibility creates a space where knowledge and positive action come together to benefit both our planet and the universe.
        `;
        const moreInfoUrl = `https://www.ecosia.org/search?q=${keyword}`;
        displayMessage(errorText, 'bot', [{ url: moreInfoUrl }]);
        document.head.removeChild(scriptTag);
    };

    document.head.appendChild(scriptTag);
}

// Function to display messages in the chat output
function displayMessage(text, sender, links = [], imageUrl = null, moreInfoUrl = null) {
    const chatOutput = document.getElementById('chat-output');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    chatOutput.appendChild(messageDiv);

    // Add the content text
    const messageText = document.createElement('span');
    messageText.textContent = '';
    messageDiv.appendChild(messageText);

    const words = text.split(' '); // Split the text into words
    let wordIndex = 0;

    // Function to type words one by one
    function typeWord() {
        if (wordIndex < words.length) {
            messageText.textContent += words[wordIndex] + ' '; // Add each word with a space after it
            wordIndex++;
            setTimeout(typeWord, 150); // Adjust the speed of typing here (150ms per word)
        } else {
            chatOutput.scrollTop = chatOutput.scrollHeight;

            // Add links if provided
            links.forEach(link => {
                const linkElement = document.createElement('a');
                linkElement.href = link.url;
                linkElement.target = '_blank';
                linkElement.textContent = link.url; // Use the URL as the link text
                messageDiv.appendChild(document.createElement('br')); // Line break before the link
                messageDiv.appendChild(linkElement);
            });

            // Add image if provided (below the text and link)
            if (imageUrl) {
                const imageElement = document.createElement('img');
                imageElement.src = imageUrl;
                imageElement.alt = 'Response Image';
                imageElement.width = 250; // Set width to 100px
                imageElement.height = 250; // Set height to 100px
                messageDiv.appendChild(document.createElement('br')); // Line break before the image
                messageDiv.appendChild(imageElement);
            }

            // Add "For More Info" link (below the image)
            if (moreInfoUrl) {
                const moreInfoLink = document.createElement('a');
                moreInfoLink.href = moreInfoUrl;
                moreInfoLink.target = '_blank';
                moreInfoLink.textContent = 'For more info';
                messageDiv.appendChild(document.createElement('br')); // Line break before the link
                messageDiv.appendChild(moreInfoLink);
            }
        }
    }

    typeWord();
}


function handleSend() {
    const input = userInput.value.trim();
    if (!input) return;

    // Add user message
    addMessage(input, 'user');

    // Check for a response from the bot
    const response = botResponses[input.toLowerCase()];
    if (response) {
        if (typeof response === "object" && response.text && response.url) {
            // Handle case where response is an object with a text and URL
            setTimeout(() => displayMessage(response.text, 'bot', [{ url: response.url }]), 500);
        } else if (Array.isArray(response)) {
            // Handle case where response is an array
            setTimeout(() => displayMessage(response[0].text, 'bot', response), 500);
        } else {
            // Handle case where the response is a simple string
            setTimeout(() => displayMessage(response, 'bot'), 500);
        }
    } else {
        setTimeout(() => displayMessage(botResponses["default"], 'bot'), 500);
    }

    userInput.value = '';
}


// Event listener for the Enter key in the input field
document.getElementById('user-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevents the default action of the Enter key
        processInput();
    }
});

// Event listener for the send button
document.getElementById('send-btn').addEventListener('click', processInput);

