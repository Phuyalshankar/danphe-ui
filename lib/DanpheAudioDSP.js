/**
 * 🎚️ DanpheAudioDSP — Autonomous 10-Band Studio DSP Engine & 2-Wire Serial Package
 * Part of danphe-ui silicon component framework
 * ═════════════════════════════════════════════════════════════════════════════
 * • Internal Encapsulation: 10-Band Bi-quad filters, frequency tuning & dB gains
 * • External Interface: SINGLE 16-Bit Consolidated Master Output Register (0x4300)
 * • 2-Wire Serial Hardware Bridge: I2C/TWI 16-Bit Register Packet Architecture (Addr: 0x4A)
 * • Plug-and-Play: Zero configuration required in Video Editor or host application.
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        const exports = factory();
        root.DanpheAudioDSP = exports;
        root.danpheAudioDSP = exports.defaultInstance;
        // Global aliases for legacy compatibility
        root.titanEqUpdateBand = exports.updateBand;
        root.titanEqUpdateFrequency = exports.updateFrequency;
        root.titanEqStepFrequency = exports.stepFrequency;
        root.titanEqWheelFrequency = exports.wheelFrequency;
        root.titanEqPromptFrequency = exports.promptFrequency;
        root.titanEqApplyPreset = exports.applyPreset;
        root.titanEqReset = exports.reset;
        root.initTitanAudioDSP = exports.init;
        root.attachMediaToTitanDSP = exports.attach;
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    // ── 1. REGISTERS & PROTOCOL CONSTANTS ──
    const REG_AUDIO_DSP_OUT = 0x4300; // Consolidated 16-bit Master DSP Output Register
    const DSP_I2C_ADDR = 0x4A;        // 2-Wire Serial Device Address

    // Internal 16-Bit Registers (Encapsulated)
    const INT_REG_BANDS = [
        0x3100, 0x3101, 0x3102, 0x3103, 0x3104,
        0x3105, 0x3106, 0x3107, 0x3108, 0x3109
    ];
    const INT_REG_FREQS = [
        0x4310, 0x4311, 0x4312, 0x4313, 0x4314,
        0x4315, 0x4316, 0x4317, 0x4318, 0x4319
    ];
    const INT_REG_GAIN  = 0x310A;
    const INT_REG_FLAGS = 0x310B;

    const DEFAULT_FREQS = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
    const FREQ_RANGES = [
        { min: 20, max: 60, step: 2 },        // Band 0: Sub-bass (32 Hz)
        { min: 40, max: 120, step: 4 },       // Band 1: Bass (64 Hz)
        { min: 80, max: 250, step: 10 },      // Band 2: Low-mid (125 Hz)
        { min: 160, max: 500, step: 20 },     // Band 3: Mid-bass (250 Hz)
        { min: 300, max: 1000, step: 25 },    // Band 4: Midrange (500 Hz)
        { min: 700, max: 2500, step: 50 },    // Band 5: High-mid (1000 Hz)
        { min: 1500, max: 5000, step: 100 },  // Band 6: Presence (2000 Hz)
        { min: 3000, max: 9000, step: 200 },  // Band 7: Brilliance (4000 Hz)
        { min: 6000, max: 15000, step: 500 }, // Band 8: Air (8000 Hz)
        { min: 10000, max: 22000, step: 1000} // Band 9: Ultra-high (16000 Hz)
    ];

    const PRESETS = {
        flat:     { id: 1, name: 'Flat',       bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        bass:     { id: 2, name: 'Bass Boost', bands: [6, 5, 4, 2, 0, 0, 0, 0, 0, 0] },
        rock:     { id: 3, name: 'Rock',       bands: [5, 4, 2, -1, -2, 0, 2, 3, 4, 5] },
        edm:      { id: 4, name: 'EDM',        bands: [6, 5, 1, 0, -2, 2, 1, 3, 5, 6] },
        vocal:    { id: 5, name: 'Vocal',      bands: [-2, -2, 0, 2, 5, 5, 3, 1, 0, -1] },
        cinema:   { id: 6, name: 'Cinema 3D',  bands: [4, 3, 1, 0, 0, 0, 1, 2, 4, 6] }
    };

    class DanpheAudioDSPCore {
        constructor() {
            // Encapsulated Internal State
            this.bands = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.freqs = [...DEFAULT_FREQS];
            this.masterGain = 100; // 100 = 1.0 (0 dB), range 0 - 200
            this.isBypassed = false;
            this.is3D = false;
            this.activePresetId = 1; // Flat

            // Web Audio Nodes
            this.audioCtx = null;
            this.inputNode = null;
            this.preampNode = null;
            this.filters = [];
            this.outputNode = null;
            this.attachedMedia = new WeakSet();

            // 2-Wire Serial Bus History / Listeners
            this.listeners = [];
        }

        formatFreq(hz) {
            hz = Number(hz) || 0;
            if (hz >= 1000) {
                const k = hz / 1000;
                return (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)) + 'k';
            }
            return Math.round(hz) + 'Hz';
        }

        // ── 🎛️ 2. HARDWARE / AUDIO GRAPH INITIALIZATION ──
        init() {
            if (typeof window === 'undefined') return this;
            if (this.audioCtx) {
                if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
                return this;
            }

            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return this;

            this.audioCtx = new AudioContextClass();
            this.inputNode = this.audioCtx.createGain();
            this.preampNode = this.audioCtx.createGain();
            this.preampNode.gain.value = this.masterGain / 100.0;

            this.outputNode = this.audioCtx.createGain();
            this.outputNode.gain.value = 1.0;

            // Build 10-Band Biquad Filter Chain
            this.filters = this.freqs.map((freq, idx) => {
                const filter = this.audioCtx.createBiquadFilter();
                if (idx === 0) {
                    filter.type = 'lowshelf';
                } else if (idx === this.freqs.length - 1) {
                    filter.type = 'highshelf';
                } else {
                    filter.type = 'peaking';
                    filter.Q.value = 1.414;
                }
                filter.frequency.value = freq;
                filter.gain.value = this.bands[idx] || 0;
                return filter;
            });

            // Input -> Preamp -> Filter[0] -> ... -> Filter[9] -> OutputNode -> Destination
            this.inputNode.connect(this.preampNode);
            this.preampNode.connect(this.filters[0]);
            for (let i = 0; i < this.filters.length - 1; i++) {
                this.filters[i].connect(this.filters[i + 1]);
            }
            this.filters[this.filters.length - 1].connect(this.outputNode);
            this.outputNode.connect(this.audioCtx.destination);

            this._syncOutputRegister();
            this._renderAllUI();
            return this;
        }

        // Seamless attachment for any Video/Audio element
        attach(mediaEl) {
            if (!mediaEl || typeof window === 'undefined') return;
            this.init();
            if (!this.audioCtx || !this.inputNode) return;
            if (this.attachedMedia.has(mediaEl)) return;

            try {
                const src = this.audioCtx.createMediaElementSource(mediaEl);
                src.connect(this.inputNode);
                this.attachedMedia.add(mediaEl);
            } catch (e) {
                // Ignore if already connected or CORS restricted
            }
        }

        // ── 🔌 3. SINGLE 16-BIT OUTPUT REGISTER (0x4300) ──
        /**
         * Consolidated 16-bit Master DSP Output Word
         * [15:8]: Master Output Gain (0 - 200, 100 = 0 dB)
         * [7:0] : DSP Status Flags (Bit 0: Bypass, Bit 1: 3D, Bit 3-7: Preset Index)
         */
        getOutputRegister() {
            let flags = 0;
            if (this.isBypassed) flags |= 0x01;
            if (this.is3D) flags |= 0x02;
            flags |= ((this.activePresetId & 0x1F) << 3);
            return ((this.masterGain & 0xFF) << 8) | (flags & 0xFF);
        }

        setOutputRegister(word16) {
            word16 = Number(word16) & 0xFFFF;
            if (this._isSyncing || this.getOutputRegister() === word16) return;
            this._isSyncing = true;
            try {
                const newGain = (word16 >> 8) & 0xFF;
                const flags = word16 & 0xFF;

                this.masterGain = Math.max(0, Math.min(200, newGain));
                this.isBypassed = (flags & 0x01) !== 0;
                this.is3D = (flags & 0x02) !== 0;
                this.activePresetId = (flags >> 3) & 0x1F;

                // Apply to hardware pre-amp
                if (this.preampNode && this.audioCtx) {
                    const gainVal = this.isBypassed ? 1.0 : (this.masterGain / 100.0);
                    this.preampNode.gain.setValueAtTime(gainVal, this.audioCtx.currentTime || 0);
                }

                this._renderAllUI();
            } finally {
                this._isSyncing = false;
            }
        }

        // ── 🛰️ 4. 2-WIRE SERIAL PROTOCOL BRIDGE (I2C/TWI) ──
        /**
         * Simulates a 2-wire serial hardware bus transaction:
         * Frame: [DeviceAddr (8-bit)][RegAddr (16-bit)][Data (16-bit)]
         */
        send2WirePacket(devAddr, regAddr, dataWord) {
            if (devAddr !== DSP_I2C_ADDR) return false;
            regAddr = Number(regAddr) & 0xFFFF;
            dataWord = Number(dataWord) & 0xFFFF;

            if (regAddr === REG_AUDIO_DSP_OUT) {
                this.setOutputRegister(dataWord);
                return true;
            }

            // Internal 10-Band Gain write (0x3100 - 0x3109)
            const bandIdx = INT_REG_BANDS.indexOf(regAddr);
            if (bandIdx !== -1) {
                let db = 0;
                if (dataWord > 128) {
                    db = ((dataWord - 128) / 127) * 12;
                } else if (dataWord <= 128 && dataWord >= 0) {
                    db = ((dataWord - 128) / 128) * 12;
                }
                this.updateBand(bandIdx, db);
                return true;
            }

            // Internal Frequency write (0x4310 - 0x4319)
            const freqIdx = INT_REG_FREQS.indexOf(regAddr);
            if (freqIdx !== -1) {
                this.updateFrequency(freqIdx, dataWord);
                return true;
            }

            return false;
        }

        read2WirePacket(devAddr, regAddr) {
            if (devAddr !== DSP_I2C_ADDR) return 0;
            if (regAddr === REG_AUDIO_DSP_OUT) return this.getOutputRegister();

            const bandIdx = INT_REG_BANDS.indexOf(regAddr);
            if (bandIdx !== -1) {
                const db = this.bands[bandIdx];
                return Math.round(128 + (db / 12) * 127);
            }

            const freqIdx = INT_REG_FREQS.indexOf(regAddr);
            if (freqIdx !== -1) return this.freqs[freqIdx];

            return 0;
        }

        // ── 🎚️ 5. ENCAPSULATED DSP BAND & FREQUENCY TUNING ──
        updateBand(bandIdx, dbVal) {
            this.init();
            bandIdx = Number(bandIdx) || 0;
            if (bandIdx < 0 || bandIdx >= 10) return;

            const db = Math.max(-12, Math.min(12, Number(dbVal) || 0));
            this.bands[bandIdx] = db;

            // Update Audio Biquad Filter Node
            if (this.filters && this.filters[bandIdx]) {
                const f = this.filters[bandIdx];
                const targetGain = this.isBypassed ? 0 : db;
                f.gain.value = targetGain;
                if (this.audioCtx && this.audioCtx.currentTime) {
                    try { f.gain.setValueAtTime(targetGain, this.audioCtx.currentTime); } catch (e) {}
                }
            }

            this._syncOutputRegister();
            this._renderAllUI();
        }

        updateFrequency(bandIdx, freqHz) {
            this.init();
            bandIdx = Number(bandIdx) || 0;
            if (bandIdx < 0 || bandIdx >= 10) return;

            const range = FREQ_RANGES[bandIdx] || { min: 20, max: 22000 };
            const f = Math.max(range.min, Math.min(range.max, Math.round(Number(freqHz) || range.min)));
            this.freqs[bandIdx] = f;

            // Update Audio Biquad Filter Center Frequency
            if (this.filters && this.filters[bandIdx]) {
                const filter = this.filters[bandIdx];
                filter.frequency.value = f;
                if (this.audioCtx && this.audioCtx.currentTime) {
                    try { filter.frequency.setValueAtTime(f, this.audioCtx.currentTime); } catch (e) {}
                }
            }

            this._syncOutputRegister();
            this._renderAllUI();
        }

        stepFrequency(bandIdx, dir) {
            bandIdx = Number(bandIdx) || 0;
            const range = FREQ_RANGES[bandIdx] || { min: 20, max: 22000, step: 10 };
            const cur = this.freqs[bandIdx] || 1000;
            const delta = (range.step || 10) * (dir > 0 ? 1 : -1);
            this.updateFrequency(bandIdx, cur + delta);
        }

        applyPreset(presetKey) {
            this.init();
            const p = PRESETS[presetKey] || PRESETS.flat;
            this.bands = [...p.bands];
            this.activePresetId = p.id;

            if (this.filters && this.filters.length) {
                this.bands.forEach((gain, i) => {
                    if (this.filters[i]) {
                        this.filters[i].gain.value = this.isBypassed ? 0 : gain;
                    }
                });
            }

            this._syncOutputRegister();
            this._renderAllUI();
        }

        reset() {
            this.applyPreset('flat');
            this.freqs = [...DEFAULT_FREQS];
            if (this.filters && this.filters.length) {
                this.freqs.forEach((freq, i) => {
                    if (this.filters[i]) this.filters[i].frequency.value = freq;
                });
            }
            this.masterGain = 100;
            this.isBypassed = false;
            this._syncOutputRegister();
            this._renderAllUI();
        }

        // ── 🎨 6. AUTONOMOUS UI & RESPONSE CURVE RENDERING ──
        _syncOutputRegister() {
            if (typeof window === 'undefined' || this._isSyncing) return;
            const bus = window.TitanMicroBus || window.TitanBus || window.bus;
            const word = this.getOutputRegister();
            if (this._lastSyncedWord === word) return;
            this._lastSyncedWord = word;
            if (bus && typeof bus.write === 'function') {
                bus.write(REG_AUDIO_DSP_OUT, word);
            }
        }

        _renderAllUI() {
            if (typeof document === 'undefined') return;

            // 1. Sync all fader sliders, badges & VU meters
            for (let i = 0; i < 10; i++) {
                const db = this.bands[i] || 0;
                const freq = this.freqs[i] || DEFAULT_FREQS[i];
                const freqStr = this.formatFreq(freq);

                // Sliders
                document.querySelectorAll(
                    '#danphe-audio-eq-slider-' + i + ', #danphe-eq-slider-' + i + ', [id="danphe-audio-eq-slider-' + i + '"], [id$="-slider-' + i + '"]'
                ).forEach(el => { el.value = db; });

                // Gain Badges
                document.querySelectorAll(
                    '#danphe-audio-eq-val-' + i + ', #danphe-eq-val-' + i + ', [id="danphe-audio-eq-val-' + i + '"], [id$="-val-' + i + '"]'
                ).forEach(el => { el.innerText = (db > 0 ? '+' : '') + Math.round(db) + 'dB'; });

                // Frequency Badges
                document.querySelectorAll(
                    '#danphe-audio-eq-freq-' + i + ', #danphe-eq-freq-' + i + ', [id="danphe-audio-eq-freq-' + i + '"], [id$="-freq-' + i + '"]'
                ).forEach(el => { el.innerText = freqStr; });

                // VU Rails
                document.querySelectorAll(
                    '#danphe-audio-eq-vu-' + i + ', #danphe-eq-vu-' + i + ', [id="danphe-audio-eq-vu-' + i + '"], [id$="-vu-' + i + '"]'
                ).forEach(vuEl => {
                    const hPct = Math.abs(db / 12) * 50;
                    vuEl.style.height = hPct + '%';
                    if (db >= 0) {
                        vuEl.style.bottom = '50%';
                        vuEl.style.top = 'auto';
                        vuEl.style.background = 'linear-gradient(180deg, #40ff6088, #40ff60cc)';
                    } else {
                        vuEl.style.top = '50%';
                        vuEl.style.bottom = 'auto';
                        vuEl.style.background = 'linear-gradient(0deg, #ff604088, #ff6040cc)';
                    }
                });
            }

            // 2. Pre-amp sliders & badges
            document.querySelectorAll(
                '#danphe-audio-eq-preamp, #titan-studio-equalizer-preamp, [id$="-preamp"]'
            ).forEach(el => { el.value = this.masterGain; });

            document.querySelectorAll(
                '#danphe-audio-eq-preamp-val, #titan-studio-equalizer-preamp-val, [id$="-preamp-val"]'
            ).forEach(el => { el.innerText = this.masterGain + ' %'; });

            // 3. Render Bézier Curves across all DSP displays
            this.renderResponseCurves();
        }

        renderResponseCurves() {
            if (typeof document === 'undefined') return;
            const curveContainers = [
                { lineId: 'danphe-audio-eq-curve-line', fillId: 'danphe-audio-eq-curve-fill', w: 324, h: 56, midY: 28 },
                { lineId: 'titan-studio-equalizer-curve-line', fillId: 'titan-studio-equalizer-curve-fill', w: 600, h: 52, midY: 26 }
            ];

            curveContainers.forEach(c => {
                const lineEl = document.getElementById(c.lineId);
                const fillEl = document.getElementById(c.fillId);
                if (!lineEl) return;

                const pts = this.bands.map((db, idx) => {
                    const x = (idx / 9) * (c.w - 24) + 12;
                    const y = c.midY - (db / 12) * (c.midY - 6);
                    return { x, y };
                });

                // Cubic Bézier smoothing
                let pathD = 'M ' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
                for (let i = 0; i < pts.length - 1; i++) {
                    const p0 = pts[Math.max(0, i - 1)];
                    const p1 = pts[i];
                    const p2 = pts[i + 1];
                    const p3 = pts[Math.min(pts.length - 1, i + 2)];

                    const cp1x = p1.x + (p2.x - p0.x) / 6;
                    const cp1y = p1.y + (p2.y - p0.y) / 6;
                    const cp2x = p2.x - (p3.x - p1.x) / 6;
                    const cp2y = p2.y - (p3.y - p1.y) / 6;

                    pathD += ' C ' + cp1x.toFixed(1) + ' ' + cp1y.toFixed(1) + ', ' +
                                    cp2x.toFixed(1) + ' ' + cp2y.toFixed(1) + ', ' +
                                    p2.x.toFixed(1) + ' ' + p2.y.toFixed(1);
                }

                lineEl.setAttribute('d', pathD);
                if (fillEl) {
                    const fillD = pathD + ' L ' + pts[pts.length - 1].x.toFixed(1) + ' ' + c.h +
                                  ' L ' + pts[0].x.toFixed(1) + ' ' + c.h + ' Z';
                    fillEl.setAttribute('d', fillD);
                }
            });
        }
    }

    // Default Singleton Ready Instance
    const defaultInstance = new DanpheAudioDSPCore();

    // Exported Object
    return {
        DanpheAudioDSP: DanpheAudioDSPCore,
        defaultInstance,
        REG_AUDIO_DSP_OUT,
        DSP_I2C_ADDR,
        init: () => defaultInstance.init(),
        attach: (mediaEl) => defaultInstance.attach(mediaEl),
        getOutputRegister: () => defaultInstance.getOutputRegister(),
        setOutputRegister: (w) => defaultInstance.setOutputRegister(w),
        updateBand: (a, b, c) => {
            let bandIdx = a, val = b;
            if (typeof a === 'string' && isNaN(Number(a))) { bandIdx = b; val = c; }
            defaultInstance.updateBand(bandIdx, val);
        },
        updateFrequency: (a, b, c) => {
            let bandIdx = a, freq = b;
            if (typeof a === 'string' && isNaN(Number(a))) { bandIdx = b; freq = c; }
            defaultInstance.updateFrequency(bandIdx, freq);
        },
        stepFrequency: (a, b, c) => {
            let bandIdx = a, dir = b;
            if (typeof a === 'string' && isNaN(Number(a))) { bandIdx = b; dir = c; }
            defaultInstance.stepFrequency(bandIdx, dir);
        },
        wheelFrequency: (e, bandIdx) => {
            if (e && typeof e.preventDefault === 'function') {
                e.preventDefault();
                e.stopPropagation();
            }
            if (typeof e === 'number' && typeof bandIdx !== 'number') {
                const tmp = bandIdx; bandIdx = e; e = tmp;
            }
            const dir = (e && e.deltaY < 0) ? 1 : -1;
            defaultInstance.stepFrequency(bandIdx, dir);
        },
        promptFrequency: (bandIdx) => {
            bandIdx = Number(bandIdx) || 0;
            const cur = defaultInstance.freqs[bandIdx] || 1000;
            const res = prompt('Enter custom center frequency (Hz):', cur);
            if (res !== null) {
                let f = parseFloat(res);
                if (res.toLowerCase().includes('k')) f *= 1000;
                if (!isNaN(f) && f > 0) defaultInstance.updateFrequency(bandIdx, f);
            }
        },
        applyPreset: (a, b) => {
            const key = typeof b !== 'undefined' ? b : a;
            defaultInstance.applyPreset(key);
        },
        reset: () => defaultInstance.reset(),
        send2WirePacket: (d, r, w) => defaultInstance.send2WirePacket(d, r, w),
        read2WirePacket: (d, r) => defaultInstance.read2WirePacket(d, r)
    };
}));
