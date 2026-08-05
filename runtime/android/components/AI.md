# 🤖 AI Maintenance Guidelines for Components (`runtime/android/components`)

## 🔒 Rules for Component Builders

1. **Isolation**:
   - Each builder MUST implement `ComponentBuilder` interface.
   - A builder MUST NOT mutate global state directly without using `factory.nextStr()` and `factory.applyStyles()`.

2. **Gap & Layout Protection**:
   - Containers MUST use `GapAwareLinearLayout` to prevent Android's default `LinearLayout` from collapsing margins or flex weights.

3. **String Consumption**:
   - Any component-specific string (e.g. button `action`, text `content`, textField `label`) MUST be consumed via `factory.nextStr()`.
