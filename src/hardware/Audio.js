"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audio = void 0;
const protocol_1 = require("./protocol");
/**
 * 🌊 DolphinJS Hardware — Audio Playback
 */
exports.Audio = {
    /** Play audio from URL or local file path */
    play: (urlOrPath, options = {}) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.AUDIO_PLAY,
        params: { src: urlOrPath, loop: options.loop || false },
    }),
    stop: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.AUDIO_STOP,
        params: {},
    }),
    pause: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.AUDIO_PAUSE,
        params: {},
    }),
    /** Set volume 0–100 */
    setVolume: (level) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.AUDIO_VOLUME,
        params: { level },
    }),
    /** Get list of audio files from device storage */
    getLibrary: (limit = 100) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.AUDIO_FILES,
        params: { limit },
    }),
    _action: {
        // original ignores its `url` argument — preserved as-is
        play: (_url) => 'hw:audio:play',
        stop: 'hw:audio:stop',
        pause: 'hw:audio:pause',
    },
};
//# sourceMappingURL=Audio.js.map