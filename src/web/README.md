# 🌐 Dolphin Web Engine (`src/web`)

The **Dolphin Web Engine** renders pre-compiled AST component trees into full SEO-optimized HTML5 web applications (`WebSeoGenerator`), DOM elements (`WebComponentRenderer`), and web event dispatchers (`WebEventDispatcher`).

---

## 📂 Modular Architecture

| File | Class | Description |
|---|---|---|
| `WebSeoGenerator.js` | `WebSeoGenerator` | Generates HTML5 title, meta description, OpenGraph, and canonical headers. |
| `WebEventDispatcher.js` | `WebEventDispatcher` | Manages DOM event listeners (`click`, `input`, `change`) and NanoStore action bindings. |
| `DolphinWebStore.js` | `DolphinWebStore` | Browser reactive store bridge. |
| `DolphinWebEngine.js` | `DolphinWebEngine` | Master Web Engine rendering HTML5 web applications. |

---

## 💻 Usage Example

```js
const DolphinWebEngine = require('dolphin-native/src/web/DolphinWebEngine');

const engine = new DolphinWebEngine();
const htmlOutput = engine.renderToHtml(screenAst, {
    seo: { title: 'Home', description: 'Fuel Pump App' }
});
```
