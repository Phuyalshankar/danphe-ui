# 🛣️ Dolphin Native Router Engine (`src/router`)

The **Dolphin Router Engine** provides lightweight route matching, parameter extraction (`:id`), query parsing, navigation guards, and screen navigation actions (`NAVIGATE_TO` opcode `0x0A`).

---

## 📂 Modular Architecture

| File | Class | Description |
|---|---|---|
| `RouteMatcher.js` | `RouteMatcher` | Dynamic route parameter matcher (`/user/:id`) and query string parser. |
| `DolphinRouter.js` | `DolphinRouter` | Master router managing routes (`get`, `post`, `group`), memory/hash modes, and screen transitions. |

---

## 💻 Usage Example

```js
const DolphinRouter = require('dolphin-native/src/router/DolphinRouter');

const router = new DolphinRouter({ mode: 'memory' });
router.get('/home', () => console.log('Home Screen'));
router.get('/user/:id', (req) => console.log('User ID:', req.params.id));
router.navigate('/user/42');
```
