'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MEMBER_ROLE = exports.GROUP_CMD = exports.Group = void 0;
const events_1 = require("events");
const Chat_1 = __importDefault(require("./Chat"));
/**
 * 🌊 DolphinIntercom — Group
 *
 * Group management module. Create, manage, and communicate within
 * named groups / channels. Each group has its own Chat room, member
 * roles, permissions, and an optional pinned message board.
 *
 * Usage:
 *   const group = new Group({ name: 'Engineering', createdBy: 'u1' });
 *   group.addMember('u2', 'admin');
 *   group.send('Welcome to the team!');
 */
const GROUP_CMD = {
    CREATE: 0xa0,
    DELETE: 0xa1,
    UPDATE: 0xa2,
    ADD_MEMBER: 0xa3,
    REMOVE_MEMBER: 0xa4,
    SET_ROLE: 0xa5,
    PIN_MESSAGE: 0xa6,
    UNPIN_MESSAGE: 0xa7,
    INVITE: 0xa8,
    JOIN_REQUEST: 0xa9,
    APPROVE_JOIN: 0xaa,
    REJECT_JOIN: 0xab,
    ARCHIVE: 0xac,
    BROADCAST: 0xad,
};
exports.GROUP_CMD = GROUP_CMD;
const MEMBER_ROLE = {
    OWNER: 'owner',
    ADMIN: 'admin',
    MEMBER: 'member',
    READONLY: 'readonly',
};
exports.MEMBER_ROLE = MEMBER_ROLE;
function buildGroupPacket(cmd, payload) {
    const json = JSON.stringify(payload);
    const jBuf = Buffer.from(json, 'utf8');
    const msg = Buffer.alloc(1 + 1 + 4 + jBuf.length);
    let off = 0;
    msg.writeUInt8(0x13, off++);
    msg.writeUInt8(cmd, off++);
    msg.writeUInt32LE(jBuf.length, off);
    off += 4;
    jBuf.copy(msg, off);
    return msg;
}
class Group extends events_1.EventEmitter {
    constructor(config = {}) {
        super();
        this.groupId = config.groupId || 'group-' + Date.now();
        this.name = config.name || 'Untitled Group';
        this.description = config.description || '';
        this.avatar = config.avatar || null;
        this.isPrivate = config.isPrivate !== false;
        this.createdBy = config.createdBy || null;
        this.createdAt = config.createdAt || Date.now();
        this._dispatch = config.dispatch || null;
        this._members = new Map(); // userId → { role, joinedAt, muted }
        this._pending = new Map(); // userId → join-request
        this._pins = []; // pinned message IDs
        this.archived = false;
        // Built-in chat room for the group
        this.chat = new Chat_1.default({
            userId: config.createdBy || 'system',
            roomId: this.groupId,
            dispatch: this._dispatch || undefined,
        });
        // Add owner automatically
        if (this.createdBy) {
            this._members.set(this.createdBy, {
                userId: this.createdBy,
                role: MEMBER_ROLE.OWNER,
                joinedAt: this.createdAt,
                muted: false,
            });
        }
    }
    // ── Lifecycle ──────────────────────────────────────────────────────────────
    create() {
        this._send(GROUP_CMD.CREATE, {
            groupId: this.groupId,
            name: this.name,
            description: this.description,
            isPrivate: this.isPrivate,
            createdBy: this.createdBy,
        });
        this.chat.connect();
        this.emit('created', this.getInfo());
        return this;
    }
    update(changes = {}) {
        if (changes.name)
            this.name = changes.name;
        if (changes.description)
            this.description = changes.description;
        if (changes.avatar)
            this.avatar = changes.avatar;
        if (changes.isPrivate !== undefined)
            this.isPrivate = changes.isPrivate;
        this._send(GROUP_CMD.UPDATE, { groupId: this.groupId, ...changes });
        this.emit('updated', this.getInfo());
        return this;
    }
    archive() {
        this.archived = true;
        this.chat.disconnect();
        this._send(GROUP_CMD.ARCHIVE, { groupId: this.groupId });
        this.emit('archived', { groupId: this.groupId });
        return this;
    }
    delete() {
        this.archive();
        this._send(GROUP_CMD.DELETE, { groupId: this.groupId });
        this.emit('deleted', { groupId: this.groupId });
        return this;
    }
    // ── Membership ────────────────────────────────────────────────────────────
    addMember(userId, role = MEMBER_ROLE.MEMBER) {
        if (this._members.has(userId))
            return this;
        this._members.set(userId, { userId, role, joinedAt: Date.now(), muted: false });
        this._send(GROUP_CMD.ADD_MEMBER, { groupId: this.groupId, userId, role });
        this.emit('memberAdded', { userId, role, groupId: this.groupId });
        return this;
    }
    removeMember(userId) {
        this._members.delete(userId);
        this._send(GROUP_CMD.REMOVE_MEMBER, { groupId: this.groupId, userId });
        this.emit('memberRemoved', { userId, groupId: this.groupId });
        return this;
    }
    setRole(userId, role) {
        const m = this._members.get(userId);
        if (m) {
            m.role = role;
            this._send(GROUP_CMD.SET_ROLE, { groupId: this.groupId, userId, role });
            this.emit('roleChanged', { userId, role, groupId: this.groupId });
        }
        return this;
    }
    muteMember(userId, muted = true) {
        const m = this._members.get(userId);
        if (m)
            m.muted = muted;
        this.emit('memberMuted', { userId, muted });
        return this;
    }
    // ── Invitations ───────────────────────────────────────────────────────────
    invite(userId, invitedBy = this.createdBy) {
        this._send(GROUP_CMD.INVITE, { groupId: this.groupId, userId, invitedBy });
        this.emit('inviteSent', { userId, invitedBy });
        return this;
    }
    requestJoin(userId) {
        this._pending.set(userId, { userId, requestedAt: Date.now() });
        this._send(GROUP_CMD.JOIN_REQUEST, { groupId: this.groupId, userId });
        this.emit('joinRequested', { userId, groupId: this.groupId });
        return this;
    }
    approveJoin(userId, role = MEMBER_ROLE.MEMBER) {
        this._pending.delete(userId);
        this.addMember(userId, role);
        this._send(GROUP_CMD.APPROVE_JOIN, { groupId: this.groupId, userId });
        this.emit('joinApproved', { userId });
        return this;
    }
    rejectJoin(userId, reason = '') {
        this._pending.delete(userId);
        this._send(GROUP_CMD.REJECT_JOIN, { groupId: this.groupId, userId, reason });
        this.emit('joinRejected', { userId, reason });
        return this;
    }
    // ── Messaging ─────────────────────────────────────────────────────────────
    /** Send a text message to the group chat */
    send(text, opts = {}) {
        return this.chat.send(text, opts);
    }
    /** Broadcast announcement to all members (high-priority) */
    broadcast(text) {
        this._send(GROUP_CMD.BROADCAST, { groupId: this.groupId, text, at: Date.now() });
        this.emit('broadcast', { text, groupId: this.groupId });
        return this;
    }
    // ── Pins ──────────────────────────────────────────────────────────────────
    pinMessage(msgId) {
        if (!this._pins.includes(msgId))
            this._pins.push(msgId);
        this._send(GROUP_CMD.PIN_MESSAGE, { groupId: this.groupId, msgId });
        this.emit('messagePinned', { msgId });
        return this;
    }
    unpinMessage(msgId) {
        this._pins = this._pins.filter((id) => id !== msgId);
        this._send(GROUP_CMD.UNPIN_MESSAGE, { groupId: this.groupId, msgId });
        this.emit('messageUnpinned', { msgId });
        return this;
    }
    // ── Queries ───────────────────────────────────────────────────────────────
    getMembers() {
        return [...this._members.values()];
    }
    getMember(userId) {
        return this._members.get(userId) || null;
    }
    hasMember(userId) {
        return this._members.has(userId);
    }
    getMemberCount() {
        return this._members.size;
    }
    getPendingRequests() {
        return [...this._pending.values()];
    }
    getPinnedMessages() {
        return [...this._pins];
    }
    getInfo() {
        return {
            groupId: this.groupId,
            name: this.name,
            description: this.description,
            avatar: this.avatar,
            isPrivate: this.isPrivate,
            archived: this.archived,
            memberCount: this._members.size,
            createdBy: this.createdBy,
            createdAt: this.createdAt,
            pinnedMessages: this._pins,
        };
    }
    // ── Internal ───────────────────────────────────────────────────────────────
    _send(cmd, payload) {
        const buf = buildGroupPacket(cmd, payload);
        if (typeof this._dispatch === 'function')
            this._dispatch(buf);
        this.emit('hwCommand', { cmd, payload, buffer: buf });
        return buf;
    }
}
exports.Group = Group;
Group.CMD = GROUP_CMD;
Group.ROLE = MEMBER_ROLE;
exports.default = Group;
//# sourceMappingURL=Group.js.map