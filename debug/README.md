# 🛠️ Titan Native 2 — Debug & 1-Second Inspection Suite

This folder contains the dedicated diagnostic, testing, and CSS/Kotlin verification suite for **Dolphin Native 2 / Danphe-2**.

---

## 📁 Architecture & File Layout

1. **`debug/index.js`**:
   - Master CLI runner that audits entire JSX files and all child nodes in `< 0.2` seconds.
   - Usage:
     ```bash
     node debug/index.js d:/dolphin-pbx/app/components/AppBar.jsx
     node debug/index.js d:/dolphin-pbx/app/pages/ActiveCallScreen.jsx
     ```
2. **`debug/TitanKotlinSimulator.js`**:
   - Full JavaScript mirror of Android Kotlin Runtime (`ViewFactoryStyles.kt`, `ColorParser.kt`, `BorderApplier.kt`, `TextBuilder.kt`, `RowBuilder.kt`, `ColumnBuilder.kt`, `LayoutHelper.kt`).
   - Decodes 24-byte opcodes and simulates exact native Android View properties.
3. **`debug/CssComparator.js`**:
   - 3-Way Comparator: `JSX ClassName` ➔ `UniversalUIImporter.js 24-byte Opcode` ➔ `Kotlin Applied Styles`.
   - Automatically detects padding mismatches, radius anomalies, and opacity slash warnings.
4. **`debug/test_appbar.js`**:
   - Dedicated unit test harness for `AppBar.jsx`.
5. **`runtime/android/debug/`**:
   - `TitanTraceLogger.kt`: High-performance native Android logger formatting opcode executions.
   - `DebugConfig.kt`: Global master switch (`ENABLE_TRACE = true/false`) with zero overhead in production.

---

## 🚀 How to Run the Debugger

### Run single file audit:
```bash
node debug/index.js <path-to-file.jsx>
```

### Run AppBar test harness:
```bash
node debug/test_appbar.js
```
