'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TITAN_CMD = exports.CALL_STATE = exports.VideoCall = void 0;
const events_1 = require("events");
/**
 * 🌊 DolphinIntercom — VideoCall
 *
 * WebRTC-backed 1-to-1 and multi-party video/audio call module.
 * Dispatches binary commands to the Android DolphinRuntime via
 * the HW_CMD protocol (0x40-0x45) already implemented in the runtime.
 *
 * Usage:
 *   const call = new VideoCall({ peerId: 'user-42' });
 *   call.on('connected', () => console.log('call live'));
 *   call.start();
 */
const TITAN_CMD = {
    INVITE: 0x10,
    ACCEPT: 0x11,
    REJECT: 0x12,
    HANGUP: 0x13,
    AUDIO_FRAME: 0x14,
    VIDEO_FRAME: 0x15,
};
exports.TITAN_CMD = TITAN_CMD;
const CALL_STATE = {
    IDLE: 'IDLE',
    CALLING: 'CALLING',
    RINGING: 'RINGING',
    CONNECTED: 'CONNECTED',
    ON_HOLD: 'ON_HOLD',
    ENDED: 'ENDED',
    FAILED: 'FAILED',
};
exports.CALL_STATE = CALL_STATE;
function buildTitanPacket(cmd, params) {
    const json = JSON.stringify(params);
    const jBuf = Buffer.from(json, 'utf8');
    const msg = Buffer.alloc(1 + 1 + 4 + jBuf.length);
    let off = 0;
    msg.writeUInt8(0x54, off++); // Titan Signature Byte 1 'T'
    msg.writeUInt8(cmd, off++); // Titan Command
    msg.writeUInt32LE(jBuf.length, off);
    off += 4;
    jBuf.copy(msg, off);
    return msg;
}
class VideoCall extends events_1.EventEmitter {
    constructor(config = {}) {
        super();
        this.callId = config.callId || 'call-' + Date.now();
        this.peerId = config.peerId || null;
        this.audio = config.audio !== false;
        this.video = config.video !== false;
        this.state = CALL_STATE.IDLE;
        this._dispatch = config.dispatch || null;
        this._stats = { startedAt: null, endedAt: null, duration: 0 };
    }
    // ── Internal ───────────────────────────────────────────────────────────────
    _setState(next) {
        const prev = this.state;
        this.state = next;
        this.emit('stateChange', { prev, next, callId: this.callId });
    }
    _send(cmd, params) {
        const buf = buildTitanPacket(cmd, { callId: this.callId, ...params });
        if (typeof this._dispatch === 'function') {
            this._dispatch(buf);
        }
        this.emit('titanCommand', { cmd, params, buffer: buf });
        return buf;
    }
    // ── Lifecycle ──────────────────────────────────────────────────────────────
    /**
     * Start an outgoing binary video call to target peer.
     */
    start() {
        if (!this.peerId)
            throw new Error('[DolphinVideoCall] peerId is required to start a call');
        this._setState(CALL_STATE.CALLING);
        this._stats.startedAt = Date.now();
        return this._send(TITAN_CMD.INVITE, {
            peerId: this.peerId,
            audio: this.audio,
            video: this.video,
        });
    }
    /**
     * Accept an incoming binary call.
     */
    answer() {
        this._setState(CALL_STATE.CONNECTED);
        return this._send(TITAN_CMD.ACCEPT, { peerId: this.peerId });
    }
    /**
     * Reject an incoming call.
     */
    reject() {
        this._setState(CALL_STATE.ENDED);
        return this._send(TITAN_CMD.REJECT, { peerId: this.peerId });
    }
    /**
     * End / hang up the binary call.
     */
    hangup() {
        if (this.state === CALL_STATE.ENDED)
            return undefined;
        this._stats.endedAt = Date.now();
        this._stats.duration = this._stats.startedAt ? this._stats.endedAt - this._stats.startedAt : 0;
        this._setState(CALL_STATE.ENDED);
        const buf = this._send(TITAN_CMD.HANGUP, { peerId: this.peerId });
        this.emit('ended', { callId: this.callId, stats: this._stats });
        return buf;
    }
    /** Mute/unmute local audio. */
    mute(muted = true) {
        this.audio = !muted;
        this.emit('muteChanged', { muted, callId: this.callId });
    }
    /** Enable/disable local video. */
    setVideo(enabled = true) {
        this.video = enabled;
        this.emit('videoChanged', { enabled, callId: this.callId });
    }
    /** Hold the call */
    hold() {
        this._setState(CALL_STATE.ON_HOLD);
    }
    /** Resume from hold */
    resume() {
        this._setState(CALL_STATE.CONNECTED);
    }
    /** Call stats */
    getStats() {
        return { ...this._stats, state: this.state, callId: this.callId };
    }
}
exports.VideoCall = VideoCall;
VideoCall.STATE = CALL_STATE;
VideoCall.TITAN_CMD = TITAN_CMD;
exports.default = VideoCall;
//# sourceMappingURL=VideoCall.js.map