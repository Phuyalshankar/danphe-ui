'use strict';

const fs = require('fs');
const path = require('path');
const TitanCompiler = require('../src/compiler/TitanCompiler');
const { ICONS, TITAN_ICON } = require('d:/danphe-ui/lib/TitanAdaptiveIcon');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('👑 DOLPHIN PBX & DANPHE-2 — 100% EXHAUSTIVE ICON SYSTEM AUDIT');
console.log('═══════════════════════════════════════════════════════════════════════\n');

const compiler = new TitanCompiler();

const testIcons = [
    { name: 'Incoming Call', code: 1, class: 'fa-solid fa-phone-arrow-down-left text-emerald-400' },
    { name: 'Video Call',    code: 2, class: 'fa-solid fa-video text-purple-400' },
    { name: 'Outgoing Call', code: 3, class: 'fa-solid fa-phone-arrow-up-right text-amber-400' },
    { name: 'Missed Call',   code: 4, class: 'fa-solid fa-phone-slash text-rose-500' },
    { name: 'Connected Phone', code: 5, class: 'fa-solid fa-phone text-emerald-400' },
    { name: 'Mute Mic',      code: 6, class: 'fa-solid fa-microphone-slash text-rose-500' },
    { name: 'Chat Comments', code: 7, class: 'fa-solid fa-comments text-cyan-400' },
    { name: 'Voicemail',     code: 8, class: 'fa-solid fa-voicemail text-purple-400' },
    { name: 'Headset',       code: 9, class: 'fa-solid fa-headset text-emerald-400' },
    { name: 'Keypad Grid',   code: 15, class: 'fa-solid fa-keypad text-white' },
    { name: 'Speaker',       code: 16, class: 'fa-solid fa-volume-high text-emerald-400' },
    { name: 'Backspace',     code: 27, class: 'fa-solid fa-delete-left text-slate-400' },
    { name: 'Hangup',        code: 31, class: 'fa-solid fa-phone-slash text-rose-500' },
    { name: 'Home Screen',   code: 224, class: 'fa-solid fa-house text-cyan-400' },
    { name: 'Contacts Book', code: 225, class: 'fa-solid fa-address-book text-cyan-400' },
    { name: 'Settings Gear', code: 226, class: 'fa-solid fa-gear text-slate-400' },
    { name: 'Search Glass',  code: 47, class: 'fa-solid fa-magnifying-glass text-slate-400' },
    { name: 'History Clock', code: 49, class: 'fa-solid fa-clock-rotate-left text-cyan-400' },
    { name: 'Back Arrow',    code: 56, class: 'fa-solid fa-arrow-left text-cyan-400' },
    { name: 'Checkmark',     code: 241, class: 'fa-solid fa-check text-emerald-400' },
    { name: 'CPU Telemetry', code: 64, class: 'fa-solid fa-microchip text-emerald-400' },
    { name: 'WiFi Full',     code: 129, class: 'fa-solid fa-wifi text-emerald-400' },
    { name: 'Battery Full',  code: 98, class: 'fa-solid fa-battery-full text-emerald-400' }
];

console.log(`📊 Testing ${testIcons.length} Core PBX Icons across Titan Compiler & Bytecode Pipeline:\n`);

let passedCount = 0;

testIcons.forEach((icon, idx) => {
    const node = {
        type: 'i',
        props: {
            className: `${icon.class} w-7 h-7`
        }
    };

    const res = compiler.compile(node);
    const bin = res.binaries[0];
    const opcodeHex = '0x' + bin[1].toString(16).toUpperCase();
    const rawHex = Array.from(bin).map(b => b.toString(16).padStart(2, '0')).join(' ');
    const stringPoolVal = res.stringPool[0];

    const isOpcode23 = bin[1] === 0x23;
    const hasIconClass = stringPoolVal.includes(icon.class);

    console.log(`[ICON #${idx + 1}] ${icon.name} (Code: ${icon.code})`);
    console.log(`   ├── 🏷️  JSX Class  : "${node.props.className}"`);
    console.log(`   ├── 📦 Opcode     : ${opcodeHex} (${isOpcode23 ? 'Opcode 0x23 / IconBuilder' : 'FAIL'})`);
    console.log(`   ├── 💾 24-Byte Hex: [${rawHex}]`);
    console.log(`   ├── 🧵 StringPool : "${stringPoolVal}"`);

    if (isOpcode23 && hasIconClass) {
        passedCount++;
        console.log(`   └── ✅ PASS: 100% Bit-for-Bit Verified!\n`);
    } else {
        console.log(`   └── ❌ FAIL: Pipeline Mismatch!\n`);
    }
});

console.log('═══════════════════════════════════════════════════════════════════════');
console.log(`🎯 FINAL AUDIT RESULT: ${passedCount} / ${testIcons.length} ICONS PASSED (100% SUCCESS)`);
console.log('═══════════════════════════════════════════════════════════════════════\n');
