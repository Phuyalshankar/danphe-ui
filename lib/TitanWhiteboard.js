'use strict';

/**
 * ✍️ TitanWhiteboard (danphe-ui)
 * Zero-Dependency Real-Time Mathematical SVG Vector Freehand & Shape Engine
 * ═════════════════════════════════════════════════════════════════════════════
 * • Freehand Neon, Pen & Highlighter with Quadratic Bézier Splines
 * • Geometric Shapes: Circle, Square/Rect, Straight Line, Vector Arrow, Triangle
 * • Live Drag Shape Scaling &bull; Fill/Outline Toggle &bull; 1-Click SVG Export
 */

function renderTitanWhiteboard(options) {
    const opts = options || {};
    const id = opts.id || 'titan-whiteboard-' + Math.random().toString(36).substr(2, 6);
    const title = opts.title || 'Live SVG Vector Whiteboard & Geometric Studio';
    const subtitle = opts.subtitle || 'Freehand Bézier Splines &bull; Circle, Square, Line, Arrow & Shapes &bull; Touch & Mouse';
    const width = opts.width || 800;
    const height = opts.height || 380;
    const className = opts.className || '';

    return '<div id="' + id + '" class="titan-whiteboard-root flex flex-col gap-4 p-6 bg-slate-900/95 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-2xl ' + className + '">' +
        // Header & Action Bar
        '<div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">' +
            '<div class="flex items-center gap-3">' +
                '<div class="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">' +
                    '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 2 4 4-14 14H4v-4L18 2z"/><path d="m14.5 5.5 4 4"/></svg>' +
                '</div>' +
                '<div>' +
                    '<h3 class="text-sm font-black text-white font-mono uppercase tracking-wider">' + title + '</h3>' +
                    '<p class="text-[11px] text-slate-400 font-mono">' + subtitle + '</p>' +
                '</div>' +
            '</div>' +
            '<div class="flex items-center gap-2">' +
                '<span class="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-3 py-1 rounded-full border border-cyan-700 font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,211,238,0.2)]">' +
                    '<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span> 120 FPS SHAPES & BÉZIER' +
                '</span>' +
            '</div>' +
        '</div>' +

        // Toolbar: Brushes, Geometric Shapes, Colors, Width, Fill, Undo, Clear, Download
        '<div class="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono">' +
            // Freehand & Shape Tools
            '<div class="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">' +
                '<button type="button" onclick="window.titanWbSetMode(\'' + id + '\', \'neon\')" id="' + id + '-btn-neon" class="px-2.5 py-1.5 rounded-lg font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 transition-all flex items-center gap-1">⚡ Freehand</button>' +
                '<button type="button" onclick="window.titanWbSetMode(\'' + id + '\', \'line\')" id="' + id + '-btn-line" class="px-2.5 py-1.5 rounded-lg font-bold text-slate-400 hover:text-white transition-all flex items-center gap-1">📏 Line</button>' +
                '<button type="button" onclick="window.titanWbSetMode(\'' + id + '\', \'arrow\')" id="' + id + '-btn-arrow" class="px-2.5 py-1.5 rounded-lg font-bold text-slate-400 hover:text-white transition-all flex items-center gap-1">➡️ Arrow</button>' +
                '<button type="button" onclick="window.titanWbSetMode(\'' + id + '\', \'rect\')" id="' + id + '-btn-rect" class="px-2.5 py-1.5 rounded-lg font-bold text-slate-400 hover:text-white transition-all flex items-center gap-1">🔲 Square</button>' +
                '<button type="button" onclick="window.titanWbSetMode(\'' + id + '\', \'circle\')" id="' + id + '-btn-circle" class="px-2.5 py-1.5 rounded-lg font-bold text-slate-400 hover:text-white transition-all flex items-center gap-1">⭕ Circle</button>' +
                '<button type="button" onclick="window.titanWbSetMode(\'' + id + '\', \'triangle\')" id="' + id + '-btn-triangle" class="px-2.5 py-1.5 rounded-lg font-bold text-slate-400 hover:text-white transition-all flex items-center gap-1">📐 Triangle</button>' +
                '<button type="button" onclick="window.titanWbSetMode(\'' + id + '\', \'highlighter\')" id="' + id + '-btn-highlighter" class="px-2.5 py-1.5 rounded-lg font-bold text-slate-400 hover:text-white transition-all flex items-center gap-1">🖍️ High</button>' +
                '<button type="button" onclick="window.titanWbSetMode(\'' + id + '\', \'eraser\')" id="' + id + '-btn-eraser" class="px-2.5 py-1.5 rounded-lg font-bold text-slate-400 hover:text-white transition-all flex items-center gap-1">🧹 Eraser</button>' +
            '</div>' +

            // Fill Toggle
            '<div class="flex items-center gap-1 bg-slate-900 px-2 py-1.5 rounded-xl border border-slate-800">' +
                '<label class="flex items-center gap-1.5 cursor-pointer text-slate-300 select-none">' +
                    '<input type="checkbox" id="' + id + '-fill-toggle" onchange="window.titanWbSetFill(\'' + id + '\', this.checked)" class="accent-cyan-400 cursor-pointer">' +
                    '<span class="text-[11px] font-bold">Fill Shape</span>' +
                '</label>' +
            '</div>' +

            // Color Swatches
            '<div class="flex items-center gap-2">' +
                '<button type="button" onclick="window.titanWbSetColor(\'' + id + '\', \'#22d3ee\')" class="w-6 h-6 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_8px_#22d3ee] scale-110 transition-transform" title="Cyan Neon"></button>' +
                '<button type="button" onclick="window.titanWbSetColor(\'' + id + '\', \'#10b981\')" class="w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-800 hover:border-white shadow-[0_0_8px_#10b981] transition-transform" title="Emerald Green"></button>' +
                '<button type="button" onclick="window.titanWbSetColor(\'' + id + '\', \'#f43f5e\')" class="w-6 h-6 rounded-full bg-rose-500 border-2 border-slate-800 hover:border-white shadow-[0_0_8px_#f43f5e] transition-transform" title="Rose Crimson"></button>' +
                '<button type="button" onclick="window.titanWbSetColor(\'' + id + '\', \'#f59e0b\')" class="w-6 h-6 rounded-full bg-amber-400 border-2 border-slate-800 hover:border-white shadow-[0_0_8px_#f59e0b] transition-transform" title="Amber Gold"></button>' +
                '<button type="button" onclick="window.titanWbSetColor(\'' + id + '\', \'#a855f7\')" class="w-6 h-6 rounded-full bg-purple-500 border-2 border-slate-800 hover:border-white shadow-[0_0_8px_#a855f7] transition-transform" title="Royal Purple"></button>' +
                '<button type="button" onclick="window.titanWbSetColor(\'' + id + '\', \'#ffffff\')" class="w-6 h-6 rounded-full bg-white border-2 border-slate-800 hover:border-white shadow-[0_0_8px_#ffffff] transition-transform" title="Pure White"></button>' +
            '</div>' +

            // Stroke Width Slider
            '<div class="flex items-center gap-2">' +
                '<span class="text-[10px] text-slate-400 uppercase font-bold">Width</span>' +
                '<input type="range" id="' + id + '-stroke-slider" min="2" max="28" value="4" oninput="window.titanWbSetWidth(\'' + id + '\', this.value)" class="w-20 accent-cyan-400 cursor-pointer">' +
                '<span id="' + id + '-width-val" class="text-white font-bold text-xs w-4">4</span>' +
            '</div>' +

            // Actions: Undo, Clear, Download SVG
            '<div class="flex items-center gap-1.5">' +
                '<button type="button" onclick="window.titanWbUndo(\'' + id + '\')" class="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold transition-all">↩️ Undo</button>' +
                '<button type="button" onclick="window.titanWbClear(\'' + id + '\')" class="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-rose-400 border border-slate-800 font-bold transition-all">🗑️ Clear</button>' +
                '<button type="button" onclick="window.titanWbDownloadSvg(\'' + id + '\')" class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1">💾 Export SVG</button>' +
            '</div>' +
        '</div>' +

        // The Drawing Canvas (Pure SVG)
        '<div class="relative w-full rounded-2xl bg-slate-950 border-2 border-slate-800/80 overflow-hidden shadow-inner cursor-crosshair select-none" style="min-height: ' + height + 'px;">' +
            // Grid Background
            '<div class="absolute inset-0 opacity-15 pointer-events-none" style="background-image: radial-gradient(#38bdf8 1px, transparent 1px); background-size: 24px 24px;"></div>' +
            
            // Interactive SVG Element
            '<svg id="' + id + '-canvas" viewBox="0 0 ' + width + ' ' + height + '" class="w-full h-full block" style="min-height: ' + height + 'px; touch-action: none;" xmlns="http://www.w3.org/2000/svg">' +
                '<defs>' +
                    '<marker id="arrowhead" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
                        '<path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="currentColor" />' +
                    '</marker>' +
                '</defs>' +
                '<g id="' + id + '-paths"></g>' +
                '<g id="' + id + '-current-shape"></g>' +
            '</svg>' +

            // Empty state helper text
            '<div id="' + id + '-helper" class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-600 transition-opacity duration-300">' +
                '<span class="text-2xl mb-1">✍️ 📐 ⭕ 🔲</span>' +
                '<span class="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">Draw Freehand, Circle, Square, Line, Arrow & Shapes</span>' +
                '<span class="text-[10px] font-mono text-slate-600">Sub-Pixel Geometric Bézier Math &bull; 100% Scalable Vector</span>' +
            '</div>' +
        '</div>' +
    '</div>';
}

module.exports = {
    renderTitanWhiteboard,
    TitanWhiteboard: renderTitanWhiteboard
};
