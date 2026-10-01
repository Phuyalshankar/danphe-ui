'use strict';

function renderTitanProgress(options) {
    const opts = options || {};
    const value = opts.value !== undefined ? opts.value : 75;
    const max = opts.max !== undefined ? opts.max : 100;
    const variant = opts.variant || 'linear';
    const color = opts.color || 'cyan';
    const label = opts.label || '';
    const showValue = opts.showValue !== undefined ? opts.showValue : true;
    const size = opts.size || 48;
    const className = opts.className || '';

    const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

    const colorMap = {
        cyan: { bar: 'bg-cyan-500', glow: 'shadow-[0_0_12px_rgba(34,211,238,0.5)]', stroke: '#22d3ee' },
        emerald: { bar: 'bg-emerald-500', glow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]', stroke: '#10b981' },
        amber: { bar: 'bg-amber-500', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]', stroke: '#f59e0b' },
        rose: { bar: 'bg-rose-500', glow: 'shadow-[0_0_12px_rgba(244,63,94,0.5)]', stroke: '#f43f5e' }
    };
    const c = colorMap[color] || colorMap.cyan;

    if (variant === 'circular') {
        const radius = 18;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (pct / 100) * circumference;
        return '<div class="inline-flex flex-col items-center gap-1.5 ' + className + '">' +
            '<div class="relative w-[' + size + 'px] h-[' + size + 'px] flex items-center justify-center">' +
                '<svg viewBox="0 0 44 44" class="w-full h-full -rotate-90">' +
                    '<circle cx="22" cy="22" r="' + radius + '" fill="none" stroke="#1e293b" stroke-width="4"/>' +
                    '<circle cx="22" cy="22" r="' + radius + '" fill="none" stroke="' + c.stroke + '" stroke-width="4" stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '" stroke-linecap="round" class="transition-all duration-500"/>' +
                '</svg>' +
                (showValue ? '<span class="absolute text-[11px] font-black font-mono text-white">' + pct + '%</span>' : '') +
            '</div>' +
            (label ? '<span class="text-[10px] font-mono text-slate-400 font-bold">' + label + '</span>' : '') +
        '</div>';
    }

    return '<div class="w-full flex flex-col gap-1.5 ' + className + '">' +
        ((label || showValue) ? '<div class="flex items-center justify-between text-xs font-mono">' +
            (label ? '<span class="text-slate-300 font-bold">' + label + '</span>' : '<span></span>') +
            (showValue ? '<span class="text-cyan-400 font-bold">' + pct + '%</span>' : '') +
        '</div>' : '') +
        '<div class="w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5 shadow-inner">' +
            '<div class="h-full rounded-full ' + c.bar + ' ' + c.glow + ' transition-all duration-500" style="width: ' + pct + '%"></div>' +
        '</div>' +
    '</div>';
}

module.exports = { renderTitanProgress, TitanProgress: renderTitanProgress };
