// src/framework/ub/ubParser.js
// 🐬 Utility Style Parser & Tailwind Translator

'use strict';

const { getOKLCH, COLOR_INDEX_MAP, ROUNDED_MAP, buildGradient } = require('./ubColors');

const PX_MULTIPLIER = 4;
const GAP_MULTIPLIER = 4;
const SIZE_MULTIPLIER = 4;
const BORDER_MULTIPLIER = 1;

function parseSpacing(value) {
    if (typeof value === 'number') {
        return { t: value, r: value, b: value, l: value };
    }
    if (typeof value === 'string') {
        const num = parseInt(value);
        if (!isNaN(num)) {
            return { t: num, r: num, b: num, l: num };
        }
    }
    return { t: 0, r: 0, b: 0, l: 0 };
}

function px(value) { return value * PX_MULTIPLIER; }
function gapPx(value) { return value * GAP_MULTIPLIER; }
function borderPx(value) { return value * BORDER_MULTIPLIER; }

// ─── ANIMATION ────────────────────────────────────────────────────────────────
const KEYFRAMES = {
    'framer-spring': '@keyframes framer-spring { 0% { opacity:0; transform:scale(0.8); } 60% { transform:scale(1.05); } 100% { opacity:1; transform:scale(1); } }',
    'framer-slide-up': '@keyframes framer-slide-up { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }',
    'framer-bounce': '@keyframes framer-bounce { 0% { opacity:0; transform:scale(0.3); } 50% { transform:scale(1.05); } 70% { transform:scale(0.9); } 100% { opacity:1; transform:scale(1); } }',
    'framer-fade': '@keyframes framer-fade { from { opacity:0; } to { opacity:1; } }',
    'framer-flip': '@keyframes framer-flip { from { opacity:0; transform:rotateY(-90deg); } to { opacity:1; transform:rotateY(0); } }',
    'framer-zoom': '@keyframes framer-zoom { from { opacity:0; transform:scale(0.5); } to { opacity:1; transform:scale(1); } }',
    'shake': '@keyframes shake { 0%,100% { transform:translateX(0); } 10%,30%,50%,70%,90% { transform:translateX(-6px); } 20%,40%,60%,80% { transform:translateX(6px); } }',
    'pulse': '@keyframes pulse { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.05); opacity:0.8; } }',
    'rotateIn': '@keyframes rotateIn { from { opacity:0; transform:rotate(-180deg) scale(0); } to { opacity:1; transform:rotate(0) scale(1); } }',
    'slideLeft': '@keyframes slideLeft { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0); } }',
    'slideRight': '@keyframes slideRight { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }',
    'fadeInUp': '@keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }',
    'btn-glow-pulse': '@keyframes btn-glow-pulse { 0%,100% { box-shadow:0 0 8px 2px rgba(59,130,246,0.4); } 50% { box-shadow:0 0 20px 6px rgba(59,130,246,0.7); } }',
};

const ANIMATION_STYLE_MAP = {
    'framer-spring': 'animation: framer-spring 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;',
    'framer-slide-up': 'animation: framer-slide-up 0.4s ease-out forwards;',
    'framer-bounce': 'animation: framer-bounce 0.6s ease forwards;',
    'framer-fade': 'animation: framer-fade 0.3s ease forwards;',
    'framer-flip': 'animation: framer-flip 0.5s ease forwards;',
    'framer-zoom': 'animation: framer-zoom 0.4s ease forwards;',
    'shake': 'animation: shake 0.5s ease;',
    'pulse': 'animation: pulse 1.5s ease-in-out infinite;',
    'rotateIn': 'animation: rotateIn 0.6s ease forwards;',
    'slideLeft': 'animation: slideLeft 0.4s ease-out forwards;',
    'slideRight': 'animation: slideRight 0.4s ease-out forwards;',
    'fadeInUp': 'animation: fadeInUp 0.4s ease-out forwards;',
};

function packAnimation(animation) {
    if (!animation) return 0;
    const map = {
        'none': 0, 'fade': 0x01, 'slide': 0x02, 'scale': 0x04,
        'bounce': 0x08, 'rotate': 0x10, 'pulse': 0x20,
        'shake': 0x01, 'framer-spring': 0x01, 'framer-slide-up': 0x02,
        'framer-bounce': 0x08, 'framer-fade': 0x01, 'framer-flip': 0x10,
        'framer-zoom': 0x04, 'fadeInUp': 0x01, 'slideLeft': 0x02,
        'slideRight': 0x02, 'rotateIn': 0x10, 'btn-glow-pulse': 0x20,
    };
    return map[animation] || 0;
}

function injectKeyframes() {
    return '';
}

// ─── FLEX MAP ──────────────────────────────────────────────────────────────────
const FLEX_MAP = {
    'flex': ['display: flex;'],
    'flex-row': ['display: flex;', 'flex-direction: row;'],
    'flex-col': ['display: flex;', 'flex-direction: column;'],
    'flex-column': ['display: flex;', 'flex-direction: column;'],
    'flex-left': ['display: flex;', 'justify-content: flex-start;', 'align-items: center;'],
    'flex-right': ['display: flex;', 'justify-content: flex-end;', 'align-items: center;'],
    'flex-center': ['display: flex;', 'justify-content: center;', 'align-items: center;'],
    'flex-between': ['display: flex;', 'justify-content: space-between;', 'align-items: center;'],
    'flex-around': ['display: flex;', 'justify-content: space-around;', 'align-items: center;'],
    'flex-evenly': ['display: flex;', 'justify-content: space-evenly;', 'align-items: center;'],
    'flex-start': ['display: flex;', 'justify-content: flex-start;', 'align-items: flex-start;'],
    'flex-end': ['display: flex;', 'justify-content: flex-end;', 'align-items: flex-end;'],
    'flex-stretch': ['display: flex;', 'justify-content: center;', 'align-items: stretch;'],
    'flex-wrap': ['display: flex;', 'flex-wrap: wrap;'],
    'flex-nowrap': ['display: flex;', 'flex-wrap: nowrap;'],
    'flex-1': ['flex: 1 1 0%;'],
    'flex-auto': ['flex: 1 1 auto;'],
    'flex-none': ['flex: none;'],
    'flex-grow': ['flex-grow: 1;'],
    'flex-shrink': ['flex-shrink: 1;'],
    'items-center': ['align-items: center;'],
    'items-start': ['align-items: flex-start;'],
    'items-end': ['align-items: flex-end;'],
    'items-stretch': ['align-items: stretch;'],
    'justify-center': ['justify-content: center;'],
    'justify-start': ['justify-content: flex-start;'],
    'justify-end': ['justify-content: flex-end;'],
    'justify-between': ['justify-content: space-between;'],
    'justify-around': ['justify-content: space-around;'],
    'justify-evenly': ['justify-content: space-evenly;'],
    'flexcol-left': ['display: flex;', 'flex-direction: column;', 'align-items: flex-start;'],
    'flexcol-right': ['display: flex;', 'flex-direction: column;', 'align-items: flex-end;'],
    'flexcol-center': ['display: flex;', 'flex-direction: column;', 'align-items: center;', 'justify-content: center;'],
    'flexcol-between': ['display: flex;', 'flex-direction: column;', 'justify-content: space-between;'],
    'flexcol-start': ['display: flex;', 'flex-direction: column;', 'justify-content: flex-start;'],
    'flexcol-end': ['display: flex;', 'flex-direction: column;', 'justify-content: flex-end;'],
    'flex-row-center': ['display: flex;', 'flex-direction: row;', 'align-items: center;', 'justify-content: center;'],
    'flex-row-between': ['display: flex;', 'flex-direction: row;', 'align-items: center;', 'justify-content: space-between;'],
    'flex-row-around': ['display: flex;', 'flex-direction: row;', 'align-items: center;', 'justify-content: space-around;'],
    'flex-row-evenly': ['display: flex;', 'flex-direction: row;', 'align-items: center;', 'justify-content: space-evenly;'],
    'flex-row-start': ['display: flex;', 'flex-direction: row;', 'align-items: center;', 'justify-content: flex-start;'],
    'flex-row-end': ['display: flex;', 'flex-direction: row;', 'align-items: center;', 'justify-content: flex-end;'],
    'flex-col-center': ['display: flex;', 'flex-direction: column;', 'align-items: center;', 'justify-content: center;'],
    'flex-col-between': ['display: flex;', 'flex-direction: column;', 'align-items: center;', 'justify-content: space-between;'],
    'flex-col-around': ['display: flex;', 'flex-direction: column;', 'align-items: center;', 'justify-content: space-around;'],
    'flex-col-evenly': ['display: flex;', 'flex-direction: column;', 'align-items: center;', 'justify-content: space-evenly;'],
    'flex-col-start': ['display: flex;', 'flex-direction: column;', 'align-items: center;', 'justify-content: flex-start;'],
    'flex-col-end': ['display: flex;', 'flex-direction: column;', 'align-items: center;', 'justify-content: flex-end;'],
    'row': ['display: flex;', 'flex-direction: row;'],
    'column': ['display: flex;', 'flex-direction: column;'],
};

// ─── SHADOW SCALES ───────────────────────────────────────────────────────────
const SHADOW_SCALES = {
    '1': '0 1px 2px 0 rgba(0,0,0,0.05)',
    '2': '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
    '3': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
    '4': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
    '5': '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
    '6': '0 25px 50px -12px rgba(0,0,0,0.25)',
    '7': '0 35px 60px -15px rgba(0,0,0,0.3)',
    '8': '0 45px 65px -15px rgba(0,0,0,0.35)',
    '9': '0 50px 70px -15px rgba(0,0,0,0.4)',
    '10': '0 60px 80px -20px rgba(0,0,0,0.45)',
};

// ─── COMPONENT STYLES ────────────────────────────────────────────────────────
const BUTTON_STYLES = {
    'btn': [
        'display: inline-flex;', 'align-items: center;', 'justify-content: center;',
        'padding: 10px 20px;', 'font-size: 14px;', 'font-weight: 500;',
        'border-radius: 8px;', 'cursor: pointer;',
        'transition: all 0.3s cubic-bezier(0.4,0,0.2,1);',
        'border: none;', 'outline: none;', 'gap: 8px;',
        'position: relative;', 'overflow: hidden;',
        'transform: translateY(0);',
        'box-shadow: 0 2px 4px rgba(0,0,0,0.1);',
    ],
    'btn-sm': ['padding: 6px 12px;', 'font-size: 12px;', 'border-radius: 6px;'],
    'btn-md': ['padding: 10px 20px;', 'font-size: 14px;', 'border-radius: 8px;'],
    'btn-lg': ['padding: 14px 28px;', 'font-size: 16px;', 'border-radius: 10px;'],
    'btn-primary': ['background: linear-gradient(135deg, #3b82f6, #2563eb);', 'color: white;'],
    'btn-secondary': ['background: linear-gradient(135deg, #6b7280, #4b5563);', 'color: white;'],
    'btn-success': ['background: linear-gradient(135deg, #10b981, #059669);', 'color: white;'],
    'btn-danger': ['background: linear-gradient(135deg, #ef4444, #dc2626);', 'color: white;'],
    'btn-warning': ['background: linear-gradient(135deg, #f59e0b, #d97706);', 'color: white;'],
    'btn-info': ['background: linear-gradient(135deg, #06b6d4, #0891b2);', 'color: white;'],
    'btn-outline': ['background: transparent;', 'border: 2px solid;'],
    'btn-ghost': ['background: transparent;', 'box-shadow: none;'],
    'btn-glow': ['animation: btn-glow-pulse 2s infinite;'],
};

const INPUT_STYLES = {
    'input': [
        'padding: 10px 14px;', 'font-size: 14px;',
        'border: 2px solid #e2e8f0;', 'border-radius: 8px;',
        'outline: none;', 'transition: all 0.3s ease;',
        'width: 100%;', 'box-sizing: border-box;', 'background: white;',
    ],
    'input-sm': ['padding: 6px 10px;', 'font-size: 12px;', 'border-radius: 6px;'],
    'input-md': ['padding: 10px 14px;', 'font-size: 14px;', 'border-radius: 8px;'],
    'input-lg': ['padding: 14px 18px;', 'font-size: 16px;', 'border-radius: 10px;'],
    'input-error': ['border-color: #ef4444;', 'box-shadow: 0 0 0 3px rgba(239,68,68,0.1);'],
    'input-success': ['border-color: #10b981;', 'box-shadow: 0 0 0 3px rgba(16,185,129,0.1);'],
};

const CARD_STYLES = {
    'card': [
        'background: white;', 'border-radius: 12px;',
        'border: 1px solid #cbd5e1;',
        'box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);',
        'padding: 16px;', 'transition: all 0.3s ease;',
    ],
    'card-hover': ['cursor: pointer;'],
    'card-click': ['cursor: pointer;', 'user-select: none;'],
    'card-glass': [
        'background: rgba(255,255,255,0.1);',
        'backdrop-filter: blur(10px);',
        'border: 1px solid rgba(255,255,255,0.2);',
    ],
};

const CHECKBOX_STYLES = {
    'checkbox': [
        'appearance: none;', '-webkit-appearance: none;',
        'width: 20px;', 'height: 20px;',
        'border: 2px solid #e2e8f0;', 'border-radius: 4px;',
        'background: white;', 'cursor: pointer;',
        'transition: all 0.2s ease;',
    ],
};

const SELECT_STYLES = {
    'select': [
        'padding: 10px 14px;', 'font-size: 14px;',
        'border: 2px solid #e2e8f0;', 'border-radius: 8px;',
        'background: white;', 'cursor: pointer;',
        'outline: none;', 'width: 100%;',
    ],
};

const MAX_WIDTH_MAP = {
    'max-w-xs': ['max-width: 20rem;'],
    'max-w-sm': ['max-width: 24rem;'],
    'max-w-md': ['max-width: 28rem;'],
    'max-w-lg': ['max-width: 32rem;'],
    'max-w-xl': ['max-width: 36rem;'],
    'max-w-2xl': ['max-width: 42rem;'],
    'max-w-3xl': ['max-width: 48rem;'],
    'max-w-4xl': ['max-width: 56rem;'],
    'max-w-5xl': ['max-width: 64rem;'],
    'max-w-full': ['max-width: 100%;'],
};

// ─── FULL CSS SUPPORT: parseClass ──────────────────────────────────────────
function parseClass(cls, darkMode = false) {
    const styles = {};

    if (FLEX_MAP[cls]) {
        FLEX_MAP[cls].forEach(rule => {
            const [k, v] = rule.replace(';', '').split(':').map(s => s.trim());
            const key = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            styles[key] = v;
        });
        return styles;
    }

    for (const [name, rules] of Object.entries({ ...BUTTON_STYLES, ...INPUT_STYLES, ...CARD_STYLES, ...CHECKBOX_STYLES, ...SELECT_STYLES, ...MAX_WIDTH_MAP })) {
        if (cls === name) {
            rules.forEach(rule => {
                if (rule.startsWith('&:')) return;
                const [k, v] = rule.replace(';', '').split(':').map(s => s.trim());
                if (k && v) {
                    const key = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
                    styles[key] = v;
                }
            });
            return styles;
        }
    }

    const bgGlassColorMatch = cls.match(/^bg-glass-([a-z]+)-(\d+)$/);
    if (bgGlassColorMatch) {
        const [, color, shadeStr] = bgGlassColorMatch;
        const shade = parseInt(shadeStr);
        const base = getOKLCH(color, shade, darkMode);
        const glassAlpha = shade <= 200 ? 0.22 : shade <= 500 ? 0.32 : 0.42;
        styles.backgroundColor = base.replace(')', ` / ${glassAlpha})`);
        styles.backdropFilter = 'blur(20px) saturate(200%) brightness(1.1)';
        styles.WebkitBackdropFilter = 'blur(20px) saturate(200%) brightness(1.1)';
        styles.border = '1px solid rgba(255, 255, 255, 0.40)';
        styles.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.75)';
        styles.borderRadius = '20px';
        styles.overflow = 'hidden';
        styles.position = 'relative';
        return styles;
    }

    const bgGlassMatch = cls.match(/^bg-glass-(\d+)$/);
    if (bgGlassMatch) {
        const [, alphaStr] = bgGlassMatch;
        const alpha = Math.min(1, Math.max(0, parseInt(alphaStr) / 255));
        styles.backgroundColor = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        styles.backdropFilter = 'blur(24px) saturate(160%) brightness(1.05)';
        styles.WebkitBackdropFilter = 'blur(24px) saturate(160%) brightness(1.05)';
        styles.border = '1px solid rgba(255, 255, 255, 0.45)';
        styles.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.80)';
        styles.borderRadius = '20px';
        styles.overflow = 'hidden';
        styles.position = 'relative';
        return styles;
    }

    const bgMatch = cls.match(/^bg-([a-z]+)-(\d+)(?:\/(\d+))?$/);
    if (bgMatch) {
        const [, color, shade, opacity] = bgMatch;
        const oklchColor = getOKLCH(color, parseInt(shade), darkMode);
        styles.backgroundColor = opacity ? oklchColor.replace(')', ` / ${parseInt(opacity) / 100})`) : oklchColor;
        return styles;
    }

    const textColorMatch = cls.match(/^text-([a-z]+)-(\d+)(?:\/(\d+))?$/);
    if (textColorMatch) {
        const [, color, shade] = textColorMatch;
        styles.color = getOKLCH(color, parseInt(shade), darkMode);
        return styles;
    }

    if (cls === 'text-sm') { styles.fontSize = '0.875rem'; return styles; }
    if (cls === 'text-base') { styles.fontSize = '1rem'; return styles; }
    if (cls === 'text-lg') { styles.fontSize = '1.125rem'; return styles; }
    if (cls === 'text-xl') { styles.fontSize = '1.25rem'; return styles; }
    if (cls === 'text-2xl') { styles.fontSize = '1.5rem'; return styles; }
    if (cls === 'text-3xl') { styles.fontSize = '1.875rem'; return styles; }
    if (cls === 'text-4xl') { styles.fontSize = '2.25rem'; return styles; }
    if (cls === 'font-bold') { styles.fontWeight = 'bold'; return styles; }
    if (cls === 'font-semibold') { styles.fontWeight = '600'; return styles; }
    if (cls === 'font-medium') { styles.fontWeight = '500'; return styles; }
    if (cls === 'text-center') { styles.textAlign = 'center'; return styles; }
    if (cls === 'text-left') { styles.textAlign = 'left'; return styles; }
    if (cls === 'text-right') { styles.textAlign = 'right'; return styles; }
    if (cls === 'text-white') { styles.color = 'white'; return styles; }
    if (cls === 'text-black') { styles.color = 'black'; return styles; }
    if (cls === 'bg-white') { styles.backgroundColor = 'white'; return styles; }
    if (cls === 'bg-black') { styles.backgroundColor = 'black'; return styles; }
    if (cls === 'bg-transparent') { styles.backgroundColor = 'transparent'; return styles; }

    const spacingMatch = cls.match(/^(p|m|pl|pr|ml|mr|pt|pb|mt|mb|px|py|mx|my)-(\d+(?:\.\d+)?)$/);
    if (spacingMatch) {
        const [, type, val] = spacingMatch;
        const v = `${parseFloat(val) * PX_MULTIPLIER}px`;
        switch (type) {
            case 'p': styles.padding = v; break;
            case 'm': styles.margin = v; break;
            case 'pl': styles.paddingLeft = v; break;
            case 'pr': styles.paddingRight = v; break;
            case 'pt': styles.paddingTop = v; break;
            case 'pb': styles.paddingBottom = v; break;
            case 'px': styles.paddingLeft = v; styles.paddingRight = v; break;
            case 'py': styles.paddingTop = v; styles.paddingBottom = v; break;
            case 'ml': styles.marginLeft = v; break;
            case 'mr': styles.marginRight = v; break;
            case 'mt': styles.marginTop = v; break;
            case 'mb': styles.marginBottom = v; break;
            case 'mx': styles.marginLeft = v; styles.marginRight = v; break;
            case 'my': styles.marginTop = v; styles.marginBottom = v; break;
        }
        return styles;
    }

    if (cls === 'w-full' || cls === 'w-100') { styles.width = '100%'; return styles; }
    if (cls === 'h-full' || cls === 'h-100') { styles.height = '100%'; return styles; }
    if (cls === 'h-screen') { styles.height = '100vh'; return styles; }
    if (cls === 'w-screen') { styles.width = '100vw'; return styles; }
    if (cls === 'min-h-screen') { styles.height = '100vh'; return styles; }
    if (cls === 'min-w-full') { styles.width = '100%'; return styles; }
    if (cls === 'max-w-full') { styles.maxWidth = '100%'; return styles; }

    const wMatch = cls.match(/^w-(\d+(?:\.\d+)?)$/);
    if (wMatch) { styles.width = `${parseFloat(wMatch[1]) * SIZE_MULTIPLIER}px`; return styles; }
    const hMatch = cls.match(/^h-(\d+(?:\.\d+)?)$/);
    if (hMatch) { styles.height = `${parseFloat(hMatch[1]) * SIZE_MULTIPLIER}px`; return styles; }

    const gapMatch = cls.match(/^gap-(\d+(?:\.\d+)?)$/);
    if (gapMatch) { styles.gap = `${parseFloat(gapMatch[1]) * GAP_MULTIPLIER}px`; return styles; }
    const gapXMatch = cls.match(/^gap-x-(\d+(?:\.\d+)?)$/);
    if (gapXMatch) { styles.columnGap = `${parseFloat(gapXMatch[1]) * GAP_MULTIPLIER}px`; return styles; }
    const gapYMatch = cls.match(/^gap-y-(\d+(?:\.\d+)?)$/);
    if (gapYMatch) { styles.rowGap = `${parseFloat(gapYMatch[1]) * GAP_MULTIPLIER}px`; return styles; }

    if (cls === 'rounded') { styles.borderRadius = '4px'; return styles; }
    if (cls === 'rounded-sm') { styles.borderRadius = '2px'; return styles; }
    if (cls === 'rounded-md') { styles.borderRadius = '6px'; return styles; }
    if (cls === 'rounded-lg') { styles.borderRadius = '8px'; return styles; }
    if (cls === 'rounded-xl') { styles.borderRadius = '12px'; return styles; }
    if (cls === 'rounded-2xl') { styles.borderRadius = '16px'; return styles; }
    if (cls === 'rounded-3xl') { styles.borderRadius = '24px'; return styles; }
    if (cls === 'rounded-full') { styles.borderRadius = '9999px'; return styles; }

    const roundedNumMatch = cls.match(/^rounded-(\d+)$/);
    if (roundedNumMatch) { styles.borderRadius = `${parseInt(roundedNumMatch[1])}px`; return styles; }

    const cornerMatch = cls.match(/^rounded-(tl|tr|bl|br)-(\d+)$/);
    if (cornerMatch) {
        const [, corner, val] = cornerMatch;
        const v = `${parseInt(val)}px`;
        if (corner === 'tl') styles.borderTopLeftRadius = v;
        if (corner === 'tr') styles.borderTopRightRadius = v;
        if (corner === 'bl') styles.borderBottomLeftRadius = v;
        if (corner === 'br') styles.borderBottomRightRadius = v;
        return styles;
    }

    if (cls === 'shadow' || cls === 'shadow-md') { styles.boxShadow = SHADOW_SCALES['3']; return styles; }
    if (cls === 'shadow-sm') { styles.boxShadow = SHADOW_SCALES['2']; return styles; }
    if (cls === 'shadow-lg') { styles.boxShadow = SHADOW_SCALES['4']; return styles; }
    if (cls === 'shadow-xl') { styles.boxShadow = SHADOW_SCALES['5']; return styles; }
    if (cls === 'shadow-2xl') { styles.boxShadow = SHADOW_SCALES['6']; return styles; }
    if (cls === 'shadow-inner') { styles.boxShadow = 'inset 0 2px 4px 0 rgba(0,0,0,0.05)'; return styles; }
    if (cls === 'shadow-none') { styles.boxShadow = 'none'; return styles; }
    const shadowNumMatch = cls.match(/^shadow-(\d+)$/);
    if (shadowNumMatch) { styles.boxShadow = SHADOW_SCALES[shadowNumMatch[1]] || SHADOW_SCALES['3']; return styles; }

    const opacityMatch = cls.match(/^opacity-(\d+)$/);
    if (opacityMatch) { styles.opacity = parseInt(opacityMatch[1]) / 100; return styles; }

    const zMatch = cls.match(/^z-(\d+)$/);
    if (zMatch) { styles.zIndex = parseInt(zMatch[1]); return styles; }

    if (cls === 'relative') { styles.position = 'relative'; return styles; }
    if (cls === 'absolute') { styles.position = 'absolute'; return styles; }
    if (cls === 'fixed') { styles.position = 'fixed'; return styles; }
    if (cls === 'sticky') { styles.position = 'sticky'; return styles; }
    if (cls === 'static') { styles.position = 'static'; return styles; }

    const topMatch = cls.match(/^top-(\d+)$/);
    if (topMatch) { styles.top = `${parseInt(topMatch[1]) * PX_MULTIPLIER}px`; return styles; }
    const bottomMatch = cls.match(/^bottom-(\d+)$/);
    if (bottomMatch) { styles.bottom = `${parseInt(bottomMatch[1]) * PX_MULTIPLIER}px`; return styles; }
    const leftMatch = cls.match(/^left-(\d+)$/);
    if (leftMatch) { styles.left = `${parseInt(leftMatch[1]) * PX_MULTIPLIER}px`; return styles; }
    const rightMatch = cls.match(/^right-(\d+)$/);
    if (rightMatch) { styles.right = `${parseInt(rightMatch[1]) * PX_MULTIPLIER}px`; return styles; }

    if (cls.startsWith('rotate-')) {
        const val = parseInt(cls.slice(7));
        if (!isNaN(val)) { styles.transform = `rotate(${val}deg)`; return styles; }
    }
    if (cls.startsWith('rotate-x-')) {
        const val = parseInt(cls.slice(9));
        if (!isNaN(val)) { styles.transform = `rotateX(${val}deg)`; return styles; }
    }
    if (cls.startsWith('rotate-y-')) {
        const val = parseInt(cls.slice(9));
        if (!isNaN(val)) { styles.transform = `rotateY(${val}deg)`; return styles; }
    }
    if (cls.startsWith('scale-')) {
        const val = parseInt(cls.slice(6)) / 100;
        if (!isNaN(val)) { styles.transform = `scale(${val})`; return styles; }
    }
    if (cls.startsWith('scale-x-')) {
        const val = parseInt(cls.slice(8)) / 100;
        if (!isNaN(val)) { styles.transform = `scaleX(${val})`; return styles; }
    }
    if (cls.startsWith('scale-y-')) {
        const val = parseInt(cls.slice(8)) / 100;
        if (!isNaN(val)) { styles.transform = `scaleY(${val})`; return styles; }
    }
    if (cls.startsWith('translate-x-')) {
        const val = parseInt(cls.slice(12)) * PX_MULTIPLIER;
        if (!isNaN(val)) { styles.transform = `translateX(${val}px)`; return styles; }
    }
    if (cls.startsWith('translate-y-')) {
        const val = parseInt(cls.slice(12)) * PX_MULTIPLIER;
        if (!isNaN(val)) { styles.transform = `translateY(${val}px)`; return styles; }
    }
    if (cls.startsWith('translate-')) {
        const val = parseInt(cls.slice(10)) * PX_MULTIPLIER;
        if (!isNaN(val)) { styles.transform = `translate(${val}px, ${val}px)`; return styles; }
    }
    if (cls === 'transform-none') { styles.transform = 'none'; return styles; }

    if (cls.startsWith('blur-')) {
        const val = parseInt(cls.slice(5));
        if (!isNaN(val)) { styles.filter = `blur(${val}px)`; return styles; }
    }
    if (cls.startsWith('brightness-')) {
        const val = parseInt(cls.slice(11)) / 100;
        if (!isNaN(val)) { styles.filter = `brightness(${val})`; return styles; }
    }
    if (cls.startsWith('contrast-')) {
        const val = parseInt(cls.slice(9)) / 100;
        if (!isNaN(val)) { styles.filter = `contrast(${val})`; return styles; }
    }
    if (cls.startsWith('grayscale-')) {
        const val = parseInt(cls.slice(10)) / 100;
        if (!isNaN(val)) { styles.filter = `grayscale(${val})`; return styles; }
    }
    if (cls.startsWith('hue-rotate-')) {
        const val = parseInt(cls.slice(11));
        if (!isNaN(val)) { styles.filter = `hue-rotate(${val}deg)`; return styles; }
    }
    if (cls.startsWith('invert-')) {
        const val = parseInt(cls.slice(7)) / 100;
        if (!isNaN(val)) { styles.filter = `invert(${val})`; return styles; }
    }
    if (cls.startsWith('saturate-')) {
        const val = parseInt(cls.slice(9)) / 100;
        if (!isNaN(val)) { styles.filter = `saturate(${val})`; return styles; }
    }
    if (cls.startsWith('sepia-')) {
        const val = parseInt(cls.slice(6)) / 100;
        if (!isNaN(val)) { styles.filter = `sepia(${val})`; return styles; }
    }
    if (cls === 'filter-none') { styles.filter = 'none'; return styles; }

    if (cls.startsWith('font-') && !cls.startsWith('font-')) {
        const fontName = cls.slice(5);
        if (fontName !== 'thin' && fontName !== 'extralight' && fontName !== 'light' &&
            fontName !== 'normal' && fontName !== 'medium' && fontName !== 'semibold' &&
            fontName !== 'bold' && fontName !== 'extrabold' && fontName !== 'black') {
            styles.fontFamily = fontName;
            return styles;
        }
    }
    if (cls === 'font-thin') { styles.fontWeight = '100'; return styles; }
    if (cls === 'font-extralight') { styles.fontWeight = '200'; return styles; }
    if (cls === 'font-light') { styles.fontWeight = '300'; return styles; }
    if (cls === 'font-normal') { styles.fontWeight = '400'; return styles; }
    if (cls === 'font-medium') { styles.fontWeight = '500'; return styles; }
    if (cls === 'font-semibold') { styles.fontWeight = '600'; return styles; }
    if (cls === 'font-bold') { styles.fontWeight = '700'; return styles; }
    if (cls === 'font-extrabold') { styles.fontWeight = '800'; return styles; }
    if (cls === 'font-black') { styles.fontWeight = '900'; return styles; }
    
    if (cls === 'italic') { styles.fontStyle = 'italic'; return styles; }
    if (cls === 'not-italic') { styles.fontStyle = 'normal'; return styles; }
    if (cls === 'underline') { styles.textDecoration = 'underline'; return styles; }
    if (cls === 'line-through') { styles.textDecoration = 'line-through'; return styles; }
    if (cls === 'no-underline') { styles.textDecoration = 'none'; return styles; }
    if (cls === 'overline') { styles.textDecoration = 'overline'; return styles; }
    
    if (cls === 'uppercase') { styles.textTransform = 'uppercase'; return styles; }
    if (cls === 'lowercase') { styles.textTransform = 'lowercase'; return styles; }
    if (cls === 'capitalize') { styles.textTransform = 'capitalize'; return styles; }
    if (cls === 'normal-case') { styles.textTransform = 'none'; return styles; }
    
    if (cls.startsWith('tracking-')) {
        const val = parseInt(cls.slice(9));
        if (!isNaN(val)) { styles.letterSpacing = `${val * 0.5}px`; return styles; }
    }
    if (cls.startsWith('leading-')) {
        const val = parseInt(cls.slice(8));
        if (!isNaN(val)) { styles.lineHeight = `${val * 4}px`; return styles; }
    }
    if (cls === 'truncate') { styles.overflow = 'hidden'; styles.textOverflow = 'ellipsis'; styles.whiteSpace = 'nowrap'; return styles; }
    if (cls === 'break-words') { styles.wordBreak = 'break-word'; return styles; }
    if (cls === 'break-all') { styles.wordBreak = 'break-all'; return styles; }
    if (cls === 'whitespace-normal') { styles.whiteSpace = 'normal'; return styles; }
    if (cls === 'whitespace-nowrap') { styles.whiteSpace = 'nowrap'; return styles; }
    if (cls === 'whitespace-pre') { styles.whiteSpace = 'pre'; return styles; }
    if (cls === 'whitespace-pre-line') { styles.whiteSpace = 'pre-line'; return styles; }
    if (cls === 'whitespace-pre-wrap') { styles.whiteSpace = 'pre-wrap'; return styles; }

    if (cls === 'grid') { styles.display = 'grid'; return styles; }
    if (cls === 'inline-grid') { styles.display = 'inline-grid'; return styles; }
    if (cls.startsWith('grid-cols-')) {
        const cols = parseInt(cls.slice(10));
        if (!isNaN(cols)) {
            styles.display = 'grid';
            styles.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
            return styles;
        }
    }
    if (cls.startsWith('grid-rows-')) {
        const rows = parseInt(cls.slice(10));
        if (!isNaN(rows)) {
            styles.display = 'grid';
            styles.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
            return styles;
        }
    }
    if (cls.startsWith('col-span-')) {
        const span = parseInt(cls.slice(9));
        if (!isNaN(span)) { styles.gridColumn = `span ${span}`; return styles; }
    }
    if (cls.startsWith('row-span-')) {
        const span = parseInt(cls.slice(9));
        if (!isNaN(span)) { styles.gridRow = `span ${span}`; return styles; }
    }
    if (cls === 'col-auto') { styles.gridColumn = 'auto'; return styles; }
    if (cls === 'row-auto') { styles.gridRow = 'auto'; return styles; }

    if (cls === 'block') { styles.display = 'block'; return styles; }
    if (cls === 'inline-block') { styles.display = 'inline-block'; return styles; }
    if (cls === 'inline') { styles.display = 'inline'; return styles; }
    if (cls === 'flex') { styles.display = 'flex'; return styles; }
    if (cls === 'inline-flex') { styles.display = 'inline-flex'; return styles; }
    if (cls === 'table') { styles.display = 'table'; return styles; }
    if (cls === 'table-cell') { styles.display = 'table-cell'; return styles; }
    if (cls === 'table-row') { styles.display = 'table-row'; return styles; }
    if (cls === 'hidden') { styles.display = 'none'; return styles; }

    if (cls === 'flex-1') { styles.flex = '1 1 0%'; return styles; }
    if (cls === 'flex-auto') { styles.flex = '1 1 auto'; return styles; }
    if (cls === 'flex-initial') { styles.flex = '0 1 auto'; return styles; }
    if (cls === 'flex-none') { styles.flex = 'none'; return styles; }
    if (cls === 'flex-grow') { styles.flexGrow = '1'; return styles; }
    if (cls === 'flex-grow-0') { styles.flexGrow = '0'; return styles; }
    if (cls === 'flex-shrink') { styles.flexShrink = '1'; return styles; }
    if (cls === 'flex-shrink-0') { styles.flexShrink = '0'; return styles; }
    if (cls === 'flex-wrap') { styles.flexWrap = 'wrap'; return styles; }
    if (cls === 'flex-wrap-reverse') { styles.flexWrap = 'wrap-reverse'; return styles; }
    if (cls === 'flex-nowrap') { styles.flexWrap = 'nowrap'; return styles; }

    if (cls === 'items-center') { styles.alignItems = 'center'; return styles; }
    if (cls === 'items-start') { styles.alignItems = 'flex-start'; return styles; }
    if (cls === 'items-end') { styles.alignItems = 'flex-end'; return styles; }
    if (cls === 'items-stretch') { styles.alignItems = 'stretch'; return styles; }
    if (cls === 'items-baseline') { styles.alignItems = 'baseline'; return styles; }
    if (cls === 'justify-center') { styles.justifyContent = 'center'; return styles; }
    if (cls === 'justify-start') { styles.justifyContent = 'flex-start'; return styles; }
    if (cls === 'justify-end') { styles.justifyContent = 'flex-end'; return styles; }
    if (cls === 'justify-between') { styles.justifyContent = 'space-between'; return styles; }
    if (cls === 'justify-around') { styles.justifyContent = 'space-around'; return styles; }
    if (cls === 'justify-evenly') { styles.justifyContent = 'space-evenly'; return styles; }
    if (cls === 'content-center') { styles.alignContent = 'center'; return styles; }
    if (cls === 'content-start') { styles.alignContent = 'flex-start'; return styles; }
    if (cls === 'content-end') { styles.alignContent = 'flex-end'; return styles; }
    if (cls === 'content-between') { styles.alignContent = 'space-between'; return styles; }
    if (cls === 'content-around') { styles.alignContent = 'space-around'; return styles; }
    if (cls === 'content-evenly') { styles.alignContent = 'space-evenly'; return styles; }
    if (cls === 'self-center') { styles.alignSelf = 'center'; return styles; }
    if (cls === 'self-start') { styles.alignSelf = 'flex-start'; return styles; }
    if (cls === 'self-end') { styles.alignSelf = 'flex-end'; return styles; }
    if (cls === 'self-stretch') { styles.alignSelf = 'stretch'; return styles; }
    if (cls === 'self-auto') { styles.alignSelf = 'auto'; return styles; }

    if (cls === 'border') { styles.border = '1px solid #e2e8f0'; return styles; }
    if (cls === 'border-2') { styles.border = '2px solid #e2e8f0'; return styles; }
    if (cls === 'border-4') { styles.border = '4px solid #e2e8f0'; return styles; }
    if (cls === 'border-8') { styles.border = '8px solid #e2e8f0'; return styles; }
    if (cls === 'border-none') { styles.border = 'none'; return styles; }
    if (cls === 'border-solid') { styles.borderStyle = 'solid'; return styles; }
    if (cls === 'border-dashed') { styles.borderStyle = 'dashed'; return styles; }
    if (cls === 'border-dotted') { styles.borderStyle = 'dotted'; return styles; }
    if (cls === 'border-double') { styles.borderStyle = 'double'; return styles; }
    if (cls === 'border-inset') { styles.borderStyle = 'inset'; return styles; }
    if (cls === 'border-outset') { styles.borderStyle = 'outset'; return styles; }
    if (cls === 'border-hidden') { styles.borderStyle = 'hidden'; return styles; }

    if (cls === 'overflow-hidden') { styles.overflow = 'hidden'; return styles; }
    if (cls === 'overflow-visible') { styles.overflow = 'visible'; return styles; }
    if (cls === 'overflow-scroll') { styles.overflow = 'scroll'; return styles; }
    if (cls === 'overflow-auto') { styles.overflow = 'auto'; return styles; }
    if (cls === 'overflow-x-auto') { styles.overflowX = 'auto'; return styles; }
    if (cls === 'overflow-y-auto') { styles.overflowY = 'auto'; return styles; }
    if (cls === 'overflow-x-hidden') { styles.overflowX = 'hidden'; return styles; }
    if (cls === 'overflow-y-hidden') { styles.overflowY = 'hidden'; return styles; }
    if (cls === 'overflow-x-scroll') { styles.overflowX = 'scroll'; return styles; }
    if (cls === 'overflow-y-scroll') { styles.overflowY = 'scroll'; return styles; }

    if (cls === 'cursor-pointer') { styles.cursor = 'pointer'; return styles; }
    if (cls === 'cursor-default') { styles.cursor = 'default'; return styles; }
    if (cls === 'cursor-not-allowed') { styles.cursor = 'not-allowed'; return styles; }
    if (cls === 'cursor-wait') { styles.cursor = 'wait'; return styles; }
    if (cls === 'cursor-text') { styles.cursor = 'text'; return styles; }
    if (cls === 'cursor-move') { styles.cursor = 'move'; return styles; }
    if (cls === 'cursor-grab') { styles.cursor = 'grab'; return styles; }
    if (cls === 'cursor-grabbing') { styles.cursor = 'grabbing'; return styles; }
    if (cls === 'cursor-zoom-in') { styles.cursor = 'zoom-in'; return styles; }
    if (cls === 'cursor-zoom-out') { styles.cursor = 'zoom-out'; return styles; }

    if (cls === 'select-none') { styles.userSelect = 'none'; return styles; }
    if (cls === 'select-text') { styles.userSelect = 'text'; return styles; }
    if (cls === 'select-all') { styles.userSelect = 'all'; return styles; }
    if (cls === 'select-auto') { styles.userSelect = 'auto'; return styles; }

    if (cls === 'pointer-events-none') { styles.pointerEvents = 'none'; return styles; }
    if (cls === 'pointer-events-auto') { styles.pointerEvents = 'auto'; return styles; }

    if (cls === 'visible') { styles.visibility = 'visible'; return styles; }
    if (cls === 'invisible') { styles.visibility = 'hidden'; return styles; }
    if (cls === 'collapse') { styles.visibility = 'collapse'; return styles; }

    if (cls === 'object-contain') { styles.objectFit = 'contain'; return styles; }
    if (cls === 'object-cover') { styles.objectFit = 'cover'; return styles; }
    if (cls === 'object-fill') { styles.objectFit = 'fill'; return styles; }
    if (cls === 'object-none') { styles.objectFit = 'none'; return styles; }
    if (cls === 'object-scale-down') { styles.objectFit = 'scale-down'; return styles; }

    if (cls === 'object-center') { styles.objectPosition = 'center'; return styles; }
    if (cls === 'object-top') { styles.objectPosition = 'top'; return styles; }
    if (cls === 'object-bottom') { styles.objectPosition = 'bottom'; return styles; }
    if (cls === 'object-left') { styles.objectPosition = 'left'; return styles; }
    if (cls === 'object-right') { styles.objectPosition = 'right'; return styles; }

    if (cls === 'bg-cover') { styles.backgroundSize = 'cover'; return styles; }
    if (cls === 'bg-contain') { styles.backgroundSize = 'contain'; return styles; }
    if (cls === 'bg-auto') { styles.backgroundSize = 'auto'; return styles; }
    if (cls === 'bg-center') { styles.backgroundPosition = 'center'; return styles; }
    if (cls === 'bg-top') { styles.backgroundPosition = 'top'; return styles; }
    if (cls === 'bg-bottom') { styles.backgroundPosition = 'bottom'; return styles; }
    if (cls === 'bg-left') { styles.backgroundPosition = 'left'; return styles; }
    if (cls === 'bg-right') { styles.backgroundPosition = 'right'; return styles; }
    if (cls === 'bg-no-repeat') { styles.backgroundRepeat = 'no-repeat'; return styles; }
    if (cls === 'bg-repeat') { styles.backgroundRepeat = 'repeat'; return styles; }
    if (cls === 'bg-repeat-x') { styles.backgroundRepeat = 'repeat-x'; return styles; }
    if (cls === 'bg-repeat-y') { styles.backgroundRepeat = 'repeat-y'; return styles; }
    if (cls === 'bg-fixed') { styles.backgroundAttachment = 'fixed'; return styles; }
    if (cls === 'bg-local') { styles.backgroundAttachment = 'local'; return styles; }
    if (cls === 'bg-scroll') { styles.backgroundAttachment = 'scroll'; return styles; }

    if (cls === 'bg-light') { styles.backgroundColor = '#f8fafc'; return styles; }
    if (cls === 'bg-dark') { styles.backgroundColor = '#1e293b'; return styles; }
    if (cls === 'bg-blue') { styles.backgroundColor = '#3b82f6'; return styles; }
    if (cls === 'bg-danger') { styles.backgroundColor = '#ef4444'; return styles; }
    if (cls === 'bg-success') { styles.backgroundColor = '#10b981'; return styles; }
    if (cls === 'bg-warning') { styles.backgroundColor = '#f59e0b'; return styles; }
    if (cls === 'bg-indigo') { styles.backgroundColor = '#6366f1'; return styles; }

    const gradientResult = buildGradient(cls, darkMode);
    if (gradientResult) {
        const [k, v] = gradientResult.replace(';', '').split(':').map(s => s.trim());
        styles.background = v;
        return styles;
    }

    if (cls.startsWith('animate-') || ANIMATION_STYLE_MAP[cls]) {
        const animName = cls.startsWith('animate-') ? cls.slice(8) : cls;
        styles.animation = animName;
        return styles;
    }

    return styles;
}

function parseTW(tw) {
    if (!tw || typeof tw !== 'string') return {};
    const mobileTw = tw.replace(/\[.*?\]/g, '').trim();
    const props = {};

    if (!mobileTw) return props;

    mobileTw.split(/\s+/).forEach(p => {
        if (!p) return;

        if (p === 'w-full' || p === 'w-screen' || p === 'w-100') {
            props.width = -1;
            return;
        }
        if (p.startsWith('w-')) {
            let valStr = p.slice(2);
            if (valStr.startsWith('[') && valStr.endsWith(']')) {
                valStr = valStr.slice(1, -1);
            }
            const val = parseInt(valStr);
            if (!isNaN(val)) {
                props.width = valStr.endsWith('px') || p.includes('[') ? val : val * PX_MULTIPLIER;
            }
            return;
        }

        if (p === 'h-full' || p === 'h-screen' || p === 'h-100') {
            props.height = -1;
            return;
        }
        if (p.startsWith('h-')) {
            let valStr = p.slice(2);
            if (valStr.startsWith('[') && valStr.endsWith(']')) {
                valStr = valStr.slice(1, -1);
            }
            const val = parseInt(valStr);
            if (!isNaN(val)) {
                props.height = valStr.endsWith('px') || p.includes('[') ? val : val * PX_MULTIPLIER;
            }
            return;
        }

        if (p.startsWith('z-')) {
            const zVal = parseInt(p.slice(2));
            if (!isNaN(zVal)) {
                props.zIndex = Math.min(zVal, 255);
            }
            return;
        }

        if (p.startsWith('opacity-')) {
            const opVal = parseInt(p.slice(8));
            if (!isNaN(opVal)) {
                props.opacity = Math.round((opVal / 100) * 255);
            }
            return;
        }

        if (p === 'rounded') {
            props.radius = 4;
            props.radiusExtended = 4;
            return;
        }
        if (p === 'rounded-full' || p === 'circle' || p === 'rounded-circle') {
            props.radius = 255;
            props.radiusExtended = 255;
            return;
        }
        if (p.startsWith('rounded-')) {
            let r = p.slice(8);
            if (r === 'none') { props.radius = 0; props.radiusExtended = 0; return; }
            if (r === 'sm') { props.radius = 2; props.radiusExtended = 2; return; }
            if (r === 'md') { props.radius = 6; props.radiusExtended = 6; return; }
            if (r === 'lg') { props.radius = 8; props.radiusExtended = 8; return; }
            if (r === 'xl') { props.radius = 12; props.radiusExtended = 12; return; }
            if (r === '2xl') { props.radius = 16; props.radiusExtended = 16; return; }
            if (r === '3xl') { props.radius = 24; props.radiusExtended = 24; return; }
            const num = parseInt(r);
            if (!isNaN(num)) {
                props.radius = Math.min(num, 255);
                props.radiusExtended = Math.min(num, 255);
            }
            return;
        }

        if (p === 'border' || p.startsWith('border-')) {
            props.border = true;
            props.borderWidth = '1px';
            if (p === 'border-2') props.borderWidth = '2px';
            else if (p === 'border-4') props.borderWidth = '4px';
            else if (p === 'border-8') props.borderWidth = '8px';
            else if (p === 'border-none') { props.border = false; props.borderWidth = '0px'; }
            else if (p.startsWith('border-')) {
                const colorPart = p.slice(7);
                if (colorPart !== 'solid' && colorPart !== 'dashed' && colorPart !== 'dotted' && colorPart !== 'inset' && colorPart !== 'outset') {
                    props.borderColor = colorPart;
                } else {
                    props.borderStyle = colorPart;
                }
            }
            return;
        }

        if (p.startsWith('bg-')) {
            const colorPart = p.slice(3);
            if (colorPart === 'white') { props.bg = 'white'; return; }
            if (colorPart === 'black') { props.bg = 'black'; return; }
            if (colorPart === 'transparent') { props.bg = 'transparent'; return; }
            props.bg = colorPart;
            return;
        }

        if (p === 'flex' || p === 'flex-row') {
            props.type = 'Row';
            props.orientation = 'horizontal';
            return;
        }
        if (p === 'flex-col' || p === 'flex-column') {
            props.type = 'Column';
            props.orientation = 'vertical';
            return;
        }
        if (p === 'flex-1') { props.flex = 1; return; }
        if (p === 'flex-2') { props.flex = 2; return; }
        if (p === 'flex-3') { props.flex = 3; return; }

        if (p === 'items-center') { props.items = 'center'; return; }
        if (p === 'items-start') { props.items = 'start'; return; }
        if (p === 'items-end') { props.items = 'end'; return; }
        if (p === 'justify-center') { props.justify = 'center'; return; }
        if (p === 'justify-between') { props.justify = 'between'; return; }
        if (p === 'justify-around') { props.justify = 'around'; return; }
        if (p === 'text-center') { props.align = 'center'; return; }
        if (p === 'text-left') { props.align = 'left'; return; }
        if (p === 'text-right') { props.align = 'right'; return; }

        if (p === 'Button' || p === 'button') { props.type = 'Button'; return; }
        if (p === 'Text' || p === 'text') { props.type = 'Text'; return; }
        if (p === 'Column' || p === 'column') { props.type = 'Column'; return; }
        if (p === 'Row' || p === 'row') { props.type = 'Row'; return; }
        if (p === 'Card') { props.type = 'Card'; props.elevation = 4; return; }
        if (p === 'Container') { props.type = 'Container'; return; }
        if (p === 'TextField' || p === 'input') { props.type = 'TextField'; return; }
        if (p === 'Image' || p === 'img') { props.type = 'Image'; return; }
        if (p === 'Icon' || p === 'i') { props.type = 'Icon'; return; }
        if (p === 'AppBar' || p === 'header') { props.type = 'AppBar'; return; }

        if (p.startsWith('p-') && !p.startsWith('px-') && !p.startsWith('py-') &&
            !p.startsWith('pt-') && !p.startsWith('pb-') && !p.startsWith('pl-') && !p.startsWith('pr-')) {
            const val = parseSpacingValue(p.slice(2));
            if (val !== undefined) { props.p = val; }
            return;
        }
        if (p.startsWith('px-')) {
            const val = parseSpacingValue(p.slice(3));
            if (val !== undefined) { props.pl = val; props.pr = val; }
            return;
        }
        if (p.startsWith('py-')) {
            const val = parseSpacingValue(p.slice(3));
            if (val !== undefined) { props.pt = val; props.pb = val; }
            return;
        }
        if (p.startsWith('pt-')) {
            const val = parseSpacingValue(p.slice(3));
            if (val !== undefined) props.pt = val;
            return;
        }
        if (p.startsWith('pb-')) {
            const val = parseSpacingValue(p.slice(3));
            if (val !== undefined) props.pb = val;
            return;
        }
        if (p.startsWith('pl-')) {
            const val = parseSpacingValue(p.slice(3));
            if (val !== undefined) props.pl = val;
            return;
        }
        if (p.startsWith('pr-')) {
            const val = parseSpacingValue(p.slice(3));
            if (val !== undefined) props.pr = val;
            return;
        }

        if (p.startsWith('m-') && !p.startsWith('mx-') && !p.startsWith('my-') &&
            !p.startsWith('mt-') && !p.startsWith('mb-') && !p.startsWith('ml-') && !p.startsWith('mr-')) {
            const val = parseSpacingValue(p.slice(2));
            if (val !== undefined) { props.m = val; }
            return;
        }
        if (p.startsWith('mx-')) {
            const val = parseSpacingValue(p.slice(3));
            if (val !== undefined) { props.ml = val; props.mr = val; }
            return;
        }
        if (p.startsWith('my-')) {
            const val = parseSpacingValue(p.slice(3));
            if (val !== undefined) { props.mt = val; props.mb = val; }
            return;
        }
        if (p.startsWith('mt-')) {
            const val = parseSpacingValue(p.slice(3));
            if (val !== undefined) props.mt = val;
            return;
        }
        if (p.startsWith('mb-')) {
            const val = parseSpacingValue(p.slice(3));
            if (val !== undefined) props.mb = val;
            return;
        }
        if (p.startsWith('ml-')) {
            const val = parseSpacingValue(p.slice(3));
            if (val !== undefined) props.ml = val;
            return;
        }
        if (p.startsWith('mr-')) {
            const val = parseSpacingValue(p.slice(3));
            if (val !== undefined) props.mr = val;
            return;
        }

        if (p.startsWith('gap-')) {
            const val = parseSpacingValue(p.slice(4));
            if (val !== undefined) props.gap = val;
            return;
        }

        if (p === 'shadow' || p === 'shadow-md') { props.elevation = 4; return; }
        if (p === 'shadow-sm' || p === 'shadow-xs') { props.elevation = 2; return; }
        if (p === 'shadow-lg') { props.elevation = 8; return; }
        if (p === 'shadow-xl') { props.elevation = 12; return; }
        if (p === 'shadow-2xl') { props.elevation = 16; return; }
        if (p === 'shadow-none') { props.elevation = 0; return; }

        // Card class — normalized utility style so it never breaks layout or border parsing
        if (p === 'card') {
            props.border = '1px solid #cbd5e1';
            props.borderColor = '#cbd5e1';
            props.borderWidth = '1px';
            props.bg = 'white';
            props.backgroundColor = 'white';
            if (!props.radius) props.radius = 12;
            if (!props.radiusExtended) props.radiusExtended = 12;
            return;
        }
        if (p === 'card-glass') {
            props.border = '1px solid rgba(255,255,255,0.2)';
            props.borderColor = 'rgba(255,255,255,0.2)';
            props.borderWidth = '1px';
            if (!props.radius) props.radius = 12;
            return;
        }

        if (p.startsWith('grid-cols-')) {
            props.type = 'GridView';
            props.columns = parseInt(p.slice(10)) || 2;
            return;
        }

        if (p === 'text-sm') { props.size = 14; return; }
        if (p === 'text-base') { props.size = 16; return; }
        if (p === 'text-lg') { props.size = 20; return; }
        if (p === 'text-xl') { props.size = 24; return; }
        if (p === 'text-2xl') { props.size = 32; return; }
        if (p === 'text-3xl') { props.size = 40; return; }
    });

    return props;
}

function parseSpacingValue(str) {
    if (!str) return undefined;
    let clean = str;
    if (clean.startsWith('[') && clean.endsWith(']')) {
        clean = clean.slice(1, -1);
    }
    const val = parseInt(clean);
    if (isNaN(val)) return undefined;
    if (clean.endsWith('px') || str.includes('[')) {
        return val;
    }
    return val * PX_MULTIPLIER;
}

function getColorIndex(colorName) {
    if (!colorName) return 0;
    const name = colorName.split('-')[0];
    return COLOR_INDEX_MAP[name] || 0;
}

function getRadiusExtended(className) {
    if (!className || typeof className !== 'string') return 0;
    const match = className.match(/(?:^|\s)rounded-([a-z0-9]+)/);
    if (match) {
        const val = match[1];
        if (ROUNDED_MAP[val] !== undefined) return ROUNDED_MAP[val];
        const num = parseInt(val);
        if (!isNaN(num)) return Math.min(num, 255);
    }
    return 0;
}

function getZIndex(className) {
    if (!className || typeof className !== 'string') return 0;
    const match = className.match(/(?:^|\s)z-(\d+)/);
    if (match) {
        return Math.min(parseInt(match[1], 10), 255);
    }
    return 0;
}

function parseWidth(className) {
    if (!className) return 0;
    if (className.includes('w-full') || className.includes('w-screen')) return -1;
    const match = className.match(/w-(\d+)/);
    if (match) return parseInt(match[1], 10) * 4;
    return 0;
}

function parseHeight(className) {
    if (!className) return 0;
    if (className.includes('h-full') || className.includes('h-screen')) return -1;
    const match = className.match(/h-(\d+)/);
    if (match) return parseInt(match[1], 10) * 4;
    return 0;
}

module.exports = {
    PX_MULTIPLIER,
    GAP_MULTIPLIER,
    SIZE_MULTIPLIER,
    BORDER_MULTIPLIER,
    parseSpacing,
    px,
    gapPx,
    borderPx,
    KEYFRAMES,
    ANIMATION_STYLE_MAP,
    packAnimation,
    injectKeyframes,
    FLEX_MAP,
    SHADOW_SCALES,
    BUTTON_STYLES,
    INPUT_STYLES,
    CARD_STYLES,
    CHECKBOX_STYLES,
    SELECT_STYLES,
    MAX_WIDTH_MAP,
    parseClass,
    parseTW,
    parseSpacingValue,
    getColorIndex,
    getRadiusExtended,
    getZIndex,
    parseWidth,
    parseHeight,
};
