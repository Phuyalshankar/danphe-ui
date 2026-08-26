"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMS = void 0;
const protocol_1 = require("./protocol");
/**
 * 🌊 DolphinJS Hardware — SMS
 */
exports.SMS = {
    /** Send SMS directly — requires SEND_SMS permission */
    send: (to, body) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SMS_SEND,
        params: { to, body },
    }),
    /** Open system SMS composer — no permission needed */
    compose: (to, body = '') => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SMS_COMPOSE,
        params: { to, body },
    }),
    /** Read inbox — requires READ_SMS permission */
    getInbox: (limit = 50) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SMS_INBOX,
        params: { limit },
    }),
    /** Read sent — requires READ_SMS permission */
    getSent: (limit = 50) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SMS_SENT,
        params: { limit },
    }),
    _action: {
        inbox: 'hw:sms:inbox',
        sent: 'hw:sms:sent',
    },
};
//# sourceMappingURL=SMS.js.map