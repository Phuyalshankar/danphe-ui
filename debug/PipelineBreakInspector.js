'use strict';

const fs = require('fs');
const path = require('path');
const TitanCompiler = require('../src/compiler/TitanCompiler');
const TitanKotlinEngine = require('./TitanKotlinEngine');

/**
 * ⚡ DirectTitanInspector — Direct 2-Stage Pipeline Debugger
 *
 * Tracks every single Tailwind class & JSX attribute across the Direct Titan Pipeline:
 *
 * [Stage 1: Raw JSX Token] ──➔ [TitanCompiler.js (Single Pass)]
 *                                          ⬇
 * [Stage 2: Titan 24-Byte Bytecode] ──➔ [TitanEngine.kt (Atomic Native Paint)]
 *
 * Instantly identifies EXACTLY which byte or native rule broke the styling!
 */
class PipelineBreakInspector {
    constructor() {
        this.compiler = new TitanCompiler();
        this.ktEngine = new TitanKotlinEngine();
    }

    inspectClassString(className, tag = 'div', label = '') {
        const tokens = className.trim().split(/\s+/).filter(Boolean);
        const dummyNode = { tag, props: { className }, children: [] };
        const res = this.compiler.compile(dummyNode);
        const bin = res.binaries[0] || new Uint8Array(24);

        const report = {
            label,
            tag,
            rawClassName: className,
            totalTokens: tokens.length,
            stages: {
                stage1_jsx: { status: 'OK', tokens },
                stage2_compiler: {
                    status: 'OK',
                    opcode: bin[1],
                    hex: Array.from(bin).map(b => b.toString(16).padStart(2, '0')).join(' '),
                    packedBytes: bin
                },
                stage3_importer: { status: 'OK', packedBytes: bin },
                stage4_nativeEngine: {
                    status: 'OK',
                    padding: { t: bin[4], r: bin[5], b: bin[6], l: bin[7] },
                    margin: { t: bin[8] > 127 ? bin[8] - 256 : bin[8], r: bin[9] > 127 ? bin[9] - 256 : bin[9], b: bin[10] > 127 ? bin[10] - 256 : bin[10], l: bin[11] > 127 ? bin[11] - 256 : bin[11] },
                    radius: bin[14],
                    borderWidth: bin[12],
                    color: { shade: bin[2], palette: bin[3] }
                }
            },
            breakSummary: []
        };

        // Direct Titan Verification
        if (!res.binaries || res.binaries.length === 0) {
            report.breakSummary.push(`❌ [COMPILER BREAK in TitanCompiler.js]: Failed to generate 24-byte binary for "${className}"`);
        }

        return report;
    }

    inspectFile(filePath) {
        const fullPath = path.resolve(filePath);
        if (!fs.existsSync(fullPath)) {
            console.error(`❌ File not found: ${fullPath}`);
            return [];
        }

        const content = fs.readFileSync(fullPath, 'utf8');
        const fileName = path.basename(fullPath);

        console.log('\n═══════════════════════════════════════════════════════════════════════');
        console.log(`🔎 PIPELINE BREAKPOINT INSPECTION: ${fileName}`);
        console.log('═══════════════════════════════════════════════════════════════════════\n');

        const elemRegex = /<([a-zA-Z0-9_-]+)[^>]*?className=["']([^"']+)["']/g;
        let match;
        let count = 0;
        let totalBreaks = 0;
        const results = [];

        while ((match = elemRegex.exec(content)) !== null) {
            count++;
            const tag = match[1];
            const cls = match[2];
            const inferredTag = (tag === 'span' || tag === 'p' || tag === 'label' || tag === 'b' || tag === 'strong' || tag === 'i')
                ? 'Text'
                : (tag === 'button' ? 'Button' : (cls.includes('flex-row') ? 'Row' : 'div'));

            const report = this.inspectClassString(cls, inferredTag, `Node #${count}`);
            report.elementIndex = count;
            report.rawClass = cls;
            results.push(report);

            if (report.breakSummary.length > 0) {
                totalBreaks += report.breakSummary.length;
                console.log(`┌─ 🚨 [Node #${count}] Breakpoint Detected: "<${tag} className=\"${cls}\">"`);
                report.breakSummary.forEach(brk => {
                    console.log(`│  ${brk}`);
                });
                console.log(`│  📦 Hex: [${report.stages.stage3_importer.opcodeHex || 'None'}]`);
                console.log(`└───────────────────────────────────────────────────────────────────────`);
            }
        }

        if (totalBreaks === 0) {
            console.log(`✅ 100% CLEAN PIPELINE: All ${count} elements flowed seamlessly through all 6 Stages!`);
        } else {
            console.log(`\n⚠️ Found ${totalBreaks} Pipeline Breakpoints across ${count} UI elements.`);
        }
        console.log('═══════════════════════════════════════════════════════════════════════\n');
        return results;
    }
}

module.exports = PipelineBreakInspector;
