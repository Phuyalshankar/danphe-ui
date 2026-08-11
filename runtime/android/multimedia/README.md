# 🎬 Dolphin Native — Multimedia Engine Architecture

Dedicated Multimedia Subsystem for handling Camera, Video Streaming, MP3 Audio, Microphone Recording, and Sound Synthesis.

---

## 📁 Package Structure (`io.dolphin.runtime.multimedia`)

| Component | Responsibility |
| :--- | :--- |
| **`DolphinCamera.kt`** | Embedded Camera Canvases (`<div type="cameraview">`), Lens Flip, Capture Snapshots, SurfaceHolder/TextureView rendering. |
| **`DolphinVideo.kt`** | MP4 Video Stream Player, Native System Camcorder Intent, Video Gallery Resolution. |
| **`DolphinAudio.kt`** | MP3 Online Audio Streaming, Sound Effects, Stop Controls, Audio Attributes. |
| **`DolphinMic.kt`** | Hardware Microphone Audio Recording, Audio Buffers. |
| **`DolphinRingtone.kt`** | Device System Ringtones, Alarm Sounds, Haptic Telemetry Integration. |
| **`VideoPlayerPlugin.kt`** | Native Layout Plugin for `<div type="videoplayer">` HTML5/JSX Canvas. |

---

## 🚀 Key Advantages

1. **Clean Separation of Concerns:** Decouples high-level Media & Audio/Video pipelines from low-level System Hardware (GPS, Battery, Bluetooth, NFC, Storage).
2. **Simplified Maintenance:** Single folder target (`runtime/android/multimedia/`) for modifying camera renders, audio streaming, or video decoders.
3. **Optimized Build Copying:** Clean automated sync in `AndroidBuilder.js` during APK compilation.
