'use strict';

const fs = require('fs');
const path = require('path');

const { renderTitanSvgMediaCard } = require('../lib/TitanSvgMediaCard.js');
const { renderTitanSvgAnimationCard } = require('../lib/TitanSvgAnimationCard.js');
const { renderTitanSvgTransformCard } = require('../lib/TitanSvgTransformCard.js');
const { renderTitanSvgColorCard } = require('../lib/TitanSvgColorCard.js');
const { renderTitanSvgTypoCard } = require('../lib/TitanSvgTypoCard.js');
const { renderTitanSvgEffectCard } = require('../lib/TitanSvgEffectCard.js');
const { renderTitanSvgThumbnailCard } = require('../lib/TitanSvgThumbnailCard.js');
const { renderTitanFilmstripToolbar } = require('../lib/TitanFilmstripToolbar.js');

const bakPath = 'd:\\dolphin-video-editor\\views\\index.html.bak';
const targetPath = 'd:\\dolphin-video-editor\\views\\index.html';

let html = fs.readFileSync(bakPath, 'utf8');

// 1. Remove Top Navbar (44px) so Left/Right cards start at top 0
html = html.replace(/<!-- 1\. TOP NAVBAR -->[\s\S]*?<\/header>/, '');

// 2. Remove Old Sub-Toolbar (32px) completely from the top
html = html.replace(/<!-- 2\. SUB-TOOLBAR -->[\s\S]*?<!-- 3\. MAIN WORKSPACE DECK -->/, '<!-- 3. MAIN WORKSPACE DECK -->');

// 3. Left Media Dock: EXACT 360px width, starting at top: 0 with NO header, NO dropzone
const mediaCardSvg = renderTitanSvgMediaCard({ id: 'dolphin-media-card', isFrameMode: false });
const cleanMediaDock = `
<aside class="media-dock" id="media-pool-dock" style="width:360px; min-width:360px; max-width:360px; background:#050914; border-right:1px solid #142036; display:flex; flex-direction:column; flex-shrink:0; overflow-y:auto; padding:0; margin:0; z-index:10;">
    <input type="file" id="native-file-input" multiple accept=".mp4,.mov,.webm,.mkv,.avi,.mp3,.wav,.m4a,.aac,.flac,.ogg,.png,.jpg,.jpeg,.webp,.gif,video/*,audio/*,image/*" style="display:none;" onchange="handleNativeFileSelection(this.files)">
    <div id="titan-media-card-slot" style="width:100%; max-width:360px; display:flex; justify-content:center;">
        ${mediaCardSvg}
    </div>
</aside>
`;
html = html.replace(/<!-- Left: Media Pool -->[\s\S]*?<!-- Center: Program Monitor -->/, cleanMediaDock + '\n<!-- Center: Program Monitor -->');

// 4. Right Inspector Dock: EXACT 360px width, starting at top: 0, NO outer dock tabs
const typoSvg = renderTitanSvgTypoCard({ id: 'dolphin-typo-card', isFrameMode: false });
const trsfSvg = renderTitanSvgTransformCard({ id: 'dolphin-transform-card', isFrameMode: false });
const colorSvg = renderTitanSvgColorCard({ id: 'dolphin-color-card', isFrameMode: false });
const animSvg = renderTitanSvgAnimationCard({ id: 'dolphin-anim-card', isFrameMode: false });
const vfxSvg = renderTitanSvgEffectCard({ id: 'dolphin-vfx-card', isFrameMode: false });
const thumbSvg = renderTitanSvgThumbnailCard({ id: 'dolphin-thumb-card', isFrameMode: false });

const cleanInspectorDock = `
<aside class="inspector-dock" id="studio-inspector-dock" style="width:360px; min-width:360px; max-width:360px; background:#050914; border-left:1px solid #142036; display:flex; flex-direction:column; flex-shrink:0; overflow-y:auto; padding:0; margin:0; z-index:10;">
    <div class="dock-body" style="flex:1; width:100%; overflow-y:auto; overflow-x:hidden; padding:0; display:flex; flex-direction:column;">
        <div class="insp-pane active" id="pane-insp-text" style="width:100%; display:flex; justify-content:center;">
            ${typoSvg}
        </div>
        <div class="insp-pane" id="pane-insp-video" style="width:100%; display:none; justify-content:center;">
            ${trsfSvg}
        </div>
        <div class="insp-pane" id="pane-insp-color" style="width:100%; display:none; justify-content:center;">
            ${colorSvg}
        </div>
        <div class="insp-pane" id="pane-insp-anim" style="width:100%; display:none; justify-content:center;">
            ${animSvg}
        </div>
        <div class="insp-pane" id="pane-insp-vfx" style="width:100%; display:none; justify-content:center;">
            ${vfxSvg}
        </div>
        <div class="insp-pane" id="pane-insp-thumb" style="width:100%; display:none; justify-content:center;">
            ${thumbSvg}
        </div>
        <div class="insp-pane" id="pane-insp-audio" style="width:100%; display:none; padding:8px;">
            <div style="font-family:monospace; font-size:11px; color:#38bdf8; padding:8px; background:#080d1a; border-radius:8px; border:1px solid #1e293b;">
                🎙️ FAIRLIGHT AUDIO DSP & SURROUND MIXER
            </div>
        </div>
    </div>
</aside>
`;

html = html.replace(/<!-- Right: Inspector Dock -->[\s\S]*?<\/aside>/, cleanInspectorDock);

// 5. Replace Old Timeline Action Buttons with 35mm Vintage Analog Filmstrip Toolbar in .timeline-bar
const filmstripSvg = renderTitanFilmstripToolbar({ id: 'dolphin-filmstrip-toolbar', activeToolId: 'split', height: 28 });
const cleanTimelineLeft = `
        <div class="tl-left" style="display:flex; align-items:center; gap:4px; flex:1; overflow-x:auto;">
            <button type="button" class="tl-btn" onclick="togglePlayback()" id="btn-tl-play" title="Play / Pause (Space)" style="background:#0284c7;border:1px solid #0284c7;border-radius:4px;color:#fff;padding:2px 8px;font-size:10px;font-weight:800;cursor:pointer;display:flex;align-items:center;gap:3px;flex-shrink:0;">
                <span id="tl-play-icon">▶</span><span id="tl-play-label">PLAY</span>
            </button>
            <button type="button" class="tl-btn" onclick="stepFrame(-1)" title="Step Back" style="background:#0b1426;border:1px solid #1e293b;border-radius:4px;color:#94a3b8;padding:2px 6px;font-size:9.5px;font-weight:700;cursor:pointer;flex-shrink:0;">
                <span>◀</span>
            </button>
            <button type="button" class="tl-btn" onclick="stepFrame(1)" title="Step Forward" style="background:#0b1426;border:1px solid #1e293b;border-radius:4px;color:#94a3b8;padding:2px 6px;font-size:9.5px;font-weight:700;cursor:pointer;flex-shrink:0;">
                <span>▶</span>
            </button>
            <div style="width:1px;height:16px;background:#1e293b;margin:0 4px;flex-shrink:0;"></div>
            <!-- 🎞️ 35mm VINTAGE ANALOG FILMSTRIP TOOLBAR (MOVED TO TIMELINE BAR) -->
            <div style="display:flex; align-items:center; flex-shrink:0;">
                ${filmstripSvg}
            </div>
            <div style="width:1px;height:16px;background:#1e293b;margin:0 4px;flex-shrink:0;"></div>
            <button type="button" class="tl-btn" onclick="toggleSnapMagnet()" id="btn-tl-snap" style="flex-shrink:0;">
                <span>🧲 Snap</span>
            </button>
        </div>
`;

html = html.replace(/<div class="tl-left">[\s\S]*?<\/div>\s*<div class="tl-mid">/, cleanTimelineLeft + '\n        <div class="tl-mid">');

fs.writeFileSync(targetPath, html, 'utf8');
console.log('✅ Successfully moved Filmstrip Toolbar to Timeline Bar and removed top toolbar!');
