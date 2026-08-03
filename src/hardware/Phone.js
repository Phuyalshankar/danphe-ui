"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phone = void 0;
const protocol_1 = require("./protocol");
/**
 * 🌊 DolphinJS Hardware — Phone / Calls
 */
exports.Phone = {
    /** Make a direct call — requires CALL_PHONE permission */
    call: (number) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.PHONE_CALL,
        params: { number },
    }),
    /** Open dialer with pre-filled number — no permission needed */
    dial: (number) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.PHONE_DIAL,
        params: { number },
    }),
    /** Get call logs — requires READ_CALL_LOG permission */
    getCallLogs: (limit = 50) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.PHONE_CALL_LOGS,
        params: { limit },
    }),
    /** Get carrier name */
    getCarrier: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.PHONE_CARRIER,
        params: {},
    }),
    /** Get SIM state: ready | absent | locked | unknown */
    getSimState: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.PHONE_SIM_STATE,
        params: {},
    }),
    /** Get device phone number (may return empty on modern Android) */
    getNumber: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.PHONE_NUMBER,
        params: {},
    }),
    _action: {
        // original ignores its `n` argument and always returns the same
        // literal — preserved as-is, not "fixed", per conversion policy.
        call: (_n) => `hw:phone:call`,
        dial: (_n) => `hw:phone:dial`,
        callLogs: 'hw:phone:callLogs',
        carrier: 'hw:phone:carrier',
    },
};
//# sourceMappingURL=Phone.js.map