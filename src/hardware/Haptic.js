"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haptic = void 0;
const protocol_1 = require("./protocol");
/**
 * 🌊 DolphinJS Hardware — Haptics
 */
exports.Haptic = {
    vibrate: (ms = 100) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.VIBRATE,
        params: { ms },
    }),
    impact: (style = 'medium') => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.HAPTIC,
        params: { style },
    }),
    success: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.HAPTIC,
        params: { style: 'success' },
    }),
    error: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.HAPTIC,
        params: { style: 'error' },
    }),
    warning: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.HAPTIC,
        params: { style: 'warning' },
    }),
    _action: {
        light: 'hw:haptic:light',
        medium: 'hw:haptic:medium',
        heavy: 'hw:haptic:heavy',
    },
};
//# sourceMappingURL=Haptic.js.map