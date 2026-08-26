# 🤖 AI Maintenance Guidelines for Layout Engine (`runtime/android/layout`)

## 🔒 Critical Layout Invariants

1. **`GapAwareLinearLayout` Enforcement**:
   - NEVER replace `GapAwareLinearLayout` with generic `LinearLayout` for Column/Row containers.
   - `childWeights` map stores child view hashes to preserve `weight = 1f` inside scrollviews.

2. **Grid Processing (`0x22`)**:
   - Opcode `0x22` reads column count from Byte 12 (`bin[12] & 0x0F`).
   - Children count is read from Byte 13 (`bin[13] & 0xFF`).
