'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MEETING_STATE = exports.PARTICIPANT_ROLE = exports.MEETING_CMD = exports.Meeting = void 0;
const events_1 = require("events");
const VideoCall_1 = __importDefault(require("./VideoCall"));
/**
 * 🌊 DolphinIntercom — Meeting
 *
 * Multi-party video meeting module. Manages multiple VideoCall peers,
 * scheduling, participant roles, screen sharing, and recording.
 *
 * Usage:
 *   const meeting = new Meeting({ hostId: 'u1', title: 'Team Standup' });
 *   meeting.join('u2');
 *   meeting.startScreenShare();
 */
const MEETING_CMD = {
    CREATE: 0xb0,
    JOIN: 0xb1,
    LEAVE: 0xb2,
    KICK: 0xb3,
    MUTE_ALL: 0xb4,
    SCREEN_SHARE: 0xb5,
    SCREEN_STOP: 0xb6,
    RECORD_START: 0xb7,
    RECORD_STOP: 0xb8,
    RAISE_HAND: 0xb9,
    LOWER_HAND: 0xba,
    SET_ROLE: 0xbb,
    CHAT_MSG: 0xbc,
    REACTION: 0xbd,
    END: 0xbf,
};
exports.MEETING_CMD = MEETING_CMD;
const PARTICIPANT_ROLE = {
    HOST: 'host',
    COHOST: 'cohost',
    ATTENDEE: 'attendee',
    PRESENTER: 'presenter',
};
exports.PARTICIPANT_ROLE = PARTICIPANT_ROLE;
const MEETING_STATE = {
    SCHEDULED: 'scheduled',
    ACTIVE: 'active',
    ENDED: 'ended',
    WAITING: 'waiting',
};
exports.MEETING_STATE = MEETING_STATE;
function buildMeetingPacket(cmd, payload) {
    const json = JSON.stringify(payload);
    const jBuf = Buffer.from(json, 'utf8');
    const msg = Buffer.alloc(1 + 1 + 4 + jBuf.length);
    let off = 0;
    msg.writeUInt8(0x12, off++);
    msg.writeUInt8(cmd, off++);
    msg.writeUInt32LE(jBuf.length, off);
    off += 4;
    jBuf.copy(msg, off);
    return msg;
}
class Meeting extends events_1.EventEmitter {
    constructor(config = {}) {
        super();
        this.meetingId = config.meetingId || 'meet-' + Date.now();
        this.hostId = config.hostId || null;
        this.title = config.title || 'Meeting';
        this.scheduledAt = config.scheduledAt ?? null;
        this.maxParticipants = config.maxParticipants || 100;
        this.waitingRoom = config.waitingRoom !== false;
        this.audio = config.audio !== false;
        this.video = config.video !== false;
        this._dispatch = config.dispatch || null;
        this.state = MEETING_STATE.SCHEDULED;
        this._participants = new Map(); // userId → { role, call, handRaised, ... }
        this._recording = false;
        this._screenShare = null;
        this._startedAt = null;
    }
    // ── Lifecycle ──────────────────────────────────────────────────────────────
    start() {
        this.state = MEETING_STATE.ACTIVE;
        this._startedAt = Date.now();
        if (this.hostId)
            this._addParticipant(this.hostId, PARTICIPANT_ROLE.HOST);
        this._send(MEETING_CMD.CREATE, { meetingId: this.meetingId, title: this.title, hostId: this.hostId });
        this.emit('started', { meetingId: this.meetingId });
        return this;
    }
    end() {
        this.state = MEETING_STATE.ENDED;
        for (const [uid] of this._participants)
            this._removeParticipant(uid, false);
        this._send(MEETING_CMD.END, { meetingId: this.meetingId });
        this.emit('ended', { meetingId: this.meetingId, duration: Date.now() - (this._startedAt ?? Date.now()) });
        return this;
    }
    // ── Participants ──────────────────────────────────────────────────────────
    join(userId, opts = {}) {
        if (this._participants.size >= this.maxParticipants) {
            throw new Error(`[DolphinMeeting] Max participants (${this.maxParticipants}) reached`);
        }
        const role = opts.role || (userId === this.hostId ? PARTICIPANT_ROLE.HOST : PARTICIPANT_ROLE.ATTENDEE);
        this._addParticipant(userId, role, opts);
        this._send(MEETING_CMD.JOIN, { meetingId: this.meetingId, userId, role });
        this.emit('participantJoined', { userId, role, meetingId: this.meetingId });
        return this;
    }
    leave(userId) {
        this._removeParticipant(userId);
        this._send(MEETING_CMD.LEAVE, { meetingId: this.meetingId, userId });
        this.emit('participantLeft', { userId, meetingId: this.meetingId });
        return this;
    }
    kick(userId, reason = '') {
        this._removeParticipant(userId);
        this._send(MEETING_CMD.KICK, { meetingId: this.meetingId, userId, reason });
        this.emit('participantKicked', { userId, reason });
        return this;
    }
    setRole(userId, role) {
        const p = this._participants.get(userId);
        if (p) {
            p.role = role;
            this._send(MEETING_CMD.SET_ROLE, { meetingId: this.meetingId, userId, role });
            this.emit('roleChanged', { userId, role });
        }
        return this;
    }
    // ── Audio / Video controls ─────────────────────────────────────────────────
    muteAll() {
        this._send(MEETING_CMD.MUTE_ALL, { meetingId: this.meetingId });
        this.emit('allMuted');
        return this;
    }
    mute(userId, muted = true) {
        const p = this._participants.get(userId);
        if (p?.call)
            p.call.mute(muted);
        this.emit('muteChanged', { userId, muted });
        return this;
    }
    // ── Screen sharing ────────────────────────────────────────────────────────
    startScreenShare(presenterId = this.hostId) {
        this._screenShare = presenterId;
        this._send(MEETING_CMD.SCREEN_SHARE, { meetingId: this.meetingId, presenterId });
        this.emit('screenShareStarted', { presenterId });
        return this;
    }
    stopScreenShare() {
        this._screenShare = null;
        this._send(MEETING_CMD.SCREEN_STOP, { meetingId: this.meetingId });
        this.emit('screenShareStopped');
        return this;
    }
    // ── Recording ─────────────────────────────────────────────────────────────
    startRecording() {
        this._recording = true;
        this._send(MEETING_CMD.RECORD_START, { meetingId: this.meetingId });
        this.emit('recordingStarted');
        return this;
    }
    stopRecording() {
        this._recording = false;
        this._send(MEETING_CMD.RECORD_STOP, { meetingId: this.meetingId });
        this.emit('recordingStopped');
        return this;
    }
    // ── Engagement ────────────────────────────────────────────────────────────
    raiseHand(userId) {
        const p = this._participants.get(userId);
        if (p)
            p.handRaised = true;
        this._send(MEETING_CMD.RAISE_HAND, { meetingId: this.meetingId, userId });
        this.emit('handRaised', { userId });
        return this;
    }
    lowerHand(userId) {
        const p = this._participants.get(userId);
        if (p)
            p.handRaised = false;
        this._send(MEETING_CMD.LOWER_HAND, { meetingId: this.meetingId, userId });
        this.emit('handLowered', { userId });
        return this;
    }
    react(userId, emoji) {
        this._send(MEETING_CMD.REACTION, { meetingId: this.meetingId, userId, emoji });
        this.emit('reaction', { userId, emoji });
        return this;
    }
    sendChatMessage(userId, text) {
        this._send(MEETING_CMD.CHAT_MSG, { meetingId: this.meetingId, userId, text, at: Date.now() });
        this.emit('chatMessage', { userId, text });
        return this;
    }
    // ── Internal ───────────────────────────────────────────────────────────────
    _addParticipant(userId, role, opts = {}) {
        const call = new VideoCall_1.default({
            callId: `${this.meetingId}-${userId}`,
            peerId: userId,
            audio: opts.audio !== false ? this.audio : false,
            video: opts.video !== false ? this.video : false,
            iceServers: opts.iceServers,
            dispatch: this._dispatch || undefined,
        });
        this._participants.set(userId, { userId, role, call, joinedAt: Date.now(), handRaised: false });
    }
    _removeParticipant(userId, sendHangup = true) {
        const p = this._participants.get(userId);
        if (p?.call && sendHangup)
            p.call.hangup();
        this._participants.delete(userId);
    }
    _send(cmd, payload) {
        const buf = buildMeetingPacket(cmd, payload);
        if (typeof this._dispatch === 'function')
            this._dispatch(buf);
        this.emit('hwCommand', { cmd, payload, buffer: buf });
        return buf;
    }
    // ── Info ──────────────────────────────────────────────────────────────────
    getParticipants() {
        return [...this._participants.values()].map(({ userId, role, joinedAt, handRaised }) => ({
            userId,
            role,
            joinedAt,
            handRaised,
        }));
    }
    getParticipant(id) {
        const p = this._participants.get(id);
        return p ? { userId: p.userId, role: p.role, joinedAt: p.joinedAt, handRaised: p.handRaised } : null;
    }
    getInfo() {
        return {
            meetingId: this.meetingId,
            title: this.title,
            state: this.state,
            participants: this.getParticipants().length,
            recording: this._recording,
            screenShare: this._screenShare,
            startedAt: this._startedAt,
        };
    }
}
exports.Meeting = Meeting;
Meeting.CMD = MEETING_CMD;
Meeting.ROLE = PARTICIPANT_ROLE;
Meeting.STATE = MEETING_STATE;
exports.default = Meeting;
//# sourceMappingURL=Meeting.js.map