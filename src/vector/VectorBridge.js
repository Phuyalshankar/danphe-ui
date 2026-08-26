'use strict';

const path = require('path');
const { execSync } = require('child_process');

const vectorExePath = 'D:/danphe-2/bin/danphe-vector.exe';

/**
 * 🐬 VectorBridge - High Performance C++ Vector Synthesizer Bridge
 */
class VectorBridge {
    static getSevenSegmentSVG(digits = '0', theme = 'red') {
        const DIGIT_MAP = {
            '0': 0b00111111, '1': 0b00000110, '2': 0b01011011, '3': 0b01001111,
            '4': 0b01100110, '5': 0b01101101, '6': 0b01111101, '7': 0b00000111,
            '8': 0b01111111, '9': 0b01101111, '-': 0b01000000, ' ': 0b00000000
        };

        const onColor = (theme === 'amber') ? '#f59e0b' : (theme === 'cyan') ? '#06b6d4' : (theme === 'emerald') ? '#10b981' : '#ef4444';
        const offColor = (theme === 'amber') ? '#291b00' : (theme === 'cyan') ? '#022026' : (theme === 'emerald') ? '#022619' : '#220808';

        const text = String(digits || '');
        const totalWidth = Math.max(50, text.length * 45 + 10);

        let svg = `<svg viewBox="0 0 ${totalWidth} 80" height="50" class="danphe-7seg">`;
        let xOffset = 5;

        for (const ch of text) {
            const m = DIGIT_MAP[ch] || 0;
            svg += `<polygon points="${xOffset+8},8 ${xOffset+32},8 ${xOffset+28},13 ${xOffset+12},13" fill="${(m & 1) ? onColor : offColor}"/>`;
            svg += `<polygon points="${xOffset+34},10 ${xOffset+34},36 ${xOffset+29},32 ${xOffset+29},15" fill="${(m & 2) ? onColor : offColor}"/>`;
            svg += `<polygon points="${xOffset+34},42 ${xOffset+34},68 ${xOffset+29},63 ${xOffset+29},46" fill="${(m & 4) ? onColor : offColor}"/>`;
            svg += `<polygon points="${xOffset+8},70 ${xOffset+32},70 ${xOffset+28},65 ${xOffset+12},65" fill="${(m & 8) ? onColor : offColor}"/>`;
            svg += `<polygon points="${xOffset+6},42 ${xOffset+6},68 ${xOffset+11},63 ${xOffset+11},46" fill="${(m & 16) ? onColor : offColor}"/>`;
            svg += `<polygon points="${xOffset+6},10 ${xOffset+6},36 ${xOffset+11},32 ${xOffset+11},15" fill="${(m & 32) ? onColor : offColor}"/>`;
            svg += `<polygon points="${xOffset+10},39 ${xOffset+30},39 ${xOffset+27},36 ${xOffset+13},36" fill="${(m & 64) ? onColor : offColor}"/>`;
            xOffset += 45;
        }

        svg += `</svg>`;
        return svg;
    }

    /**
     * 🎹 Generate Ultra-Sharp Animated 3x3 Keypad Vector SVG
     */
    static getKeypadSVG(color = '#ffffff', animated = true) {
        const strokeW = 2.2;
        return `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>`;
    }
}

module.exports = VectorBridge;
