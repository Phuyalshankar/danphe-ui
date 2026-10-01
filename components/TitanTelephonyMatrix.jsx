'use strict';

/**
 * 📞 TitanTelephonyMatrix React Component (danphe-ui)
 * Ultra-Clean Rounded World-Class Icon Dock (Text-Free Minimal Design)
 */
const React = require('react');
const { parseBitmask } = require('../lib/TitanIconMatrix');
const { TELEPHONY_ITEMS } = require('../lib/TitanTelephonyMatrix');

const THEME_CLASSES = {
    emerald: 'bg-emerald-950/70 border-emerald-400 text-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.55)] scale-110 ring-2 ring-emerald-500/20',
    purple:  'bg-purple-950/70 border-purple-400 text-purple-300 shadow-[0_0_18px_rgba(192,132,252,0.55)] scale-110 ring-2 ring-purple-500/20',
    amber:   'bg-amber-950/70 border-amber-400 text-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.55)] scale-110 ring-2 ring-amber-500/20',
    red:     'bg-rose-950/70 border-rose-400 text-rose-300 shadow-[0_0_18px_rgba(244,63,94,0.55)] scale-110 ring-2 ring-rose-500/20',
    cyan:    'bg-cyan-950/70 border-cyan-400 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.55)] scale-110 ring-2 ring-cyan-500/20'
};

const TitanTelephonyMatrix = ({
    mask = 0b00000001,
    missedCount = 3,
    onToggle = null,
    interactive = true
}) => {
    const numericMask = parseBitmask(mask);

    const handleItemClick = (bitIndex) => {
        if (!interactive) return;
        const newMask = (numericMask ^ (1 << bitIndex)) & 0xFF;
        if (onToggle) {
            onToggle(newMask, bitIndex, Boolean(newMask & (1 << bitIndex)));
        }
    };

    return (
        <div className="flex items-center justify-center w-full p-2.5 bg-black/60 rounded-full border border-slate-800 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {TELEPHONY_ITEMS.map((item) => {
                    const isActive = Boolean(numericMask & (1 << item.bit));
                    const activeCls = THEME_CLASSES[item.theme] || THEME_CLASSES.emerald;

                    const svgHtml = item.id === 'missed_call'
                        ? item.svg(isActive, missedCount)
                        : item.svg(isActive);

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => handleItemClick(item.bit)}
                            action={`bus:write:4000:${(numericMask ^ (1 << item.bit)) & 0xFF}`}
                            className={`relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full border transition-all duration-200 select-none cursor-pointer ${
                                isActive
                                    ? `${activeCls} border-2`
                                    : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700 hover:bg-slate-800/80 opacity-40 hover:opacity-100'
                            }`}
                            title={`${item.name} (Bit ${item.bit}): ${isActive ? 'ACTIVE' : 'INACTIVE'}`}
                        >
                            <div 
                                className="flex items-center justify-center"
                                dangerouslySetInnerHTML={{ __html: svgHtml }}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

module.exports = { TitanTelephonyMatrix };
