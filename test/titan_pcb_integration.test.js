'use strict';

/**
 * 🧪 TITAN CARD MODULAR PCB AUTOMATED INTEGRATION TEST SUITE
 * Tests 16-bit register bank, signal lines, Affine Matrix math,
 * Clipboard, File Drop, and Vector Draw streams.
 */

const assert = require('assert');
const { TitanCardPCB, TITAN_REG, INPUT_SIGNAL } = require('../lib/TitanCardPCB.js');

console.log('🐬 Running TitanCardPCB Integration Test Suite...\n');

// ── TEST 1: Register Initialization ──
{
    const pcb = new TitanCardPCB();
    assert.strictEqual(pcb.read(TITAN_REG.SYS_STATUS), 1, 'System status register should be 1 (Ready)');
    assert.strictEqual(pcb.read(TITAN_REG.VIDEO_SCALE), 100, 'Default video scale should be 100%');
    assert.strictEqual(pcb.read(TITAN_REG.TYPO_FONT_OPCODE), 32, 'Default font opcode should be 0x20 (Sagarmatha)');
    console.log('✅ TEST 1 PASSED: Register Initialization & Defaults');
}

// ── TEST 2: Mouse Drag Signal & Position Registers ──
{
    const pcb = new TitanCardPCB();
    pcb.sendMouseDrag(25, -15);
    assert.strictEqual(pcb.readSigned(TITAN_REG.VIDEO_POS_X), 25, 'Video Pos X should update on drag delta');
    assert.strictEqual(pcb.readSigned(TITAN_REG.VIDEO_POS_Y), -15, 'Video Pos Y should update on drag delta');
    pcb.sendMouseDrag(-10, 5);
    assert.strictEqual(pcb.readSigned(TITAN_REG.VIDEO_POS_X), 15, 'Video Pos X should accumulate');
    assert.strictEqual(pcb.readSigned(TITAN_REG.VIDEO_POS_Y), -10, 'Video Pos Y should accumulate');
    console.log('✅ TEST 2 PASSED: Mouse Drag Delta Signal Line');
}

// ── TEST 3: Wheel Zoom Signal & Clamping ──
{
    const pcb = new TitanCardPCB();
    pcb.sendZoom(1.2); // 100 * 1.2 = 120
    assert.strictEqual(pcb.read(TITAN_REG.VIDEO_SCALE), 120, 'Scale should zoom to 120%');
    pcb.sendZoom(5.0); // 120 * 5.0 = 600 -> Clamped to 400
    assert.strictEqual(pcb.read(TITAN_REG.VIDEO_SCALE), 400, 'Scale should clamp to max 400%');
    pcb.sendZoom(0.01); // Clamped to min 10
    assert.strictEqual(pcb.read(TITAN_REG.VIDEO_SCALE), 10, 'Scale should clamp to min 10%');
    console.log('✅ TEST 3 PASSED: Wheel Zoom Signal & Clamping');
}

// ── TEST 4: Tool Select & Card Switch Signals ──
{
    const pcb = new TitanCardPCB();
    pcb.selectTool(0x4002);
    assert.strictEqual(pcb.read(TITAN_REG.SYS_ACTIVE_TOOL), 0x4002, 'Active tool should be set');
    pcb.switchCard(3);
    assert.strictEqual(pcb.read(TITAN_REG.SYS_ACTIVE_CARD), 3, 'Active card should be set');
    console.log('✅ TEST 4 PASSED: Tool Select & Card Switch Signal Lines');
}

// ── TEST 5: Clipboard (Copy / Paste / Duplicate) Signals ──
{
    const pcb = new TitanCardPCB();
    pcb.copyLayer({ id: 'layer_title_1', font: 'Sagarmatha' });
    assert.deepStrictEqual(pcb.clipboard, { id: 'layer_title_1', font: 'Sagarmatha' }, 'Clipboard should store copied layer');
    
    const pasteRes = pcb.pasteLayer('track_2');
    assert.ok(pasteRes.cliLog.includes('CLIPBOARD_PASTE') || pcb.lastCliMessage.includes('CLIPBOARD_PASTE'), 'Paste signal should log');
    console.log('✅ TEST 5 PASSED: Clipboard Copy / Paste / Duplicate Signal Lines');
}

// ── TEST 6: File Drop Ingestion Signal ──
{
    const pcb = new TitanCardPCB();
    pcb.dropFiles(['video.mp4', 'soundtrack.wav', 'logo.png']);
    assert.ok(pcb.lastCliMessage.includes('FILE_DROP: 3 items'), 'File drop signal should register 3 files');
    console.log('✅ TEST 6 PASSED: Media File Drag & Drop Ingest Signal Line');
}

// ── TEST 7: Vector Draw Stroke Stream & Commit ──
{
    const pcb = new TitanCardPCB();
    pcb.sendDrawPoint(100, 150, 0.8);
    pcb.sendDrawPoint(110, 160, 0.9);
    pcb.sendDrawPoint(125, 175, 1.0);
    assert.strictEqual(pcb.currentStroke.length, 3, 'Current stroke should accumulate 3 points');
    
    pcb.commitDrawStroke();
    assert.strictEqual(pcb.userPaths.length, 1, 'User paths should contain 1 committed path');
    assert.strictEqual(pcb.currentStroke, null, 'Current stroke should be cleared after commit');
    console.log('✅ TEST 7 PASSED: Vector Draw Stroke Stream & Commit');
}

// ── TEST 8: 120 FPS Affine Matrix Output Math ──
{
    const pcb = new TitanCardPCB();
    pcb.write(TITAN_REG.VIDEO_SCALE, 200); // 2.0x
    pcb.write(TITAN_REG.VIDEO_ROTATION, 90); // 90 deg -> cos(90) ~= 0, sin(90) ~= 1
    pcb.write(TITAN_REG.VIDEO_POS_X, 50);
    pcb.write(TITAN_REG.VIDEO_POS_Y, -30);

    const frame = pcb.generateOutputPacket(1.5);
    assert.strictEqual(frame.frameId, 1, 'Frame ID should increment');
    assert.strictEqual(frame.timeSec, 1.5, 'TimeSec should match');
    assert.strictEqual(frame.matrix[4], 50, 'Matrix Tx should match PosX');
    assert.strictEqual(frame.matrix[5], -30, 'Matrix Ty should match PosY');
    assert.ok(Math.abs(frame.matrix[0]) < 0.001, 'Matrix a (2.0 * cos(90)) should be ~0');
    assert.ok(Math.abs(frame.matrix[1] - 2.0) < 0.001, 'Matrix b (2.0 * sin(90)) should be ~2.0');
    console.log('✅ TEST 8 PASSED: 120 FPS 2D Affine Matrix Computation Math');
}

console.log('\n🎉 ALL 8 TITAN CARD PCB INTEGRATION TESTS PASSED 100%!\n');
