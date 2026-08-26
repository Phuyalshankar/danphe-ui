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
     * Fetch remote API data with automatic loading, try-catch, error state, and unpacking
     */
    async fetch(url, options = {}) {
        this.loading = true;
        this.isLoading = true;
        this.error = null;
        this.status = 'Loading... ⏳';

        try {
            const fetchFn = (typeof fetch !== 'undefined') ? fetch : require('node-fetch');
            const res = await fetchFn(url, options);
            
            if (!res.ok) {
                throw new Error(`HTTP Error ${res.status}: ${res.statusText || 'Failed to fetch'}`);
            }

            const data = await res.json();
            if (Array.isArray(data)) {
                this._rawItems = data;
                this._currentCategory = 'all';
                this._currentSearch = '';
                this._currentSort = null;
                this._syncItems(data);
                this.status = `✨ Loaded ${data.length} items successfully!`;
            } else if (data && typeof data === 'object') {
                for (const [key, val] of Object.entries(data)) {
                    this[key] = val;
                }
                this.status = '✅ Data synchronized!';
            }
            
            this.loading = false;
            this.isLoading = false;
            this.error = null;
            return data;
        } catch (e) {
            console.error(`[DanphePage] Fetch error for ${url}:`, e.message);
            this.loading = false;
            this.isLoading = false;
            this.error = e.message || 'Network Request Failed';
            this.status = `⚠️ Error: ${this.error}`;
            return null;
        }
    }

    /**
     * Synchronize items array to reactive state keys (prod1_title, etc.)
     */
    _syncItems(items = []) {
        for (let idx = 0; idx < 10; idx++) {
            const prefix = `prod${idx + 1}_`;
            const item = items[idx];
            if (item && typeof item === 'object') {
                this[`${prefix}title`] = item.title || item.name || '';
                this[`${prefix}price`] = typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : (item.price || '');
                this[`${prefix}cat`] = item.category || item.type || '';
                this[`${prefix}img`] = item.image || item.thumbnail || item.img || '';
            } else if (item) {
                this[`item${idx + 1}`] = item;
            } else {
                this[`${prefix}title`] = '';
                this[`${prefix}price`] = '';
                this[`${prefix}cat`] = '';
                this[`${prefix}img`] = '';
            }
        }
    }

    /**
     * Filter items by Category (e.g. "men's clothing", "jewelery", "all")
     */
    filter(category = 'all') {
        this._currentCategory = category;
        this._applyFilterSortSearch();
        return this;
    }

    /**
     * Search items by keyword (title / category)
     */
    search(query = '') {
        this._currentSearch = String(query).trim().toLowerCase();
        this._applyFilterSortSearch();
        return this;
    }

    /**
     * Sort items by price ('asc' / 'desc')
     */
    sort(order = 'asc') {
        this._currentSort = order;
        this._applyFilterSortSearch();
        return this;
    }

    _applyFilterSortSearch() {
        if (!this._rawItems || !Array.isArray(this._rawItems)) return;
        let list = [...this._rawItems];

        // 1. Category Filter
        if (this._currentCategory && this._currentCategory !== 'all') {
            const targetCat = this._currentCategory.toLowerCase().trim();
            list = list.filter(item => item.category && item.category.toLowerCase().includes(targetCat));
        }

        // 2. Search Query
        if (this._currentSearch) {
            list = list.filter(item => {
                const title = (item.title || '').toLowerCase();
                const cat = (item.category || '').toLowerCase();
                const desc = (item.description || '').toLowerCase();
                return title.includes(this._currentSearch) || cat.includes(this._currentSearch) || desc.includes(this._currentSearch);
            });
        }

        // 3. Price Sorting
        if (this._currentSort === 'asc') {
            list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        } else if (this._currentSort === 'desc') {
            list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        }

        this._syncItems(list);
        const catLabel = this._currentCategory === 'all' ? 'All' : this._currentCategory;
        const sortLabel = this._currentSort ? ` | Sort: ${this._currentSort.toUpperCase()}` : '';
        const searchLabel = this._currentSearch ? ` | Search: "${this._currentSearch}"` : '';
        this.status = `🛍️ Showing ${list.length} items (${catLabel}${sortLabel}${searchLabel})`;
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
 * Supports:
 *   1. Object literal: Page({ title: "...", count: 0 })
 *   2. Direct 1-Line URL: Page("https://fakestoreapi.com/products")
 */
function createPage(initialArg = {}) {
    if (typeof initialArg === 'string') {
        const page = new DanphePage({ status: 'Loading 1-line API...' });
        page.fetch(initialArg);
        return page;
    }
    return new DanphePage(initialArg);
}

module.exports = {
    DanphePage,
    createPage,
    Page: createPage
};
