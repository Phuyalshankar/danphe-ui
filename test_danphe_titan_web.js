'use strict';

/**
 * 🧪 Test: Danphe-2 + Titan-DOM Unified Web Engine Integration
 * Verifies that DolphinWebEngine renders HTML containing Titan-DOM runtime,
 * surgical directives (tb-text, tb-bind, tb-on:click), and useTitan hook.
 */

const DolphinWebEngine = require('./src/web/DolphinWebEngine');
const assert = require('node:assert');

console.log('======================================================================');
console.log('🐬 DANPHE-2 + TITAN-DOM UNIFIED WEB ENGINE VERIFICATION TEST');
console.log('======================================================================\n');

// 1. Create a sample Danphe-2 VNode tree with registers and state keys
const testVNode = {
    tag: 'div',
    props: { className: 'p-8 bg-slate-900 text-white' },
    children: [
        { 
            tag: 'h1', 
            text: 'Titan Factory HMI', 
            props: { className: 'text-2xl font-bold' } 
        },
        { 
            tag: 'span', 
            stateKey: 'voltage',
            text: '[stateKey:voltage]'
        },
        { 
            tag: 'span', 
            props: { bus: '1001' },
            text: '0'
        },
        {
            tag: 'input',
            stateKey: 'operatorName',
            props: { type: 'text', placeholder: 'Enter name' }
        },
        { 
            tag: 'button', 
            props: { 
                action: 'hw:relay:toggle',
                className: 'bg-green-600 px-4 py-2' 
            },
            text: 'Toggle Motor Relay' 
        }
    ]
};

// 2. Render to full Web HTML
const engine = new DolphinWebEngine();
const htmlOutput = engine.renderToWebHTML(testVNode, {
    title: 'Titan Danphe HMI Live',
    description: 'Unified Web Engine Test'
}, {
    voltage: '230V 50Hz',
    operatorName: 'Operator 1'
});

console.log('1. Generated HTML Size:', htmlOutput.length, 'bytes');

// 3. Verification Assertions
// A. Titan-DOM bundle must be embedded
assert.ok(htmlOutput.includes('TITAN-DOM High-Performance Zero-VDOM Engine'), 'HTML must include Titan-DOM banner');
assert.ok(htmlOutput.includes('TitanDOMEngine'), 'HTML must include TitanDOMEngine');
assert.ok(htmlOutput.includes('TitanRegisterStore'), 'HTML must include TitanRegisterStore');

// B. Directives must be present on HTML nodes
assert.ok(htmlOutput.includes('tb-text="voltage"'), 'Node must include tb-text="voltage"');
assert.ok(htmlOutput.includes('tb-text="1001"'), 'Node must include tb-text="1001"');
assert.ok(htmlOutput.includes('tb-bind="operatorName"'), 'Input must include tb-bind="operatorName"');
assert.ok(htmlOutput.includes('tb-on:click="action:hw:relay:toggle"'), 'Button must include tb-on:click directive');

// C. Universal useTitan hook must be exported
assert.ok(htmlOutput.includes('window.useTitan = function'), 'window.useTitan hook must be defined in browser script');

// D. DolphinWebStore must bridge to Titan
assert.ok(htmlOutput.includes('window.Titan.write(k, state[k])'), 'State must be seeded into Titan Register Store');

console.log('\n2. Assertion Results:');
console.log('   ✅ Titan-DOM runtime successfully embedded into Danphe-2 Web output.');
console.log('   ✅ tb-text, tb-bind, and tb-on:click directives properly generated.');
console.log('   ✅ Universal useTitan hook active.');
console.log('   ✅ DolphinWebStore seamlessly bridged to TitanRegisterStore.');

console.log('\n======================================================================');
console.log('🎉 ALL DANPHE-2 + TITAN-DOM INTEGRATION CHECKS PASSED (100%)!');
console.log('======================================================================\n');
