'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineStore = defineStore;
function defineStore(sliceFn) {
    let _app = null;
    let _screens = {};
    // ── set / get / patch — builder ले दिने helpers ──
    const set = (key, value) => {
        if (!_app)
            throw new Error('defineStore: bind(app) पहिले call गर्नुहोस्!');
        _app.state(key, value);
    };
    const get = (key) => {
        if (!_app)
            throw new Error('defineStore: bind(app) पहिले call गर्नुहोस्!');
        return _app.getState(key);
    };
    const patch = (...names) => {
        if (!_app)
            throw new Error('defineStore: bind(app) पहिले call गर्नुहोस्!');
        names.forEach((name) => {
            const fn = _screens[name];
            if (fn) {
                _app.screen(name, fn());
                _app.patchScreen(name);
            }
            else {
                console.warn(`defineStore: screen "${name}" register भएको छैन।`);
            }
        });
    };
    // ── slice evaluate गर्ने ──
    const slice = sliceFn(set, get, patch);
    // ── state keys र actions अलग गर्ने ──
    const stateKeys = {};
    const actionKeys = {};
    for (const [key, val] of Object.entries(slice)) {
        if (typeof val === 'function') {
            actionKeys[key] = val;
        }
        else {
            stateKeys[key] = val;
        }
    }
    const store = {
        // ── app bind गर्ने + initial state register गर्ने ──
        bind(app) {
            _app = app;
            // Initial state register
            for (const [key, val] of Object.entries(stateKeys)) {
                app.state(key, val);
            }
            // Actions register (app.action)
            for (const [name, fn] of Object.entries(actionKeys)) {
                // camelCase → app:snake_case  (addTask → app:add_task)
                const actionKey = 'app:' + name.replace(/([A-Z])/g, '_$1').toLowerCase();
                app.action(actionKey, async (_action, value, deviceId) => {
                    return await fn(value, deviceId);
                });
            }
            return store;
        },
        // ── screens register गर्ने ──
        screens(screenMap) {
            _screens = { ..._screens, ...screenMap };
            return store;
        },
        // ── जुनसुकै ठाउँबाट state access ──
        get,
        set,
        patch,
        // ── actions direct call गर्न ──
        actions: new Proxy({}, {
            get(_target, name) {
                const key = String(name);
                if (actionKeys[key]) {
                    return (...args) => actionKeys[key](...args);
                }
                throw new Error(`defineStore: action "${key}" फेला परेन।`);
            },
        }),
    };
    return store;
}
exports.default = { defineStore };
//# sourceMappingURL=defineStore.js.map