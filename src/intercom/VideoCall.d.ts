import { EventEmitter } from 'events';
import type { CallState, CallStats, VideoCallConfig } from './types';
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
declare const TITAN_CMD: {
    readonly INVITE: 16;
    readonly ACCEPT: 17;
    readonly REJECT: 18;
    readonly HANGUP: 19;
    readonly AUDIO_FRAME: 20;
    readonly VIDEO_FRAME: 21;
};
declare const CALL_STATE: Record<CallState, CallState>;
declare class VideoCall extends EventEmitter {
    callId: string;
    peerId: string | null;
    audio: boolean;
    video: boolean;
    state: CallState;
    private _dispatch;
    private _stats;
    constructor(config?: VideoCallConfig);
    private _setState;
    private _send;
    /**
     * Start an outgoing binary video call to target peer.
     */
    start(): Buffer;
    /**
     * Accept an incoming binary call.
     */
    answer(): Buffer;
    /**
     * Reject an incoming call.
     */
    reject(): Buffer;
    /**
     * End / hang up the binary call.
     */
    hangup(): Buffer | undefined;
    /** Mute/unmute local audio. */
    mute(muted?: boolean): void;
    /** Enable/disable local video. */
    setVideo(enabled?: boolean): void;
    /** Hold the call */
    hold(): void;
    /** Resume from hold */
    resume(): void;
    /** Call stats */
    getStats(): CallStats & {
        state: CallState;
        callId: string;
    };
    static STATE: Record<CallState, CallState>;
    static TITAN_CMD: {
        readonly INVITE: 16;
        readonly ACCEPT: 17;
        readonly REJECT: 18;
        readonly HANGUP: 19;
        readonly AUDIO_FRAME: 20;
        readonly VIDEO_FRAME: 21;
    };
}
export default VideoCall;
export { VideoCall, CALL_STATE, TITAN_CMD };
//# sourceMappingURL=VideoCall.d.ts.map