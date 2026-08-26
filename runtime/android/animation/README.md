# 🎬 Dolphin Native Animation Engine (`runtime/android/animation`)

The **Animation Engine** (`AnimationEngine`) handles native micro-animations, interpolations, keyframes, and transition specs (`fade`, `slide`, `pulse`, `bounce`, `rotate`).

---

## 📂 Features

- **Binary Animations**: Byte 12 & Byte 15 (`sig` bit 4) encode duration, curve type, and animation presets.
- **String Animation Specs**: Parses animation strings like `fade:300`, `slideUp:400`, `pulse:infinite`.
- **Property Animators**: Uses native `ObjectAnimator` and `ValueAnimator` for smooth 60fps performance without bridge overhead.
