// src/framework/ub.js
// 🐬 Universal Utility Brain - Main Dispatcher
// Modular Architecture: ubColors + ubParser + ubWebEngine

'use strict';

const ubColors = require('./ub/ubColors');
const ubParser = require('./ub/ubParser');
const ubWebEngine = require('./ub/ubWebEngine');

module.exports = {
    // Color system
    getOKLCH: ubColors.getOKLCH,
    oklch: ubColors.getOKLCH,
    getColor: ubColors.getColor,
    getShade: ubColors.getShade,
    normalizeShade: ubColors.normalizeShade,
    normalizeGradient: ubColors.normalizeGradient,
    resolveColorToHex: ubColors.resolveColorToHex,
    applyOpacity: ubColors.applyOpacity,
    getTextColorForBg: ubColors.getTextColorForBg,
    getTextColorForGradient: ubColors.getTextColorForGradient,

    // Gradient builders
    buildGradient: ubColors.buildGradient,
    buildGradientCSS: ubColors.buildGradientCSS,
    buildGradientRadialCSS: ubColors.buildGradientRadialCSS,

    // Class → style
    classesToStyle: ubParser.parseClass,
    parseClass: ubParser.parseClass,
    getTagDefaults: (tag) => {
        const t = (tag || '').toLowerCase();
        const map = {
            'div': { display: 'block' },
            'span': { display: 'inline' },
            'p': { display: 'block', marginTop: '0.5rem', marginBottom: '0.5rem' },
            'h1': { display: 'block', fontSize: '2rem', fontWeight: 'bold', lineHeight: '1.2' },
            'h2': { display: 'block', fontSize: '1.5rem', fontWeight: 'bold', lineHeight: '1.25' },
            'h3': { display: 'block', fontSize: '1.25rem', fontWeight: 'bold', lineHeight: '1.3' },
            'h4': { display: 'block', fontSize: '1.125rem', fontWeight: 'bold', lineHeight: '1.4' },
            'h5': { display: 'block', fontSize: '1rem', fontWeight: 'bold', lineHeight: '1.4' },
            'h6': { display: 'block', fontSize: '0.875rem', fontWeight: 'bold', lineHeight: '1.5' },
            'button': { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', padding: '10px 16px', borderRadius: '8px' },
            'input': { display: 'block', width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', outline: 'none', fontSize: '14px', boxSizing: 'border-box' },
        };
        return map[t] || {};
    },

    // Spacing
    parseSpacing: ubParser.parseSpacing,
    px: ubParser.px,
    gapPx: ubParser.gapPx,
    borderPx: ubParser.borderPx,

    // Animation
    packAnimation: ubParser.packAnimation,
    KEYFRAMES: ubParser.KEYFRAMES,
    ANIMATION_STYLE_MAP: ubParser.ANIMATION_STYLE_MAP,
    injectKeyframes: ubParser.injectKeyframes,
    applyClasses: (element, classList) => {
        if (!element || !classList) return;
        if (typeof document !== 'undefined') ubParser.injectKeyframes();
        const styles = ubParser.parseClass(classList);
        Object.assign(element.style, styles);
    },

    // Web CSS injection
    inject: ubWebEngine.ubInject,
    ubInject: ubWebEngine.ubInject,
    debugUB: ubWebEngine.debugUB,
    clearUBCache: ubWebEngine.clearUBCache,
    LRUCache: ubWebEngine.LRUCache,

    // React hooks
    useDirection: ubWebEngine.useDirection,
    useResponsive: ubWebEngine.useResponsive,
    useDeviceScale: ubWebEngine.useDeviceScale,

    // Utility
    createHelper: (prefix) => (v) => `${prefix}-${v}`,

    // Maps / constants
    FLEX_MAP: ubParser.FLEX_MAP,
    SHADOW_SCALES: ubParser.SHADOW_SCALES,
    BUTTON_STYLES: ubParser.BUTTON_STYLES,
    INPUT_STYLES: ubParser.INPUT_STYLES,
    CARD_STYLES: ubParser.CARD_STYLES,
    BASE_COLORS: ubColors.BASE_COLORS,
    COLOR_INDEX_MAP: ubColors.COLOR_INDEX_MAP,
    ROUNDED_MAP: ubColors.ROUNDED_MAP,

    // IoT helpers
    map: ubWebEngine.map,

    // 24-byte Helpers
    getColorIndex: ubParser.getColorIndex,
    getRadiusExtended: ubParser.getRadiusExtended,
    getZIndex: ubParser.getZIndex,
    parseWidth: ubParser.parseWidth,
    parseHeight: ubParser.parseHeight,
    parseTW: ubParser.parseTW,

    // Variant builders
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

    version: 'v19.0.3-24byte-css-modular',
};