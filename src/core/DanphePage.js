'use strict';

/**
 * 🦚 Danphe 2 — "Page as Variable" Universal Architecture (Zero-Hook Engine)
 * 
 * Enables developers to treat UI Pages as pure reactive JavaScript variables/objects.
 * Eliminates all useState, useEffect, nav:back, and hardcoded Kotlin hook boilerplate.
 * Works uniformly across Web (SSR), Mobile (Titan Binary), and MP5/Embedded (ThorVG/LVGL).
 */

class DanphePage {
    constructor(initialState = {}) {
        this._state = { ...initialState };
        this._listeners = new Set();
        this._actions = {};

        // Built-in Universal Native Hardware & Navigation Methods
        this.back = 'nav:back';
        this.home = 'nav:home';
        this.refresh = 'app:refresh';
        this.battery = '[stateKey:sys_battery_level]';
        this.gps = '[stateKey:sys_gps_lat],[stateKey:sys_gps_lng]';
        this.flash = 'hw:flashlight:toggle';
        this.vibrate = 'hw:haptic:heavy';
        this.camera = 'hw:camera:open';
        this.ringtone = 'hw:ringtone:play';

        // Return a transparent Reactive Proxy
        return new Proxy(this, {
            get: (target, prop) => {
                if (prop in target) {
                    return target[prop];
                }
                if (prop in target._state) {
                    return `[stateKey:${prop}]`;
                }
                return `[stateKey:${String(prop)}]`;
            },
            set: (target, prop, value) => {
                target._state[prop] = value;
                target._notify(prop, value);
                return true;
            }
        });
    }

    /**
     * Define custom action handler on the page variable
     */
    action(name, handler) {
        this._actions[name] = handler;
        return this;
    }

    /**
     * Fetch remote API data and auto-update Page state
     */
    async fetch(url, options = {}) {
        try {
            const fetchFn = (typeof fetch !== 'undefined') ? fetch : require('node-fetch');
            const res = await fetchFn(url, options);
            const data = await res.json();
            if (data && typeof data === 'object') {
                for (const [key, val] of Object.entries(data)) {
                    this[key] = val;
                }
            }
            return data;
        } catch (e) {
            console.error(`[DanphePage] Fetch error for ${url}:`, e.message);
            return null;
        }
    }

    /**
     * Poll remote API or Modbus sensor periodically
     */
    poll(url, intervalMs = 2000, options = {}) {
        this.fetch(url, options);
        return setInterval(() => {
            this.fetch(url, options);
        }, intervalMs);
    }

    /**
     * Subscribe to state mutations
     */
    subscribe(listener) {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }

    _notify(key, value) {
        for (const listener of this._listeners) {
            try {
                listener(key, value, this._state);
            } catch (e) {
                console.error(`[DanphePage] Notification error for ${key}:`, e.message);
            }
        }
    }

    /**
     * Get snapshot of current page state
     */
    getState() {
        return { ...this._state };
    }
}

/**
 * Universal Factory to create a Page as Variable
 */
function createPage(initialState = {}) {
    return new DanphePage(initialState);
}

module.exports = {
    DanphePage,
    createPage,
    Page: createPage
};
