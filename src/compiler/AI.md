# 🤖 AI Maintenance Guidelines for Compiler (`src/compiler`)

## 🔒 Binary Compilation Invariants

1. **Titan 24-Byte Mode**:
   - `titanMode` is ALWAYS enabled (`titanMode = true`).
   - Component chunk size is strictly 24 bytes per node.

2. **String Pool Alignment**:
   - Strings MUST be appended in the exact protocol order:
     `[sizeStr] -> [gradStr?] -> [borderStr?] -> [dynamicStr?] -> [animStr?] -> [action/text]`
3. **Header Specification**:
   - Every `.dolp` bundle MUST start with 4 magic bytes `'DOLP'`.
