let selectedLanguage = 'ta';  // Default language: Tamil

// Function to handle input change based on selected language
function openTranslation() {
    const userInput = document.getElementById('userInput').value.trim();
    if (!userInput) {
        alert("Please enter some text to translate!");
        return;
    }

    const translateURL = `https://translate.google.com/?sl=auto&tl=${selectedLanguage}&text=${encodeURIComponent(userInput)}&op=translate`;

    // Open the translation URL in a new tab
    const newTab = window.open(translateURL);

    // Check if the tab was opened successfully
    if (!newTab) {
        alert("Unable to open a new tab. Please check your browser settings.");
    }
}

// Change the selected language based on the dropdown menu
function setLanguage(languageCode) {
    selectedLanguage = languageCode;
}

// Event listener for 'Enter' key press to trigger translation
document.getElementById('userInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        openTranslation();
    }
});
