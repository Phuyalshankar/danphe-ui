# 🤖 AI Maintenance Guidelines for Core Engine (`src/core`)

## 🔒 CSS Parsing Invariants

1. **Max File Length**:
   - Single file length MUST NOT exceed 1200 lines.
2. **Tailwind Color Consistency**:
   - Tailwind color mappings MUST align with OKLCH & ARGB color definitions in Kotlin `ColorParser.kt`.
