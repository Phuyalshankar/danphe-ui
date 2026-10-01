'use strict';

/**
 * 🖋️ TitanPixelTextStudio — 3-Page Multi-Tab Android PixelLab-Grade Typography Studio
 * ═════════════════════════════════════════════════════════════════════════════════════
 * Page 1: 🔤 Core Typography & Formatting (Text, Font, Size, Color, Arc Curve, Tracking, Align)
 * Page 2: 🎨 Dual Stroke, Shadow & Emboss Lighting (Primary/Outer Stroke, Inner/Drop Shadow, Glow)
 * Page 3: 🧊 3D Extrude, Perspective & Subtitle Banner (3D Depth, Oblique, Floor Shadow, Banner Box)
 */

const { TITAN_TEXT_BITS, TITAN_TEXT_REG } = require('./TitanTextRegisters');
const { PIXELLAB_PRESETS } = require('./TitanTextPresets');

const PIXEL_STUDIO_CSS = `
/* ═══════ PixelLab 3-Page Master Typography Studio CSS ═══════ */
.pixel-studio-root {
    background: radial-gradient(circle at 50% 0%, #151d2c 0%, #080d1a 100%);
    border: 1.5px solid #1e293b;
    border-radius: 16px;
    box-shadow: 0 12px 36px rgba(0,0,0,0.85), inset 0 1px 0 rgba(56,189,248,0.2);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* Master 3-Page Tab Bar */
.pixel-tabs-bar {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    background: #060a14;
    border-bottom: 1px solid #142036;
    padding: 3px;
    gap: 3px;
}
.pixel-tab-btn {
    background: transparent;
    border: 1px solid transparent;
    border-radius: 6px;
    color: #64748b;
    font-family: monospace;
    font-size: 10.5px;
    font-weight: 800;
    padding: 6px 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    transition: all 0.15s;
    letter-spacing: 0.04em;
}
.pixel-tab-btn:hover { color: #cbd5e1; background: #0c1424; }
.pixel-tab-btn.active {
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
    border-color: #38bdf8;
    color: #fff;
    box-shadow: 0 0 12px rgba(2,132,199,0.5);
}

/* Page Containers */
.pixel-page-view {
    display: none;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
}
.pixel-page-view.active { display: flex; }

/* Section Titles inside Pages */
.pixel-sec-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: monospace;
    font-size: 10px;
    font-weight: 900;
    color: #94a3b8;
    letter-spacing: 0.06em;
    padding-bottom: 4px;
    border-bottom: 1px solid #162035;
    margin-bottom: 4px;
}
.pixel-chip {
    font-size: 8.5px;
    background: #0369a1;
    color: #bae6fd;
    padding: 1px 5px;
    border-radius: 3px;
}

/* 2x2 Grid of Micro Controls */
.pixel-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}
.pixel-control-box {
    background: #070c18;
    border: 1px solid #142036;
    border-radius: 8px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

/* Input Fields */
.pixel-input {
    background: #040711;
    border: 1px solid #1a2742;
    border-radius: 6px;
    padding: 6px 8px;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    outline: none;
}
.pixel-input:focus { border-color: #0284c7; }

/* Color Pickers */
.pixel-color-chip {
    width: 22px;
    height: 22px;
    border-radius: 4px;
    border: 1px solid #334155;
    cursor: pointer;
    padding: 0;
}
`;

function renderTitanPixelTextStudio(options) {
    const opts = options || {};
    const id = opts.id || 'titan-pixel-studio';
    const defaultText = opts.text || 'DANPHE CINEMA 4K';
    const activePreset = PIXELLAB_PRESETS[opts.preset || 'cinema_gold'] || PIXELLAB_PRESETS.cinema_gold;

    // Presets HTML
    const presetsHtml = Object.keys(PIXELLAB_PRESETS).map(key => {
        const p = PIXELLAB_PRESETS[key];
        return '<button type="button" class="pixel-tab-btn" onclick="window.pixelApplyPreset(\'' + id + '\', \'' + key + '\')" style="font-size:9.5px; padding:4px 6px;">' +
            p.name +
        '</button>';
    }).join('');

    return '<style>' + PIXEL_STUDIO_CSS + '</style>\n' +
    '<div id="' + id + '" class="pixel-studio-root font-mono select-none" ' +
         'data-active-tab="page-1">' +

        // ── MASTER 3-PAGE TABS ──
        '<div class="pixel-tabs-bar">' +
            '<button type="button" class="pixel-tab-btn active" id="' + id + '-tab-p1" onclick="window.pixelSwitchPage(\'' + id + '\', 1)">' +
                '<span>1. FORMAT</span>' +
            '</button>' +
            '<button type="button" class="pixel-tab-btn" id="' + id + '-tab-p2" onclick="window.pixelSwitchPage(\'' + id + '\', 2)">' +
                '<span>2. SHADOW & STROKE</span>' +
            '</button>' +
            '<button type="button" class="pixel-tab-btn" id="' + id + '-tab-p3" onclick="window.pixelSwitchPage(\'' + id + '\', 3)">' +
                '<span>3. 3D & BANNER</span>' +
            '</button>' +
        '</div>' +

        // ══════════════════════════════════════════════════════════════
        // PAGE 1: CORE TYPOGRAPHY, FONT & FORMATTING
        // ══════════════════════════════════════════════════════════════
        '<div class="pixel-page-view active" id="' + id + '-page-1">' +
            '<div class="pixel-sec-header"><span>1. TEXT STRING & FONT FAMILY</span><span class="pixel-chip">TYPOGRAPHY</span></div>' +
            '<div class="flex gap-2">' +
                '<input type="text" class="pixel-input flex-1" id="' + id + '-input-text" value="' + defaultText + '" oninput="window.pixelUpdateText(\'' + id + '\', this.value)" placeholder="Enter Text String..." />' +
                '<select class="pixel-input" id="' + id + '-font-family" style="width:130px" onchange="window.pixelUpdateFontFamily(\'' + id + '\', this.value)">' +
                    '<option value="Impact, sans-serif" selected>Impact Heavy</option>' +
                    '<option value="-apple-system, BlinkMacSystemFont, sans-serif">Modern Sans</option>' +
                    '<option value="Georgia, serif">Cinema Serif</option>' +
                    '<option value="Mukti, Preeti, Kalimati, sans-serif">Nepali Unicode</option>' +
                    '<option value="monospace">Cyber Matrix</option>' +
                '</select>' +
            '</div>' +

            // Bitmask Formatting Ribbon (B, I, U, AA, Bend, Grad)
            '<div class="grid grid-cols-6 gap-1 my-1">' +
                '<button type="button" class="pixel-tab-btn active" id="' + id + '-btn-bold" onclick="window.pixelToggleBit(\'' + id + '\', 1, 0x0001, \'bold\')">B</button>' +
                '<button type="button" class="pixel-tab-btn" id="' + id + '-btn-italic" onclick="window.pixelToggleBit(\'' + id + '\', 1, 0x0002, \'italic\')">I</button>' +
                '<button type="button" class="pixel-tab-btn active" id="' + id + '-btn-caps" onclick="window.pixelToggleBit(\'' + id + '\', 1, 0x0004, \'caps\')">AA</button>' +
                '<button type="button" class="pixel-tab-btn" id="' + id + '-btn-underline" onclick="window.pixelToggleBit(\'' + id + '\', 1, 0x0010, \'underline\')">U</button>' +
                '<button type="button" class="pixel-tab-btn" id="' + id + '-btn-bend" onclick="window.pixelToggleBit(\'' + id + '\', 2, 0x0010, \'bend\')">ARC</button>' +
                '<button type="button" class="pixel-tab-btn active" id="' + id + '-btn-grad" onclick="window.pixelToggleBit(\'' + id + '\', 2, 0x0040, \'grad\')">GRAD</button>' +
            '</div>' +

            // Size & Tracking Sliders
            '<div class="pixel-grid-2">' +
                '<div class="pixel-control-box">' +
                    '<div class="flex justify-between text-[9.5px] font-bold text-slate-400"><span>SIZE (0x4200)</span><span id="' + id + '-lbl-size" class="text-cyan-400">64 px</span></div>' +
                    '<input type="range" min="16" max="140" value="' + activePreset.fontSize + '" class="zoom-slider w-full" oninput="window.pixelSetSlider(\'' + id + '\', \'fontSize\', +this.value, \'px\', \'' + id + '-lbl-size\', 0x4200)" />' +
                '</div>' +
                '<div class="pixel-control-box">' +
                    '<div class="flex justify-between text-[9.5px] font-bold text-slate-400"><span>TRACKING (0x4201)</span><span id="' + id + '-lbl-track" class="text-purple-400">+4 px</span></div>' +
                    '<input type="range" min="-4" max="40" value="' + activePreset.tracking + '" class="zoom-slider w-full" oninput="window.pixelSetSlider(\'' + id + '\', \'tracking\', +this.value, \'px\', \'' + id + '-lbl-track\', 0x4201)" />' +
                '</div>' +
            '</div>' +

            // Arc Bend & Line Height
            '<div class="pixel-grid-2">' +
                '<div class="pixel-control-box">' +
                    '<div class="flex justify-between text-[9.5px] font-bold text-slate-400"><span>ARC BEND (0x420E)</span><span id="' + id + '-lbl-bend" class="text-amber-400">0°</span></div>' +
                    '<input type="range" min="-180" max="180" value="0" class="zoom-slider w-full" oninput="window.pixelSetSlider(\'' + id + '\', \'bendCurve\', +this.value, \'°\', \'' + id + '-lbl-bend\', 0x420E)" />' +
                '</div>' +
                '<div class="pixel-control-box">' +
                    '<div class="flex justify-between text-[9.5px] font-bold text-slate-400"><span>OPACITY (0x4208)</span><span id="' + id + '-lbl-opac" class="text-emerald-400">100%</span></div>' +
                    '<input type="range" min="0" max="100" value="100" class="zoom-slider w-full" oninput="window.pixelSetSlider(\'' + id + '\', \'opacity\', +this.value, \'%\', \'' + id + '-lbl-opac\', 0x4208)" />' +
                '</div>' +
            '</div>' +

            // Color Swatches
            '<div class="flex items-center justify-between mt-1">' +
                '<span class="text-[10px] font-bold text-slate-400">TEXT FILL SHADER:</span>' +
                '<div class="flex gap-1.5">' +
                    '<button type="button" class="pixel-color-chip" style="background:#fbbf24" onclick="window.pixelSetColor(\'' + id + '\', \'#fbbf24\', \'gold\')"></button>' +
                    '<button type="button" class="pixel-color-chip" style="background:#00f0ff" onclick="window.pixelSetColor(\'' + id + '\', \'#00f0ff\', \'neon\')"></button>' +
                    '<button type="button" class="pixel-color-chip" style="background:#e50914" onclick="window.pixelSetColor(\'' + id + '\', \'#e50914\', \'solid\')"></button>' +
                    '<button type="button" class="pixel-color-chip" style="background:#ffffff" onclick="window.pixelSetColor(\'' + id + '\', \'#ffffff\', \'solid\')"></button>' +
                    '<button type="button" class="pixel-color-chip" style="background:#ec4899" onclick="window.pixelSetColor(\'' + id + '\', \'#ec4899\', \'sunset\')"></button>' +
                '</div>' +
            '</div>' +
        '</div>' +

        // ══════════════════════════════════════════════════════════════
        // PAGE 2: STROKE, SHADOWS, GLOW & LIGHTING
        // ══════════════════════════════════════════════════════════════
        '<div class="pixel-page-view" id="' + id + '-page-2">' +
            '<div class="pixel-sec-header"><span>2. DUAL STROKE & OUTLINES</span><span class="pixel-chip">STROKE FX</span></div>' +
            '<div class="pixel-grid-2">' +
                '<div class="pixel-control-box">' +
                    '<div class="flex justify-between text-[9.5px] font-bold text-slate-400"><span>PRIMARY STROKE (0x4202)</span><span id="' + id + '-lbl-stroke1" class="text-rose-400">1.5 px</span></div>' +
                    '<input type="range" min="0" max="20" step="0.5" value="' + activePreset.strokeWidth + '" class="zoom-slider w-full" oninput="window.pixelSetSlider(\'' + id + '\', \'strokeWidth\', +this.value, \'px\', \'' + id + '-lbl-stroke1\', 0x4202)" />' +
                '</div>' +
                '<div class="pixel-control-box">' +
                    '<div class="flex justify-between text-[9.5px] font-bold text-slate-400"><span>OUTER STROKE (0x420C)</span><span id="' + id + '-lbl-stroke2" class="text-amber-400">3 px</span></div>' +
                    '<input type="range" min="0" max="20" step="0.5" value="' + activePreset.dualStrokeWidth + '" class="zoom-slider w-full" oninput="window.pixelSetSlider(\'' + id + '\', \'dualStrokeWidth\', +this.value, \'px\', \'' + id + '-lbl-stroke2\', 0x420C)" />' +
                '</div>' +
            '</div>' +

            '<div class="pixel-sec-header mt-1"><span>CINEMA SHADOW & NEON BLOOM</span><span class="pixel-chip">LIGHTING</span></div>' +
            '<div class="pixel-grid-2">' +
                '<div class="pixel-control-box">' +
                    '<div class="flex justify-between text-[9.5px] font-bold text-slate-400"><span>SHADOW BLUR (0x4203)</span><span id="' + id + '-lbl-sh-blur" class="text-cyan-400">18 px</span></div>' +
                    '<input type="range" min="0" max="50" value="' + activePreset.shadowBlur + '" class="zoom-slider w-full" oninput="window.pixelSetSlider(\'' + id + '\', \'shadowBlur\', +this.value, \'px\', \'' + id + '-lbl-sh-blur\', 0x4203)" />' +
                '</div>' +
                '<div class="pixel-control-box">' +
                    '<div class="flex justify-between text-[9.5px] font-bold text-slate-400"><span>SHADOW DIST (0x4205)</span><span id="' + id + '-lbl-sh-dist" class="text-purple-400">8 px</span></div>' +
                    '<input type="range" min="0" max="50" value="' + activePreset.shadowDist + '" class="zoom-slider w-full" oninput="window.pixelSetSlider(\'' + id + '\', \'shadowDist\', +this.value, \'px\', \'' + id + '-lbl-sh-dist\', 0x4205)" />' +
                '</div>' +
            '</div>' +
            '<div class="pixel-grid-2">' +
                '<div class="pixel-control-box">' +
                    '<div class="flex justify-between text-[9.5px] font-bold text-slate-400"><span>NEON GLOW SPREAD (0x4207)</span><span id="' + id + '-lbl-glow" class="text-emerald-400">6 px</span></div>' +
                    '<input type="range" min="0" max="40" value="' + activePreset.glowSpread + '" class="zoom-slider w-full" oninput="window.pixelSetSlider(\'' + id + '\', \'glowSpread\', +this.value, \'px\', \'' + id + '-lbl-glow\', 0x4207)" />' +
                '</div>' +
                '<div class="pixel-control-box">' +
                    '<div class="flex justify-between text-[9.5px] font-bold text-slate-400"><span>INNER SHADOW (0x420D)</span><span id="' + id + '-lbl-in-sh" class="text-rose-400">4 px</span></div>' +
                    '<input type="range" min="0" max="20" value="' + activePreset.innerShadowBlur + '" class="zoom-slider w-full" oninput="window.pixelSetSlider(\'' + id + '\', \'innerShadowBlur\', +this.value, \'px\', \'' + id + '-lbl-in-sh\', 0x420D)" />' +
                '</div>' +
            '</div>' +
        '</div>' +

        // ══════════════════════════════════════════════════════════════
        // PAGE 3: 3D EXTRUSION, PERSPECTIVE & BANNER
        // ══════════════════════════════════════════════════════════════
        '<div class="pixel-page-view" id="' + id + '-page-3">' +
            '<div class="pixel-sec-header"><span>3. 3D EXTRUSION & PERSPECTIVE</span><span class="pixel-chip">3D ENGINE</span></div>' +
            '<div class="pixel-grid-2">' +
                '<div class="pixel-control-box">' +
                    '<div class="flex justify-between text-[9.5px] font-bold text-slate-400"><span>3D DEPTH (0x4206)</span><span id="' + id + '-lbl-extrude" class="text-amber-400">8 px</span></div>' +
                    '<input type="range" min="0" max="30" value="' + activePreset.extrudeDepth + '" class="zoom-slider w-full" oninput="window.pixelSetSlider(\'' + id + '\', \'extrudeDepth\', +this.value, \'px\', \'' + id + '-lbl-extrude\', 0x4206)" />' +
                '</div>' +
                '<div class="pixel-control-box">' +
                    '<div class="flex justify-between text-[9.5px] font-bold text-slate-400"><span>3D X-TILT (0x420A)</span><span id="' + id + '-lbl-rotx" class="text-cyan-400">15°</span></div>' +
                    '<input type="range" min="-45" max="45" value="' + activePreset.rot3dX + '" class="zoom-slider w-full" oninput="window.pixelSetSlider(\'' + id + '\', \'rot3dX\', +this.value, \'°\', \'' + id + '-lbl-rotx\', 0x420A)" />' +
                '</div>' +
            '</div>' +

            '<div class="pixel-sec-header mt-1"><span>SUBTITLE BACKGROUND BANNER</span><span class="pixel-chip">BANNER BOX</span></div>' +
            '<div class="pixel-grid-2">' +
                '<div class="pixel-control-box">' +
                    '<div class="flex justify-between text-[9.5px] font-bold text-slate-400"><span>BANNER RADIUS (0x4214)</span><span id="' + id + '-lbl-banner-r" class="text-purple-400">8 px</span></div>' +
                    '<input type="range" min="0" max="30" value="' + activePreset.bannerRadius + '" class="zoom-slider w-full" oninput="window.pixelSetSlider(\'' + id + '\', \'bannerRadius\', +this.value, \'px\', \'' + id + '-lbl-banner-r\', 0x4214)" />' +
                '</div>' +
                '<div class="pixel-control-box">' +
                    '<div class="flex justify-between text-[9.5px] font-bold text-slate-400"><span>PAD X/Y</span><span id="' + id + '-lbl-banner-p" class="text-emerald-400">16 px</span></div>' +
                    '<input type="range" min="0" max="40" value="' + activePreset.bannerPadX + '" class="zoom-slider w-full" oninput="window.pixelSetSlider(\'' + id + '\', \'bannerPadX\', +this.value, \'px\', \'' + id + '-lbl-banner-p\', 0x4212)" />' +
                '</div>' +
            '</div>' +

            '<div class="pixel-sec-header mt-1"><span>8 HOLLYWOOD MASTER PRESETS</span><span class="pixel-chip">1-CLICK</span></div>' +
            '<div class="grid grid-cols-2 gap-1.5">' +
                presetsHtml +
            '</div>' +
        '</div>' +

    '</div>';
}

module.exports = {
    renderTitanPixelTextStudio,
    TitanPixelTextStudio: renderTitanPixelTextStudio,
    PIXEL_STUDIO_CSS
};
