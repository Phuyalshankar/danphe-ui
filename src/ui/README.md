# 🌐 Dolphin Native Universal UI Engine (`src/ui`)

The **Universal UI Engine** imports React JSX components, HTML5 schemas, and Tailwind utility classes, compiling them into Titan 24-byte binary protocol streams with strict string alignment.

---

## 📂 Modular Architecture

| File | Class | Description |
|---|---|---|
| `BorderFlagDetector.js` | `BorderFlagDetector` | Reliable border detection checking props, widths, colors, and Tailwind classes. |
| `SignatureBitCalculator.js` | `SignatureBitCalculator` | Calculates Titan 24-byte protocol signature bits (Byte 15 & 23). |
| `ComponentOpcodeMapper.js` | `ComponentOpcodeMapper` | Maps React component types and Tailwind layout classes to Titan Opcodes. |
| `ThemeEngine.js` | `ThemeEngine` | Theme luminance, palette generation, and dark/light mode switcher. |
| `AnimationAPI.js` | `AnimationAPI` | Animation property interpolation specs (`fade`, `slide`, `pulse`). |
| `GestureHandler.js` | `GestureHandler` | Swipe and touch gesture event mappers. |
| `ResponsiveLayout.js` | `ResponsiveLayout` | Breakpoint solver for mobile and tablet displays. |
| `UniversalUIImporter.js` | `UniversalUIImporter` | Master UI importer converting component trees into binary byte arrays. |

---

## 💻 Usage Example

```js
const UniversalUIImporter = require('dolphin-native/src/ui/UniversalUIImporter');

const importer = new UniversalUIImporter();
const { binaries, stringPool } = importer.importSchema({
    type: 'div',
    props: { className: 'card p-4 border border-slate-200 bg-white' },
    children: ['Hello Dolphin Native']
});
```
