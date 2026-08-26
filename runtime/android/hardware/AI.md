# 🤖 AI Maintenance Guidelines for Hardware Bridges (`runtime/android/hardware`)

## 🔒 Permission & Threading Rules

1. **Permission Check**:
   - Runtime permissions (GPS, Camera, Microphone, Storage) MUST be verified before hardware API access.
2. **Main Thread Safety**:
   - Hardware callbacks returning UI results MUST post to `context.mainLooper`.
3. **Action Prefix**:
   - Hardware actions MUST begin with `hw:` or `hw.`.
