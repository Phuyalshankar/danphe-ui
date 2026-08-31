const fs = require('fs');
let code = fs.readFileSync('D:/danphe-ui/server_3000.js', 'utf8');

// Replace left drawer CSS & HTML with bulletproof SVG toggle handle
const leftDrawerCSS = `
/* LEFT DRAWER */
.left-drawer {
    width: 230px; background: #070d18; border-right: 1px solid rgba(255,255,255,0.08);
    display: flex; flex-direction: column; flex-shrink: 0; position: relative;
    transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 20;
}
.left-drawer.collapsed { width: 0 !important; border-right: none; }
.left-drawer-inner { width: 230px; height: 100%; display: flex; flex-direction: column; overflow: hidden; }

.left-drawer-toggle {
    position: absolute; right: -20px; top: 50%; transform: translateY(-50%);
    width: 20px; height: 44px; background: #0a1220; border: 1px solid rgba(255,255,255,0.12); border-left: none;
    border-radius: 0 7px 7px 0; display: flex; align-items: center; justify-content: center;
    color: #38bdf8; cursor: pointer; z-index: 100; box-shadow: 3px 0 8px rgba(0,0,0,0.5);
    transition: all 0.15s ease;
}
.left-drawer-toggle:hover { background: #0f1f38; color: #fff; width: 22px; }

/* RIGHT DRAWER */
.right-drawer {
    width: 330px; background: #070d19; border-left: 1px solid rgba(255,255,255,0.08);
    display: flex; flex-direction: column; flex-shrink: 0; position: relative;
    transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 20;
}
.right-drawer.collapsed { width: 0 !important; border-left: none; }
.right-drawer-inner { width: 330px; height: 100%; display: flex; flex-direction: column; overflow: hidden; }

.right-drawer-toggle {
    position: absolute; left: -20px; top: 50%; transform: translateY(-50%);
    width: 20px; height: 44px; background: #0a1220; border: 1px solid rgba(255,255,255,0.12); border-right: none;
    border-radius: 7px 0 0 7px; display: flex; align-items: center; justify-content: center;
    color: #38bdf8; cursor: pointer; z-index: 100; box-shadow: -3px 0 8px rgba(0,0,0,0.5);
    transition: all 0.15s ease;
}
.right-drawer-toggle:hover { background: #0f1f38; color: #fff; width: 22px; }
`;

// Replace CSS
code = code.replace(/\/\* LEFT: MEDIA & ASSETS DRAWER \*\/[\s\S]*?\/\* CENTER \*\//, leftDrawerCSS + '\n/* CENTER */');

// Replace Left Drawer HTML
const newLeftHTML = `    <!-- LEFT DRAWER (MEDIA & ASSETS) -->
    <div class="left-drawer" id="left-drawer">
        <div class="left-drawer-toggle" onclick="toggleLeftDrawer()" title="Toggle Left Media Drawer">
            <svg id="left-toggle-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </div>

        <div class="left-drawer-inner">
            <div class="pane-header">
                <span>?? PROJECT ASSETS</span>
                <span style="font-size:8.5px; color:#38bdf8; background:#081b33; padding:1px 5px; border-radius:3px;">REG 10000</span>
            </div>

            <div class="left-tabs">
                <button class="left-tab-btn active" onclick="switchLeftTab(this, 'media')">Media</button>
                <button class="left-tab-btn" onclick="switchLeftTab(this, 'fx')">Effects</button>
                <button class="left-tab-btn" onclick="switchLeftTab(this, 'trans')">Transitions</button>
                <button class="left-tab-btn" onclick="switchLeftTab(this, 'audio')">Audio</button>
            </div>

            <div class="left-drawer-content" id="left-drawer-list">
                <div class="media-item" onclick="dispatchTitanRelay(0x15, 10001, 'CLIP_LOAD_01')"><span class="media-tag tag-vid">4K</span> master_shot_01.mp4</div>
                <div class="media-item" onclick="dispatchTitanRelay(0x15, 10002, 'CLIP_LOAD_02')"><span class="media-tag tag-vid">RAW</span> b_roll_drone.mp4</div>
                <div class="media-item" onclick="dispatchTitanRelay(0x14, 10003, 'AUDIO_LOAD_03')"><span class="media-tag tag-aud">WAV</span> orchestral_score.wav</div>
                <div class="media-item" onclick="dispatchTitanRelay(0x22, 10004, 'TITLE_LOAD_04')"><span class="media-tag tag-vid">TITL</span> intro_cinematic.mp4</div>
                <div class="media-item"><span class="media-tag tag-img">PNG</span> logo_overlay.png</div>
                <div class="media-item"><span class="media-tag tag-aud">SFX</span> cinematic_boom.mp3</div>
                <div class="pane-header" style="margin-top:auto;">? HARDWARE FX</div>
                <div class="media-item" onclick="dispatchTitanRelay(0x23, 20010, 'AI_DENOISE_TOGGLE')"><span class="media-tag tag-fx">AI</span> Neural Denoise</div>
                <div class="media-item" onclick="dispatchTitanRelay(0x23, 20011, 'LUT_PRINT_TOGGLE')"><span class="media-tag tag-fx">HDR</span> Film Print LUT</div>
                <div class="media-item" onclick="dispatchTitanRelay(0x23, 20012, 'OPTICAL_FLOW_TOGGLE')"><span class="media-tag tag-fx">OPT</span> Optical Flow Ramp</div>
            </div>
        </div>
    </div>`;

code = code.replace(/<!-- LEFT DRAWER[\s\S]*?<!-- CENTER/, newLeftHTML + '\n\n    <!-- CENTER');

// Replace Right Drawer Toggle HTML with SVG
code = code.replace(/<div class="right-drawer-toggle"[^>]*>.*?<\/div>/, `<div class="right-drawer-toggle" onclick="toggleRightDrawer()" title="Toggle Right Inspector Drawer">
            <svg id="right-toggle-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>`);

// Replace toggle JS functions
const newToggleJS = `
function toggleLeftDrawer() {
    const d = document.getElementById('left-drawer');
    const ico = document.getElementById('left-toggle-icon');
    d.classList.toggle('collapsed');
    const isCol = d.classList.contains('collapsed');
    ico.innerHTML = isCol 
        ? '<polyline points="9 18 15 12 9 6"/>' 
        : '<polyline points="15 18 9 12 15 6"/>';
    dispatchTitanRelay(0x23, 11, 'LEFT_DRAWER_' + (isCol ? 'COLLAPSED' : 'EXPANDED'));
}

function toggleRightDrawer() {
    const d = document.getElementById('right-drawer');
    const ico = document.getElementById('right-toggle-icon');
    d.classList.toggle('collapsed');
    const isCol = d.classList.contains('collapsed');
    ico.innerHTML = isCol 
        ? '<polyline points="15 18 9 12 15 6"/>' 
        : '<polyline points="9 18 15 12 9 6"/>';
    dispatchTitanRelay(0x23, 11, 'RIGHT_DRAWER_' + (isCol ? 'COLLAPSED' : 'EXPANDED'));
}
`;

code = code.replace(/function toggleLeftDrawer\(\)[\s\S]*?function toggleRightDrawer\(\)[\s\S]*?\}/, newToggleJS);

fs.writeFileSync('D:/danphe-ui/server_3000.js', code, 'utf8');
console.log('Fixed Left & Right Drawer SVG Toggle Handles!');
