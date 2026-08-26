'use strict';

const MatrixLCD = ({ line1 = '', line2 = '', theme = 'emerald' } = {}) => {
    const bg = theme === 'blue' || theme === 'cyan' ? 'bg-cyan-950 border-cyan-600/40 text-cyan-300' :
               theme === 'amber' ? 'bg-amber-950 border-amber-600/40 text-amber-300' :
               'bg-emerald-950 border-emerald-600/40 text-emerald-400';

    return `<div class="flex-col p-3 rounded-2xl border-2 shadow-inner ${bg} w-full font-mono font-bold tracking-widest"><div class="text-xl font-black tracking-wider text-center">${line1 || ' '}</div>${line2 ? `<div class="text-xs opacity-75 mt-1 tracking-widest text-center">${line2}</div>` : ''}</div>`;
};

module.exports = { MatrixLCD };
