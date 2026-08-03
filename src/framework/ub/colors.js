'use strict';

/**
 * 🐬 ub/colors.js — Color System & OKLCH Generator for Dolphin Native
 */

const SCALE_MAX = 255;
const COLOR_CACHE = new Map();

const BASE_COLORS = {
  red:    [0.62, 0.28, 25],
  blue:   [0.68, 0.24, 260],
  green:  [0.67, 0.22, 145],
  purple: [0.65, 0.22, 310],
  orange: [0.78, 0.22, 60],
  yellow: [0.85, 0.25, 70],
  pink:   [0.78, 0.24, 350],
  teal:   [0.70, 0.18, 180],
  amber:  [0.84, 0.18, 80],
  gray:   [0.88, 0.04, 240],
  indigo: [0.65, 0.26, 280],
  cyan:   [0.72, 0.20, 195],
  lime:   [0.80, 0.24, 120],
  rose:   [0.65, 0.26, 10],
  sky:    [0.72, 0.22, 215],
  violet: [0.63, 0.25, 295],
  fuchsia:[0.65, 0.26, 330],
  emerald:[0.67, 0.22, 155],
  slate:  [0.85, 0.06, 240],
  zinc:   [0.85, 0.05, 240],
  stone:  [0.85, 0.05, 60],
  neutral:[0.85, 0.02, 240],
};

function safeClamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function safeParseInt(v, fallback) {
  const parsed = parseInt(v, 10);
  return isNaN(parsed) ? fallback : parsed;
}

function getOKLCH(name, shade = 500, darkMode = false) {
  const key = `${name}-${shade}-${darkMode}`;
  const cached = COLOR_CACHE.get(key);
  if (cached) return cached;

  const safeShade = safeClamp(safeParseInt(shade, 500), 0, 1000);
  const baseColor = BASE_COLORS[name] || BASE_COLORS.gray;
  const [baseL, baseC, H] = baseColor;
  const t = safeShade / SCALE_MAX;

  let L, C;
  if (name === 'gray' || name === 'slate' || name === 'zinc' || name === 'neutral' || name === 'stone') {
    L = 0.98 - (t * 0.90);
    C = 0.04 + (t * 0.08);
  } else {
    L = 0.97 - (t * 0.85);
    const chromaBase = darkMode ? 0.12 : 0.05;
    const chromaMap = {
      'blue': chromaBase + (t * 0.22), 'purple': chromaBase + (t * 0.22),
      'violet': chromaBase + (t * 0.22), 'indigo': chromaBase + (t * 0.24),
      'red': chromaBase + (t * 0.24), 'rose': chromaBase + (t * 0.24),
      'orange': chromaBase + (t * 0.24), 'amber': chromaBase + (t * 0.22),
      'yellow': chromaBase + (t * 0.26), 'lime': chromaBase + (t * 0.22),
      'green': chromaBase + (t * 0.20), 'emerald': chromaBase + (t * 0.20),
      'teal': chromaBase + (t * 0.20), 'cyan': chromaBase + (t * 0.20),
      'sky': chromaBase + (t * 0.22), 'pink': chromaBase + (t * 0.22),
      'fuchsia': chromaBase + (t * 0.24),
    };
    C = chromaMap[name] || (chromaBase + (t * 0.20));
  }

  if (darkMode) { L = L * 0.9 + 0.05; C = C * 0.95; }
  L = safeClamp(L, 0.05, 0.98);
  C = safeClamp(C, 0.03, 0.35);

  const result = `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H})`;
  COLOR_CACHE.set(key, result);
  return result;
}

function applyOpacity(color, opacity) {
  if (opacity === undefined) return color;
  const opacityValue = Math.min(1, Math.max(0, opacity));
  if (typeof color === 'string' && color.startsWith('oklch(')) {
    return color.replace(/\)$/, ` / ${opacityValue})`);
  }
  return color;
}

function getTextColorForBg(oklchColor) {
  const match = oklchColor.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\)/);
  if (!match) return 'oklch(0 0 0)';
  const L = parseFloat(match[1]), C = parseFloat(match[2]), H = parseFloat(match[3]);
  if (H >= 220 && H <= 260 && C < 0.1) return L > 0.62 ? `oklch(0.10 0.01 ${H})` : `oklch(0.99 0.005 ${H})`;
  let threshold = 0.5;
  if (H >= 70 && H <= 180) threshold = 0.42;
  else if (H >= 220 && H <= 320) threshold = 0.58;
  else if ((H >= 0 && H <= 40) || (H >= 340 && H <= 360)) threshold = 0.52;
  else if (H >= 50 && H <= 90) threshold = 0.4;
  return L > threshold ? `oklch(0.10 0.01 ${H})` : `oklch(0.99 0.005 ${H})`;
}

function getColor(name) {
  if (!name || name === 'transparent') return 0;
  let cleanName = String(name).replace(/^(gradient-|btn-|bg-|text-)/, '');
  const base = cleanName.split('-')[0].toLowerCase();
  const colors = {
    'blue': 1, 'sky': 1, 'cyan': 1, 'info': 1,
    'green': 2, 'success': 2, 'emerald': 2, 'teal': 2, 'lime': 2,
    'primary': 3, 'indigo': 3, 'violet': 3,
    'red': 4, 'danger': 4, 'rose': 4,
    'orange': 6, 'amber': 5, 'warning': 5, 'yellow': 14,
    'gray': 7, 'secondary': 7, 'light': 7, 'slate': 7, 'zinc': 7, 'neutral': 7, 'stone': 7,
    'black': 9, 'dark': 9,
    'white': 10,
    'pink': 12, 'fuchsia': 12,
    'purple': 13,
    'glass': 25,
  };
  return colors[base] || 1;
}

function getShade(name) {
  if (!name || name === 'transparent') return 0;
  const str = String(name);
  const parts = str.split('-');
  for (let part of parts) {
    const val = parseInt(part);
    if (!isNaN(val)) {
      const map = {
        50:  20,
        100: 35,
        200: 60,
        300: 90,
        400: 115,
        500: 128,
        600: 150,
        700: 175,
        800: 205,
        900: 235,
        950: 245
      };
      if (map[val] !== undefined) return map[val];
      if (val <= 255) return val;
      return Math.max(0, Math.min(255, Math.round(val * 0.255)));
    }
  }
  if (str.includes('light')) return 200;
  if (str.includes('dark')) return 40;
  return 128;
}

function normalizeShade(val) {
  const map = {
    50:  20,
    100: 35,
    200: 60,
    300: 90,
    400: 115,
    500: 128,
    600: 150,
    700: 175,
    800: 205,
    900: 235,
    950: 245
  };
  if (map[val] !== undefined) return map[val];
  if (val <= 255) return val;
  return Math.max(0, Math.min(255, Math.round(val * 0.255)));
}

function resolveColorToHex(name) {
  if (!name) return '';
  const str = String(name).trim().toLowerCase();
  if (str.startsWith('#')) return str;
  
  const tailwindColors = {
      blue: '#3b82f6',
      red: '#ef4444',
      green: '#10b981',
      emerald: '#10b981',
      orange: '#f97316',
      yellow: '#f59e0b',
      amber: '#d97706',
      lime: '#84cc16',
      teal: '#14b8a6',
      cyan: '#06b6d4',
      sky: '#0ea5e9',
      indigo: '#6366f1',
      violet: '#8b5cf6',
      purple: '#a855f7',
      fuchsia: '#d946ef',
      pink: '#ec4899',
      rose: '#f43f5e',
      gray: '#9ca3af',
      slate: '#64748b',
      zinc: '#71717a',
      neutral: '#737373',
      stone: '#78716c',
      black: '#000000',
      white: '#ffffff'
  };

  const parts = str.split('-');
  const base = parts[0];
  if (tailwindColors[base]) {
      return tailwindColors[base];
  }
  return str;
}

module.exports = {
  BASE_COLORS,
  COLOR_CACHE,
  safeClamp,
  safeParseInt,
  getOKLCH,
  applyOpacity,
  getTextColorForBg,
  getColor,
  getShade,
  normalizeShade,
  resolveColorToHex
};
