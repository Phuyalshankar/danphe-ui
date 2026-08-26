'use strict';

/**
 * 🎨 InlineStyleParser — Parses React inline style objects ({ backgroundColor, borderRadius, padding }) into normalized props.
 */
class InlineStyleParser {
    static parseStyleObject(styleObj = {}) {
        if (!styleObj || typeof styleObj !== 'object') return {};

        const props = {};
        if (styleObj.backgroundColor || styleObj.bg) props.bg = styleObj.backgroundColor || styleObj.bg;
        if (styleObj.color) props.color = styleObj.color;
        if (styleObj.width) props.width = styleObj.width;
        if (styleObj.height) props.height = styleObj.height;
        if (styleObj.borderRadius || styleObj.radius) props.radius = parseInt(styleObj.borderRadius || styleObj.radius, 10) || 0;
        if (styleObj.border || styleObj.borderWidth || styleObj.borderColor) {
            props.border = styleObj.border || `${styleObj.borderWidth || '1px'} solid ${styleObj.borderColor || '#cbd5e1'}`;
            props.borderWidth = styleObj.borderWidth || '1px';
            props.borderColor = styleObj.borderColor || '#cbd5e1';
        }

        return props;
    }
}

module.exports = InlineStyleParser;
