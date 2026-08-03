"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebRTC = void 0;
const protocol_1 = require("./protocol");
/**
 * 🌊 DolphinJS Hardware — WebRTC
 */
exports.WebRTC = {
    createPeer: (options = {}) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.WEBRTC_CREATE_PEER,
        params: {
            peerId: options.peerId || 'peer-' + Date.now(),
            iceServers: options.iceServers || [{ urls: 'stun:stun.l.google.com:19302' }],
            audio: options.audio !== false,
            video: options.video !== false,
        },
    }),
    offer: (peerId, sdp) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.WEBRTC_OFFER,
        params: { peerId, sdp },
    }),
    answer: (peerId, sdp) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.WEBRTC_ANSWER,
        params: { peerId, sdp },
    }),
    ice: (peerId, candidate) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.WEBRTC_ICE,
        params: { peerId, candidate },
    }),
    hangup: (peerId) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.WEBRTC_HANGUP,
        params: { peerId },
    }),
};
//# sourceMappingURL=WebRTC.js.map