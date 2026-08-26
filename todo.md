# 📝 Dolphin Native: Framework Evolution, History & Standard Architecture Rules

## 1. Framework History & Repository Relationship

- **`d:\dolphin-native` (Prototype & Feasibility Sandbox)**:
  - Initial R&D sandbox created to test the feasibility of a Zero-WebView 24-byte binary native mobile runtime.
  - Used purely for initial experiments and exploratory proof-of-concept testing.

- **`d:\dolphin-native-2` (Official Production Framework)**:
  - The **OFFICIAL PRODUCTION-GRADE REPOSITORY** evolved from the prototype.
  - All framework development, compiler optimizations, native Kotlin runtime modules, and production app implementations MUST reside in `d:\dolphin-native-2`.

---

## 2. History of Past Build Issues & Empirical Lessons Learned

1. **Class Structure & Method Duplication**:
   - *Issue*: `DolphinRuntime.kt` suffered method duplication (`buildErrorView` pasted inside another block) leading to Kotlin compiler brace mismatched errors.
   - *Fix & Lesson*: Maintain clean modular separation; view entire file boundaries before editing.

2. **Package Name Mismatch**:
   - *Issue*: `AndroidBuilder.js` referenced `io.dolphin.runtime.hardware.DolphinHardwareBridge` instead of `io.dolphin.runtime.DolphinHardwareBridge`.
   - *Fix & Lesson*: Always verify package headers in Kotlin files before writing generated templates in `AndroidBuilder.js`.

3. **Method & Lambda Signature Alignment**:
   - *Issue*: `connectDevServer` lambda parameter type mismatched `((String, String) -> Unit)?`.
   - *Fix & Lesson*: Ensure exact function signature parity across caller (`MainActivity.kt`), framework (`DolphinRuntime.kt`), and client (`HotPatchClient.kt`).

4. **Regex Match Hijacking**:
   - *Issue*: `AnimationEngine.kt` checked `animStr.startsWith("animate-")` before checking specific animation names (`pulse`, `bounce`, `shake`, etc.), causing early returns.
   - *Fix & Lesson*: Always evaluate explicit utility names before falling back to generic property regex matchers.

5. **Duplicate Files Removal**:
   - *Issue*: Incomplete stubs `src/framework/ub/animations.js` and `src/framework/ub/colors.js` existed alongside `src/framework/animation.js` and `src/framework/ub/ubColors.js`.
   - *Fix & Lesson*: Eliminate redundant stubs; enforce a single canonical file per system.

---

## 3. Standard Framework Architectural Rules (Mandatory for AI & Developers)

1. **Rule 1: Single Source of Truth**:
   - Every system MUST reside in exactly ONE canonical file (e.g. `src/framework/animation.js` for motion, `src/framework/ub/ubColors.js` for color math).
   - NO duplicate stub files. NO proxy re-export hacks.

2. **Rule 2: Modular Sub-1200 Line Kotlin Files**:
   - Keep Kotlin files modular and concise (under 1200 lines).
   - Use dedicated component builders (e.g., `TabBuilder.kt`, `HeaderBuilder.kt`, `DrawerBuilder.kt`).

3. **Rule 3: Native Border & Layout Preservation**:
   - On reactive state update, preserve existing `GradientDrawable` background instances using `gd.setColor(...)` instead of replacing them with flat `ColorDrawable`s.
   - Keep TabBar bounds fixed (56dp) to prevent layout collapse.

4. **Rule 4: Production Showcase Standards**:
   - Test pages MUST NOT be minimal 2-card prototypes.
   - Every test suite page (e.g. `AnimationTestScreen.jsx`, `GradientTestScreen.jsx`) MUST be a comprehensive suite testing all framework capabilities.

5. **Rule 5: Zero Ad-Hoc Patches**:
   - Always trace root causes through exact Gradle/Kotlin log evidence before writing fixes.

6. **Rule 6: World-Class Module Fault Isolation & Circuit Breakers**:
   - **Zero Cascade Failures**: A failure or exception inside one specific module (e.g. Component Builder, Hardware API, Animation Engine, or Hardware Sensor Listener) MUST NEVER crash the rest of the application or screen.
   - **Local Circuit Breakers**: All component builders, state listeners, and hardware callbacks MUST wrap operations in isolated `try/catch` boundaries with graceful fallback views or default values.
   - **Independent Decoupled Execution**: If Module A (e.g., Animation Engine) throws an exception, Module B (UI Rendering), Module C (Hardware API), and Module D (NanoStore State) MUST continue executing at 60 FPS without interruption.

7. **Rule 7: Titan 24-Byte Protocol Standard (16-Byte Legacy vs 24-Byte Production)**:
   - **Legacy Prototype (`d:\dolphin-native`)**: Used old **16-byte** binary blocks.
   - **Production Framework (`d:\dolphin-native-2`)**: Operates STRICTLY on **24-byte Titan Binary Protocol** (`TITAN_COMP_LEN = 24`).
   - All modules (`UniversalUIImporter.js`, `DolphinBinaryProtocol.js`, `buildBundle.js`, `BinaryParser.kt`) MUST strictly enforce 24-byte alignment per component. Never use 16-byte blocks in production.

8. **Rule 8: Fast Development Workflow (No Unnecessary APK Rebuilds for JS/JSX)**:
   - **JavaScript / JSX / UI App Changes (`.js`, `.jsx`)**: NEVER run full `android build` APK compilation. Simply restart or run the Dev Server (`dolphin dev`) — the native app instantly receives live 24-byte binary patches via HotPatch WebSocket!
   - **Kotlin Runtime Changes (`.kt`)**: ONLY run `android build` when native Android Kotlin files inside `runtime/android/` are edited.

---

*Documented for Dolphin Native v4.5.0 Production Architecture.*
