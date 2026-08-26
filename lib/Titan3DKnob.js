'use strict';

/**
 * 🎛️ Titan3DKnob (danphe-ui)
 * Studio Hardware 3D Knurled Aluminum Rotary Potentiometer with Radial Glow Arc & Drag Physics
 */

function renderTitan3DKnob({
    id = 'knob-' + Math.random().toString(36).substr(2, 9),
    label = 'Gain',
    min = -60,
    max = 12,
    value = 0,
    unit = 'dB',
    theme = 'cyan', // 'cyan', 'emerald', 'amber', 'purple'
    size = 54 // pixel diameter
} = {}) {
    const themeColors = {
        cyan: { led: '#22d3ee', glow: 'rgba(34, 211, 238, 0.6)', border: '#0284c7' },
        emerald: { led: '#10b981', glow: 'rgba(16, 185, 129, 0.6)', border: '#047857' },
        amber: { led: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)', border: '#b45309' },
        purple: { led: '#c084fc', glow: 'rgba(192, 132, 252, 0.6)', border: '#7e22ce' }
    };
    const t = themeColors[theme] || themeColors.cyan;

    // Angle maps from -135deg (min) to +135deg (max) => 270 deg range
    const percent = Math.min(1, Math.max(0, (value - min) / (max - min)));
    const angle = -135 + (percent * 270);

    return `
    <div class="titan-3d-knob-root flex flex-col items-center gap-1.5 user-select-none font-mono" id="${id}-wrapper">
        <!-- 3D Outer Beveled Potentiometer Ring -->
        <div class="relative rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_8px_20px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.15)] group"
             id="${id}"
             style="width: ${size}px; height: ${size}px; background: radial-gradient(circle at 30% 30%, #334155 0%, #0f172a 70%, #020617 100%); border: 2px solid ${t.border};"
             data-min="${min}" data-max="${max}" data-value="${value}" data-unit="${unit}"
             onmousedown="window.initTitanKnobDrag && window.initTitanKnobDrag(event, '${id}', ${min}, ${max}, '${unit}')">
            
            <!-- Circular Outer Knurled Grip Texture -->
            <div class="absolute inset-1 rounded-full border border-slate-700/60 opacity-60 pointer-events-none"></div>

            <!-- Concentric Brushed Aluminum Cap -->
            <div class="w-3/4 h-3/4 rounded-full bg-gradient-to-tr from-[#0b1120] via-[#1e293b] to-[#334155] border border-white/20 flex items-center justify-center shadow-[inset_0_2px_3px_rgba(255,255,255,0.3),0_4px_8px_rgba(0,0,0,0.9)] transition-transform"
                 id="${id}-cap"
                 style="transform: rotate(${angle}deg);">
                
                <!-- Glowing Radial Pointer Needle -->
                <div class="absolute top-1 w-[2.5px] h-3 rounded-full"
                     style="background: ${t.led}; box-shadow: 0 0 8px ${t.glow};"></div>
            </div>

            <!-- Radial Halo Glow on Hover -->
            <div class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                 style="box-shadow: 0 0 15px ${t.glow};"></div>
        </div>

        <!-- Knob Telemetry Value & Label -->
        <span class="text-[10px] font-bold tracking-tight" id="${id}-val" style="color: ${t.led}; text-shadow: 0 0 6px ${t.glow};">
            ${value > 0 ? '+' : ''}${value} ${unit}
        </span>
        <span class="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            ${label}
        </span>
    </div>`;
}

module.exports = { renderTitan3DKnob, Titan3DKnob: renderTitan3DKnob };