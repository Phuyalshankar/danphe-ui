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
import HttpCall from './HttpCall';
import VideoCall from './VideoCall';
import Chat from './Chat';
import Meeting from './Meeting';
import Group from './Group';
import type { ChatConfig, GroupConfig, HttpCallConfig, MeetingConfig, VideoCallConfig } from './types';
declare const Intercom: {
    HttpCall: typeof HttpCall;
    VideoCall: typeof VideoCall;
    Chat: typeof Chat;
    Meeting: typeof Meeting;
    Group: typeof Group;
    version: string;
    /**
     * Create a pre-configured HTTP client
     */
    createHttpClient: (config?: HttpCallConfig) => HttpCall;
    /**
     * Create a 1:1 video call
     */
    createVideoCall: (peerId: string, opts?: Omit<VideoCallConfig, "peerId">) => VideoCall;
    /**
     * Create and connect a chat room
     */
    createChat: (userId: string, roomId: string, opts?: Omit<ChatConfig, "userId" | "roomId">) => Chat;
    /**
     * Create and start a meeting
     */
    createMeeting: (config?: MeetingConfig) => Meeting;
    /**
     * Create a group/channel
     */
    createGroup: (name: string, createdBy: string, opts?: Omit<GroupConfig, "name" | "createdBy">) => Group;
};
export default Intercom;
export { Intercom, HttpCall, VideoCall, Chat, Meeting, Group };
export * from './types';
//# sourceMappingURL=index.d.ts.map