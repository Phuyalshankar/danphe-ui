# 🤖 AI Maintenance Guidelines for Animation Engine (`runtime/android/animation`)

## 🔒 Rules for Animation

1. **Non-Blocking Execution**:
   - Animations MUST NOT block main UI thread calculations.
2. **Infinite Loops**:
   - Infinite animators (`repeatCount = ValueAnimator.INFINITE`) MUST check if view is still attached before starting.
