# 🤖 AI Maintenance Guidelines for State Engine (`runtime/android/state`)

## 🔒 Memory & Main Thread Safety Rules

1. **Dead Binding Cleanup**:
   - `clearDeadBindings()` MUST be called during full reloads or screen patches to purge garbage-collected view references.
2. **Main Thread Dispatch**:
   - All state mutations modifying native views MUST run on `context.mainLooper`.
3. **Action Expression Handling**:
   - `handleAction()` supports expressions like `key:=value`, `key+=1`, `key-=1`, `key!=toggle`.
