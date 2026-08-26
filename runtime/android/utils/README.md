# 🛠️ Dolphin Native Utilities & Dev Tools (`runtime/android/utils`)

The **Utils** module provides hotpatch networking (`HotPatchClient`), gradient rendering (`GradientRenderer`), background push services, notification handlers, and runtime crash diagnostics.

---

## 📂 Key Utilities

| File | Purpose |
|---|---|
| `HotPatchClient.kt` | Manages real-time TCP socket connection with PC DevServer, UDP discovery, and ping/pong heartbeats. |
| `GradientRenderer.kt` | Applies linear, radial, and sweep gradients to native views with angle calculations. |
| `DolphinDiagnostics.kt` | Intercepts crashes, captures logcat traces, and generates diagnostic dialogs. |
| `NotificationHelper.kt` | Pushes native Android system notifications and channels. |
| `DolphinBackgroundService.kt` | Foreground/background service worker for offline events and hardware triggers. |
