import { HWDescriptor } from './types';
/**
 * 🌊 DolphinJS Hardware — Clipboard
 */
export declare const Clipboard: {
    write: (text: string) => HWDescriptor<{
        text: string;
    }>;
    read: () => HWDescriptor<Record<string, never>>;
};
export type ClipboardModule = typeof Clipboard;
//# sourceMappingURL=Clipboard.d.ts.map