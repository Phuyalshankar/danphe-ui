'use strict';

const TITAN_SLIDER_STYLES_CSS = `
.titan-pro-slider-rack {
    background: radial-gradient(circle at 50% 0%, #1e232b 0%, #0d0f12 100%);
    background-image: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.4) 3px, rgba(0,0,0,0.4) 4px);
    border: 1px solid #1f242d;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.7);
}
.titan-slider-channel {
    position: relative;
    width: 100%;
    height: 14px;
    background: #06080a;
    border-radius: 9999px;
    box-shadow:
        inset 0 3px 6px rgba(0,0,0,0.9),
        inset 0 1px 2px rgba(0,0,0,0.95),
        0 1px 0 rgba(255,255,255,0.10),
        0 -1px 0 rgba(0,0,0,0.8);
    cursor: pointer;
    user-select: none;
}
.titan-slider-led-fill {
    position: absolute;
    top: 2.5px; bottom: 2.5px; left: 4px;
    border-radius: 9999px;
    background: linear-gradient(180deg, #6ee7b7 0%, #10b981 40%, #047857 100%);
    box-shadow: 0 0 14px rgba(16,185,129,0.75), 0 0 5px rgba(52,211,153,0.9), inset 0 1px 1px rgba(255,255,255,0.8);
    pointer-events: none;
    transition: width 0.04s ease-out;
}
.titan-slider-led-fill::after {
    content: '';
    position: absolute;
    top: 1px; left: 6px; right: 6px; height: 2px;
    background: rgba(255,255,255,0.72);
    border-radius: 9999px;
    filter: blur(0.4px);
}
.titan-slider-led-fill.cyan {
    background: linear-gradient(180deg, #7dd3fc 0%, #0ea5e9 40%, #0369a1 100%);
    box-shadow: 0 0 14px rgba(14,165,233,0.75), 0 0 5px rgba(56,189,248,0.9), inset 0 1px 1px rgba(255,255,255,0.8);
}
.titan-slider-led-fill.amber {
    background: linear-gradient(180deg, #fde047 0%, #eab308 40%, #a16207 100%);
    box-shadow: 0 0 14px rgba(234,179,8,0.75), 0 0 5px rgba(250,204,21,0.9), inset 0 1px 1px rgba(255,255,255,0.8);
}
.titan-slider-led-fill.rose {
    background: linear-gradient(180deg, #fda4af 0%, #f43f5e 40%, #be123c 100%);
    box-shadow: 0 0 14px rgba(244,63,94,0.75), 0 0 5px rgba(251,113,133,0.9), inset 0 1px 1px rgba(255,255,255,0.8);
}
.titan-slider-led-fill.purple {
    background: linear-gradient(180deg, #d8b4fe 0%, #a855f7 40%, #7e22ce 100%);
    box-shadow: 0 0 14px rgba(168,85,247,0.75), 0 0 5px rgba(196,181,253,0.9), inset 0 1px 1px rgba(255,255,255,0.8);
}

/* === KNOB: ORB (Matte Beveled Round) === */
.titan-knob-orb {
    position: absolute; top: 50%;
    width: 24px; height: 24px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: linear-gradient(145deg, #2d333d 0%, #15181d 100%);
    border: 1px solid #3c434f;
    box-shadow:
        0 4px 8px rgba(0,0,0,0.8),
        inset 0 1px 1px rgba(255,255,255,0.38),
        inset 0 -2px 3px rgba(0,0,0,0.8);
    cursor: grab; z-index: 10; pointer-events: none;
}

/* === KNOB: GRIP (Vertical Capsule |||) === */
.titan-knob-grip {
    position: absolute; top: 50%;
    width: 18px; height: 30px;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    background: linear-gradient(145deg, #2e343e 0%, #171a1f 100%);
    border: 1px solid #3d4552;
    box-shadow:
        0 5px 10px rgba(0,0,0,0.85),
        inset 0 1px 1px rgba(255,255,255,0.30),
        inset 0 -2px 3px rgba(0,0,0,0.8);
    display: flex; align-items: center; justify-content: center; gap: 2px;
    z-index: 10; pointer-events: none;
}
.titan-knob-grip .ridge {
    width: 1.5px; height: 14px;
    background: #0f1216;
    border-right: 1px solid rgba(255,255,255,0.16);
    border-radius: 1px;
}

/* === KNOB: LENS (LED Indicator Center) === */
.titan-knob-lens {
    position: absolute; top: 50%;
    width: 28px; height: 28px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: radial-gradient(circle, #272d37 40%, #121519 100%);
    border: 1px solid #3f4756;
    box-shadow:
        0 6px 14px rgba(0,0,0,0.9),
        inset 0 1px 2px rgba(255,255,255,0.42),
        inset 0 -3px 4px rgba(0,0,0,0.8);
    display: flex; align-items: center; justify-content: center;
    z-index: 10; pointer-events: none;
}
.titan-knob-lens .center-led {
    width: 8px; height: 8px; border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 8px #34d399, inset 0 1px 1px rgba(255,255,255,0.8);
    border: 1px solid #065f46;
}
.titan-knob-lens.cyan   .center-led { background:#0ea5e9; box-shadow:0 0 9px #38bdf8; border-color:#0369a1; }
.titan-knob-lens.amber  .center-led { background:#eab308; box-shadow:0 0 9px #fde047; border-color:#854d0e; }
.titan-knob-lens.rose   .center-led { background:#f43f5e; box-shadow:0 0 9px #fb7171; border-color:#9f1239; }
.titan-knob-lens.purple .center-led { background:#a855f7; box-shadow:0 0 9px #d8b4fe; border-color:#6b21a8; }

/* === KNOB: PILL (Wide Horizontal Fader) === */
.titan-knob-pill {
    position: absolute; top: 50%;
    width: 68px; height: 20px;
    transform: translate(-50%, -50%);
    border-radius: 9999px;
    background: linear-gradient(180deg, #2e343f 0%, #16191f 100%);
    border: 1px solid #3c4452;
    box-shadow:
        0 4px 10px rgba(0,0,0,0.85),
        inset 0 1px 1px rgba(255,255,255,0.30),
        inset 0 -2px 3px rgba(0,0,0,0.8);
    display: flex; align-items: center; justify-content: center;
    z-index: 10; pointer-events: none;
}
.titan-knob-pill .pill-groove {
    width: 46px; height: 4px;
    background: #0b0d10; border-radius: 2px;
    border-bottom: 1px solid rgba(255,255,255,0.12);
}

/* === Native Invisible Input === */
.titan-slider-native-input {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    opacity: 0; cursor: pointer; z-index: 20; margin: 0;
}
`;

function renderTitanProSlider(options) {
    options = options || {};
    var id         = options.id       || 'titan-pro-slider';
    var label      = options.label    || 'Master Gain';
    var sublabel   = options.sublabel || '0x4000';
    var min        = (options.min !== undefined) ? options.min : 0;
    var max        = (options.max !== undefined) ? options.max : 255;
    var value      = (options.value !== undefined) ? options.value : 180;
    var unit       = options.unit     || '';
    var style      = options.style    || 'orb';
    var color      = options.color    || 'emerald';
    var register   = (options.register !== undefined) ? options.register : 0x4000;

    var pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    var fillW = 'calc(' + pct + '% - 3px)';

    var knobHtml;
    if (style === 'grip') {
        knobHtml = '<div id="' + id + '-knob" class="titan-knob-grip" style="left:' + pct + '%"><div class="ridge"></div><div class="ridge"></div><div class="ridge"></div></div>';
    } else if (style === 'lens') {
        knobHtml = '<div id="' + id + '-knob" class="titan-knob-lens ' + color + '" style="left:' + pct + '%"><div class="center-led"></div></div>';
    } else if (style === 'pill') {
        knobHtml = '<div id="' + id + '-knob" class="titan-knob-pill" style="left:' + pct + '%"><div class="pill-groove"></div></div>';
    } else {
        knobHtml = '<div id="' + id + '-knob" class="titan-knob-orb" style="left:' + pct + '%"></div>';
    }

    var valColorClass = color === 'cyan' ? 'text-cyan-400' : color === 'amber' ? 'text-amber-400' : color === 'rose' ? 'text-rose-400' : color === 'purple' ? 'text-purple-400' : 'text-emerald-400';

    return [
        '<div id="' + id + '-container" class="flex flex-col gap-2 p-3.5 rounded-2xl titan-pro-slider-rack font-mono select-none">',
          '<div class="flex items-center justify-between text-xs mb-0.5">',
            '<div class="flex items-center gap-2">',
              '<span class="font-black text-slate-200 tracking-wide uppercase text-[11px]">' + label + '</span>',
              '<span class="text-[9px] text-slate-600 font-bold">' + sublabel + '</span>',
            '</div>',
            '<div class="flex items-center gap-1.5">',
              '<span id="' + id + '-val" class="font-black text-xs ' + valColorClass + '">' + value + unit + '</span>',
              '<span class="text-[9px] text-slate-600">(' + Math.round(pct) + '%)</span>',
            '</div>',
          '</div>',
          '<div class="titan-slider-channel" id="' + id + '-channel">',
            '<div id="' + id + '-fill" class="titan-slider-led-fill ' + color + '" style="width:' + fillW + '"></div>',
            knobHtml,
            '<input type="range" min="' + min + '" max="' + max + '" value="' + value + '" id="' + id + '-input" oninput="titanProSliderUpdate(\'' + id + '\',+this.value,' + min + ',' + max + ',\'' + unit + '\',' + register + ')" class="titan-slider-native-input">',
          '</div>',
        '</div>'
    ].join('');
}

// ══════════════════════════════════════════════════════════════
//  🎚️ STANDALONE — CSS + JS + HTML all-in-one (drop anywhere)
// ══════════════════════════════════════════════════════════════
var TITAN_SLIDER_JS_HANDLER = '\n<script>\nif (!window.__titanProSliderLoaded) {\n    window.__titanProSliderLoaded = true;\n    window.titanProSliderUpdate = function(id, rawVal, min, max, unit, reg) {\n        var val = Number(rawVal);\n        var pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));\n        var valEl  = document.getElementById(id + \'-val\');\n        var fillEl = document.getElementById(id + \'-fill\');\n        var knobEl = document.getElementById(id + \'-knob\');\n        if (valEl)  valEl.innerText  = val + unit;\n        if (fillEl) fillEl.style.width = \'calc(\' + pct + \'% - 3px)\';\n        if (knobEl) knobEl.style.left  = pct + \'%\';\n    };\n}\n<\/script>\n';

/**
 * renderTitanProSliderStandalone(options)
 * ─────────────────────────────────────────
 * Fully self-contained: injects <style> + HTML + <script> in one call.
 * Use this when you don't have danphe-ui CSS already loaded globally.
 *
 * @example
 *   const { renderTitanProSliderStandalone } = require('danphe-ui');
 *   res.end('<html><body>' + renderTitanProSliderStandalone({ label: 'Volume', value: 200, style: 'lens', color: 'cyan' }) + '</body></html>');
 */
function renderTitanProSliderStandalone(options) {
    return [
        '<style id="titan-pro-slider-css">' + TITAN_SLIDER_STYLES_CSS + '<\/style>',
        renderTitanProSlider(options),
        TITAN_SLIDER_JS_HANDLER
    ].join('\n');
}

/**
 * renderTitanProSliderGroup(slidersArray, groupOptions)
 * ───────────────────────────────────────────────────────
 * Renders multiple sliders wrapped in a single styled rack panel.
 * Injects CSS + JS once (not per slider).
 *
 * @param {Array}  slidersArray  - Array of slider option objects
 * @param {Object} groupOptions  - { id, title, standalone }
 *
 * @example
 *   renderTitanProSliderGroup([
 *     { label: 'Master Volume', value: 200, style: 'lens', color: 'emerald', register: 0x4000 },
 *     { label: 'Reverb Send',   value: 80,  style: 'grip', color: 'cyan',    register: 0x4001 },
 *     { label: 'Bass EQ',       value: 128, style: 'orb',  color: 'amber',   register: 0x4002 },
 *   ], { title: 'Audio DSP Rack', standalone: true })
 */
function renderTitanProSliderGroup(slidersArray, groupOptions) {
    groupOptions = groupOptions || {};
    var id         = groupOptions.id         || 'titan-slider-group';
    var title      = groupOptions.title      || 'Studio Control Rack';
    var standalone = (groupOptions.standalone !== false); // default true

    var slidersHtml = (slidersArray || []).map(function(opt, i) {
        if (!opt.id) opt.id = id + '-s' + i;
        return renderTitanProSlider(opt);
    }).join('');

    var html = [
        '<div id="' + id + '" class="flex flex-col gap-0 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl" style="background:#0d0f12;">',
          title ? '<div class="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-[#0a0c0f]">' +
                    '<span class="font-black text-slate-300 tracking-widest uppercase text-[11px] font-mono">' + title + '</span>' +
                    '<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">' + (slidersArray || []).length + ' FADERS</span>' +
                  '</div>' : '',
          '<div class="flex flex-col gap-px">',
            slidersHtml,
          '</div>',
        '</div>'
    ].join('');

    if (standalone) {
        return '<style id="titan-pro-slider-css">' + TITAN_SLIDER_STYLES_CSS + '<\/style>\n' + html + '\n' + TITAN_SLIDER_JS_HANDLER;
    }
    return html;
}

module.exports = {
    renderTitanProSlider:           renderTitanProSlider,
    TitanProSlider:                 renderTitanProSlider,
    renderTitanProSliderStandalone: renderTitanProSliderStandalone,
    renderTitanProSliderGroup:      renderTitanProSliderGroup,
    TITAN_SLIDER_STYLES_CSS:        TITAN_SLIDER_STYLES_CSS,
    TITAN_SLIDER_JS_HANDLER:        TITAN_SLIDER_JS_HANDLER
};
