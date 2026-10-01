'use strict';

/**
 * 📞 TitanTelephonyMatrix (danphe-ui)
 * Ultra-Clean Rounded World-Class Icon Dock (Text-Free Minimal Design)
 */

const { parseBitmask } = require('./TitanIconMatrix');

const TELEPHONY_ICONS_SVG = {
    // 1. Incoming Voice Call (Emerald pulsing receiver with incoming arrow)
    incoming_call: (active) => `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${active ? '#34d399' : '#64748b'}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="${active ? 'animate-bounce' : ''}">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            <polyline points="16 2 20 6 16 10" stroke="${active ? '#6ee7b7' : '#64748b'}" stroke-width="2.5"/>
            <line x1="20" y1="6" x2="11" y2="15" stroke="${active ? '#6ee7b7' : '#64748b'}" stroke-width="2.5"/>
        </svg>`,

    // 2. Incoming Video Call (Purple pulsing camera with incoming arrow)
    incoming_video: (active) => `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${active ? '#c084fc' : '#64748b'}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="${active ? 'animate-pulse' : ''}">
            <polygon points="23 7 16 12 23 17 23 7" fill="${active ? 'rgba(192,132,252,0.3)' : 'none'}"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            <polyline points="10 9 10 13 6 13" stroke="${active ? '#38bdf8' : '#64748b'}" stroke-width="2.5"/>
            <line x1="10" y1="13" x2="5" y2="8" stroke="${active ? '#38bdf8' : '#64748b'}" stroke-width="2.5"/>
        </svg>`,

    // 3. Outgoing Call (Amber receiver with outgoing radar arrow)
    outgoing_call: (active) => `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${active ? '#fbbf24' : '#64748b'}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            <polyline points="20 10 20 4 14 4" stroke="${active ? '#fde047' : '#64748b'}" stroke-width="2.5"/>
            <line x1="13" y1="11" x2="20" y2="4" stroke="${active ? '#fde047' : '#64748b'}" stroke-width="2.5"/>
        </svg>`,

    // 4. Missed Call (Rose/Red receiver with X and live badge count)
    missed_call: (active, count = 0) => `
        <div class="relative flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${active ? '#f87171' : '#64748b'}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                <line x1="22" y1="2" x2="16" y2="8" stroke="${active ? '#ef4444' : '#64748b'}" stroke-width="2.8"/>
                <line x1="16" y1="2" x2="22" y2="8" stroke="${active ? '#ef4444' : '#64748b'}" stroke-width="2.8"/>
            </svg>
            ${active && count > 0 ? `<span class="absolute -top-2.5 -right-3 px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full border border-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.9)] animate-pulse leading-none min-w-[18px] text-center">${count}</span>` : ''}
        </div>`,

    // 5. Active Connected Call (Emerald connected audio wave)
    active_call: (active) => `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${active ? '#10b981' : '#64748b'}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            <path d="M14 2a8 8 0 0 1 8 8" stroke="${active ? '#34d399' : '#64748b'}"/>
            <path d="M14 6a4 4 0 0 1 4 4" stroke="${active ? '#6ee7b7' : '#64748b'}"/>
        </svg>`,

    // 6. Microphone Mute (Red muted mic)
    mute: (active) => `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${active ? '#f43f5e' : '#64748b'}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="1" y1="1" x2="23" y2="23" stroke="${active ? '#f43f5e' : '#64748b'}" stroke-width="2.5"/>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>`,

    // 7. Video Cam On
    video_stream: (active) => `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${active ? '#06b6d4' : '#64748b'}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="23 7 16 12 23 17 23 7" fill="${active ? 'rgba(6,182,212,0.3)' : 'none'}"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>`,

    // 8. New Unread Chat
    unread_chat: (active) => `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${active ? '#22d3ee' : '#64748b'}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="${active ? 'animate-pulse' : ''}">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="${active ? 'rgba(34,211,238,0.25)' : 'none'}"/>
            <circle cx="8" cy="10" r="1.2" fill="${active ? '#22d3ee' : '#64748b'}"/>
            <circle cx="12" cy="10" r="1.2" fill="${active ? '#22d3ee' : '#64748b'}"/>
            <circle cx="16" cy="10" r="1.2" fill="${active ? '#22d3ee' : '#64748b'}"/>
        </svg>`
};

const TELEPHONY_ITEMS = [
    { bit: 0, id: 'incoming_call',  name: 'Incoming Call',       theme: 'emerald', svg: TELEPHONY_ICONS_SVG.incoming_call },
    { bit: 1, id: 'incoming_video', name: 'Incoming Video Call', theme: 'purple',  svg: TELEPHONY_ICONS_SVG.incoming_video },
    { bit: 2, id: 'outgoing_call',  name: 'Outgoing Call',       theme: 'amber',   svg: TELEPHONY_ICONS_SVG.outgoing_call },
    { bit: 3, id: 'missed_call',    name: 'Missed Call',         theme: 'red',     svg: TELEPHONY_ICONS_SVG.missed_call },
    { bit: 4, id: 'active_call',    name: 'Connected Call',      theme: 'emerald', svg: TELEPHONY_ICONS_SVG.active_call },
    { bit: 5, id: 'mute',           name: 'Mute',                theme: 'red',     svg: TELEPHONY_ICONS_SVG.mute },
    { bit: 6, id: 'video_stream',   name: 'Camera Live',         theme: 'cyan',    svg: TELEPHONY_ICONS_SVG.video_stream },
    { bit: 7, id: 'unread_chat',    name: 'New Chat',            theme: 'cyan',    svg: TELEPHONY_ICONS_SVG.unread_chat }
];

const THEME_CLASSES = {
    emerald: 'bg-emerald-950/70 border-emerald-400 text-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.55)] scale-110',
    purple:  'bg-purple-950/70 border-purple-400 text-purple-300 shadow-[0_0_18px_rgba(192,132,252,0.55)] scale-110',
    amber:   'bg-amber-950/70 border-amber-400 text-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.55)] scale-110',
    red:     'bg-rose-950/70 border-rose-400 text-rose-300 shadow-[0_0_18px_rgba(244,63,94,0.55)] scale-110',
    cyan:    'bg-cyan-950/70 border-cyan-400 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.55)] scale-110'
};

const TitanTelephonyMatrix = ({
    mask = 0b00000001,
    missedCount = 3,
    interactive = true
} = {}) => {
    const numericMask = parseBitmask(mask);

    const itemsHtml = TELEPHONY_ITEMS.map((item) => {
        const isActive = Boolean(numericMask & (1 << item.bit));
        const activeCls = THEME_CLASSES[item.theme] || THEME_CLASSES.emerald;

        const cardCls = isActive
            ? `${activeCls} border-2 ring-2 ring-emerald-500/20`
            : 'bg-slate-900/60 border border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700 hover:bg-slate-800/80 opacity-40 hover:opacity-100';

        const svgRender = item.id === 'missed_call'
            ? item.svg(isActive, missedCount)
            : item.svg(isActive);

        const toggledMask = (numericMask ^ (1 << item.bit)) & 0xFF;
        const actionAttr = interactive ? `action="bus:write:4000:${toggledMask}"` : '';

        return `
        <button 
            type="button"
            class="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full transition-all duration-200 cursor-pointer select-none ${cardCls}" 
            ${actionAttr} 
            title="${item.name} (Bit ${item.bit}): ${isActive ? 'ACTIVE' : 'INACTIVE'}"
        >
            ${svgRender}
        </button>`;
    }).join('');

    return `
    <div class="flex items-center justify-center w-full p-2.5 bg-black/60 rounded-full border border-slate-800 shadow-2xl backdrop-blur-2xl">
        <div class="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            ${itemsHtml}
        </div>
    </div>`;
};

module.exports = {
    TitanTelephonyMatrix,
    TELEPHONY_ITEMS,
    TELEPHONY_ICONS_SVG
};
