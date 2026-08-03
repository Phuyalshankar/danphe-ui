import { HWDescriptor } from './types';
/**
 * 🌊 DolphinJS Hardware — Battery
 */
export declare const Battery: {
    /** Get current battery level and charging state */
    getStatus: () => HWDescriptor<Record<string, never>>;
    /** Watch battery changes */
    watch: (interval?: number) => HWDescriptor<{
        interval: number;
    }>;
    _action: {
        status: string;
    };
};
export type BatteryModule = typeof Battery;
//# sourceMappingURL=Battery.d.ts.map