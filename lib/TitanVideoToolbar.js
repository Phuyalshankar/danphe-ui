'use strict';

/**
 * 🎬 TitanVideoToolbar (danphe-ui)
 * NLE Video Editor Interactive Toolbar using Core Bundled Icons (Bank 0x02: 512 - 530)
 */

const { renderAdaptiveIconSVG } = require('./TitanAdaptiveIcon');

const VIDEO_TOOLS = [
    { key: 'leftcut', code: 514, label: 'Left Cut', shortcut: 'Q', color: '#f43f5e' },
    { key: 'split', code: 512, label: 'Razor Split', shortcut: 'C', color: '#38bdf8' },
    { key: 'rightcut', code: 516, label: 'Right Cut', shortcut: 'W', color: '#f43f5e' },
    { key: 'ripple_delete', code: 518, label: 'Ripple Del', shortcut: 'Shift+Del', color: '#fb7185' },
    { key: 'magnet', code: 521, label: 'Snap', shortcut: 'S', color: '#34d399' },
    { key: 'slip_tool', code: 519, label: 'Slip', shortcut: 'Y', color: '#fbbf24' },
    { key: 'slide_tool', code: 520, label: 'Slide', shortcut: 'U', color: '#fbbf24' },
    { key: 'keyframe', code: 522, label: 'Keyframe', shortcut: 'K', color: '#a855f7' },
    { key: 'speed_ramp', code: 523, label: 'Speed', shortcut: 'R', color: '#38bdf8' },
    { key: 'freeze_frame', code: 524, label: 'Freeze', shortcut: 'F', color: '#38bdf8' },
    { key: 'mask_tool', code: 526, label: 'Mask', shortcut: 'M', color: '#ec4899' },
    { key: 'pip_overlay', code: 525, label: 'PiP', shortcut: 'P', color: '#818cf8' },
    { key: 'detach_audio', code: 527, label: 'Audio', shortcut: 'A', color: '#2dd4bf' },
    { key: 'export_render', code: 530, label: 'Export 4K', shortcut: 'Ctrl+M', color: '#10b981' }
];

function renderVideoToolbar(options) {
    const opts = options || {};
    const id = opts.id || 'titan-video-toolbar';
    const activeTool = opts.activeTool || 'split';

    const buttonsHtml = VIDEO_TOOLS.map(t => {
        const isActive = t.key === activeTool;
        return '<button type="button" onclick="window.titanSelectVideoTool(\'' + id + '\', \'' + t.key + '\')" id="' + id + '-btn-' + t.key + '" ' +
            'title="' + t.label + ' (' + t.shortcut + ')" ' +
            'class="group/btn relative flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-200 ' +
            (isActive ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-105' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900') + '">' +
            '<div class="w-6 h-6 flex items-center justify-center transition-transform group-hover/btn:scale-110">' +
                renderAdaptiveIconSVG(-t.code, 0, 20) +
            '</div>' +
            '<span class="text-[9px] font-mono font-bold mt-1 tracking-tight truncate max-w-[50px]">' + t.label + '</span>' +
            '<span class="absolute -top-1.5 -right-1 text-[8px] font-mono font-bold bg-slate-900 px-1 py-0.2 rounded border border-slate-700 text-slate-400 opacity-70 group-hover/btn:opacity-100">' + t.shortcut + '</span>' +
        '</button>';
    }).join('');

    return '<div id="' + id + '" class="titan-video-toolbar-root flex flex-col gap-3 p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-xl">' +
        '<div class="flex items-center justify-between pb-2 border-b border-slate-800">' +
            '<div class="flex items-center gap-2">' +
                '<span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>' +
                '<h4 class="text-xs font-black font-mono uppercase tracking-wider text-white">NLE Pro Editing Toolbar (Bank 0x02: 512-530)</h4>' +
            '</div>' +
            '<span id="' + id + '-active-label" class="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-800 font-bold">TOOL: ' + activeTool.toUpperCase() + '</span>' +
        '</div>' +
        '<div class="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-14 gap-2">' +
            buttonsHtml +
        '</div>' +
    '</div>';
}

module.exports = {
    renderVideoToolbar,
    TitanVideoToolbar: renderVideoToolbar,
    VIDEO_TOOLS
};
