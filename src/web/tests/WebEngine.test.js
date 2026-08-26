'use strict';

const assert = require('assert');
const WebSeoGenerator = require('../WebSeoGenerator');

/**
 * 🧪 Unit Tests for DolphinJS Web Engine Module (`src/web`)
 */
function runWebEngineTests() {
    console.log('🧪 Running Dolphin Web Engine Unit Tests...');

    // Test 1: SEO Header Generation
    const seoHtml = WebSeoGenerator.generateSeoHeaders({ title: 'My Page', description: 'Test Description' });
    assert.ok(seoHtml.includes('<title>My Page</title>'));
    assert.ok(seoHtml.includes('name="description" content="Test Description"'));
    console.log('   ✅ Web SEO Generator Test Passed');

    console.log('🎉 All Web Engine Unit Tests Passed Successfully!\n');
}

if (require.main === module) {
    runWebEngineTests();
}

module.exports = { runWebEngineTests };
