import { HWDescriptor, GetLocationOptions, GPSWatchOptions } from './types';
/**
 * 🌊 DolphinJS Hardware — GPS / Location
 */
export declare const GPS: {
    /** { lat, lng, accuracy, altitude, speed, bearing, timestamp } */
    getLocation: (options?: GetLocationOptions) => HWDescriptor<{
        accuracy: string;
        timeout: number;
    }>;
    watch: (options?: GPSWatchOptions) => HWDescriptor<{
        interval: number;
        accuracy: string;
    }>;
    stop: () => HWDescriptor<Record<string, never>>;
    _action: {
        get: string;
        watch: string;
        stop: string;
    };
};
export type GPSModule = typeof GPS;
//# sourceMappingURL=GPS.d.ts.map