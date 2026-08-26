'use strict';

/**
 * 🎚️ Titan3DSlider (danphe-ui)
 * Studio-Grade 3D Skeuomorphic Recessed Fader with Brushed Metallic Handle & LED Notch
 */

function renderTitan3DSlider({
    id = 'slider-' + Math.random().toString(36).substr(2, 9),
    label = 'Master Gain',
    min = -60,
    max = 12,
    value = 0,
    unit = 'dB',
    theme = 'cyan', // 'cyan', 'emerald', 'amber', 'purple', 'rose'
    ticks = true,
    orientation = 'horizontal' // 'horizontal' | 'vertical'
} = {}) {
    const themeColors = {
        cyan: { led: '#22d3ee', glow: 'rgba(34, 211, 238, 0.6)', fill: 'linear-gradient(90deg, #0284c7, #22d3ee)' },
        emerald: { led: '#10b981', glow: 'rgba(16, 185, 129, 0.6)', fill: 'linear-gradient(90deg, #047857, #10b981)' },
        amber: { led: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)', fill: 'linear-gradient(90deg, #b45309, #f59e0b)' },
        purple: { led: '#c084fc', glow: 'rgba(192, 132, 252, 0.6)', fill: 'linear-gradient(90deg, #7e22ce, #c084fc)' },
        rose: { led: '#f43f5e', glow: 'rgba(244, 63, 94, 0.6)', fill: 'linear-gradient(90deg, #be123c, #f43f5e)' }
    };
    const t = themeColors[theme] || themeColors.cyan;
    const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

    return `
    <div class="titan-3d-slider-root flex flex-col gap-1.5 w-full my-1.5 user-select-none font-sans" id="${id}-wrapper">
        <!-- Label & Value Header -->
        <div class="flex items-center justify-between text-[11px] font-mono font-bold text-slate-300">
            <span class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full" style="background: ${t.led}; box-shadow: 0 0 8px ${t.glow};"></span>
                <span class="uppercase tracking-wider text-slate-300">${label}</span>
            </span>
            <span class="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-bold" id="${id}-val" style="color: ${t.led}; text-shadow: 0 0 6px ${t.glow};">
                ${value > 0 ? '+' : ''}${value} ${unit}
            </span>
        </div>

        <!-- 3D Recessed Track with Embedded Ticks -->
        <div class="relative w-full h-7 bg-[#080d1a] rounded-lg border border-[#1e293b] flex items-center px-1 shadow-[inset_0_3px_6px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.08)] cursor-pointer overflow-hidden group"
             id="${id}-track"
             onclick="window.handleTitanSliderClick && window.handleTitanSliderClick(event, '${id}', ${min}, ${max}, '${unit}')">
            
            <!-- Inset Groove Channel -->
            <div class="absolute inset-x-2 h-2.5 bg-[#030712] rounded-full border border-[#111827] shadow-[inset_0_2px_4px_rgba(0,0,0,1)] flex items-center overflow-hidden">
                <!-- Glowing Fill Track -->
                <div class="h-full rounded-full transition-all duration-75"
                     id="${id}-fill"
                     style="width: ${percent}%; background: ${t.fill}; box-shadow: 0 0 10px ${t.glow};"></div>
            </div>

            <!-- Calibration Tick Lines -->
            ${ticks ? `
            <div class="absolute inset-x-3 inset-y-0 flex justify-between items-center pointer-events-none opacity-30">
                <span class="w-[1px] h-3 bg-slate-400"></span>
                <span class="w-[1px] h-1.5 bg-slate-500"></span>
                <span class="w-[1px] h-2 bg-slate-400"></span>
                <span class="w-[1px] h-1.5 bg-slate-500"></span>
                <span class="w-[1px] h-4 bg-cyan-400"></span>
                <span class="w-[1px] h-1.5 bg-slate-500"></span>
                <span class="w-[1px] h-2 bg-slate-400"></span>
                <span class="w-[1px] h-1.5 bg-slate-500"></span>
                <span class="w-[1px] h-3 bg-slate-400"></span>
            </div>` : ''}

            <!-- 3D Brushed Metallic Fader Thumb / Handle -->
            <div class="absolute h-6 w-5 rounded-[4px] bg-gradient-to-b from-[#475569] via-[#1e293b] to-[#0f172a] border border-[#64748b]/60 shadow-[0_4px_10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4),0_0_0_1px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-transform group-hover:scale-105"
                 id="${id}-thumb"
                 style="left: calc(${percent}% - 10px); z-index: 10;">
                
                <!-- Metallic Ridges (Grip Lines) -->
                <div class="w-2.5 h-[1.5px] bg-[#94a3b8]/40 mb-[2px] rounded-full shadow-[0_1px_0_rgba(0,0,0,0.8)]"></div>
                <div class="w-2.5 h-[1.5px] bg-[#94a3b8]/40 mb-[2px] rounded-full shadow-[0_1px_0_rgba(0,0,0,0.8)]"></div>
                
                <!-- Vertical Neon Center Notch Indicator -->
                <div class="w-[2px] h-2.5 rounded-full" style="background: ${t.led}; box-shadow: 0 0 6px ${t.glow};"></div>
            </div>

            <!-- Hidden Standard Range for Accessibility & Drag Events -->
            <input type="range" min="${min}" max="${max}" value="${value}" 
                   class="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                   oninput="window.updateTitanSlider && window.updateTitanSlider(this, '${id}', '${unit}')" />
        </div>
    </div>`;
}

module.exports = { renderTitan3DSlider, Titan3DSlider: renderTitan3DSlider };