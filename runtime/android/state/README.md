# ⚡ Dolphin Native State Engine (`runtime/android/state`)

The **State Engine** (`DolphinStateEngine`) provides zero-JS, high-speed reactive state management (NanoStore pattern) for native Android views.

---

## 📂 Modular 3-Tier Architecture (< 1200 lines per file)

| File | Class / Object | Responsibility |
|---|---|---|
| [`DolphinStateEngine.kt`](file:///d:/dolphin-native-2/runtime/android/state/DolphinStateEngine.kt) | `DolphinStateEngine` | Core thread-safe reactive state store, subscriptions, main looper dispatcher, and action handler. |
| [`StateBinder.kt`](file:///d:/dolphin-native-2/runtime/android/state/StateBinder.kt) | `StateBinder` | View property binding execution (`TEXT`, `INPUT_VALUE`, `BG_SHADE`, `ALPHA`, `TEXT_SIZE`, `VISIBILITY`, `IMAGE`, `WIDTH`, `HEIGHT`, `PADDING`, `RADIUS`, `TRANSLATE_X/Y`, `SCALE`, `ROTATION`, `ELEVATION`). |
| [`StateHelpers.kt`](file:///d:/dolphin-native-2/runtime/android/state/StateHelpers.kt) | `StateHelpers` | Type coercions, double converters, layout dimension converters, DP converters, animation interpolators. |

---

## 🔒 Features & Performance

- **Thread-Safe Main Looper Dispatching**: UI view mutations run safely on Android's main UI thread.
- **Direct View Property Mutations**: Mutates view properties (`text`, `visibility`, `bgShade`, `scale`, `rotation`, `alpha`, `color`) on the main looper without full screen re-layout.
- **Reactive Navigation**: Intercepts `currentScreen` / `activeTab` state updates and triggers native screen switching.
- **Embedded Initial State**: Parses NanoStore JSON payloads embedded at the end of raw binary streams (`__DOLPHIN_INITIAL_STATE__:`).

---

## 💻 API Usage

```kotlin
// Set or update state value reactively
DolphinStateEngine.set("counter", 42)

// Bind view property to state key
DolphinStateEngine.bind(
    key = "counter",
    view = textView,
    property = DolphinStateEngine.Property.TEXT
)
```
