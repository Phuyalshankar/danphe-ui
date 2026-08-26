# 🤖 Dolphin Native Android Runtime (Kotlin)

The `runtime/android` directory contains the high-performance pure Kotlin native runtime for Android devices.

## 🏛️ Sub-Modules & Builders Architecture

- **`core/`**:
  - `DolphinRuntime.kt`: Native bundle parser and screen navigation renderer.
  - `ViewFactory.kt`: Opcode dispatcher for native component creation.
  - `BinaryParser.kt`: Pure Kotlin 24-byte binary stream decoder.
- **`components/`**:
  - Modular native component builders (`TabBuilder.kt`, `HeaderBuilder.kt`, `DrawerBuilder.kt`, `ColumnBuilder.kt`, `TextBuilder.kt`).
- **`state/`**:
  - Decoupled NanoStore state engine (`DolphinStateEngine.kt`, `StateBinder.kt`, `StateHelpers.kt`).
- **`animation/`**:
  - Native animation interpolators (`AnimationEngine.kt`, `AnimationFactory.kt`).
- **`css/`**:
  - Native style appliers (`ViewFactoryStyles.kt`, `BorderApplier.kt`, `ThemeManager.kt`).
- **`hardware/`**:
  - Native device hardware bridges (Camera, Sensors, GPS, Storage, Bluetooth).
- **`utils/`**:
  - Live TCP hotpatch WebSocket client (`HotPatchClient.kt`).

## 🧪 Unit Testing

Unit tests for `runtime/android` reside in `./tests/`.
