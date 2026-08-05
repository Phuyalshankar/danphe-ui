'use strict';

/**
 * 🧪 Framework Module Unit Test
 */
const animationSystem = require('../animation');
const ubColors = require('../ub/ubColors');
const ubParser = require('../ub/ubParser');

function runTests() {
    console.log('🧪 Testing src/framework modules...');

    // Test 1: Animation map sanity
    if (!animationSystem.ANIMATION_MAP || typeof animationSystem.ANIMATION_MAP.pulse !== 'number') {
        throw new Error('Animation map failed validation');
    }
    console.log('  ✅ Animation System map validated (pulse opcode: 0x' + animationSystem.ANIMATION_MAP.pulse.toString(16) + ')');

    // Test 2: Color index map
    if (!ubColors.COLOR_INDEX_MAP || typeof ubColors.COLOR_INDEX_MAP.slate !== 'number') {
        throw new Error('Color index map failed validation');
    }
    console.log('  ✅ Color Engine index map validated (slate index: ' + ubColors.COLOR_INDEX_MAP.slate + ')');

    // Test 3: Parser sanity
    if (typeof ubParser.parseClasses !== 'function') {
        throw new Error('Parser parseClasses function missing');
    }
    console.log('  ✅ UB Parser engine validated');

    console.log('✨ All src/framework tests passed!');
}

if (require.main === module) {
    runTests();
}

module.exports = { runTests };
