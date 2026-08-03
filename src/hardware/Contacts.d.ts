import { HWDescriptor } from './types';
/**
 * 🌊 DolphinJS Hardware — Contacts
 */
export declare const Contacts: {
    /** Get all contacts — requires READ_CONTACTS permission */
    getAll: () => HWDescriptor<Record<string, never>>;
    /** Search contacts by name */
    search: (query: string) => HWDescriptor<{
        query: string;
    }>;
    _action: {
        list: string;
    };
};
export type ContactsModule = typeof Contacts;
//# sourceMappingURL=Contacts.d.ts.map