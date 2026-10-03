'use strict';

/**
 * 🎬 Danphe-UI Video Editor Preview Server
 * Port: 3001
 * Visual Inspection Server for Pure SVG CapCut-Class Video Editor Frame
 */

const http = require('http');
const { renderVideoEditorFrame } = require('./lib/TitanVideoEditorFrame');
const { renderMasterButton } = require('./lib/TitanMasterButton');
const { renderMasterInput } = require('./lib/TitanMasterInput');

const PORT = 3001;

const server = http.createServer((req, res) => {
    const frameHtml = renderVideoEditorFrame({
        title: 'Cinematic_Vlog_01.mp4',
        currentTime: '00:08:24',
        totalDuration: '01:30:00',
        aspectRatio: '9:16',
        isPlaying: false,
        activeTool: 'split',
        zoomLevel: 1.0
    });

    const sampleButton = renderMasterButton({
        label: '🚀 Export 1080p 60fps',
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
    <title>🎬 Danphe-UI CapCut Studio Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        * { box-sizing: border-box; }
        body { background: #030712; color: #f8fafc; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8">

    <!-- Top Navigation -->
    <div class="w-full max-w-4xl flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
        <div>
            <div class="flex items-center gap-3">
                <span class="text-2xl">🐬</span>
                <h1 class="text-xl sm:text-2xl font-black bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                    Danphe-UI CapCut Studio Frame
                </h1>
                <span class="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 text-xs font-mono font-bold">100% Pure SVG + Normal Text</span>
            </div>
            <p class="text-xs text-slate-400 mt-1">Live visual inspection on http://localhost:${PORT} • Zero WebViews • Ready for Mobile APK</p>
        </div>
        <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <span class="text-xs font-mono font-bold text-slate-300">LIVE</span>
        </div>
    </div>

    <!-- Main Content Container -->
    <div class="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        <!-- Left: CapCut Mobile Device Frame (Pure SVG Frame) -->
        <div class="md:col-span-7 flex flex-col items-center">
            <div class="text-xs font-mono text-slate-400 mb-2 flex items-center gap-2">
                <span>📱 Device Preview: 420px Mobile Screen</span>
            </div>
            ${frameHtml}
        </div>

        <!-- Right: Inspector & Verification Panel -->
        <div class="md:col-span-5 flex flex-col gap-4">
            
            <!-- Architecture Card -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h2 class="text-sm font-black uppercase tracking-wider text-sky-400 mb-3 flex items-center gap-2">
                    <span>⚡</span> Architecture Compliance
                </h2>
                <ul class="text-xs space-y-2.5 text-slate-300 font-mono">
                    <li class="flex items-start gap-2">
                        <span class="text-emerald-400 font-bold">✓</span>
                        <span><strong>Pure Vector SVG:</strong> Viewport, Ruler, Waveforms, Playhead needle, Icons (0 Bitmaps)</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-emerald-400 font-bold">✓</span>
                        <span><strong>Normal Text:</strong> Timecodes, Labels, Tool titles render as native font elements</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-emerald-400 font-bold">✓</span>
                        <span><strong>Multi-Track NLE:</strong> Subtitles (T), Video Slices (✂️), Audio Waveform (🎵)</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-emerald-400 font-bold">✓</span>
                        <span><strong>Fast Export:</strong> Android Hardware MediaCodec Direct Hook</span>
                    </li>
                </ul>
            </div>

            <!-- Integrated Titan Components Test -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h2 class="text-sm font-black uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-2">
                    <span>🎴</span> 256 Master Button & Input
                </h2>
                <div class="flex flex-col gap-3">
                    <div>
                        <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Pure SVG Icon + Normal Text Button:</span>
                        ${sampleButton}
                    </div>
                    <div>
                        <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Double Glow Master Input:</span>
                        ${sampleInput}
                    </div>
                </div>
            </div>

            <!-- Actions Panel -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
                <p class="text-xs text-slate-400 mb-3">यदि यो फ्रेम र डिजाइन राम्रो लाग्यो भने, हामी यसलाई सिधै <code class="text-sky-300 bg-slate-950 px-1 py-0.5 rounded">D:\\VideoEditor</code> मोबाइल एपमा इन्टिग्रेट गर्नेछौँ।</p>
                <div class="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 font-bold">
                    STATUS: READY TO MERGE INTO APP
                </div>
            </div>

        </div>

    </div>

</body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 Danphe-UI Video Editor Preview Server running on http://localhost:${PORT}`);
});
