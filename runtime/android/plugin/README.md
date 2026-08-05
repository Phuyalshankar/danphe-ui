# 🔌 Dolphin Native Plugin System (`runtime/android/plugin`)

The **Plugin System** enables third-party and custom component extensions to register native views with the Dolphin ViewFactory seamlessly.

---

## 📂 Registered Plugins

| Plugin | Opcode | Description |
|---|---|---|
| `VideoPlayerPlugin` | `0x50` | Native ExoPlayer video playback container. |
| `WebRTCAudioPlugin` | `0x38` | Real-time WebRTC audio streaming plugin. |
| `CalendarPlugin` | Custom | Native Material calendar view extension. |

---

## 💻 Registering a Plugin

```kotlin
DolphinPluginRegistry.register(VideoPlayerPlugin())
```
