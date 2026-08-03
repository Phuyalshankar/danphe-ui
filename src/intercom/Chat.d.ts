import { EventEmitter } from 'events';
import type { ChatConfig, ChatSendOptions, MessageConfig, MessageJSON, MessageStatus, MessageType } from './types';
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
declare const CHAT_CMD: {
    readonly SEND_TEXT: 208;
    readonly SEND_IMAGE: 209;
    readonly SEND_FILE: 210;
    readonly SEND_AUDIO: 211;
    readonly SEND_VIDEO: 212;
    readonly READ_RECEIPT: 213;
    readonly TYPING_START: 214;
    readonly TYPING_STOP: 215;
    readonly REACT: 216;
    readonly DELETE_MSG: 217;
    readonly EDIT_MSG: 218;
    readonly FETCH_HISTORY: 219;
};
declare const MSG_STATUS: Record<string, MessageStatus>;
declare class Message {
    id: string;
    roomId: string;
    senderId: string;
    type: MessageType;
    content: unknown;
    timestamp: number;
    status: MessageStatus;
    reactions: Record<string, number>;
    metadata: Record<string, unknown>;
    constructor({ id, roomId, senderId, type, content, timestamp, metadata }: MessageConfig);
    toJSON(): MessageJSON;
}
declare class Chat extends EventEmitter {
    userId: string;
    roomId: string;
    maxHistory: number;
    private _dispatch;
    private _messages;
    private _queue;
    private _connected;
    private _typing;
    private _typingTimer;
    constructor(config?: ChatConfig);
    connect(): this;
    disconnect(): this;
    send(content: unknown, opts?: ChatSendOptions): Message;
    sendImage(url: string, caption?: string): Message;
    sendAudio(url: string, durationMs?: number): Message;
    sendVideo(url: string, durationMs?: number, thumbnail?: string): Message;
    sendFile(url: string, filename: string, sizeBytes?: number): Message;
    private _sendMedia;
    receive(rawMsg: MessageConfig): Message;
    react(msgId: string, emoji: string): Buffer;
    deleteMessage(msgId: string): Buffer;
    editMessage(msgId: string, newContent: unknown): Buffer;
    fetchHistory(limit?: number, before?: number | string | null): Buffer;
    startTyping(): void;
    private _stopTyping;
    private _dispatch_;
    private _flushQueue;
    getMessages(): MessageJSON[];
    getMessage(id: string): MessageJSON | null;
    getUnreadCount(lastReadAt: number): number;
    static CMD: {
        readonly SEND_TEXT: 208;
        readonly SEND_IMAGE: 209;
        readonly SEND_FILE: 210;
        readonly SEND_AUDIO: 211;
        readonly SEND_VIDEO: 212;
        readonly READ_RECEIPT: 213;
        readonly TYPING_START: 214;
        readonly TYPING_STOP: 215;
        readonly REACT: 216;
        readonly DELETE_MSG: 217;
        readonly EDIT_MSG: 218;
        readonly FETCH_HISTORY: 219;
    };
    static MSG_STATUS: Record<string, MessageStatus>;
    static Message: typeof Message;
}
export default Chat;
export { Chat, Message, CHAT_CMD, MSG_STATUS };
//# sourceMappingURL=Chat.d.ts.map