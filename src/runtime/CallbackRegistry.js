/**
 * 🐬 Dolphin Callback Registry
 * 
 * Manages event callbacks (onClick, onChange, etc.) for React-style lambda support.
 * Zero dependencies - parses callbacks and converts to native-executable actions.
 */

const CallbackParser = require('../parser/CallbackParser');

class CallbackRegistry {
    constructor() {
        this._callbacks = new Map();
        this._metadata = new Map();
        this._nextId = 1;
        this._hookState = [];
        this._hookIndex = 0;
        this._currentComponent = null;
    }

    /**
     * Register a callback function and return its ID
     * @param {Function} callback - The function to register
     * @param {string} type - Event type (click, change, etc.)
     * @returns {string} - Unique callback ID like '__cb_1'
     */
    register(callback, type = 'click') {
        if (typeof callback !== 'function') {
            return null;
        }

        const id = `__cb_${this._nextId++}`;
        
        // Store the function
        this._callbacks.set(id, callback);
        
        // Parse and store metadata
        const parsed = CallbackParser.parse(callback);
        this._metadata.set(id, {
            type,
            stateKeys: parsed.stateKeys,
            actions: parsed.actions,
            source: callback.toString()
        });
        
        return id;
    }

    /**
     * Get callback metadata (for Kotlin bridge)
     * @param {string} id - Callback ID
     * @returns {Object} - { type, stateKeys, actions }
     */
    getMetadata(id) {
        return this._metadata.get(id);
    }
    
    /**
     * Get all callbacks metadata (for binary compilation)
     * @returns {Array} - Array of {id, type, stateKeys, actions}
     */
    getAllMetadata() {
        const result = [];
        this._metadata.forEach((meta, id) => {
            result.push({ id, ...meta });
        });
        return result;
    }

    /**
     * Execute a callback by ID with optional arguments
     * @param {string} id - Callback ID
     * @param {Array} args - Arguments to pass to callback
     * @returns {any} - Callback return value
     */
    execute(id, ...args) {
        const callback = this._callbacks.get(id);
        if (!callback) {
            console.warn(`[CallbackRegistry] Callback not found: ${id}`);
            return undefined;
        }

        try {
            return callback(...args);
        } catch (error) {
            console.error(`[CallbackRegistry] Error executing callback ${id}:`, error);
            return undefined;
        }
    }

    /**
     * Check if a callback exists
     * @param {string} id - Callback ID
     * @returns {boolean}
     */
    has(id) {
        return this._callbacks.has(id);
    }

    /**
     * Remove a callback
     * @param {string} id - Callback ID
     */
    remove(id) {
        this._callbacks.delete(id);
    }

    /**
     * Clear all callbacks (for cleanup/unmount)
     */
    clear() {
        this._callbacks.clear();
        this._hookState = [];
        this._hookIndex = 0;
    }

    /**
     * Get callback function by ID (for inspection)
     * @param {string} id - Callback ID
     * @returns {Function|undefined}
     */
    get(id) {
        return this._callbacks.get(id);
    }

    /**
     * Get all callback IDs (for debugging)
     * @returns {Array<string>}
     */
    getAllIds() {
        return Array.from(this._callbacks.keys());
    }

    /**
     * React useState Hook Implementation
     * @param {any} initialValue - Initial state value
     * @returns {[any, Function]} - [state, setState] tuple
     */
    useState(initialValue) {
        const currentIndex = this._hookIndex;
        
        // Initialize state if not exists
        if (this._hookState[currentIndex] === undefined) {
            this._hookState[currentIndex] = initialValue;
        }
        
        const setState = (newValue) => {
            // Support function updater: setState(prev => prev + 1)
            const value = typeof newValue === 'function' 
                ? newValue(this._hookState[currentIndex])
                : newValue;
            
            this._hookState[currentIndex] = value;
            
            // Trigger re-render (will be handled by DolphinRuntime)
            if (typeof global.DolphinRuntime !== 'undefined') {
                global.DolphinRuntime.reRender();
            }
        };
        
        this._hookIndex++;
        return [this._hookState[currentIndex], setState];
    }

    /**
     * Reset hook index (call before each component render)
     */
    resetHooks() {
        this._hookIndex = 0;
    }

    /**
     * Get current hook state (for debugging)
     */
    getHookState() {
        return [...this._hookState];
    }
}

// Create global singleton instance
const callbackRegistry = new CallbackRegistry();

// Make globally available for runtime access
if (typeof global !== 'undefined') {
    global.__dolphinCallbacks = callbackRegistry;
}

// Export for Node.js modules
module.exports = callbackRegistry;
