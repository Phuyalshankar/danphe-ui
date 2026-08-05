'use strict';

/**
 * 🔤 TypographyDictionary — World-Class Typography & Font Utility System for Dolphin Native.
 * Supports Font Sizes (text-xs to text-9xl), Weights (100-900), Letter Spacing, Line Heights, Transforms, and Alignments.
 */
const FONT_SIZES = {
    'text-xs': { fontSize: '12px', lineHeight: '16px' },
    'text-sm': { fontSize: '14px', lineHeight: '20px' },
    'text-base': { fontSize: '16px', lineHeight: '24px' },
    'text-lg': { fontSize: '18px', lineHeight: '28px' },
    'text-xl': { fontSize: '20px', lineHeight: '28px' },
    'text-2xl': { fontSize: '24px', lineHeight: '32px' },
    'text-3xl': { fontSize: '30px', lineHeight: '36px' },
    'text-4xl': { fontSize: '36px', lineHeight: '40px' },
    'text-5xl': { fontSize: '48px', lineHeight: '1' },
    'text-6xl': { fontSize: '60px', lineHeight: '1' },
    'text-7xl': { fontSize: '72px', lineHeight: '1' },
    'text-8xl': { fontSize: '96px', lineHeight: '1' },
    'text-9xl': { fontSize: '128px', lineHeight: '1' },
};

const FONT_WEIGHTS = {
    'font-thin': 100,
    'font-extralight': 200,
    'font-light': 300,
    'font-normal': 400,
    'font-medium': 500,
    'font-semibold': 600,
    'font-bold': 700,
    'font-extrabold': 800,
    'font-black': 900,
};

const LETTER_SPACING = {
    'tracking-tighter': '-0.05em',
    'tracking-tight': '-0.025em',
    'tracking-normal': '0em',
    'tracking-wide': '0.025em',
    'tracking-wider': '0.05em',
    'tracking-widest': '0.1em',
};

const LINE_HEIGHTS = {
    'leading-none': 1,
    'leading-tight': 1.25,
    'leading-snug': 1.375,
    'leading-normal': 1.5,
    'leading-relaxed': 1.625,
    'leading-loose': 2,
};

class TypographyDictionary {
    static FONT_SIZES = FONT_SIZES;
    static FONT_WEIGHTS = FONT_WEIGHTS;
    static LETTER_SPACING = LETTER_SPACING;
    static LINE_HEIGHTS = LINE_HEIGHTS;

    static parseTypographyClass(className = '') {
        const cls = String(className).trim();
        if (FONT_SIZES[cls]) return FONT_SIZES[cls];
        if (FONT_WEIGHTS[cls]) return { fontWeight: FONT_WEIGHTS[cls] };
        if (LETTER_SPACING[cls]) return { letterSpacing: LETTER_SPACING[cls] };
        if (LINE_HEIGHTS[cls]) return { lineHeight: LINE_HEIGHTS[cls] };

        if (cls === 'text-left') return { textAlign: 'left' };
        if (cls === 'text-center') return { textAlign: 'center' };
        if (cls === 'text-right') return { textAlign: 'right' };
        if (cls === 'uppercase') return { textTransform: 'uppercase' };
        if (cls === 'lowercase') return { textTransform: 'lowercase' };
        if (cls === 'capitalize') return { textTransform: 'capitalize' };

        return null;
    }
}

module.exports = TypographyDictionary;
