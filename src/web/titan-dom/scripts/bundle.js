const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "..", "dist");
const files = ["types.js", "error.js", "core.js", "component.js", "router.js", "index.js"];

let combined = `/**
 * 🐬 TITAN-DOM (Universal Browser Bundle)
 * Zero-VDOM Surgical Reactive Engine, Components & Router for Titan Bus
 * Author: Phuyalshankar
 * License: MIT
 */
(function(global) {
  var exports = {};
  var module = { exports: exports };
`;

for (const file of files) {
  const filePath = path.join(distDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf-8");
    // Remove "use strict" and module requires between internal files
    content = content.replace(/"use strict";/g, "");
    content = content.replace(/Object\.defineProperty\(exports, "__esModule", \{ value: true \}\);/g, "");
    content = content.replace(/const [a-zA-Z0-9_]+ = require\(["']\.\/[a-zA-Z0-9_]+["']\);/g, "");
    combined += `\n/* ─── ${file} ─── */\n` + content;
  }
}

combined += `
  // Expose on global window / scope
  global.TitanRegisterStore = exports.TitanRegisterStore;
  global.TitanDOMEngine = exports.TitanDOMEngine;
  global.TitanComponentManager = exports.TitanComponentManager;
  global.TitanRouter = exports.TitanRouter;
  global.TitanErrorManager = exports.TitanErrorManager;
  global.createTitanApp = exports.createTitanApp;

  // Auto-initialize if [tb-app] attribute is found on body or document
  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", function() {
      var appRoot = document.querySelector("[tb-app]") || document.body;
      if (appRoot && !global._titanAppInitialized) {
        global._titanAppInitialized = true;
        global.titanApp = exports.createTitanApp().mount(appRoot);
      }
    });
  }
})(typeof window !== "undefined" ? window : globalThis);
`;

fs.writeFileSync(path.join(distDir, "titan-dom.browser.js"), combined, "utf-8");
console.log("✓ Built dist/titan-dom.browser.js (" + combined.length + " bytes)");
