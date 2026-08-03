# Dynamic UI Copier Plugin (`dolphin-native`)

A decoupled, browser-powered DOM Computed Style Scraper and Titan Binary Encoder plugin for **Dolphin Native**.

## Overview
This plugin allows developers to write standard web UI code using any CSS framework (MUI, Bootstrap, Tailwind, Ant Design). It uses the browser's native CSS engine (`window.getComputedStyle()`) to extract exact pixel dimensions, background colors, borders, and typography, and translates them into **16-byte fixed-width Titan binary opcodes** for Native Android execution.

## Features
- **Zero Core Modification**: Completely isolated in `src/plugins/dynamic-ui-copier/` without altering core framework files.
- **Dynamic DOM Extraction**: Scrapes computed styles directly from rendered DOM nodes.
- **Titan Protocol Encoding**: Translates scraped layout AST nodes into 16-byte aligned binary buffers and string pools.

## Quick Usage

```javascript
const { DynamicUICopierPlugin } = require('dolphin-native/src/plugins/dynamic-ui-copier');

const plugin = new DynamicUICopierPlugin();

// Scrape container element in browser
const container = document.getElementById('my-mui-form');
const { binaryBuffer, stringPool, nodeCount } = await plugin.processContainer(container);

console.log(`Compiled ${nodeCount} nodes into ${binaryBuffer.length} bytes of Titan Binary.`);
```
