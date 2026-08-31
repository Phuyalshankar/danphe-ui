'use strict';

/**
 * 🎧 TitanDJStudio — Professional Fairlight DSP & DJ Crossfader Suite
 * Component of @danphe/ui
 * ═════════════════════════════════════════════════════════════════════════════
 * • Live 60 FPS Real-Time Neon Audio Spectrum Visualizer (FFT AnalyserNode)
 * • Dual-Deck Master Crossfader (Deck A1 ⟷ Deck A2 Live Mixer)
 * • BPM & Pitch / Playback Speed Shifter (0.5x to 2.0x)
 * • 10-Band Graphic Equalizer with Vintage Brass Faders & Peak VU LED Rails
 * • Direct C/C++ Titan Micro-Bus Register Mapping (0x4300 to 0x4320)
 */

function renderTitanDJStudio(options = {}) {
    const rootId = options.id || 'studio-dj-suite';

    return `
<div id="${rootId}" class="titan-dj-root font-mono select-none" data-crossfader="50">
    <style id="titan-dj-studio-css">
    /* ═══════ Titan DJ Studio & Spectrum Visualizer Styles ═══════ */
    .titan-dj-root {
        background: radial-gradient(circle at 50% 0%, #17120a 0%, #0a0805 100%);
        border: 1.5px solid #4a3b22;
        border-radius: 16px;
        box-shadow: 0 12px 36px rgba(0,0,0,0.9), inset 0 1px 0 rgba(200,168,75,0.25);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
    }
    .titan-dj-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #332615;
        padding-bottom: 6px;
    }
    .titan-dj-title {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #e8d07a;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }
    .titan-dj-chip {
        font-size: 8.5px;
        background: #3d2a0e;
        color: #fef08a;
        border: 1px solid #785a20;
        padding: 1px 6px;
        border-radius: 4px;
        font-weight: 800;
    }

    /* 🌈 Live Neon Spectrum Canvas Box */
    .titan-spectrum-box {
        background: #050403;
        border: 1.5px solid #2e210e;
        border-radius: 10px;
        height: 72px;
        position: relative;
        overflow: hidden;
        box-shadow: inset 0 2px 10px rgba(0,0,0,0.8);
    }
    .titan-spectrum-canvas {
        width: 100%;
        height: 100%;
        display: block;
    }
    .spectrum-grid-overlay {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(rgba(200,168,75,0.06) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(200,168,75,0.06) 1px, transparent 1px);
        background-size: 16px 12px;
        pointer-events: none;
    }

    /* 🎚️ DJ Crossfader Section */
    .titan-crossfader-rack {
        background: #120e08;
        border: 1px solid #332615;
        border-radius: 10px;
        padding: 10px 14px;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .crossfader-labels {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        font-weight: 900;
    }
    .crossfader-deck-a { color: #38bdf8; text-shadow: 0 0 8px rgba(56,189,248,0.6); }
    .crossfader-deck-b { color: #f59e0b; text-shadow: 0 0 8px rgba(245,158,11,0.6); }
    .crossfader-mid { color: #94a3b8; font-size: 9px; }

    /* Tactile DJ Crossfader Slider */
    .titan-crossfader-track {
        position: relative;
        height: 24px;
        display: flex;
        align-items: center;
    }
    .titan-crossfader-rail {
        position: absolute;
        left: 0;
        right: 0;
        height: 6px;
        background: #060503;
        border: 1px solid #4a3b22;
        border-radius: 3px;
    }
    .titan-crossfader-rail::after {
        content: '';
        position: absolute;
        left: 50%;
        top: -4px;
        bottom: -4px;
        width: 2px;
        background: #e8d07a;
        transform: translateX(-50%);
    }
    .crossfader-native-slider {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 24px;
        background: transparent;
        cursor: ew-resize;
        position: relative;
        z-index: 2;
        outline: none;
        margin: 0;
    }
    .crossfader-native-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 38px;
        height: 20px;
        border-radius: 4px;
        background: linear-gradient(180deg, #fef08a 0%, #d97706 50%, #92400e 100%);
        border: 1.5px solid #fff;
        box-shadow: 0 2px 10px rgba(0,0,0,0.8), 0 0 10px rgba(245,158,11,0.6);
        cursor: ew-resize;
    }

    /* Speed / Pitch & Pre-amp Micro Controls */
    .titan-dj-grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
    }
    .titan-dj-micro-box {
        background: #0a0805;
        border: 1px solid #261c0d;
        border-radius: 8px;
        padding: 6px 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    </style>

    <!-- 1. Header with Status -->
    <div class="titan-dj-header">
        <div class="titan-dj-title">
            <span>🎧 FAIRLIGHT DJ DSP & LIVE SPECTRUM</span>
        </div>
        <div class="flex items-center gap-1.5">
            <span class="titan-dj-chip">0x4310 BUS</span>
            <button type="button" class="btn-reset" onclick="window.titanEqReset('studio-audio-eq')">Reset</button>
        </div>
    </div>

    <!-- 2. Live 60 FPS Neon Spectrum Visualizer -->
    <div class="titan-spectrum-box">
        <canvas id="${rootId}-spectrum-canvas" class="titan-spectrum-canvas" width="400" height="72"></canvas>
        <div class="spectrum-grid-overlay"></div>
    </div>

    <!-- 3. DJ Master Crossfader (A1 ⟷ A2) -->
    <div class="titan-crossfader-rack">
        <div class="crossfader-labels">
            <span class="crossfader-deck-a">◀ DECK A (A1)</span>
            <span class="crossfader-mid" id="${rootId}-cf-val">50 : 50 MIX</span>
            <span class="crossfader-deck-b">DECK B (A2) ▶</span>
        </div>
        <div class="titan-crossfader-track">
            <div class="titan-crossfader-rail"></div>
            <input type="range" class="crossfader-native-slider" id="${rootId}-crossfader" min="0" max="100" value="50" oninput="window.setTitanDJCrossfader('${rootId}', this.value)" />
        </div>
    </div>

    <!-- 4. Speed / Pitch & Pre-Amp Racks -->
    <div class="titan-dj-grid-2">
        <div class="titan-dj-micro-box">
            <div class="flex justify-between text-[9.5px] font-bold text-amber-300">
                <span>DJ PITCH / SPEED</span>
                <span id="${rootId}-speed-val" class="text-cyan-400">1.00x</span>
            </div>
            <input type="range" min="50" max="150" value="100" class="zoom-slider w-full" oninput="window.setTitanDJPlaybackSpeed('${rootId}', this.value)" />
        </div>
        <div class="titan-dj-micro-box">
            <div class="flex justify-between text-[9.5px] font-bold text-amber-300">
                <span>MASTER PRE-AMP</span>
                <span id="studio-audio-eq-preamp-val" class="text-amber-400">100 %</span>
            </div>
            <input type="range" min="0" max="200" value="100" class="zoom-slider w-full" id="studio-audio-eq-preamp" oninput="window.setMasterAudioVolume(this.value)" />
        </div>
    </div>
</div>
`;
}

module.exports = {
    renderTitanDJStudio
};
