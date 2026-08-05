# 🐬 Dolphin Native Core Engine (`runtime/android/core`)

The **Core Engine** is the heart of the Dolphin Native Android Runtime. It parses pre-compiled binary bundles (`.dolp`) and instantiates zero-WebView, 100% native Android `View` trees at lightning speed.

---

## 📂 Included Components

| File | Class | Purpose |
|---|---|---|
| `BinaryParser.kt` | `BinaryParser` | Parses `.dolp` binary files, headers, component arrays, and string pools. |
| `DolphinRuntime.kt` | `DolphinRuntime` | Main entry point managing bundle loading, hotpatch lifecycle, and screen rendering. |
| `ViewFactory.kt` | `ViewFactory` | Master native UI builder mapping binary component opcodes to Android views. |

---

## 🚀 Usage Example

```kotlin
// Instantiate the runtime with application context
val runtime = DolphinRuntime(context)

// Load pre-compiled binary bundle from assets or disk
runtime.loadFromFile(File(filesDir, "app.dolp"))

// Render native screen hierarchy directly into Content View
val screenView = runtime.buildScreen("Home")
setContentView(screenView)
```

---

## ⚡ Key Responsibilities

1. **Zero-Overhead Parsing**: Reads 24-byte Titan component chunks without reflection or JSON overhead.
2. **Dynamic Hot-Reloading**: In-place component patching during development over TCP binary streams.
3. **Screen Navigation**: Ultra-fast native screen switching with anti-flicker protection.
