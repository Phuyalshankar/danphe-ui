'use strict';

/**
 * 📱 TitanMobileSimulator (danphe-ui / lib)
 * Ultra-Realistic SVG Titanium Smartphone Hardware & Live Interactive Social Video / Real Chromium 60FPS Engine
 */

function renderTitanMobileSimulator(options = {}) {
    const {
        id = 'titan-mobile-sim-' + Math.floor(Math.random() * 100000),
        width = 360,
        height = 680,
        deviceModel = 'iPhone 16 Pro Max Titanium',
        deviceColor = 'titanium',
        initialUrl = 'https://www.tiktok.com',
        initialApp = 'chromium',
        batteryPct = 96,
        wsUrl = 'ws://localhost:3006',
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
        <div class="sim-toolbar flex items-center justify-between w-full max-w-[370px] mb-1.5 px-3 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl backdrop-blur-xl shadow-xl text-xs text-slate-300 z-50">
            <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="font-bold text-white text-[10.5px] tracking-wide">${deviceModel}</span>
                <span id="${id}-engine-status" class="px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded text-[8.5px] font-mono">⚡ 60FPS</span>
            </div>
            
            <div class="flex items-center gap-1">
                <!-- Scale Fit Toggle -->
                <button type="button" onclick="window.titanSimToggleScale('${id}')" class="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-[9.5px] font-bold text-slate-300 cursor-pointer" title="Zoom Fit">
                    🔍 <span id="${id}-scale-label">100%</span>
                </button>
                <!-- Rotate Phone Button -->
                <button type="button" onclick="window.titanSimRotate('${id}')" class="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-[9.5px] font-bold text-cyan-300 cursor-pointer" title="Rotate 90°">
                    🔄
                </button>
                <!-- Power Button -->
                <button type="button" onclick="window.titanSimTogglePower('${id}')" class="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-[9.5px] font-bold text-rose-300 cursor-pointer" title="Screen Power / Lock">
                    ⚡
                </button>
            </div>
        </div>

        <!-- Universal Real URL / Video Link Loader Bar -->
        <div class="w-full max-w-[370px] mb-2 p-1 bg-slate-900/95 border border-indigo-500/40 rounded-xl shadow-xl z-50">
            <div class="flex items-center gap-1">
                <span class="text-xs text-indigo-400 font-bold px-1">🌐</span>
                <input type="text" id="${id}-universal-input" 
                       placeholder="Enter URL (TikTok, 抖音, 快手, YouTube)..." 
                       value="${initialUrl}"
                       onkeydown="if(event.key==='Enter') window.titanSimNavigateChromium('${id}', this.value)"
                       class="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[10.5px] font-mono text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-indigo-400 truncate" />
                <button type="button" onclick="window.titanSimNavigateChromium('${id}', document.getElementById('${id}-universal-input').value)" class="px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-lg text-[10px] font-bold transition cursor-pointer shadow">
                    ▶ Go
                </button>
            </div>
        </div>

        <!-- 3D Device Container (100% Screen Fitted) -->
        <div id="${id}-scale-container" class="transition-transform duration-300 origin-top flex justify-center">
            <div id="${id}-chassis" class="titan-sim-chassis relative transition-transform duration-500 ease-out" style="width: ${width}px; height: ${height}px; transform-style: preserve-3d;">
                
                <!-- 1. SVG Hardware Chassis Background -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 680" class="absolute inset-0 w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)] overflow-visible pointer-events-none z-0">
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
                    <rect x="0" y="100" width="4" height="26" rx="2" fill="#475569" stroke="#1e293b" stroke-width="0.5" style="pointer-events:auto; cursor:pointer;" onclick="window.titanSimVolume('${id}', 0)"/>
                    <rect x="0" y="140" width="4" height="46" rx="2" fill="#475569" stroke="#1e293b" stroke-width="0.5" style="pointer-events:auto; cursor:pointer;" onclick="window.titanSimVolume('${id}', 10)"/>
                    <rect x="0" y="195" width="4" height="46" rx="2" fill="#475569" stroke="#1e293b" stroke-width="0.5" style="pointer-events:auto; cursor:pointer;" onclick="window.titanSimVolume('${id}', -10)"/>

                    <!-- Right Physical Power Button -->
                    <rect x="356" y="160" width="4" height="65" rx="2" fill="#475569" stroke="#1e293b" stroke-width="0.5" style="pointer-events:auto; cursor:pointer;" onclick="window.titanSimTogglePower('${id}')"/>

                    <!-- Outer Titanium Chassis -->
                    <rect x="3" y="3" width="354" height="674" rx="42" fill="url(#${id}-rim-grad)" stroke="#090d16" stroke-width="2" />
                    
                    <!-- Inner OLED Display Frame -->
                    <rect x="8" y="8" width="344" height="664" rx="36" fill="url(#${id}-bezel-grad)" stroke="#000000" stroke-width="2" />
                    <rect x="10" y="10" width="340" height="660" rx="34" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.8" />

                    <!-- Speaker Ear-piece Micro Grill -->
                    <rect x="150" y="12" width="60" height="3" rx="1.5" fill="#1e293b" stroke="#000" stroke-width="0.5"/>
                </svg>

                <!-- 2. REAL INTERACTIVE SCREEN CONTAINER (Pure HTML/DOM - 100% Clickable & Responsive) -->
                <div id="${id}-screen-root" class="absolute inset-[12px] rounded-[32px] bg-black flex flex-col overflow-hidden text-white font-sans select-none z-10" style="pointer-events: auto !important;">
                    
                    <!-- Status Bar -->
                    <div class="status-bar flex items-center justify-between px-5 pt-2 pb-0.5 text-[10px] font-semibold tracking-tight text-white/90 z-50 pointer-events-none bg-gradient-to-b from-black/80 to-transparent">
                        <span id="${id}-clock" class="font-bold tracking-wider font-mono">09:41</span>
                        
                        <div class="flex items-center gap-1.5">
                            <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.28 19.68 10.59 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
                            <span class="text-[9px] font-mono">5G</span>
                            <div class="w-4 h-2.5 border border-white/80 rounded-[3px] p-0.5 flex items-center">
                                <div id="${id}-battery-fill" class="h-full bg-emerald-400 rounded-[1px]" style="width: ${batteryPct}%;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Dynamic Island -->
                    <div id="${id}-dynamic-island" class="dynamic-island absolute top-1.5 left-1/2 -translate-x-1/2 h-[24px] px-2.5 bg-black rounded-full border border-slate-800/80 shadow-md flex items-center justify-between gap-2 text-[9.5px] font-mono text-cyan-300 z-50 transition-all duration-300 ease-out cursor-pointer hover:scale-105" onclick="window.titanSimExpandIsland('${id}')">
                        <div class="flex items-center gap-1.5 pointer-events-none">
                            <span class="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700/60 relative">
                                <span class="w-1 h-1 rounded-full bg-cyan-400 absolute inset-0 m-auto"></span>
                            </span>
                            <span id="${id}-island-label" class="font-bold text-[8px] text-slate-300 truncate max-w-[110px]">Chromium Live</span>
                        </div>
                        <span class="w-1 h-1 rounded-full bg-emerald-400 animate-ping pointer-events-none"></span>
                    </div>

                    <!-- Volume HUD Indicator -->
                    <div id="${id}-volume-hud" class="absolute left-2 top-24 w-1.5 h-20 bg-slate-800/80 backdrop-blur-md rounded-full overflow-hidden border border-white/20 z-50 opacity-0 transition-opacity duration-200 pointer-events-none">
                        <div id="${id}-volume-bar" class="w-full bg-white transition-all duration-150 rounded-full" style="height: 70%; margin-top: auto;"></div>
                    </div>

                    <!-- TOP SOCIAL SHORTCUT BUTTONS (TikTok, Douyin, Kuaishou, Shorts, FB) -->
                    <div class="app-mode-ribbon px-1 pt-5 pb-1 bg-slate-950 border-b border-slate-800/90 flex items-center justify-between gap-0.5 z-40 text-[9px] font-bold overflow-x-auto whitespace-nowrap">
                        <button type="button" onclick="window.titanSimNavigateChromium('${id}', 'https://www.tiktok.com')" class="px-1.5 py-0.5 rounded-md bg-rose-950/90 hover:bg-rose-900 text-rose-300 border border-rose-700/50 flex items-center gap-0.5 transition cursor-pointer">
                            🎵 TikTok
                        </button>
                        <button type="button" onclick="window.titanSimNavigateChromium('${id}', 'https://www.douyin.com')" class="px-1.5 py-0.5 rounded-md bg-amber-950/90 hover:bg-amber-900 text-amber-300 border border-amber-700/50 flex items-center gap-0.5 transition cursor-pointer">
                            🇨🇳 抖音
                        </button>
                        <button type="button" onclick="window.titanSimNavigateChromium('${id}', 'https://www.kuaishou.com')" class="px-1.5 py-0.5 rounded-md bg-orange-950/90 hover:bg-orange-900 text-orange-300 border border-orange-700/50 flex items-center gap-0.5 transition cursor-pointer">
                            ⚡ 快手
                        </button>
                        <button type="button" onclick="window.titanSimNavigateChromium('${id}', 'https://m.youtube.com/shorts')" class="px-1.5 py-0.5 rounded-md bg-red-950/90 hover:bg-red-900 text-red-300 border border-red-700/50 flex items-center gap-0.5 transition cursor-pointer">
                            🔴 Shorts
                        </button>
                        <button type="button" onclick="window.titanSimNavigateChromium('${id}', 'https://m.facebook.com/watch')" class="px-1.5 py-0.5 rounded-md bg-blue-950/90 hover:bg-blue-900 text-blue-300 border border-blue-700/50 flex items-center gap-0.5 transition cursor-pointer">
                            📘 FB
                        </button>
                        <button type="button" onclick="window.titanSimNavigateChromium('${id}', 'https://www.google.com')" class="px-1.5 py-0.5 rounded-md bg-cyan-950/90 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50 flex items-center gap-0.5 transition cursor-pointer">
                            🔍 Google
                        </button>
                    </div>

                    <!-- SNIFFED VIDEO DETECTED BANNER -->
                    <div id="${id}-sniffed-banner" class="hidden px-2 py-1 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border-b border-emerald-500/60 flex items-center justify-between z-40 text-[8.5px] animate-pulse">
                        <span class="text-emerald-300 font-bold flex items-center gap-1">🎥 <span id="${id}-sniffed-title" class="truncate max-w-[170px]">Video Stream Captured</span></span>
                        <button type="button" onclick="window.titanSimGrabSniffed('${id}')" class="px-2 py-0.5 bg-emerald-400 hover:bg-emerald-300 text-black font-black rounded shadow cursor-pointer">
                            📥 Grab V1
                        </button>
                    </div>

                    <!-- MAIN REAL CHROMIUM CANVAS VIEWPORT (60FPS Screencast + Full Touch/Click/Scroll/Key Input) -->
                    <div class="viewport-wrapper flex-1 relative w-full h-full bg-zinc-950 overflow-hidden flex flex-col">
                        
                        <!-- Real Chromium Canvas -->
                        <canvas id="${id}-chromium-canvas" 
                                width="360" 
                                height="680" 
                                class="w-full h-full object-fill bg-black cursor-crosshair focus:outline-none"
                                tabindex="0"></canvas>

                        <!-- Floating Reel Swipe Controls on Screen (▲ Prev / ▼ Next) -->
                        <div class="absolute right-2 bottom-12 flex flex-col items-center gap-2 z-40">
                            <button type="button" onclick="window.titanSimSwipeDown('${id}')" class="w-8 h-8 rounded-full bg-black/70 hover:bg-rose-600 border border-white/30 backdrop-blur-md flex items-center justify-center text-xs text-white shadow-xl transition-all cursor-pointer active:scale-90" title="Swipe Up (Previous Reel)">
                                ▲
                            </button>
                            <button type="button" onclick="window.titanSimSwipeUp('${id}')" class="w-8 h-8 rounded-full bg-black/70 hover:bg-rose-600 border border-white/30 backdrop-blur-md flex items-center justify-center text-xs text-white shadow-xl transition-all cursor-pointer active:scale-90" title="Swipe Down (Next Reel)">
                                ▼
                            </button>
                        </div>

                        <!-- Loading / Connecting Overlay -->
                        <div id="${id}-loading-overlay" class="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-2.5 z-30 transition-opacity duration-300">
                            <div class="w-7 h-7 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                            <div class="text-[10.5px] font-mono text-cyan-300 font-bold">Connecting Real Chromium Engine...</div>
                            <div class="text-[8.5px] text-slate-500">Ultra-Fast 60FPS Screencast Stream</div>
                        </div>

                        <!-- Floating Navigation Bar on Bottom -->
                        <div class="absolute bottom-1.5 left-2 right-2 flex items-center justify-between px-2.5 py-1 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/70 shadow-2xl z-40 text-xs">
                            <div class="flex items-center gap-1.5">
                                <button type="button" onclick="window.titanSimChromiumGoBack('${id}')" class="text-slate-300 hover:text-white font-bold px-1.5 py-0.5 cursor-pointer" title="Back">◀</button>
                                <button type="button" onclick="window.titanSimChromiumReload('${id}')" class="text-slate-300 hover:text-white font-bold px-1.5 py-0.5 cursor-pointer" title="Reload">🔄</button>
                            </div>
                            <div class="flex items-center gap-1">
                                <button type="button" onclick="window.titanSimNavigateChromium('${id}', 'https://www.tiktok.com')" class="text-[9px] font-mono text-rose-300 px-1.5 py-0.5 bg-slate-800 rounded cursor-pointer">🎵 TikTok</button>
                                <button type="button" onclick="window.titanSimNavigateChromium('${id}', 'https://www.douyin.com')" class="text-[9px] font-mono text-amber-300 px-1.5 py-0.5 bg-slate-800 rounded cursor-pointer">🇨🇳 抖音</button>
                            </div>
                            <button type="button" onclick="window.titanSimSendActiveToTimeline('${id}', 'Chromium Web Stream')" class="px-2 py-0.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-md text-[9px] font-black shadow cursor-pointer">
                                📥 Grab V1
                            </button>
                        </div>

                    </div>

                    <!-- Bottom Home Indicator Bar -->
                    <div class="home-bar-container w-full h-3.5 flex items-center justify-center z-50 cursor-pointer hover:bg-white/5 transition" onclick="window.titanSimToggleHome('${id}')" title="Home Bar">
                        <div class="w-24 h-1 bg-white/70 hover:bg-white rounded-full transition-all shadow-sm"></div>
                    </div>

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

        <!-- CLIENT SCRIPTS: WebSocket 60FPS Screencast & Input Forwarding -->
        <script>
            (function() {
                const simId = '${id}';
                const wsServerUrl = '${wsUrl}';
                const canvas = document.getElementById(simId + '-chromium-canvas');
                const overlay = document.getElementById(simId + '-loading-overlay');
                const urlInput = document.getElementById(simId + '-universal-input');
                const islandLabel = document.getElementById(simId + '-island-label');
                const sniffedBanner = document.getElementById(simId + '-sniffed-banner');
                const sniffedTitle = document.getElementById(simId + '-sniffed-title');
                
                let ws = null;
                let activeMedia = null;
                const ctx = canvas ? canvas.getContext('2d') : null;
                const img = new Image();

                img.onload = function() {
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    }
                    if (overlay && !overlay.classList.contains('hidden')) {
                        overlay.classList.add('opacity-0', 'pointer-events-none');
                        setTimeout(function() { overlay.classList.add('hidden'); }, 300);
                    }
                };

                function connect() {
                    try {
                        ws = new WebSocket(wsServerUrl);
                        window['_titanWs_' + simId] = ws;

                        ws.onopen = function() {
                            console.log('⚡ [TitanSim] Connected to Chromium Engine!');
                        };

                        ws.onmessage = function(event) {
                            try {
                                const msg = JSON.parse(event.data);
                                
                                if (msg.type === 'screencast_frame') {
                                    img.src = 'data:image/jpeg;base64,' + msg.data;
                                    if (msg.url && urlInput && document.activeElement !== urlInput) {
                                        urlInput.value = msg.url;
                                    }
                                }

                                if (msg.type === 'url_changed') {
                                    if (urlInput && document.activeElement !== urlInput) {
                                        urlInput.value = msg.url;
                                    }
                                    if (islandLabel) {
                                        try {
                                            const u = new URL(msg.url);
                                            islandLabel.innerText = u.hostname.replace('www.', '');
                                        } catch(e) {
                                            islandLabel.innerText = 'Chromium Live';
                                        }
                                    }
                                }

                                if (msg.type === 'media_detected') {
                                    activeMedia = msg.media;
                                    if (sniffedBanner && sniffedTitle) {
                                        sniffedTitle.innerText = activeMedia.title || 'Video Stream Detected';
                                        sniffedBanner.classList.remove('hidden');
                                    }
                                }
                            } catch(e) {}
                        };

                        ws.onclose = function() {
                            setTimeout(connect, 1500);
                        };

                        ws.onerror = function() {
                            ws.close();
                        };
                    } catch(e) {
                        setTimeout(connect, 1500);
                    }
                }

                connect();

                // Forward Mouse Clicks / Touches & Drag Swiping
                if (canvas) {
                    let isDragging = false;
                    let startX = 0, startY = 0;
                    let lastX = 0, lastY = 0;

                    function getCoords(e) {
                        const rect = canvas.getBoundingClientRect();
                        const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
                        const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
                        const x = ((clientX - rect.left) / rect.width) * canvas.width;
                        const y = ((clientY - rect.top) / rect.height) * canvas.height;
                        return { x: Math.max(0, Math.min(canvas.width, x)), y: Math.max(0, Math.min(canvas.height, y)) };
                    }

                    canvas.addEventListener('mousedown', function(e) {
                        isDragging = true;
                        const c = getCoords(e);
                        startX = c.x; startY = c.y;
                        lastX = c.x; lastY = c.y;
                        if (ws && ws.readyState === WebSocket.OPEN) {
                            ws.send(JSON.stringify({ type: 'touch_start', x: c.x, y: c.y }));
                            ws.send(JSON.stringify({ type: 'mouse_down', x: c.x, y: c.y }));
                        }
                    });

                    canvas.addEventListener('mousemove', function(e) {
                        if (!isDragging) return;
                        const c = getCoords(e);
                        lastX = c.x; lastY = c.y;
                        if (ws && ws.readyState === WebSocket.OPEN) {
                            ws.send(JSON.stringify({ type: 'touch_move', x: c.x, y: c.y }));
                            ws.send(JSON.stringify({ type: 'mouse_move', x: c.x, y: c.y }));
                        }
                    });

                    canvas.addEventListener('mouseup', function(e) {
                        if (!isDragging) return;
                        isDragging = false;
                        const c = getCoords(e);
                        const dy = startY - c.y;
                        if (ws && ws.readyState === WebSocket.OPEN) {
                            ws.send(JSON.stringify({ type: 'touch_end' }));
                            ws.send(JSON.stringify({ type: 'mouse_up', x: c.x, y: c.y }));
                            
                            // If user flicked / dragged vertically > 40px, trigger Reel Swipe!
                            if (dy > 40) {
                                ws.send(JSON.stringify({ type: 'swipe_up' }));
                            } else if (dy < -40) {
                                ws.send(JSON.stringify({ type: 'swipe_down' }));
                            } else {
                                ws.send(JSON.stringify({ type: 'mouse_click', x: c.x, y: c.y }));
                            }
                        }
                    });

                    canvas.addEventListener('wheel', function(e) {
                        e.preventDefault();
                        const c = getCoords(e);
                        if (ws && ws.readyState === WebSocket.OPEN) {
                            if (e.deltaY > 30) {
                                ws.send(JSON.stringify({ type: 'swipe_up' }));
                            } else if (e.deltaY < -30) {
                                ws.send(JSON.stringify({ type: 'swipe_down' }));
                            } else {
                                ws.send(JSON.stringify({ type: 'scroll', x: c.x, y: c.y, deltaX: e.deltaX, deltaY: e.deltaY }));
                            }
                        }
                    }, { passive: false });

                    // Keyboard input forwarding
                    canvas.addEventListener('keydown', function(e) {
                        if (ws && ws.readyState === WebSocket.OPEN) {
                            if (e.key === 'ArrowDown') {
                                ws.send(JSON.stringify({ type: 'swipe_up' }));
                                e.preventDefault();
                                return;
                            }
                            if (e.key === 'ArrowUp') {
                                ws.send(JSON.stringify({ type: 'swipe_down' }));
                                e.preventDefault();
                                return;
                            }
                            ws.send(JSON.stringify({
                                type: 'key',
                                key: e.key,
                                code: e.code,
                                keyCode: e.keyCode,
                                text: e.key.length === 1 ? e.key : undefined
                            }));
                        }
                    });
                }

                // Global Functions
                window.titanSimSwipeUp = function(id) {
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'swipe_up' }));
                    }
                };

                window.titanSimSwipeDown = function(id) {
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'swipe_down' }));
                    }
                };

                window.titanSimNavigateChromium = function(id, url) {
                    if (!url) return;
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'navigate', url: url }));
                    }
                };

                window.titanSimChromiumGoBack = function(id) {
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'go_back' }));
                    }
                };

                window.titanSimChromiumReload = function(id) {
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'reload' }));
                    }
                };

                window.titanSimGrabSniffed = function(id) {
                    if (activeMedia) {
                        window.titanSimSendToTimeline(id, activeMedia.title || 'Sniffed Stream', activeMedia.url);
                    }
                };

                window.titanSimSendActiveToTimeline = function(id, defaultTitle) {
                    const url = (urlInput ? urlInput.value : '') || 'https://www.tiktok.com';
                    const videoSrc = (activeMedia && activeMedia.url) ? activeMedia.url : '/api/video?name=tiktok.mp4';
                    window.titanSimSendToTimeline(id, defaultTitle || 'Web Video Stream', videoSrc);
                };

                window.titanSimSendToTimeline = function(id, title, videoUrl) {
                    var toast = document.getElementById(id + '-capture-toast');
                    var tTitle = document.getElementById(id + '-toast-title');
                    var tDesc = document.getElementById(id + '-toast-desc');

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

                window.titanSimToggleScale = function(id) {
                    var container = document.getElementById(id + '-scale-container');
                    var label = document.getElementById(id + '-scale-label');
                    if (!container) return;
                    var scales = ['100%', '85%', '75%'];
                    var cur = label ? label.innerText : '100%';
                    var nextIdx = (scales.indexOf(cur) + 1) % scales.length;
                    var next = scales[nextIdx];
                    if (label) label.innerText = next;
                    var val = next === '100%' ? 1.0 : next === '85%' ? 0.85 : 0.75;
                    container.style.transform = 'scale(' + val + ')';
                };

                window.titanSimTogglePower = function(id) {
                    var root = document.getElementById(id + '-screen-root');
                    if (root) root.classList.toggle('brightness-0');
                };

                window.titanSimRotate = function(id) {
                    var chassis = document.getElementById(id + '-chassis');
                    if (chassis) {
                        var curRot = chassis.dataset.rotated === 'true';
                        chassis.dataset.rotated = (!curRot).toString();
                        chassis.style.transform = (!curRot) ? 'rotate(90deg) scale(0.85)' : 'rotate(0deg) scale(1.0)';
                    }
                };

                window.titanSimVolume = function(id, delta) {
                    var hud = document.getElementById(id + '-volume-hud');
                    var bar = document.getElementById(id + '-volume-bar');
                    if (hud && bar) {
                        var cur = parseInt(bar.style.height || '70%') + delta;
                        cur = Math.max(0, Math.min(100, cur));
                        bar.style.height = cur + '%';
                        hud.classList.remove('opacity-0');
                        hud.classList.add('opacity-100');
                        clearTimeout(window['_volTimeout_' + id]);
                        window['_volTimeout_' + id] = setTimeout(function() {
                            hud.classList.add('opacity-0');
                            hud.classList.remove('opacity-100');
                        }, 1200);
                    }
                };

                window.titanSimExpandIsland = function(id) {
                    var island = document.getElementById(id + '-dynamic-island');
                    var label = document.getElementById(id + '-island-label');
                    if (island && label) {
                        island.classList.toggle('w-[260px]');
                        island.classList.toggle('h-[40px]');
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
            })();
        </script>

    </div>
    `;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderTitanMobileSimulator };
}



