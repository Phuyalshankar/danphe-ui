'use strict';

/**
 * 📏 SizingScale — Comprehensive Tailwind & Design System sizing scales (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl).
 */
const SIZING_SCALE = {
    'xs': { padding: '4px 8px', fontSize: '11px', radius: '4px', height: '28px' },
    'sm': { padding: '6px 12px', fontSize: '12px', radius: '6px', height: '32px' },
    'md': { padding: '10px 16px', fontSize: '14px', radius: '8px', height: '40px' },
    'lg': { padding: '12px 20px', fontSize: '16px', radius: '10px', height: '48px' },
    'xl': { padding: '16px 24px', fontSize: '18px', radius: '12px', height: '56px' },
    '2xl': { padding: '20px 32px', fontSize: '22px', radius: '16px', height: '64px' },
    '3xl': { padding: '24px 40px', fontSize: '26px', radius: '20px', height: '72px' },
    '4xl': { padding: '28px 48px', fontSize: '32px', radius: '24px', height: '80px' },
    '5xl': { padding: '32px 56px', fontSize: '40px', radius: '28px', height: '96px' },
};

module.exports = { SIZING_SCALE };
