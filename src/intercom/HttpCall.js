'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTERCOM_CMD = exports.HttpCall = void 0;
const events_1 = require("events");
const url_1 = require("url");
const http = __importStar(require("http"));
const https = __importStar(require("https"));
/**
 * 🌊 DolphinIntercom — HttpCall
 *
 * Binary-protocol HTTP/REST call module for Dolphin Intercom apps.
 * Supports GET, POST, PUT, PATCH, DELETE with timeout, retry,
 * interceptors, and binary command dispatch to the Android runtime.
 */
const INTERCOM_CMD = {
    HTTP_GET: 0xc0,
    HTTP_POST: 0xc1,
    HTTP_PUT: 0xc2,
    HTTP_PATCH: 0xc3,
    HTTP_DELETE: 0xc4,
    HTTP_ABORT: 0xc5,
};
exports.INTERCOM_CMD = INTERCOM_CMD;
class HttpCall extends events_1.EventEmitter {
    constructor(config = {}) {
        super();
        this.baseURL = config.baseURL || '';
        this.timeout = config.timeout || 30000;
        this.retries = config.retries || 1;
        this.headers = config.headers || {};
        this._interceptors = { request: [], response: [] };
        this._pending = new Map();
    }
    // ── Interceptors ──────────────────────────────────────────────────────────
    useRequest(fn) {
        this._interceptors.request.push(fn);
        return this;
    }
    useResponse(fn) {
        this._interceptors.response.push(fn);
        return this;
    }
    // ── Core request builder ──────────────────────────────────────────────────
    _buildBinaryCmd(method, url, body, headers) {
        const cmd = INTERCOM_CMD[`HTTP_${method}`];
        const payload = JSON.stringify({
            url: this.baseURL + url,
            body,
            headers: { ...this.headers, ...headers },
        });
        const payBuf = Buffer.from(payload, 'utf8');
        const msg = Buffer.alloc(1 + 1 + 4 + payBuf.length);
        let off = 0;
        msg.writeUInt8(0x10, off++);
        msg.writeUInt8(cmd, off++);
        msg.writeUInt32LE(payBuf.length, off);
        off += 4;
        payBuf.copy(msg, off);
        return msg;
    }
    async _request(method, url, options = {}) {
        let config = {
            method,
            url,
            body: options.body ?? null,
            headers: options.headers || {},
        };
        for (const fn of this._interceptors.request) {
            const result = await fn(config);
            if (result)
                config = result;
        }
        const binaryCmd = this._buildBinaryCmd(config.method, config.url, config.body, config.headers || {});
        const reqId = 'req-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
        this.emit('request', { reqId, ...config, binary: binaryCmd });
        let attempt = 0;
        while (attempt < this.retries) {
            attempt++;
            try {
                let response = await this._execute(config, binaryCmd, reqId);
                for (const fn of this._interceptors.response) {
                    const result = await fn(response);
                    if (result)
                        response = result;
                }
                this.emit('response', { reqId, response });
                return response;
            }
            catch (err) {
                if (attempt >= this.retries) {
                    this.emit('error', { reqId, error: err });
                    throw err;
                }
                await new Promise((r) => setTimeout(r, 300 * attempt));
            }
        }
        return undefined;
    }
    _execute(config, binaryCmd, reqId) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this._pending.delete(reqId);
                reject(new Error(`[DolphinHttp] Timeout after ${this.timeout}ms: ${config.url}`));
            }, this.timeout);
            this._pending.set(reqId, { resolve, reject, timer });
            // Simulate runtime dispatch — in production, DevServer/socket forwards binaryCmd
            // and invokes resolve() with the Android HTTP response payload.
            // We expose the pending map so the Dolphin runtime can call settle().
            if (this.listenerCount('dispatch') > 0) {
                this.emit('dispatch', { reqId, binaryCmd, config });
            }
            else {
                // Fallback: Node-level HTTP for dev/test
                const parsedURL = new url_1.URL(config.url.startsWith('http') ? config.url : 'http://localhost' + config.url);
                const isHttps = parsedURL.protocol === 'https:';
                const transport = isHttps ? https : http;
                const body = config.body ? JSON.stringify(config.body) : undefined;
                const req = transport.request({
                    hostname: parsedURL.hostname,
                    port: parsedURL.port || (isHttps ? 443 : 80),
                    path: parsedURL.pathname + parsedURL.search,
                    method: config.method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': body ? Buffer.byteLength(body) : 0,
                        ...config.headers,
                    },
                }, (res) => {
                    let raw = '';
                    res.on('data', (d) => {
                        raw += d;
                    });
                    res.on('end', () => {
                        clearTimeout(timer);
                        this._pending.delete(reqId);
                        let data;
                        try {
                            data = JSON.parse(raw);
                        }
                        catch {
                            data = raw;
                        }
                        resolve({ status: res.statusCode || 0, headers: res.headers, data });
                    });
                });
                req.on('error', (e) => {
                    clearTimeout(timer);
                    this._pending.delete(reqId);
                    reject(e);
                });
                if (body)
                    req.write(body);
                req.end();
            }
        });
    }
    /** Settle a pending request from the Android runtime callback */
    settle(reqId, response) {
        const pending = this._pending.get(reqId);
        if (pending) {
            clearTimeout(pending.timer);
            this._pending.delete(reqId);
            pending.resolve(response);
        }
    }
    // ── Public API ────────────────────────────────────────────────────────────
    get(url, opts = {}) {
        return this._request('GET', url, opts);
    }
    post(url, body, opts = {}) {
        return this._request('POST', url, { ...opts, body });
    }
    put(url, body, opts = {}) {
        return this._request('PUT', url, { ...opts, body });
    }
    patch(url, body, opts = {}) {
        return this._request('PATCH', url, { ...opts, body });
    }
    delete(url, opts = {}) {
        return this._request('DELETE', url, opts);
    }
    /** Build binary command packet for manual dispatch */
    buildCommand(method, url, body, headers) {
        return this._buildBinaryCmd(method.toUpperCase(), url, body, headers || {});
    }
}
exports.HttpCall = HttpCall;
exports.default = HttpCall;
//# sourceMappingURL=HttpCall.js.map