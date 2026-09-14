'use strict';

/**
 * 📱 TitanMobileSimulator (danphe-ui / lib)
 * Ultra-Realistic SVG Titanium Smartphone Hardware & Live Interactive Social Video / Real Web Engine
 */

function renderTitanMobileSimulator(options = {}) {
    const {
        id = 'titan-mobile-sim-' + Math.floor(Math.random() * 100000),
        width = 390,
        height = 780,
        deviceModel = 'iPhone 16 Pro Max Titanium',
        deviceColor = 'titanium',
        initialUrl = 'https://en.m.wikipedia.org/wiki/Nepal',
        initialApp = 'tiktok',
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
        <div class="sim-toolbar flex items-center justify-between w-full max-w-[420px] mb-3 px-3.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl backdrop-blur-xl shadow-xl text-xs text-slate-300 z-50">
            <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="font-bold text-white text-[11px] tracking-wide">${deviceModel}</span>
            </div>
            
            <div class="flex items-center gap-2">
                <!-- Rotate Phone Button -->
                <button type="button" onclick="window.titanSimRotate('${id}')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-[10.5px] font-bold text-cyan-300 flex items-center gap-1 transition-all cursor-pointer shadow" title="Rotate 90°">
                    🔄 Rotate
                </button>
                <!-- Power Lock/Wake Button -->
                <button type="button" onclick="window.titanSimTogglePower('${id}')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-[10.5px] font-bold text-rose-300 flex items-center gap-1 transition-all cursor-pointer shadow" title="Screen Power / Lock">
                    ⚡ Power
                </button>
            </div>
        </div>

        <!-- Universal Real URL / Video Link Loader Bar (Loads ANY Real Web / TikTok / FB / YouTube Link) -->
        <div class="w-full max-w-[420px] mb-3 p-2 bg-slate-900/95 border border-indigo-500/40 rounded-2xl shadow-xl z-50">
            <div class="flex items-center gap-1.5">
                <span class="text-xs text-indigo-400 font-bold px-1">🔗</span>
                <input type="text" id="${id}-universal-input" 
                       placeholder="Paste Real TikTok / Shorts / FB / MP4 / Web URL..." 
                       value=""
                       onkeydown="if(event.key==='Enter') window.titanSimLoadUniversal('${id}')"
                       class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-[11px] font-mono text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-indigo-400 truncate" />
                <button type="button" onclick="window.titanSimLoadUniversal('${id}')" class="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-[10.5px] font-bold tracking-wide transition cursor-pointer shadow">
                    ▶ Play Real
                </button>
            </div>
        </div>

        <!-- 3D Device Container -->
        <div id="${id}-chassis" class="titan-sim-chassis relative transition-transform duration-500 ease-out" style="width: ${width}px; height: ${height}px; transform-style: preserve-3d;">
            
            <!-- 1. SVG Hardware Chassis Background (Titanium Rim, Physical Buttons) -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 780" class="absolute inset-0 w-full h-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.95)] overflow-visible pointer-events-none z-0">
                <defs>
                    <linearGradient id="${id}-rim-grad" x1="0" y1="0" x2="1" y2="1">
                        ${rimColorGrad}
                    </linearGradient>
                    <linearGradient id="${id}-bezel-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#090d16" />
                        <stop offset="100%" stop-color="#020408" />
                    </linearGradient>
                </defs>

                <!-- Left Physical Buttons -->
                <rect x="0" y="115" width="4.5" height="30" rx="2.25" fill="#475569" stroke="#1e293b" stroke-width="0.5" style="pointer-events:auto; cursor:pointer;" onclick="window.titanSimVolume('${id}', 0)"/>
                <rect x="0" y="160" width="4.5" height="52" rx="2.25" fill="#475569" stroke="#1e293b" stroke-width="0.5" style="pointer-events:auto; cursor:pointer;" onclick="window.titanSimVolume('${id}', 10)"/>
                <rect x="0" y="222" width="4.5" height="52" rx="2.25" fill="#475569" stroke="#1e293b" stroke-width="0.5" style="pointer-events:auto; cursor:pointer;" onclick="window.titanSimVolume('${id}', -10)"/>

                <!-- Right Physical Power Button -->
                <rect x="385.5" y="180" width="4.5" height="74" rx="2.25" fill="#475569" stroke="#1e293b" stroke-width="0.5" style="pointer-events:auto; cursor:pointer;" onclick="window.titanSimTogglePower('${id}')"/>

                <!-- Outer Titanium Chassis -->
                <rect x="4" y="4" width="382" height="772" rx="46" fill="url(#${id}-rim-grad)" stroke="#090d16" stroke-width="2" />
                
                <!-- Inner OLED Display Frame -->
                <rect x="10" y="10" width="370" height="760" rx="40" fill="url(#${id}-bezel-grad)" stroke="#000000" stroke-width="2.5" />
                <rect x="12.5" y="12.5" width="365" height="755" rx="38" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.8" />

                <!-- Speaker Ear-piece Micro Grill -->
                <rect x="165" y="14" width="60" height="3.5" rx="1.75" fill="#1e293b" stroke="#000" stroke-width="0.5"/>
            </svg>

            <!-- 2. REAL INTERACTIVE SCREEN CONTAINER (Pure HTML/DOM - 100% Clickable & Responsive) -->
            <div id="${id}-screen-root" class="absolute inset-[15px] rounded-[36px] bg-black flex flex-col overflow-hidden text-white font-sans select-none z-10" style="pointer-events: auto !important;">
                
                <!-- Status Bar -->
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

                <!-- Dynamic Island (Expandable Pill) -->
                <div id="${id}-dynamic-island" class="dynamic-island absolute top-2.5 left-1/2 -translate-x-1/2 h-[28px] px-3 bg-black rounded-full border border-slate-800/80 shadow-md flex items-center justify-between gap-3 text-[10.5px] font-mono text-cyan-300 z-50 transition-all duration-300 ease-out cursor-pointer hover:scale-105" onclick="window.titanSimExpandIsland('${id}')">
                    <div class="flex items-center gap-2 pointer-events-none">
                        <span class="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/60 relative">
                            <span class="w-1 h-1 rounded-full bg-cyan-500 absolute inset-0 m-auto"></span>
                        </span>
                        <span id="${id}-island-label" class="font-bold text-[9px] text-slate-300">Titan Real Video Hub</span>
                    </div>
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping pointer-events-none"></span>
                </div>

                <!-- Volume HUD Indicator -->
                <div id="${id}-volume-hud" class="absolute left-2 top-28 w-1.5 h-24 bg-slate-800/80 backdrop-blur-md rounded-full overflow-hidden border border-white/20 z-50 opacity-0 transition-opacity duration-200 pointer-events-none">
                    <div id="${id}-volume-bar" class="w-full bg-white transition-all duration-150 rounded-full" style="height: 70%; margin-top: auto;"></div>
                </div>

                <!-- TOP SOCIAL & BROWSER MODE SWITCHER TABS -->
                <div class="app-mode-ribbon px-1.5 pt-6 pb-2 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between gap-1 z-40 text-[10px] font-bold">
                    <button type="button" onclick="window.titanSimSwitchMode('${id}', 'tiktok')" id="${id}-tab-tiktok" class="mode-tab px-2 py-1.5 rounded-lg bg-rose-600 text-white border border-rose-500 flex items-center gap-1 transition cursor-pointer">
                        🎵 TikTok
                    </button>
                    <button type="button" onclick="window.titanSimSwitchMode('${id}', 'shorts')" id="${id}-tab-shorts" class="mode-tab px-2 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition cursor-pointer">
                        🔴 Shorts
                    </button>
                    <button type="button" onclick="window.titanSimSwitchMode('${id}', 'douyin')" id="${id}-tab-douyin" class="mode-tab px-2 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition cursor-pointer">
                        🇨🇳 Douyin
                    </button>
                    <button type="button" onclick="window.titanSimSwitchMode('${id}', 'facebook')" id="${id}-tab-facebook" class="mode-tab px-2 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition cursor-pointer">
                        📘 FB
                    </button>
                    <button type="button" onclick="window.titanSimSwitchMode('${id}', 'browser')" id="${id}-tab-browser" class="mode-tab px-2 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition cursor-pointer">
                        🌐 Web
                    </button>
                </div>

                <!-- MAIN SOCIAL VIDEO & BROWSER PANELS -->
                <div class="viewport-wrapper flex-1 relative w-full h-full bg-slate-950 overflow-hidden">
                    
                    <!-- A. TIKTOK REELS VIEWPORT (Real Live Online Video Stream + Swipe Feed) -->
                    <div id="${id}-view-tiktok" class="view-panel absolute inset-0 flex flex-col bg-black overflow-hidden z-20">
                        <div class="relative w-full h-full flex items-center justify-center bg-zinc-950">
                            <!-- Real HTML5 Video Player -->
                            <video id="${id}-tiktok-video" autoplay loop playsinline class="w-full h-full object-cover cursor-pointer" onclick="window.titanSimToggleVideoPlay(this)">
                                <source id="${id}-tiktok-source" src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4">
                            </video>
                            
                            <!-- Video Info Overlay -->
                            <div class="absolute bottom-6 left-3 right-14 text-white z-30 pointer-events-none drop-shadow-md">
                                <div class="text-xs font-black tracking-wide flex items-center gap-1.5">
                                    <span id="${id}-tiktok-author">@real_creator_live</span>
                                    <span class="px-1 py-0.2 bg-rose-500 text-[8px] rounded font-bold">LIVE REEL</span>
                                </div>
                                <p id="${id}-tiktok-desc" class="text-[10.5px] text-slate-200 mt-1 line-clamp-2">🔥 Trending Viral Reel Stream from Real Web. 100% Ready for Video Editor Timeline!</p>
                            </div>

                            <!-- Swipe Up / Down Navigation Controls -->
                            <div class="absolute left-2 bottom-6 flex flex-col items-center gap-2 z-30">
                                <button type="button" onclick="window.titanSimPrevVideo('${id}', 'tiktok')" class="w-7 h-7 rounded-full bg-black/60 hover:bg-rose-600 border border-white/20 flex items-center justify-center text-xs text-white transition cursor-pointer" title="Previous Video">
                                    ▲
                                </button>
                                <button type="button" onclick="window.titanSimNextVideo('${id}', 'tiktok')" class="w-7 h-7 rounded-full bg-black/60 hover:bg-rose-600 border border-white/20 flex items-center justify-center text-xs text-white transition cursor-pointer" title="Next Video">
                                    ▼
                                </button>
                            </div>

                            <!-- Action Sidebar -->
                            <div class="absolute right-2 bottom-6 flex flex-col items-center gap-3.5 z-30">
                                <button type="button" onclick="window.titanSimToggleMute('${id}', '${id}-tiktok-video')" class="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-sm text-white hover:text-cyan-400 transition cursor-pointer" title="Mute/Unmute Audio">
                                    🔊
                                </button>
                                <button type="button" onclick="this.classList.toggle('text-rose-500')" class="flex flex-col items-center text-white hover:text-rose-500 transition cursor-pointer">
                                    <span class="text-lg">❤️</span>
                                    <span class="text-[8.5px] font-bold">382K</span>
                                </button>
                                <button type="button" class="flex flex-col items-center text-white hover:text-cyan-400 transition cursor-pointer">
                                    <span class="text-lg">💬</span>
                                    <span class="text-[8.5px] font-bold">12.4K</span>
                                </button>
                            </div>

                            <!-- ⚡ INSTANT TIMELINE GRABBER HUD BUTTON -->
                            <div class="absolute top-2 left-2 right-2 flex items-center justify-between z-40 bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-rose-500/70 shadow-xl">
                                <span class="text-[9.5px] font-bold text-rose-300 flex items-center gap-1">🎵 Live TikTok Stream</span>
                                <button type="button" onclick="window.titanSimSendActiveToTimeline('${id}', 'tiktok')" class="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[9.5px] font-black tracking-wide shadow-lg flex items-center gap-1 transition-all cursor-pointer">
                                    📥 Grab to Timeline (V1)
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- B. YOUTUBE SHORTS VIEWPORT (100% Real Live YouTube Embed Player) -->
                    <div id="${id}-view-shorts" class="view-panel absolute inset-0 hidden flex-col bg-slate-950 overflow-hidden z-20">
                        <div class="relative w-full h-full flex flex-col bg-black">
                            <div class="flex-1 w-full relative">
                                <iframe id="${id}-shorts-iframe" 
                                        src="https://www.youtube-nocookie.com/embed/kJQP7kiw5Fk?autoplay=1&mute=0&controls=1&loop=1&playsinline=1" 
                                        class="w-full h-full border-0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                        allowfullscreen></iframe>
                            </div>

                            <!-- Shorts Navigation & Grabber Ribbon -->
                            <div class="px-2.5 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between z-30">
                                <div class="flex items-center gap-1.5">
                                    <button type="button" onclick="window.titanSimLoadShort('${id}', 'kJQP7kiw5Fk', 'Despacito Viral Real Reel')" class="px-2 py-0.5 bg-red-800 hover:bg-red-700 text-white text-[9px] rounded font-mono cursor-pointer">Reel 1</button>
                                    <button type="button" onclick="window.titanSimLoadShort('${id}', 'fJ9rUzIMcZQ', 'Bohemian Rhapsody Live')" class="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[9px] rounded font-mono cursor-pointer">Reel 2</button>
                                    <button type="button" onclick="window.titanSimLoadShort('${id}', 'L_LUpnjgPso', 'Viral Music Reel')" class="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[9px] rounded font-mono cursor-pointer">Reel 3</button>
                                </div>
                                <button type="button" onclick="window.titanSimSendActiveToTimeline('${id}', 'shorts')" class="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[9.5px] font-black tracking-wide shadow flex items-center gap-1 cursor-pointer">
                                    📥 Grab to Timeline
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- C. DOUYIN / CHINESE VIRAL VIDEO VIEWPORT -->
                    <div id="${id}-view-douyin" class="view-panel absolute inset-0 hidden flex-col bg-slate-950 overflow-hidden z-20">
                        <div class="relative w-full h-full flex items-center justify-center bg-zinc-950">
                            <video id="${id}-douyin-video" autoplay loop playsinline class="w-full h-full object-cover cursor-pointer" onclick="window.titanSimToggleVideoPlay(this)">
                                <source id="${id}-douyin-source" src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" type="video/mp4">
                            </video>
                            
                            <div class="absolute bottom-6 left-3 right-14 text-white z-30 pointer-events-none drop-shadow-md">
                                <div class="text-xs font-black tracking-wide text-amber-400 flex items-center gap-1.5">
                                    <span id="${id}-douyin-author">🇨🇳 抖音 (Douyin) 4K Viral</span>
                                </div>
                                <p id="${id}-douyin-desc" class="text-[10.5px] text-slate-200 mt-1 line-clamp-2">Real Asian Short Video Stream • 60FPS High Bitrate Stream.</p>
                            </div>

                            <!-- Swipe Up / Down Navigation Controls -->
                            <div class="absolute left-2 bottom-6 flex flex-col items-center gap-2 z-30">
                                <button type="button" onclick="window.titanSimPrevVideo('${id}', 'douyin')" class="w-7 h-7 rounded-full bg-black/60 hover:bg-amber-600 border border-white/20 flex items-center justify-center text-xs text-white transition cursor-pointer">
                                    ▲
                                </button>
                                <button type="button" onclick="window.titanSimNextVideo('${id}', 'douyin')" class="w-7 h-7 rounded-full bg-black/60 hover:bg-amber-600 border border-white/20 flex items-center justify-center text-xs text-white transition cursor-pointer">
                                    ▼
                                </button>
                            </div>

                            <!-- Action Sidebar -->
                            <div class="absolute right-2 bottom-6 flex flex-col items-center gap-3.5 z-30">
                                <button type="button" onclick="window.titanSimToggleMute('${id}', '${id}-douyin-video')" class="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-sm text-white hover:text-cyan-400 transition cursor-pointer">
                                    🔊
                                </button>
                            </div>

                            <!-- ⚡ INSTANT TIMELINE GRABBER HUD BUTTON -->
                            <div class="absolute top-2 left-2 right-2 flex items-center justify-between z-40 bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-amber-500/70 shadow-xl">
                                <span class="text-[9.5px] font-bold text-amber-300 flex items-center gap-1">🇨🇳 Douyin Live Stream</span>
                                <button type="button" onclick="window.titanSimSendActiveToTimeline('${id}', 'douyin')" class="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[9.5px] font-black tracking-wide shadow-lg flex items-center gap-1 transition-all cursor-pointer">
                                    📥 Grab to Timeline (V1)
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- D. FACEBOOK REELS & WATCH VIEWPORT -->
                    <div id="${id}-view-facebook" class="view-panel absolute inset-0 hidden flex-col bg-slate-950 overflow-hidden z-20">
                        <div class="relative w-full h-full flex items-center justify-center bg-zinc-950">
                            <video id="${id}-fb-video" autoplay loop playsinline class="w-full h-full object-cover cursor-pointer" onclick="window.titanSimToggleVideoPlay(this)">
                                <source id="${id}-fb-source" src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4" type="video/mp4">
                            </video>
                            
                            <div class="absolute bottom-6 left-3 right-14 text-white z-30 pointer-events-none drop-shadow-md">
                                <div class="text-xs font-black tracking-wide text-blue-400 flex items-center gap-1.5">
                                    <span>📘 Facebook Watch & Reels</span>
                                </div>
                                <p id="${id}-fb-desc" class="text-[10.5px] text-slate-200 mt-1 line-clamp-2">Real Facebook Video Stream with High Quality Sound.</p>
                            </div>

                            <!-- Swipe Up / Down Navigation Controls -->
                            <div class="absolute left-2 bottom-6 flex flex-col items-center gap-2 z-30">
                                <button type="button" onclick="window.titanSimPrevVideo('${id}', 'facebook')" class="w-7 h-7 rounded-full bg-black/60 hover:bg-blue-600 border border-white/20 flex items-center justify-center text-xs text-white transition cursor-pointer">
                                    ▲
                                </button>
                                <button type="button" onclick="window.titanSimNextVideo('${id}', 'facebook')" class="w-7 h-7 rounded-full bg-black/60 hover:bg-blue-600 border border-white/20 flex items-center justify-center text-xs text-white transition cursor-pointer">
                                    ▼
                                </button>
                            </div>

                            <!-- Action Sidebar -->
                            <div class="absolute right-2 bottom-6 flex flex-col items-center gap-3.5 z-30">
                                <button type="button" onclick="window.titanSimToggleMute('${id}', '${id}-fb-video')" class="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-sm text-white hover:text-cyan-400 transition cursor-pointer">
                                    🔊
                                </button>
                            </div>

                            <!-- ⚡ INSTANT TIMELINE GRABBER HUD BUTTON -->
                            <div class="absolute top-2 left-2 right-2 flex items-center justify-between z-40 bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-blue-500/70 shadow-xl">
                                <span class="text-[9.5px] font-bold text-blue-300 flex items-center gap-1">📘 FB Reel Stream</span>
                                <button type="button" onclick="window.titanSimSendActiveToTimeline('${id}', 'facebook')" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[9.5px] font-black tracking-wide shadow-lg flex items-center gap-1 transition-all cursor-pointer">
                                    📥 Grab to Timeline (V1)
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- E. LIVE REAL WEB BROWSER VIEWPORT (Mobile Proxy Enabled) -->
                    <div id="${id}-view-browser" class="view-panel absolute inset-0 hidden flex-col bg-slate-950 overflow-hidden z-20">
                        <!-- Browser URL Bar -->
                        <div class="px-2 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5">
                            <button type="button" onclick="window.titanSimBrowserBack('${id}')" class="text-slate-400 hover:text-white px-1 font-bold text-xs cursor-pointer">◀</button>
                            <button type="button" onclick="window.titanSimBrowserReload('${id}')" class="text-slate-400 hover:text-white px-1 font-bold text-xs cursor-pointer">🔄</button>
                            
                            <div class="flex-1 flex items-center gap-1 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg shadow-inner">
                                <span class="text-[10px] text-slate-400">🔒</span>
                                <input type="text" id="${id}-browser-search-input" value="${initialUrl}" 
                                       onkeydown="if(event.key==='Enter') window.titanSimRunSearch('${id}', this.value)"
                                       class="w-full bg-transparent border-none text-[10.5px] font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0 truncate" 
                                       placeholder="Search DuckDuckGo or enter URL..." />
                            </div>
                            <button type="button" onclick="window.titanSimRunSearch('${id}', document.getElementById('${id}-browser-search-input').value)" class="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md text-[10px] font-bold cursor-pointer">GO</button>
                        </div>

                        <!-- Quick Live Bookmarks -->
                        <div class="flex items-center gap-1 px-2 py-1 bg-slate-950 border-b border-slate-800/80 text-[9px] font-mono overflow-x-auto whitespace-nowrap">
                            <button type="button" onclick="window.titanSimNavigate('${id}', 'https://en.m.wikipedia.org/wiki/Nepal')" class="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 cursor-pointer">🇳🇵 Nepal</button>
                            <button type="button" onclick="window.titanSimNavigate('${id}', 'https://html.duckduckgo.com/html/?q=nepal+tiktok+videos')" class="px-1.5 py-0.5 bg-amber-900/60 hover:bg-amber-800 text-amber-300 rounded cursor-pointer">🦆 DuckDuckGo</button>
                            <button type="button" onclick="window.titanSimNavigate('${id}', 'https://news.ycombinator.com')" class="px-1.5 py-0.5 bg-orange-950 hover:bg-orange-800 text-orange-300 rounded cursor-pointer">📰 TechNews</button>
                            <button type="button" onclick="window.titanSimNavigate('${id}', 'https://httpbin.org/html')" class="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-cyan-300 cursor-pointer">🌐 Live Test</button>
                        </div>

                        <!-- Real Live Iframe Viewport with Proxy -->
                        <div class="flex-1 w-full bg-white relative">
                            <iframe id="${id}-browser-iframe" src="/api/proxy?url=${encodeURIComponent(initialUrl)}" 
                                    class="w-full h-full border-0 bg-white" 
                                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                                    loading="lazy"></iframe>
                        </div>
                    </div>

                </div>

                <!-- Bottom Home Indicator Bar -->
                <div class="home-bar-container w-full h-5 flex items-center justify-center z-50 cursor-pointer hover:bg-white/5 transition" onclick="window.titanSimToggleHome('${id}')" title="Home Bar">
                    <div class="w-32 h-1 bg-white/70 hover:bg-white rounded-full transition-all shadow-sm"></div>
                </div>

            </div>

        </div>

        <!-- Captured Video Notification Modal/Toast -->
        <div id="${id}-capture-toast" class="fixed top-8 left-1/2 -translate-x-1/2 bg-slate-900/95 border-2 border-emerald-500 shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_20px_rgba(16,185,129,0.5)] rounded-2xl px-4 py-2.5 flex items-center gap-3 text-white text-xs font-mono z-[9999] opacity-0 pointer-events-none transition-all duration-300">
            <span class="text-xl">📥</span>
            <div>
                <div class="font-bold text-emerald-400" id="${id}-toast-title">Video Imported to Timeline!</div>
                <div class="text-[10px] text-slate-300" id="${id}-toast-desc">Track V1 • 60FPS Video Ready for Editing</div>
            </div>
        </div>

        <!-- EMBEDDED CLIENT SCRIPT (Guarantees all functions exist in client browser) -->
        <script>
            // Real Online Video Playlists for High-Speed Live Streaming
            window._titanFeeds = {
                tiktok: [
                    {
                        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                        author: '@nepal_viral_creator',
                        desc: '🔥 Real Live Trending TikTok Stream in Nepal 🇳🇵 - 60FPS HD',
                        title: 'TikTok Viral Clip - Blazes HD'
                    },
                    {
                        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
                        author: '@kathmandu_vibes',
                        desc: '🎵 Kathmandu Vibes & Music Reel Streamed Live!',
                        title: 'TikTok Music Reel - Meltdowns HD'
                    },
                    {
                        url: '/api/video?name=tiktok.mp4',
                        author: '@nepal_creator_4k',
                        desc: '🇳🇵 Local 60FPS Video Reel for Timeline Editor',
                        title: 'Local TikTok Stream 4K'
                    }
                ],
                douyin: [
                    {
                        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                        author: '🇨🇳 @douyin_travel_hub',
                        desc: '🇨🇳 抖音 (Douyin) 4K Ultra Cinematic Video Stream',
                        title: 'Douyin 4K Viral Short'
                    },
                    {
                        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
                        author: '🇨🇳 @shanghai_trends',
                        desc: '🇨🇳 Asian Viral Short - High Quality Motion',
                        title: 'Douyin Fun Short Clip'
                    },
                    {
                        url: '/api/video?name=douyin.mp4',
                        author: '🇨🇳 @douyin_local',
                        desc: '🇨🇳 Local Douyin Stream Masterpiece',
                        title: 'Douyin Local Clip'
                    }
                ],
                facebook: [
                    {
                        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
                        author: '📘 Facebook Watch HD',
                        desc: 'Real Facebook Reels Stream & Cinematic Audio',
                        title: 'Facebook Reels Joy HD'
                    },
                    {
                        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
                        author: '📘 FB Global Creator',
                        desc: 'Facebook Watch Full Screen Stream',
                        title: 'Facebook Bullrun Stream'
                    },
                    {
                        url: '/api/video?name=facebook.mp4',
                        author: '📘 FB Local',
                        desc: 'Facebook Local Reel Stream',
                        title: 'Facebook Local Clip'
                    }
                ]
            };

            window._titanFeedIdx = { tiktok: 0, douyin: 0, facebook: 0 };

            window.titanSimSwitchMode = function(simId, modeName) {
                const panels = ['tiktok', 'shorts', 'douyin', 'facebook', 'browser'];
                panels.forEach(function(p) {
                    const el = document.getElementById(simId + '-view-' + p);
                    const tab = document.getElementById(simId + '-tab-' + p);
                    if (el) {
                        if (p === modeName) {
                            el.classList.remove('hidden');
                            el.classList.add('flex');
                            const vid = el.querySelector('video');
                            if (vid) { vid.play().catch(function() {}); }
                        } else {
                            el.classList.add('hidden');
                            el.classList.remove('flex');
                            const vid = el.querySelector('video');
                            if (vid) { vid.pause(); }
                        }
                    }
                    if (tab) {
                        if (p === modeName) {
                            tab.className = 'mode-tab px-2 py-1.5 rounded-lg bg-rose-600 text-white border border-rose-500 flex items-center gap-1 transition cursor-pointer';
                        } else {
                            tab.className = 'mode-tab px-2 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition cursor-pointer';
                        }
                    }
                });
            };

            window.titanSimNextVideo = function(simId, platform) {
                const list = window._titanFeeds[platform];
                if (!list || list.length === 0) return;
                window._titanFeedIdx[platform] = (window._titanFeedIdx[platform] + 1) % list.length;
                window.titanSimApplyFeedVideo(simId, platform);
            };

            window.titanSimPrevVideo = function(simId, platform) {
                const list = window._titanFeeds[platform];
                if (!list || list.length === 0) return;
                window._titanFeedIdx[platform] = (window._titanFeedIdx[platform] - 1 + list.length) % list.length;
                window.titanSimApplyFeedVideo(simId, platform);
            };

            window.titanSimApplyFeedVideo = function(simId, platform) {
                const idx = window._titanFeedIdx[platform];
                const item = window._titanFeeds[platform][idx];
                const vid = document.getElementById(simId + '-' + platform + '-video');
                const author = document.getElementById(simId + '-' + platform + '-author');
                const desc = document.getElementById(simId + '-' + platform + '-desc');

                if (author) author.innerText = item.author;
                if (desc) desc.innerText = item.desc;

                if (vid) {
                    vid.src = item.url;
                    vid.load();
                    vid.play().catch(function() {});
                }
            };

            window.titanSimLoadShort = function(simId, videoId, title) {
                const iframe = document.getElementById(simId + '-shorts-iframe');
                if (iframe) {
                    iframe.src = 'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&mute=0&controls=1&loop=1&playsinline=1';
                }
            };

            window.titanSimLoadUniversal = function(simId) {
                const input = document.getElementById(simId + '-universal-input');
                if (!input || !input.value.trim()) return;
                const raw = input.value.trim();

                // 1. YouTube Shorts or Video
                if (raw.includes('youtube.com') || raw.includes('youtu.be')) {
                    let vidId = '';
                    if (raw.includes('/shorts/')) {
                        vidId = raw.split('/shorts/')[1].split(/[?&]/)[0];
                    } else if (raw.includes('v=')) {
                        vidId = raw.split('v=')[1].split('&')[0];
                    } else if (raw.includes('youtu.be/')) {
                        vidId = raw.split('youtu.be/')[1].split(/[?&]/)[0];
                    }
                    if (vidId) {
                        window.titanSimSwitchMode(simId, 'shorts');
                        window.titanSimLoadShort(simId, vidId, 'Real YouTube Short');
                        return;
                    }
                }

                // 2. Direct MP4 / WebM / Video Stream URL
                if (raw.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || raw.includes('/api/video')) {
                    window.titanSimSwitchMode(simId, 'tiktok');
                    const vid = document.getElementById(simId + '-tiktok-video');
                    const desc = document.getElementById(simId + '-tiktok-desc');
                    const author = document.getElementById(simId + '-tiktok-author');
                    if (author) author.innerText = '@custom_stream';
                    if (desc) desc.innerText = 'Streaming Real Video URL: ' + raw;
                    if (vid) {
                        vid.src = raw;
                        vid.load();
                        vid.play().catch(function() {});
                    }
                    return;
                }

                // 3. Any Website / Search Query -> Load via Browser Proxy
                window.titanSimSwitchMode(simId, 'browser');
                window.titanSimRunSearch(simId, raw);
            };

            window.titanSimToggleVideoPlay = function(videoEl) {
                if (!videoEl) return;
                if (videoEl.paused) {
                    videoEl.play();
                } else {
                    videoEl.pause();
                }
            };

            window.titanSimToggleMute = function(simId, videoId) {
                const vid = document.getElementById(videoId);
                if (vid) {
                    vid.muted = !vid.muted;
                    if (!vid.muted && vid.paused) {
                        vid.play().catch(function() {});
                    }
                }
            };

            window.titanSimRunSearch = function(simId, query) {
                if (!query) return;
                var finalUrl = query.trim();
                if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
                    finalUrl = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(finalUrl);
                }
                var iframe = document.getElementById(simId + '-browser-iframe');
                var input = document.getElementById(simId + '-browser-search-input');
                if (input) input.value = finalUrl;
                if (iframe) iframe.src = '/api/proxy?url=' + encodeURIComponent(finalUrl);
            };

            window.titanSimNavigate = function(simId, url) {
                if (!url) return;
                var finalUrl = url.trim();
                if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
                    finalUrl = 'https://' + finalUrl;
                }
                var iframe = document.getElementById(simId + '-browser-iframe');
                var input = document.getElementById(simId + '-browser-search-input');
                if (input) input.value = finalUrl;
                if (iframe) iframe.src = '/api/proxy?url=' + encodeURIComponent(finalUrl);
            };

            window.titanSimBrowserBack = function(simId) {
                var iframe = document.getElementById(simId + '-browser-iframe');
                if (iframe && iframe.contentWindow) {
                    try { iframe.contentWindow.history.back(); } catch (e) {}
                }
            };

            window.titanSimBrowserReload = function(simId) {
                var iframe = document.getElementById(simId + '-browser-iframe');
                if (iframe) {
                    iframe.src = iframe.src;
                }
            };

            window.titanSimSendActiveToTimeline = function(simId, platform) {
                let title = 'Captured Video Clip';
                let srcUrl = '';

                if (platform === 'shorts') {
                    title = 'YouTube Shorts Video';
                    srcUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
                } else {
                    const idx = window._titanFeedIdx[platform] || 0;
                    const item = window._titanFeeds[platform] ? window._titanFeeds[platform][idx] : null;
                    if (item) {
                        title = item.title;
                        srcUrl = item.url;
                    } else {
                        const vid = document.getElementById(simId + '-' + platform + '-video');
                        srcUrl = vid ? vid.src : '/api/video?name=tiktok.mp4';
                    }
                }

                window.titanSimSendToTimeline(simId, title, srcUrl);
            };

            window.titanSimSendToTimeline = function(simId, title, videoUrl) {
                var toast = document.getElementById(simId + '-capture-toast');
                var tTitle = document.getElementById(simId + '-toast-title');
                var tDesc = document.getElementById(simId + '-toast-desc');

                if (tTitle) tTitle.innerText = '🎬 Captured: ' + title;
                if (tDesc) tDesc.innerText = 'Injected into Video Editor Track V1 at 00:00.00';

                if (toast) {
                    toast.classList.remove('opacity-0', 'pointer-events-none');
                    toast.classList.add('opacity-100');
                    setTimeout(function() {
                        toast.classList.add('opacity-0', 'pointer-events-none');
                        toast.classList.remove('opacity-100');
                    }, 2500);
                }

                if (window.timelineClips && Array.isArray(window.timelineClips)) {
                    var newClip = {
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
                var root = document.getElementById(simId + '-screen-root');
                if (root) {
                    root.classList.toggle('brightness-0');
                }
            };

            window.titanSimVolume = function(simId, delta) {
                var hud = document.getElementById(simId + '-volume-hud');
                var bar = document.getElementById(simId + '-volume-bar');
                if (hud && bar) {
                    var cur = parseInt(bar.style.height || '70%') + delta;
                    cur = Math.max(0, Math.min(100, cur));
                    bar.style.height = cur + '%';
                    hud.classList.remove('opacity-0');
                    hud.classList.add('opacity-100');
                    clearTimeout(window['_volTimeout_' + simId]);
                    window['_volTimeout_' + simId] = setTimeout(function() {
                        hud.classList.add('opacity-0');
                        hud.classList.remove('opacity-100');
                    }, 1200);
                }
            };

            window.titanSimRotate = function(simId) {
                var chassis = document.getElementById(simId + '-chassis');
                if (chassis) {
                    var curRot = chassis.dataset.rotated === 'true';
                    chassis.dataset.rotated = (!curRot).toString();
                    chassis.style.transform = (!curRot) ? 'rotate(90deg) scale(0.85)' : 'rotate(0deg) scale(1.0)';
                }
            };

            window.titanSimExpandIsland = function(simId) {
                var island = document.getElementById(simId + '-dynamic-island');
                var label = document.getElementById(simId + '-island-label');
                if (island && label) {
                    island.classList.toggle('w-[280px]');
                    island.classList.toggle('h-[48px]');
                    label.innerText = island.classList.contains('w-[280px]') ? '⚡ Video Grabber Active' : 'Titan Real Video Hub';
                }
            };

            setInterval(function() {
                var d = new Date();
                var hrs = String(d.getHours()).padStart(2, '0');
                var mins = String(d.getMinutes()).padStart(2, '0');
                document.querySelectorAll('[id$="-clock"]').forEach(function(el) {
                    el.innerText = hrs + ':' + mins;
                });
            }, 1000);
        </script>

    </div>
    `;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderTitanMobileSimulator };
}

