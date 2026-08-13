'use strict';

/**
 * Bridge between DolphinCSS and Titan Render Engine
 */
class DolphinTitanBridge {
    constructor(config = {}) {
        this.config = {
            mode: config.mode || 'HYBRID', // HYBRID, DOLPHIN_ONLY, TITAN_ONLY
            autoConvert: config.autoConvert || true,
            cacheEnabled: config.cache !== false
        };
        
        this.dolphinCompiler = null;
        this.universalImporter = null;
        this.conversionCache = new Map();
        
        console.log('🌉 Dolphin-Titan Bridge Initialized');
    }
    
    /**
     * Attach Dolphin Compiler instance
     */
    attachDolphinCompiler(compilerInstance) {
        this.dolphinCompiler = compilerInstance;
        console.log('📦 Dolphin Compiler attached');
    }
    
    /**
     * Attach Universal UI Importer
     */
    attachUniversalImporter(importerInstance) {
        this.universalImporter = importerInstance;
        // Inject CDNStyleBridge logic for MUI/Bootstrap support
        this.cdnBridge = {
            MUI_COLORS: {
                'primary':   { bg: 'blue-128',    color: 'white' },
                'secondary': { bg: 'purple-150',  color: 'white' },
                'error':     { bg: 'red-150',     color: 'white' },
                'warning':   { bg: 'amber-150',   color: 'white' },
                'info':      { bg: 'cyan-150',    color: 'white' },
                'success':   { bg: 'green-150',   color: 'white' },
            }
        };
        console.log('⚡ Universal Importer attached + MUI Intelligence enabled');
    }

    /**
     * Set action handler for UI interactions
     */
    setActionHandler(handler) {
        this._actionHandler = handler;
        if (this._devServer) {
            this._devServer.onAction(handler);
        }
    }

    /**
     * Patch a screen (hot reload)
     */
    patchScreen(name, screen) {
        if (this._devServer) {
            // Screen patching is handled by framework to avoid double-broadcast
            // But if called directly, we delegate.
            this._devServer.patchScreen(name, screen);
        }
    }
    
    
    /**
     * Universal compile - handles all input types
     */
    compile(input, options = {}) {
        const inputType = this._detectInputType(input);
        
        switch (inputType) {
            case 'HTML':
                return this._compileHTML(input, options);
                
            case 'UI_SCHEMA':
                return this._compileUISchema(input, options);
                
            case 'TITAN_BINARY':
                return this._processTitanBinary(input, options);
                
            case 'DOLPHIN_BINARY':
                return this._processDolphinBinary(input, options);
                
            case 'TITAN_ARRAY':
                return this._processTitanArray(input, options);
                
            case 'TITAN_NODES':
                return this._processTitanNodes(input, options);
                
            default:
                throw new Error(`Unsupported input type: ${inputType}`);
        }
    }
    
    /**
     * HTML → Dolphin Binary (or Titan Array)
     */
    _compileHTML(html, options) {
        if (this.config.cacheEnabled && this.conversionCache.has(html)) {
            return this.conversionCache.get(html);
        }

        if (!this.universalImporter) {
            throw new Error('Universal UI Importer not attached to bridge');
        }

        const CDNStyleBridge = require('../ui/CDNStyleBridge');
        const bridge = new CDNStyleBridge();
        const { schema, error } = bridge.htmlToSchema(html);

        if (error || !schema) {
            console.error('❌ Failed HTML snippet:', html.substring(0, 500) + (html.length > 500 ? '...' : ''));
            throw new Error('HTML Parsing failed: ' + (error || 'Unknown schema generation error'));
        }
        
        // Compile Schema to Binary
        const result = this._compileUISchema(schema, options);
        
        if (this.config.cacheEnabled) {
            this.conversionCache.set(html, result);
        }
        
        return result;
    }

    /**
     * Recursive AST → UI Schema converter
     */
    _astToRecursiveSchema(node) {
        if (!node) return null;
        if (node.type === 'text') {
            return { type: 'Text', text: node.value.trim() };
        }

        const tag = (node.tag || node.name || '').toUpperCase();
        const attributes = node.attributes || {};
        const children = node.children || [];

        const props = {};
        
        // Map Attributes to Props
        Object.keys(attributes).forEach(key => {
            const value = attributes[key];
            const upperKey = key.toUpperCase();

            if (upperKey === 'CLASS' || upperKey === 'CLASSNAME') {
                props.tw = value;
                // Instant absorption for nested components
                const clsArr = value.split(/\s+/);
                clsArr.forEach(c => {
                    if (c.startsWith('gap-')) props.gap = parseInt(c.substring(4)) * 4;
                    else if (c.startsWith('p-')) props.p = parseInt(c.substring(2)) * 4;
                    else if (c.startsWith('m-')) props.m = parseInt(c.substring(2)) * 4;
                    else if (c.startsWith('flex-')) props.flex = parseInt(c.substring(5));
                    else if (c.startsWith('rounded-')) props.radius = parseInt(c.substring(8)) * 2;
                });
            } else if (upperKey === 'STYLE') {
                props.style = this._parseStyle(value);
            } else if (upperKey === 'ONCLICK' || upperKey === 'DATA-ACTION') {
                props.action = value;
            } else if (upperKey === 'DATA-STATEKEY') {
                props.stateKey = value;
            } else if (upperKey === 'DATA-INITIAL') {
                props.initial = value;
            } else if (upperKey === 'DATA-OPTIONS') {
                props.options = value;
            } else if (upperKey === 'DATA-LABEL' || upperKey === 'LABEL') {
                props.label = value;
            } else if (upperKey === 'DATA-HINT' || upperKey === 'PLACEHOLDER' || upperKey === 'HINT') {
                props.hint = value;
            } else if (key.startsWith('DATA-')) {
                const cleanKey = key.substring(5).toLowerCase();
                props[cleanKey] = value;
            } else {
                props[key.toLowerCase()] = value;
            }
        });

        // Determine Component Type
        let type = 'Container';
        const classes = String(props.tw || '').split(/\s+/).filter(Boolean);
        
        // ── MUI / Bootstrap / Tailwind Intelligence ──
        classes.forEach(cls => {
            if (cls.startsWith('MuiButton')) type = 'Button';
            if (cls.startsWith('MuiCard'))   { type = 'Card'; props.elevation = 4; }
            if (cls.startsWith('MuiTypography')) type = 'Text';
            if (cls.startsWith('MuiTextField')) type = 'TextField';
            
            if (cls === 'btn') { type = 'Button'; props.radius = 8; props.p = 12; }
            if (cls === 'card') { type = 'Card'; props.radius = 12; props.elevation = 0; }
            if (cls === 'form-control') type = 'TextField';
            if (cls === 'form-select')  type = 'Select';
            if (cls === 'row') type = 'Row';
            if (cls === 'column') type = 'Column';
            
            // Map MUI Colors
            if (cls.includes('Primary')) Object.assign(props, this.cdnBridge.MUI_COLORS.primary);
            if (cls.includes('Secondary')) Object.assign(props, this.cdnBridge.MUI_COLORS.secondary);
            if (cls.includes('Success')) Object.assign(props, this.cdnBridge.MUI_COLORS.success);
            
            // Extract numbers from classes like p-4, m-2, gap-3, flex-1
            if (cls.startsWith('p-')) props.p = parseInt(cls.substring(2)) * 4;
            else if (cls.startsWith('m-')) props.m = parseInt(cls.substring(2)) * 4;
            else if (cls.startsWith('gap-')) props.gap = parseInt(cls.substring(4)) * 4;
            else if (cls.startsWith('flex-')) props.flex = parseInt(cls.substring(5));
            else if (cls.startsWith('rounded-')) props.radius = parseInt(cls.substring(8)) * 2;
            else if (cls.startsWith('bg-gradient-') && cls.split('-').length >= 6) {
                // Support bg-gradient-blue-128-sky-200-45
                props.gradient = 'gradient-' + cls.substring(12);
            }
            else if (cls.startsWith('bg-') && cls.split('-').length >= 5) {
                // Support bg-blue-128-sky-200-45
                props.gradient = 'gradient-' + cls.substring(3);
            }
        });

        if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'LABEL'].includes(tag)) {
            type = 'Text';
        } else if (tag === 'BUTTON' || classes.includes('btn')) {
            type = 'Button';
        }
        else if (tag === 'INPUT') {
            const inputType = (props.type || 'text').toLowerCase();
            if (inputType === 'radio') type = 'Radio';
            else if (inputType === 'checkbox') type = 'Checkbox';
            else if (inputType === 'file') type = 'FileUpload';
            else type = 'TextField';
        }
        else if (tag === 'SELECT' || classes.includes('form-select')) {
            type = 'Select';
            // Extract options from child <option> tags OR data-options attribute
            let optionsArr = [];
            if (props.options && typeof props.options === 'string') {
                optionsArr = props.options.split(',').map(o => o.trim());
            } else {
                optionsArr = children
                    .filter(c => (c.tag || c.name || '').toUpperCase() === 'OPTION')
                    .map(c => c.children?.[0]?.value || c.attributes?.VALUE || '');
            }
            if (optionsArr.length > 0) props.options = optionsArr;
        }
        else if (tag === 'IMG') type = 'Image';
        else if (tag === 'I') type = 'Icon';

        const schema = { type, ...props };

        // ── Smart Attribute Absorption ──
        // If a TextField has no label/hint but contains an <input> with them, absorb them.
        if (type === 'TextField' || tag === 'DIV') {
            const childInput = children.find(c => (c.tag || '').toUpperCase() === 'INPUT');
            if (childInput) {
                const innerSchema = this._astToRecursiveSchema(childInput);
                if (innerSchema) {
                    if (innerSchema.label) schema.label = innerSchema.label;
                    if (innerSchema.hint) schema.hint = innerSchema.hint;
                    if (innerSchema.stateKey) schema.stateKey = innerSchema.stateKey;
                    if (innerSchema.options) schema.options = innerSchema.options;
                    if (innerSchema.inputType) schema.inputType = innerSchema.inputType;
                    if (innerSchema.action) schema.action = innerSchema.action;
                }
            }
            schema.children = [];
        } else if (children.length > 0) {
            schema.children = children
                .map(child => this._astToRecursiveSchema(child))
                .filter(c => c !== null);
        }

        return schema;
    }
    
    /**
     * UI Schema → Titan Binary
     */
    _compileUISchema(schema, options) {
        if (!this.universalImporter) {
            // Fallback: convert to HTML and use Dolphin compiler
            const html = this._schemaToHTML(schema);
            return this._compileHTML(html, options);
        }

        // Apply TW parsing to schema nodes recursively
        this._applyTWRecursive(schema);
        
        const result = this.universalImporter.importSchema(
            schema, 
            { platform: options.platform || 'UNIVERSAL' }
        );

        // Result can be a single binary, an array, or the new { binaries, stringData } object
        let binaries = [];
        let stringData = Buffer.alloc(0);

        if (result.binaries) {
            binaries = result.binaries;
            stringData = result.stringData;
        } else if (Array.isArray(result)) {
            binaries = result;
        } else {
            binaries = [result];
        }
        
        const combined = Buffer.concat(binaries.map(b => Buffer.from(b)));

        return {
            success: true,
            buffer: combined,
            stringData: stringData, // Pass strings back to framework
            binaryType: 'TITAN_ARRAY',
            platform: options.platform || 'UNIVERSAL',
            timestamp: Date.now()
        };
    }

    /**
     * Process Dolphin Binary format
     * Handles pre-compiled Dolphin binary input
     */
    _processDolphinBinary(input, options) {
        // Dolphin binary is already compiled, just wrap it in response format
        const buffer = typeof input === 'string' ? Buffer.from(input, 'base64') : Buffer.from(input);
        
        return {
            success: true,
            buffer: buffer,
            stringData: Buffer.alloc(0),
            binaryType: 'DOLPHIN_BINARY',
            platform: options.platform || 'UNIVERSAL',
            timestamp: Date.now()
        };
    }

    /**
     * Process Titan Binary format
     * Handles pre-compiled Titan binary input
     */
    _processTitanBinary(input, options) {
        // Titan binary is already compiled, just wrap it in response format
        const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
        
        return {
            success: true,
            buffer: buffer,
            stringData: Buffer.alloc(0),
            binaryType: 'TITAN_BINARY',
            platform: options.platform || 'UNIVERSAL',
            timestamp: Date.now()
        };
    }

    /**
     * Process Titan Array format
     * Handles array of Titan binary chunks
     */
    _processTitanArray(input, options) {
        if (!Array.isArray(input)) {
            throw new Error('TITAN_ARRAY input must be an array');
        }

        // Combine all binary chunks into single buffer
        const buffers = input.map(item => {
            if (Buffer.isBuffer(item)) return item;
            if (typeof item === 'string') return Buffer.from(item, 'base64');
            if (item instanceof Uint8Array) return Buffer.from(item);
            return Buffer.from(String(item));
        });

        const combined = Buffer.concat(buffers);

        return {
            success: true,
            buffer: combined,
            stringData: Buffer.alloc(0),
            binaryType: 'TITAN_ARRAY',
            platform: options.platform || 'UNIVERSAL',
            timestamp: Date.now()
        };
    }

    /**
     * Process Titan Nodes format
     * Handles Titan render tree nodes and converts to binary
     */
    _processTitanNodes(input, options) {
        if (!input || typeof input !== 'object') {
            throw new Error('TITAN_NODES input must be an object or node tree');
        }

        // Convert node tree to UI schema first, then compile
        const schema = this._titanNodesToSchema(input);
        return this._compileUISchema(schema, options);
    }

    /**
     * Convert Titan node tree to UI Schema
     */
    _titanNodesToSchema(node) {
        if (!node || typeof node !== 'object') {
            return { type: 'Container', children: [] };
        }

        const schema = {
            type: node.type || 'Container',
            ...node.props
        };

        if (node.children && Array.isArray(node.children)) {
            schema.children = node.children.map(child => this._titanNodesToSchema(child));
        }

        return schema;
    }

    /**
     * Helper to apply TW classes to schema nodes
     */
    _applyTWRecursive(node) {
        if (!node || typeof node !== 'object') return;
        if (node.tw) {
            const classes = node.tw.split(/\s+/);
            classes.forEach(cls => {
                if (cls.startsWith('p-')) node.p = parseInt(cls.substring(2)) * 4;
                else if (cls.startsWith('m-')) node.m = parseInt(cls.substring(2)) * 4;
                else if (cls.startsWith('gap-')) node.gap = parseInt(cls.substring(4)) * 4;
                else if (cls.startsWith('flex-')) node.flex = parseInt(cls.substring(5));
                else if (cls.startsWith('rounded-')) node.radius = parseInt(cls.substring(8)) * 2;
                else if (cls.startsWith('bg-gradient-') && cls.split('-').length >= 6) {
                    node.gradient = 'gradient-' + cls.substring(12);
                }
                else if (cls.startsWith('bg-') && cls.split('-').length >= 5) {
                    node.gradient = 'gradient-' + cls.substring(3);
                }
            });
        }
        if (node.children) {
            node.children.forEach(c => this._applyTWRecursive(c));
        }
    }

    /**
     * Mock HTML Parser (Simplified)
     */
    _parseHTML(html) {
        if (global.DolphinHTMLParser) {
            return global.DolphinHTMLParser.parse(html);
        }
        return this._simpleParse(html);
    }

    _simpleParse(html) {
        return { tag: 'div', attributes: { class: 'root' }, children: [] };
    }

    _detectInputType(input) {
        if (typeof input === 'string') {
            if (input.trim().startsWith('<')) return 'HTML';
            return 'DOLPHIN_BINARY';
        }
        if (Buffer.isBuffer(input)) return 'TITAN_BINARY';
        if (typeof input === 'object') {
            if (input.type) return 'UI_SCHEMA';
            if (Array.isArray(input)) return 'TITAN_ARRAY';
        }
        return 'UNKNOWN';
    }

    _parseStyle(styleStr) {
        const styles = {};
        styleStr.split(';').forEach(s => {
            const [k, v] = s.split(':');
            if (k && v) styles[k.trim().toLowerCase()] = v.trim();
        });
        return styles;
    }

    _schemaToHTML(schema) {
        return `<div class="${schema.tw || ''}">${schema.text || ''}</div>`;
    }
}

module.exports = DolphinTitanBridge;
