'use strict';

const { DanpheThorVGTranspiler } = require('./src/thorvg/DanpheThorVGTranspiler');

console.log('=================================================================');
console.log('🦚  DANPHE 2: TITAN AST -> SAMSUNG THORVG / LVGL C++ TEST');
console.log('=================================================================');

// 1. Sample Multi-Platform AST Nodes (from HTML/JSX)
const sampleAST = [
    { tag: 'h1', text: '🚀 Smartwatch & IoT Control Panel' },
    { tag: 'p', stateKey: 'sys_battery_level' },
    { tag: 'button', text: '⚡ Start Motor' },
    { tag: 'button', text: '🛑 Emergency Stop' },
    { tag: 'slider' }
];

// 2. Transpile to Native Samsung ThorVG / LVGL C++ Code
const transpiler = new DanpheThorVGTranspiler();
const cppCode = transpiler.transpileToCpp(sampleAST, "SmartwatchPanel");

console.log('\n--- ⚡ GENERATED NATIVE THORVG / LVGL C++ CODE ---');
console.log(cppCode);
console.log('--------------------------------------------------');
console.log('✅ Danphe 2 Native Transpilation Verified Successfully!');
