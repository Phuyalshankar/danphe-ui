'use strict';

/**
 * 🐬 TitanFontEngine (danphe-ui/fonts)
 * Universal Typography, Geometry, Arc & 3D Text Generation Engine
 */

const { FONTS_256, CATEGORIES } = require('./FONTS_256');

function getFontFromOpcode(opcode) {
    const code = Math.max(0, Math.min(255, parseInt(opcode, 10) || 0));
    return FONTS_256[code] || FONTS_256[0];
}

function getGoogleFontsLinkTags() {
    const uniqueGFs = Array.from(new Set(FONTS_256.map(f => f.gFont).filter(Boolean)));
    const chunkSize = 20;
    const links = [
        '<link rel="preconnect" href="https://fonts.googleapis.com">',
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    ];

    for (let i = 0; i < uniqueGFs.length; i += chunkSize) {
        const chunk = uniqueGFs.slice(i, i + chunkSize);
        const query = chunk.map(g => 'family=' + g).join('&');
        links.push(`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${query}&display=swap">`);
    }
    return links.join('\n    ');
}

function generateFontCSS() {
    let css = `/* 🐬 DANPHE UI UNIVERSAL 256 FONT PACK */\n\n`;

    FONTS_256.forEach(font => {
        const hex = font.opcodeHex.toLowerCase();
        css += `.titan-font-${hex}, .titan-font-${font.opcode} {\n`;
        css += `    font-family: ${font.family};\n`;
        css += `}\n`;
    });

    // Add 3D Extrusion, Neon Glow & Shadow Utility Classes
    css += `
/* 3D Extruded Text Shadows */
.titan-text-3d-cyan {
    text-shadow: 
        0 1px 0 #083344, 0 2px 0 #0e7490, 0 3px 0 #06b6d4,
        0 4px 0 #0891b2, 0 6px 1px rgba(0,0,0,0.5),
        0 0 20px rgba(6,182,212,0.8);
}
.titan-text-3d-gold {
    text-shadow: 
        0 1px 0 #451a03, 0 2px 0 #78350f, 0 3px 0 #b45309,
        0 4px 0 #d97706, 0 6px 1px rgba(0,0,0,0.5),
        0 0 20px rgba(245,158,11,0.8);
}
.titan-text-3d-pink {
    text-shadow: 
        0 1px 0 #500724, 0 2px 0 #831843, 0 3px 0 #be185d,
        0 4px 0 #db2777, 0 6px 1px rgba(0,0,0,0.5),
        0 0 20px rgba(236,72,153,0.8);
}
.titan-text-neon-glow {
    text-shadow: 
        0 0 5px #fff, 0 0 10px #fff, 0 0 20px #06b6d4,
        0 0 40px #06b6d4, 0 0 80px #06b6d4;
}
.titan-text-crimson-nepal {
    text-shadow: 
        0 2px 0 #7f1d1d, 0 4px 0 #991b1b, 0 6px 0 #dc2626,
        0 0 25px rgba(220,38,38,0.9);
}
`;
    return css;
}

/**
 * Generates an SVG Curved Text Path
 * @param {string} text 
 * @param {number} arcAngle (-180 to 180 deg)
 * @param {number} radius (pixels)
 */
function renderCurvedTextSVG(options = {}) {
    const {
        text = 'DANPHE CINEMA STUDIO',
        radius = 80,
        arcAngle = 90,
        fontOpcode = 0,
        fontSize = 14,
        fill = '#ffffff',
        id = 'curved-txt-' + Math.floor(Math.random() * 10000)
    } = options;

    const font = getFontFromOpcode(fontOpcode);
    const startX = 162 - radius;
    const endX = 162 + radius;
    const isClockwise = arcAngle >= 0 ? 1 : 0;
    const pathD = `M ${startX},57 A ${radius},${radius} 0 0,${isClockwise} ${endX},57`;

    return `
<g id="${id}-group">
    <defs>
        <path id="${id}-path" d="${pathD}" fill="none" />
    </defs>
    <text fill="${fill}" font-size="${fontSize}" font-weight="900" font-family="${font.family}" letter-spacing="1.5">
        <textPath href="#${id}-path" startOffset="50%" text-anchor="middle">
            ${text}
        </textPath>
    </text>
</g>
`;
}

module.exports = {
    getFontFromOpcode,
    generateFontCSS,
    getGoogleFontsLinkTags,
    renderCurvedTextSVG,
    CATEGORIES,
    FONTS_256
};
