# 🔍 Dolphin Native JS Parser Engine (`src/parser`)

The **Dolphin Parser Engine** transforms JSX elements, HTML5 tags, React attributes, and inline callback action expressions into standardized AST representation for binary compilation.

---

## 📂 Modular Architecture

| File | Class | Description |
|---|---|---|
| `HtmlTagParser.js` | `HtmlTagParser` | Void tag detector, tag-to-opcode resolution, and HTML validation. |
| `AttributeNormalizer.js` | `AttributeNormalizer` | Normalizes React `className`, `onClick`, `onChange`, and extracts Tailwind classes. |
| `CallbackParser.js` | `CallbackParser` | Parses action handlers, callback expressions, and NanoStore mutation syntax. |
| `HTMLParser.js` | `HTMLParser` | HTML5 component parser emitting AST node trees. |
| `HybridParser.js` | `HybridParser` | Master hybrid JSX & HTML5 component parser. |

---

## 💻 Usage Example

```js
const HybridParser = require('dolphin-native/src/parser/HybridParser');

const parser = new HybridParser();
const ast = parser.parse('<button className="btn p-4" onClick="counter+=1">Increment</button>');
```
