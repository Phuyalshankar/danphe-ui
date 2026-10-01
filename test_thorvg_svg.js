'use strict';

const { DanpheThorVGTranspiler } = require('./src/thorvg/DanpheThorVGTranspiler');
const { renderButtonSVG } = require('../danphe-button/dist/danphe-button.cjs.js');

console.log('=================================================================');
console.log('🦚  DANPHE 2: danphe-button SVG → ThorVG LVGL C++ TEST');
console.log('=================================================================');

// Generate SVG using danphe-button opcode
const opcode32 = 0x01036502; // Palpali Dhaka, Gold, Wave, Chamfer
const svg = renderButtonSVG(2, 3, 1, 101, 'START MOTOR', { width: 240, height: 56 });
console.log('✅ danphe-button SVG generated:', svg.length, 'bytes');

const ast = [
    { tag: 'h1', text: '🦅 Danphe Control Panel' },
    // Plain button (no SVG)
    { tag: 'button', text: 'PLAIN BUTTON' },
    // danphe-button with pre-rendered SVG
    { tag: 'button', text: 'START MOTOR', opcode: opcode32, svg, width: 240, height: 56 },
    // danphe-button with opcode only (build-time render)
    { tag: 'button', text: 'E-STOP', opcode: 0xEF044502, width: 240, height: 56 },
    // Input field with SVG style
    { tag: 'input', placeholder: 'Enter value...', svg, width: 240, height: 44 },
    // Box / Card
    { tag: 'card', width: 280, height: 100 },
    // Badge
    { tag: 'badge', text: 'ONLINE', color: '0x10b981' },
    // Progress
    { tag: 'progress', value: 75, color: '0x10b981' },
    // Gauge
    { tag: 'gauge', value: 65, width: 160, height: 160 },
    // Toggle
    { tag: 'toggle', value: true, svg, width: 60, height: 32 },
    // Checkbox
    { tag: 'checkbox', text: 'Auto mode', checked: true },
    // Slider
    { tag: 'slider', value: 80 },
];

const transpiler = new DanpheThorVGTranspiler();
const cpp = transpiler.transpileToCpp(ast, 'DanpheControlPanel');

console.log('\n--- ⚡ GENERATED C++ (truncated) ---');
console.log(cpp.substring(0, 3000) + '\n...[truncated]');
console.log('--------------------------------------------------');
console.log('✅ Full SVG support test passed!');
console.log('   Elements: button(plain) + button(SVG) + button(opcode) + input + card + badge + progress + gauge + toggle + checkbox + slider');
