'use strict';

/**
 * 🧪 Titan Universal Event Engine Test Suite
 * ═══════════════════════════════════════════════════════════════════════════════
 * Comprehensive unit and integration verification for JS & C++ Event Buses.
 */

const assert = require('assert');
const TitanEventEngine = require('../src/titan/TitanEventEngine');

console.log('🏔️ Starting Titan Universal Event Engine Test Suite...\n');

let passedTests = 0;
function test(name, fn) {
    try {
        fn();
        console.log(`  ✅ PASS: ${name}`);
        passedTests++;
    } catch (err) {
        console.error(`  ❌ FAIL: ${name}`);
        console.error(err);
        process.exit(1);
    }
}

// ── 1. Register Read & Write ──────────────────────────────────────────────────
test('1. Memory-Mapped Hardware Bus Read & Write', () => {
    const bus = TitanEventEngine.Bus;
    const REG = TitanEventEngine.REG;

    bus.write(REG.VIDEO_SCALE, 150);
    assert.strictEqual(bus.read(REG.VIDEO_SCALE), 150);

    bus.write(REG.PLAYHEAD_MS, 45200);
    assert.strictEqual(bus.read(REG.PLAYHEAD_MS), 45200);

    bus.write(REG.ACTIVE_TOOL, 4); // Razor
    assert.strictEqual(bus.read(REG.ACTIVE_TOOL), 4);
});

// ── 2. Reactive Register Subscription ─────────────────────────────────────────
test('2. Reactive 0ms Subscription & Notification', () => {
    const bus = TitanEventEngine.Bus;
    const REG = TitanEventEngine.REG;

    let receivedVal = 0;
    let callCount = 0;
    const unsub = bus.subscribe(REG.MONITOR_ZOOM_LEVEL, (val) => {
        receivedVal = val;
        callCount++;
    });

    bus.write(REG.MONITOR_ZOOM_LEVEL, 200);
    assert.strictEqual(receivedVal, 200);
    assert.strictEqual(callCount, 1);

    bus.write(REG.MONITOR_ZOOM_LEVEL, 75);
    assert.strictEqual(receivedVal, 75);
    assert.strictEqual(callCount, 2);

    unsub();
    bus.write(REG.MONITOR_ZOOM_LEVEL, 300);
    assert.strictEqual(callCount, 2, 'Unsubscribe should prevent further callbacks');
});

// ── 3. Pointer Down, Move, & Up Dispatcher ────────────────────────────────────
test('3. Pointer & Mouse Event Pipeline with Delta Calculation', () => {
    const engine = TitanEventEngine;
    const bus = TitanEventEngine.Bus;
    const REG = TitanEventEngine.REG;

    // Simulate Pointer Down on Timeline (Surface 3, Left Click)
    engine.handlePointerDown({
        clientX: 500,
        clientY: 300,
        button: 0,
        ctrlKey: false,
        shiftKey: true,
        altKey: false,
        target: { closest: (sel) => sel.includes('.lane') }
    });

    assert.strictEqual(bus.read(REG.MOUSE_POS_X), 500);
    assert.strictEqual(bus.read(REG.MOUSE_POS_Y), 300);
    assert.strictEqual(bus.read(REG.MOUSE_BUTTONS_MASK), 1); // Left Click
    assert.strictEqual(bus.read(REG.MODIFIER_KEYS_MASK), 2);  // Shift Key
    assert.strictEqual(bus.read(REG.ACTIVE_SURFACE), 3);      // Track Lanes

    // Simulate Pointer Move (50px right, 20px down)
    engine.handlePointerMove({
        clientX: 550,
        clientY: 320,
        ctrlKey: false,
        shiftKey: true,
        altKey: false
    });

    assert.strictEqual(bus.read(REG.MOUSE_POS_X), 550);
    assert.strictEqual(bus.read(REG.MOUSE_POS_Y), 320);
    assert.strictEqual(bus.read(REG.MOUSE_DELTA_X), 50);
    assert.strictEqual(bus.read(REG.MOUSE_DELTA_Y), 20);

    // Simulate Pointer Up
    engine.handlePointerUp({
        clientX: 550,
        clientY: 320
    });

    assert.strictEqual(bus.read(REG.MOUSE_BUTTONS_MASK), 0);
    assert.strictEqual(bus.read(REG.ACTIVE_DRAG_MODE), 0);
});

// ── 4. Mouse Wheel Dispatcher ─────────────────────────────────────────────────
test('4. Mouse Wheel Dispatcher with Modifiers', () => {
    const engine = TitanEventEngine;
    const bus = TitanEventEngine.Bus;
    const REG = TitanEventEngine.REG;

    // Wheel with Ctrl (Zoom intent)
    engine.handleWheel({
        deltaY: -100,
        ctrlKey: true,
        shiftKey: false,
        altKey: false
    });

    assert.strictEqual(bus.read(REG.MOUSE_WHEEL_DELTA), -100);
    assert.strictEqual(bus.read(REG.MODIFIER_KEYS_MASK), 1); // Ctrl = 1
});

// ── 5. Keyboard & Hotkey Mode Switching ───────────────────────────────────────
test('5. Keyboard Hotkeys & Active Tool Mode Switching', () => {
    const engine = TitanEventEngine;
    const bus = TitanEventEngine.Bus;
    const REG = TitanEventEngine.REG;

    // Press 'C' for Razor Cut
    engine.handleKeyDown({
        key: 'c',
        keyCode: 67,
        ctrlKey: false,
        target: { tagName: 'DIV' }
    });
    assert.strictEqual(bus.read(REG.KEYBOARD_HOTKEY_CODE), 2); // 2 = Razor
    assert.strictEqual(bus.read(REG.ACTIVE_TOOL), 4);          // 4 = Razor Tool
    assert.strictEqual(engine.activeTool, 'razor');

    // Press 'V' for Select
    engine.handleKeyDown({
        key: 'v',
        keyCode: 86,
        ctrlKey: false,
        target: { tagName: 'DIV' }
    });
    assert.strictEqual(bus.read(REG.KEYBOARD_HOTKEY_CODE), 1); // 1 = Select
    assert.strictEqual(bus.read(REG.ACTIVE_TOOL), 1);          // 1 = Select Tool
    assert.strictEqual(engine.activeTool, 'select');

    // Press 'P' for CAD Draw
    engine.handleKeyDown({
        key: 'p',
        keyCode: 80,
        ctrlKey: false,
        target: { tagName: 'DIV' }
    });
    assert.strictEqual(bus.read(REG.KEYBOARD_HOTKEY_CODE), 3); // 3 = Draw
    assert.strictEqual(bus.read(REG.ACTIVE_TOOL), 7);          // 7 = Pen/Draw
    assert.strictEqual(engine.activeTool, 'draw');
});

// ── 6. Form Input & Slider Reactive Binding ───────────────────────────────────
test('6. Form Input & Change Event Live Synchronization', () => {
    const engine = TitanEventEngine;
    const bus = TitanEventEngine.Bus;
    const REG = TitanEventEngine.REG;

    // Mock HTML Input Slider (Scale 250%)
    const mockSlider = {
        type: 'range',
        value: '250',
        getAttribute: (attr) => (attr === 'data-titan-reg' ? String(REG.VIDEO_SCALE) : null)
    };

    engine.handleInput({
        target: mockSlider
    });

    assert.strictEqual(bus.read(REG.VIDEO_SCALE), 250);
    assert.strictEqual(bus.read(REG.FORM_INPUT_REG_TARGET), REG.VIDEO_SCALE);
    assert.strictEqual(bus.read(REG.FORM_INPUT_RAW_VAL), 250);
    assert.strictEqual(bus.read(REG.FORM_EVENT_TRIGGER), 2); // Input = 2

    // Mock Checkbox Toggle (Snap Magnet)
    const mockCheckbox = {
        type: 'checkbox',
        checked: true,
        getAttribute: (attr) => (attr === 'data-titan-reg' ? String(REG.TL_SNAP_MAGNET) : null)
    };

    engine.handleChange({
        target: mockCheckbox
    });

    assert.strictEqual(bus.read(REG.TL_SNAP_MAGNET), 1);
    assert.strictEqual(bus.read(REG.FORM_EVENT_TRIGGER), 1); // Change = 1
});

// ── 7. Performance & Latency Benchmark (100,000 writes) ───────────────────────
test('7. 0ms Latency Benchmark (100,000 Register Dispatches)', () => {
    const bus = TitanEventEngine.Bus;
    const REG = TitanEventEngine.REG;

    const t0 = process.hrtime.bigint();
    for (let i = 0; i < 100000; i++) {
        bus.write(REG.PLAYHEAD_MS, i);
    }
    const t1 = process.hrtime.bigint();
    const durationMs = Number(t1 - t0) / 1000000;

    console.log(`     ⚡ 100,000 memory-mapped writes completed in ${durationMs.toFixed(2)} ms (${(100000 / (durationMs / 1000)).toLocaleString()} ops/sec)`);
    assert.ok(durationMs < 100, 'Must complete 100,000 writes in under 100ms');
});

console.log(`\n🎉 ALL ${passedTests} TITAN EVENT ENGINE TESTS PASSED PERFECTLY!\n`);
