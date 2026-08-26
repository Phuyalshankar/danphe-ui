import { HWDescriptor, AudioPlayOptions } from './types';
/**
 * 🌊 DolphinJS Hardware — Audio Playback
 */
export declare const Audio: {
    /** Play audio from URL or local file path */
    play: (urlOrPath: string, options?: AudioPlayOptions) => HWDescriptor<{
        src: string;
        loop: boolean;
    }>;
    stop: () => HWDescriptor<Record<string, never>>;
    pause: () => HWDescriptor<Record<string, never>>;
    /** Set volume 0–100 */
    setVolume: (level: number) => HWDescriptor<{
        level: number;
    }>;
    /** Get list of audio files from device storage */
    getLibrary: (limit?: number) => HWDescriptor<{
        limit: number;
    }>;
    _action: {
        play: (_url: string) => string;
        stop: string;
        pause: string;
    };
};
export type AudioModule = typeof Audio;
//# sourceMappingURL=Audio.d.ts.map