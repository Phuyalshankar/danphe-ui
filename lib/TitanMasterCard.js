'use strict';

/**
 * 📦 TitanMasterCard (danphe-ui)
 * The Grand Unified Master Container Engine (Opcode 128 to 191)
 * ═════════════════════════════════════════════════════════════════════════════
 * • 1 Single Universal Container Engine handles:
 *   1. STAT & KPI WIDGETS (`variant="stat"`)
 *   2. FORM & AUTH DIALOGS (`variant="form"`)
 *   3. POPUP BACKDROP MODALS (`modal={true}` or `variant="modal"`)
 *   4. FLOATING TOAST NOTIFICATIONS (`toast={true}` or `variant="toast"`)
 *   5. TABBED CONTAINERS (`tabs={['Overview', 'Trunks', 'Logs']}`)
 *   6. DATA GRID / CALL LOG TABLES (`variant="table"`)
 *   7. EMERGENCY ALERT BANNERS (`variant="alert"`)
 *   8. LIST & CONTACT ITEMS (`variant="item"`)
 */

const { TITAN_ICON, ICONS_256, renderAdaptiveIconSVG } = require('./TitanAdaptiveIcon');
const { renderMasterButton } = require('./TitanMasterButton');
const { renderMasterInput } = require('./TitanMasterInput');

// 🏷️ CARD ATOMIC HARDWARE FLAGS (0 to 65535 / 16-Bit Register)
const CARD_FLAGS = {
    MODE_FORM_DIALOG:   1 << 0,  // 0x0001 (1) Form Container
    MODE_STAT_METRIC:   1 << 1,  // 0x0002 (2) Stat / KPI Widget
    MODE_LIST_ITEM:     1 << 2,  // 0x0003 (4) List Item
    MODE_ALERT_BANNER:  1 << 3,  // 0x0004 (8) Hazard Alert
    MODE_MODAL_OVERLAY: 1 << 4,  // 0x0010 (16) Full Backdrop Modal
    MODE_TOAST_FLOAT:   1 << 5,  // 0x0020 (32) Floating Toast Notification
    MODE_TABBED_VIEW:   1 << 6,  // 0x0040 (64) Tabbed Container
    MODE_TABLE_GRID:    1 << 7,  // 0x0080 (128) Data Table Grid

    STYLE_GLASS:        1 << 8,  // 0x0100 (256) Frosted Glassmorphism
    STYLE_ELEVATED_3D:  1 << 9,  // 0x0200 (512) 3D Metallic Shadow
    STYLE_NEON_GLOW:    1 << 10, // 0x0400 (1024) Neon Glow Frame
    SLOT_DISMISS_BTN:   1 << 11  // 0x0800 (2048) Dismiss 'X' Button
};

/**
 * 🌟 Master Universal Card Synthesizer
 */
function renderMasterCard({
    flags = 0,
    reg = null,
    address = null,
    formReg = null,
    variant = 'glass',       // 'glass' | 'form' | 'stat' | 'item' | 'alert' | 'modal' | 'toast' | 'tabs' | 'table'
    modal = false,           // Bit flag: Modal Backdrop Popup
    toast = false,           // Bit flag: Floating Toast Alert
    isOpen = true,           // Modal/Toast visibility state
    position = 'top-right',  // 'top-right' | 'top-center' | 'bottom-right'
    tabs = [],               // Array of tab titles e.g. ['Overview', 'Trunks', 'Logs']
    activeTab = 0,           // Active tab index
    columns = [],            // Table column headers
    data = [],               // Table data rows
    icon = 192,
    title = '',
    subtitle = '',
    value = '',
    trend = '',
    trendUp = true,
    badge = 'ONLINE',
    fields = [],
    buttons = [],
    children = '',
    bus = '',
    action = 'SUBMIT',
    disabled = false,
    className = ''
} = {}) {
    const activeReg = address !== null && address !== undefined ? address : (formReg !== null && formReg !== undefined ? formReg : reg);
    let f = Number(flags) || 0;

    if (modal || variant === 'modal') f |= CARD_FLAGS.MODE_MODAL_OVERLAY;
    if (toast || variant === 'toast') f |= CARD_FLAGS.MODE_TOAST_FLOAT;
    if ((tabs && tabs.length > 0) || variant === 'tabs') f |= CARD_FLAGS.MODE_TABBED_VIEW;
    if ((columns && columns.length > 0) || variant === 'table') f |= CARD_FLAGS.MODE_TABLE_GRID;

    if (variant === 'form') f |= CARD_FLAGS.MODE_FORM_DIALOG;
    if (variant === 'stat') f |= CARD_FLAGS.MODE_STAT_METRIC;
    if (variant === 'item') f |= CARD_FLAGS.MODE_LIST_ITEM;
    if (variant === 'alert') f |= CARD_FLAGS.MODE_ALERT_BANNER;
    if (variant === 'glass') f |= CARD_FLAGS.STYLE_GLASS;

    const isModal  = Boolean(f & CARD_FLAGS.MODE_MODAL_OVERLAY);
    const isToast  = Boolean(f & CARD_FLAGS.MODE_TOAST_FLOAT);
    const isTabs   = Boolean(f & CARD_FLAGS.MODE_TABBED_VIEW);
    const isTable  = Boolean(f & CARD_FLAGS.MODE_TABLE_GRID);
    const isForm   = Boolean(f & CARD_FLAGS.MODE_FORM_DIALOG);
    const isStat   = Boolean(f & CARD_FLAGS.MODE_STAT_METRIC);
    const isItem   = Boolean(f & CARD_FLAGS.MODE_LIST_ITEM);
    const isAlert  = Boolean(f & CARD_FLAGS.MODE_ALERT_BANNER);

    const iconId = Number(icon) & 0xFF;
    const iconMeta = ICONS_256[iconId] || ICONS_256[0];
    const displayTitle = title || iconMeta.label;
    const headerIconSvg = renderAdaptiveIconSVG(iconId, 0, 20, false);

    const cardBus = bus || (activeReg !== null ? `bus:write:${activeReg}` : 'bus:card:submit');
    const regAttr = activeReg !== null ? `data-card-reg="${activeReg}"` : '';

    // ── 1. FLOATING TOAST NOTIFICATION MODE (BIT: MODE_TOAST_FLOAT) ──
    if (isToast) {
        if (!isOpen) return '';
        const toastPosClasses = position === 'top-center' ? 'top-6 left-1/2 -translate-x-1/2' : (position === 'bottom-right' ? 'bottom-6 right-6' : 'top-6 right-6');
        return `
        <div class="titan-master-toast fixed z-50 ${toastPosClasses} max-w-sm w-full p-4 bg-slate-900/95 backdrop-blur-2xl rounded-2xl border-2 border-cyan-500/60 shadow-[0_0_30px_rgba(34,211,238,0.35)] flex items-center justify-between gap-3 animate-bounce ${className}">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-inner">
                    ${headerIconSvg}
                </div>
                <div class="flex flex-col">
                    <span class="text-xs font-mono font-black uppercase text-white tracking-wider">${displayTitle}</span>
                    <span class="text-[11px] font-mono text-slate-300">${subtitle || 'System Alert Dispatched'}</span>
                </div>
            </div>
            <button type="button" onclick="this.closest('.titan-master-toast').remove();" class="text-slate-500 hover:text-white p-1 rounded-lg">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>`;
    }

    // ── 2. DATA GRID / CALL LOG TABLE MODE (BIT: MODE_TABLE_GRID) ──
    if (isTable) {
        const defaultCols = columns && columns.length > 0 ? columns : ['Extension', 'Caller Name', 'Duration', 'Status'];
        const defaultRows = data && data.length > 0 ? data : [
            ['#101', 'Shankar Phuyal', '04:12', 'CONNECTED'],
            ['#102', 'Danphe Carrier', '01:45', 'COMPLETED'],
            ['#103', 'Admin Gateway', '00:30', 'FAILED']
        ];
        return `
        <div class="titan-master-table-card p-6 bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl flex flex-col gap-4 w-full ${className}">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
                        ${headerIconSvg}
                    </div>
                    <div>
                        <h3 class="text-sm font-black uppercase tracking-wider text-white font-mono">${displayTitle}</h3>
                        <p class="text-[11px] text-slate-400">${subtitle || 'Live Telephony CDR Table'}</p>
                    </div>
                </div>
                <span class="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-700 font-bold">${badge || '3 RECORDS'}</span>
            </div>
            <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-left font-mono text-xs">
                    <thead>
                        <tr class="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                            ${defaultCols.map(c => `<th class="pb-2.5 px-3">${c}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/60">
                        ${defaultRows.map(r => `
                        <tr class="hover:bg-slate-800/40 transition-colors">
                            ${r.map((cell, idx) => `<td class="py-3 px-3 ${idx === 0 ? 'text-cyan-400 font-bold' : (idx === r.length - 1 && cell === 'CONNECTED' ? 'text-emerald-400' : 'text-slate-200')}">${cell}</td>`).join('')}
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    }

    // ── 3. PBX / DASHBOARD STAT & KPI WIDGET ──
    if (isStat) {
        const trendCol = trendUp ? 'text-emerald-400' : 'text-rose-400';
        return `
        <div class="titan-master-stat-card p-6 bg-gradient-to-b from-slate-900/90 to-slate-950/95 rounded-3xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 shadow-2xl flex flex-col gap-4 relative overflow-hidden group ${className}">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 group-hover:border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-all shadow-inner">
                        ${headerIconSvg}
                    </div>
                    <div class="flex flex-col">
                        <span class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">${displayTitle}</span>
                        <span class="text-[10px] font-mono text-slate-500">${subtitle || 'Live PBX Node'}</span>
                    </div>
                </div>
                <div class="px-3 py-1 bg-cyan-950/80 border border-cyan-700 text-cyan-300 text-[10px] font-mono font-bold rounded-full flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                    <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                    <span>${badge || 'LIVE'}</span>
                </div>
            </div>
            
            <div class="flex items-baseline justify-between pt-1 border-t border-slate-900">
                <span class="text-3xl font-black text-white font-mono tracking-tight">${value || '100%'}</span>
                ${trend ? `<span class="text-xs font-mono font-bold ${trendCol}">${trend}</span>` : ''}
            </div>
        </div>`;
    }

    // ── 4. INTERACTIVE CALL HISTORY / CONTACT / ITEM CARD ──
    if (isItem) {
        return `
        <div onclick="if (window.TitanBus) window.TitanBus.send('${cardBus}', '${action}');" 
             class="titan-master-item-card p-4 bg-slate-900/80 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyan-500/60 flex items-center justify-between cursor-pointer transition-all duration-200 group active:scale-[0.99] ${className}">
            <div class="flex items-center gap-3.5">
                <div class="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    ${headerIconSvg}
                </div>
                <div class="flex flex-col">
                    <span class="text-sm font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">${displayTitle}</span>
                    <span class="text-xs font-mono text-slate-400">${subtitle || 'Extension #101 &bull; 02:45 PM'}</span>
                </div>
            </div>
            <div class="flex items-center gap-3">
                ${badge ? `<span class="px-2.5 py-0.5 bg-slate-950 text-slate-300 text-[10px] font-mono rounded-full border border-slate-800">${badge}</span>` : ''}
                <div class="text-slate-600 group-hover:text-cyan-400 transition-colors">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
            </div>
        </div>`;
    }

    // ── 5. EMERGENCY HAZARD / ALERT BANNER CARD ──
    if (isAlert) {
        return `
        <div class="titan-master-alert-card p-5 bg-gradient-to-r from-rose-950/90 to-slate-950/95 rounded-3xl border-2 border-rose-500/80 shadow-[0_0_25px_rgba(239,68,68,0.35)] flex items-start gap-4 ${className}">
            <div class="w-10 h-10 rounded-2xl bg-rose-950 border border-rose-600 flex items-center justify-center text-rose-400 shrink-0 shadow-[0_0_15px_#ef4444]">
                ${headerIconSvg}
            </div>
            <div class="flex-1 flex flex-col gap-1">
                <div class="flex items-center justify-between">
                    <h3 class="text-sm font-black uppercase tracking-wider text-rose-300 font-mono">${displayTitle}</h3>
                    <span class="text-[10px] font-mono bg-rose-950 text-rose-400 px-2.5 py-0.5 rounded-full border border-rose-700 font-bold">${badge || 'CRITICAL'}</span>
                </div>
                <p class="text-xs text-slate-300">${subtitle || 'Immediate action required on this PBX node.'}</p>
                ${children ? `<div class="pt-2">${children}</div>` : ''}
            </div>
        </div>`;
    }

    // ── 6. TABBED CONTAINER HEADER (BIT: MODE_TABBED_VIEW) ──
    let tabsHeaderHtml = '';
    if (isTabs && tabs && tabs.length > 0) {
        tabsHeaderHtml = `
        <div class="titan-tabs-bar flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-2">
            ${tabs.map((tb, idx) => `
            <button type="button" 
                    onclick="this.parentElement.querySelectorAll('button').forEach((b,i)=>b.className=i===${idx}?'flex-1 py-1.5 px-3 bg-cyan-600 text-slate-950 font-bold rounded-xl font-mono text-xs shadow-sm':'flex-1 py-1.5 px-3 bg-transparent text-slate-400 hover:text-white rounded-xl font-mono text-xs');"
                    class="${idx === Number(activeTab) ? 'flex-1 py-1.5 px-3 bg-cyan-600 text-slate-950 font-bold rounded-xl font-mono text-xs shadow-sm' : 'flex-1 py-1.5 px-3 bg-transparent text-slate-400 hover:text-white rounded-xl font-mono text-xs'}">
                ${tb}
            </button>`).join('')}
        </div>`;
    }

    // ── 7. STANDARD FORM / GLASS / ELEVATED / POPUP MODAL ──
    let fieldsHtml = '';
    if (fields && fields.length) {
        fieldsHtml = fields.map(fld => renderMasterInput(fld)).join('');
    }

    let buttonsHtml = '';
    if (buttons && buttons.length) {
        buttonsHtml = `
        <div class="flex items-center gap-3 pt-3 border-t border-slate-800/80 w-full justify-end">
            ${buttons.map(btn => renderMasterButton(btn)).join('')}
        </div>`;
    }

    const cardInnerHtml = `
    <div ${regAttr} class="titan-master-card p-6 rounded-3xl border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)] bg-slate-900/90 backdrop-blur-2xl flex flex-col gap-4 w-full ${className}">
        <div class="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-inner">
                    ${headerIconSvg}
                </div>
                <div>
                    <h3 class="text-sm font-black uppercase tracking-wider text-white font-mono">${displayTitle}</h3>
                    <p class="text-[11px] text-slate-400">${subtitle || 'Universal Container Engine'}</p>
                </div>
            </div>
            ${isModal ? `<button type="button" onclick="this.closest('.titan-modal-overlay').remove();" class="text-slate-500 hover:text-white p-1"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>` : (badge ? `<span class="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-700 font-bold">${badge}</span>` : '')}
        </div>

        ${tabsHeaderHtml}

        <div class="card-body flex flex-col gap-3 py-1">
            ${fieldsHtml}
            ${children}
        </div>

        ${buttonsHtml}
    </div>`;

    // ── MODAL BACKDROP OVERLAY WRAPPER ──
    if (isModal) {
        if (!isOpen) return '';
        return `
        <div class="titan-modal-overlay fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div class="max-w-lg w-full">
                ${cardInnerHtml}
            </div>
        </div>`;
    }

    return cardInnerHtml;
}

module.exports = {
    CARD_FLAGS,
    renderMasterCard,
    TitanMasterCard: renderMasterCard,
    TitanCard: renderMasterCard
};
