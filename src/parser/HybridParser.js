'use strict';

const HTMLParser = require('./HTMLParser');
const { performance } = require('perf_hooks');
const callbackRegistry = require('../runtime/CallbackRegistry');
const ub = require('../framework/ub');

/**
 * 🌊 HybridParser - Supports both HTML strings and JSX components
 * Automatically detects input type and renders accordingly
 * UPGRADED: 24-byte Protocol Support (v2.0) + Full CSS Props
 */
class HybridParser {
    constructor(config = {}) {
        this.config = {
            platform: config.platform || 'NATIVE',
            debug: config.debug || false,
            enableJSX: config.enableJSX !== false,
            ...config
        };
        
        this.htmlParser = new HTMLParser(this.config);
        this.jsxCache = new Map();
        this.callbackRegistry = callbackRegistry;
        
        this._log('🌊 HybridParser v2.0 (24-byte) initialized');
        this._log(`   Platform: ${this.config.platform}`);
        this._log(`   JSX Support: ${this.config.enableJSX ? 'ON' : 'OFF'}`);
        this._log(`   Lambda Support: ENABLED`);
    }

    /**
     * Parse and render content - auto-detects HTML vs JSX
     * @param {string|object} content - HTML string or JSX component
     * @param {object} options - Parse options
     */
    parse(content, options = {}) {
        const startTime = performance.now();
        
        try {
            const contentType = this._detectContentType(content);
            
            let result;
            switch (contentType) {
                case 'UI_SCHEMA':
                    result = { content };
                    break;
                case 'JSX':
                    result = this._parseJSX(content, options);
                    break;
                case 'HTML':
                    result = this._parseHTML(content, options);
                    break;
                case 'COMPONENT':
                    result = this._parseComponent(content, options);
                    break;
                default:
                    throw new Error(`Unsupported content type: ${contentType}`);
            }
            
            const parseTime = performance.now() - startTime;
            this._log(`✅ ${contentType} parsed successfully (${parseTime.toFixed(2)}ms)`);
            
            return {
                ...result,
                contentType,
                parseTime,
                success: true
            };
            
        } catch (error) {
            this._log(`❌ Parse failed: ${error.message}`);
            return {
                success: false,
                error: error.message,
                contentType: 'UNKNOWN'
            };
        }
    }

    /**
     * Auto-detect content type
     * @param {string|object} content 
     */
    _detectContentType(content) {
        if (content && typeof content === 'object' && content.$$typeof === Symbol.for('react.element')) {
            return 'COMPONENT';
        }

        if (typeof content === 'function') {
            try {
                const element = content();
                if (element && element.$$typeof === Symbol.for('react.element')) {
                    return 'COMPONENT';
                }
            } catch (e) {}
            return 'JSX';
        }
        
        if (typeof content === 'object' && content !== null) {
            if (typeof content.type === 'string') {
                return 'UI_SCHEMA';
            }
            if (content.render) {
                return 'COMPONENT';
            }
        }
        
        if (typeof content === 'string') {
            if (this._containsJSXSyntax(content)) {
                return 'JSX';
            }
            return 'HTML';
        }
        
        return 'UNKNOWN';
    }

    /**
     * Check if string contains JSX syntax
     * @param {string} str 
     */
    _containsJSXSyntax(str) {
        const jsxIndicators = [
            /import\s+.*from\s+['"]react['"]/,
            /export\s+default/,
            /const\s+\w+\s*=\s*\(\)\s*=>\s*<[^>]+>/,
            /function\s+\w+\(\)\s*{[\s\S]*return\s*<[^>]+>/,
            /class\s+\w+\s+extends\s+React\.Component/,
            /<\w+[^>]*>[\s\S]*<\/\w+>/,
            /\{\s*\w+\.\w+\s*\}/,
            /\{\s*\w+\s*\}/,
            /stateKey:\s*['"]?\w+['"]?/
        ];
        
        return jsxIndicators.some(pattern => pattern.test(str));
    }

    /**
     * Parse JSX content
     * @param {string|function} jsxContent 
     * @param {object} options 
     */
    _parseJSX(jsxContent, options = {}) {
        if (!this.config.enableJSX) {
            throw new Error('JSX support is disabled');
        }

        const cacheKey = this._generateCacheKey(jsxContent, options);
        
        if (this.jsxCache.has(cacheKey)) {
            this._log('📦 Using cached JSX compilation');
            return this.jsxCache.get(cacheKey);
        }

        try {
            let jsxString;
            
            if (typeof jsxContent === 'function') {
                jsxString = jsxContent.toString();
            } else {
                jsxString = jsxContent;
            }

            const htmlEquivalent = this._jsxToHtml(jsxString);
            
            const result = this.htmlParser.parse(htmlEquivalent, {
                ...options,
                originalType: 'JSX'
            });

            this.jsxCache.set(cacheKey, result);
            
            return {
                ...result,
                originalJSX: jsxString,
                convertedHTML: htmlEquivalent
            };

        } catch (error) {
            throw new Error(`JSX parsing failed: ${error.message}`);
        }
    }

    /**
     * Parse HTML content
     * @param {string} htmlContent 
     * @param {object} options 
     */
    _parseHTML(htmlContent, options = {}) {
        return this.htmlParser.parse(htmlContent, options);
    }

    /**
     * Parse component object (React element or function component)
     */
    _parseComponent(component, options = {}) {
        if (component && component.$$typeof === Symbol.for('react.element')) {
            const schema = this._reactElementToSchema(component);
            if (schema) {
                return { content: schema, html: null, convertedHTML: null };
            }
            const htmlString = this._reactElementToHtml(component);
            const result = this._parseHTML(htmlString, options);
            return { ...result, content: result.ast, convertedHTML: htmlString };
        }
        
        if (typeof component === 'function') {
            try {
                const element = component();
                if (element && element.$$typeof === Symbol.for('react.element')) {
                    return this._parseComponent(element, options);
                }
            } catch (e) {}
        }
        
        if (component && component.render && typeof component.render === 'function') {
            return this._parseJSX(component.render, options);
        }
        
        throw new Error('Unsupported component format');
    }

    // ─────────────────────────────────────────────────────────────────────
    // REACT ELEMENT → DOLPHIN NATIVE SCHEMA (24-byte)
    // ─────────────────────────────────────────────────────────────────────

    _reactElementToSchema(element) {
        if (element === null || element === undefined) return null;

        if (typeof element === 'string' || typeof element === 'number') {
            const text = String(element).trim();
            return text ? { type: 'Text', text } : null;
        }

        if (Array.isArray(element)) {
            return element.map(e => this._reactElementToSchema(e)).filter(Boolean);
        }

        if (typeof element !== 'object') return null;

        const { type, props = {} } = element;
        if (element.key !== null && element.key !== undefined) {
            if (props.key === undefined) props.key = element.key;
            if (props.stateKey === undefined) props.stateKey = element.key;
        }

        if (typeof type === 'function') {
            try {
                const rendered = type(props);
                if (!rendered) return null;
                if (!rendered.$$typeof) {
                    return this._processSchemaChildren(rendered);
                }
                return this._reactElementToSchema(rendered);
            } catch (e) {
                return null;
            }
        }

        if (typeof type !== 'string') return null;

        const rawChildren = props.children;
        const childArray = Array.isArray(rawChildren)
            ? rawChildren
            : (rawChildren !== undefined && rawChildren !== null ? [rawChildren] : []);

        const childSchemas = childArray
            .map(c => this._reactElementToSchema(c))
            .flat(Infinity)
            .filter(Boolean);

        return this._htmlElementToSchema(type, props, childSchemas);
    }

    _processSchemaChildren(schema) {
        if (!schema || typeof schema !== 'object') return schema;
        const out = { ...schema };
        if (Array.isArray(out.children)) {
            out.children = out.children
                .map(c => {
                    if (c && c.$$typeof) return this._reactElementToSchema(c);
                    return c;
                })
                .filter(Boolean);
        }
        return out;
    }

    // ─── 🆕 CSS Props Extraction ──────────────────────────────────────────────
    
    /**
     * Extract CSS props from className
     * @param {string} className - Tailwind classes
     * @returns {Object} - CSS props
     */
    _extractCSSProps(className) {
        if (!className || typeof className !== 'string') return {};
        
        const props = {};
        const classes = className.split(/\s+/).filter(Boolean);
        
        classes.forEach(cls => {
            // ── Width ──
            if (cls === 'w-full' || cls === 'w-screen') {
                props.width = -1;
            } else if (cls.startsWith('w-')) {
                const val = parseInt(cls.slice(2));
                if (!isNaN(val)) props.width = val * 4;
            }
            
            // ── Height ──
            if (cls === 'h-full' || cls === 'h-screen') {
                props.height = -1;
            } else if (cls.startsWith('h-')) {
                const val = parseInt(cls.slice(2));
                if (!isNaN(val)) props.height = val * 4;
            }
            
            // ── Padding ──
            if (cls === 'p-0') props.padding = 0;
            else if (cls.startsWith('p-')) {
                const val = parseInt(cls.slice(2));
                if (!isNaN(val)) props.padding = val * 4;
            }
            
            // ── Margin ──
            if (cls === 'm-0') props.margin = 0;
            else if (cls.startsWith('m-')) {
                const val = parseInt(cls.slice(2));
                if (!isNaN(val)) props.margin = val * 4;
            }
            
            // ── Background Color ──
            const bgMatch = cls.match(/^bg-([a-z]+)-?(\d+)?/);
            if (bgMatch) {
                const color = bgMatch[1];
                const shade = bgMatch[2] || '500';
                props.backgroundColor = `${color}-${shade}`;
            }
            if (cls === 'bg-white') props.backgroundColor = 'white';
            if (cls === 'bg-black') props.backgroundColor = 'black';
            if (cls === 'bg-transparent') props.backgroundColor = 'transparent';
            
            // ── Text Color ──
            const textMatch = cls.match(/^text-([a-z]+)-?(\d+)?/);
            if (textMatch) {
                const color = textMatch[1];
                const shade = textMatch[2] || '500';
                props.color = `${color}-${shade}`;
            }
            if (cls === 'text-white') props.color = 'white';
            if (cls === 'text-black') props.color = 'black';
            
            // ── Border Radius ──
            if (cls === 'rounded') props.borderRadius = 4;
            else if (cls === 'rounded-sm') props.borderRadius = 2;
            else if (cls === 'rounded-md') props.borderRadius = 6;
            else if (cls === 'rounded-lg') props.borderRadius = 8;
            else if (cls === 'rounded-xl') props.borderRadius = 12;
            else if (cls === 'rounded-2xl') props.borderRadius = 16;
            else if (cls === 'rounded-3xl') props.borderRadius = 24;
            else if (cls === 'rounded-full') props.borderRadius = 999;
            else if (cls.startsWith('rounded-')) {
                const val = parseInt(cls.slice(8));
                if (!isNaN(val)) props.borderRadius = val;
            }
            
            // ── Border ──
            if (cls === 'border' || cls === 'border-2' || cls === 'border-4') {
                props.borderColor = '#d1d5db';
            }
            if (cls.startsWith('border-') && cls.includes('-')) {
                const parts = cls.split('-');
                if (parts.length >= 2) {
                    props.borderColor = parts[1];
                    if (parts[2]) props.borderColor += `-${parts[2]}`;
                }
            }
            
            // ── Font Size ──
            if (cls === 'text-xs') props.fontSize = 10;
            else if (cls === 'text-sm') props.fontSize = 12;
            else if (cls === 'text-base') props.fontSize = 14;
            else if (cls === 'text-lg') props.fontSize = 16;
            else if (cls === 'text-xl') props.fontSize = 20;
            else if (cls === 'text-2xl') props.fontSize = 24;
            else if (cls === 'text-3xl') props.fontSize = 30;
            else if (cls === 'text-4xl') props.fontSize = 36;
            else if (cls === 'text-5xl') props.fontSize = 48;
            else if (cls === 'text-6xl') props.fontSize = 60;
            else if (cls === 'text-7xl') props.fontSize = 72;
            else if (cls === 'text-8xl') props.fontSize = 96;
            
            // ── Opacity ──
            if (cls.startsWith('opacity-')) {
                const val = parseInt(cls.slice(8));
                if (!isNaN(val)) props.opacity = val / 100;
            }
            
            // ── Box Shadow ──
            if (cls === 'shadow' || cls === 'shadow-md') props.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
            else if (cls === 'shadow-lg') props.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
            else if (cls === 'shadow-xl') props.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
            else if (cls === 'shadow-2xl') props.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.25)';
            else if (cls === 'shadow-none') props.boxShadow = 'none';
        });
        
        return props;
    }

    // ─────────────────────────────────────────────────────────────────────
    // HTML ELEMENT → SCHEMA (24-byte UPGRADED)
    // ─────────────────────────────────────────────────────────────────────

    _htmlElementToSchema(tag, props, childSchemas) {
        let cls = props.className || props.class || '';
        const mobileCls = cls.replace(/(?:^|\s)\[[^\]]*\]/g, '').trim();
        const clsArr = mobileCls.split(/\s+/).filter(Boolean);
        const action = props.action || props['data-action'] || '';

        // ─── Parse with ub.parseTW for 24-byte fields ───
        const twProps = ub.parseTW(mobileCls);

        // ─── Extract CSS Props for FormEngine ───
        const cssProps = this._extractCSSProps(mobileCls);

        const DOLPHIN_TYPES = new Set([
            'Screen','Row','Column','Container','Card','Button','Text',
            'Image','Icon','TextField','Slider','Switch','Checkbox','Select',
            'Radio','FileUpload','ListView','GridView','Modal','TabBar','tab-bar','tabbar',
            'videoplayer', 'VideoPlayer', 'mp3player', 'Mp3Player', 'cameraview', 'CameraView', 'calendar'
        ]);
        const isTabBarType = props.type === 'TabBar' || props.type === 'tab-bar' || props.type === 'tabbar';
        const propsType = props.type && (DOLPHIN_TYPES.has(props.type) || isTabBarType || (typeof props.type === 'string' && props.type.startsWith('0x'))) ? props.type : null;
        const tagLower = (tag || '').toLowerCase();

        let type = 'Container';
        if (isTabBarType) {
            type = 'Row';
            props.target = props.target || 'mobile';
            const defaultTabBarClasses = ['fixed', 'bottom-0', 'left-0', 'right-0', 'w-full', 'flex-row', 'items-center', 'justify-around', 'z-50', 'md:hidden'];
            defaultTabBarClasses.forEach(clsName => {
                if (!clsArr.includes(clsName)) {
                    clsArr.push(clsName);
                }
            });
            cls = clsArr.join(' ');
            props.className = cls;
        } else if (propsType) {
            type = propsType;
        } else if (tagLower === 'button' || clsArr.includes('btn')) {
            type = 'Button';
        } else if (tagLower === 'i' || clsArr.some(c => /^fa-[a-z0-9-]+$/i.test(c))) {
            type = 'Icon';
        } else if (tagLower === 'div' && action) {
            const isComplex = childSchemas.some(c => !['Text', 'option'].includes(c.type));
            type = isComplex ? 'Container' : 'Button';
        } else if (['h1','h2','h3','h4','h5','h6','p','span','label'].includes(tagLower)) {
            type = 'Text';
        } else if (['table', 'tbody', 'thead', 'tfoot', 'ul', 'ol'].includes(tagLower)) {
            type = 'Column';
        } else if (tagLower === 'tr' || tagLower === 'li') {
            type = 'Row';
        } else if (['th', 'td'].includes(tagLower)) {
            type = 'Column';
            if (!clsArr.some(c => c.startsWith('flex-'))) {
                clsArr.push('flex-1');
                props.className = clsArr.join(' ');
            }
        } else if (clsArr.some(c => c === 'row' || c === 'flex-row')) {
            type = 'Row';
        } else if (clsArr.some(c => c === 'column' || c === 'flex-column' || c === 'flex-col')) {
            type = 'Column';
        } else if (clsArr.some(c => c === 'card' || c === 'card-body' || c === 'card-header')) {
            type = 'Card';
        } else if (tagLower === 'input') {
            if (props.type === 'checkbox' || props.type === 'radio') {
                type = 'Checkbox';
            } else if (props.type === 'range') {
                type = 'Slider';
            } else {
                type = 'TextField';
            }
        } else if (tagLower === 'select') {
            type = 'Select';
        } else if (tagLower === 'option') {
            type = 'option';
        } else if (tagLower === 'form') {
            type = 'Column';
        } else if (tagLower === 'img' || tagLower === 'image') {
            type = 'Image';
        } else if (tagLower === 'video') {
            type = 'VideoPlayer';
        } else if (tagLower === 'header') {
            type = 'AppBar';
        } else if (tagLower === 'footer') {
            type = 'Row';
            const defaultTabBarClasses = ['fixed', 'bottom-0', 'left-0', 'right-0', 'w-full', 'flex-row', 'items-center', 'justify-around', 'z-50'];
            defaultTabBarClasses.forEach(clsName => {
                if (!clsArr.includes(clsName)) {
                    clsArr.push(clsName);
                }
            });
            cls = clsArr.join(' ');
            props.className = cls;
        } else if (['thorvg', 'nativecanvas', 'gauge', 'vectorcanvas', 'svg', 'vector'].includes(tagLower)) {
            type = 'ThorVG';
        } else if (['state', 'statetext', 'state-text'].includes(tagLower)) {
            type = 'State';
        }

        const schema = { type };

        // ─── Default sizes for headings ───
        if (tagLower === 'h1') schema.size = 24;
        else if (tagLower === 'h2') schema.size = 20;
        else if (tagLower === 'h3') schema.size = 18;
        else if (tagLower === 'h4') schema.size = 16;
        else if (tagLower === 'h5') schema.size = 14;
        else if (tagLower === 'h6') schema.size = 12;
        if (['h1','h2','h3','h4','h5','h6'].includes(tagLower)) schema.bold = true;

        // ─── Class → schema props ───
        clsArr.forEach(c => {
            if (c.startsWith('p-')) schema.p = parseInt(c.slice(2)) * 4;
            else if (c.startsWith('pt-')) schema.pt = parseInt(c.slice(3)) * 4;
            else if (c.startsWith('pb-')) schema.pb = parseInt(c.slice(3)) * 4;
            else if (c.startsWith('pl-')) schema.pl = parseInt(c.slice(3)) * 4;
            else if (c.startsWith('pr-')) schema.pr = parseInt(c.slice(3)) * 4;
            else if (c.startsWith('px-')) { schema.pl = schema.pr = parseInt(c.slice(3)) * 4; }
            else if (c.startsWith('py-')) { schema.pt = schema.pb = parseInt(c.slice(3)) * 4; }
            else if (c.startsWith('m-')) schema.m = parseInt(c.slice(2)) * 4;
            else if (c.startsWith('mt-')) schema.mt = parseInt(c.slice(3)) * 4;
            else if (c === 'text-xs') schema.size = 10;
            else if (c === 'text-sm') schema.size = 12;
            else if (c === 'text-base') schema.size = 14;
            else if (c === 'text-lg') schema.size = 16;
            else if (c === 'text-xl') schema.size = 20;
            else if (c === 'text-2xl') schema.size = 24;
            else if (c === 'text-3xl') schema.size = 30;
            else if (c === 'text-4xl') schema.size = 36;
            else if (c === 'text-5xl') schema.size = 48;
            else if (c === 'text-6xl') schema.size = 60;
            else if (c === 'text-7xl') schema.size = 72;
            else if (c === 'text-8xl') schema.size = 96;
            else if (c.startsWith('mb-')) schema.mb = parseInt(c.slice(3)) * 4;
            else if (c.startsWith('ml-')) schema.ml = parseInt(c.slice(3)) * 4;
            else if (c.startsWith('mr-')) schema.mr = parseInt(c.slice(3)) * 4;
            else if (c.startsWith('mx-')) { schema.ml = schema.mr = parseInt(c.slice(3)) * 4; }
            else if (c.startsWith('my-')) { schema.mt = schema.mb = parseInt(c.slice(3)) * 4; }
            else if (c.startsWith('gap-')) schema.gap = parseInt(c.slice(4)) * 4;
            else if (c.startsWith('flex-')) schema.flex = parseInt(c.slice(5));
            else if (c === 'rounded') schema.radius = 4;
            else if (c.startsWith('rounded-')) {
                const r = c.slice(8);
                if (r === 'none') schema.radius = 0;
                else if (r === 'sm') schema.radius = 2;
                else if (r === 'md') schema.radius = 6;
                else if (r === 'lg') schema.radius = 8;
                else if (r === 'xl') schema.radius = 12;
                else if (r === '2xl') schema.radius = 16;
                else if (r === '3xl') schema.radius = 24;
                else if (r === 'full') schema.radius = 255;
                else {
                    const clean = r.replace('[','').replace(']','').replace('px','');
                    const val = parseInt(clean);
                    if (!isNaN(val)) schema.radius = val;
                }
            }
            else if (c === 'flex-1') schema.flex = 1;
            else if (c === 'h-full') schema.height = -1;
            else if (c.startsWith('h-')) schema.height = parseInt(c.slice(2)) * 4;
            else if (c === 'w-full') schema.width = -1;
            else if (c.startsWith('w-')) schema.width = parseInt(c.slice(2)) * 4;
            else if (c === 'shadow' || c === 'shadow-lg') schema.elevation = 4;
            else if (c === 'bg-white' || c === 'bg-slate-50') { schema.bg = 'white'; schema.shade = 254; schema.bgShade = 254; }
            else if (c === 'bg-light' || c === 'bg-slate-100') { schema.bg = 'gray'; schema.shade = 252; schema.bgShade = 252; }
            else if (c === 'bg-black' || c === 'bg-slate-900') { schema.bg = 'black'; schema.shade = 254; schema.bgShade = 254; }
            else if (c.startsWith('bg-gradient-')) { schema.gradient = c.replace('bg-', ''); }
            else if (c.startsWith('bg-grdient-')) { schema.gradient = c.replace('bg-', '').replace('grdient', 'gradient'); }
            else if (c.startsWith('bg-') && c.includes('-')) {
                const parts = c.split('-');
                if (parts.length >= 3) {
                    schema.bg = parts[1];
                    schema.bgShade = parseInt(parts[2]) || 128;
                }
            }
            else if (c === 'text-white') { schema.color = 'white'; schema.shade = 128; schema.colorShade = 128; }
            else if (c === 'text-slate-900' || c === 'text-black') { schema.color = 'black'; schema.shade = 128; schema.colorShade = 128; }
            else if (c.startsWith('text-')) {
                const parts = c.split('-');
                if (parts.length >= 3) {
                    schema.color = parts[1];
                    schema.colorShade = parseInt(parts[2]) || 128;
                    schema.shade = schema.colorShade;
                } else if (parts.length === 2) {
                    schema.color = parts[1];
                    schema.colorShade = 128;
                    schema.shade = 128;
                }
            }
            else if (c === 'overflow-scroll' || c === 'overflow-y-scroll' || c === 'overflow-y-auto' || c === 'scroll-y' || c === 'scrollable') schema.scroll = true;
            else if (c === 'items-center') schema.items = 'center';
            else if (c === 'items-end') schema.items = 'end';
            else if (c === 'justify-center') schema.justify = 'center';
            else if (c === 'justify-between') schema.justify = 'between';
            else if (c.startsWith('opacity-')) {
                const op = parseInt(c.slice(8));
                if (!isNaN(op)) {
                    schema.opacity = op / 100;
                }
            }
        });

        // ─── 🆕 24-byte: Apply ub.parseTW results ───
        if (twProps.width !== undefined) schema.width = twProps.width;
        if (twProps.height !== undefined) schema.height = twProps.height;
        if (twProps.zIndex !== undefined) schema.zIndex = twProps.zIndex;
        if (twProps.colorIndex !== undefined) schema.colorIndex = twProps.colorIndex;
        if (twProps.radiusExtended !== undefined) schema.radiusExtended = twProps.radiusExtended;
        if (twProps.opacity !== undefined) schema.opacity = twProps.opacity / 255;

        // ─── 🆕 CSS Props for FormEngine ───
        if (Object.keys(cssProps).length > 0) {
            schema.cssProps = cssProps;
        }

        // ─── Style props ───
        schema.className = cls;

        if (props.style && typeof props.style === 'object') {
            const st = props.style;
            if (st.height) schema.height = typeof st.height === 'number' ? st.height : parseInt(st.height) || 0;
            if (st.width) schema.width = typeof st.width === 'number' ? st.width : parseInt(st.width) || 0;
            if (st.fontSize) schema.size = typeof st.fontSize === 'number' ? st.fontSize : parseInt(st.fontSize) || 0;
            // ✅ CSS Props from inline style
            if (st.backgroundColor) schema.cssProps = { ...schema.cssProps, backgroundColor: st.backgroundColor };
            if (st.color) schema.cssProps = { ...schema.cssProps, color: st.color };
            if (st.borderRadius) schema.cssProps = { ...schema.cssProps, borderRadius: st.borderRadius };
            if (st.padding) schema.cssProps = { ...schema.cssProps, padding: st.padding };
            if (st.margin) schema.cssProps = { ...schema.cssProps, margin: st.margin };
        }
        if (props.height) schema.height = typeof props.height === 'number' ? props.height : parseInt(props.height) || 0;
        if (props.width) schema.width = typeof props.width === 'number' ? props.width : parseInt(props.width) || 0;
        if (action) schema.action = action;
        if (props.stateKey) schema.stateKey = props.stateKey;
        if (props.gradient) schema.gradient = props.gradient;
        if (props.animation) schema.animation = props.animation;
        if (props.title) schema.title = props.title;
        if (props.src) schema.src = props.src;
        if (props.url) schema.url = props.url;
        if (props.svg) schema.svg = props.svg;
        if (props.d) schema.d = props.d;
        if (props.target) schema.target = props.target;
        if (props.platform) schema.platform = props.platform;

        // ─── TextField ───
        if (type === 'TextField') {
            schema.placeholder = props.placeholder || '';
            schema.stateKey = props.stateKey || props.name || '';
            schema.inputType = props.type || 'text';
            schema.label = props.label || '';
            schema.hint = props.hint || props.placeholder || '';
            schema.icon = props.icon || props.iconLeft || props.startIcon || '';
            schema.iconRight = props.iconRight || props.endIcon || '';
            schema.iconColor = props.iconColor || props.iconColorLeft || props.startIconColor || '';
            schema.iconColorRight = props.iconColorRight || props.endIconColor || '';
            schema.iconSize = props.iconSize || '';
            
            const variant = props.variant || 'outlined';
            schema.variant = variant;
            
            if (variant === 'filled') {
                schema.border = false;
                if (!clsArr.some(c => c.startsWith('bg-'))) {
                    clsArr.push('bg-slate-100/90');
                }
                if (!clsArr.some(c => c.startsWith('rounded-'))) {
                    clsArr.push('rounded-2xl');
                }
            } else if (variant === 'standard') {
                schema.border = false;
                if (!clsArr.some(c => c.startsWith('bg-'))) {
                    clsArr.push('bg-transparent');
                }
                if (!clsArr.includes('border-b')) {
                    clsArr.push('border-b');
                    clsArr.push('border-slate-300');
                }
            } else {
                schema.border = true;
                if (!clsArr.some(c => c.startsWith('bg-'))) {
                    clsArr.push('bg-white');
                }
                if (!clsArr.some(c => c.startsWith('rounded-'))) {
                    clsArr.push('rounded-xl');
                }
            }
            
            if (props.border !== undefined) {
                schema.border = props.border === true || props.border === 'true';
            }
            schema.className = clsArr.join(' ');
        } else if (type === 'Checkbox' || type === 'Switch' || type === 'Radio' || type === 'RadioButton') {
            schema.stateKey = props.stateKey || props.name || '';
            schema.initial = props.checked !== undefined ? props.checked : (props.initial || false);
            schema.label = props.label || '';
            schema.action = props.action || '';
        } else if (type === 'Slider') {
            schema.stateKey = props.stateKey || props.name || '';
            schema.label = props.label || '';
            schema.initial = parseInt(props.initial !== undefined ? props.initial : (props.value !== undefined ? props.value : 0)) || 0;
            schema.min = parseInt(props.min) || 0;
            schema.max = parseInt(props.max) || 255;
        } else if (type === 'Select') {
            schema.stateKey = props.stateKey || props.name || '';
            schema.label = props.label || '';
            schema.value = props.value || '';
            let options = props.options || '';
            if (!options && childSchemas.length > 0) {
                options = childSchemas
                    .filter(c => c.tag === 'option')
                    .map(c => c.text || '')
                    .join(',');
            }
            schema.options = options;
        } else if (type === 'Image') {
            schema.src = props.src || props.source || props.image || '';
        } else if (type === 'Button') {
            schema.icon = props.icon || props.iconName || '';
        } else if (type === 'State') {
            schema.stateKey = props.stateKey || props.key || props['data-key'] || '';
            schema.template = props.template || '';
            schema.keys = props.keys || '';
            schema.fallback = props.fallback !== undefined ? String(props.fallback) : (props.initial !== undefined ? String(props.initial) : '');
            schema.initial = props.initial !== undefined ? String(props.initial) : schema.fallback;
        }

        if (tagLower === 'option') {
            schema.tag = 'option';
        }

        // ─── Text / Button content ───
        const TEXT_TYPES = new Set(['Text','Button','AppBar','option','p','span','h1','h2','h3','h4','h5','h6','State']);

        const extractAllText = (nodes) => {
            return nodes.map(node => {
                if (typeof node === 'string' || typeof node === 'number') return String(node);
                if (!node) return '';
                if (node.text) return node.text;
                if (node.props && node.props.text) return node.props.text;
                if (Array.isArray(node.children)) return extractAllText(node.children);
                if (node.props && Array.isArray(node.props.children)) return extractAllText(node.props.children);
                return '';
            }).join(' ').trim();
        };

        if (TEXT_TYPES.has(type)) {
            const deepText = extractAllText(childSchemas);
            if (deepText) {
                schema.text = deepText;
            }
            
            if (type === 'Button' || type === 'Text') {
                const rest = childSchemas.filter(c => c.type === 'Image' || c.type === 'ListView' || c.type === 'GridView');
                if (rest.length > 0) schema.children = rest;
                else delete schema.children;
            }
        } else if (childSchemas.length > 0) {
            schema.children = childSchemas;
        }

        // ─── 🆕 24-byte: Ensure width/height are set ───
        if (schema.width === undefined && twProps.width !== undefined) schema.width = twProps.width;
        if (schema.height === undefined && twProps.height !== undefined) schema.height = twProps.height;

        // Preserve all event handlers (onClick, onChange, onSubmit, onPress, onLongPress, etc.)
        Object.keys(props).forEach(key => {
            if (key.startsWith('on') && (typeof props[key] === 'function' || typeof props[key] === 'string')) {
                schema[key] = props[key];
            }
        });

        return schema;
    }

    /**
     * Convert JSX string to HTML equivalent
     * @param {string} jsxString 
     */
    _jsxToHtml(jsxString) {
        let html = jsxString;

        html = html.replace(/className=/g, 'class=');
        html = html.replace(/htmlFor=/g, 'for=');
        html = html.replace(/<(\w+)([^>]*)\/>/g, '<$1$2></$1>');
        
        html = html.replace(/style=\{\{([^}]+)\}\}/g, (match, styleObj) => {
            try {
                const styles = styleObj.split(',').map(s => s.trim());
                const styleString = styles.map(s => {
                    const [key, value] = s.split(':').map(p => p.trim());
                    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                    const cleanValue = value.replace(/['"]/g, '');
                    return `${cssKey}: ${cleanValue}`;
                }).join('; ');
                return `style="${styleString}"`;
            } catch (e) {
                return match;
            }
        });

        html = html.replace(/import\s+.*from\s+['"]react['"];\s*/g, '');
        html = html.replace(/export\s+default\s+.*;\s*/g, '');
        html = html.replace(/\b(on[A-Z][a-zA-Z]+)=/g, (match, p1) => {
            return p1.toLowerCase() + '=';
        });

        html = html.replace(/stateKey:\s*['"]?([a-zA-Z0-9_$]+)['"]?/g, 'data-statekey="$1"');

        const tagMatch = html.match(/(<[a-zA-Z][\s\S]*>)/);
        if (tagMatch) {
            html = tagMatch[1];
        }

        return html;
    }

    /**
     * Convert React element to HTML string (fallback path)
     */
    _reactElementToHtml(element) {
        if (!element || typeof element !== 'object') {
            return element !== undefined && element !== null ? String(element) : '';
        }

        const { type, props } = element;
        
        if (typeof type === 'string') {
            let attrs = '';
            
            if (props) {
                Object.keys(props).forEach(key => {
                    if (key === 'children') return;
                    
                    let value = props[key];
                    if (key === 'className') {
                        key = 'class';
                    } else if (key === 'htmlFor') {
                        key = 'for';
                    }
                    
                    if (key.toLowerCase().startsWith('on')) {
                        key = key.toLowerCase();
                    }

                    if (typeof value === 'boolean') {
                        if (value) attrs += ` ${key}`;
                    } else if (typeof value === 'object') {
                        if (key === 'style') {
                            const styles = Object.keys(value).map(k => {
                                const cssKey = k.replace(/([A-Z])/g, '-$1').toLowerCase();
                                return `${cssKey}: ${value[k]}`;
                            }).join('; ');
                            attrs += ` style="${styles}"`;
                        }
                    } else {
                        if (key === 'stateKey') {
                            attrs += ` data-statekey="${value}"`;
                        } else {
                            attrs += ` ${key}="${value}"`;
                        }
                    }
                });
            }
            const voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
            const isVoid = voidTags.includes(type.toLowerCase());
            
            if (isVoid) {
                return `<${type}${attrs} />`;
            }

            let children = '';
            if (props && props.children) {
                if (Array.isArray(props.children)) {
                    children = props.children.map(child => 
                        this._reactElementToHtml(child)
                    ).join('');
                } else {
                    children = this._reactElementToHtml(props.children);
                }
            }
            
            return `<${type}${attrs}>${children}</${type}>`;
        }
        
        return '';
    }

    /**
     * Generate cache key for JSX content
     * @param {string|function} content 
     * @param {object} options 
     */
    _generateCacheKey(content, options) {
        const contentStr = typeof content === 'function' ? content.toString() : content;
        const optionsStr = JSON.stringify(options);
        return `${this.config.platform}_${contentStr}_${optionsStr}`.slice(0, 100);
    }

    /**
     * Clear JSX cache
     */
    clearCache() {
        this.jsxCache.clear();
        this._log('🧹 JSX cache cleared');
    }

    /**
     * Get parser statistics
     */
    getStats() {
        return {
            platform: this.config.platform,
            jsxEnabled: this.config.enableJSX,
            cacheSize: this.jsxCache.size,
            supportedTypes: ['HTML', 'JSX', 'COMPONENT']
        };
    }

    _log(message) {
        if (this.config.debug || process.env.DOLPHIN_DEBUG) {
            console.log(message);
        }
    }
}

module.exports = HybridParser;