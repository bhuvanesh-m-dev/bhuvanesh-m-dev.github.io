/**
 * Generates a shareable URL for a conversation.
 * @param {string} baseUrl - The base URL of your application (e.g., https://bhuvaneshm.in/chat/index.html).
 * @param {string} shareId - The unique ID for the conversation.
 * @returns {string} The complete shareable URL.
 */
export function generateShareUrl(baseUrl, shareId) {
    const url = new URL(baseUrl);
    url.searchParams.set('share', shareId);
    return url.toString();
}

/**
 * Copies text to the clipboard.
 * @param {string} text - The text to copy.
 */
export function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        console.log('Text copied to clipboard');
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textarea);
}

/**
 * Generates a WhatsApp share URL.
 * @param {string} url - The URL to share.
 * @param {string} message - Optional message to accompany the URL.
 * @returns {string} The WhatsApp share URL.
 */
export function shareOnWhatsApp(url, message = "Check out this conversation with CosmoMate!") {
    return `https://wa.me/?text=${encodeURIComponent(message + " " + url)}`;
}

/**
 * Generates a Telegram share URL.
 * @param {string} url - The URL to share.
 * @param {string} text - Optional text to accompany the URL.
 * @returns {string} The Telegram share URL.
 */
export function shareOnTelegram(url, text = "Check out this conversation with CosmoMate!") {
    return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}
