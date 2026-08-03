import { HWDescriptor, VideoStartRecordingOptions } from './types';
/**
 * 🌊 DolphinJS Hardware — Video
 */
export declare const Video: {
    /** Open system video camera */
    openCamera: () => HWDescriptor<Record<string, never>>;
    /** Start recording video to device */
    startRecording: (options?: VideoStartRecordingOptions) => HWDescriptor<{
        quality: string;
        front: boolean;
    }>;
    stopRecording: () => HWDescriptor<Record<string, never>>;
    /** Play a video (opens external player) */
    play: (urlOrPath: string) => HWDescriptor<{
        src: string;
    }>;
    /** Get list of videos from device gallery */
    getGallery: (limit?: number) => HWDescriptor<{
        limit: number;
    }>;
    _action: {
        open: string;
        record: string;
        stop: string;
    };
};
export type VideoModule = typeof Video;
//# sourceMappingURL=Video.d.ts.map