'use strict';

const { renderAdaptiveIconSVG } = require('./TitanAdaptiveIcon');

/**
 * 🔘 TitanButtonGroup
 * Segmented pill buttons, Telephony Call Controls, Range Pickers
 */
function renderTitanButtonGroup({
    variant = 'pill',       // 'pill' | 'telephony' | 'outline' | 'matrix'
    size = 'md',
    activeIndex = 0,
    items = [],
    className = ''
} = {}) {
    let defaultItems = items;
    if (!defaultItems.length) {
        if (variant === 'telephony') {
            defaultItems = [
                { icon: 1, label: 'Dial 📞', action: 'DIAL' },
                { icon: 6, label: 'Hold ⏸', action: 'HOLD' },
                { icon: 225, label: 'Transfer 🔀', action: 'TRANSFER' },
                { icon: 242, label: 'End 🔴', action: 'HANGUP', danger: true }
            ];
        } else {
            defaultItems = [
                { label: 'Day' },
                { label: 'Week' },
                { label: 'Month' },
                { label: 'Year' }
            ];
        }
    }

    const isTelephony = variant === 'telephony';

    return `
    <div class="titan-button-group inline-flex items-center p-1 bg-slate-950/90 rounded-2xl border border-slate-800 shadow-inner ${className}">
        ${defaultItems.map((it, idx) => {
            const isAct = idx === Number(activeIndex);
            const activeStyle = isAct 
                ? (it.danger ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-cyan-600 text-slate-950 font-black shadow-[0_0_15px_rgba(34,211,238,0.4)]')
                : (it.danger ? 'text-rose-400 hover:bg-rose-950/60' : 'text-slate-400 hover:text-white hover:bg-slate-900');

            const iconHtml = it.icon ? renderAdaptiveIconSVG(it.icon, 0, 14, false) : '';

            return `
            <button type="button" 
                    onclick="if(window.TitanBus) window.TitanBus.send('bus:group:action', '${it.action || it.label}'); this.parentElement.querySelectorAll('button').forEach((b,i)=>b.className=i===${idx}?'px-3.5 py-1.5 rounded-xl font-mono text-xs font-black transition-all ${it.danger ? 'bg-rose-600 text-white shadow-lg' : 'bg-cyan-600 text-slate-950 shadow-lg'} flex items-center gap-1.5':'px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all text-slate-400 hover:text-white hover:bg-slate-900 flex items-center gap-1.5');"
                    class="px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${activeStyle} flex items-center gap-1.5">
                ${iconHtml}
                <span>${it.label}</span>
            </button>`;
        }).join('')}
    </div>`;
}

module.exports = {
    renderTitanButtonGroup,
    TitanButtonGroup: renderTitanButtonGroup
};
