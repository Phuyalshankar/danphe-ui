'use strict';

/**
 * 🐬 TitanSvgAnimationCard (danphe-ui)
 * Flagship Titanium Mobile Studio Workstation Frame (Width: 360px, Height: 560px)
 * Expansive, Bold & High-Resolution Vector Studio Layout.
 */

function renderTitanSvgAnimationCard(options = {}) {
    const {
        id = 'titan-svg-anim-card',
        activeStage = 'overall',
        activeTab = 'anim',
        textVal = 0,
        colorVal = 0,
        normalVal = 0
    } = options;

    return `
<svg id="${id}" viewBox="0 0 360 440" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" 
     class="select-none filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.98)] w-full max-w-[360px] mx-auto"
     style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; text-rendering: geometricPrecision; -webkit-font-smoothing: antialiased;">
    <defs>
        <!-- ── 1. TITANIUM SMARTPHONE CHASSIS GRADIENTS ── -->
        <linearGradient id="phone-titanium-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#cbd5e1" />
            <stop offset="20%" stop-color="#64748b" />
            <stop offset="50%" stop-color="#1e293b" />
            <stop offset="80%" stop-color="#334155" />
            <stop offset="100%" stop-color="#94a3b8" />
        </linearGradient>

        <linearGradient id="phone-inner-bezel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#020617" />
            <stop offset="50%" stop-color="#050811" />
            <stop offset="100%" stop-color="#000000" />
        </linearGradient>

        <!-- ── 2. GLASS OPTICS & CURVED SPECULAR HIGHLIGHT ── -->
        <linearGradient id="phone-glass-glare" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22" />
            <stop offset="20%" stop-color="#ffffff" stop-opacity="0.05" />
            <stop offset="50%" stop-color="#000000" stop-opacity="0" />
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.06" />
        </linearGradient>

        <!-- ── 3. RECESSED TOUCH SLIDER GROOVES ── -->
        <linearGradient id="phone-slider-groove" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#000000" stop-opacity="1" />
            <stop offset="100%" stop-color="#1e293b" stop-opacity="0.9" />
        </linearGradient>

        <!-- ── 4. NEON LED GLOW FILTERS ── -->
        <filter id="phone-glow-amber" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur2" />
            <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>

        <filter id="phone-glow-cyan" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur2" />
            <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>

        <filter id="phone-glow-emerald" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur2" />
            <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>

        <filter id="phone-glow-rose" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur2" />
            <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>

        <filter id="phone-glow-purple" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur2" />
            <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>

        <filter id="phone-knob-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.95" />
        </filter>

        <!-- ── 5. VIBRANT LED STRIPS ── -->
        <linearGradient id="phone-led-amber" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#d97706" />
            <stop offset="50%" stop-color="#fbbf24" />
            <stop offset="90%" stop-color="#fef08a" />
            <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>

        <linearGradient id="phone-led-cyan" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#0284c7" />
            <stop offset="50%" stop-color="#38bdf8" />
            <stop offset="90%" stop-color="#cffafe" />
            <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>

        <linearGradient id="phone-led-purple" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#9333ea" />
            <stop offset="50%" stop-color="#c084fc" />
            <stop offset="90%" stop-color="#fae8ff" />
            <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>

        <!-- ── 6. SMARTPHONE TOUCH FADER KNOB ── -->
        <linearGradient id="phone-touch-knob" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="30%" stop-color="#cbd5e1" />
            <stop offset="70%" stop-color="#64748b" />
            <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>

        <!-- ── 7. MASTER LAUNCH BUTTON GRADIENT ── -->
        <linearGradient id="phone-apply-btn" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#22d3ee" />
            <stop offset="50%" stop-color="#06b6d4" />
            <stop offset="100%" stop-color="#0284c7" />
        </linearGradient>
    </defs>

    <!-- ═══════════════════════════════════════════════════════════════════════
         1. SMARTPHONE TITANIUM HARDWARE FRAME & SIDE BUTTON ACCENTS
    ═══════════════════════════════════════════════════════════════════════ -->
    <g id="phone-hardware-chassis">
        <!-- Left Volume Buttons -->
        <rect x="0" y="95" width="4" height="28" rx="2" fill="#64748b" />
        <rect x="0" y="132" width="4" height="28" rx="2" fill="#64748b" />
        
        <!-- Right Power / Action Key -->
        <rect x="356" y="110" width="4" height="38" rx="2" fill="#64748b" />

        <!-- Outer Titanium Curvature Body -->
        <rect x="3" y="3" width="354" height="434" rx="38" fill="url(#phone-titanium-rim)" stroke="#0f172a" stroke-width="1.8" />
        
        <!-- Inner Black Screen Bezel (Edge-to-Edge OLED) -->
        <rect x="7" y="7" width="346" height="426" rx="34" fill="url(#phone-inner-bezel)" stroke="#000000" stroke-width="2.2" />
        <rect x="9" y="9" width="342" height="422" rx="32" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.8" />
    </g>

    <!-- Studio Frameless Background Panel (Visible in Without Frame mode) -->
    <rect id="phone-frameless-chassis" x="7" y="7" width="346" height="426" rx="22" fill="#030712" stroke="#334155" stroke-width="1.5" style="display:none;" />

    <!-- ═══════════════════════════════════════════════════════════════════════
         2. SMARTPHONE STATUS BAR & DYNAMIC ISLAND PILL
    ═══════════════════════════════════════════════════════════════════════ -->
    <g id="phone-dynamic-island-group">
        <text id="phone-status-time" x="30" y="25" font-size="10" font-weight="900" fill="#ffffff" letter-spacing="0.5">09:41</text>

        <!-- Dynamic Island Pill -->
        <g transform="translate(130, 14)">
            <rect x="0" y="0" width="100" height="18" rx="9" fill="#000000" stroke="#1e293b" stroke-width="1" />
            <circle cx="14" cy="9" r="3.5" fill="#050811" stroke="#38bdf8" stroke-width="0.8" />
            <circle cx="14" cy="9" r="1.4" fill="#0284c7" />
            <circle cx="86" cy="9" r="2" fill="#22c55e" filter="url(#phone-glow-emerald)" />
            <path d="M44 9h4l2-4 3 8 2-4h5" stroke="#38bdf8" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </g>

        <!-- Status Icons -->
        <g id="phone-status-icons" transform="translate(282, 17)">
            <text x="0" y="8.5" font-size="8.5" font-weight="900" fill="#f8fafc">5G</text>
            <path d="M18 7a4 4 0 0 1 6 0M20 9a2 2 0 0 1 2 0M21 11h.01" stroke="#ffffff" stroke-width="1.2" fill="none" stroke-linecap="round" />
            <rect x="30" y="1" width="18" height="9" rx="2.5" fill="none" stroke="#ffffff" stroke-width="1" />
            <rect x="32" y="2.5" width="12" height="6" rx="1.5" fill="#22c55e" />
            <rect x="48.5" y="3.5" width="1" height="4" rx="0.5" fill="#ffffff" />
        </g>
    </g>

    <!-- ═══════════════════════════════════════════════════════════════════════
         3. SMARTPHONE LIVE OLED VIEWPORT DISPLAY (16:9 SCREEN)
    ═══════════════════════════════════════════════════════════════════════ -->
    <g id="svg-sample-viewport" transform="translate(18, 38)">
        <rect x="0" y="0" width="324" height="114" rx="14" fill="#000000" stroke="#334155" stroke-width="1.2" />
        
        <foreignObject x="1.5" y="1.5" width="321" height="111" style="overflow: hidden; border-radius: 13px;">
            <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; position: relative; border-radius: 13px; overflow: hidden; background: #000;">
                <canvas id="ve-sample-canvas" width="321" height="111" style="width: 100%; height: 100%; display: block; object-fit: cover;"></canvas>
                
                <!-- Dynamic Normal Vector Icon Overlay -->
                <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none;">
                    <div id="ve-sample-icon" class="text-cyan-300 drop-shadow-[0_0_22px_rgba(6,182,212,0.95)] titan-anim-laser">
                        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    </div>
                </div>

                <!-- Dynamic Kinetic Text Overlay -->
                <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; text-align: center; padding: 6px;">
                    <div id="ve-sample-text" style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 900; font-size: 12px; color: #fde047; text-shadow: 0 2px 14px rgba(0,0,0,1), 0 0 10px rgba(253,224,71,0.5); letter-spacing: 1.5px; text-transform: uppercase;">
                        DANPHE CINEMA STUDIO
                    </div>
                </div>
            </div>
        </foreignObject>

        <!-- Curved Glass Optical Glare Overlay -->
        <path d="M1.5,1.5 L322.5,1.5 L322.5,44 L1.5,14 Z" fill="url(#phone-glass-glare)" pointer-events="none" />

        <!-- Live Camera HUD Badge -->
        <rect x="6" y="6" width="64" height="14" rx="4" fill="rgba(0,0,0,0.92)" stroke="#06b6d4" stroke-width="1" />
        <circle cx="12" cy="13" r="2.8" fill="#06b6d4" filter="url(#phone-glow-cyan)" />
        <text x="18" y="17" font-size="8" font-weight="900" fill="#38bdf8" letter-spacing="0.5">120 FPS</text>

        <!-- Lifecycle Stage Badge inside OLED -->
        <rect id="oled-stage-badge" x="248" y="6" width="70" height="14" rx="4" fill="#021d1d" stroke="#14b8a6" stroke-width="1" />
        <text id="oled-stage-text" x="283" y="17" font-size="8" font-weight="900" fill="#2dd4bf" text-anchor="middle" letter-spacing="0.5">OVERALL</text>
    </g>

    <!-- ═══════════════════════════════════════════════════════════════════════
         4. 🎬 4-STAGE ANIMATION LIFECYCLE SELECTOR PILLS
    ═══════════════════════════════════════════════════════════════════════ -->
    <g id="svg-lifecycle-pills" transform="translate(18, 160)">
        <!-- Pill 1: 🟢 IN -->
        <g id="stage-btn-in" class="cursor-pointer" onclick="switchAnimStage('in')">
            <rect x="0" y="0" width="74" height="24" rx="8" fill="#062417" stroke="#22c55e" stroke-width="1.2" />
            <circle cx="11" cy="12" r="3.8" fill="#4ade80" filter="url(#phone-glow-emerald)" />
            <text x="43" y="16.5" font-size="9.5" font-weight="900" fill="#86efac" text-anchor="middle" letter-spacing="0.5">IN (FX)</text>
        </g>

        <!-- Pill 2: 🔵 OVERALL (ACTIVE DEFAULT) -->
        <g id="stage-btn-overall" class="cursor-pointer" transform="translate(80, 0)" onclick="switchAnimStage('overall')">
            <rect x="0" y="0" width="84" height="24" rx="8" fill="#082b47" stroke="#38bdf8" stroke-width="1.5" filter="url(#phone-glow-cyan)" />
            <circle cx="12" cy="12" r="3.8" fill="#38bdf8" />
            <text x="49" y="16.5" font-size="9.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">OVERALL</text>
        </g>

        <!-- Pill 3: 🔴 OUT -->
        <g id="stage-btn-out" class="cursor-pointer" transform="translate(170, 0)" onclick="switchAnimStage('out')">
            <rect x="0" y="0" width="74" height="24" rx="8" fill="#2d0c12" stroke="#ef4444" stroke-width="1.2" />
            <circle cx="11" cy="12" r="3.8" fill="#f87171" filter="url(#phone-glow-rose)" />
            <text x="43" y="16.5" font-size="9.5" font-weight="900" fill="#fca5a5" text-anchor="middle" letter-spacing="0.5">OUT (FX)</text>
        </g>

        <!-- Pill 4: 🟣 TRANS -->
        <g id="stage-btn-trans" class="cursor-pointer" transform="translate(250, 0)" onclick="switchAnimStage('trans')">
            <rect x="0" y="0" width="74" height="24" rx="8" fill="#240c38" stroke="#a855f7" stroke-width="1.2" />
            <circle cx="11" cy="12" r="3.8" fill="#c084fc" filter="url(#phone-glow-purple)" />
            <text x="43" y="16.5" font-size="9.5" font-weight="900" fill="#e9d5ff" text-anchor="middle" letter-spacing="0.5">TRANS</text>
        </g>
    </g>

    <!-- ═══════════════════════════════════════════════════════════════════════
         5. SLIDER 1: 🔤 ACTIVE STAGE OPCODE (0 - 255)
    ═══════════════════════════════════════════════════════════════════════ -->
    <g id="svg-slider-text-group" transform="translate(18, 192)">
        <text id="lbl-slider-1-name" x="2" y="10" font-size="9.5" font-weight="900" fill="#fde047" letter-spacing="0.5">1. ANIMATION EFFECT (OPCODE)</text>
        
        <g transform="translate(160, -2)">
            <rect x="0" y="0" width="164" height="16" rx="4" fill="#1c1202" stroke="#f59e0b" stroke-width="1" />
            <text id="svg-badge-text-val" x="82" y="11.5" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle">0x00 (STATIC NORMAL)</text>
        </g>

        <!-- Controls Row -->
        <g transform="translate(0, 16)">
            <!-- [ ◀ ] -->
            <g class="cursor-pointer" onclick="stepSvgChannel('text', -1)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M14 8L10 12L14 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- Touch Track -->
            <g transform="translate(29, 0)">
                <rect x="0" y="0" width="216" height="24" rx="6" fill="#090d16" stroke="#334155" stroke-width="1.2" />
                <rect x="6" y="9" width="204" height="6" rx="3" fill="url(#phone-slider-groove)" stroke="#090d14" stroke-width="0.8" />
                <rect id="svg-fill-text" x="7" y="10" width="2" height="4" rx="2" fill="url(#phone-led-amber)" filter="url(#phone-glow-amber)" />
                <g id="svg-knob-text" transform="translate(6, 12)" filter="url(#phone-knob-shadow)" cursor="ew-resize">
                    <circle cx="0" cy="0" r="8.5" fill="url(#phone-touch-knob)" stroke="#fde047" stroke-width="1.3" />
                    <circle cx="0" cy="0" r="3.2" fill="#f59e0b" filter="url(#phone-glow-amber)" />
                </g>
                <rect id="svg-hit-text" x="0" y="0" width="216" height="24" fill="transparent" cursor="ew-resize" />
            </g>

            <!-- [ ▶ ] -->
            <g class="cursor-pointer" transform="translate(250, 0)" onclick="stepSvgChannel('text', 1)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M10 8L14 12L10 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <!-- [ 000 ] -->
            <g transform="translate(278, 0)">
                <rect x="0" y="0" width="46" height="24" rx="6" fill="#1c1202" stroke="#f59e0b" stroke-width="1.2" />
                <text id="svg-num-text-box" x="23" y="16.5" font-size="11" font-weight="900" fill="#fde047" text-anchor="middle" letter-spacing="0.8">000</text>
            </g>
        </g>
    </g>

    <!-- ═══════════════════════════════════════════════════════════════════════
         6. SLIDER 2: ⏱️ DURATION / TIME SCALE
    ═══════════════════════════════════════════════════════════════════════ -->
    <g id="svg-slider-color-group" transform="translate(18, 246)">
        <text id="lbl-slider-2-name" x="2" y="10" font-size="9.5" font-weight="900" fill="#38bdf8" letter-spacing="0.5">2. DURATION / COLOR (0.8s)</text>
        
        <g transform="translate(170, -2)">
            <rect x="0" y="0" width="154" height="16" rx="4" fill="#04202e" stroke="#06b6d4" stroke-width="1" />
            <text id="svg-badge-color-val" x="77" y="11.5" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle">0x00 (CLEAN)</text>
        </g>

        <g transform="translate(0, 16)">
            <g class="cursor-pointer" onclick="stepSvgChannel('color', -1)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M14 8L10 12L14 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <g transform="translate(29, 0)">
                <rect x="0" y="0" width="216" height="24" rx="6" fill="#090d16" stroke="#334155" stroke-width="1.2" />
                <rect x="6" y="9" width="204" height="6" rx="3" fill="url(#phone-slider-groove)" stroke="#090d14" stroke-width="0.8" />
                <rect id="svg-fill-color" x="7" y="10" width="3" height="4" rx="2" fill="url(#phone-led-cyan)" filter="url(#phone-glow-cyan)" />
                <g id="svg-knob-color" transform="translate(6, 12)" filter="url(#phone-knob-shadow)" cursor="ew-resize">
                    <circle cx="0" cy="0" r="8.5" fill="url(#phone-touch-knob)" stroke="#38bdf8" stroke-width="1.3" />
                    <circle cx="0" cy="0" r="3.2" fill="#06b6d4" filter="url(#phone-glow-cyan)" />
                </g>
                <rect id="svg-hit-color" x="0" y="0" width="216" height="24" fill="transparent" cursor="ew-resize" />
            </g>

            <g class="cursor-pointer" transform="translate(250, 0)" onclick="stepSvgChannel('color', 1)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M10 8L14 12L10 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <g transform="translate(278, 0)">
                <rect x="0" y="0" width="46" height="24" rx="6" fill="#04202e" stroke="#06b6d4" stroke-width="1.2" />
                <text id="svg-num-color-box" x="23" y="16.5" font-size="11" font-weight="900" fill="#38bdf8" text-anchor="middle" letter-spacing="0.8">000</text>
            </g>
        </g>
    </g>

    <!-- ═══════════════════════════════════════════════════════════════════════
         7. SLIDER 3: ⚡ EASING CURVE / MOTION
    ═══════════════════════════════════════════════════════════════════════ -->
    <g id="svg-slider-normal-group" transform="translate(18, 300)">
        <text id="lbl-slider-3-name" x="2" y="10" font-size="9.5" font-weight="900" fill="#c084fc" letter-spacing="0.5">3. EASING CURVE / MOTION</text>
        
        <g transform="translate(170, -2)">
            <rect x="0" y="0" width="154" height="16" rx="4" fill="#1e092e" stroke="#a855f7" stroke-width="1" />
            <text id="svg-badge-normal-val" x="77" y="11.5" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle">0x00 (SMOOTH)</text>
        </g>

        <g transform="translate(0, 16)">
            <g class="cursor-pointer" onclick="stepSvgChannel('normal', -1)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M14 8L10 12L14 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <g transform="translate(29, 0)">
                <rect x="0" y="0" width="216" height="24" rx="6" fill="#090d16" stroke="#334155" stroke-width="1.2" />
                <rect x="6" y="9" width="204" height="6" rx="3" fill="url(#phone-slider-groove)" stroke="#090d14" stroke-width="0.8" />
                <rect id="svg-fill-normal" x="7" y="10" width="3" height="4" rx="2" fill="url(#phone-led-purple)" filter="url(#phone-glow-purple)" />
                <g id="svg-knob-normal" transform="translate(6, 12)" filter="url(#phone-knob-shadow)" cursor="ew-resize">
                    <circle cx="0" cy="0" r="8.5" fill="url(#phone-touch-knob)" stroke="#c084fc" stroke-width="1.3" />
                    <circle cx="0" cy="0" r="3.2" fill="#a855f7" filter="url(#phone-glow-purple)" />
                </g>
                <rect id="svg-hit-normal" x="0" y="0" width="216" height="24" fill="transparent" cursor="ew-resize" />
            </g>

            <g class="cursor-pointer" transform="translate(250, 0)" onclick="stepSvgChannel('normal', 1)">
                <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                <path d="M10 8L14 12L10 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </g>

            <g transform="translate(278, 0)">
                <rect x="0" y="0" width="46" height="24" rx="6" fill="#1e092e" stroke="#a855f7" stroke-width="1.2" />
                <text id="svg-num-normal-box" x="23" y="16.5" font-size="11" font-weight="900" fill="#e9d5ff" text-anchor="middle" letter-spacing="0.8">000</text>
            </g>
        </g>
    </g>

    <!-- ═══════════════════════════════════════════════════════════════════════
         8. 📱 PRO HORIZONTAL SCROLLABLE TAB DOCK (6 TABS, 70px WIDE)
    ═══════════════════════════════════════════════════════════════════════ -->
    <!-- Scroll Arrow Left -->
    <g class="cursor-pointer" transform="translate(2, 360)" onclick="scrollAnimTabsLeft('dolphin-anim-card')">
        <rect x="0" y="0" width="16" height="58" rx="4" fill="#090d16" fill-opacity="0.9" stroke="#1e293b" stroke-width="1" />
        <path d="M10 24 L5 29 L10 34" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" fill="none" />
    </g>

    <!-- Scroll Arrow Right -->
    <g class="cursor-pointer" transform="translate(342, 360)" onclick="scrollAnimTabsRight('dolphin-anim-card')">
        <rect x="0" y="0" width="16" height="58" rx="4" fill="#090d16" fill-opacity="0.9" stroke="#1e293b" stroke-width="1" />
        <path d="M6 24 L11 29 L6 34" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" fill="none" />
    </g>

    <g id="dolphin-anim-card-bottom-tabs-dock" transform="translate(20, 360)">
        <foreignObject x="0" y="0" width="320" height="58">
            <div xmlns="http://www.w3.org/1999/xhtml" id="dolphin-anim-card-tabs-viewport" 
                 style="display:flex; align-items:center; gap:6px; width:100%; height:100%; overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none; box-sizing:border-box; padding-bottom:4px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <!-- Tab 1: ⚡ ANIM (ACTIVE) -->
                <button type="button" id="dolphin-anim-card-tab-anim" onclick="switchAnimTab('dolphin-anim-card', 'anim')"
                        style="flex-shrink:0; width:70px; height:58px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:10px; background:#082f49; border:2px solid #38bdf8; box-shadow:0 0 12px rgba(56,189,248,0.5); cursor:pointer; color:#ffffff;">
                    <span style="font-size:16px; line-height:1;">⚡</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#38bdf8;">ANIM</span>
                </button>

                <!-- Tab 2: 📐 TRANSFORM -->
                <button type="button" id="dolphin-anim-card-tab-transform" onclick="switchAnimTab('dolphin-anim-card', 'transform')"
                        style="flex-shrink:0; width:70px; height:58px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:16px; line-height:1;">📐</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#fbbf24;">TRANSFORM</span>
                </button>

                <!-- Tab 3: 🎨 COLOR -->
                <button type="button" id="dolphin-anim-card-tab-color" onclick="switchAnimTab('dolphin-anim-card', 'color')"
                        style="flex-shrink:0; width:70px; height:58px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:16px; line-height:1;">🎨</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#f472b6;">COLOR</span>
                </button>

                <!-- Tab 4: 🔤 TYPO -->
                <button type="button" id="dolphin-anim-card-tab-typo" onclick="switchAnimTab('dolphin-anim-card', 'typo')"
                        style="flex-shrink:0; width:70px; height:58px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:16px; line-height:1;">🔤</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#fde047;">TYPO</span>
                </button>

                <!-- Tab 5: 💥 VFX -->
                <button type="button" id="dolphin-anim-card-tab-vfx" onclick="switchAnimTab('dolphin-anim-card', 'vfx')"
                        style="flex-shrink:0; width:70px; height:58px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:16px; line-height:1;">💥</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#ef4444;">VFX</span>
                </button>

                <!-- Tab 6: 🖼️ THUMB -->
                <button type="button" id="dolphin-anim-card-tab-thumb" onclick="switchAnimTab('dolphin-anim-card', 'thumb')"
                        style="flex-shrink:0; width:70px; height:58px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:16px; line-height:1;">🖼️</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#a855f7;">THUMB</span>
                </button>

            </div>
        </foreignObject>
    </g>

    <!-- ═══════════════════════════════════════════════════════════════════════
         9. SMARTPHONE HOME INDICATOR BAR
    ═══════════════════════════════════════════════════════════════════════ -->
    <rect x="120" y="428" width="120" height="4.5" rx="2.25" fill="#ffffff" fill-opacity="0.4" />

</svg>
`;
}

module.exports = {
    renderTitanSvgAnimationCard,
    TitanSvgAnimationCard: renderTitanSvgAnimationCard
};
