import { EventEmitter } from 'events';
import type { JoinOptions, MeetingConfig, MeetingInfo, MeetingState, ParticipantPublicInfo, ParticipantRole } from './types';
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
declare const MEETING_CMD: {
    readonly CREATE: 176;
    readonly JOIN: 177;
    readonly LEAVE: 178;
    readonly KICK: 179;
    readonly MUTE_ALL: 180;
    readonly SCREEN_SHARE: 181;
    readonly SCREEN_STOP: 182;
    readonly RECORD_START: 183;
    readonly RECORD_STOP: 184;
    readonly RAISE_HAND: 185;
    readonly LOWER_HAND: 186;
    readonly SET_ROLE: 187;
    readonly CHAT_MSG: 188;
    readonly REACTION: 189;
    readonly END: 191;
};
declare const PARTICIPANT_ROLE: Record<string, ParticipantRole>;
declare const MEETING_STATE: Record<string, MeetingState>;
declare class Meeting extends EventEmitter {
    meetingId: string;
    hostId: string | null;
    title: string;
    scheduledAt: number | null;
    maxParticipants: number;
    waitingRoom: boolean;
    audio: boolean;
    video: boolean;
    state: MeetingState;
    private _dispatch;
    private _participants;
    private _recording;
    private _screenShare;
    private _startedAt;
    constructor(config?: MeetingConfig);
    start(): this;
    end(): this;
    join(userId: string, opts?: JoinOptions): this;
    leave(userId: string): this;
    kick(userId: string, reason?: string): this;
    setRole(userId: string, role: ParticipantRole): this;
    muteAll(): this;
    mute(userId: string, muted?: boolean): this;
    startScreenShare(presenterId?: string | null): this;
    stopScreenShare(): this;
    startRecording(): this;
    stopRecording(): this;
    raiseHand(userId: string): this;
    lowerHand(userId: string): this;
    react(userId: string, emoji: string): this;
    sendChatMessage(userId: string, text: string): this;
    private _addParticipant;
    private _removeParticipant;
    private _send;
    getParticipants(): ParticipantPublicInfo[];
    getParticipant(id: string): ParticipantPublicInfo | null;
    getInfo(): MeetingInfo;
    static CMD: {
        readonly CREATE: 176;
        readonly JOIN: 177;
        readonly LEAVE: 178;
        readonly KICK: 179;
        readonly MUTE_ALL: 180;
        readonly SCREEN_SHARE: 181;
        readonly SCREEN_STOP: 182;
        readonly RECORD_START: 183;
        readonly RECORD_STOP: 184;
        readonly RAISE_HAND: 185;
        readonly LOWER_HAND: 186;
        readonly SET_ROLE: 187;
        readonly CHAT_MSG: 188;
        readonly REACTION: 189;
        readonly END: 191;
    };
    static ROLE: Record<string, ParticipantRole>;
    static STATE: Record<string, MeetingState>;
}
export default Meeting;
export { Meeting, MEETING_CMD, PARTICIPANT_ROLE, MEETING_STATE };
//# sourceMappingURL=Meeting.d.ts.map