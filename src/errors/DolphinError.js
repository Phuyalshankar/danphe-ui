'use strict';

const { MAX_KEY_LENGTH } = require('../constants/defaults');

class DolphinError extends Error {
    constructor(code, message, details = {}) {
        const messages = {
            'EN': {
                'INVALID_BUFFER': 'Invalid buffer provided',
                'BUFFER_FULL': 'Storage buffer is full',
                'KEY_TOO_LONG': `Key exceeds maximum length of ${MAX_KEY_LENGTH} bytes`,
                'INVALID_HTML': 'Invalid HTML structure',
                'MEMORY_EXCEEDED': 'Memory limit exceeded',
                'PARSE_ERROR': 'Failed to parse HTML',
                'COMPILE_ERROR': 'Compilation failed',
                'SECURITY_ERROR': 'Security violation detected',
                'INVALID_PLATFORM': 'Invalid platform specified',
                'ALIGNMENT_ERROR': 'Memory alignment error',
                'OFFSET_TOO_LARGE': 'Relative offset exceeds maximum size',
                'PLATFORM_MISMATCH': 'Binary platform mismatch detected',
                'TAG_NOT_CLOSED': 'HTML tag is not properly closed',
                'MALFORMED_HTML': 'Malformed HTML structure detected',
                'UNCLOSED_COMMENT': 'Unclosed HTML comment',
                'UNCLOSED_STRING': 'Unclosed attribute string'
            },
            'NP': {
                'INVALID_BUFFER': 'अमान्य बफर प्रदान गरियो',
                'BUFFER_FULL': 'भण्डारण बफर भरिएको छ',
                'KEY_TOO_LONG': `कुञ्जी ${MAX_KEY_LENGTH} बाइट्स भन्दा लामो छ`,
                'INVALID_HTML': 'अमान्य HTML संरचना',
                'MEMORY_EXCEEDED': 'स्मृति सीमा भन्दा बढी',
                'PARSE_ERROR': 'HTML पार्स गर्न असफल',
                'COMPILE_ERROR': 'कम्पाइलेसन असफल',
                'SECURITY_ERROR': 'सुरक्षा उल्लंघन पत्ता लाग्यो',
                'INVALID_PLATFORM': 'अमान्य प्लेटफर्म निर्दिष्ट गरियो',
                'ALIGNMENT_ERROR': 'स्मृति संरेखण त्रुटि',
                'OFFSET_TOO_LARGE': 'सापेक्ष ओफसेट अधिकतम आकार भन्दा बढी छ',
                'PLATFORM_MISMATCH': 'बाइनरी प्लेटफर्म मिसम्याच पत्ता लाग्यो',
                'TAG_NOT_CLOSED': 'HTML ट्याग राम्रोसँग बन्द छैन',
                'MALFORMED_HTML': 'खराब HTML संरचना पत्ता लाग्यो',
                'UNCLOSED_COMMENT': 'नबन्द HTML टिप्पणी',
                'UNCLOSED_STRING': 'नबन्द विशेषता स्ट्रिङ'
            }
        };
        
        const lang = details.language || 'EN';
        const msg = messages[lang]?.[code] || message;
        super(`[DolphinJS ${code}] ${msg}`);
        
        this.code = code;
        this.timestamp = new Date().toISOString();
        this.details = details;
        
        Error.captureStackTrace(this, DolphinError);
    }
}

module.exports = DolphinError;