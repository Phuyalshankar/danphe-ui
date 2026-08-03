'use strict';

const crypto = require('crypto');
const { performance } = require('perf_hooks');

const BinStore = require('../store/BinStore');
const DolphinCompiler = require('../compiler/DolphinCompiler');
const DolphinError = require('../errors/DolphinError');
const { PLATFORM_CONFIG, MAGIC_BYTES } = require('../constants/platforms');
const { VERSION, DEFAULT_CONFIG } = require('../constants/defaults');

class DolphinCSS {
    constructor(userConfig = {}) {
        // Fast config merge
        this.config = Object.assign({}, DEFAULT_CONFIG, userConfig);
        
        // Initialize core components
        this.store = new BinStore(this.config);
        this.compiler = new DolphinCompiler(this.config);
        
        // Simple state object
        this.sessionId = crypto.randomBytes(4).toString('hex');
        this.startTime = Date.now();
        this.platform = this.config.platform;
        this.isInitialized = true;
        
        // Performance tracking (minimal)
        this.opsCount = 0;
        
        // Console log only if debug enabled
        if (this.config.debug) {
            console.log(`[DolphinJS ${VERSION}] Session: ${this.sessionId}, Platform: ${this.platform}`);
        }
        
        // Process handlers (only if needed)
        if (typeof process !== 'undefined' && this.config.cleanupOnExit) {
            process.once('SIGINT', () => this.fastDestroy());
            process.once('SIGTERM', () => this.fastDestroy());
        }
    }
    
    // Fast compile methods
    compile(html, options = {}) {
        const start = performance.now();
        try {
            const result = this.compiler.compile(html, {
                platform: options.platform || this.platform,
                compression: options.compression !== false,
                ...options
            });
            
            this.opsCount++;
            if (this.config.debug) {
                console.log(`[Compile] ${performance.now() - start}ms, ${html.length} → ${result.buffer?.length || 0} bytes`);
            }
            
            return result;
        } catch (error) {
            throw new DolphinError('COMPILE_ERROR', error.message);
        }
    }
    
    compileForPlatform(html, platform, options = {}) {
        if (!PLATFORM_CONFIG[platform]) {
            throw new DolphinError('INVALID_PLATFORM', 
                `Platform ${platform} not supported`);
        }
        
        return this.compile(html, { ...options, platform });
    }
    
    // Fast toCHeader
    toCHeader(binary, variableName = 'dolphin_data', options = {}) {
        if (!Buffer.isBuffer(binary)) {
            return { success: false, error: 'Invalid binary input' };
        }
        
        const platform = options.platform || this.platform;
        const bytesPerLine = 12;
        const bytes = Array.from(binary);
        const hexLines = [];
        
        for (let i = 0; i < bytes.length; i += bytesPerLine) {
            const line = bytes.slice(i, i + bytesPerLine)
                .map(b => `0x${b.toString(16).padStart(2, '0')}`)
                .join(', ');
            hexLines.push(`    ${line}${i + bytesPerLine < bytes.length ? ',' : ''}`);
        }
        
        const header = `// DolphinJS Export - Platform: ${platform}
// Generated: ${new Date().toISOString()}
// Size: ${binary.length} bytes

#ifndef ${variableName.toUpperCase()}_H
#define ${variableName.toUpperCase()}_H

#include <stdint.h>
#include <stddef.h>

const uint8_t ${variableName}[] = {
${hexLines.join('\n')}
};

const size_t ${variableName}_size = sizeof(${variableName});

#endif // ${variableName.toUpperCase()}_H`;
        
        return {
            success: true,
            header: header,
            variableName: variableName,
            length: binary.length
        };
    }
    
    // Fast validation
    validateBinary(binary, expectedPlatform) {
        if (!Buffer.isBuffer(binary) || binary.length < 4) {
            return { valid: false, error: 'Invalid buffer' };
        }
        
        const magic = binary.slice(0, 4);
        const magicStr = magic.toString();
        let detectedPlatform = 'UNKNOWN';
        
        // Fast platform detection
        if (magicStr === 'DOLP') {
            detectedPlatform = 'NORMAL';
        } else if (magicStr.startsWith('\x78\x9C') || magicStr.startsWith('\x78\xDA')) {
            detectedPlatform = this.platform; // Assume current platform for zlib
        }
        
        const isValid = detectedPlatform !== 'UNKNOWN';
        const platformMatch = !expectedPlatform || detectedPlatform === expectedPlatform;
        const alignmentValid = binary.length % 4 === 0;
        
        return {
            valid: isValid && platformMatch && alignmentValid,
            platform: detectedPlatform,
            magicBytes: magic.toString('hex').toUpperCase(),
            platformMatch,
            alignmentValid,
            length: binary.length
        };
    }
    
    // Fast parse
    parse(binary, options = {}) {
        const start = performance.now();
        try {
            const result = this.compiler.parseBinary(binary, options);
            
            if (this.config.debug) {
                console.log(`[Parse] ${performance.now() - start}ms, ${binary.length} bytes`);
            }
            
            return result;
        } catch (error) {
            throw new DolphinError('PARSE_ERROR', error.message);
        }
    }
    
    // Fast storage methods
    save(key, value, options = {}) {
        return this.store.set(key, value, options);
    }
    
    load(key) {
        return this.store.get(key);
    }
    
    delete(key) {
        return this.store.delete(key);
    }
    
    // Fast conversion methods
    htmlToBinary(html, platform = this.platform, options = {}) {
        const result = this.compileForPlatform(html, platform, options);
        return result.success ? result.buffer : null;
    }
    
    binaryToHtml(binary, options = {}) {
        const result = this.parse(binary, options);
        return result.success ? this.astToHtml(result.ast, options) : null;
    }
    
    astToHtml(ast, options = {}) {
        if (!ast || !ast.type) return '';
        
        const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
        
        const serialize = (node) => {
            if (node.type === 'text') {
                return (node.value || '').replace(/[&<>"']/g, 
                    m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
            }
            
            if (node.type === 'element') {
                const tag = node.tag.toLowerCase();
                let attrs = '';
                
                if (node.attributes) {
                    for (const [key, value] of Object.entries(node.attributes)) {
                        if (value === true) {
                            attrs += ` ${key}`;
                        } else {
                            attrs += ` ${key.toLowerCase()}="${String(value).replace(/"/g, '&quot;')}"`;
                        }
                    }
                }
                
                const children = (node.children || []).map(serialize).join('');
                
                if (voidTags.has(tag) && !children) {
                    return `<${tag}${attrs}/>`;
                }
                
                return `<${tag}${attrs}>${children}</${tag}>`;
            }
            
            return '';
        };
        
        return serialize(ast);
    }
    
    // Fast stats
    stats() {
        const storeStats = this.store.getStats ? this.store.getStats() : {};
        const uptime = Date.now() - this.startTime;
        
        return {
            version: VERSION,
            sessionId: this.sessionId,
            uptime: `${uptime}ms`,
            platform: this.platform,
            operations: this.opsCount,
            store: storeStats
        };
    }
    
    // Fast clear
    clearAll() {
        try {
            if (this.store && this.store.clear) {
                this.store.clear();
            }
            if (this.compiler && this.compiler.clearCache) {
                this.compiler.clearCache();
            }
            
            if (this.config.debug) {
                console.log('[DolphinJS] Cleared all data');
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // Fast utility methods
    escapeHtml(text) {
        return text.replace(/[&<>"']/g, 
            m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
    }
    
    // Ultra fast destroy
    fastDestroy() {
        if (!this.isInitialized) return;
        
        try {
            // Clear store if exists
            if (this.store) {
                try {
                    if (this.store.destroy) this.store.destroy();
                    else if (this.store.clear) this.store.clear();
                } catch (e) {
                    // Ignore store cleanup errors
                }
            }
            
            // Clear compiler cache
            if (this.compiler && this.compiler.clearCache) {
                try {
                    this.compiler.clearCache();
                } catch (e) {
                    // Ignore compiler cleanup errors
                }
            }
            
            // Mark as destroyed
            this.isInitialized = false;
            this.store = null;
            this.compiler = null;
            
            if (this.config.debug) {
                console.log('[DolphinJS] Fast destroy completed');
            }
            
        } catch (error) {
            // Silent fail on destroy
            if (this.config.debug) {
                console.error('[DolphinJS] Destroy error:', error.message);
            }
        }
    }
    
    // Alias for compatibility
    destroy() {
        return this.fastDestroy();
    }
}

module.exports = DolphinCSS;