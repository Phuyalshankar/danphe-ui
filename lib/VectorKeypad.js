'use strict';

/**
 * 📱 VectorKeypad Component (danphe-ui)
 * World-Class Tactile Glassmorphism Dialpad with Sub-labels & Tactile Feedback
 */

const KEYPAD_KEYS = [
    { key: '1', sub: '∞',   special: false },
    { key: '2', sub: 'ABC', special: false },
    { key: '3', sub: 'DEF', special: false },
    { key: '4', sub: 'GHI', special: false },
    { key: '5', sub: 'JKL', special: false },
    { key: '6', sub: 'MNO', special: false },
    { key: '7', sub: 'PQRS',special: false },
    { key: '8', sub: 'TUV', special: false },
    { key: '9', sub: 'WXYZ',special: false },
    { key: '*', sub: '✦',   special: true  },
    { key: '0', sub: '+',   special: false },
    { key: '#', sub: '⌗',   special: true  }
];

const VectorKeypad = () => {
    const keysHtml = KEYPAD_KEYS.map(item => `
        <button 
            type="button"
            action="bus:key:${item.key}"
            onclick="if(typeof handleKeypadPress === 'function') handleKeypadPress('${item.key}')"
            class="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900/80 hover:bg-slate-800 active:bg-cyan-950/60 active:scale-95 border border-slate-700/60 hover:border-cyan-500/50 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all duration-150 cursor-pointer select-none group"
        >
            <span class="text-xl sm:text-2xl font-black ${item.special ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-slate-100 group-hover:text-white'} leading-none">
                ${item.key}
            </span>
            <span class="text-[9px] font-mono tracking-widest text-slate-400 group-hover:text-cyan-300/80 mt-0.5 leading-none">
                ${item.sub}
            </span>
        </button>
    `).join('');

    return `
    <div class="flex flex-col items-center justify-center w-full">
        <!-- 3x4 Grid of Tactile Buttons -->
        <div class="grid grid-cols-3 gap-3 p-3 bg-black/60 rounded-2xl border border-slate-800/80 shadow-inner">
            ${keysHtml}
        </div>
        
        <!-- Bottom Action Bar (Call & Backspace) -->
        <div class="flex items-center justify-between w-full max-w-[220px] sm:max-w-[240px] mt-3 px-2">
            <button 
                type="button"
                action="bus:dial"
                onclick="if(typeof handleKeypadPress === 'function') handleKeypadPress('DIAL')"
                class="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-[0_0_12px_rgba(16,185,129,0.4)] transition cursor-pointer"
                title="Initiate Call"
            >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>CALL</span>
            </button>

            <button 
                type="button"
                action="bus:backspace"
                onclick="if(typeof handleKeypadPress === 'function') handleKeypadPress('BACKSPACE')"
                class="flex items-center justify-center gap-1 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer"
                title="Backspace"
            >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
                <span>DEL</span>
            </button>
        </div>
    </div>`;
};

module.exports = { VectorKeypad, KEYPAD_KEYS };
