'use strict';

const UniversalUIImporter = require('../src/ui/UniversalUIImporter');
const TitanKotlinSimulator = require('./TitanKotlinSimulator');
const ub = require('../src/framework/ub');

/**
 * 🔍 CssComparator — 3-Way JSX vs Opcode vs Kotlin Applied Comparison Engine
 */
class CssComparator {
    constructor() {
        this.importer = new UniversalUIImporter();
        this.simulator = new TitanKotlinSimulator();
    }

    /**
     * Compare a single JSX element schema or component AST
     */
    auditComponent(elementAst, label = '') {
        const result = {
            label,
            jsxTag: elementAst.type === 'element' ? elementAst.tag : (elementAst.type || 'div'),
            jsxClassName: (elementAst.props && elementAst.props.className) || elementAst.className || '',
            parsedTailwind: null,
            compiledOpcode: null,
            kotlinSimulation: null,
            discrepancies: []
        };

        // 1. Parse Tailwind
        if (result.jsxClassName) {
            result.parsedTailwind = ub.parseTW(result.jsxClassName);
        }

        // 2. Compile into 24-byte Opcode
        try {
            const compiled = this.importer.importSchema(elementAst);
            if (compiled && compiled.binaries && compiled.binaries.length > 0) {
                const bin = compiled.binaries[0];
                const strPool = compiled.stringPool ? compiled.stringPool.join('') : '';
                result.compiledOpcode = Array.from(bin);
                result.kotlinSimulation = this.simulator.decodeOpcode(bin, strPool);
            }
        } catch (e) {
            result.discrepancies.push(`Compilation error: ${e.message}`);
        }

        // 3. Find Discrepancies (Bugs)
        const tw = result.jsxClassName;
        if (tw) {
            // Check padding
            const padMatch = tw.match(/(?:^|\s)p-(\d+)(?:\s|$)/);
            if (padMatch && result.kotlinSimulation) {
                const expectedPx = parseInt(padMatch[1]) * 4;
                const actualPad = result.kotlinSimulation.padding.top;
                if (actualPad !== expectedPx) {
                    result.discrepancies.push(`Padding Mismatch: Expected ${expectedPx}px from 'p-${padMatch[1]}', got ${actualPad}px in opcode`);
                }
            }

            // Check corner radius
            if (tw.includes('rounded-2xl') && result.kotlinSimulation) {
                if (result.kotlinSimulation.cornerRadius !== '16px') {
                    result.discrepancies.push(`Radius Mismatch: Expected 16px from 'rounded-2xl', got ${result.kotlinSimulation.cornerRadius}`);
                }
            } else if (tw.includes('rounded-xl') && result.kotlinSimulation) {
                if (result.kotlinSimulation.cornerRadius !== '12px') {
                    result.discrepancies.push(`Radius Mismatch: Expected 12px from 'rounded-xl', got ${result.kotlinSimulation.cornerRadius}`);
                }
            }

            // Check opacity slash
            if (tw.includes('/') && !tw.includes('//')) {
                const opacityMatches = tw.match(/[a-z0-9\-]+\/\d+/g);
                if (opacityMatches && opacityMatches.length > 0) {
                    result.discrepancies.push(`Opacity Slash Detected: [${opacityMatches.join(', ')}] - Verify alpha channel in Kotlin GradientDrawable`);
                }
            }
        }

        return result;
    }
}

module.exports = CssComparator;
