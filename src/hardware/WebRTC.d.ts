import { HWDescriptor, CreatePeerOptions } from './types';
/**
 * 🌊 DolphinJS Hardware — WebRTC
 */
export declare const WebRTC: {
    createPeer: (options?: CreatePeerOptions) => HWDescriptor<{
        peerId: string;
        iceServers: unknown[];
        audio: boolean;
        video: boolean;
    }>;
    offer: (peerId: string, sdp: unknown) => HWDescriptor<{
        peerId: string;
        sdp: unknown;
    }>;
    answer: (peerId: string, sdp: unknown) => HWDescriptor<{
        peerId: string;
        sdp: unknown;
    }>;
    ice: (peerId: string, candidate: unknown) => HWDescriptor<{
        peerId: string;
        candidate: unknown;
    }>;
    hangup: (peerId: string) => HWDescriptor<{
        peerId: string;
    }>;
};
export type WebRTCModule = typeof WebRTC;
//# sourceMappingURL=WebRTC.d.ts.map