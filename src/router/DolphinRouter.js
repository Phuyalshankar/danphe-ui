'use strict';

/**
 * 🌊 Dolphin Router - Ultra Lightweight URL Router
 * 
 * Features:
 * - Pure JavaScript, no dependencies
 * - Works in Node.js, Browser, React Native, Native apps
 * - Hash and History mode support
 * - Route params, query parsing
 * - Nested routes
 * 
 * Usage:
 *   const router = new DolphinRouter()
 *   router.get('/home', handler)
 *   router.get('/user/:id', handler)
 *   router.start()
 */

class DolphinRouter {
    constructor(options = {}) {
        this.routes = [];
        this.mode = options.mode || (typeof window !== 'undefined' ? 'hash' : 'memory');
        this.base = options.base || '';
        this.current = null;
        this.beforeEach = options.beforeEach || null;
        this.onChange = options.onChange || null;
        this._listeners = [];
    }

    // ─── Route Registration ─────────────────────────────────────

    get(path, handler, name) {
        this._addRoute('GET', path, handler, name);
        return this;
    }

    post(path, handler, name) {
        this._addRoute('POST', path, handler, name);
        return this;
    }

    put(path, handler, name) {
        this._addRoute('PUT', path, handler, name);
        return this;
    }

    delete(path, handler, name) {
        this._addRoute('DELETE', path, handler, name);
        return this;
    }

    any(path, handler, name) {
        this._addRoute('*', path, handler, name);
        return this;
    }

    // Nested routes
    group(prefix, callback) {
        callback(this, prefix);
        return this;
    }

    _addRoute(method, path, handler, name) {
        const pattern = this._pathToRegex(path);
        this.routes.push({
            method,
            path,
            pattern,
            handler,
            name: name || path,
            params: this._extractParams(path)
        });
    }

    // ─── Navigation ─────────────────────────────────────────────

    push(path, data = {}) {
        if (this.mode === 'hash') {
            window.location.hash = path;
        } else if (this.mode === 'history') {
            window.history.pushState(data, '', this.base + path);
            this._resolve();
        } else {
            this.current = path;
            this._resolve();
        }
    }

    replace(path, data = {}) {
        if (this.mode === 'hash') {
            window.location.hash = path;
        } else if (this.mode === 'history') {
            window.history.replaceState(data, '', this.base + path);
            this._resolve();
        }
    }

    back() {
        window.history.back();
    }

    // ─── Lifecycle ──────────────────────────────────────────────

    start() {
        if (typeof window === 'undefined') return;
        
        if (this.mode === 'hash') {
            window.addEventListener('hashchange', () => this._resolve());
        } else if (this.mode === 'history') {
            window.addEventListener('popstate', () => this._resolve());
        }
        
        this._resolve();
    }

    stop() {
        if (typeof window === 'undefined') return;
        window.removeEventListener('hashchange', this._resolve);
        window.removeEventListener('popstate', this._resolve);
    }

    // ─── URL Helpers ────────────────────────────────────────────

    getPath() {
        if (this.mode === 'memory' || typeof window === 'undefined') {
            return this.current || '/';
        }
        if (this.mode === 'hash') {
            return window.location.hash.slice(1) || '/';
        }
        return window.location.pathname.replace(this.base, '') || '/';
    }

    getQuery() {
        if (typeof window === 'undefined') return {};
        const url = this.mode === 'hash' ? window.location.hash : window.location.href;
        const queryString = url.split('?')[1] || '';
        const params = {};
        queryString.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
        return params;
    }

    // ─── Internal ───────────────────────────────────────────────

    _resolve() {
        const path = this.getPath();
        const query = this.getQuery();
        
        for (const route of this.routes) {
            const match = route.pattern.exec(path);
            if (match) {
                const params = {};
                route.params.forEach((p, i) => {
                    params[p] = match[i + 1];
                });
                
                const ctx = {
                    path,
                    query,
                    params,
                    name: route.name,
                    router: this
                };
                
                if (this.beforeEach) {
                    this.beforeEach(ctx, () => route.handler(ctx), (err) => {
                        console.error('Route guard rejected:', err);
                    });
                } else {
                    route.handler(ctx);
                }
                
                this._notify(path, ctx);
                return;
            }
        }
        
        // 404
        const notFound = this.routes.find(r => r.path === '*');
        if (notFound) {
            notFound.handler({ path, query, params: {}, router: this });
        }
    }

    _pathToRegex(path) {
        const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const withParams = escaped.replace(/:(\w+)/g, '([^/]+)');
        return new RegExp(`^${withParams}$`);
    }

    _extractParams(path) {
        const matches = path.match(/:(\w+)/g) || [];
        return matches.map(m => m.slice(1));
    }

    // ─── Events ──────────────────────────────────────────────────

    onChange(fn) {
        this._listeners.push(fn);
    }

    _notify(path, ctx) {
        this._listeners.forEach(fn => fn(path, ctx));
    }
}

// ─── URL Builder ───────────────────────────────────────────────

function buildUrl(path, params = {}) {
    let url = path;
    const query = [];
    Object.entries(params).forEach(([key, value]) => {
        if (url.includes(`:${key}`)) {
            url = url.replace(`:${key}`, value);
        } else {
            query.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
    });
    if (query.length) url += '?' + query.join('&');
    return url;
}

// ─── Link Component ───────────────────────────────────────────

function Link({ to, children, className, activeClass, onClick }) {
    return {
        type: 'Link',
        props: { to, children, className, activeClass, onClick }
    };
}

module.exports = { DolphinRouter, buildUrl, Link };
