'use strict';
const { renderAdaptiveIconSVG } = require('./TitanAdaptiveIcon');

function renderTitanTrackHeader(options = {}) {
    const {
        id = 'titan-track-rack',
        tracks = [
            { id: 'T1', type: 'text', name: 'T1 Titles', color: 'amber' },
            { id: 'V2', type: 'video', name: 'V2 Overlay', color: 'cyan' },
            { id: 'V1', type: 'video', name: 'V1 Master', color: 'cyan' },
            { id: 'A1', type: 'audio', name: 'A1 Voiceover', color: 'emerald' },
            { id: 'A2', type: 'audio', name: 'A2 BGM Music', color: 'emerald' }
        ]
    } = options;

    const tracksHtml = tracks.map(tr => {
        if (tr.type === 'video' || tr.type === 'text') {
            const badgeColor = tr.color === 'amber' ? 'text-amber-400 bg-amber-950/80 border-amber-700' : 'text-cyan-400 bg-cyan-950/80 border-cyan-700';
            return `
            <div id="track-head-${tr.id}" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all font-mono text-xs">
                <div class="flex items-center gap-2.5">
                    <span class="w-7 h-7 flex items-center justify-center rounded-lg border font-black text-xs ${badgeColor}">
                        ${tr.id}
                    </span>
                    <span class="font-bold text-slate-200 text-[11px]">${tr.name}</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <button onclick="titanTrackToggleEye('${tr.id}')" id="btn-eye-${tr.id}" title="Toggle Visibility" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-all active:scale-95">
                        ${renderAdaptiveIconSVG(534, 0, 16, false, 0)}
                    </button>
                    <button onclick="titanTrackToggleLock('${tr.id}')" id="btn-lock-${tr.id}" title="Lock Track" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all active:scale-95">
                        ${renderAdaptiveIconSVG(537, 0, 16, false, 0)}
                    </button>
                </div>
            </div>
            `;
        } else {
            return `
            <div id="track-head-${tr.id}" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all font-mono text-xs">
                <div class="flex items-center gap-2.5">
                    <span class="w-7 h-7 flex items-center justify-center rounded-lg border font-black text-xs text-emerald-400 bg-emerald-950/80 border-emerald-700">
                        ${tr.id}
                    </span>
                    <span class="font-bold text-slate-200 text-[11px]">${tr.name}</span>
                </div>
                <div class="flex items-center gap-1">
                    <button onclick="titanTrackToggleMute('${tr.id}')" id="btn-mute-${tr.id}" title="Mute Track (M)" class="w-6 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-[10px] transition-all active:scale-95">
                        M
                    </button>
                    <button onclick="titanTrackToggleSolo('${tr.id}')" id="btn-solo-${tr.id}" title="Solo Track (S)" class="w-6 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-[10px] transition-all active:scale-95">
                        S
                    </button>
                    <button onclick="titanTrackToggleRec('${tr.id}')" id="btn-rec-${tr.id}" title="Record Arm (REC)" class="w-6 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-rose-500 font-bold text-[10px] transition-all active:scale-95">
                        ●
                    </button>
                    <button onclick="titanTrackToggleLock('${tr.id}')" id="btn-lock-${tr.id}" title="Lock Track" class="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all active:scale-95">
                        ${renderAdaptiveIconSVG(537, 0, 14, false, 0)}
                    </button>
                </div>
            </div>
            `;
        }
    }).join('');

    return `
    <div id="${id}" class="titan-track-rack flex flex-col gap-2 p-3 bg-slate-950/90 rounded-2xl border border-slate-800 shadow-xl">
        <div class="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span class="text-xs font-black tracking-wider text-slate-400 uppercase font-mono">Timeline Tracks</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">5 LANES</span>
        </div>
        <div class="flex flex-col gap-1.5">
            ${tracksHtml}
        </div>
    </div>
    `;
}

module.exports = { renderTitanTrackHeader };
