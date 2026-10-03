'use strict';

/**
 * 🎬 TitanVideoEditorFrame (danphe-ui)
 * Dual Scrollable Vertical Rails + Titan-Bus SISO Serial Stream Architecture
 * ══════════════════════════════════════════════════════════════════════════
 * - DUAL SCROLLABLE VERTICAL RAILS (Left: 16 Edit Tools, Right: 16 FX Tools)
 * - 256 VECTOR ICONS SUITE wired into 6-Byte SISO Serial Stream (0x5349 'SI')
 * - Media Timeline Track emits serial commands; all icons/tools update in microseconds
 * - Center 9:16 Shorts Monitor with Safe-Zone & 16:9 Cinema Aspect Switcher
 * - Multi-Track NLE Timeline with Musical Beat Sync & Pure SVG Waveforms
 */

const { renderUniversalMediaLane } = require('./TitanUniversalMediaLane');

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
<div id="${id}" class="titan-video-editor-container flex flex-col w-full max-w-[450px] mx-auto bg-slate-950 text-slate-100 rounded-[32px] overflow-hidden border border-slate-800 shadow-[0_30px_90px_rgba(0,0,0,0.98)] font-sans select-none ${className}">

    <style>
        .custom-rail-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #334155 #090d16;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-y;
        }
        .custom-rail-scrollbar::-webkit-scrollbar {
            width: 3px;
        }
        .custom-rail-scrollbar::-webkit-scrollbar-track {
            background: #090d16;
            border-radius: 4px;
        }
        .custom-rail-scrollbar::-webkit-scrollbar-thumb {
            background: #334155;
            border-radius: 4px;
        }
        .custom-rail-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #38bdf8;
        }
        .siso-pulse-glow {
            animation: sisoGlow 0.4s cubic-bezier(0, 0, 0.2, 1);
        }
        @keyframes sisoGlow {
            0% { transform: scale(0.92); box-shadow: 0 0 0 rgba(56, 189, 248, 0); }
            50% { transform: scale(1.18); box-shadow: 0 0 18px rgba(56, 189, 248, 0.9); }
            100% { transform: scale(1); }
        }
        .siso-beat-glow {
            animation: sisoBeat 0.35s ease-out;
        }
        @keyframes sisoBeat {
            0% { transform: scale(1); }
            50% { transform: scale(1.22); color: #facc15; filter: drop-shadow(0 0 10px #facc15); }
            100% { transform: scale(1); }
        }
        .anim-glitch { animation: glitchAnim 0.35s ease-in-out infinite alternate; }
        @keyframes glitchAnim {
            0% { transform: translate(0); filter: drop-shadow(0 0 0 transparent); }
            50% { transform: translate(-3px, 1.5px); filter: drop-shadow(-3px 0 #ef4444); }
            100% { transform: translate(3px, -1.5px); filter: drop-shadow(3px 0 #06b6d4); }
        }
        .anim-bounce { animation: bounceAnim 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes bounceAnim {
            0% { transform: scale(0.65); opacity: 0.6; }
            65% { transform: scale(1.15); opacity: 1; }
            100% { transform: scale(1); }
        }
        .anim-spin { animation: spinAnim 0.65s ease-out; }
        @keyframes spinAnim {
            0% { transform: rotate(0deg) scale(0.7); }
            100% { transform: rotate(360deg) scale(1); }
        }
        .anim-zoom { animation: zoomAnim 0.45s ease-out; }
        @keyframes zoomAnim {
            0% { transform: scale(1.35); opacity: 0.5; }
            100% { transform: scale(1); opacity: 1; }
        }
        .anim-drift { animation: driftAnim 0.8s ease-in-out; }
        @keyframes driftAnim {
            0% { transform: translateX(-20px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        .preset-active {
            border-color: #38bdf8 !important;
            background: #082f49 !important;
            box-shadow: 0 0 12px rgba(56, 189, 248, 0.5) !important;
        }
    </style>

    <!-- ── 1. COMPACT TOP HEADER & 4K EXPORT BAR ── -->
    <header class="flex items-center justify-between px-4 py-2.5 bg-slate-900/95 border-b border-slate-800">
        <div class="flex items-center gap-2">
            <button class="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div class="flex flex-col">
                <div class="flex items-center gap-1.5">
                    <span class="text-xs font-bold text-white tracking-wide truncate max-w-[130px]">${title}</span>
                    <span class="px-1.5 py-0.2 rounded bg-rose-950 border border-rose-500 text-rose-300 text-[8px] font-mono font-black">${aspectRatio}</span>
                </div>
            </div>
        </div>

        <div class="flex items-center gap-1.5">
            <!-- Serial SISO Bus Active Badge -->
            <span id="${id}-siso-badge" class="px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500 text-[9px] font-mono font-black text-emerald-300 flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SISO: 0x5349</span>
            </span>

            <!-- 4K UHD Badge -->
            <span class="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/80 text-[9px] font-mono font-black text-amber-300">
                👑 ${resolution}
            </span>

            <!-- Fast Hardware Export Button -->
            <button onclick="triggerSisoTool(9999, 'FastExport')" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition active:scale-95">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>EXPORT</span>
            </button>
        </div>
    </header>

    <!-- ── 2. DUAL SCROLLABLE VERTICAL RAILS + CENTER MONITOR ── -->
    <div class="relative w-full flex items-stretch bg-slate-950 p-2 gap-2 border-b border-slate-800">
        
        <!-- ◀ LEFT VERTICAL SCROLLABLE RAIL (Top-to-Bottom: 16 Precision NLE Edit Suite Tools) -->
        <aside class="flex flex-col items-center gap-2 w-11 py-2 px-1 bg-slate-900/90 rounded-2xl border border-slate-800 shrink-0 shadow-lg max-h-[330px] overflow-y-auto custom-rail-scrollbar select-none relative">
            
            <div class="sticky top-0 bg-slate-900/95 py-0.5 px-1 rounded text-[8px] font-mono text-sky-400 font-bold uppercase tracking-wider z-10">Edit</div>

            <!-- 1. Split (✂️ 1001) -->
            <button data-reg="1001" data-tool="split" onclick="triggerSisoTool(1001, 'Split')" title="Split (0x03E9)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all bg-sky-950 border border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.35)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
            </button>

            <!-- 2. Trim Left (◀✂️ 1002) -->
            <button data-reg="1002" data-tool="leftcut" onclick="triggerSisoTool(1002, 'TrimLeft')" title="Trim Left (0x03EA)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-sky-300 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
            </button>

            <!-- 3. Trim Right (✂️▶ 1003) -->
            <button data-reg="1003" data-tool="rightcut" onclick="triggerSisoTool(1003, 'TrimRight')" title="Trim Right (0x03EB)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-sky-300 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
            </button>

            <!-- 4. Delete Segment (🗑️ 1004) -->
            <button data-reg="1004" data-tool="delete" onclick="triggerSisoTool(1004, 'Delete')" title="Delete Clip (0x03EC)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>

            <!-- 5. Ripple Delete (⏩✂️ 1006) -->
            <button data-reg="1006" data-tool="rippledelete" onclick="triggerSisoTool(1006, 'RippleDelete')" title="Ripple Delete (0x03EE)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><line x1="9" y1="12" x2="15" y2="12"/></svg>
            </button>

            <!-- 6. Keyframe Pin (◆ 1007) -->
            <button data-reg="1007" data-tool="keyframe" onclick="triggerSisoTool(1007, 'Keyframe')" title="Add Keyframe (0x03EF)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-purple-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 12 12 22 2 12 12 2"/></svg>
            </button>

            <!-- 7. Slip Tool (↔️ 1005) -->
            <button data-reg="1005" data-tool="slip" onclick="triggerSisoTool(1005, 'Slip')" title="Slip Tool (0x03ED)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>

            <!-- 8. Freeze Frame (❄️ 1008) -->
            <button data-reg="1008" data-tool="freeze" onclick="triggerSisoTool(1008, 'Freeze')" title="Freeze Frame (0x03F0)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/><line x1="19.07" y1="4.93" x2="4.93" y2="19.07"/></svg>
            </button>

            <!-- 9. Snapping Magnet (🧲 1009) -->
            <button data-reg="1009" data-tool="magnet" onclick="triggerSisoTool(1009, 'Magnet')" title="Magnet Snapping (0x03F1)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-emerald-400 bg-emerald-950/60 border border-emerald-600/60 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v7a6 6 0 0 0 12 0V3"/><line x1="4" y1="7" x2="8" y2="7"/><line x1="16" y1="7" x2="20" y2="7"/></svg>
            </button>

            <!-- 10. Lock Track (🔒 1010) -->
            <button data-reg="1010" data-tool="lock" onclick="triggerSisoTool(1010, 'Lock')" title="Lock Track (0x03F2)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </button>

            <!-- 11. Duplicate Clip (📑 1013) -->
            <button data-reg="1013" data-tool="duplicate" onclick="triggerSisoTool(1013, 'Duplicate')" title="Duplicate Clip (0x03F5)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-sky-300 hover:bg-slate-800 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>

            <!-- 12. Detach Audio (📻 1014) -->
            <button data-reg="1014" data-tool="detach_audio" onclick="triggerSisoTool(1014, 'DetachAudio')" title="Detach Audio (0x03F6)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/></svg>
            </button>

            <!-- 13. Pen Masking (✒️ 1015) -->
            <button data-reg="1015" data-tool="pen_mask" onclick="triggerSisoTool(1015, 'PenMask')" title="Bezier Pen Mask (0x03F7)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-pink-400 hover:bg-slate-800 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>
            </button>

            <!-- 14. Speed Ramp (⚡ 1016) -->
            <button data-reg="1016" data-tool="speed_ramp" onclick="triggerSisoTool(1016, 'SpeedRamp')" title="Speed Ramp Curve (0x03F8)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18c3-6 6-12 18-12"/><circle cx="3" cy="18" r="2"/><circle cx="21" cy="6" r="2"/></svg>
            </button>

            <!-- 15. Undo (↺ 1011) -->
            <button data-reg="1011" data-tool="undo" onclick="triggerSisoTool(1011, 'Undo')" title="Undo (0x03F3)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-white hover:bg-slate-800 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            </button>

            <!-- 16. Redo (↻ 1012) -->
            <button data-reg="1012" data-tool="redo" onclick="triggerSisoTool(1012, 'Redo')" title="Redo (0x03F4)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-white hover:bg-slate-800 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            </button>

            <div class="text-[8px] font-mono text-slate-600 pb-1">▼ scroll</div>
        </aside>

        <!-- ⬛ CENTER VIDEO MONITOR (9:16 Shorts / 16:9 Cinema Responsive) -->
        <main class="relative flex-1 bg-black rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-2">
            
            <svg id="${id}-monitor-svg" viewBox="0 0 240 320" width="100%" height="100%" class="rounded-xl overflow-hidden shadow-2xl">
                <defs>
                    <linearGradient id="${id}-scr-bg" x1="0" y1="0" x2="1" y2="1">
                        <stop id="${id}-stop-1" offset="0%" stop-color="#020617"/>
                        <stop id="${id}-stop-2" offset="60%" stop-color="#0b1120"/>
                        <stop id="${id}-stop-3" offset="100%" stop-color="#1e1b4b"/>
                    </linearGradient>
                </defs>

                <!-- Monitor Background -->
                <rect width="240" height="320" fill="url(#${id}-scr-bg)"/>

                ${aspectRatio === '16:9' ? `
                <!-- 16:9 LANDSCAPE CINEMA MONITOR -->
                <rect x="8" y="94" width="224" height="126" rx="10" fill="#090d16" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.8"/>
                <rect x="18" y="104" width="204" height="106" rx="6" fill="none" stroke="#facc15" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.4"/>
                <text x="25" y="118" font-family="monospace" font-size="7" font-weight="900" fill="#facc15" opacity="0.8">16:9 CINEMA SAFE ZONE</text>
                
                <g id="${id}-subject-graphic" transform="translate(120, 157)">
                    <ellipse cx="0" cy="0" rx="42" ry="26" fill="#1e1b4b" stroke="#a855f7" stroke-width="1.8"/>
                    <polygon points="-6,-8 8,0 -6,8" fill="#38bdf8"/>
                </g>
                <text x="120" y="195" font-family="sans-serif" font-size="8" font-weight="900" fill="#38bdf8" text-anchor="middle" letter-spacing="0.5">
                    🎬 16:9 WIDESCREEN CINEMA
                </text>
                ` : (aspectRatio === '1:1' ? `
                <!-- 1:1 SQUARE MONITOR -->
                <rect x="25" y="65" width="190" height="190" rx="12" fill="#090d16" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.8"/>
                <text x="35" y="80" font-family="monospace" font-size="7" font-weight="900" fill="#facc15" opacity="0.8">1:1 SQUARE POST</text>
                <g id="${id}-subject-graphic" transform="translate(120, 160)">
                    <circle cx="0" cy="0" r="38" fill="#1e1b4b" stroke="#a855f7" stroke-width="1.8"/>
                    <polygon points="-6,-8 8,0 -6,8" fill="#38bdf8"/>
                </g>
                ` : `
                <!-- 9:16 PORTRAIT SHORTS MONITOR -->
                <rect x="35" y="10" width="170" height="300" rx="14" fill="#090d16" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.8"/>
                <rect x="44" y="24" width="152" height="240" rx="8" fill="none" stroke="#facc15" stroke-width="1" stroke-dasharray="5,4" opacity="0.5"/>
                <text x="49" y="36" font-family="monospace" font-size="7" font-weight="900" fill="#facc15" opacity="0.8">SHORTS SAFE ZONE</text>

                <!-- Subject Preview -->
                <g id="${id}-subject-graphic" transform="translate(120, 150)">
                    <circle cx="0" cy="0" r="48" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="10,6" opacity="0.8"/>
                    <circle cx="0" cy="0" r="34" fill="#1e1b4b" stroke="#a855f7" stroke-width="2"/>
                    <polygon points="-6,-10 10,0 -6,10" fill="#38bdf8"/>
                </g>

                <rect x="46" y="235" width="148" height="22" rx="6" fill="#000000" fill-opacity="0.8" stroke="#facc15" stroke-width="1.2"/>
                <text id="${id}-caption-text" x="120" y="250" font-family="sans-serif" font-size="8.5" font-weight="900" fill="#facc15" text-anchor="middle" letter-spacing="0.5">
                    ⚡ VIRAL VELOCITY BEAT 🎧
                </text>
                `)}
            </svg>

            <!-- Bottom Floating Timecode Pill -->
            <div class="absolute bottom-4 left-4 px-2.5 py-0.5 bg-black/80 backdrop-blur-md rounded-lg border border-slate-700 font-mono text-[10px] font-bold text-sky-300">
                <span id="${id}-tc-cur">${currentTime}</span> <span class="text-slate-600">/</span> <span class="text-slate-400">${totalDuration}</span>
            </div>

            <!-- Fullscreen Button -->
            <button onclick="triggerSisoTool(1099, 'Fullscreen')" class="absolute bottom-4 right-4 p-1 bg-black/80 hover:bg-slate-800 backdrop-blur-md rounded-lg border border-slate-700 text-slate-300 transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
            </button>
        </main>

        <!-- ▶ RIGHT VERTICAL SCROLLABLE RAIL (Top-to-Bottom: 16 Creative & AI VFX Suite Tools) -->
        <aside class="flex flex-col items-center gap-2 w-11 py-2 px-1 bg-slate-900/90 rounded-2xl border border-slate-800 shrink-0 shadow-lg max-h-[330px] overflow-y-auto custom-rail-scrollbar select-none relative">
            
            <div class="sticky top-0 bg-slate-900/95 py-0.5 px-1 rounded text-[8px] font-mono text-pink-400 font-bold uppercase tracking-wider z-10">FX</div>

            <!-- 1. Filters & LUTs (🎨 1021) -->
            <button data-reg="1021" data-tool="filters" onclick="triggerSisoTool(1021, 'LUTFilters')" title="LUT Filters (0x03FD)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-pink-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" fill-opacity="0.3"/></svg>
            </button>

            <!-- 2. Speed Curve (⚡ 1022) -->
            <button data-reg="1022" data-tool="speed" onclick="triggerSisoTool(1022, 'SpeedCurve')" title="Speed Curve (0x03FE)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </button>

            <!-- 3. Audio & Beats (🎵 1023) -->
            <button data-reg="1023" data-tool="audio" onclick="triggerSisoTool(1023, 'AudioBeats')" title="Audio & Beats (0x03FF)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-emerald-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            </button>

            <!-- 4. Text & Subtitles (T 1024) -->
            <button data-reg="1024" data-tool="text" onclick="triggerSisoTool(1024, 'TextCaptions')" title="Kinetic Captions (0x0400)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-yellow-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
            </button>

            <!-- 5. Overlay / PIP (🔲 1025) -->
            <button data-reg="1025" data-tool="overlay" onclick="triggerSisoTool(1025, 'PIPOverlay')" title="PIP Overlay (0x0401)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/><rect x="11" y="11" width="9" height="9" rx="2" fill="currentColor" fill-opacity="0.3"/></svg>
            </button>

            <!-- 6. Special AI VFX (✨ 1026) -->
            <button data-reg="1026" data-tool="effects" onclick="triggerSisoTool(1026, 'AIEffects')" title="AI VFX (0x0402)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </button>

            <!-- 7. Crop & Framing (📐 1027) -->
            <button data-reg="1027" data-tool="crop" onclick="triggerSisoTool(1027, 'CropFraming')" title="Crop & Scale (0x0403)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-white hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>
            </button>

            <!-- 8. Color Adjust OKLCH (🎚️ 1028) -->
            <button data-reg="1028" data-tool="adjust" onclick="triggerSisoTool(1028, 'ColorAdjust')" title="Color Adjust OKLCH (0x0404)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg>
            </button>

            <!-- 9. Voiceover Mic (🎙️ 1029) -->
            <button data-reg="1029" data-tool="mic" onclick="triggerSisoTool(1029, 'RecordMic')" title="Record Mic (0x0405)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
            </button>

            <!-- 10. Chroma Key (🟩 1030) -->
            <button data-reg="1030" data-tool="chroma" onclick="triggerSisoTool(1030, 'ChromaKey')" title="Green Screen Chroma (0x0406)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
            </button>

            <!-- 11. Smart Cutout (AI BG 1033) -->
            <button data-reg="1033" data-tool="smart_cutout" onclick="triggerSisoTool(1033, 'SmartCutout')" title="AI Smart Cutout (0x0409)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M19 8l2 2-2 2M15 4l-1 2 1 2"/></svg>
            </button>

            <!-- 12. Motion Tracking (🎯 1034) -->
            <button data-reg="1034" data-tool="motion_track" onclick="triggerSisoTool(1034, 'MotionTrack')" title="Motion Tracking (0x040A)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-yellow-400 hover:bg-slate-800 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            </button>

            <!-- 13. Audio Denoise (🔇 1035) -->
            <button data-reg="1035" data-tool="denoise" onclick="triggerSisoTool(1035, 'Denoise')" title="Audio AI Denoise (0x040B)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 10v4M6 6v12M10 3v18M14 8v8M18 5v14M22 10v4"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>

            <!-- 14. Neon Glow FX (🌟 1036) -->
            <button data-reg="1036" data-tool="neon_glow" onclick="triggerSisoTool(1036, 'NeonGlow')" title="Neon Cyber Glow (0x040C)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-purple-400 hover:bg-slate-800 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </button>

            <!-- 15. 3D Transitions (🔀 1037) -->
            <button data-reg="1037" data-tool="transition_3d" onclick="triggerSisoTool(1037, 'Transition3D')" title="3D Wipe Transitions (0x040D)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-teal-300 hover:bg-slate-800 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
            </button>

            <!-- 16. Reverse (🔄 1032) -->
            <button data-reg="1032" data-tool="reverse" onclick="triggerSisoTool(1032, 'ReverseVideo')" title="Reverse Video (0x0408)" class="tool-btn w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-slate-400 hover:text-sky-300 hover:bg-slate-800 transition">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/></svg>
            </button>

            <div class="text-[8px] font-mono text-slate-600 pb-1">▼ scroll</div>
        </aside>

    </div>

    <!-- ── 2.5 AUTONOMOUS SERIAL SISO PRESET STRIP (NO MANUAL BUTTONS - 100% SERIAL PORT DRIVEN) ── -->
    <div id="${id}-preset-ribbon" class="relative w-full bg-slate-900/95 border-b border-slate-800 px-3 py-2 select-none">
        <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center gap-2">
                <span id="${id}-lane-context-badge" class="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/80 text-[9px] font-mono text-amber-300 font-bold">
                    LANE: TEXT (T)
                </span>
                <span id="${id}-lane-siso-stream" class="text-[8px] font-mono text-emerald-400 font-bold">
                    SISO: 0x5349 [0x4130: 3]
                </span>
            </div>
            <span class="text-[8px] font-mono text-slate-500">← Serial Presets (Slide Live) →</span>
        </div>

        <!-- Horizontal Slide Track (Populated Autonomously by Serial Port) -->
        <div id="${id}-preset-track" class="flex items-center gap-2 overflow-x-auto py-1 px-0.5 custom-rail-scrollbar" style="scrollbar-width: thin;">
            <!-- Serial Port Dynamically Injects Exactly What the Active Lane Demands -->
            <div onclick="applyLivePreset('fonts', 1, 'नेपाली कला')" class="preset-card shrink-0 flex flex-col items-center justify-center w-16 h-12 rounded-xl bg-slate-950 border border-sky-400/80 p-1 cursor-pointer hover:border-sky-300 transition group shadow-md shadow-sky-950/50">
                <span class="text-xs font-serif font-black text-amber-300 group-hover:scale-110 transition">नेपाली</span>
                <span class="text-[8px] font-mono text-slate-400 mt-0.5">कलिग्राफी</span>
            </div>
            <div onclick="applyLivePreset('fonts', 2, 'CYBER NEON')" class="preset-card shrink-0 flex flex-col items-center justify-center w-16 h-12 rounded-xl bg-slate-950 border border-slate-800 p-1 cursor-pointer hover:border-cyan-400 transition group">
                <span class="text-[11px] font-mono font-black text-cyan-400 group-hover:scale-110 transition">CYBER</span>
                <span class="text-[8px] font-mono text-slate-400 mt-0.5">नियन</span>
            </div>
            <div onclick="applyLivePreset('fonts', 3, 'CINEMA BOLD')" class="preset-card shrink-0 flex flex-col items-center justify-center w-16 h-12 rounded-xl bg-slate-950 border border-slate-800 p-1 cursor-pointer hover:border-amber-400 transition group">
                <span class="text-xs font-sans font-black text-white group-hover:scale-110 transition tracking-wider">BOLD</span>
                <span class="text-[8px] font-mono text-slate-400 mt-0.5">सिनेमा</span>
            </div>
            <div onclick="applyLivePreset('fonts', 4, 'TYPEWRITER')" class="preset-card shrink-0 flex flex-col items-center justify-center w-16 h-12 rounded-xl bg-slate-950 border border-slate-800 p-1 cursor-pointer hover:border-emerald-400 transition group">
                <span class="text-[11px] font-mono font-bold text-emerald-300 group-hover:scale-110 transition">_MONO</span>
                <span class="text-[8px] font-mono text-slate-400 mt-0.5">टाइपराइटर</span>
            </div>
            <div onclick="applyLivePreset('fonts', 5, 'ROYAL GOLD')" class="preset-card shrink-0 flex flex-col items-center justify-center w-16 h-12 rounded-xl bg-slate-950 border border-slate-800 p-1 cursor-pointer hover:border-yellow-400 transition group">
                <span class="text-xs font-serif font-black text-yellow-400 group-hover:scale-110 transition italic">Royal</span>
                <span class="text-[8px] font-mono text-slate-400 mt-0.5">शाही गोल्ड</span>
            </div>
            <div onclick="applyLivePreset('fonts', 6, 'STREET GRAFFITI')" class="preset-card shrink-0 flex flex-col items-center justify-center w-16 h-12 rounded-xl bg-slate-950 border border-slate-800 p-1 cursor-pointer hover:border-rose-400 transition group">
                <span class="text-xs font-sans font-black text-rose-400 group-hover:scale-110 transition tracking-tight">STREET</span>
                <span class="text-[8px] font-mono text-slate-400 mt-0.5">भित्ते कला</span>
            </div>
            <div onclick="applyLivePreset('fonts', 7, 'HANDWRITING')" class="preset-card shrink-0 flex flex-col items-center justify-center w-16 h-12 rounded-xl bg-slate-950 border border-slate-800 p-1 cursor-pointer hover:border-purple-400 transition group">
                <span class="text-xs italic font-medium text-purple-300 group-hover:scale-110 transition">Brush</span>
                <span class="text-[8px] font-mono text-slate-400 mt-0.5">ह्यान्डराइटिङ</span>
            </div>
        </div>
    </div>

    <!-- ── 3. PRECISION MULTI-TRACK TIMELINE (CONNECTED TO SERIAL SISO SCRUBBER) ── -->
    <div class="relative w-full bg-slate-900 overflow-hidden">
        
        <!-- Timeline Status Strip -->
        <div class="flex items-center justify-between px-3 py-1 bg-slate-950/90 border-b border-slate-800 text-[10px] font-mono text-slate-400">
            <div class="flex items-center gap-2">
                <button id="${id}-play-btn" onclick="togglePlayback()" class="flex items-center gap-1 text-emerald-400 font-bold hover:text-emerald-300 transition">
                    <svg id="${id}-play-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 17 12 5 20 5 4"/></svg>
                    <span id="${id}-play-label">PLAY</span>
                </button>
                <span class="text-slate-600">•</span>
                <span class="text-amber-400 font-bold">🎵 BEAT-SYNC: ON</span>
            </div>
            <div class="flex items-center gap-2">
                <span id="${id}-siso-last-cmd" class="text-emerald-400 font-mono">SISO: IDLE (0x5349)</span>
                <span class="text-slate-600">|</span>
                <span class="text-sky-400 font-bold">HARDWARE 4K</span>
            </div>
        </div>

        <!-- SVG Timeline Canvas with Interactive Playhead Drag -->
        <div class="relative w-full overflow-x-auto custom-rail-scrollbar">
            <svg id="${id}-timeline-svg" onmousedown="startTimelineDrag(event)" onmousemove="onTimelineScrub(event)" onmouseup="stopTimelineDrag(event)" ontouchstart="startTimelineDrag(event)" ontouchmove="onTimelineScrub(event)" ontouchend="stopTimelineDrag(event)" onclick="onTimelineScrub(event)" viewBox="0 0 440 160" width="100%" height="160" class="select-none cursor-ew-resize">
                
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

                <!-- TRACK 1: Text Subtitle Lane (Imperial Gold) -->
                <g id="${id}-track-text" onclick="onSerialLaneSelect('text', 3, event)" class="cursor-pointer" transform="translate(0, 26)">
                    ${renderUniversalMediaLane({
                        id: `${id}-lane-text`,
                        type: 'text',
                        x: 45,
                        y: 0,
                        width: 170,
                        height: 24,
                        clipTitle: 'VIRAL VELOCITY BEAT',
                        durationSec: 6.5,
                        isSelected: false,
                        reg: 1024
                    })}
                </g>

                <!-- TRACK 2: Main Video Track (Electric Sky Blue + Embedded Audio Waveform & Extract Feature) -->
                <g id="${id}-track-video" onclick="onSerialLaneSelect('video', 1, event)" class="cursor-pointer" transform="translate(0, 52)">
                    <!-- Slice 1 with Embedded Audio Waveform -->
                    ${renderUniversalMediaLane({
                        id: `${id}-clip-1`,
                        type: 'video',
                        x: 15,
                        y: 0,
                        width: 150,
                        height: 44,
                        clipTitle: 'Clip_A.mp4',
                        hasEmbeddedAudio: true,
                        durationSec: 5.2,
                        isSelected: true,
                        reg: 1001
                    })}

                    <!-- Slice 2 -->
                    ${renderUniversalMediaLane({
                        id: `${id}-clip-2`,
                        type: 'video',
                        x: 170,
                        y: 0,
                        width: 200,
                        height: 44,
                        clipTitle: 'Clip_B_Shorts.mp4',
                        hasEmbeddedAudio: true,
                        durationSec: 7.3,
                        isSelected: false,
                        reg: 1001
                    })}
                </g>

                <!-- TRACK 3: Dedicated Audio Track (Emerald Green Pure SVG Waveform) -->
                <g id="${id}-track-audio" onclick="onSerialLaneSelect('audio', 2, event)" class="cursor-pointer" transform="translate(0, 102)">
                    ${renderUniversalMediaLane({
                        id: `${id}-lane-audio`,
                        type: 'audio',
                        x: 15,
                        y: 0,
                        width: 375,
                        height: 32,
                        clipTitle: audioTrackName,
                        durationSec: 15.0,
                        isSelected: false,
                        reg: 1023
                    })}
                </g>

                <!-- ── MASTER RED RAZOR SCRUB NEEDLE (INTERACTIVE) ── -->
                <g id="${id}-needle-group" transform="translate(168, 0)">
                    <polygon points="0,0 8,0 8,14 0,22 -8,14 -8,0" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />
                    <circle cx="0" cy="8" r="2.5" fill="#ffffff"/>
                    <line x1="0" y1="22" x2="0" y2="160" stroke="#ef4444" stroke-width="2.2" />
                    <line x1="0" y1="22" x2="0" y2="160" stroke="#f87171" stroke-width="1" />
                </g>
            </svg>
        </div>
    </div>

    <!-- ── 4. PRO BOTTOM STATUS DOCK ── -->
    <footer class="flex items-center justify-between px-4 py-2 bg-slate-950 text-[10px] font-mono border-t border-slate-800">
        <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-slate-300 font-bold">Dual Scrollable Rails (32 Tools) • 256 SISO Mesh</span>
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
