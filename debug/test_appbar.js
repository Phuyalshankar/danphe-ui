'use strict';

const CssComparator = require('./CssComparator');
const TitanKotlinSimulator = require('./TitanKotlinSimulator');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('🐬 TITAN UNIFIED CSS & KOTLIN RUNTIME DIAGNOSTIC HARNESS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

const comparator = new CssComparator();
const simulator = new TitanKotlinSimulator();

// 1. Test AppBar Root Container
const appbarAst = {
    type: 'element',
    tag: 'div',
    props: {
        className: 'flex-row items-center justify-between p-3 bg-slate-900/90 rounded-2xl border border-slate-800/80 shadow-lg w-full mb-2'
    },
    children: []
};

console.log('🔍 [TEST 1] Auditing AppBar.jsx Root Container...');
const report = comparator.auditComponent(appbarAst, 'AppBar Container');

console.log('\n📋 --- 3-WAY COMPARISON REPORT ---');
console.log('1. JSX Tag       :', report.jsxTag);
console.log('2. JSX ClassName :', report.jsxClassName);
if (report.kotlinSimulation) {
    console.log('3. Opcode Type   :', report.kotlinSimulation.componentType, `(${report.kotlinSimulation.opcode})`);
    console.log('4. Kotlin Builder:', report.kotlinSimulation.kotlinBuilder);
    console.log('5. 24-Byte HEX   :', report.kotlinSimulation.rawHex);
    console.log('6. Decoded Styles:');
    console.log('   - Padding     :', JSON.stringify(report.kotlinSimulation.padding));
    console.log('   - Margin      :', JSON.stringify(report.kotlinSimulation.margin));
    console.log('   - CornerRadius:', report.kotlinSimulation.cornerRadius);
    console.log('   - Background  :', report.kotlinSimulation.backgroundColor);
    console.log('   - Has Border  :', report.kotlinSimulation.hasBorder);
    console.log('   - Native View :', report.kotlinSimulation.nativeApplied.viewClass);
    console.log('   - Drawable    :', report.kotlinSimulation.nativeApplied.backgroundDrawable);
}

if (report.discrepancies.length > 0) {
    console.log('\n⚠️ ATTENTION / DISCREPANCIES DETECTED:');
    report.discrepancies.forEach((d, i) => console.log(`   [${i + 1}] ${d}`));
} else {
    console.log('\n✅ 100% PERFECT MATCH — All styles successfully mapped!');
}

console.log('\n═══════════════════════════════════════════════════════════════════════\n');
