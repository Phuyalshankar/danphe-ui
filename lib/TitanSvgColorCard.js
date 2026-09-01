'use strict';

/**
 * 🐬 TitanSvgColorCard (danphe-ui)
 * Flagship Titanium Universal Color & Gradient Studio Card (Width: 360px, Height: 560px)
 * 100% Pure Vector SVG • 256 Gradients & Shaders • 0ms titan-envent-bus Lumetri Integration
 */

function renderTitanSvgColorCard(options = {}) {
    const {
        id = 'titan-svg-color-card',
        activeMode = 'gradient',
        activeTab = 'gradient',
        opcode = 12,
        c1 = '#06b6d4',
        c2 = '#ec4899',
        c3 = '#8b5cf6',
        hex = '#06B6D4',
        rgb = '6, 182, 212',
        hsl = '189°, 94%, 43%',
        saturation = 100,
        brightness = 0,
        isFrameMode = true
    } = options;

    return `
<svg id="${id}" viewBox="0 0 360 560" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" 
     class="select-none filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.98)] w-full max-w-[360px] mx-auto"
     style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; text-rendering: geometricPrecision; -webkit-font-smoothing: antialiased;">
    <defs>
        <!-- ── 1. TITANIUM HARDWARE CHASSIS GRADIENTS ── -->
        <linearGradient id="${id}-titanium-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#cbd5e1" />
            <stop offset="20%" stop-color="#64748b" />
            <stop offset="50%" stop-color="#0f172a" />
            <stop offset="80%" stop-color="#1e293b" />
            <stop offset="100%" stop-color="#94a3b8" />
        </linearGradient>

        <linearGradient id="${id}-inner-bezel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#020617" />
            <stop offset="50%" stop-color="#040814" />
            <stop offset="100%" stop-color="#000000" />
        </linearGradient>

        <linearGradient id="${id}-glass-glare" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22" />
            <stop offset="25%" stop-color="#ffffff" stop-opacity="0.04" />
            <stop offset="50%" stop-color="#000000" stop-opacity="0" />
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.08" />
        </linearGradient>

        <linearGradient id="${id}-slider-groove" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#000000" stop-opacity="1" />
            <stop offset="100%" stop-color="#1e293b" stop-opacity="0.9" />
        </linearGradient>

        <linearGradient id="${id}-touch-knob" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f8fafc" />
            <stop offset="40%" stop-color="#cbd5e1" />
            <stop offset="100%" stop-color="#475569" />
        </linearGradient>

        <!-- ── 2. DYNAMIC LIVE OLED GRADIENT SHADER ── -->
        <linearGradient id="${id}-live-shader" x1="0" y1="0" x2="1" y2="1">
            <stop id="${id}-stop-c1" offset="0%" stop-color="${c1}" />
            <stop id="${id}-stop-c2" offset="50%" stop-color="${c2}" />
            <stop id="${id}-stop-c3" offset="100%" stop-color="${c3}" />
        </linearGradient>

        <linearGradient id="${id}-spectrum-hue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#ff0000" />
            <stop offset="16%" stop-color="#ffff00" />
            <stop offset="33%" stop-color="#00ff00" />
            <stop offset="50%" stop-color="#00ffff" />
            <stop offset="66%" stop-color="#0000ff" />
            <stop offset="83%" stop-color="#ff00ff" />
            <stop offset="100%" stop-color="#ff0000" />
        </linearGradient>

        <!-- ── 3. NEON LED GLOW FILTERS ── -->
        <filter id="${id}-glow-cyan" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
            <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>

        <filter id="${id}-glow-pink" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
            <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>

        <filter id="${id}-glow-amber" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
            <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>

        <clipPath id="${id}-screen-clip">
            <rect x="18" y="52" width="324" height="114" rx="14" />
        </clipPath>
    </defs>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 1: SMARTPHONE TITANIUM HARDWARE CHASSIS
    ══════════════════════════════════════════════════════════════════════════ -->
    <rect id="${id}-outer-chassis" x="3" y="3" width="354" height="554" rx="38" fill="url(#${id}-titanium-rim)" stroke="#090d16" stroke-width="2" />
    <rect id="${id}-bezel" x="7" y="7" width="346" height="546" rx="34" fill="url(#${id}-inner-bezel)" stroke="#334155" stroke-width="1.2" />

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 2: TOP STATUS BAR & HEADER
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-top-header">
        <rect x="135" y="14" width="90" height="16" rx="8" fill="#000000" stroke="#1e293b" stroke-width="1" />
        <circle cx="150" cy="22" r="3.5" fill="#030712" stroke="#1e293b" stroke-width="0.8" />
        <circle cx="150" cy="22" r="1.2" fill="#ec4899" opacity="0.9" />
        <circle cx="210" cy="22" r="2.2" fill="#10b981" filter="url(#${id}-glow-cyan)" />

        <text x="24" y="26" fill="#94a3b8" font-size="9.5" font-weight="900" letter-spacing="0.08em">DANPHE 4K</text>
        <text x="336" y="26" text-anchor="end" fill="#ec4899" font-size="9.5" font-weight="900" letter-spacing="0.08em">LUMETRI 10-BIT</text>
    </g>

    <!-- Header Title Bar & Frame Toggle -->
    <g id="${id}-title-bar" transform="translate(18, 30)">
        <rect x="0" y="0" width="324" height="18" rx="4" fill="#090d16" stroke="#1e293b" stroke-width="0.8" />
        <circle cx="9" cy="9" r="3" fill="#ef4444" onclick="toggleColorFrameMode('${id}')" style="cursor:pointer;" />
        <circle cx="19" cy="9" r="3" fill="#f59e0b" onclick="toggleColorFrameMode('${id}')" style="cursor:pointer;" />
        <circle cx="29" cy="9" r="3" fill="#10b981" onclick="toggleColorFrameMode('${id}')" style="cursor:pointer;" />
        
        <text x="162" y="12.5" text-anchor="middle" fill="#ec4899" font-size="8.5" font-weight="900" letter-spacing="0.12em">🎨 TITAN COLOR & GRADIENT STUDIO</text>
        <text x="316" y="12.5" text-anchor="end" fill="#64748b" font-size="8" font-weight="700" onclick="toggleColorFrameMode('${id}')" style="cursor:pointer;">[FRAME]</text>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 3: TOP 16:9 OLED LIVE COLOR VIEWPORT (324 x 114px)
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-oled-viewport">
        <rect x="18" y="52" width="324" height="114" rx="14" fill="#010409" stroke="#1e293b" stroke-width="1.5" />
        
        <g clip-path="url(#${id}-screen-clip)">
            <!-- 🌈 Dynamic Live Color Gradient Surface -->
            <rect id="${id}-oled-shader-surface" x="18" y="52" width="324" height="114" fill="url(#${id}-live-shader)" />

            <!-- Animated Color Spectrum Wave Overlay -->
            <path id="${id}-wave-path" d="M 18,110 Q 99,80 180,110 T 342,110 L 342,166 L 18,166 Z" fill="#000000" fill-opacity="0.35" />

            <!-- Grid Lines -->
            <line x1="126" y1="52" x2="126" y2="166" stroke="#ffffff" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.25" />
            <line x1="234" y1="52" x2="234" y2="166" stroke="#ffffff" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.25" />
            <line x1="18" y1="109" x2="342" y2="109" stroke="#ffffff" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.25" />

            <!-- Realtime Telemetry HUD Badges -->
            <!-- Top Left: HEX -->
            <rect x="24" y="58" width="86" height="18" rx="4" fill="#020617" fill-opacity="0.9" stroke="#ec4899" stroke-width="1" />
            <text x="30" y="70.5" fill="#f472b6" font-size="8.5" font-weight="900">HEX:</text>
            <text id="${id}-hud-hex" x="104" y="70.5" text-anchor="end" fill="#ffffff" font-size="9" font-weight="900">${hex}</text>

            <!-- Top Right: OPCODE -->
            <rect x="250" y="58" width="86" height="18" rx="4" fill="#020617" fill-opacity="0.9" stroke="#8b5cf6" stroke-width="1" />
            <text x="256" y="70.5" fill="#c084fc" font-size="8.5" font-weight="900">OPCODE:</text>
            <text id="${id}-hud-opcode" x="330" y="70.5" text-anchor="end" fill="#ffffff" font-size="9" font-weight="900">0x${opcode.toString(16).toUpperCase().padStart(2, '0')}</text>

            <!-- Bottom Left: RGB -->
            <rect x="24" y="142" width="108" height="18" rx="4" fill="#020617" fill-opacity="0.9" stroke="#1e293b" stroke-width="1" />
            <text x="30" y="154.5" fill="#94a3b8" font-size="8" font-weight="900">RGB:</text>
            <text id="${id}-hud-rgb" x="126" y="154.5" text-anchor="end" fill="#38bdf8" font-size="8" font-weight="900">${rgb}</text>

            <!-- Bottom Right: HSL -->
            <rect x="228" y="142" width="108" height="18" rx="4" fill="#020617" fill-opacity="0.9" stroke="#059669" stroke-width="1" />
            <text x="234" y="154.5" fill="#34d399" font-size="8" font-weight="900">HSL:</text>
            <text id="${id}-hud-hsl" x="330" y="154.5" text-anchor="end" fill="#ffffff" font-size="8" font-weight="900">${hsl}</text>

            <!-- Glass Glare Specular -->
            <path d="M 18,52 L 342,52 L 280,166 L 18,166 Z" fill="url(#${id}-glass-glare)" pointer-events="none" />
        </g>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 4: 4-MODE SELECTOR CAPSULES
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-mode-switchers" transform="translate(18, 174)">
        <!-- Capsule 1: SOLID -->
        <g onclick="switchColorMode('${id}', 'solid')" style="cursor:pointer;">
            <rect id="${id}-mode-solid-bg" x="0" y="0" width="76" height="26" rx="6" 
                  fill="${activeMode === 'solid' ? '#831843' : '#090d16'}" 
                  stroke="${activeMode === 'solid' ? '#f472b6' : '#1e293b'}" stroke-width="${activeMode === 'solid' ? '1.5' : '1'}" />
            <text id="${id}-mode-solid-txt" x="38" y="17" text-anchor="middle" 
                  fill="${activeMode === 'solid' ? '#ffffff' : '#94a3b8'}" 
                  font-size="9" font-weight="900">🎨 SOLID</text>
        </g>

        <!-- Capsule 2: LINEAR GRADIENT -->
        <g onclick="switchColorMode('${id}', 'gradient')" style="cursor:pointer;" transform="translate(82, 0)">
            <rect id="${id}-mode-grad-bg" x="0" y="0" width="76" height="26" rx="6" 
                  fill="${activeMode === 'gradient' ? '#581c87' : '#090d16'}" 
                  stroke="${activeMode === 'gradient' ? '#c084fc' : '#1e293b'}" stroke-width="${activeMode === 'gradient' ? '1.5' : '1'}" />
            <text id="${id}-mode-grad-txt" x="38" y="17" text-anchor="middle" 
                  fill="${activeMode === 'gradient' ? '#ffffff' : '#94a3b8'}" 
                  font-size="9" font-weight="900">🌈 LINEAR</text>
        </g>

        <!-- Capsule 3: RADIAL / MESH -->
        <g onclick="switchColorMode('${id}', 'mesh')" style="cursor:pointer;" transform="translate(164, 0)">
            <rect id="${id}-mode-mesh-bg" x="0" y="0" width="78" height="26" rx="6" 
                  fill="${activeMode === 'mesh' ? '#064e3b' : '#090d16'}" 
                  stroke="${activeMode === 'mesh' ? '#34d399' : '#1e293b'}" stroke-width="${activeMode === 'mesh' ? '1.5' : '1'}" />
            <text id="${id}-mode-mesh-txt" x="39" y="17" text-anchor="middle" 
                  fill="${activeMode === 'mesh' ? '#ffffff' : '#94a3b8'}" 
                  font-size="9" font-weight="900">🌌 RADIAL</text>
        </g>

        <!-- Capsule 4: PALETTES -->
        <g onclick="switchColorMode('${id}', 'palette')" style="cursor:pointer;" transform="translate(248, 0)">
            <rect id="${id}-mode-palette-bg" x="0" y="0" width="76" height="26" rx="6" 
                  fill="${activeMode === 'palette' ? '#78350f' : '#090d16'}" 
                  stroke="${activeMode === 'palette' ? '#fbbf24' : '#1e293b'}" stroke-width="${activeMode === 'palette' ? '1.5' : '1'}" />
            <text id="${id}-mode-palette-txt" x="38" y="17" text-anchor="middle" 
                  fill="${activeMode === 'palette' ? '#ffffff' : '#94a3b8'}" 
                  font-size="9" font-weight="900">👑 PALETTES</text>
        </g>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 5: 3-CHANNEL TACTILE TOUCH SLIDERS (24px STEPPERS & DIGITAL DOCK)
    ══════════════════════════════════════════════════════════════════════════ -->

    <!-- ── SLIDER 1: HUE / COLOR OPCODE (0 - 255) ── -->
    <g id="${id}-slider-hue-group" transform="translate(18, 206)">
        <text id="${id}-lbl-hue" x="2" y="10" font-size="9.5" font-weight="900" fill="#f472b6" letter-spacing="0.5">1. HUE / COLOR BANK (${opcode})</text>
        
        <g transform="translate(170, -2)">
            <rect x="0" y="0" width="154" height="16" rx="4" fill="#30091e" stroke="#ec4899" stroke-width="1" />
            <text id="${id}-badge-hue" x="77" y="11.5" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle">REG 0x4120 (COLOR)</text>
        </g>

        <!-- Controls Row -->
        <g transform="translate(0, 16)">
            <!-- [ ◀ ] -->
            <g class="cursor-pointer" onclick="stepColorChannel('${id}', 'hue', -1)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M14 8L10 12L14 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- Touch Track (204px) -->
            <g transform="translate(29, 0)">
                <rect x="0" y="0" width="204" height="24" rx="6" fill="#090d16" stroke="#334155" stroke-width="1.2" />
                <!-- Spectrum Background -->
                <rect x="6" y="9" width="192" height="6" rx="3" fill="url(#${id}-spectrum-hue)" stroke="#090d14" stroke-width="0.8" />
                <rect id="${id}-fill-hue" x="7" y="10" width="${Math.max(6, (opcode / 255) * 190)}" height="4" rx="2" fill="#ec4899" filter="url(#${id}-glow-pink)" />
                <g id="${id}-knob-hue" transform="translate(${7 + (opcode / 255) * 190}, 12)" cursor="ew-resize" pointer-events="none">
                    <circle cx="0" cy="0" r="8.5" fill="url(#${id}-touch-knob)" stroke="#f472b6" stroke-width="1.3" />
                    <circle cx="0" cy="0" r="3.2" fill="#ec4899" filter="url(#${id}-glow-pink)" />
                </g>
                <rect id="${id}-hit-hue" x="0" y="0" width="204" height="24" rx="6" fill="#000000" fill-opacity="0.001" pointer-events="all" cursor="ew-resize" />
            </g>

            <!-- [ ▶ ] -->
            <g class="cursor-pointer" transform="translate(238, 0)" onclick="stepColorChannel('${id}', 'hue', 1)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M10 8L14 12L10 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- [ 012 ] -->
            <g transform="translate(266, 0)">
                <rect x="0" y="0" width="58" height="24" rx="6" fill="#30091e" stroke="#ec4899" stroke-width="1.2" />
                <text id="${id}-val-hue" x="29" y="16.5" font-size="11" font-weight="900" fill="#f472b6" text-anchor="middle" letter-spacing="0.5">${opcode.toString().padStart(3, '0')}</text>
            </g>
        </g>
    </g>

    <!-- ── SLIDER 2: SATURATION & CONTRAST (0% - 200%) ── -->
    <g id="${id}-slider-sat-group" transform="translate(18, 252)">
        <text id="${id}-lbl-sat" x="2" y="10" font-size="9.5" font-weight="900" fill="#c084fc" letter-spacing="0.5">2. SATURATION & CONTRAST (${saturation}%)</text>
        
        <g transform="translate(170, -2)">
            <rect x="0" y="0" width="154" height="16" rx="4" fill="#20063b" stroke="#a855f7" stroke-width="1" />
            <text id="${id}-badge-sat" x="77" y="11.5" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle">REG 0x4122 (SAT)</text>
        </g>

        <!-- Controls Row -->
        <g transform="translate(0, 16)">
            <!-- [ ◀ ] -->
            <g class="cursor-pointer" onclick="stepColorChannel('${id}', 'saturation', -5)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M14 8L10 12L14 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- Touch Track (204px) -->
            <g transform="translate(29, 0)">
                <rect x="0" y="0" width="204" height="24" rx="6" fill="#090d16" stroke="#334155" stroke-width="1.2" />
                <rect x="6" y="9" width="192" height="6" rx="3" fill="url(#${id}-slider-groove)" stroke="#090d14" stroke-width="0.8" />
                <rect id="${id}-fill-sat" x="7" y="10" width="${Math.max(6, (saturation / 200) * 190)}" height="4" rx="2" fill="#9333ea" filter="url(#${id}-glow-pink)" />
                <g id="${id}-knob-sat" transform="translate(${7 + (saturation / 200) * 190}, 12)" cursor="ew-resize" pointer-events="none">
                    <circle cx="0" cy="0" r="8.5" fill="url(#${id}-touch-knob)" stroke="#c084fc" stroke-width="1.3" />
                    <circle cx="0" cy="0" r="3.2" fill="#9333ea" filter="url(#${id}-glow-pink)" />
                </g>
                <rect id="${id}-hit-sat" x="0" y="0" width="204" height="24" rx="6" fill="#000000" fill-opacity="0.001" pointer-events="all" cursor="ew-resize" />
            </g>

            <!-- [ ▶ ] -->
            <g class="cursor-pointer" transform="translate(238, 0)" onclick="stepColorChannel('${id}', 'saturation', 5)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M10 8L14 12L10 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- [ 100% ] -->
            <g transform="translate(266, 0)">
                <rect x="0" y="0" width="58" height="24" rx="6" fill="#20063b" stroke="#a855f7" stroke-width="1.2" />
                <text id="${id}-val-sat" x="29" y="16.5" font-size="11" font-weight="900" fill="#c084fc" text-anchor="middle" letter-spacing="0.5">${saturation}%</text>
            </g>
        </g>
    </g>

    <!-- ── SLIDER 3: BRIGHTNESS / EXPOSURE (-100 to +100) ── -->
    <g id="${id}-slider-bright-group" transform="translate(18, 298)">
        <text id="${id}-lbl-bright" x="2" y="10" font-size="9.5" font-weight="900" fill="#fbbf24" letter-spacing="0.5">3. BRIGHTNESS / EXPOSURE (${brightness >= 0 ? '+' : ''}${brightness})</text>
        
        <g transform="translate(170, -2)">
            <rect x="0" y="0" width="154" height="16" rx="4" fill="#2d1602" stroke="#d97706" stroke-width="1" />
            <text id="${id}-badge-bright" x="77" y="11.5" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle">REG 0x4121 (EXP)</text>
        </g>

        <!-- Controls Row -->
        <g transform="translate(0, 16)">
            <!-- [ ◀ ] -->
            <g class="cursor-pointer" onclick="stepColorChannel('${id}', 'brightness', -5)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M14 8L10 12L14 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- Touch Track (204px) -->
            <g transform="translate(29, 0)">
                <rect x="0" y="0" width="204" height="24" rx="6" fill="#090d16" stroke="#334155" stroke-width="1.2" />
                <rect x="6" y="9" width="192" height="6" rx="3" fill="url(#${id}-slider-groove)" stroke="#090d14" stroke-width="0.8" />
                <rect id="${id}-fill-bright" x="7" y="10" width="${Math.max(6, ((brightness + 100) / 200) * 190)}" height="4" rx="2" fill="#d97706" filter="url(#${id}-glow-amber)" />
                <g id="${id}-knob-bright" transform="translate(${7 + ((brightness + 100) / 200) * 190}, 12)" cursor="ew-resize" pointer-events="none">
                    <circle cx="0" cy="0" r="8.5" fill="url(#${id}-touch-knob)" stroke="#fbbf24" stroke-width="1.3" />
                    <circle cx="0" cy="0" r="3.2" fill="#d97706" filter="url(#${id}-glow-amber)" />
                </g>
                <rect id="${id}-hit-bright" x="0" y="0" width="204" height="24" rx="6" fill="#000000" fill-opacity="0.001" pointer-events="all" cursor="ew-resize" />
            </g>

            <!-- [ ▶ ] -->
            <g class="cursor-pointer" transform="translate(238, 0)" onclick="stepColorChannel('${id}', 'brightness', 5)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M10 8L14 12L10 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- [ 000 ] -->
            <g transform="translate(266, 0)">
                <rect x="0" y="0" width="58" height="24" rx="6" fill="#2d1602" stroke="#d97706" stroke-width="1.2" />
                <text id="${id}-val-bright" x="29" y="16.5" font-size="11" font-weight="900" fill="#fbbf24" text-anchor="middle" letter-spacing="0.5">${brightness >= 0 ? '+' : ''}${brightness}</text>
            </g>
        </g>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 6: 24-SWATCH CHROMATIC COLOR PALETTE (SELECT DIRECT COLOR)
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-quick-swatches" transform="translate(18, 350)">
        <rect x="0" y="0" width="324" height="42" rx="8" fill="#060913" stroke="#1e293b" stroke-width="1" />
        <text x="6" y="9" fill="#94a3b8" font-size="7" font-weight="900" letter-spacing="0.04em">🎨 24-SWATCH CHROMATIC COLOR PALETTE (CLICK TO SELECT DIRECT COLOR)</text>
        
        <!-- Row 1: 12 Vivid Spectrum Swatches (22 x 13px each) -->
        <g transform="translate(6, 12)">
            <rect x="0" y="0" width="22" height="13" rx="3" fill="#ef4444" stroke="#ffffff" stroke-width="0.7" onclick="selectDirectColor('${id}', '#ef4444')" style="cursor:pointer;" />
            <rect x="26" y="0" width="22" height="13" rx="3" fill="#f97316" stroke="#ffffff" stroke-width="0.7" onclick="selectDirectColor('${id}', '#f97316')" style="cursor:pointer;" />
            <rect x="52" y="0" width="22" height="13" rx="3" fill="#f59e0b" stroke="#ffffff" stroke-width="0.7" onclick="selectDirectColor('${id}', '#f59e0b')" style="cursor:pointer;" />
            <rect x="78" y="0" width="22" height="13" rx="3" fill="#eab308" stroke="#ffffff" stroke-width="0.7" onclick="selectDirectColor('${id}', '#eab308')" style="cursor:pointer;" />
            <rect x="104" y="0" width="22" height="13" rx="3" fill="#84cc16" stroke="#ffffff" stroke-width="0.7" onclick="selectDirectColor('${id}', '#84cc16')" style="cursor:pointer;" />
            <rect x="130" y="0" width="22" height="13" rx="3" fill="#10b981" stroke="#ffffff" stroke-width="0.7" onclick="selectDirectColor('${id}', '#10b981')" style="cursor:pointer;" />
            <rect x="156" y="0" width="22" height="13" rx="3" fill="#06b6d4" stroke="#ffffff" stroke-width="0.7" onclick="selectDirectColor('${id}', '#06b6d4')" style="cursor:pointer;" />
            <rect x="182" y="0" width="22" height="13" rx="3" fill="#0ea5e9" stroke="#ffffff" stroke-width="0.7" onclick="selectDirectColor('${id}', '#0ea5e9')" style="cursor:pointer;" />
            <rect x="208" y="0" width="22" height="13" rx="3" fill="#3b82f6" stroke="#ffffff" stroke-width="0.7" onclick="selectDirectColor('${id}', '#3b82f6')" style="cursor:pointer;" />
            <rect x="234" y="0" width="22" height="13" rx="3" fill="#8b5cf6" stroke="#ffffff" stroke-width="0.7" onclick="selectDirectColor('${id}', '#8b5cf6')" style="cursor:pointer;" />
            <rect x="260" y="0" width="22" height="13" rx="3" fill="#d946ef" stroke="#ffffff" stroke-width="0.7" onclick="selectDirectColor('${id}', '#d946ef')" style="cursor:pointer;" />
            <rect x="286" y="0" width="22" height="13" rx="3" fill="#f43f5e" stroke="#ffffff" stroke-width="0.7" onclick="selectDirectColor('${id}', '#f43f5e')" style="cursor:pointer;" />
        </g>

        <!-- Row 2: 12 Deep & Neutral Swatches (22 x 13px each) -->
        <g transform="translate(6, 27)">
            <rect x="0" y="0" width="22" height="13" rx="3" fill="#991b1b" stroke="#ffffff" stroke-width="0.7" onclick="selectDirectColor('${id}', '#991b1b')" style="cursor:pointer;" />
            <rect x="26" y="0" width="22" height="13" rx="3" fill="#c2410c" stroke="#ffffff" stroke-width="0.7" onclick="selectDirectColor('${id}', '#c2410c')" style="cursor:pointer;" />
            <rect x="52" y="0" width="22" height    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 7: 6 LUXURIOUS 70px WIDE BOTTOM TABS
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-bottom-tabs" transform="translate(18, 400)">
        <rect x="0" y="0" width="324" height="66" rx="14" fill="#020617" stroke="#1e293b" stroke-width="1.5" />

        <g onclick="scrollColorTabsLeft('${id}')" style="cursor:pointer;" transform="translate(2, 6)">
            <rect x="0" y="0" width="16" height="54" rx="4" fill="#090d16" stroke="#1e293b" stroke-width="1" />
            <path d="M 11,22 L 5,27 L 11,32" fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" />
        </g>

        <g onclick="scrollColorTabsRight('${id}')" style="cursor:pointer;" transform="translate(306, 6)">
            <rect x="0" y="0" width="16" height="54" rx="4" fill="#090d16" stroke="#1e293b" stroke-width="1" />
            <path d="M 5,22 L 11,27 L 5,32" fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" />
        </g>

        <foreignObject x="22" y="4" width="280" height="58">
            <div xmlns="http://www.w3.org/1999/xhtml" 
                 id="${id}-tabs-viewport"
                 style="display:flex; align-items:center; gap:6px; width:100%; height:100%; overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <button type="button" id="${id}-tab-anim" onclick="switchColorTab('${id}', 'anim')"
                        style="flex-shrink:0; width:70px; height:54px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:15px; line-height:1;">⚡</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#38bdf8;">ANIM</span>
                </button>

                <button type="button" id="${id}-tab-transform" onclick="switchColorTab('${id}', 'transform')"
                        style="flex-shrink:0; width:70px; height:54px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:15px; line-height:1;">📐</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#fbbf24;">TRANSFORM</span>
                </button>

                <button type="button" id="${id}-tab-color" onclick="switchColorTab('${id}', 'color')"
                        style="flex-shrink:0; width:70px; height:54px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; border-radius:10px; background:#500724; border:2px solid #ec4899; box-shadow:0 0 12px rgba(236,72,153,0.5); cursor:pointer; color:#ffffff;">
                    <span style="font-size:15px; line-height:1;">🎨</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#f472b6;">COLOR</span>
                </button>

                <button type="button" id="${id}-tab-typo" onclick="switchColorTab('${id}', 'typo')"
                        style="flex-shrink:0; width:70px; height:54px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:15px; line-height:1;">🔤</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#fde047;">TYPO</span>
                </button>

                <button type="button" id="${id}-tab-vfx" onclick="switchColorTab('${id}', 'vfx')"
                        style="flex-shrink:0; width:70px; height:54px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:15px; line-height:1;">💥</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#ef4444;">VFX</span>
                </button>

                <button type="button" id="${id}-tab-thumb" onclick="switchColorTab('${id}', 'thumb')"
                        style="flex-shrink:0; width:70px; height:54px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:15px; line-height:1;">🖼️</span>
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
    renderTitanSvgColorCard,
    TitanSvgColorCard: renderTitanSvgColorCard
};
