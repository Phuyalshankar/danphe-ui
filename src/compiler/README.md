# ⚡ Dolphin Native JS Compiler (`src/compiler`)

The **Dolphin Compiler** transforms JSX and HTML5 UI component trees into pre-compiled binary bundles (`.dolp`) for zero-overhead, WebView-free rendering on native Android and iOS runtimes.

---

## 📂 Modular Architecture

| File | Class | Description |
|---|---|---|
| `BundleHeaderBuilder.js` | `BundleHeaderBuilder` | 20-byte `DOLP` binary header generator and validator. |
| `StringPoolEncoder.js` | `StringPoolEncoder` | Encodes strings into binary offsets and UTF-8 string blocks. |
| `CdnAssetFetcher.js` | `CdnAssetFetcher` | Downloads CDN assets and icon dependencies. |
| `IconCDNFetcher.js` | `IconCDNFetcher` | Downloads Material, Bootstrap, and Remix icon assets for bundling. |
| `DolphinCompiler.js` | `DolphinCompiler` | Master compiler orchestrating AST parsing, Titan 24-byte compilation, and `.dolp` emission. |

---

## 💻 Usage Example

```js
const DolphinCompiler = require('dolphin-native/src/compiler/DolphinCompiler');

const compiler = new DolphinCompiler({ titanMode: true });
const binaryBundle = compiler.compile('<div class="p-4 bg-blue-600"><button>Click Me</button></div>', {
    platform: 'NATIVE'
});
```
