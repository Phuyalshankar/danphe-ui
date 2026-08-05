# 🤖 AI Maintenance Guidelines for Plugins (`src/plugins`)

## 🔒 Plugin Invariants

1. **Max File Length**:
   - Single plugin file length MUST NOT exceed 1200 lines.
2. **Binary Encoding Agreement**:
   - `TitanBinaryEncoder.js` MUST emit 24-byte Titan protocol nodes aligned with `ViewFactory.kt`.
