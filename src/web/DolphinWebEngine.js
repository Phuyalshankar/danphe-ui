'use strict';

const path = require('path');
const fs = require('fs');

/**
 * DolphinWebEngine — Smart Universal Dual-Target Web & SEO Engine
 * Renders Dolphin Native JSX pages into Semantic HTML5 with 100% Google SEO indexing
 * without touching or polluting the mobile Titan C++/Kotlin binary engine.
 */
class DolphinWebEngine {
    constructor() {
        this.ub = null;
        try {
            this.ub = require('../framework/ub');
        } catch (e) {
            this.ub = null;
        }
    }

    /**
     * Converts a Dolphin Native Component VNode into Semantic HTML5 with NanoStore State Resolution
     */
    vnodeToHTML(vnode, stateMap = {}) {
        // Target filtering for Web Engine: skip mobile-only elements
        const rawTarget = vnode ? (vnode.target || (vnode.props && vnode.props.target) || (vnode.attributes && vnode.attributes.target)) : '';
        const vnodeTarget = String(rawTarget || '').toLowerCase();
        if (vnodeTarget === 'mobile' || vnodeTarget === 'android' || vnodeTarget === 'ios' || vnodeTarget === 'phone') {
            return '';
        }

        if (typeof vnode === 'function') {
            try {
                return this.vnodeToHTML(vnode(), stateMap);
            } catch (e) {
                return '';
            }
        }
        if (vnode && typeof vnode.type === 'function') {
            try {
                return this.vnodeToHTML(vnode.type(vnode.props || {}), stateMap);
            } catch (e) {
                return '';
            }
        }
        if (vnode && typeof vnode.tag === 'function') {
            try {
                return this.vnodeToHTML(vnode.tag(vnode.props || {}), stateMap);
            } catch (e) {
                return '';
            }
        }
        if (typeof vnode === 'string' || typeof vnode === 'number') {
            let str = String(vnode);
            if (str.startsWith('[stateKey:') && str.endsWith(']')) {
                const stateKey = str.substring(10, str.length - 1);
                const resolvedVal = stateMap[stateKey] !== undefined ? stateMap[stateKey] : '';
                return this._escapeHTML(String(resolvedVal));
            }
            return this._escapeHTML(str);
        }
        if (Array.isArray(vnode)) {
            return vnode.map(child => this.vnodeToHTML(child, stateMap)).join('');
        }
        // Handle Fragment nodes
        if (vnode.type === 'fragment') {
            return (vnode.children || []).map(c => this.vnodeToHTML(c, stateMap)).join('');
        }

        // Handle HTML AST text node ({ type: 'text', value: '...' })
        if (vnode.type === 'text' || (vnode.value !== undefined && !vnode.tag && !vnode.children)) {
            const val = String(vnode.value || '').trim();
            if (!val || val.startsWith('{/*') || val.startsWith('//')) return '';
            if (val.startsWith('[stateKey:') && val.endsWith(']')) {
                const stateKey = val.substring(10, val.length - 1);
                const resolvedVal = stateMap[stateKey] !== undefined ? stateMap[stateKey] : '';
                return this._escapeHTML(String(resolvedVal));
            }
            return this._escapeHTML(val);
        }

        // Normalize attributes: merge vnode.props and case-insensitive vnode.attributes
        const rawAttrs = vnode.attributes || {};
        const normAttrs = {};
        Object.keys(rawAttrs).forEach(k => {
            normAttrs[k.toLowerCase()] = rawAttrs[k];
        });

        const props = { ...normAttrs, ...(vnode.props || {}) };
        if (normAttrs.class && !props.className) props.className = normAttrs.class;

        // PLATFORM FILTERING: If tag is marked for target="mobile" or target="android", skip for Web HTML!
        const attrTarget = props.target || props.platform || '';
        if (attrTarget === 'mobile' || attrTarget === 'android') {
            return '';
        }

        const children = props.children || vnode.children || [];

        // Determine HTML tag
        let rawTag = (vnode.type && vnode.type !== 'element' && vnode.type !== 'fragment')
            ? vnode.type
            : (vnode.tag || props.tag || 'div');
        if (typeof rawTag !== 'string') rawTag = 'div';
        rawTag = rawTag.toLowerCase();

        const tagMap = {
            'screen': 'main',
            'screencontainer': 'main',
            'text': 'p',
            'heading': 'h1',
            'title': 'h2',
            'subtitle': 'h3',
            'button': 'button',
            'image': 'img',
            'input': 'input',
            'row': 'div',
            'column': 'div',
            'stack': 'div',
            'card': 'article',
            'header': 'header',
            'footer': 'footer',
            'sidebar': 'aside',
            'nav': 'nav'
        };

        const htmlTag = tagMap[rawTag] || rawTag || 'div';

        // Build HTML attributes
        const attrs = [];
        if (props.id) attrs.push(`id="${this._escapeHTML(props.id)}"`);
        if (props.className) {
            const webClasses = String(props.className).replace(/\[(.*?)\]/g, '$1').replace(/\s+/g, ' ').trim();
            attrs.push(`class="${this._escapeHTML(webClasses)}"`);
        }

        // 🐬 Direct Inline Utility Style Generator (Guarantees 100% offline & local file:// styling)
        let inlineStyle = this._classNameToStyle(props.className);
        if (props.style) {
            if (typeof props.style === 'string') {
                inlineStyle = inlineStyle ? `${inlineStyle};${props.style}` : props.style;
            } else if (typeof props.style === 'object') {
                const objStyle = Object.keys(props.style).map(k => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${props.style[k]}`).join(';');
                inlineStyle = inlineStyle ? `${inlineStyle};${objStyle}` : objStyle;
            }
        }

        if (props.action) attrs.push(`data-action="${this._escapeHTML(props.action)}"`);
        
        let extractedStateKey = props.statekey || props.stateKey || null;
        if (!extractedStateKey) {
            const _childStr = typeof children === 'string' ? children
                : (Array.isArray(children) && children.length === 1 && typeof children[0] === 'string') ? children[0]
                : (Array.isArray(children) && children.length === 1 && children[0] && children[0].value) ? children[0].value
                : null;
            if (_childStr && typeof _childStr === 'string' && _childStr.trim().startsWith('[stateKey:') && _childStr.trim().endsWith(']')) {
                const trimmed = _childStr.trim();
                extractedStateKey = trimmed.substring(10, trimmed.length - 1);
            }
        }
        if (extractedStateKey) attrs.push(`data-state-key="${this._escapeHTML(extractedStateKey)}"`);
        if (props.src) attrs.push(`src="${this._escapeHTML(props.src)}"`);
        if (props.alt) attrs.push(`alt="${this._escapeHTML(props.alt)}"`);
        if (props.placeholder) attrs.push(`placeholder="${this._escapeHTML(props.placeholder)}"`);
        if (props.href) attrs.push(`href="${this._escapeHTML(props.href)}"`);

        // Pass-through SVG & Custom HTML attributes (viewBox, d, stroke, fill, cx, cy, r, x1, y1, etc.)
        const reservedProps = ['id', 'className', 'class', 'action', 'stateKey', 'statekey', 'src', 'alt', 'placeholder', 'href', 'style', 'children', 'target', 'platform', 'type', 'value', 'inputType'];
        Object.keys(props).forEach(key => {
            if (!reservedProps.includes(key) && typeof props[key] !== 'object' && typeof props[key] !== 'function') {
                const attrName = key === 'viewBox' ? 'viewBox' : key.replace(/([A-Z])/g, '-$1').toLowerCase();
                attrs.push(`${attrName}="${this._escapeHTML(String(props[key]))}"`);
            }
        });

        // ── Input-specific attributes ──────────────────────────────────────────
        if (htmlTag === 'input') {
            const inputType = props.type || 'text';
            attrs.push(`type="${this._escapeHTML(inputType)}"`);
            if (extractedStateKey) attrs.push(`name="${this._escapeHTML(extractedStateKey)}"`);
            const initVal = extractedStateKey && stateMap[extractedStateKey] !== undefined
                ? stateMap[extractedStateKey] : (props.value || props.defaultValue || '');
            if (initVal) attrs.push(`value="${this._escapeHTML(String(initVal))}"`);
            const inputStyle = `pointer-events:auto;cursor:text;${inlineStyle}`;
            attrs.push(`style="${this._escapeHTML(inputStyle)}"`);
        } else if (inlineStyle) {
            attrs.push(`style="${this._escapeHTML(inlineStyle)}"`);
        }

        const attrString = attrs.length > 0 ? ' ' + attrs.join(' ') : '';

        // Self-closing tags
        if (['img', 'input', 'br', 'hr', 'meta', 'link'].includes(htmlTag)) {
            return `<${htmlTag}${attrString} />`;
        }

        // Render Children
        let innerHTML = '';
        if (typeof children === 'string' || typeof children === 'number') {
            let str = String(children);
            if (str.startsWith('[stateKey:') && str.endsWith(']')) {
                const key = str.substring(10, str.length - 1);
                const val = stateMap[key] !== undefined ? stateMap[key] : '';
                innerHTML = this._escapeHTML(String(val));
            } else {
                innerHTML = this._escapeHTML(str);
            }
        } else if (Array.isArray(children)) {
            innerHTML = children.map(c => this.vnodeToHTML(c, stateMap)).join('');
        } else if (children) {
            innerHTML = this.vnodeToHTML(children, stateMap);
        }

        // ── Button Icon Injection (web) ──────────────────────────────────────────
        // If this is a button with an icon prop, prepend a <i class="fa-solid fa-[name]"> element
        if (htmlTag === 'button') {
            const iconName = props.icon || props.iconName || props.iconLeft || '';
            if (iconName) {
                // Strip 'fa-' prefix if already included, then normalize
                const normalized = iconName.replace(/^fa-/, '').toLowerCase().trim();
                // Map common icon aliases used in Dolphin Native to FA names
                const iconAliasMap = {
                    'check': 'check', 'rotate': 'rotate-right', 'refresh': 'rotate-right',
                    'reset': 'rotate-left', 'send': 'paper-plane', 'search': 'magnifying-glass',
                    'home': 'house', 'settings': 'gear', 'close': 'xmark', 'cancel': 'xmark',
                    'delete': 'trash', 'edit': 'pen', 'add': 'plus', 'plus': 'plus',
                    'minus': 'minus', 'info': 'circle-info', 'warning': 'triangle-exclamation',
                    'error': 'circle-xmark', 'success': 'circle-check', 'user': 'user',
                    'login': 'right-to-bracket', 'logout': 'right-from-bracket',
                    'arrow-right': 'arrow-right', 'arrow-left': 'arrow-left',
                    'arrow-up': 'arrow-up', 'arrow-down': 'arrow-down',
                    'menu': 'bars', 'list': 'list', 'filter': 'filter',
                    'star': 'star', 'heart': 'heart', 'bell': 'bell',
                    'lock': 'lock', 'unlock': 'lock-open', 'eye': 'eye', 'eye-off': 'eye-slash',
                    'download': 'download', 'upload': 'upload', 'link': 'link',
                    'copy': 'copy', 'save': 'floppy-disk', 'print': 'print',
                    'share': 'share-nodes', 'mail': 'envelope', 'phone': 'phone',
                    'location': 'location-dot', 'map': 'map', 'calendar': 'calendar',
                    'clock': 'clock', 'camera': 'camera', 'image': 'image',
                };
                const faName = iconAliasMap[normalized] || normalized;
                const iconGap = innerHTML ? ' ' : '';
                innerHTML = `<i class="fa-solid fa-${faName}" style="margin-right:${innerHTML ? '6px' : '0'};"></i>${iconGap}${innerHTML}`;
            }
        }

        return `<${htmlTag}${attrString}>${innerHTML}</${htmlTag}>`;
    }

    /**
     * Generates a complete SEO-Ready HTML5 Document with Head Meta Tags & Interactive NanoStore Scripts
     */
    renderToWebHTML(pageVNode, seoConfig = {}, initialState = {}, localCdnPaths = {}) {
        const title = seoConfig.title || 'Dolphin Native Web Application';
        const description = seoConfig.description || 'Built with Dolphin Native Universal Architecture';
        const keywords = seoConfig.keywords || 'dolphin-native, web, mobile, seo, nanostore';
        const author = seoConfig.author || 'Dolphin Native Team';
        const ogImage = seoConfig.ogImage || '';
        const canonicalUrl = seoConfig.canonicalUrl || '';

        const bodyHTML = this.vnodeToHTML(pageVNode, initialState);

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this._escapeHTML(title)}</title>
    <meta name="description" content="${this._escapeHTML(description)}">
    <meta name="keywords" content="${this._escapeHTML(keywords)}">
    <meta name="author" content="${this._escapeHTML(author)}">
    
    <!-- OpenGraph SEO Tags -->
    <meta property="og:title" content="${this._escapeHTML(title)}">
    <meta property="og:description" content="${this._escapeHTML(description)}">
    <meta property="og:type" content="website">
    ${ogImage ? `<meta property="og:image" content="${this._escapeHTML(ogImage)}">` : ''}
    ${canonicalUrl ? `<link rel="canonical" href="${this._escapeHTML(canonicalUrl)}">` : ''}

    <!-- Fonts, Icons & Tailwind CSS Web Engine -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300..900;1,14..32,300..900&display=swap" rel="stylesheet">
    
    <!-- 100% Offline Local Assets Support (icons from assets/icons/) -->
    <link rel="stylesheet" href="./assets/icons/icons.css" />
    <style>
        @font-face {
            font-family: 'Font Awesome 6 Free';
            font-style: normal;
            font-weight: 900;
            font-display: block;
            src: url('./assets/icons/icon-font.ttf') format('truetype');
        }
        @font-face {
            font-family: 'FontAwesome';
            font-style: normal;
            font-weight: normal;
            font-display: block;
            src: url('./assets/icons/icon-font.ttf') format('truetype');
        }
    </style>

    <!-- 🐬 CDN Assets — served from assets/cdn/ (downloaded at build time, CDN fallback if missing) -->
    <link rel="stylesheet" href="${localCdnPaths['fa-all.min.css'] || 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'}" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="${localCdnPaths['dolphin-css.css'] || 'https://cdn.jsdelivr.net/npm/dolphincss@latest/dolphin-css.css'}" />
    <script src="${localCdnPaths['ub-vanilla.js'] || 'https://cdn.jsdelivr.net/npm/dolphincss@latest/src/ub-vanilla.js'}"></script>
    
    <style>
        /* ============================================
           DOLPHIN WEB ENGINE — UNIVERSAL BRIDGE CSS
           ============================================ */

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
            scroll-behavior: smooth;
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100vh;
        }
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            -webkit-font-smoothing: antialiased;
            background: #0f172a;
            color: #1e293b;
            min-height: 100vh;
        }

        /* 🐬 DOLPHIN NATIVE — DANPHE THEME & GLASSMORPHISM ENGINE */
        .gradient-indigo-240-amber-140, [data-theme="danphe"], .bg-danphe {
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 35%, #312e81 70%, #78350f 100%) !important;
            min-height: 100vh;
        }

        .card {
            background: #ffffff;
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 16px;
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
            padding: 24px;
            box-sizing: border-box;
            width: 100%;
            align-self: stretch;   /* match mobile MATCH_PARENT — stretch regardless of parent align-items */
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
        }

        .dolphin-login, .glass, .fx-glass, .fx-neon, .fx-holo, .fx-float, .fx-aqua, .fx-flare, .fx-cyber, .fx-crystal, .fx-nebula, .fx-metal, .fx-rainbow, .fx-aurora {
            background: rgba(255, 255, 255, 0.22) !important;
            backdrop-filter: blur(24px) saturate(200%);
            -webkit-backdrop-filter: blur(24px) saturate(200%);
            border: 1px solid rgba(255, 255, 255, 0.35) !important;
            box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.5) !important;
            transition: all 0.3s ease;
        }

        [data-theme-mode="dark"] .card, [data-theme-mode="dark"] .dolphin-login, [data-theme-mode="dark"] .glass,
        [data-theme-mode="dark"] .fx-glass, [data-theme-mode="dark"] .fx-neon, [data-theme-mode="dark"] .fx-holo,
        [data-theme-mode="dark"] .fx-float, [data-theme-mode="dark"] .fx-aqua, [data-theme-mode="dark"] .fx-flare,
        [data-theme-mode="dark"] .fx-cyber, [data-theme-mode="dark"] .fx-crystal, [data-theme-mode="dark"] .fx-nebula,
        [data-theme-mode="dark"] .fx-metal, [data-theme-mode="dark"] .fx-rainbow, [data-theme-mode="dark"] .fx-aurora,
        html.dark .card, html.dark .dolphin-login, html.dark .glass, html.dark [class*="fx-"] {
            background: rgba(15, 23, 42, 0.45) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            color: #f8fafc !important;
            box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.15) !important;
        }

        [data-theme-mode="dark"] body, html.dark body {
            background: #090d16 !important;
            color: #f8fafc !important;
        }

        [data-theme-mode="dark"] .text-slate-900, html.dark .text-slate-900, [data-theme-mode="dark"] h2 {
            color: #f8fafc !important;
        }

        [data-theme-mode="dark"] .text-slate-500, html.dark .text-slate-500 {
            color: #94a3b8 !important;
        }

        [data-theme-mode="dark"] .text-slate-700, html.dark .text-slate-700 {
            color: #cbd5e1 !important;
        }

        [data-theme-mode="dark"] .bg-white, html.dark .bg-white {
            background-color: rgba(30, 41, 59, 0.9) !important;
        }

        [data-theme-mode="dark"] input, html.dark input {
            background-color: rgba(15, 23, 42, 0.8) !important;
            color: #f8fafc !important;
            border-color: rgba(255, 255, 255, 0.2) !important;
        }

        /* flex-center: centers content inside — does NOT shrink children width */
        .flex-center {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }
        /* Children inside flex-center stretch to full width (matches mobile MATCH_PARENT).
           Use [max-w-sm], [max-w-md] etc. in className to constrain width on web only. */
        .flex-center > * {
            align-self: stretch;
        }

        /* ---- SCREEN / MAIN CONTAINER ---- */
        main, [type="Screen"], .dw-screen {
            min-height: 100vh;
            width: 100%;
            display: flex;
            flex-direction: column;
        }

        /* ---- VIEWPAGER / HORIZONTAL PAGING ---- */
        [type="ViewPager"], [type="Pager"], .dw-viewpager {
            display: flex !important;
            flex-direction: row !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            scroll-behavior: smooth !important;
            -webkit-overflow-scrolling: touch !important;
            width: 100% !important;
        }
        [type="ViewPager"] > *, [type="Pager"] > *, .dw-viewpager > * {
            scroll-snap-align: start !important;
            flex-shrink: 0 !important;
            width: 100% !important;
        }

        /* ---- BASE ELEMENTS RESET (Non-intrusive for DolphinCSS / Tailwind / Bootstrap) ---- */
        h1, h2, h3, h4, h5, h6, p { margin: 0; }
        input, textarea, select {
            font-family: inherit;
            outline: none;
            box-sizing: border-box;
        }

        /* 🐬 DOLPHIN NATIVE & DOLPHINCSS FLOATING LABEL SYSTEM */
        .floatinglabel, .form-floating {
            position: relative !important;
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
        }

        .floatinglabel-input, .form-floating .form-control, .floatinglabel input {
            width: 100% !important;
            min-height: 3.5rem !important;
            padding: 1.25rem 1rem 0.35rem 1rem !important;
            font-size: 1rem !important;
            border-radius: 0.75rem !important;
            box-sizing: border-box !important;
        }

        .floatinglabel-input.lg {
            min-height: 4rem !important;
            padding-top: 1.5rem !important;
        }

        .floatinglabel-label, .form-floating label {
            position: absolute !important;
            left: 0.85rem !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            pointer-events: none !important;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            transform-origin: 0 0 !important;
            margin: 0 !important;
            padding: 0 4px !important;
            border-radius: 4px !important;
            line-height: 1 !important;
        }

        .floatinglabel-input:focus ~ .floatinglabel-label,
        .floatinglabel-input:not(:placeholder-shown) ~ .floatinglabel-label,
        .form-floating .form-control:focus ~ label,
        .form-floating .form-control:not(:placeholder-shown) ~ label {
            top: 0.45rem !important;
            transform: translateY(0) scale(0.82) !important;
            color: #60a5fa !important;
        }

        /* ---- LAYOUT HELPERS (Dolphin Native JSX Class Mappings) ---- */
        .flex { display: flex; }
        .flex-row { display: flex !important; flex-direction: row !important; }
        .flex-col, .flex-column { display: flex !important; flex-direction: column !important; }
        .flex-col-center { display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; }
        .flex-row-center { display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: center !important; }
        .items-center { align-items: center !important; }
        .justify-center { justify-content: center !important; }
        .justify-between { justify-content: space-between !important; }
        .flex-1 { flex: 1 1 0% !important; align-self: stretch !important; }
        .w-full { width: 100% !important; align-self: stretch !important; }
        .scrollable { overflow-y: auto !important; -webkit-overflow-scrolling: touch !important; }
        .tabbar { position: sticky !important; bottom: 0 !important; left: 0 !important; right: 0 !important; z-index: 50 !important; }

        /* ---- GRID & GAP HELPERS ---- */
        .grid { display: grid !important; }
        .grid-cols-1 { display: grid !important; grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
        .grid-cols-2 { display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        .grid-cols-3 { display: grid !important; grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        .grid-cols-4 { display: grid !important; grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }

        .gap-2 { gap: 8px !important; }
        .gap-3 { gap: 12px !important; }
        .gap-4 { gap: 16px !important; }
        .gap-6 { gap: 24px !important; }
        .gap-8 { gap: 32px !important; }

        @media (min-width: 768px) {
            .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
            .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
            .md\:flex-row { display: flex !important; flex-direction: row !important; }
            .md\:p-8 { padding: 32px !important; }
            .md\:text-5xl { font-size: 48px !important; line-height: 1 !important; }
        }
    </style>
</head>
<body>
    <div id="root">${bodyHTML}</div>

    <!-- Pure Web-Native In-Browser State Engine & Action Router -->
    <script>
      (function() {
        var state = ${JSON.stringify(initialState)};
        var initialState = JSON.parse(JSON.stringify(state));
        var tempTimers = {};

        function updateDOM() {
          var stateElements = document.querySelectorAll('[data-state-key]');
          stateElements.forEach(function(el) {
            var key = el.getAttribute('data-state-key');
            if (key && state[key] !== undefined) {
              if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                if (document.activeElement !== el) {
                  el.value = state[key];
                }
              } else {
                el.textContent = state[key];
              }
            }
          });
        }

        // Live input binding for forms
        document.addEventListener('input', function(e) {
          var el = e.target;
          if (!el) return;
          var key = el.getAttribute('data-state-key') || el.getAttribute('name');
          if (key) {
            state[key] = el.value;
            var targets = document.querySelectorAll('[data-state-key="' + key + '"]');
            targets.forEach(function(t) {
              if (t !== el && t.tagName !== 'INPUT' && t.tagName !== 'TEXTAREA') {
                t.textContent = el.value;
              }
            });
          }
        });

        // Initial DOM update on load and reset scroll to top
        if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
        window.scrollTo(0, 0);
        updateDOM();

        // Handle Web Actions locally (0ms UI latency)
        document.addEventListener('click', function(e) {
          var btn = e.target.closest('[data-action]');
          if (!btn) return;
          var action = btn.getAttribute('data-action');
          if (!action) return;
          e.preventDefault();

          // Navigation Actions for Web: nav:ScreenName
          if (action.indexOf('nav:') === 0) {
            var screenTarget = action.substring(4).trim();
            if (screenTarget) {
              state.activeNav = screenTarget;
              state.activeTab = screenTarget;
              updateDOM();
              window.location.href = screenTarget.toLowerCase() === 'home' ? '/' : '/' + screenTarget.toLowerCase();
              return;
            }
          }

          // Standard & Custom Web Actions
          if (action === 'app.toggleTheme' || action === 'theme:toggle' || action === 'app:toggleTheme' || action === 'theme') {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme-mode', state.theme);
            document.body.setAttribute('data-theme-mode', state.theme);
            document.documentElement.classList.toggle('dark', state.theme === 'dark');
            document.body.classList.toggle('dark', state.theme === 'dark');
            var themeElements = document.querySelectorAll('[data-theme-mode]');
            themeElements.forEach(function(el) {
              el.setAttribute('data-theme-mode', state.theme);
              el.classList.toggle('dark', state.theme === 'dark');
            });
            updateDOM();
            fetch('/api/action', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'app.toggleTheme', value: state.theme })
            }).catch(function(){});
          } else if (action === 'counter:increment' || action === 'counter.increment' || action === 'app.increment') {
            state.counter = (typeof state.counter === 'number' ? state.counter : 0) + 1;
            updateDOM();
          } else if (action === 'app.toggleLogin') {
            state.isLoggedIn = !state.isLoggedIn;
            state.userStatus = state.isLoggedIn ? 'Logged In (Shankar Phuyal) 🔑' : 'Guest User (Logged Out)';
          } else if (action === 'app.showToast') {
            if (tempTimers.notification) clearTimeout(tempTimers.notification);
            state.notification = '⏳ Temporary Toast Active (Auto-reverts in 3s)';
            tempTimers.notification = setTimeout(function() {
              state.notification = initialState.notification || 'Welcome to test-apk NanoStore!';
              updateDOM();
            }, 3000);
          } else if (action === 'app.resetAll') {
            state = JSON.parse(JSON.stringify(initialState));
          } else if (action === 'app.submitForm') {
            if (!state.formName || !state.formEmail || !state.formPhone) {
              state.formStatus = '❌ Please fill all required fields!';
            } else {
              state.formStatus = '✅ Submitted! Name: ' + state.formName + ' | Email: ' + state.formEmail + ' | Phone: ' + state.formPhone;
            }
          } else if (action === 'app.resetForm') {
            state.formName = '';
            state.formEmail = '';
            state.formPhone = '';
            state.formPassword = '';
            state.formStatus = 'Fill the form and submit';
          }

          updateDOM();

          // Sync to backend asynchronously
          fetch('/api/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: action, state: state })
          }).catch(function(err) {});
        });
      })();
    </script>
</body>
</html>`;
    }

    _classNameToStyle(className) {
        if (!className) return '';
        const TW_COLOR_MAP = {
            'orange-50': '#fff7ed', 'orange-100': '#ffedd5', 'orange-200': '#fed7aa', 'orange-300': '#fdba74', 'orange-400': '#fb923c', 'orange-500': '#f97316', 'orange-600': '#ea580c', 'orange-700': '#c2410c', 'orange-800': '#9a3412', 'orange-900': '#7c2d12',
            'red-50': '#fef2f2', 'red-100': '#fee2e2', 'red-200': '#fecaca', 'red-300': '#fca5a5', 'red-400': '#f87171', 'red-500': '#ef4444', 'red-600': '#dc2626', 'red-700': '#b91c1c', 'red-800': '#991b1b', 'red-900': '#7f1d1d',
            'blue-50': '#eff6ff', 'blue-100': '#dbeafe', 'blue-200': '#bfdbfe', 'blue-300': '#93c5fd', 'blue-400': '#60a5fa', 'blue-500': '#3b82f6', 'blue-600': '#2563eb', 'blue-700': '#1d4ed8', 'blue-800': '#1e40af', 'blue-900': '#1e3a8a',
            'indigo-50': '#eef2ff', 'indigo-100': '#e0e7ff', 'indigo-200': '#c7d2fe', 'indigo-300': '#a5b4fc', 'indigo-400': '#818cf8', 'indigo-500': '#6366f1', 'indigo-600': '#4f46e5', 'indigo-700': '#4338ca', 'indigo-800': '#3730a3', 'indigo-900': '#312e81',
            'green-50': '#f0fdf4', 'green-100': '#dcfce7', 'green-200': '#bbf7d0', 'green-300': '#86efac', 'green-400': '#4ade80', 'green-500': '#22c55e', 'green-600': '#16a34a', 'green-700': '#15803d', 'green-800': '#166534', 'green-900': '#14532d',
            'emerald-50': '#ecfdf5', 'emerald-100': '#d1fae5', 'emerald-200': '#a7f3d0', 'emerald-300': '#6ee7b7', 'emerald-400': '#34d399', 'emerald-500': '#10b981', 'emerald-600': '#059669', 'emerald-700': '#047857', 'emerald-800': '#065f46', 'emerald-900': '#064e3b',
            'slate-50': '#f8fafc', 'slate-100': '#f1f5f9', 'slate-200': '#e2e8f0', 'slate-300': '#cbd5e1', 'slate-400': '#94a3b8', 'slate-500': '#64748b', 'slate-600': '#475569', 'slate-700': '#334155', 'slate-800': '#1e293b', 'slate-900': '#0f172a',
            'gray-50': '#f9fafb', 'gray-100': '#f3f4f6', 'gray-200': '#e5e7eb', 'gray-300': '#d1d5db', 'gray-400': '#9ca3af', 'gray-500': '#6b7280', 'gray-600': '#4b5563', 'gray-700': '#374151', 'gray-800': '#1f2937', 'gray-900': '#111827',
            'amber-50': '#fffbeb', 'amber-100': '#fef3c7', 'amber-200': '#fde68a', 'amber-300': '#fcd34d', 'amber-400': '#fbbf24', 'amber-500': '#f59e0b', 'amber-600': '#d97706', 'amber-700': '#b45309', 'amber-800': '#92400e', 'amber-900': '#78350f',
            'purple-50': '#faf5ff', 'purple-100': '#f3e8ff', 'purple-200': '#e9d5ff', 'purple-300': '#d8b4fe', 'purple-400': '#c084fc', 'purple-500': '#a855f7', 'purple-600': '#9333ea', 'purple-700': '#7e22ce', 'purple-800': '#6b21a8', 'purple-900': '#581c87',
        };

        // [web-only-class] bracket syntax: [flex-center] → flex-center
        // Mobile (UniversalUIImporter.js) strips [] entirely; web engine applies them as normal classes.
        const normalizedClass = String(className)
            .replace(/\[([^\]]+)\]/g, '$1')
            .replace(/\s+/g, ' ')
            .trim();
        const classes = normalizedClass.split(/\s+/);
        const styles = [];

        classes.forEach(c => {
            if (!c) return;
            // Padding
            if (c === 'p-0') styles.push('padding:0px');
            else if (c === 'p-1') styles.push('padding:4px');
            else if (c === 'p-2') styles.push('padding:8px');
            else if (c === 'p-2.5') styles.push('padding:10px');
            else if (c === 'p-3') styles.push('padding:12px');
            else if (c === 'p-3.5') styles.push('padding:14px');
            else if (c === 'p-4') styles.push('padding:16px');
            else if (c === 'p-5') styles.push('padding:20px');
            else if (c === 'p-6') styles.push('padding:24px');
            else if (c === 'p-8') styles.push('padding:32px');
            else if (c === 'px-1') styles.push('padding-left:4px;padding-right:4px');
            else if (c === 'px-2') styles.push('padding-left:8px;padding-right:8px');
            else if (c === 'px-3') styles.push('padding-left:12px;padding-right:12px');
            else if (c === 'px-4') styles.push('padding-left:16px;padding-right:16px');
            else if (c === 'py-2') styles.push('padding-top:8px;padding-bottom:8px');
            else if (c === 'py-3') styles.push('padding-top:12px;padding-bottom:12px');

            // Margin & Position
            else if (c === 'relative') styles.push('position:relative');
            else if (c === 'absolute') styles.push('position:absolute');
            else if (c === '-top-3') styles.push('top:-10px');
            else if (c === 'left-3') styles.push('left:12px');
            else if (c === 'z-10') styles.push('z-index:10');
            else if (c === 'm-4') styles.push('margin:16px');
            else if (c === 'mt-1') styles.push('margin-top:4px');
            else if (c === 'mt-2') styles.push('margin-top:8px');
            else if (c === 'mb-2') styles.push('margin-bottom:8px');

            // Gap
            else if (c === 'gap-1') styles.push('gap:4px');
            else if (c === 'gap-2') styles.push('gap:8px');
            else if (c === 'gap-3') styles.push('gap:12px');
            else if (c === 'gap-4') styles.push('gap:16px');
            else if (c === 'gap-6') styles.push('gap:24px');
            else if (c === 'gap-8') styles.push('gap:32px');

            // ── Layout & Sizing ──────────────────────────────────────────────────
            else if (c === 'flex') styles.push('display:flex');
            else if (c === 'grid') styles.push('display:grid');
            else if (c === 'grid-cols-1') styles.push('display:grid;grid-template-columns:repeat(1, minmax(0, 1fr))');
            else if (c === 'grid-cols-2') styles.push('display:grid;grid-template-columns:repeat(2, minmax(0, 1fr))');
            else if (c === 'grid-cols-3') styles.push('display:grid;grid-template-columns:repeat(3, minmax(0, 1fr))');
            else if (c === 'grid-cols-4') styles.push('display:grid;grid-template-columns:repeat(4, minmax(0, 1fr))');
            else if (c === 'inline-flex') styles.push('display:inline-flex');
            else if (c === 'inline') styles.push('display:inline');
            else if (c === 'inline-block') styles.push('display:inline-block');
            else if (c === 'block') styles.push('display:block');
            else if (c === 'hidden') styles.push('display:none');
            else if (c === 'flex-center') styles.push('display:flex;align-items:center;justify-content:center;box-sizing:border-box');
            else if (c === 'flex-row') styles.push('display:flex;flex-direction:row');
            else if (c === 'flex-row-reverse') styles.push('display:flex;flex-direction:row-reverse');
            else if (c === 'flex-col' || c === 'flex-column') styles.push('display:flex;flex-direction:column');
            else if (c === 'flex-col-reverse') styles.push('display:flex;flex-direction:column-reverse');
            else if (c === 'flex-1') styles.push('flex:1 1 0%;align-self:stretch');
            else if (c === 'flex-auto') styles.push('flex:1 1 auto');
            else if (c === 'flex-none') styles.push('flex:none');
            else if (c === 'flex-grow') styles.push('flex-grow:1');
            else if (c === 'flex-shrink-0') styles.push('flex-shrink:0');
            else if (c === 'flex-wrap') styles.push('flex-wrap:wrap');
            else if (c === 'flex-nowrap') styles.push('flex-wrap:nowrap');
            else if (c === 'items-start') styles.push('align-items:flex-start');
            else if (c === 'items-center') styles.push('align-items:center');
            else if (c === 'items-end') styles.push('align-items:flex-end');
            else if (c === 'items-stretch') styles.push('align-items:stretch');
            else if (c === 'self-stretch') styles.push('align-self:stretch');
            else if (c === 'self-center') styles.push('align-self:center');
            else if (c === 'self-start') styles.push('align-self:flex-start');
            else if (c === 'self-end') styles.push('align-self:flex-end');
            else if (c === 'justify-start') styles.push('justify-content:flex-start');
            else if (c === 'justify-center') styles.push('justify-content:center');
            else if (c === 'justify-end') styles.push('justify-content:flex-end');
            else if (c === 'justify-between') styles.push('justify-content:space-between');
            else if (c === 'justify-around') styles.push('justify-content:space-around');
            else if (c === 'justify-evenly') styles.push('justify-content:space-evenly');

            // Width
            else if (c === 'w-full') styles.push('width:100%;align-self:stretch');
            else if (c === 'w-screen') styles.push('width:100vw;align-self:stretch');
            else if (c === 'w-auto') styles.push('width:auto');
            else if (c === 'w-fit') styles.push('width:fit-content');
            else if (c === 'w-min') styles.push('width:min-content');
            else if (c === 'w-max') styles.push('width:max-content');
            else if (c === 'w-1/2') styles.push('width:50%');
            else if (c === 'w-1/3') styles.push('width:33.333%');
            else if (c === 'w-2/3') styles.push('width:66.667%');
            else if (c === 'w-1/4') styles.push('width:25%');
            else if (c === 'w-3/4') styles.push('width:75%');
            else if (c === 'w-4') styles.push('width:16px');
            else if (c === 'w-6') styles.push('width:24px');
            else if (c === 'w-8') styles.push('width:32px');
            else if (c === 'w-10') styles.push('width:40px');
            else if (c === 'w-12') styles.push('width:48px');
            else if (c === 'w-16') styles.push('width:64px');
            else if (c === 'w-20') styles.push('width:80px');
            else if (c === 'w-24') styles.push('width:96px');
            else if (c === 'w-32') styles.push('width:128px');
            else if (c === 'w-40') styles.push('width:160px');
            else if (c === 'w-48') styles.push('width:192px');
            else if (c === 'w-64') styles.push('width:256px');

            // Max Width
            else if (c === 'max-w-xs')    styles.push('max-width:320px');
            else if (c === 'max-w-sm')    styles.push('max-width:384px');
            else if (c === 'max-w-md')    styles.push('max-width:448px');
            else if (c === 'max-w-lg')    styles.push('max-width:512px');
            else if (c === 'max-w-xl')    styles.push('max-width:576px');
            else if (c === 'max-w-2xl')   styles.push('max-width:672px');
            else if (c === 'max-w-3xl')   styles.push('max-width:768px');
            else if (c === 'max-w-4xl')   styles.push('max-width:896px');
            else if (c === 'max-w-5xl')   styles.push('max-width:1024px');
            else if (c === 'max-w-6xl')   styles.push('max-width:1152px');
            else if (c === 'max-w-7xl')   styles.push('max-width:1280px');
            else if (c === 'max-w-full')  styles.push('max-width:100%');
            else if (c === 'max-w-screen') styles.push('max-width:100vw');
            else if (c === 'max-w-none')  styles.push('max-width:none');

            // Min Width
            else if (c === 'min-w-0')    styles.push('min-width:0');
            else if (c === 'min-w-full') styles.push('min-width:100%');
            else if (c === 'min-w-min')  styles.push('min-width:min-content');
            else if (c === 'min-w-max')  styles.push('min-width:max-content');

            // Height
            else if (c === 'h-full')    styles.push('height:100%');
            else if (c === 'h-screen')  styles.push('height:100vh');
            else if (c === 'h-auto')    styles.push('height:auto');
            else if (c === 'h-fit')     styles.push('height:fit-content');
            else if (c === 'h-4')  styles.push('height:16px');
            else if (c === 'h-6')  styles.push('height:24px');
            else if (c === 'h-8')  styles.push('height:32px');
            else if (c === 'h-10') styles.push('height:40px');
            else if (c === 'h-12') styles.push('height:48px');
            else if (c === 'h-16') styles.push('height:64px');
            else if (c === 'h-20') styles.push('height:80px');
            else if (c === 'h-24') styles.push('height:96px');
            else if (c === 'h-32') styles.push('height:128px');
            else if (c === 'h-48') styles.push('height:192px');
            else if (c === 'h-64') styles.push('height:256px');

            // Min / Max Height
            else if (c === 'min-h-screen') styles.push('min-height:100vh');
            else if (c === 'min-h-full')   styles.push('min-height:100%');
            else if (c === 'min-h-0')      styles.push('min-height:0');
            else if (c === 'max-h-full')   styles.push('max-height:100%');
            else if (c === 'max-h-screen') styles.push('max-height:100vh');

            // Margin — auto centering
            else if (c === 'm-auto')    styles.push('margin:auto');
            else if (c === 'mx-auto')   styles.push('margin-left:auto;margin-right:auto');
            else if (c === 'my-auto')   styles.push('margin-top:auto;margin-bottom:auto');
            else if (c === 'ml-auto')   styles.push('margin-left:auto');
            else if (c === 'mr-auto')   styles.push('margin-right:auto');
            else if (c === 'mt-auto')   styles.push('margin-top:auto');
            else if (c === 'mb-auto')   styles.push('margin-bottom:auto');
            else if (c === 'm-0')  styles.push('margin:0');
            else if (c === 'm-1')  styles.push('margin:4px');
            else if (c === 'm-2')  styles.push('margin:8px');
            else if (c === 'm-3')  styles.push('margin:12px');
            else if (c === 'm-4')  styles.push('margin:16px');
            else if (c === 'm-6')  styles.push('margin:24px');
            else if (c === 'm-8')  styles.push('margin:32px');
            else if (c === 'mt-1') styles.push('margin-top:4px');
            else if (c === 'mt-2') styles.push('margin-top:8px');
            else if (c === 'mt-3') styles.push('margin-top:12px');
            else if (c === 'mt-4') styles.push('margin-top:16px');
            else if (c === 'mt-6') styles.push('margin-top:24px');
            else if (c === 'mb-1') styles.push('margin-bottom:4px');
            else if (c === 'mb-2') styles.push('margin-bottom:8px');
            else if (c === 'mb-3') styles.push('margin-bottom:12px');
            else if (c === 'mb-4') styles.push('margin-bottom:16px');
            else if (c === 'mb-6') styles.push('margin-bottom:24px');
            else if (c === 'ml-1') styles.push('margin-left:4px');
            else if (c === 'ml-2') styles.push('margin-left:8px');
            else if (c === 'ml-4') styles.push('margin-left:16px');
            else if (c === 'mr-1') styles.push('margin-right:4px');
            else if (c === 'mr-2') styles.push('margin-right:8px');
            else if (c === 'mr-4') styles.push('margin-right:16px');
            else if (c === 'mx-1') styles.push('margin-left:4px;margin-right:4px');
            else if (c === 'mx-2') styles.push('margin-left:8px;margin-right:8px');
            else if (c === 'mx-4') styles.push('margin-left:16px;margin-right:16px');
            else if (c === 'my-1') styles.push('margin-top:4px;margin-bottom:4px');
            else if (c === 'my-2') styles.push('margin-top:8px;margin-bottom:8px');
            else if (c === 'my-4') styles.push('margin-top:16px;margin-bottom:16px');

            // Overflow
            else if (c === 'overflow-hidden')  styles.push('overflow:hidden');
            else if (c === 'overflow-auto')    styles.push('overflow:auto');
            else if (c === 'overflow-scroll')  styles.push('overflow:scroll');
            else if (c === 'overflow-visible') styles.push('overflow:visible');
            else if (c === 'overflow-x-auto')  styles.push('overflow-x:auto');
            else if (c === 'overflow-y-auto')  styles.push('overflow-y:auto');
            else if (c === 'overflow-x-hidden') styles.push('overflow-x:hidden');
            else if (c === 'overflow-y-hidden') styles.push('overflow-y:hidden');

            // Position
            else if (c === 'relative') styles.push('position:relative');
            else if (c === 'absolute') styles.push('position:absolute');
            else if (c === 'fixed')    styles.push('position:fixed');
            else if (c === 'sticky')   styles.push('position:sticky');
            else if (c === 'static')   styles.push('position:static');
            else if (c === 'inset-0')  styles.push('top:0;right:0;bottom:0;left:0');
            else if (c === 'top-0')    styles.push('top:0');
            else if (c === 'bottom-0') styles.push('bottom:0');
            else if (c === 'left-0')   styles.push('left:0');
            else if (c === 'right-0')  styles.push('right:0');

            // Opacity
            else if (c === 'opacity-0')   styles.push('opacity:0');
            else if (c === 'opacity-25')  styles.push('opacity:0.25');
            else if (c === 'opacity-50')  styles.push('opacity:0.5');
            else if (c === 'opacity-75')  styles.push('opacity:0.75');
            else if (c === 'opacity-100') styles.push('opacity:1');

            // Cursor
            else if (c === 'cursor-pointer')  styles.push('cursor:pointer');
            else if (c === 'cursor-default')  styles.push('cursor:default');
            else if (c === 'cursor-not-allowed') styles.push('cursor:not-allowed');

            // Text
            else if (c === 'text-center') styles.push('text-align:center');
            else if (c === 'text-left')   styles.push('text-align:left');
            else if (c === 'text-right')  styles.push('text-align:right');
            else if (c === 'text-justify') styles.push('text-align:justify');
            else if (c === 'whitespace-nowrap') styles.push('white-space:nowrap');
            else if (c === 'truncate') styles.push('overflow:hidden;text-overflow:ellipsis;white-space:nowrap');
            else if (c === 'uppercase') styles.push('text-transform:uppercase');
            else if (c === 'lowercase') styles.push('text-transform:lowercase');
            else if (c === 'capitalize') styles.push('text-transform:capitalize');
            else if (c === 'underline') styles.push('text-decoration:underline');
            else if (c === 'line-through') styles.push('text-decoration:line-through');
            else if (c === 'no-underline') styles.push('text-decoration:none');

            // Object fit (images)
            else if (c === 'object-cover')   styles.push('object-fit:cover');
            else if (c === 'object-contain') styles.push('object-fit:contain');
            else if (c === 'object-fill')    styles.push('object-fit:fill');

            // Dynamic Gradient Support (e.g. bg-gradient-blue-100-red-100 or gradient-blue-100-red-100)
            else if (c.startsWith('bg-gradient-') || c.startsWith('gradient-')) {
                const raw = c.replace(/^(bg-gradient-|gradient-)/, '');
                const colorParts = raw.split('-');
                if (colorParts.length >= 4) {
                    const c1Key = `${colorParts[0]}-${colorParts[1]}`;
                    const c2Key = `${colorParts[2]}-${colorParts[3]}`;
                    const hex1 = TW_COLOR_MAP[c1Key] || '#3b82f6';
                    const hex2 = TW_COLOR_MAP[c2Key] || '#ef4444';
                    styles.push(`background:linear-gradient(135deg, ${hex1} 0%, ${hex2} 100%)`);
                } else if (colorParts.length >= 2) {
                    const c1Key = `${colorParts[0]}-${colorParts[1]}`;
                    const hex1 = TW_COLOR_MAP[c1Key] || '#3b82f6';
                    styles.push(`background:linear-gradient(135deg, ${hex1} 0%, #ffffff 100%)`);
                }
            }
            // Dynamic Spacing (p-*, px-*, py-*, pt-*, pb-*, pl-*, pr-*, m-*, mx-*, my-*, mt-*, mb-*, ml-*, mr-*, gap-*)
            else if (/^p-(\d+)$/.test(c)) { const val = parseInt(c.slice(2)); styles.push(`padding:${val * 4}px`); }
            else if (/^px-(\d+)$/.test(c)) { const val = parseInt(c.slice(3)); styles.push(`padding-left:${val * 4}px;padding-right:${val * 4}px`); }
            else if (/^py-(\d+)$/.test(c)) { const val = parseInt(c.slice(3)); styles.push(`padding-top:${val * 4}px;padding-bottom:${val * 4}px`); }
            else if (/^pt-(\d+)$/.test(c)) { const val = parseInt(c.slice(3)); styles.push(`padding-top:${val * 4}px`); }
            else if (/^pb-(\d+)$/.test(c)) { const val = parseInt(c.slice(3)); styles.push(`padding-bottom:${val * 4}px`); }
            else if (/^pl-(\d+)$/.test(c)) { const val = parseInt(c.slice(3)); styles.push(`padding-left:${val * 4}px`); }
            else if (/^pr-(\d+)$/.test(c)) { const val = parseInt(c.slice(3)); styles.push(`padding-right:${val * 4}px`); }
            else if (/^m-(\d+)$/.test(c)) { const val = parseInt(c.slice(2)); styles.push(`margin:${val * 4}px`); }
            else if (/^mx-(\d+)$/.test(c)) { const val = parseInt(c.slice(3)); styles.push(`margin-left:${val * 4}px;margin-right:${val * 4}px`); }
            else if (/^my-(\d+)$/.test(c)) { const val = parseInt(c.slice(3)); styles.push(`margin-top:${val * 4}px;margin-bottom:${val * 4}px`); }
            else if (/^mt-(\d+)$/.test(c)) { const val = parseInt(c.slice(3)); styles.push(`margin-top:${val * 4}px`); }
            else if (/^mb-(\d+)$/.test(c)) { const val = parseInt(c.slice(3)); styles.push(`margin-bottom:${val * 4}px`); }
            else if (/^ml-(\d+)$/.test(c)) { const val = parseInt(c.slice(3)); styles.push(`margin-left:${val * 4}px`); }
            else if (/^mr-(\d+)$/.test(c)) { const val = parseInt(c.slice(3)); styles.push(`margin-right:${val * 4}px`); }
            else if (/^gap-(\d+)$/.test(c)) { const val = parseInt(c.slice(4)); styles.push(`gap:${val * 4}px`); }

            // Dynamic Background Colors (supports /10, /20, /50 opacity modifiers)
            else if (c.startsWith('bg-')) {
                const parts = c.substring(3).split('/');
                const rawKey = parts[0];
                const opacity = parts[1] ? parseFloat(parts[1]) / 100 : 1;
                let baseColor = TW_COLOR_MAP[rawKey] || (rawKey === 'white' ? '#ffffff' : (rawKey === 'black' ? '#000000' : (rawKey === 'transparent' ? 'transparent' : null)));
                if (baseColor) {
                    if (opacity < 1 && baseColor.startsWith('#')) {
                        const hex = baseColor.slice(1);
                        const r = parseInt(hex.slice(0, 2), 16) || 255;
                        const g = parseInt(hex.slice(2, 4), 16) || 255;
                        const b = parseInt(hex.slice(4, 6), 16) || 255;
                        styles.push(`background-color:rgba(${r}, ${g}, ${b}, ${opacity}) !important`);
                    } else {
                        styles.push(`background-color:${baseColor}`);
                    }
                }
            }

            // Dynamic Text Colors (supports /10, /50, /70, /80 opacity modifiers)
            else if (c.startsWith('text-')) {
                const parts = c.substring(5).split('/');
                const rawKey = parts[0];
                const opacity = parts[1] ? parseFloat(parts[1]) / 100 : 1;
                let baseColor = TW_COLOR_MAP[rawKey] || (rawKey === 'white' ? '#ffffff' : (rawKey === 'black' ? '#000000' : null));
                if (baseColor) {
                    if (opacity < 1 && baseColor.startsWith('#')) {
                        const hex = baseColor.slice(1);
                        const r = parseInt(hex.slice(0, 2), 16) || 255;
                        const g = parseInt(hex.slice(2, 4), 16) || 255;
                        const b = parseInt(hex.slice(4, 6), 16) || 255;
                        styles.push(`color:rgba(${r}, ${g}, ${b}, ${opacity}) !important`);
                    } else {
                        styles.push(`color:${baseColor}`);
                    }
                }
            }

            // Dynamic Border Colors (supports /20, /30 opacity modifiers)
            else if (c === 'border') {
                styles.push('border-style:solid;border-width:1px;border-color:rgba(255,255,255,0.2)');
            }
            else if (c.startsWith('border-')) {
                const parts = c.substring(7).split('/');
                const rawKey = parts[0];
                const opacity = parts[1] ? parseFloat(parts[1]) / 100 : 1;
                let baseColor = TW_COLOR_MAP[rawKey] || (rawKey === 'white' ? '#ffffff' : (rawKey === 'black' ? '#000000' : null));
                if (baseColor) {
                    if (opacity < 1 && baseColor.startsWith('#')) {
                        const hex = baseColor.slice(1);
                        const r = parseInt(hex.slice(0, 2), 16) || 255;
                        const g = parseInt(hex.slice(2, 4), 16) || 255;
                        const b = parseInt(hex.slice(4, 6), 16) || 255;
                        styles.push(`border-style:solid;border-width:1px;border-color:rgba(${r}, ${g}, ${b}, ${opacity}) !important`);
                    } else {
                        styles.push(`border-style:solid;border-width:1px;border-color:${baseColor}`);
                    }
                }
            }

            // Numeric Sizing (w-30, h-30, etc.)
            else if (c.startsWith('w-') && !c.includes('-full') && !c.includes('-screen') && !c.includes('/')) {
                const val = parseInt(c.substring(2));
                if (!isNaN(val)) styles.push(`width:${val * 4}px`);
            }
            else if (c.startsWith('h-') && !c.includes('-full') && !c.includes('-screen') && !c.includes('/')) {
                const val = parseInt(c.substring(2));
                if (!isNaN(val)) styles.push(`height:${val * 4}px`);
            }
            else if (c === 'center') styles.push('display:flex;align-items:center;justify-content:center;width:100%');
            else if (c === 'circle' || c === 'rounded-full') styles.push('border-radius:9999px');
            else if (c === 'rounded-xl') styles.push('border-radius:12px');
            else if (c === 'rounded-2xl') styles.push('border-radius:16px');
            else if (c === 'rounded-3xl') styles.push('border-radius:24px');
            else if (c === 'shadow-md') styles.push('box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)');
            else if (c === 'shadow-lg') styles.push('box-shadow:0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)');
            else if (c === 'shadow-xl') styles.push('box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)');

            // Font Weights & Sizes
            else if (c === 'text-xs') styles.push('font-size:12px;line-height:16px');
            else if (c === 'text-sm') styles.push('font-size:14px;line-height:20px');
            else if (c === 'text-base') styles.push('font-size:16px;line-height:24px');
            else if (c === 'text-lg') styles.push('font-size:18px;line-height:28px');
            else if (c === 'text-xl') styles.push('font-size:20px;line-height:28px');
            else if (c === 'text-2xl') styles.push('font-size:24px;line-height:32px');
            else if (c === 'text-3xl') styles.push('font-size:30px;line-height:36px');
            else if (c === 'font-medium') styles.push('font-weight:500');
            else if (c === 'font-semibold') styles.push('font-weight:600');
            else if (c === 'font-bold') styles.push('font-weight:700');
            else if (c === 'font-extrabold') styles.push('font-weight:800');

            // Borders & Radius
            else if (c === 'border') styles.push('border-style:solid;border-width:1px');
            else if (c.startsWith('rounded-')) {
                const rVal = parseInt(c.substring(8));
                if (!isNaN(rVal)) styles.push(`border-radius:${rVal}px`);
                else if (c === 'rounded-xl') styles.push('border-radius:12px');
                else if (c === 'rounded-2xl') styles.push('border-radius:16px');
                else if (c === 'rounded-3xl') styles.push('border-radius:24px');
            }

            // Shadows
            else if (c === 'shadow-sm') styles.push('box-shadow:0 1px 2px 0 rgba(0,0,0,0.05)');
            else if (c === 'shadow') styles.push('box-shadow:0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.06)');
            else if (c === 'shadow-md') styles.push('box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)');
            else if (c === 'shadow-lg') styles.push('box-shadow:0 10px 15px -3px rgba(0,0,0,0.1)');
            else if (c === 'shadow-2xl') styles.push('box-shadow:0 25px 50px -12px rgba(0,0,0,0.25)');

            // card: only visual properties — layout (width) handled by CSS .card {width:100%;align-self:stretch}
            else if (c === 'card' || c === 'dolphin-login') styles.push('display:flex;flex-direction:column;box-sizing:border-box;border-radius:16px');
        });

        return styles.join(';');
    }

    _escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

module.exports = new DolphinWebEngine();
