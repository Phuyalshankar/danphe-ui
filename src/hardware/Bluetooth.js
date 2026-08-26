"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bluetooth = void 0;
const protocol_1 = require("./protocol");
/**
 * 🌊 DolphinJS Hardware — Bluetooth
 */
exports.Bluetooth = {
    scan: (duration = 10000) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.BT_SCAN,
        params: { duration },
    }),
    connect: (address) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.BT_CONNECT,
        params: { address },
    }),
    send: (address, data) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.BT_SEND,
        params: { address, data },
    }),
    disconnect: (address) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.BT_DISCONNECT,
        params: { address },
    }),
    getStatus: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.BT_STATUS,
        params: {},
    }),
};
//# sourceMappingURL=Bluetooth.js.map