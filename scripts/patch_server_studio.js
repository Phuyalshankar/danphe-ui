'use strict';

const fs = require('fs');

const { renderTitanSvgMediaCard } = require('../lib/TitanSvgMediaCard.js');
const { renderTitanSvgAnimationCard } = require('../lib/TitanSvgAnimationCard.js');
const { renderTitanSvgTransformCard } = require('../lib/TitanSvgTransformCard.js');
const { renderTitanSvgColorCard } = require('../lib/TitanSvgColorCard.js');
const { renderTitanSvgTypoCard } = require('../lib/TitanSvgTypoCard.js');
const { renderTitanSvgEffectCard } = require('../lib/TitanSvgEffectCard.js');
const { renderTitanSvgThumbnailCard } = require('../lib/TitanSvgThumbnailCard.js');
const { renderTitanFilmstripToolbar } = require('../lib/TitanFilmstripToolbar.js');

const serverPath = 'd:\\danphe-ui\\server.js';
let content = fs.readFileSync(serverPath, 'utf8');

const targetStudioHtml = `
    <!-- 🐬 PURE 3-COLUMN PROFESSIONAL VIDEO STUDIO WORKSPACE -->
    <main class="w-full min-h-screen p-2 m-0 flex flex-col gap-2 max-w-[1920px] mx-auto">
        
        <!-- Top 3-Column Studio Deck -->
        <div class="flex flex-col lg:flex-row items-start justify-center gap-4 w-full px-2">
            
            <!-- LEFT COLUMN (360px): LEFT MEDIA HUB -->
            <div class="w-full lg:w-[360px] flex-shrink-0 flex flex-col items-center justify-start">
                <div id="inspector-card-media-slot" class="w-full max-w-[360px] shadow-2xl">
                    \${renderTitanSvgMediaCard()}
                </div>
            </div>

            <!-- CENTER COLUMN: MAIN PROGRAM MONITOR & TIMELINE WITH 35mm FILMSTRIP -->
            <div class="flex-1 min-w-0 w-full flex flex-col gap-2">
                
                <!-- 16:9 Program Monitor Stage -->
                <div class="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.85)] bg-black">
                    <canvas id="main-video-canvas" width="640" height="360" class="absolute inset-0 w-full h-full object-cover block"></canvas>
                    
                    <div id="main-media-layer" class="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div id="main-media-icon" class="text-cyan-300 drop-shadow-[0_0_25px_rgba(6,182,212,0.8)]">
                            <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        </div>
                    </div>

                    <div id="main-title-layer" class="absolute inset-x-0 bottom-5 flex flex-col items-center justify-center pointer-events-none p-3 text-center">
                        <div id="main-kinetic-text" class="font-mono font-black text-lg sm:text-xl text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] tracking-widest uppercase">
                            MAIN VIDEO PROJECT
                        </div>
                        <span id="main-canvas-sub" class="text-[10px] font-mono text-slate-400 font-bold mt-0.5">Timeline Program Monitor</span>
                    </div>

                    <div class="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-2 text-[10px] font-mono text-slate-300">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>MAIN PROGRAM MONITOR</span>
                    </div>
                    <div class="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-mono text-slate-400 font-bold">
                        1920x1080 &bull; 120 FPS
                    </div>
                </div>

                <!-- 🎞️ 35mm VINTAGE ANALOG FILMSTRIP CINEMATIC TOOLBAR (IN TIMELINE ACTION STRIP) -->
                <div class="w-full flex items-center justify-between p-1.5 bg-slate-900/90 rounded-xl border border-slate-800 gap-2">
                    <div class="flex items-center gap-2">
                        <button type="button" class="px-2.5 py-1 rounded-lg text-xs font-black bg-cyan-600 text-slate-950 flex items-center gap-1 shadow">▶ PLAY</button>
                        <button type="button" class="px-2 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700">◀</button>
                        <button type="button" class="px-2 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700">▶</button>
                    </div>
                    <div class="flex-1 flex justify-center overflow-x-auto">
                        \${renderTitanFilmstripToolbar({ id: 'titan-filmstrip-toolbar', activeToolId: 'split', height: 28 })}
                    </div>
                    <div class="flex items-center gap-2 font-mono text-xs text-slate-400">
                        <span class="text-cyan-300 font-bold">00:00:00:00</span>
                    </div>
                </div>

            </div>

            <!-- RIGHT COLUMN (360px): RIGHT TITAN 6-CARD INSPECTOR & CREATIVE SUITE -->
            <div class="w-full lg:w-[360px] flex-shrink-0 flex flex-col items-center justify-start gap-0">
                <input type="file" id="native-media-file-input" multiple accept="video/*,image/*,audio/*" class="hidden" onchange="handleNativeMediaFileChange(event)">

                <div id="inspector-card-anim-slot" class="relative transition-all duration-300 w-full max-w-[360px]">
                    \${renderTitanSvgAnimationCard()}
                </div>
                <div id="inspector-card-transform-slot" class="relative transition-all duration-300 w-full max-w-[360px] hidden">
                    \${renderTitanSvgTransformCard()}
                </div>
                <div id="inspector-card-color-slot" class="relative transition-all duration-300 w-full max-w-[360px] hidden">
                    \${renderTitanSvgColorCard()}
                </div>
                <div id="inspector-card-typo-slot" class="relative transition-all duration-300 w-full max-w-[360px] hidden">
                    \${renderTitanSvgTypoCard()}
                </div>
                <div id="inspector-card-vfx-slot" class="relative transition-all duration-300 w-full max-w-[360px] hidden">
                    \${renderTitanSvgEffectCard()}
                </div>
                <div id="inspector-card-thumb-slot" class="relative transition-all duration-300 w-full max-w-[360px] hidden">
                    \${renderTitanSvgThumbnailCard()}
                </div>
            </div>

        </div>
`;

// Replace from `<!-- 🐬 PURE 3-COLUMN PROFESSIONAL VIDEO STUDIO WORKSPACE -->` to `<!-- Real-time I/O Stream Terminal -->`
const regex = /<!-- 🐬 PURE 3-COLUMN PROFESSIONAL VIDEO STUDIO WORKSPACE -->[\s\S]*?<!-- Real-time I\/O Stream Terminal -->/;
if (regex.test(content)) {
    content = content.replace(regex, targetStudioHtml + '\n        <!-- Real-time I/O Stream Terminal -->');
    fs.writeFileSync(serverPath, content, 'utf8');
    console.log('✅ server.js cleanly updated with pristine 3-Column Studio layout!');
} else {
    console.log('⚠️ Pattern not matched in server.js');
}
