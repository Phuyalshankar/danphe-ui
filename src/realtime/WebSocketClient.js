"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
/**
 * 🌊 DolphinRealtime — TitanTcpClient (formerly WebSocketClient)
 *
 * Pure Binary TCP Client over port 9092 / 9091. Zero WebSockets, Zero HTTP, Zero WebRTC.
 *  - Auto-reconnect with exponential backoff
 *  - High-frequency binary packet stream
 *  - Titan 24-byte 'TB' Protocol (0x5442)
 */
const TITAN_FRAME = {
    PING: 0x30,
    PONG: 0x31,
    SUBSCRIBE: 0xf2,
    PUBLISH: 0xf3,
    ACK: 0xf4,
    ERROR: 0xf5,
    STREAM: 0x15,
    PRESENCE: 0xf7,
};
function buildTitanFrame(type, channel, payload) {
    const ch = Buffer.from(channel.padEnd(32).slice(0, 32));
    const pay = Buffer.isBuffer(payload)
        ? payload
        : Buffer.from(typeof payload === 'string' ? payload : JSON.stringify(payload));
    const msg = Buffer.alloc(2 + 1 + 32 + 4 + pay.length);
    let off = 0;
    msg.writeUInt8(0x54, off++); // 'T'
    msg.writeUInt8(0x42, off++); // 'B'
    msg.writeUInt8(type, off++);
    ch.copy(msg, off);
    off += 32;
    msg.writeUInt32LE(pay.length, off);
    off += 4;
    pay.copy(msg, off);
    return msg;
}
class WebSocketClient extends events_1.EventEmitter {
    constructor(config = {}) {
        super();
        this.url = config.url;
        this.host = config.host || '127.0.0.1';
        this.port = config.port || 9092;
        this.heartbeatMs = config.heartbeatMs || 15000;
        this.maxRetries = config.maxRetries || Infinity;
        this.retryDelay = config.retryDelay || 1000;
        this.maxDelay = config.maxDelay || 30000;
        this.binaryMode = true;
        this._ws = null;
        this._retries = 0;
        this._queue = []; // offline message queue
        this._channels = new Map();
        this._hbTimer = null;
        this._connected = false;
        this._intentClose = false;
    }
    // ── Connection ────────────────────────────────────────────────────────────
    connect() {
        this._intentClose = false;
        this._dial();
        return this;
    }
    _dial() {
        let WS;
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            WS = require('ws');
        }
        catch {
            throw new Error('[DolphinWS] ws package required: npm i ws');
        }
        this._ws = new WS(this.url);
        this._ws.binaryType = 'nodebuffer';
        this._ws.on('open', () => {
            this._connected = true;
            this._retries = 0;
            this._startHeartbeat();
            this._flushQueue();
            this.emit('connected', { url: this.url });
        });
        this._ws.on('message', (...args) => {
            const data = args[0];
            if (Buffer.isBuffer(data) && data.length >= 37) {
                const type = data.readUInt8(0);
                const channel = data.slice(1, 33).toString().trimEnd();
                const payLen = data.readUInt32LE(33);
                const payload = data.slice(37, 37 + payLen);
                this._handleFrame(type, channel, payload);
            }
            else {
                this.emit('message', { raw: data });
            }
        });
        this._ws.on('close', () => {
            this._connected = false;
            this._stopHeartbeat();
            this.emit('disconnected');
            if (!this._intentClose)
                this._scheduleRetry();
        });
        this._ws.on('error', (...args) => {
            this.emit('error', args[0]);
        });
        this._ws.on('pong', () => {
            this.emit('pong');
        });
    }
    _scheduleRetry() {
        if (this._retries >= this.maxRetries) {
            this.emit('maxRetries');
            return;
        }
        const delay = Math.min(this.retryDelay * Math.pow(2, this._retries), this.maxDelay);
        this._retries++;
        this.emit('reconnecting', { attempt: this._retries, delay });
        setTimeout(() => this._dial(), delay);
    }
    disconnect() {
        this._intentClose = true;
        this._stopHeartbeat();
        if (this._ws)
            this._ws.close();
        return this;
    }
    // ── Heartbeat ─────────────────────────────────────────────────────────────
    _startHeartbeat() {
        this._hbTimer = setInterval(() => {
            if (this._ws && this._ws.readyState === 1) {
                this._ws.ping();
                this.emit('ping');
            }
        }, this.heartbeatMs);
    }
    _stopHeartbeat() {
        if (this._hbTimer)
            clearInterval(this._hbTimer);
    }
    // ── Channels (multiplexing) ───────────────────────────────────────────────
    subscribe(channel, handler) {
        this._channels.set(channel, handler);
        const frame = buildTitanFrame(TITAN_FRAME.SUBSCRIBE, channel, Buffer.alloc(0));
        this._sendRaw(frame);
        return () => this.unsubscribe(channel);
    }
    unsubscribe(channel) {
        this._channels.delete(channel);
    }
    publish(channel, data) {
        const payload = Buffer.isBuffer(data)
            ? data
            : typeof data === 'string'
                ? Buffer.from(data)
                : Buffer.from(JSON.stringify(data));
        const frame = buildTitanFrame(TITAN_FRAME.PUBLISH, channel, payload);
        return this._sendRaw(frame);
    }
    stream(channel, binaryBuffer) {
        const frame = buildTitanFrame(TITAN_FRAME.STREAM, channel, binaryBuffer);
        return this._sendRaw(frame);
    }
    presence(channel, status = 'online') {
        return this._sendRaw(buildTitanFrame(TITAN_FRAME.PRESENCE, channel, Buffer.from(status)));
    }
    // ── Raw send + queue ──────────────────────────────────────────────────────
    _sendRaw(buf) {
        if (!this._connected) {
            this._queue.push(buf);
            return false;
        }
        try {
            this._ws.send(buf);
            return true;
        }
        catch {
            this._queue.push(buf);
            return false;
        }
    }
    _flushQueue() {
        while (this._queue.length) {
            const msg = this._queue.shift();
            try {
                this._ws.send(msg);
            }
            catch {
                this._queue.unshift(msg);
                break;
            }
        }
    }
    sendText(text) {
        return this._sendRaw(Buffer.from(text));
    }
    _handleFrame(type, channel, payload) {
        const handler = this._channels.get(channel);
        if (type === TITAN_FRAME.PUBLISH && handler)
            handler(payload, channel);
        if (type === TITAN_FRAME.STREAM && handler)
            handler(payload, channel, true);
        if (type === TITAN_FRAME.ERROR)
            this.emit('serverError', { channel, msg: payload.toString() });
        if (type === TITAN_FRAME.PRESENCE)
            this.emit('presence', { channel, status: payload.toString() });
        this.emit('frame', { type, channel, payload });
    }
    // ── Utilities ─────────────────────────────────────────────────────────────
    isConnected() {
        return this._connected;
    }
    queueSize() {
        return this._queue.length;
    }
    channelCount() {
        return this._channels.size;
    }
}
WebSocketClient.buildFrame = buildTitanFrame;
WebSocketClient.FRAME = TITAN_FRAME;
exports.default = WebSocketClient;
//# sourceMappingURL=WebSocketClient.js.map