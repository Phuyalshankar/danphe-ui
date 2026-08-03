import { HWDescriptor } from './types';
/**
 * 🌊 DolphinJS Hardware — Phone / Calls
 */
export declare const Phone: {
    /** Make a direct call — requires CALL_PHONE permission */
    call: (number: string) => HWDescriptor<{
        number: string;
    }>;
    /** Open dialer with pre-filled number — no permission needed */
    dial: (number: string) => HWDescriptor<{
        number: string;
    }>;
    /** Get call logs — requires READ_CALL_LOG permission */
    getCallLogs: (limit?: number) => HWDescriptor<{
        limit: number;
    }>;
    /** Get carrier name */
    getCarrier: () => HWDescriptor<Record<string, never>>;
    /** Get SIM state: ready | absent | locked | unknown */
    getSimState: () => HWDescriptor<Record<string, never>>;
    /** Get device phone number (may return empty on modern Android) */
    getNumber: () => HWDescriptor<Record<string, never>>;
    _action: {
        call: (_n: string) => string;
        dial: (_n: string) => string;
        callLogs: string;
        carrier: string;
    };
};
export type PhoneModule = typeof Phone;
//# sourceMappingURL=Phone.d.ts.map