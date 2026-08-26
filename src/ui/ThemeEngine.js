'use strict';

/**
 * 🎨 DolphinTheme — Flutter-beating Theme System
 *
 * Centralised color, typography, spacing, elevation tokens.
 * Supports Dark/Light mode, custom palettes, Bootstrap/MUI token parity.
 * All tokens compile to Titan 16-byte binary for native rendering.
 *
 * Usage:
 *   const { Theme } = require('dolphin-native');
 *   Theme.set({ primary: '#6366f1', mode: 'dark' });
 *   const color = Theme.color('primary');  // → '#6366f1'
 */

// ── Built-in palettes ──────────────────────────────────────────────────────

const PALETTES = {
  default: {
    primary:      '#6366f1',
    secondary:    '#8b5cf6',
    success:      '#22c55e',
    warning:      '#f59e0b',
    error:        '#ef4444',
    info:         '#3b82f6',
    background:   '#ffffff',
    surface:      '#f8fafc',
    text:         '#0f172a',
    textSecondary:'#64748b',
    border:       '#e2e8f0',
    shadow:       'rgba(0,0,0,0.1)',
    overlay:      'rgba(0,0,0,0.5)',
  },
  dark: {
    primary:      '#818cf8',
    secondary:    '#a78bfa',
    success:      '#4ade80',
    warning:      '#fbbf24',
    error:        '#f87171',
    info:         '#60a5fa',
    background:   '#0f172a',
    surface:      '#1e293b',
    text:         '#f1f5f9',
    textSecondary:'#94a3b8',
    border:       '#334155',
    shadow:       'rgba(0,0,0,0.4)',
    overlay:      'rgba(0,0,0,0.7)',
  },
  // Bootstrap parity
  bootstrap: {
    primary:      '#0d6efd',
    secondary:    '#6c757d',
    success:      '#198754',
    warning:      '#ffc107',
    error:        '#dc3545',
    info:         '#0dcaf0',
    background:   '#ffffff',
    surface:      '#f8f9fa',
    text:         '#212529',
    textSecondary:'#6c757d',
    border:       '#dee2e6',
    shadow:       'rgba(0,0,0,0.15)',
    overlay:      'rgba(0,0,0,0.5)',
  },
  // MUI parity
  mui: {
    primary:      '#1976d2',
    secondary:    '#9c27b0',
    success:      '#2e7d32',
    warning:      '#ed6c02',
    error:        '#d32f2f',
    info:         '#0288d1',
    background:   '#ffffff',
    surface:      '#f5f5f5',
    text:         'rgba(0,0,0,0.87)',
    textSecondary:'rgba(0,0,0,0.6)',
    border:       'rgba(0,0,0,0.12)',
    shadow:       'rgba(0,0,0,0.2)',
    overlay:      'rgba(0,0,0,0.5)',
  },
};

// ── Typography scale (Flutter TextTheme parity) ────────────────────────────

const TYPOGRAPHY = {
  displayLarge:   { size: 57, weight: 400, lineHeight: 64 },
  displayMedium:  { size: 45, weight: 400, lineHeight: 52 },
  displaySmall:   { size: 36, weight: 400, lineHeight: 44 },
  headlineLarge:  { size: 32, weight: 400, lineHeight: 40 },
  headlineMedium: { size: 28, weight: 400, lineHeight: 36 },
  headlineSmall:  { size: 24, weight: 400, lineHeight: 32 },
  titleLarge:     { size: 22, weight: 500, lineHeight: 28 },
  titleMedium:    { size: 16, weight: 500, lineHeight: 24 },
  titleSmall:     { size: 14, weight: 500, lineHeight: 20 },
  bodyLarge:      { size: 16, weight: 400, lineHeight: 24 },
  bodyMedium:     { size: 14, weight: 400, lineHeight: 20 },
  bodySmall:      { size: 12, weight: 400, lineHeight: 16 },
  labelLarge:     { size: 14, weight: 500, lineHeight: 20 },
  labelMedium:    { size: 12, weight: 500, lineHeight: 16 },
  labelSmall:     { size: 11, weight: 500, lineHeight: 16 },
  // Shorthand aliases
  h1: { size: 32, weight: 700, lineHeight: 40 },
  h2: { size: 28, weight: 700, lineHeight: 36 },
  h3: { size: 24, weight: 700, lineHeight: 32 },
  h4: { size: 20, weight: 700, lineHeight: 28 },
  h5: { size: 18, weight: 600, lineHeight: 24 },
  h6: { size: 16, weight: 600, lineHeight: 22 },
  body:    { size: 14, weight: 400, lineHeight: 20 },
  caption: { size: 12, weight: 400, lineHeight: 16 },
  overline:{ size: 10, weight: 600, lineHeight: 16, textTransform: 'uppercase', letterSpacing: 1.5 },
};

// ── Spacing scale ──────────────────────────────────────────────────────────

const SPACING = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
  xxxl: 64,
};

// ── Elevation / Shadow scale ───────────────────────────────────────────────

const ELEVATION = {
  0:  'none',
  1:  '0 1px 2px rgba(0,0,0,0.05)',
  2:  '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
  3:  '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
  4:  '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
  5:  '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
  6:  '0 25px 50px rgba(0,0,0,0.25)',
};

// ── Border radius scale ────────────────────────────────────────────────────

const RADIUS = {
  none:   0,
  xs:     2,
  sm:     4,
  md:     8,
  lg:     12,
  xl:     16,
  xxl:    24,
  full:   9999,
  pill:   9999,
};

// ── ThemeEngine class ──────────────────────────────────────────────────────

class ThemeEngine {
  constructor() {
    this._mode       = 'default';
    this._palette    = { ...PALETTES.default };
    this._custom     = {};
    this._typography = { ...TYPOGRAPHY };
    this._spacing    = { ...SPACING };
    this._radius     = { ...RADIUS };
    this._elevation  = { ...ELEVATION };
    this._listeners  = [];
  }

  /**
   * Set theme options
   * @param {object} opts - { mode, primary, secondary, ... } or { palette: 'bootstrap'|'mui'|'dark' }
   */
  set(opts = {}) {
    if (opts.palette && PALETTES[opts.palette]) {
      this._palette = { ...PALETTES[opts.palette] };
      this._mode    = opts.palette;
    }
    if (opts.mode) {
      this._mode    = opts.mode;
      const base    = PALETTES[opts.mode] || PALETTES.default;
      this._palette = { ...base };
    }
    // Override individual tokens
    const tokens = ['primary','secondary','success','warning','error','info',
                    'background','surface','text','textSecondary','border','shadow','overlay'];
    tokens.forEach(k => { if (opts[k]) this._palette[k] = opts[k]; });

    // Custom tokens
    Object.keys(opts).forEach(k => {
      if (!tokens.includes(k) && !['mode','palette'].includes(k)) {
        this._custom[k] = opts[k];
      }
    });

    this._notify();
    return this;
  }

  /** Get a color token */
  color(token) {
    return this._palette[token] || this._custom[token] || token;
  }

  /** Get a typography style */
  text(style = 'body') {
    return this._typography[style] || this._typography.body;
  }

  /** Get spacing value in dp/px */
  space(key) {
    return typeof key === 'number' ? key * 4 : (this._spacing[key] || 16);
  }

  /** Get shadow value */
  shadow(level = 2) {
    return this._elevation[level] || this._elevation[2];
  }

  /** Get border radius */
  radius(key = 'md') {
    return typeof key === 'number' ? key : (this._radius[key] ?? this._radius.md);
  }

  /** Get current mode */
  get mode() { return this._mode; }
  get isDark()  { return this._mode === 'dark'; }
  get isLight() { return !this.isDark; }

  /** Toggle dark/light */
  toggle() {
    this.set({ mode: this._mode === 'dark' ? 'default' : 'dark' });
    return this;
  }

  /** Subscribe to theme changes */
  onChange(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(f => f !== fn); };
  }

  /** Compile theme to Titan binary (16 bytes, embedded in app manifest) */
  toBinary() {
    const bin = Buffer.alloc(16);
    bin[0]  = 0xBB;                                                   // Theme magic
    bin[1]  = ['default','dark','bootstrap','mui'].indexOf(this._mode) & 0xFF;
    bin[2]  = this._hexToR(this._palette.primary);
    bin[3]  = this._hexToG(this._palette.primary);
    bin[4]  = this._hexToB(this._palette.primary);
    bin[5]  = this._hexToR(this._palette.secondary);
    bin[6]  = this._hexToG(this._palette.secondary);
    bin[7]  = this._hexToB(this._palette.secondary);
    bin[8]  = this._hexToR(this._palette.background);
    bin[9]  = this._hexToG(this._palette.background);
    bin[10] = this._hexToB(this._palette.background);
    bin[11] = this._hexToR(this._palette.text);
    bin[12] = this._hexToG(this._palette.text);
    bin[13] = this._hexToB(this._palette.text);
    bin[14] = 0x00;
    bin[15] = 0xBB;
    return bin;
  }

  /** Export as CSS custom properties string */
  toCSSVars() {
    const lines = [':root {'];
    Object.entries(this._palette).forEach(([k, v]) => {
      lines.push(`  --dolphin-${k}: ${v};`);
    });
    lines.push('}');
    return lines.join('\n');
  }

  /** Export as Bootstrap-compatible overrides */
  toBootstrapSCSS() {
    const p = this._palette;
    return [
      `$primary:   ${p.primary};`,
      `$secondary: ${p.secondary};`,
      `$success:   ${p.success};`,
      `$warning:   ${p.warning};`,
      `$danger:    ${p.error};`,
      `$info:      ${p.info};`,
      `$body-bg:   ${p.background};`,
      `$body-color:${p.text};`,
    ].join('\n');
  }

  /** Export as MUI theme override object */
  toMUITheme() {
    const p = this._palette;
    return {
      palette: {
        mode:      this._mode === 'dark' ? 'dark' : 'light',
        primary:   { main: p.primary },
        secondary: { main: p.secondary },
        success:   { main: p.success },
        warning:   { main: p.warning },
        error:     { main: p.error },
        info:      { main: p.info },
        background:{ default: p.background, paper: p.surface },
        text:      { primary: p.text, secondary: p.textSecondary },
      },
    };
  }

  // Private
  _notify() { this._listeners.forEach(fn => fn(this)); }
  _hexToR(c) { return parseInt((c || '#000000').replace('#','').slice(0,2), 16) || 0; }
  _hexToG(c) { return parseInt((c || '#000000').replace('#','').slice(2,4), 16) || 0; }
  _hexToB(c) { return parseInt((c || '#000000').replace('#','').slice(4,6), 16) || 0; }
}

// Singleton global theme
const Theme = new ThemeEngine();

module.exports = {
  Theme,
  ThemeEngine,
  PALETTES,
  TYPOGRAPHY,
  SPACING,
  ELEVATION,
  RADIUS,
};
