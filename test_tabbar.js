'use strict';
const { DanpheThorVGTranspiler } = require('./src/thorvg/DanpheThorVGTranspiler');

const ast = [
  { tag: 'h1', text: '🦅 Danphe Mobile App' },
  // DanpheTabBar — ThorVG SVG path (danphe-button available)
  { tag: 'tabbar',
    tabs: ['HOME', 'SENSORS', 'LOGS', 'CONFIG'],
    active: 0, style: 'pill', palette: 'pagani',
    tabWidth: 100, height: 42 },
  // Solid style tabbar
  { tag: 'tabbar',
    tabs: ['Overview', 'Details', 'Settings'],
    active: 1, style: 'solid', palette: 'primary',
    tabWidth: 120, height: 44 },
  // Without danphe-button path (simulate missing) → LVGL native fallback
  { tag: 'tabs',
    tabs: ['VIDEO', 'AUDIO', 'NETWORK'],
    active: 0, style: 'underline', palette: 'info',
    tabWidth: 120, height: 44 },
  { tag: 'button', text: 'SAVE' },
];

const transpiler = new DanpheThorVGTranspiler();
const cpp = transpiler.transpileToCpp(ast, 'MobileApp');

console.log('=== Generated C++ ===');
console.log(cpp.substring(0, 4000));

// Checks
const checks = [
  ['tabbar TVG comment', cpp.includes('[TVG] TabBar')],
  ['LV_USE_THORVG guard', cpp.includes('#if LV_USE_THORVG')],
  ['LVGL tabview fallback', cpp.includes('lv_tabview_create')],
  ['danphe_tvg_render call', cpp.includes('danphe_tvg_render')],
  ['pill style SVG', cpp.includes('danphe-tabbar')],
  ['tab touch callback wiring', cpp.includes('danphe_tabbar_touch_cb')],
];
console.log('\n=== Test Results ===');
checks.forEach(([name, pass]) => console.log(pass ? '✅' : '❌', name));
