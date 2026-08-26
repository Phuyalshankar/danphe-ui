# 🤖 AI Maintenance & Extension Guidelines for Core Engine (`runtime/android/core`)

This document provides architectural rules, binary invariants, and context for AI Coding Assistants modifying or extending `runtime/android/core`.

---

## 🔒 Critical Invariants (DO NOT BREAK)

1. **24-Byte Binary Structure (`BinaryParser.kt`)**:
   - Each component is strictly 24 bytes (`TITAN_COMP_LEN = 24`).
   - Byte 0: Flags/Reserved
   - Byte 1: Component Opcode (`0x10` Button, `0x16` Text, `0x13` Column, etc.)
   - Byte 12: Orientation / Shade / Gap
   - Byte 13: Children Count / Color Code
   - Byte 14: Corner Radius
   - Byte 15 & 23: Signature flags (`sig`): Bit 0 (Gradient), Bit 2 (Border), Bit 3 (Dynamic Binding), Bit 4 (Animation)
   - Byte 16+: Pointer offset into String Pool (`rawData`)

2. **String Pool Alignment (`ViewFactory.kt`)**:
   - `buildComp()` MUST consume strings from `nextStr()` in the EXACT order emitted by `UniversalUIImporter.js`:
     `[sizeStr] -> [gradStr?] -> [borderStr?] -> [dynamicStr?] -> [animStr?] -> [builder-specific action/text strings]`

3. **View Tracking & Hotpatching**:
   - `viewMap` stores `globalOffset + compIdx` -> `View` instance.
   - `patchScreen()` in `BinaryParser.kt` performs **in-place** component byte replacement to prevent memory bloat and index misalignment.

---

## 🎯 Verification Rules
When modifying any file in `core/`:
- Verify binary opcode mappings in `ViewFactory.kt`.
- Run unit test: `runtime/android/core/tests/CoreEngineTest.kt`.
