

const isWeb = typeof document !== 'undefined';
const SCALE_MAX = 255;
const PX_MULTIPLIER = 4;
const BORDER_MULTIPLIER = 1;
const GAP_MULTIPLIER = 4;
const SIZE_MULTIPLIER = 4;

const BASE_COLORS = {
  red: [0.62, 0.28, 25],
  blue: [0.68, 0.24, 260],
  green: [0.67, 0.22, 145],
  purple: [0.65, 0.22, 310],
  orange: [0.78, 0.22, 60],
  pink: [0.78, 0.24, 350],
  teal: [0.70, 0.18, 180],
  amber: [0.84, 0.18, 80],
  gray: [0.88, 0.04, 240],
};

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

const SPACING_MAP = {
  p: 'padding', pt: 'padding-top', pb: 'padding-bottom',
  pl: 'padding-left', pr: 'padding-right',
  m: 'margin', mt: 'margin-top', mb: 'margin-bottom',
  ml: 'margin-left', mr: 'margin-right',
};

const BORDER_SIDE_MAP = {
  t: 'top', r: 'right', b: 'bottom', l: 'left'
};

const FLEX_MAP = {
  'flex-left': ['display: flex;', 'justify-content: flex-start;', 'align-items: center;'],
  'flex-right': ['display: flex;', 'justify-content: flex-end;', 'align-items: center;'],
  'flex-center': ['display: flex;', 'justify-content: center;', 'align-items: center;'],
  'flex-between': ['display: flex;', 'justify-content: space-between;', 'align-items: center;'],
  'flex-around': ['display: flex;', 'justify-content: space-around;', 'align-items: center;'],
  'flex-evenly': ['display: flex;', 'justify-content: space-evenly;', 'align-items: center;'],
  'flex-start': ['display: flex;', 'justify-content: flex-start;', 'align-items: flex-start;'],
  'flex-end': ['display: flex;', 'justify-content: flex-end;', 'align-items: flex-end;'],
  'flex-stretch': ['display: flex;', 'justify-content: center;', 'align-items: stretch;'],
  'flexcol-left': ['display: flex;', 'flex-direction: column;', 'justify-content: flex-start;', 'align-items: flex-start;'],
  'flexcol-right': ['display: flex;', 'flex-direction: column;', 'justify-content: flex-start;', 'align-items: flex-end;'],
  'flexcol-center': ['display: flex;', 'flex-direction: column;', 'justify-content: center;', 'align-items: center;'],
  'flexcol-between': ['display: flex;', 'flex-direction: column;', 'justify-content: space-between;', 'align-items: center;'],
  'flexcol-start': ['display: flex;', 'flex-direction: column;', 'justify-content: flex-start;', 'align-items: flex-start;'],
  'flexcol-end': ['display: flex;', 'flex-direction: column;', 'justify-content: flex-end;', 'align-items: flex-end;'],
};

const BUTTON_STYLES = {
  'btn': [
    'display: inline-flex;',
    'align-items: center;',
    'justify-content: center;',
    'padding: 10px 20px;',
    'font-size: 14px;',
    'font-weight: 500;',
    'border-radius: 8px;',
    'cursor: pointer;',
    'transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);',
    'border: none;',
    'outline: none;',
    'gap: 8px;',
    'position: relative;',
    'overflow: hidden;',
    'transform: translateY(0);',
    'box-shadow: 0 2px 4px rgba(0,0,0,0.1);',
    '&:active { transform: translateY(1px); }',
    '&:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }'
  ],
  'btn-sm': [
    'padding: 6px 12px;',
    'font-size: 12px;',
    'border-radius: 6px;'
  ],
  'btn-md': [
    'padding: 10px 20px;',
    'font-size: 14px;',
    'border-radius: 8px;'
  ],
  'btn-lg': [
    'padding: 14px 28px;',
    'font-size: 16px;',
    'border-radius: 10px;'
  ],
  'btn-primary': [
    'background: linear-gradient(135deg, #3b82f6, #2563eb);',
    'color: white;',
    '&:hover { background: linear-gradient(135deg, #2563eb, #1d4ed8); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59,130,246,0.3); }',
    '&:active { transform: translateY(0); }'
  ],
  'btn-secondary': [
    'background: linear-gradient(135deg, #6b7280, #4b5563);',
    'color: white;',
    '&:hover { background: linear-gradient(135deg, #4b5563, #374151); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(107,114,128,0.3); }',
    '&:active { transform: translateY(0); }'
  ],
  'btn-success': [
    'background: linear-gradient(135deg, #10b981, #059669);',
    'color: white;',
    '&:hover { background: linear-gradient(135deg, #059669, #047857); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(16,185,129,0.3); }',
    '&:active { transform: translateY(0); }'
  ],
  'btn-danger': [
    'background: linear-gradient(135deg, #ef4444, #dc2626);',
    'color: white;',
    '&:hover { background: linear-gradient(135deg, #dc2626, #b91c1c); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(239,68,68,0.3); }',
    '&:active { transform: translateY(0); }'
  ],
  'btn-warning': [
    'background: linear-gradient(135deg, #f59e0b, #d97706);',
    'color: white;',
    '&:hover { background: linear-gradient(135deg, #d97706, #b45309); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(245,158,11,0.3); }',
    '&:active { transform: translateY(0); }'
  ],
  'btn-outline': [
    'background: transparent;',
    'border: 2px solid;',
    'transition: all 0.3s ease;',
    '&:hover { transform: translateY(-2px); }',
    '&:active { transform: translateY(0); }'
  ],
  'btn-ghost': [
    'background: transparent;',
    'box-shadow: none;',
    '&:hover { background: rgba(0,0,0,0.05); transform: translateY(-1px); }',
    '&:active { transform: translateY(0); }'
  ],
  'btn-glow': [
    'animation: btn-glow-pulse 2s infinite;',
    '&:hover { animation: none; transform: translateY(-2px); }'
  ]
};

const INPUT_STYLES = {
  'input': [
    'padding: 10px 14px;',
    'font-size: 14px;',
    'border: 2px solid #e2e8f0;',
    'border-radius: 8px;',
    'outline: none;',
    'transition: all 0.3s ease;',
    'width: 100%;',
    'box-sizing: border-box;',
    'background: white;',
    '&:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); transform: translateY(-1px); }',
    '&:hover { border-color: #cbd5e1; }'
  ],
  'input-sm': [
    'padding: 6px 10px;',
    'font-size: 12px;',
    'border-radius: 6px;'
  ],
  'input-md': [
    'padding: 10px 14px;',
    'font-size: 14px;',
    'border-radius: 8px;'
  ],
  'input-lg': [
    'padding: 14px 18px;',
    'font-size: 16px;',
    'border-radius: 10px;'
  ],
  'input-error': [
    'border-color: #ef4444;',
    '&:focus { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }'
  ],
  'input-success': [
    'border-color: #10b981;',
    '&:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }'
  ]
};

const CARD_STYLES = {
  'card': [
    'background: white;',
    'border-radius: 16px;',
    'padding: 24px;',
    'box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);',
    'transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);',
    'border: 1px solid rgba(0,0,0,0.05);'
  ],
  'card-hover': [
    '&:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }'
  ],
  'card-click': [
    'cursor: pointer;',
    '&:active { transform: translateY(0); }'
  ],
  'card-glass': [
    'background: rgba(255,255,255,0.9);',
    'backdrop-filter: blur(10px);',
    'border: 1px solid rgba(255,255,255,0.2);'
  ]
};

const GLOW_KEYFRAME = `
  @keyframes btn-glow-pulse {
    0%, 100% { box-shadow: 0 0 5px rgba(59,130,246,0.5); }
    50% { box-shadow: 0 0 20px rgba(59,130,246,0.8); }
  }
`;

const safeToString = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  try { return String(value); } catch { return ''; }
};

const safeParseFloat = (value) => {
  if (typeof value === 'number' && !isNaN(value)) return Math.max(0, value);
  const str = safeToString(value);
  const num = parseFloat(str);
  return isNaN(num) ? 0 : Math.max(0, num);
};

const safeParseInt = (value, defaultValue = 0) => {
  if (typeof value === 'number' && !isNaN(value)) return Math.max(0, Math.floor(value));
  const str = safeToString(value);
  const num = parseInt(str, 10);
  return isNaN(num) ? defaultValue : Math.max(0, num);
};

const safeClamp = (value, min, max) => 
  Math.min(max, Math.max(min, value));

const px = (n) => `${n * PX_MULTIPLIER}px`;
const borderPx = (n) => `${n * BORDER_MULTIPLIER}px`;
const gapPx = (n) => `${n * GAP_MULTIPLIER}px`;
const sizePx = (n) => `${n * SIZE_MULTIPLIER}px`;

const parseNumber = (str) => safeParseFloat(str);
const parseFloatShade = (str) => safeClamp(safeParseFloat(str), 0, 255) || 128;

const simpleHash = (str) => {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57, h3 = 0x9e3779b9, h4 = 0x85ebca6b;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 0x85ebca6b);
    h2 = Math.imul(h2 ^ ch, 0xc2b2ae35);
    h3 = Math.imul(h3 ^ ch, 0x9e3779b9);
    h4 = Math.imul(h4 ^ ch, 0x1b873593);
    h1 ^= h2 ^ h3 ^ h4;
    h2 ^= h1; h3 ^= h1; h4 ^= h1;
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 0x85ebca6b);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 0xc2b2ae35);
  h3 = Math.imul(h3 ^ (h3 >>> 16), 0x9e3779b9);
  h4 = Math.imul(h4 ^ (h4 >>> 16), 0x1b873593);
  h1 ^= h2 ^ h3 ^ h4;
  return Math.abs(h1).toString(36).substring(0, 12);
};

const applyOpacity = (color, opacity) => {
  if (opacity === undefined) return color;
  const opacityValue = safeClamp(opacity, 0, 1);
  if (color.startsWith('oklch(')) {
    return color.replace('oklch(', 'oklch(').replace(')', ` / ${opacityValue})`);
  }
  return color;
};

const parseOKLCH = (oklchColor) => {
  const match = oklchColor.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\)/);
  if (!match) return null;
  return { L: parseFloat(match[1]), C: parseFloat(match[2]), H: parseFloat(match[3]) };
};

class LRUCache {
  cache = new Map();
  maxSize;
  
  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }
  
  get(key) {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }
  
  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  
  clear() { this.cache.clear(); }
  get size() { return this.cache.size; }
}

const COLOR_CACHE = new LRUCache(500);

const getOKLCH = (name, shade, darkMode) => {
  const safeShade = safeClamp(shade, 0, 255);
  const key = `${name}-${safeShade.toFixed(2)}-${darkMode}`;
  const cached = COLOR_CACHE.get(key);
  if (cached) return cached;

  const baseColor = BASE_COLORS[name] || BASE_COLORS.gray;
  const [baseL, baseC, H] = baseColor;
  const t = safeShade / SCALE_MAX;
  
  let L, C;
  
  if (name === 'gray') {
    L = 0.98 - (t * 0.90);
    C = 0.04 + (t * 0.08);
  } else {
    L = 0.92 - (t * 0.77);
    const chromaMap = {
      'blue': 0.20 + (t * 0.14), 'purple': 0.20 + (t * 0.14),
      'red': 0.22 + (t * 0.12), 'orange': 0.22 + (t * 0.12),
      'green': 0.18 + (t * 0.14), 'teal': 0.18 + (t * 0.14),
      'pink': 0.20 + (t * 0.12), 'amber': 0.20 + (t * 0.12)
    };
    C = chromaMap[name] || 0.16 + (t * 0.16);
  }

  if (darkMode) {
    L = L * 0.9 + 0.05;
    C = C * 0.95;
  }
  
  L = safeClamp(L, 0.05, 0.98);
  C = safeClamp(C, 0.03, 0.35);

  const result = `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H})`;
  COLOR_CACHE.set(key, result);
  return result;
};

const getTextColorForBg = (oklchColor) => {
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
};

const getTextColorForGradient = (colors) => {
  let totalLightness = 0, hueSum = 0;
  for (const color of colors) {
    const parsed = parseOKLCH(color);
    if (parsed) { totalLightness += parsed.L; hueSum += parsed.H; }
  }
  const avgLightness = totalLightness / colors.length;
  const avgHue = hueSum / colors.length;
  let threshold = 0.55;
  if (avgHue >= 70 && avgHue <= 180) threshold = 0.48;
  else if (avgHue >= 220 && avgHue <= 320) threshold = 0.62;
  else if ((avgHue >= 0 && avgHue <= 40) || (avgHue >= 340 && avgHue <= 360)) threshold = 0.58;
  else if (avgHue >= 50 && avgHue <= 90) threshold = 0.52;
  return avgLightness > threshold ? `oklch(0.10 0.01 ${avgHue})` : `oklch(0.99 0.005 ${avgHue})`;
};

const roundedToRem = (value) => {
  const roundedMap = {
    0: '0', 1: '0.25rem', 2: '0.5rem', 3: '0.75rem',
    4: '1rem', 5: '1.25rem', 6: '1.5rem', 8: '2rem',
    10: '2.5rem', 12: '3rem', 16: '4rem'
  };
  return roundedMap[value] || `${value * 0.25}rem`;
};

const SHADOW_SCALES = {
  '1': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  '2': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  '3': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  '4': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  '5': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '6': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  '7': '0 35px 60px -15px rgb(0 0 0 / 0.3)',
  '8': '0 45px 65px -15px rgb(0 0 0 / 0.35)',
  '9': '0 50px 70px -15px rgb(0 0 0 / 0.4)',
  '10': '0 60px 80px -20px rgb(0 0 0 / 0.45)',
};

class VirtualCSSMap {
  styleSheet = null;
  insertedRules = new Set();
  pendingRules = [];
  pendingFlush = false;
  keyframeCache = new Set();

  constructor() {
    if (!isWeb) return;
    try {
      this.styleSheet = new CSSStyleSheet();
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, this.styleSheet];
    } catch (e) {
      const styleEl = document.createElement('style');
      styleEl.setAttribute('data-ub', 'v19.0.3');
      document.head.appendChild(styleEl);
      this.styleSheet = styleEl.sheet;
    }
  }

  add(className, rules, pseudo, media, child) {
    const selector = child ? `.${className} > ${child}` : pseudo ? `.${className}:${pseudo}` : `.${className}`;
    const ruleText = `${selector} { ${rules.join(' ')} }`;
    const finalRule = media ? `${media} { ${ruleText} }` : ruleText;
    if (this.insertedRules.has(finalRule)) return;
    this.insertedRules.add(finalRule);
    this.pendingRules.push(finalRule);
    this.scheduleFlush();
  }
  
  addKeyframe(keyframeName, keyframeRule) {
    if (this.keyframeCache.has(keyframeName)) return;
    this.keyframeCache.add(keyframeName);
    this.pendingRules.push(keyframeRule);
    this.scheduleFlush();
  }

  scheduleFlush() {
    if (this.pendingFlush || !isWeb || !this.styleSheet) return;
    this.pendingFlush = true;
    queueMicrotask(() => { this.flush(); this.pendingFlush = false; });
  }

  flush() {
    if (!this.styleSheet || this.pendingRules.length === 0) return;
    for (const rule of this.pendingRules) {
      try { this.styleSheet.insertRule(rule, this.styleSheet.cssRules.length); } catch (e) {}
    }
    this.pendingRules = [];
  }

  clear() {
    this.insertedRules.clear();
    this.keyframeCache.clear();
    this.pendingRules = [];
    if (this.styleSheet) { try { this.styleSheet.replaceSync(''); } catch (e) {} }
  }
  
  getStyleCount() { return this.insertedRules.size + this.keyframeCache.size; }
}

class WebStyleEngine {
  static instance;
  classCache = new LRUCache(2000);
  virtualMap = new VirtualCSSMap();
  darkMode = isWeb ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
  darkModeListeners = new Set();
  totalRequests = 0;
  cacheHits = 0;
  totalSegmentRequests = 0;
  glowAdded = false;

  static getInstance() {
    if (!WebStyleEngine.instance) {
      WebStyleEngine.instance = new WebStyleEngine();
      if (isWeb) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => {
          WebStyleEngine.instance.darkMode = 'matches' in e ? e.matches : e.matches;
          WebStyleEngine.instance.classCache.clear();
          WebStyleEngine.instance.virtualMap.clear();
          COLOR_CACHE.clear();
          WebStyleEngine.instance.darkModeListeners.forEach(fn => fn());
        };
        try { mediaQuery.addEventListener('change', handler); } catch { mediaQuery.addListener(handler); }
        
        if (!WebStyleEngine.instance.glowAdded) {
          WebStyleEngine.instance.virtualMap.addKeyframe('btn-glow-pulse', GLOW_KEYFRAME);
          WebStyleEngine.instance.glowAdded = true;
        }
      }
    }
    return WebStyleEngine.instance;
  }

  inject(classes) {
    if (!isWeb || !classes) return classes;
    this.totalRequests++;
    
    const results = [];
    const parts = classes.split(/\s+/).filter(Boolean);

    for (const cls of parts) {
      if (cls.startsWith('ub-')) { results.push(cls); continue; }
      
      this.totalSegmentRequests++;
      
      const cached = this.classCache.get(cls);
      if (cached) { 
        this.cacheHits++;
        results.push(cached); 
        continue; 
      }

      const segments = cls.split(':');
      const name = segments.pop();
      const variants = segments;

      let pseudo;
      let media;

      for (const v of variants) {
        if (v === 'hover' || v === 'active' || v === 'focus' || v === 'group-hover' || v === 'infinite') pseudo = v;
        else if (v in BREAKPOINTS) media = `@media (min-width: ${BREAKPOINTS[v]}px)`;
      }

      const className = `ub-${simpleHash(cls)}`;
      let rules = null;

      if (BUTTON_STYLES[name]) {
        rules = [...BUTTON_STYLES[name]];
        if (this.darkMode && name === 'btn') {
          rules = rules.map(r => r.replace('background: white;', 'background: #1f2937;').replace('color: #000;', 'color: #fff;'));
        }
      }
      else if (INPUT_STYLES[name]) {
        rules = [...INPUT_STYLES[name]];
        if (this.darkMode && name === 'input') {
          rules = rules.map(r => r.replace('background: white;', 'background: #1f2937;').replace('color: #000;', 'color: #fff;'));
        }
      }
      else if (CARD_STYLES[name]) {
        rules = [...CARD_STYLES[name]];
        if (this.darkMode && name === 'card') {
          rules = rules.map(r => r.replace('background: white;', 'background: #1f2937;'));
        }
      }
      else {
        const opacityMatch = name.match(/^opacity-(\d+)$/);
        const borderFloatMatch = name.match(/^border(?:-(\d+(?:\.\d+)?))?$/);
        const borderSideMatch = name.match(/^border-(t|r|b|l)-(\d+(?:\.\d+)?)$/);
        const borderXMatch = name.match(/^border-x-(\d+(?:\.\d+)?)$/);
        const borderYMatch = name.match(/^border-y-(\d+(?:\.\d+)?)$/);
        const gridMatch = name.match(/^grid-(\d+)x(\d+)-(\d+(?:\.\d+)?)$/);
        const autoGridMatch = name.match(/^auto-grid-(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
        const autoLayoutMatch = name.match(/^auto-layout-(row|col|wrap)(?:-(left|right|center|between|around|evenly|stretch))?-(\d+(?:\.\d+)?)$/);
        const spanMatch = name.match(/^span-(\d+)$/);
        const rowMatch = name.match(/^row-(\d+)$/);
        const roundedMatch = name.match(/^rounded(?:-(\d+(?:\.\d+)?|full))?$/);
        const shadowMatch = name.match(/^shadow(?:-(\d+))?$/);
        const sizeMatch = name.match(/^(w|h)-(\d+(?:\.\d+)?)$/);
        const spacingMatch = name.match(/^(p|m|pl|pr|ml|mr|pt|pb|mt|mb)-(\d+(?:\.\d+)?)$/);
        const scaleMatch = name.match(/^scale-(\d+(?:\.\d+)?)$/);
        const bgFillMatch = name.match(/^bg-fill-(left|right|top|bottom)-([a-z]+)-(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)(ms|s)$/);
        const gradientMatch = name.match(/^gradient-([a-z]+)-(\d+(?:\.\d+)?)-([a-z]+)-(\d+(?:\.\d+)?)$/);
        const gradientWithAngleMatch = name.match(/^gradient-(\d+(?:\.\d+)?)deg-([a-z]+)-(\d+(?:\.\d+)?)-([a-z]+)-(\d+(?:\.\d+)?)$/);
        const gradientVerticalMatch = name.match(/^gradient-vert-([a-z]+)-(\d+(?:\.\d+)?)-([a-z]+)-(\d+(?:\.\d+)?)$/);
        const gradientHorizontalMatch = name.match(/^gradient-horiz-([a-z]+)-(\d+(?:\.\d+)?)-([a-z]+)-(\d+(?:\.\d+)?)$/);
        const gradientRadialMatch = name.match(/^gradient-radial-([a-z]+)-(\d+(?:\.\d+)?)-([a-z]+)-(\d+(?:\.\d+)?)$/);
        const gradientTripleMatch = name.match(/^gradient-([a-z]+)-(\d+(?:\.\d+)?)-([a-z]+)-(\d+(?:\.\d+)?)-([a-z]+)-(\d+(?:\.\d+)?)$/);
        const glassMatch = name.match(/^glass(?:-(vert|horiz|radial))?-((?:[a-z]+-\d+-)+)(\d+)(?:-blur-(\d+))?$/);
        const colorAnimMatch = name.match(/^(bg|text)-([a-z]+)-(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)(ms|s)(?:-(infinite))?$/);
        const propAnimMatch = name.match(/^([a-z]+(?:-[a-z]+)?)-(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)(ms|s)(?:-(infinite))?$/);
        const isColor = name.startsWith('bg-') || name.startsWith('text-') || name.startsWith('border-');

        if (FLEX_MAP[name]) {
          rules = [...FLEX_MAP[name]];
        }
        else if (bgFillMatch) {
          const [, direction, colorName, shade, duration, unit] = bgFillMatch;
          const durationMs = unit === 's' ? parseFloat(duration) * 1000 : parseFloat(duration);
          const color = getOKLCH(colorName, parseFloatShade(shade), this.darkMode);
          
          const keyframeName = `ub-fill-${direction}-${colorName}-${shade}`;
          let gradientDir = 'to right';
          let fromPosition = '100%';
          let toPosition = '0%';
          
          if (direction === 'right') {
            gradientDir = 'to left';
            fromPosition = '0%';
            toPosition = '100%';
          } else if (direction === 'top') {
            gradientDir = 'to bottom';
            fromPosition = '100%';
            toPosition = '0%';
          } else if (direction === 'bottom') {
            gradientDir = 'to top';
            fromPosition = '0%';
            toPosition = '100%';
          }

          const keyframeRule = `
            @keyframes ${keyframeName} {
              from { background-position: ${fromPosition}; }
              to { background-position: ${toPosition}; }
            }
          `;
          
          this.virtualMap.addKeyframe(keyframeName, keyframeRule);
          const bgSize = direction === 'left' || direction === 'right' ? '200% 100%' : '100% 200%';
          
          rules = [
            `background-image: linear-gradient(${gradientDir}, ${color} 50%, transparent 50%) !important;`,
            `background-size: ${bgSize} !important;`,
            `background-repeat: no-repeat !important;`,
            `animation: ${keyframeName} ${durationMs}ms ease-out forwards;`
          ];
        }
        else if (opacityMatch) {
          const opacity = safeClamp(safeParseInt(opacityMatch[1], 100) / 100, 0, 1);
          rules = [`opacity: ${opacity};`];
        }
        else if (scaleMatch) {
          const scaleVal = safeClamp(safeParseInt(scaleMatch[1], 100) / 100, 0, 2);
          rules = [`scale: ${scaleVal} !important;`];
          if (pseudo !== 'hover') rules.push(`transition: scale 0.2s ease !important;`);
        }
        else if (borderFloatMatch) {
          const width = borderFloatMatch[1] || '1';
          rules = [`border-width: ${borderPx(parseNumber(width))};`, `border-style: solid;`];
        }
        else if (borderSideMatch) {
          const [, side, width] = borderSideMatch;
          rules = [`border-${BORDER_SIDE_MAP[side]}-width: ${borderPx(parseNumber(width))};`, `border-${BORDER_SIDE_MAP[side]}-style: solid;`];
        }
        else if (borderXMatch) {
          const width = borderXMatch[1];
          rules = [`border-left-width: ${borderPx(parseNumber(width))};`, `border-right-width: ${borderPx(parseNumber(width))};`, `border-left-style: solid;`, `border-right-style: solid;`];
        }
        else if (borderYMatch) {
          const width = borderYMatch[1];
          rules = [`border-top-width: ${borderPx(parseNumber(width))};`, `border-bottom-width: ${borderPx(parseNumber(width))};`, `border-top-style: solid;`, `border-bottom-style: solid;`];
        }
        else if (gridMatch) {
          const [, cols, rows, gapScale] = gridMatch;
          rules = [`display: grid;`, `grid-template-columns: repeat(${cols}, minmax(0, 1fr));`, `grid-template-rows: repeat(${rows}, auto);`, `gap: ${gapPx(parseNumber(gapScale))};`, `width: 100%;`];
        }
        else if (autoGridMatch) {
          const [, minScale, gapScale] = autoGridMatch;
          rules = [`display: grid;`, `grid-template-columns: repeat(auto-fit, minmax(${px(parseNumber(minScale))}, 1fr));`, `gap: ${gapPx(parseNumber(gapScale))};`, `width: 100%;`];
        }
        else if (autoLayoutMatch) {
          const [, direction, alignment, gapScale] = autoLayoutMatch;
          const flexDir = direction === 'col' ? 'column' : 'row';
          const flexWrap = direction === 'wrap' ? 'wrap' : 'nowrap';
          
          let justify = 'flex-start';
          let align = direction === 'col' ? 'stretch' : 'center';
          
          if (alignment === 'left') {
            justify = 'flex-start';
            align = direction === 'col' ? 'flex-start' : 'center';
          } else if (alignment === 'right') {
            justify = 'flex-end';
            align = direction === 'col' ? 'flex-end' : 'center';
          } else if (alignment === 'center') {
            justify = 'center';
            align = 'center';
          } else if (alignment === 'between') {
            justify = 'space-between';
            align = 'center';
          } else if (alignment === 'around') {
            justify = 'space-around';
            align = 'center';
          } else if (alignment === 'evenly') {
            justify = 'space-evenly';
            align = 'center';
          } else if (alignment === 'stretch') {
            justify = 'stretch';
            align = 'stretch';
          }
          
          rules = [
            `display: flex;`,
            `flex-direction: ${flexDir};`,
            `flex-wrap: ${flexWrap};`,
            `justify-content: ${justify};`,
            `align-items: ${align};`,
            `gap: ${gapPx(parseNumber(gapScale))};`,
            `width: 100%;`
          ];
        }
        else if (spanMatch) { rules = [`grid-column: span ${safeParseInt(spanMatch[1], 1)};`]; }
        else if (rowMatch) { rules = [`grid-row: span ${safeParseInt(rowMatch[1], 1)};`]; }
        else if (name === 'full') { rules = [`grid-column: 1 / -1;`]; }
        else if (roundedMatch) {
          const scale = roundedMatch[1] || '2';
          rules = [scale === 'full' ? `border-radius: 9999px;` : `border-radius: ${roundedToRem(parseNumber(scale))};`];
        }
        else if (shadowMatch) {
          const scale = shadowMatch[1] || '3';
          if (SHADOW_SCALES[scale]) rules = [`box-shadow: ${SHADOW_SCALES[scale]};`];
        }
        else if (sizeMatch) {
          const [, prop, scaleStr] = sizeMatch;
          rules = [`${prop === 'w' ? 'width' : 'height'}: ${sizePx(parseNumber(scaleStr))};`];
        }
        else if (colorAnimMatch) {
          const [, type, colorName, fromShade, toShade, duration, unit, infiniteFlag] = colorAnimMatch;
          const durationMs = unit === 's' ? parseFloat(duration) * 1000 : parseFloat(duration);
          const fromShadeNum = safeClamp(parseFloatShade(fromShade), 0, 255);
          const toShadeNum = safeClamp(parseFloatShade(toShade), 0, 255);
          
          const cssProp = type === 'bg' ? 'background-color' : 'color';
          const fromValue = getOKLCH(colorName, fromShadeNum, this.darkMode);
          const toValue = getOKLCH(colorName, toShadeNum, this.darkMode);
          
          const keyframeName = `ub-anim-${type}-${colorName}-${fromShade}-${toShade}`;
          const isInfinite = infiniteFlag === 'infinite' || pseudo === 'infinite';
          
          if (pseudo === 'hover') {
            rules = [
              `${cssProp}: ${fromValue};`,
              `transition: ${cssProp} ${durationMs}ms ease-out;`,
              `&:hover { ${cssProp}: ${toValue} !important; }`
            ];
          } 
          else if (pseudo === 'active' || pseudo === 'click') {
            const keyframeRule = `@keyframes ${keyframeName} { 0% { ${cssProp}: ${fromValue}; } 50% { ${cssProp}: ${toValue}; } 100% { ${cssProp}: ${fromValue}; } }`;
            this.virtualMap.addKeyframe(keyframeName, keyframeRule);
            rules = [`animation: ${keyframeName} ${durationMs}ms ease-out;`];
          }
          else if (isInfinite) {
            const keyframeRule = `@keyframes ${keyframeName} { 0% { ${cssProp}: ${fromValue}; } 50% { ${cssProp}: ${toValue}; } 100% { ${cssProp}: ${fromValue}; } }`;
            this.virtualMap.addKeyframe(keyframeName, keyframeRule);
            rules = [`animation: ${keyframeName} ${durationMs}ms infinite ease-in-out;`];
          }
          else {
            const keyframeRule = `@keyframes ${keyframeName} { 0% { ${cssProp}: ${fromValue}; } 100% { ${cssProp}: ${toValue}; } }`;
            this.virtualMap.addKeyframe(keyframeName, keyframeRule);
            rules = [`animation: ${keyframeName} ${durationMs}ms ease forwards;`];
          }
        }
        else if (propAnimMatch && !colorAnimMatch) {
          const [, prop, fromVal, toVal, duration, unit, infiniteFlag] = propAnimMatch;
          const durationMs = unit === 's' ? parseFloat(duration) * 1000 : parseFloat(duration);
          
          let cssProp = prop;
          let fromValue = fromVal;
          let toValue = toVal;
          
          if (prop === 'w') { cssProp = 'width'; fromValue = sizePx(parseFloat(fromVal)); toValue = sizePx(parseFloat(toVal)); }
          else if (prop === 'h') { cssProp = 'height'; fromValue = sizePx(parseFloat(fromVal)); toValue = sizePx(parseFloat(toVal)); }
          else if (prop === 'scale') { cssProp = 'transform'; fromValue = `scale(${parseFloat(fromVal) / 100})`; toValue = `scale(${parseFloat(toVal) / 100})`; }
          else if (prop === 'p' || prop === 'm' || prop === 'pt' || prop === 'pb' || prop === 'pl' || prop === 'pr' ||
                   prop === 'mt' || prop === 'mb' || prop === 'ml' || prop === 'mr') {
            cssProp = SPACING_MAP[prop];
            fromValue = px(parseFloat(fromVal));
            toValue = px(parseFloat(toVal));
          }
          else if (prop === 'rounded') { cssProp = 'border-radius'; fromValue = roundedToRem(parseFloat(fromVal)); toValue = roundedToRem(parseFloat(toVal)); }
          else if (prop === 'opacity') { cssProp = 'opacity'; fromValue = (parseFloat(fromVal) / 100).toString(); toValue = (parseFloat(toVal) / 100).toString(); }
          
          const keyframeName = `ub-animate-${prop}-${fromVal}-${toVal}`;
          const keyframeRule = `@keyframes ${keyframeName} { from { ${cssProp}: ${fromValue}; } to { ${cssProp}: ${toValue}; } }`;
          this.virtualMap.addKeyframe(keyframeName, keyframeRule);
          
          const isInfinite = infiniteFlag === 'infinite' || pseudo === 'infinite';
          
          if (pseudo === 'hover') {
            rules = [`${cssProp}: ${fromValue};`, `transition: ${cssProp} ${durationMs}ms ease-out;`, `&:hover { ${cssProp}: ${toValue}; }`];
          } else if (isInfinite) {
            rules = [`animation: ${keyframeName} ${durationMs}ms infinite ease-in-out alternate;`];
          } else {
            rules = [`animation: ${keyframeName} ${durationMs}ms ease forwards;`];
          }
        }
        else if (gradientMatch) {
          const [, fromColor, fromShade, toColor, toShade] = gradientMatch;
          const fromShadeNum = safeClamp(parseFloatShade(fromShade), 0, 255);
          const toShadeNum = safeClamp(parseFloatShade(toShade), 0, 255);
          const from = getOKLCH(fromColor, fromShadeNum, this.darkMode);
          const to = getOKLCH(toColor, toShadeNum, this.darkMode);
          const textColor = getTextColorForGradient([from, to]);
          
          if (pseudo === 'hover') {
            const hoverFromShade = Math.min(255, fromShadeNum + 20);
            const hoverToShade = Math.min(255, toShadeNum + 20);
            const hoverFrom = getOKLCH(fromColor, hoverFromShade, this.darkMode);
            const hoverTo = getOKLCH(toColor, hoverToShade, this.darkMode);
            const hoverTextColor = getTextColorForGradient([hoverFrom, hoverTo]);
            rules = [
              `background: linear-gradient(135deg, ${from}, ${to}) !important;`,
              `color: ${textColor} !important;`,
              `transition: all 0.3s ease;`,
              `&:hover { background: linear-gradient(135deg, ${hoverFrom}, ${hoverTo}) !important; color: ${hoverTextColor} !important; }`
            ];
          } else {
            rules = [`background: linear-gradient(135deg, ${from}, ${to}) !important;`, `color: ${textColor} !important;`, `caret-color: ${textColor} !important;`];
          }
        }
        else if (gradientWithAngleMatch) {
          const [, angle, fromColor, fromShade, toColor, toShade] = gradientWithAngleMatch;
          const fromShadeNum = safeClamp(parseFloatShade(fromShade), 0, 255);
          const toShadeNum = safeClamp(parseFloatShade(toShade), 0, 255);
          const from = getOKLCH(fromColor, fromShadeNum, this.darkMode);
          const to = getOKLCH(toColor, toShadeNum, this.darkMode);
          const textColor = getTextColorForGradient([from, to]);
          rules = [`background: linear-gradient(${angle}deg, ${from}, ${to}) !important;`, `color: ${textColor} !important;`, `caret-color: ${textColor} !important;`];
        }
        else if (gradientVerticalMatch) {
          const [, fromColor, fromShade, toColor, toShade] = gradientVerticalMatch;
          const fromShadeNum = safeClamp(parseFloatShade(fromShade), 0, 255);
          const toShadeNum = safeClamp(parseFloatShade(toShade), 0, 255);
          const from = getOKLCH(fromColor, fromShadeNum, this.darkMode);
          const to = getOKLCH(toColor, toShadeNum, this.darkMode);
          const textColor = getTextColorForGradient([from, to]);
          rules = [`background: linear-gradient(to bottom, ${from}, ${to}) !important;`, `color: ${textColor} !important;`, `caret-color: ${textColor} !important;`];
        }
        else if (gradientHorizontalMatch) {
          const [, fromColor, fromShade, toColor, toShade] = gradientHorizontalMatch;
          const fromShadeNum = safeClamp(parseFloatShade(fromShade), 0, 255);
          const toShadeNum = safeClamp(parseFloatShade(toShade), 0, 255);
          const from = getOKLCH(fromColor, fromShadeNum, this.darkMode);
          const to = getOKLCH(toColor, toShadeNum, this.darkMode);
          const textColor = getTextColorForGradient([from, to]);
          rules = [`background: linear-gradient(to right, ${from}, ${to}) !important;`, `color: ${textColor} !important;`, `caret-color: ${textColor} !important;`];
        }
        else if (gradientRadialMatch) {
          const [, fromColor, fromShade, toColor, toShade] = gradientRadialMatch;
          const fromShadeNum = safeClamp(parseFloatShade(fromShade), 0, 255);
          const toShadeNum = safeClamp(parseFloatShade(toShade), 0, 255);
          const from = getOKLCH(fromColor, fromShadeNum, this.darkMode);
          const to = getOKLCH(toColor, toShadeNum, this.darkMode);
          const textColor = getTextColorForGradient([from, to]);
          rules = [`background: radial-gradient(circle, ${from}, ${to}) !important;`, `color: ${textColor} !important;`, `caret-color: ${textColor} !important;`];
        }
        else if (gradientTripleMatch) {
          const [, c1, s1, c2, s2, c3, s3] = gradientTripleMatch;
          const shade1 = safeClamp(parseFloatShade(s1), 0, 255);
          const shade2 = safeClamp(parseFloatShade(s2), 0, 255);
          const shade3 = safeClamp(parseFloatShade(s3), 0, 255);
          const color1 = getOKLCH(c1, shade1, this.darkMode);
          const color2 = getOKLCH(c2, shade2, this.darkMode);
          const color3 = getOKLCH(c3, shade3, this.darkMode);
          const textColor = getTextColorForGradient([color1, color2, color3]);
          rules = [`background: linear-gradient(135deg, ${color1}, ${color2}, ${color3}) !important;`, `color: ${textColor} !important;`, `caret-color: ${textColor} !important;`];
        }
        else if (glassMatch) {
          // ============================================================
          // WORLD-CLASS DYNAMIC GLASS GRADIENT SYSTEM
          // Format: glass-[direction?]-[color1]-[shade1]-[color2]-[shade2]-...-[opacity]
          // Opacity: 0-255 (maps to CSS alpha)
          // Example: glass-red-180-purple-100-20
          // ============================================================
          const [, glassDirection, colorStopsStr, glassOpacityStr, customBlurStr] = glassMatch;
          const colorStops = [];
          const stopPattern = /([a-z]+)-(\d+)/g;
          let stopM;
          while ((stopM = stopPattern.exec(colorStopsStr)) !== null) {
            const colorName = stopM[1];
            const shadeVal = parseInt(stopM[2]);
            if (BASE_COLORS[colorName]) {
              colorStops.push({ color: colorName, shade: shadeVal });
            }
          }

          if (colorStops.length > 0) {
            const opacityValue = parseInt(glassOpacityStr);
            const alpha = safeClamp(opacityValue / 255, 0.0, 1.0);
            
            const blurAmount = customBlurStr ? safeClamp(parseInt(customBlurStr), 4, 60) : 24;
            const saturation = 160 + Math.min(colorStops.length * 15, 40);
            const hoverBlur = blurAmount + 10;
            const hoverSat = saturation + 25;

            // Build OKLCH color stops with opacity mapped from 0-255
            const gradientStops = colorStops.map(({ color, shade }) => {
              const baseColor = getOKLCH(color, shade, this.darkMode);
              const colorMatch = baseColor.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
              if (colorMatch) {
                return `oklch(${colorMatch[1]} ${colorMatch[2]} ${colorMatch[3]} / ${alpha.toFixed(3)})`;
              }
              return `rgba(255,255,255,${alpha.toFixed(3)})`;
            });

            // Build gradient based on direction
            let bgValue;
            if (glassDirection === 'radial') {
              bgValue = `radial-gradient(ellipse at 30% 30%, ${gradientStops.join(', ')}, transparent 80%)`;
            } else {
              const gradDir = glassDirection === 'vert' ? 'to bottom'
                : glassDirection === 'horiz' ? 'to right'
                : '135deg';
              bgValue = `linear-gradient(${gradDir}, ${gradientStops.join(', ')})`;
            }

            // Tinted glass border — first color stop at dynamic alpha
            const firstStop = colorStops[0];
            const firstBase = getOKLCH(firstStop.color, firstStop.shade, this.darkMode);
            const borderMatch = firstBase.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
            const borderAlpha = safeClamp(alpha * 1.5, 0.05, 0.4);
            const borderColor = borderMatch
              ? `oklch(${borderMatch[1]} ${borderMatch[2]} ${borderMatch[3]} / ${borderAlpha.toFixed(3)})`
              : `rgba(255,255,255,${borderAlpha.toFixed(3)})`;

            // Android Material You — multi-layer shadow
            const darkShadowAlpha = this.darkMode ? 0.3 : 0.12;
            const shadowStr = [
              `0 8px 32px rgba(0,0,0,${darkShadowAlpha})`,
              `0 2px 8px rgba(0,0,0,${darkShadowAlpha * 0.65})`,
              `inset 0 1px 0 rgba(255,255,255,${this.darkMode ? 0.12 : 0.22})`,
              `inset 0 -1px 0 rgba(0,0,0,0.04)`
            ].join(', ');

            const hoverShadowStr = [
              `0 16px 48px rgba(0,0,0,${darkShadowAlpha * 1.4})`,
              `0 4px 16px rgba(0,0,0,${darkShadowAlpha})`,
              `inset 0 1px 0 rgba(255,255,255,${this.darkMode ? 0.16 : 0.3})`,
              `inset 0 -1px 0 rgba(0,0,0,0.05)`
            ].join(', ');

            rules = [
              `background: ${bgValue} !important;`,
              `backdrop-filter: blur(${blurAmount}px) saturate(${saturation}%) brightness(1.05) !important;`,
              `-webkit-backdrop-filter: blur(${blurAmount}px) saturate(${saturation}%) brightness(1.05) !important;`,
              `border: 1px solid ${borderColor} !important;`,
              `box-shadow: ${shadowStr} !important;`,
              `transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;`,
              `border-radius: 20px;`,
              `overflow: hidden;`,
              `position: relative;`,
              `will-change: transform, box-shadow;`,
              `&:hover { backdrop-filter: blur(${hoverBlur}px) saturate(${hoverSat}%) brightness(1.08) !important; -webkit-backdrop-filter: blur(${hoverBlur}px) saturate(${hoverSat}%) brightness(1.08) !important; transform: translateY(-2px) scale(1.005) !important; box-shadow: ${hoverShadowStr} !important; border-color: rgba(255,255,255,0.3) !important; }`,
              `&::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%); pointer-events: none; z-index: 0; }`,
            ];
          }
        }
        else if (isColor) {
          const type = name.split('-')[0];
          const colorPart = name.substring(type.length + 1);
          const shadeMatch = colorPart.match(/^([a-z]+)-(\d+(?:\.\d+)?)(?:\/(\d+))?$/);
          if (shadeMatch) {
            const [, colorName, shadeStr, opacityStr] = shadeMatch;
            const shade = parseFloatShade(shadeStr);
            const opacity = opacityStr ? safeParseInt(opacityStr, 100) / 100 : undefined;
            
            if (type === 'bg') {
              const color = getOKLCH(colorName, shade, this.darkMode);
              const textColor = getTextColorForBg(color);
              const bgColor = applyOpacity(color, opacity);
              
              if (pseudo === 'hover') {
                const hoverColor = getOKLCH(colorName, Math.min(255, shade + 15), this.darkMode);
                const hoverTextColor = getTextColorForBg(hoverColor);
                const hoverBgColor = applyOpacity(hoverColor, opacity);
                rules = [
                  `background: ${bgColor} !important;`,
                  `color: ${textColor} !important;`,
                  `transition: all 0.2s ease;`,
                  `&:hover { background: ${hoverBgColor} !important; color: ${hoverTextColor} !important; }`
                ];
              } else {
                rules = [`background: ${bgColor} !important;`, `color: ${textColor} !important;`, `caret-color: ${textColor} !important;`];
              }
            } else {
              const prop = type === 'text' ? 'color' : 'border-color';
              const color = getOKLCH(colorName, shade, this.darkMode);
              rules = [`${prop}: ${applyOpacity(color, opacity)};`];
            }
          }
        }
        else if (spacingMatch) {
          const [, prop, scaleStr] = spacingMatch;
          rules = [`${SPACING_MAP[prop]}: ${px(parseNumber(scaleStr))};`];
        }
      }

      if (rules) {
        this.virtualMap.add(className, rules, pseudo, media);
        results.push(className);
        this.classCache.set(cls, className);
      } else {
        results.push(cls);
        this.classCache.set(cls, cls);
      }
    }

    return results.join(' ');
  }

  debug() { 
    return { 
      classCache: this.classCache.size, 
      styleCount: this.virtualMap.getStyleCount(), 
      totalRequests: this.totalRequests, 
      cacheHits: this.cacheHits,
      totalSegmentRequests: this.totalSegmentRequests,
      version: 'v19.0.3' 
    }; 
  }
}



export const ub = (str) => {
  try {
    const safeStr = safeToString(str);
    if (!safeStr) return '';
    return WebStyleEngine.getInstance().inject(safeStr);
  } catch (e) {
    console.warn('UB Error:', e);
    return safeToString(str);
  }
};

export const debugUB = () => {
  try { return WebStyleEngine.getInstance().debug(); } 
  catch { return { classCache: 0, styleCount: 0, totalRequests: 0, version: 'error' }; }
};

export const clearUBCache = () => {
  try {
    const engine = WebStyleEngine.getInstance();
    engine.classCache.clear();
    engine.virtualMap.clear();
    COLOR_CACHE.clear();
    engine.totalRequests = 0;
    engine.cacheHits = 0;
    engine.totalSegmentRequests = 0;
  } catch (e) {}
};

export const oklch = getOKLCH;

const createHelper = (prefix) => (v) => `${prefix}-${v}`;
const createHelperWithDefault = (prefix, defaultValue = 1) => (v = defaultValue) => `${prefix}-${v}`;

export const p = createHelper('p');
export const m = createHelper('m');
export const pl = createHelper('pl');
export const pr = createHelper('pr');
export const ml = createHelper('ml');
export const mr = createHelper('mr');
export const pt = createHelper('pt');
export const pb = createHelper('pb');
export const mt = createHelper('mt');
export const mb = createHelper('mb');
export const w = createHelper('w');
export const h = createHelper('h');
export const scale = createHelper('scale');

export const border = createHelperWithDefault('border');
export const borderT = createHelperWithDefault('border-t');
export const borderR = createHelperWithDefault('border-r');
export const borderB = createHelperWithDefault('border-b');
export const borderL = createHelperWithDefault('border-l');
export const borderX = createHelperWithDefault('border-x');
export const borderY = createHelperWithDefault('border-y');

export const rounded = (v) => v === 'full' ? 'rounded-full' : `rounded-${v}`;
export const shadow = (v) => `shadow-${safeClamp(safeParseInt(v, 3), 1, 10)}`;
export const opacity = (v) => `opacity-${safeClamp(safeParseInt(v, 100), 0, 100)}`;

export const bg = (c, s, o) => o !== undefined ? `bg-${c}-${s}/${o}` : `bg-${c}-${s}`;
export const text = (c, s, o) => o !== undefined ? `text-${c}-${s}/${o}` : `text-${c}-${s}`;
export const grid = (cols, rows, gap) => `grid-${cols}x${rows}-${gap}`;
export const autoGrid = (minWidth, gap) => `auto-grid-${minWidth}-${gap}`;
export const autoLayout = (direction, alignment, gap) => {
  if (gap === undefined) {
    return `auto-layout-${direction}-${alignment}`;
  }
  return `auto-layout-${direction}-${alignment}-${gap}`;
};
export const span = (n) => `span-${safeClamp(safeParseInt(n, 1), 1, 12)}`;
export const row = (n) => `row-${safeClamp(safeParseInt(n, 1), 1, 6)}`;
export const bgFill = (direction, color, shade, duration) => 
  `bg-fill-${direction}-${color}-${shade}-${duration}${typeof duration === 'number' && duration < 1000 ? 'ms' : 'ms'}`;

export const btn = {
  base: 'btn',
  sm: 'btn btn-sm',
  md: 'btn btn-md',
  lg: 'btn btn-lg',
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  success: 'btn btn-success',
  danger: 'btn btn-danger',
  warning: 'btn btn-warning',
  outline: 'btn btn-outline',
  ghost: 'btn btn-ghost',
  glow: 'btn btn-glow',
};

export const input = {
  base: 'input',
  sm: 'input input-sm',
  md: 'input input-md',
  lg: 'input input-lg',
  error: 'input input-error',
  success: 'input input-success',
};

export const card = {
  base: 'card',
  hover: 'card card-hover',
  click: 'card card-click card-hover',
  glass: 'card card-glass',
};

export const gradient = (fromColor, fromShade, toColor, toShade) => `gradient-${fromColor}-${fromShade}-${toColor}-${toShade}`;
export const gradientAngle = (angle, fromColor, fromShade, toColor, toShade) => `gradient-${angle}deg-${fromColor}-${fromShade}-${toColor}-${toShade}`;
export const gradientVertical = (fromColor, fromShade, toColor, toShade) => `gradient-vert-${fromColor}-${fromShade}-${toColor}-${toShade}`;
export const gradientHorizontal = (fromColor, fromShade, toColor, toShade) => `gradient-horiz-${fromColor}-${fromShade}-${toColor}-${toShade}`;
export const gradientRadial = (fromColor, fromShade, toColor, toShade) => `gradient-radial-${fromColor}-${fromShade}-${toColor}-${toShade}`;
export const gradientTriple = (c1, s1, c2, s2, c3, s3) => `gradient-${c1}-${s1}-${c2}-${s2}-${c3}-${s3}`;

// ============================================================
// GLASS HELPERS — World-Class Dynamic Glass Gradient System
// ============================================================
/** Single or multi-color glass gradient (opacity 0-255) */
export const glass = (c1, s1, c2, s2, c3, s3, o) => {
  if (o !== undefined) return `glass-${c1}-${s1}-${c2}-${s2}-${c3}-${s3}-${o}`;
  if (s2 !== undefined && c3 !== undefined) return `glass-${c1}-${s1}-${c2}-${s2}-${c3}`;
  return `glass-${c1}-${s1}-${c2}`;
};
/** Vertical (top→bottom) gradient glass */
export const glassVert = (c1, s1, c2, s2, c3, s3, o) => {
  if (o !== undefined) return `glass-vert-${c1}-${s1}-${c2}-${s2}-${c3}-${s3}-${o}`;
  if (s2 !== undefined && c3 !== undefined) return `glass-vert-${c1}-${s1}-${c2}-${s2}-${c3}`;
  return `glass-vert-${c1}-${s1}-${c2}`;
};
/** Horizontal (left→right) gradient glass */
export const glassHoriz = (c1, s1, c2, s2, c3, s3, o) => {
  if (o !== undefined) return `glass-horiz-${c1}-${s1}-${c2}-${s2}-${c3}-${s3}-${o}`;
  if (s2 !== undefined && c3 !== undefined) return `glass-horiz-${c1}-${s1}-${c2}-${s2}-${c3}`;
  return `glass-horiz-${c1}-${s1}-${c2}`;
};
/** Radial (center glow) gradient glass */
export const glassRadial = (c1, s1, c2, s2, o) => {
  if (o !== undefined) return `glass-radial-${c1}-${s1}-${c2}-${s2}-${o}`;
  return `glass-radial-${c1}-${s1}-${c2}`;
};

export const animate = (prop, from, to, duration, infinite) => 
  `${prop}-${from}-${to}-${duration}${typeof duration === 'number' && duration < 1000 ? 'ms' : 'ms'}${infinite ? '-infinite' : ''}`;
export const widthAnim = (from, to, duration, infinite) => animate('w', from, to, duration, infinite);
export const heightAnim = (from, to, duration, infinite) => animate('h', from, to, duration, infinite);
export const paddingAnim = (from, to, duration, infinite) => animate('p', from, to, duration, infinite);
export const marginAnim = (from, to, duration, infinite) => animate('m', from, to, duration, infinite);
export const bgAnim = (fromColor, fromShade, toColor, toShade, duration, infinite) => 
  `bg-${fromColor}-${fromShade}-${toColor}-${toShade}-${duration}${typeof duration === 'number' && duration < 1000 ? 'ms' : 'ms'}${infinite ? '-infinite' : ''}`;
export const opacityAnim = (from, to, duration, infinite) => animate('opacity', from, to, duration, infinite);
export const roundedAnim = (from, to, duration, infinite) => animate('rounded', from, to, duration, infinite);
export const scaleAnim = (from, to, duration, infinite) => animate('scale', from, to, duration, infinite);
export const infiniteAnim = (prop, from, to, duration) => animate(prop, from, to, duration, true);
export const clickAnim = (prop, from, to, duration) => `click:${prop}-${from}-${to}-${duration}${typeof duration === 'number' && duration < 1000 ? 'ms' : 'ms'}`;

// Helper to normalize value to 0-255 scale
const _normalize = (value, min, max) => {
  const clamped = Math.max(min, Math.min(max, value));
  const normalized = ((clamped - min) / (max - min)) * 255;
  return Math.floor(normalized);
};

/**
 * Universal map() function - Maps any input range to 0-255 scale
 * Works for colors, width, height, padding, opacity, scale, etc.
 * 
 * @param {number} value - Current value
 * @param {number} min - Minimum value of input range
 * @param {number} max - Maximum value of input range
 * @param {string|Array} config - Property type, color name, or color array
 * @returns {string|number} ub class or value
 * 
 * @examples
 * // Colors
 * map(28, 0, 50, 'red')                    // → 'red-142'
 * map(75, 0, 100, ['red', 'orange', 'green']) // → 'green-191'
 * 
 * // Dimensions (returns 0-255 scale value)
 * map(500, 0, 1000, 'w')    // → 'w-128' (500px → w-128 → 512px)
 * map(300, 0, 600, 'h')     // → 'h-128' (300px → h-128 → 512px)
 * 
 * // Spacing
 * map(20, 0, 40, 'p')       // → 'p-128' (20px → p-128 → 512px)
 * map(10, 0, 20, 'm')       // → 'm-128'
 * 
 * // Opacity
 * map(50, 0, 100, 'opacity') // → 'opacity-128' (50% opacity)
 * 
 * // Raw value (no prefix)
 * map(50, 0, 100)           // → 128 (just the normalized value)
 */
export const map = (value, min, max, config) => {
  const SCALE_MAX = 255;
  
  // Normalize input value to 0-255 scale
  const normalized = _normalize(value, min, max);
  
  // If no config provided, return raw normalized value
  if (config === undefined) {
    return normalized;
  }
  
  // Case 1: Property types (w, h, p, m, gap, opacity, etc.)
  if (typeof config === 'string') {
    const propertyTypes = {
      'w': 'w',
      'h': 'h',
      'width': 'w',
      'height': 'h',
      'p': 'p',
      'padding': 'p',
      'pt': 'pt',
      'pb': 'pb',
      'pl': 'pl',
      'pr': 'pr',
      'm': 'm',
      'margin': 'm',
      'mt': 'mt',
      'mb': 'mb',
      'ml': 'ml',
      'mr': 'mr',
      'gap': 'gap',
      'opacity': 'opacity',
      'scale': 'scale',
      'border': 'border'
    };
    
    // Check if it's a known property type
    if (propertyTypes[config]) {
      return `${propertyTypes[config]}-${normalized}`;
    }
    
    // Otherwise treat as color name
    return `${config}-${normalized}`;
  }
  
  // Case 2: Simple array of colors - auto-distribute
  if (Array.isArray(config) && config.every(c => typeof c === 'string')) {
    const colors = config;
    const segments = colors.length;
    const segmentSize = SCALE_MAX / segments;
    
    for (let i = 0; i < segments; i++) {
      if (normalized < (i + 1) * segmentSize || i === segments - 1) {
        const localValue = normalized - (i * segmentSize);
        const localShade = Math.floor((localValue / segmentSize) * SCALE_MAX);
        return `${colors[i]}-${Math.max(0, Math.min(SCALE_MAX, localShade))}`;
      }
    }
    return `${colors[colors.length - 1]}-${SCALE_MAX}`;
  }
  
  // Case 3: Array of stops with 'at' positions
  if (Array.isArray(config) && config.length > 0 && config[0].at !== undefined) {
    const stops = config.sort((a, b) => a.at - b.at);
    
    // Before first stop
    if (normalized <= stops[0].at) {
      return `${stops[0].color}-${normalized}`;
    }
    
    // After last stop
    if (normalized >= stops[stops.length - 1].at) {
      return `${stops[stops.length - 1].color}-${normalized}`;
    }
    
    // Between stops - interpolate
    for (let i = 0; i < stops.length - 1; i++) {
      if (normalized >= stops[i].at && normalized <= stops[i + 1].at) {
        const range = stops[i + 1].at - stops[i].at;
        const position = normalized - stops[i].at;
        const ratio = position / range;
        
        // Use first color if closer to it, second if closer to that
        return ratio < 0.5 
          ? `${stops[i].color}-${normalized}`
          : `${stops[i + 1].color}-${normalized}`;
      }
    }
  }
  
  // Fallback
  return normalized;
};

// Auto-compile elements with {ub('...')} class or data-ub="..." attribute in browser environments
if (typeof document !== 'undefined') {
  const compileDOM = () => {
    // 1. Process class="{ub('...')}"
    document.querySelectorAll('*').forEach(el => {
      const cls = el.getAttribute('class');
      if (cls) {
        const regex = /\{ub\(['"]([^'"]+)['"]\)\}/g;
        let match;
        let newCls = cls;
        while ((match = regex.exec(cls)) !== null) {
          const ubExpr = match[0];
          const ubArg = match[1];
          const compiled = ub(ubArg);
          newCls = newCls.replace(ubExpr, compiled);
        }
        if (newCls !== cls) {
          el.className = newCls;
        }
      }
    });

    // 2. Process data-ub="..."
    document.querySelectorAll('[data-ub]').forEach(el => {
      const ubAttr = el.getAttribute('data-ub');
      const compiled = ub(ubAttr);
      el.classList.add(...compiled.split(' ').filter(Boolean));
    });
  };

  // Run immediately if DOM is already loaded, otherwise listen to DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', compileDOM);
  } else {
    compileDOM();
  }
}

