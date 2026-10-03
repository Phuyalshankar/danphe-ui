'use strict';

/**
 * 🎬 TitanVideoEditorFrame (danphe-ui)
 * Dual Top-to-Bottom Vertical Rails Architecture (Shorts/Reels 9:16 Target)
 * ══════════════════════════════════════════════════════════════════════════
 * - NO ROTARY WHEEL (Replaced by sleek Ergonomic Top-to-Bottom Vertical Rails)
 * - LEFT VERTICAL RAIL: Quick Actions (Split, Delete, Keyframe, Undo, Redo, Magnet)
 * - RIGHT VERTICAL RAIL: Creative Studio (Filters, Speed, Audio, Text, Overlay, Effects, Adjust)
 * - CENTER: Clean 9:16 Shorts Cinema Viewport with Safe-Zone & Timecode
 * - BOTTOM: Precision Multi-Track Timeline with Musical Beat Pins & Pure SVG Waveforms
 * - 100% Pure Vector SVG + Normal Text Architecture
 */

function renderVideoEditorFrame(options = {}) {
    const {
        id = 'titan-video-editor-frame',
        title = 'Viral_Shorts_Edit.mp4',
        currentTime = '00:06:20',
        totalDuration = '00:54:00',
        aspectRatio = '9:16',
        activeTool = 'split',
        resolution = '4K UHD',
        audioTrackName = 'Bass_Drop_Sync.mp3',
        className = ''
    } = options;

    return `
<div id="${id}" class="titan-video-editor-container flex flex-col w-full max-w-[440px] mx-auto bg-slate-950 text-slate-100 rounded-[32px] overflow-hidden border border-slate-800 shadow-[0_30px_80px_rgba(0,0,0,0.98)] font-sans select-none ${className}">

    <!-- ── 1. COMPACT TOP HEADER & 4K EXPORT BAR ── -->
    <header class="flex items-center justify-between px-4 py-2.5 bg-slate-900/95 border-b border-slate-800">
        <div class="flex items-center gap-2">
            <button class="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div class="flex flex-col">
                <div class="flex items-center gap-1.5">
                    <span class="text-xs font-bold text-white tracking-wide truncate max-w-[130px]">${title}</span>
                    <span class="px-1.5 py-0.2 rounded bg-rose-950 border border-rose-500 text-rose-300 text-[8px] font-mono font-black">9:16</span>
                </div>
            </div>
        </div>

        <div class="flex items-center gap-1.5">
            <!-- 4K UHD Badge -->
            <span class="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/80 text-[9px] font-mono font-black text-amber-300">
                👑 ${resolution}
            </span>

            <!-- Fast Hardware Export Button -->
            <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition active:scale-95">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>EXPORT</span>
            </button>
        </div>
    </header>

    <!-- ── 2. DUAL VERTICAL RAILS + CENTER SHORTS MONITOR ── -->
    <div class="relative w-full flex items-stretch bg-slate-950 p-2 gap-2 border-b border-slate-800">
        
        <!-- ◀ LEFT VERTICAL TOOLBAR (Top-to-Bottom: Precision & Edits) -->
        <aside class="flex flex-col items-center justify-between w-10 py-1 px-0.5 bg-slate-900/90 rounded-2xl border border-slate-800 shrink-0 shadow-lg">
            
            <!-- 1. Split (✂️) -->
            <button title="Split Clip (C)" class="w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-sky-950 border border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.35)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
            </button>

            <!-- 2. Delete Segment (🗑️) -->
            <button title="Delete (Del)" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>

            <!-- 3. Keyframe Pin (◆) -->
            <button title="Add Keyframe (K)" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-purple-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 12 12 22 2 12 12 2"/></svg>
            </button>

            <!-- 4. Snapping Magnet (🧲) -->
            <button title="Magnet Snapping (S)" class="w-8 h-8 rounded-xl flex items-center justify-center text-emerald-400 bg-emerald-950/60 border border-emerald-600/60 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v7a6 6 0 0 0 12 0V3"/><line x1="4" y1="7" x2="8" y2="7"/><line x1="16" y1="7" x2="20" y2="7"/></svg>
            </button>

            <!-- 5. Undo (↺) -->
            <button title="Undo (Ctrl+Z)" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            </button>

            <!-- 6. Redo (↻) -->
            <button title="Redo (Ctrl+Y)" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            </button>

        </aside>

        <!-- ⬛ CENTER VIDEO MONITOR (Shorts 9:16 Viewport with Clean Letterbox) -->
        <main class="relative flex-1 bg-black rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-2">
            
            <svg viewBox="0 0 240 320" width="100%" height="100%" class="rounded-xl overflow-hidden shadow-2xl">
                <defs>
                    <linearGradient id="${id}-scr-bg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#020617"/>
                        <stop offset="60%" stop-color="#0b1120"/>
                        <stop offset="100%" stop-color="#1e1b4b"/>
                    </linearGradient>
                </defs>

                <!-- Monitor Background -->
                <rect width="240" height="320" fill="url(#${id}-scr-bg)"/>

                ${aspectRatio === '16:9' ? `
                <!-- 16:9 LANDSCAPE CINEMA MONITOR (224 x 126 Centered) -->
                <rect x="8" y="94" width="224" height="126" rx="10" fill="#090d16" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.8"/>
                <rect x="18" y="104" width="204" height="106" rx="6" fill="none" stroke="#facc15" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.4"/>
                <text x="25" y="118" font-family="monospace" font-size="7" font-weight="900" fill="#facc15" opacity="0.8">16:9 CINEMA SAFE ZONE</text>
                
                <!-- Landscape Center Subject Graphic -->
                <g transform="translate(120, 157)">
                    <ellipse cx="0" cy="0" rx="42" ry="26" fill="#1e1b4b" stroke="#a855f7" stroke-width="1.8"/>
                    <polygon points="-6,-8 8,0 -6,8" fill="#38bdf8"/>
                </g>
                <text x="120" y="195" font-family="sans-serif" font-size="8" font-weight="900" fill="#38bdf8" text-anchor="middle" letter-spacing="0.5">
                    🎬 16:9 WIDESCREEN YOUTUBE (320px Wide Letterbox)
                </text>
                ` : (aspectRatio === '1:1' ? `
                <!-- 1:1 SQUARE MONITOR (190 x 190 Centered) -->
                <rect x="25" y="65" width="190" height="190" rx="12" fill="#090d16" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.8"/>
                <text x="35" y="80" font-family="monospace" font-size="7" font-weight="900" fill="#facc15" opacity="0.8">1:1 SQUARE POST</text>
                <g transform="translate(120, 160)">
                    <circle cx="0" cy="0" r="38" fill="#1e1b4b" stroke="#a855f7" stroke-width="1.8"/>
                    <polygon points="-6,-8 8,0 -6,8" fill="#38bdf8"/>
                </g>
                ` : `
                <!-- 9:16 PORTRAIT SHORTS MONITOR (170 x 300 Centered) -->
                <rect x="35" y="10" width="170" height="300" rx="14" fill="#090d16" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.8"/>
                <rect x="44" y="24" width="152" height="240" rx="8" fill="none" stroke="#facc15" stroke-width="1" stroke-dasharray="5,4" opacity="0.5"/>
                <text x="49" y="36" font-family="monospace" font-size="7" font-weight="900" fill="#facc15" opacity="0.8">SHORTS SAFE ZONE</text>

                <!-- Cinematic Subject Preview Graphic -->
                <g transform="translate(120, 150)">
                    <circle cx="0" cy="0" r="48" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="10,6" opacity="0.8"/>
                    <circle cx="0" cy="0" r="34" fill="#1e1b4b" stroke="#a855f7" stroke-width="2"/>
                    <polygon points="-6,-10 10,0 -6,10" fill="#38bdf8"/>
                </g>

                <rect x="46" y="235" width="148" height="22" rx="6" fill="#000000" fill-opacity="0.8" stroke="#facc15" stroke-width="1.2"/>
                <text x="120" y="250" font-family="sans-serif" font-size="8.5" font-weight="900" fill="#facc15" text-anchor="middle" letter-spacing="0.5">
                    ⚡ VIRAL VELOCITY BEAT 🎧
                </text>
                `)}
            </svg>

            <!-- Bottom Floating Timecode Pill -->
            <div class="absolute bottom-4 left-4 px-2.5 py-0.5 bg-black/80 backdrop-blur-md rounded-lg border border-slate-700 font-mono text-[10px] font-bold text-sky-300">
                <span>${currentTime}</span> <span class="text-slate-600">/</span> <span class="text-slate-400">${totalDuration}</span>
            </div>

            <!-- Fullscreen Button -->
            <button class="absolute bottom-4 right-4 p-1 bg-black/80 hover:bg-slate-800 backdrop-blur-md rounded-lg border border-slate-700 text-slate-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
            </button>
        </main>

        <!-- ▶ RIGHT VERTICAL TOOLBAR (Top-to-Bottom: Creative Tools) -->
        <aside class="flex flex-col items-center justify-between w-10 py-1 px-0.5 bg-slate-900/90 rounded-2xl border border-slate-800 shrink-0 shadow-lg">
            
            <!-- 1. Filters (🎨) -->
            <button title="Filters & LUTs" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-pink-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" fill-opacity="0.3"/></svg>
            </button>

            <!-- 2. Speed (⚡ Curve) -->
            <button title="Speed & Velocity" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </button>

            <!-- 3. Audio (🎵 Beat Sync) -->
            <button title="Audio & Music" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            </button>

            <!-- 4. Text & Subtitles (T) -->
            <button title="Auto Captions / Text" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-yellow-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
            </button>

            <!-- 5. Overlay / PIP (🔲) -->
            <button title="Overlay Picture-in-Picture" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/><rect x="11" y="11" width="9" height="9" rx="2" fill="currentColor" fill-opacity="0.3"/></svg>
            </button>

            <!-- 6. Effects (✨ AI Glow) -->
            <button title="Special Effects" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </button>

        </aside>

    </div>

    <!-- ── 3. PRECISION MULTI-TRACK TIMELINE (SHORTS BEAT-SYNC ENGINE) ── -->
    <div class="relative w-full bg-slate-900 overflow-hidden">
        
        <!-- Timeline Status Strip -->
        <div class="flex items-center justify-between px-3 py-1 bg-slate-950/90 border-b border-slate-800 text-[10px] font-mono text-slate-400">
            <div class="flex items-center gap-2">
                <button class="flex items-center gap-1 text-emerald-400 font-bold hover:text-emerald-300">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 17 12 5 20 5 4"/></svg>
                    <span>PLAY</span>
                </button>
                <span class="text-slate-600">•</span>
                <span class="text-amber-400 font-bold">🎵 BEAT-SYNC: ON</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-slate-400">Zoom: 1.2x</span>
                <span class="text-slate-600">|</span>
                <span class="text-sky-400 font-bold">HARDWARE RENDER</span>
            </div>
        </div>

        <!-- SVG Timeline Canvas -->
        <svg viewBox="0 0 440 160" width="100%" height="160" class="select-none">
            
            <!-- Ruler Background -->
            <rect x="0" y="0" width="440" height="24" fill="#0b0f19" />
            <line x1="0" y1="24" x2="440" y2="24" stroke="#1e293b" stroke-width="1" />

            <!-- Ruler Graduations -->
            <line x1="20" y1="12" x2="20" y2="24" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="20" y="10" font-family="monospace" font-size="8" fill="#94a3b8" font-weight="700">00:00</text>
            <line x1="45" y1="18" x2="45" y2="24" stroke="#475569" stroke-width="1"/>
            <line x1="70" y1="18" x2="70" y2="24" stroke="#475569" stroke-width="1"/>
            <line x1="95" y1="18" x2="95" y2="24" stroke="#475569" stroke-width="1"/>

            <line x1="120" y1="12" x2="120" y2="24" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="120" y="10" font-family="monospace" font-size="8" fill="#94a3b8" font-weight="700">00:05</text>
            <line x1="145" y1="18" x2="145" y2="24" stroke="#475569" stroke-width="1"/>
            <line x1="170" y1="18" x2="170" y2="24" stroke="#475569" stroke-width="1"/>
            <line x1="195" y1="18" x2="195" y2="24" stroke="#475569" stroke-width="1"/>

            <line x1="220" y1="12" x2="220" y2="24" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="220" y="10" font-family="monospace" font-size="8" fill="#94a3b8" font-weight="700">00:10</text>
            <line x1="245" y1="18" x2="245" y2="24" stroke="#475569" stroke-width="1"/>
            <line x1="270" y1="18" x2="270" y2="24" stroke="#475569" stroke-width="1"/>
            <line x1="295" y1="18" x2="295" y2="24" stroke="#475569" stroke-width="1"/>

            <line x1="320" y1="12" x2="320" y2="24" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="320" y="10" font-family="monospace" font-size="8" fill="#94a3b8" font-weight="700">00:15</text>

            <!-- ── MUSICAL BEAT-SYNC DIAMONDS ── -->
            <polygon points="90,24 94,18 90,12 86,18" fill="#facc15" stroke="#713f12" stroke-width="0.8"/>
            <line x1="90" y1="24" x2="90" y2="160" stroke="#facc15" stroke-width="0.8" stroke-dasharray="3,3" opacity="0.35"/>

            <polygon points="168,24 172,18 168,12 164,18" fill="#facc15" stroke="#713f12" stroke-width="0.8"/>
            <line x1="168" y1="24" x2="168" y2="160" stroke="#facc15" stroke-width="0.8" stroke-dasharray="3,3" opacity="0.35"/>

            <polygon points="255,24 259,18 255,12 251,18" fill="#facc15" stroke="#713f12" stroke-width="0.8"/>
            <line x1="255" y1="24" x2="255" y2="160" stroke="#facc15" stroke-width="0.8" stroke-dasharray="3,3" opacity="0.35"/>

            <!-- TRACK 1: Text Subtitle Track (Yellow Gold) -->
            <g transform="translate(0, 28)">
                <rect x="45" y="0" width="165" height="22" rx="5" fill="#78350f" stroke="#f59e0b" stroke-width="1.2"/>
                <text x="56" y="15" font-family="sans-serif" font-size="9" font-weight="900" fill="#fef3c7">T "VIRAL VELOCITY BEAT"</text>
            </g>

            <!-- TRACK 2: Main Video Track (CapCut Neon Blue Slices & Yellow Handles) -->
            <g transform="translate(0, 54)">
                <!-- Slice 1 -->
                <rect x="15" y="0" width="150" height="42" rx="8" fill="#0284c7" stroke="#facc15" stroke-width="2"/>
                <rect x="15" y="0" width="10" height="42" rx="4" fill="#facc15"/>
                <rect x="155" y="0" width="10" height="42" rx="4" fill="#facc15"/>
                <!-- Thumbnails Mockup -->
                <g transform="translate(28, 4)">
                    <rect x="0" y="0" width="26" height="34" rx="3" fill="#082f49"/>
                    <rect x="30" y="0" width="26" height="34" rx="3" fill="#082f49"/>
                    <rect x="60" y="0" width="26" height="34" rx="3" fill="#082f49"/>
                </g>
                <text x="32" y="38" font-family="monospace" font-size="8" font-weight="900" fill="#f0f9ff">Clip_A.mp4</text>

                <!-- Slice 2 -->
                <rect x="170" y="0" width="200" height="42" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1.2"/>
                <text x="182" y="25" font-family="monospace" font-size="9" font-weight="bold" fill="#94a3b8">Clip_B_Shorts.mp4</text>
            </g>

            <!-- TRACK 3: Audio Waveform Track (Emerald Green) -->
            <g transform="translate(0, 100)">
                <rect x="15" y="0" width="375" height="32" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="1.2"/>
                <path d="M 25 16 L 30 6 L 35 26 L 40 10 L 45 22 L 50 12 L 55 20 L 60 4 L 65 28 L 70 8 L 75 24 L 80 14 L 85 18 L 90 6 L 95 26 L 100 10 L 105 22 L 110 8 L 115 24 L 120 12 L 125 20 L 130 6 L 135 26 L 140 10 L 145 22 L 150 14 L 155 18 L 160 8 L 165 24 L 170 12 L 175 20 L 180 6 L 185 26 L 190 10 L 195 22 L 200 12 L 205 20 L 210 4 L 215 28 L 220 8 L 225 24 L 230 14 L 235 18 L 240 6 L 245 26 L 250 10 L 255 22 L 260 8 L 265 24 L 270 12 L 275 20 L 280 6 L 285 26 L 290 10 L 295 22 L 300 14 L 305 18 L 310 8 L 315 24 L 320 12 L 325 20 L 330 6 L 335 26 L 340 10 L 345 22 L 350 16" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>
                <text x="25" y="27" font-family="monospace" font-size="8" font-weight="900" fill="#a7f3d0">🎵 ${audioTrackName}</text>
            </g>

            <!-- ── MASTER RED RAZOR SCRUB NEEDLE ── -->
            <g transform="translate(168, 0)">
                <polygon points="0,0 8,0 8,14 0,22 -8,14 -8,0" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />
                <circle cx="0" cy="8" r="2.5" fill="#ffffff"/>
                <line x1="0" y1="22" x2="0" y2="160" stroke="#ef4444" stroke-width="2.2" />
                <line x1="0" y1="22" x2="0" y2="160" stroke="#f87171" stroke-width="1" />
            </g>
        </svg>
    </div>

    <!-- ── 4. PRO BOTTOM STATUS DOCK ── -->
    <footer class="flex items-center justify-between px-4 py-2 bg-slate-950 text-[10px] font-mono border-t border-slate-800">
        <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-slate-300 font-bold">Dual Vertical Rails Layout</span>
        </div>
        <div class="flex items-center gap-2 text-slate-400">
            <span class="text-sky-400 font-bold">4K 60FPS</span>
            <span>•</span>
            <span class="text-amber-400 font-bold">MediaCodec Direct</span>
        </div>
    </footer>

</div>
`;
}

module.exports = {
    renderVideoEditorFrame,
    TitanVideoEditorFrame: renderVideoEditorFrame
};
