const fs = require('fs');

let c = fs.readFileSync('D:/danphe-ui/server_3000.js', 'utf8');

// Replace left drawer with floating SVG handle
const leftDrawerPattern = /<div class="media-pool[^"]*"[^>]*>[\s\S]*?<div class="center-col">/;
const newLeftDrawer = `<div class="media-pool left-drawer" id="left-drawer" style="position:relative; width:220px; transition:width 0.25s cubic-bezier(0.4, 0, 0.2, 1); z-index:50; overflow:visible; background:#070d18; border-right:1px solid rgba(255,255,255,0.08); display:flex; flex-direction:column; flex-shrink:0;">
        <div id="left-handle-btn" onclick="toggleLeftDrawer()" title="Toggle Left Media Drawer" style="position:absolute; right:-22px; top:50%; transform:translateY(-50%); width:22px; height:46px; background:#0a1220; border:1px solid rgba(56,189,248,0.4); border-left:none; border-radius:0 8px 8px 0; display:flex; align-items:center; justify-content:center; color:#38bdf8; cursor:pointer; z-index:999; box-shadow:4px 0 10px rgba(0,0,0,0.6);">
            <svg id="left-toggle-svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </div>

        <div id="left-inner-content" style="width:220px; height:100%; display:flex; flex-direction:column; overflow:hidden;">
            <div class="pane-header" style="height:32px; background:#0a1220; border-bottom:1px solid rgba(255,255,255,0.07); display:flex; align-items:center; justify-content:space-between; padding:0 10px; font-size:10.5px; font-weight:700; color:#38bdf8;">
                <span>PROJECT ASSETS</span>
                <span style="font-size:8.5px; color:#38bdf8; background:#081b33; padding:1px 5px; border-radius:3px;">REG 10000</span>
            </div>

            <div class="left-tabs" style="display:flex; background:#050914; padding:3px; gap:2px; border-bottom:1px solid rgba(255,255,255,0.05);">
                <button class="tab-btn active" onclick="switchLeftTab(this, 'media')" style="flex:1; background:#0f1a2e; border:none; color:#38bdf8; font-size:9.5px; font-weight:700; padding:5px 0; border-radius:4px; cursor:pointer;">Media</button>
                <button class="tab-btn" onclick="switchLeftTab(this, 'fx')" style="flex:1; background:transparent; border:none; color:#94a3b8; font-size:9.5px; font-weight:700; padding:5px 0; border-radius:4px; cursor:pointer;">Effects</button>
                <button class="tab-btn" onclick="switchLeftTab(this, 'trans')" style="flex:1; background:transparent; border:none; color:#94a3b8; font-size:9.5px; font-weight:700; padding:5px 0; border-radius:4px; cursor:pointer;">Trans</button>
            </div>

            <div style="flex:1; overflow-y:auto;">
                <div class="media-item" onclick="dispatchTitanRelay(0x15, 10001, 'CLIP_LOAD_01')"><span class="media-tag tag-vid">4K</span> master_shot_01.mp4</div>
                <div class="media-item" onclick="dispatchTitanRelay(0x15, 10002, 'CLIP_LOAD_02')"><span class="media-tag tag-vid">RAW</span> b_roll_drone.mp4</div>
                <div class="media-item" onclick="dispatchTitanRelay(0x14, 10003, 'AUDIO_LOAD_03')"><span class="media-tag tag-aud">WAV</span> orchestral_score.wav</div>
                <div class="media-item" onclick="dispatchTitanRelay(0x22, 10004, 'TITLE_LOAD_04')"><span class="media-tag tag-vid">TITL</span> intro_cinematic.mp4</div>
                <div class="media-item"><span class="media-tag tag-img">PNG</span> logo_overlay.png</div>
                <div class="media-item"><span class="media-tag tag-aud">SFX</span> cinematic_boom.mp3</div>
                <div class="pane-header" style="height:28px; background:#0a1220; margin-top:auto; font-size:9.5px; padding:0 8px; color:#38bdf8; display:flex; align-items:center;">HARDWARE FX</div>
                <div class="media-item" onclick="dispatchTitanRelay(0x23, 20010, 'AI_DENOISE_TOGGLE')"><span class="media-tag tag-fx">AI</span> Neural Denoise</div>
                <div class="media-item" onclick="dispatchTitanRelay(0x23, 20011, 'LUT_PRINT_TOGGLE')"><span class="media-tag tag-fx">HDR</span> Film Print LUT</div>
                <div class="media-item" onclick="dispatchTitanRelay(0x23, 20012, 'OPTICAL_FLOW_TOGGLE')"><span class="media-tag tag-fx">OPT</span> Optical Flow Ramp</div>
            </div>
        </div>
    </div>

    <div class="center-col">`;

c = c.replace(leftDrawerPattern, newLeftDrawer);

// Replace JS toggle function
const oldJS = /function toggleLeftDrawer\(\)[\s\S]*?function toggleDrawer\(\)/;
const newJS = `function toggleLeftDrawer() {
    const d = document.getElementById('left-drawer');
    const content = document.getElementById('left-inner-content');
    const svg = document.getElementById('left-toggle-svg');
    const isCol = d.style.width === '0px';
    
    if (isCol) {
        d.style.width = '220px';
        content.style.opacity = '1';
        content.style.pointerEvents = 'auto';
        svg.innerHTML = '<polyline points="15 18 9 12 15 6"/>';
        dispatchTitanRelay(0x23, 11, 'LEFT_DRAWER_EXPANDED');
    } else {
        d.style.width = '0px';
        content.style.opacity = '0';
        content.style.pointerEvents = 'none';
        svg.innerHTML = '<polyline points="9 18 15 12 9 6"/>';
        dispatchTitanRelay(0x23, 11, 'LEFT_DRAWER_COLLAPSED');
    }
}

function toggleRightDrawer() {
    const d = document.getElementById('right-drawer');
    const svg = document.getElementById('right-toggle-svg');
    d.classList.toggle('collapsed');
    const isCol = d.classList.contains('collapsed');
    if (svg) {
        svg.innerHTML = isCol ? '<polyline points="15 18 9 12 15 6"/>' : '<polyline points="9 18 15 12 9 6"/>';
    }
    dispatchTitanRelay(0x23, 11, 'RIGHT_DRAWER_' + (isCol ? 'COLLAPSED' : 'EXPANDED'));
}

function toggleDrawer()`;

c = c.replace(oldJS, newJS);

fs.writeFileSync('D:/danphe-ui/server_3000.js', c, 'utf8');
console.log('Successfully updated server_3000.js with persistent floating SVG drawer toggle!');
