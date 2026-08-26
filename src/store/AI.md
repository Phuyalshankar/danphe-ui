# 🤖 AI Maintenance Guidelines for State Store (`src/store`)

## 🔒 Reactive State Sync Invariants

1. **State Mutation Expression Contract**:
   - `key:=value`: Direct assignment
   - `key+=amount`: Numeric increment
   - `key-=amount`: Numeric decrement
   - `key!=toggle`: Boolean toggle
   - Any expression modification MUST be synchronized with `DolphinStateEngine.kt` (`handleAction()`).

2. **Opcode 0x08 (PATCH_STATE)**:
   - State updates broadcast via dev bridge MUST use opcode `0x08`.
   - Binary layout: `[1-byte keyLen][key UTF-8][val UTF-8]`.
