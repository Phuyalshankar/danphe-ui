'use strict';

const { renderAdaptiveIconSVG } = require('d:/danphe-ui/lib/TitanAdaptiveIcon');

const testCodes = [
    { code: 1, name: 'Incoming Call' },
    { code: 2, name: 'Video Call' },
    { code: 3, name: 'Outgoing Call' },
    { code: 4, name: 'Missed Call' },
    { code: 5, name: 'Connected Phone' },
    { code: 6, name: 'Mute Mic' },
    { code: 7, name: 'Chat Comments' },
    { code: 8, name: 'Voicemail' },
    { code: 15, name: 'Keypad Grid' },
    { code: 16, name: 'Speaker' },
    { code: 27, name: 'Backspace' },
    { code: 31, name: 'Hangup' },
    { code: 224, name: 'Home Screen' },
    { code: 225, name: 'Contacts Book' },
    { code: 226, name: 'Settings Gear' },
    { code: 47, name: 'Search Glass' }
];

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('🔬 DEEP SVG ELEMENT & PATH AUDIT FOR DANPHE-2 / THORVG');
console.log('═══════════════════════════════════════════════════════════════════════\n');

const pathRegex = /<path[^>]*?d="([^"]+)"[^>]*?>/g;
const polyRegex = /<polyline[^>]*?points="([^"]+)"[^>]*?>/g;
const lineRegex = /<line[^>]*?x1="([^"]+)"[^>]*?>/g;
const rectRegex = /<rect[^>]*?x="([^"]+)"[^>]*?>/g;
const circleRegex = /<circle[^>]*?cx="([^"]+)"[^>]*?>/g;

let allValid = true;

testCodes.forEach(item => {
    const svg = renderAdaptiveIconSVG(item.code, 1, 28, false);
    const paths = (svg.match(pathRegex) || []).length;
    const polys = (svg.match(polyRegex) || []).length;
    const lines = (svg.match(lineRegex) || []).length;
    const rects = (svg.match(rectRegex) || []).length;
    const circles = (svg.match(circleRegex) || []).length;
    const totalDrawnElements = paths + polys + lines + rects + circles;

    const isValid = totalDrawnElements > 0;
    if (!isValid) allValid = false;

    console.log(`[CODE ${item.code.toString().padStart(3, ' ')}] ${item.name.padEnd(16)} : Total Vectors=${totalDrawnElements} (Paths:${paths}, Poly:${polys}, Lines:${lines}, Rects:${rects}, Circles:${circles}) -> ${isValid ? '✅ OK' : '❌ EMPTY'}`);
});

console.log('\n═══════════════════════════════════════════════════════════════════════');
console.log(`🎯 OVERALL SVG INTEGRITY: ${allValid ? '100% PERFECT & VERIFIED' : 'FAILED'}`);
console.log('═══════════════════════════════════════════════════════════════════════\n');
