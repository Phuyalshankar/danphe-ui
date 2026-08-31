'use strict';

const { renderAdaptiveIconSVG } = require('./TitanAdaptiveIcon');

/**
 * 🦚 TitanCircularButtonGroup (Titan Opcode 0x2A / Register 1040)
 * ─────────────────────────────────────────────────────────────
 * Multi-Platform Reusable 360° Radial Gyro Button Group Component
 * Sized & Scaled smoothly via Clean CSS (`.titan-circular-button-group`)
 */
function renderTitanCircularButtonGroup({
    id = 'titan-circular-group-' + Math.random().toString(36).substring(2, 7),
    size = 'sm',             // 'xs' | 'sm' (Compact CSS) | 'md' | 'lg'
    variant = 'cyber',       // 'cyber' | 'titanium' | 'minimal' | 'glass'
    orbitAnimation = true,   // 360° Rotating Laser Ring
    center = {
        icon: 128,           // Play icon
        activeIcon: 129,     // Pause icon
        label: 'Play',
        activeLabel: 'Pause',
        color: '#38bdf8',
        activeColor: '#ef4444',
        action: 'bus:circular:center'
    },
    nodes = [
        { position: 'top', icon: 4, label: 'Video', color: '#38bdf8', bg: '#0284c7', action: 'bus:circular:top', tooltip: 'Import Video' },
        { position: 'left', icon: 138, label: 'Photo', color: '#c084fc', bg: '#7c3aed', action: 'bus:circular:left', tooltip: 'Import Photos' },
        { position: 'right', icon: 148, label: 'Audio', color: '#34d399', bg: '#059669', action: 'bus:circular:right', tooltip: 'Import Audio' },
        { position: 'bottom', icon: 302, label: 'FX / AI', color: '#facc15', bg: '#d97706', action: 'bus:circular:bottom', tooltip: 'GPU Shaders & FX' }
    ],
    className = ''
} = {}) {
    const dimMap = {
        xs: { w: 180, h: 180, orbitR: 52, nodeS: 34, coreS: 44, iconS: 15, coreIconS: 18, cssScale: 'scale-[0.75]' },
        sm: { w: 220, h: 220, orbitR: 64, nodeS: 40, coreS: 52, iconS: 18, coreIconS: 22, cssScale: 'scale-[0.85]' },
        md: { w: 260, h: 260, orbitR: 78, nodeS: 46, coreS: 62, iconS: 20, coreIconS: 25, cssScale: 'scale-100' },
        lg: { w: 300, h: 300, orbitR: 92, nodeS: 54, coreS: 72, iconS: 22, coreIconS: 28, cssScale: 'scale-110' }
    };
    const d = dimMap[size] || dimMap.sm;

    const nodeCoords = {
        top: { top: `${d.h / 2 - d.orbitR - d.nodeS / 2}px`, left: `${d.w / 2 - d.nodeS / 2}px` },
        left: { top: `${d.h / 2 - d.nodeS / 2}px`, left: `${d.w / 2 - d.orbitR - d.nodeS / 2}px` },
        right: { top: `${d.h / 2 - d.nodeS / 2}px`, left: `${d.w / 2 + d.orbitR - d.nodeS / 2}px` },
        bottom: { top: `${d.h / 2 + d.orbitR - d.nodeS / 2}px`, left: `${d.w / 2 - d.nodeS / 2}px` }
    };

    const centerSvg = typeof center.icon === 'number' || typeof center.icon === 'string'
        ? renderAdaptiveIconSVG(center.icon, 0, d.coreIconS, false)
        : '▶';

    const nodesHtml = nodes.map((n, idx) => {
        const coords = nodeCoords[n.position || 'top'] || nodeCoords.top;
        const iconSvg = typeof n.icon === 'number' || typeof n.icon === 'string'
            ? renderAdaptiveIconSVG(n.icon, 0, d.iconS, false)
            : '⚡';

        return `
        <!-- Satellite Node: ${n.label || n.position} -->
        <button type="button"
                id="${id}-node-${idx}"
                data-action="${n.action || ''}"
                data-tooltip="${n.tooltip || n.label || ''}"
                title="${n.tooltip || n.label || ''}"
                onclick="if(window.TitanBus) window.TitanBus.send('${n.action || 'bus:circular:action'}', '${n.label || ''}'); if(typeof onCircularNodeClick==='function') onCircularNodeClick('${n.action}', '${n.label}');"
                class="absolute rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-115 active:scale-95 shadow-md group z-10"
                style="width: ${d.nodeS}px; height: ${d.nodeS}px; top: ${coords.top}; left: ${coords.left}; background: radial-gradient(circle at 35% 35%, ${n.bg || '#0284c7'}44, #0b1329 80%); border: 1.6px solid ${n.color || '#38bdf8'}; color: ${n.color || '#38bdf8'}; box-shadow: 0 0 12px ${n.color || '#38bdf8'}33;">
            <div class="transition-transform group-hover:scale-110 flex items-center justify-center">
                ${iconSvg}
            </div>
            <!-- Pure Floating CSS Tooltip -->
            <span class="absolute -top-7 px-2 py-0.5 bg-slate-900/95 border border-cyan-500/60 text-cyan-300 font-mono text-[9px] font-bold rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                ${n.tooltip || n.label || ''}
            </span>
        </button>`;
    }).join('');

    return `
    <!-- 🦚 TITAN CIRCULAR BUTTON GROUP (PURE CSS SIZING & SCALING) -->
    <div id="${id}" class="titan-circular-button-group relative flex items-center justify-center select-none origin-center transition-transform duration-200 ${className}" style="width: ${d.w}px; height: ${d.h}px;">
        
        <!-- 360° Laser Orbit Ring -->
        ${orbitAnimation ? `
        <div class="absolute rounded-full border-[1.5px] border-dashed border-cyan-400/40 pointer-events-none animate-[spin_25s_linear_infinite]" 
             style="width: ${d.orbitR * 2 + d.nodeS}px; height: ${d.orbitR * 2 + d.nodeS}px;"></div>` : ''}

        <!-- Inner Gyro Ring -->
        <div class="absolute rounded-full border border-slate-800 pointer-events-none shadow-[0_0_20px_rgba(56,189,248,0.15)]"
             style="width: ${d.orbitR * 2}px; height: ${d.orbitR * 2}px;"></div>

        <!-- Satellite Nodes -->
        ${nodesHtml}

        <!-- Center Titanium Master Reactor Core -->
        <button type="button"
                id="${id}-core"
                data-action="${center.action || ''}"
                title="${center.label || 'Play/Pause'}"
                onclick="toggleTitanCircularCore('${id}'); if(window.TitanBus) window.TitanBus.send('${center.action || 'bus:circular:core'}', 'toggle');"
                class="rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 z-20 shadow-[0_0_20px_rgba(56,189,248,0.5)] group"
                style="width: ${d.coreS}px; height: ${d.coreS}px; background: radial-gradient(circle at 35% 35%, #0284c7, #03365c 65%, #08101e 100%); border: 1.8px solid ${center.color || '#38bdf8'}; color: #ffffff;">
            <div id="${id}-core-icon" class="flex items-center justify-center transition-transform group-hover:scale-110">
                ${centerSvg}
            </div>
        </button>
    </div>

    <script>
        if (!window.toggleTitanCircularCore) {
            window.toggleTitanCircularCore = function(groupId) {
                const core = document.getElementById(groupId + '-core');
                if (!core) return;
                const isPlaying = core.getAttribute('data-active') === 'true';
                if (!isPlaying) {
                    core.setAttribute('data-active', 'true');
                    core.style.background = 'radial-gradient(circle at 35% 35%, #ef4444, #7f1d1d 65%, #08101e 100%)';
                    core.style.borderColor = '#f87171';
                    core.style.boxShadow = '0 0 30px rgba(239,68,68,0.85)';
                } else {
                    core.setAttribute('data-active', 'false');
                    core.style.background = 'radial-gradient(circle at 35% 35%, #0284c7, #03365c 65%, #08101e 100%)';
                    core.style.borderColor = '#38bdf8';
                    core.style.boxShadow = '0 0 20px rgba(56,189,248,0.5)';
                }
            };
        }
    </script>`;
}

module.exports = {
    renderTitanCircularButtonGroup,
    TitanCircularButtonGroup: renderTitanCircularButtonGroup,
    CircularButtonGroup: renderTitanCircularButtonGroup
};
