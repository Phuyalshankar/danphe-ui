# 🤖 AI Maintenance Guidelines for Form Engine (`runtime/android/form`)

## 🔒 Rules for Form Processing

1. **Tag Invariants**:
   - Root form container MUST set `tag = "FormEngineRoot"`.
   - Child border container MUST set `tag = "FormBorderContainer"`.
2. **State Sync**:
   - Form input changes MUST update state keys directly in `DolphinStateEngine`.
