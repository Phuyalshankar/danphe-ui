'use strict';

/**
 * 🌊 AudioWaveform Component (danphe-ui)
 * World-Class Cyberpunk DSP Audio Oscilloscope & Realtime Frequency Equalizer
 */

const AudioWaveform = ({
    active = true,
    theme = 'cyan', // 'cyan', 'emerald', 'amber', 'rose'
    sampleRate = '48 kHz',
    codec = 'OPUS HD'
} = {}) => {
    // 16 Frequency Equalizer Bars with varying animated heights
    const heights = [35, 65, 90, 45, 80, 100, 70, 40, 60, 85, 95, 55, 75, 45, 80, 30];
    const delays = [0.1, 0.4, 0.2, 0.6, 0.3, 0.5, 0.2, 0.7, 0.15, 0.35, 0.55, 0.25, 0.45, 0.65, 0.3, 0.5];

    const barsHtml = heights.map((h, i) => `
        <div 
            class="w-1.5 rounded-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-emerald-300 ${active ? 'animate-pulse' : 'opacity-20'}" 
            style="height: ${active ? h : 15}%; animation-delay: ${delays[i]}s; animation-duration: 0.85s; box-shadow: 0 0 6px rgba(6,182,212,0.6);"
        ></div>
    `).join('');

    return `
    <div class="flex flex-col w-full p-3 bg-black/70 rounded-2xl border border-slate-800 shadow-inner">
        <!-- Status Header -->
        <div class="flex items-center justify-between w-full mb-2.5 px-1">
            <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full ${active ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}"></span>
                <span class="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">DSP OSCILLOSCOPE</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">${codec}</span>
                <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">${sampleRate}</span>
            </div>
        </div>

        <!-- 16-Band Equalizer Waveform Window -->
        <div class="relative w-full h-16 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-end justify-center gap-1 sm:gap-1.5 px-3 py-2 overflow-hidden">
            <!-- Background Grid Line -->
            <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:12px_12px] opacity-25 pointer-events-none"></div>
            <div class="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-500/20 pointer-events-none"></div>
            
            ${barsHtml}
        </div>

        <!-- Audio Telemetry Footer -->
        <div class="flex items-center justify-between w-full mt-2 px-1 text-[9px] font-mono text-slate-500">
            <span>-∞ dB</span>
            <span class="text-emerald-400 font-bold">-6.2 dB (PEAK)</span>
            <span>0 dB</span>
        </div>
    </div>`;
};

module.exports = { AudioWaveform };
