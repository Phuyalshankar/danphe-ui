'use strict';

const assert = require('assert');
const AttributeNormalizer = require('../AttributeNormalizer');
const HtmlTagParser = require('../HtmlTagParser');

/**
 * 🧪 Unit Tests for DolphinJS Parser Module (`src/parser`)
 */
function runParserTests() {
    console.log('🧪 Running Dolphin Parser Unit Tests...');

    // Test 1: Attribute Normalization
    assert.strictEqual(AttributeNormalizer.normalizeKey('class'), 'className');
    assert.strictEqual(AttributeNormalizer.normalizeKey('className'), 'className');
    assert.strictEqual(AttributeNormalizer.normalizeKey('onclick'), 'onClick');
    console.log('   ✅ Attribute Normalizer Test Passed');

    // Test 2: ClassName Extraction
    const classProps = AttributeNormalizer.extractClassNameProps('card p-4 border border-slate-200');
    assert.strictEqual(classProps.hasBorder, true);
    assert.strictEqual(classProps.hasCard, true);
    console.log('   ✅ ClassName Props Extraction Test Passed');

    // Test 3: Tag Opcode Resolution
    assert.strictEqual(HtmlTagParser.mapTagToOpcode('button'), 0x10);
    assert.strictEqual(HtmlTagParser.mapTagToOpcode('div'), 0x13);
    assert.strictEqual(HtmlTagParser.mapTagToOpcode('h1'), 0x16);
    assert.strictEqual(HtmlTagParser.mapTagToOpcode('input'), 0x18);
    assert.strictEqual(HtmlTagParser.isVoidTag('img'), true);
    console.log('   ✅ Tag Opcode Resolution Test Passed');

    console.log('🎉 All Parser Unit Tests Passed Successfully!\n');
}

if (require.main === module) {
    runParserTests();
}

module.exports = { runParserTests };
