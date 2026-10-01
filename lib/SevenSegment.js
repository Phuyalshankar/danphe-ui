'use strict';

const DIGIT_MAP = {
    '0': 0b00111111, '1': 0b00000110, '2': 0b01011011, '3': 0b01001111,
    '4': 0b01100110, '5': 0b01101101, '6': 0b01111101, '7': 0b00000111,
    '8': 0b01111111, '9': 0b01101111, '-': 0b01000000, ' ': 0b00000000
};

const COLOR_MAP = {
    red: { on: '#ef4444', off: '#260808' },
    amber: { on: '#f59e0b', off: '#2b1b00' },
    cyan: { on: '#06b6d4', off: '#02242b' },
    emerald: { on: '#10b981', off: '#02291b' }
};

function renderDigitSVG(char, theme = 'red') {
    const mask = DIGIT_MAP[char] || 0;
    const colors = COLOR_MAP[theme] || COLOR_MAP.red;
    const { on, off } = colors;

    return `<svg viewBox="0 0 60 100" width="38" height="65" class="inline-block mx-0.5"><polygon points="12,10 48,10 42,16 18,16" fill="${(mask & 1) ? on : off}" /><polygon points="50,12 50,46 44,42 44,18" fill="${(mask & 2) ? on : off}" /><polygon points="50,54 50,88 44,82 44,58" fill="${(mask & 4) ? on : off}" /><polygon points="12,90 48,90 42,84 18,84" fill="${(mask & 8) ? on : off}" /><polygon points="10,54 10,88 16,82 16,58" fill="${(mask & 16) ? on : off}" /><polygon points="10,12 10,46 16,42 16,18" fill="${(mask & 32) ? on : off}" /><polygon points="14,50 46,50 42,46 18,46" fill="${(mask & 64) ? on : off}" /></svg>`;
}

const SevenSegment = ({ value = '', theme = 'red' } = {}) => {
    const chars = String(value || '').split('');
    const digitsHtml = chars.map(c => renderDigitSVG(c, theme)).join('');
    
    return `<div class="flex-row items-center justify-center p-3 bg-black rounded-2xl border-2 border-slate-900 shadow-2xl">${digitsHtml}</div>`;
};

module.exports = { SevenSegment, renderDigitSVG, DIGIT_MAP, COLOR_MAP };
