'use strict';

const PipelineBreakInspector = require('./PipelineBreakInspector');

const inspector = new PipelineBreakInspector();

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('🚀 TESTING NEW COMPILED PIPELINE ON PREVIOUSLY FAILING TAILWIND CLASSES');
console.log('═══════════════════════════════════════════════════════════════════════\n');

const testCases = [
    { label: 'AppBar Opacity Header', class: 'flex-row items-center justify-between p-3 bg-slate-900/90 rounded-2xl border border-slate-800/80 shadow-lg w-full mb-2' },
    { label: 'TabBar Negative Margin FAB', class: 'bg-emerald-500 hover:bg-emerald-400 text-white rounded-full w-14 h-14 items-center justify-center flex-row shadow-2xl border-2 border-emerald-300 cursor-pointer -mt-5' },
    { label: 'Keypad Arbitrary Subtext', class: 'text-slate-400 font-bold text-[8.5px] tracking-widest leading-none mt-0.5' },
    { label: 'VideoCall Small Badges', class: 'text-[10px] font-mono text-emerald-400 font-bold bg-slate-950/80 px-2 py-0.5 rounded-md mt-1' },
    { label: 'Audio Call SIM Badges', class: 'flex-1 flex-row items-center justify-center py-2.5 px-2 bg-slate-900/90 rounded-2xl border border-cyan-500/40 shadow-lg' }
];

testCases.forEach((tc, i) => {
    console.log(`[TEST #${i + 1}] ${tc.label}`);
    console.log(`  Input: "${tc.class}"`);
    const res = inspector.inspectClassString(tc.class, tc.class.includes('flex-row') ? 'Row' : 'div');
    console.log(`  Stage 2 (ubParser)     : Status=${res.stages.stage2_ubParser.status}`);
    console.log(`  Stage 3 (Importer)     : Hex=[${res.stages.stage3_importer.opcodeHex}]`);
    console.log(`  Stage 4 (BinaryParser) : Pad=${JSON.stringify(res.stages.stage4_binaryParser.unpacked.padding)}, Margin=${JSON.stringify(res.stages.stage4_binaryParser.unpacked.margin)}`);
    console.log(`  Stage 5 (ViewFactory)  : Builder=${res.stages.stage5_viewFactory.builder} (${res.stages.stage5_viewFactory.viewClass})`);
    console.log(`  Stage 6 (NativeStyles) : Radius=${res.stages.stage6_nativeStyles.appliedStyles.backgroundDrawable.radiusDp}dp, Border=${res.stages.stage6_nativeStyles.appliedStyles.backgroundDrawable.hasBorder}`);
    if (res.breakSummary.length === 0) {
        console.log(`  Result: ✅ 100% PASSED (0 Breakpoints)\n`);
    } else {
        console.log(`  Result: ⚠️ Issues: ${res.breakSummary.join(' | ')}\n`);
    }
});

console.log('═══════════════════════════════════════════════════════════════════════\n');
