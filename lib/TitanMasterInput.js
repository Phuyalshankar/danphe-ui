'use strict';

const { TITAN_ICON, ICONS_256, renderAdaptiveIconSVG } = require('./TitanAdaptiveIcon');

const INPUT_FLAGS = {
    BORDER_TOP:        1 << 0,
    BORDER_BOTTOM:     1 << 1,
    BORDER_LEFT:       1 << 2,
    BORDER_RIGHT:      1 << 3,
    BOTTOM_DASH_MODE:  1 << 4,
    DOUBLE_GLOW_FRAME: 1 << 5,
    SURFACE_FILLED:    1 << 6,
    FLOAT_TOP_NOTCH:   1 << 7,
    FLOAT_BOTTOM_BASE: 1 << 8,
    LABEL_HIDDEN:      1 << 9,
    LEFT_SLOT_ENABLE:  1 << 10,
    RIGHT_SLOT_ENABLE: 1 << 11,
    MODE_CIPHER_HIDE:  1 << 12,
    MODE_TOGGLE_RADIO: 1 << 13,
    MODE_TOGGLE_CHECK: 1 << 14,
    STATE_ERROR_ALARM: 1 << 15
};

function renderMasterInput({
    flags = 0,
    reg = null,             // 🌟 Native Titan Bus Memory-Mapped Register (0-65535)
    address = null,         // Alias for reg
    name = '',
    borderMode = 'box',
    slotAlign = 'left',
    float = 'top',
    mode = 'text',
    multiline = false,
    rows = 4,
    sensorLevel = 3,
    icon = 225,
    label = '',
    placeholder = '',
    value = '',
    error = false,
    checked = false,
    bus = '',
    disabled = false,
    className = ''
} = {}) {
    const activeReg = address !== null && address !== undefined ? address : reg;
    let f = Number(flags) || 0;

    if (borderMode === 'box') f |= (INPUT_FLAGS.BORDER_TOP | INPUT_FLAGS.BORDER_BOTTOM | INPUT_FLAGS.BORDER_LEFT | INPUT_FLAGS.BORDER_RIGHT | INPUT_FLAGS.SURFACE_FILLED);
    else if (borderMode === 'underline-solid') f |= (INPUT_FLAGS.BORDER_BOTTOM | INPUT_FLAGS.SURFACE_FILLED);
    else if (borderMode === 'underline-dashes') f |= (INPUT_FLAGS.BOTTOM_DASH_MODE | INPUT_FLAGS.SURFACE_FILLED);
    else if (borderMode === 'double-glow') f |= (INPUT_FLAGS.BORDER_TOP | INPUT_FLAGS.BORDER_BOTTOM | INPUT_FLAGS.BORDER_LEFT | INPUT_FLAGS.BORDER_RIGHT | INPUT_FLAGS.DOUBLE_GLOW_FRAME | INPUT_FLAGS.SURFACE_FILLED);

    if (slotAlign === 'left') f |= INPUT_FLAGS.LEFT_SLOT_ENABLE;
    else if (slotAlign === 'right') f |= INPUT_FLAGS.RIGHT_SLOT_ENABLE;
    else if (slotAlign === 'dual') f |= (INPUT_FLAGS.LEFT_SLOT_ENABLE | INPUT_FLAGS.RIGHT_SLOT_ENABLE);

    if (float === 'top') f |= INPUT_FLAGS.FLOAT_TOP_NOTCH;
    else if (float === 'bottom') f |= INPUT_FLAGS.FLOAT_BOTTOM_BASE;
    else if (float === 'none') f |= INPUT_FLAGS.LABEL_HIDDEN;

    if (mode === 'password') f |= INPUT_FLAGS.MODE_CIPHER_HIDE;
    if (mode === 'radio') f |= INPUT_FLAGS.MODE_TOGGLE_RADIO;
    if (mode === 'checkbox') f |= INPUT_FLAGS.MODE_TOGGLE_CHECK;
    if (error) f |= INPUT_FLAGS.STATE_ERROR_ALARM;

    const isTopNotch    = Boolean(f & INPUT_FLAGS.FLOAT_TOP_NOTCH);
    const isBottomBase  = Boolean(f & INPUT_FLAGS.FLOAT_BOTTOM_BASE);
    const isDashes      = Boolean(f & INPUT_FLAGS.BOTTOM_DASH_MODE);
    const isDoubleGlow  = Boolean(f & INPUT_FLAGS.DOUBLE_GLOW_FRAME);
    const isFilled      = Boolean(f & INPUT_FLAGS.SURFACE_FILLED);
    const isRadio       = Boolean(f & INPUT_FLAGS.MODE_TOGGLE_RADIO);
    const isCheck       = Boolean(f & INPUT_FLAGS.MODE_TOGGLE_CHECK);
    const isError       = Boolean(f & INPUT_FLAGS.STATE_ERROR_ALARM);

    const hasBorderTop    = Boolean(f & INPUT_FLAGS.BORDER_TOP);
    const hasBorderBottom = Boolean(f & INPUT_FLAGS.BORDER_BOTTOM) && !isDashes;
    const hasBorderLeft   = Boolean(f & INPUT_FLAGS.BORDER_LEFT);
    const hasBorderRight  = Boolean(f & INPUT_FLAGS.BORDER_RIGHT);

    const iconId = Number(icon) & 0xFF;
    const iconMeta = ICONS_256[iconId] || ICONS_256[0];
    const displayLabel = label || iconMeta.label;
    const inputId = 'titan-inp-' + Math.random().toString(36).substring(2, 8);
    const fieldName = name || (activeReg !== null ? `reg_${activeReg}` : displayLabel.toLowerCase().replace(/\s+/g, '_'));

    // 🌟 Native Titan Bus Action String & HTML Attributes
    const busAction = bus || (activeReg !== null ? `bus:write:${activeReg}` : '');
    const regAttr = activeReg !== null ? `data-reg="${activeReg}"` : '';

    // Slot SVG Builder
    function buildSlotSvg() {
        if (isRadio) {
            return `
            <svg class="w-5 h-5 ${checked ? 'text-cyan-400' : 'text-slate-500'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9"/>
                ${checked ? '<circle cx="12" cy="12" r="5" fill="#22d3ee" stroke="none"/>' : ''}
            </svg>`;
        }
        if (isCheck) {
            return `
            <svg class="w-5 h-5 ${checked ? 'text-emerald-400' : 'text-slate-500'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="4" ${checked ? 'fill="#059669"' : ''}/>
                ${checked ? '<polyline points="9 12 11 14 15 10" stroke="#ffffff" stroke-width="2.5"/>' : ''}
            </svg>`;
        }
        if (mode === 'sensor') {
            const bars = Number(sensorLevel) || 0;
            return `
            <svg class="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12.55a11 11 0 0 1 14.08 0" stroke="${bars >= 3 ? '#22d3ee' : '#334155'}"/>
                <path d="M1.42 9a16 16 0 0 1 21.16 0" stroke="${bars >= 2 ? '#22d3ee' : '#334155'}"/>
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke="${bars >= 1 ? '#22d3ee' : '#334155'}"/>
                <line x1="12" y1="20" x2="12.01" y2="20" stroke-width="3" stroke="#22d3ee"/>
            </svg>`;
        }
        if (mode === 'select') {
            return `<svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`;
        }
        return renderAdaptiveIconSVG(iconId, 0, 18, false);
    }

    const slotSvg = buildSlotSvg();

    // ── RADIO / CHECKBOX TOGGLE CONTAINER ──
    if (isRadio || isCheck) {
        const toggleType = isRadio ? 'radio' : 'checkbox';
        const isCheckMode = isCheck;

        return `
        <label class="titan-master-toggle flex items-center justify-between p-3.5 bg-slate-900/80 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 cursor-pointer select-none transition-all group ${className}">
            <div class="flex items-center gap-3 ${slotAlign === 'right' ? 'order-1' : 'order-2'}">
                <span class="text-xs font-bold text-slate-200 group-hover:text-white font-mono uppercase tracking-wider">${displayLabel}</span>
            </div>
            <div class="flex items-center justify-center relative ${slotAlign === 'right' ? 'order-2' : 'order-1'}">
                <input type="${toggleType}" 
                       name="${fieldName}" 
                       ${regAttr}
                       data-state-key="${fieldName}"
                       ${checked ? 'checked' : ''} 
                       onchange="if (window.TitanBus) window.TitanBus.send('${busAction || 'bus:toggle:' + fieldName}', this.checked ? '1' : '0');"
                       class="sr-only peer">
                ${isCheckMode ? `
                <div class="w-6 h-6 rounded-lg border-2 border-slate-700 peer-checked:border-emerald-500 bg-slate-950 peer-checked:bg-emerald-600 flex items-center justify-center transition-all shadow-inner group-hover:border-slate-600 peer-checked:shadow-[0_0_14px_rgba(16,185,129,0.45)]">
                    <svg class="w-3.5 h-3.5 text-white scale-0 peer-checked:scale-100 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </div>` : `
                <div class="w-6 h-6 rounded-full border-2 border-slate-700 peer-checked:border-cyan-400 bg-slate-950 flex items-center justify-center transition-all shadow-inner group-hover:border-slate-600 peer-checked:shadow-[0_0_14px_rgba(34,211,238,0.45)]">
                    <div class="w-2.5 h-2.5 rounded-full bg-cyan-400 scale-0 peer-checked:scale-100 transition-transform duration-200"></div>
                </div>`}
            </div>
        </label>`;
    }

    // ── BORDER CLASSES ──
    let borderClasses = [];
    if (hasBorderTop) borderClasses.push('border-t');
    if (hasBorderBottom) borderClasses.push('border-b');
    if (hasBorderLeft) borderClasses.push('border-l');
    if (hasBorderRight) borderClasses.push('border-r');
    
    let borderColorClass = isError 
        ? 'border-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
        : (isDoubleGlow 
            ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3),inset_0_0_10px_rgba(34,211,238,0.15)] ring-2 ring-cyan-500/20' 
            : 'border-slate-800 focus-within:border-cyan-500 focus-within:shadow-[0_0_15px_rgba(34,211,238,0.2)]');

    const roundedClass = (hasBorderTop && hasBorderBottom && hasBorderLeft && hasBorderRight) ? 'rounded-2xl' : (hasBorderBottom && !hasBorderTop ? 'rounded-none' : 'rounded-2xl');
    const surfaceClass = isFilled ? 'bg-slate-900/90' : 'bg-transparent';

    // ── 5-SEGMENT PROGRESS / OTP DASHES (DRAWING ITEM 7) ──
    let dashesHtml = '';
    if (isDashes) {
        const valLen = String(value || '').length;
        const segCols = [0, 1, 2, 3, 4].map(idx => {
            if (isError) return 'bg-rose-500 shadow-[0_0_8px_#ef4444]';
            if (valLen > idx * 2) return 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]';
            return 'bg-slate-800';
        });
        dashesHtml = `
        <div class="titan-dash-track absolute bottom-0 left-0 right-0 h-1 flex gap-1.5 px-4 pointer-events-none">
            <div class="flex-1 h-full rounded-full transition-all duration-300 ${segCols[0]}"></div>
            <div class="flex-1 h-full rounded-full transition-all duration-300 ${segCols[1]}"></div>
            <div class="flex-1 h-full rounded-full transition-all duration-300 ${segCols[2]}"></div>
            <div class="flex-1 h-full rounded-full transition-all duration-300 ${segCols[3]}"></div>
            <div class="flex-1 h-full rounded-full transition-all duration-300 ${segCols[4]}"></div>
        </div>`;
    }

    // ── FLOATING LABELS ──
    let notchLabelHtml = '';
    if (isTopNotch && displayLabel) {
        notchLabelHtml = `
        <label for="${inputId}" class="absolute -top-3 left-4 px-2.5 py-0.5 bg-slate-950 text-cyan-400 text-[10px] font-mono font-bold tracking-wider uppercase rounded-full border border-cyan-500/40 shadow-sm z-10 pointer-events-none">
            ${displayLabel}
        </label>`;
    }

    let bottomBaseHtml = '';
    if (isBottomBase && displayLabel) {
        bottomBaseHtml = `
        <div class="flex items-center justify-between px-2 pt-1 text-[10px] font-mono text-slate-500">
            <span>${displayLabel}</span>
            <span id="${inputId}-counter">0/50</span>
        </div>`;
    }

    // ── INPUT / TEXTAREA ELEMENT ──
    const inputType = mode === 'password' ? 'password' : 'text';
    const inputElement = multiline 
        ? `<textarea id="${inputId}" name="${fieldName}" ${regAttr} data-state-key="${fieldName}" rows="${rows}" placeholder="${placeholder || 'Enter notes...'}" oninput="if (window.TitanBus) window.TitanBus.send('${busAction || 'bus:input:' + fieldName}', this.value);" class="w-full bg-transparent text-slate-100 placeholder-slate-600 text-xs font-mono focus:outline-none resize-none pt-3 pb-3 custom-scrollbar" ${disabled ? 'disabled' : ''}>${value}</textarea>`
        : `<input id="${inputId}" type="${inputType}" name="${fieldName}" ${regAttr} data-state-key="${fieldName}" value="${value}" placeholder="${placeholder || displayLabel}" oninput="if (window.TitanBus) window.TitanBus.send('${busAction || 'bus:input:' + fieldName}', this.value); if (this.closest('.titan-master-input-node').querySelector('.titan-dash-track')) { const v=this.value.length; const segs=this.closest('.titan-master-input-node').querySelectorAll('.titan-dash-track div'); segs.forEach((s,i)=>{ s.className = 'flex-1 h-full rounded-full transition-all duration-300 ' + (v > i*2 ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-800'); }); }" class="w-full h-12 bg-transparent text-slate-100 placeholder-slate-600 text-xs font-mono focus:outline-none" ${disabled ? 'disabled' : ''}/>`;

    return `
    <div class="titan-master-input-wrapper flex flex-col w-full ${className}">
        <div class="titan-master-input-node relative flex items-center gap-3 px-4 ${borderClasses.join(' ')} ${borderColorClass} ${roundedClass} ${surfaceClass} transition-all duration-200">
            ${notchLabelHtml}
            ${(f & INPUT_FLAGS.LEFT_SLOT_ENABLE) ? `<div class="text-cyan-400 shrink-0 flex items-center justify-center">${slotSvg}</div>` : ''}
            <div class="flex-1 w-full relative">
                ${inputElement}
            </div>
            ${(f & INPUT_FLAGS.RIGHT_SLOT_ENABLE) ? `<div class="text-slate-400 shrink-0 flex items-center justify-center">${slotSvg}</div>` : ''}
            ${dashesHtml}
        </div>
        ${bottomBaseHtml}
    </div>`;
}

module.exports = {
    INPUT_FLAGS,
    renderMasterInput,
    TitanMasterInput: renderMasterInput,
    TitanInput: renderMasterInput
};
