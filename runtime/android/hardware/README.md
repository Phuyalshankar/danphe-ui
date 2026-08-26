# 🔌 Dolphin Native Hardware Bridges (`runtime/android/hardware`)

The **Hardware Bridges** module exposes native Android hardware APIs directly to Dolphin action dispatchers with zero JS bridge overhead.

---

## 📂 Hardware Modules

| Hardware Feature | Dispatcher Action | Class |
|---|---|---|
| GPS Location | `hw:gps:get`, `hw:gps:watch` | `DolphinLocation.kt` |
| Camera & Flashlight | `hw:camera:capture`, `hw:flashlight:toggle` | `DolphinCamera.kt`, `DolphinFlashlight.kt` |
| Battery Status | `hw:battery` | `DolphinBattery.kt` |
| Haptic Feedback | `hw:haptics:vibrate` | `DolphinHaptics.kt` |
| Sensors | `hw:sensor:accel`, `hw:sensor:gyro` | `DolphinSensors.kt` |
| Bluetooth & NFC | `hw:bluetooth:scan`, `hw:nfc:read` | `DolphinBluetooth.kt`, `DolphinNFC.kt` |
| Audio & Call Simulation | `hw:audio:play`, `hw:call:simulate` | `DolphinAudio.kt`, `DolphinPhone.kt` |
| Database & Local Storage | `hw:db:query`, `hw:storage:set` | `DolphinDatabase.kt`, `DolphinStorage.kt` |
| WebRTC & P2P | `hw:webrtc:connect`, `hw:p2p:send` | `DolphinWebRTCCall.kt`, `DolphinP2PTransfer.kt` |

---

## 💻 Dispatcher Flow

```kotlin
// Dispatch hardware action directly from View Factory
DolphinHardwareBridge.handleHardwareAction(context, "hw:gps:get", payload) { result ->
    // Handle native hardware result
}
```
