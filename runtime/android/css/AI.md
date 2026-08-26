# 🤖 AI Maintenance Guidelines for CSS Engine (`runtime/android/css`)

## 🔒 Border Persistence & Background Rules

1. **Border Preservation (`applyCustomBorder`)**:
   - `applyCustomBorder` MUST target `MaterialCardView` directly when `v` is a card or has a card parent.
   - `v.setWillNotDraw(false)` MUST be called on view groups with borders to prevent Android layout optimizations from skipping draw cycles.
   - `applyStyles` MUST NOT overwrite an existing stroke color when setting background drawables.

2. **Transparent Color Code**:
   - Color code `23` is strictly `Color.TRANSPARENT`.
   - Color code `25` represents white with alpha based on `shade`.
