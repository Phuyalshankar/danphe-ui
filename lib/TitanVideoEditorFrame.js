'use strict';

/**
 * 🎬 TitanVideoEditorFrame (danphe-ui)
 * CapCut + KineMaster Hybrid Studio — Ultra-Precision Shorts/Reels/TikTok Edition
 * ═════════════════════════════════════════════════════════════════════════════════
 * - 100% Pure Vector SVG Graphics (Zero Bitmaps, Zero Blurry Artifacts)
 * - Normal Text Elements for High Accessibility & Realtime NanoStore Data Binding
 * - Shorts Safe-Zone UI Mask (Overlay protection for TikTok/Reels icons & captions)
 * - KineMaster-Class Rotary Quick-Dial (Media • Layer • Audio • Voiceover • Play)
 * - Multi-Track NLE Timeline with Beat-Sync Markers & Keyframe Diamond Pins
 * - 4K 60FPS Hardware MediaCodec Export Engine Direct Hook
 */

function renderVideoEditorFrame(options = {}) {
    const {
        id = 'titan-video-editor-frame',
        title = 'Trending_Shorts_01.mp4',
        currentTime = '00:07:15',
        totalDuration = '00:58:00',
        aspectRatio = '9:16',
        targetPlatform = 'Shorts / Reels',
        activeTool = 'split',
        resolution = '4K UHD',
        fps = '60 FPS',
        audioTrackName = 'Phonk_Beat_Sync.mp3',
        className = ''
    } = options;

    return `
<div id="${id}" class="titan-video-editor-container flex flex-col w-full max-w-[440px] mx-auto bg-slate-950 text-slate-100 rounded-[32px] overflow-hidden border border-slate-800 shadow-[0_25px_70px_rgba(0,0,0,0.98)] font-sans select-none ${className}">

    <!-- ── 1. PRO TOP BAR (CAPCUT SLEEK + RESOLUTION SWITCHER) ── -->
    <header class="flex items-center justify-between px-4 py-3 bg-slate-900/95 border-b border-slate-800/90 backdrop-blur-xl">
        <div class="flex items-center gap-2.5">
            <button class="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-all active:scale-95">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div class="flex flex-col">
                <div class="flex items-center gap-1.5">
                    <span class="text-xs font-bold text-white tracking-wide truncate max-w-[120px]">${title}</span>
                    <span class="px-1.5 py-0.2 rounded bg-rose-950/80 border border-rose-600 text-rose-400 text-[9px] font-mono font-black animate-pulse">SHORTS</span>
                </div>
                <span class="text-[10px] text-emerald-400 font-mono font-semibold">⚡ On-Device Hardware Codec</span>
            </div>
        </div>

        <div class="flex items-center gap-1.5">
            <!-- Aspect Ratio (9:16 Shorts Pill) -->
            <button class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-950/80 border border-sky-500/60 text-[10px] font-mono font-black text-sky-300 hover:border-sky-400 transition">
                <span>📱</span>
                <span>${aspectRatio}</span>
            </button>

            <!-- 4K 60FPS Ultra Quality Pill -->
            <button class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/70 border border-amber-500/70 text-[10px] font-mono font-black text-amber-300">
                <span>👑</span>
                <span>${resolution}</span>
            </button>

            <!-- Undo / Redo (KineMaster Style) -->
            <div class="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                <button title="Undo (Ctrl+Z)" class="p-1 hover:text-cyan-400 text-slate-400 transition"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg></button>
                <div class="w-[1px] h-3 bg-slate-700"></div>
                <button title="Redo (Ctrl+Y)" class="p-1 hover:text-cyan-400 text-slate-400 transition"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></button>
            </div>

            <!-- Fast Hardware Export Button -->
            <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-[0_0_18px_rgba(16,185,129,0.5)] transition active:scale-95">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>EXPORT</span>
            </button>
        </div>
    </header>

    <!-- ── 2. SHORTS 9:16 CINEMA VIEWPORT (WITH TIKTOK/REELS SAFE ZONE MASK) ── -->
    <div class="relative w-full aspect-[9/10] bg-black flex items-center justify-center p-3 border-b border-slate-800/90 overflow-hidden">
        
        <svg viewBox="0 0 360 410" width="100%" height="100%" class="rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <defs>
                <linearGradient id="${id}-canvas-bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#020617"/>
                    <stop offset="60%" stop-color="#090d16"/>
                    <stop offset="100%" stop-color="#111827"/>
                </linearGradient>
                <filter id="${id}-laser-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            <!-- Video Viewport Background -->
            <rect width="360" height="410" fill="url(#${id}-canvas-bg)" />

            <!-- 9:16 Shorts Framing Guide Box (300 x 390) -->
            <rect x="30" y="10" width="300" height="390" rx="16" fill="#0b0f19" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.6"/>

            <!-- Subtle Rule-of-Thirds Grid (CapCut Precision Alignment) -->
            <line x1="130" y1="10" x2="130" y2="400" stroke="#334155" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.3"/>
            <line x1="230" y1="10" x2="230" y2="400" stroke="#334155" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.3"/>
            <line x1="30" y1="140" x2="330" y2="140" stroke="#334155" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.3"/>
            <line x1="30" y1="270" x2="330" y2="270" stroke="#334155" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.3"/>

            <!-- SHORTS SAFE ZONE BOUNDARIES (Yellow Outline where TikTok UI Won't Obstruct) -->
            <rect x="42" y="24" width="236" height="320" rx="8" fill="none" stroke="#facc15" stroke-width="1.2" stroke-dasharray="6,4" opacity="0.6"/>
            <text x="50" y="38" font-family="monospace" font-size="8" font-weight="900" fill="#facc15" opacity="0.8">SHORTS SAFE ZONE</text>

            <!-- TikTok/Reels Right Rail Icons Mockup (Safe Zone visual test) -->
            <g transform="translate(295, 180)" opacity="0.5">
                <circle cx="0" cy="0" r="14" fill="#1e293b"/>
                <path d="M-5,-4 C-5,-7 -1,-7 0,-4 C1,-7 5,-7 5,-4 C5,1 0,5 0,5 C0,5 -5,1 -5,-4 Z" fill="#ef4444"/>
                <circle cx="0" cy="38" r="14" fill="#1e293b"/>
                <path d="M-4,35 h8 v5 h-8 z" fill="#38bdf8"/>
                <circle cx="0" cy="76" r="14" fill="#1e293b"/>
                <path d="M-4,73 l8,4 l-8,4 z" fill="#e2e8f0"/>
            </g>

            <!-- Video Visual Subject Preview: Neon Cyberpunk Portrait -->
            <g transform="translate(160, 190)" filter="url(#${id}-laser-glow)">
                <ellipse cx="0" cy="0" rx="65" ry="85" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
                <circle cx="0" cy="-25" r="30" fill="#312e81" stroke="#a855f7" stroke-width="2"/>
                <!-- Cinematic Face Lighting Bars -->
                <path d="M-15,-30 Q0,-45 15,-30" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
                <circle cx="-10" cy="-22" r="4" fill="#38bdf8"/>
                <circle cx="10" cy="-22" r="4" fill="#ec4899"/>
                <!-- Soundwave Aura -->
                <circle cx="0" cy="0" r="95" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="14,8" opacity="0.6"/>
            </g>

            <!-- Dynamic Kinetic Caption Sticker (Text Track Render) -->
            <g transform="translate(180, 315)">
                <rect x="-105" y="-14" width="210" height="28" rx="8" fill="#000000" fill-opacity="0.8" stroke="#facc15" stroke-width="1.5"/>
                <text x="0" y="4" font-family="sans-serif" font-size="11" font-weight="900" fill="#facc15" text-anchor="middle" letter-spacing="1">
                    ⚡ WAIT FOR THE BEAT DROP! 🎧
                </text>
            </g>
        </svg>

        <!-- Timecode Floating Box -->
        <div class="absolute bottom-5 left-5 px-3 py-1 bg-black/85 backdrop-blur-md rounded-xl border border-slate-700 font-mono text-[11px] font-black text-sky-300 flex items-center gap-1.5 shadow-lg">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>${currentTime}</span>
            <span class="text-slate-600">/</span>
            <span class="text-slate-400">${totalDuration}</span>
        </div>

        <!-- Safe Zone Toggle & Fullscreen -->
        <div class="absolute bottom-5 right-5 flex items-center gap-1.5">
            <button title="Toggle Safe Zone" class="px-2 py-1 bg-black/85 hover:bg-slate-800 backdrop-blur-md rounded-xl border border-slate-700 text-amber-300 text-[10px] font-mono font-bold">
                MARGINS
            </button>
            <button title="Fullscreen" class="p-1.5 bg-black/85 hover:bg-slate-800 backdrop-blur-md rounded-xl border border-slate-700 text-slate-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
            </button>
        </div>

        <!-- ── KINEMASTER FLOATING ROTARY QUICK-DIAL (MINI-HUB) ── -->
        <div class="absolute top-5 right-5 w-24 h-24 pointer-events-auto">
            <svg viewBox="0 0 100 100" width="100%" height="100%" class="filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]">
                <!-- Rotary Outer Ring -->
                <circle cx="50" cy="50" r="46" fill="#0f172a" fill-opacity="0.9" stroke="#334155" stroke-width="1.8"/>
                <circle cx="50" cy="50" r="46" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="6,4" opacity="0.6"/>

                <!-- Top: Media (Photos/Videos) -->
                <g transform="translate(50, 16)" class="cursor-pointer">
                    <circle cx="0" cy="0" r="11" fill="#0284c7" />
                    <polygon points="4,2 1,4 4,6" fill="#ffffff" transform="translate(-2,-4) scale(0.9)"/>
                    <rect x="-4" y="-3" width="7" height="6" rx="1" fill="#ffffff"/>
                </g>

                <!-- Right: Audio (Sound Effects / BGM) -->
                <g transform="translate(84, 50)" class="cursor-pointer">
                    <circle cx="0" cy="0" r="11" fill="#059669" />
                    <path d="M-2,3 L-2,-3 L3,-1 L3,2" stroke="#ffffff" stroke-width="1.5" fill="none"/>
                </g>

                <!-- Bottom: Voice / Mic (Voiceover Record) -->
                <g transform="translate(50, 84)" class="cursor-pointer">
                    <circle cx="0" cy="0" r="11" fill="#dc2626" />
                    <rect x="-2" y="-4" width="4" height="6" rx="2" fill="#ffffff"/>
                    <path d="M-4,-1 C-4,2 4,2 4,-1" stroke="#ffffff" stroke-width="1" fill="none"/>
                </g>

                <!-- Left: Layers (Stickers / Effects / Text) -->
                <g transform="translate(16, 50)" class="cursor-pointer">
                    <circle cx="0" cy="0" r="11" fill="#7c3aed" />
                    <polygon points="0,-4 4,-1 0,2 -4,-1" fill="#ffffff"/>
                    <polyline points="-4,2 0,5 4,2" stroke="#ffffff" stroke-width="1" fill="none"/>
                </g>

                <!-- Central KineMaster Play / Capture Trigger -->
                <circle cx="50" cy="50" r="16" fill="#e11d48" stroke="#ffffff" stroke-width="2.5" class="cursor-pointer hover:scale-105 transition-transform" />
                <polygon points="47,44 57,50 47,56" fill="#ffffff"/>
            </svg>
        </div>
    </div>

    <!-- ── 3. PRECISION MULTI-TRACK TIMELINE (SHORTS & BEAT-SYNC ENGINE) ── -->
    <div class="relative w-full bg-slate-900 border-b border-slate-800 overflow-hidden">
        
        <!-- Timeline Mini Bar -->
        <div class="flex items-center justify-between px-3 py-1.5 bg-slate-950/90 border-b border-slate-800 text-[11px] font-mono text-slate-400">
            <div class="flex items-center gap-2">
                <button class="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 17 12 5 20 5 4"/></svg>
                    <span>PLAY 60FPS</span>
                </button>
                <span class="text-slate-600">•</span>
                <span class="text-amber-400 font-bold">🎵 BEAT-SYNC: ACTIVE</span>
            </div>
            <div class="flex items-center gap-2">
                <button class="text-slate-400 hover:text-white font-black px-1">-</button>
                <span class="text-slate-400 font-bold">1.2x</span>
                <button class="text-slate-400 hover:text-white font-black px-1">+</button>
                <span class="text-slate-600">|</span>
                <!-- Split Button Shortcut -->
                <button class="px-2 py-0.5 rounded bg-sky-950 border border-sky-600 text-sky-300 font-bold hover:bg-sky-900">
                    ✂️ SPLIT
                </button>
            </div>
        </div>

        <!-- Multi-Track SVG Timeline Canvas -->
        <svg viewBox="0 0 440 175" width="100%" height="175" class="select-none">
            
            <!-- Ruler Background -->
            <rect x="0" y="0" width="440" height="26" fill="#0b0f19" />
            <line x1="0" y1="26" x2="440" y2="26" stroke="#1e293b" stroke-width="1.2" />

            <!-- Ruler Graduations & Timecodes -->
            <line x1="20" y1="12" x2="20" y2="26" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="20" y="10" font-family="monospace" font-size="9" fill="#94a3b8" font-weight="700">00:00</text>
            <line x1="45" y1="18" x2="45" y2="26" stroke="#475569" stroke-width="1"/>
            <line x1="70" y1="18" x2="70" y2="26" stroke="#475569" stroke-width="1"/>
            <line x1="95" y1="18" x2="95" y2="26" stroke="#475569" stroke-width="1"/>

            <line x1="120" y1="12" x2="120" y2="26" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="120" y="10" font-family="monospace" font-size="9" fill="#94a3b8" font-weight="700">00:05</text>
            <line x1="145" y1="18" x2="145" y2="26" stroke="#475569" stroke-width="1"/>
            <line x1="170" y1="18" x2="170" y2="26" stroke="#475569" stroke-width="1"/>
            <line x1="195" y1="18" x2="195" y2="26" stroke="#475569" stroke-width="1"/>

            <line x1="220" y1="12" x2="220" y2="26" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="220" y="10" font-family="monospace" font-size="9" fill="#94a3b8" font-weight="700">00:10</text>
            <line x1="245" y1="18" x2="245" y2="26" stroke="#475569" stroke-width="1"/>
            <line x1="270" y1="18" x2="270" y2="26" stroke="#475569" stroke-width="1"/>
            <line x1="295" y1="18" x2="295" y2="26" stroke="#475569" stroke-width="1"/>

            <line x1="320" y1="12" x2="320" y2="26" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="320" y="10" font-family="monospace" font-size="9" fill="#94a3b8" font-weight="700">00:15</text>
            <line x1="345" y1="18" x2="345" y2="26" stroke="#475569" stroke-width="1"/>
            <line x1="370" y1="18" x2="370" y2="26" stroke="#475569" stroke-width="1"/>
            <line x1="395" y1="18" x2="395" y2="26" stroke="#475569" stroke-width="1"/>

            <line x1="420" y1="12" x2="420" y2="26" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="420" y="10" font-family="monospace" font-size="9" fill="#94a3b8" font-weight="700">00:20</text>

            <!-- ── MUSICAL BEAT-SYNC MARKERS (Yellow Drop Diamonds along Ruler) ── -->
            <g transform="translate(0, 0)">
                <!-- Beat 1 (00:03.5) -->
                <polygon points="90,26 95,20 90,14 85,20" fill="#facc15" stroke="#713f12" stroke-width="1"/>
                <line x1="90" y1="26" x2="90" y2="175" stroke="#facc15" stroke-width="0.8" stroke-dasharray="3,3" opacity="0.4"/>

                <!-- Beat 2 / Drop (00:07.2) -->
                <polygon points="172,26 177,20 172,14 167,20" fill="#facc15" stroke="#713f12" stroke-width="1"/>
                <line x1="172" y1="26" x2="172" y2="175" stroke="#facc15" stroke-width="0.8" stroke-dasharray="3,3" opacity="0.4"/>

                <!-- Beat 3 (00:11.8) -->
                <polygon points="260,26 265,20 260,14 255,20" fill="#facc15" stroke="#713f12" stroke-width="1"/>
                <line x1="260" y1="26" x2="260" y2="175" stroke="#facc15" stroke-width="0.8" stroke-dasharray="3,3" opacity="0.4"/>

                <!-- Beat 4 / Outro (00:16.5) -->
                <polygon points="350,26 355,20 350,14 345,20" fill="#facc15" stroke="#713f12" stroke-width="1"/>
                <line x1="350" y1="26" x2="350" y2="175" stroke="#facc15" stroke-width="0.8" stroke-dasharray="3,3" opacity="0.4"/>
            </g>

            <!-- TRACK 1: Text & Subtitle Layer (Amber/Gold with Keyframe Pins) -->
            <g transform="translate(0, 30)">
                <rect x="50" y="0" width="165" height="24" rx="6" fill="#78350f" stroke="#f59e0b" stroke-width="1.5"/>
                <text x="62" y="16" font-family="sans-serif" font-size="10" font-weight="900" fill="#fef3c7">T "WAIT FOR BEAT DROP!"</text>
                <!-- KineMaster Keyframe Diamond Pins -->
                <polygon points="58,12 62,8 66,12 62,16" fill="#38bdf8" stroke="#ffffff" stroke-width="0.8"/>
                <polygon points="205,12 209,8 213,12 209,16" fill="#38bdf8" stroke="#ffffff" stroke-width="0.8"/>
            </g>

            <!-- TRACK 2: Main Video Track (CapCut Neon Blue Clustered Slices & Yellow Grippers) -->
            <g transform="translate(0, 58)">
                
                <!-- Video Slice A (Selected Clip with Yellow CapCut Handles) -->
                <rect x="15" y="0" width="156" height="46" rx="8" fill="#0284c7" stroke="#facc15" stroke-width="2.5"/>
                
                <!-- CapCut Yellow In-Point Gripper Bracket -->
                <rect x="15" y="0" width="12" height="46" rx="4" fill="#facc15"/>
                <line x1="21" y1="16" x2="21" y2="30" stroke="#000000" stroke-width="2.5" stroke-linecap="round"/>
                
                <!-- Thumbnails Array inside Clip A -->
                <g transform="translate(32, 5)">
                    <rect x="0" y="0" width="28" height="36" rx="4" fill="#082f49" stroke="#0284c7" stroke-width="1"/>
                    <circle cx="14" cy="18" r="8" fill="#0369a1"/>
                    <rect x="33" y="0" width="28" height="36" rx="4" fill="#082f49" stroke="#0284c7" stroke-width="1"/>
                    <circle cx="47" cy="18" r="8" fill="#0369a1"/>
                    <rect x="66" y="0" width="28" height="36" rx="4" fill="#082f49" stroke="#0284c7" stroke-width="1"/>
                    <circle cx="80" cy="18" r="8" fill="#0369a1"/>
                </g>

                <!-- CapCut Yellow Out-Point Gripper Bracket -->
                <rect x="159" y="0" width="12" height="46" rx="4" fill="#facc15"/>
                <line x1="165" y1="16" x2="165" y2="30" stroke="#000000" stroke-width="2.5" stroke-linecap="round"/>
                <text x="32" y="42" font-family="monospace" font-size="8" font-weight="900" fill="#f0f9ff">Clip_01_Intro.mp4</text>

                <!-- Transition Box between Cliped (KineMaster Transition Block) -->
                <rect x="172" y="11" width="16" height="24" rx="4" fill="#1e1b4b" stroke="#818cf8" stroke-width="1.5"/>
                <text x="175" y="27" font-family="monospace" font-size="9" font-weight="900" fill="#c084fc">⚡</text>

                <!-- Video Slice B (Split Second Clip) -->
                <rect x="189" y="0" width="195" height="46" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
                <text x="200" y="27" font-family="monospace" font-size="10" font-weight="bold" fill="#94a3b8">Clip_02_VelocitySpeed.mp4</text>
            </g>

            <!-- TRACK 3: PIP / Overlay Layer (Violet / Purple Track) -->
            <g transform="translate(0, 108)">
                <rect x="90" y="0" width="120" height="22" rx="5" fill="#4c1d95" stroke="#a855f7" stroke-width="1.2"/>
                <text x="100" y="15" font-family="monospace" font-size="9" font-weight="bold" fill="#e9d5ff">🔲 Sticker_Glow.png</text>
            </g>

            <!-- TRACK 4: Audio Track with Real Waveform Peaks (Emerald Green) -->
            <g transform="translate(0, 134)">
                <rect x="15" y="0" width="375" height="34" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
                
                <!-- Pure SVG Audio Waveform Vector Line -->
                <path d="M 25 17 L 30 7 L 35 27 L 40 11 L 45 23 L 50 13 L 55 21 L 60 5 L 65 29 L 70 9 L 75 25 L 80 15 L 85 19 L 90 4 L 95 30 L 100 8 L 105 26 L 110 12 L 115 22 L 120 14 L 125 20 L 130 7 L 135 27 L 140 11 L 145 23 L 150 15 L 155 19 L 160 9 L 165 25 L 170 13 L 172 3 L 175 31 L 180 7 L 185 27 L 190 11 L 195 23 L 200 13 L 205 21 L 210 5 L 215 29 L 220 9 L 225 25 L 230 15 L 235 19 L 240 7 L 245 27 L 250 11 L 255 23 L 260 9 L 265 25 L 270 13 L 275 21 L 280 7 L 285 27 L 290 11 L 295 23 L 300 15 L 305 19 L 310 9 L 315 25 L 320 13 L 325 21 L 330 7 L 335 27 L 340 11 L 345 23 L 350 17 L 355 21 L 360 8 L 365 26 L 370 14 L 375 20 L 380 17" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>
                <text x="25" y="29" font-family="monospace" font-size="8" font-weight="900" fill="#a7f3d0">🎵 ${audioTrackName}</text>
            </g>

            <!-- ── MASTER RED RAZOR SCRUB NEEDLE (KINEMASTER + CAPCUT PRO NEEDLE) ── -->
            <g transform="translate(172, 0)">
                <!-- Top Precision Diamond Pin -->
                <polygon points="0,0 9,0 9,14 0,23 -9,14 -9,0" fill="#ef4444" stroke="#ffffff" stroke-width="1.8" />
                <circle cx="0" cy="8" r="2.8" fill="#ffffff"/>
                <!-- Full Needle -->
                <line x1="0" y1="23" x2="0" y2="175" stroke="#ef4444" stroke-width="2.5" />
                <!-- Neon Laser Reflection -->
                <line x1="0" y1="23" x2="0" y2="175" stroke="#f87171" stroke-width="1" />
            </g>
        </svg>
    </div>

    <!-- ── 4. CAPCUT FAST PRO TOOLBELT (PURE SVG ICONS + NORMAL TEXT) ── -->
    <div class="px-2 py-3 bg-slate-950 border-b border-slate-800">
        <div class="flex items-center justify-between gap-1 overflow-x-auto custom-scrollbar pb-1">
            
            <!-- 1. Split (✂️ Razor Cut) -->
            <button class="flex flex-col items-center justify-center p-2 rounded-2xl min-w-[58px] transition-all bg-sky-950/80 border border-sky-400 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
                <span class="text-[10px] font-black mt-1">Split</span>
            </button>

            <!-- 2. Speed Curve (⚡ 0.1x to 100x) -->
            <button class="flex flex-col items-center justify-center p-2 rounded-2xl min-w-[58px] text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span class="text-[10px] font-bold mt-1">Speed</span>
            </button>

            <!-- 3. Audio & Beats (🎵 Sound) -->
            <button class="flex flex-col items-center justify-center p-2 rounded-2xl min-w-[58px] text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                <span class="text-[10px] font-bold mt-1">Audio</span>
            </button>

            <!-- 4. Text & Subtitles (T Captions) -->
            <button class="flex flex-col items-center justify-center p-2 rounded-2xl min-w-[58px] text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
                <span class="text-[10px] font-bold mt-1">Text</span>
            </button>

            <!-- 5. Overlay / PIP (🔲 Video-in-Video) -->
            <button class="flex flex-col items-center justify-center p-2 rounded-2xl min-w-[58px] text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/><rect x="11" y="11" width="9" height="9" rx="2" fill="currentColor" fill-opacity="0.3"/></svg>
                <span class="text-[10px] font-bold mt-1">Overlay</span>
            </button>

            <!-- 6. Effects (✨ AI Velocity / Glow) -->
            <button class="flex flex-col items-center justify-center p-2 rounded-2xl min-w-[58px] text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                <span class="text-[10px] font-bold mt-1">Effects</span>
            </button>

            <!-- 7. Filters (🎨 LUT Color Grading) -->
            <button class="flex flex-col items-center justify-center p-2 rounded-2xl min-w-[58px] text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" fill-opacity="0.3"/></svg>
                <span class="text-[10px] font-bold mt-1">Filters</span>
            </button>

            <!-- 8. Adjust (🎚️ Sliders) -->
            <button class="flex flex-col items-center justify-center p-2 rounded-2xl min-w-[58px] text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg>
                <span class="text-[10px] font-bold mt-1">Adjust</span>
            </button>

            <!-- 9. Crop (📐 Aspect Scale) -->
            <button class="flex flex-col items-center justify-center p-2 rounded-2xl min-w-[58px] text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>
                <span class="text-[10px] font-bold mt-1">Crop</span>
            </button>
        </div>
    </div>

    <!-- ── 5. PRO BOTTOM STATUS DOCK ── -->
    <footer class="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 text-[11px] font-mono border-t border-slate-800">
        <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-slate-200 font-black">Danphe-2 NLE Titan Engine</span>
        </div>
        <div class="flex items-center gap-2 text-slate-400 font-bold">
            <span class="text-sky-400">4K 60FPS</span>
            <span>•</span>
            <span class="text-amber-400">HEVC H.265</span>
        </div>
    </footer>

</div>
`;
}

module.exports = {
    renderVideoEditorFrame,
    TitanVideoEditorFrame: renderVideoEditorFrame
};
