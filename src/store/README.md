# ⚡ Dolphin NanoStore Engine (`src/store`)

The **NanoStore Engine** provides zero-JS, zero-overhead reactive state management for Dolphin Native applications, featuring real-time synchronization with Kotlin's 3-tier modular state engine (`DolphinStateEngine.kt`, `StateBinder.kt`, `StateHelpers.kt`).

---

## 📂 Key Architecture & Synchronization

| Component | Responsibility | Kotlin Native Counterpart |
|---|---|---|
| `DolphinNanoStore.js` | JS reactive state store, atom definitions, and broadcast patcher (`0x08 PATCH_STATE`). | `DolphinStateEngine.kt` |
| `StateExpressionParser.js` | Expression parser (`key:=value`, `key+=1`, `key!=toggle`) & initial state marker serializer (`__DOLPHIN_INITIAL_STATE__:`). | `DolphinStateEngine.handleAction()` |
| `BinStore.js` | High-performance binary state array store. | `StateBinder.apply()` |
| `defineStore.js` | Helper for creating modular reactive stores. | `DolphinStateEngine.declareIfAbsent()` |

---

## 🔒 Reactive Synchronization Protocol

```
JS NanoStore (set / setMany / setTemp)
  │
  ├──► Local JS Listeners
  └──► Titan DevBridge Opcode 0x08 (PATCH_STATE)
            │
            ▼
      Kotlin DolphinStateEngine.kt (Android Main Looper)
            │
            ├──► StateBinder.kt (Direct View Property Mutation - text, bgShade, alpha, scale, rotation, visibility)
            └──► Reactive Screen Navigation (currentScreen, activeTab, screen)
```
