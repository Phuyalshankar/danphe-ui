'use strict';

/**
 * 🐬 TITAN SVG VFX & POWER EFFECTS STUDIO CARD (<TitanSvgEffectCard />)
 * Silicon-Grade Pure Vector 360x560px Visual Effects & Power Shaders Card
 * Powered by Danphe 256 VFX Shaders, Superman Laser, Fire & 16-Bit Register Micro-Bus
 * 
 * Target Dimensions: 360 x 560 px
 * Register Mappings:
 * - VFX_OPCODE    (0x4140): 0 to 255 (256 Super-Power Shaders)
 * - VFX_INTENSITY (0x4141): 20% to 200% (Glow & Bloom)
 * - VFX_RADIUS    (0x4142): 4px to 48px (Stroke Width)
 * - VFX_SPEED     (0x4143): 0.2x to 3.0x (Turbulence)
 */

const { EFFECTS_256, getEffectFromOpcode } = require('../effects/index.js');

function renderTitanSvgEffectCard(options = {}) {
    const {
        id = 'titan-svg-effect-card',
        effectOpcode = 32, // 0x20 Superman Heat Vision by default
        intensity = 100,
        strokeWidth = 16,
        isPenMode = true,
        activeTab = 'vfx',
        isFrameMode = true
    } = options;

    const currentVfx = getEffectFromOpcode(effectOpcode);
    const hexOpcode = '0x' + (effectOpcode || 0).toString(16).toUpperCase().padStart(2, '0');

    return `
<svg id="${id}" viewBox="0 0 360 560" width="360" height="560" class="select-none overflow-visible block" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <!-- Gradients -->
        <linearGradient id="${id}-chassis-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e293b" />
            <stop offset="25%" stop-color="#0f172a" />
            <stop offset="70%" stop-color="#020617" />
            <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>

        <linearGradient id="${id}-bezel-edge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ef4444" stop-opacity="0.7" />
            <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.6" />
        </linearGradient>

        <linearGradient id="${id}-oled-viewport-bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#030712" />
            <stop offset="100%" stop-color="#090d16" />
        </linearGradient>

        <linearGradient id="${id}-red-glow-track" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ef4444" />
            <stop offset="50%" stop-color="#f59e0b" />
            <stop offset="100%" stop-color="#ec4899" />
        </linearGradient>

        <linearGradient id="${id}-cyan-glow-track" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#06b6d4" />
            <stop offset="100%" stop-color="#3b82f6" />
        </linearGradient>

        <linearGradient id="${id}-slider-groove" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#020617" />
            <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>

        <radialGradient id="${id}-touch-knob" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="45%" stop-color="#cbd5e1" />
            <stop offset="85%" stop-color="#475569" />
            <stop offset="100%" stop-color="#1e293b" />
        </radialGradient>

        <!-- Filters -->
        <filter id="${id}-glow-vfx" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>

        <filter id="${id}-shadow-card" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.85" />
        </filter>
    </defs>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 1: TITANIUM HARDWARE CHASSIS (360x560px)
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-chassis-group">
        <rect id="${id}-outer-chassis" x="0" y="0" width="360" height="560" rx="38" fill="url(#${id}-chassis-metal)" filter="url(#${id}-shadow-card)" style="display: ${isFrameMode ? 'block' : 'none'};" />
        <rect id="${id}-bezel" x="3" y="3" width="354" height="554" rx="36" fill="none" stroke="url(#${id}-bezel-edge)" stroke-width="1.8" style="display: ${isFrameMode ? 'block' : 'none'};" />
        <rect id="${id}-screen-glass" x="8" y="8" width="344" height="544" rx="30" fill="#050811" />
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 2: TOP HEADER & DYNAMIC TELEMETRY ISLAND
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-header-group" transform="translate(18, 14)">
        <rect x="74" y="0" width="176" height="20" rx="10" fill="#000000" stroke="#1e293b" stroke-width="1" />
        <circle cx="90" cy="10" r="3.5" fill="#ef4444" filter="url(#${id}-glow-vfx)" />
        <text id="${id}-oled-status-text" x="168" y="13.5" font-size="8.5" font-family="'JetBrains Mono', monospace" font-weight="900" fill="#fca5a5" text-anchor="middle" letter-spacing="0.5">VFX STUDIO • 256 SHADERS</text>

        <text x="2" y="34" font-size="10.5" font-family="'JetBrains Mono', monospace" font-weight="900" fill="#ffffff" letter-spacing="0.8">💥 TITAN VFX & POWER STUDIO</text>
        
        <g id="${id}-btn-toggle-frame" class="cursor-pointer" transform="translate(268, 22)" onclick="toggleVfxFrameMode('${id}')">
            <rect x="0" y="0" width="56" height="15" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1" />
            <text x="28" y="10.5" font-size="7.5" font-family="'JetBrains Mono', monospace" font-weight="800" fill="#94a3b8" text-anchor="middle">MODE</text>
        </g>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 3: TOP 16:9 OLED LIVE VFX VIEWPORT (324 x 114px)
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-viewport-group" transform="translate(18, 54)">
        <rect x="0" y="0" width="324" height="114" rx="14" fill="url(#${id}-oled-viewport-bg)" stroke="#1e293b" stroke-width="1.4" />
        
        <!-- Live Curved Power Laser / Fire Stroke SVG Preview -->
        <g id="${id}-live-vfx-stage">
            <!-- Ambient Outer Halo -->
            <path id="${id}-vfx-halo" d="M 30 75 Q 162 10 294 75" fill="none" stroke="${currentVfx.color1}" stroke-width="${strokeWidth * 2}" stroke-linecap="round" opacity="0.4" filter="url(#${id}-glow-vfx)" />
            <!-- Mid High-Voltage Arc -->
            <path id="${id}-vfx-arc" d="M 30 75 Q 162 10 294 75" fill="none" stroke="${currentVfx.color3}" stroke-width="${strokeWidth}" stroke-linecap="round" opacity="0.8" />
            <!-- White Hot Plasma Core -->
            <path id="${id}-vfx-core" d="M 30 75 Q 162 10 294 75" fill="none" stroke="${currentVfx.color2}" stroke-width="${Math.max(3, strokeWidth * 0.4)}" stroke-linecap="round" filter="url(#${id}-glow-vfx)" />
        </g>

        <!-- Viewport HUD Overlay Badges -->
        <g transform="translate(8, 8)">
            <rect x="0" y="0" width="140" height="15" rx="4" fill="#000000" fill-opacity="0.8" stroke="#334155" stroke-width="0.8" />
            <text id="${id}-hud-vfxname" x="70" y="10.5" font-size="8" font-family="'JetBrains Mono', monospace" font-weight="900" fill="#f87171" text-anchor="middle">${currentVfx.name.slice(0, 20)}</text>
        </g>

        <g transform="translate(230, 8)">
            <rect x="0" y="0" width="86" height="15" rx="4" fill="#000000" fill-opacity="0.8" stroke="#ef4444" stroke-width="0.8" />
            <text id="${id}-hud-opcode" x="43" y="10.5" font-size="8" font-family="'JetBrains Mono', monospace" font-weight="900" fill="#fca5a5" text-anchor="middle">OPCODE ${hexOpcode}</text>
        </g>

        <g transform="translate(8, 92)">
            <rect x="0" y="0" width="130" height="14" rx="4" fill="#000000" fill-opacity="0.8" stroke="#1e293b" stroke-width="0.8" />
            <text id="${id}-hud-specs" x="65" y="10" font-size="7.5" font-family="'JetBrains Mono', monospace" font-weight="800" fill="#94a3b8" text-anchor="middle">GLOW: ${intensity}% | W: ${strokeWidth}px</text>
        </g>

        <g transform="translate(254, 92)">
            <rect x="0" y="0" width="62" height="14" rx="4" fill="#1a0606" stroke="#991b1b" stroke-width="0.8" />
            <text x="31" y="10" font-size="7.5" font-family="'JetBrains Mono', monospace" font-weight="900" fill="#f87171" text-anchor="middle">120 FPS</text>
        </g>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 4: CANVAS LIVE PEN DRAWING MODE TOGGLE CAPSULE
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-pen-toggle-group" transform="translate(18, 175)" class="cursor-pointer" onclick="toggleCanvasPenMode('${id}')">
        <rect id="${id}-pen-mode-bg" x="0" y="0" width="324" height="24" rx="7" fill="${isPenMode ? '#450a0a' : '#090d16'}" stroke="${isPenMode ? '#ef4444' : '#334155'}" stroke-width="1.2" />
        <circle id="${id}-pen-mode-dot" cx="16" cy="12" r="4" fill="${isPenMode ? '#ef4444' : '#64748b'}" filter="url(#${id}-glow-vfx)" />
        <text id="${id}-pen-mode-txt" x="162" y="15.5" font-size="9" font-family="'JetBrains Mono', monospace" font-weight="900" fill="${isPenMode ? '#fee2e2' : '#94a3b8'}" text-anchor="middle" letter-spacing="0.5">
            🖌️ LIVE CANVAS POWER PEN: ${isPenMode ? 'ACTIVE (DRAW ANYWHERE ON CANVAS)' : 'STANDBY'}
        </text>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 5: 2 PRECISION TACTILE SLIDERS WITH 24px STEPPERS
    ══════════════════════════════════════════════════════════════════════════ -->

    <!-- ── SLIDER 1: VFX POWER SHADER OPCODE (0 - 255) ── -->
    <g id="${id}-slider-opcode-group" transform="translate(18, 210)">
        <text id="${id}-lbl-vfx" x="2" y="10" font-size="9.5" font-weight="900" fill="#ef4444" letter-spacing="0.5">1. VFX POWER SHADER (${effectOpcode})</text>
        
        <g transform="translate(170, -2)">
            <rect x="0" y="0" width="154" height="16" rx="4" fill="#450a0a" stroke="#ef4444" stroke-width="1" />
            <text id="${id}-badge-vfx" x="77" y="11.5" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle">REG 0x4140 (${hexOpcode})</text>
        </g>

        <!-- Controls Row -->
        <g transform="translate(0, 16)">
            <!-- [ ◀ ] -->
            <g class="cursor-pointer" onclick="stepVfxChannel('${id}', 'opcode', -1)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M14 8L10 12L14 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- Touch Track (204px) -->
            <g transform="translate(29, 0)">
                <rect x="0" y="0" width="204" height="24" rx="6" fill="#090d16" stroke="#334155" stroke-width="1.2" />
                <rect x="6" y="9" width="192" height="6" rx="3" fill="url(#${id}-slider-groove)" stroke="#090d14" stroke-width="0.8" />
                <rect id="${id}-fill-vfx" x="7" y="10" width="${Math.max(6, (effectOpcode / 255) * 190)}" height="4" rx="2" fill="#ef4444" filter="url(#${id}-glow-vfx)" />
                <g id="${id}-knob-vfx" transform="translate(${7 + (effectOpcode / 255) * 190}, 12)" cursor="ew-resize" pointer-events="none">
                    <circle cx="0" cy="0" r="8.5" fill="url(#${id}-touch-knob)" stroke="#f87171" stroke-width="1.3" />
                    <circle cx="0" cy="0" r="3.2" fill="#ef4444" filter="url(#${id}-glow-vfx)" />
                </g>
                <rect id="${id}-hit-vfx" x="0" y="0" width="204" height="24" rx="6" fill="#000000" fill-opacity="0.001" pointer-events="all" cursor="ew-resize" />
            </g>

            <!-- [ ▶ ] -->
            <g class="cursor-pointer" transform="translate(238, 0)" onclick="stepVfxChannel('${id}', 'opcode', 1)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M10 8L14 12L10 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- [ 032 ] -->
            <g transform="translate(266, 0)">
                <rect x="0" y="0" width="58" height="24" rx="6" fill="#450a0a" stroke="#ef4444" stroke-width="1.2" />
                <text id="${id}-val-vfx" x="29" y="16.5" font-size="11" font-weight="900" fill="#fca5a5" text-anchor="middle" letter-spacing="0.5">${effectOpcode.toString().padStart(3, '0')}</text>
            </g>
        </g>
    </g>

    <!-- ── SLIDER 2: ENERGY INTENSITY & GLOW (20% - 200%) ── -->
    <g id="${id}-slider-intensity-group" transform="translate(18, 262)">
        <text id="${id}-lbl-intensity" x="2" y="10" font-size="9.5" font-weight="900" fill="#f59e0b" letter-spacing="0.5">2. ENERGY INTENSITY & BLOOM (${intensity}%)</text>
        
        <g transform="translate(170, -2)">
            <rect x="0" y="0" width="154" height="16" rx="4" fill="#3b2204" stroke="#f59e0b" stroke-width="1" />
            <text id="${id}-badge-intensity" x="77" y="11.5" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle">REG 0x4141 (GLOW)</text>
        </g>

        <!-- Controls Row -->
        <g transform="translate(0, 16)">
            <!-- [ ◀ ] -->
            <g class="cursor-pointer" onclick="stepVfxChannel('${id}', 'intensity', -5)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M14 8L10 12L14 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- Touch Track (204px) -->
            <g transform="translate(29, 0)">
                <rect x="0" y="0" width="204" height="24" rx="6" fill="#090d16" stroke="#334155" stroke-width="1.2" />
                <rect x="6" y="9" width="192" height="6" rx="3" fill="url(#${id}-slider-groove)" stroke="#090d14" stroke-width="0.8" />
                <rect id="${id}-fill-intensity" x="7" y="10" width="${Math.max(6, ((intensity - 20) / 180) * 190)}" height="4" rx="2" fill="#f59e0b" filter="url(#${id}-glow-vfx)" />
                <g id="${id}-knob-intensity" transform="translate(${7 + ((intensity - 20) / 180) * 190}, 12)" cursor="ew-resize" pointer-events="none">
                    <circle cx="0" cy="0" r="8.5" fill="url(#${id}-touch-knob)" stroke="#fbbf24" stroke-width="1.3" />
                    <circle cx="0" cy="0" r="3.2" fill="#f59e0b" filter="url(#${id}-glow-vfx)" />
                </g>
                <rect id="${id}-hit-intensity" x="0" y="0" width="204" height="24" rx="6" fill="#000000" fill-opacity="0.001" pointer-events="all" cursor="ew-resize" />
            </g>

            <!-- [ ▶ ] -->
            <g class="cursor-pointer" transform="translate(238, 0)" onclick="stepVfxChannel('${id}', 'intensity', 5)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M10 8L14 12L10 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- [ 100% ] -->
            <g transform="translate(266, 0)">
                <rect x="0" y="0" width="58" height="24" rx="6" fill="#3b2204" stroke="#f59e0b" stroke-width="1.2" />
                <text id="${id}-val-intensity" x="29" y="16.5" font-size="11" font-weight="900" fill="#fbbf24" text-anchor="middle" letter-spacing="0.5">${intensity}%</text>
            </g>
        </g>
    </g>

    <!-- ── SLIDER 3: STROKE WIDTH & RADIUS (4px - 48px) ── -->
    <g id="${id}-slider-width-group" transform="translate(18, 314)">
        <text id="${id}-lbl-width" x="2" y="10" font-size="9.5" font-weight="900" fill="#38bdf8" letter-spacing="0.5">3. STROKE WIDTH & RADIUS (${strokeWidth}px)</text>
        
        <g transform="translate(170, -2)">
            <rect x="0" y="0" width="154" height="16" rx="4" fill="#082f49" stroke="#0284c7" stroke-width="1" />
            <text id="${id}-badge-width" x="77" y="11.5" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle">REG 0x4142 (RADIUS)</text>
        </g>

        <!-- Controls Row -->
        <g transform="translate(0, 16)">
            <!-- [ ◀ ] -->
            <g class="cursor-pointer" onclick="stepVfxChannel('${id}', 'width', -2)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M14 8L10 12L14 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- Touch Track (204px) -->
            <g transform="translate(29, 0)">
                <rect x="0" y="0" width="204" height="24" rx="6" fill="#090d16" stroke="#334155" stroke-width="1.2" />
                <rect x="6" y="9" width="192" height="6" rx="3" fill="url(#${id}-slider-groove)" stroke="#090d14" stroke-width="0.8" />
                <rect id="${id}-fill-width" x="7" y="10" width="${Math.max(6, ((strokeWidth - 4) / 44) * 190)}" height="4" rx="2" fill="#0284c7" filter="url(#${id}-glow-vfx)" />
                <g id="${id}-knob-width" transform="translate(${7 + ((strokeWidth - 4) / 44) * 190}, 12)" cursor="ew-resize" pointer-events="none">
                    <circle cx="0" cy="0" r="8.5" fill="url(#${id}-touch-knob)" stroke="#38bdf8" stroke-width="1.3" />
                    <circle cx="0" cy="0" r="3.2" fill="#0284c7" filter="url(#${id}-glow-vfx)" />
                </g>
                <rect id="${id}-hit-width" x="0" y="0" width="204" height="24" rx="6" fill="#000000" fill-opacity="0.001" pointer-events="all" cursor="ew-resize" />
            </g>

            <!-- [ ▶ ] -->
            <g class="cursor-pointer" transform="translate(238, 0)" onclick="stepVfxChannel('${id}', 'width', 2)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M10 8L14 12L10 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- [ 16px ] -->
            <g transform="translate(266, 0)">
                <rect x="0" y="0" width="58" height="24" rx="6" fill="#082f49" stroke="#0284c7" stroke-width="1.2" />
                <text id="${id}-val-width" x="29" y="16.5" font-size="11" font-weight="900" fill="#38bdf8" text-anchor="middle" letter-spacing="0.5">${strokeWidth}px</text>
            </g>
        </g>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 6: 8 QUICK VFX SECTOR JUMP CHIPS
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-quick-sectors" transform="translate(18, 362)">
        <rect x="0" y="0" width="324" height="38" rx="8" fill="#060913" stroke="#1e293b" stroke-width="1" />
        
        <!-- Row 1: 4 Quick Sector Chips (74 x 13px each) -->
        <g transform="translate(6, 6)">
            <g onclick="jumpVfxOpcode('${id}', 0, 'Fire Inferno')" style="cursor:pointer;">
                <rect x="0" y="0" width="74" height="12" rx="3" fill="#450a0a" stroke="#ef4444" stroke-width="0.8" />
                <text x="37" y="9" text-anchor="middle" fill="#f87171" font-size="7" font-weight="900">🔥 FIRE (0x00)</text>
            </g>
            <g onclick="jumpVfxOpcode('${id}', 32, 'Superman Laser')" style="cursor:pointer;" transform="translate(79, 0)">
                <rect x="0" y="0" width="74" height="12" rx="3" fill="#082f49" stroke="#38bdf8" stroke-width="0.8" />
                <text x="37" y="9" text-anchor="middle" fill="#38bdf8" font-size="7" font-weight="900">⚡ LASER (0x20)</text>
            </g>
            <g onclick="jumpVfxOpcode('${id}', 64, 'Cosmic Plasma')" style="cursor:pointer;" transform="translate(158, 0)">
                <rect x="0" y="0" width="74" height="12" rx="3" fill="#3b0764" stroke="#c084fc" stroke-width="0.8" />
                <text x="37" y="9" text-anchor="middle" fill="#e9d5ff" font-size="7" font-weight="900">💥 PLASMA (0x40)</text>
            </g>
            <g onclick="jumpVfxOpcode('${id}', 96, 'Quantum Portal')" style="cursor:pointer;" transform="translate(237, 0)">
                <rect x="0" y="0" width="74" height="12" rx="3" fill="#3b2204" stroke="#f59e0b" stroke-width="0.8" />
                <text x="37" y="9" text-anchor="middle" fill="#fbbf24" font-size="7" font-weight="900">🌌 PORTAL (0x60)</text>
            </g>
        </g>

        <!-- Row 2: 4 Quick Sector Chips (74 x 13px each) -->
        <g transform="translate(6, 21)">
            <g onclick="jumpVfxOpcode('${id}', 128, 'Cryo Frost')" style="cursor:pointer;">
                <rect x="0" y="0" width="74" height="12" rx="3" fill="#083344" stroke="#06b6d4" stroke-width="0.8" />
                <text x="37" y="9" text-anchor="middle" fill="#67e8f9" font-size="7" font-weight="900">❄️ FROST (0x80)</text>
            </g>
            <g onclick="jumpVfxOpcode('${id}', 160, 'Celestial Magic')" style="cursor:pointer;" transform="translate(79, 0)">
                <rect x="0" y="0" width="74" height="12" rx="3" fill="#831843" stroke="#f472b6" stroke-width="0.8" />
                <text x="37" y="9" text-anchor="middle" fill="#fbcfe8" font-size="7" font-weight="900">✨ MAGIC (0xA0)</text>
            </g>
            <g onclick="jumpVfxOpcode('${id}', 192, 'Cyberpunk Neon')" style="cursor:pointer;" transform="translate(158, 0)">
                <rect x="0" y="0" width="74" height="12" rx="3" fill="#064e3b" stroke="#10b981" stroke-width="0.8" />
                <text x="37" y="9" text-anchor="middle" fill="#6ee7b7" font-size="7" font-weight="900">🧪 NEON (0xC0)</text>
            </g>
            <g onclick="jumpVfxOpcode('${id}', 224, 'Forcefield Shield')" style="cursor:pointer;" transform="translate(237, 0)">
                <rect x="0" y="0" width="74" height="12" rx="3" fill="#1e1b4b" stroke="#6366f1" stroke-width="0.8" />
                <text x="37" y="9" text-anchor="middle" fill="#a5b4fc" font-size="7" font-weight="900">🛡️ SHIELD (0xE0)</text>
            </g>
        </g>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 7: 6 SPACIOUS 70px WIDE BOTTOM DOCK TABS
    ══════════════════════════════════════════════════════════════════════════ -->
    <!-- Scroll Arrow Left -->
    <g class="cursor-pointer" transform="translate(2, 410)" onclick="scrollVfxTabsLeft('${id}')">
        <rect x="0" y="0" width="16" height="58" rx="4" fill="#090d16" fill-opacity="0.9" stroke="#1e293b" stroke-width="1" />
        <path d="M10 24 L5 29 L10 34" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    </g>

    <!-- Scroll Arrow Right -->
    <g class="cursor-pointer" transform="translate(342, 410)" onclick="scrollVfxTabsRight('${id}')">
        <rect x="0" y="0" width="16" height="58" rx="4" fill="#090d16" fill-opacity="0.9" stroke="#1e293b" stroke-width="1" />
        <path d="M6 24 L11 29 L6 34" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    </g>

    <g id="${id}-bottom-tabs-dock" transform="translate(20, 410)">
        <foreignObject x="0" y="0" width="320" height="58">
            <div xmlns="http://www.w3.org/1999/xhtml" id="${id}-tabs-viewport" 
                 style="display:flex; align-items:center; gap:6px; width:100%; height:100%; overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none; box-sizing:border-box; padding-bottom:4px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <!-- Tab 1: ⚡ ANIM -->
                <button type="button" id="${id}-tab-anim" onclick="switchVfxTab('${id}', 'anim')"
                        style="flex-shrink:0; width:70px; height:58px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:16px; line-height:1;">⚡</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#38bdf8;">ANIM</span>
                </button>

                <!-- Tab 2: 📐 TRANSFORM -->
                <button type="button" id="${id}-tab-transform" onclick="switchVfxTab('${id}', 'transform')"
                        style="flex-shrink:0; width:70px; height:58px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:16px; line-height:1;">📐</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#fbbf24;">TRANSFORM</span>
                </button>

                <!-- Tab 3: 🎨 COLOR -->
                <button type="button" id="${id}-tab-color" onclick="switchVfxTab('${id}', 'color')"
                        style="flex-shrink:0; width:70px; height:58px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:16px; line-height:1;">🎨</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#f472b6;">COLOR</span>
                </button>

                <!-- Tab 4: 🔤 TYPO -->
                <button type="button" id="${id}-tab-typo" onclick="switchVfxTab('${id}', 'typo')"
                        style="flex-shrink:0; width:70px; height:58px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:16px; line-height:1;">🔤</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#fde047;">TYPO</span>
                </button>

                <!-- Tab 5: 💥 VFX (ACTIVE) -->
                <button type="button" id="${id}-tab-vfx" onclick="switchVfxTab('${id}', 'vfx')"
                        style="flex-shrink:0; width:70px; height:58px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:10px; background:#450a0a; border:2px solid #ef4444; box-shadow:0 0 12px rgba(239,68,68,0.5); cursor:pointer; color:#ffffff;">
                    <span style="font-size:16px; line-height:1;">💥</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#f87171;">VFX</span>
                </button>

                <!-- Tab 6: 🖼️ THUMB -->
                <button type="button" id="${id}-tab-thumb" onclick="switchVfxTab('${id}', 'thumb')"
                        style="flex-shrink:0; width:70px; height:58px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:16px; line-height:1;">🖼️</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#a855f7;">THUMB</span>
                </button>

            </div>
        </foreignObject>
    </g>

    <!-- Home Indicator Bar -->
    <rect x="120" y="474" width="120" height="4" rx="2" fill="#475569" opacity="0.6" />
</svg>
`;
}

module.exports = {
    renderTitanSvgEffectCard,
    TitanSvgEffectCard: renderTitanSvgEffectCard
};
