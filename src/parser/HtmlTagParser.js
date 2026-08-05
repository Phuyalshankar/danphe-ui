'use strict';

/**
 * 🏷️ HtmlTagParser — Manages void tags, HTML structural validation, and tag type resolution.
 */
class HtmlTagParser {
    static VOID_TAGS = new Set([
        'AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR',
        'IMG', 'INPUT', 'LINK', 'META', 'PARAM',
        'SOURCE', 'TRACK', 'WBR', 'SLIDER', 'CHECKBOX',
        'VIDEO', 'AUDIO', 'IFRAME', 'CANVAS', 'SVG'
    ]);

    static isVoidTag(tagName = '') {
        return HtmlTagParser.VOID_TAGS.has(tagName.toUpperCase());
    }

    static mapTagToOpcode(tagName = '') {
        const tag = tagName.toLowerCase();
        switch (tag) {
            case 'button': return 0x10;
            case 'card': return 0x11;
            case 'div': case 'section': return 0x13;
            case 'span': case 'p': case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': case 'label': return 0x16;
            case 'img': return 0x17;
            case 'input': return 0x18;
            case 'select': return 0x1C;
            default: return 0x13; // Default container
        }
    }
}

module.exports = HtmlTagParser;
