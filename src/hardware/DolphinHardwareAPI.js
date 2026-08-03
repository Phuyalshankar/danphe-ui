"use strict";
/**
 * 🌊 DolphinJS — Full Hardware API v2.0
 *
 * Complete hardware access for DolphinJS apps.
 * All calls are serialized to binary via DolphinBinaryProtocol
 * and dispatched to the Android/iOS runtime.
 *
 * Usage:
 *   import { Camera, GPS, Phone, SMS, Fetch, Audio, Video,
 *            Contacts, Storage, Sensor, Battery, Bluetooth,
 *            NFC, Mic, Haptic, Torch, Clipboard, WebRTC } from 'dolphin-hardware';
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hardware = exports.DolphinHardware = void 0;
const Camera_1 = require("./Camera");
const GPS_1 = require("./GPS");
const Phone_1 = require("./Phone");
const SMS_1 = require("./SMS");
const Contacts_1 = require("./Contacts");
const Audio_1 = require("./Audio");
const Mic_1 = require("./Mic");
const Video_1 = require("./Video");
const Storage_1 = require("./Storage");
const Fetch_1 = require("./Fetch");
const Sensor_1 = require("./Sensor");
const Battery_1 = require("./Battery");
const Device_1 = require("./Device");
const WebRTC_1 = require("./WebRTC");
const Bluetooth_1 = require("./Bluetooth");
const NFC_1 = require("./NFC");
const Haptic_1 = require("./Haptic");
const Torch_1 = require("./Torch");
const Clipboard_1 = require("./Clipboard");
/**
 * Each domain module (Camera, GPS, Sensor, ...) is a stateless object of
 * descriptor-building functions — there's no per-instance state to hold,
 * which is why they live in their own files as plain consts rather than
 * class fields. `DolphinHardware` exists to preserve the original single
 * entry-point shape (`Hardware.Camera.takePicture()`, etc.) and the
 * `_callbacks` registry reserved for future dispatch wiring.
 */
class DolphinHardware {
    constructor() {
        this.Camera = Camera_1.Camera;
        this.GPS = GPS_1.GPS;
        this.Phone = Phone_1.Phone;
        this.SMS = SMS_1.SMS;
        this.Contacts = Contacts_1.Contacts;
        this.Audio = Audio_1.Audio;
        this.Mic = Mic_1.Mic;
        this.Video = Video_1.Video;
        this.Storage = Storage_1.Storage;
        this.File = Storage_1.File;
        this.Fetch = Fetch_1.Fetch;
        this.Sensor = Sensor_1.Sensor;
        this.Battery = Battery_1.Battery;
        this.Device = Device_1.Device;
        this.WebRTC = WebRTC_1.WebRTC;
        this.Bluetooth = Bluetooth_1.Bluetooth;
        this.NFC = NFC_1.NFC;
        this.Haptic = Haptic_1.Haptic;
        this.Torch = Torch_1.Torch;
        this.Clipboard = Clipboard_1.Clipboard;
        this._callbacks = new Map();
    }
    /** Reserved for future native → JS callback dispatch wiring (unused today, same as the original JS). */
    _getCallbackRegistry() {
        return this._callbacks;
    }
}
exports.DolphinHardware = DolphinHardware;
exports.Hardware = new DolphinHardware();

const protocol_1 = require("./protocol");
exports.HW_CMD = protocol_1.HW_CMD;
exports.HW_EVENT = protocol_1.HW_EVENT;
exports.buildHWCall = protocol_1.buildHWCall;
exports.parseHWEvent = protocol_1.parseHWEvent;

exports.Camera = exports.Hardware.Camera;
exports.GPS = exports.Hardware.GPS;
exports.Phone = exports.Hardware.Phone;
exports.SMS = exports.Hardware.SMS;
exports.Contacts = exports.Hardware.Contacts;
exports.Audio = exports.Hardware.Audio;
exports.Mic = exports.Hardware.Mic;
exports.Video = exports.Hardware.Video;
exports.Storage = exports.Hardware.Storage;
exports.File = exports.Hardware.File;
exports.Fetch = exports.Hardware.Fetch;
exports.Sensor = exports.Hardware.Sensor;
exports.Battery = exports.Hardware.Battery;
exports.Device = exports.Hardware.Device;
exports.WebRTC = exports.Hardware.WebRTC;
exports.Bluetooth = exports.Hardware.Bluetooth;
exports.NFC = exports.Hardware.NFC;
exports.Haptic = exports.Hardware.Haptic;
exports.Torch = exports.Hardware.Torch;
exports.Clipboard = exports.Hardware.Clipboard;
//# sourceMappingURL=DolphinHardwareAPI.js.map