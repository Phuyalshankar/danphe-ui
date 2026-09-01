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

// 2. Replace Old Sub-Toolbar (32px) with 35mm Vintage Filmstrip Toolbar
const filmstripSvg = renderTitanFilmstripToolbar({ id: 'dolphin-filmstrip-toolbar', activeToolId: 'split' });
const cleanToolbarHtml = `
<div class="studio-toolbar" id="studio-sub-toolbar" style="height:auto; min-height:48px; padding:2px 8px; background:#040711; border-bottom:1px solid #142036; display:flex; align-items:center; justify-content:center; z-index:30;">
    <div style="width:100%; max-width:860px; overflow-x:auto; display:flex; justify-content:center;">
        ${filmstripSvg}
    </div>
</div>
`;
html = html.replace(/<!-- 2\. SUB-TOOLBAR -->[\s\S]*?<!-- 3\. MAIN WORKSPACE DECK -->/, cleanToolbarHtml + '\n<!-- 3. MAIN WORKSPACE DECK -->');

// 3. Left Media Dock: Clean starting at top: 0 with NO header, NO dropzone
const mediaCardSvg = renderTitanSvgMediaCard({ id: 'dolphin-media-card', isFrameMode: false });
const cleanMediaDock = `
<aside class="media-dock" id="media-pool-dock" style="width:340px; min-width:300px; max-width:360px; background:#050914; border-right:1px solid #142036; display:flex; flex-direction:column; flex-shrink:0; overflow-y:auto; padding:2px; z-index:10;">
    <input type="file" id="native-file-input" multiple accept=".mp4,.mov,.webm,.mkv,.avi,.mp3,.wav,.m4a,.aac,.flac,.ogg,.png,.jpg,.jpeg,.webp,.gif,video/*,audio/*,image/*" style="display:none;" onchange="handleNativeFileSelection(this.files)">
    <div id="titan-media-card-slot" style="width:100%; display:flex; justify-content:center;">
        ${mediaCardSvg}
    </div>
</aside>
`;
html = html.replace(/<!-- Left: Media Pool -->[\s\S]*?<!-- Center: Program Monitor -->/, cleanMediaDock + '\n<!-- Center: Program Monitor -->');

// 4. Right Inspector Dock: Clean 7-Tab Studio Suite starting at top: 0
const typoSvg = renderTitanSvgTypoCard({ id: 'dolphin-typo-card', isFrameMode: false });
const trsfSvg = renderTitanSvgTransformCard({ id: 'dolphin-transform-card', isFrameMode: false });
const colorSvg = renderTitanSvgColorCard({ id: 'dolphin-color-card', isFrameMode: false });
const animSvg = renderTitanSvgAnimationCard({ id: 'dolphin-anim-card', isFrameMode: false });
const vfxSvg = renderTitanSvgEffectCard({ id: 'dolphin-vfx-card', isFrameMode: false });
const thumbSvg = renderTitanSvgThumbnailCard({ id: 'dolphin-thumb-card', isFrameMode: false });

const cleanInspectorDock = `
<aside class="inspector-dock" id="studio-inspector-dock" style="width:340px; min-width:300px; max-width:360px; background:#050914; border-left:1px solid #142036; display:flex; flex-direction:column; flex-shrink:0; overflow-y:auto; padding:2px; z-index:10;">
    <div class="dock-body" style="flex:1; overflow-y:auto; overflow-x:hidden; padding:0; display:flex; flex-direction:column;">
        <div class="insp-pane active" id="pane-insp-text" style="display:flex; justify-content:center;">
            ${typoSvg}
        </div>
        <div class="insp-pane" id="pane-insp-video" style="display:none; justify-content:center;">
            ${trsfSvg}
        </div>
        <div class="insp-pane" id="pane-insp-color" style="display:none; justify-content:center;">
            ${colorSvg}
        </div>
        <div class="insp-pane" id="pane-insp-anim" style="display:none; justify-content:center;">
            ${animSvg}
        </div>
        <div class="insp-pane" id="pane-insp-vfx" style="display:none; justify-content:center;">
            ${vfxSvg}
        </div>
        <div class="insp-pane" id="pane-insp-thumb" style="display:none; justify-content:center;">
            ${thumbSvg}
        </div>
        <div class="insp-pane" id="pane-insp-audio" style="display:none; padding:8px;">
            <div style="font-family:monospace; font-size:11px; color:#38bdf8; padding:8px; background:#080d1a; border-radius:8px; border:1px solid #1e293b;">
                🎙️ FAIRLIGHT AUDIO DSP & SURROUND MIXER
            </div>
        </div>
    </div>
</aside>
`;

html = html.replace(/<!-- Right: Inspector Dock -->[\s\S]*?<\/aside>/, cleanInspectorDock);

fs.writeFileSync(targetPath, html, 'utf8');
console.log('✅ Generated clean top-aligned Dolphin Video Editor HTML without syntax corruption!');
