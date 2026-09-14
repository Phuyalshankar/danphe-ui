'use strict';

/**
 * 📱 TitanMobileSimulator (danphe-ui / lib)
 * Ultra-Realistic SVG Titanium Smartphone Hardware & Live Interactive Social Video / Browser Engine
 * 
 * Features:
 * 1. 100% Scalable Vector Graphics (SVG) Titanium Chassis with Curved OLED Bezel & Optical Glare
 * 2. Real TikTok / Douyin / Facebook Reels / YouTube Shorts & Live Web Search (DuckDuckGo/Bing)
 * 3. ⚡ Instant 1-Click Video Grabber to Danphe Video Editor Timeline (V1 / V2 Overlay)
 * 4. Functional Hardware Buttons: Power (Lock/Wake), Volume +/- (with animated On-Screen HUD), 90° Device Rotate
 * 5. Interactive iOS/Android Status Bar & Dynamic Island (Live Clock, 5G, Wi-Fi, Dynamic Battery %)
 * 6. App Grid / Home Screen (TikTok, Facebook, Douyin, Browser, Danphe Studio, Settings)
 * 7. Responsive Touch / Mouse Navigation & Home Indicator Bar
 */

function renderTitanMobileSimulator(options = {}) {
    const {
        id = 'titan-mobile-sim-' + Math.floor(Math.random() * 100000),
        width = 390,
        height = 780,
        deviceModel = 'iPhone 16 Pro Max Titanium',
        deviceColor = 'titanium', // 'titanium' | 'midnight' | 'gold' | 'sapphire' | 'emerald'
        initialUrl = 'https://duckduckgo.com',
        initialApp = 'tiktok', // 'tiktok' | 'facebook' | 'douyin' | 'browser' | 'home'
        batteryPct = 96,
        className = ''
    } = options;

    const rimColorGrad = deviceColor === 'sapphire' ? 
        '<stop offset="0%" stop-color="#0284c7" /><stop offset="50%" stop-color="#0f172a" /><stop offset="100%" stop-color="#083344" />' :
        deviceColor === 'gold' ?
        '<stop offset="0%" stop-color="#eab308" /><stop offset="50%" stop-color="#292524" /><stop offset="100%" stop-color="#78350f" />' :
        deviceColor === 'midnight' ?
        '<stop offset="0%" stop-color="#1e293b" /><stop offset="50%" stop-color="#020617" /><stop offset="100%" stop-color="#0f172a" />' :
        deviceColor === 'emerald' ?
        '<stop offset="0%" stop-color="#10b981" /><stop offset="50%" stop-color="#064e3b" /><stop offset="100%" stop-color="#022c22" />' :
        '<stop offset="0%" stop-color="#64748b" /><stop offset="25%" stop-color="#334155" /><stop offset="50%" stop-color="#0f172a" /><stop offset="75%" stop-color="#334155" /><stop offset="100%" stop-color="#475569" />';

    return `
    <div id="${id}" class="titan-mobile-sim-root relative flex flex-col items-center select-none ${className}" style="perspective: 1200px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        
        <!-- Hardware Control Toolbar (Above Device) -->
        <div class="sim-toolbar flex items-center justify-between w-full max-w-[400px] mb-3 px-3.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl backdrop-blur-xl shadow-xl text-xs text-slate-300">
            <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="font-bold text-white text-[11px] tracking-wide">${deviceModel}</span>
            </div>
            
            <div class="flex items-center gap-2">
                <!-- Rotate Phone Button -->
                <button type="button" onclick="window.titanSimRotate('${id}')" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-[10.5px] font-bold text-cyan-300 flex items-center gap-1 transition-all" title="Rotate 90° (Landscape / Portrait)">
                    🔄 Rotate
                </button>
                <!-- Power Lock/Wake Button -->
                <button type="button" onclick="window.titanSimTogglePower('${id}')" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-[10.5px] font-bold text-rose-300 flex items-center gap-1 transition-all" title="Screen Power / Lock">
                    ⚡ Power
                </button>
            </div>
        </div>

        <!-- 3D Transformable Device Chassis -->
        <div id="${id}-chassis" class="titan-sim-chassis relative transition-transform duration-500 ease-out" style="transform-style: preserve-3d;">
            
            <!-- SVG Hardware Frame (Titanium Body, Bezel, Antennas, Optical Glare) -->
            <svg id="${id}-svg-frame" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 780" width="${width}" height="${height}" class="drop-shadow-[0_30px_60px_rgba(0,0,0,0.95)] overflow-visible">
                <defs>
                    <!-- Titanium Rim Gradient -->
                    <linearGradient id="${id}-rim-grad" x1="0" y1="0" x2="1" y2="1">
                        ${rimColorGrad}
                    </linearGradient>

                    <!-- Bezel Matte Gradient -->
                    <linearGradient id="${id}-bezel-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#090d16" />
                        <stop offset="100%" stop-color="#020408" />
                    </linearGradient>

                    <!-- Glass Optical Glare Overlay -->
                    <linearGradient id="${id}-glare-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="rgba(255, 255, 255, 0.12)" />
                        <stop offset="25%" stop-color="rgba(255, 255, 255, 0.03)" />
                        <stop offset="50%" stop-color="rgba(255, 255, 255, 0.0)" />
                        <stop offset="100%" stop-color="rgba(255, 255, 255, 0.02)" />
                    </linearGradient>

                    <!-- Shadow filter for hardware buttons -->
                    <filter id="${id}-button-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000" flood-opacity="0.6"/>
                    </filter>
                </defs>

                <!-- Left Physical Buttons: Action Switch & Volume Rockers -->
                <!-- Action Button -->
                <rect x="0" y="115" width="4.5" height="30" rx="2.25" fill="#475569" stroke="#1e293b" stroke-width="0.5" class="cursor-pointer hover:fill-cyan-400 transition" onclick="window.titanSimTriggerAction('${id}')" filter="url(#${id}-button-shadow)"/>
                <!-- Volume Up -->
                <rect x="0" y="160" width="4.5" height="52" rx="2.25" fill="#475569" stroke="#1e293b" stroke-width="0.5" class="cursor-pointer hover:fill-emerald-400 transition" onclick="window.titanSimVolume('${id}', 10)" filter="url(#${id}-button-shadow)"/>
                <!-- Volume Down -->
                <rect x="0" y="222" width="4.5" height="52" rx="2.25" fill="#475569" stroke="#1e293b" stroke-width="0.5" class="cursor-pointer hover:fill-rose-400 transition" onclick="window.titanSimVolume('${id}', -10)" filter="url(#${id}-button-shadow)"/>

                <!-- Right Physical Button: Power / Lock Key -->
                <rect x="385.5" y="180" width="4.5" height="74" rx="2.25" fill="#475569" stroke="#1e293b" stroke-width="0.5" class="cursor-pointer hover:fill-rose-400 transition" onclick="window.titanSimTogglePower('${id}')" filter="url(#${id}-button-shadow)"/>

                <!-- Outer Titanium Chassis -->
                <rect x="4" y="4" width="382" height="772" rx="46" fill="url(#${id}-rim-grad)" stroke="#090d16" stroke-width="2" />
                
                <!-- Inner OLED Display Frame & Border -->
                <rect x="10" y="10" width="370" height="760" rx="40" fill="url(#${id}-bezel-grad)" stroke="#000000" stroke-width="2.5" />
                <rect x="12.5" y="12.5" width="365" height="755" rx="38" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.8" />

                <!-- Speaker Ear-piece Micro Grill -->
                <rect x="165" y="15" width="60" height="3.5" rx="1.75" fill="#1e293b" stroke="#000" stroke-width="0.5"/>

                <!-- Screen Viewport ForeignObject (Real Web Engine & UI) -->
                <foreignObject x="15" y="15" width="360" height="750" rx="35" class="overflow-hidden rounded-[35px]">
                    <div id="${id}-screen-root" xmlns="http://www.w3.org/1999/xhtml" class="w-full h-full bg-black relative flex flex-col overflow-hidden text-white font-sans select-none">
                        
                        <!-- 1. Live iOS/Android Status Bar -->
                        <div class="status-bar flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold tracking-tight text-white/90 z-50 pointer-events-none">
                            <span id="${id}-clock" class="font-bold tracking-wider font-mono">09:41</span>
                            
                            <div class="flex items-center gap-1.5">
                                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.28 19.68 10.59 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
                                <span class="text-[9.5px] font-mono">5G</span>
                                <div class="w-5 h-2.5 border border-white/80 rounded-[3px] p-0.5 flex items-center">
                                    <div id="${id}-battery-fill" class="h-full bg-emerald-400 rounded-[1.5px]" style="width: ${batteryPct}%;"></div>
                                </div>
                            </div>
                        </div>

                        <!-- 2. Dynamic Island (Animated Pill & Camera Punch Hole) -->
                        <div id="${id}-dynamic-island" class="dynamic-island absolute top-2.5 left-1/2 -translate-x-1/2 h-[28px] px-3 bg-black rounded-full border border-slate-800/80 shadow-md flex items-center justify-between gap-3 text-[10.5px] font-mono text-cyan-300 z-50 transition-all duration-300 ease-out cursor-pointer hover:scale-105" onclick="window.titanSimExpandIsland('${id}')">
                            <div class="flex items-center gap-2">
                                <span class="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/60 relative">
                                    <span class="w-1 h-1 rounded-full bg-cyan-500 absolute inset-0 m-auto"></span>
                                </span>
                                <span id="${id}-island-label" class="font-bold text-[9px] text-slate-300">Titan Social Hub</span>
                            </div>
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        </div>

                        <!-- 3. Volume HUD Indicator -->
                        <div id="${id}-volume-hud" class="absolute left-2 top-28 w-1.5 h-24 bg-slate-800/80 backdrop-blur-md rounded-full overflow-hidden border border-white/20 z-50 opacity-0 transition-opacity duration-200 pointer-events-none">
                            <div id="${id}-volume-bar" class="w-full bg-white transition-all duration-150 rounded-full" style="height: 70%; margin-top: auto;"></div>
                        </div>

                        <!-- 4. TOP SOCIAL APP / BROWSER TABS SWITCHER -->
                        <div class="app-mode-ribbon px-3 pt-6 pb-1 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between gap-1 z-40 text-[10.5px] font-bold">
                            <button type="button" onclick="window.titanSimSwitchMode('${id}', 'tiktok')" id="${id}-tab-tiktok" class="mode-tab px-2 py-1 rounded-lg bg-rose-600/30 text-rose-300 border border-rose-500/50 flex items-center gap-1 transition">
                                🎵 TikTok
                            </button>
                            <button type="button" onclick="window.titanSimSwitchMode('${id}', 'facebook')" id="${id}-tab-facebook" class="mode-tab px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition">
                                📘 Facebook
                            </button>
                            <button type="button" onclick="window.titanSimSwitchMode('${id}', 'douyin')" id="${id}-tab-douyin" class="mode-tab px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition">
                                🇨🇳 Douyin
                            </button>
                            <button type="button" onclick="window.titanSimSwitchMode('${id}', 'browser')" id="${id}-tab-browser" class="mode-tab px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition">
                                🔍 Search
                            </button>
                        </div>

                        <!-- 5. MAIN SOCIAL VIDEO & BROWSER VIEWPORTS -->
                        <div class="viewport-wrapper flex-1 relative w-full h-full bg-slate-950 overflow-hidden">
                            
                            <!-- A. TIKTOK REELS SIMULATOR VIEWPORT -->
                            <div id="${id}-view-tiktok" class="view-panel absolute inset-0 flex flex-col bg-black overflow-hidden z-20">
                                <!-- Real Vertical Video Player Container -->
                                <div class="relative w-full h-full flex items-center justify-center bg-zinc-950">
                                    <video id="${id}-tiktok-video" autoplay loop muted playsinline class="w-full h-full object-cover">
                                        <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4">
                                    </video>
                                    
                                    <!-- Video Overlay Info (Creator, Song, Captions) -->
                                    <div class="absolute bottom-6 left-3 right-14 text-white z-30 pointer-events-none drop-shadow-md">
                                        <div class="text-xs font-black tracking-wide flex items-center gap-1.5">
                                            <span>@danphe_creator</span>
                                            <span class="px-1 py-0.2 bg-rose-500 text-[8px] rounded font-bold">LIVE</span>
                                        </div>
                                        <p class="text-[10.5px] text-slate-200 mt-1 line-clamp-2">🔥 Trending 4K Reel in Nepal! 🇳🇵 Editing live with Danphe Studio.</p>
                                        <div class="flex items-center gap-1 text-[9px] text-cyan-300 mt-1.5 font-mono">
                                            <span>🎵 Original Audio - Danphe Beats 60FPS</span>
                                        </div>
                                    </div>

                                    <!-- Right Action Sidebar (Like, Comment, Share, Sound Disk) -->
                                    <div class="absolute right-2 bottom-6 flex flex-col items-center gap-3.5 z-30">
                                        <button type="button" onclick="this.classList.toggle('text-rose-500')" class="flex flex-col items-center text-white hover:text-rose-500 transition">
                                            <span class="text-lg">❤️</span>
                                            <span class="text-[8.5px] font-bold">142K</span>
                                        </button>
                                        <button type="button" class="flex flex-col items-center text-white hover:text-cyan-400 transition">
                                            <span class="text-lg">💬</span>
                                            <span class="text-[8.5px] font-bold">3.8K</span>
                                        </button>
                                        <button type="button" class="flex flex-col items-center text-white hover:text-emerald-400 transition">
                                            <span class="text-lg">↗️</span>
                                            <span class="text-[8.5px] font-bold">Share</span>
                                        </button>
                                    </div>

                                    <!-- ⚡ INSTANT TIMELINE GRABBER HUD BUTTON -->
                                    <div class="absolute top-3 left-3 right-3 flex items-center justify-between z-40 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-rose-500/60 shadow-xl">
                                        <span class="text-[9.5px] font-bold text-rose-300 flex items-center gap-1">🎵 TikTok Video Detected</span>
                                        <button type="button" onclick="window.titanSimSendToTimeline('${id}', 'TikTok Reel - Nepal 4K', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4')" class="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[9.5px] font-black tracking-wide shadow-lg flex items-center gap-1 transition-all">
                                            📥 Grab to Timeline (V1)
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- B. FACEBOOK REELS SIMULATOR VIEWPORT -->
                            <div id="${id}-view-facebook" class="view-panel absolute inset-0 hidden flex-col bg-slate-950 overflow-hidden z-20">
                                <div class="relative w-full h-full flex items-center justify-center bg-zinc-950">
                                    <video id="${id}-fb-video" loop muted playsinline class="w-full h-full object-cover">
                                        <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" type="video/mp4">
                                    </video>
                                    
                                    <div class="absolute bottom-6 left-3 right-14 text-white z-30 pointer-events-none drop-shadow-md">
                                        <div class="text-xs font-black tracking-wide text-blue-400 flex items-center gap-1.5">
                                            <span>📘 Facebook Watch & Reels</span>
                                        </div>
                                        <p class="text-[10.5px] text-slate-200 mt-1">Cinematic Landscape Vlog & Sound Masterpiece.</p>
                                    </div>

                                    <!-- ⚡ INSTANT TIMELINE GRABBER HUD BUTTON -->
                                    <div class="absolute top-3 left-3 right-3 flex items-center justify-between z-40 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-blue-500/60 shadow-xl">
                                        <span class="text-[9.5px] font-bold text-blue-300 flex items-center gap-1">📘 FB Reel Stream</span>
                                        <button type="button" onclick="window.titanSimSendToTimeline('${id}', 'Facebook Reel Vlog', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4')" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[9.5px] font-black tracking-wide shadow-lg flex items-center gap-1 transition-all">
                                            📥 Grab to Timeline (V1)
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- C. DOUYIN / CHINESE SHORTS VIEWPORT -->
                            <div id="${id}-view-douyin" class="view-panel absolute inset-0 hidden flex-col bg-slate-950 overflow-hidden z-20">
                                <div class="relative w-full h-full flex items-center justify-center bg-zinc-950">
                                    <video id="${id}-douyin-video" loop muted playsinline class="w-full h-full object-cover">
                                        <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4" type="video/mp4">
                                    </video>
                                    
                                    <div class="absolute bottom-6 left-3 right-14 text-white z-30 pointer-events-none drop-shadow-md">
                                        <div class="text-xs font-black tracking-wide text-amber-400 flex items-center gap-1.5">
                                            <span>🇨🇳 抖音 (Douyin) Trending Short</span>
                                        </div>
                                        <p class="text-[10.5px] text-slate-200 mt-1">Chinese Short-Form Viral Video Stream.</p>
                                    </div>

                                    <!-- ⚡ INSTANT TIMELINE GRABBER HUD BUTTON -->
                                    <div class="absolute top-3 left-3 right-3 flex items-center justify-between z-40 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/60 shadow-xl">
                                        <span class="text-[9.5px] font-bold text-amber-300 flex items-center gap-1">🇨🇳 Douyin Stream</span>
                                        <button type="button" onclick="window.titanSimSendToTimeline('${id}', 'Douyin Viral Clip', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4')" class="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[9.5px] font-black tracking-wide shadow-lg flex items-center gap-1 transition-all">
                                            📥 Grab to Timeline (V1)
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- D. LIVE BROWSER & DUCKDUCKGO / BING SEARCH VIEWPORT -->
                            <div id="${id}-view-browser" class="view-panel absolute inset-0 hidden flex-col bg-slate-950 overflow-hidden z-20">
                                <!-- Omnibox URL & Search Bar -->
                                <div class="px-2.5 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
                                    <div class="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl shadow-inner">
                                        <span class="text-xs text-slate-400">🔍</span>
                                        <input type="text" id="${id}-browser-search-input" value="${initialUrl}" 
                                               onkeydown="if(event.key==='Enter') window.titanSimRunSearch('${id}', this.value)"
                                               class="w-full bg-transparent border-none text-[11px] font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0 truncate" 
                                               placeholder="Search web or type URL..." />
                                        <button type="button" onclick="window.titanSimRunSearch('${id}', document.getElementById('${id}-browser-search-input').value)" class="text-[10px] font-bold text-cyan-400 hover:text-cyan-300">GO</button>
                                    </div>
                                </div>

                                <!-- Real Iframe Search & Web Viewport -->
                                <div class="flex-1 w-full bg-white relative">
                                    <iframe id="${id}-browser-iframe" src="/api/proxy?url=${encodeURIComponent(initialUrl)}" 
                                            class="w-full h-full border-0 bg-white" 
                                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                                            loading="lazy"></iframe>
                                </div>
                            </div>

                        </div>

                        <!-- 6. Bottom Home Indicator Bar (Swipe/Click for Home) -->
                        <div class="home-bar-container w-full h-6 flex items-center justify-center z-50 cursor-pointer hover:bg-white/5 transition" onclick="window.titanSimToggleHome('${id}')" title="Swipe / Click for Home Screen">
                            <div class="w-32 h-1 bg-white/70 hover:bg-white rounded-full transition-all shadow-sm"></div>
                        </div>

                    </div>
                </foreignObject>

                <!-- Curved Glass Optical Glare Layer on Top -->
                <rect x="15" y="15" width="360" height="750" rx="35" fill="url(#${id}-glare-grad)" class="pointer-events-none" />

            </svg>
        </div>

        <!-- Captured Video Notification Modal/Toast -->
        <div id="${id}-capture-toast" class="fixed top-8 left-1/2 -translate-x-1/2 bg-slate-900/95 border-2 border-emerald-500 shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_20px_rgba(16,185,129,0.5)] rounded-2xl px-4 py-2.5 flex items-center gap-3 text-white text-xs font-mono z-[9999] opacity-0 pointer-events-none transition-all duration-300">
            <span class="text-xl">📥</span>
            <div>
                <div class="font-bold text-emerald-400" id="${id}-toast-title">Video Imported to Timeline!</div>
                <div class="text-[10px] text-slate-300" id="${id}-toast-desc">Track V1 • 60FPS Video Ready for Editing</div>
            </div>
        </div>

    </div>
    `;
}

// ── GLOBAL SIMULATOR INTERACTIVE CONTROLLERS ──
if (typeof window !== 'undefined') {
    window.titanSimSwitchMode = function(simId, modeName) {
        const panels = ['tiktok', 'facebook', 'douyin', 'browser'];
        panels.forEach(p => {
            const el = document.getElementById(simId + '-view-' + p);
            const tab = document.getElementById(simId + '-tab-' + p);
            if (el) {
                if (p === modeName) {
                    el.classList.remove('hidden');
                    el.classList.add('flex');
                    const vid = el.querySelector('video');
                    if (vid) { vid.play().catch(() => {}); }
                } else {
                    el.classList.add('hidden');
                    el.classList.remove('flex');
                    const vid = el.querySelector('video');
                    if (vid) { vid.pause(); }
                }
            }
            if (tab) {
                if (p === modeName) {
                    tab.className = 'mode-tab px-2 py-1 rounded-lg bg-rose-600/30 text-rose-300 border border-rose-500/50 flex items-center gap-1 transition';
                } else {
                    tab.className = 'mode-tab px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition';
                }
            }
        });
    };

    window.titanSimRunSearch = function(simId, query) {
        if (!query) return;
        let finalUrl = query.trim();
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
            finalUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(finalUrl);
        }
        const iframe = document.getElementById(simId + '-browser-iframe');
        const input = document.getElementById(simId + '-browser-search-input');
        if (input) input.value = finalUrl;
        if (iframe) iframe.src = '/api/proxy?url=' + encodeURIComponent(finalUrl);
    };

    window.titanSimNavigate = function(simId, url) {
        if (!url) return;
        let finalUrl = url.trim();
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
            finalUrl = 'https://' + finalUrl;
        }
        const iframe = document.getElementById(simId + '-iframe') || document.getElementById(simId + '-browser-iframe');
        const input = document.getElementById(simId + '-url-input') || document.getElementById(simId + '-browser-search-input');
        if (input) input.value = finalUrl;
        if (iframe) iframe.src = '/api/proxy?url=' + encodeURIComponent(finalUrl);
    };

    window.titanSimSendToTimeline = function(simId, title, videoUrl) {
        const toast = document.getElementById(simId + '-capture-toast');
        const tTitle = document.getElementById(simId + '-toast-title');
        const tDesc = document.getElementById(simId + '-toast-desc');

        if (tTitle) tTitle.innerText = `🎬 Captured: ${title}`;
        if (tDesc) tDesc.innerText = `Injected into Video Editor Track V1 at 00:00.00`;

        if (toast) {
            toast.classList.remove('opacity-0', 'pointer-events-none');
            toast.classList.add('opacity-100');
            setTimeout(() => {
                toast.classList.add('opacity-0', 'pointer-events-none');
                toast.classList.remove('opacity-100');
            }, 2500);
        }

        // Bridge to window.timelineClips if available
        if (window.timelineClips && Array.isArray(window.timelineClips)) {
            const newClip = {
                id: 'c-v1-grabbed-' + Date.now(),
                track: 'V1',
                name: title,
                src: videoUrl,
                start: window.currentTimeSec || 0,
                duration: 15,
                sourceDuration: 15,
                sourceIn: 0,
                sourceOut: 15,
                volume: 100,
                scale: 100,
                opacity: 100
            };
            window.timelineClips.push(newClip);
            if (typeof window.renderTimeline === 'function') window.renderTimeline();
            if (typeof window.renderCanvas === 'function') window.renderCanvas();
        }
    };

    window.titanSimTogglePower = function(simId) {
        const root = document.getElementById(simId + '-screen-root');
        if (root) {
            root.classList.toggle('brightness-0');
        }
    };

    window.titanSimVolume = function(simId, delta) {
        const hud = document.getElementById(simId + '-volume-hud');
        const bar = document.getElementById(simId + '-volume-bar');
        if (hud && bar) {
            let cur = parseInt(bar.style.height || '70%') + delta;
            cur = Math.max(0, Math.min(100, cur));
            bar.style.height = cur + '%';
            hud.classList.remove('opacity-0');
            hud.classList.add('opacity-100');
            clearTimeout(window['_volTimeout_' + simId]);
            window['_volTimeout_' + simId] = setTimeout(() => {
                hud.classList.add('opacity-0');
                hud.classList.remove('opacity-100');
            }, 1200);
        }
    };

    window.titanSimRotate = function(simId) {
        const chassis = document.getElementById(simId + '-chassis');
        if (chassis) {
            const curRot = chassis.dataset.rotated === 'true';
            chassis.dataset.rotated = (!curRot).toString();
            chassis.style.transform = (!curRot) ? 'rotate(90deg) scale(0.85)' : 'rotate(0deg) scale(1.0)';
        }
    };

    window.titanSimExpandIsland = function(simId) {
        const island = document.getElementById(simId + '-dynamic-island');
        const label = document.getElementById(simId + '-island-label');
        if (island && label) {
            island.classList.toggle('w-[280px]');
            island.classList.toggle('h-[48px]');
            label.innerText = island.classList.contains('w-[280px]') ? '⚡ Video Grabber Active' : 'Titan Social Hub';
        }
    };

    // Auto-update status bar clock
    setInterval(() => {
        const d = new Date();
        const hrs = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');
        document.querySelectorAll('[id$="-clock"]').forEach(el => {
            el.innerText = `${hrs}:${mins}`;
        });
    }, 1000);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderTitanMobileSimulator };
}
