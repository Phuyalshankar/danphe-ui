import { HWDescriptor } from './types';
/**
 * 🌊 DolphinJS Hardware — SMS
 */
export declare const SMS: {
    /** Send SMS directly — requires SEND_SMS permission */
    send: (to: string, body: string) => HWDescriptor<{
        to: string;
        body: string;
    }>;
    /** Open system SMS composer — no permission needed */
    compose: (to: string, body?: string) => HWDescriptor<{
        to: string;
        body: string;
    }>;
    /** Read inbox — requires READ_SMS permission */
    getInbox: (limit?: number) => HWDescriptor<{
        limit: number;
    }>;
    /** Read sent — requires READ_SMS permission */
    getSent: (limit?: number) => HWDescriptor<{
        limit: number;
    }>;
    _action: {
        inbox: string;
        sent: string;
    };
};
export type SMSModule = typeof SMS;
//# sourceMappingURL=SMS.d.ts.map