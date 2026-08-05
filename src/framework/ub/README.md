# 🌐 Dolphin Universal Bundle (`ub`) Framework Style Mapping (`src/framework/ub`)

The **Universal Bundle Framework** organizes Tailwind utility classes, inline styles, component style presets, color palettes, and spacing rules into clean, modular micro-files.

---

## 🎨 Complete Style Mapping Location Guide

| Style Category | Responsible Module / File | Handled Properties |
|---|---|---|
| **Colors & Themes** | `colors.js`, `ubColors.js` | Tailwind color palettes (`slate-*`, `blue-*`, `red-*`, `emerald-*`, etc.), Hex, RGB, HSL, OKLCH, and Dark/Light theme values. |
| **Card & Container** | `CardStyleParser.js` | Dedicated `card` and `card-glass` styles with explicit border (`#cbd5e1`), border-width (1px), radius (12px/16px), and elevation. |
| **Flexbox Layouts** | `FlexStyles.js` | `flex`, `flex-col`, `flex-row`, `items-center`, `justify-between`, `justify-center`, `flex-1`, `flex-wrap`. |
| **Buttons & Controls** | `ButtonStyles.js` | `btn`, `btn-sm`, `btn-md`, `btn-lg`, `btn-primary`, `btn-secondary`, `btn-success`, `btn-danger`, `btn-outline`. |
| **Inline React Styles** | `InlineStyleParser.js` | `{ backgroundColor, color, borderRadius, borderWidth, borderColor, width, height }`. |
| **Spacing & Margins** | `spacing.js` | `m-1`..`m-12`, `p-1`..`p-12`, `gap-1`..`gap-8` DP converters. |
| **Animations & Motion**| `animations.js` | `animate-spin`, `animate-pulse`, `animate-bounce`, `fade:300`, `slideUp:400`. |
| **Tailwind Parser Engine** | `ubParser.js` | Master `parseTW()` loop orchestrating all style modules above. |

---

## 💻 Usage Example

```js
const { parseTW } = require('dolphin-native/src/framework/ub/ubParser');

// Parses card, padding, flex, color, and border in one call
const props = parseTW('card flex-col items-center justify-between p-4 border border-slate-200 bg-white');
```
