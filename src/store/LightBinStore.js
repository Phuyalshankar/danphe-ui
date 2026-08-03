'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightBinStore = void 0;
/**
 * Super lightweight, dependency-free key/value store backed by in-memory `Map`s,
 * with optional persistence to `localStorage` when available (browser / React Native).
 */
class LightBinStore {
    constructor(options = {}) {
        this.ns = options.namespace || 'dolphin';
        this._store = new Map();
        this._meta = new Map();
        this._ttl = new Map();
        this._load();
    }
    set(key, value, options = {}) {
        const k = this._key(key);
        let data;
        if (Buffer.isBuffer(value)) {
            data = value;
        }
        else if (value instanceof Uint8Array) {
            data = Buffer.from(value);
        }
        else if (typeof value === 'string') {
            data = Buffer.from(value);
        }
        else if (typeof value === 'number') {
            data = Buffer.alloc(8);
            data.writeDoubleLE(value);
        }
        else {
            data = Buffer.from(JSON.stringify(value));
        }
        this._store.set(k, data);
        this._meta.set(k, { type: typeof value, size: data.length, t: Date.now() });
        if (options.ttl)
            this._ttl.set(k, Date.now() + options.ttl);
        else
            this._ttl.delete(k);
        this._save();
        return this;
    }
    get(key, def = null) {
        const k = this._key(key);
        if (this._ttl.has(k) && Date.now() > this._ttl.get(k)) {
            this.delete(key);
            return def;
        }
        if (!this._store.has(k))
            return def;
        const buf = this._store.get(k);
        const meta = this._meta.get(k);
        if (!meta)
            return def;
        switch (meta.type) {
            case 'number':
                return buf.readDoubleLE(0);
            case 'object':
                try {
                    return JSON.parse(buf.toString());
                }
                catch {
                    return def;
                }
            default:
                return buf.toString();
        }
    }
    has(key) {
        const k = this._key(key);
        if (this._ttl.has(k) && Date.now() > this._ttl.get(k)) {
            this.delete(key);
            return false;
        }
        return this._store.has(k);
    }
    delete(key) {
        const k = this._key(key);
        this._store.delete(k);
        this._meta.delete(k);
        this._ttl.delete(k);
        this._save();
        return this;
    }
    clear() {
        this._store.clear();
        this._meta.clear();
        this._ttl.clear();
        this._save();
        return this;
    }
    keys() {
        const r = [];
        for (const [k] of this._store) {
            const key = k.replace(this.ns + ':', '');
            if (this._ttl.has(k) && Date.now() > this._ttl.get(k))
                this.delete(key);
            else
                r.push(key);
        }
        return r;
    }
    get size() {
        return this.keys().length;
    }
    getStats() {
        let total = 0;
        for (const v of this._store.values())
            total += v.length;
        return { keys: this.size, bytes: total, avg: this.size ? Math.round(total / this.size) : 0 };
    }
    export() {
        return Buffer.from(JSON.stringify([...this._store].map(([k, v]) => [k, v.toString('base64')])));
    }
    import(buf) {
        try {
            const data = JSON.parse(buf.toString('utf8'));
            data.forEach(([k, v]) => this._store.set(k, Buffer.from(v, 'base64')));
            this._save();
        }
        catch {
            throw new Error('Invalid import');
        }
        return this;
    }
    _key(k) {
        return this.ns + ':' + (typeof k === 'string' ? k : String(k));
    }
    _save() {
        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem(this.ns + ':data', this.export().toString('base64'));
            }
            catch {
                /* ignore persistence errors (quota exceeded, disabled storage, etc.) */
            }
        }
    }
    _load() {
        if (typeof localStorage !== 'undefined') {
            try {
                const d = localStorage.getItem(this.ns + ':data');
                if (d)
                    this.import(Buffer.from(d, 'base64'));
            }
            catch {
                /* ignore corrupted persisted data */
            }
        }
    }
}
exports.LightBinStore = LightBinStore;
exports.default = { LightBinStore };
//# sourceMappingURL=LightBinStore.js.map