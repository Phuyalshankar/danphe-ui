var UBEngine = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // ubBackup/ub.ts
  var ub_exports = {};
  __export(ub_exports, {
    UB: () => UB,
    animate: () => animate,
    autoGrid: () => autoGrid,
    bg: () => bg,
    bgAnim: () => bgAnim,
    bgFill: () => bgFill,
    border: () => border,
    borderB: () => borderB,
    borderL: () => borderL,
    borderR: () => borderR,
    borderT: () => borderT,
    borderX: () => borderX,
    borderY: () => borderY,
    btn: () => btn,
    card: () => card,
    clickAnim: () => clickAnim,
    debugUB: () => debugUB,
    default: () => ub_default,
    dom: () => dom,
    gradient: () => gradient,
    gradientAngle: () => gradientAngle,
    gradientHorizontal: () => gradientHorizontal,
    gradientRadial: () => gradientRadial,
    gradientTriple: () => gradientTriple,
    gradientVertical: () => gradientVertical,
    grid: () => grid,
    h: () => h,
    heightAnim: () => heightAnim,
    infiniteAnim: () => infiniteAnim,
    input: () => input,
    m: () => m,
    map: () => map,
    marginAnim: () => marginAnim,
    mb: () => mb,
    ml: () => ml,
    mr: () => mr,
    mt: () => mt,
    oklch: () => oklch,
    opacity: () => opacity,
    opacityAnim: () => opacityAnim,
    p: () => p,
    paddingAnim: () => paddingAnim,
    pb: () => pb,
    pl: () => pl,
    pr: () => pr,
    pt: () => pt,
    rounded: () => rounded,
    roundedAnim: () => roundedAnim,
    row: () => row,
    scale: () => scale,
    scaleAnim: () => scaleAnim,
    shadow: () => shadow,
    span: () => span,
    text: () => text,
    ub: () => ub,
    useDeviceScale: () => useDeviceScale,
    useDirection: () => useDirection,
    useResponsive: () => useResponsive,
    w: () => w,
    widthAnim: () => widthAnim
  });
  var import_react = __require("react");
  var import_react2 = __toESM(__require("react"));
  var isWeb = typeof document !== "undefined";
  var SCALE_MAX = 255;
  var PX_MULTIPLIER = 4;
  var BORDER_MULTIPLIER = 1;
  var GAP_MULTIPLIER = 4;
  var SIZE_MULTIPLIER = 4;
  var BASE_COLORS = {
    red: [0.62, 0.28, 25],
    blue: [0.68, 0.24, 260],
    green: [0.67, 0.22, 145],
    purple: [0.65, 0.22, 310],
    orange: [0.78, 0.22, 60],
    pink: [0.78, 0.24, 350],
    teal: [0.7, 0.18, 180],
    amber: [0.84, 0.18, 80],
    gray: [0.88, 0.04, 240]
  };
  var BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536
  };
  var SPACING_MAP = {
    p: "padding",
    pt: "padding-top",
    pb: "padding-bottom",
    pl: "padding-left",
    pr: "padding-right",
    m: "margin",
    mt: "margin-top",
    mb: "margin-bottom",
    ml: "margin-left",
    mr: "margin-right"
  };
  var BORDER_SIDE_MAP = {
    t: "top",
    r: "right",
    b: "bottom",
    l: "left"
  };
  var FLEX_MAP = {
    "flex-left": ["display: flex;", "justify-content: flex-start;", "align-items: center;"],
    "flex-right": ["display: flex;", "justify-content: flex-end;", "align-items: center;"],
    "flex-center": ["display: flex;", "justify-content: center;", "align-items: center;"],
    "flex-between": ["display: flex;", "justify-content: space-between;", "align-items: center;"],
    "flex-around": ["display: flex;", "justify-content: space-around;", "align-items: center;"],
    "flex-evenly": ["display: flex;", "justify-content: space-evenly;", "align-items: center;"],
    "flex-start": ["display: flex;", "justify-content: flex-start;", "align-items: flex-start;"],
    "flex-end": ["display: flex;", "justify-content: flex-end;", "align-items: flex-end;"],
    "flex-stretch": ["display: flex;", "justify-content: center;", "align-items: stretch;"],
    "flexcol-left": ["display: flex;", "flex-direction: column;", "justify-content: flex-start;", "align-items: flex-start;"],
    "flexcol-right": ["display: flex;", "flex-direction: column;", "justify-content: flex-start;", "align-items: flex-end;"],
    "flexcol-center": ["display: flex;", "flex-direction: column;", "justify-content: center;", "align-items: center;"],
    "flexcol-between": ["display: flex;", "flex-direction: column;", "justify-content: space-between;", "align-items: center;"],
    "flexcol-start": ["display: flex;", "flex-direction: column;", "justify-content: flex-start;", "align-items: flex-start;"],
    "flexcol-end": ["display: flex;", "flex-direction: column;", "justify-content: flex-end;", "align-items: flex-end;"]
  };
  var BUTTON_STYLES = {
    "btn": [
      "display: inline-flex;",
      "align-items: center;",
      "justify-content: center;",
      "padding: 10px 20px;",
      "font-size: 14px;",
      "font-weight: 500;",
      "border-radius: 8px;",
      "cursor: pointer;",
      "transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);",
      "border: none;",
      "outline: none;",
      "gap: 8px;",
      "position: relative;",
      "overflow: hidden;",
      "transform: translateY(0);",
      "box-shadow: 0 2px 4px rgba(0,0,0,0.1);",
      "&:active { transform: translateY(1px); }",
      "&:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }"
    ],
    "btn-sm": [
      "padding: 6px 12px;",
      "font-size: 12px;",
      "border-radius: 6px;"
    ],
    "btn-md": [
      "padding: 10px 20px;",
      "font-size: 14px;",
      "border-radius: 8px;"
    ],
    "btn-lg": [
      "padding: 14px 28px;",
      "font-size: 16px;",
      "border-radius: 10px;"
    ],
    "btn-primary": [
      "background: linear-gradient(135deg, #3b82f6, #2563eb);",
      "color: white;",
      "&:hover { background: linear-gradient(135deg, #2563eb, #1d4ed8); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59,130,246,0.3); }",
      "&:active { transform: translateY(0); }"
    ],
    "btn-secondary": [
      "background: linear-gradient(135deg, #6b7280, #4b5563);",
      "color: white;",
      "&:hover { background: linear-gradient(135deg, #4b5563, #374151); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(107,114,128,0.3); }",
      "&:active { transform: translateY(0); }"
    ],
    "btn-success": [
      "background: linear-gradient(135deg, #10b981, #059669);",
      "color: white;",
      "&:hover { background: linear-gradient(135deg, #059669, #047857); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(16,185,129,0.3); }",
      "&:active { transform: translateY(0); }"
    ],
    "btn-danger": [
      "background: linear-gradient(135deg, #ef4444, #dc2626);",
      "color: white;",
      "&:hover { background: linear-gradient(135deg, #dc2626, #b91c1c); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(239,68,68,0.3); }",
      "&:active { transform: translateY(0); }"
    ],
    "btn-warning": [
      "background: linear-gradient(135deg, #f59e0b, #d97706);",
      "color: white;",
      "&:hover { background: linear-gradient(135deg, #d97706, #b45309); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(245,158,11,0.3); }",
      "&:active { transform: translateY(0); }"
    ],
    "btn-outline": [
      "background: transparent;",
      "border: 2px solid;",
      "transition: all 0.3s ease;",
      "&:hover { transform: translateY(-2px); }",
      "&:active { transform: translateY(0); }"
    ],
    "btn-ghost": [
      "background: transparent;",
      "box-shadow: none;",
      "&:hover { background: rgba(0,0,0,0.05); transform: translateY(-1px); }",
      "&:active { transform: translateY(0); }"
    ],
    "btn-glow": [
      "animation: btn-glow-pulse 2s infinite;",
      "&:hover { animation: none; transform: translateY(-2px); }"
    ]
  };
  var INPUT_STYLES = {
    "input": [
      "padding: 10px 14px;",
      "font-size: 14px;",
      "border: 2px solid #e2e8f0;",
      "border-radius: 8px;",
      "outline: none;",
      "transition: all 0.3s ease;",
      "width: 100%;",
      "box-sizing: border-box;",
      "background: white;",
      "&:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); transform: translateY(-1px); }",
      "&:hover { border-color: #cbd5e1; }"
    ],
    "input-sm": [
      "padding: 6px 10px;",
      "font-size: 12px;",
      "border-radius: 6px;"
    ],
    "input-md": [
      "padding: 10px 14px;",
      "font-size: 14px;",
      "border-radius: 8px;"
    ],
    "input-lg": [
      "padding: 14px 18px;",
      "font-size: 16px;",
      "border-radius: 10px;"
    ],
    "input-error": [
      "border-color: #ef4444;",
      "&:focus { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }"
    ],
    "input-success": [
      "border-color: #10b981;",
      "&:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }"
    ]
  };
  var CARD_STYLES = {
    "card": [
      "background: white;",
      "border-radius: 16px;",
      "padding: 24px;",
      "box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);",
      "transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);",
      "border: 1px solid rgba(0,0,0,0.05);"
    ],
    "card-hover": [
      "&:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }"
    ],
    "card-click": [
      "cursor: pointer;",
      "&:active { transform: translateY(0); }"
    ],
    "card-glass": [
      "background: rgba(255,255,255,0.9);",
      "backdrop-filter: blur(10px);",
      "border: 1px solid rgba(255,255,255,0.2);"
    ]
  };
  var GLOW_KEYFRAME = `
  @keyframes btn-glow-pulse {
    0%, 100% { box-shadow: 0 0 5px rgba(59,130,246,0.5); }
    50% { box-shadow: 0 0 20px rgba(59,130,246,0.8); }
  }
`;
  var safeToString = (value) => {
    if (value === null || value === void 0) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
    if (typeof value === "boolean") return value ? "true" : "false";
    try {
      return String(value);
    } catch {
      return "";
    }
  };
  var safeParseFloat = (value) => {
    if (typeof value === "number" && !isNaN(value)) return Math.max(0, value);
    const str = safeToString(value);
    const num = parseFloat(str);
    return isNaN(num) ? 0 : Math.max(0, num);
  };
  var safeParseInt = (value, defaultValue = 0) => {
    if (typeof value === "number" && !isNaN(value)) return Math.max(0, Math.floor(value));
    const str = safeToString(value);
    const num = parseInt(str, 10);
    return isNaN(num) ? defaultValue : Math.max(0, num);
  };
  var safeClamp = (value, min, max) => Math.min(max, Math.max(min, value));
  var px = (n) => `${n * PX_MULTIPLIER}px`;
  var borderPx = (n) => `${n * BORDER_MULTIPLIER}px`;
  var gapPx = (n) => `${n * GAP_MULTIPLIER}px`;
  var sizePx = (n) => `${n * SIZE_MULTIPLIER}px`;
  var parseNumber = (str) => safeParseFloat(str);
  var parseFloatShade = (str) => safeClamp(safeParseFloat(str), 0, 255) || 128;
  var simpleHash = (str) => {
    let h1 = 3735928559, h2 = 1103547991, h3 = 2654435769, h4 = 2246822507;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2246822507);
      h2 = Math.imul(h2 ^ ch, 3266489909);
      h3 = Math.imul(h3 ^ ch, 2654435769);
      h4 = Math.imul(h4 ^ ch, 461845907);
      h1 ^= h2 ^ h3 ^ h4;
      h2 ^= h1;
      h3 ^= h1;
      h4 ^= h1;
    }
    h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507);
    h2 = Math.imul(h2 ^ h2 >>> 16, 3266489909);
    h3 = Math.imul(h3 ^ h3 >>> 16, 2654435769);
    h4 = Math.imul(h4 ^ h4 >>> 16, 461845907);
    h1 ^= h2 ^ h3 ^ h4;
    return Math.abs(h1).toString(36).substring(0, 12);
  };
  var applyOpacity = (color, opacity2) => {
    if (opacity2 === void 0) return color;
    const opacityValue = safeClamp(opacity2, 0, 1);
    if (color.startsWith("oklch(")) {
      return color.replace("oklch(", "oklch(").replace(")", ` / ${opacityValue})`);
    }
    return color;
  };
  var parseOKLCH = (oklchColor) => {
    const match = oklchColor.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\)/);
    if (!match) return null;
    return { L: parseFloat(match[1]), C: parseFloat(match[2]), H: parseFloat(match[3]) };
  };
  var LRUCache = class {
    cache = /* @__PURE__ */ new Map();
    maxSize;
    constructor(maxSize = 1e3) {
      this.maxSize = maxSize;
    }
    get(key) {
      const value = this.cache.get(key);
      if (value !== void 0) {
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
    clear() {
      this.cache.clear();
    }
    get size() {
      return this.cache.size;
    }
  };
  var COLOR_CACHE = new LRUCache(500);
  var getOKLCH = (name, shade, darkMode) => {
    const safeShade = safeClamp(shade, 0, 255);
    const key = `${name}-${safeShade.toFixed(2)}-${darkMode}`;
    const cached = COLOR_CACHE.get(key);
    if (cached) return cached;
    const baseColor = BASE_COLORS[name] || BASE_COLORS.gray;
    const [baseL, baseC, H] = baseColor;
    const t = safeShade / SCALE_MAX;
    let L, C;
    if (name === "gray") {
      L = 0.98 - t * 0.9;
      C = 0.04 + t * 0.08;
    } else {
      L = 0.92 - t * 0.77;
      const chromaMap = {
        "blue": 0.2 + t * 0.14,
        "purple": 0.2 + t * 0.14,
        "red": 0.22 + t * 0.12,
        "orange": 0.22 + t * 0.12,
        "green": 0.18 + t * 0.14,
        "teal": 0.18 + t * 0.14,
        "pink": 0.2 + t * 0.12,
        "amber": 0.2 + t * 0.12
      };
      C = chromaMap[name] || 0.16 + t * 0.16;
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
  var getTextColorForBg = (oklchColor) => {
    const match = oklchColor.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\)/);
    if (!match) return "oklch(0 0 0)";
    const L = parseFloat(match[1]), C = parseFloat(match[2]), H = parseFloat(match[3]);
    if (H >= 220 && H <= 260 && C < 0.1) return L > 0.62 ? `oklch(0.10 0.01 ${H})` : `oklch(0.99 0.005 ${H})`;
    let threshold = 0.5;
    if (H >= 70 && H <= 180) threshold = 0.42;
    else if (H >= 220 && H <= 320) threshold = 0.58;
    else if (H >= 0 && H <= 40 || H >= 340 && H <= 360) threshold = 0.52;
    else if (H >= 50 && H <= 90) threshold = 0.4;
    return L > threshold ? `oklch(0.10 0.01 ${H})` : `oklch(0.99 0.005 ${H})`;
  };
  var getTextColorForGradient = (colors) => {
    let totalLightness = 0, hueSum = 0;
    for (const color of colors) {
      const parsed = parseOKLCH(color);
      if (parsed) {
        totalLightness += parsed.L;
        hueSum += parsed.H;
      }
    }
    const avgLightness = totalLightness / colors.length;
    const avgHue = hueSum / colors.length;
    let threshold = 0.55;
    if (avgHue >= 70 && avgHue <= 180) threshold = 0.48;
    else if (avgHue >= 220 && avgHue <= 320) threshold = 0.62;
    else if (avgHue >= 0 && avgHue <= 40 || avgHue >= 340 && avgHue <= 360) threshold = 0.58;
    else if (avgHue >= 50 && avgHue <= 90) threshold = 0.52;
    return avgLightness > threshold ? `oklch(0.10 0.01 ${avgHue})` : `oklch(0.99 0.005 ${avgHue})`;
  };
  var roundedToRem = (value) => {
    const roundedMap = {
      0: "0",
      1: "0.25rem",
      2: "0.5rem",
      3: "0.75rem",
      4: "1rem",
      5: "1.25rem",
      6: "1.5rem",
      8: "2rem",
      10: "2.5rem",
      12: "3rem",
      16: "4rem"
    };
    return roundedMap[value] || `${value * 0.25}rem`;
  };
  var SHADOW_SCALES = {
    "1": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "2": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    "3": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "4": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    "5": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "6": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "7": "0 35px 60px -15px rgb(0 0 0 / 0.3)",
    "8": "0 45px 65px -15px rgb(0 0 0 / 0.35)",
    "9": "0 50px 70px -15px rgb(0 0 0 / 0.4)",
    "10": "0 60px 80px -20px rgb(0 0 0 / 0.45)"
  };
  var VirtualCSSMap = class {
    styleSheet = null;
    insertedRules = /* @__PURE__ */ new Set();
    pendingRules = [];
    pendingFlush = false;
    keyframeCache = /* @__PURE__ */ new Set();
    constructor() {
      if (!isWeb) return;
      try {
        this.styleSheet = new CSSStyleSheet();
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, this.styleSheet];
      } catch (e) {
        const styleEl = document.createElement("style");
        styleEl.setAttribute("data-ub", "v19.0.3");
        document.head.appendChild(styleEl);
        this.styleSheet = styleEl.sheet;
      }
    }
    add(className, rules, pseudo, media, child) {
      const selector = child ? `.${className} > ${child}` : pseudo ? `.${className}:${pseudo}` : `.${className}`;
      const ruleText = `${selector} { ${rules.join(" ")} }`;
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
      queueMicrotask(() => {
        this.flush();
        this.pendingFlush = false;
      });
    }
    flush() {
      if (!this.styleSheet || this.pendingRules.length === 0) return;
      for (const rule of this.pendingRules) {
        try {
          this.styleSheet.insertRule(rule, this.styleSheet.cssRules.length);
        } catch (e) {
        }
      }
      this.pendingRules = [];
    }
    clear() {
      this.insertedRules.clear();
      this.keyframeCache.clear();
      this.pendingRules = [];
      if (this.styleSheet) {
        try {
          this.styleSheet.replaceSync("");
        } catch (e) {
        }
      }
    }
    getStyleCount() {
      return this.insertedRules.size + this.keyframeCache.size;
    }
  };
  var WebStyleEngine = class _WebStyleEngine {
    static instance;
    classCache = new LRUCache(2e3);
    virtualMap = new VirtualCSSMap();
    darkMode = isWeb ? window.matchMedia("(prefers-color-scheme: dark)").matches : false;
    darkModeListeners = /* @__PURE__ */ new Set();
    totalRequests = 0;
    glowAdded = false;
    static getInstance() {
      if (!_WebStyleEngine.instance) {
        _WebStyleEngine.instance = new _WebStyleEngine();
        if (isWeb) {
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
          const handler = (e) => {
            _WebStyleEngine.instance.darkMode = "matches" in e ? e.matches : e.matches;
            _WebStyleEngine.instance.classCache.clear();
            _WebStyleEngine.instance.virtualMap.clear();
            COLOR_CACHE.clear();
            _WebStyleEngine.instance.darkModeListeners.forEach((fn) => fn());
          };
          try {
            mediaQuery.addEventListener("change", handler);
          } catch {
            mediaQuery.addListener(handler);
          }
          if (!_WebStyleEngine.instance.glowAdded) {
            _WebStyleEngine.instance.virtualMap.addKeyframe("btn-glow-pulse", GLOW_KEYFRAME);
            _WebStyleEngine.instance.glowAdded = true;
          }
        }
      }
      return _WebStyleEngine.instance;
    }
    inject(classes) {
      if (!isWeb || !classes) return classes;
      this.totalRequests++;
      const results = [];
      const parts = classes.split(/\s+/).filter(Boolean);
      for (const cls of parts) {
        if (cls.startsWith("ub-")) {
          results.push(cls);
          continue;
        }
        const cached = this.classCache.get(cls);
        if (cached) {
          results.push(cached);
          continue;
        }
        const segments = cls.split(":");
        const name = segments.pop();
        const variants = segments;
        let pseudo;
        let media;
        for (const v of variants) {
          if (v === "hover" || v === "active" || v === "focus" || v === "group-hover" || v === "infinite") pseudo = v;
          else if (v in BREAKPOINTS) media = `@media (min-width: ${BREAKPOINTS[v]}px)`;
        }
        const className = `ub-${simpleHash(cls)}`;
        let rules = null;
        if (BUTTON_STYLES[name]) {
          rules = [...BUTTON_STYLES[name]];
          if (this.darkMode && name === "btn") {
            rules = rules.map((r) => r.replace("background: white;", "background: #1f2937;").replace("color: #000;", "color: #fff;"));
          }
        } else if (INPUT_STYLES[name]) {
          rules = [...INPUT_STYLES[name]];
          if (this.darkMode && name === "input") {
            rules = rules.map((r) => r.replace("background: white;", "background: #1f2937;").replace("color: #000;", "color: #fff;"));
          }
        } else if (CARD_STYLES[name]) {
          rules = [...CARD_STYLES[name]];
          if (this.darkMode && name === "card") {
            rules = rules.map((r) => r.replace("background: white;", "background: #1f2937;"));
          }
        } else {
          const opacityMatch = name.match(/^opacity-(\d+)$/);
          const borderFloatMatch = name.match(/^border(?:-(\d+(?:\.\d+)?))?$/);
          const borderSideMatch = name.match(/^border-(t|r|b|l)-(\d+(?:\.\d+)?)$/);
          const borderXMatch = name.match(/^border-x-(\d+(?:\.\d+)?)$/);
          const borderYMatch = name.match(/^border-y-(\d+(?:\.\d+)?)$/);
          const gridMatch = name.match(/^grid-(\d+)x(\d+)-(\d+(?:\.\d+)?)$/);
          const autoGridMatch = name.match(/^auto-grid-(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
          const spanMatch = name.match(/^span-(\d+)$/);
          const rowMatch = name.match(/^row-(\d+)$/);
          const roundedMatch = name.match(/^rounded(?:-(\d+(?:\.\d+)?|full))?$/);
          const shadowMatch = name.match(/^shadow(?:-(\d+))?$/);
          const sizeMatch = name.match(/^(w|h)-(\d+(?:\.\d+)?)$/);
          const spacingMatch = name.match(/^(p|m|pl|pr|ml|mr|pt|pb|mt|mb)-(\d+(?:\.\d+)?)$/);
          const scaleMatch = name.match(/^scale-(\d+)$/);
          const bgFillMatch = name.match(/^bg-fill-(left|right|top|bottom)-([a-z]+)-(\d+)-(\d+)(ms|s)$/);
          const gradientMatch = name.match(/^gradient-([a-z]+)-(\d+)-([a-z]+)-(\d+)$/);
          const gradientWithAngleMatch = name.match(/^gradient-(\d+)deg-([a-z]+)-(\d+)-([a-z]+)-(\d+)$/);
          const gradientVerticalMatch = name.match(/^gradient-vert-([a-z]+)-(\d+)-([a-z]+)-(\d+)$/);
          const gradientHorizontalMatch = name.match(/^gradient-horiz-([a-z]+)-(\d+)-([a-z]+)-(\d+)$/);
          const gradientRadialMatch = name.match(/^gradient-radial-([a-z]+)-(\d+)-([a-z]+)-(\d+)$/);
          const gradientTripleMatch = name.match(/^gradient-([a-z]+)-(\d+)-([a-z]+)-(\d+)-([a-z]+)-(\d+)$/);
          const colorAnimMatch = name.match(/^(bg|text)-([a-z]+)-(\d+)-(\d+)-(\d+)(ms|s)(?:-(infinite))?$/);
          const propAnimMatch = name.match(/^([a-z]+(?:-[a-z]+)?)-(\d+)-(\d+)-(\d+)(ms|s)(?:-(infinite))?$/);
          const isColor = name.startsWith("bg-") || name.startsWith("text-") || name.startsWith("border-");
          if (FLEX_MAP[name]) {
            rules = [...FLEX_MAP[name]];
          } else if (bgFillMatch) {
            const [, direction, colorName, shade, duration, unit] = bgFillMatch;
            const durationMs = unit === "s" ? parseFloat(duration) * 1e3 : parseFloat(duration);
            const color = getOKLCH(colorName, safeParseInt(shade, 500), this.darkMode);
            const keyframeName = `ub-fill-${direction}-${colorName}-${shade}`;
            let gradientDir = "to right";
            let fromPosition = "100%";
            let toPosition = "0%";
            if (direction === "right") {
              gradientDir = "to left";
              fromPosition = "0%";
              toPosition = "100%";
            } else if (direction === "top") {
              gradientDir = "to bottom";
              fromPosition = "100%";
              toPosition = "0%";
            } else if (direction === "bottom") {
              gradientDir = "to top";
              fromPosition = "0%";
              toPosition = "100%";
            }
            const keyframeRule = `
            @keyframes ${keyframeName} {
              from { background-position: ${fromPosition}; }
              to { background-position: ${toPosition}; }
            }
          `;
            this.virtualMap.addKeyframe(keyframeName, keyframeRule);
            const bgSize = direction === "left" || direction === "right" ? "200% 100%" : "100% 200%";
            rules = [
              `background-image: linear-gradient(${gradientDir}, ${color} 50%, transparent 50%) !important;`,
              `background-size: ${bgSize} !important;`,
              `background-repeat: no-repeat !important;`,
              `animation: ${keyframeName} ${durationMs}ms ease-out forwards;`
            ];
          } else if (opacityMatch) {
            const opacity2 = safeClamp(safeParseInt(opacityMatch[1], 100) / 100, 0, 1);
            rules = [`opacity: ${opacity2};`];
          } else if (scaleMatch) {
            const scaleVal = safeClamp(safeParseInt(scaleMatch[1], 100) / 100, 0, 2);
            rules = [`transform: scale(${scaleVal});`];
            if (pseudo !== "hover") rules.push(`transition: transform 0.2s ease;`);
          } else if (borderFloatMatch) {
            const width = borderFloatMatch[1] || "1";
            rules = [`border-width: ${borderPx(parseNumber(width))};`, `border-style: solid;`];
          } else if (borderSideMatch) {
            const [, side, width] = borderSideMatch;
            rules = [`border-${BORDER_SIDE_MAP[side]}-width: ${borderPx(parseNumber(width))};`, `border-${BORDER_SIDE_MAP[side]}-style: solid;`];
          } else if (borderXMatch) {
            const width = borderXMatch[1];
            rules = [`border-left-width: ${borderPx(parseNumber(width))};`, `border-right-width: ${borderPx(parseNumber(width))};`, `border-left-style: solid;`, `border-right-style: solid;`];
          } else if (borderYMatch) {
            const width = borderYMatch[1];
            rules = [`border-top-width: ${borderPx(parseNumber(width))};`, `border-bottom-width: ${borderPx(parseNumber(width))};`, `border-top-style: solid;`, `border-bottom-style: solid;`];
          } else if (gridMatch) {
            const [, cols, rows, gapScale] = gridMatch;
            rules = [`display: grid;`, `grid-template-columns: repeat(${cols}, minmax(0, 1fr));`, `grid-template-rows: repeat(${rows}, auto);`, `gap: ${gapPx(parseNumber(gapScale))};`, `width: 100%;`];
          } else if (autoGridMatch) {
            const [, minScale, gapScale] = autoGridMatch;
            rules = [`display: grid;`, `grid-template-columns: repeat(auto-fit, minmax(${px(parseNumber(minScale))}, 1fr));`, `gap: ${gapPx(parseNumber(gapScale))};`, `width: 100%;`];
          } else if (spanMatch) {
            rules = [`grid-column: span ${safeParseInt(spanMatch[1], 1)};`];
          } else if (rowMatch) {
            rules = [`grid-row: span ${safeParseInt(rowMatch[1], 1)};`];
          } else if (name === "full") {
            rules = [`grid-column: 1 / -1;`];
          } else if (roundedMatch) {
            const scale2 = roundedMatch[1] || "2";
            rules = [scale2 === "full" ? `border-radius: 9999px;` : `border-radius: ${roundedToRem(parseNumber(scale2))};`];
          } else if (shadowMatch) {
            const scale2 = shadowMatch[1] || "3";
            if (SHADOW_SCALES[scale2]) rules = [`box-shadow: ${SHADOW_SCALES[scale2]};`];
          } else if (sizeMatch) {
            const [, prop, scaleStr] = sizeMatch;
            rules = [`${prop === "w" ? "width" : "height"}: ${sizePx(parseNumber(scaleStr))};`];
          } else if (colorAnimMatch) {
            const [, type, colorName, fromShade, toShade, duration, unit, infiniteFlag] = colorAnimMatch;
            const durationMs = unit === "s" ? parseFloat(duration) * 1e3 : parseFloat(duration);
            const fromShadeNum = safeClamp(parseFloatShade(fromShade), 0, 255);
            const toShadeNum = safeClamp(parseFloatShade(toShade), 0, 255);
            const cssProp = type === "bg" ? "background-color" : "color";
            const fromValue = getOKLCH(colorName, fromShadeNum, this.darkMode);
            const toValue = getOKLCH(colorName, toShadeNum, this.darkMode);
            const keyframeName = `ub-anim-${type}-${colorName}-${fromShade}-${toShade}`;
            const isInfinite = infiniteFlag === "infinite" || pseudo === "infinite";
            if (pseudo === "hover") {
              rules = [
                `${cssProp}: ${fromValue};`,
                `transition: ${cssProp} ${durationMs}ms ease-out;`,
                `&:hover { ${cssProp}: ${toValue} !important; }`
              ];
            } else if (pseudo === "active" || pseudo === "click") {
              const keyframeRule = `@keyframes ${keyframeName} { 0% { ${cssProp}: ${fromValue}; } 50% { ${cssProp}: ${toValue}; } 100% { ${cssProp}: ${fromValue}; } }`;
              this.virtualMap.addKeyframe(keyframeName, keyframeRule);
              rules = [`animation: ${keyframeName} ${durationMs}ms ease-out;`];
            } else if (isInfinite) {
              const keyframeRule = `@keyframes ${keyframeName} { 0% { ${cssProp}: ${fromValue}; } 50% { ${cssProp}: ${toValue}; } 100% { ${cssProp}: ${fromValue}; } }`;
              this.virtualMap.addKeyframe(keyframeName, keyframeRule);
              rules = [`animation: ${keyframeName} ${durationMs}ms infinite ease-in-out;`];
            } else {
              const keyframeRule = `@keyframes ${keyframeName} { 0% { ${cssProp}: ${fromValue}; } 100% { ${cssProp}: ${toValue}; } }`;
              this.virtualMap.addKeyframe(keyframeName, keyframeRule);
              rules = [`animation: ${keyframeName} ${durationMs}ms ease forwards;`];
            }
          } else if (propAnimMatch && !colorAnimMatch) {
            const [, prop, fromVal, toVal, duration, unit, infiniteFlag] = propAnimMatch;
            const durationMs = unit === "s" ? parseFloat(duration) * 1e3 : parseFloat(duration);
            let cssProp = prop;
            let fromValue = fromVal;
            let toValue = toVal;
            if (prop === "w") {
              cssProp = "width";
              fromValue = sizePx(parseFloat(fromVal));
              toValue = sizePx(parseFloat(toVal));
            } else if (prop === "h") {
              cssProp = "height";
              fromValue = sizePx(parseFloat(fromVal));
              toValue = sizePx(parseFloat(toVal));
            } else if (prop === "scale") {
              cssProp = "transform";
              fromValue = `scale(${parseFloat(fromVal) / 100})`;
              toValue = `scale(${parseFloat(toVal) / 100})`;
            } else if (prop === "p" || prop === "m" || prop === "pt" || prop === "pb" || prop === "pl" || prop === "pr" || prop === "mt" || prop === "mb" || prop === "ml" || prop === "mr") {
              cssProp = SPACING_MAP[prop];
              fromValue = px(parseFloat(fromVal));
              toValue = px(parseFloat(toVal));
            } else if (prop === "rounded") {
              cssProp = "border-radius";
              fromValue = roundedToRem(parseFloat(fromVal));
              toValue = roundedToRem(parseFloat(toVal));
            } else if (prop === "opacity") {
              cssProp = "opacity";
              fromValue = (parseFloat(fromVal) / 100).toString();
              toValue = (parseFloat(toVal) / 100).toString();
            }
            const keyframeName = `ub-animate-${prop}-${fromVal}-${toVal}`;
            const keyframeRule = `@keyframes ${keyframeName} { from { ${cssProp}: ${fromValue}; } to { ${cssProp}: ${toValue}; } }`;
            this.virtualMap.addKeyframe(keyframeName, keyframeRule);
            const isInfinite = infiniteFlag === "infinite" || pseudo === "infinite";
            if (pseudo === "hover") {
              rules = [`${cssProp}: ${fromValue};`, `transition: ${cssProp} ${durationMs}ms ease-out;`, `&:hover { ${cssProp}: ${toValue}; }`];
            } else if (isInfinite) {
              rules = [`animation: ${keyframeName} ${durationMs}ms infinite ease-in-out alternate;`];
            } else {
              rules = [`animation: ${keyframeName} ${durationMs}ms ease forwards;`];
            }
          } else if (gradientMatch) {
            const [, fromColor, fromShade, toColor, toShade] = gradientMatch;
            const fromShadeNum = safeClamp(parseFloatShade(fromShade), 0, 255);
            const toShadeNum = safeClamp(parseFloatShade(toShade), 0, 255);
            const from = getOKLCH(fromColor, fromShadeNum, this.darkMode);
            const to = getOKLCH(toColor, toShadeNum, this.darkMode);
            const textColor = getTextColorForGradient([from, to]);
            if (pseudo === "hover") {
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
          } else if (gradientWithAngleMatch) {
            const [, angle, fromColor, fromShade, toColor, toShade] = gradientWithAngleMatch;
            const fromShadeNum = safeClamp(parseFloatShade(fromShade), 0, 255);
            const toShadeNum = safeClamp(parseFloatShade(toShade), 0, 255);
            const from = getOKLCH(fromColor, fromShadeNum, this.darkMode);
            const to = getOKLCH(toColor, toShadeNum, this.darkMode);
            const textColor = getTextColorForGradient([from, to]);
            rules = [`background: linear-gradient(${angle}deg, ${from}, ${to}) !important;`, `color: ${textColor} !important;`, `caret-color: ${textColor} !important;`];
          } else if (gradientVerticalMatch) {
            const [, fromColor, fromShade, toColor, toShade] = gradientVerticalMatch;
            const fromShadeNum = safeClamp(parseFloatShade(fromShade), 0, 255);
            const toShadeNum = safeClamp(parseFloatShade(toShade), 0, 255);
            const from = getOKLCH(fromColor, fromShadeNum, this.darkMode);
            const to = getOKLCH(toColor, toShadeNum, this.darkMode);
            const textColor = getTextColorForGradient([from, to]);
            rules = [`background: linear-gradient(to bottom, ${from}, ${to}) !important;`, `color: ${textColor} !important;`, `caret-color: ${textColor} !important;`];
          } else if (gradientHorizontalMatch) {
            const [, fromColor, fromShade, toColor, toShade] = gradientHorizontalMatch;
            const fromShadeNum = safeClamp(parseFloatShade(fromShade), 0, 255);
            const toShadeNum = safeClamp(parseFloatShade(toShade), 0, 255);
            const from = getOKLCH(fromColor, fromShadeNum, this.darkMode);
            const to = getOKLCH(toColor, toShadeNum, this.darkMode);
            const textColor = getTextColorForGradient([from, to]);
            rules = [`background: linear-gradient(to right, ${from}, ${to}) !important;`, `color: ${textColor} !important;`, `caret-color: ${textColor} !important;`];
          } else if (gradientRadialMatch) {
            const [, fromColor, fromShade, toColor, toShade] = gradientRadialMatch;
            const fromShadeNum = safeClamp(parseFloatShade(fromShade), 0, 255);
            const toShadeNum = safeClamp(parseFloatShade(toShade), 0, 255);
            const from = getOKLCH(fromColor, fromShadeNum, this.darkMode);
            const to = getOKLCH(toColor, toShadeNum, this.darkMode);
            const textColor = getTextColorForGradient([from, to]);
            rules = [`background: radial-gradient(circle, ${from}, ${to}) !important;`, `color: ${textColor} !important;`, `caret-color: ${textColor} !important;`];
          } else if (gradientTripleMatch) {
            const [, c1, s1, c2, s2, c3, s3] = gradientTripleMatch;
            const shade1 = safeClamp(parseFloatShade(s1), 0, 255);
            const shade2 = safeClamp(parseFloatShade(s2), 0, 255);
            const shade3 = safeClamp(parseFloatShade(s3), 0, 255);
            const color1 = getOKLCH(c1, shade1, this.darkMode);
            const color2 = getOKLCH(c2, shade2, this.darkMode);
            const color3 = getOKLCH(c3, shade3, this.darkMode);
            const textColor = getTextColorForGradient([color1, color2, color3]);
            rules = [`background: linear-gradient(135deg, ${color1}, ${color2}, ${color3}) !important;`, `color: ${textColor} !important;`, `caret-color: ${textColor} !important;`];
          } else if (isColor) {
            const type = name.split("-")[0];
            const colorPart = name.substring(type.length + 1);
            const shadeMatch = colorPart.match(/^([a-z]+)-(\d+(?:\.\d+)?)(?:\/(\d+))?$/);
            if (shadeMatch) {
              const [, colorName, shadeStr, opacityStr] = shadeMatch;
              const shade = parseFloatShade(shadeStr);
              const opacity2 = opacityStr ? safeParseInt(opacityStr, 100) / 100 : void 0;
              if (type === "bg") {
                const color = getOKLCH(colorName, shade, this.darkMode);
                const textColor = getTextColorForBg(color);
                const bgColor = applyOpacity(color, opacity2);
                if (pseudo === "hover") {
                  const hoverColor = getOKLCH(colorName, Math.min(255, shade + 15), this.darkMode);
                  const hoverTextColor = getTextColorForBg(hoverColor);
                  const hoverBgColor = applyOpacity(hoverColor, opacity2);
                  rules = [
                    `background-color: ${bgColor} !important;`,
                    `color: ${textColor} !important;`,
                    `transition: all 0.2s ease;`,
                    `&:hover { background-color: ${hoverBgColor} !important; color: ${hoverTextColor} !important; }`
                  ];
                } else {
                  rules = [`background-color: ${bgColor} !important;`, `color: ${textColor} !important;`, `caret-color: ${textColor} !important;`];
                }
              } else {
                const prop = type === "text" ? "color" : "border-color";
                const color = getOKLCH(colorName, shade, this.darkMode);
                rules = [`${prop}: ${applyOpacity(color, opacity2)};`];
              }
            }
          } else if (spacingMatch) {
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
        }
      }
      return results.join(" ");
    }
    debug() {
      return { classCache: this.classCache.size, styleCount: this.virtualMap.getStyleCount(), totalRequests: this.totalRequests, version: "v19.0.3" };
    }
  };
  var useDirection = () => {
    const [dir, setDir] = (0, import_react.useState)("ltr");
    (0, import_react.useEffect)(() => {
      if (isWeb) document.documentElement.setAttribute("dir", dir);
    }, [dir]);
    const toggle = () => setDir((d) => d === "ltr" ? "rtl" : "ltr");
    return { direction: dir, toggleDirection: toggle };
  };
  var useResponsive = () => {
    const [screen, setScreen] = (0, import_react.useState)({ width: 0, breakpoint: "lg" });
    (0, import_react.useEffect)(() => {
      if (!isWeb) return;
      const update = () => {
        const w2 = window.innerWidth;
        let bp = "sm";
        if (w2 >= 1536) bp = "2xl";
        else if (w2 >= 1280) bp = "xl";
        else if (w2 >= 1024) bp = "lg";
        else if (w2 >= 768) bp = "md";
        setScreen({ width: w2, breakpoint: bp });
      };
      update();
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }, []);
    return screen;
  };
  var useDeviceScale = () => {
    const [scale2, setScale] = (0, import_react.useState)({ width: 0, height: 0, pixels: { width: 0, height: 0 } });
    (0, import_react.useEffect)(() => {
      if (!isWeb) return;
      const update = () => {
        const w2 = window.innerWidth;
        const h2 = window.innerHeight;
        setScale({ width: Math.min(255, Math.floor(w2 / 4)), height: Math.min(255, Math.floor(h2 / 4)), pixels: { width: w2, height: h2 } });
      };
      update();
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }, []);
    return scale2;
  };
  var ub = (str) => {
    try {
      const safeStr = safeToString(str);
      if (!safeStr) return "";
      return WebStyleEngine.getInstance().inject(safeStr);
    } catch (e) {
      console.warn("UB Error:", e);
      return safeToString(str);
    }
  };
  var debugUB = () => {
    try {
      return WebStyleEngine.getInstance().debug();
    } catch {
      return { classCache: 0, styleCount: 0, totalRequests: 0, version: "error" };
    }
  };
  var oklch = getOKLCH;
  var createHelper = (prefix) => (v) => `${prefix}-${v}`;
  var createHelperWithDefault = (prefix, defaultValue = 1) => (v = defaultValue) => `${prefix}-${v}`;
  var p = createHelper("p");
  var m = createHelper("m");
  var pl = createHelper("pl");
  var pr = createHelper("pr");
  var ml = createHelper("ml");
  var mr = createHelper("mr");
  var pt = createHelper("pt");
  var pb = createHelper("pb");
  var mt = createHelper("mt");
  var mb = createHelper("mb");
  var w = createHelper("w");
  var h = createHelper("h");
  var scale = createHelper("scale");
  var border = createHelperWithDefault("border");
  var borderT = createHelperWithDefault("border-t");
  var borderR = createHelperWithDefault("border-r");
  var borderB = createHelperWithDefault("border-b");
  var borderL = createHelperWithDefault("border-l");
  var borderX = createHelperWithDefault("border-x");
  var borderY = createHelperWithDefault("border-y");
  var rounded = (v) => v === "full" ? "rounded-full" : `rounded-${v}`;
  var shadow = (v) => `shadow-${safeClamp(safeParseInt(v, 3), 1, 10)}`;
  var opacity = (v) => `opacity-${safeClamp(safeParseInt(v, 100), 0, 100)}`;
  var bg = (c, s, o) => o !== void 0 ? `bg-${c}-${s}/${o}` : `bg-${c}-${s}`;
  var text = (c, s, o) => o !== void 0 ? `text-${c}-${s}/${o}` : `text-${c}-${s}`;
  var grid = (cols, rows, gap) => `grid-${cols}x${rows}-${gap}`;
  var autoGrid = (minWidth, gap) => `auto-grid-${minWidth}-${gap}`;
  var span = (n) => `span-${safeClamp(safeParseInt(n, 1), 1, 12)}`;
  var row = (n) => `row-${safeClamp(safeParseInt(n, 1), 1, 6)}`;
  var bgFill = (direction, color, shade, duration) => `bg-fill-${direction}-${color}-${shade}-${duration}${typeof duration === "number" && duration < 1e3 ? "ms" : "ms"}`;
  var btn = {
    base: "btn",
    sm: "btn btn-sm",
    md: "btn btn-md",
    lg: "btn btn-lg",
    primary: "btn btn-primary",
    secondary: "btn btn-secondary",
    success: "btn btn-success",
    danger: "btn btn-danger",
    warning: "btn btn-warning",
    outline: "btn btn-outline",
    ghost: "btn btn-ghost",
    glow: "btn btn-glow"
  };
  var input = {
    base: "input",
    sm: "input input-sm",
    md: "input input-md",
    lg: "input input-lg",
    error: "input input-error",
    success: "input input-success"
  };
  var card = {
    base: "card",
    hover: "card card-hover",
    click: "card card-click card-hover",
    glass: "card card-glass"
  };
  var gradient = (fromColor, fromShade, toColor, toShade) => `gradient-${fromColor}-${fromShade}-${toColor}-${toShade}`;
  var gradientAngle = (angle, fromColor, fromShade, toColor, toShade) => `gradient-${angle}deg-${fromColor}-${fromShade}-${toColor}-${toShade}`;
  var gradientVertical = (fromColor, fromShade, toColor, toShade) => `gradient-vert-${fromColor}-${fromShade}-${toColor}-${toShade}`;
  var gradientHorizontal = (fromColor, fromShade, toColor, toShade) => `gradient-horiz-${fromColor}-${fromShade}-${toColor}-${toShade}`;
  var gradientRadial = (fromColor, fromShade, toColor, toShade) => `gradient-radial-${fromColor}-${fromShade}-${toColor}-${toShade}`;
  var gradientTriple = (c1, s1, c2, s2, c3, s3) => `gradient-${c1}-${s1}-${c2}-${s2}-${c3}-${s3}`;
  var animate = (prop, from, to, duration, infinite) => `${prop}-${from}-${to}-${duration}${typeof duration === "number" && duration < 1e3 ? "ms" : "ms"}${infinite ? "-infinite" : ""}`;
  var widthAnim = (from, to, duration, infinite) => animate("w", from, to, duration, infinite);
  var heightAnim = (from, to, duration, infinite) => animate("h", from, to, duration, infinite);
  var paddingAnim = (from, to, duration, infinite) => animate("p", from, to, duration, infinite);
  var marginAnim = (from, to, duration, infinite) => animate("m", from, to, duration, infinite);
  var bgAnim = (fromColor, fromShade, toColor, toShade, duration, infinite) => `bg-${fromColor}-${fromShade}-${toColor}-${toShade}-${duration}${typeof duration === "number" && duration < 1e3 ? "ms" : "ms"}${infinite ? "-infinite" : ""}`;
  var opacityAnim = (from, to, duration, infinite) => animate("opacity", from, to, duration, infinite);
  var roundedAnim = (from, to, duration, infinite) => animate("rounded", from, to, duration, infinite);
  var scaleAnim = (from, to, duration, infinite) => animate("scale", from, to, duration, infinite);
  var infiniteAnim = (prop, from, to, duration) => animate(prop, from, to, duration, true);
  var clickAnim = (prop, from, to, duration) => `click:${prop}-${from}-${to}-${duration}${typeof duration === "number" && duration < 1e3 ? "ms" : "ms"}`;
  var _clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  var _t = (v, min, max) => (_clamp(v, min, max) - min) / (max - min);
  var _shade = (s, e, t) => Math.floor(s + (e - s) * t);
  var map = {
    linear: (v, min, max, sc, ss, ec, es) => {
      const t = _t(v, min, max);
      return t < 0.5 ? `${sc}-${_shade(ss, es, t * 2)}` : `${ec}-${_shade(ss, es, (t - 0.5) * 2)}`;
    },
    shade: (v, min, max, color, sMin = 0, sMax = 255) => `${color}-${_shade(sMin, sMax, _t(v, min, max))}`,
    fuel: (v, min = 0, max = 100) => {
      const t = _t(v, min, max);
      if (t < 0.33) return `red-${_shade(128, 255, t / 0.33)}`;
      if (t < 0.66) return `orange-${_shade(128, 255, (t - 0.33) / 0.33)}`;
      return `green-${_shade(128, 255, (t - 0.66) / 0.34)}`;
    },
    heat: (v, min = 0, max = 100) => {
      const t = _t(v, min, max);
      if (t < 0.5) return `green-${_shade(255, 128, t * 2)}`;
      return `red-${_shade(128, 255, (t - 0.5) * 2)}`;
    },
    coolWarm: (v, min = 0, max = 100) => {
      const t = _t(v, min, max);
      if (t < 0.5) return `blue-${_shade(128, 255, t * 2)}`;
      return `red-${_shade(128, 255, (t - 0.5) * 2)}`;
    },
    rainbow: (v, min = 0, max = 100) => {
      const t = _t(v, min, max);
      if (t < 0.17) return `red-${_shade(128, 255, t / 0.17)}`;
      if (t < 0.33) return `orange-${_shade(128, 255, (t - 0.17) / 0.16)}`;
      if (t < 0.5) return `yellow-${_shade(128, 255, (t - 0.33) / 0.17)}`;
      if (t < 0.67) return `green-${_shade(128, 255, (t - 0.5) / 0.17)}`;
      if (t < 0.83) return `blue-${_shade(128, 255, (t - 0.67) / 0.16)}`;
      return `purple-${_shade(128, 255, (t - 0.83) / 0.17)}`;
    },
    slider: (v, min, max, colorFn) => ({
      className: `bg-${colorFn(v)}`,
      width: `${_t(v, min, max) * 100}%`
    })
  };
  var dom = new Proxy({}, {
    get: (target, prop) => {
      if (prop === "div") {
        return (props) => {
          const { children, className, ...rest } = props;
          return import_react2.default.createElement("div", { ...rest, className: className || "" }, children);
        };
      }
      if (prop === "button") {
        return (props) => {
          const { children, className, ...rest } = props;
          return import_react2.default.createElement("button", { ...rest, className: className || "" }, children);
        };
      }
      if (prop === "input") {
        return (props) => {
          const { children, className, ...rest } = props;
          return import_react2.default.createElement("input", { ...rest, className: className || "" }, children);
        };
      }
      if (prop === "label") {
        return (props) => {
          const { children, className, ...rest } = props;
          return import_react2.default.createElement("label", { ...rest, className: className || "" }, children);
        };
      }
      if (prop === "h1" || prop === "h2" || prop === "h3" || prop === "h4" || prop === "h5" || prop === "h6") {
        return (props) => {
          const { children, className, ...rest } = props;
          return import_react2.default.createElement(prop, { ...rest, className: className || "" }, children);
        };
      }
      if (prop === "p") {
        return (props) => {
          const { children, className, ...rest } = props;
          return import_react2.default.createElement("p", { ...rest, className: className || "" }, children);
        };
      }
      if (prop === "span") {
        return (props) => {
          const { children, className, ...rest } = props;
          return import_react2.default.createElement("span", { ...rest, className: className || "" }, children);
        };
      }
      return (props) => {
        const { children, className, ...rest } = props;
        return import_react2.default.createElement(prop, { ...rest, className: className || "" }, children);
      };
    }
  });
  var UB = {
    ub,
    p,
    m,
    pl,
    pr,
    ml,
    mr,
    pt,
    pb,
    mt,
    mb,
    w,
    h,
    scale,
    border,
    borderT,
    borderR,
    borderB,
    borderL,
    borderX,
    borderY,
    rounded,
    shadow,
    opacity,
    bg,
    text,
    grid,
    autoGrid,
    span,
    row,
    gradient,
    gradientAngle,
    gradientVertical,
    gradientHorizontal,
    gradientRadial,
    gradientTriple,
    animate,
    widthAnim,
    heightAnim,
    paddingAnim,
    marginAnim,
    bgAnim,
    opacityAnim,
    roundedAnim,
    scaleAnim,
    infiniteAnim,
    clickAnim,
    bgFill,
    btn,
    input,
    card,
    map,
    useDirection,
    useResponsive,
    useDeviceScale,
    oklch,
    debug: debugUB,
    dom,
    version: "v19.0.3"
  };
  var ub_default = UB;
  return __toCommonJS(ub_exports);
})();
