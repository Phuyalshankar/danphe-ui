'use strict';
var renderAdaptiveIconSVG = require('./TitanAdaptiveIcon').renderAdaptiveIconSVG;
var renderTitanProSlider  = require('./TitanProSlider').renderTitanProSlider;

function renderTitanColorInspector(options) {
    options = options || {};
    var id         = options.id         || 'titan-color-inspector';
    var title      = options.title      || 'Lumetri Color Grading';
    var exposure   = (options.exposure   !== undefined) ? options.exposure   : 0;
    var contrast   = (options.contrast   !== undefined) ? options.contrast   : 100;
    var saturation = (options.saturation !== undefined) ? options.saturation : 100;
    var temp       = (options.temp       !== undefined) ? options.temp       : 5500;
    var tint       = (options.tint       !== undefined) ? options.tint       : 0;

    return [
        '<div id="' + id + '" class="titan-color-inspector flex flex-col gap-3 p-4 bg-slate-900/95 rounded-2xl border border-slate-800 shadow-2xl font-mono select-none">',
          '<div class="flex items-center justify-between pb-3 border-b border-slate-800">',
            '<div class="flex items-center gap-2">',
              '<span class="text-rose-400">' + renderAdaptiveIconSVG(545, 0, 20, false, 0) + '</span>',
              '<span class="font-bold text-white tracking-wide uppercase text-sm">' + title + '</span>',
            '</div>',
            '<button onclick="titanColorReset(\'' + id + '\')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-all text-[11px] active:scale-95">',
              renderAdaptiveIconSVG(548, 0, 13, false, 0), ' Reset',
            '</button>',
          '</div>',

          renderTitanProSlider({ id: id+'-exp',     label: 'Exposure EV',        sublabel: 'Reg 0x4200', min: -200, max: 200, value: Math.round(exposure*100), unit: '',  style: 'lens', color: 'amber',   register: 0x4200 }),
          renderTitanProSlider({ id: id+'-contrast',label: 'Contrast Gamma',     sublabel: 'Reg 0x4201', min: 50,   max: 150, value: contrast,                 unit: '%', style: 'orb',  color: 'rose',    register: 0x4201 }),
          renderTitanProSlider({ id: id+'-temp',    label: 'Temperature K',      sublabel: 'Reg 0x4203', min: 2500, max: 9000,value: temp,                     unit: 'K', style: 'pill', color: 'amber',   register: 0x4203 }),
          renderTitanProSlider({ id: id+'-tint',    label: 'Tint Magenta/Green', sublabel: 'Reg 0x4204', min: -50,  max: 50,  value: tint,                     unit: '',  style: 'grip', color: 'emerald', register: 0x4204 }),
          renderTitanProSlider({ id: id+'-sat',     label: 'Saturation Vibrance',sublabel: 'Reg 0x4202', min: 0,    max: 200, value: saturation,               unit: '%', style: 'lens', color: 'cyan',    register: 0x4202 }),

        '</div>'
    ].join('');
}

module.exports = { renderTitanColorInspector: renderTitanColorInspector };
