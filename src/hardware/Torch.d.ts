import { HWDescriptor } from './types';
/**
 * 🌊 DolphinJS Hardware — Torch
 */
export declare const Torch: {
    on: () => HWDescriptor<Record<string, never>>;
    off: () => HWDescriptor<Record<string, never>>;
    _action: {
        on: string;
        off: string;
    };
};
export type TorchModule = typeof Torch;
//# sourceMappingURL=Torch.d.ts.map