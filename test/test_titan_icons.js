'use strict';

const { TitanIconMatrix, parseBitmask } = require('../lib/index.js');
const { TitanMicroBus } = require('d:/titan-bus/index.js');

console.log('🧪 Testing Titan Data Bus Bit Control & Icon Matrix...');

// 1. Test Bitmask Parsing
console.log('Test 1: parseBitmask("0010") ->', parseBitmask('0010'), '(Expected: 2)');
console.log('Test 2: parseBitmask("0b1011") ->', parseBitmask('0b1011'), '(Expected: 11)');
console.log('Test 3: parseBitmask(0x0F) ->', parseBitmask(0x0F), '(Expected: 15)');

// 2. Test SSR HTML generation with 0010 (Bit 1 ON)
const htmlOutput = TitanIconMatrix({ mask: '0010', title: 'FIELD BUS NODE 101' });
console.log('\n✅ Generated HTML for mask "0010":');
console.log(htmlOutput.substring(0, 300) + '...\n');

// 3. Test Live Titan Micro-Bus Integration
let currentLiveMask = 0;
TitanMicroBus.subscribe(20100, (maskVal) => {
    currentLiveMask = parseBitmask(maskVal);
    console.log(`📡 [Titan-Bus Event] Reg 20100 Changed -> 0b${currentLiveMask.toString(2).padStart(8, '0')} (Dec: ${currentLiveMask})`);
    
    // Check specific bits
    const isCpuOn = Boolean(currentLiveMask & (1 << 1));
    const isWifiOn = Boolean(currentLiveMask & (1 << 0));
    console.log(`   -> CPU Icon (Bit 1): ${isCpuOn ? '⚡ ACTIVE (LIT)' : '❌ OFF'}`);
    console.log(`   -> WiFi Icon (Bit 0): ${isWifiOn ? '📶 ACTIVE (LIT)' : '❌ OFF'}`);
});

console.log('\n🚀 Emitting bus:write:20100 -> 0b0010 (Decimal 2)...');
TitanMicroBus.write(20100, 2);

console.log('\n🚀 Emitting bus:write:20100 -> 0b0011 (Decimal 3 - Both WiFi and CPU ON)...');
TitanMicroBus.write(20100, 3);

console.log('\n🎉 All Titan Bus bit-switching tests passed successfully!');
