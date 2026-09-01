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
         PANEL 1: 🔤 FONT BANK, SIZE & CURVE ARC BEND
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-font" style="${activeTab === 'font' ? '' : 'display:none;'}">
        <foreignObject x="18" y="246" width="324" height="150">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:6px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <!-- Font Opcode Stepper -->
                <div style="display:flex; align-items:center; justify-content:space-between; background:#090d16; padding:4px 8px; border-radius:6px; border:1px solid #1e293b;">
                    <span style="font-size:8.5px; font-weight:900; color:#f59e0b;">256 FONT BANK:</span>
                    <div style="display:flex; align-items:center; gap:4px;">
                        <button onclick="stepTypoChannel('${id}', 'font', -1)" style="width:22px; height:22px; background:#0f172a; color:#ffffff; border:1px solid #334155; border-radius:4px; font-size:9px; font-weight:900; cursor:pointer;">◀</button>
                        <span id="${id}-val-font" style="font-size:10px; font-weight:900; color:#fbbf24; width:34px; text-align:center;">${fontOpcode.toString().padStart(3, '0')}</span>
                        <button onclick="stepTypoChannel('${id}', 'font', 1)" style="width:22px; height:22px; background:#0f172a; color:#ffffff; border:1px solid #334155; border-radius:4px; font-size:9px; font-weight:900; cursor:pointer;">▶</button>
                    </div>
                </div>

                <!-- Font Size Slider -->
                <div style="display:flex; flex-direction:column; gap:3px; background:#090d16; padding:4px 8px; border-radius:6px; border:1px solid #1e293b;">
                    <div style="display:flex; justify-content:space-between;">
                        <span style="font-size:8px; font-weight:900; color:#38bdf8;">FONT SIZE:</span>
                        <span id="${id}-val-size" style="font-size:8px; font-weight:900; color:#38bdf8;">${fontSize}px</span>
                    </div>
                    <input type="range" min="12" max="144" value="${fontSize}" oninput="setTypoFontSize(this.value)" style="width:100%; height:4px; accent-color:#0284c7; cursor:pointer;" />
                </div>

                <!-- Curved Arc Bend Slider & Half Circle Presets -->
                <div style="display:flex; flex-direction:column; gap:4px; background:#090d16; padding:5px 8px; border-radius:6px; border:1px solid #1e293b;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:8px; font-weight:900; color:#fbbf24;">🔄 CURVED HALF-CIRCLE / ARC BEND:</span>
                        <span id="val-typo-arc" style="font-size:8px; font-weight:900; color:#fbbf24;">${curveArc}°</span>
                    </div>
                    <input type="range" min="-180" max="180" value="${curveArc}" oninput="setTypoCurveArc(this.value)" style="width:100%; height:4px; accent-color:#f59e0b; cursor:pointer;" />
                    
                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:3px; margin-top:2px;">
                        <button onclick="setTypoCurveArc(180)" style="height:22px; background:#451a03; color:#fbbf24; border:1px solid #f59e0b; border-radius:4px; font-size:7.5px; font-weight:900; cursor:pointer;">🌈 +180° Arch</button>
                        <button onclick="setTypoCurveArc(-180)" style="height:22px; background:#082f49; color:#38bdf8; border:1px solid #0284c7; border-radius:4px; font-size:7.5px; font-weight:900; cursor:pointer;">😃 -180° Smile</button>
                        <button onclick="setTypoCurveArc(360)" style="height:22px; background:#2e1065; color:#c084fc; border:1px solid #a855f7; border-radius:4px; font-size:7.5px; font-weight:900; cursor:pointer;">⭕ 360° Ring</button>
                        <button onclick="setTypoCurveArc(0)" style="height:22px; background:#0f172a; color:#94a3b8; border:1px solid #334155; border-radius:4px; font-size:7.5px; font-weight:900; cursor:pointer;">➡️ Flat 0°</button>
                    </div>
                </div>
            </div>
        </foreignObject>
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
         LAYER 6: MASTER ACTION BUTTON (APPLY TO TIMELINE)
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-master-btn-group" transform="translate(18, 402)" class="cursor-pointer" onclick="applyTypoToTimeline('${id}')">
        <rect x="0" y="0" width="324" height="42" rx="12" fill="#78350f" stroke="#f59e0b" stroke-width="1.5" filter="url(#${id}-glow-amber)" />
        <text x="162" y="25.5" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="900" fill="#fef08a" text-anchor="middle" letter-spacing="1">✍️ APPLY FLAGSHIP TYPO TO TIMELINE</text>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 7: BOTTOM DOCK TABS
    ══════════════════════════════════════════════════════════════════════════ -->
    <!-- Scroll Arrow Left -->
    <g class="cursor-pointer" transform="translate(2, 472)" onclick="scrollTypoTabsLeft('${id}')">
        <rect x="0" y="0" width="16" height="58" rx="4" fill="#090d16" fill-opacity="0.9" stroke="#1e293b" stroke-width="1" />
        <path d="M10 24 L5 29 L10 34" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" fill="none" />
    </g>

    <!-- Scroll Arrow Right -->
    <g class="cursor-pointer" transform="translate(342, 472)" onclick="scrollTypoTabsRight('${id}')">
        <rect x="0" y="0" width="16" height="58" rx="4" fill="#090d16" fill-opacity="0.9" stroke="#1e293b" stroke-width="1" />
        <path d="M6 24 L11 29 L6 34" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" fill="none" />
    </g>

    <g id="${id}-bottom-tabs-dock" transform="translate(20, 472)">
        <foreignObject x="0" y="0" width="320" height="58">
            <div xmlns="http://www.w3.org/1999/xhtml" id="${id}-tabs-viewport" class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar w-full h-full pb-1" style="scrollbar-width:none;-ms-overflow-style:none;">
                
                <button type="button" id="${id}-tab-anim" onclick="switchTypoTab('${id}', 'anim')"
                        class="flex-shrink-0 w-[70px] h-[58px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800">
                    <span class="text-base leading-none">⚡</span>
                    <span class="text-[9px] font-black tracking-wider text-cyan-400">ANIM</span>
                </button>

                <button type="button" id="${id}-tab-transform" onclick="switchTypoTab('${id}', 'transform')"
                        class="flex-shrink-0 w-[70px] h-[58px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800">
                    <span class="text-base leading-none">📐</span>
                    <span class="text-[9px] font-black tracking-wider text-amber-400">TRANSFORM</span>
                </button>

                <button type="button" id="${id}-tab-color" onclick="switchTypoTab('${id}', 'color')"
                        class="flex-shrink-0 w-[70px] h-[58px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800">
                    <span class="text-base leading-none">🎨</span>
                    <span class="text-[9px] font-black tracking-wider text-pink-400">COLOR</span>
                </button>

                <button type="button" id="${id}-tab-typo" onclick="switchTypoTab('${id}', 'typo')"
                        class="flex-shrink-0 w-[70px] h-[58px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 bg-amber-950 border-2 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]">
                    <span class="text-base leading-none">🔤</span>
                    <span class="text-[9px] font-black tracking-wider text-amber-300">TYPO</span>
                </button>

                <button type="button" id="${id}-tab-thumb" onclick="switchTypoTab('${id}', 'thumb')"
                        class="flex-shrink-0 w-[70px] h-[58px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800">
                    <span class="text-base leading-none">🖼️</span>
                    <span class="text-[9px] font-black tracking-wider text-amber-400">THUMB</span>
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
    renderTitanSvgTypoCard,
    TitanSvgTypoCard: renderTitanSvgTypoCard
};
