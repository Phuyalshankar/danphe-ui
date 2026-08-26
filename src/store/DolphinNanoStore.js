'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStore = createStore;
exports.create = create;
exports.atom = atom;
const shallowEqual = (objA, objB) => {
    if (Object.is(objA, objB))
        return true;
    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null)
        return false;
    const a = objA;
    const b = objB;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length)
        return false;
    for (const key of keysA) {
        if (!Object.prototype.hasOwnProperty.call(b, key) || !Object.is(a[key], b[key])) {
            return false;
        }
    }
    return true;
};
// Safe React detector (Zero-crash if React is not installed)
let React = null;
try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    React = require('react');
}
catch {
    // Pure Dolphin Native Mode (No React dependency)
    React = null;
}
function createStore(initial = {}) {
    let state = { ...initial };
    const listeners = new Set();
    const activeTimeouts = new Map();
    const notify = (key, value) => {
        listeners.forEach((l) => l(state, key, value));
    };
    const subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };
    // ⚡ Auto-Broadcast Titan Opcode 0x08 (PATCH_STATE) to Mobile & TV Box Native Engine
    const broadcastTitanPatch = (key, value) => {
        if (globalThis.dolphinDevServer) {
            try {
                const devServer = globalThis.dolphinDevServer;
                if (typeof devServer.patchState === 'function') {
                    devServer.patchState(null, key, value);
                }
                else if (devServer.server && typeof devServer.server.broadcast === 'function') {
                    const keyBuf = Buffer.from(String(key), 'utf8');
                    const valBuf = Buffer.from(String(value !== undefined && value !== null ? value : ''), 'utf8');
                    const payload = Buffer.alloc(1 + keyBuf.length + valBuf.length);
                    payload.writeUInt8(keyBuf.length, 0);
                    keyBuf.copy(payload, 1);
                    valBuf.copy(payload, 1 + keyBuf.length);
                    devServer.server.broadcast(payload, 0x08 /* PATCH_STATE */);
                }
            }
            catch {
                /* ignore broadcast failures — dev bridge is best-effort */
            }
        }
    };
    // 🔧 Core Methods
    function set(key, value) {
        if (Object.is(state[key], value))
            return;
        state = { ...state, [key]: value };
        broadcastTitanPatch(key, value);
        notify(key, value);
    }
    function setMany(updates) {
        let hasChanged = false;
        const newState = { ...state };
        for (const key in updates) {
            if (!Object.is(state[key], updates[key])) {
                newState[key] = updates[key];
                broadcastTitanPatch(key, updates[key]);
                hasChanged = true;
            }
        }
        if (hasChanged) {
            state = newState;
            notify();
        }
    }
    function update(fn) {
        const newState = fn(state);
        if (!Object.is(state, newState)) {
            state = newState;
            Object.entries(newState).forEach(([k, v]) => broadcastTitanPatch(k, v));
            notify();
        }
    }
    function get(key) {
        return key !== undefined ? state[key] : state;
    }
    function reset() {
        state = { ...initial };
        Object.entries(initial).forEach(([k, v]) => broadcastTitanPatch(k, v));
        notify();
    }
    // 🆕 Temporary Setter (Auto Expire Toast / Notification)
    function setTemp(key, value, duration = 2000) {
        if (activeTimeouts.has(key)) {
            clearTimeout(activeTimeouts.get(key));
        }
        if (!Object.is(state[key], value)) {
            state = { ...state, [key]: value };
            broadcastTitanPatch(key, value);
            notify(key, value);
        }
        const timeoutId = setTimeout(() => {
            if (!Object.is(state[key], initial[key])) {
                state = { ...state, [key]: initial[key] };
                broadcastTitanPatch(key, initial[key]);
                notify(key, initial[key]);
            }
            activeTimeouts.delete(key);
        }, duration);
        activeTimeouts.set(key, timeoutId);
        return () => {
            clearTimeout(timeoutId);
            activeTimeouts.delete(key);
        };
    }
    // 🎯 Universal Hooks (React 18 useSyncExternalStore if React present, else Pure Dolphin Subscriber)
    function use(key) {
        if (React && React.useSyncExternalStore) {
            const getSnapshot = React.useCallback(() => state[key], [key]);
            const getServerSnapshot = React.useCallback(() => initial[key], [key]);
            return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
        }
        // Pure Standalone Dolphin Native Mode
        return state[key];
    }
    function useStore(selector) {
        const sel = selector || ((s) => s);
        if (React && React.useSyncExternalStore) {
            const getSnapshot = React.useCallback(() => sel(state), [selector]);
            const getServerSnapshot = React.useCallback(() => sel(initial), [selector]);
            return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
        }
        return sel(state);
    }
    function usePath(pathStr) {
        const value = pathStr.split('.').reduce((obj, key) => obj?.[key], state);
        if (React && React.useSyncExternalStore) {
            const lastValue = React.useRef(null);
            const getSnapshot = React.useCallback(() => {
                const val = pathStr.split('.').reduce((obj, key) => obj?.[key], state);
                if (Object.is(lastValue.current, val))
                    return lastValue.current;
                lastValue.current = val;
                return val;
            }, [pathStr]);
            return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
        }
        return value;
    }
    function usePick(...paths) {
        const currentValues = {};
        paths.forEach((p) => {
            currentValues[p] = p.includes('.')
                ? p.split('.').reduce((obj, key) => obj?.[key], state)
                : state[p];
        });
        if (React && React.useSyncExternalStore) {
            const lastValues = React.useRef(null);
            const getSnapshot = React.useCallback(() => {
                const cur = {};
                paths.forEach((p) => {
                    cur[p] = p.includes('.')
                        ? p.split('.').reduce((obj, key) => obj?.[key], state)
                        : state[p];
                });
                if (shallowEqual(lastValues.current, cur))
                    return lastValues.current;
                lastValues.current = cur;
                return cur;
            }, [paths.join(',')]);
            return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
        }
        return currentValues;
    }
    // 📝 Form Binding
    function bind(key) {
        return {
            value: state[key] ?? '',
            onChange: (e) => {
                const value = e && typeof e === 'object' && 'target' in e
                    ? e.target.type === 'checkbox'
                        ? e.target.checked
                        : e.target.value
                    : e;
                set(key, value);
            },
        };
    }
    function useBind(key) {
        const value = use(key);
        const onChange = (e) => {
            const newValue = e && typeof e === 'object' && 'target' in e
                ? e.target.type === 'checkbox'
                    ? e.target.checked
                    : e.target.value
                : e;
            set(key, newValue);
        };
        return { value, onChange };
    }
    // 💾 Persistence
    function persist(storageKey) {
        try {
            if (typeof localStorage !== 'undefined') {
                const saved = localStorage.getItem(storageKey);
                if (saved)
                    setMany(JSON.parse(saved));
                return subscribe(() => {
                    localStorage.setItem(storageKey, JSON.stringify(state));
                });
            }
            return undefined;
        }
        catch {
            return undefined;
        }
    }
    return {
        get,
        set,
        setMany,
        update,
        reset,
        subscribe,
        setTemp,
        use,
        useStore,
        usePath,
        usePick,
        bind,
        useBind,
        persist,
        $: use,
        $$: usePick,
        $path: usePath,
        $temp: setTemp,
    };
}
function create(initial) {
    return createStore(initial);
}
function atom(initial) {
    const store = createStore({ value: initial });
    const useAtom = (() => store.use('value'));
    useAtom.set = (value) => store.set('value', value);
    useAtom.setTemp = (value, duration) => store.setTemp('value', value, duration);
    useAtom.get = () => store.get().value;
    return useAtom;
}
exports.default = { createStore, create, atom };
//# sourceMappingURL=DolphinNanoStore.js.map