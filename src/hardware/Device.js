"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device = void 0;
const protocol_1 = require("./protocol");
const Battery_1 = require("./Battery");
/**
 * 🌊 DolphinJS Hardware — Device
 */
exports.Device = {
    info: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.DEVICE_INFO,
        params: {},
    }),
    battery: () => Battery_1.Battery.getStatus(),
};
//# sourceMappingURL=Device.js.map