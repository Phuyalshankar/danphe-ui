'use strict';

const { performance } = require('perf_hooks');
const DolphinError = require('../errors/DolphinError');

/**
 * Production-grade HTML Parser for DolphinJS
 * Supports: tags, attributes, nested structures, void elements, comments, doctype
 * 24-byte Protocol Ready
 */
class HTMLParser {
    constructor(config = {}) {
        this.config = {
            strict: false,
            validateStructure: true,
            preserveWhitespace: false,
            decodeEntities: true,
            ...config
        };
        this.errors = [];
        this.warnings = [];
        
        // 🆕 24-byte: Cache for performance
        this._voidTags = new Set([
            'AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 
            'IMG', 'INPUT', 'LINK', 'META', 'PARAM', 
            'SOURCE', 'TRACK', 'WBR', 'SLIDER', 'CHECKBOX',
            // 🆕 24-byte: More void elements
            'VIDEO', 'AUDIO', 'IFRAME', 'CANVAS', 'SVG',
            'PATH', 'CIRCLE', 'RECT', 'LINE', 'POLYLINE'
        ]);
    }
    
    parse(html) {
        const startTime = performance.now();
        
        try {
            // Validate input
            if (typeof html !== 'string') {
                throw new DolphinError('INVALID_HTML', 'HTML must be a string');
            }
            
            html = html.trim();
            if (html.length === 0) {
                throw new DolphinError('INVALID_HTML', 'Empty HTML');
            }
            
            // Preprocess HTML
            const processed = this.preprocessHTML(html);
            
            // Validate structure if enabled
            if (this.config.validateStructure) {
                const validation = this.validateStructure(processed);
                if (!validation.valid) {
                    this.warnings.push(`Structure validation: ${validation.reason}`);
                }
            }
            
            // Parse HTML into AST
            const ast = this.parseHTML(processed);
            
            const duration = performance.now() - startTime;
            
            return {
                success: true,
                ast,
                stats: {
                    nodes: this.countNodes(ast),
                    depth: this.calculateDepth(ast),
                    elements: this.countElements(ast),
                    textNodes: this.countTextNodes(ast),
                    parseTime: duration,
                    errors: this.errors.length,
                    warnings: this.warnings.length
                },
                warnings: this.warnings
            };
            
        } catch (error) {
            this.errors.push(error);
            return {
                success: false,
                error: error.message,
                errorCode: error.code,
                errors: this.errors,
                duration: performance.now() - startTime
            };
        }
    }
    
    preprocessHTML(html) {
        let processed = html;
        
        // Remove doctype
        processed = processed.replace(/<!doctype[^>]*>/gi, '');
        
        // Remove HTML comments
        processed = processed.replace(/<!--[\s\S]*?-->/g, '');
        
        // Remove script and style tags (keep structure but not content)
        processed = processed.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '<script></script>');
        processed = processed.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '<style></style>');
        
        // 🆕 24-byte: Remove CDATA sections
        processed = processed.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');
        
        // Normalize whitespace in tags (but keep text content)
        processed = processed.replace(/>\s+</g, '><');
        
        // Decode HTML entities if enabled
        if (this.config.decodeEntities) {
            processed = this.decodeHTMLEntities(processed);
        }
        
        // 🆕 24-byte: Normalize data-* attributes
        processed = processed.replace(/data-statekey=/gi, 'data-statekey=');
        processed = processed.replace(/data-action=/gi, 'data-action=');
        processed = processed.replace(/data-target=/gi, 'data-target=');
        
        // Trim and return
        return processed.trim();
    }
    
    decodeHTMLEntities(text) {
        const entities = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#039;': "'",
            '&nbsp;': ' ',
            // 🆕 24-byte: More entities
            '&apos;': "'",
            '&copy;': '©',
            '&reg;': '®',
            '&trade;': '™',
            '&mdash;': '—',
            '&ndash;': '–',
            '&hellip;': '…'
        };
        
        return text.replace(/&(amp|lt|gt|quot|#039|nbsp|apos|copy|reg|trade|mdash|ndash|hellip);/g, 
            match => entities[match] || match
        );
    }
    
    validateStructure(html) {
        const stack = [];
        let i = 0;
        const len = html.length;
        
        while (i < len) {
            if (html[i] === '<') {
                // Skip CDATA and comments that might have been missed
                if (html.substr(i, 9).toUpperCase() === '<![CDATA[') {
                    const end = html.indexOf(']]>', i);
                    if (end === -1) {
                        return { valid: false, reason: 'Unclosed CDATA section' };
                    }
                    i = end + 3;
                    continue;
                }
                
                // Check if it's a closing tag
                if (html[i + 1] === '/') {
                    i += 2;
                    const tagEnd = html.indexOf('>', i);
                    if (tagEnd === -1) {
                        return { valid: false, reason: 'Unclosed closing tag' };
                    }
                    
                    const tagName = html.substring(i, tagEnd).trim().toLowerCase();
                    i = tagEnd + 1;
                    
                    if (stack.length === 0) {
                        return { valid: false, reason: `Closing tag </${tagName}> without opening tag` };
                    }
                    
                    const lastTag = stack.pop();
                    if (lastTag !== tagName) {
                        return { valid: false, reason: `Tag mismatch: expected </${lastTag}> but got </${tagName}>` };
                    }
                } else {
                    // Opening tag or self-closing
                    i += 1;
                    const tagEnd = html.indexOf('>', i);
                    if (tagEnd === -1) {
                        return { valid: false, reason: 'Unclosed opening tag' };
                    }
                    
                    const tagContent = html.substring(i, tagEnd);
                    const tagNameMatch = tagContent.match(/^[a-zA-Z][a-zA-Z0-9\-]*/);
                    if (!tagNameMatch) {
                        return { valid: false, reason: 'Invalid tag name' };
                    }
                    
                    const tagName = tagNameMatch[0].toLowerCase();
                    
                    // 🆕 24-byte: Check custom elements
                    if (this.isCustomElement(tagName)) {
                        // Custom elements are self-closing by default
                        // Don't push to stack
                    } else if (!this.isVoidElement(tagName)) {
                        // Check if it's self-closing
                        if (html[tagEnd - 1] === '/' || tagContent.endsWith('/')) {
                            // Self-closing, don't push to stack
                        } else {
                            stack.push(tagName);
                        }
                    }
                    
                    i = tagEnd + 1;
                }
            } else {
                // Skip text content
                const nextTag = html.indexOf('<', i);
                if (nextTag === -1) break;
                i = nextTag;
            }
        }
        
        if (stack.length > 0) {
            return { 
                valid: false, 
                reason: `Unclosed tags: ${stack.map(tag => `<${tag}>`).join(', ')}` 
            };
        }
        
        return { valid: true };
    }
    
    parseHTML(html) {
        const root = { type: 'fragment', children: [] };
        const state = {
            pos: 0,
            html: html,
            length: html.length
        };
        
        this.parseFragment(state, root);
        
        // If fragment has only one element, return it directly
        if (root.children.length === 1 && root.children[0].type === 'element') {
            return root.children[0];
        }
        
        return root;
    }
    
    parseFragment(state, parent) {
        while (state.pos < state.length) {
            // Skip whitespace if not preserving
            if (!this.config.preserveWhitespace) {
                this.skipWhitespace(state);
            }
            
            if (state.pos >= state.length) break;
            
            if (state.html[state.pos] === '<') {
                // Check for closing tag
                if (state.html[state.pos + 1] === '/') {
                    // Return to parent to let it handle the closing tag
                    return;
                }
                
                // Parse element
                const element = this.parseElement(state);
                if (element) {
                    parent.children.push(element);
                }
            } else {
                // Parse text node
                const text = this.parseText(state);
                if (text && (!this.config.preserveWhitespace || text.trim())) {
                    parent.children.push({
                        type: 'text',
                        value: this.config.preserveWhitespace ? text : text.trim()
                    });
                }
            }
        }
    }
    
    parseElement(state) {
        // Skip '<'
        state.pos++;
        
        // Get tag name
        const tagStart = state.pos;
        while (state.pos < state.length && /[a-zA-Z0-9\-]/.test(state.html[state.pos])) {
            state.pos++;
        }
        
        if (state.pos === tagStart) {
            throw new DolphinError('INVALID_TAG', 'Empty tag name');
        }
        
        const tagName = state.html.substring(tagStart, state.pos).toUpperCase();
        
        // Skip whitespace
        this.skipWhitespace(state);
        
        // Parse attributes
        const attributes = this.parseAttributes(state);
        
        // Check for self-closing
        let selfClosing = false;
        if (state.pos < state.length && state.html[state.pos] === '/') {
            selfClosing = true;
            state.pos++;
        }
        
        // Expect '>'
        if (state.pos >= state.length || state.html[state.pos] !== '>') {
            throw new DolphinError('TAG_NOT_CLOSED', `Tag <${tagName}> not properly closed`);
        }
        state.pos++;
        
        // Create element
        const element = {
            type: 'element',
            tag: tagName,
            attributes: attributes,
            children: []
        };
        
        // If not self-closing and not void element, parse children
        if (!selfClosing && !this.isVoidElement(tagName) && !this.isCustomElement(tagName)) {
            this.parseFragment(state, element);
            
            // Look for closing tag
            this.skipWhitespace(state);
            
            if (state.pos < state.length && 
                state.html[state.pos] === '<' && 
                state.html[state.pos + 1] === '/') {
                
                state.pos += 2;
                this.skipWhitespace(state);
                
                // Read closing tag name
                const closeTagStart = state.pos;
                while (state.pos < state.length && /[a-zA-Z0-9\-]/.test(state.html[state.pos])) {
                    state.pos++;
                }
                
                const closeTagName = state.html.substring(closeTagStart, state.pos).toUpperCase();
                
                // Validate tag match
                if (closeTagName !== tagName) {
                    this.warnings.push(`Tag mismatch: <${tagName}> closed by </${closeTagName}>`);
                }
                
                // Skip to '>'
                this.skipWhitespace(state);
                if (state.pos >= state.length || state.html[state.pos] !== '>') {
                    throw new DolphinError('TAG_NOT_CLOSED', `Closing tag </${closeTagName}> not properly closed`);
                }
                state.pos++;
            } else if (!this.isVoidElement(tagName)) {
                this.warnings.push(`Tag <${tagName}> not closed, treating as self-closing`);
            }
        }
        
        return element;
    }
    
    parseAttributes(state) {
        const attributes = {};
        
        while (state.pos < state.length) {
            this.skipWhitespace(state);
            
            // Stop if we encounter tag end
            if (state.html[state.pos] === '>' || state.html[state.pos] === '/') {
                break;
            }
            
            // Get attribute name
            const nameStart = state.pos;
            while (state.pos < state.length && /[a-zA-Z0-9_\-:]/.test(state.html[state.pos])) {
                state.pos++;
            }
            
            if (state.pos === nameStart) {
                // Invalid character, skip
                state.pos++;
                continue;
            }
            
            const attrName = state.html.substring(nameStart, state.pos).toUpperCase();
            
            this.skipWhitespace(state);
            
            // Check for value
            let attrValue = true; // Default for boolean attributes
            
            if (state.pos < state.length && state.html[state.pos] === '=') {
                state.pos++;
                this.skipWhitespace(state);
                
                if (state.pos >= state.length) {
                    attributes[attrName] = '';
                    continue;
                }
                
                const quote = state.html[state.pos];
                if (quote === '"' || quote === "'") {
                    state.pos++;
                    const valueStart = state.pos;
                    
                    // Find closing quote
                    while (state.pos < state.length && state.html[state.pos] !== quote) {
                        // Handle escaped quotes
                        if (state.html[state.pos] === '\\' && state.pos + 1 < state.length) {
                            state.pos++;
                        }
                        state.pos++;
                    }
                    
                    if (state.pos >= state.length) {
                        throw new DolphinError('UNCLOSED_STRING', `Unclosed attribute value for ${attrName}`);
                    }
                    
                    attrValue = state.html.substring(valueStart, state.pos);
                    state.pos++; // Skip closing quote
                } else {
                    // Unquoted attribute value
                    const valueStart = state.pos;
                    while (state.pos < state.length && 
                           !/\s/.test(state.html[state.pos]) && 
                           state.html[state.pos] !== '>' && 
                           state.html[state.pos] !== '/') {
                        state.pos++;
                    }
                    
                    attrValue = state.html.substring(valueStart, state.pos);
                }
            }
            
            // 🆕 24-byte: Normalize data-* attributes
            if (attrName.startsWith('DATA-')) {
                const key = attrName.substring(5).toLowerCase();
                attributes[key] = attrValue;
            } else {
                attributes[attrName] = attrValue;
            }
        }
        
        return attributes;
    }
    
    parseText(state) {
        const textStart = state.pos;
        let inEntity = false;
        
        while (state.pos < state.length && state.html[state.pos] !== '<') {
            if (state.html[state.pos] === '&') {
                inEntity = true;
            } else if (inEntity && state.html[state.pos] === ';') {
                inEntity = false;
            }
            state.pos++;
        }
        
        if (state.pos === textStart) {
            return '';
        }
        
        return state.html.substring(textStart, state.pos);
    }
    
    skipWhitespace(state) {
        while (state.pos < state.length && /\s/.test(state.html[state.pos])) {
            state.pos++;
        }
    }
    
    isVoidElement(tagName) {
        return this._voidTags.has(tagName.toUpperCase());
    }
    
    // 🆕 24-byte: Custom elements support
    isCustomElement(tagName) {
        return /^[a-z]/.test(tagName) && tagName.includes('-');
    }
    
    countNodes(node) {
        if (node.type === 'text') return 1;
        let count = 1;
        if (node.children) {
            for (const child of node.children) {
                count += this.countNodes(child);
            }
        }
        return count;
    }
    
    countElements(node) {
        if (node.type === 'text') return 0;
        let count = 1;
        if (node.children) {
            for (const child of node.children) {
                count += this.countElements(child);
            }
        }
        return count;
    }
    
    countTextNodes(node) {
        if (node.type === 'text') return 1;
        let count = 0;
        if (node.children) {
            for (const child of node.children) {
                count += this.countTextNodes(child);
            }
        }
        return count;
    }
    
    calculateDepth(node, current = 0) {
        if (!node.children || node.children.length === 0) {
            return current;
        }
        
        let maxDepth = current;
        for (const child of node.children) {
            const childDepth = this.calculateDepth(child, current + 1);
            if (childDepth > maxDepth) {
                maxDepth = childDepth;
            }
        }
        
        return maxDepth;
    }
}

module.exports = HTMLParser;