'use strict';

/**
 * 🎬 Danphe-UI Video Editor Preview Server
 * Port: 3001
 * Visual Inspection & Interactive SISO Serial Bus + Universal Media Lane Test Server
 */

const http = require('http');
const { renderVideoEditorFrame } = require('./lib/TitanVideoEditorFrame');
const { renderUniversalMediaLane } = require('./lib/TitanUniversalMediaLane');
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

    // Sample Universal Lanes for Demo
    const demoVideoLane = renderUniversalMediaLane({
        id: 'demo-lane-video',
        type: 'video',
        x: 0,
        y: 0,
        width: 380,
        height: 48,
        clipTitle: '4K_Drone_Cinematic.mp4',
        hasEmbeddedAudio: true,
        durationSec: 14.2,
        isSelected: true,
        reg: 1001
    });

    const demoAudioLane = renderUniversalMediaLane({
        id: 'demo-lane-audio',
        type: 'audio',
        x: 0,
        y: 0,
        width: 380,
        height: 38,
        clipTitle: 'Cinematic_Bass_Drop.wav',
        durationSec: 14.2,
        isSelected: false,
        reg: 1023
    });

    const demoTextLane = renderUniversalMediaLane({
        id: 'demo-lane-text',
        type: 'text',
        x: 0,
        y: 0,
        width: 380,
        height: 32,
        clipTitle: 'NEPAL CINEMATIC VLOG',
        durationSec: 8.0,
        isSelected: false,
        reg: 1024
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
    <title>🎬 Danphe-UI CapCut Studio • Universal SVG Media Lane & 256 SISO</title>
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
                    Danphe-UI CapCut Studio • Universal SVG Media Lane
                </h1>
                <span class="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 text-xs font-mono font-bold">Polymorphic SVG + Embedded Audio</span>
            </div>
            <p class="text-xs text-slate-400 mt-1">
                एउटै मास्टर SVG Media Lane ले Video, Audio, Text, Image अनुसार रङ र ग्राफिक्स बदल्छ • भिडियोभित्र अडियो लुकाउने र Detach/Extract गर्ने सुविधा
            </p>
        </div>
        <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <span class="text-xs font-mono font-bold text-slate-300">LIVE</span>
        </div>
    </div>

    <!-- Main Content Container -->
    <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Left: CapCut Mobile Device Frame (Pure SVG Frame) -->
        <div class="lg:col-span-6 flex flex-col items-center">
            <div class="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-2 px-2">
                <span>📱 Mobile Frame (420px): Universal Lanes in Timeline</span>
                <span class="text-emerald-400 font-bold">Touch / Mouse Scrub Active</span>
            </div>
            ${frameHtml}
        </div>

        <!-- Right: Inspector, Universal Media Lane Showcase & SISO Serial Console -->
        <div class="lg:col-span-6 flex flex-col gap-4">
            
            <!-- 🌟 UNIVERSAL MEDIA LANE SHOWCASE (Your Core Idea Demonstrated) -->
            <div class="bg-slate-900/95 border border-sky-500/40 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
                <div class="absolute -right-8 -top-8 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div class="flex items-center justify-between mb-2">
                    <h2 class="text-xs font-black uppercase tracking-wider text-sky-300 flex items-center gap-1.5 font-mono">
                        <span>✨</span>
                        <span>Universal SVG Media Lane (Polymorphic)</span>
                    </h2>
                    <span class="text-[9px] font-mono bg-sky-950 px-2 py-0.5 rounded border border-sky-700 text-sky-300">100% DRY Code</span>
                </div>
                
                <p class="text-[11px] text-slate-300 mb-3 leading-relaxed">
                    एउटै SVG कम्पोनेन्ट जसले मिडिया अनुसार रूप, रङ, वेभफर्म र ह्यान्डल बदल्छ। भिडियोभित्र अडियो वेभफर्म लुकाइएको छ—आवश्यक पर्दा 
                    <strong class="text-emerald-300 font-mono">"📻 EXTRACT"</strong> थिचेर छुट्टै अडियो ट्र्याक निकाल्न सकिन्छ!
                </p>

                <!-- Interactive SVG Lane Preview Container -->
                <div class="flex flex-col gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                        <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                            <span class="text-sky-400 font-bold">1. Video Track with Embedded Audio Waveform:</span>
                            <span class="text-amber-400 text-[9px]">Click "📻 EXTRACT" below</span>
                        </div>
                        <svg viewBox="0 0 380 50" width="100%" height="50">
                            ${demoVideoLane}
                        </svg>
                    </div>

                    <div>
                        <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                            <span class="text-emerald-400 font-bold">2. Dedicated / Extracted Audio Track (Waveform + Beat Sync):</span>
                            <span class="text-emerald-400 text-[9px]">Pure SVG</span>
                        </div>
                        <svg viewBox="0 0 380 40" width="100%" height="40">
                            ${demoAudioLane}
                        </svg>
                    </div>

                    <div>
                        <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                            <span class="text-amber-400 font-bold">3. Subtitle / Text Track (Imperial Gold):</span>
                            <span class="text-amber-400 text-[9px]">Kinetic Captions</span>
                        </div>
                        <svg viewBox="0 0 380 34" width="100%" height="34">
                            ${demoTextLane}
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Live SISO Micro-Stream Console (High-Frequency 6-Byte Serial Bus Monitor) -->
            <div class="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <div class="flex items-center justify-between mb-2">
                    <h2 class="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>⚡ 256 SISO Serial Micro-Stream (0x5349 'SI')</span>
                    </h2>
                    <span id="siso-packet-counter" class="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400">0 packets</span>
                </div>
                <div class="bg-slate-950 rounded-xl p-2.5 border border-slate-800/80 font-mono text-[11px] h-32 overflow-y-auto custom-scrollbar flex flex-col-reverse gap-1 text-slate-300" id="siso-stream-log">
                    <div class="text-slate-600 text-[10px] italic">Ready. Scrub timeline or click any tool to stream SISO packets...</div>
                </div>
                <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                    <div>Format: <code class="text-sky-300">[0x5349 | REG_HEX | VALUE]</code></div>
                    <div class="text-emerald-400 font-bold">Latency: &lt; 0.05ms (Zero GC)</div>
                </div>
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

                        while (logContainer.children.length > 20) {
                            logContainer.removeChild(logContainer.lastChild);
                        }
                    }
                }
            };
            window.TitanSiso = sisoBus;

            // ── 1.4 AUTONOMOUS SERIAL LANE EVENT LISTENER (Zero Buttons - 100% Serial Port Driven) ──
            const PRESET_DATA = {
                fonts: [
                    { id: 1, label: 'नेपाली', sub: 'कलिग्राफी', style: 'font-family: serif; font-weight: 900; letter-spacing: 1px;' },
                    { id: 2, label: 'CYBER', sub: 'नियन', style: 'font-family: monospace; font-weight: 900; letter-spacing: 2px; fill: #22d3ee;' },
                    { id: 3, label: 'BOLD', sub: 'सिनेमा', style: 'font-family: sans-serif; font-weight: 900; letter-spacing: 3px; fill: #ffffff;' },
                    { id: 4, label: '_MONO', sub: 'टाइपराइटर', style: 'font-family: monospace; font-weight: bold; letter-spacing: 0.5px; fill: #a7f3d0;' },
                    { id: 5, label: 'Royal', sub: 'शाही गोल्ड', style: 'font-family: serif; font-style: italic; font-weight: 900; fill: #facc15;' },
                    { id: 6, label: 'STREET', sub: 'भित्ते कला', style: 'font-family: sans-serif; font-weight: 900; letter-spacing: -0.5px; fill: #fb7185;' },
                    { id: 7, label: 'Brush', sub: 'ह्यान्डराइटिङ', style: 'font-family: cursive, sans-serif; font-weight: 600; fill: #c084fc;' }
                ],
                filters: [
                    { id: 20, label: '🎬 TEAL', sub: 'हलिउड', colors: ['#0f172a', '#1e293b', '#ea580c'] },
                    { id: 21, label: '🌅 SUNSET', sub: 'गोल्डेन आवर', colors: ['#451a03', '#9a3412', '#f59e0b'] },
                    { id: 22, label: '🌆 CYBER', sub: 'साइबरपंक', colors: ['#2e1065', '#6b21a8', '#06b6d4'] },
                    { id: 23, label: '🌑 NOIR', sub: 'डार्क सिनेमा', colors: ['#020617', '#0f172a', '#334155'] },
                    { id: 24, label: '📼 VHS 90s', sub: 'रेट्रो', colors: ['#3b0764', '#831843', '#059669'] },
                    { id: 25, label: '🌲 FOREST', sub: 'इमराल्ड', colors: ['#064e3b', '#065f46', '#10b981'] },
                    { id: 26, label: '⚪ B&W', sub: 'मोनोक्रोम', colors: ['#000000', '#1c1917', '#52525b'] }
                ]
            };

            window.onSerialLaneSelect = function(laneType, laneTypeId, e) {
                if (e) e.stopPropagation();

                // 1. Emit 6-Byte SISO Serial Packet from the lane
                sisoBus.emit(0x4130, laneTypeId, 'LANE_SELECT:' + laneType.toUpperCase());

                // 2. Update Strip Badge with Active Serial Context
                const badge = document.getElementById('titan-video-editor-frame-lane-context-badge');
                const sisoInfo = document.getElementById('titan-video-editor-frame-lane-siso-stream');
                const track = document.getElementById('titan-video-editor-frame-preset-track');

                if (badge) {
                    if (laneType === 'text') {
                        badge.className = 'px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-500 text-[9px] font-mono text-amber-300 font-bold';
                        badge.textContent = 'LANE: TEXT (T)';
                    } else if (laneType === 'video') {
                        badge.className = 'px-2 py-0.5 rounded-full bg-sky-950/90 border border-sky-400 text-[9px] font-mono text-sky-300 font-bold';
                        badge.textContent = 'LANE: VIDEO (🎬)';
                    } else if (laneType === 'audio') {
                        badge.className = 'px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500 text-[9px] font-mono text-emerald-300 font-bold';
                        badge.textContent = 'LANE: AUDIO (🎵)';
                    }
                }
                if (sisoInfo) {
                    sisoInfo.textContent = 'SISO: 0x5349 [0x4130: ' + laneTypeId + ']';
                }

                // 3. Serial Port Autonomously Injects the Exact Presets into the Live Strip
                if (track) {
                    let items = [];
                    if (laneType === 'text') {
                        items = PRESET_DATA.fonts;
                    } else if (laneType === 'video') {
                        items = PRESET_DATA.filters;
                    } else if (laneType === 'audio') {
                        items = [
                            { id: 31, label: 'BASS BOOST', sub: 'बास बुस्ट' },
                            { id: 32, label: 'ROBOT FX', sub: 'रोबोटिक' },
                            { id: 33, label: 'ECHO ROOM', sub: 'रिभर्ब इको' },
                            { id: 34, label: 'TRAP 140', sub: 'बीट सिंक' },
                            { id: 35, label: 'LO-FI 85', sub: 'चिल साउन्ड' },
                            { id: 36, label: 'DENOISE AI', sub: 'नोइज रिमुभ' }
                        ];
                    }

                    let html = '';
                    items.forEach((item, idx) => {
                        const borderCls = idx === 0 ? 'border-sky-400/80 shadow-md shadow-sky-950/50' : 'border-slate-800';
                        html += '<div onclick="applyLivePreset(\\'' + laneType + '\\', ' + item.id + ', \\'' + item.label + '\\')" class="preset-card shrink-0 flex flex-col items-center justify-center w-16 h-12 rounded-xl bg-slate-950 border ' + borderCls + ' p-1 cursor-pointer hover:border-sky-300 transition group">' +
                            '<span class="text-[11px] font-mono font-black text-slate-200 group-hover:scale-105 transition truncate max-w-[56px]">' + item.label + '</span>' +
                            '<span class="text-[8px] font-mono text-slate-500 mt-0.5">' + (item.sub || '') + '</span>' +
                            '</div>';
                    });
                    track.innerHTML = html;
                }

                // 4. Highlight Relevant Tools on Left & Right Rails via Serial Context
                const allToolBtns = document.querySelectorAll('.tool-btn');
                allToolBtns.forEach(btn => btn.style.opacity = '0.45');

                if (laneType === 'text') {
                    [1024, 1007, 1001, 1028].forEach(r => {
                        const b = document.querySelector('[data-reg="' + r + '"]');
                        if (b) { b.style.opacity = '1'; b.classList.add('siso-pulse-glow'); }
                    });
                } else if (laneType === 'video') {
                    [1001, 1002, 1003, 1016, 1021, 1014].forEach(r => {
                        const b = document.querySelector('[data-reg="' + r + '"]');
                        if (b) { b.style.opacity = '1'; b.classList.add('siso-pulse-glow'); }
                    });
                } else if (laneType === 'audio') {
                    [1023, 1035, 1029, 1001].forEach(r => {
                        const b = document.querySelector('[data-reg="' + r + '"]');
                        if (b) { b.style.opacity = '1'; b.classList.add('siso-pulse-glow'); }
                    });
                }
            };

            window.applyLivePreset = function(cat, id, name) {
                const cards = document.querySelectorAll('.preset-card');
                cards.forEach(c => c.classList.remove('preset-active'));
                if (event && event.currentTarget) event.currentTarget.classList.add('preset-active');

                sisoBus.emit(0x4150, id, cat.toUpperCase() + ':' + name);

                const caption = document.getElementById('titan-video-editor-frame-caption-text');
                const subject = document.getElementById('titan-video-editor-frame-subject-graphic');

                if (cat === 'fonts') {
                    const item = PRESET_DATA.fonts.find(f => f.id === id);
                    if (item && caption) {
                        caption.setAttribute('style', item.style);
                    }
                } else if (cat === 'anim') {
                    const item = PRESET_DATA.anim.find(a => a.id === id);
                    if (item) {
                        const target = subject || caption;
                        if (target) {
                            target.classList.remove('anim-glitch', 'anim-bounce', 'anim-spin', 'anim-zoom', 'anim-drift', 'siso-beat-glow', 'siso-pulse-glow');
                            void target.offsetWidth;
                            target.classList.add(item.cssClass);
                        }
                    }
                } else if (cat === 'filters') {
                    const item = PRESET_DATA.filters.find(f => f.id === id);
                    if (item && item.colors) {
                        const s1 = document.getElementById('titan-video-editor-frame-stop-1');
                        const s2 = document.getElementById('titan-video-editor-frame-stop-2');
                        const s3 = document.getElementById('titan-video-editor-frame-stop-3');
                        if (s1) s1.setAttribute('stop-color', item.colors[0]);
                        if (s2) s2.setAttribute('stop-color', item.colors[1]);
                        if (s3) s3.setAttribute('stop-color', item.colors[2]);
                    }
                }
            };

            // ── 2. TRIGGER TOOL ACTION FROM BUTTON ──
            window.triggerSisoTool = function(reg, name) {
                sisoBus.emit(reg, 1, name);

                // If DetachAudio is clicked, show visual feedback!
                if (reg === 1014) {
                    const embeddedAudio = document.querySelector('[id$="-embedded-audio"]');
                    if (embeddedAudio) {
                        embeddedAudio.style.opacity = '0.3';
                        setTimeout(() => {
                            alert('🎵 [SISO: 0x03F6] Embedded Audio successfully extracted to standalone Audio Lane!');
                        }, 50);
                    }
                }
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
                sisoBus.emit(0x4100, Math.round(curSec * 100), 'ScrubSeek');

                // Beat Sync Detection (Near Diamonds: 90, 168, 255)
                const isNearBeat = Math.abs(x - 90) < 6 || Math.abs(x - 168) < 6 || Math.abs(x - 255) < 6;
                if (isNearBeat) {
                    sisoBus.emit(1023, 1, 'BeatSyncPin');
                    const beatsBtn = document.querySelector('[data-reg="1023"]');
                    if (beatsBtn) beatsBtn.classList.add('siso-beat-glow');
                }

                // Subtitle Region (45 to 210)
                if (x >= 45 && x <= 210) {
                    sisoBus.emit(1024, 1, 'SubtitleTrack');
                }

                // Clip Selection (Clip A: 15..165, Clip B: 170..370)
                const clip1Body = document.querySelector('[id*="-clip-1-body"]');
                const clip2Body = document.querySelector('[id*="-clip-2-body"]');
                if (x >= 15 && x <= 165) {
                    if (clip1Body) clip1Body.setAttribute('stroke', '#facc15');
                    if (clip2Body) clip2Body.setAttribute('stroke', '#0284c7');
                    sisoBus.emit(1001, 1, 'Clip_A_Focus');
                } else if (x >= 170 && x <= 370) {
                    if (clip1Body) clip1Body.setAttribute('stroke', '#0284c7');
                    if (clip2Body) clip2Body.setAttribute('stroke', '#facc15');
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
