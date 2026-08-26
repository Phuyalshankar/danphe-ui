"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
const protocol_1 = require("./protocol");
/**
 * 🌊 DolphinJS Hardware — Camera
 */
exports.Camera = {
    takePicture: (options = {}) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.CAMERA_TAKE_PHOTO,
        params: { quality: options.quality || 90, facing: options.facing || 'back' },
    }),
    open: (facing = 'back') => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.CAMERA_OPEN,
        params: { facing, flash: 'auto' },
    }),
    close: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.CAMERA_CLOSE,
        params: {},
    }),
    switchFace: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.CAMERA_SWITCH,
        params: {},
    }),
    startVideo: (o = {}) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.CAMERA_START_VIDEO,
        params: o,
    }),
    stopVideo: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.CAMERA_STOP_VIDEO,
        params: {},
    }),
    // Action-based (for use with onAction handlers)
    _action: {
        open: 'hw:camera:open',
        takePhoto: 'hw:camera:take_photo',
    },
};
//# sourceMappingURL=Camera.js.map