# 🤖 AI Maintenance Guidelines for UI Engine (`src/ui`)

## 🔒 Critical Protocol String Order Invariant

In `UniversalUIImporter.js`, string pool entries MUST be pushed in the EXACT order expected by Kotlin's `ViewFactory.kt`:

```
[sizeStr] -> [gradStr?] -> [borderStr?] -> [dynamicStr?] -> [animStr?] -> [action/text]
```

1. **Size String (`sizeStr`)**: Pushed FIRST.
2. **Gradient String (`gradStr`)**: Pushed if `sig & 0x01` is true.
3. **Border String (`borderStr`)**: Pushed if `sig & 0x04` is true (`hasValidBorder`).
4. **Dynamic Bindings (`dynamicStr`)**: Pushed if `sig & 0x08` is true.
5. **Animation Spec (`animStr`)**: Pushed if `sig & 0x10` is true.
6. **Action / Text Content**: Pushed LAST.
