"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fetch = void 0;
const protocol_1 = require("./protocol");
function stringifyBody(body) {
    return typeof body === 'string' ? body : JSON.stringify(body);
}
/**
 * 🌊 DolphinJS Hardware — Fetch / HTTP
 */
exports.Fetch = {
    /**
     * HTTP GET request from the device.
     * Returns: { status, body, ok }
     */
    get: (url, options = {}) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.FETCH_GET,
        params: { url, headers: options.headers || {}, timeout: options.timeout || 10000 },
    }),
    /** HTTP POST with JSON body */
    post: (url, body, options = {}) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.FETCH_POST,
        params: {
            url,
            body: stringifyBody(body),
            headers: options.headers || {},
            timeout: options.timeout || 10000,
        },
    }),
    put: (url, body, options = {}) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.FETCH_PUT,
        params: { url, body: stringifyBody(body), headers: options.headers || {} },
    }),
    patch: (url, body, options = {}) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.FETCH_PATCH,
        params: { url, body: stringifyBody(body), headers: options.headers || {} },
    }),
    delete: (url, options = {}) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.FETCH_DELETE,
        params: { url, headers: options.headers || {} },
    }),
    /** Generic request */
    request: (method, url, body, options = {}) => {
        const key = `FETCH_${method.toUpperCase()}`;
        const cmd = protocol_1.HW_CMD[key] ?? protocol_1.HW_CMD.FETCH_GET;
        return {
            _hw: true,
            cmd,
            params: { url, body, headers: options.headers || {}, timeout: options.timeout || 10000 },
        };
    },
    _action: (method, url, body, headers) => ({
        action: `hw:fetch`,
        value: JSON.stringify({ method, url, body, headers }),
    }),
};
//# sourceMappingURL=Fetch.js.map