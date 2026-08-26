"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPS = void 0;
const protocol_1 = require("./protocol");
/**
 * 🌊 DolphinJS Hardware — GPS / Location
 */
exports.GPS = {
    /** { lat, lng, accuracy, altitude, speed, bearing, timestamp } */
    getLocation: (options = {}) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.GPS_GET,
        params: { accuracy: options.accuracy || 'high', timeout: options.timeout || 10000 },
    }),
    watch: (options = {}) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.GPS_WATCH,
        params: { interval: options.interval || 1000, accuracy: options.accuracy || 'high' },
    }),
    stop: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.GPS_STOP,
        params: {},
    }),
    _action: {
        get: 'hw:gps:get',
        watch: 'hw:gps:watch',
        stop: 'hw:gps:stop',
    },
};
//# sourceMappingURL=GPS.js.map