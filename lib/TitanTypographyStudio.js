'use strict';

/**
 * 🖋️ TitanTypographyStudio (danphe-ui)
 * Hollywood / Photoshop-Beating 16-Bit Bitmask Motion Typography & Title Engine
 * ═════════════════════════════════════════════════════════════════════════════
 * • 16-Bit Register Bitmask Architecture (TITAN_REG.TYPO_FLAGS: 0x4210)
 * • Multi-Stop Metallic, Holographic, and Neon Gradients (Text Fill Shaders)
 * • Directional 3D Extrusion & Bevel Depth Lighting (0° to 360° Angle)
 * • Dual-Layer Stroke & Outer Glow Bloom
 * • Multi-Layer Cinema Drop Shadow (Distance, Angle, Blur, Spread)
 * • Optical Tracking (Letter-Spacing), Leading, Skew Slant & 3D Perspective Tilt
 * • Hollywood Master Presets: Cinema Gold, Cyberpunk, Netflix, Synthwave, Titanium, Himalaya
 */

// ── 16-BIT REGISTER BITMASK CONSTANTS ──
const TITAN_TYPO_BITS = {
    BOLD:              0x0001, // Bit 0
    ITALIC:            0x0002, // Bit 1
    ALL_CAPS:          0x0004, // Bit 2
    SMALL_CAPS:        0x0008, // Bit 3
    UNDERLINE:         0x0010, // Bit 4
    STRIKETHROUGH:     0x0020, // Bit 5
    GLOW_ACTIVE:       0x0040, // Bit 6
    EXTRUDE_3D:        0x0080, // Bit 7
    METALLIC_GRADIENT: 0x0100, // Bit 8
    DROP_SHADOW:       0x0200, // Bit 9
    NEON_PULSE:        0x0400, // Bit 10
    GLITCH_FX:         0x0800, // Bit 11
    BACKDROP_BOX:      0x1000  // Bit 12
};

// ── TITAN HARDWARE REGISTERS (0x4200 - 0x4220) ──
const TITAN_TYPO_REG = {
    FONT_SIZE:      0x4200, // 12 - 240 px
    TRACKING:       0x4201, // -5 to +60 px
    STROKE_WIDTH:   0x4202, // 0 - 24 px
    SHADOW_BLUR:    0x4203, // 0 - 50 px
    SHADOW_ANGLE:   0x4204, // 0 - 360 deg
    SHADOW_DIST:    0x4205, // 0 - 60 px
    EXTRUDE_DEPTH:  0x4206, // 0 - 30 px
    GLOW_SPREAD:    0x4207, // 0 - 40 px
    OPACITY:        0x4208, // 0 - 100 %
    SKEW_ANGLE:     0x4209, // -30 to +30 deg
    FLAGS_BITMASK:  0x4210  // 16-bit Bitmask (TITAN_TYPO_BITS)
};

// ── HOLLYWOOD MASTER PRESETS ──
const TYPO_PRESETS = {
    cinema_gold: {
        name: 'Cinema 24K Gold',
        bitmask: TITAN_TYPO_BITS.BOLD | TITAN_TYPO_BITS.ALL_CAPS | TITAN_TYPO_BITS.METALLIC_GRADIENT | TITAN_TYPO_BITS.EXTRUDE_3D | TITAN_TYPO_BITS.DROP_SHADOW,
        fontFamily: 'Impact, "Cinzel", "Times New Roman", serif',
        fontSize: 64,
        tracking: 4,
        strokeWidth: 2,
        strokeColor: '#fef08a',
        fillType: 'gold',
        fillColor: '#fbbf24',
        shadowBlur: 18,
        shadowColor: 'rgba(0,0,0,0.95)',
        shadowDist: 8,
        shadowAngle: 45,
        extrudeDepth: 6,
        extrudeColor: '#78350f',
        glowColor: '#f59e0b',
        glowSpread: 8,
        gradientCss: 'linear-gradient(180deg, #fef08a 0%, #facc15 35%, #b45309 70%, #d97706 100%)'
    },
    cyberpunk: {
        name: 'Cyberpunk Neon',
        bitmask: TITAN_TYPO_BITS.BOLD | TITAN_TYPO_BITS.ITALIC | TITAN_TYPO_BITS.ALL_CAPS | TITAN_TYPO_BITS.GLOW_ACTIVE | TITAN_TYPO_BITS.NEON_PULSE,
        fontFamily: '"Arial Black", sans-serif',
        fontSize: 58,
        tracking: 6,
        strokeWidth: 1.5,
        strokeColor: '#f43f5e',
        fillType: 'neon',
        fillColor: '#00f0ff',
        shadowBlur: 24,
        shadowColor: '#00f0ff',
        shadowDist: 0,
        shadowAngle: 0,
        extrudeDepth: 0,
        extrudeColor: '#000',
        glowColor: '#00f0ff',
        glowSpread: 16,
        gradientCss: 'linear-gradient(180deg, #38bdf8 0%, #00f0ff 50%, #e0e7ff 100%)'
    },
    netflix: {
        name: 'Netflix Trailer',
        bitmask: TITAN_TYPO_BITS.BOLD | TITAN_TYPO_BITS.ALL_CAPS | TITAN_TYPO_BITS.DROP_SHADOW,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: 52,
        tracking: 14,
        strokeWidth: 0,
        strokeColor: 'transparent',
        fillType: 'solid',
        fillColor: '#e50914',
        shadowBlur: 14,
        shadowColor: 'rgba(229,9,20,0.6)',
        shadowDist: 4,
        shadowAngle: 90,
        extrudeDepth: 0,
        extrudeColor: '#000',
        glowColor: '#e50914',
        glowSpread: 0,
        gradientCss: 'none'
    },
    synthwave: {
        name: '80s Synthwave',
        bitmask: TITAN_TYPO_BITS.BOLD | TITAN_TYPO_BITS.ITALIC | TITAN_TYPO_BITS.ALL_CAPS | TITAN_TYPO_BITS.METALLIC_GRADIENT | TITAN_TYPO_BITS.GLOW_ACTIVE,
        fontFamily: 'Impact, "Trebuchet MS", sans-serif',
        fontSize: 60,
        tracking: 3,
        strokeWidth: 2,
        strokeColor: '#f43f5e',
        fillType: 'sunset',
        fillColor: '#38bdf8',
        shadowBlur: 20,
        shadowColor: '#ec4899',
        shadowDist: 4,
        shadowAngle: 60,
        extrudeDepth: 4,
        extrudeColor: '#831843',
        glowColor: '#ec4899',
        glowSpread: 12,
        gradientCss: 'linear-gradient(180deg, #38bdf8 0%, #a855f7 40%, #ec4899 75%, #fbbf24 100%)'
    },
    titanium: {
        name: 'Brushed Titanium',
        bitmask: TITAN_TYPO_BITS.BOLD | TITAN_TYPO_BITS.METALLIC_GRADIENT | TITAN_TYPO_BITS.EXTRUDE_3D | TITAN_TYPO_BITS.DROP_SHADOW,
        fontFamily: 'monospace, sans-serif',
        fontSize: 54,
        tracking: 8,
        strokeWidth: 1,
        strokeColor: '#cbd5e1',
        fillType: 'titanium',
        fillColor: '#94a3b8',
        shadowBlur: 12,
        shadowColor: '#000',
        shadowDist: 6,
        shadowAngle: 45,
        extrudeDepth: 5,
        extrudeColor: '#1e293b',
        glowColor: '#38bdf8',
        glowSpread: 4,
        gradientCss: 'linear-gradient(180deg, #f8fafc 0%, #cbd5e1 30%, #64748b 60%, #1e293b 100%)'
    },
    himalaya: {
        name: 'Himalayan Sangri-La',
        bitmask: TITAN_TYPO_BITS.BOLD | TITAN_TYPO_BITS.METALLIC_GRADIENT | TITAN_TYPO_BITS.GLOW_ACTIVE | TITAN_TYPO_BITS.DROP_SHADOW,
        fontFamily: '"Mukti", "Preeti", "Kalimati", Georgia, serif',
        fontSize: 56,
        tracking: 2,
        strokeWidth: 1.5,
        strokeColor: '#fed7aa',
        fillType: 'saffron',
        fillColor: '#ea580c',
        shadowBlur: 16,
        shadowColor: 'rgba(0,0,0,0.85)',
        shadowDist: 5,
        shadowAngle: 45,
        extrudeDepth: 3,
        extrudeColor: '#7c2d12',
        glowColor: '#f97316',
        glowSpread: 8,
        gradientCss: 'linear-gradient(180deg, #fed7aa 0%, #fb923c 40%, #ea580c 70%, #9a3412 100%)'
    }
};

// ── TITAN TYPOGRAPHY CSS STYLESHEET ──
const TITAN_TYPO_STYLES_CSS = `
/* ═══════════════════════════════════════════════════════════════════
   🖋️ TITAN TYPOGRAPHY STUDIO — LUXURY PHOTOSHOP-BEATING CSS
   ═══════════════════════════════════════════════════════════════════ */
.titan-typo-rack {
    background: radial-gradient(circle at 50% 0%, #141c2b 0%, #070c18 100%);
    border: 1.5px solid #1e2f4a;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.85), inset 0 1px 0 rgba(56,189,248,0.2);
    overflow: hidden;
    position: relative;
}
.titan-typo-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; background: linear-gradient(180deg, #0f172a 0%, #090d16 100%);
    border-bottom: 1px solid #1e293b;
}
.typo-title-box { display: flex; align-items: center; gap: 8px; }
.typo-chip {
    font-family: monospace; font-size: 9px; font-weight: 900;
    padding: 2px 6px; border-radius: 4px; background: #0369a1; color: #7dd3fc;
}
.typo-bitmask-badge {
    font-family: monospace; font-size: 10.5px; font-weight: 800;
    padding: 3px 8px; border-radius: 6px; background: #020617; border: 1px solid #1e293b;
    color: #38bdf8; display: flex; align-items: center; gap: 5px;
}
.typo-bitmask-badge .dot { width: 6px; height: 6px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 8px #38bdf8; }

/* ── Live Visual Text Canvas / Stage ── */
.typo-preview-stage {
    background: radial-gradient(circle at 50% 50%, #0b1324 0%, #03060d 100%);
    background-image: repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px),
                      repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px);
    border: 1px solid #162035; border-radius: 12px; margin: 12px; min-height: 110px;
    display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;
    box-shadow: inset 0 4px 20px rgba(0,0,0,0.9);
}
.typo-stage-watermark {
    position: absolute; bottom: 6px; right: 10px; font-family: monospace; font-size: 8.5px;
    color: #334155; letter-spacing: 0.1em; pointer-events: none;
}
.typo-live-text {
    text-align: center; line-height: 1.15; cursor: default; user-select: none;
    transition: all 0.15s ease-out; position: relative; z-index: 5; max-width: 90%;
    word-break: break-word;
}

/* ── Bitmask Toggle Ribbon ── */
.typo-bit-ribbon {
    display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px; padding: 0 12px;
}
.typo-bit-btn {
    background: #0b1324; border: 1px solid #1e293b; border-radius: 6px; color: #94a3b8;
    padding: 5px 0; font-family: monospace; font-size: 10px; font-weight: 800;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s;
}
.typo-bit-btn .bit-val { font-size: 8px; opacity: 0.6; margin-top: 1px; }
.typo-bit-btn:hover { background: #141f36; color: #fff; border-color: #334155; }
.typo-bit-btn.active {
    background: linear-gradient(135deg, rgba(2,132,199,0.35), rgba(14,165,233,0.15));
    border-color: #0284c7; color: #38bdf8; box-shadow: 0 0 12px rgba(56,189,248,0.35);
}

/* ── Hollywood Presets Carousel ── */
.typo-presets-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; padding: 10px 12px;
}
.typo-preset-card {
    background: #080e1c; border: 1px solid #1a2742; border-radius: 8px; padding: 6px 8px;
    cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 3px;
}
.typo-preset-card:hover { border-color: #38bdf8; background: #0c172e; transform: translateY(-1px); }
.typo-preset-card.active { border-color: #0284c7; background: #0e1c38; box-shadow: 0 0 14px rgba(2,132,199,0.4); }
.typo-preset-title { font-size: 9.5px; font-weight: 800; color: #e2e8f0; letter-spacing: 0.04em; }
.typo-preset-sample { font-size: 12px; font-weight: 900; line-height: 1.2; }

/* ── Precision Sliders & Color Selectors ── */
.typo-controls-body {
    padding: 0 12px 14px; display: flex; flex-direction: column; gap: 10px;
}
.typo-field-row {
    display: flex; gap: 8px; align-items: center;
}
.typo-input-text {
    flex: 1; background: #060b16; border: 1px solid #1e293b; border-radius: 6px;
    padding: 7px 10px; color: #fff; font-size: 12px; font-weight: 700; outline: none;
    transition: all 0.15s;
}
.typo-input-text:focus { border-color: #0284c7; box-shadow: 0 0 10px rgba(2,132,199,0.4); }
.typo-font-select {
    width: 140px; background: #060b16; border: 1px solid #1e293b; border-radius: 6px;
    padding: 7px 8px; color: #38bdf8; font-size: 11px; font-weight: 700; outline: none; cursor: pointer;
}

/* Animations */
@keyframes typo-neon-pulse {
    0%, 100% { filter: drop-shadow(0 0 10px var(--glow-color)) drop-shadow(0 0 25px var(--glow-color)); }
    50% { filter: drop-shadow(0 0 4px var(--glow-color)) drop-shadow(0 0 12px var(--glow-color)); opacity: 0.88; }
}
.anim-neon-pulse { animation: typo-neon-pulse 1.8s infinite ease-in-out; }

@keyframes typo-glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
}
.anim-glitch-fx { animation: typo-glitch 0.4s infinite; }
`;

// ── RENDER FUNCTION (Compiles complete Photoshop-grade UI) ──
function renderTitanTypographyStudio(options) {
    const opts = options || {};
    const id = opts.id || 'titan-typo-studio';
    const defaultText = opts.text || 'DANPHE CINEMA 4K';
    const presetKey = opts.preset || 'cinema_gold';
    const activePreset = TYPO_PRESETS[presetKey] || TYPO_PRESETS.cinema_gold;
    const initialBitmask = opts.bitmask !== undefined ? opts.bitmask : activePreset.bitmask;

    // Build Bitmask Ribbon Buttons
    const bitButtons = [
        { key: 'BOLD', label: 'B', bit: TITAN_TYPO_BITS.BOLD, name: 'Bold' },
        { key: 'ITALIC', label: 'I', bit: TITAN_TYPO_BITS.ITALIC, name: 'Italic' },
        { key: 'ALL_CAPS', label: 'AA', bit: TITAN_TYPO_BITS.ALL_CAPS, name: 'All Caps' },
        { key: 'GLOW_ACTIVE', label: 'GLOW', bit: TITAN_TYPO_BITS.GLOW_ACTIVE, name: 'Neon Glow' },
        { key: 'EXTRUDE_3D', label: '3D', bit: TITAN_TYPO_BITS.EXTRUDE_3D, name: '3D Bevel' },
        { key: 'METALLIC_GRADIENT', label: 'GRAD', bit: TITAN_TYPO_BITS.METALLIC_GRADIENT, name: 'Metallic' }
    ];

    const bitButtonsHtml = bitButtons.map(b => {
        const isActive = (initialBitmask & b.bit) !== 0;
        return '<button type="button" class="typo-bit-btn' + (isActive ? ' active' : '') + '" ' +
            'id="' + id + '-bit-' + b.key + '" ' +
            'onclick="window.titanTypoToggleBit(\'' + id + '\', ' + b.bit + ', \'' + b.key + '\')" ' +
            'title="' + b.name + ' (Bit 0x' + b.bit.toString(16).padStart(4, '0') + ')">' +
            '<span>' + b.label + '</span>' +
            '<span class="bit-val">0x' + b.bit.toString(16) + '</span>' +
        '</button>';
    }).join('');

    // Build Hollywood Presets
    const presetsHtml = Object.keys(TYPO_PRESETS).map(key => {
        const p = TYPO_PRESETS[key];
        const isSelected = key === presetKey;
        return '<div class="typo-preset-card' + (isSelected ? ' active' : '') + '" ' +
            'id="' + id + '-preset-' + key + '" ' +
            'onclick="window.titanTypoApplyPreset(\'' + id + '\', \'' + key + '\')" ' +
            'title="Apply ' + p.name + ' Preset">' +
            '<span class="typo-preset-title">' + p.name + '</span>' +
            '<span class="typo-preset-sample" style="color:' + p.fillColor + '; text-shadow:0 0 6px ' + p.glowColor + ';">Aa TITAN</span>' +
        '</div>';
    }).join('');

    return '<style>' + TITAN_TYPO_STYLES_CSS + '</style>\n' +
    '<div id="' + id + '" class="titan-typo-rack font-mono select-none" ' +
         'data-bitmask="' + initialBitmask + '" ' +
         'data-font-size="' + activePreset.fontSize + '" ' +
         'data-tracking="' + activePreset.tracking + '" ' +
         'data-stroke="' + activePreset.strokeWidth + '" ' +
         'data-extrude="' + activePreset.extrudeDepth + '" ' +
         'data-shadow-blur="' + activePreset.shadowBlur + '" ' +
         'data-shadow-dist="' + activePreset.shadowDist + '" ' +
         'data-shadow-angle="' + activePreset.shadowAngle + '">' +

        // ── Header Bar ──
        '<div class="titan-typo-header">' +
            '<div class="typo-title-box">' +
                '<span class="typo-chip">TITAN 16-BIT</span>' +
                '<span class="text-xs font-black text-white uppercase tracking-wider">Photoshop-Grade Typography</span>' +
            '</div>' +
            '<div class="typo-bitmask-badge" title="Hardware 16-Bit Register 0x4210">' +
                '<span class="dot"></span>' +
                '<span id="' + id + '-bitmask-val">REG: 0x' + initialBitmask.toString(16).toUpperCase().padStart(4, '0') + '</span>' +
            '</div>' +
        '</div>' +

        // ── Live Text Stage Preview ──
        '<div class="typo-preview-stage" id="' + id + '-stage">' +
            '<div class="typo-stage-watermark">16-BIT GPU SHADER RENDER</div>' +
            '<div class="typo-live-text" id="' + id + '-live-text">' +
                defaultText +
            '</div>' +
        '</div>' +

        // ── Text Input & Font Family ──
        '<div style="padding: 0 12px 8px;">' +
            '<div class="typo-field-row">' +
                '<input type="text" id="' + id + '-input-string" class="typo-input-text" ' +
                       'value="' + defaultText + '" placeholder="Enter Title String..." ' +
                       'oninput="window.titanTypoUpdateText(\'' + id + '\', this.value)" />' +
                '<select id="' + id + '-select-font" class="typo-font-select" onchange="window.titanTypoSetFontFamily(\'' + id + '\', this.value)">' +
                    '<option value="Impact, sans-serif" selected>Impact Heavy</option>' +
                    '<option value="-apple-system, BlinkMacSystemFont, sans-serif">Modern Clean</option>' +
                    '<option value="Georgia, serif">Cinema Serif</option>' +
                    '<option value="monospace">Retro Terminal</option>' +
                    '<option value=\'"Mukti", "Preeti", "Kalimati", sans-serif\'>Nepali Unicode</option>' +
                '</select>' +
            '</div>' +
        '</div>' +

        // ── Bitmask Ribbon (6 Core Bits) ──
        '<div class="typo-bit-ribbon">' +
            bitButtonsHtml +
        '</div>' +

        // ── Hollywood Master Presets Grid ──
        '<div class="typo-presets-grid">' +
            presetsHtml +
        '</div>' +

        // ── Precision Hardware Sliders (0x4200 - 0x4206) ──
        '<div class="typo-controls-body">' +
            // Font Size (0x4200)
            '<div class="flex flex-col gap-1">' +
                '<div class="flex justify-between text-[10px] font-bold text-slate-400">' +
                    '<span>FONT SIZE (0x4200)</span><span id="' + id + '-lbl-fontsize" class="text-cyan-400 font-black">' + activePreset.fontSize + ' px</span>' +
                '</div>' +
                '<input type="range" min="16" max="140" value="' + activePreset.fontSize + '" class="zoom-slider w-full" ' +
                       'oninput="window.titanTypoSetSlider(\'' + id + '\', \'fontSize\', +this.value, \'px\', \'' + id + '-lbl-fontsize\', 0x4200)" />' +
            '</div>' +

            // Optical Tracking / Letter Spacing (0x4201)
            '<div class="flex flex-col gap-1">' +
                '<div class="flex justify-between text-[10px] font-bold text-slate-400">' +
                    '<span>OPTICAL TRACKING (0x4201)</span><span id="' + id + '-lbl-tracking" class="text-purple-400 font-black">+' + activePreset.tracking + ' px</span>' +
                '</div>' +
                '<input type="range" min="-4" max="40" value="' + activePreset.tracking + '" class="zoom-slider w-full" ' +
                       'oninput="window.titanTypoSetSlider(\'' + id + '\', \'tracking\', +this.value, \'px\', \'' + id + '-lbl-tracking\', 0x4201)" />' +
            '</div>' +

            // 3D Extrusion Depth (0x4206)
            '<div class="flex flex-col gap-1">' +
                '<div class="flex justify-between text-[10px] font-bold text-slate-400">' +
                    '<span>3D BEVEL EXTRUDE (0x4206)</span><span id="' + id + '-lbl-extrude" class="text-amber-400 font-black">' + activePreset.extrudeDepth + ' px</span>' +
                '</div>' +
                '<input type="range" min="0" max="20" value="' + activePreset.extrudeDepth + '" class="zoom-slider w-full" ' +
                       'oninput="window.titanTypoSetSlider(\'' + id + '\', \'extrude\', +this.value, \'px\', \'' + id + '-lbl-extrude\', 0x4206)" />' +
            '</div>' +

            // Dual Stroke Width (0x4202)
            '<div class="flex flex-col gap-1">' +
                '<div class="flex justify-between text-[10px] font-bold text-slate-400">' +
                    '<span>OUTLINE STROKE (0x4202)</span><span id="' + id + '-lbl-stroke" class="text-rose-400 font-black">' + activePreset.strokeWidth + ' px</span>' +
                '</div>' +
                '<input type="range" min="0" max="16" value="' + activePreset.strokeWidth + '" class="zoom-slider w-full" ' +
                       'oninput="window.titanTypoSetSlider(\'' + id + '\', \'stroke\', +this.value, \'px\', \'' + id + '-lbl-stroke\', 0x4202)" />' +
            '</div>' +
        '</div>' +

    '</div>';
}

module.exports = {
    renderTitanTypographyStudio,
    TitanTypographyStudio: renderTitanTypographyStudio,
    TITAN_TYPO_BITS,
    TITAN_TYPO_REG,
    TYPO_PRESETS,
    TITAN_TYPO_STYLES_CSS
};
