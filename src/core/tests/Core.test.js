'use strict';

const assert = require('assert');
const DolphinCSS = require('../DolphinCSS');
const ModuleDiagnosticManager = require('../ModuleDiagnosticManager');

/**
 * 🧪 Unit Tests for DolphinJS Core Engine (`src/core`)
 */
function runCoreTests() {
    console.log('🧪 Running Dolphin Core Engine Unit Tests...');

    // Test 1: DolphinCSS
    assert.ok(DolphinCSS);
    console.log('   ✅ DolphinCSS Core Module Test Passed');

    // Test 2: Module Diagnostic Manager
    ModuleDiagnosticManager.recordFailure('TestComponent', 0x10, new Error('Simulated Compile Error'));
    const failedList = ModuleDiagnosticManager.getFailedModules();
    assert.strictEqual(failedList.length, 1);
    assert.strictEqual(failedList[0].moduleName, 'TestComponent');
    assert.strictEqual(failedList[0].errorMessage, 'Simulated Compile Error');
    console.log('   ✅ Node.js ModuleDiagnosticManager Test Passed');

    console.log('🎉 All Core Engine Unit Tests Passed Successfully!\n');
}

if (require.main === module) {
    runCoreTests();
}

module.exports = { runCoreTests };
