# 🤖 AI Maintenance Guidelines for Plugin System (`runtime/android/plugin`)

## 🔒 Extension Rules

1. **Thread Safety**:
   - `DolphinPluginRegistry` plugins map MUST use thread-safe data structures (`ConcurrentHashMap`).
2. **Plugin Interface**:
   - Every custom UI plugin MUST implement `DolphinUIPlugin` interface.
