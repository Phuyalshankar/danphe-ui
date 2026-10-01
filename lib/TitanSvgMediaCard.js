'use strict';

/**
 * 🐬 TitanSvgMediaCard (danphe-ui/lib)
 * LEFT MOBILE SCREEN: 360° Cinema Camera Lens, Dedicated Overlay Importer & BG Pad Hub (360x560px)
 * 5-Tab Architecture: LENS • OVERLAY • BG PAD • EXPORTS • CLOUD
 * ZERO-WOBBLE MATHEMATICAL ARCHITECTURE: (0,0) Centered Optical Elements + Shortest Path 120 FPS Easing
 */

const MEDIA_CATEGORIES = [
    { id: 'video', name: 'Video Footage', label: 'VIDEO', svgPath: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>', color: '#38bdf8', bg: '#082f49', stroke: '#0284c7', angle: 0, accept: 'video/*' },
    { id: 'photo', name: 'Photos & Logos', label: 'PHOTO', svgPath: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>', color: '#c084fc', bg: '#3b0764', stroke: '#a855f7', angle: 45, accept: 'image/*' },
    { id: 'overlay', name: 'Overlay Media', label: 'OVERLAY', svgPath: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>', color: '#fb923c', bg: '#431407', stroke: '#ea580c', angle: 90, accept: 'video/*,image/*' },
    { id: 'audio', name: 'Audio & Music', label: 'AUDIO', svgPath: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>', color: '#34d399', bg: '#064e3b', stroke: '#10b981', angle: 135, accept: 'audio/*' },
    { id: 'text', name: 'Kinetic Text', label: 'TEXT', svgPath: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>', color: '#f472b6', bg: '#500724', stroke: '#ec4899', angle: 180, accept: '.txt,.json' },
    { id: 'vfx', name: 'VFX Shaders', label: 'VFX', svgPath: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>', color: '#ef4444', bg: '#450a0a', stroke: '#dc2626', angle: 225, accept: '.fx,.frag' },
    { id: 'elements', name: 'Shapes & Badges', label: 'SHAPES', svgPath: '<polygon points="12 2 22 22 2 22"/>', color: '#60a5fa', bg: '#172554', stroke: '#3b82f6', angle: 270, accept: '.svg' },
    { id: 'cloud', name: 'Cloud & Stock', label: 'CLOUD', svgPath: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>', color: '#fbbf24', bg: '#451a03', stroke: '#f59e0b', angle: 315, accept: '*/*' }
];

function renderTitanSvgMediaCard(options = {}) {
    const {
        id = 'titan-svg-media-card',
        activeCategoryIdx = 0,
        wheelAngle = 0,
        activeTab = 'lens', // 'lens' | 'overlay_import' | 'bg_pad' | 'exports' | 'cloud'
        isFrameMode = true
    } = options;

    const currentCat = MEDIA_CATEGORIES[activeCategoryIdx % MEDIA_CATEGORIES.length] || MEDIA_CATEGORIES[0];
    const hexOpcode = '0x' + (activeCategoryIdx * 32).toString(16).toUpperCase().padStart(2, '0');

    // Camera Lens Geometry Center & Radii in Local (0,0) System
    const orbitR = 74;
    const lensBarrelR = 114;

    // 8 Upright Fixed Stationary Category Nodes (Placed around (0,0) with Pure SVG Vectors)
    const nodesSvg = MEDIA_CATEGORIES.map((cat, idx) => {
        const rad = (cat.angle - 90) * (Math.PI / 180);
        const nx = Math.cos(rad) * orbitR;
        const ny = Math.sin(rad) * orbitR;
        const isCurrent = idx === (activeCategoryIdx % MEDIA_CATEGORIES.length);

        return `
        <!-- Stationary Upright Node ${idx}: ${cat.id} -->
        <g id="${id}-node-${idx}" transform="translate(${nx}, ${ny})" class="cursor-pointer" onclick="selectRotaryCategory('${id}', ${idx}, true)">
            <circle cx="0" cy="2" r="${isCurrent ? 22 : 16}" fill="#000000" opacity="0.65" />
            <circle id="${id}-node-bg-${idx}" cx="0" cy="0" r="${isCurrent ? 22 : 16}" fill="${cat.bg}" stroke="${isCurrent ? '#ffffff' : cat.stroke}" stroke-width="${isCurrent ? 2.5 : 1.4}" filter="url(#${id}-glow)" />
            <ellipse cx="-3" cy="-4" rx="${isCurrent ? 10 : 7}" ry="${isCurrent ? 5 : 3}" fill="#ffffff" opacity="${isCurrent ? 0.45 : 0.25}" />
            <g transform="translate(-7, -7) scale(0.58)" fill="none" stroke="${isCurrent ? '#ffffff' : cat.color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                ${cat.svgPath}
            </g>
            <circle id="${id}-node-ring-${idx}" cx="0" cy="0" r="26" fill="none" stroke="${cat.color}" stroke-width="2" stroke-dasharray="4,3" style="${isCurrent ? '' : 'display:none;'}" filter="url(#${id}-glow)" />
        </g>`;
    }).join('\n');

    return `
<svg id="${id}" viewBox="0 0 360 560" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" 
     class="select-none filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.98)] w-full max-w-[360px] mx-auto">
    <defs>
        <!-- ── TITANIUM HARDWARE GRADIENTS ── -->
        <linearGradient id="${id}-chassis-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="25%" stop-color="#0284c7" />
            <stop offset="50%" stop-color="#090d16" />
            <stop offset="80%" stop-color="#1e293b" />
            <stop offset="100%" stop-color="#06b6d4" />
        </linearGradient>

        <linearGradient id="${id}-chassis-bezel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#030712" />
            <stop offset="50%" stop-color="#090d16" />
            <stop offset="100%" stop-color="#020617" />
        </linearGradient>

        <radialGradient id="${id}-lens-barrel-metal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#1e293b" />
            <stop offset="85%" stop-color="#0f172a" />
            <stop offset="95%" stop-color="#334155" />
            <stop offset="100%" stop-color="#020617" />
        </radialGradient>

        <radialGradient id="${id}-lens-deep-glass" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stop-color="#0f2438" />
            <stop offset="40%" stop-color="#071322" />
            <stop offset="75%" stop-color="#030811" />
            <stop offset="100%" stop-color="#000206" />
        </radialGradient>

        <linearGradient id="${id}-glare-cyan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#00f2fe" stop-opacity="0.35" />
            <stop offset="50%" stop-color="#4facfe" stop-opacity="0.08" />
            <stop offset="100%" stop-color="#000000" stop-opacity="0" />
        </linearGradient>

        <linearGradient id="${id}-glare-violet" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="#ec4899" stop-opacity="0.28" />
            <stop offset="40%" stop-color="#a855f7" stop-opacity="0.06" />
            <stop offset="100%" stop-color="#000000" stop-opacity="0" />
        </linearGradient>

        <radialGradient id="${id}-core-metal" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="35%" stop-color="#0369a1" />
            <stop offset="75%" stop-color="#0c2338" />
            <stop offset="100%" stop-color="#020617" />
        </radialGradient>

        <filter id="${id}-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>

        <filter id="${id}-lens-aperture-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.22  0 0 0 0 0.74  0 0 0 0 0.97  0 0 0 0.8 0" result="cyanGlow" />
            <feMerge>
                <feMergeNode in="cyanGlow" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 1: TITANIUM HARDWARE CHASSIS FRAME (360x560px)
    ═══════════════════════════════════════════════════════�    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 2: TOP 5-TAB NAVIGATION BAR (CLEAR HIGH-CONTRAST TYPOGRAPHY)
    ══════════════════════════════════════════════════════════════════════════ -->
    <foreignObject x="8" y="12" width="344" height="38">
        <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; gap:4px; width:100%; height:100%; box-sizing:border-box; font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">
            <button id="${id}-tab-btn-lens" onclick="switchMediaCardTab('lens')" 
                    style="flex:1; height:32px; background:${activeTab === 'lens' ? '#0284c7' : '#0e1726'}; color:${activeTab === 'lens' ? '#ffffff' : '#cbd5e1'}; border:1.4px solid ${activeTab === 'lens' ? '#38bdf8' : '#334155'}; border-radius:7px; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px; box-shadow:${activeTab === 'lens' ? '0 0 10px rgba(56,189,248,0.4)' : 'none'}; transition:all 0.15s;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                <span>LENS</span>
            </button>
            <button id="${id}-tab-btn-overlay_import" onclick="switchMediaCardTab('overlay_import')" 
                    style="flex:1.3; height:32px; background:${activeTab === 'overlay_import' ? '#c2410c' : '#0e1726'}; color:${activeTab === 'overlay_import' ? '#ffffff' : '#fb923c'}; border:1.4px solid ${activeTab === 'overlay_import' ? '#fb923c' : '#334155'}; border-radius:7px; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px; box-shadow:${activeTab === 'overlay_import' ? '0 0 12px rgba(251,146,60,0.5)' : 'none'}; transition:all 0.15s;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                <span>LAYERS</span>
            </button>
            <button id="${id}-tab-btn-bg_pad" onclick="switchMediaCardTab('bg_pad')" 
                    style="flex:1.2; height:32px; background:${activeTab === 'bg_pad' ? '#7c2d12' : '#0e1726'}; color:${activeTab === 'bg_pad' ? '#ffffff' : '#fdba74'}; border:1.4px solid ${activeTab === 'bg_pad' ? '#f97316' : '#334155'}; border-radius:7px; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px; box-shadow:${activeTab === 'bg_pad' ? '0 0 10px rgba(249,115,22,0.4)' : 'none'}; transition:all 0.15s;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
                <span>BG PAD</span>
            </button>
            <button id="${id}-tab-btn-exports" onclick="switchMediaCardTab('exports')" 
                    style="flex:1; height:32px; background:${activeTab === 'exports' ? '#0284c7' : '#0e1726'}; color:${activeTab === 'exports' ? '#ffffff' : '#cbd5e1'}; border:1.4px solid ${activeTab === 'exports' ? '#38bdf8' : '#334155'}; border-radius:7px; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px; box-shadow:${activeTab === 'exports' ? '0 0 10px rgba(56,189,248,0.4)' : 'none'}; transition:all 0.15s;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span>EXPORT</span>
            </button>
            <button id="${id}-tab-btn-cloud" onclick="switchMediaCardTab('cloud')" 
                    style="flex:1; height:32px; background:${activeTab === 'cloud' ? '#0284c7' : '#0e1726'}; color:${activeTab === 'cloud' ? '#ffffff' : '#cbd5e1'}; border:1.4px solid ${activeTab === 'cloud' ? '#38bdf8' : '#334155'}; border-radius:7px; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px; box-shadow:${activeTab === 'cloud' ? '0 0 10px rgba(56,189,248,0.4)' : 'none'}; transition:all 0.15s;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
                <span>CLOUD</span>
            </button>
        </div>
    </foreignObject>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 1: 📷 360° CAMERA LENS & ROUTE-SORTED MEDIA POOL
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-lens" style="${activeTab === 'lens' ? '' : 'display:none;'}">
        
        <!-- 360° Camera Optical Lens Stage (Centered strictly at (180, 200)) -->
        <g id="${id}-rotary-stage" transform="translate(180, 200)">
            
            <!-- ── 1. ROTATING LENS BARREL & RETICLE (Centered at (0,0) - ZERO WOBBLE!) ── -->
            <g id="${id}-wheel-group" transform="rotate(${wheelAngle})">
                <!-- Metallic Knurled Focus Gear Ring -->
                <circle cx="0" cy="0" r="${lensBarrelR}" fill="url(#${id}-lens-barrel-metal)" stroke="#475569" stroke-width="2.2" />
                
                <!-- Focus Gear Ridges -->
                <g>
                    ${Array.from({ length: 36 }).map((_, t) => `
                        <line x1="0" y1="-113" x2="0" y2="-107" stroke="${t % 4 === 0 ? '#38bdf8' : '#475569'}" stroke-width="${t % 4 === 0 ? 2.5 : 1.2}" transform="rotate(${t * 10})" />
                    `).join('')}
                </g>

                <!-- 8-Blade Mechanical Shutter Iris -->
                <g opacity="0.88">
                    ${Array.from({ length: 8 }).map((_, a) => `
                        <path d="M 0 0 L -80 -45 A 90 90 0 0 1 -35 -85 Z" fill="#0f172a" stroke="#1e293b" stroke-width="1.2" transform="rotate(${a * 45})" opacity="0.9" />
                    `).join('')}
                </g>

                <!-- Deep Glass Cavity -->
                <circle cx="0" cy="0" r="92" fill="url(#${id}-lens-deep-glass)" stroke="#0284c7" stroke-width="1.8" />

                <!-- Optical Anti-Reflective Lens Flares -->
                <ellipse cx="-18" cy="-18" rx="72" ry="52" fill="url(#${id}-glare-cyan)" transform="rotate(-25)" pointer-events="none" />
                <ellipse cx="22" cy="22" rx="60" ry="40" fill="url(#${id}-glare-violet)" transform="rotate(35)" pointer-events="none" />

                <!-- Laser Crosshair Reticle -->
                <g>
                    <line x1="0" y1="-92" x2="0" y2="-32" stroke="${currentCat.color}" stroke-width="2.5" stroke-linecap="round" opacity="0.95" filter="url(#${id}-glow)" />
                    <line x1="0" y1="32" x2="0" y2="92" stroke="#334155" stroke-width="1.2" stroke-dasharray="4,3" />
                    <line x1="-92" y1="0" x2="-32" y2="0" stroke="#334155" stroke-width="1.2" stroke-dasharray="4,3" />
                    <line x1="32" y1="0" x2="92" y2="0" stroke="#334155" stroke-width="1.2" stroke-dasharray="4,3" />
                    <polygon points="0,-25 -5,-33 5,-33" fill="${currentCat.color}" filter="url(#${id}-glow)" />
                    <circle id="${id}-active-reticle-ring" cx="0" cy="0" r="25" fill="none" stroke="${currentCat.color}" stroke-width="2" stroke-dasharray="3,3" opacity="0.85" filter="url(#${id}-glow)" />
                </g>
            </g>

            <!-- ── 2. STATIONARY OPTICAL ORBIT GUIDES (Centered at (0,0)) ── -->
            <circle cx="0" cy="0" r="${orbitR}" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-dasharray="3,3" />

            <!-- ── 3. FIXED & UPRIGHT 8 CATEGORY SATELLITE ICONS (Centered at (0,0)) ── -->
            <g id="${id}-fixed-nodes-layer">
                ${nodesSvg}
            </g>

            <!-- ── 4. CENTER APERTURE IRIS CORE (Centered at (0,0)) ── -->
            <g id="${id}-center-core" class="cursor-pointer" onclick="triggerNativeMediaImport('${id}')">
                <circle cx="0" cy="0" r="30" fill="url(#${id}-core-metal)" stroke="${currentCat.color}" stroke-width="2.2" filter="url(#${id}-lens-aperture-glow)" />
                <circle cx="0" cy="0" r="24" fill="#060913" stroke="#334155" stroke-width="1.2" />
                <circle cx="0" cy="0" r="20" fill="none" stroke="${currentCat.color}" stroke-width="1" stroke-dasharray="3,2" opacity="0.85" />
                <path d="M -11 -5.5 L -5.5 -5.5 L -1.8 -1 L 11 -1 C 12.5 -1 13 0 13 1.2 L 13 9.5 C 13 10.8 12.5 11.5 11 11.5 L -11 11.5 C -12.5 11.5 -13 10.8 -13 9.5 L -13 -3.5 C -13 -4.8 -12.5 -5.5 -11 -5.5 Z" 
                      fill="${currentCat.color}" stroke="#ffffff" stroke-width="1.2" opacity="0.98" />
                <text x="0" y="5" font-size="8.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.8">IMPORT</text>
            </g>

            <!-- Stepper Buttons -->
            <g transform="translate(-166, -15)">
                <g class="cursor-pointer" onclick="stepRotaryWheel('${id}', -45)">
                    <rect x="0" y="0" width="30" height="30" rx="7" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
                    <path d="M18 9L12 15L18 21" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                    <text x="15" y="27" font-size="7.5" font-weight="900" fill="#e2e8f0" text-anchor="middle">-45°</text>
                </g>
            </g>

            <g transform="translate(136, -15)">
                <g class="cursor-pointer" onclick="stepRotaryWheel('${id}', 45)">
                    <rect x="0" y="0" width="30" height="30" rx="7" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
                    <path d="M12 9L18 15L12 21" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                    <text x="15" y="27" font-size="7.5" font-weight="900" fill="#e2e8f0" text-anchor="middle">+45°</text>
                </g>
            </g>
        </g>

        <!-- Route HUD & Dynamic List -->
        <foreignObject x="14" y="346" width="332" height="204">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:6px; width:100%; height:100%; box-sizing:border-box; font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">
                
                <!-- HUD Status Banner -->
                <div style="height:30px; min-height:30px; background:${currentCat.bg}; border:1.4px solid ${currentCat.stroke}; border-radius:8px; display:flex; align-items:center; justify-content:space-between; padding:0 12px; box-sizing:border-box;">
                    <span id="${id}-hud-active-name" style="font-size:12px; font-weight:900; color:#ffffff; letter-spacing:0.6px;">${currentCat.label} POOL</span>
                    <span id="${id}-hud-active-pos" style="font-size:10.5px; font-weight:900; color:${currentCat.color}; background:#000000; padding:2px 10px; border-radius:5px; border:1px solid #334155;">ROUTE: ${currentCat.id.toUpperCase()}</span>
                </div>

                <!-- Live Imported Files Shelf List -->
                <div style="flex:1; background:#090d16; border:1.2px solid #1e293b; border-radius:9px; padding:6px 8px; box-sizing:border-box; display:flex; flex-direction:column; gap:4px; overflow:hidden;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
                        <span id="${id}-pool-header-title" style="font-size:10.5px; font-weight:900; color:#ffffff; letter-spacing:0.5px;">IMPORTED ${currentCat.name.toUpperCase()} (CLICK TO INSERT):</span>
                        <span id="${id}-pool-count-tag" style="font-size:10.5px; font-weight:900; color:${currentCat.color};">3 FILES</span>
                    </div>
                    <div id="${id}-imported-files-list-html" style="display:flex; flex-direction:column; gap:5px; flex:1; overflow-y:auto;">
                        <!-- Injected dynamically by updateMediaWheelUI -->
                    </div>
                </div>

                <!-- Bottom Master Import Button -->
                <button id="${id}-master-btn-html" onclick="triggerNativeMediaImport()" 
                        style="height:36px; min-height:36px; background:#082f49; color:#ffffff; border:1.6px solid #38bdf8; border-radius:8px; font-size:12px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 0 12px rgba(56,189,248,0.35); transition:all 0.15s;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    <span id="${id}-btn-import-lbl-html">IMPORT NEW ${currentCat.label} FILE</span>
                </button>
            </div>
        </foreignObject>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 2: 🎨 LAYER & CANVAS SPAWNER HUB (SOLID • WINDOW MEDIA • PRESETS)
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-overlay_import" style="${activeTab === 'overlay_import' ? '' : 'display:none;'}">
        <foreignObject x="14" y="52" width="332" height="498">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:8px; width:100%; height:100%; box-sizing:border-box; font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif; overflow-y:auto; padding-bottom:12px;">
                
                <!-- ── 0. OLED LAYER & STAGE TELEMETRY HUD ── -->
                <div style="background:radial-gradient(ellipse at 50% 0%, #082f49 0%, #020617 75%, #000000 100%); border:1.6px solid #38bdf8; border-radius:10px; padding:8px 12px; display:flex; flex-direction:column; gap:6px; box-shadow:0 0 16px rgba(56,189,248,0.35), inset 0 0 10px rgba(56,189,248,0.2); position:relative; overflow:hidden;">
                    <!-- Diagonal Glass Reflection -->
                    <div style="position:absolute; top:-20px; left:-30px; width:90px; height:130px; background:linear-gradient(135deg, rgba(255,255,255,0.12), transparent 70%); transform:rotate(25deg); pointer-events:none;"></div>
                    
                    <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(56,189,248,0.25); padding-bottom:3px;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span style="display:inline-block; width:7px; height:7px; background:#38bdf8; border-radius:50%; box-shadow:0 0 8px #38bdf8;"></span>
                            <span style="font-size:10px; font-weight:900; color:#ffffff; letter-spacing:0.8px;">LAYER &amp; CANVAS SPAWNER</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:4px;">
                            <span style="font-size:8px; font-weight:900; background:#000000; color:#38bdf8; padding:2px 6px; border-radius:4px; border:1px solid #0284c7;">MULTI-TRACK</span>
                            <span style="font-size:8px; font-weight:900; background:#000000; color:#4ade80; padding:2px 6px; border-radius:4px; border:1px solid #16a34a;">CANVAS READY</span>
                        </div>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
                        <!-- Live Layer Icon Viewport -->
                        <div style="width:72px; height:50px; background:#000000; border:1.2px solid #0284c7; border-radius:6px; position:relative; overflow:hidden; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; box-shadow:inset 0 0 10px rgba(2,132,199,0.5);">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                            <span style="font-size:7px; font-weight:900; color:#38bdf8; letter-spacing:0.5px;">CANVAS</span>
                        </div>

                        <!-- Telemetry details -->
                        <div style="flex:1; display:flex; flex-direction:column; gap:2px; font-size:8.5px; font-weight:900;">
                            <div style="display:flex; justify-content:space-between;">
                                <span style="color:#94a3b8;">TARGET TRACK:</span>
                                <span style="color:#38bdf8;">V2 OVERLAY / V1 BASE</span>
                            </div>
                            <div style="display:flex; justify-content:space-between;">
                                <span style="color:#94a3b8;">COLOR LINK:</span>
                                <span style="color:#f472b6;">RIGHT COLOR CARD</span>
                            </div>
                            <div style="display:flex; justify-content:space-between;">
                                <span style="color:#94a3b8;">DRAW TOOLS:</span>
                                <span style="color:#4ade80;">ACTIVE ON MONITOR</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ── 1. CREATE SOLID / BLANK CANVAS LAYER (FOR DRAWING & THUMBNAILS) ── -->
                <div style="background:linear-gradient(135deg, #090d16, #0c1424); border:1.4px solid #1e293b; border-radius:9px; padding:8px 10px; display:flex; flex-direction:column; gap:6px;">
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                        <span style="font-size:9.5px; font-weight:900; color:#f1f5f9; display:flex; align-items:center; gap:5px;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
                            1. BLANK / SOLID CANVAS LAYER
                        </span>
                        <span style="font-size:7.5px; font-weight:900; color:#38bdf8; background:#082f49; padding:1px 6px; border-radius:3px; border:1px solid #0284c7;">DRAW BASE</span>
                    </div>

                    <span style="font-size:8px; font-weight:700; color:#94a3b8; line-height:1.2;">
                        Add full-width canvas. Change background anytime from Color Card.
                    </span>

                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:4px;">
                        <button onclick="createSolidCanvasLayer('#ffffff', 'White_Canvas')" style="height:30px; background:#ffffff; color:#0f172a; border:1.4px solid #cbd5e1; border-radius:6px; font-size:9px; font-weight:900; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1px; box-shadow:0 1px 4px rgba(0,0,0,0.3); transition:all 0.15s;" title="Create Pure White Canvas for drawing & whiteboard">
                            <span>⬜ WHITE</span>
                            <span style="font-size:6.5px; font-weight:800; color:#475569;">16:9 Pad</span>
                        </button>

                        <button onclick="createSolidCanvasLayer('#050914', 'Dark_Canvas')" style="height:30px; background:#050914; color:#38bdf8; border:1.4px solid #1e293b; border-radius:6px; font-size:9px; font-weight:900; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1px; box-shadow:0 1px 4px rgba(0,0,0,0.5); transition:all 0.15s;" title="Create Dark Obsidian Canvas for neon & thumbnail graphics">
                            <span>⬛ OBSIDIAN</span>
                            <span style="font-size:6.5px; font-weight:800; color:#64748b;">Dark Studio</span>
                        </button>

                        <button onclick="createSolidCanvasLayer('transparent', 'Transparent_Overlay')" style="height:30px; background:#0b1329; color:#4ade80; border:1.4px dashed #22c55e; border-radius:6px; font-size:9px; font-weight:900; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1px; transition:all 0.15s;" title="Create Transparent Overlay Layer on top of video">
                            <span>🪟 CLEAR</span>
                            <span style="font-size:6.5px; font-weight:800; color:#86efac;">Overlay Vid</span>
                        </button>
                    </div>

                    <!-- Color Sync Callout -->
                    <div style="background:#070b14; border:1px solid #1e293b; border-radius:5px; padding:4px 8px; display:flex; align-items:center; justify-content:space-between;">
                        <span style="font-size:7.5px; font-weight:800; color:#cbd5e1;">🎨 COLOR BANK LINK:</span>
                        <button onclick="if(typeof selectInspTab==='function')selectInspTab('color')" style="background:transparent; border:none; color:#ec4899; font-size:8px; font-weight:900; cursor:pointer; text-decoration:underline;">OPEN COLOR CARD ➔</button>
                    </div>
                </div>

                <!-- ── 2. IMPORT WINDOWS MEDIA LAYER ── -->
                <div style="background:linear-gradient(135deg, #090d16, #0c1424); border:1.4px solid #1e293b; border-radius:9px; padding:8px 10px; display:flex; flex-direction:column; gap:6px;">
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                        <span style="font-size:9.5px; font-weight:900; color:#f1f5f9; display:flex; align-items:center; gap:5px;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            2. IMPORT WINDOWS MEDIA LAYER
                        </span>
                        <span style="font-size:7.5px; font-weight:900; color:#f59e0b; background:#451a03; padding:1px 6px; border-radius:3px; border:1px solid #b45309;">V2 / PiP</span>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px;">
                        <button onclick="triggerNativeOverlayImport('image')" style="height:32px; background:#1e1b4b; color:#c084fc; border:1.4px solid #6366f1; border-radius:6px; font-size:9px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:5px; box-shadow:0 0 8px rgba(99,102,241,0.25); transition:all 0.15s;" title="Import Image (PNG/JPG/WebP/SVG) as layer">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
                            <span>+ IMAGE LAYER</span>
                        </button>

                        <button onclick="triggerNativeOverlayImport('video')" style="height:32px; background:#311007; color:#fb923c; border:1.4px solid #ea580c; border-radius:6px; font-size:9px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:5px; box-shadow:0 0 8px rgba(234,88,12,0.25); transition:all 0.15s;" title="Import Video (MP4/MOV/WebM) as V2 Overlay/PiP layer">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                            <span>+ VIDEO (V2)</span>
                        </button>
                    </div>
                </div>

                <!-- ── 3. READY-MADE PRESET CARDS (QUICK LAUNCH) ── -->
                <div style="background:linear-gradient(135deg, #090d16, #0c1424); border:1.4px solid #1e293b; border-radius:9px; padding:8px 10px; display:flex; flex-direction:column; gap:6px;">
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                        <span style="font-size:9.5px; font-weight:900; color:#f1f5f9; display:flex; align-items:center; gap:5px;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2.4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            3. READY-MADE PRESET CARDS
                        </span>
                        <span style="font-size:7.5px; font-weight:900; color:#c084fc; background:#3b0764; padding:1px 6px; border-radius:3px; border:1px solid #7e22ce;">PRESETS</span>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px;">
                        <!-- Preset 1: YouTube Thumbnail -->
                        <div onclick="createPresetCanvasLayer('yt_thumbnail')" style="background:#0b1324; border:1.2px solid #1e293b; border-radius:6px; padding:6px 8px; cursor:pointer; display:flex; flex-direction:column; gap:2px; transition:all 0.15s;" title="16:9 YouTube Thumbnail Frame">
                            <div style="display:flex; align-items:center; justify-content:space-between;">
                                <span style="font-size:8.5px; font-weight:900; color:#ffffff;">📹 Thumbnail</span>
                                <span style="font-size:7px; font-weight:900; color:#f43f5e;">16:9</span>
                            </div>
                            <span style="font-size:7px; font-weight:700; color:#94a3b8;">YouTube 1920x1080</span>
                        </div>

                        <!-- Preset 2: Reel / TikTok Portrait -->
                        <div onclick="createPresetCanvasLayer('portrait_reel')" style="background:#0b1324; border:1.2px solid #1e293b; border-radius:6px; padding:6px 8px; cursor:pointer; display:flex; flex-direction:column; gap:2px; transition:all 0.15s;" title="9:16 Portrait Canvas for TikTok/Reels">
                            <div style="display:flex; align-items:center; justify-content:space-between;">
                                <span style="font-size:8.5px; font-weight:900; color:#ffffff;">📱 Short/Reel</span>
                                <span style="font-size:7px; font-weight:900; color:#a855f7;">9:16</span>
                            </div>
                            <span style="font-size:7px; font-weight:700; color:#94a3b8;">TikTok 1080x1920</span>
                        </div>

                        <!-- Preset 3: Blank Whiteboard -->
                        <div onclick="createPresetCanvasLayer('whiteboard')" style="background:#0b1324; border:1.2px solid #1e293b; border-radius:6px; padding:6px 8px; cursor:pointer; display:flex; flex-direction:column; gap:2px; transition:all 0.15s;" title="Whiteboard artboard for drawings and equations">
                            <div style="display:flex; align-items:center; justify-content:space-between;">
                                <span style="font-size:8.5px; font-weight:900; color:#ffffff;">🖌️ Art Sketchpad</span>
                                <span style="font-size:7px; font-weight:900; color:#38bdf8;">CLEAN</span>
                            </div>
                            <span style="font-size:7px; font-weight:700; color:#94a3b8;">Freehand Vector</span>
                        </div>

                        <!-- Preset 4: Lower Third Banner -->
                        <div onclick="createPresetCanvasLayer('lower_third')" style="background:#0b1324; border:1.2px solid #1e293b; border-radius:6px; padding:6px 8px; cursor:pointer; display:flex; flex-direction:column; gap:2px; transition:all 0.15s;" title="Lower Third banner overlay for video subtitles/names">
                            <div style="display:flex; align-items:center; justify-content:space-between;">
                                <span style="font-size:8.5px; font-weight:900; color:#ffffff;">📺 Lower-Third</span>
                                <span style="font-size:7px; font-weight:900; color:#f59e0b;">BANNER</span>
                            </div>
                            <span style="font-size:7px; font-weight:700; color:#94a3b8;">Video Overlay Bar</span>
                        </div>
                    </div>
                </div>

                <!-- ── 4. SHARED TOOLS HUD (INTEGRATION STATUS) ── -->
                <div style="background:#080d18; border:1px solid #1e293b; border-radius:6px; padding:6px 8px; display:flex; flex-direction:column; gap:3px;">
                    <span style="font-size:7.5px; font-weight:900; color:#64748b; letter-spacing:0.06em;">SHARED RIGHT &amp; TOP TOOLS HUD:</span>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; font-size:7.5px; font-weight:800;">
                        <span style="color:#ec4899;">🎨 Color: BG &amp; Fill</span>
                        <span style="color:#38bdf8;">📐 Transform: Size &amp; Pos</span>
                        <span style="color:#facc15;">✍️ Typo: Titles/Text</span>
                        <span style="color:#4ade80;">🖌️ Monitor: 6 Brushes</span>
                    </div>
                </div>

            </div>
        </foreignObject>
    </g>
    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 3: OVERLAY BG & MATTE PAD STUDIO (HIGH-CONTRAST TYPOGRAPHY)
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-bg_pad" style="${activeTab === 'bg_pad' ? '' : 'display:none;'}">
        <foreignObject x="14" y="52" width="332" height="498">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:8px; width:100%; height:100%; box-sizing:border-box; font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">
                
                <!-- Overlay Header -->
                <div style="background:linear-gradient(135deg, #431407, #7c2d12); border:1.4px solid #ea580c; border-radius:9px; padding:10px 12px; display:flex; align-items:center; justify-content:space-between;">
                    <span style="font-size:12px; font-weight:900; color:#ffffff; display:flex; align-items:center; gap:6px;">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
                        OVERLAY BG &amp; PAD STUDIO
                    </span>
                    <span style="font-size:10px; font-weight:900; background:#000000; color:#fdba74; padding:2px 8px; border-radius:4px; border:1px solid #ea580c;">V2/PIP LAYER</span>
                </div>

                <!-- Overlay Pad Canvas Container -->
                <div style="flex:1; background:#090d16; border:1.2px solid #1e293b; border-radius:10px; padding:10px; box-sizing:border-box; display:flex; flex-direction:column; gap:8px; overflow-y:auto;">
                    
                    <!-- 1. Pad Aspect Ratio Selector -->
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:10.5px; font-weight:900; color:#ffffff;">PAD ASPECT RATIO:</span>
                        <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:4px;">
                            <button onclick="setOverlayPadRatio('16:9')" class="overlay-ratio-btn" style="height:28px; background:#0f172a; color:#ffffff; border:1.2px solid #38bdf8; border-radius:5px; font-size:10.5px; font-weight:900; cursor:pointer;">16:9 Cinema</button>
                            <button onclick="setOverlayPadRatio('9:16')" class="overlay-ratio-btn" style="height:28px; background:#0f172a; color:#cbd5e1; border:1.2px solid #334155; border-radius:5px; font-size:10.5px; font-weight:900; cursor:pointer;">9:16 Reel</button>
                            <button onclick="setOverlayPadRatio('1:1')" class="overlay-ratio-btn" style="height:28px; background:#0f172a; color:#cbd5e1; border:1.2px solid #334155; border-radius:5px; font-size:10.5px; font-weight:900; cursor:pointer;">1:1 Square</button>
                            <button onclick="setOverlayPadRatio('4:5')" class="overlay-ratio-btn" style="height:28px; background:#0f172a; color:#cbd5e1; border:1.2px solid #334155; border-radius:5px; font-size:10.5px; font-weight:900; cursor:pointer;">4:5 Post</button>
                        </div>
                    </div>

                    <!-- 2. Pad Background Style Palette -->
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:10.5px; font-weight:900; color:#ffffff;">BACKGROUND STYLE / MATTE:</span>
                        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:4px;">
                            <button onclick="setOverlayPadStyle('alpha')" style="height:30px; background:#030712; color:#38bdf8; border:1.2px solid #0284c7; border-radius:5px; font-size:10.5px; font-weight:900; cursor:pointer;">Alpha Matte</button>
                            <button onclick="setOverlayPadStyle('obsidian')" style="height:30px; background:#090d16; color:#ffffff; border:1.2px solid #334155; border-radius:5px; font-size:10.5px; font-weight:900; cursor:pointer;">Dark Pad</button>
                            <button onclick="setOverlayPadStyle('cyan-grad')" style="height:30px; background:linear-gradient(135deg, #0284c7, #0f172a); color:#ffffff; border:1.2px solid #38bdf8; border-radius:5px; font-size:10.5px; font-weight:900; cursor:pointer;">Cyan Glow</button>
                            <button onclick="setOverlayPadStyle('sunset')" style="height:30px; background:linear-gradient(135deg, #ea580c, #451a03); color:#ffffff; border:1.2px solid #f97316; border-radius:5px; font-size:10.5px; font-weight:900; cursor:pointer;">Sunset</button>
                            <button onclick="setOverlayPadStyle('neon-purple')" style="height:30px; background:linear-gradient(135deg, #7e22ce, #1e1b4b); color:#ffffff; border:1.2px solid #a855f7; border-radius:5px; font-size:10.5px; font-weight:900; cursor:pointer;">Neon Glow</button>
                            <button onclick="setOverlayPadStyle('blur')" style="height:30px; background:#1e293b; color:#ffffff; border:1.2px solid #475569; border-radius:5px; font-size:10.5px; font-weight:900; cursor:pointer;">Video Blur</button>
                        </div>
                    </div>

                    <!-- 3. PiP Position Presets -->
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:10.5px; font-weight:900; color:#ffffff;">PiP POSITION ANCHORS:</span>
                        <div style="display:flex; gap:4px;">
                            <button onclick="setOverlayPipAnchor('top-left')" style="flex:1; height:28px; background:#0f172a; color:#ffffff; border:1.2px solid #334155; border-radius:5px; font-size:10px; font-weight:900; cursor:pointer;">↖ Top-Left</button>
                            <button onclick="setOverlayPipAnchor('top-right')" style="flex:1; height:28px; background:#0f172a; color:#ffffff; border:1.2px solid #38bdf8; border-radius:5px; font-size:10px; font-weight:900; cursor:pointer;">↗ Top-Right</button>
                            <button onclick="setOverlayPipAnchor('bottom-left')" style="flex:1; height:28px; background:#0f172a; color:#ffffff; border:1.2px solid #334155; border-radius:5px; font-size:10px; font-weight:900; cursor:pointer;">↙ Bot-Left</button>
                            <button onclick="setOverlayPipAnchor('bottom-right')" style="flex:1; height:28px; background:#0f172a; color:#ffffff; border:1.2px solid #334155; border-radius:5px; font-size:10px; font-weight:900; cursor:pointer;">↘ Bot-Right</button>
                            <button onclick="setOverlayPipAnchor('center')" style="flex:1; height:28px; background:#0f172a; color:#ffffff; border:1.2px solid #334155; border-radius:5px; font-size:10px; font-weight:900; cursor:pointer;">Center</button>
                        </div>
                    </div>

                    <!-- 4. Opacity & Blend Mode -->
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; background:#0f172a; padding:8px 10px; border-radius:7px; border:1.2px solid #1e293b;">
                        <div style="display:flex; flex-direction:column; gap:2px; flex:1;">
                            <div style="display:flex; justify-content:space-between;">
                                <span style="font-size:10px; font-weight:900; color:#ffffff;">OVERLAY OPACITY:</span>
                                <span id="overlay-opacity-val" style="font-size:10.5px; font-weight:900; color:#fb923c;">100%</span>
                            </div>
                            <input type="range" min="0" max="100" value="100" oninput="updateOverlayOpacity(this.value)" style="width:100%; height:4px; accent-color:#ea580c; cursor:pointer;" />
                        </div>
                        <div style="display:flex; flex-direction:column; gap:2px; width:100px;">
                            <span style="font-size:10px; font-weight:900; color:#ffffff;">BLEND MODE:</span>
                            <select onchange="updateOverlayBlendMode(this.value)" style="background:#090d16; color:#ffffff; border:1.2px solid #334155; border-radius:4px; font-size:10px; font-weight:900; padding:3px;">
                                <option value="normal">Normal</option>
                                <option value="screen">Screen</option>
                                <option value="multiply">Multiply</option>
                                <option value="overlay">Overlay</option>
                                <option value="color-dodge">Color Dodge</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Live Apply Overlay Button -->
                <button onclick="applyOverlayPadToTimeline()" 
                        style="height:38px; min-height:38px; background:linear-gradient(135deg, #c2410c, #ea580c); color:#ffffff; border:1.6px solid #fb923c; border-radius:8px; font-size:12px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 0 14px rgba(234,88,12,0.4); transition:all 0.15s;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                    <span>INGEST OVERLAY PAD TO TIMELINE (V2)</span>
                </button>
            </div>
        </foreignObject>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 4: EXPORTED MASTER VIDEO DELIVERIES (HIGH-CONTRAST TYPOGRAPHY)
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-exports" style="${activeTab === 'exports' ? '' : 'display:none;'}">
        <foreignObject x="14" y="52" width="332" height="498">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:8px; width:100%; height:100%; box-sizing:border-box; font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">
                
                <div style="flex:1; background:#090d16; border:1.2px solid #1e293b; border-radius:10px; padding:12px; box-sizing:border-box; display:flex; flex-direction:column; gap:10px;">
                    <span style="font-size:12.5px; font-weight:900; color:#38bdf8; display:flex; align-items:center; gap:6px;">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        EXPORTED MASTER DELIVERIES
                    </span>
                    <span style="font-size:10.5px; font-weight:900; color:#ffffff; margin-bottom:2px;">Rendered 4K / 1080p Final Output Files:</span>

                    <!-- Export 1 -->
                    <div onclick="showLiveToast('Export Ready', 'Opening Final_Master_4K_60FPS.mp4', 'success')" 
                         style="display:flex; align-items:center; justify-content:space-between; background:#0f172a; border:1.2px solid #334155; border-radius:8px; padding:10px 12px; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                            <div style="display:flex; flex-direction:column; gap:2px;">
                                <span style="font-size:12px; font-weight:900; color:#ffffff;">Final_Master_4K_60FPS.mp4</span>
                                <span style="font-size:10px; font-weight:800; color:#86efac;">H.264 • 4K UHD 60FPS • 124.5 MB</span>
                            </div>
                        </div>
                        <button style="height:28px; padding:0 14px; background:#065f46; color:#ffffff; border:1.2px solid #10b981; border-radius:6px; font-size:11px; font-weight:900; cursor:pointer;">PLAY</button>
                    </div>

                    <!-- Export 2 -->
                    <div onclick="showLiveToast('Export Ready', 'Opening Reel_Cut_1080p_9x16.mp4', 'success')" 
                         style="display:flex; align-items:center; justify-content:space-between; background:#0f172a; border:1.2px solid #334155; border-radius:8px; padding:10px 12px; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                            <div style="display:flex; flex-direction:column; gap:2px;">
                                <span style="font-size:12px; font-weight:900; color:#ffffff;">Reel_Cut_1080p_9x16.mp4</span>
                                <span style="font-size:10px; font-weight:800; color:#86efac;">Vertical 9:16 • 18.2 MB</span>
                            </div>
                        </div>
                        <button style="height:28px; padding:0 14px; background:#065f46; color:#ffffff; border:1.2px solid #10b981; border-radius:6px; font-size:11px; font-weight:900; cursor:pointer;">PLAY</button>
                    </div>
                </div>

                <button onclick="showLiveToast('Render Queue', 'Starting New Project Render...', 'info')" 
                        style="height:40px; min-height:40px; background:#0284c7; color:#ffffff; border:1.6px solid #38bdf8; border-radius:8px; font-size:12px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 0 12px rgba(56,189,248,0.35); transition:all 0.15s;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    <span>RENDER NEW TIMELINE MASTER</span>
                </button>
            </div>
        </foreignObject>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 5: CLOUD STOCK & ONLINE ASSETS (HIGH-CONTRAST TYPOGRAPHY)
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-cloud" style="${activeTab === 'cloud' ? '' : 'display:none;'}">
        <foreignObject x="14" y="52" width="332" height="498">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:8px; width:100%; height:100%; box-sizing:border-box; font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">
                
                <div style="flex:1; background:#090d16; border:1.2px solid #1e293b; border-radius:10px; padding:12px; box-sizing:border-box; display:flex; flex-direction:column; gap:10px; overflow-y:auto;">
                    <span style="font-size:12.5px; font-weight:900; color:#fbbf24; display:flex; align-items:center; gap:6px;">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
                        CLOUD STOCK ASSET LIBRARY
                    </span>
                    <span style="font-size:10.5px; font-weight:900; color:#ffffff; margin-bottom:2px;">Direct CDN Download to Project Bin:</span>

                    <!-- Cloud 1 -->
                    <div onclick="showLiveToast('Cloud Ingest', 'Downloading Cinema_Drone_Tokyo_Night_4K.mp4', 'info')" 
                         style="display:flex; align-items:center; justify-content:space-between; background:#0f172a; border:1.2px solid #334155; border-radius:8px; padding:10px 12px; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                            <div style="display:flex; flex-direction:column; gap:2px;">
                                <span style="font-size:12px; font-weight:900; color:#ffffff;">Cinema_Drone_Tokyo_Night_4K</span>
                                <span style="font-size:10px; font-weight:800; color:#fde047;">4K UHD • Royalty Free • Stock</span>
                            </div>
                        </div>
                        <button style="height:28px; padding:0 14px; background:#b45309; color:#ffffff; border:1.2px solid #fbbf24; border-radius:6px; font-size:11px; font-weight:900; cursor:pointer;">GET</button>
                    </div>

                    <!-- Cloud 2 -->
                    <div onclick="showLiveToast('Cloud Ingest', 'Downloading Cinematic_Epic_Orchestra_Music.wav', 'info')" 
                         style="display:flex; align-items:center; justify-content:space-between; background:#0f172a; border:1.2px solid #334155; border-radius:8px; padding:10px 12px; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                            <div style="display:flex; flex-direction:column; gap:2px;">
                                <span style="font-size:12px; font-weight:900; color:#ffffff;">Cinematic_Epic_Orchestra.wav</span>
                                <span style="font-size:10px; font-weight:800; color:#fde047;">48kHz WAV • Stereo Master</span>
                            </div>
                        </div>
                        <button style="height:28px; padding:0 14px; background:#b45309; color:#ffffff; border:1.2px solid #fbbf24; border-radius:6px; font-size:11px; font-weight:900; cursor:pointer;">GET</button>
                    </div>

                    <!-- Cloud 3 -->
                    <div onclick="showLiveToast('Cloud Ingest', 'Downloading Neon_Cyberpunk_LowerThird_Pack.json', 'info')" 
                         style="display:flex; align-items:center; justify-content:space-between; background:#0f172a; border:1.2px solid #334155; border-radius:8px; padding:10px 12px; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f472b6" stroke-width="2.2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
                            <div style="display:flex; flex-direction:column; gap:2px;">
                                <span style="font-size:12px; font-weight:900; color:#ffffff;">Cyberpunk_LowerThird_Pack</span>
                                <span style="font-size:10px; font-weight:800; color:#fde047;">12 Motion Title Templates</span>
                            </div>
                        </div>
                        <button style="height:28px; padding:0 14px; background:#b45309; color:#ffffff; border:1.2px solid #fbbf24; border-radius:6px; font-size:11px; font-weight:900; cursor:pointer;">GET</button>
                    </div>
                </div>

                <button onclick="showLiveToast('Cloud Sync', 'Checking Online Repositories...', 'info')" 
                        style="height:40px; min-height:40px; background:#b45309; color:#ffffff; border:1.6px solid #fbbf24; border-radius:8px; font-size:12px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 0 12px rgba(251,191,36,0.35); transition:all 0.15s;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    <span>EXPLORE 10,000+ CLOUD ASSETS</span>
                </button>
            </div>
        </foreignObject>
    </g>         <div onclick="showLiveToast('Cloud Ingest', 'Downloading Neon_Cyberpunk_LowerThird_Pack.json', 'info')" 
                         style="display:flex; align-items:center; justify-content:space-between; background:#0f172a; border:1.2px solid #334155; border-radius:7px; padding:10px; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f472b6" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
                            <div style="display:flex; flex-direction:column; gap:2px;">
                                <span style="font-size:11px; font-weight:900; color:#ffffff;">Cyberpunk_LowerThird_Pack</span>
                                <span style="font-size:8.5px; font-weight:800; color:#fde047;">12 Motion Title Templates</span>
                            </div>
                        </div>
                        <button style="height:26px; padding:0 12px; background:#b45309; color:#ffffff; border:1px solid #fbbf24; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">GET</button>
                    </div>
                </div>

                <button onclick="showLiveToast('Cloud Sync', 'Checking Online Repositories...', 'info')" 
                        style="height:38px; min-height:38px; background:#b45309; color:#ffffff; border:1.4px solid #fbbf24; border-radius:8px; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 0 12px rgba(251,191,36,0.35); transition:all 0.15s;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    <span>EXPLORE 10,000+ CLOUD ASSETS</span>
                </button>
            </div>
        </foreignObject>
    </g>
</svg>`;
}

module.exports = {
    renderTitanSvgMediaCard,
    MEDIA_CATEGORIES
};
