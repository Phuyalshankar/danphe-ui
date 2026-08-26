import { HWDescriptor } from './types';
/**
 * 🌊 DolphinJS Hardware — Device
 */
export declare const Device: {
    info: () => HWDescriptor<Record<string, never>>;
    battery: () => HWDescriptor<Record<string, never>>;
};
export type DeviceModule = typeof Device;
//# sourceMappingURL=Device.d.ts.map