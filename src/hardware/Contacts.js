"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contacts = void 0;
const protocol_1 = require("./protocol");
/**
 * 🌊 DolphinJS Hardware — Contacts
 */
exports.Contacts = {
    /** Get all contacts — requires READ_CONTACTS permission */
    getAll: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.CONTACTS_GET,
        params: {},
    }),
    /** Search contacts by name */
    search: (query) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.CONTACTS_SEARCH,
        params: { query },
    }),
    _action: {
        list: 'hw:contacts:list',
    },
};
//# sourceMappingURL=Contacts.js.map