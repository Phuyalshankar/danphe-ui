'use strict';

/**
 * 🐬 TITAN CARD MODULAR HARDWARE PCB (Node.js & Universal JavaScript Module)
 * Packaged Bi-Directional Signal Bus, Memory-Mapped Register Bank & Ready-Made PCB
 * 
 * Hardware-Emulated Bus Architecture:
 * - Left Panel (Media / Overlay / Tracking / 360 Lens)
 * - Right Panel (Animation / Transform / Color / Typo / VFX / Thumbnail Studio)
 * - Top Toolbar (4-Way Cutting, Ripple Delete, 8-Way Vector Draw & Motion Pin)
 * 
 * Single-Line Plug-and-Play Integration:
 * const pcb = new TitanCardPCB({ onOutput: (frame) => renderFrame(frame) });
 * pcb.sendMouseDrag(dx, dy);
 * pcb.sendZoom(zoomFactor);
 * pcb.selectTool('split');
 */

(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        global.TitanCardPCB = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    // ── 1. 16-BIT MEMORY-MAPPED REGISTERS ──
    const TITAN_REG = {
        // System Status (0x4000 - 0x40FF)
        SYS_STATUS:       0x4000,
        SYS_ACTIVE_CARD:  0x4001,
        SYS_ACTIVE_TOOL:  0x4002,
        SYS_TIME_SEC:     0x4003,

        // Video Transform & Motion Matrix (0x4100 - 0x410F)
        VIDEO_SCALE:      0x4100, // 10% - 400%
        VIDEO_ROTATION:   0x4101, // 0 - 360 deg
        VIDEO_POS_X:      0x4102, // Signed 16-bit offset
        VIDEO_POS_Y:      0x4103, // Signed 16-bit offset
        VIDEO_OPACITY:    0x4104, // 0 - 100%
        VIDEO_SPEED:      0x4105, // 100 = 1.0x
        VIDEO_ANCHOR:     0x4106, // 0-8 Grid (TL..BR)

        // Color Grading & Exposure (0x4110 - 0x411F)
        COLOR_HUE:        0x4110, // 0x00 - 0xFF (256 Hues)
        COLOR_TEMP:       0x4111, // 0-100 (Cool to Warm)
        COLOR_SATURATION: 0x4112, // 0-100%
        COLOR_BRIGHTNESS: 0x4113, // 0-100%
        COLOR_MODE:       0x4114, // 0: Solid, 1: Grad, 2: Rainbow

        // Superpower VFX & Aura Shaders (0x4120 - 0x412F)
        VFX_OPCODE:       0x4120, // 0x00 - 0xFF (256 VFX)
        VFX_STROKE_WIDTH: 0x4121, // 1 - 64 px
        VFX_INTENSITY:    0x4122, // 0 - 100%
        VFX_TURBULENCE:   0x4123, // 0 - 100

        // Typography & Subtitles (0x4130 - 0x413F)
        TYPO_FONT_OPCODE: 0x4130, // 0x00 - 0xFF (256 Fonts)
        TYPO_FONT_SIZE:   0x4131, // 12 - 144 px
        TYPO_STROKE_W:    0x4132, // 0 - 16 px
        TYPO_BG_STYLE:    0x4133, // 0: None, 1: Obsidian, 2: Red, 3: Gold, 4: Glass
        TYPO_BG_OPACITY:  0x4134, // 0 - 100%
        TYPO_CURVE_ARC:   0x4135, // -180 to +180 deg (Half circle)
        TYPO_KARAOKE_EN:  0x4136, // 0: Off, 1: Active Word Glow
        TYPO_GRADIENT:    0x4137, // 0: None, 1: Sunset, 2: Cyber, 3: Chrome, 4: Emerald

        // Media, Overlay & AI Head Swap (0x4140 - 0x414F)
        OVERLAY_ACTIVE:   0x4140, // 0: Inactive, 1: Active
        OVERLAY_RATIO:    0x4141, // 0: 16:9, 1: 9:16, 2: 1:1, 3: 4:5
        OVERLAY_ANCHOR:   0x4142, // 0: TL, 1: TR, 2: BL, 3: BR, 4: CC
        HEAD_SWAP_AVATAR: 0x4143, // 0: Cyborg, 1: Lion, 2: Crown, 3: Shades, 4: Cartoon, 5: Alien
        HEAD_WALK_BOB:    0x4144, // 0 - 100%
        HEAD_NECK_PIVOT:  0x4145, // 50 - 120%

        // YouTube Thumbnail Studio (0x4150 - 0x415F)
        THUMB_AI_CUTOUT:  0x4150, // 0: Off, 1: On
        THUMB_STROKE_W:   0x4151, // 0 - 24 px
        THUMB_GLOW_INT:   0x4152, // 0 - 100%
        THUMB_HDR_POP:    0x4153, // 0 - 100%
        THUMB_BG_BLUR:    0x4154, // 0 - 30 px Bokeh

        // Drawing & Filmstrip (0x4160 - 0x416F)
        DRAW_ACTIVE_TOOL: 0x4160, // Tool ID
        DRAW_STROKE_W:    0x4161  // 1 - 32 px
    };

    // ── 2. INPUT SIGNAL TYPES ──
    const INPUT_SIGNAL = {
        MOUSE_DOWN:          'MOUSE_DOWN',
        MOUSE_MOVE:          'MOUSE_MOVE',
        MOUSE_UP:            'MOUSE_UP',
        DRAG_DELTA:          'DRAG_DELTA',
        WHEEL_ZOOM:          'WHEEL_ZOOM',
        TOUCH_PINCH:         'TOUCH_PINCH',
        TOOL_SELECT:         'TOOL_SELECT',
        CARD_SWITCH:         'CARD_SWITCH',
        KEY_IRQ:             'KEY_IRQ',
        CLIPBOARD_COPY:      'CLIPBOARD_COPY',
        CLIPBOARD_PASTE:     'CLIPBOARD_PASTE',
        CLIPBOARD_DUPLICATE: 'CLIPBOARD_DUPLICATE',
        FILE_DROP:           'FILE_DROP',
        DRAW_STROKE_POINT:   'DRAW_STROKE_POINT',
        DRAW_STROKE_COMMIT:  'DRAW_STROKE_COMMIT'
    };

    // ── 3. MASTER TITAN CARD PCB ENGINE CLASS ──
    class TitanCardPCB {
        constructor(options = {}) {
            this.regs = new Uint32Array(4096);
            this.frameId = 0;
            this.timeSec = 0.0;
            this.microBus = options.microBus || null;
            this.onOutput = options.onOutput || null;
            this.onCommandLog = options.onCommandLog || null;

            this.resetDefaultRegisters();

            if (this.microBus && typeof this.microBus.subscribe === 'function') {
                this.bindMicroBus();
            }
        }

        resetDefaultRegisters() {
            this.regs.fill(0);
            this.write(TITAN_REG.SYS_STATUS, 1);
            this.write(TITAN_REG.VIDEO_SCALE, 100);
            this.write(TITAN_REG.VIDEO_OPACITY, 100);
            this.write(TITAN_REG.VIDEO_SPEED, 100);
            this.write(TITAN_REG.COLOR_HUE, 0x10);
            this.write(TITAN_REG.TYPO_FONT_OPCODE, 32); // 0x20 Sagarmatha
            this.write(TITAN_REG.TYPO_FONT_SIZE, 28);
            this.write(TITAN_REG.TYPO_STROKE_W, 3);
            this.write(TITAN_REG.TYPO_BG_OPACITY, 80);
            this.write(TITAN_REG.HEAD_WALK_BOB, 100);
            this.write(TITAN_REG.HEAD_NECK_PIVOT, 90);
            this.write(TITAN_REG.THUMB_STROKE_W, 8);
            this.write(TITAN_REG.THUMB_GLOW_INT, 80);
            this.write(TITAN_REG.THUMB_BG_BLUR, 12);
        }

        bindMicroBus() {
            Object.values(TITAN_REG).forEach(regAddr => {
                this.microBus.subscribe(regAddr, (val) => {
                    this.write(regAddr, val, false);
                });
            });
        }

        // Direct Register Read & Write
        write(addr, val, emitToBus = true) {
            const offset = addr & 0x0FFF;
            this.regs[offset] = Number(val) >>> 0;
            if (emitToBus && this.microBus && typeof this.microBus.write === 'function') {
                this.microBus.write(addr, val);
            }
        }

        read(addr) {
            const offset = addr & 0x0FFF;
            return this.regs[offset] || 0;
        }

        // ── 4. INPUT SIGNAL PROCESSORS (MOUSE, DRAG, ZOOM, TOOLS) ──
        processInputSignal(signal) {
            if (!signal || !signal.type) return;

            switch (signal.type) {
                case INPUT_SIGNAL.DRAG_DELTA: {
                    const curX = (this.read(TITAN_REG.VIDEO_POS_X) | 0) + (signal.deltaX || 0);
                    const curY = (this.read(TITAN_REG.VIDEO_POS_Y) | 0) + (signal.deltaY || 0);
                    this.write(TITAN_REG.VIDEO_POS_X, curX);
                    this.write(TITAN_REG.VIDEO_POS_Y, curY);
                    break;
                }

                case INPUT_SIGNAL.WHEEL_ZOOM: {
                    const curScale = this.read(TITAN_REG.VIDEO_SCALE);
                    const nextScale = Math.max(10, Math.min(400, Math.round(curScale * (signal.zoomFactor || 1.0))));
                    this.write(TITAN_REG.VIDEO_SCALE, nextScale);
                    break;
                }

                case INPUT_SIGNAL.TOOL_SELECT: {
                    this.write(TITAN_REG.SYS_ACTIVE_TOOL, signal.toolId || 0);
                    this.write(TITAN_REG.DRAW_ACTIVE_TOOL, signal.toolId || 0);
                    break;
                }

                case INPUT_SIGNAL.CARD_SWITCH: {
                    this.write(TITAN_REG.SYS_ACTIVE_CARD, signal.cardId || 0);
                    break;
                }

                case INPUT_SIGNAL.CLIPBOARD_COPY: {
                    this.clipboard = signal.payload || { type: 'layer', id: signal.layerId };
                    this.lastCliMessage = `[TITAN_PCB_TX] CLIPBOARD_COPY: ${JSON.stringify(this.clipboard)}`;
                    break;
                }

                case INPUT_SIGNAL.CLIPBOARD_PASTE: {
                    this.lastCliMessage = `[TITAN_PCB_TX] CLIPBOARD_PASTE Target: ${signal.targetTrack || 'active_track'}`;
                    break;
                }

                case INPUT_SIGNAL.CLIPBOARD_DUPLICATE: {
                    this.lastCliMessage = `[TITAN_PCB_TX] CLIPBOARD_DUPLICATE: ${signal.layerId || 'current'}`;
                    break;
                }

                case INPUT_SIGNAL.FILE_DROP: {
                    this.lastCliMessage = `[TITAN_PCB_TX] FILE_DROP: ${signal.files ? signal.files.length : 1} items ingested to Lens/Shelf`;
                    break;
                }

                case INPUT_SIGNAL.DRAW_STROKE_POINT: {
                    this.currentStroke = this.currentStroke || [];
                    this.currentStroke.push({ x: signal.x, y: signal.y, p: signal.pressure || 1.0 });
                    break;
                }

                case INPUT_SIGNAL.DRAW_STROKE_COMMIT: {
                    this.userPaths = this.userPaths || [];
                    if (this.currentStroke && this.currentStroke.length > 0) {
                        this.userPaths.push(this.currentStroke);
                    }
                    this.currentStroke = null;
                    this.lastCliMessage = `[TITAN_PCB_TX] DRAW_COMMIT: Vector path committed (${this.userPaths.length} paths)`;
                    break;
                }

                default:
                    break;
            }

            return this.emitOutput();
        }

        // Quick Input Signal Shorthands
        sendMouseDrag(deltaX, deltaY) {
            return this.processInputSignal({ type: INPUT_SIGNAL.DRAG_DELTA, deltaX, deltaY });
        }

        sendZoom(zoomFactor) {
            return this.processInputSignal({ type: INPUT_SIGNAL.WHEEL_ZOOM, zoomFactor });
        }

        selectTool(toolId) {
            return this.processInputSignal({ type: INPUT_SIGNAL.TOOL_SELECT, toolId });
        }

        switchCard(cardId) {
            return this.processInputSignal({ type: INPUT_SIGNAL.CARD_SWITCH, cardId });
        }

        copyLayer(payload) {
            return this.processInputSignal({ type: INPUT_SIGNAL.CLIPBOARD_COPY, payload });
        }

        pasteLayer(targetTrack) {
            return this.processInputSignal({ type: INPUT_SIGNAL.CLIPBOARD_PASTE, targetTrack });
        }

        duplicateLayer(layerId) {
            return this.processInputSignal({ type: INPUT_SIGNAL.CLIPBOARD_DUPLICATE, layerId });
        }

        dropFiles(files) {
            return this.processInputSignal({ type: INPUT_SIGNAL.FILE_DROP, files });
        }

        sendDrawPoint(x, y, pressure) {
            return this.processInputSignal({ type: INPUT_SIGNAL.DRAW_STROKE_POINT, x, y, pressure });
        }

        commitDrawStroke() {
            return this.processInputSignal({ type: INPUT_SIGNAL.DRAW_STROKE_COMMIT });
        }

        // ── 5. OUTPUT TELEMETRY GENERATOR (120 FPS FRAME PACKET) ──
        generateOutputPacket(timeSec = 0.0) {
            this.frameId++;
            this.timeSec = timeSec;

            const scale = (this.read(TITAN_REG.VIDEO_SCALE) || 100) / 100;
            const rotDeg = this.read(TITAN_REG.VIDEO_ROTATION) || 0;
            const rotRad = (rotDeg * Math.PI) / 180;
            const posX = (this.read(TITAN_REG.VIDEO_POS_X) | 0);
            const posY = (this.read(TITAN_REG.VIDEO_POS_Y) | 0);

            // 2D Affine Transform Matrix: [a, b, c, d, tx, ty]
            const a = scale * Math.cos(rotRad);
            const b = scale * Math.sin(rotRad);
            const c = -scale * Math.sin(rotRad);
            const d = scale * Math.cos(rotRad);

            const cliLog = `[TITAN_PCB_TX] FRM:${this.frameId} TIME:${timeSec.toFixed(3)}s SCALE:${scale.toFixed(2)} ROT:${rotDeg}° POS:(${posX},${posY}) TOOL:0x${this.read(TITAN_REG.SYS_ACTIVE_TOOL).toString(16)} FONT:0x${this.read(TITAN_REG.TYPO_FONT_OPCODE).toString(16)}`;

            const packet = {
                frameId: this.frameId,
                timeSec: timeSec,
                matrix: [a, b, c, d, posX, posY],
                opacity: (this.read(TITAN_REG.VIDEO_OPACITY) || 100) / 100,
                vfxOpcode: this.read(TITAN_REG.VFX_OPCODE),
                hueOpcode: this.read(TITAN_REG.COLOR_HUE),
                fontOpcode: this.read(TITAN_REG.TYPO_FONT_OPCODE),
                fontSize: this.read(TITAN_REG.TYPO_FONT_SIZE) || 28,
                curveArc: (this.read(TITAN_REG.TYPO_CURVE_ARC) | 0),
                isKaraoke: Boolean(this.read(TITAN_REG.TYPO_KARAOKE_EN)),
                isOverlayActive: Boolean(this.read(TITAN_REG.OVERLAY_ACTIVE)),
                headAvatarId: this.read(TITAN_REG.HEAD_SWAP_AVATAR),
                walkingBob: (this.read(TITAN_REG.HEAD_WALK_BOB) || 100) / 100,
                isAiCutout: Boolean(this.read(TITAN_REG.THUMB_AI_CUTOUT)),
                creatorStrokeWidth: this.read(TITAN_REG.THUMB_STROKE_W) || 8,
                bgBokehBlur: this.read(TITAN_REG.THUMB_BG_BLUR) || 12,
                cliLog: cliLog
            };

            return packet;
        }

        emitOutput(timeSec = 0.0) {
            const packet = this.generateOutputPacket(timeSec);
            if (this.onOutput) {
                this.onOutput(packet);
            }
            if (this.onCommandLog) {
                this.onCommandLog(packet.cliLog);
            }
            return packet;
        }
    }

    return {
        TITAN_REG,
        INPUT_SIGNAL,
        TitanCardPCB,
        createPCB: (options) => new TitanCardPCB(options)
    };
}));
