import { HWDescriptor } from './types';
/**
 * 🌊 DolphinJS Hardware — Bluetooth
 */
export declare const Bluetooth: {
    scan: (duration?: number) => HWDescriptor<{
        duration: number;
    }>;
    connect: (address: string) => HWDescriptor<{
        address: string;
    }>;
    send: (address: string, data: unknown) => HWDescriptor<{
        address: string;
        data: unknown;
    }>;
    disconnect: (address: string) => HWDescriptor<{
        address: string;
    }>;
    getStatus: () => HWDescriptor<Record<string, never>>;
};
export type BluetoothModule = typeof Bluetooth;
//# sourceMappingURL=Bluetooth.d.ts.map