"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataStream = void 0;
const events_1 = require("events");
/**
 * 🌊 DolphinRealtime — StreamManager
 *
 * High-throughput binary data streaming for sensor data, camera frames,
 * audio chunks, and IoT telemetry. Flutter ko no built-in equivalent
 * for cross-device binary streaming at this throughput.
 *
 * Features:
 *  - Backpressure-aware streaming
 *  - Frame buffering with configurable window
 *  - Multi-subscriber fan-out
 *  - Stream recording (ring buffer)
 *  - Throughput / latency stats
 */
const STREAM_TYPE = {
    SENSOR: 0x01,
    CAMERA: 0x02,
    AUDIO: 0x03,
    TELEMETRY: 0x04,
    CUSTOM: 0xff,
};
function buildStreamHeader(type, streamId, seq, payloadLen) {
    const h = Buffer.alloc(14);
    h.writeUInt8(0xde, 0); // stream magic
    h.writeUInt8(type, 1);
    h.writeUInt16LE(streamId, 2);
    h.writeUInt32LE(seq, 4);
    h.writeUInt32LE(payloadLen, 8);
    h.writeUInt16LE(0, 12); // checksum placeholder
    return h;
}
class DataStream extends events_1.EventEmitter {
    constructor(config = {}) {
        super();
        this.id = config.id ?? Math.floor(Math.random() * 0xffff);
        this.type = config.type ?? STREAM_TYPE.SENSOR;
        this.name = config.name || 'stream-' + this.id;
        this.bufferSize = config.buffer || 60; // frames
        this._seq = 0;
        this._frames = [];
        this._subs = new Set();
        this._recording = false;
        this._record = [];
        this._stats = { framesIn: 0, bytesIn: 0, startedAt: Date.now(), dropped: 0 };
        this._paused = false;
    }
    push(payload) {
        if (this._paused) {
            this._stats.dropped++;
            return false;
        }
        const buf = Buffer.isBuffer(payload) ? payload : Buffer.from(JSON.stringify(payload));
        const header = buildStreamHeader(this.type, this.id, this._seq++, buf.length);
        const frame = Buffer.concat([header, buf]);
        this._frames.push(frame);
        if (this._frames.length > this.bufferSize)
            this._frames.shift();
        this._stats.framesIn++;
        this._stats.bytesIn += frame.length;
        if (this._recording)
            this._record.push(frame);
        for (const sub of this._subs) {
            try {
                sub(buf, { seq: this._seq - 1, streamId: this.id, frame });
            }
            catch {
                /* don't let subscriber errors kill the stream */
            }
        }
        this.emit('data', buf, { seq: this._seq - 1 });
        return true;
    }
    subscribe(fn) {
        this._subs.add(fn);
        return () => this._subs.delete(fn);
    }
    unsubscribe(fn) {
        this._subs.delete(fn);
    }
    pause() {
        this._paused = true;
        this.emit('pause');
    }
    resume() {
        this._paused = false;
        this.emit('resume');
    }
    startRecording() {
        this._recording = true;
        this._record = [];
    }
    stopRecording() {
        this._recording = false;
        return Buffer.concat(this._record);
    }
    getLastN(n = 10) {
        return this._frames.slice(-n);
    }
    getStats() {
        const elapsed = (Date.now() - this._stats.startedAt) / 1000;
        return {
            ...this._stats,
            fps: (this._stats.framesIn / elapsed).toFixed(1),
            kbps: (this._stats.bytesIn / elapsed / 1024).toFixed(1),
            subscribers: this._subs.size,
            buffered: this._frames.length,
        };
    }
}
exports.DataStream = DataStream;
class StreamManager extends events_1.EventEmitter {
    constructor() {
        super();
        this._streams = new Map();
    }
    create(config = {}) {
        const stream = new DataStream(config);
        this._streams.set(stream.name, stream);
        this.emit('streamCreated', { name: stream.name, type: stream.type });
        return stream;
    }
    get(name) {
        return this._streams.get(name) || null;
    }
    destroy(name) {
        const s = this._streams.get(name);
        if (s) {
            s.emit('end');
            this._streams.delete(name);
            this.emit('streamDestroyed', { name });
        }
    }
    // ── Factory shortcuts ─────────────────────────────────────────────────────
    sensorStream(name, config = {}) {
        return this.create({ name, type: STREAM_TYPE.SENSOR, ...config });
    }
    cameraStream(name, config = {}) {
        return this.create({ name, type: STREAM_TYPE.CAMERA, ...config, buffer: 30 });
    }
    audioStream(name, config = {}) {
        return this.create({ name, type: STREAM_TYPE.AUDIO, ...config, buffer: 100 });
    }
    telemetryStream(name, config = {}) {
        return this.create({ name, type: STREAM_TYPE.TELEMETRY, ...config });
    }
    // ── Fan-out: pipe one stream to multiple WebSocket channels ──────────────
    pipe(streamName, wsClient, channel) {
        const stream = this._streams.get(streamName);
        if (!stream)
            throw new Error(`Stream '${streamName}' not found`);
        return stream.subscribe((data) => wsClient.stream(channel, data));
    }
    // ── Summary ───────────────────────────────────────────────────────────────
    summary() {
        return [...this._streams.entries()].map(([name, s]) => ({ name, ...s.getStats() }));
    }
}
StreamManager.TYPE = STREAM_TYPE;
StreamManager.Stream = DataStream;
exports.default = StreamManager;
//# sourceMappingURL=StreamManager.js.map