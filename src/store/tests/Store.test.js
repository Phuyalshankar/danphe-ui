'use strict';

const assert = require('assert');
const { createStore } = require('../DolphinNanoStore');
const StateExpressionParser = require('../StateExpressionParser');

/**
 * 🧪 Unit Tests for DolphinJS NanoStore Engine (`src/store`)
 */
function runStoreTests() {
    console.log('🧪 Running Dolphin NanoStore & Kotlin Sync Unit Tests...');

    // Test 1: NanoStore Reactive Creation & Set
    const store = createStore({ counter: 10, name: 'Dolphin' });
    assert.strictEqual(store.get('counter'), 10);

    store.set('counter', 11);
    assert.strictEqual(store.get('counter'), 11);
    console.log('   ✅ NanoStore Reactive Set Test Passed');

    // Test 2: State Expression Parser
    const assignExp = StateExpressionParser.parseExpression('counter:=42');
    assert.strictEqual(assignExp.type, 'ASSIGN');
    assert.strictEqual(assignExp.key, 'counter');
    assert.strictEqual(assignExp.value, '42');

    const incExp = StateExpressionParser.parseExpression('counter+=5');
    assert.strictEqual(incExp.type, 'INCREMENT');
    assert.strictEqual(incExp.amount, 5);

    const toggleExp = StateExpressionParser.parseExpression('darkMode!=');
    assert.strictEqual(toggleExp.type, 'TOGGLE');
    assert.strictEqual(toggleExp.key, 'darkMode');
    console.log('   ✅ State Expression Parser Test Passed');

    // Test 3: Initial State Marker Serialization
    const payloadStr = StateExpressionParser.serializeInitialState({ counter: 0 });
    assert.ok(payloadStr.includes('__DOLPHIN_INITIAL_STATE__:'));

    const parsedState = StateExpressionParser.parseInitialStatePayload(Buffer.from(payloadStr));
    assert.strictEqual(parsedState.counter, 0);
    console.log('   ✅ Initial State Marker Sync Test Passed');

    console.log('🎉 All NanoStore & State Sync Unit Tests Passed Successfully!\n');
}

if (require.main === module) {
    runStoreTests();
}

module.exports = { runStoreTests };
