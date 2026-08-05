'use strict';

/**
 * 🛣️ RouteMatcher — Micro-module for route pattern matching (:param), regex compilation, and query string parsing.
 */
class RouteMatcher {
    static compileRoute(pathStr) {
        if (!pathStr || typeof pathStr !== 'string') return { regex: /^$/, paramNames: [] };
        const paramNames = [];
        const regexPath = pathStr
            .replace(/\/$/, '')
            .replace(/:([a-zA-Z0-9_]+)/g, (_, name) => {
                paramNames.push(name);
                return '([^/]+)';
            });
        const regex = new RegExp(`^${regexPath || '/'}$`);
        return { regex, paramNames };
    }

    static matchPath(patternStr, pathStr) {
        const { regex, paramNames } = RouteMatcher.compileRoute(patternStr);
        const cleanPath = pathStr.split('?')[0].replace(/\/$/, '') || '/';
        const match = cleanPath.match(regex);
        if (!match) return null;

        const params = {};
        paramNames.forEach((name, idx) => {
            params[name] = decodeURIComponent(match[idx + 1]);
        });
        return params;
    }

    static parseQueryParams(queryString = '') {
        const params = {};
        if (!queryString) return params;
        const qs = queryString.includes('?') ? queryString.split('?')[1] : queryString;
        qs.split('&').forEach(part => {
            if (!part) return;
            const [k, v] = part.split('=');
            params[k] = decodeURIComponent(v || '');
        });
        return params;
    }
}

module.exports = RouteMatcher;
