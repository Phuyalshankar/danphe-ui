'use strict';

const path = require('path');
const fs = require('fs');

const WebCSS = require('./WebCSS');
const WebStateEngine = require('./WebStateEngine');
const WebMultimedia = require('./WebMultimedia');
const WebNavigation = require('./WebNavigation');

/**
 * DolphinWebEngine — Smart Universal Dual-Target Web & SEO Engine
 * Renders Dolphin Native JSX pages into Semantic HTML5 with 100% Google SEO indexing
 * without touching or polluting the mobile Titan C++/Kotlin binary engine.
 * Decoupled into WebCSS, WebStateEngine, WebMultimedia, and WebNavigation modules.
 */
class DolphinWebEngine {
    constructor() {
        this.ub = null;
        try {
            this.ub = require('../framework/ub');
        } catch (e) {
            this.ub = null;
        }
        this._ensureGlobalHooks();
    }

    _ensureGlobalHooks() {
        if (typeof global.useState === 'undefined') {
            global.useState = function(initial) {
                var val = typeof initial === 'function' ? initial() : initial;
                return [val, function() {}];
            };
        }
        if (typeof global.useEffect === 'undefined') {
            global.useEffect = function(fn) {};
        }
        if (typeof global.useRef === 'undefined') {
            global.useRef = function(initial) { return { current: initial }; };
        }
        if (typeof global.useMemo === 'undefined') {
            global.useMemo = function(fn) { return typeof fn === 'function' ? fn() : fn; };
        }
        if (typeof global.useCallback === 'undefined') {
            global.useCallback = function(fn) { return fn; };
        }
        if (typeof process !== 'undefined' && process.env) {
            process.env.IS_WEB_ENGINE = 'true';
        }
        if (typeof global.useNanoState === 'undefined') {
            global.useNanoState = function(key, initial) {
                return [initial, function() {}];
            };
        }
    }

    _parseStateKeyString(str, stateMap = {}) {
        return WebStateEngine.parseStateKeyString(str, stateMap, this._escapeHTML.bind(this));
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
            return this._parseStateKeyString(String(vnode), stateMap);
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
            return this._parseStateKeyString(val, stateMap);
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
        const compTypeProp = String(props.type || '').toLowerCase();
        let rawTag = (compTypeProp === '0x60' || compTypeProp === 'webview')
            ? 'iframe'
            : ((vnode.type && vnode.type !== 'element' && vnode.type !== 'fragment')
                ? vnode.type
                : (vnode.tag || props.tag || 'div'));
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
            'nav': 'nav',
            'webview': 'iframe',
            '0x60': 'iframe',
            'nativecanvas': 'canvas',
            '0x61': 'canvas'
        };

        let htmlTag = tagMap[rawTag] || rawTag || 'div';
        if (compTypeProp === '0x60' || compTypeProp === 'webview') {
            htmlTag = 'iframe';
        } else if (compTypeProp === '0x61' || compTypeProp === 'nativecanvas') {
            htmlTag = 'canvas';
        }

        // Inline Utility Style Generator
        let inlineStyle = this._classNameToStyle(props.className);

        // Resolve custom gradient="danphe" / gradient="gradient-horiz-..." attributes
        const gradAttr = props.gradient || (props.attributes && props.attributes.gradient) || null;
        if (gradAttr) {
            const gradCss = this._resolveGradientString(gradAttr);
            if (gradCss) {
                inlineStyle = inlineStyle ? `background-image:${gradCss} !important;${inlineStyle}` : `background-image:${gradCss} !important`;
            }
        }

        const svgTags = ['svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'defs', 'clippath', 'use'];
        if (svgTags.includes(rawTag)) {
            htmlTag = rawTag;
        }

        if (rawTag === 'icon') {
            const iconName = props.name || props.icon || props.className || '';
            const faClass = iconName.startsWith('fa-') || iconName.includes('fa-') ? iconName : `fa-solid fa-${iconName}`;
            const webClasses = String(props.className || '').replace(/\[(.*?)\]/g, '$1').replace(/\s+/g, ' ').trim();
            return `<i class="${faClass} ${this._escapeHTML(webClasses)}" style="${this._escapeHTML(inlineStyle)}"></i>`;
        }

        if (rawTag === 'thorvg' || rawTag === 'nativecanvas' || compTypeProp === '0x61' || compTypeProp === 'thorvg') {
            const svgContent = props.svg || props.src || props.d || '';
            if (svgContent && typeof svgContent === 'string' && svgContent.trim().startsWith('<svg')) {
                let cleanSvg = svgContent.trim();
                if (!cleanSvg.includes('width=') && !cleanSvg.includes('width:')) {
                    cleanSvg = cleanSvg.replace('<svg ', '<svg width="100%" height="100%" ');
                }
                const webClasses = String(props.className || '').replace(/\[(.*?)\]/g, '$1').replace(/\s+/g, ' ').trim();
                return `<div class="${this._escapeHTML(webClasses)}" style="display:inline-flex;align-items:center;justify-content:center;${this._escapeHTML(inlineStyle)}">${cleanSvg}</div>`;
            } else if (props.d || (svgContent && typeof svgContent === 'string' && !svgContent.startsWith('<svg') && svgContent.length > 5)) {
                const pathD = props.d || svgContent;
                const w = props.width || 24;
                const h = props.height || 24;
                const stroke = props.stroke || 'currentColor';
                const fill = props.fill || 'none';
                const cleanSvg = `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${pathD}"/></svg>`;
                const webClasses = String(props.className || '').replace(/\[(.*?)\]/g, '$1').replace(/\s+/g, ' ').trim();
                return `<div class="${this._escapeHTML(webClasses)}" style="display:inline-flex;align-items:center;justify-content:center;${this._escapeHTML(inlineStyle)}">${cleanSvg}</div>`;
            }
        }

        // Build HTML attributes
        const attrs = [];
        if (props.id) attrs.push(`id="${this._escapeHTML(props.id)}"`);
        if (props.className) {
            const webClasses = String(props.className).replace(/\[(.*?)\]/g, '$1').replace(/\s+/g, ' ').trim();
            attrs.push(`class="${this._escapeHTML(webClasses)}"`);
        }

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
        if (props.src) {
            let cleanSrc = String(props.src);
            if (cleanSrc.startsWith('[stateKey:') && cleanSrc.endsWith(']')) {
                const key = cleanSrc.substring(10, cleanSrc.length - 1);
                cleanSrc = (stateMap && stateMap[key] !== undefined) ? stateMap[key] : cleanSrc;
                attrs.push(`data-state-img="${this._escapeHTML(key)}"`);
            }
            if (cleanSrc.startsWith('../assets/')) cleanSrc = '/assets/' + cleanSrc.substring(10);
            else if (cleanSrc.startsWith('./assets/')) cleanSrc = '/assets/' + cleanSrc.substring(9);
            else if (cleanSrc.startsWith('assets/')) cleanSrc = '/assets/' + cleanSrc.substring(7);
            attrs.push(`src="${this._escapeHTML(cleanSrc)}"`);
        }
        if (htmlTag === 'video') {
            attrs.push('autoplay');
            attrs.push('muted');
            attrs.push('loop');
            attrs.push('playsinline');
            attrs.push('webkit-playsinline');
        } else if (htmlTag === 'iframe') {
            attrs.push('allow="autoplay; fullscreen"');
            attrs.push('frameborder="0"');
        }
        if (props.alt) attrs.push(`alt="${this._escapeHTML(props.alt)}"`);
        if (props.placeholder) attrs.push(`placeholder="${this._escapeHTML(props.placeholder)}"`);
        if (props.href) attrs.push(`href="${this._escapeHTML(props.href)}"`);

        // Pass-through SVG & Custom HTML attributes
        const reservedProps = ['id', 'className', 'class', 'action', 'stateKey', 'statekey', 'src', 'alt', 'placeholder', 'href', 'style', 'children', 'target', 'platform', 'type', 'value', 'inputType', 'autoPlay', 'autoplay', 'loop', 'muted', 'playsInline', 'playsinline', 'webkit-playsinline', 'controls'];
        Object.keys(props).forEach(key => {
            if (!reservedProps.includes(key) && typeof props[key] !== 'object' && typeof props[key] !== 'function') {
                const attrName = key === 'viewBox' ? 'viewBox' : (key.toLowerCase().startsWith('on') ? key.toLowerCase() : key.replace(/([A-Z])/g, '-$1').toLowerCase());
                attrs.push(`${attrName}="${this._escapeHTML(String(props[key]))}"`);
            }
        });

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

        if (['img', 'input', 'br', 'hr', 'meta', 'link'].includes(htmlTag)) {
            return `<${htmlTag}${attrString} />`;
        }

        let innerHTML = '';
        if (typeof children === 'string' || typeof children === 'number') {
            innerHTML = this._parseStateKeyString(String(children), stateMap);
        } else if (Array.isArray(children)) {
            innerHTML = children.map(c => this.vnodeToHTML(c, stateMap)).join('');
        } else if (children) {
            innerHTML = this.vnodeToHTML(children, stateMap);
        }

        if (props.icon) {
            const iconName = String(props.icon);
            if (iconName) {
                const normalized = iconName.replace(/^fa-/, '').toLowerCase().trim();
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

    static renderToWebHTML(pageVNode, seoConfig = {}, initialState = {}, localCdnPaths = {}) {
        const engine = new DolphinWebEngine();
        return engine.renderToWebHTML(pageVNode, seoConfig, initialState, localCdnPaths);
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

        const mergedInitialState = { ...WebStateEngine.getDefaultState(), ...initialState };
        const bodyHTML = this.vnodeToHTML(pageVNode, mergedInitialState);

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
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
    
    <!-- 100% Offline Local Assets & Icons Support -->
    <link rel="stylesheet" href="/assets/icons/icons.css" />
    <link rel="stylesheet" href="/assets/cdn/fa-all.min.css" />
    <link rel="stylesheet" href="/assets/cdn/dolphin-css.css" />
    <style>
        ${WebCSS.getBaseStyles()}
    </style>
</head>
<body>
    <div id="root">${bodyHTML}</div>

    ${WebNavigation.getDrawerHTML()}
    ${WebNavigation.getBottomDrawerHTML()}

    <!-- Pure Web-Native In-Browser State Engine & Action Router -->
    <script>
      (function() {
        var state = ${JSON.stringify(mergedInitialState)};
        var initialState = JSON.parse(JSON.stringify(state));
        var tempTimers = {};
        var stateListeners = [];

        ${WebNavigation.getClientScript()}
        ${WebMultimedia.getClientScript()}

        // 🌟 Expose Universal Reactive Hooks & NanoStore to Browser Window
        window.DolphinWebStore = {
          state: state,
          get: function(key) { return state[key]; },
          set: function(key, val) {
            state[key] = val;
            updateDOM();
            stateListeners.forEach(function(l) { try { l(key, val); } catch (e) {} });
          },
          updateState: function(key, val) { this.set(key, val); },
          subscribe: function(fn) {
            stateListeners.push(fn);
            return function() {
              var idx = stateListeners.indexOf(fn);
              if (idx >= 0) stateListeners.splice(idx, 1);
            };
          }
        };

        window.useState = function(initial) {
          var hookKey = '_hook_' + Math.random().toString(36).substring(2, 9);
          if (state[hookKey] === undefined) {
            state[hookKey] = typeof initial === 'function' ? initial() : initial;
          }
          var setState = function(newVal) {
            state[hookKey] = typeof newVal === 'function' ? newVal(state[hookKey]) : newVal;
            updateDOM();
          };
          return [state[hookKey], setState];
        };

        window.useEffect = function(callback, deps) {
          setTimeout(function() {
            try { callback(); } catch (e) {}
          }, 0);
        };

        window.useRef = function(initial) {
          return { current: initial };
        };

        window.useNanoState = function(key, initial) {
          if (state[key] === undefined && initial !== undefined) {
            state[key] = initial;
          }
          var setNanoState = function(newVal) {
            state[key] = typeof newVal === 'function' ? newVal(state[key]) : newVal;
            updateDOM();
            stateListeners.forEach(function(l) { try { l(key, state[key]); } catch (e) {} });
          };
          return [state[key] !== undefined ? state[key] : initial, setNanoState];
        };

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

          var busElements = document.querySelectorAll('[data-bus]');
          busElements.forEach(function(el) {
            var busKey = el.getAttribute('data-bus');
            if (busKey) {
              var isNested = busKey.indexOf('.') >= 0;
              var regId = isNested ? busKey.split('.')[0] : busKey;
              var propPath = isNested ? busKey.split('.').slice(1) : [];

              var val = state['bus:' + regId] !== undefined ? state['bus:' + regId] : (state[regId] !== undefined ? state[regId] : (state['bus:' + busKey] !== undefined ? state['bus:' + busKey] : state[busKey]));
              if (isNested && val && typeof val === 'object') {
                var cur = val;
                for (var p = 0; p < propPath.length; p++) {
                  if (cur && cur[propPath[p]] !== undefined) cur = cur[propPath[p]];
                  else { cur = ''; break; }
                }
                val = cur;
              }
              if (val !== undefined && val !== null) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                  if (document.activeElement !== el) el.value = String(val);
                } else {
                  el.textContent = String(val);
                }
              }
            }
          });

          var imgElements = document.querySelectorAll('[data-state-img]');
          imgElements.forEach(function(img) {
            var imgKey = img.getAttribute('data-state-img');
            if (imgKey && state[imgKey] !== undefined) {
              var newSrc = String(state[imgKey]);
              if (img.getAttribute('src') !== newSrc) {
                img.setAttribute('src', newSrc);
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
          var lowerAct = String(action).toLowerCase().trim();

          // Everest Bus Actions (bus:key:X, bus:backspace, bus:dial, bus:write:reg:val, bus:relay:id:state, etc.)
          if (lowerAct.startsWith('bus:')) {
            var parts = action.split(':');
            var verb = parts[1];
            if (verb === 'key') {
              var key = parts[2] || '';
              var cur = String(state['1000'] || state['bus:1000'] || state['dial_input'] || '');
              var updated = cur + key;
              state['1000'] = updated;
              state['bus:1000'] = updated;
              state['dial_input'] = updated;
            } else if (verb === 'backspace') {
              var cur = String(state['1000'] || state['bus:1000'] || state['dial_input'] || '');
              var updated = cur.length > 0 ? cur.slice(0, -1) : '';
              state['1000'] = updated;
              state['bus:1000'] = updated;
              state['dial_input'] = updated;
            } else if (verb === 'dial') {
              state['10'] = 'ActiveCall';
              state['bus:10'] = 'ActiveCall';
              state['currentScreen'] = 'ActiveCall';
            } else if (verb === 'write') {
              var reg = parts[2];
              var val = parts.slice(3).join(':');
              state[reg] = val;
              state['bus:' + reg] = val;
            } else if (verb === 'relay') {
              var rId = parts[2];
              var rSt = parts[3] === 'on' || parts[3] === '1' ? 1 : 0;
              state['2000' + rId] = rSt;
              state['bus:2000' + rId] = rSt;
            } else if (verb === 'screen') {
              var target = parts[2];
              state['10'] = target;
              state['bus:10'] = target;
              state['currentScreen'] = target;
            }
            updateDOM();
          }

          // Drawer Actions for Web
          if (lowerAct === 'drawer:open' || lowerAct === 'drawer:toggle' || lowerAct === 'app:drawer:open' || lowerAct === 'app.drawer.open') {
            if (window.openWebDrawer) window.openWebDrawer();
            return;
          }
          if (lowerAct === 'drawer:close' || lowerAct === 'app:drawer:close' || lowerAct === 'app.drawer.close') {
            if (window.closeWebDrawer) window.closeWebDrawer();
            return;
          }

          // Bottom Drawer / Bottom Sheet Actions for Web
          if (lowerAct.startsWith('bottom_drawer:open') || lowerAct.startsWith('bottom_sheet:open') ||
              lowerAct.startsWith('sheet:open') || lowerAct === 'bottom_drawer:toggle' || lowerAct === 'bottom_drawer:show') {
            var targetDrawer = action.includes(':') && action.split(':').length > 2 ? action.split(':').pop().trim() : 'Keypad';
            if (window.openBottomDrawer) window.openBottomDrawer(targetDrawer);
            return;
          }
          if (lowerAct === 'bottom_drawer:close' || lowerAct === 'bottom_sheet:close' || lowerAct === 'sheet:close') {
            if (window.closeBottomDrawer) window.closeBottomDrawer();
            return;
          }

          // Interactive Animation Trigger Actions for Web (Matches Mobile APK View Property Animator)
          if (lowerAct.startsWith('anim:')) {
            var animName = action.split(':').pop().trim().toLowerCase();
            // Target ONLY the exact clicked button element to match Mobile APK behavior 100%
            var targetEl = btn;
            if (targetEl) {
              var animClass = 'animate-' + (animName === 'zoom' ? 'zoom-in' : (animName === 'slideup' ? 'slide-up' : (animName === 'slidedown' ? 'slide-down' : (animName === 'rotatein' ? 'rotate-in' : animName))));
              targetEl.classList.remove('animate-bounce', 'animate-tada', 'animate-pulse', 'animate-heartbeat', 'animate-headshake', 'animate-flip', 'animate-zoom-in', 'animate-slide-up', 'animate-slide-down', 'animate-rotate-in');
              void targetEl.offsetWidth;
              targetEl.classList.add(animClass);
              setTimeout(function() {
                targetEl.classList.remove(animClass);
              }, 1800);
            }
            return;
          }
          if (lowerAct.startsWith('nav:') || lowerAct.startsWith('tab:') || lowerAct.startsWith('nav.to:') || lowerAct.startsWith('app:nav:')) {
            var screenTarget = action.split(':').pop().trim();
            if (screenTarget) {
              if (window.closeWebDrawer) window.closeWebDrawer();
              state.activeNav = screenTarget;
              state.activeTab = screenTarget;
              updateDOM();

              var lowerTarget = screenTarget.toLowerCase();
              var targetFile = lowerTarget;
              if (lowerTarget === 'home' || lowerTarget === 'homescreen') {
                targetFile = 'index.html';
              } else if (!lowerTarget.endsWith('screen') && lowerTarget !== 'index.html') {
                targetFile = lowerTarget + 'screen.html';
              } else if (!lowerTarget.endsWith('.html')) {
                targetFile = lowerTarget + '.html';
              }

              if (window.location.protocol === 'file:' || window.location.pathname.endsWith('.html')) {
                window.location.href = './' + targetFile;
              } else {
                var targetRoute = lowerTarget === 'home' ? '/' : '/' + lowerTarget;
                window.location.href = targetRoute;
              }
              return;
            }
          }

          // Generic State Mutators (state:key:val, state:key_append:val, state:key:backspace)
          if (lowerAct.startsWith('state:')) {
            var parts = action.split(':');
            var keyOrOp = parts[1] || '';
            var val = parts.slice(2).join(':');
            if (keyOrOp.endsWith('_append')) {
              var realKey = keyOrOp.replace(/_append$/, '');
              state[realKey] = (state[realKey] !== undefined ? String(state[realKey]) : '') + val;
            } else if (keyOrOp === 'dial_input_backspace' || keyOrOp.endsWith('_backspace') || val === 'backspace') {
              var realKey = keyOrOp === 'dial_input_backspace' ? 'dial_input' : keyOrOp.replace(/_backspace$/, '');
              state[realKey] = state[realKey] ? String(state[realKey]).slice(0, -1) : '';
            } else if (keyOrOp.endsWith('_clear') || val === 'clear') {
              var realKey = keyOrOp.replace(/_clear$/, '');
              state[realKey] = '';
            } else if (val !== undefined && val !== '') {
              state[keyOrOp] = val;
            }
            updateDOM();
          }

          // Named App Actions
          if (lowerAct.startsWith('action:')) {
            var actName = action.replace(/^action:/i, '');
            if (actName === 'unlock_door') {
              state.gate_status = '🔓 Gate Unlocked (10s)';
              updateDOM();
              setTimeout(function() { state.gate_status = '🔒 Gate Locked'; updateDOM(); }, 10000);
            } else if (actName === 'toggle_mute') {
              state.mic_muted = (state.mic_muted === 'true') ? 'false' : 'true';
              updateDOM();
            } else if (actName === 'toggle_speaker') {
              state.speaker_on = (state.speaker_on === 'true') ? 'false' : 'true';
              updateDOM();
            }
            updateDOM();
          }

          // Hardware & Multimedia Actions for Web
          if (lowerAct.startsWith('hw:battery')) {
            if (navigator.getBattery) {
              navigator.getBattery().then(function(b) {
                state.sys_battery_level = Math.round(b.level * 100) + '%';
                state.sys_battery_charging = b.charging ? 'Charging ⚡' : 'Discharging (Battery)';
                updateDOM();
              });
            } else {
              state.sys_battery_level = '98%';
              state.sys_battery_charging = 'Web Battery Telemetry Active';
              updateDOM();
            }
            return;
          }
          if (lowerAct.startsWith('hw:gps')) {
            state.sys_gps_lat = 'Acquiring GPS...';
            state.sys_gps_lng = 'Acquiring GPS...';
            state.sys_gps_acc = 'Searching...';
            state.sys_gps_name = 'Requesting Real GPS Permission... 📍';
            updateDOM();

            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(pos) {
                var lat = pos.coords.latitude;
                var lng = pos.coords.longitude;
                state.sys_gps_lat = lat.toFixed(6);
                state.sys_gps_lng = lng.toFixed(6);
                state.sys_gps_acc = pos.coords.accuracy.toFixed(1) + ' m';
                state.sys_gps_name = 'Resolving Location Address... 📍';
                updateDOM();

                fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng)
                  .then(function(r) { return r.json(); })
                  .then(function(data) {
                    if (data && data.address) {
                      var area = data.address.suburb || data.address.neighbourhood || data.address.quarter || data.address.residential || '';
                      var city = data.address.city || data.address.town || data.address.village || data.address.county || 'Real Location';
                      var country = data.address.country || 'Nepal';
                      var fullName = (area ? area + ', ' : '') + city + ', ' + country;
                      state.sys_gps_name = fullName + ' 📍';
                    } else {
                      state.sys_gps_name = 'Real GPS Fix Acquired';
                    }
                    updateDOM();
                  })
                  .catch(function() {
                    state.sys_gps_name = 'Real GPS Coordinates Acquired';
                    updateDOM();
                  });
              }, function(err) {
                state.sys_gps_lat = 'Permission Needed';
                state.sys_gps_lng = 'Allow Location in Browser';
                state.sys_gps_acc = 'Denied';
                state.sys_gps_name = 'Tap "Allow Location" in Chrome URL Bar 🔒';
                updateDOM();
              }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
            } else {
              state.sys_gps_name = 'Geolocation not supported in browser';
              updateDOM();
            }
            return;
          }
          if (lowerAct.startsWith('hw:sensor')) {
            if (window.DeviceOrientationEvent) {
              window.addEventListener('deviceorientation', function(ev) {
                state.sys_sensor_x = (ev.gamma || 0).toFixed(2);
                state.sys_sensor_y = (ev.beta || 0).toFixed(2);
                state.sys_sensor_z = (ev.alpha || 0).toFixed(2);
                updateDOM();
              }, { once: true });
            }
            state.sys_sensor_x = (Math.random() * 2 - 1).toFixed(2);
            state.sys_sensor_y = (Math.random() * 2 - 1).toFixed(2);
            state.sys_sensor_z = (9.8 + Math.random() * 0.2).toFixed(2);
            updateDOM();
            return;
          }
          if (lowerAct.startsWith('hw:ringtone')) {
            try {
              var ctx = new (window.AudioContext || window.webkitAudioContext)();
              var osc = ctx.createOscillator();
              var gain = ctx.createGain();
              osc.type = lowerAct.includes('dial') ? 'sine' : 'triangle';
              osc.frequency.setValueAtTime(lowerAct.includes('dial') ? 440 : 880, ctx.currentTime);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.8);
              osc.stop(ctx.currentTime + 0.8);
              state.sys_ringtone_status = lowerAct.includes('dial') ? 'Playing Dial Tone Beep 📞' : 'Ringtone Chime Playing 🔔';
              updateDOM();
            } catch (e) {
              state.sys_ringtone_status = 'Web Audio Chime Active 🔔';
              updateDOM();
            }
            return;
          }
          if (lowerAct.startsWith('hw:vibrate')) {
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            state.notification = 'Web Device Vibrating... 📳';
            updateDOM();
            return;
          }
          if (lowerAct.startsWith('hw:bluetooth')) {
            if (navigator.bluetooth) {
              navigator.bluetooth.requestDevice({ acceptAllDevices: true }).then(function(dev) {
                state.notification = 'Bluetooth Connected: ' + dev.name;
                updateDOM();
              }).catch(function(err) {
                state.notification = 'Web Bluetooth: ' + err.message;
                updateDOM();
              });
            } else {
              state.notification = 'Web Bluetooth requires HTTPS or localhost.';
              updateDOM();
            }
            return;
          }
          if (lowerAct.startsWith('hw:mic:start') || lowerAct === 'mic:start') {
            if (window.DolphinWebMic) window.DolphinWebMic.start(state, updateDOM);
            return;
          }
          if (lowerAct.startsWith('hw:mic:stop') || lowerAct === 'mic:stop') {
            if (window.DolphinWebMic) window.DolphinWebMic.stop(state, updateDOM);
            return;
          }
          if (lowerAct.startsWith('hw:mic:play') || lowerAct === 'mic:play') {
            if (window.DolphinWebMic) window.DolphinWebMic.play(state, updateDOM);
            return;
          }
          if (lowerAct.startsWith('hw:camera:snap') || lowerAct.startsWith('hw:storage:pick') || lowerAct === 'camera:snap' || lowerAct === 'storage:pick') {
            var acceptType = lowerAct.includes('storage') ? 'audio/*,video/*,image/*' : 'image/*';
            if (window.DolphinWebCamera) {
              window.DolphinWebCamera.pickFile(acceptType, state, updateDOM, function(file, url) {
                state.sys_picked_audio_name = file.name;
                state.sys_picked_audio_url = url;
                state.sys_picked_video_url = url;
                state.notification = 'File Picked in Web: ' + file.name;
                updateDOM();
              });
            }
            return;
          }

          // Standard & Custom Web Actions
          if (action === 'app.toggleTheme' || action === 'theme:toggle' || action === 'app:toggleTheme' || action === 'theme') {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme-mode', state.theme);
            document.body.setAttribute('data-theme-mode', state.theme);
            document.documentElement.classList.toggle('dark', state.theme === 'dark');
            document.body.classList.toggle('dark', state.theme === 'dark');
            updateDOM();
          } else if (action === 'counter:increment' || action === 'counter.increment' || action === 'app.increment') {
            state.counter = (typeof state.counter === 'number' ? state.counter : 0) + 1;
            updateDOM();
          } else if (action === 'counter:decrement' || action === 'counter.decrement' || action === 'app.decrement') {
            state.counter = (typeof state.counter === 'number' ? state.counter : 0) - 1;
            updateDOM();
          } else if (action === 'app.resetAll' || action === 'store.reset' || action === 'store:reset' || action === 'app:resetAll' || action === 'app.reset') {
            state.counter = 0;
            state.isLoggedIn = false;
            state.userStatus = 'Guest User (Reset Completed 🔄)';
            state.notification = 'NanoStore State Reset Completed! ⚡';
            if (tempTimers.notification) clearTimeout(tempTimers.notification);
            updateDOM();
          } else if (action === 'app.submitForm' || action === 'form:submit') {
            state.form_status = 'Form Submitted Successfully! ✅ (' + new Date().toLocaleTimeString() + ')';
            state.notification = 'Form Data Validated & Hydrated into NanoStore! ⚡';
            updateDOM();
          } else if (action === 'app.resetForm' || action === 'form:reset') {
            state.form_name = 'Shankar Phuyal';
            state.form_email = 'shankar@dolphin.dev';
            state.form_role = 'Industrial HMI Architect ⚙️';
            state.form_freq = '500';
            state.form_status = 'Form Reset Completed 🔄';
            updateDOM();
          } else if (action === 'app.toggleLogin') {
            state.isLoggedIn = !state.isLoggedIn;
            state.userStatus = state.isLoggedIn ? 'Logged In (Shankar Phuyal) 🔑' : 'Guest User (Logged Out)';
            updateDOM();
          } else if (action === 'app.showToast') {
            if (tempTimers.notification) clearTimeout(tempTimers.notification);
            state.notification = '⏳ Temporary Toast Active (Auto-reverts in 3s)';
            tempTimers.notification = setTimeout(function() {
              state.notification = initialState.notification || 'Welcome to test-apk NanoStore!';
              updateDOM();
            }, 3000);
            updateDOM();
          }

          // Universal Action Forwarder to Backend Server (Syncs with Node/Kotlin Core)
          try {
            fetch('/action', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: action, value: '' })
            }).catch(function() {});
          } catch (e) {}
        });

        // Forward live search/text input events with action
        document.addEventListener('input', function(e) {
          var el = e.target;
          if (!el) return;
          var act = el.getAttribute('data-action') || el.getAttribute('action');
          if (act) {
            try {
              fetch('/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: act, value: el.value })
              }).catch(function() {});
            } catch(e) {}
          }
        });
      })();
    </script>
</body>
</html>`;
    }

    _resolveGradientString(gradStr) {
        if (!gradStr) return '';
        if (gradStr.includes('danphe')) {
            return 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 33%, #047857 66%, #f59e0b 100%)';
        }
        if (gradStr.includes('aurora')) {
            return 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 33%, #065f46 66%, #10b981 100%)';
        }
        const parts = String(gradStr).split('-');
        let dir = '135deg';
        let c1Name = 'blue-600', c2Name = 'cyan-400';
        if (parts.length >= 6 && parts[1] === 'vert') {
            dir = 'to bottom'; c1Name = parts[2] + '-' + parts[3]; c2Name = parts[4] + '-' + parts[5];
        } else if (parts.length >= 6 && parts[1] === 'horiz') {
            dir = 'to right'; c1Name = parts[2] + '-' + parts[3]; c2Name = parts[4] + '-' + parts[5];
        } else if (parts.length >= 6 && parts[1].endsWith('deg')) {
            dir = parts[1]; c1Name = parts[2] + '-' + parts[3]; c2Name = parts[4] + '-' + parts[5];
        } else if (parts.length >= 5) {
            c1Name = parts[1] + '-' + parts[2]; c2Name = parts[3] + '-' + parts[4];
        } else if (parts.length >= 3) {
            c1Name = parts[1]; c2Name = parts[2];
        }

        const colorMap = {
            'blue-600': '#2563eb', 'cyan-400': '#22d3ee', 'purple-600': '#9333ea', 'pink-500': '#ec4899',
            'slate-800': '#1e293b', 'slate-950': '#020617', 'indigo-600': '#4f46e5', 'rose-500': '#f43f5e',
            'amber-500': '#f59e0b', 'emerald-500': '#10b981', 'teal-500': '#14b8a6', 'sky-400': '#38bdf8'
        };

        const hex1 = colorMap[c1Name] || '#2563eb';
        const hex2 = colorMap[c2Name] || '#ec4899';
        return `linear-gradient(${dir}, ${hex1}, ${hex2})`;
    }

    _classNameToStyle(className) {
        if (!className) return '';
        const TW_COLOR_MAP = {
            'orange-50': '#fff7ed', 'orange-100': '#ffedd5', 'orange-200': '#fed7aa', 'orange-300': '#fdba74', 'orange-400': '#fb923c', 'orange-500': '#f97316', 'orange-600': '#ea580c', 'orange-700': '#c2410c', 'orange-800': '#9a3412', 'orange-900': '#7c2d12',
            'red-50': '#fef2f2', 'red-100': '#fee2e2', 'red-200': '#fecaca', 'red-300': '#fca5a5', 'red-400': '#f87171', 'red-500': '#ef4444', 'red-600': '#dc2626', 'red-700': '#b91c1c', 'red-800': '#991b1b', 'red-900': '#7f1d1d',
            'rose-400': '#fb7185', 'rose-500': '#f43f5e', 'rose-600': '#e11d48', 'rose-700': '#be123c',
            'blue-50': '#eff6ff', 'blue-100': '#dbeafe', 'blue-200': '#bfdbfe', 'blue-300': '#93c5fd', 'blue-400': '#60a5fa', 'blue-500': '#3b82f6', 'blue-600': '#2563eb', 'blue-700': '#1d4ed8', 'blue-800': '#1e40af', 'blue-900': '#1e3a8a',
            'indigo-50': '#eef2ff', 'indigo-100': '#e0e7ff', 'indigo-200': '#c7d2fe', 'indigo-300': '#a5b4fc', 'indigo-400': '#818cf8', 'indigo-500': '#6366f1', 'indigo-600': '#4f46e5', 'indigo-700': '#4338ca', 'indigo-800': '#3730a3', 'indigo-900': '#312e81',
            'cyan-400': '#22d3ee', 'cyan-500': '#06b6d4', 'cyan-600': '#0891b2',
            'sky-400': '#38bdf8', 'sky-500': '#0ea5e9', 'sky-600': '#0284c7',
            'teal-400': '#2dd4bf', 'teal-500': '#14b8a6', 'teal-600': '#0d9488',
            'green-50': '#f0fdf4', 'green-100': '#dcfce7', 'green-200': '#bbf7d0', 'green-300': '#86efac', 'green-400': '#4ade80', 'green-500': '#22c55e', 'green-600': '#16a34a', 'green-700': '#15803d', 'green-800': '#166534', 'green-900': '#14532d',
            'emerald-50': '#ecfdf5', 'emerald-100': '#d1fae5', 'emerald-200': '#a7f3d0', 'emerald-300': '#6ee7b7', 'emerald-400': '#34d399', 'emerald-500': '#10b981', 'emerald-600': '#059669', 'emerald-700': '#047857', 'emerald-800': '#065f46', 'emerald-900': '#064e3b',
            'fuchsia-400': '#e879f9', 'fuchsia-500': '#d946ef', 'fuchsia-600': '#c026d3',
            'violet-400': '#a78bfa', 'violet-500': '#8b5cf6', 'violet-600': '#7c3aed',
            'pink-400': '#f472b6', 'pink-500': '#ec4899', 'pink-600': '#db2777',
            'slate-50': '#f8fafc', 'slate-100': '#f1f5f9', 'slate-200': '#e2e8f0', 'slate-300': '#cbd5e1', 'slate-400': '#94a3b8', 'slate-500': '#64748b', 'slate-600': '#475569', 'slate-700': '#334155', 'slate-800': '#1e293b', 'slate-900': '#0f172a',
            'gray-50': '#f9fafb', 'gray-100': '#f3f4f6', 'gray-200': '#e5e7eb', 'gray-300': '#d1d5db', 'gray-400': '#9ca3af', 'gray-500': '#6b7280', 'gray-600': '#4b5563', 'gray-700': '#374151', 'gray-800': '#1f2937', 'gray-900': '#111827',
            'amber-50': '#fffbeb', 'amber-100': '#fef3c7', 'amber-200': '#fde68a', 'amber-300': '#fcd34d', 'amber-400': '#fbbf24', 'amber-500': '#f59e0b', 'amber-600': '#d97706', 'amber-700': '#b45309', 'amber-800': '#92400e', 'amber-900': '#78350f',
            'purple-50': '#faf5ff', 'purple-100': '#f3e8ff', 'purple-200': '#e9d5ff', 'purple-300': '#d8b4fe', 'purple-400': '#c084fc', 'purple-500': '#a855f7', 'purple-600': '#9333ea', 'purple-700': '#7e22ce', 'purple-800': '#6b21a8', 'purple-900': '#581c87',
        };

        const normalizedClass = String(className)
            .replace(/\[([^\]]+)\]/g, '$1')
            .replace(/\s+/g, ' ')
            .trim();
        const classes = normalizedClass.split(/\s+/);
        const styles = [];

        // Parse Gradient Backgrounds (bg-gradient-to-*, from-*, via-*, to-*)
        const hasGradient = classes.some(c => c.startsWith('bg-gradient-to-'));
        if (hasGradient) {
            const dirClass = classes.find(c => c.startsWith('bg-gradient-to-')) || 'bg-gradient-to-r';
            let dir = 'to right';
            if (dirClass.includes('-r')) dir = 'to right';
            else if (dirClass.includes('-l')) dir = 'to left';
            else if (dirClass.includes('-t')) dir = 'to top';
            else if (dirClass.includes('-b')) dir = 'to bottom';
            else if (dirClass.includes('-tr')) dir = 'to top right';
            else if (dirClass.includes('-br')) dir = 'to bottom right';

            const fromClass = classes.find(c => c.startsWith('from-'));
            const viaClass = classes.find(c => c.startsWith('via-'));
            const toClass = classes.find(c => c.startsWith('to-'));

            const resolveColor = (cls) => {
                if (!cls) return null;
                const name = cls.replace(/^(from|via|to)-/, '');
                if (TW_COLOR_MAP[name]) return TW_COLOR_MAP[name];
                if (name === 'white') return '#ffffff';
                if (name === 'black') return '#000000';
                if (name.startsWith('#')) return name;
                return null;
            };

            const fromColor = resolveColor(fromClass) || '#3b82f6';
            const viaColor = resolveColor(viaClass);
            const toColor = resolveColor(toClass) || '#ec4899';

            let gradCss = `linear-gradient(${dir}, ${fromColor}`;
            if (viaColor) gradCss += `, ${viaColor}`;
            gradCss += `, ${toColor})`;

            styles.push(`background-image:${gradCss} !important`);
        }

        classes.forEach(c => {
            if (!c) return;
            if (c === 'p-0') styles.push('padding:0px');
            else if (c === 'p-1') styles.push('padding:4px');
            else if (c === 'p-2') styles.push('padding:8px');
            else if (c === 'p-2.5') styles.push('padding:10px');
            else if (c === 'p-3') styles.push('padding:12px');
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

            else if (c === 'relative') styles.push('position:relative');
            else if (c === 'absolute') styles.push('position:absolute');
            else if (c === '-top-3') styles.push('top:-10px');
            else if (c === 'left-3') styles.push('left:12px');
            else if (c === 'z-10') styles.push('z-index:10');
            else if (c === 'm-4') styles.push('margin:16px');
            else if (c === 'mt-1') styles.push('margin-top:4px');
            else if (c === 'mt-2') styles.push('margin-top:8px');
            else if (c === 'mb-2') styles.push('margin-bottom:8px');

            else if (c === 'gap-1') styles.push('gap:4px');
            else if (c === 'gap-2') styles.push('gap:8px');
            else if (c === 'gap-3') styles.push('gap:12px');
            else if (c === 'gap-4') styles.push('gap:16px');
            else if (c === 'gap-6') styles.push('gap:24px');
            else if (c === 'gap-8') styles.push('gap:32px');

            else if (c === 'flex') styles.push('display:flex');
            else if (c === 'grid') styles.push('display:grid');
            else if (c === 'flex-row') styles.push('flex-direction:row');
            else if (c === 'flex-column' || c === 'flex-col') styles.push('flex-direction:column');
            else if (c === 'items-center') styles.push('align-items:center');
            else if (c === 'justify-center') styles.push('justify-content:center');
            else if (c === 'justify-between') styles.push('justify-content:space-between');
            else if (c === 'flex-1') styles.push('flex:1');
            else if (c === 'w-full') styles.push('width:100%');
            else if (c === 'h-full') styles.push('height:100%');
            else if (c === 'min-h-screen') styles.push('min-height:100vh');

            else if (c.startsWith('rounded-')) {
                const rVal = c.replace('rounded-', '');
                if (rVal === 'sm') styles.push('border-radius:2px');
                else if (rVal === 'md') styles.push('border-radius:6px');
                else if (rVal === 'lg') styles.push('border-radius:8px');
                else if (rVal === 'xl') styles.push('border-radius:12px');
                else if (rVal === '2xl') styles.push('border-radius:16px');
                else if (rVal === '3xl') styles.push('border-radius:24px');
                else if (rVal === 'full') styles.push('border-radius:9999px');
                else {
                    const num = parseInt(rVal, 10);
                    if (!isNaN(num)) styles.push(`border-radius:${num}px`);
                }
            } else if (c === 'rounded') {
                styles.push('border-radius:4px');
            } else if (c.startsWith('bg-') && !c.startsWith('bg-gradient-to-')) {
                const colorKey = c.replace('bg-', '');
                if (TW_COLOR_MAP[colorKey]) styles.push(`background-color:${TW_COLOR_MAP[colorKey]}`);
                else if (colorKey === 'white') styles.push('background-color:#ffffff');
                else if (colorKey === 'black') styles.push('background-color:#000000');
            } else if (c.startsWith('text-')) {
                const colorKey = c.replace('text-', '');
                if (TW_COLOR_MAP[colorKey]) styles.push(`color:${TW_COLOR_MAP[colorKey]}`);
                else if (colorKey === 'white') styles.push('color:#ffffff');
                else if (colorKey === 'black') styles.push('color:#000000');
            }
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

module.exports = DolphinWebEngine;
