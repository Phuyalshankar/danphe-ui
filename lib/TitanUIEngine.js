'use strict';

/**
 * 🌟 TitanUIEngine (danphe-ui)
 * Master 256 Unified UI Component & Variant Spectrum (0 to 255)
 * ═════════════════════════════════════════════════════════════════════════════
 * 0   - 63  : 🔤 INPUT & FORM VARIANTS (Outlined, Floating, Underline Solid, Underline Segmented, Filled, Pwd)
 * 64  - 127 : 🔘 BUTTON & CONTROL VARIANTS (Primary, Ghost, Switch, Rocker, FAB)
 * 128 - 191 : 📦 CARD & CONTAINER VARIANTS (Glass, Elevated 3D, Action, Alert)
 * 192 - 255 : 📟 DISPLAY & SYNTHESIZERS (7-Segment, LCD, Waveform, Keypad)
 */

const { TITAN_ICON, ICONS_256, renderAdaptiveIconSVG, TITAN_ANIM } = require('./TitanAdaptiveIcon');
const { SevenSegment } = require('./SevenSegment');
const { MatrixLCD } = require('./MatrixLCD');
const { VectorKeypad } = require('./VectorKeypad');
const { AudioWaveform } = require('./AudioWaveform');

// 🏷️ TITAN_UI OPCODES & DOMAIN RANGES
const TITAN_UI = {
    // ── 0 - 63: INPUT FORMS ──
    INPUT_PLAIN: 0,
    INPUT_OUTLINED_USER: 1,
    INPUT_OUTLINED_SEARCH: 3,
    INPUT_OUTLINED_PASSWORD: 7,
    INPUT_OUTLINED_PHONE: 11,
    INPUT_OUTLINED_PIN: 15,
    INPUT_FLOATING_USER: 17,
    INPUT_FLOATING_SEARCH: 19,
    INPUT_FLOATING_PASSWORD: 23,
    INPUT_FLOATING_PHONE: 27,
    INPUT_UNDERLINE_SOLID_PLAIN: 32,
    INPUT_UNDERLINE_SOLID_USER: 33,
    INPUT_UNDERLINE_SOLID_SEARCH: 35,
    INPUT_UNDERLINE_SOLID_PASSWORD: 39,
    INPUT_UNDERLINE_SOLID_PHONE: 41,
    INPUT_UNDERLINE_FLOATING: 49,
    INPUT_UNDERLINE_SEGMENTED_PROGRESS: 51,
    INPUT_UNDERLINE_SEGMENTED_PWD: 53,
    INPUT_FILLED_NEON: 55,
    INPUT_UNDERLINE_SEGMENTED_ERROR: 59,
    INPUT_CYBER_TERMINAL: 63,

    // ── 64 - 127: BUTTONS & CONTROLS ──
    BUTTON_PRIMARY: 64,
    BUTTON_PRIMARY_GLOW: 65,
    BUTTON_CALL_CONNECT: 66,
    BUTTON_SUCCESS_SUBMIT: 67,
    BUTTON_SECONDARY_OUTLINED: 80,
    BUTTON_GHOST_CANCEL: 81,
    BUTTON_DESTRUCTIVE_RED: 85,
    BUTTON_TOGGLE_SWITCH: 96,
    BUTTON_ROCKER_SWITCH: 100,
    BUTTON_MIC_MUTE_SWITCH: 106,
    BUTTON_FAB_SPEED_DIAL: 112,
    BUTTON_ICON_BADGE_ONLY: 120,

    // ── 128 - 191: CARDS & CONTAINERS ──
    CARD_GLASS_FORM: 128,
    CARD_GLASS_NEON: 130,
    CARD_ELEVATED_3D: 144,
    CARD_PBX_METRIC_STAT: 150,
    CARD_ACTIVITY_CALL_ITEM: 160,
    CARD_CONTACT_PROFILE: 170,
    CARD_ALERT_WARNING: 176,
    CARD_ALERT_EMERGENCY: 180,

    // ── 192 - 255: DISPLAYS & SYNTHESIZERS ──
    DISPLAY_7SEG_CYAN: 192,
    DISPLAY_7SEG_EMERALD: 193,
    DISPLAY_7SEG_RED: 194,
    DISPLAY_LCD_EMERALD: 208,
    DISPLAY_LCD_AMBER: 209,
    DISPLAY_WAVEFORM_DSP: 224,
    DISPLAY_VECTOR_KEYPAD: 240,
    DISPLAY_TITAN_HIGHWAY: 255
};

/**
 * 🌟 Master UI Spectrum Renderer
 * Takes any Opcode (0 to 255) + 256 Vector Icon ID and renders the component!
 */
function renderTitanUI({
    code = 0,
    icon = 1,
    label = '',
    placeholder = '',
    value = '',
    title = '',
    subtitle = '',
    error = false,
    stateKey = 'titan_field',
    bus = 'bus:titan:io',
    size = 48,
    theme = 'cyan',
    children = '',
    disabled = false,
    className = ''
} = {}) {
    const opcode = (Number(code) || 0) & 0xFF;
    const iconId = (Number(icon) || 0) & 0xFF;
    const iconMeta = ICONS_256[iconId] || ICONS_256[0];

    // ═════════════════════════════════════════════════════════════════════════
    // DOMAIN 1: INPUT & FORM VARIANTS (0 to 63)
    // ═════════════════════════════════════════════════════════════════════════
    if (opcode < 64) {
        const isFloating  = Boolean(opcode & 16) || opcode === 17 || opcode === 19 || opcode === 23 || opcode === 27 || opcode === 49;
        const isUnderlineSolid     = (opcode >= 32 && opcode <= 49);
        const isUnderlineSegmented = (opcode === 51 || opcode === 53 || opcode === 59);
        const isUnderlineAny       = isUnderlineSolid || isUnderlineSegmented;

        const isPassword  = (opcode % 8 === 7) || (opcode === 7) || (opcode === 23) || (opcode === 39) || (opcode === 53);
        const isSearch    = (opcode % 8 === 3) || (opcode === 3) || (opcode === 19) || (opcode === 35);
        const isError     = error || (opcode === 59);
        const hasLeftIcon = opcode > 0;
        const isNeon      = opcode >= 55 && opcode !== 59;

        const inputType = isPassword ? 'password' : 'text';
        const displayLabel = label || iconMeta.label;

        let leftIconHtml = '';
        if (hasLeftIcon) {
            const rawSvg = renderAdaptiveIconSVG(iconId, 0, 18, false);
            leftIconHtml = `
            <div class="flex items-center justify-center h-full pl-3.5 pr-2.5 pointer-events-none text-cyan-400 shrink-0 self-center">
                ${rawSvg}
            </div>`;
        }

        let rightActionHtml = '';
        if (isPassword) {
            rightActionHtml = `
            <button type="button" onclick="const inp=this.parentElement.querySelector('input'); inp.type=inp.type==='password'?'text':'password';" class="flex items-center justify-center h-full px-3 text-slate-400 hover:text-cyan-300 transition-colors shrink-0 self-center">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>`;
        } else if (isSearch || opcode > 0) {
            rightActionHtml = `
            <button type="button" onclick="const inp=this.parentElement.querySelector('input'); inp.value=''; inp.dispatchEvent(new Event('input', {bubbles:true}));" class="flex items-center justify-center h-full px-3 text-slate-400 hover:text-slate-200 transition-colors shrink-0 self-center">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>`;
        }

        // ═════════════════════════════════════════════════════════════════════
        // 🌟 VARIANT TYPE A: 5-SEGMENT DASHED BOTTOM BORDER (Drawing Item 7)
        // (All borders OFF: Top/Left/Right/Bottom transparent; bottom has 5 responsive dashes that fill up on type/progress/error!)
        // ═════════════════════════════════════════════════════════════════════
        if (isUnderlineSegmented) {
            return `
            <div class="titan-ui-input flex flex-col w-full relative group ${className}">
                <!-- Input Box (All 4 Outer Borders Completely OFF) -->
                <div class="relative flex items-center w-full bg-transparent border-0 transition-all duration-200"
                     style="height: ${size}px;">
                    ${leftIconHtml}
                    <input 
                        id="inp-${stateKey}"
                        type="${inputType}"
                        placeholder="${placeholder || 'Type to fill bottom dashes...'}"
                        value="${value}"
                        data-state-key="${stateKey}"
                        data-bus="${bus}"
                        autocomplete="off"
                        class="peer flex-1 w-full h-full bg-transparent text-white placeholder-slate-500 text-sm font-mono font-medium focus:outline-none ${leftIconHtml ? 'pl-1' : 'pl-3'} pr-2 z-10 self-center"
                        oninput="
                            if (window.TitanBus) window.TitanBus.send('${bus}', this.value);
                            const len = this.value.length;
                            const dashes = this.parentElement.parentElement.querySelectorAll('.titan-dash-seg');
                            dashes.forEach((d, idx) => {
                                if (${isError ? 'true' : 'false'}) {
                                    d.className = 'titan-dash-seg flex-1 h-[3px] rounded-full bg-rose-500 shadow-[0_0_8px_#ef4444] transition-all duration-300';
                                } else {
                                    if (len === 0) {
                                        d.className = 'titan-dash-seg flex-1 h-[3px] rounded-full bg-slate-800 transition-all duration-300';
                                    } else if (idx < Math.min(len, 5)) {
                                        const col = idx >= 4 ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : (idx >= 2 ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-amber-400 shadow-[0_0_8px_#f59e0b]');
                                        d.className = 'titan-dash-seg flex-1 h-[3px] rounded-full ' + col + ' transition-all duration-300';
                                    } else {
                                        d.className = 'titan-dash-seg flex-1 h-[3px] rounded-full bg-slate-800 transition-all duration-300';
                                    }
                                }
                            });
                        "
                        ${disabled ? 'disabled' : ''}
                    />
                    ${rightActionHtml}
                </div>
                
                <!-- 🌟 5-Segment Dashed Baseline (Drawing Item 7) -->
                <div class="flex items-center gap-2 w-full px-1">
                    <div class="titan-dash-seg flex-1 h-[3px] rounded-full ${isError ? 'bg-rose-500 shadow-[0_0_8px_#ef4444]' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'} transition-all duration-300"></div>
                    <div class="titan-dash-seg flex-1 h-[3px] rounded-full ${isError ? 'bg-rose-500 shadow-[0_0_8px_#ef4444]' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'} transition-all duration-300"></div>
                    <div class="titan-dash-seg flex-1 h-[3px] rounded-full ${isError ? 'bg-rose-500 shadow-[0_0_8px_#ef4444]' : 'bg-slate-800'} transition-all duration-300"></div>
                    <div class="titan-dash-seg flex-1 h-[3px] rounded-full ${isError ? 'bg-rose-500 shadow-[0_0_8px_#ef4444]' : 'bg-slate-800'} transition-all duration-300"></div>
                    <div class="titan-dash-seg flex-1 h-[3px] rounded-full ${isError ? 'bg-rose-500 shadow-[0_0_8px_#ef4444]' : 'bg-slate-800'} transition-all duration-300"></div>
                </div>
            </div>`;
        }

        // ═════════════════════════════════════════════════════════════════════
        // 🌟 VARIANT TYPE B: SOLID CONTINUOUS UNDERLINE (Drawing Item 6)
        // ("standard matihoko boarder off" - top, left, right borders OFF; continuous bottom underline only!)
        // ═════════════════════════════════════════════════════════════════════
        if (isUnderlineSolid) {
            const lineCol = isError ? 'border-rose-500' : 'border-slate-700 focus-within:border-cyan-400';
            return `
            <div class="titan-ui-input flex flex-col w-full relative group ${className}">
                <div class="relative flex items-center w-full bg-transparent border-b-2 border-t-0 border-l-0 border-r-0 ${lineCol} transition-all duration-200"
                     style="height: ${size}px;">
                    ${leftIconHtml}
                    <input 
                        id="inp-${stateKey}"
                        type="${inputType}"
                        placeholder="${placeholder || displayLabel}"
                        value="${value}"
                        data-state-key="${stateKey}"
                        data-bus="${bus}"
                        autocomplete="off"
                        class="flex-1 w-full h-full bg-transparent text-white placeholder-slate-500 text-sm font-mono font-medium focus:outline-none ${leftIconHtml ? 'pl-1' : 'pl-2'} pr-2 self-center"
                        oninput="if (window.TitanBus) window.TitanBus.send('${bus}', this.value);"
                        ${disabled ? 'disabled' : ''}
                    />
                    ${rightActionHtml}
                </div>
            </div>`;
        }

        // ═════════════════════════════════════════════════════════════════════
        // 🌟 VARIANT TYPE C: MATERIAL FLOATING LABEL (Drawing Item 5)
        // ═════════════════════════════════════════════════════════════════════
        if (isFloating) {
            const borderStyle = isError ? 'border-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]' : 'border-slate-800 focus-within:border-cyan-500/80';
            return `
            <div class="titan-ui-input flex flex-col w-full relative pt-2 group ${className}">
                <div class="relative flex items-center w-full bg-slate-900/95 rounded-2xl border ${borderStyle} transition-all duration-200 shadow-xl"
                     style="height: ${size}px;">
                    ${leftIconHtml}
                    <input 
                        id="inp-${stateKey}"
                        type="${inputType}"
                        placeholder=" "
                        value="${value}"
                        data-state-key="${stateKey}"
                        data-bus="${bus}"
                        autocomplete="off"
                        class="peer flex-1 w-full h-full bg-transparent text-white placeholder-transparent text-sm font-mono font-medium focus:outline-none ${leftIconHtml ? 'pl-1' : 'pl-4'} pr-2 z-10 self-center"
                        oninput="if (window.TitanBus) window.TitanBus.send('${bus}', this.value);"
                        ${disabled ? 'disabled' : ''}
                    />
                    <!-- Floating Notch Label -->
                    <label for="inp-${stateKey}" 
                           class="absolute ${leftIconHtml ? 'left-10' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs uppercase font-bold tracking-wider transition-all duration-200 pointer-events-none z-20 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700/80 shadow-md peer-focus:-top-3 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-cyan-400 peer-focus:border-cyan-500/80 peer-focus:shadow-[0_0_8px_rgba(34,211,238,0.3)] peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-cyan-400 peer-[:not(:placeholder-shown)]:border-cyan-500/80">
                        ${displayLabel}
                    </label>
                    ${rightActionHtml}
                </div>
            </div>`;
        }

        // ═════════════════════════════════════════════════════════════════════
        // 🌟 VARIANT TYPE D: STANDARD OUTLINED / NEON BOX (Drawing Items 1, 2, 3, 4)
        // ═════════════════════════════════════════════════════════════════════
        const boxBg = isNeon ? 'bg-slate-900/90 shadow-[0_0_15px_rgba(34,211,238,0.3)] border-cyan-400' : (isError ? 'bg-slate-900/95 border-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]' : 'bg-slate-900/95 border-slate-800 focus-within:border-cyan-500/80');

        return `
        <div class="titan-ui-input flex flex-col w-full gap-1.5 ${className}">
            <div class="relative flex items-center w-full ${boxBg} rounded-2xl border transition-all duration-200 shadow-xl"
                 style="height: ${size}px;">
                ${leftIconHtml}
                <input 
                    id="inp-${stateKey}"
                    type="${inputType}"
                    placeholder="${placeholder || displayLabel}"
                    value="${value}"
                    data-state-key="${stateKey}"
                    data-bus="${bus}"
                    autocomplete="off"
                    class="titan-input-field flex-1 w-full h-full bg-transparent text-white placeholder-slate-500 text-sm font-mono font-medium focus:outline-none ${leftIconHtml ? 'pl-1' : 'pl-4'} pr-2 self-center"
                    oninput="if (window.TitanBus) window.TitanBus.send('${bus}', this.value);"
                    ${disabled ? 'disabled' : ''}
                />
                ${rightActionHtml}
            </div>
        </div>`;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // DOMAIN 2: BUTTON & CONTROL VARIANTS (64 to 127)
    // ═════════════════════════════════════════════════════════════════════════
    if (opcode >= 64 && opcode < 128) {
        const isGhost     = opcode >= 80 && opcode < 96;
        const isSwitch    = opcode >= 96 && opcode < 112;
        const isFab       = opcode >= 112;
        const displayBtnLabel = label || iconMeta.label;
        const rawIconSvg = renderAdaptiveIconSVG(iconId, 0, 18, false);

        if (isSwitch) {
            return `
            <label class="titan-ui-switch flex items-center justify-between p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 cursor-pointer select-none hover:border-slate-700 transition-all ${className}">
                <div class="flex items-center gap-3">
                    <div class="text-cyan-400">${rawIconSvg}</div>
                    <span class="text-xs font-bold text-slate-200 uppercase tracking-wider">${displayBtnLabel}</span>
                </div>
                <div class="relative">
                    <input type="checkbox" onchange="if (window.TitanBus) window.TitanBus.send('${bus}', this.checked ? 'ON' : 'OFF');" class="sr-only peer" ${value === 'ON' ? 'checked' : ''}>
                    <div class="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </div>
            </label>`;
        }

        if (isFab) {
            return `
            <button type="button" onclick="if (window.TitanBus) window.TitanBus.send('${bus}', 'TRIGGER');" class="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all ${className}">
                ${renderAdaptiveIconSVG(iconId, 0, 24, false)}
            </button>`;
        }

        if (isGhost) {
            return `
            <button type="button" onclick="if (window.TitanBus) window.TitanBus.send('${bus}', 'CLICK');" class="flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent hover:bg-slate-900 text-slate-300 hover:text-white rounded-2xl border border-slate-700 font-mono text-xs font-bold uppercase tracking-wider transition-all ${className}">
                ${rawIconSvg}
                <span>${displayBtnLabel}</span>
            </button>`;
        }

        // Primary Filled Glow Button
        return `
        <button type="button" onclick="if (window.TitanBus) window.TitanBus.send('${bus}', 'CLICK');" class="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-black rounded-2xl shadow-[0_0_18px_rgba(34,211,238,0.35)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] active:scale-[0.98] transition-all font-mono text-xs uppercase tracking-wider ${className}">
            ${renderAdaptiveIconSVG(iconId, 0, 18, false)}
            <span>${displayBtnLabel}</span>
        </button>`;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // DOMAIN 3: CARD, CONTAINER & PANEL VARIANTS (128 to 191)
    // ═════════════════════════════════════════════════════════════════════════
    if (opcode >= 128 && opcode < 192) {
        const isAlert   = opcode >= 176;
        const isMetric  = opcode >= 144 && opcode < 160;
        const isItem    = opcode >= 160 && opcode < 176;
        const cardTitle = title || label || iconMeta.label;
        const headerIconSvg = renderAdaptiveIconSVG(iconId, 0, 20, false);

        const borderColor = isAlert ? 'border-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-cyan-500/30 shadow-[0_0_25px_rgba(34,211,238,0.15)]';

        if (isMetric) {
            return `
            <div class="titan-ui-card p-5 bg-gradient-to-b from-slate-900/90 to-slate-950/95 rounded-3xl border border-slate-800 shadow-2xl flex items-center justify-between ${className}">
                <div class="flex items-center gap-3.5">
                    <div class="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400">
                        ${headerIconSvg}
                    </div>
                    <div class="flex flex-col">
                        <span class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">${cardTitle}</span>
                        <span class="text-2xl font-black text-white font-mono tracking-tight">${value || '100%'}</span>
                    </div>
                </div>
                <div class="px-2.5 py-1 bg-emerald-950/80 border border-emerald-700 text-emerald-400 text-[10px] font-mono font-bold rounded-full">
                    LIVE
                </div>
            </div>`;
        }

        if (isItem) {
            return `
            <div onclick="if (window.TitanBus) window.TitanBus.send('${bus}', 'SELECT');" class="titan-ui-card p-3.5 bg-slate-900/70 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between cursor-pointer transition-all group ${className}">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                        ${headerIconSvg}
                    </div>
                    <div class="flex flex-col">
                        <span class="text-xs font-bold text-slate-200">${cardTitle}</span>
                        <span class="text-[10px] font-mono text-slate-400">${subtitle || 'Recent Extension'}</span>
                    </div>
                </div>
                <div class="text-slate-500 group-hover:text-cyan-400 transition-colors">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
            </div>`;
        }

        // Form Container / Modal Glass Card
        return `
        <div class="titan-ui-card p-6 bg-gradient-to-b from-slate-900/90 to-slate-950/95 rounded-3xl border-2 ${borderColor} backdrop-blur-2xl flex flex-col gap-4 shadow-2xl ${className}">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
                        ${headerIconSvg}
                    </div>
                    <div>
                        <h3 class="text-sm font-black uppercase tracking-wider text-white font-mono">${cardTitle}</h3>
                        <p class="text-[10px] text-slate-400">${subtitle || 'Secure Universal Panel'}</p>
                    </div>
                </div>
                <span class="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-700">OPCODE ${opcode}</span>
            </div>
            <div class="card-body flex flex-col gap-3 py-1">
                ${children}
            </div>
        </div>`;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // DOMAIN 4: DISPLAYS, LCD & SYNTHESIZERS (192 to 255)
    // ═════════════════════════════════════════════════════════════════════════
    if (opcode >= 192) {
        if (opcode >= 192 && opcode < 208) {
            const segTheme = opcode === 193 ? 'emerald' : (opcode === 194 ? 'red' : 'cyan');
            return SevenSegment({ value: value || '2026', theme: segTheme });
        }
        if (opcode >= 208 && opcode < 224) {
            const lcdTheme = opcode === 209 ? 'amber' : 'emerald';
            return MatrixLCD({ line1: title || 'SYSTEM ACTIVE', line2: subtitle || `REG 1010 BYTE ${opcode}`, theme: lcdTheme });
        }
        if (opcode >= 224 && opcode < 240) {
            return AudioWaveform({ active: true, theme: 'cyan' });
        }
        return VectorKeypad();
    }

    return '';
}

module.exports = {
    TITAN_UI,
    renderTitanUI,
    TitanUI: renderTitanUI
};
