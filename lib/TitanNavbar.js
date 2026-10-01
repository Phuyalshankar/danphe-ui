'use strict';

const { renderAdaptiveIconSVG } = require('./TitanAdaptiveIcon');

/**
 * 🧭 TitanNavbar
 * Complete App Top Header with Brand, Search, Status & Profile
 */
function renderTitanNavbar({
    brandName = 'DANPHE-UI',
    brandLogo = '🐬',
    systemStatus = 'ONLINE',
    port = 3000,
    notificationCount = 3,
    userExt = '#101 (Admin)',
    routes = ['Dashboard', 'Hospital ICU', 'PBX Trunks', 'Ledger', 'Hardware'],
    activeRoute = 'Hospital ICU',
    className = ''
} = {}) {
    return `
    <header class="titan-master-navbar w-full p-4 bg-slate-900/95 backdrop-blur-2xl rounded-3xl border-2 border-cyan-500/30 shadow-[0_0_35px_rgba(34,211,238,0.15)] flex flex-col md:flex-row items-center justify-between gap-4 mb-6 ${className}">
        
        <!-- Left: Brand Logo & Status -->
        <div class="flex items-center gap-3.5">
            <span class="text-3xl filter drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">${brandLogo}</span>
            <div>
                <div class="flex items-center gap-2">
                    <h1 class="text-lg font-black tracking-tight text-white font-mono">${brandName}</h1>
                    <span class="text-[10px] font-mono bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-700 font-bold">ENTERPRISE</span>
                </div>
                <div class="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span class="text-emerald-400 font-bold">${systemStatus}</span>
                    <span>&bull;</span>
                    <span>PORT ${port}</span>
                </div>
            </div>
        </div>

        <!-- Center: Route Links -->
        <nav class="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            ${routes.map(rt => {
                const isAct = rt === activeRoute;
                return `
                <button type="button" 
                        onclick="this.parentElement.querySelectorAll('button').forEach(b=>b.className='px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold text-slate-400 hover:text-white transition'); this.className='px-3.5 py-1.5 bg-cyan-600 text-slate-950 font-mono text-xs font-black rounded-xl shadow-md transition';"
                        class="px-3.5 py-1.5 rounded-xl font-mono text-xs ${isAct ? 'bg-cyan-600 text-slate-950 font-black shadow-md' : 'font-bold text-slate-400 hover:text-white'} transition">
                    ${rt}
                </button>`;
            }).join('')}
        </nav>

        <!-- Right: Actions, Notification & User Ext -->
        <div class="flex items-center gap-3">
            <button onclick="triggerToastDemo()" class="relative p-2 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 hover:text-white transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                ${notificationCount ? `<span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">${notificationCount}</span>` : ''}
            </button>

            <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-950 rounded-2xl border border-slate-800">
                <div class="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-600 flex items-center justify-center text-cyan-400 text-xs font-bold">
                    👨‍⚕️
                </div>
                <span class="text-xs font-mono text-slate-200 font-bold">${userExt}</span>
            </div>
        </div>

    </header>`;
}

module.exports = {
    renderTitanNavbar,
    TitanNavbar: renderTitanNavbar
};
