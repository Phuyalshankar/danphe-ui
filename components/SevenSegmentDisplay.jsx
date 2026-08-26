'use strict';

/**
 * 📟 Digit7Seg Component
 * Physical 7-Segment LED Bar with Real Lit & Unlit Segments (A, B, C, D, E, F, G)
 */
const Digit7Seg = ({ digit = ' ', theme = 'red' }) => {
    const d = String(digit || ' ');
    
    // Segment logic
    const onA = ['0','2','3','5','6','7','8','9','A','E','F','P'].includes(d);
    const onB = ['0','1','2','3','4','7','8','9','A','d','P'].includes(d);
    const onC = ['0','1','3','4','5','6','7','8','9','A','b','d'].includes(d);
    const onD = ['0','2','3','5','6','8','9','b','c','d','E'].includes(d);
    const onE = ['0','2','6','8','A','b','c','d','E','F','P'].includes(d);
    const onF = ['0','4','5','6','8','9','A','b','c','E','F','P'].includes(d);
    const onG = ['2','3','4','5','6','8','9','-','A','b','d','E','F','P'].includes(d);

    const onCls = (theme === 'cyan') ? 'bg-cyan-400 shadow-lg' : 
                  (theme === 'emerald') ? 'bg-emerald-400 shadow-lg' : 
                  (theme === 'amber') ? 'bg-amber-400 shadow-lg' : 
                  'bg-rose-500 shadow-lg';

    const offCls = (theme === 'cyan') ? 'bg-cyan-950/20' : 
                   (theme === 'emerald') ? 'bg-emerald-950/20' : 
                   (theme === 'amber') ? 'bg-amber-950/20' : 
                   'bg-rose-950/20';

    return (
        <div className="flex-col items-center justify-center p-0.5 mx-1">
            {/* Top Bar (Segment A) */}
            <div className={`w-6 h-1 rounded-full ${onA ? onCls : offCls}`}></div>

            {/* Upper Row: Left Bar (F) & Right Bar (B) */}
            <div className="flex-row items-center justify-between w-7 h-4 px-0.5 my-0.5">
                <div className={`w-1 h-4 rounded-full ${onF ? onCls : offCls}`}></div>
                <div className={`w-1 h-4 rounded-full ${onB ? onCls : offCls}`}></div>
            </div>

            {/* Middle Bar (Segment G) */}
            <div className={`w-6 h-1 rounded-full ${onG ? onCls : offCls}`}></div>

            {/* Lower Row: Left Bar (E) & Right Bar (C) */}
            <div className="flex-row items-center justify-between w-7 h-4 px-0.5 my-0.5">
                <div className={`w-1 h-4 rounded-full ${onE ? onCls : offCls}`}></div>
                <div className={`w-1 h-4 rounded-full ${onC ? onCls : offCls}`}></div>
            </div>

            {/* Bottom Bar (Segment D) */}
            <div className={`w-6 h-1 rounded-full ${onD ? onCls : offCls}`}></div>
        </div>
    );
};

/**
 * 📟 RealSevenSegmentPanel Component
 * Displays a real multi-digit 7-segment digital panel
 */
const RealSevenSegmentPanel = ({ theme = 'red' }) => (
    <div className="flex-col items-center justify-center p-3 bg-black rounded-2xl border-2 border-red-900/60 shadow-2xl w-full max-w-xs my-2">
        <div className="flex-row items-center justify-between w-full mb-1.5 px-2">
            <span className="text-rose-500 font-black text-xs uppercase tracking-widest">● HARDWARE 7-SEG LED</span>
            <span className="bg-red-950 text-rose-400 text-xs font-bold px-2 py-0.5 rounded-full border border-red-800">REAL CAD</span>
        </div>
        
        {/* Real Multi-Digit 7-Segment LED Bars Display */}
        <div className="flex-row items-center justify-center p-2 bg-slate-950 rounded-xl border border-red-950/80 shadow-inner">
            <Digit7Seg digit="2" theme={theme} />
            <Digit7Seg digit="0" theme={theme} />
            <Digit7Seg digit="1" theme={theme} />
            <div className="w-2"></div>
            <Digit7Seg digit="-" theme={theme} />
            <div className="w-2"></div>
            <Digit7Seg digit="8" theme={theme} />
        </div>
    </div>
);

module.exports = { Digit7Seg, RealSevenSegmentPanel };
