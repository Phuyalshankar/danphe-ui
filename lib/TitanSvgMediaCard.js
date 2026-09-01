'use strict';

/**
 * 🐬 TitanSvgMediaCard (danphe-ui/lib)
 * LEFT MOBILE SCREEN: 360° Cinema Camera Lens, Dedicated Overlay Importer & BG Pad Hub (360x560px)
 * 5-Tab Architecture: LENS • OVERLAY • BG PAD • EXPORTS • CLOUD
 * ZERO-WOBBLE MATHEMATICAL ARCHITECTURE: (0,0) Centered Optical Elements + Shortest Path 120 FPS Easing
 */

const MEDIA_CATEGORIES = [
    { id: 'video', name: 'Video Footage', label: '🎬 VIDEO', icon: '🎬', color: '#38bdf8', bg: '#082f49', stroke: '#0284c7', angle: 0, accept: 'video/*' },
    { id: 'photo', name: 'Photos & Logos', label: '📸 PHOTO', icon: '📸', color: '#c084fc', bg: '#3b0764', stroke: '#a855f7', angle: 45, accept: 'image/*' },
    { id: 'overlay', name: 'Overlay Media', label: '🖼️ OVERLAY', icon: '🖼️', color: '#fb923c', bg: '#431407', stroke: '#ea580c', angle: 90, accept: 'video/*,image/*' },
    { id: 'audio', name: 'Audio & Music', label: '🎵 AUDIO', icon: '🎵', color: '#34d399', bg: '#064e3b', stroke: '#10b981', angle: 135, accept: 'audio/*' },
    { id: 'text', name: 'Kinetic Text', label: '✍️ TEXT', icon: '✍️', color: '#f472b6', bg: '#500724', stroke: '#ec4899', angle: 180, accept: '.txt,.json' },
    { id: 'vfx', name: 'VFX Shaders', label: '💥 VFX', icon: '💥', color: '#ef4444', bg: '#450a0a', stroke: '#dc2626', angle: 225, accept: '.fx,.frag' },
    { id: 'elements', name: 'Shapes & Badges', label: '🎭 SHAPES', icon: '🎭', color: '#60a5fa', bg: '#172554', stroke: '#3b82f6', angle: 270, accept: '.svg' },
    { id: 'cloud', name: 'Cloud & Stock', label: '🌐 CLOUD', icon: '🌐', color: '#fbbf24', bg: '#451a03', stroke: '#f59e0b', angle: 315, accept: '*/*' }
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

    // 8 Upright Fixed Stationary Category Nodes (Placed around (0,0))
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
            <text x="0" y="${isCurrent ? 5 : 4}" font-size="${isCurrent ? 14 : 11}" text-anchor="middle" dominant-baseline="middle">${cat.icon}</text>
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
    ══════════════════════════════════════════════════════════════════════════ -->
    <rect x="2" y="2" width="356" height="556" rx="26" fill="url(#${id}-chassis-bezel)" stroke="url(#${id}-chassis-rim)" stroke-width="2.5" />
    <rect x="6" y="6" width="348" height="548" rx="22" fill="#050811" stroke="#1e293b" stroke-width="1.2" />

    <!-- ═════════════════════════════════════════════════════════════════════════
         LAYER 2: TOP 5-TAB NAVIGATION BAR (REPLACED FOLDERS WITH OVERLAY IMPORT)
    ══════════════════════════════════════════════════════════════════════════ -->
    <foreignObject x="10" y="14" width="340" height="34">
        <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; gap:4px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <button id="${id}-tab-btn-lens" onclick="switchMediaCardTab('lens')" 
                    style="flex:1; height:28px; background:${activeTab === 'lens' ? '#0284c7' : '#0e1726'}; color:${activeTab === 'lens' ? '#ffffff' : '#cbd5e1'}; border:1.2px solid ${activeTab === 'lens' ? '#38bdf8' : '#334155'}; border-radius:6px; font-size:9.5px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:2px; box-shadow:${activeTab === 'lens' ? '0 0 10px rgba(56,189,248,0.4)' : 'none'}; transition:all 0.15s;">
                📷 LENS
            </button>
            <button id="${id}-tab-btn-overlay_import" onclick="switchMediaCardTab('overlay_import')" 
                    style="flex:1.3; height:28px; background:${activeTab === 'overlay_import' ? '#c2410c' : '#0e1726'}; color:${activeTab === 'overlay_import' ? '#ffffff' : '#fb923c'}; border:1.2px solid ${activeTab === 'overlay_import' ? '#fb923c' : '#334155'}; border-radius:6px; font-size:9.5px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:2px; box-shadow:${activeTab === 'overlay_import' ? '0 0 12px rgba(251,146,60,0.5)' : 'none'}; transition:all 0.15s;">
                🖼️ OVERLAY
            </button>
            <button id="${id}-tab-btn-bg_pad" onclick="switchMediaCardTab('bg_pad')" 
                    style="flex:1.1; height:28px; background:${activeTab === 'bg_pad' ? '#7c2d12' : '#0e1726'}; color:${activeTab === 'bg_pad' ? '#ffffff' : '#fdba74'}; border:1.2px solid ${activeTab === 'bg_pad' ? '#f97316' : '#334155'}; border-radius:6px; font-size:9.5px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:2px; box-shadow:${activeTab === 'bg_pad' ? '0 0 10px rgba(249,115,22,0.4)' : 'none'}; transition:all 0.15s;">
                🎨 BG PAD
            </button>
            <button id="${id}-tab-btn-exports" onclick="switchMediaCardTab('exports')" 
                    style="flex:1; height:28px; background:${activeTab === 'exports' ? '#0284c7' : '#0e1726'}; color:${activeTab === 'exports' ? '#ffffff' : '#cbd5e1'}; border:1.2px solid ${activeTab === 'exports' ? '#38bdf8' : '#334155'}; border-radius:6px; font-size:9.5px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:2px; box-shadow:${activeTab === 'exports' ? '0 0 10px rgba(56,189,248,0.4)' : 'none'}; transition:all 0.15s;">
                📦 EXPORT
            </button>
            <button id="${id}-tab-btn-cloud" onclick="switchMediaCardTab('cloud')" 
                    style="flex:1; height:28px; background:${activeTab === 'cloud' ? '#0284c7' : '#0e1726'}; color:${activeTab === 'cloud' ? '#ffffff' : '#cbd5e1'}; border:1.2px solid ${activeTab === 'cloud' ? '#38bdf8' : '#334155'}; border-radius:6px; font-size:9.5px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:2px; box-shadow:${activeTab === 'cloud' ? '0 0 10px rgba(56,189,248,0.4)' : 'none'}; transition:all 0.15s;">
                🌐 CLOUD
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
                <text x="0" y="6" font-size="6.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">IMPORT</text>
            </g>

            <!-- Stepper Buttons -->
            <g transform="translate(-166, -15)">
                <g class="cursor-pointer" onclick="stepRotaryWheel('${id}', -45)">
                    <rect x="0" y="0" width="30" height="30" rx="7" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
                    <path d="M18 9L12 15L18 21" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                    <text x="15" y="26.5" font-size="6" font-weight="900" fill="#e2e8f0" text-anchor="middle">-45°</text>
                </g>
            </g>

            <g transform="translate(136, -15)">
                <g class="cursor-pointer" onclick="stepRotaryWheel('${id}', 45)">
                    <rect x="0" y="0" width="30" height="30" rx="7" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
                    <path d="M12 9L18 15L12 21" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                    <text x="15" y="26.5" font-size="6" font-weight="900" fill="#e2e8f0" text-anchor="middle">+45°</text>
                </g>
            </g>
        </g>

        <!-- Route HUD & Dynamic List -->
        <foreignObject x="16" y="348" width="328" height="202">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:6px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <!-- HUD Status Banner -->
                <div style="height:26px; min-height:26px; background:${currentCat.bg}; border:1.2px solid ${currentCat.stroke}; border-radius:7px; display:flex; align-items:center; justify-content:space-between; padding:0 10px; box-sizing:border-box;">
                    <span id="${id}-hud-active-name" style="font-size:10.5px; font-weight:900; color:#ffffff; letter-spacing:0.5px;">${currentCat.label} POOL</span>
                    <span id="${id}-hud-active-pos" style="font-size:8.5px; font-weight:900; color:${currentCat.color}; background:#000000; padding:2px 8px; border-radius:4px; border:1px solid #334155;">ROUTE: ${currentCat.id.toUpperCase()}</span>
                </div>

                <!-- Live Imported Files Shelf List -->
                <div style="flex:1; background:#090d16; border:1.2px solid #1e293b; border-radius:9px; padding:6px 8px; box-sizing:border-box; display:flex; flex-direction:column; gap:4px; overflow:hidden;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
                        <span id="${id}-pool-header-title" style="font-size:8.5px; font-weight:900; color:#cbd5e1; letter-spacing:0.5px;">IMPORTED ${currentCat.name.toUpperCase()} (CLICK TO INSERT):</span>
                        <span id="${id}-pool-count-tag" style="font-size:8.5px; font-weight:900; color:${currentCat.color};">3 FILES</span>
                    </div>
                    <div id="${id}-imported-files-list-html" style="display:flex; flex-direction:column; gap:4px; flex:1; overflow-y:auto;">
                        <!-- Injected dynamically by updateMediaWheelUI -->
                    </div>
                </div>

                <!-- Bottom Master Import Button -->
                <button id="${id}-master-btn-html" onclick="triggerNativeMediaImport()" 
                        style="height:34px; min-height:34px; background:#082f49; color:#ffffff; border:1.5px solid #38bdf8; border-radius:8px; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 0 12px rgba(56,189,248,0.35); transition:all 0.15s;">
                    <span id="${id}-btn-import-lbl-html">📥 + IMPORT NEW ${currentCat.label} FILE</span>
                </button>
            </div>
        </foreignObject>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 2: 🖼️ DEDICATED OVERLAY MEDIA IMPORTER & PiP SHELF (REPLACED FOLDERS)
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-overlay_import" style="${activeTab === 'overlay_import' ? '' : 'display:none;'}">
        <foreignObject x="16" y="52" width="328" height="498">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:8px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <!-- ── 1. 🎭 AI HEAD SWAP & MOTION TRACKER SUITE ── -->
                <div style="background:linear-gradient(135deg, #3b0764, #1e1b4b); border:1.2px solid #a855f7; border-radius:8px; padding:8px 10px; display:flex; flex-direction:column; gap:6px;">
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                        <span style="font-size:10px; font-weight:900; color:#f0abfc;">🎭 AI HEAD SWAP &amp; MOTION TRACKER</span>
                        <span style="font-size:7.5px; font-weight:900; background:#000000; color:#a855f7; padding:2px 5px; border-radius:4px; border:1px solid #9333ea;">120 FPS GYRO</span>
                    </div>

                    <!-- Head Replacement Preset Avatars -->
                    <div style="display:flex; flex-direction:column; gap:3px;">
                        <span style="font-size:8px; font-weight:800; color:#cbd5e1;">SELECT REPLACEMENT HEAD / MASK:</span>
                        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:3px;">
                            <button onclick="setHeadSwapAvatar('cyborg')" class="head-avatar-btn" style="height:25px; background:#0f172a; color:#ffffff; border:1px solid #38bdf8; border-radius:4px; font-size:8.5px; font-weight:900; cursor:pointer;">🤖 Cyborg</button>
                            <button onclick="setHeadSwapAvatar('lion')" class="head-avatar-btn" style="height:25px; background:#0f172a; color:#cbd5e1; border:1px solid #334155; border-radius:4px; font-size:8.5px; font-weight:900; cursor:pointer;">🦁 Lion Mask</button>
                            <button onclick="setHeadSwapAvatar('crown')" class="head-avatar-btn" style="height:25px; background:#0f172a; color:#cbd5e1; border:1px solid #334155; border-radius:4px; font-size:8.5px; font-weight:900; cursor:pointer;">👑 Crown</button>
                            <button onclick="setHeadSwapAvatar('shades')" class="head-avatar-btn" style="height:25px; background:#0f172a; color:#cbd5e1; border:1px solid #334155; border-radius:4px; font-size:8.5px; font-weight:900; cursor:pointer;">🕶️ 3D Shades</button>
                            <button onclick="setHeadSwapAvatar('cartoon')" class="head-avatar-btn" style="height:25px; background:#0f172a; color:#cbd5e1; border:1px solid #334155; border-radius:4px; font-size:8.5px; font-weight:900; cursor:pointer;">🤠 Cartoon</button>
                            <button onclick="setHeadSwapAvatar('alien')" class="head-avatar-btn" style="height:25px; background:#0f172a; color:#cbd5e1; border:1px solid #334155; border-radius:4px; font-size:8.5px; font-weight:900; cursor:pointer;">👽 Alien</button>
                        </div>
                    </div>

                    <!-- Sync Tracking Controls -->
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; background:#090d16; padding:4px 6px; border-radius:5px; border:1px solid #334155;">
                        <div style="display:flex; flex-direction:column; gap:1px;">
                            <span style="font-size:7.5px; font-weight:900; color:#94a3b8;">WALKING BOB SYNC:</span>
                            <div style="display:flex; align-items:center; gap:4px;">
                                <input type="range" min="0" max="100" value="100" oninput="setWalkingBob(this.value)" style="width:100%; height:3px; accent-color:#c084fc; cursor:pointer;" />
                                <span id="val-walking-bob" style="font-size:7.5px; font-weight:900; color:#c084fc;">100%</span>
                            </div>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:1px;">
                            <span style="font-size:7.5px; font-weight:900; color:#94a3b8;">NECK PIVOT ANCHOR:</span>
                            <div style="display:flex; align-items:center; gap:4px;">
                                <input type="range" min="50" max="120" value="90" oninput="setNeckPivot(this.value)" style="width:100%; height:3px; accent-color:#38bdf8; cursor:pointer;" />
                                <span id="val-neck-pivot" style="font-size:7.5px; font-weight:900; color:#38bdf8;">90%</span>
                            </div>
                        </div>
                    </div>

                    <!-- 1-Click Activate Head Swap -->
                    <button onclick="activateHeadSwapMode()" style="height:28px; background:linear-gradient(135deg, #7e22ce, #a855f7); color:#ffffff; border:1px solid #c084fc; border-radius:6px; font-size:9.5px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px; box-shadow:0 0 10px rgba(168,85,247,0.4);">
                        ⚡ + ACTIVATE AI HEAD TRACKING (V2 SYNC)
                    </button>
                </div>

                <!-- ── 2. GENERAL OVERLAY ASSETS SHELF ── -->
                <div style="flex:1; background:#090d16; border:1.2px solid #1e293b; border-radius:10px; padding:8px; box-sizing:border-box; display:flex; flex-direction:column; gap:5px; overflow-y:auto;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1px;">
                        <span style="font-size:9px; font-weight:900; color:#fdba74;">OVERLAY ASSETS SHELF (V2/PIP):</span>
                        <button onclick="triggerNativeOverlayImport()" style="padding:2px 6px; background:#c2410c; color:#ffffff; border:1px solid #fb923c; border-radius:4px; font-size:7.5px; font-weight:900; cursor:pointer;">+ IMPORT FILE</button>
                    </div>

                    <!-- Overlay Asset 1: PiP Facecam Video -->
                    <div onclick="insertOverlayItemToTimeline('Facecam_Streamer_React_1080p.mp4', 'pip')" style="display:flex; align-items:center; justify-content:space-between; background:#0f172a; border:1.2px solid #334155; border-radius:6px; padding:6px 8px; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:16px;">🎥</span>
                            <div style="display:flex; flex-direction:column; gap:1px;">
                                <span style="font-size:10px; font-weight:900; color:#ffffff;">Facecam_Streamer_React.mp4</span>
                                <span style="font-size:7.5px; font-weight:800; color:#fdba74;">PiP Video • 1080p 60FPS</span>
                            </div>
                        </div>
                        <button style="height:22px; padding:0 8px; background:#c2410c; color:#ffffff; border:1px solid #fb923c; border-radius:4px; font-size:8px; font-weight:900; cursor:pointer;">+ INSERT</button>
                    </div>

                    <!-- Overlay Asset 2: Transparent Studio Logo -->
                    <div onclick="insertOverlayItemToTimeline('Dolphin_Studio_4K_Watermark.png', 'logo')" style="display:flex; align-items:center; justify-content:space-between; background:#0f172a; border:1.2px solid #334155; border-radius:6px; padding:6px 8px; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:16px;">🐬</span>
                            <div style="display:flex; flex-direction:column; gap:1px;">
                                <span style="font-size:10px; font-weight:900; color:#ffffff;">Dolphin_4K_Watermark.png</span>
                                <span style="font-size:7.5px; font-weight:800; color:#67e8f9;">Alpha Logo • Transparent PNG</span>
                            </div>
                        </div>
                        <button style="height:22px; padding:0 8px; background:#0284c7; color:#ffffff; border:1px solid #38bdf8; border-radius:4px; font-size:8px; font-weight:900; cursor:pointer;">+ INSERT</button>
                    </div>

                    <!-- Overlay Asset 3: Subscribe Animated Button -->
                    <div onclick="insertOverlayItemToTimeline('Subscribe_Bell_Notification.webm', 'sticker')" style="display:flex; align-items:center; justify-content:space-between; background:#0f172a; border:1.2px solid #334155; border-radius:6px; padding:6px 8px; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:16px;">🔔</span>
                            <div style="display:flex; flex-direction:column; gap:1px;">
                                <span style="font-size:10px; font-weight:900; color:#ffffff;">Subscribe_Bell_Anim.webm</span>
                                <span style="font-size:7.5px; font-weight:800; color:#fca5a5;">Alpha WebM • Animated Badge</span>
                            </div>
                        </div>
                        <button style="height:22px; padding:0 8px; background:#b91c1c; color:#ffffff; border:1px solid #ef4444; border-radius:4px; font-size:8px; font-weight:900; cursor:pointer;">+ INSERT</button>
                    </div>
                </div>

                <!-- Footer Ingest Status -->
                <div style="height:28px; min-height:28px; background:#080d18; border:1px solid #1e293b; border-radius:6px; display:flex; align-items:center; justify-content:space-between; padding:0 8px; box-sizing:border-box;">
                    <span style="font-size:7.5px; font-weight:900; color:#94a3b8;">ACTIVE PIP TARGET:</span>
                    <span style="font-size:8.5px; font-weight:900; color:#fb923c; font-family:monospace;">TRACK: V2 (OVERLAY/PIP)</span>
                </div>
            </div>
        </foreignObject>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 3: 🎨 OVERLAY BG & MATTE PAD STUDIO
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-bg_pad" style="${activeTab === 'bg_pad' ? '' : 'display:none;'}">
        <foreignObject x="16" y="52" width="328" height="498">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:8px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <!-- Overlay Header -->
                <div style="background:linear-gradient(135deg, #431407, #7c2d12); border:1.2px solid #ea580c; border-radius:8px; padding:8px 10px; display:flex; align-items:center; justify-content:space-between;">
                    <span style="font-size:11px; font-weight:900; color:#ffffff;">🎨 OVERLAY BG &amp; PAD STUDIO</span>
                    <span style="font-size:8px; font-weight:900; background:#000000; color:#fdba74; padding:2px 6px; border-radius:4px; border:1px solid #ea580c;">V2/PIP LAYER</span>
                </div>

                <!-- Overlay Pad Canvas Container -->
                <div style="flex:1; background:#090d16; border:1.2px solid #1e293b; border-radius:10px; padding:10px; box-sizing:border-box; display:flex; flex-direction:column; gap:8px; overflow-y:auto;">
                    
                    <!-- 1. Pad Aspect Ratio Selector -->
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:8.5px; font-weight:900; color:#cbd5e1;">PAD ASPECT RATIO:</span>
                        <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:4px;">
                            <button onclick="setOverlayPadRatio('16:9')" class="overlay-ratio-btn" style="height:26px; background:#0f172a; color:#ffffff; border:1px solid #38bdf8; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">16:9 Cinema</button>
                            <button onclick="setOverlayPadRatio('9:16')" class="overlay-ratio-btn" style="height:26px; background:#0f172a; color:#cbd5e1; border:1px solid #334155; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">9:16 Reel</button>
                            <button onclick="setOverlayPadRatio('1:1')" class="overlay-ratio-btn" style="height:26px; background:#0f172a; color:#cbd5e1; border:1px solid #334155; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">1:1 Square</button>
                            <button onclick="setOverlayPadRatio('4:5')" class="overlay-ratio-btn" style="height:26px; background:#0f172a; color:#cbd5e1; border:1px solid #334155; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">4:5 Post</button>
                        </div>
                    </div>

                    <!-- 2. Pad Background Style Palette -->
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:8.5px; font-weight:900; color:#cbd5e1;">BACKGROUND STYLE / MATTE:</span>
                        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:4px;">
                            <button onclick="setOverlayPadStyle('alpha')" style="height:28px; background:#030712; color:#38bdf8; border:1px solid #0284c7; border-radius:5px; font-size:8.5px; font-weight:900; cursor:pointer;">🏁 Alpha Matte</button>
                            <button onclick="setOverlayPadStyle('obsidian')" style="height:28px; background:#090d16; color:#ffffff; border:1px solid #334155; border-radius:5px; font-size:8.5px; font-weight:900; cursor:pointer;">🌑 Dark Pad</button>
                            <button onclick="setOverlayPadStyle('cyan-grad')" style="height:28px; background:linear-gradient(135deg, #0284c7, #0f172a); color:#ffffff; border:1px solid #38bdf8; border-radius:5px; font-size:8.5px; font-weight:900; cursor:pointer;">🌌 Cyan Glow</button>
                            <button onclick="setOverlayPadStyle('sunset')" style="height:28px; background:linear-gradient(135deg, #ea580c, #451a03); color:#ffffff; border:1px solid #f97316; border-radius:5px; font-size:8.5px; font-weight:900; cursor:pointer;">🌅 Sunset</button>
                            <button onclick="setOverlayPadStyle('neon-purple')" style="height:28px; background:linear-gradient(135deg, #7e22ce, #1e1b4b); color:#ffffff; border:1px solid #a855f7; border-radius:5px; font-size:8.5px; font-weight:900; cursor:pointer;">🔮 Neon Glow</button>
                            <button onclick="setOverlayPadStyle('blur')" style="height:28px; background:#1e293b; color:#cbd5e1; border:1px solid #475569; border-radius:5px; font-size:8.5px; font-weight:900; cursor:pointer;">🌫️ Video Blur</button>
                        </div>
                    </div>

                    <!-- 3. PiP Position Presets -->
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:8.5px; font-weight:900; color:#cbd5e1;">PiP OVERLAY POSITION ANCHORS:</span>
                        <div style="display:flex; gap:4px;">
                            <button onclick="setOverlayPipAnchor('top-left')" style="flex:1; height:24px; background:#0f172a; color:#ffffff; border:1px solid #334155; border-radius:4px; font-size:8px; font-weight:900; cursor:pointer;">↖ Top-Left</button>
                            <button onclick="setOverlayPipAnchor('top-right')" style="flex:1; height:24px; background:#0f172a; color:#ffffff; border:1px solid #38bdf8; border-radius:4px; font-size:8px; font-weight:900; cursor:pointer;">↗ Top-Right</button>
                            <button onclick="setOverlayPipAnchor('bottom-left')" style="flex:1; height:24px; background:#0f172a; color:#ffffff; border:1px solid #334155; border-radius:4px; font-size:8px; font-weight:900; cursor:pointer;">↙ Bot-Left</button>
                            <button onclick="setOverlayPipAnchor('bottom-right')" style="flex:1; height:24px; background:#0f172a; color:#ffffff; border:1px solid #334155; border-radius:4px; font-size:8px; font-weight:900; cursor:pointer;">↘ Bot-Right</button>
                            <button onclick="setOverlayPipAnchor('center')" style="flex:1; height:24px; background:#0f172a; color:#ffffff; border:1px solid #334155; border-radius:4px; font-size:8px; font-weight:900; cursor:pointer;">🔲 Center</button>
                        </div>
                    </div>

                    <!-- 4. Opacity & Blend Mode -->
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; background:#0f172a; padding:6px 8px; border-radius:6px; border:1px solid #1e293b;">
                        <div style="display:flex; flex-direction:column; gap:2px; flex:1;">
                            <div style="display:flex; justify-content:space-between;">
                                <span style="font-size:8px; font-weight:900; color:#94a3b8;">OVERLAY OPACITY:</span>
                                <span id="overlay-opacity-val" style="font-size:8px; font-weight:900; color:#fb923c;">100%</span>
                            </div>
                            <input type="range" min="0" max="100" value="100" oninput="updateOverlayOpacity(this.value)" style="width:100%; height:4px; accent-color:#ea580c; cursor:pointer;" />
                        </div>
                        <div style="display:flex; flex-direction:column; gap:2px; width:90px;">
                            <span style="font-size:8px; font-weight:900; color:#94a3b8;">BLEND MODE:</span>
                            <select onchange="updateOverlayBlendMode(this.value)" style="background:#090d16; color:#ffffff; border:1px solid #334155; border-radius:4px; font-size:8px; font-weight:900; padding:2px;">
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
                        style="height:36px; min-height:36px; background:linear-gradient(135deg, #c2410c, #ea580c); color:#ffffff; border:1.4px solid #fb923c; border-radius:8px; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 0 14px rgba(234,88,12,0.4); transition:all 0.15s;">
                    🚀 + INGEST OVERLAY PAD TO TIMELINE (V2/PIP)
                </button>
            </div>
        </foreignObject>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 4: 📦 EXPORTED MASTER VIDEO DELIVERIES (CLEARTYPE HTML)
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-exports" style="${activeTab === 'exports' ? '' : 'display:none;'}">
        <foreignObject x="16" y="52" width="328" height="498">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:8px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <div style="flex:1; background:#090d16; border:1.2px solid #1e293b; border-radius:10px; padding:12px; box-sizing:border-box; display:flex; flex-direction:column; gap:8px;">
                    <span style="font-size:11.5px; font-weight:900; color:#38bdf8;">📦 EXPORTED MASTER DELIVERIES</span>
                    <span style="font-size:9px; font-weight:800; color:#cbd5e1; margin-bottom:4px;">Rendered 4K / 1080p Final Output Files:</span>

                    <!-- Export 1 -->
                    <div onclick="showLiveToast('Export Ready', 'Opening Final_Master_4K_60FPS.mp4', 'success')" 
                         style="display:flex; align-items:center; justify-content:space-between; background:#0f172a; border:1.2px solid #334155; border-radius:7px; padding:10px; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="font-size:20px;">🎬</span>
                            <div style="display:flex; flex-direction:column; gap:2px;">
                                <span style="font-size:11px; font-weight:900; color:#ffffff;">Final_Master_4K_60FPS.mp4</span>
                                <span style="font-size:8.5px; font-weight:800; color:#86efac;">H.264 • 4K UHD 60FPS • 124.5 MB • Completed</span>
                            </div>
                        </div>
                        <button style="height:26px; padding:0 14px; background:#065f46; color:#ffffff; border:1px solid #10b981; border-radius:5px; font-size:9.5px; font-weight:900; cursor:pointer;">PLAY</button>
                    </div>

                    <!-- Export 2 -->
                    <div onclick="showLiveToast('Export Ready', 'Opening Reel_Cut_1080p_9x16.mp4', 'success')" 
                         style="display:flex; align-items:center; justify-content:space-between; background:#0f172a; border:1.2px solid #334155; border-radius:7px; padding:10px; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="font-size:20px;">📱</span>
                            <div style="display:flex; flex-direction:column; gap:2px;">
                                <span style="font-size:11px; font-weight:900; color:#ffffff;">Reel_Cut_1080p_9x16.mp4</span>
                                <span style="font-size:8.5px; font-weight:800; color:#86efac;">Vertical 9:16 • 18.2 MB • Completed</span>
                            </div>
                        </div>
                        <button style="height:26px; padding:0 14px; background:#065f46; color:#ffffff; border:1px solid #10b981; border-radius:5px; font-size:9.5px; font-weight:900; cursor:pointer;">PLAY</button>
                    </div>
                </div>

                <button onclick="showLiveToast('Render Queue', 'Starting New Project Render...', 'info')" 
                        style="height:38px; min-height:38px; background:#0284c7; color:#ffffff; border:1.4px solid #38bdf8; border-radius:8px; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 0 12px rgba(56,189,248,0.35); transition:all 0.15s;">
                    ⚡ RENDER NEW TIMELINE MASTER
                </button>
            </div>
        </foreignObject>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 5: 🌐 CLOUD STOCK & ONLINE ASSETS (CLEARTYPE HTML)
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-cloud" style="${activeTab === 'cloud' ? '' : 'display:none;'}">
        <foreignObject x="16" y="52" width="328" height="498">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:8px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <div style="flex:1; background:#090d16; border:1.2px solid #1e293b; border-radius:10px; padding:12px; box-sizing:border-box; display:flex; flex-direction:column; gap:8px; overflow-y:auto;">
                    <span style="font-size:11.5px; font-weight:900; color:#fbbf24;">🌐 CLOUD STOCK ASSET LIBRARY</span>
                    <span style="font-size:9px; font-weight:800; color:#cbd5e1; margin-bottom:4px;">Direct CDN Download to Project Bin:</span>

                    <!-- Cloud 1 -->
                    <div onclick="showLiveToast('Cloud Ingest', 'Downloading Cinema_Drone_Tokyo_Night_4K.mp4', 'info')" 
                         style="display:flex; align-items:center; justify-content:space-between; background:#0f172a; border:1.2px solid #334155; border-radius:7px; padding:10px; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="font-size:20px;">🗼</span>
                            <div style="display:flex; flex-direction:column; gap:2px;">
                                <span style="font-size:11px; font-weight:900; color:#ffffff;">Cinema_Drone_Tokyo_Night_4K</span>
                                <span style="font-size:8.5px; font-weight:800; color:#fde047;">4K UHD • Royalty Free • Stock</span>
                            </div>
                        </div>
                        <button style="height:26px; padding:0 12px; background:#b45309; color:#ffffff; border:1px solid #fbbf24; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">⬇ GET</button>
                    </div>

                    <!-- Cloud 2 -->
                    <div onclick="showLiveToast('Cloud Ingest', 'Downloading Cinematic_Epic_Orchestra_Music.wav', 'info')" 
                         style="display:flex; align-items:center; justify-content:space-between; background:#0f172a; border:1.2px solid #334155; border-radius:7px; padding:10px; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="font-size:20px;">🎻</span>
                            <div style="display:flex; flex-direction:column; gap:2px;">
                                <span style="font-size:11px; font-weight:900; color:#ffffff;">Cinematic_Epic_Orchestra.wav</span>
                                <span style="font-size:8.5px; font-weight:800; color:#fde047;">48kHz WAV • Stereo Master</span>
                            </div>
                        </div>
                        <button style="height:26px; padding:0 12px; background:#b45309; color:#ffffff; border:1px solid #fbbf24; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">⬇ GET</button>
                    </div>

                    <!-- Cloud 3 -->
                    <div onclick="showLiveToast('Cloud Ingest', 'Downloading Neon_Cyberpunk_LowerThird_Pack.json', 'info')" 
                         style="display:flex; align-items:center; justify-content:space-between; background:#0f172a; border:1.2px solid #334155; border-radius:7px; padding:10px; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="font-size:20px;">✨</span>
                            <div style="display:flex; flex-direction:column; gap:2px;">
                                <span style="font-size:11px; font-weight:900; color:#ffffff;">Cyberpunk_LowerThird_Pack</span>
                                <span style="font-size:8.5px; font-weight:800; color:#fde047;">12 Motion Title Templates</span>
                            </div>
                        </div>
                        <button style="height:26px; padding:0 12px; background:#b45309; color:#ffffff; border:1px solid #fbbf24; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">⬇ GET</button>
                    </div>
                </div>

                <button onclick="showLiveToast('Cloud Sync', 'Checking Online Repositories...', 'info')" 
                        style="height:38px; min-height:38px; background:#b45309; color:#ffffff; border:1.4px solid #fbbf24; border-radius:8px; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 0 12px rgba(251,191,36,0.35); transition:all 0.15s;">
                    🌐 EXPLORE 10,000+ CLOUD ASSETS
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
