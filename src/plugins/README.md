# 🧩 Dolphin Native Plugins Engine (`src/plugins`)

The **Plugins Engine** provides extensibility hooks, dynamic UI component scraping (`dynamic-ui-copier`), DOM structure extraction (`DOMScraperEngine`), and custom binary encoding.

---

## 📂 Included Plugins & Modules

| Sub-Folder / File | Component | Description |
|---|---|---|
| `dynamic-ui-copier/DOMScraperEngine.js` | `DOMScraperEngine` | Extracts live DOM tree structures into clean component AST nodes. |
| `dynamic-ui-copier/TitanBinaryEncoder.js` | `TitanBinaryEncoder` | Encodes scraped DOM nodes directly into Titan 24-byte binary streams. |

---

## 💻 Usage Example

```js
const { DOMScraperEngine } = require('dolphin-native/src/plugins/dynamic-ui-copier');

const scraper = new DOMScraperEngine();
const componentAST = scraper.scrape(document.querySelector('#app'));
```
