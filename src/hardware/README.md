# 🔌 Dolphin JS Hardware API Engine (`src/hardware`)

The **Dolphin Hardware API Engine** provides declarative, zero-overhead hardware descriptors for native device API access (GPS, Camera, Sensors, Bluetooth, NFC, WebRTC, Storage, Haptics, Audio, Video, etc.).

All hardware calls produce standard binary action descriptors (`_hw: true`, `cmd`, `params`, `_action`) that map directly to native Android and iOS runtime dispatchers (`hw:domain:action`).

---

## 📂 Exported Hardware Modules

| Module | Command Action | Description |
|---|---|---|
| `GPS` | `hw:gps:get`, `hw:gps:watch` | High-accuracy GPS location retrieval and position tracking. |
| `Camera` | `hw:camera:capture` | Native camera photo capture & gallery picker. |
| `Phone` | `hw:phone:call`, `hw:phone:contacts` | Native phone call dialing and contact list access. |
| `SMS` | `hw:sms:send` | Native SMS message sending. |
| `Contacts` | `hw:contacts:get` | Device address book contact listing. |
| `Audio` | `hw:audio:play`, `hw:audio:record` | Audio playback and background streaming. |
| `Mic` | `hw:mic:record` | Microphone audio recording. |
| `Video` | `hw:video:play` | Native video playback container and stream controls. |
| `Storage` | `hw:storage:set`, `hw:storage:get` | Key-value persistent storage and file system I/O. |
| `Fetch` | `hw:fetch:request` | Native background HTTP/HTTPS network requests. |
| `Sensor` | `hw:sensor:accel`, `hw:sensor:gyro` | Accelerometer, Gyroscope, Magnetometer, Barometer, Light, and Proximity. |
| `Battery` | `hw:battery:status` | Device battery percentage and charging status. |
| `Device` | `hw:device:info` | Device hardware specs, OS version, UUID, and display metrics. |
| `WebRTC` | `hw:webrtc:connect` | Real-time audio/video WebRTC peer connection management. |
| `Bluetooth` | `hw:bluetooth:scan` | BLE device scanning, pairing, and characteristic read/write. |
| `NFC` | `hw:nfc:read` | NFC tag reading and NDEF payload parsing. |
| `Haptic` | `hw:haptics:vibrate` | Tactical haptic feedback vibration patterns. |
| `Torch` | `hw:torch:toggle` | Camera LED flashlight toggle. |
| `Clipboard` | `hw:clipboard:set` | System clipboard text read and write. |

---

## 💻 Usage Example

```js
import { GPS, Camera, Haptic, Battery } from 'dolphin-hardware';

// Get high-accuracy GPS position
const locationDescriptor = GPS.getLocation({ accuracy: 'high' });

// Trigger haptic vibration
const hapticDescriptor = Haptic.vibrate('impactMedium');

// Get battery status
const batteryDescriptor = Battery.getStatus();
```
