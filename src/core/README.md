# 🌊 Dolphin Core Engine (`src/core`)

The **Dolphin Core Engine** manages core CSS utility classes, Tailwind color palettes, margin/padding converters, and layout utility definitions (`DolphinCSS.js`).

---

## 📂 Included Components

| File | Class | Description |
|---|---|---|
| `DolphinCSS.js` | `DolphinCSS` | Pure utility class parser, Tailwind color mapping, and CSS property extractor. |

---

## 💻 Usage Example

```js
const DolphinCSS = require('dolphin-native/src/core/DolphinCSS');

const parsed = DolphinCSS.parse('p-4 bg-blue-500 rounded-xl text-white');
```
