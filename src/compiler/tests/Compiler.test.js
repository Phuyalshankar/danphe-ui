'use strict';

const assert = require('assert');
const BundleHeaderBuilder = require('../BundleHeaderBuilder');
const StringPoolEncoder = require('../StringPoolEncoder');

/**
 * 🧪 Unit Tests for DolphinJS Compiler Module (`src/compiler`)
 */
function runCompilerTests() {
    console.log('🧪 Running Dolphin Compiler Unit Tests...');

    // Test 1: Header Generation
    const header = BundleHeaderBuilder.buildHeader({ version: 1, screenCount: 2, titanMode: true });
    assert.strictEqual(header.length, 20);
    assert.strictEqual(BundleHeaderBuilder.validateHeader(header), true);
    console.log('   ✅ Bundle Header Builder Test Passed');

    // Test 2: String Pool Encoder
    const pool = new StringPoolEncoder();
    const idx1 = pool.add('Home');
    const idx2 = pool.add('About');
    const idx3 = pool.add('Home'); // Duplicate check

    assert.strictEqual(idx1, 0);
    assert.strictEqual(idx2, 1);
    assert.strictEqual(idx3, 0); // Reused index

    const poolBuf = pool.buildBuffer();
    assert.ok(poolBuf.length > 0);
    console.log('   ✅ String Pool Encoder Test Passed');

    console.log('🎉 All Compiler Unit Tests Passed Successfully!\n');
}

if (require.main === module) {
    runCompilerTests();
}

module.exports = { runCompilerTests };
