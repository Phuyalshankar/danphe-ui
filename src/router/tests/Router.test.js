'use strict';

const assert = require('assert');
const RouteMatcher = require('../RouteMatcher');
const { DolphinRouter } = require('../DolphinRouter');

/**
 * 🧪 Unit Tests for DolphinJS Router Engine (`src/router`)
 */
function runRouterTests() {
    console.log('🧪 Running Dolphin Router Engine Unit Tests...');

    // Test 1: Route Parameter Matching
    const params = RouteMatcher.matchPath('/user/:id/profile', '/user/42/profile');
    assert.notStrictEqual(params, null);
    assert.strictEqual(params.id, '42');
    console.log('   ✅ Route Parameter Matching Test Passed');

    // Test 2: Query String Parsing
    const query = RouteMatcher.parseQueryParams('tab=settings&mode=dark');
    assert.strictEqual(query.tab, 'settings');
    assert.strictEqual(query.mode, 'dark');
    console.log('   ✅ Query String Parsing Test Passed');

    // Test 3: DolphinRouter Integration
    const router = new DolphinRouter({ mode: 'memory' });
    let visited = false;
    router.get('/about', () => { visited = true; });
    router.push('/about');
    assert.strictEqual(visited, true);
    console.log('   ✅ DolphinRouter Navigation Test Passed');

    console.log('🎉 All Router Engine Unit Tests Passed Successfully!\n');
}

if (require.main === module) {
    runRouterTests();
}

module.exports = { runRouterTests };
