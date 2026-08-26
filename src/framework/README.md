# 🐬 Dolphin Native Framework Module

The `src/framework` module serves as the central umbrella runtime engine for Dolphin Native applications.

## 📦 Core Architecture & Files

- **`DolphinFramework.js`**: Core framework orchestrator and component lifecycles.
- **`animation.js`**: Single source of truth for 40+ native CSS animations and 24-byte protocol packing.
- **`components.js`**: Core component registry and default properties.
- **`ub.js`**: Universal Utility Brain facade connecting Tailwind parsing and OKLCH color generation.
- **`ub/`**: Utility sub-engines (`ubColors.js`, `ubParser.js`, `ubWebEngine.js`).

## 🧪 Unit Testing

Unit tests for `src/framework` reside in `./tests/framework.test.js`.
