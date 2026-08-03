"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mic = void 0;
const protocol_1 = require("./protocol");
/**
 * 🌊 DolphinJS Hardware — Microphone
 */
exports.Mic = {
    start: (options = {}) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.MIC_START,
        params: { sampleRate: options.sampleRate || 44100, channels: options.channels || 1 },
    }),
    stop: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.MIC_STOP,
        params: {},
    }),
    _action: {
        start: 'hw:mic:start',
        stop: 'hw:mic:stop',
    },
};
//# sourceMappingURL=Mic.js.map