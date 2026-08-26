# 🐬 Dolphin Native 2 — Integration & Feature Expansion Guide (`integration.md`)

This guide provides an explicit step-by-step checklist of files to modify whenever adding new features to **Dolphin Native 2**.

---

## 📂 Architecture Map at a Glance

```
Dolphin Native 2 Pipeline:
[ JSX / React ] ➔ [ ubParser.js ] ➔ [ UniversalUIImporter.js (Titan Binary Protocol) ]
                                                │ (.dolp payload over HTTP/HotPatch)
                                                ▼
[ DolphinRuntime.kt ] ➔ [ BinaryParser.kt ] ➔ [ ViewFactory.kt ] ➔ [ Native Android Views ]
```

---

## 🛠️ Case 1: Adding a New UI Component (e.g. `VideoPlayer`, `DatePicker`)

When adding a brand new UI Component to Dolphin Native:

### 1. **JS Compiler Side**:
1. **`src/ui/ComponentOpcodeMapper.js`**:
   - Register a unique 8-bit Opcode (e.g. `0x30: 'VideoPlayer'`).
2. **`src/ui/UniversalUIImporter.js`**:
   - Add opcode resolution in `getTypeCode(type)`.
   - Add property serialization under `switch (typeCode)`:
     ```javascript
     case 0x30: // VideoPlayer: src, autoplay, controls
         stringPool.push(props.src || '');
         stringPool.push(props.autoplay ? '1' : '0');
         break;
     ```

### 2. **Kotlin Runtime Side**:
3. **`runtime/android/components/`**:
   - Create a dedicated Builder file (e.g. `VideoPlayerBuilder.kt`).
4. **`runtime/android/components/ViewFactoryComponents.kt`**:
   - Add component creation method (e.g. `fun ViewFactory.createVideoPlayer(bin: ByteArray): View`).
5. **`runtime/android/core/ViewFactory.kt`**:
   - Map Opcode `0x30` inside `buildComponent()`:
     ```kotlin
     0x30 -> createVideoPlayer(bin)
     ```

---

## 🎨 Case 2: Adding a New CSS Property or Tailwind Class (e.g. `backdrop-blur`, `aspect-ratio`)

When expanding Tailwind CSS capabilities:

### 1. **JS Compiler Side**:
1. **`src/framework/ub/ubParser.js`**:
   - Add regex pattern matching in `parseSingleClass(cls, styles)` (e.g. `cls.startsWith('backdrop-blur-')`).
2. **`src/ui/UniversalUIImporter.js`**:
   - Map style property to Titan 24-byte binary payload or style flags.

### 2. **Kotlin Runtime Side**:
3. **`runtime/android/css/ViewFactoryStyles.kt`**:
   - Read property flags/bytes and apply to Android View params:
     ```kotlin
     fun applyBackdropBlur(v: View, blurRadius: Float)
     ```

---

## 🎬 Case 3: Adding a New Native Animation (e.g. `animate-spin`, `animate-skew`)

When introducing a new native micro-animation:

### 1. **JS Compiler Side**:
1. **`src/framework/ub/ubParser.js`**:
   - Ensure `cls.startsWith('animate-')` extracts the animation name into `styles.animation`.
2. **`src/ui/UniversalUIImporter.js`**:
   - Verify Signature Bit `0x10` is set and animation string is pushed to `stringPool`.

### 2. **Kotlin Runtime Side**:
3. **`runtime/android/animation/KeyframeGenerator.kt`**:
   - Implement the `ViewPropertyAnimator` or `ObjectAnimator` function (e.g. `fun spin(v: View, dur: Long)`).
4. **`runtime/android/animation/AnimationFactory.kt`**:
   - Add name matching in `dispatchStringAnimation()`:
     ```kotlin
     cleanAnim.contains("spin") -> KeyframeGenerator.spin(v)
     ```

---

## 🔌 Case 4: Adding a New Hardware / Native Bridge API (e.g. `NFC`, `Biometrics`)

When creating new hardware capabilities:

### 1. **Kotlin Runtime Side**:
1. **`runtime/android/hardware/`**:
   - Create hardware implementation class (e.g. `DolphinNFC.kt`).
2. **`runtime/android/hardware/DolphinHardwareBridge.kt`**:
   - Register route handler in `executeHardwareCommand(action, params)`:
     ```kotlin
     "nfc:read" -> DolphinNFC.readTag(ctx, callback)
     ```

### 2. **JS SDK Side**:
3. **`src/hardware/`** or **`bootstrap.js`**:
   - Expose developer-friendly JS method:
     ```javascript
     Dolphin.hardware.nfc = { read: () => executeBridge('nfc:read') };
     ```

---

## ⚡ Case 5: Adding a New Reactive State Action (e.g. `action="toggleModal"`)

When adding built-in state actions:

1. **`runtime/android/state/DolphinStateEngine.kt`**:
   - Add action matching in `handleAction(action: String)`:
     ```kotlin
     if (cleanAct == "toggleModal") {
         updateState("modalVisible", !(state["modalVisible"] as? Boolean ?: false))
         return true
     }
     ```

---

## ✅ Integration Verification Checklist

Before submitting changes:
- [ ] Run `node bin/dolphin-mobile.js build` to ensure JS compiler bundles without binary offset mismatches.
- [ ] Run `node bin/dolphin-mobile.js android build` to compile Android APK via Gradle.
- [ ] Check `/api/dolphin/logcat` and `/hexdump` endpoints via `DevServer.js` to verify zero binary corruption.
- [ ] Update `ai.md` sitemap if new modules or files were introduced.
