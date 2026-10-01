'use strict';
var renderAdaptiveIconSVG = require('./TitanAdaptiveIcon').renderAdaptiveIconSVG;
var renderTitanProSlider  = require('./TitanProSlider').renderTitanProSlider;

function renderTitanTextInspector(options) {
    options = options || {};
    var id          = options.id          || 'titan-text-inspector';
    var title       = options.title       || 'Title & Subtitle Typography Studio';
    var text        = options.text        || 'DANPHE 4K MASTER';
    var size        = (options.size       !== undefined) ? options.size    : 36;
    var spacing     = (options.spacing    !== undefined) ? options.spacing : 2;
    var strokeWidth = (options.strokeWidth!== undefined) ? options.strokeWidth : 2;

    return [
        '<div id="' + id + '" class="titan-text-inspector flex flex-col gap-3 p-4 bg-slate-900/95 rounded-2xl border border-slate-800 shadow-2xl font-mono select-none">',
          '<div class="flex items-center justify-between pb-3 border-b border-slate-800">',
            '<div class="flex items-center gap-2">',
              '<span class="text-amber-400">' + renderAdaptiveIconSVG(533, 0, 20, false, 0) + '</span>',
              '<span class="font-bold text-white tracking-wide uppercase text-sm">' + title + '</span>',
            '</div>',
            '<span class="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 font-bold text-[10px]">T1 VECTOR</span>',
          '</div>',

          // Live Textarea
          '<div class="flex flex-col gap-1.5">',
            '<label class="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Title / Caption</label>',
            '<textarea id="' + id + '-textarea" rows="2" oninput="titanTextUpdateContent(\'' + id + '\', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold text-sm focus:border-amber-500 focus:outline-none transition-colors resize-none">' + text + '</textarea>',
          '</div>',

          // Font selector
          '<div class="grid grid-cols-2 gap-2">',
            '<div class="flex flex-col gap-1">',
              '<label class="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Font Family</label>',
              '<select id="' + id + '-font-select" onchange="titanTextUpdateFont(\'' + id + '\', this.value)" class="bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-xs focus:border-amber-500 focus:outline-none">',
                '<option value="sans-serif" selected>Cinematic Sans</option>',
                '<option value="Impact, sans-serif">Impact Heavy</option>',
                '<option value="Georgia, serif">Modern Serif</option>',
                '<option value="monospace">Retro Monospace</option>',
                '<option value="Arial, sans-serif">Nepali Unicode</option>',
              '</select>',
            '</div>',
            '<div class="flex flex-col gap-1">',
              '<label class="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Alignment</label>',
              '<div class="flex gap-1 h-[38px]">',
                '<button onclick="titanTextUpdateAlign(\'' + id + '\', \'left\')" id="' + id + '-align-left" class="flex-1 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:border-amber-500 hover:text-white transition-all">' + renderAdaptiveIconSVG(541, 0, 15, false, 0) + '</button>',
                '<button onclick="titanTextUpdateAlign(\'' + id + '\', \'center\')" id="' + id + '-align-center" class="flex-1 flex items-center justify-center rounded-lg bg-amber-950 border border-amber-500 text-amber-300 transition-all">' + renderAdaptiveIconSVG(542, 0, 15, false, 0) + '</button>',
                '<button onclick="titanTextUpdateAlign(\'' + id + '\', \'right\')" id="' + id + '-align-right" class="flex-1 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:border-amber-500 hover:text-white transition-all">' + renderAdaptiveIconSVG(543, 0, 15, false, 0) + '</button>',
              '</div>',
            '</div>',
          '</div>',

          // Pro Sliders
          renderTitanProSlider({ id: id+'-size',    label: 'Font Size',     sublabel: 'px', min: 12, max: 120, value: size,        unit: 'px', style: 'pill', color: 'amber',   register: 0 }),
          renderTitanProSlider({ id: id+'-spacing', label: 'Letter Spacing',sublabel: 'px', min: -2, max: 20,  value: spacing,     unit: 'px', style: 'grip', color: 'amber',   register: 0 }),
          renderTitanProSlider({ id: id+'-stroke',  label: 'Stroke Border', sublabel: 'px', min: 0,  max: 10,  value: strokeWidth, unit: 'px', style: 'lens', color: 'rose',    register: 0 }),

        '</div>'
    ].join('');
}

module.exports = { renderTitanTextInspector: renderTitanTextInspector };
