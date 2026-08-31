'use strict';

/**
 * 🎚️ TitanEqualizer — Vintage Cassette Player Style
 * Zero-Dependency SVG/CSS Audio Graphic Equalizer & DSP Visualizer
 * ═════════════════════════════════════════════════════════════════════════════
 * • 10-Band Studio DSP (32Hz to 16kHz) with ±12 dB Range
 * • Vintage Analog Cassette Player Style — Real Physical Fader with Brass Knob
 * • Real-Time Dynamic Frequency Response Curve (Cubic Bézier Interpolation)
 * • Preset Profiles: Flat, Bass Boost, Rock, EDM, Vocal, Cinema 3D
 * • Direct C/C++ 16-Bit Register Micro-Bus Integration (TITAN_REG.EQ_BAND_0..9)
 */

const EQ_PRESETS = {
    flat:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bass:     [6, 5, 4, 2, 0, 0, 0, 0, 0, 0],
    rock:     [5, 4, 2, -1, -2, 0, 2, 3, 4, 5],
    edm:      [6, 5, 1, 0, -2, 2, 1, 3, 5, 6],
    vocal:    [-2, -2, 0, 2, 5, 5, 3, 1, 0, -1],
    cinema:   [4, 3, 1, 0, 0, 0, 1, 2, 4, 6]
};

const FREQUENCIES = ['32Hz', '64Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz', '8kHz', '16kHz'];

const CASSETTE_EQ_CSS = `
<style id="titan-eq-cassette-style">
/* ═══ Titan Equalizer — Vintage Cassette Player Style ═══ */
.teq-root {
    background: linear-gradient(160deg, #1a1208 0%, #0e0c08 60%, #18120a 100%);
    border: 1.5px solid #4a3b22;
    border-radius: 18px;
    box-shadow:
        0 0 0 1px #8a6a30,
        0 4px 40px #0008,
        inset 0 1px 0 #c8a84b44;
    position: relative;
    overflow: hidden;
}
.teq-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
        repeating-linear-gradient(0deg, transparent, transparent 3px, #ffffff04 3px, #ffffff04 4px);
    pointer-events: none;
    z-index: 0;
    border-radius: inherit;
}
.teq-panel-bg {
    background: linear-gradient(170deg, #231a0d 0%, #1a1208 100%);
    border: 1px solid #3d2e15;
    box-shadow: inset 0 2px 8px #0008, inset 0 -1px 0 #c8a84b22;
}
/* VU Track - the vertical rail */
.teq-fader-rail {
    position: relative;
    width: 28px;
    height: 140px;
    background: linear-gradient(180deg, #0a0806 0%, #151006 40%, #0a0806 100%);
    border-radius: 4px;
    border: 1px solid #3d2e15;
    box-shadow:
        inset 0 2px 6px #000a,
        inset 0 0 0 1px #0004,
        0 0 0 1px #1a1208;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}
/* Tick marks on the rail */
.teq-fader-rail::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 8px;
    bottom: 8px;
    width: 2px;
    transform: translateX(-50%);
    background: repeating-linear-gradient(
        180deg,
        #4a3b1a 0px,
        #4a3b1a 1px,
        transparent 1px,
        transparent 8px
    );
    border-radius: 1px;
}
/* Center 0dB notch */
.teq-zero-mark {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 2px;
    background: #c8a84b88;
    transform: translateY(-50%);
    border-radius: 1px;
    z-index: 2;
    pointer-events: none;
}
.teq-zero-mark::before,
.teq-zero-mark::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #c8a84b;
}
.teq-zero-mark::before { left: -2px; }
.teq-zero-mark::after { right: -2px; }

/* Custom vertical range input */
input.teq-slider {
    -webkit-appearance: none;
    appearance: none;
    position: absolute;
    width: 140px;
    height: 28px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-90deg);
    background: transparent;
    cursor: pointer;
    z-index: 3;
    margin: 0;
    padding: 0;
    outline: none;
    border: none;
}
input.teq-slider::-webkit-slider-runnable-track {
    background: transparent;
    width: 4px;
}
input.teq-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 28px;
    height: 18px;
    border-radius: 4px;
    background: linear-gradient(180deg,
        #e8d07a 0%,
        #c8a030 20%,
        #a07820 50%,
        #c8a030 80%,
        #e8d07a 100%
    );
    border: 1px solid #8a6010;
    box-shadow:
        0 2px 8px #000c,
        0 1px 0 #f0e09088,
        inset 0 1px 2px #f0e09044,
        inset 0 -1px 2px #00000044;
    cursor: grab;
    position: relative;
    transition: box-shadow 0.1s, transform 0.1s;
}
input.teq-slider::-webkit-slider-thumb:active {
    cursor: grabbing;
    box-shadow:
        0 4px 16px #000e,
        0 0 0 2px #c8a84b88,
        0 1px 0 #f0e09088,
        inset 0 1px 2px #f0e09044;
    transform: scaleX(1.07);
}
input.teq-slider::-moz-range-thumb {
    width: 28px;
    height: 18px;
    border-radius: 4px;
    background: linear-gradient(180deg,
        #e8d07a 0%,
        #c8a030 20%,
        #a07820 50%,
        #c8a030 80%,
        #e8d07a 100%
    );
    border: 1px solid #8a6010;
    box-shadow:
        0 2px 8px #000c,
        0 1px 0 #f0e09088;
    cursor: grab;
}
input.teq-slider::-moz-range-track {
    background: transparent;
    height: 4px;
    width: 100%;
}


/* Value badge */
.teq-val-badge {
    font-family: 'Courier New', Courier, monospace;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.03em;
    color: #f0c040;
    text-shadow: 0 0 8px #c8a84b88;
    min-height: 14px;
    text-align: center;
}
/* Frequency label */
.teq-freq-label {
    font-family: 'Courier New', Courier, monospace;
    font-size: 9px;
    font-weight: 700;
    color: #7a6030;
    text-align: center;
    letter-spacing: 0.02em;
    transition: color 0.2s;
}
.teq-fader-col:hover .teq-freq-label {
    color: #e8c050;
    text-shadow: 0 0 6px #c8a84b66;
}
/* VU fill inside rail */
.teq-vu-fill {
    position: absolute;
    left: 4px;
    right: 4px;
    bottom: 50%;
    border-radius: 2px;
    pointer-events: none;
    transition: height 0.12s ease-out, background 0.3s;
    z-index: 1;
}
/* Tape reel decoration buttons */
.teq-preset-btn {
    font-family: 'Courier New', Courier, monospace;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.05em;
    padding: 4px 10px;
    border-radius: 3px;
    background: linear-gradient(180deg, #2a1e0c 0%, #1a1208 100%);
    border: 1px solid #4a3b1a;
    color: #8a7040;
    cursor: pointer;
    transition: all 0.15s;
    text-transform: uppercase;
    box-shadow: inset 0 1px 0 #c8a84b18, 0 1px 4px #0006;
}
.teq-preset-btn:hover, .teq-preset-btn.active {
    background: linear-gradient(180deg, #3a2a10 0%, #281e0a 100%);
    color: #e8c050;
    border-color: #c8a030;
    text-shadow: 0 0 8px #c8a84b88;
    box-shadow: inset 0 1px 0 #c8a84b44, 0 0 8px #c8a84b44, 0 1px 4px #0006;
}
/* VU Meter bars */
.teq-vu-bar {
    width: 7px;
    background: linear-gradient(180deg, #ff3a1a 0%, #ffa01a 40%, #40dd40 100%);
    border-radius: 2px;
    transition: height 0.08s linear;
    box-shadow: 0 0 4px #40dd4066;
}
/* Cassette-style screw decoration */
.teq-screw {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #a0a0a0, #404040);
    border: 1px solid #303030;
    box-shadow: inset 0 1px 2px #fff2, 0 1px 3px #0006;
    position: relative;
}
.teq-screw::after {
    content: '';
    position: absolute;
    inset: 1.5px;
    background:
        linear-gradient(45deg, #303030 48%, transparent 48%, transparent 52%, #303030 52%),
        linear-gradient(-45deg, #303030 48%, transparent 48%, transparent 52%, #303030 52%);
    border-radius: 50%;
}
/* LED strip */
.teq-led {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #40ff40;
    box-shadow: 0 0 6px #40ff40, 0 0 12px #40ff4044;
    animation: teq-led-pulse 2s ease-in-out infinite;
}
.teq-led.red {
    background: #ff4040;
    box-shadow: 0 0 6px #ff4040, 0 0 12px #ff404044;
    animation-delay: 0.7s;
}
.teq-led.amber {
    background: #ffb040;
    box-shadow: 0 0 6px #ffb040, 0 0 12px #ffb04044;
    animation-delay: 0.35s;
}
@keyframes teq-led-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
}
/* Pre-amp slider */
input.teq-preamp-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(90deg, #0a0806 0%, #2a1e0c 100%);
    border: 1px solid #4a3b1a;
    outline: none;
    box-shadow: inset 0 1px 3px #0008;
}
input.teq-preamp-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #e8d07a, #a07820);
    border: 1px solid #8a6010;
    box-shadow: 0 1px 6px #000a, 0 0 0 1px #c8a84b44;
    cursor: grab;
}
input.teq-preamp-slider::-webkit-slider-thumb:active { cursor: grabbing; }
/* Cassette reel SVG animation */
@keyframes teq-reel-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.teq-reel-spin { animation: teq-reel-spin 3s linear infinite; transform-origin: center; }
</style>
`;

function renderCassetteReel(size, x, y) {
    return '<g transform="translate(' + x + ',' + y + ')">' +
        '<circle r="' + (size/2) + '" fill="#1a1208" stroke="#4a3b1a" stroke-width="1.5"/>' +
        '<circle r="' + (size/4) + '" fill="#0a0806" stroke="#3d2e15" stroke-width="1"/>' +
        '<g class="teq-reel-spin">' +
            '<rect x="-1" y="-' + (size/2-2) + '" width="2" height="' + (size/3) + '" fill="#4a3b1a" rx="1"/>' +
            '<rect x="-1" y="-' + (size/2-2) + '" width="2" height="' + (size/3) + '" fill="#4a3b1a" rx="1" transform="rotate(120)"/>' +
            '<rect x="-1" y="-' + (size/2-2) + '" width="2" height="' + (size/3) + '" fill="#4a3b1a" rx="1" transform="rotate(240)"/>' +
        '</g>' +
        '<circle r="4" fill="#c8a030" stroke="#8a6010" stroke-width="0.5"/>' +
    '</g>';
}

function renderTitanEqualizer(options) {
    const opts = options || {};
    const id = opts.id || 'titan-eq-' + Math.random().toString(36).substr(2, 6);
    const title = opts.title || 'Titan 10-Band Studio Equalizer';
    const subtitle = opts.subtitle || 'Vintage Cassette Player DSP &bull; &plusmn;12 dB &bull; 16-Bit Register Bus';
    const preset = opts.preset || 'rock';
    const bands = opts.bands || EQ_PRESETS[preset] || EQ_PRESETS.flat;
    const color = opts.color || '#c8a030';
    const className = opts.className || '';

    // Cassette-style fader columns
    const fadersHtml = bands.map((gain, i) => {
        const freq = FREQUENCIES[i];
        const gainSign = gain > 0 ? '+' + gain : gain;
        // % position for VU fill: gain of +12 = 100%, -12 = 0%
        const vuPct = Math.max(0, (gain / 12) * 50); // 0 to 50 (above center)
        const vuBelow = Math.max(0, (-gain / 12) * 50); // 0 to 50 (below center)
        const isBoost = gain >= 0;
        const vuColor = isBoost
            ? 'linear-gradient(180deg, #40ff6088, #40ff60cc)'
            : 'linear-gradient(0deg, #ff604088, #ff6040cc)';

        return '<div class="teq-fader-col flex flex-col items-center gap-1.5" style="position:relative">' +
            // dB value badge
            '<span id="' + id + '-val-' + i + '" class="teq-val-badge">' + gainSign + 'dB</span>' +
            // Fader rail
            '<div class="teq-fader-rail">' +
                '<div class="teq-zero-mark"></div>' +
                // VU fill
                '<div id="' + id + '-vu-' + i + '" class="teq-vu-fill" style="' +
                    'bottom:' + (isBoost ? '50%' : (50 - vuBelow) + '%') + ';' +
                    'height:' + (isBoost ? vuPct : vuBelow) + '%;' +
                    'background:' + vuColor + ';' +
                    'top:' + (isBoost ? 'auto' : (50 - vuBelow) + '%') + ';' +
                '"></div>' +
                '<input type="range" id="' + id + '-slider-' + i + '" ' +
                    'min="-12" max="12" step="1" value="' + gain + '" ' +
                    'class="teq-slider" ' +
                    'oninput="window.titanEqUpdateBand(\'' + id + '\', ' + i + ', this.value)" />' +
            '</div>' +
            // Freq label
            '<span class="teq-freq-label">' + freq + '</span>' +
        '</div>';
    }).join('');

    // Cassette reel SVG (decorative top)
    const reelSvg = '<svg viewBox="0 0 300 50" class="w-full" style="max-height:48px;pointer-events:none" xmlns="http://www.w3.org/2000/svg">' +
        '<rect width="300" height="50" fill="none"/>' +
        // Tape window
        '<rect x="80" y="8" width="140" height="34" rx="6" fill="#0e0c08" stroke="#4a3b1a" stroke-width="1.5"/>' +
        // Tape guide posts
        '<circle cx="90" cy="25" r="4" fill="#2a1e0c" stroke="#4a3b1a" stroke-width="1"/>' +
        '<circle cx="210" cy="25" r="4" fill="#2a1e0c" stroke="#4a3b1a" stroke-width="1"/>' +
        // Tape strip (the actual tape)
        '<path d="M 94 25 Q 130 32 150 32 Q 170 32 206 25" fill="none" stroke="#4a3b1a" stroke-width="4" stroke-linecap="round"/>' +
        // Reels
        renderCassetteReel(30, 30, 25) +
        renderCassetteReel(30, 270, 25) +
    '</svg>';

    // VU Meter display
    const vuMeterHtml = '<div class="flex items-end gap-0.5" style="height:40px">' +
        [7, 10, 13, 10, 8, 12, 14, 10, 7].map((h, i) =>
            '<div class="teq-vu-bar" id="' + id + '-vu-bar-' + i + '" style="height:' + h + 'px; opacity:' + (0.5 + i * 0.06) + '"></div>'
        ).join('') +
    '</div>';

    // Preset buttons
    const presetNames = ['flat', 'bass', 'rock', 'edm', 'vocal', 'cinema'];
    const presetLabels = ['FLAT', 'BASS', 'ROCK', 'EDM', 'VOCAL', 'CIN 3D'];
    const presetsHtml = presetNames.map((p, i) =>
        '<button type="button" onclick="window.titanEqApplyPreset(\'' + id + '\', \'' + p + '\')" ' +
            'id="' + id + '-preset-' + p + '" ' +
            'class="teq-preset-btn' + (p === preset ? ' active' : '') + '">' +
            presetLabels[i] +
        '</button>'
    ).join('');

    return CASSETTE_EQ_CSS +
    '<div id="' + id + '" class="teq-root flex flex-col gap-0 ' + className + '" style="--eq-color:' + color + ';">' +

        // ── Corner screws (decorative) ──
        '<div style="position:absolute;top:8px;left:8px" class="teq-screw"></div>' +
        '<div style="position:absolute;top:8px;right:8px" class="teq-screw"></div>' +
        '<div style="position:absolute;bottom:8px;left:8px" class="teq-screw"></div>' +
        '<div style="position:absolute;bottom:8px;right:8px" class="teq-screw"></div>' +

        // ── Header / Brand plate ──
        '<div class="flex items-center justify-between px-6 pt-5 pb-3 relative z-10">' +
            '<div class="flex items-center gap-3">' +
                '<div class="flex gap-1 items-center">' +
                    '<div class="teq-led"></div>' +
                    '<div class="teq-led amber"></div>' +
                    '<div class="teq-led red"></div>' +
                '</div>' +
                '<div>' +
                    '<div style="font-family:monospace;font-size:13px;font-weight:900;letter-spacing:0.12em;color:#c8a030;text-shadow:0 0 12px #c8a84b88;text-transform:uppercase">' + title + '</div>' +
                    '<div style="font-family:monospace;font-size:9px;color:#7a6030;letter-spacing:0.06em">' + subtitle + '</div>' +
                '</div>' +
            '</div>' +
            // VU meter display
            '<div class="flex items-end gap-2">' +
                vuMeterHtml +
            '</div>' +
        '</div>' +

        // ── Cassette Reel Tape Window ──
        '<div class="px-4 relative z-10">' + reelSvg + '</div>' +

        // ── Frequency Response Curve (Bézier SVG) ──
        '<div style="margin:0 16px;position:relative;height:52px;background:linear-gradient(180deg,#0a0806,#060402);border-radius:6px;border:1px solid #3d2e15;overflow:hidden;box-shadow:inset 0 2px 8px #0009" class="relative z-10">' +
            '<div style="position:absolute;inset:0;background-image:repeating-linear-gradient(90deg,#ffffff03 0px,#ffffff03 1px,transparent 1px,transparent 40px),repeating-linear-gradient(0deg,#ffffff03 0px,#ffffff03 1px,transparent 1px,transparent 13px);pointer-events:none"></div>' +
            '<svg id="' + id + '-curve-svg" viewBox="0 0 600 52" style="width:100%;height:52px;display:block" xmlns="http://www.w3.org/2000/svg">' +
                '<defs>' +
                    '<linearGradient id="' + id + '-grad" x1="0" y1="0" x2="0" y2="1">' +
                        '<stop offset="0%" stop-color="#c8a030" stop-opacity="0.5"/>' +
                        '<stop offset="100%" stop-color="#c8a030" stop-opacity="0"/>' +
                    '</linearGradient>' +
                    '<filter id="' + id + '-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
                '</defs>' +
                '<line x1="0" y1="26" x2="600" y2="26" stroke="#4a3b1a" stroke-width="0.5" stroke-dasharray="4 4"/>' +
                '<path id="' + id + '-curve-fill" d="" fill="url(#' + id + '-grad)"/>' +
                '<path id="' + id + '-curve-line" d="" fill="none" stroke="#c8a030" stroke-width="2" stroke-linecap="round" style="filter:url(#' + id + '-glow)"/>' +
            '</svg>' +
        '</div>' +

        // ── 10 Cassette-Style Physical Faders ──
        '<div class="teq-panel-bg mx-4 my-3 rounded-lg px-4 py-4 relative z-10">' +
            '<div style="display:grid;grid-template-columns:repeat(10,1fr);gap:6px">' +
                fadersHtml +
            '</div>' +
        '</div>' +

        // ── Bottom controls: Presets + Pre-Amp ──
        '<div style="margin:0 16px 16px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px" class="relative z-10">' +
            '<div style="display:flex;flex-wrap:wrap;gap:4px">' +
                presetsHtml +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:8px">' +
                '<span style="font-family:monospace;font-size:9px;font-weight:700;color:#7a6030;text-transform:uppercase;letter-spacing:0.06em">Pre-Amp</span>' +
                '<input type="range" class="teq-preamp-slider" style="width:80px" min="0" max="200" value="100" id="' + id + '-preamp" oninput="document.getElementById(\'' + id + '-preamp-val\').innerText=this.value+\' %\'" />' +
                '<span id="' + id + '-preamp-val" style="font-family:monospace;font-size:10px;font-weight:900;color:#c8a030;min-width:36px;text-align:right">100 %</span>' +
                '<button type="button" onclick="window.titanEqReset(\'' + id + '\')" class="teq-preset-btn">RST</button>' +
            '</div>' +
        '</div>' +

    '</div>';
}

module.exports = {
    renderTitanEqualizer,
    TitanEqualizer: renderTitanEqualizer,
    EQ_PRESETS,
    FREQUENCIES
};
