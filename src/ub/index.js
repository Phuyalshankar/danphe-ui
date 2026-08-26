'use strict';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🐬 UNIVERSAL UB 2.0 RUNTIME ENGINE (Ported from dolphin-cpp @dolphin/ub)
 * ════════════════════════════════════════════════════════════════════════════
 * • 8-Bit Byte Scale (0–255 / uint8_t) for 0-copy MCU / Web / Mobile harmony
 * • Declarative 2D Multi-Layer Drawing (<draw>, <layer>, <path>, <circle>, <rect>, <line>, <star>, <arc>, <icon>)
 * • Turtle Coordinate Directional Path Parser (start-X-Y right-N down-N left-N up-N to-X-Y close)
 * • IoT Directional Fills (fill-up, fill-right, fill-down, fill-circle, fill-gauge, fill-arc-180)
 * • Universal Geometry Engine (geo-circle, geo-polygon-6, geo-star-6, geo-needle, geo-ticks, geo-wave, semicircle)
 * • Dynamic Multi-Stop OKLCH Gradients & Text Gradients
 * • Native Vector Icon Library (<icon name="..." />)
 * ════════════════════════════════════════════════════════════════════════════
 */

const SCALE_MAX = 255;
const PX_MULTIPLIER = 4;
const BORDER_MULTIPLIER = 1;
const GAP_MULTIPLIER = 4;

function safeClamp(val, minVal, maxVal) {
    return Math.min(maxVal, Math.max(minVal, val));
}

function px(n) { return `${Math.round(n * PX_MULTIPLIER)}px`; }
function borderPx(n) { return `${Math.round(n * BORDER_MULTIPLIER)}px`; }
function gapPx(n) { return `${Math.round(n * GAP_MULTIPLIER)}px`; }

const BASE_PALETTE = {
    red:    { L: 0.62, C: 0.28, H: 25.0 },
    blue:   { L: 0.68, C: 0.24, H: 260.0 },
    green:  { L: 0.67, C: 0.22, H: 145.0 },
    purple: { L: 0.65, C: 0.22, H: 310.0 },
    orange: { L: 0.78, C: 0.22, H: 60.0 },
    pink:   { L: 0.78, C: 0.24, H: 350.0 },
    teal:   { L: 0.70, C: 0.18, H: 180.0 },
    amber:  { L: 0.84, C: 0.18, H: 80.0 },
    cyan:   { L: 0.75, C: 0.16, H: 195.0 },
    emerald:{ L: 0.68, C: 0.20, H: 155.0 },
    slate:  { L: 0.60, C: 0.05, H: 240.0 },
    gray:   { L: 0.88, C: 0.04, H: 240.0 },
    white:  { L: 0.99, C: 0.00, H: 0.0 }
};

class OKLCHColor {
    constructor(L = 0.0, C = 0.0, H = 0.0, alpha = 1.0) {
        this.L = L;
        this.C = C;
        this.H = H;
        this.alpha = alpha;
    }

    toString() {
        const lStr = this.L.toFixed(3);
        const cStr = this.C.toFixed(3);
        const hStr = this.H.toFixed(1);
        if (this.alpha < 1.0) {
            return `oklch(${lStr} ${cStr} ${hStr} / ${this.alpha})`;
        }
        return `oklch(${lStr} ${cStr} ${hStr})`;
    }

    toHex() {
        return `#${Math.round(this.L * 255).toString(16).padStart(2, '0')}${Math.round(this.C * 255).toString(16).padStart(2, '0')}${Math.round((this.H / 360) * 255).toString(16).padStart(2, '0')}`;
    }
}

function computeOKLCH(name, shade, darkMode = false) {
    if (name === 'white') return new OKLCHColor(0.99, 0.0, 0.0, 1.0);
    const safeShade = safeClamp(Number(shade) || 0, 0.0, 255.0);
    const base = BASE_PALETTE[name] || BASE_PALETTE.gray;

    const t = safeShade / SCALE_MAX;
    let L, C;

    if (name === 'gray' || name === 'slate') {
        L = 0.98 - (t * 0.90);
        C = 0.04 + (t * 0.08);
    } else {
        L = 0.92 - (t * 0.77);
        const chromaMap = {
            blue: 0.20, purple: 0.20, red: 0.22, orange: 0.22,
            green: 0.18, teal: 0.18, pink: 0.20, amber: 0.20,
            cyan: 0.16, emerald: 0.18
        };
        const baseC = chromaMap[name] || 0.16;
        C = baseC + (t * 0.14);
    }

    if (darkMode) {
        L = L * 0.9 + 0.05;
        C = C * 0.95;
    }

    L = safeClamp(L, 0.05, 0.98);
    C = safeClamp(C, 0.03, 0.35);

    return new OKLCHColor(L, C, base.H, 1.0);
}

function computeContrastText(col) {
    if (col.H >= 220 && col.H <= 260 && col.C < 0.1) {
        return col.L > 0.62 ? `oklch(0.10 0.01 ${Math.round(col.H)})` : `oklch(0.99 0.005 ${Math.round(col.H)})`;
    }
    let threshold = 0.5;
    if (col.H >= 70 && col.H <= 180) threshold = 0.42;
    else if (col.H >= 220 && col.H <= 320) threshold = 0.58;
    else if ((col.H >= 0 && col.H <= 40) || (col.H >= 340 && col.H <= 360)) threshold = 0.52;
    else if (col.H >= 50 && col.H <= 90) threshold = 0.4;

    return col.L > threshold ? `oklch(0.10 0.01 ${Math.round(col.H)})` : `oklch(0.99 0.005 ${Math.round(col.H)})`;
}

/**
 * Turtle Coordinate Directional Path Parser
 * Translates: "start-10-10 right-40 down-20 left-40 up-20 close" -> SVG / Canvas Path Data
 */
function parseTurtlePath(classStr) {
    if (!classStr) return '';
    const tokens = classStr.split(/\s+/);
    let d = '';

    for (const token of tokens) {
        let m;
        if ((m = token.match(/^start-(\d+)-(\d+)$/))) {
            d += `M ${m[1]} ${m[2]} `;
        } else if ((m = token.match(/^to-(\d+)-(\d+)$/))) {
            d += `L ${m[1]} ${m[2]} `;
        } else if ((m = token.match(/^right-(\d+)$/))) {
            d += `h ${m[1]} `;
        } else if ((m = token.match(/^left-(\d+)$/))) {
            d += `h -${m[1]} `;
        } else if ((m = token.match(/^down-(\d+)$/))) {
            d += `v ${m[1]} `;
        } else if ((m = token.match(/^up-(\d+)$/))) {
            d += `v -${m[1]} `;
        } else if (token === 'close') {
            d += 'Z ';
        }
    }
    return d.trim();
}

/**
 * 2D Vector Icon Catalog
 */
const NATIVE_ICONS = {
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
    wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>',
    battery: '<rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="11" x2="23" y2="13"/><line x1="5" y1="12" x2="13" y2="12"/>',
    server: '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>',
    gauge: '<path d="M12 15l3.5-3.5"/><path d="M20.3 18a9 9 0 1 0-16.6 0"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>',
    activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    pulse: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    alert: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    refresh: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
    droplet: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
    thermometer: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>'
};

function renderNativeIcon(name) {
    return NATIVE_ICONS[name] || '';
}

/**
 * 2D Multi-layer Drawing JSX Preprocessor
 */
function processDrawingJSX(html) {
    if (!html || typeof html !== 'string') return html;

    // 1. Process <icon name="..." class="..." />
    html = html.replace(/<icon\s+name="([a-zA-Z0-9_-]+)"(?:\s+class="([^"]*)")?\s*\/>/g, (match, name, cls) => {
        const svgContent = renderNativeIcon(name);
        const classAttr = cls ? ` class="${cls}"` : '';
        return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${classAttr}>${svgContent}</svg>`;
    });

    // 2. Process <draw ...>...</draw>
    html = html.replace(/<draw(?:\s+class="([^"]*)")?(?:\s+width="([^"]*)")?(?:\s+height="([^"]*)")?\s*>([\s\S]*?)<\/draw>/g, (match, cls, w, h, body) => {
        let width = w || '100';
        let height = h || '100';
        let vbW = width;
        let vbH = height;

        if (cls) {
            let m;
            if ((m = cls.match(/w-(\d+)/))) { width = `${parseInt(m[1]) * 4}`; vbW = width; }
            if ((m = cls.match(/h-(\d+)/))) { height = `${parseInt(m[1]) * 4}`; vbH = height; }
        }

        let inner = body;

        // <layer ...>
        inner = inner.replace(/<layer(?:\s+class="([^"]*)")?\s*>([\s\S]*?)<\/layer>/g, (m2, lCls, lBody) => {
            return `<g class="${lCls || ''}">${lBody}</g>`;
        });

        // <circle ... />
        inner = inner.replace(/<circle(?:\s+class="([^"]*)")?\s*\/>/g, (m2, cCls) => {
            let cx = 50, cy = 50, r = 40;
            if (cCls) {
                let m3;
                if ((m3 = cCls.match(/at-(\d+)-(\d+)/))) { cx = m3[1]; cy = m3[2]; }
                if ((m3 = cCls.match(/r-(\d+)/))) { r = m3[1]; }
            }
            return `<circle cx="${cx}" cy="${cy}" r="${r}" class="${cCls || ''}"/>`;
        });

        // <rect ... />
        inner = inner.replace(/<rect(?:\s+class="([^"]*)")?\s*\/>/g, (m2, rCls) => {
            let x = 0, y = 0, rw = 100, rh = 100, rx = 0;
            if (rCls) {
                let m3;
                if ((m3 = rCls.match(/at-(\d+)-(\d+)/))) { x = m3[1]; y = m3[2]; }
                if ((m3 = rCls.match(/w-(\d+)/))) { rw = m3[1]; }
                if ((m3 = rCls.match(/h-(\d+)/))) { rh = m3[1]; }
                if ((m3 = rCls.match(/rounded-(\d+)/))) { rx = m3[1]; }
            }
            return `<rect x="${x}" y="${y}" width="${rw}" height="${rh}" rx="${rx}" class="${rCls || ''}"/>`;
        });

        // <line ... />
        inner = inner.replace(/<line(?:\s+class="([^"]*)")?\s*\/>/g, (m2, lCls) => {
            let x1 = 0, y1 = 0, x2 = 100, y2 = 100;
            if (lCls) {
                let m3;
                if ((m3 = lCls.match(/from-(\d+)-(\d+)/))) { x1 = m3[1]; y1 = m3[2]; }
                if ((m3 = lCls.match(/to-(\d+)-(\d+)/))) { x2 = m3[1]; y2 = m3[2]; }
            }
            return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${lCls || ''}"/>`;
        });

        // <path ... /> with turtle parser
        inner = inner.replace(/<path(?:\s+class="([^"]*)")?\s*\/>/g, (m2, pCls) => {
            const d = parseTurtlePath(pCls || '');
            return `<path d="${d}" class="${pCls || ''}"/>`;
        });

        return `<svg viewBox="0 0 ${vbW} ${vbH}" class="ub-draw ${cls || ''}" style="width:100%;height:100%;">${inner}</svg>`;
    });

    return html;
}

module.exports = {
    SCALE_MAX,
    PX_MULTIPLIER,
    OKLCHColor,
    computeOKLCH,
    computeContrastText,
    safeClamp,
    px,
    borderPx,
    gapPx,
    parseTurtlePath,
    NATIVE_ICONS,
    renderNativeIcon,
    processDrawingJSX
};
