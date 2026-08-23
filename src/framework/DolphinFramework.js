'use strict';

const path = require('path');
const { performance } = require('perf_hooks');
const DolphinCompiler = require('../compiler/DolphinCompiler');
const UniversalUIImporter = require('../ui/UniversalUIImporter');
const DolphinTitanBridge = require('../integration/DolphinTitanBridge');
const HybridParser = require('../parser/HybridParser');
const { VERSION } = require('../constants/defaults');

const { AsyncLocalStorage } = require('async_hooks');
const DolphinRealtimeEngine = require('./DolphinRealtimeEngine');

/**
 * 🌊 DolphinFramework - World's Fastest Mobile App Development Platform
 * The top-level API for building cross-platform mobile apps with Dolphin.
 */
class DolphinFramework {
    constructor(config = {}) {
        if (!global.dolphinDeviceContextStore) {
            const { AsyncLocalStorage } = require('async_hooks');
            global.dolphinDeviceContextStore = new AsyncLocalStorage();
        }
        this.deviceContextStore = global.dolphinDeviceContextStore;
        this.config = {
            platform: config.platform || 'NATIVE',
            debug: config.debug || false,
            hotReload: config.hotReload !== false,
            stateManager: config.stateManager !== false,
            ...config
        };

        // Core engines
        this.compiler = new DolphinCompiler({ ...this.config, titanMode: true });
        this.importer = new UniversalUIImporter();
        this.hybridParser = new HybridParser({ ...this.config, enableJSX: true });
        
        // Load CDNs from config if available
        if (this.config.ui && this.config.ui.cdns) {
            this.importer.setCDNs(this.config.ui.cdns);
        }
        
        this.bridge = new DolphinTitanBridge(this.config);

        // Link engines
        this.bridge.attachDolphinCompiler(this.compiler);
        this.bridge.attachUniversalImporter(this.importer);

        // App state
        if (!global.dolphinScreens) global.dolphinScreens = new Map();
        if (!global.dolphinComponents) global.dolphinComponents = new Map();
        this._screens = global.dolphinScreens;
        this._components = global.dolphinComponents;
        
        if (!global.dolphinGlobalState) global.dolphinGlobalState = {};
        if (!global.dolphinDeviceStates) global.dolphinDeviceStates = new Map();
        if (!global.dolphinStateListeners) global.dolphinStateListeners = new Map();
        
        this._globalState = global.dolphinGlobalState;
        this._deviceStates = global.dolphinDeviceStates;
        this._stateListeners = global.dolphinStateListeners;
        this._devServer = null;

        this._log('🌊 DolphinFramework v' + VERSION + ' initialized');
        this._log(`   Platform: ${this.config.platform}`);
        this._log(`   Hot Reload: ${this.config.hotReload ? 'ON' : 'OFF'}`);

        // ── Compile-time React Hook Polyfills ─────────────────────────────────
        // Allows React-style syntax in JSX components during build-time compilation.
        // ⚠️  Setters (setName, setCount…) are no-ops at compile time.
        //     For runtime reactive state on device → use stateKey prop instead.
        // ─────────────────────────────────────────────────────────────────────
        if (typeof global.useState === 'undefined') {
            global.useState    = (initial) => [initial, () => {}];
            global.useEffect   = (_fn, _deps) => {};
            global.useRef      = (initial) => ({ current: initial });
            global.useMemo     = (fn, _deps) => { try { return fn(); } catch(e) { return undefined; } };
            global.useCallback = (fn, _deps) => fn;
            global.useContext  = (_ctx) => ({});
            global.useReducer  = (reducer, initial) => [initial, () => {}];
            this._log('⚛️  React Hook polyfills registered (compile-time)');
        }
    }

    /**
     * Attach a DevServer for hot patching
     */
    attachDevServer(server) {
        this._devServer = server;
        if (this.bridge) {
            this.bridge._devServer = server;
        }
        this._log('📡 DevServer attached to framework');
        return this;
    }

    // ─────────────────────────────────────────────
    // APP CREATION
    // ─────────────────────────────────────────────

    /**
     * Create a new Dolphin mobile app
     * @param {object} config - App config
     * @returns {DolphinApp}
     */
    static createApp(config = {}) {
        const framework = new DolphinFramework(config);
        return new DolphinApp(framework);
    }

    // ─────────────────────────────────────────────
    // SCREEN MANAGEMENT
    // ─────────────────────────────────────────────

    /**
     * Register a screen
     * @param {string} name - Screen name
     * @param {string|object|function} ui - HTML, JSX, or UI Schema
     * @param {object} options - Compile options
     */
    registerScreen(name, ui, options = {}) {
        const startTime = performance.now();
        if (!global.dolphinScreenFunctions) global.dolphinScreenFunctions = new Map();
        global.dolphinScreenFunctions.set(name, ui);
        
        // Use HybridParser for auto-detection and conversion
        const parseResult = this.hybridParser.parse(ui, {
            platform: this.config.platform,
            ...options
        });

        if (!parseResult.success) {
            throw new Error(`Failed to parse screen "${name}": ${parseResult.error}`);
        }

        // Determine what to compile:
        //  - HTML/JSX string path  → parseResult.html or convertedHTML (string)
        //  - Schema/COMPONENT path → parseResult.content (object schema)
        //  Both are handled by bridge.compile() which auto-detects type.
        const contentToCompile = parseResult.html
            || parseResult.convertedHTML
            || parseResult.content;

        if (!contentToCompile) {
            throw new Error(`No compilable content from screen "${name}"`);
        }

        // Convert parsed content to binary
        const result = this.bridge.compile(contentToCompile, {
            platform: this.config.platform,
            ...options
        });

        if (!result.success) {
            throw new Error(`Failed to compile screen "${name}": ${result.error}`);
        }

        this._screens.set(name, {
            name,
            binary: result.buffer,
            rawData: result.stringData || Buffer.alloc(0),
            binaryType: result.binaryType || 'DOLPHIN',
            contentType: parseResult.contentType,
            size: result.buffer.length,
            compiledAt: Date.now(),
            compileTime: performance.now() - startTime,
            parseTime: parseResult.parseTime
        });

        this._log(`📱 Screen "${name}" registered (${parseResult.contentType}, ${result.buffer.length} bytes, ${(performance.now() - startTime).toFixed(2)}ms)`);
        return this;
    }

    /**
     * Get a compiled screen binary
     * @param {string} name - Screen name
     */
    getScreen(name) {
        const screen = this._screens.get(name);
        if (!screen) throw new Error(`Screen "${name}" not found`);
        return screen;
    }

    // ─────────────────────────────────────────────
    // COMPONENT MANAGEMENT
    // ─────────────────────────────────────────────

    /**
     * Register a reusable component
     * @param {string} name - Component name
     * @param {object} schema - Component UI schema
     */
    registerComponent(name, schema) {
        const binary = this.importer.importSchema(schema, {
            platform: this.config.platform,
            fallbackOnError: true
        });

        this._components.set(name, {
            name,
            schema,
            binary,
            registeredAt: Date.now()
        });

        this._log(`🧩 Component "${name}" registered (16 bytes Titan binary)`);
        return this;
    }

    /**
     * Get a component's Titan binary
     * @param {string} name - Component name
     */
    getComponent(name) {
        const comp = this._components.get(name);
        if (!comp) throw new Error(`Component "${name}" not found`);
        return comp;
    }

    // ─────────────────────────────────────────────
    // STATE MANAGEMENT
    // ─────────────────────────────────────────────

    /**
     * Set app state (device-specific if context is active)
     * @param {string} key
     * @param {*} value
     */
    setState(key, value) {
        const deviceId = this.deviceContextStore.getStore();
        let oldValue;

        if (deviceId && deviceId !== 'default') {
            if (!this._deviceStates.has(deviceId)) {
                this._deviceStates.set(deviceId, {});
            }
            const devState = this._deviceStates.get(deviceId);
            oldValue = devState[key];
            devState[key] = value;
            console.log(`[Dolphin State] [Device: ${deviceId}] Patching state key "${key}"`);

            // Sync ONLY with this specific connected device
            if (this._devServer && this._devServer.server) {
                this._devServer.server.patchState(deviceId, key, value);
            }
        } else {
            oldValue = this._globalState[key];
            this._globalState[key] = value;
            if (!global.dolphinState) global.dolphinState = {};
            global.dolphinState[key] = value;

            // Sync with all connected devices
            if (this._devServer && this._devServer.server) {
                const devices = this._devServer.server.getConnectedDevices();
                devices.forEach(dev => {
                    this._devServer.server.patchState(dev.id, key, value);
                });
            }
        }

        // Notify listeners
        const listeners = this._stateListeners.get(key) || [];
        listeners.forEach(fn => {
            try { fn(value, oldValue); } catch (e) {}
        });
    }

    /**
     * Get app state (device-specific if context is active)
     * @param {string} key
     */
    getState(key) {
        const deviceId = this.deviceContextStore.getStore();
        if (deviceId && deviceId !== 'default' && this._deviceStates.has(deviceId)) {
            const devState = this._deviceStates.get(deviceId);
            if (key in devState) {
                return devState[key];
            }
        }
        if (!key) return this._globalState;
        return this._globalState[key];
    }

    /**
     * Subscribe to state changes
     * @param {string} key
     * @param {function} listener
     */
    onState(key, listener) {
        if (!this._stateListeners.has(key)) {
            this._stateListeners.set(key, []);
        }
        this._stateListeners.get(key).push(listener);
        return () => {
            const listeners = this._stateListeners.get(key) || [];
            const idx = listeners.indexOf(listener);
            if (idx > -1) listeners.splice(idx, 1);
        };
    }

    // ─────────────────────────────────────────────
    // STATS & DIAGNOSTICS
    // ─────────────────────────────────────────────

    /**
     * Get platform performance report
     */
    getReport() {
        const compilerMetrics = this.compiler.getMetrics();
        const screens = [...this._screens.values()];
        const components = [...this._components.values()];
        const totalBinarySize = screens.reduce((sum, s) => sum + s.size, 0)
            + (components.length * 16);

        return {
            version: VERSION,
            platform: this.config.platform,
            screens: {
                count: screens.length,
                list: screens.map(s => ({ name: s.name, size: s.size, compileTime: s.compileTime.toFixed(2) + 'ms' }))
            },
            components: {
                count: components.length,
                list: components.map(c => c.name)
            },
            totalBinarySize: `${totalBinarySize} bytes`,
            reactNativeEquivalent: `~${Math.round(totalBinarySize / 1024 / 0.3)} KB (estimated)`,
            speedup: '∞ (pre-compiled binary)',
            compiler: compilerMetrics,
            memory: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
        };
    }

    _log(msg) {
        if (this.config.debug || process.env.DOLPHIN_DEBUG) {
            console.log(msg);
        }
    }
}

// ─────────────────────────────────────────────
// DolphinApp - Chainable app builder
// ─────────────────────────────────────────────

class DolphinApp {
    constructor(framework) {
        this.framework = framework;
        this._name = 'DolphinApp';
        this._version = '1.0.0';
        this._entryScreen = null;
        this._actionHandlers = new Map();
        this._actionHandlerSetup = false;
        global.dolphinApp = this;

        Object.defineProperty(this, 'realtime', {
            get: () => {
                const deviceId = this.framework.deviceContextStore.getStore() || 'default';
                if (!global.dolphinRealtimeEngines) {
                    global.dolphinRealtimeEngines = new Map();
                }
                if (!global.dolphinRealtimeEngines.has(deviceId)) {
                    global.dolphinRealtimeEngines.set(deviceId, new DolphinRealtimeEngine(this, deviceId));
                } else {
                    global.dolphinRealtimeEngines.get(deviceId).app = this;
                }
                return global.dolphinRealtimeEngines.get(deviceId);
            }
        });
    }

    // ─────────────────────────────────────────────
    // APP LIFECYCLE
    // ─────────────────────────────────────────────

    /**
     * Clear all registered screens and components
     */
    clear() {
        this.framework._screens.clear();
        this.framework._components.clear();
        this.framework._log('🧹 App cleared (screens and components)');
        return this;
    }

    /**
     * Set app name
     */
    name(name) {
        this._name = name;
        return this;
    }

    /**
     * Set app version
     */
    version(version) {
        this._version = version;
        return this;
    }

    /**
     * Get app state
     */
    getState(key, deviceId = null) {
        if (deviceId) {
            return this.framework.deviceContextStore.run(deviceId, () => {
                return this.framework.getState(key);
            });
        }
        return this.framework.getState(key);
    }

    /**
     * Add a screen to the app
     */
    screen(name, ui, options = {}) {
        this.framework.registerScreen(name, ui, options);
        if (this.framework.importer && typeof this.framework.importer.registerLambdas === 'function') {
            this.framework.importer.registerLambdas(this);
        }
        return this;
    }

    page(name, pageDef) {
        if (name && typeof name === 'object' && typeof name.bind === 'function') {
            name.bind(this);
        } else if (typeof name === 'string' && typeof pageDef === 'function') {
            this.screen(name, pageDef());
        } else if (typeof name === 'string' && pageDef && typeof pageDef.bind === 'function') {
            pageDef.bind(this);
        } else {
            throw new Error('Invalid page definition. Use app.page(pageModule) or app.page("Name", Component).');
        }
        return this;
    }

    /**
     * Add a component to the app
     */
    component(name, schema) {
        this.framework.registerComponent(name, schema);
        if (this.framework.importer && typeof this.framework.importer.registerLambdas === 'function') {
            this.framework.importer.registerLambdas(this);
        }
        return this;
    }

    /**
     * Set app state
     */
    state(key, value, deviceId = null) {
        if (value === undefined) {
            return this.getState(key, deviceId);
        }
        if (deviceId) {
            return this.framework.deviceContextStore.run(deviceId, () => {
                this.framework.setState(key, value);
                return this;
            });
        }
        this.framework.setState(key, value);
        return this;
    }

    /**
     * Get app state
     */
    getState(key, deviceId = null) {
        if (deviceId) {
            return this.framework.deviceContextStore.run(deviceId, () => {
                return this.framework.getState(key);
            });
        }
        return this.framework.getState(key);
    }

    /**
     * Listen to state changes
     */
    onState(key, fn) {
        return this.framework.onState(key, fn);
    }

    /**
     * Display a system alert or toast
     * @param {string} title
     * @param {string} message
     */
    alert(title, message) {
        this.framework.setState('app_alert', `${title}|${message}`);
        return this;
    }

    /**
     * Attach a dev server for real-time patching
     */
    attachDevServer(server) {
        this.framework.attachDevServer(server);
        return this;
    }

    /**
     * Set a custom action handler for the entire app
     * @param {function} handler - Function receiving ({deviceId}, action)
     */
    onAction(handler) {
        this._actionHandler = handler;
        if (this.framework.bridge) {
            this.framework.bridge.setActionHandler(handler);
        }
        return this;
    }

    /**
     * Register a modular handler for a specific action or wildcard pattern
     * @param {string} actionName - E.g. 'app:fetch_products' or 'nav:*'
     * @param {function} handler - Async function (action, value, deviceId)
     */
    action(actionName, handler) {
        this._actionHandlers.set(actionName, handler);
        
        if (!this._actionHandlerSetup) {
            this._actionHandlerSetup = true;
            this.onAction(async (action, value, deviceId) => {
                return await this.framework.deviceContextStore.run(deviceId || 'default', async () => {
                    // Handle state sync from device (values starting with '=')
                    // Save to state AND continue to call app.action() handler below.
                    if (typeof value === 'string' && value.startsWith('=')) {
                        const valStr = value.substring(1);
                        this.state(action, valStr);
                        // ← NO early return — fall through to handler lookup
                    }

                    // Exact match
                    if (this._actionHandlers.has(action)) {
                        return await this._actionHandlers.get(action)(action, value, deviceId);
                    }
                    
                    // Parameter/Colon-separated match (e.g. action 'app:add_to_cart:1' matches key 'app:add_to_cart')
                    for (const [key, fn] of this._actionHandlers.entries()) {
                        if (action.startsWith(key + ':')) {
                            return await fn(action, value, deviceId);
                        }
                    }
                    
                    // Prefix wildcard matching (e.g. 'nav:*')
                    for (const [key, fn] of this._actionHandlers.entries()) {
                        if (key.includes('*')) {
                            const prefix = key.split('*')[0];
                            if (action.startsWith(prefix)) {
                                return await fn(action, value, deviceId);
                            }
                        }
                    }
                    
                    console.log(`❓ Unhandled dynamic action: ${action}`);
                });
            });
        }
        return this;
    }

    /**
     * Patch a screen in real-time (Hot Reload / State Sync)
     * @param {string} name - Screen name
     */
    patchScreen(name) {
        const activeDeviceId = this.framework.deviceContextStore.getStore();
        const screen = this.framework.getScreen(name);
        // Only call once. DevServer is preferred for broadcasting.
        if (this.framework._devServer) {
            if (activeDeviceId && activeDeviceId !== 'default') {
                this.framework._devServer.server.patchScreen(activeDeviceId, name, screen);
                this.framework._log(`📡 SCREEN PATCH: ${name} → Device ${activeDeviceId} (context isolated)`);
            } else {
                this.framework._devServer.patchScreen(name, screen);
            }
        } else if (this.framework.bridge) {
            this.framework.bridge.patchScreen(name, screen);
        }
        return this;
    }

    /**
     * Compile HTML to Titan Binary directly (BinCSS integration)
     * @param {string} html 
     */
    compileHtml(html) {
        const result = this.framework.bridge.compile(html, {
            platform: this.framework.config.platform,
            outputFormat: 'TITAN'
        });
        if (!result.success) throw new Error(`HTML Compilation Error: ${result.error}`);
        return result.buffer;
    }

    /**
     * Set the entry screen (first screen shown)
     */
    entry(screenName) {
        this._entryScreen = screenName;
        return this;
    }

    /**
     * Set the global drawer screen
     */
    drawer(screenName) {
        this._drawerScreen = screenName;
        return this;
    }

    /**
     * Build the app and return binary bundle
     */
    build() {
        const report = this.framework.getReport();
        const screens = this.framework._screens;
        const components = this.framework._components;

        if (!this._entryScreen && screens.size > 0) {
            this._entryScreen = [...screens.keys()][0];
        }

        return {
            app: this._name,
            version: this._version,
            entry: this._entryScreen,
            drawer: this._drawerScreen,
            __actionHandler: this._actionHandler,
            screens: Object.fromEntries(
                [...screens.entries()].map(([k, v]) => [k, {
                    size: v.size,
                    binaryType: v.binaryType,
                    binary: v.binary,
                    rawData: v.rawData // New: export string pool
                }])
            ),
            components: Object.fromEntries(
                [...components.entries()].map(([k, v]) => [k, {
                    binary: v.binary
                }])
            ),
            report
        };
    }

    /**
     * Navigate to a different screen
     * @param {string} screenName - Target screen name
     * @param {string} [deviceId] - Target device ID (if omitted, uses active context)
     */
    navigate(screenName, deviceId) {
        if (!this.framework._screens.has(screenName)) {
            console.error(`❌ Screen "${screenName}" not found`);
            return false;
        }
        
        const activeDeviceId = deviceId || this.framework.deviceContextStore.getStore();
        this._currentScreen = screenName;
        this.framework._log(`🔄 Navigating to screen: ${screenName} (device: ${activeDeviceId || 'all'})`);
        
        // Notify connected devices (if dev server is running)
        if (this.framework._devServer && this.framework._devServer.server) {
            const screen = this.framework.getScreen(screenName);
            const devices = this.framework._devServer.server.getConnectedDevices();
            devices.forEach(dev => {
                if (activeDeviceId && dev.id !== activeDeviceId) return;
                
                // First, send the screen content
                this.framework._devServer.server.patchScreen(dev.id, screen.name, screen);
                // Then, tell the app to switch to it
                this.framework._devServer.server.navigateToScreen(dev.id, screenName);
            });
        }
        
        return true;
    }

    /**
     * Get current screen name
     */
    getCurrentScreen() {
        return this._currentScreen || this._entryScreen;
    }

    /**
     * Open the side drawer on connected devices
     */
    openDrawer(drawerName = 'MainDrawer') {
        if (this.framework._devServer && this.framework._devServer.server) {
            const devices = this.framework._devServer.server.getConnectedDevices();
            devices.forEach(dev => {
                this.framework._devServer.server.openDrawer(dev.id, drawerName);
            });
        }
    }

    /**
     * Open the bottom drawer / bottom sheet on connected devices
     */
    openBottomDrawer(drawerName = 'BottomDrawer') {
        if (this.framework._devServer && this.framework._devServer.server) {
            const devices = this.framework._devServer.server.getConnectedDevices();
            devices.forEach(dev => {
                this.framework._devServer.server.sendToDevice(dev.id, Buffer.from(`bottom_drawer:open:${drawerName}`), 0x07);
            });
        }
    }

    /**
     * Close the bottom drawer / bottom sheet on connected devices
     */
    closeBottomDrawer() {
        if (this.framework._devServer && this.framework._devServer.server) {
            const devices = this.framework._devServer.server.getConnectedDevices();
            devices.forEach(dev => {
                this.framework._devServer.server.sendToDevice(dev.id, Buffer.from(`bottom_drawer:close`), 0x07);
            });
        }
    }

    /**
     * Print a performance summary
     */
    printReport() {
        const report = this.framework.getReport();
        console.log('\n' + '═'.repeat(55));
        console.log('  🌊 DOLPHIN MOBILE PLATFORM - BUILD REPORT');
        console.log('═'.repeat(55));
        console.log(`  App:         ${this._name} v${this._version}`);
        console.log(`  Platform:    ${report.platform}`);
        console.log(`  Screens:     ${report.screens.count}`);
        report.screens.list.forEach(s => {
            console.log(`    • ${s.name} (${s.size} bytes, compiled in ${s.compileTime})`);
        });
        console.log(`  Components:  ${report.components.count}`);
        console.log(`  Total Size:  ${report.totalBinarySize}`);
        console.log(`  Memory:      ${report.memory}`);
        console.log(`  Speed:       ${report.speedup}`);
        console.log(`  Build Time:  ${new Date().toLocaleString()}`);
        console.log('═'.repeat(55));
        console.log('  ✅ Ready for deployment on Android & iOS');
        console.log('═'.repeat(55) + '\n');
        return this;
    }
}

module.exports = { DolphinFramework, DolphinApp };
