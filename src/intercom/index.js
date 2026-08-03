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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = exports.Meeting = exports.Chat = exports.VideoCall = exports.HttpCall = exports.Intercom = void 0;
/**
 * 🌊 DolphinIntercom — Unified Intercom Module
 *
 * Communication primitives for Dolphin-native intercom apps:
 *   - HttpCall   → REST/HTTP API calls with binary dispatch
 *   - VideoCall  → WebRTC 1:1 video/audio calling
 *   - Chat       → Real-time messaging with media, reactions, receipts
 *   - Meeting    → Multi-party video meetings with roles & recording
 *   - Group      → Group/channel management with membership & invites
 *
 * Usage:
 *   import { Intercom } from 'dolphin-intercom';
 *   const call  = new Intercom.VideoCall({ peerId: 'u2' });
 *   const chat  = new Intercom.Chat({ userId: 'u1', roomId: 'room-1' });
 *   const group = new Intercom.Group({ name: 'Team', createdBy: 'u1' });
 *
 * Or named imports:
 *   import { HttpCall, VideoCall, Chat, Meeting, Group } from 'dolphin-intercom';
 */
const HttpCall_1 = __importDefault(require("./HttpCall"));
exports.HttpCall = HttpCall_1.default;
const VideoCall_1 = __importDefault(require("./VideoCall"));
exports.VideoCall = VideoCall_1.default;
const Chat_1 = __importDefault(require("./Chat"));
exports.Chat = Chat_1.default;
const Meeting_1 = __importDefault(require("./Meeting"));
exports.Meeting = Meeting_1.default;
const Group_1 = __importDefault(require("./Group"));
exports.Group = Group_1.default;
const Intercom = {
    HttpCall: HttpCall_1.default,
    VideoCall: VideoCall_1.default,
    Chat: Chat_1.default,
    Meeting: Meeting_1.default,
    Group: Group_1.default,
    version: '4.0.0',
    /**
     * Create a pre-configured HTTP client
     */
    createHttpClient: (config = {}) => new HttpCall_1.default(config),
    /**
     * Create a 1:1 video call
     */
    createVideoCall: (peerId, opts = {}) => new VideoCall_1.default({ peerId, ...opts }),
    /**
     * Create and connect a chat room
     */
    createChat: (userId, roomId, opts = {}) => {
        const chat = new Chat_1.default({ userId, roomId, ...opts });
        chat.connect();
        return chat;
    },
    /**
     * Create and start a meeting
     */
    createMeeting: (config = {}) => {
        const meeting = new Meeting_1.default(config);
        meeting.start();
        return meeting;
    },
    /**
     * Create a group/channel
     */
    createGroup: (name, createdBy, opts = {}) => {
        const group = new Group_1.default({ name, createdBy, ...opts });
        group.create();
        return group;
    },
};
exports.Intercom = Intercom;
exports.default = Intercom;
__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map