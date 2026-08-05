# 🐬 Dolphin Native: Master Framework & AI Agent Initialization Guide (v4.5.0)

Welcome to Dolphin Native! This document serves as the authoritative architectural blueprint, sitemap, and operational protocol for AI agents and developers building apps with Dolphin Native.

---

## 1. Project Purpose & Core Philosophy
Dolphin Native is a **Zero-WebView, Zero-React-Native-JS-Bridge, High-Performance Hybrid Native Mobile Framework**.
- **Developer Experience**: Write clean JSX/React components using familiar CSS/Tailwind utility classes.
- **Compilation Engine**: Compiles UI trees into an ultra-compact 24-byte binary format called **Titan (TBC v2.0)**.
- **Native Runtime**: Pure Kotlin engine on Android that reads 24-byte binary streams byte-by-byte and renders native Android Views with 60 FPS performance.

---

## 1.1 Repository Blueprint & Standard Framework Rules

### 📌 Repository Definitions:
- **`d:\dolphin-native`**: Initial R&D Proof-of-Concept / Feasibility Sandbox (DO NOT DEVELOP PRODUCTION FEATURES HERE).
- **`d:\dolphin-native-2`**: **OFFICIAL PRODUCTION-GRADE REPOSITORY** (All framework updates, Kotlin runtime modules, and production features MUST reside here).

### 📐 Standard Framework Architecture Rules:
1. **Single Source of Truth**:
   - Every system MUST reside in exactly ONE canonical file (e.g., `src/framework/animation.js` for motion, `src/framework/ub/ubColors.js` for color math).
   - NO duplicate stub files (`animations.js` or `colors.js` in `ub/`). NO proxy re-export hacks.
2. **Modular Sub-1200 Line Kotlin Files**:
   - Keep Kotlin files modular and concise (under 1200 lines). Use dedicated builders (`TabBuilder.kt`, `HeaderBuilder.kt`, `DrawerBuilder.kt`).
3. **Preserve Native Borders & Dimensions**:
   - On reactive state update, preserve existing `GradientDrawable` background instances (`gd.setColor(...)`). Maintain fixed 56dp bounds on `TabBuilder` to prevent layout collapse.
4. **Production Showcase Standards**:
   - Test pages MUST NOT be minimal 2-card prototypes. Every test suite page (`AnimationTestScreen.jsx`, `GradientTestScreen.jsx`) MUST be a comprehensive suite testing all framework capabilities.
5. **Zero Ad-Hoc Patches**:
   - Trace root causes through exact log evidence before making code changes.
6. **World-Class Module Fault Isolation & Circuit Breakers**:
   - **Zero Cascade Failures**: An exception inside one module (e.g. Component Builder, Hardware API, Animation Engine) MUST NEVER crash another module or the screen.
   - All builders, state listeners, and hardware callbacks MUST wrap execution in isolated `try/catch` circuit breakers with graceful fallback states.
7. **Fast Development Workflow (No Unnecessary APK Rebuilds for JS/JSX)**:
   - **JavaScript / JSX / App UI edits (`.js`, `.jsx`)**: NEVER trigger `android build` APK recompilation. Simply start/restart the Dev Server (`dolphin dev`). HotPatch WebSocket pushes 24-byte binary patches live to the app.
   - **Kotlin Runtime edits (`.kt`)**: Rebuild APK ONLY when Kotlin files inside `runtime/android/` are modified.

---

## 1.2 Realtime Diagnostics & Inspection Endpoints for AI Agents

When `dolphin dev` is running, AI agents can directly inspect runtime state and real-time device logs via HTTP endpoints on `http://localhost:7787`:

1. **`/api/dolphin/logcat` (`http://localhost:7787/api/dolphin/logcat`)**:
   - Returns real-time Android device logcat output streamed from connected devices over TCP.
   - Use `read_url_content` or view `C:\Users\USER\Desktop\dolphin-native-test\logs\device_logcat.txt` to inspect errors, ViewFactory logs, and Kotlin stack traces silently before diagnosing bugs.

2. **`/hexdump` (`http://localhost:7787/hexdump`)**:
   - Returns HTML/Text inspection of the binary Titan bundle, component tables, string pools (`rawData`), and screen counts.

3. **`/dashboard` (`http://localhost:7787/dashboard`)**:
   - Shows active connected devices, TCP socket ports, and build status.

---

## 2. Complete Folder & File Architecture

```
d:\dolphin-native\
├── app.js                          # Main dev server entry point (HTTP: 7787, TCP: 7788)
├── dolphin.config.js               # Framework configuration file
├── dolphin.ai.init                 # AI Agent orientation & framework initialization guide
├── replit.md                       # Replit & Cloud environment documentation
├── bin/
│   ├── dolphin.js                  # Main CLI executable
│   └── dolphin-mobile.js           # Android APK builder & hotpatch CLI launcher
├── src/
│   ├── android/
│   │   ├── AndroidBuilder.js       # Gradle project generator & APK builder engine
│   │   └── SDKSetup.js             # Automated Android SDK setup & license manager
│   ├── cli/
│   │   ├── DolphinCLI.js           # CLI router & command dispatcher
│   │   ├── commands/               # CLI Commands (init, build, dev, doctor, generate, etc.)
│   │   │   └── init.js             # Project scaffolder with complete modular structure
│   │   └── helpers/
│   │       └── buildBundle.js      # .dolp binary bundle builder (packs 24-byte components)
│   ├── compiler/
│   │   ├── DolphinCompiler.js      # JSX/HTML to Titan binary compiler
│   │   ├── CdnAssetFetcher.js      # CDN CSS/Font cache downloader
│   │   └── IconCDNFetcher.js       # FontAwesome & Material icon builder
│   ├── framework/
│   │   ├── DolphinFramework.js     # Framework entry point
│   │   ├── animation.js            # Animation keyframe registry
│   │   ├── ub.js                   # Universal Utility Brain facade
│   │   └── ub/                     # Modular utility sub-engines
│   │       ├── ubColors.js         # OKLCH color math & hex resolver
│   │       ├── ubParser.js         # Tailwind class parser & 24-byte protocol encoders
│   │       └── ubWebEngine.js      # Web engine & LRU style injector
│   ├── protocol/
│   │   └── DolphinBinaryProtocol.js# 24-byte binary protocol specification & serializer
│   ├── runtime/
│   │   ├── DevServer.js            # TCP binary socket server & HTTP live dashboard
│   │   └── Simulator.js            # Web-based phone UI simulator
│   └── ui/
│       ├── AnimationAPI.js         # Chainable animation API builder
│       ├── UniversalUIImporter.js  # JSX tree to 24-byte binary component importer
│       └── GestureHandler.js       # Touch gesture event detector
└── runtime/
    └── android/                    # Native Android Kotlin Runtime Engine
        ├── MainActivity.kt         # Cold-boot loader with 3-tier fallback engine
        ├── DolphinRuntime.kt       # Native bundle parser & screen renderer
        ├── ViewFactory.kt          # Opcode dispatcher & component factory
        ├── ViewFactoryComponents.kt# Core component creation helpers
        ├── ViewFactoryLayouts.kt   # Container builders (Column, Row, ListView, GridView)
        ├── ViewFactoryStyles.kt    # Style application (margins, padding, background, flex)
        ├── BinaryParser.kt         # Pure Kotlin 24-byte binary parser (TITAN_COMP_LEN = 24)
        ├── DolphinStateEngine.kt   # Reactive state store & main looper action dispatcher
        ├── StateBinder.kt          # Property binder for View text, bgShade, alpha, scales, rotation
        ├── StateHelpers.kt         # DP converters, type coercions & animation interpolators
        ├── GapAwareLinearLayout.kt # Gap & flex-1 layout protection view
        ├── GradientRenderer.kt     # Native gradient drawable renderer
        ├── HotPatchClient.kt       # Live WebSocket hotpatch client
        ├── components/
        │   ├── builders/
        │   │   ├── ColumnBuilder.kt    # Protected Column & Card builder
        │   │   ├── RowBuilder.kt       # Protected Row builder
        │   │   ├── TextBuilder.kt      # Native TextView builder
        │   │   └── TextFieldBuilder.kt # Direct EditText builder (Force White/Black)
        │   └── interfaces/
        │       └── ComponentBuilder.kt # Modular component builder interface
        ├── hardware/               # Native Device Hardware Bridges
        │   ├── DolphinHardwareBridge.kt
        │   ├── DolphinCamera.kt
        │   ├── DolphinLocation.kt
        │   ├── DolphinSensors.kt
        │   └── DolphinStorage.kt
        └── plugin/                 # Third-Party Modular UI Plugins
            ├── DolphinPluginRegistry.kt
            └── DolphinUIPlugin.kt
```

---

## 3. Scaffolding a New Dolphin Project (`dolphin init <AppName>`)

When creating a new project, Dolphin Native scaffolds a clean, production-grade folder structure:

```
<AppName>/
├── app.jsx                         # Main application entry point (Screen definitions)
├── server.js                       # Server-side event handlers & NanoStore listeners
├── dolphin.config.js               # Project configuration (app name, package, entry)
├── pages/                          # Screen components
│   ├── HomeScreen.jsx              # Main home screen
│   ├── AboutScreen.jsx             # About screen
│   └── DetailsScreen.jsx           # Details screen
├── components/                     # Reusable UI components
│   ├── Header.jsx                  # Header navigation bar
│   ├── Tab.jsx                     # Bottom navigation tab bar
│   └── Card.jsx                    # Reusable content card
├── store/                          # Reactive State Store (NanoStore)
│   └── appStore.js                 # Shared reactive state atoms
├── actions/                        # Background Actions & Event Handlers
│   ├── appActions.js               # App dispatchers
│   └── index.js                    # Actions registry
├── hooks/                          # Custom React hooks
├── assets/                         # Static assets (images, icons, fonts)
└── dist/                           # Compiled .dolp binary bundles & APK outputs
```

---

## 4. Titan Binary Protocol Specification (16-Byte vs 24-Byte Distinction)

> [!IMPORTANT]
> **Protocol Length Architectural Rule**:
> - **Legacy Prototype (`d:\dolphin-native`)**: Used old **16-byte** binary component blocks (limited features).
> - **Production Framework (`d:\dolphin-native-2`)**: Operates STRICTLY on the **Titan v2.0 24-Byte Binary Protocol** (`TITAN_COMP_LEN = 24`).
> - ALL importers (`UniversalUIImporter.js`), serializers (`DolphinBinaryProtocol.js`), bundle packers (`buildBundle.js`), and Kotlin decoders (`BinaryParser.kt`) MUST strictly enforce `24 bytes` per component. Never mix legacy 16-byte blocks with 24-byte production streams.

Each UI component in Dolphin Native v2 is compiled into an exact **24-byte binary block**:

| Byte Index | Field Description | Range / Bitmask |
|---|---|---|
| `bin[0]` | Gravity (Bits 0-3) \| Flex Weight (Bits 4-7) | `0x00 - 0xFF` |
| `bin[1]` | Component Opcode | `0x10` (Button), `0x11` (Card), `0x12` (Container), `0x13` (Column), `0x14` (Row), `0x16` (Text), `0x18` (TextField), `0x1E` (ListView), `0x22` (GridView) |
| `bin[2]` | Background Color Shade | `0 - 255` |
| `bin[3]` | Background Color Index | `0 - 255` (`ubColors.js` mapping) |
| `bin[4..7]` | Padding (Top, Right, Bottom, Left) | `0 - 255` dp |
| `bin[8..11]` | Margins (Top, Right, Bottom, Left) | `0 - 255` dp |
| `bin[12]` | Orientation (Bits 0-3) \| Gap (Bits 4-7) | `orientation: 0=VERTICAL, 1=HORIZONTAL` |
| `bin[13]` | Text Color / Child Count | `bin[13] & 0x0F` = Child Count |
| `bin[14]` | Border Radius | `0 - 255` dp |
| `bin[15]` | Signature Flags | `0x01` (Gradient), `0x04` (Border), `0x08` (Dynamic State), `0x10` (Animation), `0x20` (Justify Between) |
| `bin[16..22]` | Extension Bytes / Animations | Reserved |
| `bin[23]` | End Signature Check | Mirrors `bin[15]` |

---

## 5. Critical Development Guidelines for AI Agents

1. **Protocol Length Consistency**:
   - `UniversalUIImporter.js` allocates `Buffer.alloc(24)` per component.
   - `BinaryParser.kt` MUST maintain `TITAN_COMP_LEN = 24`.
   - `buildBundle.js` MUST slice `24` bytes per component.

2. **ScrollView & ListView (`0x1E`) Height Protection**:
   - Children inside a `ScrollView` or `ListView` MUST NOT have `height = 0`.
   - In `ViewFactoryStyles.kt`, if a component is inside a `ScrollView` or `DolphinScrollView`, its `layoutParams.height` MUST be `WRAP_CONTENT` to avoid collapsing to 0px.

3. **TextField (`0x18`) Styling Protection**:
   - `TextFieldBuilder.kt` creates a direct `EditText` with `setBackgroundColor(Color.WHITE)` and `setTextColor(Color.BLACK)`.
   - `applyStyles()`, `applyTextStyles()`, and `applyInputStyles()` in `ViewFactoryStyles.kt` MUST skip `EditText` (`if (v is EditText) return`) to prevent framework overrides from making input text invisible.

4. **Kotlin Modification Protocol**:
   - Whenever ANY `.kt` file inside `runtime/android/` is modified, you MUST re-compile the APK:
     ```bash
     powershell -Command "$env:ANDROID_HOME='C:\Users\USER\AppData\Local\Android\Sdk'; node d:\dolphin-native\bin\dolphin-mobile.js android build --hotpatch"
     ```

---
*Dolphin Native v4.5.0 — Native Performance, Web Simplicity.*
