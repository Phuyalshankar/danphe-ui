"use strict";
/**
 * 🌊 DolphinJS — Hardware Binary Protocol
 *
 * Command codes, event codes, and the binary framing used to talk to the
 * Android/iOS native runtime. None of these numbers or byte offsets may
 * change without breaking the native side — see ai.md.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HW_EVENT = exports.HW_CMD = void 0;
exports.buildHWCall = buildHWCall;
exports.parseHWEvent = parseHWEvent;
// ─── Binary Command Codes ─────────────────────────────────────────────────────
exports.HW_CMD = {
    // Camera
    CAMERA_OPEN: 0x20,
    CAMERA_CLOSE: 0x21,
    CAMERA_TAKE_PHOTO: 0x22,
    CAMERA_START_VIDEO: 0x23,
    CAMERA_STOP_VIDEO: 0x24,
    CAMERA_SWITCH: 0x25,
    // GPS / Location
    GPS_GET: 0x30,
    GPS_WATCH: 0x31,
    GPS_STOP: 0x32,
    // WebRTC
    WEBRTC_CREATE_PEER: 0x40,
    WEBRTC_OFFER: 0x41,
    WEBRTC_ANSWER: 0x42,
    WEBRTC_ICE: 0x43,
    WEBRTC_HANGUP: 0x44,
    WEBRTC_LOCAL_STREAM: 0x45,
    // Microphone / Recording
    MIC_START: 0x50,
    MIC_STOP: 0x51,
    // Sensors — complete set
    SENSOR_ACCEL: 0x60,
    SENSOR_GYRO: 0x61,
    SENSOR_COMPASS: 0x62,
    SENSOR_BARO: 0x63,
    SENSOR_LIGHT: 0x64,
    SENSOR_PROX: 0x65,
    SENSOR_ROTATION: 0x66,
    SENSOR_GRAVITY: 0x67,
    SENSOR_LINEAR_ACCEL: 0x68,
    SENSOR_STEPS: 0x69,
    SENSOR_TEMPERATURE: 0x6a,
    SENSOR_HUMIDITY: 0x6b,
    SENSOR_HEARTRATE: 0x6c,
    SENSOR_ORIENTATION: 0x6d,
    SENSOR_LIST: 0x6e,
    SENSOR_STOP: 0x6f,
    // Bluetooth
    BT_SCAN: 0x70,
    BT_CONNECT: 0x71,
    BT_SEND: 0x72,
    BT_DISCONNECT: 0x73,
    BT_STATUS: 0x74,
    // NFC
    NFC_READ: 0x80,
    NFC_WRITE: 0x81,
    NFC_STATUS: 0x82,
    // Haptics / Vibration
    VIBRATE: 0x90,
    HAPTIC: 0x91,
    // Torch
    TORCH_ON: 0xa0,
    TORCH_OFF: 0xa1,
    // Battery & Device
    BATTERY_LEVEL: 0xb0,
    DEVICE_INFO: 0xb1,
    BATTERY_WATCH: 0xb2,
    // Clipboard
    CLIPBOARD_WRITE: 0xc0,
    CLIPBOARD_READ: 0xc1,
    // File / Storage
    FILE_PICK: 0xd0,
    FILE_SAVE: 0xd1,
    FILE_READ: 0xd2,
    FILE_WRITE: 0xd3,
    FILE_DELETE: 0xd4,
    FILE_LIST: 0xd5,
    FILE_MKDIR: 0xd6,
    FILE_DIRS: 0xd7,
    GALLERY_IMAGES: 0xd8,
    GALLERY_VIDEOS: 0xd9,
    AUDIO_FILES: 0xda,
    // Phone / Calls
    PHONE_CALL: 0xe0,
    PHONE_DIAL: 0xe1,
    PHONE_CALL_LOGS: 0xe2,
    PHONE_CARRIER: 0xe3,
    PHONE_SIM_STATE: 0xe4,
    PHONE_NUMBER: 0xe5,
    // SMS
    SMS_SEND: 0xe8,
    SMS_COMPOSE: 0xe9,
    SMS_INBOX: 0xea,
    SMS_SENT: 0xeb,
    // Contacts
    CONTACTS_GET: 0xec,
    CONTACTS_SEARCH: 0xed,
    CONTACTS_ADD: 0xee,
    CONTACTS_UPDATE: 0xef,
    // Audio Playback
    AUDIO_PLAY: 0xf0,
    AUDIO_STOP: 0xf1,
    AUDIO_PAUSE: 0xf2,
    AUDIO_VOLUME: 0xf3,
    // Video Playback / Recording
    VIDEO_OPEN_CAMERA: 0xf4,
    VIDEO_RECORD: 0xf5,
    VIDEO_STOP: 0xf6,
    VIDEO_PLAY: 0xf7,
    VIDEO_GALLERY: 0xf8,
    // Fetch / HTTP
    FETCH_GET: 0xfa,
    FETCH_POST: 0xfb,
    FETCH_PUT: 0xfc,
    FETCH_PATCH: 0xfd,
    FETCH_DELETE: 0xfe,
};
// ─── Event Codes (device → dev server) ───────────────────────────────────────
exports.HW_EVENT = {
    CAMERA_PHOTO_READY: 0x20,
    CAMERA_FRAME: 0x21,
    GPS_UPDATE: 0x30,
    GPS_ERROR: 0x31,
    WEBRTC_OFFER: 0x40,
    WEBRTC_ANSWER: 0x41,
    WEBRTC_ICE: 0x42,
    WEBRTC_CONNECTED: 0x43,
    WEBRTC_DISCONNECTED: 0x44,
    WEBRTC_FRAME: 0x45,
    MIC_DATA: 0x50,
    SENSOR_DATA: 0x60,
    BT_DEVICE: 0x70,
    BT_DATA: 0x72,
    NFC_TAG: 0x80,
    BATTERY_UPDATE: 0xb0,
    PHONE_STATE: 0xe0,
    SMS_RECEIVED: 0xe8,
    FETCH_RESPONSE: 0xfa,
    ERROR: 0xff,
};
// ─── Binary Message Helpers ───────────────────────────────────────────────────
function buildHWCall(cmd, params = {}) {
    const json = JSON.stringify(params);
    const jsonBuf = Buffer.from(json, 'utf8');
    const msg = Buffer.alloc(1 + 1 + 4 + jsonBuf.length);
    let off = 0;
    msg.writeUInt8(0x10, off++);
    msg.writeUInt8(cmd, off++);
    msg.writeUInt32LE(jsonBuf.length, off);
    off += 4;
    jsonBuf.copy(msg, off);
    return msg;
}
function parseHWEvent(buf) {
    if (buf.length < 6)
        throw new Error('HW event too short');
    const outerCmd = buf.readUInt8(0);
    const hwEvent = buf.readUInt8(1);
    const payLen = buf.readUInt32LE(2);
    const payload = buf.slice(6, 6 + payLen);
    let data = {};
    try {
        data = JSON.parse(payload.toString('utf8'));
    }
    catch {
        /* leave data as {} on parse failure, same as original */
    }
    return { outerCmd, event: hwEvent, data };
}
//# sourceMappingURL=protocol.js.map