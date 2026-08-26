// src/framework/ub/ubWebEngine.js
// 🐬 Web Style Injector, LRU Cache & React Hooks

'use strict';

const { COLOR_CACHE } = require('./ubColors');
const { parseClass } = require('./ubParser');

const _isWeb = typeof document !== 'undefined';

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

    inject(classes) {
        if (!_isWeb || !classes) return classes;
        this.totalRequests++;

        if (!this._glowAdded) {
            this._addKeyframe('btn-glow-pulse', '@keyframes btn-glow-pulse { 0%,100% { box-shadow:0 0 5px rgba(59,130,246,0.5); } 50% { box-shadow:0 0 20px rgba(59,130,246,0.8); } }');
            this._glowAdded = true;
        }

        const results = [];
        const parts = classes.split(/\s+/).filter(Boolean);

        for (const cls of parts) {
            if (cls.startsWith('ub-')) { results.push(cls); continue; }

            const cached = this._classCache.get(cls);
            if (cached !== undefined) { this.cacheHits++; results.push(cached); continue; }

            const parsed = parseClass(cls, this.darkMode);
            if (parsed && Object.keys(parsed).length > 0) {
                const className = `ub-${_simpleHash(cls)}`;
                const cssProps = Object.entries(parsed).map(([k, v]) => {
                    const prop = k.replace(/([A-Z])/g, c => `-${c.toLowerCase()}`);
                    return `${prop}: ${v};`;
                });
                const ruleText = `.${className} { ${cssProps.join('; ')} }`;
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
}

function _simpleHash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = (h * 0x01000193) >>> 0;
    }
    return Math.abs(h).toString(36).substring(0, 12);
}

let _engineInstance = null;
function _getEngine() {
    if (!_engineInstance) {
        _engineInstance = new _WebStyleEngine();
    }
    return _engineInstance;
}

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

// ─── REACT HOOKS ──────────────────────────────────────────────────────────────
let _useState, _useEffect;
try {
    const React = require('react');
    _useState = React.useState;
    _useEffect = React.useEffect;
} catch (e) {
    _useState = null;
    _useEffect = null;
}

function useDirection() {
    if (!_useState) throw new Error('useDirection requires React');
    const [dir, setDir] = _useState('ltr');
    _useEffect(() => {
        if (_isWeb) document.documentElement.setAttribute('dir', dir);
    }, [dir]);
    const toggle = () => setDir(d => d === 'ltr' ? 'rtl' : 'ltr');
    return { direction: dir, toggleDirection: toggle };
}

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

// ─── IOT HELPERS ──────────────────────────────────────────────────────────────
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

module.exports = {
    LRUCache,
    ubInject,
    debugUB,
    clearUBCache,
    useDirection,
    useResponsive,
    useDeviceScale,
    map,
};
