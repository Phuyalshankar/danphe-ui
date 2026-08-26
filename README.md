# 🌊 DolphinJS Native — Core Hybrid Framework (v2)

> 🚀 **Install directly from GitHub (One-Command Global Installation):**
> ```bash
> npm install -g git+https://github.com/Phuyalshankar/dolphin-native-2.git
> ```

> **Zero-WebView, 100% Native Mobile & Embedded Framework** — Write HTML `div` tags in Javascript/JSX, compile them to a 24-byte Titan binary format, and render genuine native Android Views. **No WebViews, no heavy JavaScript bridge overhead, and no Android Studio required.**

---

[![GitHub](https://img.shields.io/badge/GitHub-Phuyalshankar%2Fdolphin--native--2-blue?logo=github)](https://github.com/Phuyalshankar/dolphin-native-2)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)
[![Android](https://img.shields.io/badge/platform-Android-green.svg)](https://www.android.com/)

✅ Bootstrap • ✅ TailwindCSS • ✅ DolphinCSS — use any CSS class system you know!

---

## ✨ What is DolphinJS (Danphe-2)?

DolphinJS compiles your UI code via a **Direct 2-Stage Single-Pass Titan Pipeline** into an ultra-compact **24-byte Titan binary bytecode format** (`.dolp`) and streams it to Android devices over a low-latency TCP connection. Your app hot-reloads instantly on every save in `< 5ms` — no build step, no waiting.

```
┌─────────────────────────────────────────────────────────────┐
│  STAGE 1 (Compiler) : JSX ➔ TitanCompiler.js (Single Pass)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ 📡 (Titan 24-Byte Bytecode)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  STAGE 2 (Android)  : TitanEngine.kt (Atomic Native Paint)  │
└─────────────────────────────────────────────────────────────┘
```

* **Web Dashboard**: `http://localhost:7787/dashboard`
* **Live Hex Dump & Debugger**: `http://localhost:7787/hexdump`
* **Live TCP Hotpatch Port**: `7788`

---

## 🚀 Quick Start

```bash
# 1. Install globally directly from GitHub
npm install -g git+https://github.com/Phuyalshankar/dolphin-native-2.git

# 2. Create a new project
dolphin init MyApp
cd MyApp
npm install

# 3. Build APK (required before connecting device!)
dolphin build --android

# 4. Install APK on your connected Android device
adb install dist/NVR-Surveillance-1.0.0.apk

# 5. Forward ADB port
adb reverse tcp:9091 tcp:9091

# 6. Start hot-reload dev server
dolphin dev
```

---

## 📦 Installation Options

### Global Installation (CLI)

```bash
npm install -g git+https://github.com/Phuyalshankar/dolphin-native-2.git
```

Verify CLI installation:
```bash
dolphin --version
```

### Adding to an Existing Project

```bash
npm install git+https://github.com/Phuyalshankar/dolphin-native-2.git
```

Or add to `package.json`:
```json
{
  "dependencies": {
    "dolphin-native": "git+https://github.com/Phuyalshankar/dolphin-native-2.git"
  }
}
```

Then run:
```bash
npm install
```

---

## 🤖 AI Agent Guidelines (Mandatory Protocol)

> [!IMPORTANT]
> **Kotlin (`.kt`) File Modification Rule**:
> Whenever you modify any Kotlin file in `runtime/android/` (e.g. `ViewFactory.kt`, `DolphinStateEngine.kt`, `DolphinRuntime.kt`, `DolphinHardwareBridge.kt`), **you MUST immediately run**:
> ```bash
> dolphin build --android --hotpatch
> ```
> **Reason**: Hotpatching (`PATCH_SCREEN`) only updates dynamic JSX/Titan binary layouts. Native Kotlin code is compiled directly into the APK binary by Gradle. Updating `.kt` files requires an immediate APK rebuild so the Dashboard (`http://localhost:7787/dashboard`) and devices get the updated native engine code.

---

## 📱 Connect Android Device

> ⚠️ **Device connect (hot-reload) works ONLY after the Dolphin APK is built and installed on your device.**
> `dolphin dev` alone will NOT connect — the APK must be running on the phone first.

### First time setup (do this once per project):

```bash
# Step 1: Build the APK
dolphin build --android

# Step 2: Install it on your connected Android device via USB
adb install dist/NVR-Surveillance-1.0.0.apk

# Step 3: Forward the TCP port (run once per USB session)
adb reverse tcp:9091 tcp:9091

# Step 4: Start the hot-reload dev server
dolphin dev
```

After this, every time you save a `.jsx` file, the change is compiled to binary and pushed to your device instantly — no rebuild needed.

```bash
# Open developer dashboard
open http://localhost:7787
```
