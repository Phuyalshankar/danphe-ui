import { HWDescriptor, HapticStyle } from './types';
/**
 * 🌊 DolphinJS Hardware — Haptics
 */
export declare const Haptic: {
    vibrate: (ms?: number) => HWDescriptor<{
        ms: number;
    }>;
    impact: (style?: HapticStyle) => HWDescriptor<{
        style: HapticStyle;
    }>;
    success: () => HWDescriptor<{
        style: string;
    }>;
    error: () => HWDescriptor<{
        style: string;
    }>;
    warning: () => HWDescriptor<{
        style: string;
    }>;
    _action: {
        light: string;
        medium: string;
        heavy: string;
    };
};
export type HapticModule = typeof Haptic;
//# sourceMappingURL=Haptic.d.ts.map