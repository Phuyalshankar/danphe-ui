'use strict';
var renderAdaptiveIconSVG = require('./TitanAdaptiveIcon').renderAdaptiveIconSVG;
var renderTitanProSlider  = require('./TitanProSlider').renderTitanProSlider;

function renderTitanVideoInspector(options) {
    options = options || {};
    var id    = options.id    || 'titan-video-inspector';
    var title = options.title || 'Video Transform & Compositing';
    var scale    = (options.scale    !== undefined) ? options.scale    : 100;
    var rotation = (options.rotation !== undefined) ? options.rotation : 0;
    var posX     = (options.posX     !== undefined) ? options.posX     : 0;
    var posY     = (options.posY     !== undefined) ? options.posY     : 0;
    var opacity  = (options.opacity  !== undefined) ? options.opacity  : 100;
    var blur     = (options.blur     !== undefined) ? options.blur     : 0;
    var radius   = (options.radius   !== undefined) ? options.radius   : 0;

    return [
        '<div id="' + id + '" class="titan-video-inspector flex flex-col gap-3 p-4 bg-slate-900/95 rounded-2xl border border-slate-800 shadow-2xl font-mono select-none">',

          // Header
          '<div class="flex items-center justify-between pb-3 border-b border-slate-800">',
            '<div class="flex items-center gap-2">',
              '<span class="text-cyan-400">' + renderAdaptiveIconSVG(525, 0, 20, false, 0) + '</span>',
              '<span class="font-bold text-white tracking-wide uppercase text-sm">' + title + '</span>',
            '</div>',
            '<button onclick="titanVideoResetTransform(\'' + id + '\')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-all text-[11px] active:scale-95">',
              renderAdaptiveIconSVG(548, 0, 13, false, 0), ' Reset 100%',
            '</button>',
          '</div>',

          // Scale
          renderTitanProSlider({ id: id+'-scale',    label: 'Scale / Zoom',   sublabel: 'Reg 0x4101', min: 10,   max: 400, value: scale,    unit: '%',  style: 'lens', color: 'cyan',    register: 0x4101 }),
          // Rotation
          renderTitanProSlider({ id: id+'-rotation', label: 'Rotation Angle', sublabel: 'Reg 0x4102', min: -180, max: 180, value: rotation, unit: '°',  style: 'grip', color: 'purple',  register: 0x4102 }),
          // PosX
          renderTitanProSlider({ id: id+'-posX',     label: 'Position X',     sublabel: 'Reg 0x4103', min: -300, max: 300, value: posX,     unit: 'px', style: 'orb',  color: 'cyan',    register: 0x4103 }),
          // PosY
          renderTitanProSlider({ id: id+'-posY',     label: 'Position Y',     sublabel: 'Reg 0x4104', min: -300, max: 300, value: posY,     unit: 'px', style: 'orb',  color: 'cyan',    register: 0x4104 }),
          // Opacity
          renderTitanProSlider({ id: id+'-opacity',  label: 'Alpha Opacity',  sublabel: 'Reg 0x4100', min: 0,    max: 100, value: opacity,  unit: '%',  style: 'pill', color: 'emerald', register: 0x4100 }),
          // Blur
          renderTitanProSlider({ id: id+'-blur',     label: 'DoF Blur',       sublabel: 'Reg 0x4106', min: 0,    max: 50,  value: blur,     unit: 'px', style: 'grip', color: 'rose',    register: 0x4106 }),
          // Radius
          renderTitanProSlider({ id: id+'-radius',   label: 'Corner Radius',  sublabel: 'Reg 0x4105', min: 0,    max: 60,  value: radius,   unit: 'px', style: 'orb',  color: 'amber',   register: 0x4105 }),

        '</div>'
    ].join('');
}

module.exports = { renderTitanVideoInspector: renderTitanVideoInspector };
