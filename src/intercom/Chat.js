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
exports.MSG_STATUS = exports.CHAT_CMD = exports.Message = exports.Chat = void 0;
const events_1 = require("events");
const crypto = __importStar(require("crypto"));
/**
 * 🌊 DolphinIntercom — Chat
 *
 * Real-time messaging module backed by the Dolphin binary protocol.
 * Supports 1:1 and group threads, message reactions, read-receipts,
 * typing indicators, and offline message queuing.
 *
 * Usage:
 *   const chat = new Chat({ userId: 'u1', roomId: 'room-abc' });
 *   chat.on('message', (msg) => console.log(msg));
 *   chat.send('Hello!');
 */
const CHAT_CMD = {
    SEND_TEXT: 0xd0,
    SEND_IMAGE: 0xd1,
    SEND_FILE: 0xd2,
    SEND_AUDIO: 0xd3,
    SEND_VIDEO: 0xd4,
    READ_RECEIPT: 0xd5,
    TYPING_START: 0xd6,
    TYPING_STOP: 0xd7,
    REACT: 0xd8,
    DELETE_MSG: 0xd9,
    EDIT_MSG: 0xda,
    FETCH_HISTORY: 0xdb,
};
exports.CHAT_CMD = CHAT_CMD;
const MSG_STATUS = {
    PENDING: 'pending',
    SENT: 'sent',
    DELIVERED: 'delivered',
    READ: 'read',
    FAILED: 'failed',
};
exports.MSG_STATUS = MSG_STATUS;
function buildChatPacket(cmd, payload) {
    const json = JSON.stringify(payload);
    const jBuf = Buffer.from(json, 'utf8');
    const msg = Buffer.alloc(1 + 1 + 4 + jBuf.length);
    let off = 0;
    msg.writeUInt8(0x11, off++); // INTERCOM frame type
    msg.writeUInt8(cmd, off++);
    msg.writeUInt32LE(jBuf.length, off);
    off += 4;
    jBuf.copy(msg, off);
    return msg;
}
class Message {
    constructor({ id, roomId, senderId, type, content, timestamp, metadata }) {
        this.id = id || crypto.randomUUID();
        this.roomId = roomId;
        this.senderId = senderId;
        this.type = type || 'text';
        this.content = content;
        this.timestamp = timestamp || Date.now();
        this.status = MSG_STATUS.PENDING;
        this.reactions = {};
        this.metadata = metadata || {};
    }
    toJSON() {
        return {
            id: this.id,
            roomId: this.roomId,
            senderId: this.senderId,
            type: this.type,
            content: this.content,
            timestamp: this.timestamp,
            status: this.status,
            reactions: this.reactions,
            metadata: this.metadata,
        };
    }
}
exports.Message = Message;
class Chat extends events_1.EventEmitter {
    constructor(config = {}) {
        super();
        this.userId = config.userId || 'anon-' + Date.now();
        this.roomId = config.roomId || 'room-' + Date.now();
        this.maxHistory = config.maxHistory || 200;
        this._dispatch = config.dispatch || null;
        this._messages = new Map();
        this._queue = []; // offline queue
        this._connected = false;
        this._typing = false;
        this._typingTimer = null;
    }
    // ── Connection lifecycle ──────────────────────────────────────────────────
    connect() {
        this._connected = true;
        this._flushQueue();
        this.emit('connected', { roomId: this.roomId });
        return this;
    }
    disconnect() {
        this._connected = false;
        this._stopTyping();
        this.emit('disconnected', { roomId: this.roomId });
        return this;
    }
    // ── Sending ───────────────────────────────────────────────────────────────
    send(content, opts = {}) {
        const msg = new Message({
            roomId: this.roomId,
            senderId: this.userId,
            type: opts.type || 'text',
            content,
            metadata: opts.metadata || {},
        });
        this._messages.set(msg.id, msg);
        this.emit('messageSent', msg.toJSON());
        this._dispatch_(CHAT_CMD.SEND_TEXT, msg.toJSON());
        return msg;
    }
    sendImage(url, caption = '') {
        return this._sendMedia('image', CHAT_CMD.SEND_IMAGE, { url, caption });
    }
    sendAudio(url, durationMs = 0) {
        return this._sendMedia('audio', CHAT_CMD.SEND_AUDIO, { url, durationMs });
    }
    sendVideo(url, durationMs = 0, thumbnail = '') {
        return this._sendMedia('video', CHAT_CMD.SEND_VIDEO, { url, durationMs, thumbnail });
    }
    sendFile(url, filename, sizeBytes = 0) {
        return this._sendMedia('file', CHAT_CMD.SEND_FILE, { url, filename, sizeBytes });
    }
    _sendMedia(type, cmd, content) {
        const msg = new Message({ roomId: this.roomId, senderId: this.userId, type, content });
        this._messages.set(msg.id, msg);
        this.emit('messageSent', msg.toJSON());
        this._dispatch_(cmd, msg.toJSON());
        return msg;
    }
    // ── Receiving (called by runtime) ─────────────────────────────────────────
    receive(rawMsg) {
        const msg = new Message(rawMsg);
        msg.status = MSG_STATUS.DELIVERED;
        this._messages.set(msg.id, msg);
        if (this._messages.size > this.maxHistory) {
            const oldest = this._messages.keys().next().value;
            if (oldest !== undefined)
                this._messages.delete(oldest);
        }
        this.emit('message', msg.toJSON());
        this._dispatch_(CHAT_CMD.READ_RECEIPT, { msgId: msg.id, userId: this.userId, at: Date.now() });
        return msg;
    }
    // ── Message actions ───────────────────────────────────────────────────────
    react(msgId, emoji) {
        const msg = this._messages.get(msgId);
        if (msg) {
            msg.reactions[emoji] = (msg.reactions[emoji] || 0) + 1;
            this.emit('reactionAdded', { msgId, emoji, userId: this.userId });
        }
        return this._dispatch_(CHAT_CMD.REACT, { msgId, emoji, userId: this.userId });
    }
    deleteMessage(msgId) {
        this._messages.delete(msgId);
        this.emit('messageDeleted', { msgId });
        return this._dispatch_(CHAT_CMD.DELETE_MSG, { msgId, userId: this.userId });
    }
    editMessage(msgId, newContent) {
        const msg = this._messages.get(msgId);
        if (msg) {
            msg.content = newContent;
            msg.metadata.edited = true;
            this.emit('messageEdited', { msgId, newContent });
        }
        return this._dispatch_(CHAT_CMD.EDIT_MSG, { msgId, newContent, userId: this.userId });
    }
    fetchHistory(limit = 50, before = null) {
        return this._dispatch_(CHAT_CMD.FETCH_HISTORY, { roomId: this.roomId, limit, before });
    }
    // ── Typing indicators ────────────────────────────────────────────────────
    startTyping() {
        if (!this._typing) {
            this._typing = true;
            this._dispatch_(CHAT_CMD.TYPING_START, { userId: this.userId, roomId: this.roomId });
            this.emit('typingStart', { userId: this.userId });
        }
        if (this._typingTimer)
            clearTimeout(this._typingTimer);
        this._typingTimer = setTimeout(() => this._stopTyping(), 5000);
    }
    _stopTyping() {
        if (this._typing) {
            this._typing = false;
            if (this._typingTimer)
                clearTimeout(this._typingTimer);
            this._dispatch_(CHAT_CMD.TYPING_STOP, { userId: this.userId, roomId: this.roomId });
            this.emit('typingStop', { userId: this.userId });
        }
    }
    // ── Internal ───────────────────────────────────────────────────────────────
    _dispatch_(cmd, payload) {
        const buf = buildChatPacket(cmd, payload);
        if (!this._connected) {
            this._queue.push({ cmd, payload });
            return buf;
        }
        if (typeof this._dispatch === 'function')
            this._dispatch(buf);
        this.emit('hwCommand', { cmd, payload, buffer: buf });
        return buf;
    }
    _flushQueue() {
        while (this._queue.length) {
            const next = this._queue.shift();
            if (!next)
                break;
            const { cmd, payload } = next;
            const buf = buildChatPacket(cmd, payload);
            if (typeof this._dispatch === 'function')
                this._dispatch(buf);
            this.emit('hwCommand', { cmd, payload, buffer: buf });
        }
    }
    // ── Utilities ─────────────────────────────────────────────────────────────
    getMessages() {
        return [...this._messages.values()].map((m) => m.toJSON());
    }
    getMessage(id) {
        return this._messages.get(id)?.toJSON() || null;
    }
    getUnreadCount(lastReadAt) {
        return this.getMessages().filter((m) => m.timestamp > lastReadAt && m.senderId !== this.userId).length;
    }
}
exports.Chat = Chat;
Chat.CMD = CHAT_CMD;
Chat.MSG_STATUS = MSG_STATUS;
Chat.Message = Message;
exports.default = Chat;
//# sourceMappingURL=Chat.js.map