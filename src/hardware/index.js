"use strict";
/**
 * 🌊 DolphinJS — Full Hardware API v2.0 (entry point)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHWEvent = exports.buildHWCall = exports.HW_EVENT = exports.HW_CMD = exports.Clipboard = exports.Torch = exports.Haptic = exports.NFC = exports.Bluetooth = exports.WebRTC = exports.Device = exports.Battery = exports.Sensor = exports.File = exports.Storage = exports.Fetch = exports.Video = exports.Mic = exports.Audio = exports.Contacts = exports.SMS = exports.Phone = exports.GPS = exports.Camera = exports.DolphinHardware = exports.Hardware = void 0;
const DolphinHardwareAPI_1 = require("./DolphinHardwareAPI");
Object.defineProperty(exports, "Hardware", { enumerable: true, get: function () { return DolphinHardwareAPI_1.Hardware; } });
Object.defineProperty(exports, "DolphinHardware", { enumerable: true, get: function () { return DolphinHardwareAPI_1.DolphinHardware; } });
const protocol_1 = require("./protocol");
Object.defineProperty(exports, "HW_CMD", { enumerable: true, get: function () { return protocol_1.HW_CMD; } });
Object.defineProperty(exports, "HW_EVENT", { enumerable: true, get: function () { return protocol_1.HW_EVENT; } });
Object.defineProperty(exports, "buildHWCall", { enumerable: true, get: function () { return protocol_1.buildHWCall; } });
Object.defineProperty(exports, "parseHWEvent", { enumerable: true, get: function () { return protocol_1.parseHWEvent; } });
exports.Camera = DolphinHardwareAPI_1.Hardware.Camera;
exports.GPS = DolphinHardwareAPI_1.Hardware.GPS;
exports.Phone = DolphinHardwareAPI_1.Hardware.Phone;
exports.SMS = DolphinHardwareAPI_1.Hardware.SMS;
exports.Contacts = DolphinHardwareAPI_1.Hardware.Contacts;
exports.Audio = DolphinHardwareAPI_1.Hardware.Audio;
exports.Mic = DolphinHardwareAPI_1.Hardware.Mic;
exports.Video = DolphinHardwareAPI_1.Hardware.Video;
exports.Fetch = DolphinHardwareAPI_1.Hardware.Fetch;
exports.Storage = DolphinHardwareAPI_1.Hardware.Storage;
exports.File = DolphinHardwareAPI_1.Hardware.File;
exports.Sensor = DolphinHardwareAPI_1.Hardware.Sensor;
exports.Battery = DolphinHardwareAPI_1.Hardware.Battery;
exports.Device = DolphinHardwareAPI_1.Hardware.Device;
exports.WebRTC = DolphinHardwareAPI_1.Hardware.WebRTC;
exports.Bluetooth = DolphinHardwareAPI_1.Hardware.Bluetooth;
exports.NFC = DolphinHardwareAPI_1.Hardware.NFC;
exports.Haptic = DolphinHardwareAPI_1.Hardware.Haptic;
exports.Torch = DolphinHardwareAPI_1.Hardware.Torch;
exports.Clipboard = DolphinHardwareAPI_1.Hardware.Clipboard;
// Default export mirrors `module.exports = { Hardware, Camera, ... }` from
// the original JS, so `const hw = require('dolphin-hardware')` and
// `hw.Camera.takePicture()` keep working unchanged.
exports.default = {
    Hardware: DolphinHardwareAPI_1.Hardware,
    Camera: exports.Camera,
    GPS: exports.GPS,
    Phone: exports.Phone,
    SMS: exports.SMS,
    Contacts: exports.Contacts,
    Audio: exports.Audio,
    Mic: exports.Mic,
    Video: exports.Video,
    Fetch: exports.Fetch,
    Storage: exports.Storage,
    File: exports.File,
    Sensor: exports.Sensor,
    Battery: exports.Battery,
    Device: exports.Device,
    WebRTC: exports.WebRTC,
    Bluetooth: exports.Bluetooth,
    NFC: exports.NFC,
    Haptic: exports.Haptic,
    Torch: exports.Torch,
    Clipboard: exports.Clipboard,
    HW_CMD: protocol_1.HW_CMD,
    HW_EVENT: protocol_1.HW_EVENT,
    buildHWCall: protocol_1.buildHWCall,
    parseHWEvent: protocol_1.parseHWEvent,
};
//# sourceMappingURL=index.js.map