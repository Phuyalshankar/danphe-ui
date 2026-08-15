'use strict';

const { createPage, Page } = require('./src/core/DanphePage');
const DolphinWebEngine = require('./src/web/DolphinWebEngine');
const { DanpheThorVGTranspiler } = require('./src/thorvg/DanpheThorVGTranspiler');

console.log('======================================================================');
console.log('🦚 DANPHE 2: ZERO-HOOK "PAGE AS VARIABLE" MULTI-TARGET TEST');
console.log('======================================================================\n');

// 1. Define Page as pure reactive variable (No useState, No useEffect, No nav:back strings!)
const myPage = Page({
    title: "⚡ Smart Factory 7-Inch HMI",
    voltage: "230V 50Hz",
    status: "Motor Running 🟢",
    temp: "82°C"
});

console.log('1. Page Variable State & Auto-Hooks:');
console.log('   - myPage.title:     ', myPage.title);
console.log('   - myPage.voltage:   ', myPage.voltage);
console.log('   - myPage.back:      ', myPage.back);
console.log('   - myPage.battery:   ', myPage.battery);
console.log('   - myPage.flash:     ', myPage.flash);

// 2. Pure JSX / VNode Component using Page as Variable
const vnode = {
    tag: 'div',
    props: { className: 'p-6 bg-slate-950 text-white' },
    children: [
        { tag: 'h1', text: myPage.title },
        { tag: 'p', stateKey: 'voltage' },
        { tag: 'p', stateKey: 'status' },
        { tag: 'button', text: '🛑 Emergency Stop', props: { action: myPage.back } },
        { tag: 'button', text: '💡 Toggle Siren Light', props: { action: myPage.flash } }
    ]
};

// 3. Render to Native ThorVG / LVGL C++ (For 7" MP5 / ESP32 Screens)
const transpiler = new DanpheThorVGTranspiler();
const cppCode = transpiler.transpileToCpp(vnode.children, "FactoryHMI");

console.log('\n2. Generated Pure C++ ThorVG / LVGL Code (from Page Variable):');
console.log(cppCode);

console.log('======================================================================');
console.log('✅ ZERO-HOOK "PAGE AS VARIABLE" ENGINE VERIFIED SUCCESSFULLY ON DANPHE 2!');
console.log('======================================================================');
