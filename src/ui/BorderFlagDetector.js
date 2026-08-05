'use strict';

/**
 * 🔲 BorderFlagDetector — Reliably detects border props, border widths, colors, and Tailwind border classes.
 */
class BorderFlagDetector {
    static hasValidBorder(props = {}, tw = '') {
        const border = props.border;
        const borderWidth = props.borderWidth;
        const borderColor = props.borderColor;
        const twStr = String(tw || '');
        const classStr = String(props.className || '');

        if (twStr.includes('border') && !twStr.includes('border-none')) return true;
        if (classStr.includes('border') && !classStr.includes('border-none')) return true;
        if (border === true || border === 'true') return true;
        if (border && border !== 'none' && border !== '0' && border !== '0px' && border !== 0) return true;
        if (borderWidth && borderWidth !== '0' && borderWidth !== '0px' && borderWidth !== 0) return true;
        if (borderColor && borderColor !== 'transparent' && borderColor !== 'none' && borderColor !== '0') return true;

        return false;
    }
}

module.exports = BorderFlagDetector;
