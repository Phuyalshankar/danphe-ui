'use strict';

const HTMLParser = require('./HTMLParser');
const { performance } = require('perf_hooks');
const callbackRegistry = require('../runtime/CallbackRegistry');

/**
 * 🌊 HybridParser - Supports both HTML strings and JSX components
 * Automatically detects input type and renders accordingly
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
        
        this._log('🌊 HybridParser initialized');
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
            // Auto-detect content type
            const contentType = this._detectContentType(content);
            
            let result;
            switch (contentType) {
                case 'UI_SCHEMA':
                    // Pass through - compilation layer handles UI schema objects directly
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
        // ── REACT ELEMENT CHECK MUST BE FIRST ──
        // Babel-compiled JSX produces objects with $$typeof.
        // These must NOT fall into UI_SCHEMA even when type is a string like 'div'.
        if (content && typeof content === 'object' && content.$$typeof === Symbol.for('react.element')) {
            return 'COMPONENT';
        }

        // Check if it's a React component (function/class)
        if (typeof content === 'function') {
            try {
                const element = content();
                if (element && element.$$typeof === Symbol.for('react.element')) {
                    return 'COMPONENT';
                }
            } catch (e) {}
            return 'JSX';
        }
        
        // Plain Dolphin native UI schema object  { type: 'Column', children: [...] }
        if (typeof content === 'object' && content !== null) {
            if (typeof content.type === 'string') {
                return 'UI_SCHEMA';
            }
            if (content.render) {
                return 'COMPONENT';
            }
        }
        
        // String content
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
        // Look for JSX indicators
        const jsxIndicators = [
            /import\s+.*from\s+['"]react['"]/, // React import
            /export\s+default/, // ES6 export
            /const\s+\w+\s*=\s*\(\)\s*=>\s*<[^>]+>/, // Arrow function component
            /function\s+\w+\(\)\s*{[\s\S]*return\s*<[^>]+>/, // Function component
            /class\s+\w+\s+extends\s+React\.Component/, // Class component
            /<\w+[^>]*>[\s\S]*<\/\w+>/, // JSX tags with props
            /\{\s*\w+\.\w+\s*\}/, // JSX expressions
            /\{\s*\w+\s*\}/ // Simple JSX expressions
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

        // Create a cache key
        const cacheKey = this._generateCacheKey(jsxContent, options);
        
        // Check cache first
        if (this.jsxCache.has(cacheKey)) {
            this._log('📦 Using cached JSX compilation');
            return this.jsxCache.get(cacheKey);
        }

        try {
            let jsxString;
            
            // Handle function components
            if (typeof jsxContent === 'function') {
                jsxString = jsxContent.toString();
            } else {
                jsxString = jsxContent;
            }

            // Convert JSX to HTML-like string for Dolphin processing
            const htmlEquivalent = this._jsxToHtml(jsxString);
            
            // Parse the converted HTML
            const result = this.htmlParser.parse(htmlEquivalent, {
                ...options,
                originalType: 'JSX'
            });

            // Cache the result
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
     * Converts the full React element tree into a Dolphin native schema,
     * then hands it off to the bridge for binary compilation.
     */
    _parseComponent(component, options = {}) {
        // ── PATH A: Babel React element (most common with app.jsx) ──
        if (component && component.$$typeof === Symbol.for('react.element')) {
            const schema = this._reactElementToSchema(component);
            if (schema) {
                // Return the schema as the content; the framework will call
                // bridge.compile(schema) which routes to _compileUISchema.
                return { content: schema, html: null, convertedHTML: null };
            }
            // Fallback: try HTML string conversion
            const htmlString = this._reactElementToHtml(component);
            const result = this._parseHTML(htmlString, options);
            return { ...result, content: result.ast, convertedHTML: htmlString };
        }
        
        // ── PATH B: Function component ──
        if (typeof component === 'function') {
            try {
                const element = component();
                if (element && element.$$typeof === Symbol.for('react.element')) {
                    return this._parseComponent(element, options);
                }
            } catch (e) {}
        }
        
        // ── PATH C: Custom object with render fn ──
        if (component && component.render && typeof component.render === 'function') {
            return this._parseJSX(component.render, options);
        }
        
        throw new Error('Unsupported component format');
    }

    // ─────────────────────────────────────────────────────────────────────
    // REACT ELEMENT → DOLPHIN NATIVE SCHEMA
    // Converts Babel-compiled JSX trees into { type, children, ... } objects
    // that UniversalUIImporter can compile to Titan 16-byte binary.
    // Works for BOTH HTML tags (div, p, button) and custom components
    // (GradientCard, AppBar wrapper, etc.).
    // ─────────────────────────────────────────────────────────────────────

    _reactElementToSchema(element) {
        if (element === null || element === undefined) return null;

        // Primitive text / number nodes
        if (typeof element === 'string' || typeof element === 'number') {
            const text = String(element).trim();
            return text ? { type: 'Text', text } : null;
        }

        // Handle array of elements (e.g. products.map) recursively
        if (Array.isArray(element)) {
            return element.map(e => this._reactElementToSchema(e)).filter(Boolean);
        }

        if (typeof element !== 'object') return null;

        const { type, props = {} } = element;

        // ── Custom function component (GradientCard, etc.) ──
        if (typeof type === 'function') {
            try {
                const rendered = type(props);
                if (!rendered) return null;
                // Returned a plain Dolphin schema (no $$typeof)
                if (!rendered.$$typeof) {
                    return this._processSchemaChildren(rendered);
                }
                // Returned another React element
                return this._reactElementToSchema(rendered);
            } catch (e) {
                return null;
            }
        }

        if (typeof type !== 'string') return null;

        // ── Collect children ──
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

    /** Walk a schema tree and convert any React-element children in-place. */
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

    /**
     * Map an HTML-like tag + props to a Dolphin native schema node.
     * Handles:
     *   - <div type="AppBar" title="..."> → { type:'AppBar', title:'...' }
     *   - <button className="btn btn-blue"> → { type:'Button', ... }
     *   - <h3>, <p>, <span>             → { type:'Text', text:'...' }
     *   - <div className="card">         → { type:'Card', ... }
     *   - <div className="row">          → { type:'Row', ... }
     */
    _htmlElementToSchema(tag, props, childSchemas) {
        let cls      = props.className || props.class || '';
        // Strip out Web-only CSS blocks in brackets [...] for Native Mobile UI compilation
        const mobileCls = cls.replace(/(?:^|\s)\[[^\]]*\]/g, '').trim();
        const clsArr = mobileCls.split(/\s+/).filter(Boolean);
        const action = props.action || props['data-action'] || '';

        // Explicit Dolphin type override via type="AppBar" etc.
        // Only treat as override when it's a known Dolphin component name.
        const DOLPHIN_TYPES = new Set([
            'AppBar','Button','Card','Container','Column','Row','Text',
            'Image','Icon','TextField','Slider','Switch','Checkbox','Select',
            'Radio','FileUpload','ListView','GridView','Modal','TabBar','tab-bar','tabbar'
        ]);
        const isTabBarType = props.type === 'TabBar' || props.type === 'tab-bar' || props.type === 'tabbar';
        const propsType    = props.type && (DOLPHIN_TYPES.has(props.type) || isTabBarType || (typeof props.type === 'string' && props.type.startsWith('0x'))) ? props.type : null;
        const tagLower     = (tag || '').toLowerCase();

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
            // यदि div भित्र अरु complex कम्पोनेन्टहरू (Image, Row, आदि) छन् भने Container नै राख्ने
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
            type = 'Column'; // Form acts as a container
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
        }

        const schema = { type };

        // Default sizes for headings (Reduced to prevent "zoom" feeling)
        if (tagLower === 'h1') schema.size = 24;
        else if (tagLower === 'h2') schema.size = 20;
        else if (tagLower === 'h3') schema.size = 18;
        else if (tagLower === 'h4') schema.size = 16;
        else if (tagLower === 'h5') schema.size = 14;
        else if (tagLower === 'h6') schema.size = 12;
        if (['h1','h2','h3','h4','h5','h6'].includes(tagLower)) schema.bold = true;

        // --- Class → schema props ---
        clsArr.forEach(c => {
            if (c.startsWith('p-'))          schema.p       = parseInt(c.slice(2)) * 4;
            else if (c.startsWith('pt-'))    schema.pt      = parseInt(c.slice(3)) * 4;
            else if (c.startsWith('pb-'))    schema.pb      = parseInt(c.slice(3)) * 4;
            else if (c.startsWith('pl-'))    schema.pl      = parseInt(c.slice(3)) * 4;
            else if (c.startsWith('pr-'))    schema.pr      = parseInt(c.slice(3)) * 4;
            else if (c.startsWith('px-'))    { schema.pl = schema.pr = parseInt(c.slice(3)) * 4; }
            else if (c.startsWith('py-'))    { schema.pt = schema.pb = parseInt(c.slice(3)) * 4; }
            else if (c.startsWith('m-'))       schema.m       = parseInt(c.slice(2)) * 4;
            else if (c.startsWith('mt-'))      schema.mt      = parseInt(c.slice(3)) * 4;
            else if (c === 'text-xs')          schema.size = 10;
            else if (c === 'text-sm')          schema.size = 12;
            else if (c === 'text-base')        schema.size = 14;
            else if (c === 'text-lg')          schema.size = 16;
            else if (c === 'text-xl')          schema.size = 20;
            else if (c === 'text-2xl')         schema.size = 24;
            else if (c === 'text-3xl')         schema.size = 30;
            else if (c === 'text-4xl')         schema.size = 36;
            else if (c.startsWith('mb-'))      schema.mb      = parseInt(c.slice(3)) * 4;
            else if (c.startsWith('ml-'))      schema.ml      = parseInt(c.slice(3)) * 4;
            else if (c.startsWith('mr-'))      schema.mr      = parseInt(c.slice(3)) * 4;
            else if (c.startsWith('mx-'))    { schema.ml = schema.mr = parseInt(c.slice(3)) * 4; }
            else if (c.startsWith('my-'))    { schema.mt = schema.mb = parseInt(c.slice(3)) * 4; }
            else if (c.startsWith('gap-'))     schema.gap     = parseInt(c.slice(4)) * 4;
            else if (c.startsWith('flex-'))    schema.flex    = parseInt(c.slice(5));
            else if (c === 'rounded') schema.radius = 4;
            else if (c.startsWith('rounded-')) {
                const r = c.slice(8);
                if      (r === 'none') schema.radius = 0;
                else if (r === 'sm')   schema.radius = 2;
                else if (r === 'md')   schema.radius = 6;
                else if (r === 'lg')   schema.radius = 8;
                else if (r === 'xl')   schema.radius = 12;
                else if (r === '2xl')  schema.radius = 16;
                else if (r === '3xl')  schema.radius = 24;
                else if (r === 'full') schema.radius = 200; // 200 = very large → always circle
                else {
                    // arbitrary: rounded-4, rounded-[15px]
                    const clean = r.replace('[','').replace(']','').replace('px','');
                    const val = parseInt(clean);
                    if (!isNaN(val)) schema.radius = val;
                }
            }
            else if (c === 'flex-1')           schema.flex    = 1;
            else if (c === 'h-full')           schema.height  = -1;
            else if (c.startsWith('h-'))       schema.height  = parseInt(c.slice(2)) * 4;
            else if (c === 'w-full')           schema.width   = -1;
            else if (c.startsWith('w-'))       schema.width   = parseInt(c.slice(2)) * 4;
            else if (c === 'shadow' || c === 'shadow-lg') schema.elevation = 4;
            else if (c === 'bg-white' || c === 'bg-slate-50') { schema.bg = 'white'; schema.shade = 254; schema.bgShade = 254; }
            else if (c === 'bg-light' || c === 'bg-slate-100') { schema.bg = 'gray';  schema.shade = 252; schema.bgShade = 252; }
            else if (c === 'bg-black' || c === 'bg-slate-900') { schema.bg = 'black'; schema.shade = 254; schema.bgShade = 254; }
            else if (c.startsWith('bg-gradient-')) { schema.gradient = c.replace('bg-', ''); }
            else if (c.startsWith('bg-grdient-')) { schema.gradient = c.replace('bg-', '').replace('grdient', 'gradient'); }
            // Support for bg-[color]-[shade]
            else if (c.startsWith('bg-') && c.includes('-')) {
                const parts = c.split('-');
                if (parts.length >= 3) {
                    schema.bg = parts[1];
                    schema.bgShade = parseInt(parts[2]) || 128;
                }
            }
            else if (c === 'text-white')       { schema.color = 'white'; schema.shade = 128; schema.colorShade = 128; }
            else if (c === 'text-slate-900' || c === 'text-black') { schema.color = 'black'; schema.shade = 128; schema.colorShade = 128; }
            else if (c === 'text-blue')        schema.color   = 'blue-150';
            else if (c === 'text-muted')       schema.color   = 'gray-120';
            else if (c === 'overflow-scroll' || c === 'overflow-y-scroll' || c === 'overflow-y-auto' || c === 'scroll-y' || c === 'scrollable')  schema.scroll  = true;
            // --- Alignment Fixes ---
            else if (c === 'items-center')     schema.items   = 'center';
            else if (c === 'items-end')        schema.items   = 'end';
            else if (c === 'justify-center')   schema.justify = 'center';
            else if (c === 'justify-between')  schema.justify = 'between';
            // Support for opacity classes (e.g., opacity-50)
            else if (c.startsWith('opacity-')) {
                const op = parseInt(c.slice(8));
                if (!isNaN(op)) {
                    schema.opacity = op / 100;
                }
            }
        });
        schema.className = cls; // keep raw class for ub.parseTW

        // --- Explicit style props ---
        if (props.style && typeof props.style === 'object') {
            const st = props.style;
            if (st.height)    schema.height    = typeof st.height    === 'number' ? st.height    : parseInt(st.height)    || 0;
            if (st.width)     schema.width     = typeof st.width     === 'number' ? st.width     : parseInt(st.width)     || 0;
            if (st.fontSize)  schema.size      = typeof st.fontSize  === 'number' ? st.fontSize  : parseInt(st.fontSize)  || 0;
        }
        if (props.height) schema.height = typeof props.height === 'number' ? props.height : parseInt(props.height) || 0;
        if (props.width)  schema.width  = typeof props.width  === 'number' ? props.width  : parseInt(props.width)  || 0;
        if (action)           schema.action = action;
        if (props.stateKey)   schema.stateKey = props.stateKey;
        if (props.gradient)   schema.gradient = props.gradient;
        if (props.animation)  schema.animation = props.animation;
        if (props.title)      schema.title  = props.title;
        if (props.src)        schema.src = props.src;
        if (props.url)        schema.url = props.url;
        // --- Platform targeting: preserve target/platform for mobile compiler filtering ---
        if (props.target)     schema.target   = props.target;
        if (props.platform)   schema.platform = props.platform;

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
            
            // --- Unification of Variants (outlined, filled, standard) ---
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
                // Outlined (Default)
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
            schema.className = clsArr.join(' '); // Synchronize back to the styling class list
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
        }

        if (tagLower === 'option') {
            schema.tag = 'option'; // Mark for parent <select>
        }

        // --- Text / Button content ---
        const TEXT_TYPES = new Set(['Text','Button','AppBar','option','p','span','h1','h2','h3','h4','h5','h6']);

        // Recursive helper to find all text in children (robust version)
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

        // केवल टेक्स्ट टाइप भएका कम्पोनेन्ट (Text, Button, AppBar) मा मात्र टेक्स्ट एक्स्ट्र्याक्ट गर्ने
        if (TEXT_TYPES.has(type)) {
            // गहिरो तह (nested layers जस्तै div > div > span) बाट पनि text निकाल्ने
            const deepText = extractAllText(childSchemas);
            if (deepText) {
                schema.text = deepText;
            }
            
            // यदि यो 'Button' हो र यसमा इमेज जस्ता सामाग्री छन् भने मात्र children राख्ने,
            // नत्र Container/Row/Column को children डिलेट नगर्ने
            if (type === 'Button' || type === 'Text') {
                const rest = childSchemas.filter(c => c.type === 'Image' || c.type === 'ListView' || c.type === 'GridView');
                if (rest.length > 0) schema.children = rest;
                else delete schema.children;
            }
        } else if (childSchemas.length > 0) {
            schema.children = childSchemas;
        }

        return schema;
    }

    /**
     * Convert JSX string to HTML equivalent
     * @param {string} jsxString 
     */
    _jsxToHtml(jsxString) {
        let html = jsxString;

        // Convert JSX className to class
        html = html.replace(/className=/g, 'class=');
        
        // Convert JSX htmlFor to for
        html = html.replace(/htmlFor=/g, 'for=');
        
        // Handle self-closing tags
        html = html.replace(/<(\w+)([^>]*)\/>/g, '<$1$2></$1>');
        
        // Convert style objects to style strings
        html = html.replace(/style=\{\{([^}]+)\}\}/g, (match, styleObj) => {
            try {
                // Simple style object to string conversion
                const styles = styleObj.split(',').map(s => s.trim());
                const styleString = styles.map(s => {
                    const [key, value] = s.split(':').map(p => p.trim());
                    // Convert camelCase to kebab-case
                    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                    // Remove quotes around values
                    const cleanValue = value.replace(/['"]/g, '');
                    return `${cssKey}: ${cleanValue}`;
                }).join('; ');
                return `style="${styleString}"`;
            } catch (e) {
                return match;
            }
        });

        // Remove React import statements
        html = html.replace(/import\s+.*from\s+['"]react['"];\s*/g, '');
        
        // Remove export statements
        html = html.replace(/export\s+default\s+.*;\s*/g, '');
        
        // Convert onClick to onclick (and other events)
        html = html.replace(/\b(on[A-Z][a-zA-Z]+)=/g, (match, p1) => {
            return p1.toLowerCase() + '=';
        });

        // Extract JSX content from function (handles both return <...> and () => <...>)
        const tagMatch = html.match(/(<[a-zA-Z][\s\S]*>)/);
        if (tagMatch) {
            html = tagMatch[1];
        }

        return html;
    }

    /**
     * Convert React element to HTML string (fallback path).
     * The preferred path is _reactElementToSchema → schema → binary.
     */
    _reactElementToHtml(element) {
        if (!element || typeof element !== 'object') {
            return element !== undefined && element !== null ? String(element) : '';
        }

        const { type, props } = element;
        
        // Handle text nodes
        if (typeof type === 'string') {
            let attrs = '';
            
            // Convert props to HTML attributes
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
                        attrs += ` ${key}="${value}"`;
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
