import { HWDescriptor } from './types';
/**
 * 🌊 DolphinJS Hardware — NFC
 */
export declare const NFC: {
    read: () => HWDescriptor<Record<string, never>>;
    write: (data: unknown) => HWDescriptor<{
        data: unknown;
    }>;
    getStatus: () => HWDescriptor<Record<string, never>>;
};
export type NFCModule = typeof NFC;
//# sourceMappingURL=NFC.d.ts.map