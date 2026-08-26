'use strict';

const assert = require('assert');
const { TitanFrameBuilder, TITAN_FRAME } = require('../TitanFrameBuilder');

/**
 * 🧪 Unit Tests for DolphinJS Realtime Engine (`src/realtime`)
 */
function runRealtimeTests() {
    console.log('🧪 Running Dolphin Realtime Engine Unit Tests...');

    // Test 1: Frame Building & Parsing
    const frame = TitanFrameBuilder.buildFrame(TITAN_FRAME.PUBLISH, 'test-channel', { message: 'hello' });
    assert.ok(frame.length > 39);
    assert.strictEqual(frame.readUInt8(0), 0x54); // 'T'
    assert.strictEqual(frame.readUInt8(1), 0x42); // 'B'

    const parsed = TitanFrameBuilder.parseFrame(frame);
    assert.notStrictEqual(parsed, null);
    assert.strictEqual(parsed.type, TITAN_FRAME.PUBLISH);
    assert.strictEqual(parsed.channel, 'test-channel');
    console.log('   ✅ Titan Frame Encoder/Decoder Test Passed');

    console.log('🎉 All Realtime Engine Unit Tests Passed Successfully!\n');
}

if (require.main === module) {
    runRealtimeTests();
}

module.exports = { runRealtimeTests };
