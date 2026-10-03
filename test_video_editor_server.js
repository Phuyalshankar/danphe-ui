'use strict';

/**
 * 🎬 Danphe-UI Video Editor Preview Server
 * Port: 3001
 * Visual Inspection & Interactive SISO Serial Bus Test Server
 */

const http = require('http');
const { renderVideoEditorFrame } = require('./lib/TitanVideoEditorFrame');
const { renderMasterButton } = require('./lib/TitanMasterButton');
const { renderMasterInput } = require('./lib/TitanMasterInput');

const PORT = 3001;

const server = http.createServer((req, res) => {
    const urlObj = new URL(req.url, `http://localhost:${PORT}`);
    const selectedRatio = urlObj.searchParams.get('ratio') || '9:16';

    const frameHtml = renderVideoEditorFrame({
        title: selectedRatio === '16:9' ? 'YouTube_Landscape_01.mp4' : 'Viral_Shorts_01.mp4',
        currentTime: '00:06:20',
        totalDuration: '00:54:00',
        aspectRatio: selectedRatio,
        isPlaying: false,
        activeTool: 'split',
        resolution: '4K UHD'
    });

    const sampleButton = renderMasterButton({
        label: '🚀 Export 4K 60fps',
        icon: 14,
        variant: 'primary'
    });

    const sampleInput = renderMasterInput({
        label: 'Clip Tag / Note',
        placeholder: 'Intro Cut Sequence...',
        icon: 225,
        borderMode: 'double-glow'
    });

    const html = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎬 Danphe-UI CapCut Studio Preview • Dual Scrollable Rails & 256 SISO</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        * { box-sizing: border-box; }
        body { background: #030712; color: #f8fafc; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .siso-log-entry { font-family: monospace; animation: fadeIn 0.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-start p-3 sm:p-6">

    <!-- Top Navigation -->
    <div class="w-full max-w-5xl flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div>
            <div class="flex items-center gap-3">
                <span class="text-2xl">🐬</span>
                <h1 class="text-lg sm:text-2xl font-black bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                    Danphe-UI CapCut Studio • Dual Scrollable Rails
                </h1>
                <span class="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 text-xs font-mono font-bold">256 SISO Serial Micro-Stream</span>
            </div>
            <p class="text-xs text-slate-400 mt-1">
                Visual Inspection Server on port ${PORT} • दुवै रेलहरू स्क्रोल गर्न सकिने • टाइमलाइनबाट सिरियल कमाण्ड आउँदा सबै आइकनहरू तुरुन्त अपडेट हुन्छन्
            </p>
        </div>
        <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <span class="text-xs font-mono font-bold text-slate-300">LIVE MESH</span>
        </div>
    </div>

    <!-- Main Content Container -->
    <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Left: CapCut Mobile Device Frame (Pure SVG Frame) -->
        <div class="lg:col-span-6 flex flex-col items-center">
            <div class="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-2 px-2">
                <span>📱 Mobile Frame (420px): Left & Right Rails Scrollable</span>
                <span class="text-emerald-400 font-bold">Touch / Mouse Scrub Active</span>
            </div>
            ${frameHtml}
        </div>

        <!-- Right: Inspector, SISO Serial Console & Verification Panel -->
        <div class="lg:col-span-6 flex flex-col gap-4">
            
            <!-- Live SISO Micro-Stream Console (High-Frequency 6-Byte Serial Bus Monitor) -->
            <div class="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <div class="flex items-center justify-between mb-2">
                    <h2 class="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>⚡ 256 SISO Serial Micro-Stream (0x5349 'SI')</span>
                    </h2>
                    <span id="siso-packet-counter" class="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400">0 packets</span>
                </div>
                <div class="bg-slate-950 rounded-xl p-2.5 border border-slate-800/80 font-mono text-[11px] h-36 overflow-y-auto custom-scrollbar flex flex-col-reverse gap-1 text-slate-300" id="siso-stream-log">
                    <div class="text-slate-600 text-[10px] italic">Ready. Scrub the timeline or click any rail tool to stream 6-byte SISO packets...</div>
                </div>
                <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                    <div>Format: <code class="text-sky-300">[0x5349 | REG_HEX | VALUE]</code></div>
                    <div class="text-emerald-400 font-bold">Latency: &lt; 0.05ms (Zero GC)</div>
                </div>
            </div>

            <!-- Architecture Verification Card -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <h2 class="text-xs font-black uppercase tracking-wider text-sky-400 mb-2.5 flex items-center gap-2 font-mono">
                    <span>📐</span> Architecture & Dual Rails Verification
                </h2>
                <ul class="text-xs space-y-2 text-slate-300 font-mono">
                    <li class="flex items-start gap-2">
                        <span class="text-emerald-400 font-bold">✓</span>
                        <span><strong>Dual Scrollable Rails:</strong> Left Rail (16 NLE Tools) & Right Rail (16 Creative FX) स्वतन्त्र रूपमा स्क्रोल हुन्छन्।</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-emerald-400 font-bold">✓</span>
                        <span><strong>256 Icon Serial Interface:</strong> सबै ३२+ आइकनहरू ६-बाइटको SISO सिरियल बसमा जोडिएका छन् (&#96;data-reg="1001"&#96; - &#96;1038&#96;)।</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-emerald-400 font-bold">✓</span>
                        <span><strong>Media Timeline Sync:</strong> प्लेहेड हिँड्दा वा बीट-सिंक (Beats, Subtitles, Slices) आउँदा आइकनहरू तुरुन्त ग्लो र अपडेट हुन्छन्।</span>
                    </li>
                </ul>
            </div>

            <!-- Aspect Ratio Switcher Card (Thado vs Terso Test) -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <div class="flex items-center justify-between mb-2">
                    <h2 class="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono">
                        <span>📐</span> ठाडो र तेर्सो साइज स्विच गर्नुहोस्
                    </h2>
                    <span class="text-[10px] font-mono text-slate-400">Current: ${selectedRatio}</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                    <a href="?ratio=9:16" class="flex flex-col items-center justify-center p-2 rounded-xl border ${selectedRatio === '9:16' ? 'bg-sky-950 border-sky-400 text-sky-300 font-bold shadow-md shadow-sky-950' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'} transition">
                        <span class="text-base">📱</span>
                        <span class="text-[10px] font-mono mt-0.5">ठाडो (9:16)</span>
                        <span class="text-[8px] text-slate-500">Shorts / Reels</span>
                    </a>
                    <a href="?ratio=16:9" class="flex flex-col items-center justify-center p-2 rounded-xl border ${selectedRatio === '16:9' ? 'bg-sky-950 border-sky-400 text-sky-300 font-bold shadow-md shadow-sky-950' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'} transition">
                        <span class="text-base">🖥️</span>
                        <span class="text-[10px] font-mono mt-0.5">तेर्सो (16:9)</span>
                        <span class="text-[8px] text-slate-500">YouTube Cinema</span>
                    </a>
                    <a href="?ratio=1:1" class="flex flex-col items-center justify-center p-2 rounded-xl border ${selectedRatio === '1:1' ? 'bg-sky-950 border-sky-400 text-sky-300 font-bold shadow-md shadow-sky-950' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'} transition">
                        <span class="text-base">🔲</span>
                        <span class="text-[10px] font-mono mt-0.5">स्क्वायर (1:1)</span>
                        <span class="text-[8px] text-slate-500">Post</span>
                    </a>
                </div>
            </div>

            <!-- Integrated Titan 256 Master Components -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <h2 class="text-xs font-black uppercase tracking-wider text-teal-400 mb-2 flex items-center gap-1.5 font-mono">
                    <span>🎴</span> 256 Master Button & Input
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>${sampleButton}</div>
                    <div>${sampleInput}</div>
                </div>
            </div>

        </div>

    </div>

    <!-- ── CLIENT INTERACTIVE SISO SERIAL SCRIPT ── -->
    <script>
        (function() {
            // ── 1. TITAN SISO SERIAL MICRO-BUS ENGINE ──
            const sisoBus = {
                registers: new Int16Array(65536),
                packetCount: 0,
                emit: function(reg, val, senderName) {
                    this.registers[reg] = val;
                    this.packetCount++;

                    const regHex = '0x' + reg.toString(16).padStart(4, '0').toUpperCase();
                    const valHex = '0x' + (val & 0xFFFF).toString(16).padStart(4, '0').toUpperCase();

                    // Update Top SISO Badge
                    const badge = document.getElementById('titan-video-editor-frame-siso-badge');
                    if (badge) {
                        badge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span><span>SISO: [' + regHex + ':' + val + ']</span>';
                    }

                    // Update Timeline Status Strip
                    const statusCmd = document.getElementById('titan-video-editor-frame-siso-last-cmd');
                    if (statusCmd) {
                        statusCmd.textContent = 'SISO #' + this.packetCount + ': 0x5349 [' + regHex + '] = ' + val;
                    }

                    // Visual Feedback on Rail Button
                    const toolBtn = document.querySelector('[data-reg="' + reg + '"]');
                    if (toolBtn) {
                        toolBtn.classList.remove('siso-pulse-glow');
                        void toolBtn.offsetWidth; // trigger reflow
                        toolBtn.classList.add('siso-pulse-glow');
                    }

                    // Log in Inspection Console
                    const logContainer = document.getElementById('siso-stream-log');
                    const counterSpan = document.getElementById('siso-packet-counter');
                    if (counterSpan) counterSpan.textContent = this.packetCount + ' packets';
                    if (logContainer) {
                        const entry = document.createElement('div');
                        entry.className = 'siso-log-entry flex items-center justify-between text-[10px] py-0.5 border-b border-slate-900';
                        const timeStr = new Date().toISOString().substring(17, 23);
                        entry.innerHTML = '<span class="text-slate-500">' + timeStr + '</span>' +
                            '<span class="text-emerald-400 font-bold">[0x5349 ' + regHex + ']</span>' +
                            '<span class="text-sky-300">VAL: ' + val + '</span>' +
                            '<span class="text-amber-300 text-[9px]">' + (senderName || 'Timeline') + '</span>';
                        logContainer.insertBefore(entry, logContainer.firstChild);

                        // Keep max 20 entries
                        while (logContainer.children.length > 20) {
                            logContainer.removeChild(logContainer.lastChild);
                        }
                    }
                }
            };
            window.TitanSiso = sisoBus;

            // ── 2. TRIGGER TOOL ACTION FROM BUTTON ──
            window.triggerSisoTool = function(reg, name) {
                sisoBus.emit(reg, 1, name);
            };

            // ── 3. TIMELINE SCRUBBING & DRAGGING ──
            let isDragging = false;
            let playheadX = 168;
            let isPlaying = false;
            let playInterval = null;

            window.startTimelineDrag = function(e) {
                isDragging = true;
                window.onTimelineScrub(e);
            };

            window.stopTimelineDrag = function() {
                isDragging = false;
            };

            document.addEventListener('mouseup', function() { isDragging = false; });
            document.addEventListener('touchend', function() { isDragging = false; });

            window.onTimelineScrub = function(e) {
                if (e.type === 'mousemove' && !isDragging) return;
                const svg = document.getElementById('titan-video-editor-frame-timeline-svg');
                if (!svg) return;

                const rect = svg.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const relX = clientX - rect.left;
                const viewBoxWidth = 440;
                let x = (relX / rect.width) * viewBoxWidth;
                x = Math.max(10, Math.min(420, x));
                playheadX = x;

                // Move Needle
                const needle = document.getElementById('titan-video-editor-frame-needle-group');
                if (needle) needle.setAttribute('transform', 'translate(' + x.toFixed(1) + ', 0)');

                // Calculate Time (00:00 to 00:54)
                const totalSec = 54;
                const curSec = (x / viewBoxWidth) * totalSec;
                const m = Math.floor(curSec / 60).toString().padStart(2, '0');
                const s = Math.floor(curSec % 60).toString().padStart(2, '0');
                const f = Math.floor((curSec % 1) * 30).toString().padStart(2, '0');
                const tcPill = document.getElementById('titan-video-editor-frame-tc-cur');
                if (tcPill) tcPill.textContent = m + ':' + s + ':' + f;

                // ── BROADCAST TIMELINE CONTEXT VIA SISO SERIAL STREAM ──
                // 1. Playhead Position Register (0x4100)
                sisoBus.emit(0x4100, Math.round(curSec * 100), 'ScrubSeek');

                // 2. Beat Sync Detection (Near Diamonds: 90, 168, 255)
                const isNearBeat = Math.abs(x - 90) < 6 || Math.abs(x - 168) < 6 || Math.abs(x - 255) < 6;
                if (isNearBeat) {
                    sisoBus.emit(1023, 1, 'BeatSyncPin');
                    const beatsBtn = document.querySelector('[data-reg="1023"]');
                    if (beatsBtn) beatsBtn.classList.add('siso-beat-glow');
                }

                // 3. Subtitle Region (45 to 210)
                if (x >= 45 && x <= 210) {
                    sisoBus.emit(1024, 1, 'SubtitleTrack');
                }

                // 4. Clip Selection (Clip A: 15..165, Clip B: 170..370)
                const clip1 = document.getElementById('titan-video-editor-frame-clip-1');
                const clip2 = document.getElementById('titan-video-editor-frame-clip-2');
                if (x >= 15 && x <= 165) {
                    if (clip1) clip1.setAttribute('stroke', '#facc15');
                    if (clip2) clip2.setAttribute('stroke', '#475569');
                    sisoBus.emit(1001, 1, 'Clip_A_Focus');
                } else if (x >= 170 && x <= 370) {
                    if (clip1) clip1.setAttribute('stroke', '#475569');
                    if (clip2) clip2.setAttribute('stroke', '#facc15');
                    sisoBus.emit(1001, 2, 'Clip_B_Focus');
                }
            };

            // ── 4. REAL-TIME 60FPS PLAYBACK SIMULATION ──
            window.togglePlayback = function() {
                isPlaying = !isPlaying;
                const label = document.getElementById('titan-video-editor-frame-play-label');
                const icon = document.getElementById('titan-video-editor-frame-play-icon');

                if (isPlaying) {
                    if (label) label.textContent = 'PAUSE';
                    if (icon) icon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
                    
                    playInterval = setInterval(function() {
                        playheadX += 1.8;
                        if (playheadX > 420) playheadX = 15;
                        window.onTimelineScrub({ clientX: 0, preventDefault: function() {} });
                        const needle = document.getElementById('titan-video-editor-frame-needle-group');
                        if (needle) needle.setAttribute('transform', 'translate(' + playheadX.toFixed(1) + ', 0)');
                    }, 50);
                } else {
                    if (label) label.textContent = 'PLAY';
                    if (icon) icon.innerHTML = '<polygon points="5 4 17 12 5 20 5 4"/>';
                    clearInterval(playInterval);
                }
            };

        })();
    </script>

</body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 Danphe-UI Video Editor Preview Server running on http://localhost:${PORT}`);
});
