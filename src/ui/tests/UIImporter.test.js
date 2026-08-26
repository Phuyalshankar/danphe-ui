'use strict';

const assert = require('assert');
const BorderFlagDetector = require('../BorderFlagDetector');
const SignatureBitCalculator = require('../SignatureBitCalculator');
const ComponentOpcodeMapper = require('../ComponentOpcodeMapper');

/**
 * 🧪 Unit Tests for DolphinJS UI Engine Module (`src/ui`)
 */
function runUITests() {
    console.log('🧪 Running Dolphin UI Engine Unit Tests...');

    // Test 1: Border Flag Detection
    assert.strictEqual(BorderFlagDetector.hasValidBorder({ className: 'card border border-slate-200' }, 'border'), true);
    assert.strictEqual(BorderFlagDetector.hasValidBorder({ border: true }), true);
    assert.strictEqual(BorderFlagDetector.hasValidBorder({ className: 'p-4 bg-white' }, ''), false);
    console.log('   ✅ Border Flag Detector Test Passed');

    // Test 2: Signature Bit Calculation
    const sigWithBorder = SignatureBitCalculator.calculateSignature({ border: true }, 'border');
    assert.strictEqual((sigWithBorder & 0x04) !== 0, true);
    console.log('   ✅ Signature Bit Calculator Test Passed');

    // Test 3: Component Opcode Mapping
    assert.strictEqual(ComponentOpcodeMapper.mapOpcode('button'), 0x10);
    assert.strictEqual(ComponentOpcodeMapper.mapOpcode('card'), 0x11);
    assert.strictEqual(ComponentOpcodeMapper.mapOpcode('row'), 0x14);
    assert.strictEqual(ComponentOpcodeMapper.mapOpcode('column'), 0x13);
    assert.strictEqual(ComponentOpcodeMapper.mapOpcode('div', 'grid-cols-4'), 0x22);
    console.log('   ✅ Component Opcode Mapper Test Passed');

    console.log('🎉 All UI Engine Unit Tests Passed Successfully!\n');
}

if (require.main === module) {
    runUITests();
}

module.exports = { runUITests };
