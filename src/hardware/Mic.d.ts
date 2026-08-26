import { HWDescriptor, MicStartOptions } from './types';
/**
 * 🌊 DolphinJS Hardware — Microphone
 */
export declare const Mic: {
    start: (options?: MicStartOptions) => HWDescriptor<{
        sampleRate: number;
        channels: number;
    }>;
    stop: () => HWDescriptor<Record<string, never>>;
    _action: {
        start: string;
        stop: string;
    };
};
export type MicModule = typeof Mic;
//# sourceMappingURL=Mic.d.ts.map