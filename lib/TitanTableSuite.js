'use strict';

const { renderAdaptiveIconSVG } = require('./TitanAdaptiveIcon');
const { renderMasterButton } = require('./TitanMasterButton');

/**
 * 📊 TitanTable Engine
 * Variants: 'medical' | 'telephony' | 'striped' | 'compact' | 'interactive'
 */
function renderTitanTable({
    variant = 'medical',
    title = '',
    subtitle = '',
    icon = 225,
    badge = '',
    searchable = true,
    pagination = true,
    page = 1,
    totalPages = 5,
    totalRecords = 128,
    columns = [],
    rows = [],
    className = ''
} = {}) {
    const iconSvg = renderAdaptiveIconSVG(icon, 0, 20, false);

    // ── SAMPLE PRESETS IF NOT PROVIDED ──
    let cols = columns;
    let dataRows = rows;
    let displayTitle = title;
    let displaySub = subtitle;
    let displayBadge = badge;

    if (variant === 'medical' || variant === 'hospital') {
        displayTitle = displayTitle || 'Hospital Patient & Vitals Roster';
        displaySub = displaySub || 'ICU / Emergency Ward Live Telemetry';
        displayBadge = displayBadge || 'WARD-4 ACTIVE';
        if (!cols.length) {
            cols = ['Bed #', 'Patient Name', 'Vitals (HR / SpO2)', 'Attending Doctor', 'Ward / Dept', 'Status', 'Actions'];
        }
        if (!dataRows.length) {
            dataRows = [
                {
                    bed: 'ICU-01',
                    name: 'Ram Bahadur Shrestha (54M)',
                    vitals: '💓 78 bpm &bull; 98% SpO2',
                    vitalsSafe: true,
                    doctor: 'Dr. S. Karki (Cardio)',
                    dept: 'Cardiology',
                    status: 'STABLE',
                    statusType: 'success'
                },
                {
                    bed: 'ICU-02',
                    name: 'Sita Devi Sharma (62F)',
                    vitals: '💓 118 bpm &bull; 89% SpO2',
                    vitalsSafe: false,
                    doctor: 'Dr. P. Gautam (Pulmo)',
                    dept: 'Pulmonology',
                    status: 'CRITICAL',
                    statusType: 'danger'
                },
                {
                    bed: 'EMG-04',
                    name: 'Bikram Thapa (29M)',
                    vitals: '💓 84 bpm &bull; 99% SpO2',
                    vitalsSafe: true,
                    doctor: 'Dr. A. Shakya (Trauma)',
                    dept: 'Emergency',
                    status: 'ADMITTED',
                    statusType: 'info'
                },
                {
                    bed: 'GEN-12',
                    name: 'Maya Gurung (41F)',
                    vitals: '💓 72 bpm &bull; 97% SpO2',
                    vitalsSafe: true,
                    doctor: 'Dr. R. Pandey (General)',
                    dept: 'Post-Op',
                    status: 'RECOVERING',
                    statusType: 'warning'
                }
            ];
        }
    } else if (variant === 'telephony' || variant === 'cdr') {
        displayTitle = displayTitle || 'PBX Call Detail Records (CDR)';
        displaySub = displaySub || 'Live SIP Trunking & Billing Ledger';
        displayBadge = displayBadge || 'LIVE CARRIER';
        if (!cols.length) {
            cols = ['Call ID', 'Direction', 'Source Ext', 'Destination', 'Duration', 'Codec / Jitter', 'Status', 'Recording'];
        }
        if (!dataRows.length) {
            dataRows = [
                {
                    id: '#CDR-9801',
                    dir: 'INBOUND',
                    dirIn: true,
                    src: '9841234567',
                    dst: 'Ext 101 (Billing)',
                    dur: '04:22',
                    codec: 'Opus 48kHz (0.2ms)',
                    status: 'COMPLETED',
                    statusType: 'success'
                },
                {
                    id: '#CDR-9802',
                    dir: 'OUTBOUND',
                    dirIn: false,
                    src: 'Ext 104 (Support)',
                    dst: '9801239999',
                    dur: '01:45',
                    codec: 'G.711u (1.4ms)',
                    status: 'ANSWERED',
                    statusType: 'success'
                },
                {
                    id: '#CDR-9803',
                    dir: 'INBOUND',
                    dirIn: true,
                    src: '9811440022',
                    dst: 'Ext 102 (IVR Queue)',
                    dur: '00:15',
                    codec: 'G.729 (8.0ms)',
                    status: 'MISSED',
                    statusType: 'danger'
                }
            ];
        }
    }

    // ── RENDER ROWS ──
    let tbodyRowsHtml = '';
    if (variant === 'medical' || variant === 'hospital') {
        tbodyRowsHtml = dataRows.map((r, idx) => {
            const badgeClass = r.statusType === 'danger' 
                ? 'bg-rose-950/80 text-rose-300 border-rose-600 shadow-[0_0_10px_rgba(239,68,68,0.3)]' 
                : (r.statusType === 'warning' 
                    ? 'bg-amber-950/80 text-amber-300 border-amber-600' 
                    : (r.statusType === 'info' 
                        ? 'bg-cyan-950/80 text-cyan-300 border-cyan-600' 
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-600'));

            return `
            <tr class="hover:bg-slate-800/50 transition-colors border-b border-slate-800/60 font-mono text-xs">
                <td class="py-3.5 px-4 font-bold text-cyan-400">${r.bed}</td>
                <td class="py-3.5 px-4 font-sans font-bold text-white flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full ${r.vitalsSafe ? 'bg-emerald-400' : 'bg-rose-500 animate-ping'}"></span>
                    ${r.name}
                </td>
                <td class="py-3.5 px-4 ${r.vitalsSafe ? 'text-slate-300' : 'text-rose-400 font-black animate-pulse'}">${r.vitals}</td>
                <td class="py-3.5 px-4 text-slate-300">${r.doctor}</td>
                <td class="py-3.5 px-4 text-slate-400">${r.dept}</td>
                <td class="py-3.5 px-4">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}">${r.status}</span>
                </td>
                <td class="py-3.5 px-4">
                    <div class="flex items-center gap-1.5">
                        <button class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-[10px] font-bold border border-slate-700">Vitals 📈</button>
                        <button class="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded-lg text-[10px] font-bold border border-cyan-700">Chart 📋</button>
                    </div>
                </td>
            </tr>`;
        }).join('');
    } else if (variant === 'telephony' || variant === 'cdr') {
        tbodyRowsHtml = dataRows.map((r, idx) => {
            const statusClass = r.statusType === 'danger' ? 'text-rose-400' : 'text-emerald-400';
            const dirIcon = r.dirIn ? '📲 IN' : '📞 OUT';
            const dirClass = r.dirIn ? 'bg-cyan-950/80 text-cyan-400 border-cyan-800' : 'bg-purple-950/80 text-purple-400 border-purple-800';

            return `
            <tr class="hover:bg-slate-800/50 transition-colors border-b border-slate-800/60 font-mono text-xs">
                <td class="py-3.5 px-4 font-bold text-cyan-400">${r.id}</td>
                <td class="py-3.5 px-4">
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold border ${dirClass}">${dirIcon}</span>
                </td>
                <td class="py-3.5 px-4 font-bold text-white">${r.src}</td>
                <td class="py-3.5 px-4 text-slate-300">${r.dst}</td>
                <td class="py-3.5 px-4 text-slate-200 font-bold">${r.dur}</td>
                <td class="py-3.5 px-4 text-slate-400 text-[11px]">${r.codec}</td>
                <td class="py-3.5 px-4 font-bold ${statusClass}">${r.status}</td>
                <td class="py-3.5 px-4">
                    <button onclick="if(window.TitanBus) window.TitanBus.send('bus:call:play', '${r.id}');" class="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-[10px] flex items-center gap-1 shadow-md">
                        <span>▶</span> Play
                    </button>
                </td>
            </tr>`;
        }).join('');
    } else {
        tbodyRowsHtml = dataRows.map((r, idx) => `
            <tr class="hover:bg-slate-800/50 transition-colors border-b border-slate-800/60 font-mono text-xs ${idx % 2 === 1 ? 'bg-slate-950/40' : ''}">
                ${Array.isArray(r) ? r.map((c, i) => `<td class="py-3 px-4 ${i === 0 ? 'text-cyan-400 font-bold' : 'text-slate-300'}">${c}</td>`).join('') : ''}
            </tr>`).join('');
    }

    return `
    <div class="titan-master-table-wrapper p-6 bg-gradient-to-b from-slate-900/95 to-slate-950/95 rounded-3xl border border-slate-800 shadow-2xl flex flex-col gap-4 w-full backdrop-blur-2xl ${className}">
        
        <!-- Table Header Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-800">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-inner">
                    ${iconSvg}
                </div>
                <div>
                    <h3 class="text-sm font-black uppercase tracking-wider text-white font-mono flex items-center gap-2">
                        ${displayTitle}
                    </h3>
                    <p class="text-[11px] text-slate-400 font-mono">${displaySub}</p>
                </div>
            </div>

            <div class="flex items-center gap-2.5">
                ${searchable ? `
                <div class="relative">
                    <input type="text" placeholder="Search records..." class="py-1.5 pl-8 pr-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 w-48">
                    <svg class="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>` : ''}
                ${displayBadge ? `<span class="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-3 py-1 rounded-full border border-cyan-700 font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)]">${displayBadge}</span>` : ''}
            </div>
        </div>

        <!-- Table Scroll Container -->
        <div class="overflow-x-auto custom-scrollbar rounded-2xl border border-slate-800/80 bg-slate-950/50">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[10px] font-mono tracking-wider">
                        ${cols.map(c => `<th class="py-3 px-4 font-bold">${c}</th>`).join('')}
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/40">
                    ${tbodyRowsHtml}
                </tbody>
            </table>
        </div>

        <!-- Table Footer / Pagination -->
        ${pagination ? `
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs font-mono text-slate-400">
            <span>Showing <b>1</b> to <b>${dataRows.length}</b> of <b>${totalRecords}</b> entries</span>
            <div class="flex items-center gap-1.5">
                <button class="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 font-bold transition">◀ Prev</button>
                <span class="px-3 py-1 bg-cyan-950 text-cyan-300 rounded-lg border border-cyan-800 font-bold">1</span>
                <span class="px-3 py-1 text-slate-500">2</span>
                <span class="px-3 py-1 text-slate-500">3</span>
                <button class="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 font-bold transition">Next ▶</button>
            </div>
        </div>` : ''}

    </div>`;
}

module.exports = {
    renderTitanTable,
    TitanTable: renderTitanTable
};
