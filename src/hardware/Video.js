"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const protocol_1 = require("./protocol");
/**
 * 🌊 DolphinJS Hardware — Video
 */
exports.Video = {
    /** Open system video camera */
    openCamera: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.VIDEO_OPEN_CAMERA,
        params: {},
    }),
    /** Start recording video to device */
    startRecording: (options = {}) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.VIDEO_RECORD,
        params: { quality: options.quality || 'hd', front: options.front || false },
    }),
    stopRecording: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.VIDEO_STOP,
        params: {},
    }),
    /** Play a video (opens external player) */
    play: (urlOrPath) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.VIDEO_PLAY,
        params: { src: urlOrPath },
    }),
    /** Get list of videos from device gallery */
    getGallery: (limit = 50) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.VIDEO_GALLERY,
        params: { limit },
    }),
    _action: {
        open: 'hw:video:open',
        record: 'hw:video:record',
        stop: 'hw:video:stop',
    },
};
//# sourceMappingURL=Video.js.map