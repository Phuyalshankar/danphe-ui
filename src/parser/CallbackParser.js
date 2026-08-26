/**
 * 🐬 Dolphin Callback Parser - 24-byte Protocol Ready
 * 
 * Parses arrow functions and extracts state dependencies and actions.
 * Converts JavaScript lambdas to Kotlin-executable action sequences.
 * 
 * Example:
 *   () => console.log({email: state.email, password: state.password})
 * Becomes:
 *   { stateKeys: ['email', 'password'], actions: ['log:email,password'] }
 * 
 * 24-byte Upgrade:
 *   - Version: 0x02
 *   - Better state extraction (React, Vue, Dolphin)
 *   - More action types (API, Alert, Navigation)
 *   - Registry with metadata
 *   - Statistics and validation
 */

const DolphinError = require('../errors/DolphinError');

// ─── Action Types ────────────────────────────────────────────────────────────
const ACTION_TYPES = {
    LOG: 'log',
    SET: 'set',
    NAV: 'nav',
    TOAST: 'toast',
    API: 'api',
    ALERT: 'alert',
    CONFIRM: 'confirm',
    PROMPT: 'prompt',
    CALLBACK: 'callback',
};

class CallbackParser {
    /**
     * Parse a callback function and extract actionable data
     * @param {Function} callback - The callback function
     * @returns {Object} - { stateKeys: [], actions: [], version: 0x02 }
     */
    static parse(callback) {
        if (typeof callback !== 'function') {
            return { stateKeys: [], actions: [], version: 0x02 };
        }

        try {
            // Get function source code
            const source = callback.toString();
            
            // Extract state dependencies
            const stateKeys = this._extractStateKeys(source);
            
            // Extract actions
            const actions = this._extractActions(source);
            
            // 🆕 24-byte: Return with version
            return { 
                stateKeys, 
                actions,
                version: 0x02,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('[CallbackParser] Error parsing callback:', error);
            return { stateKeys: [], actions: [], version: 0x02 };
        }
    }

    /**
     * Extract state keys accessed in the callback
     * Looks for: state.email, state.password, this.state, useState, stateKey:
     * 🆕 24-byte: Better extraction with nested support
     */
    static _extractStateKeys(source) {
        const keys = [];
        
        // Pattern 1: state.key (Dolphin)
        const statePattern = /state\.(\w+)/g;
        let match;
        while ((match = statePattern.exec(source)) !== null) {
            keys.push(match[1]);
        }
        
        // 🆕 Pattern 2: this.state.key (React class)
        const thisStatePattern = /this\.state\.(\w+)/g;
        while ((match = thisStatePattern.exec(source)) !== null) {
            keys.push(match[1]);
        }
        
        // 🆕 Pattern 3: useState destructuring (React hooks)
        const useStatePattern = /const\s*\[\s*(\w+)\s*,\s*set\1\s*\]\s*=\s*useState/g;
        while ((match = useStatePattern.exec(source)) !== null) {
            keys.push(match[1]);
        }
        
        // 🆕 Pattern 4: stateKey: 'key' (Dolphin binding)
        const stateKeyPattern = /stateKey:\s*['"](\w+)['"]/g;
        while ((match = stateKeyPattern.exec(source)) !== null) {
            keys.push(match[1]);
        }
        
        return [...new Set(keys)]; // Remove duplicates
    }

    /**
     * Extract actions from the callback
     * Supports: console.log, setState, navigation, toast, API, alert
     * 🆕 24-byte: More action types
     */
    static _extractActions(source) {
        const actions = [];

        // ── 1. console.log ──
        if (/console\.log/.test(source)) {
            const stateKeys = this._extractStateKeys(source);
            if (stateKeys.length > 0) {
                actions.push(`${ACTION_TYPES.LOG}:${stateKeys.join(',')}`);
            } else {
                actions.push(`${ACTION_TYPES.LOG}:`);
            }
        }

        // ── 2. setState ──
        const setStatePattern = /set(\w+)\s*\(\s*['"]?([^'")]+)['"]?\s*\)/g;
        let match;
        while ((match = setStatePattern.exec(source)) !== null) {
            const key = match[1].toLowerCase();
            const value = match[2];
            actions.push(`${ACTION_TYPES.SET}:${key}=${value}`);
        }

        // ── 3. Navigation ──
        if (/nav:|navigate\s*\(/.test(source)) {
            const navPattern = /nav:(\w+)|navigate\s*\(\s*['"](\w+)['"]\s*\)/;
            const navMatch = source.match(navPattern);
            if (navMatch) {
                const screen = navMatch[1] || navMatch[2];
                actions.push(`${ACTION_TYPES.NAV}:${screen}`);
            } else {
                actions.push(`${ACTION_TYPES.NAV}:default`);
            }
        }

        // ── 4. Toast ──
        if (/toast:|alert\s*\(/.test(source)) {
            const toastPattern = /toast:(['"]?)([^'"]+)\1|alert\s*\(\s*['"]([^'"]+)['"]\s*\)/;
            const toastMatch = source.match(toastPattern);
            if (toastMatch) {
                const message = toastMatch[2] || toastMatch[3];
                actions.push(`${ACTION_TYPES.TOAST}:${message}`);
            } else {
                actions.push(`${ACTION_TYPES.TOAST}:`);
            }
        }

        // ── 5. API Calls ──
        if (/api\.|fetch\s*\(/.test(source)) {
            // 🆕 Extract API endpoint if possible
            const apiPattern = /api\.(\w+)\s*\(/;
            const apiMatch = source.match(apiPattern);
            if (apiMatch) {
                actions.push(`${ACTION_TYPES.API}:${apiMatch[1]}`);
            } else {
                actions.push(`${ACTION_TYPES.API}:call`);
            }
        }

        // ── 6. Alert ──
        if (/alert\s*\(/.test(source)) {
            const alertPattern = /alert\s*\(\s*['"]([^'"]+)['"]\s*\)/;
            const alertMatch = source.match(alertPattern);
            if (alertMatch) {
                actions.push(`${ACTION_TYPES.ALERT}:${alertMatch[1]}`);
            } else {
                actions.push(`${ACTION_TYPES.ALERT}:`);
            }
        }

        // ── 7. Confirm ──
        if (/confirm\s*\(/.test(source)) {
            const confirmPattern = /confirm\s*\(\s*['"]([^'"]+)['"]\s*\)/;
            const confirmMatch = source.match(confirmPattern);
            if (confirmMatch) {
                actions.push(`${ACTION_TYPES.CONFIRM}:${confirmMatch[1]}`);
            } else {
                actions.push(`${ACTION_TYPES.CONFIRM}:Confirm action?`);
            }
        }

        // ── 8. Prompt ──
        if (/prompt\s*\(/.test(source)) {
            const promptPattern = /prompt\s*\(\s*['"]([^'"]+)['"]\s*\)/;
            const promptMatch = source.match(promptPattern);
            if (promptMatch) {
                actions.push(`${ACTION_TYPES.PROMPT}:${promptMatch[1]}`);
            } else {
                actions.push(`${ACTION_TYPES.PROMPT}:Enter value`);
            }
        }

        // ── 7. Generic callback ──
        if (actions.length === 0) {
            actions.push(`${ACTION_TYPES.CALLBACK}:execute`);
        }

        return actions;
    }

    /**
     * Create a callback ID and store metadata
     * 🆕 24-byte: Store with version and timestamp
     * @param {Function} callback - The callback function
     * @param {string} type - Event type (click, change, etc.)
     * @param {Object} options - Additional options
     * @returns {string} - Callback ID
     */
    static register(callback, type = 'click', options = {}) {
        if (typeof callback !== 'function') {
            throw new DolphinError('INVALID_CALLBACK', 'Callback must be a function');
        }

        const parsed = this.parse(callback);
        
        // 🆕 24-byte: Generate ID with version
        const id = `cb_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`;
        
        // 🆕 24-byte: Store with full metadata
        if (typeof global !== 'undefined') {
            global.__dolphinCallbackMeta = global.__dolphinCallbackMeta || {};
            global.__dolphinCallbackMeta[id] = {
                type,
                stateKeys: parsed.stateKeys,
                actions: parsed.actions,
                version: 0x02,        // 🆕 24-byte version
                timestamp: Date.now(),
                options,
                callback // Keep original function for execution
            };
        }
        
        return id;
    }

    /**
     * Get callback metadata
     * 🆕 24-byte: Returns version info
     */
    static getMeta(id) {
        if (typeof global !== 'undefined' && global.__dolphinCallbackMeta) {
            const meta = global.__dolphinCallbackMeta[id];
            if (meta) {
                // 🆕 24-byte: Ensure version is set
                meta.version = meta.version || 0x02;
                return meta;
            }
        }
        return null;
    }

    /**
     * Execute a callback by ID
     */
    static execute(id, context = {}) {
        const meta = this.getMeta(id);
        if (!meta || !meta.callback) {
            console.warn(`[CallbackParser] Callback not found: ${id}`);
            return;
        }

        try {
            // Execute the original function
            return meta.callback(context);
        } catch (error) {
            console.error(`[CallbackParser] Error executing callback ${id}:`, error);
        }
    }

    /**
     * 🆕 24-byte: Get all registered callbacks
     */
    static getAllCallbacks() {
        if (typeof global !== 'undefined' && global.__dolphinCallbackMeta) {
            return global.__dolphinCallbackMeta;
        }
        return {};
    }

    /**
     * 🆕 24-byte: Get callbacks by version
     */
    static getCallbacksByVersion(version = 0x02) {
        const all = this.getAllCallbacks();
        const result = {};
        for (const [id, meta] of Object.entries(all)) {
            if (meta.version === version) {
                result[id] = meta;
            }
        }
        return result;
    }

    /**
     * 🆕 24-byte: Clear all callbacks
     */
    static clearAll() {
        if (typeof global !== 'undefined') {
            global.__dolphinCallbackMeta = {};
        }
    }

    /**
     * 🆕 24-byte: Get callback statistics
     */
    static getStats() {
        const all = this.getAllCallbacks();
        const versions = {};
        let total = 0;
        
        for (const [id, meta] of Object.entries(all)) {
            total++;
            const ver = meta.version || 'unknown';
            versions[ver] = (versions[ver] || 0) + 1;
        }
        
        return {
            total,
            versions,
            timestamp: Date.now()
        };
    }

    /**
     * 🆕 24-byte: Validate callback for 24-byte compatibility
     */
    static validate(callback) {
        if (typeof callback !== 'function') {
            return { valid: false, reason: 'Not a function' };
        }
        
        try {
            const parsed = this.parse(callback);
            return {
                valid: true,
                stateKeys: parsed.stateKeys,
                actions: parsed.actions,
                version: 0x02
            };
        } catch (error) {
            return {
                valid: false,
                reason: error.message
            };
        }
    }
}

module.exports = CallbackParser;