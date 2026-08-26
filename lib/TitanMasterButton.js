'use strict';

const { TITAN_ICON, ICONS_256, renderAdaptiveIconSVG } = require('./TitanAdaptiveIcon');

const BUTTON_FLAGS = {
    STYLE_PRIMARY:     1 << 0,
    STYLE_SECONDARY:   1 << 1,
    STYLE_OUTLINE:     1 << 2,
    STYLE_GHOST:       1 << 3,
    STYLE_DASHED:      1 << 4,
    STYLE_GLASS:       1 << 5,
    THEME_DANGER:      1 << 6,
    THEME_WARNING:     1 << 7,
    THEME_SUCCESS:     1 << 8,
    THEME_VIOLET:      1 << 9,
    MODE_TOGGLE_SWITCH:1 << 10,
    MODE_ROCKER:       1 << 11,
    MODE_FAB_CIRCLE:   1 << 12,
    MODE_BEACON_PING:  1 << 13,
    MODE_SPLIT_DROPDOWN:1 << 14,
    MODE_LINK_UNDERLINE:1 << 15
};

function renderMasterButton({
    flags = 0,
    reg = null,             // 🌟 Native Titan Bus Register (0-65535)
    address = null,         // Alias for reg
    targetValue = null,     // Value to write on register on click
    relay = null,           // Shortcut for Relay ID (e.g. 1 -> Reg 20001)
    screen = '',            // Shortcut for Screen navigation (Reg 10)
    variant = 'primary',
    state = 'idle',
    progress = 0,
    icon = 1,
    iconPos = 'left',
    label = '',
    successLabel = 'Success!',
    errorLabel = 'Failed - Retry',
    loadingLabel = 'Processing...',
    checked = false,
    counter = null,
    anim = 0,
    size = 'md',
    bus = '',
    action = 'CLICK',
    disabled = false,
    className = ''
} = {}) {
    const activeReg = address !== null && address !== undefined ? address : reg;
    let f = Number(flags) || 0;

    if (variant === 'secondary') f |= BUTTON_FLAGS.STYLE_SECONDARY;
    if (variant === 'outline') f |= BUTTON_FLAGS.STYLE_OUTLINE;
    if (variant === 'ghost') f |= BUTTON_FLAGS.STYLE_GHOST;
    if (variant === 'dashed') f |= BUTTON_FLAGS.STYLE_DASHED;
    if (variant === 'glass') f |= BUTTON_FLAGS.STYLE_GLASS;
    if (variant === 'destructive') f |= BUTTON_FLAGS.THEME_DANGER;
    if (variant === 'warning') f |= BUTTON_FLAGS.THEME_WARNING;
    if (variant === 'violet') f |= BUTTON_FLAGS.THEME_VIOLET;
    if (variant === 'switch') f |= BUTTON_FLAGS.MODE_TOGGLE_SWITCH;
    if (variant === 'rocker') f |= BUTTON_FLAGS.MODE_ROCKER;
    if (variant === 'fab') f |= BUTTON_FLAGS.MODE_FAB_CIRCLE;
    if (variant === 'beacon') f |= (BUTTON_FLAGS.MODE_FAB_CIRCLE | BUTTON_FLAGS.MODE_BEACON_PING);
    if (variant === 'split') f |= BUTTON_FLAGS.MODE_SPLIT_DROPDOWN;
    if (variant === 'link') f |= BUTTON_FLAGS.MODE_LINK_UNDERLINE;

    const isStateLoading  = state === 'loading';
    const isStateSuccess  = state === 'success';
    const isStateError    = state === 'error';
    const isStateProgress = state === 'progress' || (progress > 0 && progress < 100);

    const isSwitch  = Boolean(f & BUTTON_FLAGS.MODE_TOGGLE_SWITCH);
    const isRocker  = Boolean(f & BUTTON_FLAGS.MODE_ROCKER);
    const isFab     = Boolean(f & BUTTON_FLAGS.MODE_FAB_CIRCLE) || iconPos === 'icon-only';
    const isBeacon  = Boolean(f & BUTTON_FLAGS.MODE_BEACON_PING);
    const isSplit   = Boolean(f & BUTTON_FLAGS.MODE_SPLIT_DROPDOWN);
    const isLink    = Boolean(f & BUTTON_FLAGS.MODE_LINK_UNDERLINE);

    const isGhost   = Boolean(f & BUTTON_FLAGS.STYLE_GHOST);
    const isOutline = Boolean(f & BUTTON_FLAGS.STYLE_OUTLINE);
    const isDashed  = Boolean(f & BUTTON_FLAGS.STYLE_DASHED);
    const isGlass   = Boolean(f & BUTTON_FLAGS.STYLE_GLASS);
    const isDanger  = Boolean(f & BUTTON_FLAGS.THEME_DANGER);
    const isWarn    = Boolean(f & BUTTON_FLAGS.THEME_WARNING);
    const isViolet  = Boolean(f & BUTTON_FLAGS.THEME_VIOLET);

    const rawIconId = Number(icon) & 0xFF;
    const iconMeta = ICONS_256[rawIconId] || ICONS_256[0];
    const displayLabel = label || iconMeta.label;

    // 🌟 Compute Hardware Dispatch Action
    let dispatchAction = bus;
    if (!dispatchAction) {
        if (relay !== null) dispatchAction = `bus:relay:${relay}:on`;
        else if (screen) dispatchAction = `bus:screen:${screen}`;
        else if (activeReg !== null) dispatchAction = `bus:write:${activeReg}:${targetValue !== null ? targetValue : action}`;
        else dispatchAction = action;
    }

    const regAttr = activeReg !== null ? `data-reg="${activeReg}"` : '';

    // ── 1. HARDWARE TOGGLE SWITCH (SLIDER CAPSULE) ──
    if (isSwitch) {
        const switchIcon = iconPos !== 'none' ? renderAdaptiveIconSVG(rawIconId, 0, 18, false, anim) : '';
        const toggleBus = activeReg !== null ? `bus:write:${activeReg}` : (bus || 'bus:switch:' + displayLabel);
        return `
        <label class="titan-master-switch flex items-center justify-between p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 cursor-pointer select-none hover:border-slate-700 transition-all ${className}">
            <div class="flex items-center gap-3">
                ${switchIcon ? `<div class="text-cyan-400">${switchIcon}</div>` : ''}
                <span class="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">${displayLabel}</span>
            </div>
            <div class="relative">
                <input type="checkbox" ${regAttr} onchange="if (window.TitanBus) window.TitanBus.send('${toggleBus}', this.checked ? '1' : '0');" class="sr-only peer" ${checked ? 'checked' : ''}>
                <div class="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 shadow-inner"></div>
            </div>
        </label>`;
    }

    // ── 2. 3D TACTILE INDUSTRIAL ROCKER SWITCH ──
    if (isRocker) {
        const rockerReg = reg !== null ? reg : 20001;
        return `
        <div class="titan-rocker-container inline-flex p-1 bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl ${className}">
            <button type="button" onclick="if (window.TitanBus) window.TitanBus.send('bus:write:${rockerReg}:1', '1');" class="px-4 py-2 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all ${checked ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_#22d3ee]' : 'text-slate-500 hover:text-slate-300'}">ON</button>
            <button type="button" onclick="if (window.TitanBus) window.TitanBus.send('bus:write:${rockerReg}:0', '0');" class="px-4 py-2 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all ${!checked ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-500 hover:text-slate-300'}">OFF</button>
        </div>`;
    }

    // ── 3. CIRCULAR FAB & RADAR BEACON PING ──
    if (isFab) {
        const fabSize = size === 'sm' ? 'w-10 h-10' : (size === 'lg' ? 'w-16 h-16' : 'w-14 h-14');
        const iconPx = size === 'sm' ? 18 : (size === 'lg' ? 26 : 22);
        let fabIcon = renderAdaptiveIconSVG(rawIconId, 0, iconPx, false, anim);

        if (isStateSuccess) fabIcon = `<svg class="w-6 h-6 text-slate-950 font-bold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
        if (isStateError) fabIcon = `<svg class="w-6 h-6 text-white font-bold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

        const fabBg = isStateSuccess ? 'bg-emerald-400 shadow-[0_0_25px_#34d399]' : (isStateError ? 'bg-rose-600 shadow-[0_0_25px_#ef4444]' : (isViolet ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.4)]'));

        return `
        <div class="relative inline-flex items-center justify-center">
            ${isBeacon ? `<span class="absolute w-full h-full rounded-full bg-cyan-400 opacity-75 animate-ping pointer-events-none"></span>` : ''}
            <button type="button" 
                    ${regAttr}
                    onclick="if (window.TitanBus) window.TitanBus.send('${dispatchAction}', '${action}');"
                    class="titan-master-fab relative z-10 ${fabSize} rounded-full ${fabBg} flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all overflow-hidden ${className}"
                    ${disabled ? 'disabled' : ''}>
                ${isStateLoading ? `<svg class="animate-spin w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>` : fabIcon}
            </button>
        </div>`;
    }

    // ── 4. ANIMATED LINK UNDERLINE BUTTON ──
    if (isLink) {
        const linkIcon = iconPos !== 'none' ? renderAdaptiveIconSVG(rawIconId, 0, 16, false, anim) : '';
        return `
        <button type="button" 
                ${regAttr}
                onclick="if (window.TitanBus) window.TitanBus.send('${dispatchAction}', '${action}');"
                class="titan-master-link group inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider transition-all relative py-1 ${className}">
            ${iconPos === 'left' ? linkIcon : ''}
            <span>${displayLabel}</span>
            ${iconPos === 'right' ? linkIcon : ''}
            <span class="absolute bottom-0 left-0 w-0 group-hover:w-full h-[2px] bg-cyan-400 transition-all duration-300"></span>
        </button>`;
    }

    // ── 5. SPLIT ACTION BUTTON ──
    if (isSplit) {
        const splitIcon = iconPos !== 'none' ? renderAdaptiveIconSVG(rawIconId, 0, 16, false, anim) : '';
        return `
        <div class="titan-split-btn inline-flex items-center rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 shadow-[0_0_18px_rgba(34,211,238,0.35)] border border-cyan-400 p-0.5 ${className}">
            <button type="button" ${regAttr} onclick="if (window.TitanBus) window.TitanBus.send('${dispatchAction}', 'MAIN');" class="flex items-center gap-2 px-5 py-2.5 text-slate-950 font-black font-mono text-xs uppercase tracking-wider hover:bg-cyan-400/30 rounded-xl transition">
                ${splitIcon}
                <span>${displayLabel}</span>
            </button>
            <div class="w-[1px] h-6 bg-slate-950/20"></div>
            <button type="button" onclick="if (window.TitanBus) window.TitanBus.send('${dispatchAction}', 'MENU');" class="px-2.5 py-2.5 text-slate-950 font-bold hover:bg-cyan-400/30 rounded-xl transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
        </div>`;
    }

    // ── 6. DYNAMIC STATE MORPHING PUSH BUTTON ──
    const heightClass = size === 'sm' ? 'h-9 px-4 text-xs' : (size === 'lg' ? 'h-14 px-8 text-sm' : 'h-12 px-6 text-xs');
    const iconPx = size === 'sm' ? 16 : (size === 'lg' ? 22 : 18);

    let activeIconHtml = '';
    let activeLabelText = label;

    if (isStateSuccess) {
        activeIconHtml = `<svg class="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
        activeLabelText = successLabel || 'Success!';
    } else if (isStateError) {
        activeIconHtml = `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
        activeLabelText = errorLabel || 'Failed - Retry';
    } else if (isStateLoading) {
        activeIconHtml = `<svg class="animate-spin w-4 h-4 text-current" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>`;
        activeLabelText = loadingLabel || 'Processing...';
    } else if (isStateProgress) {
        activeIconHtml = `<span class="font-mono font-black text-cyan-400 text-xs">${Math.round(progress)}%</span>`;
        activeLabelText = (label || 'Uploading...') + ` (${Math.round(progress)}%)`;
    } else {
        if (!activeLabelText) activeLabelText = iconMeta.label;
        if (iconPos !== 'none') activeIconHtml = renderAdaptiveIconSVG(rawIconId, 0, iconPx, false, anim);
    }

    let styleClasses = '';
    if (isStateSuccess) {
        styleClasses = 'bg-emerald-400 text-slate-950 font-black shadow-[0_0_25px_#34d399] border border-emerald-300';
    } else if (isStateError || isDanger) {
        styleClasses = 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-rose-400';
    } else if (isWarn) {
        styleClasses = 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-amber-300';
    } else if (isViolet) {
        styleClasses = 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-purple-400';
    } else if (isGlass) {
        styleClasses = 'bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-xl text-cyan-300 font-bold border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]';
    } else if (isDashed) {
        styleClasses = 'bg-slate-950 hover:bg-slate-900 text-cyan-400 hover:text-cyan-300 border-2 border-dashed border-cyan-500/60 shadow-md';
    } else if (isGhost) {
        styleClasses = 'bg-transparent hover:bg-slate-900 text-slate-300 hover:text-white border border-transparent';
    } else if (isOutline) {
        styleClasses = 'bg-transparent hover:bg-slate-900 text-cyan-400 hover:text-cyan-300 border-2 border-cyan-500/80 shadow-[0_0_12px_rgba(34,211,238,0.2)]';
    } else if (variant === 'secondary') {
        styleClasses = 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-lg';
    } else {
        styleClasses = 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-black shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:shadow-[0_0_28px_rgba(34,211,238,0.55)] border border-cyan-400';
    }

    let progressFillHtml = '';
    if (isStateProgress || progress > 0) {
        const pct = Math.min(Math.max(Number(progress), 0), 100);
        progressFillHtml = `
        <div class="absolute inset-0 bg-cyan-500/20 pointer-events-none transition-all duration-300 rounded-2xl"
             style="width: ${pct}%;"></div>
        <div class="absolute bottom-0 left-0 h-1 bg-cyan-400 shadow-[0_0_8px_#22d3ee] transition-all duration-300 rounded-b-2xl"
             style="width: ${pct}%;"></div>`;
    }

    let counterBadgeHtml = '';
    if (counter !== null && counter !== undefined) {
        counterBadgeHtml = `
        <span class="ml-1.5 px-2 py-0.5 bg-slate-950/80 text-cyan-300 border border-cyan-600 text-[10px] font-mono font-bold rounded-full">
            ${counter}
        </span>`;
    }

    return `
    <button type="button" 
            ${regAttr}
            onclick="if (window.TitanBus) window.TitanBus.send('${dispatchAction}', '${action}');"
            class="titan-master-btn relative overflow-hidden flex items-center justify-center gap-2.5 rounded-2xl font-mono uppercase font-black tracking-wider transition-all duration-300 active:scale-[0.98] select-none ${heightClass} ${styleClasses} ${className}"
            ${disabled || isStateLoading ? 'disabled' : ''}>
        ${progressFillHtml}
        ${(iconPos === 'left' || isStateLoading || isStateSuccess || isStateError) ? `<div class="z-10 flex items-center justify-center">${activeIconHtml}</div>` : ''}
        <span class="z-10 font-mono tracking-wider">${activeLabelText}</span>
        ${counterBadgeHtml}
        ${(!isStateLoading && !isStateSuccess && !isStateError && iconPos === 'right') ? `<div class="z-10 flex items-center justify-center">${activeIconHtml}</div>` : ''}
    </button>`;
}

module.exports = {
    BUTTON_FLAGS,
    renderMasterButton,
    TitanMasterButton: renderMasterButton,
    TitanButton: renderMasterButton
};
