"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clipboard = void 0;
const protocol_1 = require("./protocol");
/**
 * 🌊 DolphinJS Hardware — Clipboard
 */
exports.Clipboard = {
    write: (text) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.CLIPBOARD_WRITE,
        params: { text },
    }),
    read: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.CLIPBOARD_READ,
        params: {},
    }),
};
//# sourceMappingURL=Clipboard.js.map