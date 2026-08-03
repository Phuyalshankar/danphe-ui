"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
/**
 * 🌊 DolphinRealtime — RealtimeChannel
 *
 * Pub/sub channel abstraction. Flutter को StreamController भन्दा:
 *  - Binary + JSON दुवै support
 *  - History buffer (last N messages)
 *  - Wildcard subscriptions (sensor:* )
 *  - Message deduplication
 *  - Priority queuing (HIGH/NORMAL/LOW)
 */
const PRIORITY = { HIGH: 0, NORMAL: 1, LOW: 2 };
// RealtimeChannel intentionally redefines on/off/emit with a pub/sub-shaped
// signature instead of EventEmitter's (eventName, ...args) shape. The cast
// below only affects the type checker — the runtime prototype chain is
// still plain EventEmitter, so instanceof checks and inherited methods
// (removeAllListeners, listenerCount, etc.) behave exactly as in the
// original JS.
const EventEmitterBase = events_1.EventEmitter;
class RealtimeChannel extends EventEmitterBase {
    constructor(config = {}) {
        super();
        this.name = config.name || 'channel-' + Date.now();
        this.historyLimit = config.history || 100;
        this.deduplicate = config.deduplicate !== false;
        this._subscribers = new Map(); // pattern → Set<fn>
        this._history = [];
        this._seen = new Set(); // for dedup
        this._seenLimit = 500;
        this._transport = config.transport || null; // WebSocketClient
    }
    // ── Subscribe ─────────────────────────────────────────────────────────────
    on(topic, handler) {
        if (!this._subscribers.has(topic))
            this._subscribers.set(topic, new Set());
        this._subscribers.get(topic).add(handler);
        return () => this.off(topic, handler);
    }
    off(topic, handler) {
        this._subscribers.get(topic)?.delete(handler);
    }
    // ── Publish ───────────────────────────────────────────────────────────────
    emit(topic, data, opts = {}) {
        const msg = {
            id: opts.id || Math.random().toString(36).slice(2),
            topic,
            data,
            at: Date.now(),
            priority: (opts.priority ?? PRIORITY.NORMAL),
            binary: Buffer.isBuffer(data),
        };
        if (this.deduplicate && this._seen.has(msg.id))
            return false;
        if (this.deduplicate) {
            this._seen.add(msg.id);
            if (this._seen.size > this._seenLimit) {
                const first = this._seen.values().next().value;
                if (first !== undefined)
                    this._seen.delete(first);
            }
        }
        this._history.push(msg);
        if (this._history.length > this.historyLimit)
            this._history.shift();
        this._dispatch(msg);
        if (this._transport)
            this._transport.publish(this.name + ':' + topic, data);
        return true;
    }
    _dispatch(msg) {
        // Exact match
        this._subscribers.get(msg.topic)?.forEach((fn) => fn(msg.data, msg));
        // Wildcard match  sensor:* matches sensor:temp, sensor:humidity
        for (const [pattern, fns] of this._subscribers) {
            if (pattern.endsWith('*')) {
                const prefix = pattern.slice(0, -1);
                if (msg.topic.startsWith(prefix))
                    fns.forEach((fn) => fn(msg.data, msg));
            }
        }
        // Global wildcard *
        this._subscribers.get('*')?.forEach((fn) => fn(msg.data, msg));
    }
    // ── History ───────────────────────────────────────────────────────────────
    getHistory(topic = null, limit = 50) {
        const h = topic ? this._history.filter((m) => m.topic === topic) : this._history;
        return h.slice(-limit);
    }
    replay(topic, handler) {
        this.getHistory(topic).forEach((m) => handler(m.data, m));
    }
    clear() {
        this._history = [];
        this._seen.clear();
    }
}
RealtimeChannel.PRIORITY = PRIORITY;
exports.default = RealtimeChannel;
//# sourceMappingURL=RealtimeChannel.js.map