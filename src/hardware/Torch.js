"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Torch = void 0;
const protocol_1 = require("./protocol");
/**
 * 🌊 DolphinJS Hardware — Torch
 */
exports.Torch = {
    on: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.TORCH_ON,
        params: {},
    }),
    off: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.TORCH_OFF,
        params: {},
    }),
    _action: {
        on: 'hw:flashlight:on',
        off: 'hw:flashlight:off',
    },
};
//# sourceMappingURL=Torch.js.map