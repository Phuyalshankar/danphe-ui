'use strict';

/**
 * 🐬 ub.js - Universal Utility Styling for Dolphin Native
 * Ported from ub.ts v19.0.3 — Full gradient, animation, color system
 * File/folder structure maintained as-is per original repo
 */

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const SCALE_MAX = 255;
const PX_MULTIPLIER = 4;
const GAP_MULTIPLIER = 4;
const SIZE_MULTIPLIER = 4;
const BORDER_MULTIPLIER = 1;

const { BASE_COLORS, getOKLCH, applyOpacity, getTextColorForBg, getColor, getShade, normalizeShade, resolveColorToHex } = require('./ub/colors');
const { parseSpacing, px, gapPx, borderPx } = require('./ub/spacing');
const { packAnimation, injectKeyframes } = require('./ub/animations');

const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 };

const SPACING_MAP = {
  p: 'padding', pt: 'padding-top', pb: 'padding-bottom',
  pl: 'padding-left', pr: 'padding-right',
  m: 'margin', mt: 'margin-top', mb: 'margin-bottom',
  ml: 'margin-left', mr: 'margin-right',
};

const BORDER_SIDE_MAP = { t: 'top', r: 'right', b: 'bottom', l: 'left' };

const FLEX_MAP = {
  'flex':         ['display: flex;'],
  'flex-row':     ['display: flex;', 'flex-direction: row;'],
  'flex-col':     ['display: flex;', 'flex-direction: column;'],
  'flex-column':  ['display: flex;', 'flex-direction: column;'],
  'flex-left':    ['display: flex;', 'justify-content: flex-start;', 'align-items: center;'],
  'flex-right':   ['display: flex;', 'justify-content: flex-end;', 'align-items: center;'],
  'flex-center':  ['display: flex;', 'justify-content: center;', 'align-items: center;'],
  'flex-between': ['display: flex;', 'justify-content: space-between;', 'align-items: center;'],
  'flex-around':  ['display: flex;', 'justify-content: space-around;', 'align-items: center;'],
  'flex-evenly':  ['display: flex;', 'justify-content: space-evenly;', 'align-items: center;'],
  'flex-start':   ['display: flex;', 'justify-content: flex-start;', 'align-items: flex-start;'],
  'flex-end':     ['display: flex;', 'justify-content: flex-end;', 'align-items: flex-end;'],
  'flex-stretch': ['display: flex;', 'justify-content: center;', 'align-items: stretch;'],
  'flex-wrap':    ['display: flex;', 'flex-wrap: wrap;'],
  'flex-nowrap':  ['display: flex;', 'flex-wrap: nowrap;'],
  'flex-1':       ['flex: 1 1 0%;'],
  'flex-auto':    ['flex: 1 1 auto;'],
  'flex-none':    ['flex: none;'],
  'flex-grow':    ['flex-grow: 1;'],
  'flex-shrink':  ['flex-shrink: 1;'],
  'items-center': ['align-items: center;'],
  'items-start':  ['align-items: flex-start;'],
  'items-end':    ['align-items: flex-end;'],
  'items-stretch':['align-items: stretch;'],
  'justify-center':   ['justify-content: center;'],
  'justify-start':    ['justify-content: flex-start;'],
  'justify-end':      ['justify-content: flex-end;'],
  'justify-between':  ['justify-content: space-between;'],
  'justify-around':   ['justify-content: space-around;'],
  'justify-evenly':   ['justify-content: space-evenly;'],
  'flexcol-left':     ['display: flex;', 'flex-direction: column;', 'align-items: flex-start;'],
  'flexcol-right':    ['display: flex;', 'flex-direction: column;', 'align-items: flex-end;'],
  'flexcol-center':   ['display: flex;', 'flex-direction: column;', 'align-items: center;', 'justify-content: center;'],
  'flexcol-between':  ['display: flex;', 'flex-direction: column;', 'justify-content: space-between;'],
  'flexcol-start':    ['display: flex;', 'flex-direction: column;', 'justify-content: flex-start;'],
  'flexcol-end':      ['display: flex;', 'flex-direction: column;', 'justify-content: flex-end;'],
  'flex-row-center':  ['display: flex;', 'flex-direction: row;', 'align-items: center;', 'justify-content: center;'],
  'flex-row-between': ['display: flex;', 'flex-direction: row;', 'align-items: center;', 'justify-content: space-between;'],
  'flex-row-around':  ['display: flex;', 'flex-direction: row;', 'align-items: center;', 'justify-content: space-around;'],
  'flex-row-evenly':  ['display: flex;', 'flex-direction: row;', 'align-items: center;', 'justify-content: space-evenly;'],
  'flex-row-start':   ['display: flex;', 'flex-direction: row;', 'align-items: center;', 'justify-content: flex-start;'],
  'flex-row-end':     ['display: flex;', 'flex-direction: row;', 'align-items: center;', 'justify-content: flex-end;'],
  'flex-col-center':  ['display: flex;', 'flex-direction: column;', 'align-items: center;', 'justify-content: center;'],
  'flex-col-between': ['display: flex;', 'flex-direction: column;', 'align-items: center;', 'justify-content: space-between;'],
  'flex-col-around':  ['display: flex;', 'flex-direction: column;', 'align-items: center;', 'justify-content: space-around;'],
  'flex-col-evenly':  ['display: flex;', 'flex-direction: column;', 'align-items: center;', 'justify-content: space-evenly;'],
  'flex-col-start':   ['display: flex;', 'flex-direction: column;', 'align-items: center;', 'justify-content: flex-start;'],
  'flex-col-end':     ['display: flex;', 'flex-direction: column;', 'align-items: center;', 'justify-content: flex-end;'],
  'row':          ['display: flex;', 'flex-direction: row;'],
  'column':       ['display: flex;', 'flex-direction: column;'],
};

// ─── SHADOW SCALES ───────────────────────────────────────────────────────────
const SHADOW_SCALES = {
  '1':  '0 1px 2px 0 rgba(0,0,0,0.05)',
  '2':  '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
  '3':  '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
  '4':  '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
  '5':  '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
  '6':  '0 25px 50px -12px rgba(0,0,0,0.25)',
  '7':  '0 35px 60px -15px rgba(0,0,0,0.3)',
  '8':  '0 45px 65px -15px rgba(0,0,0,0.35)',
  '9':  '0 50px 70px -15px rgba(0,0,0,0.4)',
  '10': '0 60px 80px -20px rgba(0,0,0,0.45)',
};

// ─── ANIMATION KEYFRAMES ─────────────────────────────────────────────────────
const KEYFRAMES = {
  'framer-spring':   '@keyframes framer-spring { 0% { opacity:0; transform:scale(0.8); } 60% { transform:scale(1.05); } 100% { opacity:1; transform:scale(1); } }',
  'framer-slide-up': '@keyframes framer-slide-up { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }',
  'framer-bounce':   '@keyframes framer-bounce { 0% { opacity:0; transform:scale(0.3); } 50% { transform:scale(1.05); } 70% { transform:scale(0.9); } 100% { opacity:1; transform:scale(1); } }',
  'framer-fade':     '@keyframes framer-fade { from { opacity:0; } to { opacity:1; } }',
  'framer-flip':     '@keyframes framer-flip { from { opacity:0; transform:rotateY(-90deg); } to { opacity:1; transform:rotateY(0); } }',
  'framer-zoom':     '@keyframes framer-zoom { from { opacity:0; transform:scale(0.5); } to { opacity:1; transform:scale(1); } }',
  'shake':           '@keyframes shake { 0%,100% { transform:translateX(0); } 10%,30%,50%,70%,90% { transform:translateX(-6px); } 20%,40%,60%,80% { transform:translateX(6px); } }',
  'pulse':           '@keyframes pulse { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.05); opacity:0.8; } }',
  'rotateIn':        '@keyframes rotateIn { from { opacity:0; transform:rotate(-180deg) scale(0); } to { opacity:1; transform:rotate(0) scale(1); } }',
  'slideLeft':       '@keyframes slideLeft { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0); } }',
  'slideRight':      '@keyframes slideRight { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }',
  'fadeInUp':        '@keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }',
  'btn-glow-pulse':  '@keyframes btn-glow-pulse { 0%,100% { box-shadow:0 0 8px 2px rgba(59,130,246,0.4); } 50% { box-shadow:0 0 20px 6px rgba(59,130,246,0.7); } }',
};

const ANIMATION_STYLE_MAP = {
  'framer-spring':   'animation: framer-spring 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;',
  'framer-slide-up': 'animation: framer-slide-up 0.4s ease-out forwards;',
  'framer-bounce':   'animation: framer-bounce 0.6s ease forwards;',
  'framer-fade':     'animation: framer-fade 0.3s ease forwards;',
  'framer-flip':     'animation: framer-flip 0.5s ease forwards;',
  'framer-zoom':     'animation: framer-zoom 0.4s ease forwards;',
  'shake':           'animation: shake 0.5s ease;',
  'pulse':           'animation: pulse 1.5s ease-in-out infinite;',
  'rotateIn':        'animation: rotateIn 0.6s ease forwards;',
  'slideLeft':       'animation: slideLeft 0.4s ease-out forwards;',
  'slideRight':      'animation: slideRight 0.4s ease-out forwards;',
  'fadeInUp':        'animation: fadeInUp 0.4s ease-out forwards;',
};

// ─── COMPONENT STYLES (Button, Input, Card) ───────────────────────────────────
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
  'btn-sm':   ['padding: 6px 12px;', 'font-size: 12px;', 'border-radius: 6px;'],
  'btn-md':   ['padding: 10px 20px;', 'font-size: 14px;', 'border-radius: 8px;'],
  'btn-lg':   ['padding: 14px 28px;', 'font-size: 16px;', 'border-radius: 10px;'],
  'btn-primary':   ['background: linear-gradient(135deg, #3b82f6, #2563eb);', 'color: white;'],
  'btn-secondary': ['background: linear-gradient(135deg, #6b7280, #4b5563);', 'color: white;'],
  'btn-success':   ['background: linear-gradient(135deg, #10b981, #059669);', 'color: white;'],
  'btn-danger':    ['background: linear-gradient(135deg, #ef4444, #dc2626);', 'color: white;'],
  'btn-warning':   ['background: linear-gradient(135deg, #f59e0b, #d97706);', 'color: white;'],
  'btn-info':      ['background: linear-gradient(135deg, #06b6d4, #0891b2);', 'color: white;'],
  'btn-outline':   ['background: transparent;', 'border: 2px solid;'],
  'btn-ghost':     ['background: transparent;', 'box-shadow: none;'],
  'btn-glow':      ['animation: btn-glow-pulse 2s infinite;'],
};

const INPUT_STYLES = {
  'input': [
    'padding: 10px 14px;', 'font-size: 14px;',
    'border: 2px solid #e2e8f0;', 'border-radius: 8px;',
    'outline: none;', 'transition: all 0.3s ease;',
    'width: 100%;', 'box-sizing: border-box;', 'background: white;',
  ],
  'input-sm':      ['padding: 6px 10px;', 'font-size: 12px;', 'border-radius: 6px;'],
  'input-md':      ['padding: 10px 14px;', 'font-size: 14px;', 'border-radius: 8px;'],
  'input-lg':      ['padding: 14px 18px;', 'font-size: 16px;', 'border-radius: 10px;'],
  'input-error':   ['border-color: #ef4444;', 'box-shadow: 0 0 0 3px rgba(239,68,68,0.1);'],
  'input-success': ['border-color: #10b981;', 'box-shadow: 0 0 0 3px rgba(16,185,129,0.1);'],
};

const CARD_STYLES = {
  'card': [
    'background: white;', 'border-radius: 12px;',
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

const MAX_WIDTH_MAP = {
  'max-w-xs':    ['max-width: 20rem;'],
  'max-w-sm':    ['max-width: 24rem;'],
  'max-w-md':    ['max-width: 28rem;'],
  'max-w-lg':    ['max-width: 32rem;'],
  'max-w-xl':    ['max-width: 36rem;'],
  'max-w-2xl':   ['max-width: 42rem;'],
  'max-w-3xl':   ['max-width: 48rem;'],
  'max-w-4xl':   ['max-width: 56rem;'],
  'max-w-5xl':   ['max-width: 64rem;'],
  'max-w-full':  ['max-width: 100%;'],
  'max-w-screen-sm': ['max-width: 640px;'],
  'max-w-screen-md': ['max-width: 768px;'],
  'max-w-screen-lg': ['max-width: 1024px;'],
  'max-w-screen-xl': ['max-width: 1280px;'],
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

// ─── LRU CACHE (v19+) ────────────────────────────────────────────────────────
class LRUCache {
  constructor(maxSize = 1000) {
    this._cache = new Map();
    this._maxSize = maxSize;
  }
  get(key) {
    const value = this._cache.get(key);
    if (value !== undefined) {
      this._cache.delete(key);
      this._cache.set(key, value);
    }
    return value;
  }
  set(key, value) {
    if (this._cache.size >= this._maxSize) {
      const firstKey = this._cache.keys().next().value;
      if (firstKey !== undefined) this._cache.delete(firstKey);
    }
    this._cache.set(key, value);
  }
  clear() { this._cache.clear(); }
  get size() { return this._cache.size; }
  has(key) { return this._cache.has(key); }
}

// ─── COLOR CACHE ──────────────────────────────────────────────────────────────
const COLOR_CACHE = new LRUCache(500);
const MAX_CACHE = 1000; // kept for backwards compat

function safeClamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function safeParseInt(v, fallback) {
  const n = parseInt(v);
  return isNaN(n) ? fallback : n;
}
function parseNumber(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

// ─── OKLCH COLOR GENERATOR, OPACITY & TEXT COLOR ───
// Delegated to ./ub/colors.js for modular architecture

function getTextColorForGradient(colors) {
  let totalL = 0, hueSum = 0;
  for (const color of colors) {
    const m = color.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
    if (m) { totalL += parseFloat(m[1]); hueSum += parseFloat(m[3]); }
  }
  const avgL = totalL / colors.length;
  const avgH = hueSum / colors.length;
  return avgL > 0.55 ? `oklch(0.10 0.01 ${avgH})` : `oklch(0.99 0.005 ${avgH})`;
}

// ─── CSS PIXEL HELPERS (Delegated to ./ub/spacing.js) ───

// ─── GRADIENT BUILDER ─────────────────────────────────────────────────────────
function buildGradient(gradientStr, darkMode = false) {
  if (!gradientStr) return null;

  // Format: gradient-blue-128-purple-200
  const diagMatch = gradientStr.match(/^gradient-([a-z]+)-(\d+)-([a-z]+)-(\d+)$/);
  if (diagMatch) {
    const [, c1, s1, c2, s2] = diagMatch;
    const from = getOKLCH(c1, parseInt(s1), darkMode);
    const to = getOKLCH(c2, parseInt(s2), darkMode);
    return `background: linear-gradient(135deg, ${from}, ${to});`;
  }

  // Format: gradient-45deg-blue-128-purple-200
  const angleMatch = gradientStr.match(/^gradient-(\d+)deg-([a-z]+)-(\d+)-([a-z]+)-(\d+)$/);
  if (angleMatch) {
    const [, angle, c1, s1, c2, s2] = angleMatch;
    const from = getOKLCH(c1, parseInt(s1), darkMode);
    const to = getOKLCH(c2, parseInt(s2), darkMode);
    return `background: linear-gradient(${angle}deg, ${from}, ${to});`;
  }

  // Format: gradient-vert-blue-128-purple-200
  const vertMatch = gradientStr.match(/^gradient-vert-([a-z]+)-(\d+)-([a-z]+)-(\d+)$/);
  if (vertMatch) {
    const [, c1, s1, c2, s2] = vertMatch;
    const from = getOKLCH(c1, parseInt(s1), darkMode);
    const to = getOKLCH(c2, parseInt(s2), darkMode);
    return `background: linear-gradient(to bottom, ${from}, ${to});`;
  }

  // Format: gradient-horiz-blue-128-purple-200
  const horizMatch = gradientStr.match(/^gradient-horiz-([a-z]+)-(\d+)-([a-z]+)-(\d+)$/);
  if (horizMatch) {
    const [, c1, s1, c2, s2] = horizMatch;
    const from = getOKLCH(c1, parseInt(s1), darkMode);
    const to = getOKLCH(c2, parseInt(s2), darkMode);
    return `background: linear-gradient(to right, ${from}, ${to});`;
  }

  // Format: gradient-radial-blue-128-purple-200
  const radialMatch = gradientStr.match(/^gradient-radial-([a-z]+)-(\d+)-([a-z]+)-(\d+)$/);
  if (radialMatch) {
    const [, c1, s1, c2, s2] = radialMatch;
    const from = getOKLCH(c1, parseInt(s1), darkMode);
    const to = getOKLCH(c2, parseInt(s2), darkMode);
    return `background: radial-gradient(circle, ${from}, ${to});`;
  }

  // Format: gradient-blue-128-purple-200-pink-100 (triple)
  const tripleMatch = gradientStr.match(/^gradient-([a-z]+)-(\d+)-([a-z]+)-(\d+)-([a-z]+)-(\d+)$/);
  if (tripleMatch) {
    const [, c1, s1, c2, s2, c3, s3] = tripleMatch;
    const col1 = getOKLCH(c1, parseInt(s1), darkMode);
    const col2 = getOKLCH(c2, parseInt(s2), darkMode);
    const col3 = getOKLCH(c3, parseInt(s3), darkMode);
    return `background: linear-gradient(135deg, ${col1}, ${col2}, ${col3});`;
  }

  // Legacy: gradient-indigo-128-purple-128-45 (old DemoApp format)
  const legacyMatch = gradientStr.match(/^gradient-([a-z]+)-(\d+)-([a-z]+)-(\d+)-(\d+)$/);
  if (legacyMatch) {
    const [, c1, s1, c2, s2, angle] = legacyMatch;
    const from = getOKLCH(c1, parseInt(s1), darkMode);
    const to = getOKLCH(c2, parseInt(s2), darkMode);
    return `background: linear-gradient(${angle}deg, ${from}, ${to});`;
  }

  return null;
}

// ─── HTML TAG TO CSS MAPPING ─────────────────────────────────────────────────
function getTagDefaults(tag) {
  const t = (tag || '').toLowerCase();
  const map = {
    'div':     { display: 'block' },
    'span':    { display: 'inline' },
    'p':       { display: 'block', marginTop: '0.5rem', marginBottom: '0.5rem' },
    'h1':      { display: 'block', fontSize: '2rem', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '0.5rem' },
    'h2':      { display: 'block', fontSize: '1.5rem', fontWeight: 'bold', lineHeight: '1.25', marginBottom: '0.5rem' },
    'h3':      { display: 'block', fontSize: '1.25rem', fontWeight: 'bold', lineHeight: '1.3', marginBottom: '0.5rem' },
    'h4':      { display: 'block', fontSize: '1.125rem', fontWeight: 'bold', lineHeight: '1.4', marginBottom: '0.25rem' },
    'h5':      { display: 'block', fontSize: '1rem', fontWeight: 'bold', lineHeight: '1.4', marginBottom: '0.25rem' },
    'h6':      { display: 'block', fontSize: '0.875rem', fontWeight: 'bold', lineHeight: '1.5', marginBottom: '0.25rem' },
    'button':  { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '500', transition: 'all 0.2s ease' },
    'input':   { display: 'block', width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', outline: 'none', fontSize: '14px', boxSizing: 'border-box' },
    'label':   { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' },
    'form':    { display: 'block' },
    'ul':      { display: 'block', listStyle: 'none', padding: '0', margin: '0' },
    'li':      { display: 'block' },
    'a':       { display: 'inline', cursor: 'pointer', textDecoration: 'none' },
    'img':     { display: 'block', maxWidth: '100%' },
    'select':  { display: 'block', width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', outline: 'none', cursor: 'pointer', fontSize: '14px' },
    'textarea':{ display: 'block', width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', outline: 'none', resize: 'vertical', fontSize: '14px' },
  };
  return map[t] || {};
}

// ─── CLASS → INLINE STYLE PARSER ────────────────────────────────────────────
function parseClass(cls, darkMode = false) {
  const styles = {};

  // Flex map
  if (FLEX_MAP[cls]) {
    FLEX_MAP[cls].forEach(rule => {
      const [k, v] = rule.replace(';', '').split(':').map(s => s.trim());
      const key = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      styles[key] = v;
    });
    return styles;
  }

  // Button/Input/Card/Checkbox/Select/MaxWidth component styles
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

  // bg-glass-color-shade (colored tinted glassmorphism e.g. bg-glass-blue-100)
  const bgGlassColorMatch = cls.match(/^bg-glass-([a-z]+)-(\d+)$/);
  if (bgGlassColorMatch) {
    const [, color, shadeStr] = bgGlassColorMatch;
    const shade = parseInt(shadeStr);
    const base = getOKLCH(color, shade, darkMode);
    const glassAlpha = shade <= 200 ? 0.22 : shade <= 500 ? 0.32 : 0.42;
    styles.backgroundColor = base.replace(')', ` / ${glassAlpha})`);
    styles.backdropFilter = 'blur(20px) saturate(200%) brightness(1.1)';
    styles.WebkitBackdropFilter = 'blur(20px) saturate(200%) brightness(1.1)';
    // Professional glass edge: subtle outer border + bright top inner highlight (light refraction)
    styles.border = '1px solid rgba(255, 255, 255, 0.40)';
    styles.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.75)';
    styles.borderRadius = '20px';
    styles.overflow = 'hidden';
    styles.position = 'relative';
    return styles;
  }

  // bg-glass-alpha (plain white glassmorphism e.g. bg-glass-40)
  const bgGlassMatch = cls.match(/^bg-glass-(\d+)$/);
  if (bgGlassMatch) {
    const [, alphaStr] = bgGlassMatch;
    const alpha = Math.min(1, Math.max(0, parseInt(alphaStr) / 255));
    styles.backgroundColor = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
    styles.backdropFilter = 'blur(24px) saturate(160%) brightness(1.05)';
    styles.WebkitBackdropFilter = 'blur(24px) saturate(160%) brightness(1.05)';
    // Professional glass edge: subtle outer border + bright top inner highlight (light refraction)
    styles.border = '1px solid rgba(255, 255, 255, 0.45)';
    styles.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.80)';
    styles.borderRadius = '20px';
    styles.overflow = 'hidden';
    styles.position = 'relative';
    return styles;
  }

  // bg-color-shade
  const bgMatch = cls.match(/^bg-([a-z]+)-(\d+)(?:\/(\d+))?$/);
  if (bgMatch) {
    const [, color, shade, opacity] = bgMatch;
    const oklchColor = getOKLCH(color, parseInt(shade), darkMode);
    styles.backgroundColor = opacity ? oklchColor.replace(')', ` / ${parseInt(opacity) / 100})`) : oklchColor;
    return styles;
  }

  // text-color-shade
  const textColorMatch = cls.match(/^text-([a-z]+)-(\d+)(?:\/(\d+))?$/);
  if (textColorMatch) {
    const [, color, shade, opacity] = textColorMatch;
    styles.color = getOKLCH(color, parseInt(shade), darkMode);
    return styles;
  }

  // border-color-shade
  const borderColorMatch = cls.match(/^border-([a-z]+)-(\d+)$/);
  if (borderColorMatch) {
    const [, color, shade] = borderColorMatch;
    styles.borderColor = getOKLCH(color, parseInt(shade), darkMode);
    styles.borderStyle = 'solid';
    return styles;
  }

  // Text utilities
  if (cls === 'text-sm')  { styles.fontSize = '0.875rem'; return styles; }
  if (cls === 'text-base'){ styles.fontSize = '1rem'; return styles; }
  if (cls === 'text-lg')  { styles.fontSize = '1.125rem'; return styles; }
  if (cls === 'text-xl')  { styles.fontSize = '1.25rem'; return styles; }
  if (cls === 'text-2xl') { styles.fontSize = '1.5rem'; return styles; }
  if (cls === 'text-3xl') { styles.fontSize = '1.875rem'; return styles; }
  if (cls === 'text-4xl') { styles.fontSize = '2.25rem'; return styles; }
  if (cls === 'font-bold')    { styles.fontWeight = 'bold'; return styles; }
  if (cls === 'font-semibold'){ styles.fontWeight = '600'; return styles; }
  if (cls === 'font-medium')  { styles.fontWeight = '500'; return styles; }
  if (cls === 'font-normal')  { styles.fontWeight = '400'; return styles; }
  if (cls === 'text-center')  { styles.textAlign = 'center'; return styles; }
  if (cls === 'text-left')    { styles.textAlign = 'left'; return styles; }
  if (cls === 'text-right')   { styles.textAlign = 'right'; return styles; }
  if (cls === 'italic')       { styles.fontStyle = 'italic'; return styles; }
  if (cls === 'underline')    { styles.textDecoration = 'underline'; return styles; }
  if (cls === 'uppercase')    { styles.textTransform = 'uppercase'; return styles; }
  if (cls === 'lowercase')    { styles.textTransform = 'lowercase'; return styles; }
  if (cls === 'capitalize')   { styles.textTransform = 'capitalize'; return styles; }

  // Colour keywords
  if (cls === 'text-white') { styles.color = 'white'; return styles; }
  if (cls === 'text-black') { styles.color = 'black'; return styles; }
  if (cls === 'bg-white')   { styles.backgroundColor = 'white'; return styles; }
  if (cls === 'bg-black')   { styles.backgroundColor = 'black'; return styles; }
  if (cls === 'bg-transparent') { styles.backgroundColor = 'transparent'; return styles; }

  // Spacing: p-, m-, px-, py-, pl-, pr-, pt-, pb-, mx-, my-, ml-, mr-, mt-, mb-
  const spacingMatch = cls.match(/^(p|m|pl|pr|ml|mr|pt|pb|mt|mb|px|py|mx|my)-(\d+(?:\.\d+)?)$/);
  if (spacingMatch) {
    const [, type, val] = spacingMatch;
    const v = `${parseFloat(val) * PX_MULTIPLIER}px`;
    switch (type) {
      case 'p':  styles.padding = v; break;
      case 'm':  styles.margin = v; break;
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

  // Width/Height: w-full, h-screen, w-16, h-24...
  if (cls === 'w-full' || cls === 'w-100') { styles.width = '100%'; return styles; }
  if (cls === 'h-full' || cls === 'h-100') { styles.height = '100%'; return styles; }
  if (cls === 'h-screen') { styles.height = '100vh'; return styles; }
  if (cls === 'w-screen') { styles.width = '100vw'; return styles; }
  if (cls === 'min-h-screen') { styles.height = '100vh'; return styles; } // Native: treat min-h-screen as h-screen

  const wMatch = cls.match(/^w-(\d+(?:\.\d+)?)$/);
  if (wMatch) { styles.width = `${parseFloat(wMatch[1]) * SIZE_MULTIPLIER}px`; return styles; }
  const hMatch = cls.match(/^h-(\d+(?:\.\d+)?)$/);
  if (hMatch) { styles.height = `${parseFloat(hMatch[1]) * SIZE_MULTIPLIER}px`; return styles; }

  // Gap
  const gapMatch = cls.match(/^gap-(\d+(?:\.\d+)?)$/);
  if (gapMatch) { styles.gap = `${parseFloat(gapMatch[1]) * GAP_MULTIPLIER}px`; return styles; }
  const gapXMatch = cls.match(/^gap-x-(\d+(?:\.\d+)?)$/);
  if (gapXMatch) { styles.columnGap = `${parseFloat(gapXMatch[1]) * GAP_MULTIPLIER}px`; return styles; }
  const gapYMatch = cls.match(/^gap-y-(\d+(?:\.\d+)?)$/);
  if (gapYMatch) { styles.rowGap = `${parseFloat(gapYMatch[1]) * GAP_MULTIPLIER}px`; return styles; }

  // Border radius
  if (cls === 'rounded')      { styles.borderRadius = '4px'; return styles; }
  if (cls === 'rounded-sm')   { styles.borderRadius = '2px'; return styles; }
  if (cls === 'rounded-md')   { styles.borderRadius = '6px'; return styles; }
  if (cls === 'rounded-lg')   { styles.borderRadius = '8px'; return styles; }
  if (cls === 'rounded-xl')   { styles.borderRadius = '12px'; return styles; }
  if (cls === 'rounded-2xl')  { styles.borderRadius = '16px'; return styles; }
  if (cls === 'rounded-3xl')  { styles.borderRadius = '24px'; return styles; }
  if (cls === 'rounded-full') { styles.borderRadius = '9999px'; return styles; }

  // 📐 Geometrical and Mathematical curves (Professional Chat Bubbles & Card layouts)
  if (cls === 'rounded-sent') {
    styles.borderRadius = '250'; // Custom byte marker for sent bubble
    return styles;
  }
  if (cls === 'rounded-recv') {
    styles.borderRadius = '251'; // Custom byte marker for recv bubble
    return styles;
  }
  if (cls === 'rounded-leaf') {
    styles.borderRadius = '252'; // Custom byte marker for leaf shape
    return styles;
  }
  if (cls === 'rounded-organic') {
    styles.borderRadius = '253';
    return styles;
  }
  if (cls === 'rounded-capsule') {
    styles.borderRadius = '254'; // Custom byte marker for capsule shape
    return styles;
  }

  // Individual Corner Mathematical curves: rounded-tl-10, rounded-tr-24...
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

  const roundedNumMatch = cls.match(/^rounded-(\d+)$/);
  if (roundedNumMatch) { styles.borderRadius = `${parseInt(roundedNumMatch[1])}px`; return styles; }

  // Shadow
  if (cls === 'shadow' || cls === 'shadow-md') { styles.boxShadow = SHADOW_SCALES['3']; return styles; }
  if (cls === 'shadow-sm')  { styles.boxShadow = SHADOW_SCALES['2']; return styles; }
  if (cls === 'shadow-lg')  { styles.boxShadow = SHADOW_SCALES['4']; return styles; }
  if (cls === 'shadow-xl')  { styles.boxShadow = SHADOW_SCALES['5']; return styles; }
  if (cls === 'shadow-2xl') { styles.boxShadow = SHADOW_SCALES['6']; return styles; }
  if (cls === 'shadow-none'){ styles.boxShadow = 'none'; return styles; }
  const shadowNumMatch = cls.match(/^shadow-(\d+)$/);
  if (shadowNumMatch) { styles.boxShadow = SHADOW_SCALES[shadowNumMatch[1]] || SHADOW_SCALES['3']; return styles; }

  // Opacity
  const opacityMatch = cls.match(/^opacity-(\d+)$/);
  if (opacityMatch) { styles.opacity = parseInt(opacityMatch[1]) / 100; return styles; }

  // Scale / transform
  const scaleMatch = cls.match(/^scale-(\d+)$/);
  if (scaleMatch) { styles.transform = `scale(${parseInt(scaleMatch[1]) / 100})`; return styles; }

  // Display utils
  if (cls === 'block')         { styles.display = 'block'; return styles; }
  if (cls === 'inline-block')  { styles.display = 'inline-block'; return styles; }
  if (cls === 'inline')        { styles.display = 'inline'; return styles; }
  if (cls === 'hidden')        { styles.display = 'none'; return styles; }
  if (cls === 'grid')          { styles.display = 'grid'; return styles; }

  // Grid columns
  const gridColsMatch = cls.match(/^grid-cols-(\d+)$/);
  if (gridColsMatch) { styles.gridTemplateColumns = `repeat(${gridColsMatch[1]}, minmax(0, 1fr))`; return styles; }
  const colSpanMatch = cls.match(/^col-span-(\d+)$/);
  if (colSpanMatch) { styles.gridColumn = `span ${colSpanMatch[1]}`; return styles; }

  // Position
  if (cls === 'relative')  { styles.position = 'relative'; return styles; }
  if (cls === 'absolute')  { styles.position = 'absolute'; return styles; }
  if (cls === 'fixed')     { styles.position = 'fixed'; return styles; }
  if (cls === 'sticky')    { styles.position = 'sticky'; return styles; }

  // Border
  if (cls === 'border')       { styles.border = '1px solid #e2e8f0'; return styles; }
  if (cls === 'border-2')     { styles.border = '2px solid #e2e8f0'; return styles; }
  if (cls === 'border-none')  { styles.border = 'none'; return styles; }
  if (cls === 'border-white') { styles.borderColor = 'white'; styles.borderStyle = 'solid'; return styles; }
  if (cls === 'border-black') { styles.borderColor = 'black'; styles.borderStyle = 'solid'; return styles; }

  // Cursor
  if (cls === 'cursor-pointer') { styles.cursor = 'pointer'; return styles; }
  if (cls === 'cursor-default') { styles.cursor = 'default'; return styles; }
  if (cls === 'cursor-not-allowed') { styles.cursor = 'not-allowed'; return styles; }

  // Overflow
  if (cls === 'overflow-hidden')  { styles.overflow = 'hidden'; return styles; }
  if (cls === 'overflow-scroll')  { styles.overflow = 'scroll'; return styles; }
  if (cls === 'overflow-auto')    { styles.overflow = 'auto'; return styles; }
  if (cls === 'overflow-visible') { styles.overflow = 'visible'; return styles; }
  if (cls === 'overflow-x-auto')  { styles.overflowX = 'auto'; return styles; }
  if (cls === 'overflow-y-auto')  { styles.overflowY = 'auto'; return styles; }

  // Z-index
  const zMatch = cls.match(/^z-(\d+)$/);
  if (zMatch) { styles.zIndex = parseInt(zMatch[1]); return styles; }

  // Object fit
  if (cls === 'object-cover')   { styles.objectFit = 'cover'; return styles; }
  if (cls === 'object-contain') { styles.objectFit = 'contain'; return styles; }

  // Misc
  if (cls === 'self-center')  { styles.alignSelf = 'center'; return styles; }
  if (cls === 'self-start')   { styles.alignSelf = 'flex-start'; return styles; }
  if (cls === 'self-end')     { styles.alignSelf = 'flex-end'; return styles; }
  if (cls === 'select-none')  { styles.userSelect = 'none'; return styles; }
  if (cls === 'pointer-events-none') { styles.pointerEvents = 'none'; return styles; }
  if (cls === 'truncate')     { styles.overflow = 'hidden'; styles.textOverflow = 'ellipsis'; styles.whiteSpace = 'nowrap'; return styles; }
  if (cls === 'break-words')  { styles.wordBreak = 'break-word'; return styles; }
  if (cls === 'whitespace-nowrap') { styles.whiteSpace = 'nowrap'; return styles; }

  // bg-light, bg-dark shortcuts
  if (cls === 'bg-light')   { styles.backgroundColor = '#f8fafc'; return styles; }
  if (cls === 'bg-dark')    { styles.backgroundColor = '#1e293b'; return styles; }
  if (cls === 'bg-blue')    { styles.backgroundColor = '#3b82f6'; return styles; }
  if (cls === 'bg-danger')  { styles.backgroundColor = '#ef4444'; return styles; }
  if (cls === 'bg-success') { styles.backgroundColor = '#10b981'; return styles; }
  if (cls === 'bg-warning') { styles.backgroundColor = '#f59e0b'; return styles; }
  if (cls === 'bg-indigo')  { styles.backgroundColor = '#6366f1'; return styles; }

  // Gradient classes (applied via style object)
  const gradientResult = buildGradient(cls, darkMode);
  if (gradientResult) {
    const [k, v] = gradientResult.replace(';', '').split(':').map(s => s.trim());
    styles.background = v;
    return styles;
  }

  // Animation classes
  if (ANIMATION_STYLE_MAP[cls]) {
    styles.animation = ANIMATION_STYLE_MAP[cls].replace('animation:', '').replace(';', '').trim();
    return styles;
  }

  return styles;
}

// ── AUTOMATIC CDN CSS TO TITAN BINARY CONVERTER ──
const GLOBAL_CSS_RULES = {};

function registerCSSRules(cssText) {
    if (!cssText || typeof cssText !== 'string') return;
    const cleanCss = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    const ruleRegex = /\.([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g;
    let match;
    while ((match = ruleRegex.exec(cleanCss)) !== null) {
        const className = match[1];
        const declarations = match[2];
        const props = {};

        declarations.split(';').forEach(decl => {
            const parts = decl.split(':');
            if (parts.length < 2) return;
            const key = parts[0].trim().toLowerCase();
            const val = parts[1].trim().toLowerCase();

            if (key === 'background-color' || key === 'background') {
                if (val.includes('blue')) props.bg = 'blue-140';
                else if (val.includes('green') || val.includes('emerald') || val.includes('teal')) props.bg = 'green-140';
                else if (val.includes('red')) props.bg = 'red-140';
                else if (val.includes('amber') || val.includes('yellow') || val.includes('orange')) props.bg = 'amber-140';
                else if (val.includes('purple') || val.includes('indigo')) props.bg = 'indigo-140';
                else if (val.includes('slate') || val.includes('gray')) props.bg = 'slate-140';
                else if (val.includes('white') || val.includes('#fff') || val.includes('rgba(255')) props.bg = 'white-254';
                else if (val.includes('transparent')) props.bg = 'transparent';
                else props.bg = 'blue-140';
            }
            if (key === 'color') {
                if (val.includes('white') || val.includes('#fff') || val.includes('rgba(255')) props.color = 'white-254';
                else if (val.includes('black') || val.includes('#000')) props.color = 'black-254';
                else props.color = 'white-254';
            }
            if (key === 'padding') {
                const pxVal = parseInt(val);
                if (!isNaN(pxVal)) props.p = pxVal;
            }
            if (key === 'border-radius') {
                const rVal = parseInt(val);
                if (!isNaN(rVal)) props.radius = rVal;
            }
            if (key === 'box-shadow') {
                props.elevation = 8;
            }
        });

        if (Object.keys(props).length > 0) {
            GLOBAL_CSS_RULES[className] = props;
        }
    }
}

// ─── MAIN parseTW FUNCTION (for UniversalUIImporter compatibility) ────────────
function parseTW(tw) {
  if (!tw || typeof tw !== 'string') return {};
  // Strip out Web-only CSS blocks in brackets [...] for Native Mobile UI compilation
  const mobileTw = tw.replace(/(?:^|\s)\[[^\]]*\]/g, '').trim();
  const props = {};
  // Lightweight transition metadata for runtime bindings (Android fast-path only)
  // Tailwind-like: transition-* sets "what", duration-* sets "how long", ease-* sets "curve".
  // No duration or no transition => no animation (safe default).
  let animTransition = null; // 'none' | 'all' | 'transform' | 'opacity'
  let animDurationMs = null; // number
  let animEase = null; // 'linear' | 'in' | 'out' | 'in-out'

  const parseSpVal = (str) => {
    if (!str) return 0;
    let clean = str;
    if (clean.startsWith('[') && clean.endsWith(']')) {
      clean = clean.slice(1, -1);
    }
    const val = parseInt(clean);
    if (isNaN(val)) return 0;
    if (clean.endsWith('px') || str.includes('[')) {
      return val;
    }
    return val * 4;
  };

  mobileTw.split(/\s+/).forEach(p => {
    if (!p) return;

    // ── Pseudo-class Modifiers (focus:, hover:, active:, disabled:, dark:, group-hover:, peer-focus:) ──
    const pseudoMatch = p.match(/^(focus|hover|active|disabled|dark|group-hover|peer-focus):(.+)$/);
    if (pseudoMatch) {
      const [, modifier, baseClass] = pseudoMatch;
      props.modifiers = props.modifiers || {};
      props.modifiers[modifier] = props.modifiers[modifier] || {};
      const modProps = parseTW(baseClass);
      Object.assign(props.modifiers[modifier], modProps);
      return;
    }

    // ── Positioning & Offsets (relative, absolute, fixed, sticky, top-*, bottom-*, left-*, right-*, inset-*) ──
    if (p === 'relative')  { props.position = 'relative'; return; }
    if (p === 'absolute')  { props.position = 'absolute'; return; }
    if (p === 'fixed')     { props.position = 'fixed'; return; }
    if (p === 'sticky')    { props.position = 'sticky'; return; }
    if (p === 'inset-0')   { props.top = 0; props.bottom = 0; props.left = 0; props.right = 0; return; }
    if (p === 'inset-x-0') { props.left = 0; props.right = 0; return; }
    if (p === 'inset-y-0') { props.top = 0; props.bottom = 0; return; }

    const posOffMatch = p.match(/^(top|bottom|left|right)-(\d+(?:\.\d+)?)$/);
    if (posOffMatch) {
      const [, side, val] = posOffMatch;
      props[side] = parseFloat(val) * 4;
      return;
    }

    // 🔗 Dividers & Rings (divide-y, divide-x, ring, ring-*) 🔗
    if (p === 'divide-y') { props.divide = 'y'; return; }
    if (p === 'divide-x') { props.divide = 'x'; return; }
    if (p.startsWith('divide-') && p !== 'divide-y' && p !== 'divide-x') { props.divideColor = p.substring(7); return; }
    if (p === 'ring' || p === 'ring-1') { props.ringWidth = 1; return; }
    if (p === 'ring-2')                 { props.ringWidth = 2; return; }
    if (p === 'ring-4')                 { props.ringWidth = 4; return; }
    if (p.startsWith('ring-') && !p.match(/^ring-\d$/)) { props.ringColor = p.substring(5); return; }

    // ── Z-Index (z-0, z-10, z-20, z-30, z-40, z-50) ──
    if (p.startsWith('z-')) {
      const zVal = parseInt(p.slice(2));
      if (!isNaN(zVal)) { props.zIndex = zVal; return; }
    }

    // ── Overflow System (overflow-hidden, overflow-scroll, overflow-auto, overflow-x-auto, overflow-y-auto) ──
    if (p === 'overflow-hidden')  { props.overflow = 'hidden'; return; }
    if (p === 'overflow-scroll')  { props.overflow = 'scroll'; return; }
    if (p === 'overflow-auto')    { props.overflow = 'auto'; return; }
    if (p === 'overflow-x-auto')  { props.overflowX = 'auto'; return; }
    if (p === 'overflow-y-auto')  { props.overflowY = 'auto'; return; }

    // ── Text Extras (truncate, line-clamp-*, uppercase, lowercase, capitalize) ──
    if (p === 'truncate')         { props.truncate = true; return; }
    if (p.startsWith('line-clamp-')) { props.lineClamp = parseInt(p.slice(11)) || 1; return; }
    if (p === 'uppercase')        { props.textTransform = 'uppercase'; return; }
    if (p === 'lowercase')        { props.textTransform = 'lowercase'; return; }
    if (p === 'capitalize')       { props.textTransform = 'capitalize'; return; }

    // ── Dividers & Rings (divide-y, divide-x, ring, ring-*) ──
    if (p === 'divide-y') { props.divide = 'y'; return; }
    if (p === 'divide-x') { props.divide = 'x'; return; }
    if (p === 'ring' || p === 'ring-1') { props.ringWidth = 1; return; }
    if (p === 'ring-2')                 { props.ringWidth = 2; return; }
    if (p === 'ring-4')                 { props.ringWidth = 4; return; }

    // ── Flex Shrink & Grow (shrink-0, shrink, grow-0, grow) ──
    if (p === 'shrink-0') { props.flexShrink = 0; return; }
    if (p === 'shrink')   { props.flexShrink = 1; return; }
    if (p === 'grow-0')   { props.flexGrow = 0; return; }
    if (p === 'grow')     { props.flexGrow = 1; return; }

    // ── Cursor & Selection ──
    if (p === 'cursor-pointer')     { props.cursor = 'pointer'; return; }
    if (p === 'cursor-not-allowed') { props.cursor = 'not-allowed'; return; }
    if (p === 'select-none')          { props.userSelect = 'none'; return; }

    // Check registered CDN CSS rules
    if (GLOBAL_CSS_RULES[p]) {
      Object.assign(props, GLOBAL_CSS_RULES[p]);
    }

    // ── Transition tokens (industry-standard-ish Tailwind set) ──
    if (p === 'transition' || p === 'transition-all') { animTransition = 'all'; return; }
    if (p === 'transition-none') { animTransition = 'none'; return; }
    if (p === 'transition-transform') { animTransition = 'transform'; return; }
    if (p === 'transition-opacity') { animTransition = 'opacity'; return; }
    if (p.startsWith('duration-')) {
      const ms = parseInt(p.slice('duration-'.length));
      if (!isNaN(ms)) animDurationMs = ms;
      return;
    }
    if (p === 'ease-linear') { animEase = 'linear'; return; }
    if (p === 'ease-in') { animEase = 'in'; return; }
    if (p === 'ease-out') { animEase = 'out'; return; }
    if (p === 'ease-in-out') { animEase = 'in-out'; return; }

    // ── Dynamic property binding via stateKey (e.g. w-stateKey:cardW) ──
    // NOTE: must run BEFORE normal `w-*`/`h-*` parsing, otherwise it will get treated as numeric.
    const bindMatch = p.match(/^(w|h|p|rounded|x|y|scaleX|scaleY|scale|rotate|rotation|opacity|alpha)-stateKey:(.+)$/);
    if (bindMatch) {
      const token = bindMatch[1];
      const key = (bindMatch[2] || '').trim();
      if (key) {
        props.bindings = props.bindings || {};
        const propName =
          token === 'w' ? 'width' :
          token === 'h' ? 'height' :
          token === 'p' ? 'padding' :
          token === 'rounded' ? 'radius' :
          token === 'x' ? 'translateX' :
          token === 'y' ? 'translateY' :
          token === 'scale' ? 'scale' :
          token === 'scaleX' ? 'scaleX' :
          token === 'scaleY' ? 'scaleY' :
          (token === 'rotate' || token === 'rotation') ? 'rotation' :
          (token === 'opacity' || token === 'alpha') ? 'alpha' :
          null;
        if (propName) props.bindings[propName] = key;
      }
      return;
    }

    // ── Native / Flutter orientation shortcuts ──
    if (p === 'd-flex' || p === 'Row' || p === 'flex-row' || p === 'row' || p === 'flex') {
      props.type = 'Row'; props.orientation = 'horizontal';
    }
    if (p === 'd-column' || p === 'flex-column' || p === 'flex-col' || p === 'Column' || p === 'column') {
      props.type = 'Column'; props.orientation = 'vertical';
    }
    if (p === 'Stack')     { props.type = 'Stack'; }
    if (p === 'Box' || p === 'Container') { props.type = 'Container'; }
    if (p === 'Grid' || p === 'GridView') { props.type = 'GridView'; }
    
    // ── Grid Column Classes ──
    if (p.startsWith('grid-cols-')) {
      props.type = 'GridView';
      props.columns = parseInt(p.slice(11)) || 2;
    }
    if (p === 'grid-cols-1') { props.type = 'GridView'; props.columns = 1; }
    if (p === 'grid-cols-2') { props.type = 'GridView'; props.columns = 2; }
    if (p === 'grid-cols-3') { props.type = 'GridView'; props.columns = 3; }
    if (p === 'grid-cols-4') { props.type = 'GridView'; props.columns = 4; }
    if (p === 'grid-cols-5') { props.type = 'GridView'; props.columns = 5; }
    if (p === 'grid-cols-6') { props.type = 'GridView'; props.columns = 6; }
    
    if (p === 'flex-1')  props.flex = 1;
    if (p === 'flex-2')  props.flex = 2;
    if (p === 'flex-3')  props.flex = 3;

    // ── Icon Classes (icon-[name]-[position]) ──
    if (p.startsWith('icon-')) {
      const parts = p.split('-');
      if (parts.length >= 2) {
        props.icon = parts[1]; // Always set props.icon because Button requires it
        if (parts.length >= 3) {
          if (parts[2] === 'right') props.iconRight = parts[1];
          if (parts[2] === 'left') props.iconLeft = parts[1];
        }
      }
    }

    // ── DolphinCSS & Bootstrap Semantic Variants ──
    if (p === 'filled')       { props.type = 'Button'; if (!props.bg) { props.bg = 'indigo-140'; props.color = 'white-254'; } props.p = 10; props.radius = 8; }
    if (p === 'primary' || p === 'primary-500') { props.bg = 'indigo-140'; props.color = 'white-254'; }
    if (p === 'secondary')    { props.bg = 'slate-140'; props.color = 'white-254'; }
    if (p === 'success')      { props.bg = 'emerald-140'; props.color = 'white-254'; }
    if (p === 'danger')       { props.bg = 'rose-140'; props.color = 'white-254'; }
    if (p === 'warning')      { props.bg = 'amber-140'; props.color = 'black-254'; }
    if (p === 'outlined')     { props.bg = 'transparent'; props.border = 1; }
    if (p === 'plain' || p === 'ghost') { props.bg = 'transparent'; }

    if (p === 'btn-lg' || p === 'lg') { props.p = 16; props.radius = 12; }
    if (p === 'btn-md' || p === 'md') { props.p = 10; props.radius = 8; }
    if (p === 'btn-sm' || p === 'sm') { props.p = 6; props.radius = 6; }
    if (p === 'circle')       { props.radius = 254; }

    if (p === 'glow') {
      props.elevation = 8;
    }

    if (p === 'flex-col-left') { props.type = 'Column'; props.orientation = 'vertical'; props.align = 'start'; }
    if (p === 'flex-between')  { props.type = 'Row'; props.orientation = 'horizontal'; props.justify = 'between'; }
    if (p === 'flex-left')     { props.type = 'Row'; props.orientation = 'horizontal'; props.align = 'center'; }
    if (p === 'flex-center')   { props.type = 'Row'; props.orientation = 'horizontal'; props.align = 'center'; props.justify = 'center'; }
    if (p === 'floatinglabel') { props.type = 'Column'; props.orientation = 'vertical'; }

    if (p === 'container' || p === 'container-fluid') { props.type = 'Container'; props.p = 16; props.width = -1; }
    if (p === 'btn')          { props.type = 'Button'; props.p = 12; props.radius = 8; if (!props.bg) { props.bg = 'blue-140'; props.color = 'white-253'; } }
    if (p.startsWith('btn-')) {
      props.type = 'Button';
      const color = p.substring(4);
      if (color === 'primary')   { props.bg = 'blue-140'; props.color = 'white-253'; }
      else if (color === 'secondary') { props.bg = 'gray-140'; props.color = 'white-253'; }
      else if (color === 'success')   { props.bg = 'green-140'; props.color = 'white-253'; }
      else if (color === 'danger')    { props.bg = 'red-140'; props.color = 'white-253'; }
      else if (color === 'warning')   { props.bg = 'amber-140'; props.color = 'black-253'; }
      else if (color === 'info')      { props.bg = 'cyan-140'; props.color = 'white-253'; }
      else if (color === 'lg')        { props.p = 16; props.radius = 10; }
      else if (color === 'sm')        { props.p = 6; props.radius = 6; }
      else { props.bg = `${color}-140`; props.color = 'white-253'; }
    }
    if (p === 'divider' || p === 'hr') {
      props.minHeight = 2;
      props.bg = 'slate-300';
      props.width = -1;
    }
    if (p === 'card' || p === 'dolphin-card') {
      props.type = 'Card';
      props.bg = 'white-254';
      props.color = 'black-254';
      props.p = 16;
      props.radius = 16;
      props.elevation = 6;
    }
    if (p.startsWith('alert-')) {
      props.type = 'Container'; props.radius = 8; props.p = 12;
      const color = p.substring(6);
      props.bg = `${color}-220`;
      props.color = `${color}-10`;
    }
    if (p === 'form-control') { props.type = 'TextField'; props.p = 10; props.radius = 6; }

    // ── Tailwind spacing ──
    if (p === 'w-full' || p === 'w-100' || p === 'w-screen') props.width = -1;
    else if (p.startsWith('w-')) {
      let valStr = p.slice(2);
      if (valStr.startsWith('[') && valStr.endsWith(']')) {
        valStr = valStr.slice(1, -1);
      }
      const val = parseInt(valStr);
      if (!isNaN(val)) {
        if (valStr.endsWith('px') || p.includes('[')) {
          props.width = val;
        } else {
          props.width = val * 4;
        }
      }
    }
    if (p === 'h-full' || p === 'h-100' || p === 'h-screen') props.height = -1;
    else if (p.startsWith('h-')) {
      let valStr = p.slice(2);
      if (valStr.startsWith('[') && valStr.endsWith(']')) {
        valStr = valStr.slice(1, -1);
      }
      const val = parseInt(valStr);
      if (!isNaN(val)) {
        if (valStr.endsWith('px') || p.includes('[')) {
          props.height = val;
        } else {
          props.height = val * 4;
        }
      }
    }
    if (p === 'items-center')   props.items = 'center';
    if (p === 'items-start')    props.items = 'start';
    if (p === 'items-end')      props.items = 'end';
    if (p === 'justify-center')  props.justify = 'center';
    if (p === 'justify-between') props.justify = 'between';
    if (p === 'justify-around')  props.justify = 'around';
    if (p === 'justify-end')     props.justify = 'end';
    
    // ── Short Flex Alignment Classes ──
    if (p === 'flex-center')     { props.items = 'center'; props.justify = 'center'; }
    if (p === 'flex-start')      { props.items = 'start'; props.justify = 'start'; }
    if (p === 'flex-end')        { props.items = 'end'; props.justify = 'end'; }
    if (p === 'flex-left')       { props.items = 'center'; props.justify = 'start'; }
    if (p === 'flex-right')      { props.items = 'center'; props.justify = 'end'; }
    if (p === 'flex-between')    { props.items = 'center'; props.justify = 'between'; }
    if (p === 'flex-around')     { props.items = 'center'; props.justify = 'around'; }
    if (p === 'flex-evenly')     { props.items = 'center'; props.justify = 'evenly'; }

    // Row Shorthands
    if (p === 'flex-row-center') { props.type = 'Row'; props.orientation = 'horizontal'; props.items = 'center'; props.justify = 'center'; }
    if (p === 'flex-row-between') { props.type = 'Row'; props.orientation = 'horizontal'; props.items = 'center'; props.justify = 'between'; }
    if (p === 'flex-row-around') { props.type = 'Row'; props.orientation = 'horizontal'; props.items = 'center'; props.justify = 'around'; }
    if (p === 'flex-row-evenly') { props.type = 'Row'; props.orientation = 'horizontal'; props.items = 'center'; props.justify = 'evenly'; }
    if (p === 'flex-row-start' || p === 'flex-row-left') { props.type = 'Row'; props.orientation = 'horizontal'; props.items = 'center'; props.justify = 'start'; }
    if (p === 'flex-row-end' || p === 'flex-row-right') { props.type = 'Row'; props.orientation = 'horizontal'; props.items = 'center'; props.justify = 'end'; }

    // Column Shorthands
    if (p === 'flex-col-center') { props.type = 'Column'; props.orientation = 'vertical'; props.items = 'center'; props.justify = 'center'; }
    if (p === 'flex-col-between') { props.type = 'Column'; props.orientation = 'vertical'; props.items = 'center'; props.justify = 'between'; }
    if (p === 'flex-col-around') { props.type = 'Column'; props.orientation = 'vertical'; props.items = 'center'; props.justify = 'around'; }
    if (p === 'flex-col-evenly') { props.type = 'Column'; props.orientation = 'vertical'; props.items = 'center'; props.justify = 'evenly'; }
    if (p === 'flex-col-start' || p === 'flex-col-top') { props.type = 'Column'; props.orientation = 'vertical'; props.items = 'center'; props.justify = 'start'; }
    if (p === 'flex-col-end' || p === 'flex-col-bottom') { props.type = 'Column'; props.orientation = 'vertical'; props.items = 'center'; props.justify = 'end'; }
    if (p === 'center')          props.items = 'center';
    if (p === 'left')            props.items = 'start';
    if (p === 'right')           props.items = 'end';

    // ── Dynamic shade binding via stateKey (e.g. bg-blue-stateKey:theme) ──
    // This keeps the base color (blue) fixed, but lets Android runtime drive the shade (0-255)
    // from a state key (like "theme").
    if (p.startsWith('bg-')) {
      if (p === 'bg-danphe') {
        props.gradient = 'gradient-danphe';
        props.bg = 'transparent';
      } else if (p === 'bg-aurora') {
        props.gradient = 'gradient-aurora';
        props.bg = 'transparent';
      } else {
        // bg-glass-color-shade → colored glass via gradient string (native)
      const gcMatch = p.match(/^bg-glass-([a-z]+)-(\d+)$/);
      if (gcMatch) {
        const [, gc, gs] = gcMatch;
        // Normalize Tailwind shade (50-950) → Android 0-255 scale so colors render correctly
        const normShade = normalizeShade(parseInt(gs));
        props.gradient = `glass-${gc}-${normShade}-120`;
        props.bg = 'transparent';
      } else {
        const suffix = p.substring(3);
        const idx = suffix.indexOf('stateKey:');
        if (idx !== -1) {
          const basePart = suffix.split('-stateKey:')[0];
          const key = suffix.split('stateKey:')[1] || '';
          props.bg = basePart || 'slate';
          props.bindings = props.bindings || {};
          if (key) props.bindings.bgShade = key;
        } else {
          props.bg = suffix;
        }
      }
    }
    }
    if (p.startsWith('text-')) {
      const suffix = p.substring(5);
      if (suffix === 'sm') props.size = 14;
      else if (suffix === 'base') props.size = 16;
      else if (suffix === 'lg') props.size = 20;
      else if (suffix === 'xl') props.size = 24;
      else if (suffix === '2xl') props.size = 32;
      else if (suffix === '3xl') props.size = 40;
      else if (suffix === 'center') props.align = 'center';
      else if (suffix === 'left') props.align = 'left';
      else if (suffix === 'right') props.align = 'right';
      else props.color = suffix;
    }

    if (p === 'border') {
      props.border = '1px solid #cccccc';
    } else if (p.startsWith('border-')) {
      const bStr = p.slice(7);
      if (bStr === 'none') {
        props.border = 'none';
      } else if (bStr === 'solid' || bStr === 'dashed' || bStr === 'dotted' || bStr === 'inset') {
        props.borderStyle = bStr;
      } else if (!isNaN(parseInt(bStr)) && !bStr.includes('-')) {
        props.borderWidth = `${bStr}px`;
      } else {
        props.borderColor = bStr;
      }
    }

    if (p === 'rounded' || p === 'radius') {
      props.radius = 4;
    } else if (p === 'circle') {
      props.radius = 99;
    } else if (p.startsWith('rounded-') || p.startsWith('radius-')) {
      let r = p.startsWith('rounded-') ? p.slice(8) : p.slice(7);
      if (r.startsWith('[') && r.endsWith(']')) {
        r = r.slice(1, -1);
      }
      if (r === 'none') props.radius = 0;
      else if (r === 'sm') props.radius = 2;
      else if (r === 'md') props.radius = 6;
      else if (r === 'lg') props.radius = 8;
      else if (r === 'xl') props.radius = 12;
      else if (r === '2xl') props.radius = 16;
      else if (r === '3xl') props.radius = 24;
      else if (r === 'full') props.radius = 99;
      else {
        const val = parseInt(r);
        if (!isNaN(val)) {
          props.radius = val;
        } else {
          props.radius = 8;
        }
      }
    }

    if (p.startsWith('shadow')) {
      if (p === 'shadow-inner') props.elevation = -4;
      else if (p.includes('2xl'))   props.elevation = 24;
      else if (p.includes('xl')) props.elevation = 18;
      else if (p.includes('lg')) props.elevation = 12;
      else if (p.includes('md')) props.elevation = 8;
      else if (p === 'shadow') props.elevation = 4;
    }
    if (p === 'font-bold' || p === 'fw-bold' || p === 'text-bold') props.bold = true;
    if (p === 'font-semibold') { props.bold = true; props.size = (props.size || 14) * 1; }

    // Spacing
    if (p.startsWith('p-') && !p.startsWith('px-') && !p.startsWith('py-') && !p.startsWith('pt-') && !p.startsWith('pb-') && !p.startsWith('pl-') && !p.startsWith('pr-')) {
      props.p = parseSpVal(p.slice(2));
    }
    if (p.startsWith('px-')) {
      props.pl = props.pr = parseSpVal(p.slice(3));
    }
    if (p.startsWith('py-')) {
      props.pt = props.pb = parseSpVal(p.slice(3));
    }
    if (p.startsWith('pt-')) props.pt = parseSpVal(p.slice(3));
    if (p.startsWith('pb-')) props.pb = parseSpVal(p.slice(3));
    if (p.startsWith('pl-')) props.pl = parseSpVal(p.slice(3));
    if (p.startsWith('pr-')) props.pr = parseSpVal(p.slice(3));

    if (p.startsWith('m-') && !p.startsWith('mt-') && !p.startsWith('mb-') && !p.startsWith('ml-') && !p.startsWith('mr-')) {
      props.m = parseSpVal(p.slice(2));
    }
    if (p.startsWith('mt-')) props.mt = parseSpVal(p.slice(3));
    if (p.startsWith('mb-')) props.mb = parseSpVal(p.slice(3));
    if (p.startsWith('ml-')) props.ml = parseSpVal(p.slice(3));
    if (p.startsWith('gap-')) {
      const gapClean = p.replace(/^gap-(?:x-|y-)?/, '');
      props.gap = parseSpVal(gapClean);
    }

    if (p === 'overflow-scroll' || p === 'overflow-auto') props.overflow = 'scroll';
    if (p === 'overflow-x-auto') props.scrollX = true;

    // ── MUI / Material ──
    if (p === 'Typography' || p === 'MuiTypography-root')  props.type = 'Text';
    if (p === 'Paper' || p === 'MuiPaper-root')            { props.type = 'Card'; props.elevation = 4; }
    if (p === 'MuiCard-root')  { props.type = 'Card'; props.elevation = 8; }
    if (p === 'MuiButton-root' || p === 'MuiButtonBase-root') props.type = 'Button';

    // DolphinCSS Magic Components
    if (p === 'dolphin-table' || p === 'dolphin-card' || p === 'dolphin-login' || p === 'dolphin-alert') {
      props.type = 'Column';
      props.flexDirection = 'column';
    }

    // Gradient & Visual Effect Presets (fx-glass, fx-aurora, fx-cyber, fx-neon, glow, etc.)
    if (p === 'bg-danphe' || p === 'danphe' || p === 'fx-danphe') props.gradient = 'gradient-danphe';
    if (p === 'bg-aurora' || p === 'aurora' || p === 'fx-aurora') props.gradient = 'gradient-aurora';
    if (p === 'bg-cyber' || p === 'cyber' || p === 'fx-cyber') props.gradient = 'gradient-cyber';
    if (p === 'bg-neon' || p === 'neon' || p === 'fx-neon') props.gradient = 'gradient-neon';
    if (p === 'bg-glass' || p === 'glass' || p === 'fx-glass') { props.gradient = 'gradient-glass'; props.bg = 'glass'; }
    if (p === 'fx-metal' || p === 'metal') props.gradient = 'gradient-metal';
    if (p === 'fx-flare' || p === 'flare') props.gradient = 'gradient-flare';
    if (p === 'fx-crystal' || p === 'crystal') props.gradient = 'gradient-crystal';
    if (p === 'fx-nebula' || p === 'nebula') props.gradient = 'gradient-nebula';
    if (p === 'fx-aqua' || p === 'aqua') props.gradient = 'gradient-aqua';
    if (p === 'glow' || p === 'glow-pulse') props.animation = p;
    if (p.startsWith('gradient-') || p.startsWith('fx-')) props.gradient = p;

    // Animation
    if (ANIMATION_STYLE_MAP[p]) props.animation = p;
  });

  // If we have runtime bindings + valid transition metadata, pack it into bindings descriptor
  // so Android runtime can animate fast-path props (transform/opacity) efficiently.
  if (props.bindings && typeof props.bindings === 'object') {
    const hasRealBindings = Object.keys(props.bindings).some(k => k !== '__anim');
    if (hasRealBindings && animDurationMs && animDurationMs > 0 && animTransition && animTransition !== 'none') {
      const ease = animEase || 'linear';
      props.bindings.__anim = `t=${animTransition},d=${animDurationMs},e=${ease}`;
    }
  }


  return props;

}

// ─── COLOR → 0-255 SHADE & COLOR CODE (Delegated to ./ub/colors.js) ───

// ─── COLOR, SPACING & ANIMATION HELPERS (Delegated to ./ub sub-modules) ───
function normalizeGradient(gradStr) {
  if (!gradStr) return '';
  if (gradStr.includes('danphe') || gradStr.includes('aurora') || gradStr.includes('cyber') || gradStr.includes('neon')) {
    return gradStr;
  }
  if (!gradStr.startsWith('gradient-')) return gradStr;
  
  const parts = gradStr.split('-');
  const normalized = ['gradient'];
  
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const num = parseInt(part);
    const isAngle = (i === parts.length - 1) && (num % 45 === 0 || num === 90 || num === 270);
    
    if (!isNaN(num) && !isAngle && num >= 50 && num <= 950) {
      normalized.push(normalizeShade(num));
    } else {
      normalized.push(part);
    }
  }
  
  return normalized.join('-');
}

// ─── STYLESHEET INJECTOR (Delegated to ./ub/animations.js) ───

// ─── WEB STYLE ENGINE (v19+ — browser CSS injection) ─────────────────────────
// Only active when running in browser (document is defined)
const _isWeb = typeof document !== 'undefined';

const GLOW_KEYFRAME = `
  @keyframes btn-glow-pulse {
    0%, 100% { box-shadow: 0 0 5px rgba(59,130,246,0.5); }
    50% { box-shadow: 0 0 20px rgba(59,130,246,0.8); }
  }
`;

function _simpleHash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return Math.abs(h).toString(36).substring(0, 12);
}

class _WebStyleEngine {
  constructor() {
    this._classCache = new LRUCache(2000);
    this._insertedRules = new Set();
    this._pendingRules = [];
    this._pendingFlush = false;
    this._keyframeCache = new Set();
    this._styleEl = null;
    this._styleSheet = null;
    this.darkMode = _isWeb ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
    this.totalRequests = 0;
    this.cacheHits = 0;
    this._glowAdded = false;
    if (_isWeb) this._initStyleSheet();
  }

  _initStyleSheet() {
    // 🐬 Smart Deactivation: If DolphinCSS CDN or explicit config disable flag is detected, deactivate internal UB stylesheet injector to prevent CSS class collisions!
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (window.__DOLPHIN_DISABLE_UB__ || document.querySelector('link[href*="dolphincss"]')) {
        return;
      }
    }
    try {
      this._styleSheet = new CSSStyleSheet();
      if (!document.adoptedStyleSheets.includes(this._styleSheet)) {
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, this._styleSheet];
      }
    } catch (e) {
      this._styleEl = document.createElement('style');
      this._styleEl.setAttribute('data-ub-engine', 'v19');
      document.head.appendChild(this._styleEl);
      this._styleSheet = this._styleEl.sheet;
    }
  }

  _addKeyframe(name, rule) {
    if (this._keyframeCache.has(name)) return;
    this._keyframeCache.add(name);
    this._pendingRules.push(rule);
    this._scheduleFlush();
  }

  _add(className, ruleText) {
    if (this._insertedRules.has(ruleText)) return;
    this._insertedRules.add(ruleText);
    this._pendingRules.push(ruleText);
    this._scheduleFlush();
  }

  _scheduleFlush() {
    if (!_isWeb || this._pendingFlush || !this._styleSheet) return;
    this._pendingFlush = true;
    queueMicrotask(() => { this._flush(); this._pendingFlush = false; });
  }

  _flush() {
    if (!this._styleSheet || this._pendingRules.length === 0) return;
    for (const rule of this._pendingRules) {
      try { this._styleSheet.insertRule(rule, this._styleSheet.cssRules.length); }
      catch (e) { /* ignore invalid rules */ }
    }
    this._pendingRules = [];
  }

  /**
   * Inject a space-separated string of utility classes and return hashed class names.
   * Falls back to original class names if no rule can be generated.
   */
  inject(classes) {
    if (!_isWeb || !classes) return classes;
    this.totalRequests++;

    if (!this._glowAdded) {
      this._addKeyframe('btn-glow-pulse', GLOW_KEYFRAME);
      this._glowAdded = true;
    }

    const results = [];
    const parts = classes.split(/\s+/).filter(Boolean);

    for (const cls of parts) {
      if (cls.startsWith('ub-')) { results.push(cls); continue; }

      const cached = this._classCache.get(cls);
      if (cached !== undefined) { this.cacheHits++; results.push(cached); continue; }

      // Parse variants (hover:, md:, etc.)
      const segments = cls.split(':');
      const name = segments.pop();
      const variants = segments;
      let pseudo, media;
      for (const v of variants) {
        if (['hover','active','focus','group-hover','infinite'].includes(v)) pseudo = v;
        else if (v in BREAKPOINTS) media = `@media (min-width: ${BREAKPOINTS[v]}px)`;
      }

      const className = `ub-${_simpleHash(cls)}`;
      let cssRules = null;

      // ── Delegate to parseClass first (preserves all existing logic) ──
      const parsed = parseClass(name, this.darkMode);
      if (parsed && Object.keys(parsed).length > 0) {
        // Convert style object back to CSS string
        const cssProps = Object.entries(parsed).map(([k, v]) => {
          const prop = k.replace(/([A-Z])/g, c => `-${c.toLowerCase()}`);
          return `${prop}: ${v};`;
        });
        cssRules = cssProps;
      }

      // ── Glass pattern (not in parseClass) ──
      if (!cssRules) {
        const glassMatch = name.match(/^glass(?:-(vert|horiz|radial))?-((?:[a-z]+-\d+-)+)(\d+)(?:-blur-(\d+))?$/);
        if (glassMatch) {
          const [, glassDir, colorStopsStr, glassOpacityStr, customBlurStr] = glassMatch;
          const colorStops = [];
          const stopPattern = /([a-z]+)-(\d+)/g;
          let sm;
          while ((sm = stopPattern.exec(colorStopsStr)) !== null) {
            if (BASE_COLORS[sm[1]]) colorStops.push({ color: sm[1], shade: parseInt(sm[2]) });
          }
          if (colorStops.length > 0) {
            const alpha = Math.min(1, Math.max(0, parseInt(glassOpacityStr) / 255));
            const blur = customBlurStr ? Math.min(60, Math.max(4, parseInt(customBlurStr))) : 24;
            const gradStops = colorStops.map(({ color, shade }) => {
              const base = getOKLCH(color, shade, this.darkMode);
              const m = base.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
              return m ? `oklch(${m[1]} ${m[2]} ${m[3]} / ${alpha.toFixed(3)})` : `rgba(255,255,255,${alpha.toFixed(3)})`;
            });
            let bgDir = glassDir === 'vert' ? 'to bottom' : glassDir === 'horiz' ? 'to right' : '135deg';
            let bgValue = glassDir === 'radial'
              ? `radial-gradient(ellipse at 30% 30%, ${gradStops.join(', ')}, transparent 80%)`
              : `linear-gradient(${bgDir}, ${gradStops.join(', ')})`;
            cssRules = [
              `background: ${bgValue} !important`,
              `backdrop-filter: blur(${blur}px) saturate(160%) brightness(1.05) !important`,
              `-webkit-backdrop-filter: blur(${blur}px) saturate(160%) brightness(1.05) !important`,
              `border: 1px solid rgba(255,255,255,${(alpha * 0.3).toFixed(3)}) !important`,
              `box-shadow: 0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2) !important`,
              `border-radius: 20px`,
              `overflow: hidden`,
              `position: relative`,
            ];
          }
        }
      }

      // ── bg-fill animation pattern ──
      if (!cssRules) {
        const bgFillMatch = name.match(/^bg-fill-(left|right|top|bottom)-([a-z]+)-(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)(ms|s)$/);
        if (bgFillMatch) {
          const [, direction, colorName, shade, duration, unit] = bgFillMatch;
          const durationMs = unit === 's' ? parseFloat(duration) * 1000 : parseFloat(duration);
          const color = getOKLCH(colorName, parseFloat(shade), this.darkMode);
          const kfName = `ub-fill-${direction}-${colorName}-${shade}`;
          let gradDir = direction === 'right' ? 'to left' : direction === 'top' ? 'to bottom' : direction === 'bottom' ? 'to top' : 'to right';
          let fromPos = (direction === 'left' || direction === 'top') ? '100%' : '0%';
          let toPos   = (direction === 'left' || direction === 'top') ? '0%'   : '100%';
          const bgSize = (direction === 'left' || direction === 'right') ? '200% 100%' : '100% 200%';
          this._addKeyframe(kfName, `@keyframes ${kfName} { from { background-position: ${fromPos}; } to { background-position: ${toPos}; } }`);
          cssRules = [
            `background-image: linear-gradient(${gradDir}, ${color} 50%, transparent 50%) !important`,
            `background-size: ${bgSize} !important`,
            `background-repeat: no-repeat !important`,
            `animation: ${kfName} ${durationMs}ms ease-out forwards`,
          ];
        }
      }

      if (cssRules) {
        const selector = pseudo ? `.${className}:${pseudo}` : `.${className}`;
        const ruleText = media
          ? `${media} { ${selector} { ${cssRules.join('; ')} } }`
          : `${selector} { ${cssRules.join('; ')} }`;
        this._add(className, ruleText);
        results.push(className);
        this._classCache.set(cls, className);
      } else {
        results.push(cls);
        this._classCache.set(cls, cls);
      }
    }

    return results.join(' ');
  }

  debug() {
    return {
      classCache: this._classCache.size,
      styleCount: this._insertedRules.size + this._keyframeCache.size,
      totalRequests: this.totalRequests,
      cacheHits: this.cacheHits,
      version: 'v19.0.3',
    };
  }
}

let _engineInstance = null;
function _getEngine() {
  if (!_engineInstance) {
    _engineInstance = new _WebStyleEngine();
    if (_isWeb) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e) => {
        _engineInstance.darkMode = e.matches;
        _engineInstance._classCache.clear();
        _engineInstance._insertedRules.clear();
        COLOR_CACHE.clear();
      };
      try { mq.addEventListener('change', handler); } catch { mq.addListener(handler); }
    }
  }
  return _engineInstance;
}

/**
 * ubInject — web-only CSS class injection (like ub() from ub.ts)
 * Returns hashed class names injected into the document stylesheet.
 * Falls back to original class names in non-browser environments.
 */
function ubInject(classes) {
  try {
    if (!classes) return '';
    if (!_isWeb) return String(classes);
    return _getEngine().inject(String(classes));
  } catch (e) {
    return String(classes || '');
  }
}

function debugUB() {
  try { return _getEngine().debug(); }
  catch { return { classCache: 0, styleCount: 0, totalRequests: 0, version: 'error' }; }
}

function clearUBCache() {
  try {
    const eng = _getEngine();
    eng._classCache.clear();
    eng._insertedRules.clear();
    eng._keyframeCache.clear();
    eng.totalRequests = 0;
    eng.cacheHits = 0;
    COLOR_CACHE.clear();
  } catch (e) {}
}

// ─── createHelper UTILITY ─────────────────────────────────────────────────────
function createHelper(prefix) {
  return (v) => `${prefix}-${v}`;
}

// ─── REACT HOOKS (require React — optional peer dependency) ───────────────────
// These are exported for use in React-based environments only.
// dolphin-native itself does not depend on React.
let _useState, _useEffect;
try {
  // eslint-disable-next-line
  const React = require('react');
  _useState = React.useState;
  _useEffect = React.useEffect;
} catch (e) {
  // React not available — hooks will throw if called
  _useState = null;
  _useEffect = null;
}

/**
 * useDirection — RTL/LTR direction toggle hook (React only)
 */
function useDirection() {
  if (!_useState) throw new Error('useDirection requires React');
  const [dir, setDir] = _useState('ltr');
  _useEffect(() => {
    if (_isWeb) document.documentElement.setAttribute('dir', dir);
  }, [dir]);
  const toggle = () => setDir(d => d === 'ltr' ? 'rtl' : 'ltr');
  return { direction: dir, toggleDirection: toggle };
}

/**
 * useResponsive — returns current breakpoint and window width (React only)
 */
function useResponsive() {
  if (!_useState) throw new Error('useResponsive requires React');
  const [screen, setScreen] = _useState({ width: 0, breakpoint: 'lg' });
  _useEffect(() => {
    if (!_isWeb) return;
    const update = () => {
      const w = window.innerWidth;
      let bp = 'sm';
      if (w >= 1536) bp = '2xl';
      else if (w >= 1280) bp = 'xl';
      else if (w >= 1024) bp = 'lg';
      else if (w >= 768) bp = 'md';
      setScreen({ width: w, breakpoint: bp });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return screen;
}

/**
 * useDeviceScale — returns dolphin scale units for current screen size (React only)
 */
function useDeviceScale() {
  if (!_useState) throw new Error('useDeviceScale requires React');
  const [scale, setScale] = _useState({ width: 0, height: 0, pixels: { width: 0, height: 0 } });
  _useEffect(() => {
    if (!_isWeb) return;
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setScale({
        width: Math.min(255, Math.floor(w / 4)),
        height: Math.min(255, Math.floor(h / 4)),
        pixels: { width: w, height: h },
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function applyClasses(element, classList) {
  if (!element || !classList) return;
  if (typeof document !== 'undefined') injectKeyframes();
  const styles = classesToStyle(classList);
  Object.assign(element.style, styles);
}

// ─── CLASS LIST → STYLE OBJECT ───────────────────────────────────────────────
function classesToStyle(classList, darkMode = false) {
  if (!classList || typeof classList !== 'string') return {};
  const styles = {};
  classList.split(/\s+/).filter(Boolean).forEach(cls => {
    const clsStyles = parseClass(cls, darkMode);
    Object.assign(styles, clsStyles);
  });
  return styles;
}

// ─── GRADIENT CSS STRING BUILDER ─────────────────────────────────────────────
function buildGradientCSS(fromColor, fromShade, toColor, toShade, angle = 135, darkMode = false) {
  const from = getOKLCH(fromColor, fromShade, darkMode);
  const to = getOKLCH(toColor, toShade, darkMode);
  return `linear-gradient(${angle}deg, ${from}, ${to})`;
}

// ─── GRADIENT RADIAL CSS STRING BUILDER ─────────────────────────────────────────
function buildGradientRadialCSS(fromColor, fromShade, toColor, toShade, darkMode = false) {
  const from = getOKLCH(fromColor, fromShade, darkMode);
  const to = getOKLCH(toColor, toShade, darkMode);
  return `radial-gradient(circle, ${from}, ${to})`;
}

// ─── IoT DATA MAPS ────────────────────────────────────────────────────────────
const _clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const _t = (v, min, max) => (_clamp(v, min, max) - min) / (max - min);
const _shade = (s, e, t) => Math.floor(s + (e - s) * t);

const map = {
  linear: (v, min, max, sc, ss, ec, es) => {
    const t = _t(v, min, max);
    return t < 0.5 ? `${sc}-${_shade(ss, es, t * 2)}` : `${ec}-${_shade(ss, es, (t - 0.5) * 2)}`;
  },
  shade: (v, min, max, color, sMin = 0, sMax = 255) =>
    `${color}-${_shade(sMin, sMax, _t(v, min, max))}`,
  fuel: (v, min = 0, max = 100) => {
    const t = _t(v, min, max);
    if (t < 0.33) return `bg-red-${_shade(128, 255, t / 0.33)}`;
    if (t < 0.66) return `bg-orange-${_shade(128, 255, (t - 0.33) / 0.33)}`;
    return `bg-green-${_shade(128, 255, (t - 0.66) / 0.34)}`;
  },
  heat: (v, min = 0, max = 100) => {
    const t = _t(v, min, max);
    if (t < 0.5) return `bg-green-${_shade(255, 128, t * 2)}`;
    return `bg-red-${_shade(128, 255, (t - 0.5) * 2)}`;
  },
  coolWarm: (v, min = 0, max = 100) => {
    const t = _t(v, min, max);
    if (t < 0.5) return `bg-blue-${_shade(128, 255, t * 2)}`;
    return `bg-red-${_shade(128, 255, (t - 0.5) * 2)}`;
  },
};

// ─── MAIN UB EXPORT ───────────────────────────────────────────────────────────
const ub = {
  // ── Color system (original + v19 additions) ──
  getOKLCH,
  oklch: getOKLCH,        // alias — matches ub.ts export name
  getColor,
  getShade,
  normalizeShade,
  normalizeGradient,
  resolveColorToHex,
  applyOpacity,
  getTextColorForBg,
  getTextColorForGradient,

  // ── Gradient builders (all original parsers kept intact) ──
  buildGradient,
  buildGradientCSS,
  buildGradientRadialCSS,

  // ── Class → style (original parsers, never removed) ──
  classesToStyle,
  parseClass,
  getTagDefaults,

  // ── Spacing & native parser (original, never removed) ──
  parseSpacing,
  registerCSSRules,
  GLOBAL_CSS_RULES,
  parseTW,

  // ── Animation ──
  packAnimation,
  KEYFRAMES,
  ANIMATION_STYLE_MAP,
  injectKeyframes,
  applyClasses,

  // ── Web CSS injection engine (v19+) ──
  inject: ubInject,       // ubInject(classes) → hashed className string
  ubInject,
  debugUB,
  clearUBCache,
  LRUCache,

  // ── React hooks (v19+, require React peer dep) ──
  useDirection,
  useResponsive,
  useDeviceScale,

  // ── Utility ──
  createHelper,

  // ── Maps / constants ──
  FLEX_MAP,
  SHADOW_SCALES,
  BUTTON_STYLES,
  INPUT_STYLES,
  CARD_STYLES,
  BASE_COLORS,
  BREAKPOINTS,

  // ── IoT helpers ──
  map,

  // ── Variant string builders ──
  gradient: (fromColor, fromShade, toColor, toShade) => `gradient-${fromColor}-${fromShade}-${toColor}-${toShade}`,
  gradientAngle: (angle, fromColor, fromShade, toColor, toShade) => `gradient-${angle}deg-${fromColor}-${fromShade}-${toColor}-${toShade}`,
  gradientVertical: (fromColor, fromShade, toColor, toShade) => `gradient-vert-${fromColor}-${fromShade}-${toColor}-${toShade}`,
  gradientHorizontal: (fromColor, fromShade, toColor, toShade) => `gradient-horiz-${fromColor}-${fromShade}-${toColor}-${toShade}`,
  gradientRadial: (fromColor, fromShade, toColor, toShade) => `gradient-radial-${fromColor}-${fromShade}-${toColor}-${toShade}`,
  gradientTriple: (c1, s1, c2, s2, c3, s3) => `gradient-${c1}-${s1}-${c2}-${s2}-${c3}-${s3}`,
  glass: (colors, opacity = 128, blur, dir) => {
    const stops = colors.map(([c, s]) => `${c}-${s}-`).join('');
    return `glass${dir ? `-${dir}` : ''}-${stops}${opacity}${blur ? `-blur-${blur}` : ''}`;
  },
  bgFill: (direction, color, shade, duration, unit = 'ms') => `bg-fill-${direction}-${color}-${shade}-${duration}${unit}`,

  version: 'v19.0.3',
};

module.exports = ub;
