'use strict';

const assert = require('assert');
const { GPS } = require('../GPS');
const { Camera } = require('../Camera');
const { Haptic } = require('../Haptic');
const { Battery } = require('../Battery');
const { Torch } = require('../Torch');
const { HW_CMD } = require('../protocol');

/**
 * 🧪 Unit Tests for DolphinJS Hardware API Descriptors (`src/hardware`)
 */
function runHardwareApiTests() {
    console.log('🧪 Running Dolphin Hardware API Unit Tests...');

    // Test 1: GPS Descriptor
    const gpsRes = GPS.getLocation({ accuracy: 'high' });
    assert.strictEqual(gpsRes._hw, true);
    assert.strictEqual(gpsRes.cmd, HW_CMD.GPS_GET);
    assert.strictEqual(GPS._action.get, 'hw:gps:get');
    console.log('   ✅ GPS Descriptor Test Passed');

    // Test 2: Camera Descriptor
    const camRes = Camera.takePicture({ quality: 95 });
    assert.strictEqual(camRes._hw, true);
    assert.strictEqual(camRes.cmd, HW_CMD.CAMERA_TAKE_PHOTO);
    assert.strictEqual(camRes.params.quality, 95);
    assert.strictEqual(Camera._action.takePhoto, 'hw:camera:take_photo');
    console.log('   ✅ Camera Descriptor Test Passed');

    // Test 3: Haptic Descriptor
    const hapticRes = Haptic.vibrate(200);
    assert.strictEqual(hapticRes._hw, true);
    assert.strictEqual(hapticRes.cmd, HW_CMD.VIBRATE);
    assert.strictEqual(hapticRes.params.ms, 200);
    console.log('   ✅ Haptic Descriptor Test Passed');

    // Test 4: Battery Descriptor
    const batteryRes = Battery.getStatus();
    assert.strictEqual(batteryRes._hw, true);
    assert.strictEqual(batteryRes.cmd, HW_CMD.BATTERY_LEVEL);
    console.log('   ✅ Battery Descriptor Test Passed');

    // Test 5: Torch Descriptor
    const torchRes = Torch.on();
    assert.strictEqual(torchRes._hw, true);
    assert.strictEqual(torchRes.cmd, HW_CMD.TORCH_ON);
    console.log('   ✅ Torch Descriptor Test Passed');

    console.log('🎉 All Hardware API Unit Tests Passed Successfully!\n');
}

if (require.main === module) {
    runHardwareApiTests();
}

module.exports = { runHardwareApiTests };
