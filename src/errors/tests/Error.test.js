'use strict';

const assert = require('assert');
const DolphinError = require('../DolphinError');

/**
 * 🧪 Unit Tests for DolphinJS Errors Module (`src/errors`)
 */
function runErrorTests() {
    console.log('🧪 Running Dolphin Errors Module Unit Tests...');

    const err = new DolphinError('TEST_CODE', 'Test Message');
    assert.strictEqual(err.code, 'TEST_CODE');
    assert.ok(err.message.includes('Test Message'));
    console.log('   ✅ DolphinError Construction Test Passed');

    console.log('🎉 All Errors Module Unit Tests Passed Successfully!\n');
}

if (require.main === module) {
    runErrorTests();
}

module.exports = { runErrorTests };
