"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Battery = void 0;
const protocol_1 = require("./protocol");
/**
 * 🌊 DolphinJS Hardware — Battery
 */
exports.Battery = {
    /** Get current battery level and charging state */
    getStatus: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.BATTERY_LEVEL,
        params: {},
    }),
    /** Watch battery changes */
    watch: (interval = 30000) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.BATTERY_WATCH,
        params: { interval },
    }),
    _action: {
        status: 'hw:battery',
    },
};
//# sourceMappingURL=Battery.js.map