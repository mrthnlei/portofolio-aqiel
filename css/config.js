// EmailJS Configuration
// Replace these values with your actual EmailJS credentials from https://www.emailjs.com/

const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY_HERE',
    SERVICE_ID: 'YOUR_SERVICE_ID_HERE',
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID_HERE'
};

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMAILJS_CONFIG;
}
