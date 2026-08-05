# 🤖 AI Maintenance Guidelines for Universal Bundle Framework (`src/framework/ub`)

## 🔒 Critical Invariants for `ubParser` & `CardStyleParser`

1. **Card Border Persistence (`card`)**:
   - `card` and `card-glass` MUST explicitly specify `border`, `borderColor`, and `borderWidth` props.
   - Removing border props from `card` will cause `ViewFactory.kt` to omit border stroke (`sig & 0x04`).

2. **Max File Length Rule**:
   - Single file length MUST NOT exceed 1200 lines.
