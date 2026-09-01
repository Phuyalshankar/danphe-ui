'use strict';

/**
 * 🐬 TitanSvgTransformCard (danphe-ui)
 * Flagship Titanium Video Transform & Motion Matrix Card (Width: 360px, Height: 560px)
 * 100% Pure Vector SVG • Tactile 4-Piece Sliders • Direct Realtime Matrix Sync
 */

function renderTitanSvgTransformCard(options = {}) {
    const {
        id = 'titan-svg-transform-card',
        activeMode = 'scale',
        activeTab = 'basic',
        scale = 100,
        rotation = 0,
        posX = 0,
        posY = 0,
        opacity = 100,
        speed = '1.0x',
        anchor = 'cc',
        isFrameMode = true
    } = options;

    return `
<svg id="${id}" viewBox="0 0 360 560" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" 
     class="select-none filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.98)] w-full max-w-[360px] mx-auto"
     style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; text-rendering: geometricPrecision; -webkit-font-smoothing: antialiased;">
    <defs>
        <!-- ── 1. TITANIUM HARDWARE CHASSIS GRADIENTS ── -->
        <linearGradient id="tf-titanium-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#cbd5e1" />
            <stop offset="20%" stop-color="#64748b" />
            <stop offset="50%" stop-color="#0f172a" />
            <stop offset="80%" stop-color="#1e293b" />
            <stop offset="100%" stop-color="#94a3b8" />
        </linearGradient>

        <linearGradient id="tf-inner-bezel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#020617" />
            <stop offset="50%" stop-color="#040814" />
            <stop offset="100%" stop-color="#000000" />
        </linearGradient>

        <linearGradient id="tf-glass-glare" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22" />
            <stop offset="25%" stop-color="#ffffff" stop-opacity="0.04" />
            <stop offset="50%" stop-color="#000000" stop-opacity="0" />
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.08" />
        </linearGradient>

        <linearGradient id="tf-slider-groove" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#000000" stop-opacity="1" />
            <stop offset="100%" stop-color="#1e293b" stop-opacity="0.9" />
        </linearGradient>

        <linearGradient id="tf-touch-knob" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f8fafc" />
            <stop offset="40%" stop-color="#cbd5e1" />
            <stop offset="100%" stop-color="#475569" />
        </linearGradient>

        <!-- ── 2. NEON LED GLOW FILTERS ── -->
        <filter id="tf-glow-cyan" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
            <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>

        <filter id="tf-glow-purple" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
            <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>

        <filter id="tf-glow-emerald" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
            <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>

        <clipPath id="tf-screen-clip">
            <rect x="18" y="52" width="324" height="114" rx="14" />
        </clipPath>
    </defs>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 1: SMARTPHONE TITANIUM HARDWARE CHASSIS
    ══════════════════════════════════════════════════════════════════════════ -->
    <rect id="${id}-outer-chassis" x="3" y="3" width="354" height="554" rx="38" fill="url(#tf-titanium-rim)" stroke="#090d16" stroke-width="2" />
    <rect id="${id}-bezel" x="7" y="7" width="346" height="546" rx="34" fill="url(#tf-inner-bezel)" stroke="#334155" stroke-width="1.2" />

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 2: TOP STATUS BAR & HEADER
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-top-header">
        <rect x="135" y="14" width="90" height="16" rx="8" fill="#000000" stroke="#1e293b" stroke-width="1" />
        <circle cx="150" cy="22" r="3.5" fill="#030712" stroke="#1e293b" stroke-width="0.8" />
        <circle cx="150" cy="22" r="1.2" fill="#06b6d4" opacity="0.9" />
        <circle cx="210" cy="22" r="2.2" fill="#10b981" filter="url(#tf-glow-emerald)" />

        <text x="24" y="26" fill="#94a3b8" font-size="9.5" font-weight="900" letter-spacing="0.08em">DANPHE 4K</text>
        <text x="336" y="26" text-anchor="end" fill="#38bdf8" font-size="9.5" font-weight="900" letter-spacing="0.08em">NLE 60 FPS</text>
    </g>

    <!-- Header Title Bar & Frame Toggle -->
    <g id="${id}-title-bar" transform="translate(18, 30)">
        <rect x="0" y="0" width="324" height="18" rx="4" fill="#090d16" stroke="#1e293b" stroke-width="0.8" />
        <circle cx="9" cy="9" r="3" fill="#ef4444" onclick="toggleTfFrameMode('${id}')" style="cursor:pointer;" />
        <circle cx="19" cy="9" r="3" fill="#f59e0b" onclick="toggleTfFrameMode('${id}')" style="cursor:pointer;" />
        <circle cx="29" cy="9" r="3" fill="#10b981" onclick="toggleTfFrameMode('${id}')" style="cursor:pointer;" />
        
        <text x="162" y="12.5" text-anchor="middle" fill="#38bdf8" font-size="8.5" font-weight="900" letter-spacing="0.12em">📐 TITAN UNIVERSAL TRANSFORM STUDIO</text>
        <text x="316" y="12.5" text-anchor="end" fill="#64748b" font-size="8" font-weight="700" onclick="toggleTfFrameMode('${id}')" style="cursor:pointer;">[FRAME]</text>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 3: TOP 16:9 OLED LIVE TRANSFORM VIEWPORT (324 x 114px)
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-oled-viewport">
        <rect x="18" y="52" width="324" height="114" rx="14" fill="#010409" stroke="#1e293b" stroke-width="1.5" />
        
        <g clip-path="url(#tf-screen-clip)">
            <!-- Grid Lines -->
            <line x1="126" y1="52" x2="126" y2="166" stroke="#38bdf8" stroke-width="0.6" stroke-dasharray="3,3" opacity="0.2" />
            <line x1="234" y1="52" x2="234" y2="166" stroke="#38bdf8" stroke-width="0.6" stroke-dasharray="3,3" opacity="0.2" />
            <line x1="18" y1="90" x2="342" y2="90" stroke="#38bdf8" stroke-width="0.6" stroke-dasharray="3,3" opacity="0.2" />
            <line x1="18" y1="128" x2="342" y2="128" stroke="#38bdf8" stroke-width="0.6" stroke-dasharray="3,3" opacity="0.2" />

            <!-- Origin Crosshair -->
            <line x1="172" y1="109" x2="188" y2="109" stroke="#64748b" stroke-width="0.8" opacity="0.5" />
            <line x1="180" y1="101" x2="180" y2="117" stroke="#64748b" stroke-width="0.8" opacity="0.5" />

            <!-- 🎬 Interactive 2D Bounding Wireframe Box -->
            <g id="${id}-transform-box" transform="translate(180, 109)">
                <g id="tf-target-matrix" transform="scale(${scale / 100}) rotate(${rotation}) translate(${posX * 0.2}, ${posY * 0.2})">
                    <rect x="-56" y="-32" width="112" height="64" rx="4" fill="#0284c7" fill-opacity="0.2" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,2" />
                    
                    <rect x="-44" y="-22" width="88" height="44" rx="3" fill="#0f172a" stroke="#0284c7" stroke-width="1" />
                    <polygon points="-8,-10 10,0 -8,10" fill="#38bdf8" />

                    <!-- 8 Resize Handles -->
                    <rect x="-59" y="-35" width="6" height="6" fill="#38bdf8" stroke="#000" stroke-width="0.8" />
                    <rect x="53" y="-35" width="6" height="6" fill="#38bdf8" stroke="#000" stroke-width="0.8" />
                    <rect x="-59" y="29" width="6" height="6" fill="#38bdf8" stroke="#000" stroke-width="0.8" />
                    <rect x="53" y="29" width="6" height="6" fill="#38bdf8" stroke="#000" stroke-width="0.8" />
                    <rect x="-3" y="-35" width="6" height="6" fill="#38bdf8" stroke="#000" stroke-width="0.8" />
                    <rect x="-3" y="29" width="6" height="6" fill="#38bdf8" stroke="#000" stroke-width="0.8" />
                    <rect x="-59" y="-3" width="6" height="6" fill="#38bdf8" stroke="#000" stroke-width="0.8" />
                    <rect x="53" y="-3" width="6" height="6" fill="#38bdf8" stroke="#000" stroke-width="0.8" />

                    <!-- Center Anchor Crosshair -->
                    <circle cx="0" cy="0" r="4.5" fill="#f59e0b" stroke="#000" stroke-width="1" />
                    <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
                </g>
            </g>

            <!-- Realtime Telemetry HUD Badges -->
            <rect x="24" y="58" width="86" height="18" rx="4" fill="#020617" fill-opacity="0.9" stroke="#0284c7" stroke-width="1" />
            <text x="30" y="70.5" fill="#38bdf8" font-size="8.5" font-weight="900">SCALE:</text>
            <text id="${id}-hud-scale" x="104" y="70.5" text-anchor="end" fill="#ffffff" font-size="9" font-weight="900">${scale}%</text>

            <rect x="250" y="58" width="86" height="18" rx="4" fill="#020617" fill-opacity="0.9" stroke="#a855f7" stroke-width="1" />
            <text x="256" y="70.5" fill="#c084fc" font-size="8.5" font-weight="900">ROT:</text>
            <text id="${id}-hud-rot" x="330" y="70.5" text-anchor="end" fill="#ffffff" font-size="9" font-weight="900">${rotation}°</text>

            <rect x="24" y="142" width="100" height="18" rx="4" fill="#020617" fill-opacity="0.9" stroke="#1e293b" stroke-width="1" />
            <text x="30" y="154.5" fill="#94a3b8" font-size="8" font-weight="900">POS [X, Y]:</text>
            <text id="${id}-hud-pos" x="118" y="154.5" text-anchor="end" fill="#38bdf8" font-size="8.5" font-weight="900">${posX}, ${posY}</text>

            <rect x="236" y="142" width="100" height="18" rx="4" fill="#020617" fill-opacity="0.9" stroke="#059669" stroke-width="1" />
            <text x="242" y="154.5" fill="#34d399" font-size="8" font-weight="900">SPEED:</text>
            <text id="${id}-hud-speed" x="330" y="154.5" text-anchor="end" fill="#ffffff" font-size="8.5" font-weight="900">${speed}</text>

            <path d="M 18,52 L 342,52 L 280,166 L 18,166 Z" fill="url(#tf-glass-glare)" pointer-events="none" />
        </g>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 4: 4-MODE SELECTOR CAPSULES
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-mode-switchers" transform="translate(18, 174)">
        <!-- Capsule 1: SCALE -->
        <g onclick="switchTfMode('${id}', 'scale')" style="cursor:pointer;">
            <rect id="${id}-mode-scale-bg" x="0" y="0" width="76" height="26" rx="6" 
                  fill="${activeMode === 'scale' ? '#0369a1' : '#090d16'}" 
                  stroke="${activeMode === 'scale' ? '#38bdf8' : '#1e293b'}" stroke-width="${activeMode === 'scale' ? '1.5' : '1'}" />
            <text id="${id}-mode-scale-txt" x="38" y="17" text-anchor="middle" 
                  fill="${activeMode === 'scale' ? '#ffffff' : '#94a3b8'}" 
                  font-size="9" font-weight="900">📐 SCALE</text>
        </g>

        <!-- Capsule 2: ROTATE -->
        <g onclick="switchTfMode('${id}', 'rotate')" style="cursor:pointer;" transform="translate(82, 0)">
            <rect id="${id}-mode-rotate-bg" x="0" y="0" width="76" height="26" rx="6" 
                  fill="${activeMode === 'rotate' ? '#581c87' : '#090d16'}" 
                  stroke="${activeMode === 'rotate' ? '#c084fc' : '#1e293b'}" stroke-width="${activeMode === 'rotate' ? '1.5' : '1'}" />
            <text id="${id}-mode-rotate-txt" x="38" y="17" text-anchor="middle" 
                  fill="${activeMode === 'rotate' ? '#ffffff' : '#94a3b8'}" 
                  font-size="9" font-weight="900">🔄 3D ROT</text>
        </g>

        <!-- Capsule 3: COMPOSITE -->
        <g onclick="switchTfMode('${id}', 'composite')" style="cursor:pointer;" transform="translate(164, 0)">
            <rect id="${id}-mode-composite-bg" x="0" y="0" width="78" height="26" rx="6" 
                  fill="${activeMode === 'composite' ? '#064e3b' : '#090d16'}" 
                  stroke="${activeMode === 'composite' ? '#34d399' : '#1e293b'}" stroke-width="${activeMode === 'composite' ? '1.5' : '1'}" />
            <text id="${id}-mode-composite-txt" x="39" y="17" text-anchor="middle" 
                  fill="${activeMode === 'composite' ? '#ffffff' : '#94a3b8'}" 
                  font-size="9" font-weight="900">🎭 BLEND</text>
        </g>

        <!-- Capsule 4: SPEED -->
        <g onclick="switchTfMode('${id}', 'speed')" style="cursor:pointer;" transform="translate(248, 0)">
            <rect id="${id}-mode-speed-bg" x="0" y="0" width="76" height="26" rx="6" 
                  fill="${activeMode === 'speed' ? '#78350f' : '#090d16'}" 
                  stroke="${activeMode === 'speed' ? '#fbbf24' : '#1e293b'}" stroke-width="${activeMode === 'speed' ? '1.5' : '1'}" />
            <text id="${id}-mode-speed-txt" x="38" y="17" text-anchor="middle" 
                  fill="${activeMode === 'speed' ? '#ffffff' : '#94a3b8'}" 
                  font-size="9" font-weight="900">⚡ SPEED</text>
        </g>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 5: 3-CHANNEL TACTILE TOUCH SLIDERS (EXACT 4-PIECE DOCK LAYOUT)
    ══════════════════════════════════════════════════════════════════════════ -->
    
    <!-- ── SLIDER 1: SCALE / ZOOM (10% - 400%) ── -->
    <g id="${id}-slider-scale-group" transform="translate(18, 206)">
        <text id="${id}-lbl-scale" x="2" y="10" font-size="9.5" font-weight="900" fill="#38bdf8" letter-spacing="0.5">1. SCALE / ZOOM (100%)</text>
        
        <g transform="translate(170, -2)">
            <rect x="0" y="0" width="154" height="16" rx="4" fill="#04202e" stroke="#0284c7" stroke-width="1" />
            <text id="${id}-badge-scale" x="77" y="11.5" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle">REG 0x4101 (ZOOM)</text>
        </g>

        <!-- Controls Row -->
        <g transform="translate(0, 16)">
            <!-- [ ◀ ] -->
            <g class="cursor-pointer" onclick="stepTfChannel('${id}', 'scale', -5)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M14 8L10 12L14 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- Touch Track (204px) -->
            <g transform="translate(29, 0)">
                <rect x="0" y="0" width="204" height="24" rx="6" fill="#090d16" stroke="#334155" stroke-width="1.2" />
                <rect x="6" y="9" width="192" height="6" rx="3" fill="url(#tf-slider-groove)" stroke="#090d14" stroke-width="0.8" />
                <rect id="${id}-fill-scale" x="7" y="10" width="${Math.max(6, ((scale - 10) / 390) * 190)}" height="4" rx="2" fill="#0284c7" filter="url(#tf-glow-cyan)" />
                <g id="${id}-knob-scale" transform="translate(${7 + ((scale - 10) / 390) * 190}, 12)" cursor="ew-resize" pointer-events="none">
                    <circle cx="0" cy="0" r="8.5" fill="url(#tf-touch-knob)" stroke="#38bdf8" stroke-width="1.3" />
                    <circle cx="0" cy="0" r="3.2" fill="#0284c7" filter="url(#tf-glow-cyan)" />
                </g>
                <rect id="${id}-hit-scale" x="0" y="0" width="204" height="24" rx="6" fill="#000000" fill-opacity="0.001" pointer-events="all" cursor="ew-resize" />
            </g>

            <!-- [ ▶ ] -->
            <g class="cursor-pointer" transform="translate(238, 0)" onclick="stepTfChannel('${id}', 'scale', 5)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M10 8L14 12L10 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- [ 100% ] -->
            <g transform="translate(266, 0)">
                <rect x="0" y="0" width="58" height="24" rx="6" fill="#04202e" stroke="#0284c7" stroke-width="1.2" />
                <text id="${id}-val-scale" x="29" y="16.5" font-size="11" font-weight="900" fill="#38bdf8" text-anchor="middle" letter-spacing="0.5">${scale}%</text>
            </g>
        </g>
    </g>

    <!-- ── SLIDER 2: ROTATION ANGLE (-180° - +180°) ── -->
    <g id="${id}-slider-rot-group" transform="translate(18, 252)">
        <text id="${id}-lbl-rot" x="2" y="10" font-size="9.5" font-weight="900" fill="#c084fc" letter-spacing="0.5">2. ROTATION ANGLE (0°)</text>
        
        <g transform="translate(170, -2)">
            <rect x="0" y="0" width="154" height="16" rx="4" fill="#20063b" stroke="#a855f7" stroke-width="1" />
            <text id="${id}-badge-rot" x="77" y="11.5" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle">REG 0x4102 (ANGLE)</text>
        </g>

        <!-- Controls Row -->
        <g transform="translate(0, 16)">
            <!-- [ ◀ ] -->
            <g class="cursor-pointer" onclick="stepTfChannel('${id}', 'rotation', -5)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M14 8L10 12L14 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- Touch Track (204px) -->
            <g transform="translate(29, 0)">
                <rect x="0" y="0" width="204" height="24" rx="6" fill="#090d16" stroke="#334155" stroke-width="1.2" />
                <rect x="6" y="9" width="192" height="6" rx="3" fill="url(#tf-slider-groove)" stroke="#090d14" stroke-width="0.8" />
                <rect id="${id}-fill-rot" x="7" y="10" width="${Math.max(6, ((rotation + 180) / 360) * 190)}" height="4" rx="2" fill="#9333ea" filter="url(#tf-glow-purple)" />
                <g id="${id}-knob-rot" transform="translate(${7 + ((rotation + 180) / 360) * 190}, 12)" cursor="ew-resize" pointer-events="none">
                    <circle cx="0" cy="0" r="8.5" fill="url(#tf-touch-knob)" stroke="#c084fc" stroke-width="1.3" />
                    <circle cx="0" cy="0" r="3.2" fill="#9333ea" filter="url(#tf-glow-purple)" />
                </g>
                <rect id="${id}-hit-rot" x="0" y="0" width="204" height="24" rx="6" fill="#000000" fill-opacity="0.001" pointer-events="all" cursor="ew-resize" />
            </g>

            <!-- [ ▶ ] -->
            <g class="cursor-pointer" transform="translate(238, 0)" onclick="stepTfChannel('${id}', 'rotation', 5)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M10 8L14 12L10 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- [ 000° ] -->
            <g transform="translate(266, 0)">
                <rect x="0" y="0" width="58" height="24" rx="6" fill="#20063b" stroke="#a855f7" stroke-width="1.2" />
                <text id="${id}-val-rot" x="29" y="16.5" font-size="11" font-weight="900" fill="#c084fc" text-anchor="middle" letter-spacing="0.5">${rotation}°</text>
            </g>
        </g>
    </g>

    <!-- ── SLIDER 3: ALPHA OPACITY / COMPOSITE (0% - 100%) ── -->
    <g id="${id}-slider-opacity-group" transform="translate(18, 298)">
        <text id="${id}-lbl-opacity" x="2" y="10" font-size="9.5" font-weight="900" fill="#34d399" letter-spacing="0.5">3. ALPHA OPACITY (100%)</text>
        
        <g transform="translate(170, -2)">
            <rect x="0" y="0" width="154" height="16" rx="4" fill="#03251a" stroke="#059669" stroke-width="1" />
            <text id="${id}-badge-opacity" x="77" y="11.5" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle">REG 0x4100 (ALPHA)</text>
        </g>

        <!-- Controls Row -->
        <g transform="translate(0, 16)">
            <!-- [ ◀ ] -->
            <g class="cursor-pointer" onclick="stepTfChannel('${id}', 'opacity', -5)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M14 8L10 12L14 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- Touch Track (204px) -->
            <g transform="translate(29, 0)">
                <rect x="0" y="0" width="204" height="24" rx="6" fill="#090d16" stroke="#334155" stroke-width="1.2" />
                <rect x="6" y="9" width="192" height="6" rx="3" fill="url(#tf-slider-groove)" stroke="#090d14" stroke-width="0.8" />
                <rect id="${id}-fill-opacity" x="7" y="10" width="${Math.max(6, (opacity / 100) * 190)}" height="4" rx="2" fill="#059669" filter="url(#tf-glow-emerald)" />
                <g id="${id}-knob-opacity" transform="translate(${7 + (opacity / 100) * 190}, 12)" cursor="ew-resize" pointer-events="none">
                    <circle cx="0" cy="0" r="8.5" fill="url(#tf-touch-knob)" stroke="#34d399" stroke-width="1.3" />
                    <circle cx="0" cy="0" r="3.2" fill="#059669" filter="url(#tf-glow-emerald)" />
                </g>
                <rect id="${id}-hit-opacity" x="0" y="0" width="204" height="24" rx="6" fill="#000000" fill-opacity="0.001" pointer-events="all" cursor="ew-resize" />
            </g>

            <!-- [ ▶ ] -->
            <g class="cursor-pointer" transform="translate(238, 0)" onclick="stepTfChannel('${id}', 'opacity', 5)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M10 8L14 12L10 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- [ 100% ] -->
            <g transform="translate(266, 0)">
                <rect x="0" y="0" width="58" height="24" rx="6" fill="#03251a" stroke="#059669" stroke-width="1.2" />
                <text id="${id}-val-opacity" x="29" y="16.5" font-size="11" font-weight="900" fill="#34d399" text-anchor="middle" letter-spacing="0.5">${opacity}%</text>
            </g>
        </g>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 6: 3x3 ANCHOR MATRIX & QUICK ACTION BUTTONS
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-anchor-actions" transform="translate(18, 350)">
        <rect x="0" y="0" width="108" height="42" rx="8" fill="#060913" stroke="#1e293b" stroke-width="1" />
        <text x="6" y="10" fill="#64748b" font-size="7" font-weight="900" letter-spacing="0.04em">ANCHOR MATRIX</text>
        
        <!-- 9 Interactive Anchor Grid Points -->
        <g id="${id}-anchor-grid" transform="translate(8, 14)">
            <circle cx="6" cy="5" r="3.5" fill="${anchor === 'tl' ? '#38bdf8' : '#1e293b'}" stroke="#000" stroke-width="0.8" onclick="setTfAnchor('${id}', 'tl')" style="cursor:pointer;" />
            <circle cx="18" cy="5" r="3.5" fill="${anchor === 'tc' ? '#38bdf8' : '#1e293b'}" stroke="#000" stroke-width="0.8" onclick="setTfAnchor('${id}', 'tc')" style="cursor:pointer;" />
            <circle cx="30" cy="5" r="3.5" fill="${anchor === 'tr' ? '#38bdf8' : '#1e293b'}" stroke="#000" stroke-width="0.8" onclick="setTfAnchor('${id}', 'tr')" style="cursor:pointer;" />
            
            <circle cx="6" cy="14" r="3.5" fill="${anchor === 'cl' ? '#38bdf8' : '#1e293b'}" stroke="#000" stroke-width="0.8" onclick="setTfAnchor('${id}', 'cl')" style="cursor:pointer;" />
            <circle cx="18" cy="14" r="4.5" fill="${anchor === 'cc' ? '#38bdf8' : '#0284c7'}" stroke="#ffffff" stroke-width="1" onclick="setTfAnchor('${id}', 'cc')" style="cursor:pointer;" filter="url(#tf-glow-cyan)" />
            <circle cx="30" cy="14" r="3.5" fill="${anchor === 'cr' ? '#38bdf8' : '#1e293b'}" stroke="#000" stroke-width="0.8" onclick="setTfAnchor('${id}', 'cr')" style="cursor:pointer;" />
            
            <circle cx="6" cy="23" r="3.5" fill="${anchor === 'bl' ? '#38bdf8' : '#1e293b'}" stroke="#000" stroke-width="0.8" onclick="setTfAnchor('${id}', 'bl')" style="cursor:pointer;" />
            <circle cx="18" cy="23" r="3.5" fill="${anchor === 'bc' ? '#38bdf8' : '#1e293b'}" stroke="#000" stroke-width="0.8" onclick="setTfAnchor('${id}', 'bc')" style="cursor:pointer;" />
            <circle cx="30" cy="23" r="3.5" fill="${anchor === 'br' ? '#38bdf8' : '#1e293b'}" stroke="#000" stroke-width="0.8" onclick="setTfAnchor('${id}', 'br')" style="cursor:pointer;" />
            
            <text x="44" y="16" fill="#38bdf8" font-size="8" font-weight="900">${anchor.toUpperCase()}</text>
        </g>

        <!-- Quick Transform Fit & Flip Buttons -->
        <g transform="translate(116, 0)">
            <g onclick="quickTfAction('${id}', 'fit')" style="cursor:pointer;">
                <rect x="0" y="0" width="48" height="19" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
                <text x="24" y="12.5" text-anchor="middle" fill="#38bdf8" font-size="8" font-weight="900">FIT 16:9</text>
            </g>

            <g onclick="quickTfAction('${id}', 'fill')" style="cursor:pointer;" transform="translate(54, 0)">
                <rect x="0" y="0" width="48" height="19" rx="4" fill="#0f172a" stroke="#1e293b" stroke-width="1" />
                <text x="24" y="12.5" text-anchor="middle" fill="#cbd5e1" font-size="8" font-weight="900">FILL</text>
            </g>

            <g onclick="quickTfAction('${id}', 'center')" style="cursor:pointer;" transform="translate(108, 0)">
                <rect x="0" y="0" width="48" height="19" rx="4" fill="#0f172a" stroke="#1e293b" stroke-width="1" />
                <text x="24" y="12.5" text-anchor="middle" fill="#cbd5e1" font-size="8" font-weight="900">CENTER</text>
            </g>

            <g onclick="quickTfAction('${id}', 'flipH')" style="cursor:pointer;" transform="translate(0, 23)">
                <rect x="0" y="0" width="74" height="19" rx="4" fill="#090d16" stroke="#1e293b" stroke-width="1" />
                <text x="37" y="12.5" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="900">↔️ FLIP H</text>
            </g>

            <g onclick="quickTfAction('${id}', 'flipV')" style="cursor:pointer;" transform="translate(80, 23)">
                <rect x="0" y="0" width="76" height="19" rx="4" fill="#090d16" stroke="#1e293b" stroke-width="1" />
                <text x="38" y="12.5" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="900">↕️ FLIP V</text>
            </g>
        </g>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 7: MASTER ACTION BUTTON
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-master-btn" transform="translate(18, 400)">
        <g onclick="applyTfToTimeline('${id}')" style="cursor:pointer;" class="active:scale-[0.98] transition-transform">
            <rect x="0" y="0" width="324" height="38" rx="10" fill="none" stroke="#0284c7" stroke-width="1.8" filter="url(#tf-glow-cyan)" />
            <rect x="1" y="1" width="322" height="36" rx="9" fill="url(#tf-titanium-rim)" stroke="#38bdf8" stroke-width="1" />
            <rect x="3" y="3" width="318" height="32" rx="7" fill="#0284c7" fill-opacity="0.2" />
            
            <polygon points="46,13 46,25 58,19" fill="#38bdf8" filter="url(#tf-glow-cyan)" />
            <text x="175" y="23" text-anchor="middle" fill="#ffffff" font-size="11.5" font-weight="900" letter-spacing="0.1em">⚡ APPLY TRANSFORM TO TIMELINE</text>
        </g>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 8: 6 LUXURIOUS 70px WIDE BOTTOM TABS
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-bottom-tabs" transform="translate(18, 448)">
        <rect x="0" y="0" width="324" height="74" rx="14" fill="#020617" stroke="#1e293b" stroke-width="1.5" />

        <g onclick="scrollTfTabsLeft('${id}')" style="cursor:pointer;" transform="translate(2, 6)">
            <rect x="0" y="0" width="16" height="62" rx="4" fill="#090d16" stroke="#1e293b" stroke-width="1" />
            <path d="M 11,26 L 5,31 L 11,36" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" />
        </g>

        <g onclick="scrollTfTabsRight('${id}')" style="cursor:pointer;" transform="translate(306, 6)">
            <rect x="0" y="0" width="16" height="62" rx="4" fill="#090d16" stroke="#1e293b" stroke-width="1" />
            <path d="M 5,26 L 11,31 L 5,36" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" />
        </g>

        <foreignObject x="22" y="4" width="280" height="66">
            <div xmlns="http://www.w3.org/1999/xhtml" 
                 id="${id}-tabs-viewport"
                 onwheel="event.preventDefault(); this.scrollLeft += (event.deltaY || event.deltaX);"
                 class="w-full h-full flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 select-none"
                 style="scrollbar-width: none; -ms-overflow-style: none;">
                
                <button type="button" id="${id}-tab-anim" onclick="switchTfTab('${id}', 'anim')"
                        class="flex-shrink-0 w-[70px] h-[58px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 ${activeTab === 'anim' ? 'bg-amber-950 border-2 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]' : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800'}">
                    <span class="text-base leading-none">⚡</span>
                    <span class="text-[9px] font-black tracking-wider ${activeTab === 'anim' ? 'text-amber-300' : 'text-slate-400'}">ANIM</span>
                </button>

                <button type="button" id="${id}-tab-color" onclick="switchTfTab('${id}', 'color')"
                        class="flex-shrink-0 w-[70px] h-[58px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 bg-pink-950/80 border border-pink-500/80 hover:border-pink-400 hover:bg-pink-900 shadow">
                    <span class="text-base leading-none">🎨</span>
                    <span class="text-[9px] font-black tracking-wider text-pink-300">COLOR</span>
                </button>

                <button type="button" id="${id}-tab-basic" onclick="switchTfTab('${id}', 'basic')"
                        class="flex-shrink-0 w-[70px] h-[58px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 ${activeTab === 'basic' ? 'bg-cyan-950 border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]' : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800'}">
                    <span class="text-base leading-none">🎬</span>
                    <span class="text-[9px] font-black tracking-wider ${activeTab === 'basic' ? 'text-cyan-300' : 'text-slate-400'}">BASIC</span>
                </button>

                <button type="button" id="${id}-tab-rotate" onclick="switchTfTab('${id}', 'rotate')"
                        class="flex-shrink-0 w-[70px] h-[58px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 ${activeTab === 'rotate' ? 'bg-purple-950 border-2 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.6)]' : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800'}">
                    <span class="text-base leading-none">🔄</span>
                    <span class="text-[9px] font-black tracking-wider ${activeTab === 'rotate' ? 'text-purple-300' : 'text-slate-400'}">3D ROT</span>
                </button>

                <button type="button" id="${id}-tab-crop" onclick="switchTfTab('${id}', 'crop')"
                        class="flex-shrink-0 w-[70px] h-[58px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 ${activeTab === 'crop' ? 'bg-amber-950 border-2 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]' : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800'}">
                    <span class="text-base leading-none">✂️</span>
                    <span class="text-[9px] font-black tracking-wider ${activeTab === 'crop' ? 'text-amber-300' : 'text-slate-400'}">CROP</span>
                </button>

                <button type="button" id="${id}-tab-blend" onclick="switchTfTab('${id}', 'blend')"
                        class="flex-shrink-0 w-[70px] h-[58px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 ${activeTab === 'blend' ? 'bg-emerald-950 border-2 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]' : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800'}">
                    <span class="text-base leading-none">🎭</span>
                    <span class="text-[9px] font-black tracking-wider ${activeTab === 'blend' ? 'text-emerald-300' : 'text-slate-400'}">BLEND</span>
                </button>

                <button type="button" id="${id}-tab-speed" onclick="switchTfTab('${id}', 'speed')"
                        class="flex-shrink-0 w-[70px] h-[58px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 ${activeTab === 'speed' ? 'bg-rose-950 border-2 border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.6)]' : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800'}">
                    <span class="text-base leading-none">⚡</span>
                    <span class="text-[9px] font-black tracking-wider ${activeTab === 'speed' ? 'text-rose-300' : 'text-slate-400'}">SPEED</span>
                </button>

                <button type="button" id="${id}-tab-keyframe" onclick="switchTfTab('${id}', 'keyframe')"
                        class="flex-shrink-0 w-[70px] h-[58px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 ${activeTab === 'keyframe' ? 'bg-indigo-950 border-2 border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.6)]' : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800'}">
                    <span class="text-base leading-none">💎</span>
                    <span class="text-[9px] font-black tracking-wider ${activeTab === 'keyframe' ? 'text-indigo-300' : 'text-slate-400'}">KEYS</span>
                </button>

            </div>
        </foreignObject>
    </g>

    <!-- Home Indicator Bar -->
    <rect x="120" y="534" width="120" height="4" rx="2" fill="#475569" opacity="0.6" />
</svg>
`;
}

module.exports = {
    renderTitanSvgTransformCard,
    TitanSvgTransformCard: renderTitanSvgTransformCard
};
