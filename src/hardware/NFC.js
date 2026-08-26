"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFC = void 0;
const protocol_1 = require("./protocol");
/**
 * 🌊 DolphinJS Hardware — NFC
 */
exports.NFC = {
    read: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.NFC_READ,
        params: {},
    }),
    write: (data) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.NFC_WRITE,
        params: { data },
    }),
    getStatus: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.NFC_STATUS,
        params: {},
    }),
};
//# sourceMappingURL=NFC.js.map