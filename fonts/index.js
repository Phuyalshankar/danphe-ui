'use strict';

/**
 * 🐬 DANPHE FONTS 256
 * Universal Single-Pack 256 Font Suite
 */

const { FONTS_256, CATEGORIES } = require('./FONTS_256');
const {
    getFontFromOpcode,
    generateFontCSS,
    getGoogleFontsLinkTags,
    renderCurvedTextSVG
} = require('./TitanFontEngine');

module.exports = {
    FONTS_256,
    CATEGORIES,
    getFontFromOpcode,
    generateFontCSS,
    getGoogleFontsLinkTags,
    renderCurvedTextSVG
};
