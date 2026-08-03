/**
 * 🐬 Dolphin Callback Parser
 * 
 * Parses arrow functions and extracts state dependencies and actions.
 * Converts JavaScript lambdas to Kotlin-executable action sequences.
 * 
 * Example:
 *   () => console.log({email: state.email, password: state.password})
 * Becomes:
 *   { stateKeys: ['email', 'password'], actions: ['log:email,password'] }
 */

class CallbackParser {
    /**
     * Parse a callback function and extract actionable data
     * @param {Function} callback - The callback function
     * @returns {Object} - { stateKeys: [], actions: [] }
     */
    static parse(callback) {
        if (typeof callback !== 'function') {
            return { stateKeys: [], actions: [] };
        }

        try {
            // Get function source code
            const source = callback.toString();
            
            // Extract state dependencies
            const stateKeys = this._extractStateKeys(source);
            
            // Extract actions
            const actions = this._extractActions(source);
            
            return { stateKeys, actions };
        } catch (error) {
            console.error('[CallbackParser] Error parsing callback:', error);
            return { stateKeys: [], actions: [] };
        }
    }

    /**
     * Extract state keys accessed in the callback
     * Looks for: state.email, state.password, etc.
     */
    static _extractStateKeys(source) {
        const statePattern = /state\.(\w+)/g;
        const matches = [...source.matchAll(statePattern)];
        const keys = matches.map(m => m[1]);
        return [...new Set(keys)]; // Remove duplicates
    }

    /**
     * Extract actions from the callback
     * Supports: console.log, setState, navigation, etc.
     */
    static _extractActions(source) {
        const actions = [];

        // console.log detection
        if (/console\.log/.test(source)) {
            const stateKeys = this._extractStateKeys(source);
            if (stateKeys.length > 0) {
                actions.push(`log:${stateKeys.join(',')}`);
            } else {
                actions.push('log:');
            }
        }

        // setState detection: setName('value') or setState({...})
        const setStatePattern = /set(\w+)\s*\(\s*['"]?([^'")]+)['"]?\s*\)/g;
        const setStateMatches = [...source.matchAll(setStatePattern)];
        setStateMatches.forEach(match => {
            const key = match[1].toLowerCase(); // setName -> name
            const value = match[2];
            actions.push(`set:${key}=${value}`);
        });

        // Navigation: nav:Screen or navigate('Screen')
        if (/nav:|navigate\s*\(/.test(source)) {
            const navPattern = /nav:(\w+)|navigate\s*\(\s*['"](\w+)['"]\s*\)/;
            const navMatch = source.match(navPattern);
            if (navMatch) {
                const screen = navMatch[1] || navMatch[2];
                actions.push(`nav:${screen}`);
            }
        }

        // Toast/alert
        if (/toast:|alert\s*\(/.test(source)) {
            const toastPattern = /toast:(['"]?)([^'"]+)\1|alert\s*\(\s*['"]([^'"]+)['"]\s*\)/;
            const toastMatch = source.match(toastPattern);
            if (toastMatch) {
                const message = toastMatch[2] || toastMatch[3];
                actions.push(`toast:${message}`);
            }
        }

        // API calls: api.login(...), fetch(...)
        if (/api\.|fetch\s*\(/.test(source)) {
            actions.push('api:call');
        }

        // If no actions detected, add a generic callback action
        if (actions.length === 0) {
            actions.push('callback:execute');
        }

        return actions;
    }

    /**
     * Create a callback ID and store metadata
     * @param {Function} callback - The callback function
     * @param {string} type - Event type (click, change, etc.)
     * @returns {string} - Callback ID
     */
    static register(callback, type = 'click') {
        const parsed = this.parse(callback);
        
        // For now, store the actual function
        // In production, we'd serialize the parsed data
        const id = `__cb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Store in global registry
        if (typeof global !== 'undefined') {
            global.__dolphinCallbackMeta = global.__dolphinCallbackMeta || {};
            global.__dolphinCallbackMeta[id] = {
                type,
                stateKeys: parsed.stateKeys,
                actions: parsed.actions,
                callback // Keep original function for now
            };
        }
        
        return id;
    }

    /**
     * Get callback metadata
     */
    static getMeta(id) {
        if (typeof global !== 'undefined' && global.__dolphinCallbackMeta) {
            return global.__dolphinCallbackMeta[id];
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
}

module.exports = CallbackParser;
