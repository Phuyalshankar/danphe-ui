'use strict';

function renderTitanDrawer(options) {
    const opts = options || {};
    const id = opts.id || 'titan-drawer';
    const title = opts.title || 'Drawer Panel';
    const subtitle = opts.subtitle || 'Slide-out inspection';
    const position = opts.position || 'right';
    const content = opts.content || '<p class="text-slate-400">Drawer content goes here...</p>';
    const className = opts.className || '';

    const initialTransform = position === 'left' ? 'translateX(-100%)' : 'translateX(100%)';
    const borderSide = position === 'left' ? 'border-r' : 'border-l';
    const alignSide = position === 'left' ? 'left: 0;' : 'right: 0;';

    return '<div id="' + id + '-backdrop" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex" ' +
        'style="opacity: 0; pointer-events: none; transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);" ' +
        'onclick="if(event.target===this)closeTitanDrawer(\'' + id + '\');">' +
        '<div id="' + id + '" class="fixed top-0 bottom-0 w-full max-w-md bg-slate-900 ' + borderSide + ' border-cyan-500/50 p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(34,211,238,0.25)] ' + className + '" ' +
        'style="' + alignSide + ' transform: ' + initialTransform + '; transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);">' +
            '<div class="flex flex-col gap-4">' +
                '<div class="flex items-center justify-between pb-3.5 border-b border-slate-800">' +
                    '<div class="flex items-center gap-3">' +
                        '<div class="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">' +
                            '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>' +
                        '</div>' +
                        '<div>' +
                            '<h3 class="text-sm font-black text-white font-mono uppercase tracking-wider">' + title + '</h3>' +
                            '<p class="text-[11px] text-slate-400 font-mono">' + subtitle + '</p>' +
                        '</div>' +
                    '</div>' +
                    '<button type="button" onclick="closeTitanDrawer(\'' + id + '\');" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 flex items-center justify-center font-mono font-bold transition">✕</button>' +
                '</div>' +
                '<div class="drawer-body text-xs font-mono text-slate-300 flex flex-col gap-3.5 pt-2">' +
                    content +
                '</div>' +
            '</div>' +
            '<div class="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">' +
                '<button type="button" onclick="closeTitanDrawer(\'' + id + '\');" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono rounded-xl font-bold transition shadow-md">Close Drawer</button>' +
                '<button type="button" onclick="alert(\'Medical Action Dispatched!\'); closeTitanDrawer(\'' + id + '\');" class="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-mono rounded-xl font-black transition shadow-[0_0_15px_rgba(34,211,238,0.4)]">Action</button>' +
            '</div>' +
        '</div>' +
    '</div>';
}

module.exports = { renderTitanDrawer, TitanDrawer: renderTitanDrawer };
