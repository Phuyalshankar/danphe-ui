'use strict';

/**
 * 🐬 TitanIconMatrix React Component (danphe-ui)
 * Bitmask Controlled Clean Circular Icon Matrix
 */
const React = require('react');
const { DEFAULT_TITAN_ICONS, parseBitmask, renderIconSVG } = require('../lib/TitanIconMatrix');

const THEME_CLASSES = {
    emerald: 'bg-emerald-950/70 border-emerald-400 text-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.55)] scale-110',
    cyan:    'bg-cyan-950/70 border-cyan-400 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.55)] scale-110',
    amber:   'bg-amber-950/70 border-amber-400 text-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.55)] scale-110',
    red:     'bg-rose-950/70 border-rose-400 text-rose-300 shadow-[0_0_18px_rgba(248,113,113,0.55)] scale-110',
    purple:  'bg-purple-950/70 border-purple-400 text-purple-300 shadow-[0_0_18px_rgba(192,132,252,0.55)] scale-110'
};

const TitanIconMatrix = ({
    mask = 0b0010,
    icons = DEFAULT_TITAN_ICONS,
    onToggle = null,
    interactive = true
}) => {
    const numericMask = parseBitmask(mask);

    const handleItemClick = (bitIndex) => {
        if (!interactive) return;
        const newMask = numericMask ^ (1 << bitIndex);
        if (onToggle) {
            onToggle(newMask, bitIndex, Boolean(newMask & (1 << bitIndex)));
        }
    };

    return (
        <div className="flex items-center justify-center w-full p-2.5 bg-black/60 rounded-full border border-slate-800 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {icons.map((item, index) => {
                    const bitIndex = item.bit !== undefined ? item.bit : index;
                    const isActive = Boolean(numericMask & (1 << bitIndex));
                    const activeCls = THEME_CLASSES[item.activeTheme] || THEME_CLASSES.emerald;

                    return (
                        <button
                            key={item.id || index}
                            type="button"
                            onClick={() => handleItemClick(bitIndex)}
                            action={`bus:write:20100:${numericMask ^ (1 << bitIndex)}`}
                            className={`relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full border transition-all duration-200 select-none cursor-pointer ${
                                isActive
                                    ? `${activeCls} border-2`
                                    : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700 hover:bg-slate-800/80 opacity-40 hover:opacity-100'
                            }`}
                            title={`${item.label} (Bit ${bitIndex}): ${isActive ? 'ACTIVE' : 'INACTIVE'}`}
                        >
                            <div 
                                className="flex items-center justify-center"
                                dangerouslySetInnerHTML={{ __html: renderIconSVG(item.name, isActive, item.activeTheme, 22) }}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

module.exports = { TitanIconMatrix };
