'use strict';

/**
 * 🐬 TitanSvgThumbnailCard (danphe-ui/lib)
 * RIGHT MOBILE SCREEN: YouTube Thumbnail & Photoshop Photo Studio (360x560px)
 * 5-Tab Architecture: CUTOUT • OUTLINE • HDR POP • 3D TEXT • EXPORT
 * 1-Click AI BG Removal, Creator Stroke, HDR Contrast, 3D Badges, & 1280x720 HD Downloader
 */

function renderTitanSvgThumbnailCard(options = {}) {
    const {
        id = 'titan-svg-thumbnail-card',
        activeTab = 'cutout', // 'cutout' | 'outline' | 'hdr' | 'text' | 'export'
        strokeColor = '#ffffff',
        strokeWidth = 8,
        glowIntensity = 80,
        hdrPop = 40,
        bgBlur = 12
    } = options;

    return `
<svg id="${id}" viewBox="0 0 360 560" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" 
     class="select-none filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.98)] w-full max-w-[360px] mx-auto">
    <defs>
        <linearGradient id="${id}-chassis-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f59e0b" />
            <stop offset="25%" stop-color="#ea580c" />
            <stop offset="50%" stop-color="#090d16" />
            <stop offset="80%" stop-color="#1e293b" />
            <stop offset="100%" stop-color="#fbbf24" />
        </linearGradient>

        <linearGradient id="${id}-chassis-bezel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#030712" />
            <stop offset="50%" stop-color="#090d16" />
            <stop offset="100%" stop-color="#020617" />
        </linearGradient>

        <filter id="${id}-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
                <feMergeNode in="blur" />
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
         LAYER 2: TOP 5-TAB NAVIGATION BAR (PHOTOSHOP / THUMBNAIL STUDIO)
    ══════════════════════════════════════════════════════════════════════════ -->
    <foreignObject x="10" y="14" width="340" height="34">
        <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; gap:3px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <button id="${id}-tab-btn-cutout" onclick="switchThumbnailStudioTab('cutout')" 
                    style="flex:1; height:28px; background:${activeTab === 'cutout' ? '#ea580c' : '#0e1726'}; color:${activeTab === 'cutout' ? '#ffffff' : '#fb923c'}; border:1.2px solid ${activeTab === 'cutout' ? '#fb923c' : '#334155'}; border-radius:6px; font-size:9px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:2px; box-shadow:${activeTab === 'cutout' ? '0 0 10px rgba(251,146,60,0.5)' : 'none'}; transition:all 0.15s;">
                🪄 CUTOUT
            </button>
            <button id="${id}-tab-btn-outline" onclick="switchThumbnailStudioTab('outline')" 
                    style="flex:1.1; height:28px; background:${activeTab === 'outline' ? '#0284c7' : '#0e1726'}; color:${activeTab === 'outline' ? '#ffffff' : '#38bdf8'}; border:1.2px solid ${activeTab === 'outline' ? '#38bdf8' : '#334155'}; border-radius:6px; font-size:9px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:2px; box-shadow:${activeTab === 'outline' ? '0 0 10px rgba(56,189,248,0.5)' : 'none'}; transition:all 0.15s;">
                ✨ OUTLINE
            </button>
            <button id="${id}-tab-btn-hdr" onclick="switchThumbnailStudioTab('hdr')" 
                    style="flex:1; height:28px; background:${activeTab === 'hdr' ? '#b45309' : '#0e1726'}; color:${activeTab === 'hdr' ? '#ffffff' : '#fbbf24'}; border:1.2px solid ${activeTab === 'hdr' ? '#fbbf24' : '#334155'}; border-radius:6px; font-size:9px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:2px; box-shadow:${activeTab === 'hdr' ? '0 0 10px rgba(251,191,36,0.5)' : 'none'}; transition:all 0.15s;">
                ⚡ HDR POP
            </button>
            <button id="${id}-tab-btn-text" onclick="switchThumbnailStudioTab('text')" 
                    style="flex:1; height:28px; background:${activeTab === 'text' ? '#7e22ce' : '#0e1726'}; color:${activeTab === 'text' ? '#ffffff' : '#c084fc'}; border:1.2px solid ${activeTab === 'text' ? '#c084fc' : '#334155'}; border-radius:6px; font-size:9px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:2px; box-shadow:${activeTab === 'text' ? '0 0 10px rgba(192,132,252,0.5)' : 'none'}; transition:all 0.15s;">
                🔤 3D TEXT
            </button>
            <button id="${id}-tab-btn-export" onclick="switchThumbnailStudioTab('export')" 
                    style="flex:1; height:28px; background:${activeTab === 'export' ? '#047857' : '#0e1726'}; color:${activeTab === 'export' ? '#ffffff' : '#34d399'}; border:1.2px solid ${activeTab === 'export' ? '#34d399' : '#334155'}; border-radius:6px; font-size:9px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:2px; box-shadow:${activeTab === 'export' ? '0 0 10px rgba(52,211,153,0.5)' : 'none'}; transition:all 0.15s;">
                💾 EXPORT
            </button>
        </div>
    </foreignObject>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 1: 🪄 1-CLICK AI BACKGROUND REMOVAL & CUTOUT
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-cutout" style="${activeTab === 'cutout' ? '' : 'display:none;'}">
        <foreignObject x="14" y="52" width="332" height="498">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:8px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <div style="background:linear-gradient(135deg, #431407, #7c2d12); border:1.2px solid #ea580c; border-radius:8px; padding:8px 10px; display:flex; align-items:center; justify-content:space-between;">
                    <span style="font-size:11px; font-weight:900; color:#ffffff;">🪄 AI BACKGROUND REMOVER</span>
                    <span style="font-size:8px; font-weight:900; background:#000000; color:#fdba74; padding:2px 6px; border-radius:4px; border:1px solid #ea580c;">AUTO CUTOUT</span>
                </div>

                <div style="flex:1; background:#090d16; border:1.2px solid #1e293b; border-radius:10px; padding:10px; box-sizing:border-box; display:flex; flex-direction:column; gap:8px; overflow-y:auto;">
                    <button onclick="toggleAiCutout()" id="btn-toggle-ai-cutout" style="height:36px; background:#065f46; color:#ffffff; border:1.2px solid #10b981; border-radius:6px; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 0 12px rgba(16,185,129,0.4);">
                        🪄 1-CLICK REMOVE BACKGROUND
                    </button>

                    <div style="display:flex; flex-direction:column; gap:3px;">
                        <span style="font-size:8.5px; font-weight:900; color:#cbd5e1;">CUTOUT SUBJECT PRESETS:</span>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px;">
                            <button onclick="selectCutoutSubject('person')" style="height:28px; background:#0f172a; color:#ffffff; border:1px solid #38bdf8; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">👤 Person / Face</button>
                            <button onclick="selectCutoutSubject('product')" style="height:28px; background:#0f172a; color:#cbd5e1; border:1px solid #334155; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">📦 Product / Object</button>
                            <button onclick="selectCutoutSubject('vehicle')" style="height:28px; background:#0f172a; color:#cbd5e1; border:1px solid #334155; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">🚗 Car / Vehicle</button>
                            <button onclick="selectCutoutSubject('animal')" style="height:28px; background:#0f172a; color:#cbd5e1; border:1px solid #334155; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">🐱 Pet / Animal</button>
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:4px; background:#0f172a; padding:6px 8px; border-radius:6px; border:1px solid #1e293b;">
                        <div style="display:flex; justify-content:space-between;">
                            <span style="font-size:8px; font-weight:900; color:#94a3b8;">EDGE FEATHER SOFTNESS:</span>
                            <span id="val-cutout-feather" style="font-size:8px; font-weight:900; color:#38bdf8;">4 px</span>
                        </div>
                        <input type="range" min="0" max="20" value="4" oninput="setCutoutFeather(this.value)" style="width:100%; height:4px; accent-color:#0284c7; cursor:pointer;" />
                    </div>
                </div>

                <button onclick="applyCutoutToTimeline()" style="height:36px; min-height:36px; background:linear-gradient(135deg, #0284c7, #0369a1); color:#ffffff; border:1.4px solid #38bdf8; border-radius:8px; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 0 12px rgba(56,189,248,0.35);">
                    🚀 APPLY CUTOUT TO HERO OBJECT
                </button>
            </div>
        </foreignObject>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 2: ✨ YOUTUBE CREATOR POP OUTLINE STROKE & GLOW
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-outline" style="${activeTab === 'outline' ? '' : 'display:none;'}">
        <foreignObject x="14" y="52" width="332" height="498">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:8px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <div style="background:linear-gradient(135deg, #082f49, #0c4a6e); border:1.2px solid #0284c7; border-radius:8px; padding:8px 10px; display:flex; align-items:center; justify-content:space-between;">
                    <span style="font-size:11px; font-weight:900; color:#ffffff;">✨ CREATOR POP OUTLINE STROKE</span>
                    <span style="font-size:8px; font-weight:900; background:#000000; color:#38bdf8; padding:2px 6px; border-radius:4px; border:1px solid #0284c7;">POP BORDER</span>
                </div>

                <div style="flex:1; background:#090d16; border:1.2px solid #1e293b; border-radius:10px; padding:10px; box-sizing:border-box; display:flex; flex-direction:column; gap:8px; overflow-y:auto;">
                    
                    <!-- Color Palette -->
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:8.5px; font-weight:900; color:#cbd5e1;">OUTLINE STROKE COLOR:</span>
                        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:4px;">
                            <button onclick="setCreatorStrokeColor('#ffffff')" class="stroke-color-btn" style="height:28px; background:#ffffff; color:#000000; border:2px solid #38bdf8; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">⚪ Pure White</button>
                            <button onclick="setCreatorStrokeColor('#38bdf8')" class="stroke-color-btn" style="height:28px; background:#082f49; color:#38bdf8; border:1px solid #0284c7; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">🔷 Neon Cyan</button>
                            <button onclick="setCreatorStrokeColor('#fbbf24')" class="stroke-color-btn" style="height:28px; background:#451a03; color:#fbbf24; border:1px solid #f59e0b; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">🟡 Royal Gold</button>
                            <button onclick="setCreatorStrokeColor('#f472b6')" class="stroke-color-btn" style="height:28px; background:#500724; color:#f472b6; border:1px solid #ec4899; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">🌸 Neon Pink</button>
                            <button onclick="setCreatorStrokeColor('#34d399')" class="stroke-color-btn" style="height:28px; background:#064e3b; color:#34d399; border:1px solid #10b981; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">🟢 Lime Glow</button>
                            <button onclick="setCreatorStrokeColor('#ef4444')" class="stroke-color-btn" style="height:28px; background:#450a0a; color:#ef4444; border:1px solid #dc2626; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">🔴 Fire Red</button>
                        </div>
                    </div>

                    <!-- Stroke Width -->
                    <div style="display:flex; flex-direction:column; gap:4px; background:#0f172a; padding:6px 8px; border-radius:6px; border:1px solid #1e293b;">
                        <div style="display:flex; justify-content:space-between;">
                            <span style="font-size:8px; font-weight:900; color:#94a3b8;">OUTLINE THICKNESS:</span>
                            <span id="val-stroke-width" style="font-size:8px; font-weight:900; color:#38bdf8;">8 px</span>
                        </div>
                        <input type="range" min="0" max="24" value="8" oninput="setCreatorStrokeWidth(this.value)" style="width:100%; height:4px; accent-color:#0284c7; cursor:pointer;" />
                    </div>

                    <!-- Glow Intensity -->
                    <div style="display:flex; flex-direction:column; gap:4px; background:#0f172a; padding:6px 8px; border-radius:6px; border:1px solid #1e293b;">
                        <div style="display:flex; justify-content:space-between;">
                            <span style="font-size:8px; font-weight:900; color:#94a3b8;">DIFFUSE GLOW SPREAD:</span>
                            <span id="val-glow-intensity" style="font-size:8px; font-weight:900; color:#fbbf24;">80%</span>
                        </div>
                        <input type="range" min="0" max="100" value="80" oninput="setCreatorGlowIntensity(this.value)" style="width:100%; height:4px; accent-color:#f59e0b; cursor:pointer;" />
                    </div>
                </div>

                <button onclick="applyThumbnailGlowToCanvas()" style="height:36px; min-height:36px; background:linear-gradient(135deg, #0284c7, #38bdf8); color:#ffffff; border:1.4px solid #38bdf8; border-radius:8px; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 0 12px rgba(56,189,248,0.4);">
                    ⚡ UPDATE LIVE CREATOR OUTLINE
                </button>
            </div>
        </foreignObject>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 3: ⚡ HDR POP & BACKGROUND BOKEH BLUR
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-hdr" style="${activeTab === 'hdr' ? '' : 'display:none;'}">
        <foreignObject x="14" y="52" width="332" height="498">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:8px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <div style="background:linear-gradient(135deg, #451a03, #78350f); border:1.2px solid #f59e0b; border-radius:8px; padding:8px 10px; display:flex; align-items:center; justify-content:space-between;">
                    <span style="font-size:11px; font-weight:900; color:#ffffff;">⚡ HDR POP &amp; DEPTH BLUR</span>
                    <span style="font-size:8px; font-weight:900; background:#000000; color:#fbbf24; padding:2px 6px; border-radius:4px; border:1px solid #f59e0b;">CAMERA RAW</span>
                </div>

                <div style="flex:1; background:#090d16; border:1.2px solid #1e293b; border-radius:10px; padding:10px; box-sizing:border-box; display:flex; flex-direction:column; gap:8px; overflow-y:auto;">
                    <!-- HDR Vibrancy -->
                    <div style="display:flex; flex-direction:column; gap:4px; background:#0f172a; padding:6px 8px; border-radius:6px; border:1px solid #1e293b;">
                        <div style="display:flex; justify-content:space-between;">
                            <span style="font-size:8px; font-weight:900; color:#94a3b8;">HDR VIBRANCY / SATURATION:</span>
                            <span id="val-hdr-pop" style="font-size:8px; font-weight:900; color:#fbbf24;">+40%</span>
                        </div>
                        <input type="range" min="0" max="100" value="40" oninput="setThumbnailHdrPop(this.value)" style="width:100%; height:4px; accent-color:#f59e0b; cursor:pointer;" />
                    </div>

                    <!-- Background Blur -->
                    <div style="display:flex; flex-direction:column; gap:4px; background:#0f172a; padding:6px 8px; border-radius:6px; border:1px solid #1e293b;">
                        <div style="display:flex; justify-content:space-between;">
                            <span style="font-size:8px; font-weight:900; color:#94a3b8;">BACKGROUND BOKEH BLUR:</span>
                            <span id="val-bg-blur" style="font-size:8px; font-weight:900; color:#38bdf8;">12 px</span>
                        </div>
                        <input type="range" min="0" max="30" value="12" oninput="setThumbnailBgBlur(this.value)" style="width:100%; height:4px; accent-color:#0284c7; cursor:pointer;" />
                    </div>

                    <!-- Dark Vignette -->
                    <div style="display:flex; flex-direction:column; gap:4px; background:#0f172a; padding:6px 8px; border-radius:6px; border:1px solid #1e293b;">
                        <div style="display:flex; justify-content:space-between;">
                            <span style="font-size:8px; font-weight:900; color:#94a3b8;">CINEMATIC VIGNETTE:</span>
                            <span id="val-vignette" style="font-size:8px; font-weight:900; color:#a855f7;">50%</span>
                        </div>
                        <input type="range" min="0" max="100" value="50" oninput="setThumbnailVignette(this.value)" style="width:100%; height:4px; accent-color:#a855f7; cursor:pointer;" />
                    </div>
                </div>

                <button onclick="showLiveToast('HDR Pop', 'Applied HDR Tone Mapping &amp; Depth of Field Blur!', 'success')" style="height:36px; min-height:36px; background:linear-gradient(135deg, #b45309, #f59e0b); color:#ffffff; border:1.4px solid #fbbf24; border-radius:8px; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 0 12px rgba(251,191,36,0.35);">
                    ⚡ APPLY HDR DEPTH GRADING
                </button>
            </div>
        </foreignObject>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 4: 🔤 3D THUMBNAIL TEXT BADGES & STICKERS
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-text" style="${activeTab === 'text' ? '' : 'display:none;'}">
        <foreignObject x="14" y="52" width="332" height="498">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:8px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <div style="background:linear-gradient(135deg, #3b0764, #6b21a8); border:1.2px solid #a855f7; border-radius:8px; padding:8px 10px; display:flex; align-items:center; justify-content:space-between;">
                    <span style="font-size:11px; font-weight:900; color:#ffffff;">🔤 3D THUMBNAIL TEXT BADGES</span>
                    <span style="font-size:8px; font-weight:900; background:#000000; color:#c084fc; padding:2px 6px; border-radius:4px; border:1px solid #a855f7;">HIGH CTR</span>
                </div>

                <div style="flex:1; background:#090d16; border:1.2px solid #1e293b; border-radius:10px; padding:10px; box-sizing:border-box; display:flex; flex-direction:column; gap:8px; overflow-y:auto;">
                    <span style="font-size:8.5px; font-weight:900; color:#cbd5e1;">CLICK TO INSERT VIRAL BADGE:</span>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                        <button onclick="insertThumbnailBadge('🔥 VIRAL!')" style="height:32px; background:#b91c1c; color:#ffffff; border:1.5px solid #f87171; border-radius:5px; font-size:10px; font-weight:900; cursor:pointer;">🔥 VIRAL!</button>
                        <button onclick="insertThumbnailBadge('😱 100% REAL')" style="height:32px; background:#065f46; color:#ffffff; border:1.5px solid #34d399; border-radius:5px; font-size:10px; font-weight:900; cursor:pointer;">😱 100% REAL</button>
                        <button onclick="insertThumbnailBadge('💰 MUST WATCH')" style="height:32px; background:#b45309; color:#ffffff; border:1.5px solid #fbbf24; border-radius:5px; font-size:10px; font-weight:900; cursor:pointer;">💰 MUST WATCH</button>
                        <button onclick="insertThumbnailBadge('🤫 SECRET TRICK')" style="height:32px; background:#6b21a8; color:#ffffff; border:1.5px solid #c084fc; border-radius:5px; font-size:10px; font-weight:900; cursor:pointer;">🤫 SECRET TRICK</button>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:4px; margin-top:4px;">
                        <span style="font-size:8.5px; font-weight:900; color:#cbd5e1;">CUSTOM THUMBNAIL TEXT:</span>
                        <input id="input-thumb-text" type="text" value="UNBELIEVABLE!" style="height:30px; background:#0f172a; color:#ffffff; border:1.2px solid #38bdf8; border-radius:5px; padding:0 8px; font-size:11px; font-weight:900;" />
                    </div>
                </div>

                <button onclick="applyCustomThumbnailText()" style="height:36px; min-height:36px; background:linear-gradient(135deg, #7e22ce, #a855f7); color:#ffffff; border:1.4px solid #c084fc; border-radius:8px; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 0 12px rgba(168,85,247,0.35);">
                    🚀 INGEST 3D TEXT TO CANVAS
                </button>
            </div>
        </foreignObject>
    </g>

    <!-- ═════════════════════════════════════════════════════════════════════════
         PANEL 5: 💾 1-CLICK 1280x720 HD THUMBNAIL EXPORTER
    ══════════════════════════════════════════════════════════════════════════ -->
    <g id="${id}-panel-export" style="${activeTab === 'export' ? '' : 'display:none;'}">
        <foreignObject x="14" y="52" width="332" height="498">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; gap:8px; width:100%; height:100%; box-sizing:border-box; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <div style="background:linear-gradient(135deg, #064e3b, #047857); border:1.2px solid #10b981; border-radius:8px; padding:8px 10px; display:flex; align-items:center; justify-content:space-between;">
                    <span style="font-size:11px; font-weight:900; color:#ffffff;">💾 HD THUMBNAIL EXPORTER</span>
                    <span style="font-size:8px; font-weight:900; background:#000000; color:#34d399; padding:2px 6px; border-radius:4px; border:1px solid #10b981;">1280 x 720</span>
                </div>

                <div style="flex:1; background:#090d16; border:1.2px solid #1e293b; border-radius:10px; padding:12px; box-sizing:border-box; display:flex; flex-direction:column; gap:8px;">
                    <span style="font-size:11px; font-weight:900; color:#ffffff;">MASTER DELIVERABLE SPECS:</span>
                    
                    <div style="background:#0f172a; border:1px solid #334155; border-radius:7px; padding:8px 10px; display:flex; flex-direction:column; gap:4px;">
                        <div style="display:flex; justify-content:space-between;">
                            <span style="font-size:8.5px; font-weight:900; color:#94a3b8;">RESOLUTION:</span>
                            <span style="font-size:9px; font-weight:900; color:#38bdf8;">1280 x 720 px (16:9 Standard)</span>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="font-size:8.5px; font-weight:900; color:#94a3b8;">COLOR PROFILE:</span>
                            <span style="font-size:9px; font-weight:900; color:#fbbf24;">sRGB HDR Wide Gamut</span>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="font-size:8.5px; font-weight:900; color:#94a3b8;">FILE FORMAT:</span>
                            <span style="font-size:9px; font-weight:900; color:#34d399;">High-Quality PNG / JPG</span>
                        </div>
                    </div>

                    <div style="margin-top:auto; display:flex; flex-direction:column; gap:6px;">
                        <button onclick="exportThumbnailHD('png')" style="height:40px; background:linear-gradient(135deg, #047857, #10b981); color:#ffffff; border:1.5px solid #34d399; border-radius:8px; font-size:12px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 0 16px rgba(16,185,129,0.5);">
                            📥 DOWNLOAD PNG THUMBNAIL (1280x720)
                        </button>
                        <button onclick="exportThumbnailHD('jpg')" style="height:34px; background:#0f172a; color:#cbd5e1; border:1px solid #334155; border-radius:8px; font-size:10px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
                            📥 DOWNLOAD JPEG (COMPACT &lt; 2MB)
                        </button>
                    </div>
                </div>
            </div>
        </foreignObject>
    </g>
</svg>`;
}

module.exports = {
    renderTitanSvgThumbnailCard
};
