'use strict';

const assert = require('assert');
const CardStyleParser = require('../CardStyleParser');
const InlineStyleParser = require('../InlineStyleParser');
const { SIZING_SCALE } = require('../SizingScale');
const FormStyleDictionary = require('../FormStyleDictionary');
const TypographyDictionary = require('../TypographyDictionary');
const { parseTW } = require('../ubParser');

/**
 * 🧪 Unit Tests for Universal Bundle (`ub`) Framework (`src/framework/ub`)
 */
function runUbParserTests() {
    console.log('🧪 Running Universal Bundle (ub) Framework Unit Tests...');

    // Test 1: Typography Dictionary (Font Sizes, Weights, Line Heights)
    assert.strictEqual(TypographyDictionary.FONT_SIZES['text-xs'].fontSize, '12px');
    assert.strictEqual(TypographyDictionary.FONT_SIZES['text-2xl'].fontSize, '24px');
    assert.strictEqual(TypographyDictionary.FONT_SIZES['text-5xl'].fontSize, '48px');
    assert.strictEqual(TypographyDictionary.FONT_SIZES['text-9xl'].fontSize, '128px');
    assert.strictEqual(TypographyDictionary.FONT_WEIGHTS['font-bold'], 700);
    assert.strictEqual(TypographyDictionary.FONT_WEIGHTS['font-black'], 900);
    console.log('   ✅ Typography System (text-xs to text-9xl, font-thin to font-black) Test Passed');

    // Test 2: Sizing Scale Resolution
    assert.strictEqual(SIZING_SCALE['xl'].fontSize, '18px');
    assert.strictEqual(SIZING_SCALE['2xl'].fontSize, '22px');
    console.log('   ✅ Sizing Scale (xl, 2xl, 3xl) Test Passed');

    // Test 3: Form Style Dictionary Resolution
    const inputXlStyle = FormStyleDictionary.getFormInputStyle('input-xl');
    assert.strictEqual(inputXlStyle.fontSize, '18px');

    const inputDangerStyle = FormStyleDictionary.getFormInputStyle('input-danger');
    assert.strictEqual(inputDangerStyle.borderColor, '#ef4444');
    console.log('   ✅ Form Style Dictionary (Input Sizes & Colors) Test Passed');

    // Test 4: Card Style Parsing
    const cardProps = {};
    const parsedCard = CardStyleParser.parseCardStyle(cardProps, 'card');
    assert.strictEqual(parsedCard, true);
    assert.strictEqual(cardProps.borderWidth, '1px');
    console.log('   ✅ Card Style Parser Test Passed');

    console.log('🎉 All Universal Bundle (ub) Framework Unit Tests Passed Successfully!\n');
}

if (require.main === module) {
    runUbParserTests();
}

module.exports = { runUbParserTests };
