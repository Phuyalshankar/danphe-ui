'use strict';

/**
 * 🐬 TITAN SVG TYPOGRAPHY & FONT STUDIO CARD (<TitanSvgTypoCard />)
 * Silicon-Grade Pure Vector 360x560px Typography, Subtitle & Text Studio Card
 * 5-Tab Flagship Architecture:
 * 1. [ 🔤 FONT ]: 256 World Font Bank, Font Size, Curve Arc Bend (-180° to +180°)
 * 2. [ ✨ STROKE ]: Text Outline Stroke, 6 Color Presets, Glow Radius
 * 3. [ 📦 BG PAD ]: Subtitle Highlight Box (Obsidian, Red, Gold, Glass), Opacity, Radius
 * 4. [ 🌈 GRADIENT ]: Multi-color Text Fills (Sunset, Cyber, Chrome, Emerald, Amethyst)
 * 5. [ 🎤 KARAOKE ]: CapCut Word-by-Word Active Glow, Word Speed & 4 Viral Templates
 */

const { FONTS_256, getFontFromOpcode } = require('../fonts/index.js');

function renderTitanSvgTypoCard(options = {}) {
    const {
        id = 'titan-svg-typo-card',
        fontOpcode = 32, // 0x20 Sagarmatha Display by default
        fontSize = 28,
        textContent = 'डाँफे सिनेमा स्टुडियो',
        activeTab = 'font', // 'font' | 'stroke' | 'bg' | 'grad' | 'karaoke'
        strokeWidth = 3,
        strokeColor = '#000000',
        bgStyle = 'obsidian',
        bgOpacity = 80,
        fillColor = '#fbbf24',
        curveArc = 0,
        isKaraoke = false,
        isFrameMode = true
    } = options;

    const currentFont = getFontFromOpcode(fontOpcode);
    const hexOpcode = '0x' + (fontOpcode || 0).toString(16).toUpperCase().padStart(2, '0');

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
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.7" />
            <stop offset="50%" stop-color="#ea580c" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.7" />
        </linearGradient>

        <linearGradient id="${id}-oled-viewport-bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#030712" />
            <stop offset="100%" stop-color="#090d16" />
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

        <!-- Multi-Color Gradient Text Fills -->
        <linearGradient id="${id}-grad-sunset" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#f59e0b" />
            <stop offset="100%" stop-color="#ef4444" />
        </linearGradient>

        <linearGradient id="${id}-grad-cyber" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#06b6d4" />
            <stop offset="100%" stop-color="#ec4899" />
        </linearGradient>

        <linearGradient id="${id}-grad-chrome" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="50%" stop-color="#64748b" />
            <stop offset="100%" stop-color="#f8fafc" />
        </linearGradient>

        <linearGradient id="${id}-grad-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#34d399" />
            <stop offset="100%" stop-color="#059669" />
        </linearGradient>

        <linearGradient id="${id}-grad-amethyst" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#c084fc" />
            <stop offset="100%" stop-color="#7e22ce" />
        </linearGradient>

        <!-- Filters -->
        <filter id="${id}-glow-amber" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
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
         LAYER 2: TOP HEADER & DYNAMIC ISLAND
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-header-group" transform="translate(18, 14)">
        <rect x="74" y="0" width="176" height="20" rx="10" fill="#000000" stroke="#1e293b" stroke-width="1" />
        <circle cx="90" cy="10" r="3.5" fill="#f59e0b" filter="url(#${id}-glow-amber)" />
        <text id="${id}-oled-status-text" x="168" y="13.5" font-size="8.5" font-family="'JetBrains Mono', monospace" font-weight="900" fill="#fde68a" text-anchor="middle" letter-spacing="0.5">FLAGSHIP TYPOGRAPHY</text>
        <text x="2" y="34" font-size="10.5" font-family="'JetBrains Mono', monospace" font-weight="900" fill="#ffffff" letter-spacing="0.8">🔤 TITAN TYPOGRAPHY STUDIO</text>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 3: TOP 16:9 OLED LIVE TYPOGRAPHY VIEWPORT (324 x 104px)
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-viewport-group" transform="translate(18, 54)">
        <rect x="0" y="0" width="324" height="104" rx="14" fill="url(#${id}-oled-viewport-bg)" stroke="#1e293b" stroke-width="1.4" />
        <line x1="0" y1="52" x2="324" y2="52" stroke="#0f172a" stroke-width="0.8" stroke-dasharray="3 3" />
        <line x1="162" y1="0" x2="162" y2="104" stroke="#0f172a" stroke-width="0.8" stroke-dasharray="3 3" />

        <!-- Live Typography Preview Stage -->
        <g id="${id}-live-text-stage" transform="translate(162, 52)">
            <!-- Optional Subtitle Background Box -->
            <rect id="${id}-preview-bg-pad" x="-130" y="-22" width="260" height="44" rx="8" fill="#000000" fill-opacity="0.8" stroke="#38bdf8" stroke-width="1" />
            <!-- Main Text Preview with Stroke & Fill -->
            <text id="${id}-live-text-primary" x="0" y="2" text-anchor="middle" font-size="${Math.min(26, fontSize)}" font-family="${currentFont.family}" font-weight="900" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round" letter-spacing="1px" filter="url(#${id}-glow-amber)">
                ${textContent}
            </text>
            <text id="${id}-live-text-secondary" x="0" y="20" text-anchor="middle" font-size="8.5" font-family="${currentFont.family}" font-weight="700" fill="#94a3b8" letter-spacing="1.5px">
                ${currentFont.name.toUpperCase()} • ${hexOpcode}
            </text>
        </g>

        <!-- Viewport HUD Overlay Badges -->
        <g transform="translate(8, 8)">
            <rect x="0" y="0" width="130" height="14" rx="4" fill="#000000" fill-opacity="0.8" stroke="#334155" stroke-width="0.8" />
            <text id="${id}-hud-fontname" x="65" y="10" font-size="8" font-family="'JetBrains Mono', monospace" font-weight="900" fill="#38bdf8" text-anchor="middle">${currentFont.name.slice(0, 18)}</text>
        </g>
        <g transform="translate(230, 8)">
            <rect x="0" y="0" width="86" height="14" rx="4" fill="#000000" fill-opacity="0.8" stroke="#f59e0b" stroke-width="0.8" />
            <text id="${id}-hud-opcode" x="43" y="10" font-size="8" font-family="'JetBrains Mono', monospace" font-weight="900" fill="#fde047" text-anchor="middle">OPCODE ${hexOpcode}</text>
        </g>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 4: DIRECT LIVE TEXT INPUT BOX
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-input-group" transform="translate(18, 166)">
        <foreignObject x="0" y="0" width="324" height="38">
            <div xmlns="http://www.w3.org/1999/xhtml" class="w-full h-full relative flex items-center">
                <input id="${id}-input-text" type="text" value="${textContent}" 
                       oninput="onTypoTextInput('${id}', this.value)" 
                       placeholder="Type custom text / क्याप्सन लेख्नुहोस्..." 
                       class="w-full h-full bg-[#060913] rounded-xl border border-amber-500/50 hover:border-amber-400 focus:border-amber-400 px-3 text-xs font-bold text-amber-200 placeholder-slate-500 focus:outline-none shadow-inner transition-all" />
                <span class="absolute right-3 text-xs text-amber-400 pointer-events-none">✍️</span>
            </div>
        </foreignObject>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 5: 5-SUB-TAB NAVIGATION BAR (FONT • STROKE • BG PAD • GRADIENT • KARAOKE)
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-tab-bar-group" transform="translate(18, 212)">
        <foreignObject x="0" y="0" width="324" height="30">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; gap:2px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <button id="${id}-subtab-font" onclick="switchTypoSubTab('font')" 
                        style="flex:1; height:26px; background:${activeTab === 'font' ? '#ea580c' : '#0f172a'}; color:${activeTab === 'font' ? '#ffffff' : '#fb923c'}; border:1px solid ${activeTab === 'font' ? '#fb923c' : '#334155'}; border-radius:5px; font-size:8px; font-weight:900; cursor:pointer;">
                    🔤 FONT
                </button>
                <button id="${id}-subtab-stroke" onclick="switchTypoSubTab('stroke')" 
                        style="flex:1.1; height:26px; background:${activeTab === 'stroke' ? '#0284c7' : '#0f172a'}; color:${activeTab === 'stroke' ? '#ffffff' : '#38bdf8'}; border:1px solid ${activeTab === 'stroke' ? '#38bdf8' : '#334155'}; border-radius:5px; font-size:8px; font-weight:900; cursor:pointer;">
                    ✨ STROKE
                </button>
                <button id="${id}-subtab-bg" onclick="switchTypoSubTab('bg')" 
                        style="flex:1.1; height:26px; background:${activeTab === 'bg' ? '#7e22ce' : '#0f172a'}; color:${activeTab === 'bg' ? '#ffffff' : '#c084fc'}; border:1px solid ${activeTab === 'bg' ? '#c084fc' : '#334155'}; border-radius:5px; font-size:8px; font-weight:900; cursor:pointer;">
                    📦 BG PAD
                </button>
                <button id="${id}-subtab-grad" onclick="switchTypoSubTab('grad')" 
                        style="flex:1.1; height:26px; background:${activeTab === 'grad' ? '#b45309' : '#0f172a'}; color:${activeTab === 'grad' ? '#ffffff' : '#fbbf24'}; border:1px solid ${activeTab === 'grad' ? '#fbbf24' : '#334155'}; border-radius:5px; font-size:8px; font-weight:900; cursor:pointer;">
                    🌈 GRAD
                </button>
                <button id="${id}-subtab-karaoke" onclick="switchTypoSubTab('karaoke')" 
                        style="flex:1.2; height:26px; background:${activeTab === 'karaoke' ? '#047857' : '#0f172a'}; color:${activeTab === 'karaoke' ? '#ffffff' : '#34d399'}; border:1px solid ${activeTab === 'karaoke' ? '#34d399' : '#334155'}; border-radius:5px; font-size:8px; font-weight:900; cursor:pointer;">
                    🎤 KARAOKE
                </button>
            </div>
        </foreignObject>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 1: 🔤 FONT BANK, SIZE & CURVE ARC BEND (3-CHANNEL TACTILE SVG SLIDERS)
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-font" style="${activeTab === 'font' ? '' : 'display:none;'}">
        <!-- ── SLIDER 1: FONT BANK (0 - 255) ── -->
        <g id="${id}-slider-font-group" transform="translate(18, 246)">
            <text id="${id}-lbl-font" x="2" y="10" font-size="9.5" font-weight="900" fill="#f59e0b" letter-spacing="0.5">1. FONT BANK (${fontOpcode}) — ${currentFont.name.slice(0, 14)}</text>
            
            <g transform="translate(170, -2)">
                <rect x="0" y="0" width="154" height="16" rx="4" fill="#301502" stroke="#f59e0b" stroke-width="1" />
                <text id="${id}-badge-font" x="77" y="11.5" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle">REG 0x4130 (FONT)</text>
            </g>

            <!-- Controls Row -->
            <g transform="translate(0, 16)">
                <!-- [ ◀ ] -->
                <g class="cursor-pointer" onclick="stepTypoChannel('${id}', 'font', -1)">
                    <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                    <path d="M14 8L10 12L14 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                </g>

                <!-- Touch Track (204px) -->
                <g transform="translate(29, 0)">
                    <rect x="0" y="0" width="204" height="24" rx="6" fill="#090d16" stroke="#334155" stroke-width="1.2" />
                    <rect x="6" y="9" width="192" height="6" rx="3" fill="#1e1b4b" stroke="#090d14" stroke-width="0.8" />
                    <rect id="${id}-fill-font" x="7" y="10" width="${Math.max(6, (fontOpcode / 255) * 190)}" height="4" rx="2" fill="#f59e0b" filter="url(#${id}-glow-gold)" />
                    <g id="${id}-knob-font" transform="translate(${7 + (fontOpcode / 255) * 190}, 12)" cursor="ew-resize" pointer-events="none">
                        <circle cx="0" cy="0" r="8.5" fill="url(#${id}-touch-knob)" stroke="#fbbf24" stroke-width="1.3" />
                        <circle cx="0" cy="0" r="3.2" fill="#f59e0b" filter="url(#${id}-glow-gold)" />
                    </g>
                    <rect id="${id}-hit-font" x="0" y="0" width="204" height="24" rx="6" fill="#000000" fill-opacity="0.001" pointer-events="all" cursor="ew-resize" />
                </g>

                <!-- [ ▶ ] -->
                <g class="cursor-pointer" transform="translate(238, 0)" onclick="stepTypoChannel('${id}', 'font', 1)">
                    <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                    <path d="M10 8L14 12L10 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                </g>

                <!-- [ 000 ] -->
                <g transform="translate(266, 0)">
                    <rect x="0" y="0" width="58" height="24" rx="6" fill="#301502" stroke="#f59e0b" stroke-width="1.2" />
                    <text id="${id}-val-font" x="29" y="16.5" font-size="11" font-weight="900" fill="#fbbf24" text-anchor="middle" letter-spacing="0.5">${fontOpcode.toString().padStart(3, '0')}</text>
                </g>
            </g>
        </g>

        <!-- ── SLIDER 2: FONT SIZE (12px - 144px) ── -->
        <g id="${id}-slider-size-group" transform="translate(18, 292)">
            <text id="${id}-lbl-size" x="2" y="10" font-size="9.5" font-weight="900" fill="#38bdf8" letter-spacing="0.5">2. FONT SIZE (${fontSize}px)</text>
            
            <g transform="translate(170, -2)">
                <rect x="0" y="0" width="154" height="16" rx="4" fill="#041f33" stroke="#0284c7" stroke-width="1" />
                <text id="${id}-badge-size" x="77" y="11.5" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle">REG 0x4200 (SIZE)</text>
            </g>

            <!-- Controls Row -->
            <g transform="translate(0, 16)">
                <!-- [ ◀ ] -->
                <g class="cursor-pointer" onclick="stepTypoChannel('${id}', 'size', -4)">
                    <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                    <path d="M14 8L10 12L14 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                </g>

                <!-- Touch Track (204px) -->
                <g transform="translate(29, 0)">
                    <rect x="0" y="0" width="204" height="24" rx="6" fill="#090d16" stroke="#334155" stroke-width="1.2" />
                    <rect x="6" y="9" width="192" height="6" rx="3" fill="#0c2338" stroke="#090d14" stroke-width="0.8" />
                    <rect id="${id}-fill-size" x="7" y="10" width="${Math.max(6, ((fontSize - 12) / 132) * 190)}" height="4" rx="2" fill="#0284c7" filter="url(#${id}-glow-blue)" />
                    <g id="${id}-knob-size" transform="translate(${7 + ((fontSize - 12) / 132) * 190}, 12)" cursor="ew-resize" pointer-events="none">
                        <circle cx="0" cy="0" r="8.5" fill="url(#${id}-touch-knob)" stroke="#38bdf8" stroke-width="1.3" />
                        <circle cx="0" cy="0" r="3.2" fill="#0284c7" filter="url(#${id}-glow-blue)" />
                    </g>
                    <rect id="${id}-hit-size" x="0" y="0" width="204" height="24" rx="6" fill="#000000" fill-opacity="0.001" pointer-events="all" cursor="ew-resize" />
                </g>

                <!-- [ ▶ ] -->
                <g class="cursor-pointer" transform="translate(238, 0)" onclick="stepTypoChannel('${id}', 'size', 4)">
                    <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                    <path d="M10 8L14 12L10 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                </g>

                <!-- [ 064px ] -->
                <g transform="translate(266, 0)">
                    <rect x="0" y="0" width="58" height="24" rx="6" fill="#041f33" stroke="#0284c7" stroke-width="1.2" />
                    <text id="${id}-val-size" x="29" y="16.5" font-size="11" font-weight="900" fill="#38bdf8" text-anchor="middle" letter-spacing="0.5">${fontSize}px</text>
                </g>
            </g>
        </g>

        <!-- ── SLIDER 3: CURVED ARC BEND (-180° to +180°) ── -->
        <g id="${id}-slider-arc-group" transform="translate(18, 338)">
            <text id="${id}-lbl-arc" x="2" y="10" font-size="9.5" font-weight="900" fill="#fbbf24" letter-spacing="0.5">3. CURVE ARC BEND (${curveArc >= 0 ? '+' : ''}${curveArc}°)</text>
            
            <g transform="translate(170, -2)">
                <rect x="0" y="0" width="154" height="16" rx="4" fill="#2d1602" stroke="#d97706" stroke-width="1" />
                <text id="${id}-badge-arc" x="77" y="11.5" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle">REG 0x4209 (ARC)</text>
            </g>

            <!-- Controls Row -->
            <g transform="translate(0, 16)">
                <!-- [ ◀ ] -->
                <g class="cursor-pointer" onclick="stepTypoChannel('${id}', 'arc', -15)">
                    <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                    <path d="M14 8L10 12L14 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                </g>

                <!-- Touch Track (204px) -->
                <g transform="translate(29, 0)">
                    <rect x="0" y="0" width="204" height="24" rx="6" fill="#090d16" stroke="#334155" stroke-width="1.2" />
                    <rect x="6" y="9" width="192" height="6" rx="3" fill="#2d1602" stroke="#090d14" stroke-width="0.8" />
                    <rect id="${id}-fill-arc" x="7" y="10" width="${Math.max(6, ((curveArc + 180) / 360) * 190)}" height="4" rx="2" fill="#d97706" filter="url(#${id}-glow-amber)" />
                    <g id="${id}-knob-arc" transform="translate(${7 + ((curveArc + 180) / 360) * 190}, 12)" cursor="ew-resize" pointer-events="none">
                        <circle cx="0" cy="0" r="8.5" fill="url(#${id}-touch-knob)" stroke="#fbbf24" stroke-width="1.3" />
                        <circle cx="0" cy="0" r="3.2" fill="#d97706" filter="url(#${id}-glow-amber)" />
                    </g>
                    <rect id="${id}-hit-arc" x="0" y="0" width="204" height="24" rx="6" fill="#000000" fill-opacity="0.001" pointer-events="all" cursor="ew-resize" />
                </g>

                <!-- [ ▶ ] -->
                <g class="cursor-pointer" transform="translate(238, 0)" onclick="stepTypoChannel('${id}', 'arc', 15)">
                    <rect x="0" y="0" width="24" height="24" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.2" />
                    <path d="M10 8L14 12L10 16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                </g>

                <!-- [ 000° ] -->
                <g transform="translate(266, 0)">
                    <rect x="0" y="0" width="58" height="24" rx="6" fill="#2d1602" stroke="#d97706" stroke-width="1.2" />
                    <text id="${id}-val-arc" x="29" y="16.5" font-size="11" font-weight="900" fill="#fbbf24" text-anchor="middle" letter-spacing="0.5">${curveArc >= 0 ? '+' : ''}${curveArc}°</text>
                </g>
            </g>

            <!-- Curve Preset Buttons -->
            <g transform="translate(0, 46)">
                <foreignObject x="0" y="0" width="324" height="24">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:4px; width:100%; height:100%;">
                        <button onclick="setTypoCurveArc(180)" style="height:22px; background:#451a03; color:#fbbf24; border:1px solid #f59e0b; border-radius:4px; font-size:7.5px; font-weight:900; cursor:pointer;">🌈 +180° Arch</button>
                        <button onclick="setTypoCurveArc(-180)" style="height:22px; background:#082f49; color:#38bdf8; border:1px solid #0284c7; border-radius:4px; font-size:7.5px; font-weight:900; cursor:pointer;">😃 -180° Smile</button>
                        <button onclick="setTypoCurveArc(360)" style="height:22px; background:#2e1065; color:#c084fc; border:1px solid #a855f7; border-radius:4px; font-size:7.5px; font-weight:900; cursor:pointer;">⭕ 360° Ring</button>
                        <button onclick="setTypoCurveArc(0)" style="height:22px; background:#0f172a; color:#94a3b8; border:1px solid #334155; border-radius:4px; font-size:7.5px; font-weight:900; cursor:pointer;">➡️ Flat 0°</button>
                    </div>
                </foreignObject>
            </g>
        </g>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 2: ✨ TEXT OUTLINE STROKE & GLOW
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-stroke" style="${activeTab === 'stroke' ? '' : 'display:none;'}">
        <foreignObject x="18" y="246" width="324" height="150">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:6px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <span style="font-size:8.5px; font-weight:900; color:#38bdf8;">TEXT OUTLINE STROKE COLOR:</span>
                <div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:3px;">
                    <button onclick="setTypoStrokeColor('#000000')" style="height:26px; background:#000000; color:#ffffff; border:1.5px solid #38bdf8; border-radius:4px; font-size:8px; font-weight:900; cursor:pointer;">⬛ Black</button>
                    <button onclick="setTypoStrokeColor('#ffffff')" style="height:26px; background:#ffffff; color:#000000; border:1px solid #334155; border-radius:4px; font-size:8px; font-weight:900; cursor:pointer;">⚪ White</button>
                    <button onclick="setTypoStrokeColor('#f59e0b')" style="height:26px; background:#451a03; color:#fbbf24; border:1px solid #f59e0b; border-radius:4px; font-size:8px; font-weight:900; cursor:pointer;">🟡 Gold</button>
                    <button onclick="setTypoStrokeColor('#06b6d4')" style="height:26px; background:#083344; color:#22d3ee; border:1px solid #06b6d4; border-radius:4px; font-size:8px; font-weight:900; cursor:pointer;">🔷 Cyan</button>
                    <button onclick="setTypoStrokeColor('#ec4899')" style="height:26px; background:#500724; color:#f472b6; border:1px solid #ec4899; border-radius:4px; font-size:8px; font-weight:900; cursor:pointer;">🌸 Pink</button>
                    <button onclick="setTypoStrokeColor('#ef4444')" style="height:26px; background:#450a0a; color:#f87171; border:1px solid #ef4444; border-radius:4px; font-size:8px; font-weight:900; cursor:pointer;">🔴 Red</button>
                </div>

                <div style="display:flex; flex-direction:column; gap:3px; background:#090d16; padding:5px 8px; border-radius:6px; border:1px solid #1e293b;">
                    <div style="display:flex; justify-content:space-between;">
                        <span style="font-size:8px; font-weight:900; color:#94a3b8;">OUTLINE THICKNESS:</span>
                        <span id="val-typo-stroke" style="font-size:8px; font-weight:900; color:#38bdf8;">${strokeWidth} px</span>
                    </div>
                    <input type="range" min="0" max="16" value="${strokeWidth}" oninput="setTypoStrokeWidth(this.value)" style="width:100%; height:4px; accent-color:#0284c7; cursor:pointer;" />
                </div>

                <div style="display:flex; flex-direction:column; gap:3px; background:#090d16; padding:5px 8px; border-radius:6px; border:1px solid #1e293b;">
                    <div style="display:flex; justify-content:space-between;">
                        <span style="font-size:8px; font-weight:900; color:#94a3b8;">DROP SHADOW &amp; GLOW:</span>
                        <span id="val-typo-shadow" style="font-size:8px; font-weight:900; color:#fbbf24;">8 px</span>
                    </div>
                    <input type="range" min="0" max="24" value="8" oninput="setTypoShadow(this.value)" style="width:100%; height:4px; accent-color:#f59e0b; cursor:pointer;" />
                </div>
            </div>
        </foreignObject>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 3: 📦 SUBTITLE BACKGROUND HIGHLIGHT PAD / BOX
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-bg" style="${activeTab === 'bg' ? '' : 'display:none;'}">
        <foreignObject x="18" y="246" width="324" height="150">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:6px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <span style="font-size:8.5px; font-weight:900; color:#c084fc;">SUBTITLE HIGHLIGHT BOX / PAD:</span>
                <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:3px;">
                    <button onclick="setTypoBgStyle('none')" style="height:28px; background:#0f172a; color:#94a3b8; border:1px solid #334155; border-radius:5px; font-size:8px; font-weight:900; cursor:pointer;">🚫 None</button>
                    <button onclick="setTypoBgStyle('obsidian')" style="height:28px; background:#000000; color:#38bdf8; border:1.5px solid #38bdf8; border-radius:5px; font-size:8px; font-weight:900; cursor:pointer;">⬛ Black</button>
                    <button onclick="setTypoBgStyle('red')" style="height:28px; background:#450a0a; color:#f87171; border:1px solid #ef4444; border-radius:5px; font-size:8px; font-weight:900; cursor:pointer;">🟥 Red</button>
                    <button onclick="setTypoBgStyle('gold')" style="height:28px; background:#451a03; color:#fbbf24; border:1px solid #f59e0b; border-radius:5px; font-size:8px; font-weight:900; cursor:pointer;">🟨 Gold</button>
                    <button onclick="setTypoBgStyle('glass')" style="height:28px; background:#083344; color:#22d3ee; border:1px solid #06b6d4; border-radius:5px; font-size:8px; font-weight:900; cursor:pointer;">🟦 Glass</button>
                </div>

                <div style="display:flex; flex-direction:column; gap:3px; background:#090d16; padding:5px 8px; border-radius:6px; border:1px solid #1e293b;">
                    <div style="display:flex; justify-content:space-between;">
                        <span style="font-size:8px; font-weight:900; color:#94a3b8;">BG PAD OPACITY:</span>
                        <span id="val-typo-bg-op" style="font-size:8px; font-weight:900; color:#c084fc;">${bgOpacity}%</span>
                    </div>
                    <input type="range" min="0" max="100" value="${bgOpacity}" oninput="setTypoBgOpacity(this.value)" style="width:100%; height:4px; accent-color:#a855f7; cursor:pointer;" />
                </div>

                <div style="display:flex; flex-direction:column; gap:3px; background:#090d16; padding:5px 8px; border-radius:6px; border:1px solid #1e293b;">
                    <div style="display:flex; justify-content:space-between;">
                        <span style="font-size:8px; font-weight:900; color:#94a3b8;">PILL CORNER RADIUS:</span>
                        <span id="val-typo-bg-rad" style="font-size:8px; font-weight:900; color:#34d399;">8 px</span>
                    </div>
                    <input type="range" min="0" max="24" value="8" oninput="setTypoBgRadius(this.value)" style="width:100%; height:4px; accent-color:#10b981; cursor:pointer;" />
                </div>
            </div>
        </foreignObject>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 4: 🌈 MULTI-COLOR GRADIENT TEXT FILLS
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-grad" style="${activeTab === 'grad' ? '' : 'display:none;'}">
        <foreignObject x="18" y="246" width="324" height="150">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:6px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <span style="font-size:8.5px; font-weight:900; color:#fbbf24;">SELECT MULTI-COLOR GRADIENT:</span>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px;">
                    <button onclick="setTypoGradient('sunset')" style="height:32px; background:linear-gradient(135deg, #f59e0b, #ef4444); color:#ffffff; border:1.5px solid #fbbf24; border-radius:6px; font-size:9px; font-weight:900; cursor:pointer;">🌅 Sunset Gold</button>
                    <button onclick="setTypoGradient('cyber')" style="height:32px; background:linear-gradient(135deg, #06b6d4, #ec4899); color:#ffffff; border:1.5px solid #38bdf8; border-radius:6px; font-size:9px; font-weight:900; cursor:pointer;">⚡ Cyber Neon</button>
                    <button onclick="setTypoGradient('chrome')" style="height:32px; background:linear-gradient(135deg, #cbd5e1, #475569); color:#ffffff; border:1.5px solid #e2e8f0; border-radius:6px; font-size:9px; font-weight:900; cursor:pointer;">💎 Metal Chrome</button>
                    <button onclick="setTypoGradient('emerald')" style="height:32px; background:linear-gradient(135deg, #34d399, #059669); color:#ffffff; border:1.5px solid #10b981; border-radius:6px; font-size:9px; font-weight:900; cursor:pointer;">🟢 Emerald Matrix</button>
                </div>

                <div style="display:flex; flex-direction:column; gap:3px; background:#090d16; padding:5px 8px; border-radius:6px; border:1px solid #1e293b; margin-top:2px;">
                    <div style="display:flex; justify-content:space-between;">
                        <span style="font-size:8px; font-weight:900; color:#94a3b8;">LETTER TRACKING:</span>
                        <span id="val-typo-tracking" style="font-size:8px; font-weight:900; color:#fbbf24;">1 px</span>
                    </div>
                    <input type="range" min="-2" max="10" value="1" oninput="setTypoTracking(this.value)" style="width:100%; height:4px; accent-color:#f59e0b; cursor:pointer;" />
                </div>
            </div>
        </foreignObject>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 5: 🎤 CAPCUT KARAOKE WORD GLOW & 1-CLICK VIRAL TEMPLATES
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-karaoke" style="${activeTab === 'karaoke' ? '' : 'display:none;'}">
        <foreignObject x="18" y="246" width="324" height="150">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:6px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="display:flex; align-items:center; justify-content:space-between; background:#064e3b; padding:6px 8px; border-radius:6px; border:1.2px solid #10b981;">
                    <span style="font-size:9px; font-weight:900; color:#ffffff;">🎤 CAPCUT ACTIVE WORD HIGHLIGHT</span>
                    <button onclick="toggleKaraokeMode()" id="btn-toggle-karaoke" style="height:22px; background:#10b981; color:#000000; border:none; border-radius:4px; font-size:8px; font-weight:900; padding:0 6px; cursor:pointer;">
                        ${isKaraoke ? 'ACTIVE ON' : 'ENABLE'}
                    </button>
                </div>

                <span style="font-size:8px; font-weight:900; color:#cbd5e1; margin-top:2px;">1-CLICK VIRAL CAPTION TEMPLATES:</span>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px;">
                    <button onclick="applyViralTypoTemplate('tiktok')" style="height:28px; background:#0f172a; color:#fde047; border:1px solid #eab308; border-radius:5px; font-size:8.5px; font-weight:900; cursor:pointer;">📱 TikTok Pop</button>
                    <button onclick="applyViralTypoTemplate('netflix')" style="height:28px; background:#0f172a; color:#f87171; border:1px solid #ef4444; border-radius:5px; font-size:8.5px; font-weight:900; cursor:pointer;">🎬 Netflix Cinema</button>
                    <button onclick="applyViralTypoTemplate('news')" style="height:28px; background:#0f172a; color:#38bdf8; border:1px solid #0284c7; border-radius:5px; font-size:8.5px; font-weight:900; cursor:pointer;">🚨 News Ticker</button>
                    <button onclick="applyViralTypoTemplate('gaming')" style="height:28px; background:#0f172a; color:#ec4899; border:1px solid #db2777; border-radius:5px; font-size:8.5px; font-weight:900; cursor:pointer;">🎮 Gaming Neon</button>
                </div>
            </div>
        </foreignObject>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 6: BOTTOM DOCK TABS
    ══════════════════════════════════════════════════════════════════════════ -->
    <!-- Scroll Arrow Left -->
    <g class="cursor-pointer" transform="translate(2, 410)" onclick="scrollTypoTabsLeft('${id}')">
        <rect x="0" y="0" width="16" height="58" rx="4" fill="#090d16" fill-opacity="0.9" stroke="#1e293b" stroke-width="1" />
        <path d="M10 24 L5 29 L10 34" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" fill="none" />
    </g>

    <!-- Scroll Arrow Right -->
    <g class="cursor-pointer" transform="translate(342, 410)" onclick="scrollTypoTabsRight('${id}')">
        <rect x="0" y="0" width="16" height="58" rx="4" fill="#090d16" fill-opacity="0.9" stroke="#1e293b" stroke-width="1" />
        <path d="M6 24 L11 29 L6 34" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" fill="none" />
    </g>

    <g id="${id}-bottom-tabs-dock" transform="translate(20, 410)">
        <foreignObject x="0" y="0" width="320" height="58">
            <div xmlns="http://www.w3.org/1999/xhtml" id="${id}-tabs-viewport" 
                 style="display:flex; align-items:center; gap:6px; width:100%; height:100%; overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none; box-sizing:border-box; padding-bottom:4px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <button type="button" id="${id}-tab-anim" onclick="switchTypoTab('${id}', 'anim')"
                        style="flex-shrink:0; width:70px; height:58px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:16px; line-height:1;">⚡</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#38bdf8;">ANIM</span>
                </button>

                <button type="button" id="${id}-tab-transform" onclick="switchTypoTab('${id}', 'transform')"
                        style="flex-shrink:0; width:70px; height:58px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:16px; line-height:1;">📐</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#fbbf24;">TRANSFORM</span>
                </button>

                <button type="button" id="${id}-tab-color" onclick="switchTypoTab('${id}', 'color')"
                        style="flex-shrink:0; width:70px; height:58px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:16px; line-height:1;">🎨</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#f472b6;">COLOR</span>
                </button>

                <button type="button" id="${id}-tab-typo" onclick="switchTypoTab('${id}', 'typo')"
                        style="flex-shrink:0; width:70px; height:58px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:10px; background:#451a03; border:2px solid #f59e0b; box-shadow:0 0 12px rgba(245,158,11,0.5); cursor:pointer; color:#ffffff;">
                    <span style="font-size:16px; line-height:1;">🔤</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#fbbf24;">TYPO</span>
                </button>

                <button type="button" id="${id}-tab-vfx" onclick="switchTypoTab('${id}', 'vfx')"
                        style="flex-shrink:0; width:70px; height:58px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:10px; background:#090d16; border:1.2px solid #1e293b; cursor:pointer; color:#94a3b8;">
                    <span style="font-size:16px; line-height:1;">💥</span>
                    <span style="font-size:9px; font-weight:900; letter-spacing:0.5px; color:#ef4444;">VFX</span>
                </button>

                <button type="button" id="${id}-tab-thumb" onclick="switchTypoTab('${id}', 'thumb')"
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
    renderTitanSvgTypoCard,
    TitanSvgTypoCard: renderTitanSvgTypoCard
};
