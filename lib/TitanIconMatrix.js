'use strict';

/**
 * 🐬 TitanIconMatrix (danphe-ui)
 * Bitmask Controlled Clean Circular Icon Matrix
 */

const DEFAULT_TITAN_ICONS = [
    { bit: 0, id: 'wifi',     name: 'wifi',     label: 'WiFi',        activeTheme: 'cyan',    reg: 30004 },
    { bit: 1, id: 'cpu',      name: 'cpu',      label: 'CPU',         activeTheme: 'emerald', reg: 30001 },
    { bit: 2, id: 'battery',  name: 'battery',  label: 'Battery',     activeTheme: 'amber',   reg: 30002 },
    { bit: 3, id: 'server',   name: 'server',   label: 'Server',      activeTheme: 'purple',  reg: 10 },
    { bit: 4, id: 'shield',   name: 'shield',   label: 'Security',    activeTheme: 'emerald', reg: 20010 },
    { bit: 5, id: 'zap',      name: 'zap',      label: 'Power',       activeTheme: 'amber',   reg: 20001 },
    { bit: 6, id: 'bell',     name: 'bell',     label: 'Alarm',       activeTheme: 'red',     reg: 20002 },
    { bit: 7, id: 'database', name: 'database', label: 'Database',    activeTheme: 'cyan',    reg: 10000 }
];

const SVG_ICONS = {
    wifi: `<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>`,
    cpu: `<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>`,
    battery: `<rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="11" x2="23" y2="13"/><line x1="5" y1="12" x2="13" y2="12"/>`,
    server: `<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>`,
    shield: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
    zap: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
    bell: `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>`,
    database: `<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>`
};

const THEME_COLORS = {
    emerald: { stroke: '#34d399', bg: 'bg-emerald-950/70', border: 'border-emerald-400', glow: 'rgba(52,211,153,0.55)' },
    cyan:    { stroke: '#22d3ee', bg: 'bg-cyan-950/70',    border: 'border-cyan-400',    glow: 'rgba(34,211,238,0.55)' },
    amber:   { stroke: '#fbbf24', bg: 'bg-amber-950/70',   border: 'border-amber-400',   glow: 'rgba(251,191,36,0.55)' },
    red:     { stroke: '#f87171', bg: 'bg-rose-950/70',    border: 'border-rose-400',    glow: 'rgba(248,113,113,0.55)' },
    purple:  { stroke: '#c084fc', bg: 'bg-purple-950/70',  border: 'border-purple-400',  glow: 'rgba(192,132,252,0.55)' }
};

function parseBitmask(maskInput) {
    if (typeof maskInput === 'number') return maskInput >>> 0;
    if (typeof maskInput === 'string') {
        const trimmed = maskInput.trim();
        if (trimmed.startsWith('0x') || trimmed.startsWith('0X')) return parseInt(trimmed, 16) >>> 0;
        if (trimmed.startsWith('0b') || trimmed.startsWith('0B')) return parseInt(trimmed.slice(2), 2) >>> 0;
        if (/^[01]+$/.test(trimmed)) return parseInt(trimmed, 2) >>> 0;
        return parseInt(trimmed, 10) >>> 0;
    }
    return 0;
}

function renderIconSVG(iconName, isActive, theme = 'emerald', size = 22) {
    const iconData = SVG_ICONS[iconName] || SVG_ICONS.cpu;
    const colors = THEME_COLORS[theme] || THEME_COLORS.emerald;
    const stroke = isActive ? colors.stroke : '#64748b';
    const filter = isActive ? `filter: drop-shadow(0 0 8px ${colors.glow});` : '';

    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="${filter} transition: all 0.2s ease;">${iconData}</svg>`;
}

const TitanIconMatrix = ({
    mask = 0b0010,
    icons = DEFAULT_TITAN_ICONS,
    interactive = true
}) => {
    const numericMask = parseBitmask(mask);

    const itemsHtml = icons.map((item, index) => {
        const bitIndex = item.bit !== undefined ? item.bit : index;
        const isActive = Boolean(numericMask & (1 << bitIndex));
        const theme = THEME_COLORS[item.activeTheme] || THEME_COLORS.emerald;

        const cardCls = isActive
            ? `${theme.bg} ${theme.border} border-2 shadow-[0_0_18px_${theme.glow}] scale-110`
            : 'bg-slate-900/60 border border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700 hover:bg-slate-800/80 opacity-40 hover:opacity-100';

        const toggledMask = numericMask ^ (1 << bitIndex);
        const actionAttr = interactive ? `action="bus:write:20100:${toggledMask}"` : '';

        return `
        <button 
            type="button"
            class="relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full transition-all duration-200 cursor-pointer select-none ${cardCls}" 
            ${actionAttr} 
            title="${item.label} (Bit ${bitIndex}): ${isActive ? 'ACTIVE' : 'INACTIVE'}"
        >
            ${renderIconSVG(item.name, isActive, item.activeTheme, 22)}
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
    TitanIconMatrix,
    DEFAULT_TITAN_ICONS,
    SVG_ICONS,
    parseBitmask,
    renderIconSVG
};
