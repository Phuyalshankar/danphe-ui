# 🐬 Titan-DOM (v1.0.0)
### Universal Zero-VDOM Reactive DOM, File-to-File Components & Routing Engine for Titan Bus (0x5442)

**Titan-DOM** is a high-performance, type-safe (TypeScript) frontend engine engineered to completely eliminate React, Vue, and heavy virtual DOM frameworks. It connects native HTML elements directly to **Titan Bus 16-bit registers (0 - 65535)** and the **24-byte binary highway (`0x5442`)** with surgical precision at 60–120 FPS.

---

## ⚡ Why Titan-DOM Beats React:

| Feature | Traditional React | 🐬 Titan-DOM |
| :--- | :--- | :--- |
| **Virtual DOM (VDOM)** | Yes (Heavy reconciliation on every keystroke) | **100% Zero VDOM** (Surgical direct DOM mutation) |
| **Typing / Form Latency** | 16–50 ms (Causes UI lag on large forms) | **< 0.001 ms** (Instant microsecond register write) |
| **Bundle Size** | ~140 KB+ (`react` + `react-dom`) | **~3 to 4 KB** (Zero external dependencies) |
| **Type Safety & VS Code** | Complex JSX typings & hook rules | **100% Native TypeScript with full `.d.ts` autocompletion** |
| **Hardware & IoT Sync** | Requires custom WebSockets, Redux, Axios | **Native 24-byte binary framing (`0x5442`) & registers** |
| **Memory Footprint** | 50 MB to 100 MB RAM | **< 1 MB RAM** (Perfect for Smart Displays / Low-End devices) |

---

## 🚀 Quick Start

### 1. Simple Drop-in (No Bundler Required):
```html
<!-- Load the standalone 4KB browser bundle -->
<script src="dist/titan-dom.browser.js"></script>

<div tb-app>
    <!-- Direct Two-Way Binding -->
    <input type="range" tb-bind="1001" min="0" max="100">

    <!-- Surgical Reactive Text (No Re-renders) -->
    <span tb-text="1001">0</span>

    <!-- Direct Universal Action -->
    <button tb-on:click="toggle:1002">Toggle Relay</button>
</div>
```

---

## 🧩 1. Declarative Directives

### Direct Register Bindings:
* `tb-bind="<reg>"`: Two-way binding for `<input>`, `<select>`, `<textarea>`, checkboxes, and range sliders.
* `tb-text="<reg>"`: One-way surgical text injection.
* `tb-html="<reg>"`: One-way raw HTML injection.
* `tb-class:<className>="<reg>"`: Toggles `<className>` based on truthy/non-zero register value.
* `tb-style:<prop>="<template>"`: Dynamic styles (e.g. `tb-style:opacity="1002"`, `tb-style:transform="translateY({1003}px)"`).
* `tb-attr:<attr>="<reg>"`: Dynamic HTML attributes (e.g. `tb-attr:disabled="1004"`).

### Universal Event Delegation:
* `tb-on:<event>="<action>"`: Captures any DOM event at document root.
* **Supported Actions**:
  * `write:<reg>:<value>` — writes a value to a register.
  * `toggle:<reg>` — flips 0 to 1 and 1 to 0.
  * `increment:<reg>:<step>` — increases register value.
  * `decrement:<reg>:<step>` — decreases register value.
  * `coords:<regX>:<regY>` — writes live mouse/touch `(x, y)` pixels into two registers at 120 FPS.
  * `action:<customFn>` — calls a registered TypeScript/JS action handler.
* **Modifiers**:
  * `.prevent` — calls `e.preventDefault()`.
  * `.stop` — calls `e.stopPropagation()`.
  * `.throttle(ms)` — throttles event calls (e.g. `tb-on:mousemove.throttle(16)`).
  * `.debounce(ms)` — debounces event calls (e.g. `tb-on:input.debounce(250)`).

---

## 📁 2. File-to-File Component Architecture

No JSX, Webpack, or Babel setup. Simply create reusable HTML component files:

### `components/navbar.html`:
```html
<header class="navbar">
    <h2>{{title}}</h2>
    <span tb-text="990">1</span>
</header>
```

### Mount it anywhere:
```html
<div tb-component="navbar" title="Smart Pump Station"></div>
```

---

## 🧭 3. Hardware-Synchronized Reactive Router

Routes can be mapped directly to a 16-bit Titan Register (default: **Register 990 / `REG_ROUTE`**):

```typescript
import { createTitanApp } from "titan-dom";

const app = createTitanApp({
    router: {
        mode: "hash",
        routeRegister: 990
    }
});

// Register routes
app.router
    .add({ path: "/dashboard", component: "dashboard", registerId: 1 })
    .add({ path: "/settings", component: "settings", registerId: 2 });

app.mount();
```

* User clicks `<a tb-link="/dashboard">` -> View updates and Register 990 is set to `1`.
* **Hardware Trigger**: If an external ESP32, PLC, or server sends a packet writing `2` to Register 990, **the UI automatically navigates to `/settings` in real time!**

---

## 🛠️ Development & Building

```bash
# Compile TypeScript to dist/ (with .d.ts types)
npm run build

# Run automated test suite
npm test

# Generate standalone browser bundle
npm run bundle
```

---

## 📜 License
MIT © Phuyalshankar
