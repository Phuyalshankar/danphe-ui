# ⚠️ Dolphin Errors Engine (`src/errors`)

The **Dolphin Errors Engine** provides structured zero-crash exception handlers, error codes, and failure descriptors.

---

## 📂 Included Error Types

| File | Class | Description |
|---|---|---|
| `DolphinError.js` | `DolphinError` | Custom error class with error code, message, component context, and timestamp. |

---

## 💻 Usage Example

```js
const DolphinError = require('dolphin-native/src/errors/DolphinError');

throw new DolphinError('INVALID_OPCODE', 'Unsupported Titan Binary Opcode: 0xFF');
```
