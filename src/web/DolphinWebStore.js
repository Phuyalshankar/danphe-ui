'use strict';

/**
 * DolphinWebStore — Lightweight Web NanoStore Adapter
 * Provides persistent URL-query auto-sync and LocalStorage persistence for Web SEO builds.
 */
function createWebStore(initialState = {}) {
    let state = { ...initialState };
    const listeners = new Set();

    const get = () => state;

    const set = (key, value) => {
        if (state[key] === value) return;
        state = { ...state, [key]: value };
        listeners.forEach(l => l(state));
    };

    const subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    const syncWithUrl = (key, paramName = key) => {
        if (typeof window !== 'undefined' && window.location) {
            const params = new URLSearchParams(window.location.search);
            const val = params.get(paramName);
            if (val !== null) {
                set(key, val);
            }
            subscribe(s => {
                const url = new URL(window.location.href);
                url.searchParams.set(paramName, String(s[key]));
                window.history.replaceState({}, '', url.toString());
            });
        }
    };

    return {
        get,
        set,
        subscribe,
        syncWithUrl
    };
}

module.exports = { createWebStore };
