# 🐬 Dolphin Native 2

**Zero-WebView, 100% Native Mobile & Embedded Framework**

Dolphin Native 2 compiles React JSX + Tailwind CSS directly into **24-Byte Titan Binary Opcodes** (.dolp) and executes natively on Android devices without any WebView or JavaScript runtime overhead.

## 🎯 Perfect For

### 📱 Mobile Android Apps
- Performance-critical applications
- Apps for low-end devices (1-2GB RAM)
- Battery-efficient applications
- Emerging markets (India, Nepal, Africa, SEA)

### 🖥️ Embedded Android Devices
- **Android TV Box** - IPTV, Smart TV interfaces
- **Android Watches** - Smartwatch, fitness trackers
- **Android Stereo** - Car entertainment, home audio systems
- **Self-Service Kiosks** - ATM, restaurant ordering, POS systems
- **Industrial IoT** - Factory control panels, warehouse scanners

## ⚡ Performance

```
Cold Start:        < 16ms (vs React Native 300-800ms)
State Updates:     < 1ms (Zero Bridge)
APK Size:          2-5 MB (vs React Native 25-50 MB)
RAM Usage:         < 35 MB (vs React Native 80-150 MB)
Scrolling:         60 FPS locked
Battery:           Minimal drain (native views)
```

## 🚀 Quick Start

### Installation

```bash
npm install -g dolphin-native
```

### Create New Project

```bash
dolphin create my-app
cd my-app
```

### Development with Hot Reload

```bash
dolphin-mobile dev
```

### Build APK

```bash
dolphin-mobile android build --hotpatch
```

### Install on Device

```bash
adb install -r dist/MyApp-1.0.0.apk
```

## 📖 Example Code

### Simple Counter App

```jsx
import { DolphinApp } from 'dolphin-native';

const app = new DolphinApp();

app.screen('home', () => `
  <screen className="flex flex-col items-center justify-center h-screen bg-blue-500">
    <text className="text-white text-6xl font-bold mb-8">
      [stateKey:count]
    </text>
    
    <button 
      className="bg-white text-blue-600 px-8 py-4 rounded-lg text-xl font-bold"
      action="increment">
      Increment
    </button>
  </screen>
`);

app.state('count', 0);

app.action('increment', () => {
  const current = parseInt(app.getState('count') || 0);
  app.state('count', current + 1);
});

app.start();
```

### Hardware Access

```jsx
// GPS Tracking
<button action="hw:gps:get">Get Location</button>
<text>[stateKey:sys_gps_lat], [stateKey:sys_gps_lng]</text>

// Camera
<button action="hw:camera:open">Take Photo</button>

// Sensors
<button action="hw:sensor:accel">Accelerometer</button>
<button action="hw:sensor:gyro">Gyroscope</button>

// Flashlight
<button action="hw:flashlight:toggle">Toggle Flash</button>

// Haptic Feedback
<button action="hw:haptic:medium">Vibrate</button>
```

## 🏗️ Architecture

```
[JSX/React Code] 
    ↓
[ubParser.js - Tailwind CSS Parser]
    ↓
[UniversalUIImporter.js - Binary Encoder]
    ↓
[.dolp Binary File] (24-byte opcodes)
    ↓
[DolphinRuntime.kt - Android Runtime]
    ↓
[BinaryParser.kt - 24-byte Decoder]
    ↓
[ViewFactory.kt - Native View Generator]
    ↓
[Android Native Views]
```

## 🔌 Hardware APIs

| API | Description |
|-----|-------------|
| `hw:battery` | Battery status & percentage |
| `hw:gps:get` / `hw:gps:watch` | GPS coordinates |
| `hw:sensor:accel` | 3-axis accelerometer |
| `hw:sensor:gyro` | Gyroscope |
| `hw:sensor:compass` | Compass heading |
| `hw:flashlight:toggle` | LED flashlight |
| `hw:haptic:light/medium/heavy` | Haptic vibration |
| `hw:camera:open` | Camera capture |
| `hw:mic:start` | Voice recorder |
| `hw:contacts:get` | Phone contacts |
| `hw:phone:dial` | Phone dialer |
| `hw:sms:compose` | SMS composer |

## 🎨 Styling with Tailwind CSS

Dolphin Native 2 supports Tailwind CSS classes directly:

```jsx
<div className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-600">
  <text className="text-white text-2xl font-bold mb-4">Hello World</text>
  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-xl">
    Click Me
  </button>
</div>
```

## 📦 Project Structure

```
my-app/
├── src/
│   ├── screens/       # App screens
│   ├── components/    # Reusable components
│   └── index.js       # Entry point
├── runtime/
│   └── android/       # Kotlin native runtime
├── dolphin.config.js  # Framework configuration
└── package.json
```

## 🛠️ Build Commands

```bash
# Development server with hot reload
dolphin-mobile dev

# Build binary (.dolp)
dolphin-mobile build --hotpatch

# Build Android APK
dolphin-mobile android build --hotpatch

# Clean build artifacts
dolphin-mobile clean
```

## 🔥 Why Dolphin Native 2?

### vs React Native
- ✅ 10x faster cold start
- ✅ 5x smaller APK size
- ✅ 50% less RAM usage
- ✅ Zero JavaScript bridge overhead
- ✅ Direct hardware access

### vs Flutter
- ✅ Smaller binary size
- ✅ True native Android views (not canvas)
- ✅ Better hardware integration
- ✅ Lower memory footprint

### vs Native Kotlin/Java
- ✅ 10x faster development
- ✅ Hot reload/HotPatch support
- ✅ Tailwind CSS styling (easier than XML)
- ✅ Web developers can contribute

## 📱 Supported Components

- Layout: `div`, `screen`, `card`, `column`, `row`, `grid`
- Text: `text`, `header`, `paragraph`
- Input: `textfield`, `checkbox`, `radio`, `select`, `slider`, `switch`
- Media: `image`, `video`, `camera`, `canvas`
- Navigation: `tab`, `nav`, `drawer`
- Lists: `listview`, `gridview`
- Form: Complete form validation engine

## 🌐 Live Development

Dolphin Native 2 supports **HotPatch** - live binary updates over TCP:

1. Start dev server: `dolphin-mobile dev`
2. Connect Android device to same network
3. Scan QR code in app
4. Changes stream instantly to device (no rebuild!)

## 📚 Documentation

- [Complete Documentation](./ai.md)
- [Integration Guide](./integration.md)
- [Hardware API Reference](./src/hardware/)
- [Component Reference](./runtime/android/components/)

## 🤝 Use Cases

### Production-Ready For:
- E-commerce apps (Daraz-style)
- Social media feeds (Instagram-style)
- Food delivery apps
- GPS tracking (taxi, delivery)
- Fitness & health monitoring
- Smart TV interfaces
- Kiosk systems (ATM, restaurant ordering)
- Industrial IoT control panels

## ⚠️ Known Limitations

- **Android Only** (iOS support planned for future)
- Canvas video rendering optimization in progress (CCTV/NVR video playback)
- npm installation refinement ongoing

## 🔧 Requirements

- Node.js >= 18.0.0
- Android SDK (for APK builds)
- ADB (for device installation)

## 📄 License

MIT License

## 👥 Contributing

Contributions welcome! This framework is perfect for:
- Embedded Android developers
- Performance-focused mobile apps
- IoT device interfaces
- Emerging market applications

---

**Dolphin Native 2** - Native Performance, Web Simplicity 🚀

*Perfect for Android apps and embedded devices that demand maximum performance with minimal overhead.*
