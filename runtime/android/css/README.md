# 🎨 Dolphin Native CSS & Styling Engine (`runtime/android/css`)

The **CSS Engine** handles native color resolution, theme switching (Light/Dark mode), corner radii calculations, padding/margin application, and explicit border styling for native views.

---

## 📂 Features & Specs

| Feature | Details |
|---|---|
| Color Resolution | OKLCH color space mapping, Tailwind color palettes (`slate-*, blue-*, gray-*`). |
| Dark/Light Theme | Theme level luminance checks (`DolphinStateEngine.themeLevel > 128`). |
| Custom Borders | Border stroke width (`bWidthDp`), style, and color resolution (`applyCustomBorder`). |
| View Backgrounds | Dynamic `GradientDrawable` creation without wiping stroke state on re-render. |

---

## 🛠️ Color Resolution Matrix

```kotlin
// Parse binary color code & shade level into Android ARGB Integer
val colorInt = ViewFactory.parseColor(colorCode = 12, shade = 128)
```
