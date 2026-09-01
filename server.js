'use strict';

const http = require('http');
const { 
    TitanAdaptiveIcon,
    ICONS_256,
    TITAN_ICON,
    TITAN_ANIM,
    TITAN_UI,
    TitanUI,
    TitanMasterInput,
    TitanMasterButton,
    TitanMasterCard,
    TitanModal,
    TitanToast,
    TitanTabs,
    TitanTable,
    renderTitanTable,
    TitanButtonGroup,
    renderTitanButtonGroup,
    TitanNavbar,
    renderTitanNavbar,
    INPUT_FLAGS,
    BUTTON_FLAGS,
    CARD_FLAGS,
    TITAN_ADDRESS,
    renderMasterInput,
    renderMasterButton,
    renderMasterCard,
    SevenSegment, 
    MatrixLCD, 
    VectorKeypad, 
    AudioWaveform,
    renderAdaptiveIconSVG,
    renderNepalFlag,
    NepalFlag,
    renderNepaliDateTag,
    NepaliDateTag,
    getNepaliDate,
    renderTitanDrawer,
    TitanDrawer,
    renderTitanProgress,
    TitanProgress,
    renderDanpheLogo,
    DanpheLogo,
    DANPHE_LOGO_CSS,
    renderTitanChart,
    TitanChart,
    CHART_FLAGS,
    renderTitanWhiteboard,
    TitanWhiteboard
} = require('./lib/index.js');

const { EXTENDED_WEB_ICONS } = require('./lib/TitanExtendedIcons.js');
const { renderTitanProSlider } = require('./lib/TitanProSlider.js');
const { renderTitanSvgAnimationCard } = require('./lib/TitanSvgAnimationCard.js');
const { renderTitanSvgTransformCard } = require('./lib/TitanSvgTransformCard.js');
const { renderTitanSvgColorCard } = require('./lib/TitanSvgColorCard.js');
const { renderTitanSvgTypoCard } = require('./lib/TitanSvgTypoCard.js');
const { renderTitanSvgEffectCard } = require('./lib/TitanSvgEffectCard.js');
const { renderTitanSvgMediaCard, MEDIA_CATEGORIES } = require('./lib/TitanSvgMediaCard.js');
const { renderTitanSvgThumbnailCard } = require('./lib/TitanSvgThumbnailCard.js');
const { renderTitanFilmstripToolbar, FILMSTRIP_TOOLS } = require('./lib/TitanFilmstripToolbar.js');
const { generateAnimationCSS, ANIMATIONS_256, KINETIC_TEXT_256 } = require('./animations/index.js');
const { FONTS_256, getFontFromOpcode, generateFontCSS, getGoogleFontsLinkTags } = require('./fonts/index.js');
const { EFFECTS_256, getEffectFromOpcode, renderVfxStrokeOnCanvas } = require('./effects/index.js');
const { TitanCardPCB, TITAN_REG: PCB_REG, INPUT_SIGNAL } = require('./lib/TitanCardPCB.js');

let TitanMicroBus, TITAN_REG, TitanEventEngine;
try {
    const te = require('d:/titan-envent-bus/index.js');
    TitanEventEngine = te.TitanEventEngine;
    TitanMicroBus = te.TitanMicroBus || te.Bus;
    TITAN_REG = te.TITAN_REG || te.REG;
} catch (e1) {
    class MockBus {
        constructor() { this.regs = new Map(); this.subs = new Map(); }
        write(r, v) { this.regs.set(r, v); (this.subs.get(r) || []).forEach(fn => fn(v)); }
        read(r, d = '') { return this.regs.has(r) ? this.regs.get(r) : d; }
        subscribe(r, fn) { if (!this.subs.has(r)) this.subs.set(r, []); this.subs.get(r).push(fn); }
    }
    TitanMicroBus = new MockBus();
    TITAN_REG = {
        SYS_STATUS: 0x4000,
        VIDEO_OPACITY: 0x4100,
        VIDEO_SCALE: 0x4101,
        VIDEO_ROTATION: 0x4102,
        VIDEO_POS_X: 0x4103,
        VIDEO_POS_Y: 0x4104
    };
}

const titanEventEngineSource = (function() {
    try {
        const p = path.resolve('d:/titan-envent-bus/src/TitanEventEngine.js');
        if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8');
    } catch (e) {}
    return '';
})();

const PORT = 3000;

// Initialize defaults
TitanMicroBus.write(1, 'ONLINE');
TitanMicroBus.write(10, 'Dashboard');
TitanMicroBus.write(1000, '101');
TitanMicroBus.write(1010, '512 ICONS & TWINS');
TitanMicroBus.write(1011, '100% INTERACTIVE');

function renderFullPage() {
    // ── NAVBAR ──
    const navbarHtml = renderTitanNavbar({
        brandName: 'DANPHE-UI',
        brandLogo: '🐬',
        systemStatus: '100% OPERATIONAL',
        port: PORT,
        notificationCount: 512,
        userExt: 'Dr. Shankar Phuyal',
        routes: ['Twin-State Pairs', '512 Icons Matrix', 'Hospital ICU', 'Patient Vitals', 'CDR Table'],
        activeRoute: 'Twin-State Pairs'
    });

    // ── 1. STAT CARDS ROW ──
    const stat1 = renderMasterCard({ variant: 'stat', icon: 298, title: 'Twin Binary Pairs', subtitle: '1-Bit Toggle States', value: '10 PAIRS', trend: 'Auto-Morphing', trendUp: true, badge: '1-BIT' });
    const stat2 = renderMasterCard({ variant: 'stat', icon: 1, title: 'Core Telephony', subtitle: 'Telephony & Hardware', value: '256 ICONS', trend: 'Bank 0x00 Active', trendUp: true, badge: '0 - 255' });
    const stat3 = renderMasterCard({ variant: 'stat', icon: 256, title: 'Extended Web Suite', subtitle: 'Lucide & Enterprise', value: '256 ICONS', trend: 'Bank 0x01 Active', trendUp: true, badge: '256 - 511' });
    const stat4 = renderMasterCard({ variant: 'stat', icon: 302, title: 'Total Vector Matrix', subtitle: '16-Bit Icon Map', value: '512 UNIQUE', trend: 'Zero Repetition', trendUp: true, badge: '512 ICONS' });

    // ── 2. TWIN-STATE PAIRS DEFINITIONS ──
    const twinPairsList = [
        { key: 'eye', label: 'Password Eye', onName: 'Eye (Visible)', offName: 'EyeOff (Hidden)' },
        { key: 'lock', label: 'Security Padlock', onName: 'Lock (Locked)', offName: 'Unlock (Open)' },
        { key: 'mic', label: 'Microphone Voice', onName: 'Mic (Unmuted)', offName: 'MicOff (Muted)' },
        { key: 'volume', label: 'Audio Volume', onName: 'Volume (High)', offName: 'Volume (Muted)' },
        { key: 'play', label: 'Media Player', onName: 'Play (Playing)', offName: 'Pause (Paused)' },
        { key: 'wifi', label: 'WiFi Network', onName: 'WiFi (Online)', offName: 'WiFi (Offline)' },
        { key: 'sun', label: 'System Theme', onName: 'Sun (Light Mode)', offName: 'Moon (Dark Mode)' },
        { key: 'toggle', label: 'Hardware Switch', onName: 'Toggle Right (ON)', offName: 'Toggle Left (OFF)' },
        { key: 'user', label: 'User Access', onName: 'User (Verified)', offName: 'User (Blocked)' },
        { key: 'shield', label: 'Firewall Defense', onName: 'Shield (Secured)', offName: 'Shield (Alert)' }
    ];

    const clientTwinMeta = {};
    twinPairsList.forEach(p => {
        clientTwinMeta[p.key] = {
            onName: p.onName,
            offName: p.offName,
            onSvg: renderAdaptiveIconSVG(p.key, 0, 24, false, 0, true),
            offSvg: renderAdaptiveIconSVG(p.key, 0, 24, false, 0, false)
        };
    });

    const twinPairsHtml = twinPairsList.map(pair => {
        const svgOn = renderAdaptiveIconSVG(pair.key, 0, 24, false, 0, true);
        return `
        <div id="twin-card-${pair.key}" class="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 hover:border-cyan-500/50 transition-all shadow-md">
            <div class="flex items-center gap-3.5">
                <div id="twin-icon-box-${pair.key}" class="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all">
                    ${svgOn}
                </div>
                <div>
                    <h3 class="text-xs font-black uppercase tracking-wider text-white font-mono">${pair.label}</h3>
                    <p id="twin-state-label-${pair.key}" class="text-[11px] font-mono text-cyan-300 font-bold">${pair.onName}</p>
                </div>
            </div>

            <!-- Interactive Toggle Switch -->
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked onchange="toggleTwinIcon('${pair.key}', this.checked)" class="sr-only peer">
                <div class="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 shadow-inner"></div>
            </label>
        </div>`;
    }).join('');

    // ── 3. BUILD FULL 512 ICONS ARRAY ──
    const all512Icons = [];
    for (let id = 0; id <= 255; id++) {
        const meta = ICONS_256[id] || { name: 'ICON_' + id, label: 'Core Icon #' + id };
        all512Icons.push({
            id: id,
            category: 'core',
            name: meta.name.replace('TITAN_ICON_', ''),
            label: meta.label,
            svg: renderAdaptiveIconSVG(id, 0, 18, false)
        });
    }
    for (let id = 256; id <= 511; id++) {
        const meta = EXTENDED_WEB_ICONS[id] || { name: 'EXT_' + id, label: 'Extended #' + id };
        let cat = 'web';
        if (id >= 340 && id <= 369) cat = 'fintech';
        if (id >= 370 && id <= 399) cat = 'medical';
        all512Icons.push({
            id: id,
            category: cat,
            name: meta.name,
            label: meta.label,
            svg: renderAdaptiveIconSVG(id, 0, 18, false)
        });
    }

    const iconsGridHtml = all512Icons.map(ic => `
        <div data-cat="${ic.category}" data-name="${ic.name.toLowerCase()}" data-id="${ic.id}" 
             class="icon-tile p-2.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center gap-1.5 hover:border-cyan-400 hover:bg-slate-900 transition-all cursor-pointer group shadow-sm">
            <div class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 group-hover:scale-110 transition-transform">
                ${ic.svg}
            </div>
            <span class="text-[9px] font-mono text-slate-400 group-hover:text-cyan-300 text-center truncate w-full font-bold">${ic.name}</span>
            <span class="text-[8px] font-mono text-slate-600">#${ic.id}</span>
        </div>`).join('');

    const hospitalTableHtml = renderTitanTable({
        variant: 'medical',
        title: 'Hospital ICU & Emergency Patient Roster',
        subtitle: 'Live Biometric Vitals, Attending Doctors & Bed Allocations',
        badge: '4 ACTIVE BEDS'
    });

    // ── 4. BUILD 256 HARDWARE ANIMATIONS MATRIX (BIOMETRICS + TYPOGRAPHY + FX) ──
    const primaryAnims = [
        // Biometrics & Signals
        { id: 0x01, name: 'HEARTBEAT', label: 'Biometric Double Pulse', desc: 'Medical ICU Pulse & ECG', icon: 154, cls: 'titan-anim-heartbeat', dur: '1.2s' },
        { id: 0x02, name: 'RADAR_SWEEP', label: 'Radar Beacon Sweep', desc: '360° radar sweep & ping', icon: 152, cls: 'titan-anim-radar', dur: '2.0s' },
        { id: 0x04, name: 'NEON_BREATHE', label: 'Neon Ambient Glow', desc: '30px glowing breathe loop', icon: 295, cls: 'titan-anim-breathe', dur: '2.4s' },
        { id: 0x07, name: 'TACTILE_SPRING', label: '3D Spring Bounce', desc: 'Physical elastic spring pop', icon: 153, cls: 'titan-anim-spring', dur: '0.6s' },
        { id: 0x08, name: 'CYBER_GLITCH', label: 'Cyber Hologram Glitch', desc: 'RGB chromatic shift glitch', icon: 155, cls: 'titan-anim-glitch', dur: '1.0s' },
        { id: 0x0C, name: 'ELECTRIC_ARC', label: 'High-Voltage Spark', desc: 'Electric discharge rotation', icon: 184, cls: 'titan-anim-spark', dur: '0.7s' },
        { id: 0x0D, name: 'ZERO_G_FLOAT', label: 'Zero-G Float', desc: 'Orbital smooth levitation', icon: 181, cls: 'titan-anim-float', dur: '3.0s' },
        { id: 0x0F, name: 'BEACON_PING', label: 'Sonar Beacon Ping', desc: 'Submarine acoustic ping', icon: 151, cls: 'titan-anim-ping', dur: '1.6s' },
        
        // ✍️ Typography & Kinetic Text Suite (0x40 - 0x5F)
        { id: 0x40, name: 'TYPEWRITER_CURSOR', label: 'Terminal Typewriter |', desc: 'Mechanical Typing with Caret', icon: 175, cls: 'titan-anim-typewriter', dur: '2.0s', isText: true },
        { id: 0x41, name: 'TYPE_SMOOTH_WIPE', label: 'Smooth Char Wipe', desc: 'Cinematic Width Wipe', icon: 180, cls: 'titan-anim-type-wipe', dur: '1.6s', isText: true },
        { id: 0x42, name: 'TYPE_GLITCH_DECRYPT', label: 'Matrix Decrypt Reveal', desc: 'Matrix Scramble to Text', icon: 155, cls: 'titan-anim-type-decrypt', dur: '1.4s', isText: true },
        { id: 0x43, name: 'TYPE_KARAOKE_SWEEP', label: 'Karaoke Lyric Wipe', desc: 'L to R Color Fill Sweep', icon: 182, cls: 'titan-anim-type-karaoke', dur: '2.2s', isText: true },
        { id: 0x44, name: 'TYPE_NEON_FLICKER', label: 'Broadway Neon Spark', desc: 'Humming Neon Letter Glint', icon: 295, cls: 'titan-anim-type-neon', dur: '1.5s', isText: true },
        { id: 0x45, name: 'TYPE_3D_FLIP_IN', label: '3D Letter Cascade', desc: 'X/Y-Axis Tumbling Flip', icon: 181, cls: 'titan-anim-type-3d-flip', dur: '1.2s', isText: true },
        { id: 0x46, name: 'TYPE_ELASTIC_BOUNCE', label: 'Rubber Letter Bounce', desc: 'Gravity Drop & Settle', icon: 153, cls: 'titan-anim-type-bounce', dur: '1.0s', isText: true },
        { id: 0x47, name: 'TYPE_WAVE_SINE', label: 'Sine Wave Floating', desc: 'Harmonic Undulating Letters', icon: 157, cls: 'titan-anim-type-wave', dur: '2.0s', isText: true },
        { id: 0x49, name: 'TYPE_CINEMATIC_TRACK', label: 'Cinematic Tracking', desc: 'Expanding Letter Spacing', icon: 150, cls: 'titan-anim-type-track', dur: '2.5s', isText: true },
        { id: 0x4A, name: 'TYPE_FADE_UP_WORDS', label: 'Ascending Word Blur', desc: 'Smooth Depth Fade Up', icon: 185, cls: 'titan-anim-type-fade-up', dur: '1.2s', isText: true },
        { id: 0x4C, name: 'TYPE_FIRE_BURN_IN', label: 'Fire Ember Glowing', desc: 'Incandescent Flaming Words', icon: 184, cls: 'titan-anim-type-fire', dur: '1.8s', isText: true },
        { id: 0x4D, name: 'TYPE_GOLDEN_SHINE', label: '24K Gold Sheen Beam', desc: 'Metallic Gold Light Sweep', icon: 182, cls: 'titan-anim-type-gold', dur: '2.0s', isText: true },
        { id: 0x50, name: 'TYPE_LASER_ETCH', label: 'Laser Vector Etch', desc: 'High-Precision Laser Burn', icon: 180, cls: 'titan-anim-type-laser', dur: '1.6s', isText: true },
        { id: 0x52, name: 'TYPE_RAINBOW_FLOW', label: 'Liquid Rainbow Hue', desc: 'Spectrum Chromatic Cycle', icon: 182, cls: 'titan-anim-type-rainbow', dur: '3.0s', isText: true },
        { id: 0x53, name: 'TYPE_3D_EXTRUDE', label: '3D Depth Extrude', desc: 'Isometric Depth Shadow', icon: 10, cls: 'titan-anim-type-extrude', dur: '1.5s', isText: true },
        { id: 0x5C, name: 'TYPE_ELECTRIC_ZAP', label: 'Lightning Zap Shock', desc: 'Branching Arc Voltage', icon: 153, cls: 'titan-anim-type-zap', dur: '0.8s', isText: true }
    ];

    const animCardsHtml = primaryAnims.map(a => {
        const svg = renderAdaptiveIconSVG(a.icon, 0, 24, false);
        const hexOpcode = '0x' + a.id.toString(16).toUpperCase().padStart(2, '0');
        const badgeColor = a.isText ? 'text-amber-400 bg-amber-950/80 border-amber-800' : 'text-cyan-400 bg-cyan-950/80 border-cyan-800';
        return `
        <div onclick="selectDemoAnimation('${a.cls}', '${hexOpcode}', '${a.name}', '${a.dur}', ${a.icon}, ${!!a.isText})"
             class="anim-tile p-3 bg-slate-950/90 rounded-2xl border ${a.isText ? 'border-amber-500/40 hover:border-amber-400' : 'border-slate-800 hover:border-cyan-400'} flex flex-col items-center justify-between gap-2 hover:bg-slate-900 transition-all cursor-pointer group shadow-md text-center">
            <div class="flex items-center justify-between w-full">
                <span class="text-[9.5px] font-mono font-black ${badgeColor} px-2 py-0.5 rounded-md border">#${hexOpcode}</span>
                <span class="text-[9px] font-mono text-slate-500 font-bold">${a.isText ? '✍️ TEXT' : a.dur}</span>
            </div>
            <div class="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-inner group-hover:scale-110 transition-transform overflow-visible">
                <div class="${a.cls}">
                    ${a.isText ? '<span class="font-mono font-black text-amber-300 text-sm">Aa</span>' : svg}
                </div>
            </div>
            <div>
                <h4 class="text-[10.5px] font-black uppercase text-white font-mono truncate w-full">${a.name}</h4>
                <p class="text-[9px] text-slate-400 font-mono mt-0.5 truncate w-full">${a.label}</p>
            </div>
        </div>`;
    }).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🐬 Danphe UI Full 512 Vector Suite & 256 Animations</title>
    <script src="https://cdn.tailwindcss.com"></script>
    ${fontLinksHtml}
    <style>
        ${animCss}
        ${fontCss}
        ${DANPHE_LOGO_CSS}
        
        /* 🌈 BULLETPROOF HARDWARE-ACCELERATED 120FPS COLOR & GRADIENT ANIMATIONS */
        @keyframes titanColorWavePulse {
            0% { background-position: 0% 50%; filter: hue-rotate(0deg); }
            50% { background-position: 100% 50%; filter: hue-rotate(180deg); }
            100% { background-position: 0% 50%; filter: hue-rotate(360deg); }
        }

        @keyframes titanCyberMeshFlow {
            0% {
                background: radial-gradient(circle at 20% 20%, #06b6d4 0%, transparent 50%), radial-gradient(circle at 80% 80%, #ec4899 0%, transparent 50%), radial-gradient(circle at 50% 50%, #8b5cf6 0%, transparent 50%), #030712;
            }
            33% {
                background: radial-gradient(circle at 80% 20%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 20% 80%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 50% 50%, #10b981 0%, transparent 50%), #030712;
            }
            66% {
                background: radial-gradient(circle at 50% 80%, #ef4444 0%, transparent 50%), radial-gradient(circle at 50% 20%, #06b6d4 0%, transparent 50%), radial-gradient(circle at 80% 50%, #d946ef 0%, transparent 50%), #030712;
            }
            100% {
                background: radial-gradient(circle at 20% 20%, #06b6d4 0%, transparent 50%), radial-gradient(circle at 80% 80%, #ec4899 0%, transparent 50%), radial-gradient(circle at 50% 50%, #8b5cf6 0%, transparent 50%), #030712;
            }
        }

        .titan-bg-mesh-animated {
            background-size: 200% 200% !important;
            animation: titanCyberMeshFlow 6s ease-in-out infinite !important;
        }

        .titan-bg-gradient-400 {
            background: linear-gradient(-45deg, #f43f5e, #8b5cf6, #06b6d4, #10b981, #f59e0b) !important;
            background-size: 400% 400% !important;
            animation: titanColorWavePulse 5s ease infinite !important;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #090d16; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
    </style>
</head>
<body id="master-page-body" class="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 font-sans transition-all duration-500">

    <!-- 🐬 PURE 3-COLUMN PROFESSIONAL VIDEO STUDIO WORKSPACE -->
    <main class="w-full min-h-screen p-2 m-0 flex flex-col gap-2 max-w-[1920px] mx-auto">
        
        <!-- Top 3-Column Studio Deck -->
        <div class="flex flex-col lg:flex-row items-start justify-center gap-4 w-full px-2">
            
            <!-- LEFT COLUMN (360px): LEFT MEDIA HUB -->
            <div class="w-full lg:w-[360px] flex-shrink-0 flex flex-col items-center justify-start">
                <div id="inspector-card-media-slot" class="w-full max-w-[360px] shadow-2xl">
                    ${renderTitanSvgMediaCard()}
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
                        ${renderTitanFilmstripToolbar({ id: 'titan-filmstrip-toolbar', activeToolId: 'split', height: 28 })}
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
                    ${renderTitanSvgAnimationCard()}
                </div>
                <div id="inspector-card-transform-slot" class="relative transition-all duration-300 w-full max-w-[360px] hidden">
                    ${renderTitanSvgTransformCard()}
                </div>
                <div id="inspector-card-color-slot" class="relative transition-all duration-300 w-full max-w-[360px] hidden">
                    ${renderTitanSvgColorCard()}
                </div>
                <div id="inspector-card-typo-slot" class="relative transition-all duration-300 w-full max-w-[360px] hidden">
                    ${renderTitanSvgTypoCard()}
                </div>
                <div id="inspector-card-vfx-slot" class="relative transition-all duration-300 w-full max-w-[360px] hidden">
                    ${renderTitanSvgEffectCard()}
                </div>
                <div id="inspector-card-thumb-slot" class="relative transition-all duration-300 w-full max-w-[360px] hidden">
                    ${renderTitanSvgThumbnailCard()}
                </div>
            </div>

        </div>

        <!-- Real-time I/O Stream Terminal -->
        <footer class="w-full p-3 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col gap-1 shadow-2xl">
            <div class="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-900 text-[10px]">
                <span class="text-cyan-400 font-bold flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    🐬 DANPHE UI &amp; TITAN HARDWARE PCB BUS &bull; 120 FPS REALTIME STUDIO
                </span>
                <span class="text-emerald-400 font-bold">STATUS: 100% ONLINE</span>
            </div>
            <div id="io-terminal" class="text-cyan-300 text-[11px] min-h-[22px] flex items-center">
                Ready. Drag on Canvas to pan, scroll mouse wheel to zoom, or select any tool from the toolbar...
            </div>
        </footer>

    </main>

    <!-- Client-side Interactive Script -->
    <script>
        const GLOBAL_FONTS_256 = ${JSON.stringify(FONTS_256)};
        const GLOBAL_EFFECTS_256 = ${JSON.stringify(EFFECTS_256)};
        ${titanEventEngineSource}

        // ── ⚡ TITAN OPCODE COMMUNICATION BUS (STANDALONE CLIENT INSTANCE) ──
        const TitanOpcodeBus = (function() {
            const listeners = new Map();
            const history = [];
            return {
                PROTOCOL: {
                    MAGIC: 0x54495441,
                    VERSION: '1.0.0',
                    EVENTS: {
                        CARD_OPCODE_CHANGED: 'TITAN:CARD_OPCODE_CHANGED',
                        CARD_STAGE_CHANGED: 'TITAN:CARD_STAGE_CHANGED',
                        CARD_APPLY_TRIGGERED: 'TITAN:CARD_APPLY_TRIGGERED',
                        TIMELINE_LAYER_SELECTED: 'TITAN:TIMELINE_LAYER_SELECTED',
                        TIMELINE_RANGE_DRAWN: 'TITAN:TIMELINE_RANGE_DRAWN',
                        TIMELINE_CUT_TRIGGERED: 'TITAN:TIMELINE_CUT_TRIGGERED'
                    }
                },
                subscribe: function(event, cb) {
                    if (!listeners.has(event)) listeners.set(event, new Set());
                    listeners.get(event).add(cb);
                    return () => { if (listeners.has(event)) listeners.get(event).delete(cb); };
                },
                dispatch: function(event, payload) {
                    const packet = {
                        magic: 0x54495441,
                        timestamp: Date.now(),
                        action: event,
                        sender: (payload && payload.sender) || 'titan_card',
                        target: (payload && payload.target) || 'timeline',
                        data: payload || {}
                    };
                    history.push(packet);
                    if (history.length > 50) history.shift();
                    if (listeners.has(event)) {
                        listeners.get(event).forEach(fn => { try { fn(packet); } catch(e) {} });
                    }
                    return packet;
                },
                getHistory: () => [...history]
            };
        })();
        window.TitanOpcodeBus = TitanOpcodeBus;

        const twinMeta = ${JSON.stringify(clientTwinMeta)};
        const clientAnimMap = ${JSON.stringify(ANIMATIONS_256)};
        const clientTextAnimMap = ${JSON.stringify(KINETIC_TEXT_256)};
        let currentMasterOpcode = 1;
        let currentMasterIconId = 154;
        let autoCycleTimer = null;

        const testIconsSvg = {
            154: '<svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
            153: '<svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
            155: '<svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>',
            184: '<svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
            10: '<svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
            150: '<svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>'
        };

        let isTextStageMode = false;
        let customPreviewText = 'DANPHE TITAN';
        let currentClockDurationSec = 1.0;

        function setClockPulseMs(ms) {
            const val = parseInt(ms, 10) || 1000;
            currentClockDurationSec = parseFloat((val / 1000).toFixed(2));
            const hz = (1 / currentClockDurationSec).toFixed(2);
            const bpm = Math.round(60 / currentClockDurationSec);

            const msLabel = document.getElementById('clock-ms-val');
            if (msLabel) msLabel.innerText = val + 'ms';
            const slider = document.getElementById('clock-pulse-slider');
            if (slider) slider.value = val;
            const badge = document.getElementById('clock-telemetry-badge');
            if (badge) badge.innerText = currentClockDurationSec + 's (' + hz + ' Hz / ' + bpm + ' BPM)';

            updateMasterStageUI(currentMasterOpcode);
        }

        function setMasterStageMode(mode) {
            isTextStageMode = (mode === 'text');
            const iconBtn = document.getElementById('btn-mode-icon');
            const textBtn = document.getElementById('btn-mode-text');
            const customTextInput = document.getElementById('custom-text-input-wrap');

            if (isTextStageMode) {
                if (textBtn) textBtn.className = 'px-3 py-1 bg-amber-500 text-slate-950 text-xs font-mono font-black rounded-lg shadow transition';
                if (iconBtn) iconBtn.className = 'px-3 py-1 bg-slate-800 text-slate-300 text-xs font-mono font-bold rounded-lg hover:bg-slate-700 transition';
                if (customTextInput) customTextInput.style.display = 'flex';
            } else {
                if (iconBtn) iconBtn.className = 'px-3 py-1 bg-cyan-600 text-slate-950 text-xs font-mono font-black rounded-lg shadow transition';
                if (textBtn) textBtn.className = 'px-3 py-1 bg-slate-800 text-slate-300 text-xs font-mono font-bold rounded-lg hover:bg-slate-700 transition';
                if (customTextInput) customTextInput.style.display = 'none';
            }
            updateMasterStageUI(currentMasterOpcode);
        }

        function updateCustomText(val) {
            customPreviewText = val || 'DANPHE TITAN';
            updateMasterStageUI(currentMasterOpcode);
        }

        function setMasterTestIcon(id) {
            currentMasterIconId = id;
            isTextStageMode = false;
            const container = document.getElementById('master-anim-inner-icon');
            if (container && testIconsSvg[id]) {
                container.innerHTML = testIconsSvg[id];
            }
            updateMasterStageUI(currentMasterOpcode);
        }

        function setOpcodeFromNumber(val) {
            let num = parseInt(val, 10);
            if (isNaN(num)) num = 0;
            num = Math.max(0, Math.min(255, num));
            currentMasterOpcode = num;
            updateMasterStageUI(num);
        }

        function stepOpcode(delta) {
            let next = (currentMasterOpcode + delta) % 256;
            if (next < 0) next = 255;
            currentMasterOpcode = next;
            updateMasterStageUI(next);
        }

        function updateMasterStageUI(num) {
            const meta = clientAnimMap[num] || { name: 'ANIM_' + num, cssClass: 'titan-anim-idle', duration: '1.0s' };
            const hex = '0x' + num.toString(16).toUpperCase().padStart(2, '0');
            const bin = num.toString(2).padStart(8, '0');
            const isTextAnim = (num >= 0x40 && num <= 0x5F) || isTextStageMode;
            const durStyle = 'animation-duration: ' + currentClockDurationSec + 's !important;';

            const numInp = document.getElementById('opcode-num-input');
            if (numInp) numInp.value = num;
            const slider = document.getElementById('opcode-slider');
            if (slider) slider.value = num;
            const sLabel = document.getElementById('slider-val-label');
            if (sLabel) sLabel.innerText = 'Opcode #' + num + ' / 255' + (isTextAnim ? ' (✍️ Typography)' : '');
            const tHex = document.getElementById('telemetry-hex');
            if (tHex) tHex.innerText = hex;
            const tBin = document.getElementById('telemetry-bin');
            if (tBin) tBin.innerText = bin;
            const nBadge = document.getElementById('master-anim-name-badge');
            if (nBadge) {
                nBadge.innerText = meta.name;
                nBadge.className = isTextAnim 
                    ? 'text-xs font-mono font-black text-amber-300 bg-amber-950/90 px-3.5 py-1 rounded-full border border-amber-700 shadow-sm uppercase tracking-wider'
                    : 'text-xs font-mono font-black text-cyan-300 bg-cyan-950/90 px-3.5 py-1 rounded-full border border-cyan-700 shadow-sm uppercase tracking-wider';
            }
            const codeBox = document.getElementById('master-anim-code');
            if (codeBox) {
                codeBox.innerText = isTextAnim 
                    ? '<TitanTypography text="' + customPreviewText + '" anim={' + hex + '} speed={' + currentClockDurationSec + '} />'
                    : '<TitanIcon icon={' + currentMasterIconId + '} anim={' + hex + '} speed={' + currentClockDurationSec + '} />';
            }
            const cssClassBox = document.getElementById('master-anim-css-class');
            if (cssClassBox) cssClassBox.innerHTML = 'Class: <b class="text-white font-bold">' + meta.cssClass + '</b> (Clock: <span class="text-amber-300 font-bold">' + currentClockDurationSec + 's</span>)';

            const container = document.getElementById('master-anim-inner-icon');
            if (container) {
                // Clear any existing text intervals
                if (window.__titanTypewriterTimer) { clearInterval(window.__titanTypewriterTimer); window.__titanTypewriterTimer = null; }
                if (window.__titanDecryptTimer) { clearInterval(window.__titanDecryptTimer); window.__titanDecryptTimer = null; }

                if (isTextAnim) {
                    const textStr = customPreviewText || 'DANPHE TITAN';

                    // 1. 🖨️ REAL MECHANICAL TYPEWRITER (0x40)
                    if (num === 0x40) {
                        let currentIdx = 0;
                        container.innerHTML = '<div class="font-mono font-black text-base sm:text-lg tracking-widest text-cyan-300 text-center px-2 flex items-center justify-center"><span id="tw-text-chars"></span><span class="w-2.5 h-6 bg-cyan-400 inline-block ml-1 titan-anim-typewriter" style="' + durStyle + '"></span></div>';
                        const charsEl = document.getElementById('tw-text-chars');
                        const speedMs = Math.max(30, Math.floor(currentClockDurationSec * 100));
                        
                        window.__titanTypewriterTimer = setInterval(() => {
                            currentIdx++;
                            if (currentIdx > textStr.length + 8) {
                                currentIdx = 0;
                            }
                            if (charsEl) {
                                charsEl.innerText = textStr.substring(0, Math.min(textStr.length, currentIdx));
                            }
                        }, speedMs);
                    }
                    // 2. 🔐 MATRIX GLITCH DECRYPT ENGINE (0x42)
                    else if (num === 0x42) {
                        const glyphs = '01#%&*+=-_~/?$!<>@[]{}';
                        let frameCount = 0;
                        container.innerHTML = '<div id="decrypt-chars" class="font-mono font-black text-base sm:text-lg tracking-widest text-emerald-400 text-center px-2 titan-anim-type-decrypt" style="' + durStyle + '"></div>';
                        const decEl = document.getElementById('decrypt-chars');
                        const speedMs = Math.max(30, Math.floor(currentClockDurationSec * 60));
                        
                        window.__titanDecryptTimer = setInterval(() => {
                            frameCount++;
                            const revealedLen = Math.floor(frameCount / 4) % (textStr.length + 10);
                            let rendered = '';
                            for (let i = 0; i < textStr.length; i++) {
                                if (i < revealedLen) {
                                    rendered += textStr[i];
                                } else {
                                    rendered += glyphs[Math.floor(Math.random() * glyphs.length)];
                                }
                            }
                            if (decEl) decEl.innerText = rendered;
                        }, speedMs);
                    }
                    // 3. 🏃 SMOOTH MARQUEE RUNNER (0x43)
                    else if (num === 0x43) {
                        const marqueeDur = (currentClockDurationSec * 3.5).toFixed(2);
                        container.innerHTML = '<div class="w-full overflow-hidden whitespace-nowrap"><div class="titan-anim-type-marquee font-mono font-black text-base sm:text-lg tracking-widest text-amber-300 inline-block px-4" style="animation-duration: ' + marqueeDur + 's !important;">' + textStr + ' &bull; ' + textStr + '</div></div>';
                    }
                    // 4. 🌟 WORLD-CLASS STAGGERED CHARACTER KINETIC TYPOGRAPHY
                    else {
                        const chars = textStr.split('').map((ch, idx) => {
                            const delay = (idx * (currentClockDurationSec * 0.05)).toFixed(2);
                            const displayChar = ch === ' ' ? '&nbsp;' : ch;
                            return '<span class="' + meta.cssClass + '" style="display:inline-block;animation-delay:' + delay + 's;' + durStyle + '">' + displayChar + '</span>';
                        }).join('');
                        container.innerHTML = '<div class="font-mono font-black text-base sm:text-lg tracking-widest select-none text-center px-2">' + chars + '</div>';
                    }
                } else if (testIconsSvg[currentMasterIconId]) {
                    container.innerHTML = '<div class="' + meta.cssClass + '" style="' + durStyle + '">' + testIconsSvg[currentMasterIconId] + '</div>';
                }
            }

            const box = document.getElementById('master-anim-box');
            if (box) {
                // The stage box remains stable as an elegant neon frame
                const borderClass = isTextAnim ? 'border-amber-400 text-amber-300' : 'border-cyan-400 text-cyan-300';
                box.className = 'relative w-40 h-40 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-950 border-2 ' + borderClass + ' flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.4)] transition-all overflow-hidden';
            }

            const term = document.getElementById('io-terminal');
            if (term) term.innerHTML = '<span class="text-cyan-400">⚡ OPCODE MASTER:</span> <b class="text-white">' + meta.name + '</b> (' + hex + ' / Dec: ' + num + ') ➔ <span class="text-emerald-300 font-bold">' + meta.duration + ' 120FPS GPU Keyframe</span>';
        }

        function toggleAutoCycle() {
            const btn = document.getElementById('btn-auto-cycle');
            if (autoCycleTimer) {
                clearInterval(autoCycleTimer);
                autoCycleTimer = null;
                btn.className = 'w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono text-xs font-black rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] transition flex items-center justify-center gap-2';
                btn.innerHTML = '<span>▶</span> <span>Auto-Cycle (0-255 Loop)</span>';
            } else {
                btn.className = 'w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-black rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.4)] transition flex items-center justify-center gap-2';
                btn.innerHTML = '<span>⏹</span> <span>Stop Auto-Cycle</span>';
                autoCycleTimer = setInterval(() => {
                    stepOpcode(1);
                }, 800);
            }
        }

        function selectDemoAnimation(cls, opcodeHex, name, dur, iconId, isText) {
            const num = parseInt(opcodeHex, 16);
            if (!isNaN(num)) {
                if (isText) isTextStageMode = true;
                setMasterTestIcon(iconId);
                setOpcodeFromNumber(num);
            }
        }

        // ── 🌈 100% LINEAR PARAMETRIC TITAN MATH ENGINE (OPCODE 0 - 255) ──
        let currentBgOpcode = 0;
        let currentBgSpeed = 1.5;
        let currentBgMode = 'flower'; // 'flower', 'bubble', 'fluid', 'mesh', 'aurora', 'cosmic'
        let isPageBgActive = false;
        let bgAutoCycleTimer = null;
        let bgCanvasAnimFrame = null;
        let bgTime = 0;

        let isCustomColorMode = false;
        let customPalette = {
            c1: '#06b6d4',
            c2: '#ec4899',
            c3: '#facc15',
            name: 'Custom Brand Palette'
        };

        function hexToRgba(hex, alpha) {
            let c = (hex || '#ffffff').replace('#', '');
            if (c.length === 3) c = c.split('').map(x => x + x).join('');
            const num = parseInt(c, 16);
            const r = (num >> 16) & 255;
            const g = (num >> 8) & 255;
            const b = num & 255;
            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
        }

        function toggleCustomColorMode() {
            isCustomColorMode = !isCustomColorMode;
            const btn = document.getElementById('btn-toggle-custom-color');
            const lbl = document.getElementById('lbl-custom-color-mode');
            if (isCustomColorMode) {
                if (btn) btn.className = 'px-2.5 py-1 bg-emerald-500 text-slate-950 text-[10px] font-mono font-black rounded-lg border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition animate-pulse';
                if (lbl) lbl.innerText = 'Brand Mode: ACTIVE ✅';
            } else {
                if (btn) btn.className = 'px-2.5 py-1 bg-slate-800 hover:bg-purple-600 hover:text-slate-950 text-slate-300 text-[10px] font-mono font-black rounded-lg border border-slate-700 transition';
                if (lbl) lbl.innerText = 'Enable Custom Brand Mode';
            }
            updateBgStageUI();
        }

        function setCustomColor(index, hex) {
            isCustomColorMode = true;
            const btn = document.getElementById('btn-toggle-custom-color');
            const lbl = document.getElementById('lbl-custom-color-mode');
            if (btn) btn.className = 'px-2.5 py-1 bg-emerald-500 text-slate-950 text-[10px] font-mono font-black rounded-lg border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition animate-pulse';
            if (lbl) lbl.innerText = 'Brand Mode: ACTIVE ✅';

            if (index === 1) {
                customPalette.c1 = hex;
                const el = document.getElementById('custom-c1-hex');
                if (el) el.innerText = hex.toUpperCase();
            } else if (index === 2) {
                customPalette.c2 = hex;
                const el = document.getElementById('custom-c2-hex');
                if (el) el.innerText = hex.toUpperCase();
            } else if (index === 3) {
                customPalette.c3 = hex;
                const el = document.getElementById('custom-c3-hex');
                if (el) el.innerText = hex.toUpperCase();
            }
            updateBgStageUI();
        }

        function applyBrandPreset(c1, c2, c3, name) {
            isCustomColorMode = true;
            customPalette.c1 = c1;
            customPalette.c2 = c2;
            customPalette.c3 = c3;
            customPalette.name = name;

            const i1 = document.getElementById('custom-c1-input');
            if (i1) i1.value = c1;
            const h1 = document.getElementById('custom-c1-hex');
            if (h1) h1.innerText = c1.toUpperCase();

            const i2 = document.getElementById('custom-c2-input');
            if (i2) i2.value = c2;
            const h2 = document.getElementById('custom-c2-hex');
            if (h2) h2.innerText = c2.toUpperCase();

            const i3 = document.getElementById('custom-c3-input');
            if (i3) i3.value = c3;
            const h3 = document.getElementById('custom-c3-hex');
            if (h3) h3.innerText = c3.toUpperCase();

            const btn = document.getElementById('btn-toggle-custom-color');
            const lbl = document.getElementById('lbl-custom-color-mode');
            if (btn) btn.className = 'px-2.5 py-1 bg-emerald-500 text-slate-950 text-[10px] font-mono font-black rounded-lg border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition animate-pulse';
            if (lbl) lbl.innerText = 'Brand Mode: ACTIVE ✅';

            updateBgStageUI();
        }

        // Continuous Linear Parametric Opcode Color Vector (0x00 - 0xFF)
        function getBgColors(opcode) {
            if (isCustomColorMode) {
                return {
                    name: customPalette.name || 'CUSTOM BRAND PALETTE',
                    c1: customPalette.c1,
                    c2: customPalette.c2,
                    c3: customPalette.c3,
                    rgba1: (a) => hexToRgba(customPalette.c1, a),
                    rgba2: (a) => hexToRgba(customPalette.c2, a),
                    rgba3: (a) => hexToRgba(customPalette.c3, a),
                    harmony: '<span class="text-emerald-400 font-bold">CUSTOM BRAND:</span> ' + customPalette.c1 + ' &bull; ' + customPalette.c2 + ' &bull; ' + customPalette.c3
                };
            }

            const code = opcode || 0;
            const h1 = Math.round((code * 1.40625) % 360);
            const h2 = Math.round((h1 + 60 + ((code * 7) % 80)) % 360);
            const h3 = Math.round((h1 + 180 + ((code * 11) % 60)) % 360);
            const sat = 85 + (code % 15);
            const light = 50 + (code % 15);

            return {
                name: 'TITAN HARMONIC 0x' + code.toString(16).toUpperCase().padStart(2, '0') + ' (k=' + ((code % 14) + 3) + ')',
                c1: 'hsl(' + h1 + ', ' + sat + '%, ' + light + '%)',
                c2: 'hsl(' + h2 + ', ' + sat + '%, ' + (light - 5) + '%)',
                c3: 'hsl(' + h3 + ', ' + sat + '%, ' + (light + 10) + '%)',
                rgba1: (a) => 'hsla(' + h1 + ', ' + sat + '%, ' + light + '%, ' + a + ')',
                rgba2: (a) => 'hsla(' + h2 + ', ' + sat + '%, ' + (light - 5) + '%, ' + a + ')',
                rgba3: (a) => 'hsla(' + h3 + ', ' + sat + '%, ' + (light + 10) + '%, ' + a + ')',
                h1: h1, h2: h2, h3: h3,
                harmony: h1 + '° Spectrum &bull; ' + ((code % 14) + 3) + ' Harmonics'
            };
        }

        function setBgOpcodeFromNumber(val) {
            let num = parseInt(val, 10);
            if (isNaN(num)) num = 0;
            num = Math.max(0, Math.min(255, num));
            currentBgOpcode = num;
            updateBgStageUI();
        }

        function stepBgOpcode(delta) {
            let next = (currentBgOpcode + delta) % 256;
            if (next < 0) next = 255;
            currentBgOpcode = next;
            updateBgStageUI();
        }

        function selectBgPreset(code, name) {
            currentBgOpcode = code;
            updateBgStageUI();
        }

        function setBgSpeed(val) {
            currentBgSpeed = (parseInt(val, 10) / 10).toFixed(1);
            const label = document.getElementById('bg-speed-val');
            if (label) label.innerText = currentBgSpeed + 'x';
            updateBgStageUI();
        }

        function setBgEngineMode(mode) {
            currentBgMode = mode;
            updateBgStageUI();
        }

        function togglePageBackgroundMode() {
            isPageBgActive = !isPageBgActive;
            const btn = document.getElementById('btn-toggle-page-bg');
            const body = document.getElementById('master-page-body') || document.body;
            if (isPageBgActive) {
                body.classList.add('titan-bg-gradient-400');
                if (btn) {
                    btn.className = 'px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-black rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.5)] transition flex items-center gap-1.5 animate-pulse';
                    btn.innerHTML = '<span>⏹</span> <span>Reset Page BG</span>';
                }
            } else {
                body.classList.remove('titan-bg-gradient-400');
                body.style.background = '';
                if (btn) {
                    btn.className = 'px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-slate-950 text-xs font-mono font-black rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.5)] transition flex items-center gap-1.5';
                    btn.innerHTML = '<span>🖥️</span> <span>Apply to Full Page BG</span>';
                }
            }
        }

        function getLinearModelFromOpcode(code) {
            if (code <= 47) return { mode: 'flower', name: '🌸 Lotus Rose Bloom (k=' + ((code % 14) + 3) + ' Petals)' };
            if (code <= 95) return { mode: 'bubble', name: '🫧 Iridescent Bubbles (' + (8 + (code % 24)) + ' Spheres)' };
            if (code <= 143) return { mode: 'fluid', name: '🌊 Harmonic Ocean Waves (Amp ' + (25 + (code % 25)) + 'px)' };
            if (code <= 191) return { mode: 'mesh', name: '🔮 4-Focus GPU Liquid Mesh' };
            if (code <= 223) return { mode: 'aurora', name: '🌌 Nordic Aurora Curtains' };
            return { mode: 'cosmic', name: '🪐 Fibonacci Galaxy Vortex (' + ((code % 6) + 2) + ' Arms)' };
        }

        function updateBgStageUI() {
            const p = getBgColors(currentBgOpcode);
            const model = getLinearModelFromOpcode(currentBgOpcode);
            const hex = '0x' + currentBgOpcode.toString(16).toUpperCase().padStart(2, '0');

            const inp = document.getElementById('bg-opcode-input');
            if (inp) inp.value = currentBgOpcode;
            const slider = document.getElementById('bg-opcode-slider');
            if (slider) slider.value = currentBgOpcode;
            const sLabel = document.getElementById('bg-slider-val-label');
            if (sLabel) sLabel.innerText = 'Linear Opcode #' + currentBgOpcode + ' / 255 ➔ ' + model.name;
            const tHex = document.getElementById('bg-telemetry-hex');
            if (tHex) tHex.innerText = hex;
            const tRgb = document.getElementById('bg-telemetry-rgb');
            if (tRgb) tRgb.innerHTML = p.harmony;
            const title = document.getElementById('bg-live-title');
            if (title) title.innerText = model.name;
            const jsxCode = document.getElementById('bg-code-jsx');
            if (jsxCode) {
                if (isCustomColorMode) {
                    jsxCode.innerText = '<TitanBackground\\n  mode="' + model.mode + '"\\n  customColors={["' + customPalette.c1 + '", "' + customPalette.c2 + '", "' + customPalette.c3 + '"]}\\n  speed={' + currentBgSpeed + '} />';
                } else {
                    jsxCode.innerText = '<TitanBackground\\n  opcode={' + hex + '}\\n  mode="' + model.mode + '"\\n  speed={' + currentBgSpeed + '} />';
                }
            }

            const term = document.getElementById('io-terminal');
            if (term) term.innerHTML = '<span class="text-purple-400">🌈 TITAN LINEAR SPECTRUM:</span> <b class="text-white">' + model.name + '</b> (' + hex + ') ➔ <span class="text-emerald-300 font-bold">Continuous 16-Bit Parametric Math @ 120FPS</span>';
        }

        function toggleBgAutoCycle() {
            const btn = document.getElementById('btn-bg-auto-cycle');
            if (bgAutoCycleTimer) {
                clearInterval(bgAutoCycleTimer);
                bgAutoCycleTimer = null;
                if (btn) {
                    btn.className = 'w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-slate-950 font-mono text-xs font-black rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] transition flex items-center justify-center gap-2';
                    btn.innerHTML = '<span>▶</span> <span>Auto-Cycle Palettes (0-255)</span>';
                }
            } else {
                if (btn) {
                    btn.className = 'w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-black rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.4)] transition flex items-center justify-center gap-2';
                    btn.innerHTML = '<span>⏹</span> <span>Stop Palette Auto-Cycle</span>';
                }
                bgAutoCycleTimer = setInterval(() => {
                    stepBgOpcode(1);
                }, 400);
            }
        }

        // 🎨 120 FPS REAL-TIME CANVAS CONTINUOUS PROCEDURAL ENGINE
        function renderBgCanvasLoop() {
            try {
                const canvas = document.getElementById('titan-bg-canvas');
                const gpuLayer = document.getElementById('titan-bg-gpu-layer');
                const code = currentBgOpcode;
                const p = getBgColors(code);
                const currentBgMode = getLinearModelFromOpcode(code).mode;

                // Update GPU CSS Layer dynamically with valid HSLA
                if (gpuLayer) {
                    gpuLayer.style.background = 'radial-gradient(circle at 10% 20%, ' + p.rgba1(0.7) + ' 0%, transparent 60%), radial-gradient(circle at 90% 80%, ' + p.rgba2(0.7) + ' 0%, transparent 60%), radial-gradient(circle at 50% 100%, ' + p.rgba3(0.7) + ' 0%, transparent 70%), #030712';
                }

                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    const w = canvas.width;
                    const h = canvas.height;
                    bgTime += 0.025 * parseFloat(currentBgSpeed);

                    // Clear background
                    ctx.clearRect(0, 0, w, h);

                    // 🌸 1. PROCEDURAL BLOOMING ROSE / LOTUS (0x00 - 0x2F / 0 - 47)
                    if (currentBgMode === 'flower') {
                        const cx = w / 2;
                        const cy = h / 2;
                        const petalCount = (code % 14) + 3; // 3 to 16 petals linear!
                        const pulse = Math.sin(bgTime * 1.5) * 0.18 + 0.92;
                        const layers = (code % 3) + 2; // 2 to 4 layers
                        
                        for (let layer = layers; layer >= 1; layer--) {
                            const layerRadius = (45 + layer * 24 + (code % 20)) * pulse;
                            const layerAngleOffset = bgTime * (layer % 2 === 0 ? 0.35 : -0.35) + (layer * 0.5);
                            const col = layer === 1 ? p.c1 : (layer === 2 ? p.c2 : p.c3);
                            
                            ctx.save();
                            ctx.translate(cx, cy);
                            ctx.rotate(layerAngleOffset);
                            
                            for (let i = 0; i < petalCount; i++) {
                                const angle = (i * 2 * Math.PI) / petalCount;
                                ctx.save();
                                ctx.rotate(angle);
                                
                                const pGrad = ctx.createRadialGradient(0, layerRadius * 0.5, 4, 0, layerRadius * 0.5, layerRadius * 0.65);
                                pGrad.addColorStop(0, col);
                                pGrad.addColorStop(0.7, p.c2);
                                pGrad.addColorStop(1, 'transparent');
                                ctx.fillStyle = pGrad;
                                ctx.globalAlpha = 0.7;

                                ctx.beginPath();
                                ctx.ellipse(0, layerRadius * 0.5, layerRadius * (0.22 + (code % 8) * 0.02), layerRadius * 0.55, 0, 0, 2 * Math.PI);
                                ctx.fill();
                                
                                ctx.strokeStyle = '#ffffff';
                                ctx.lineWidth = 1.2;
                                ctx.globalAlpha = 0.5;
                                ctx.stroke();
                                
                                ctx.restore();
                            }
                            ctx.restore();
                        }
                        
                        // Center Core
                        const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 30 * pulse);
                        coreGrad.addColorStop(0, '#ffffff');
                        coreGrad.addColorStop(0.4, p.c1);
                        coreGrad.addColorStop(1, 'transparent');
                        ctx.fillStyle = coreGrad;
                        ctx.beginPath();
                        ctx.arc(cx, cy, 30 * pulse, 0, 2 * Math.PI);
                        ctx.fill();

                        // Pollen Sparkles
                        const sparkleCount = petalCount * 2;
                        for (let s = 0; s < sparkleCount; s++) {
                            const sAngle = bgTime * 1.8 + s * (2 * Math.PI / sparkleCount);
                            const sDist = (35 + s * 4) * (0.85 + 0.15 * Math.sin(bgTime * 3 + s));
                            const sx = cx + Math.cos(sAngle) * sDist;
                            const sy = cy + Math.sin(sAngle) * sDist;
                            ctx.fillStyle = s % 2 === 0 ? '#fef08a' : '#ffffff';
                            ctx.beginPath();
                            ctx.arc(sx, sy, 2 + (s % 2), 0, 2 * Math.PI);
                            ctx.fill();
                        }

                    // 🫧 2. PROCEDURAL FLOATING IRIDESCENT BUBBLES (0x30 - 0x5F / 48 - 95)
                    } else if (currentBgMode === 'bubble') {
                        const bubbleCount = 8 + (code % 24); // 8 to 32 bubbles linear!
                        
                        for (let i = 0; i < bubbleCount; i++) {
                            const seed = (i + 1) * 97;
                            const bSpeed = 0.5 + (seed % 10) * 0.15;
                            const bSize = 12 + (seed % 20);
                            const by = (h + bSize * 2) - ((bgTime * bSpeed * 50 + seed * 20) % (h + bSize * 4));
                            const bx = ((seed * 37) % w) + Math.sin(bgTime * (1 + (seed % 3) * 0.5) + seed) * (15 + (code % 15));
                            
                            ctx.save();
                            ctx.translate(bx, by);

                            // Bubble Body with valid hsla colors
                            const bGrad = ctx.createRadialGradient(-bSize * 0.3, -bSize * 0.3, bSize * 0.1, 0, 0, bSize);
                            bGrad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
                            bGrad.addColorStop(0.5, p.rgba1(0.3));
                            bGrad.addColorStop(0.85, p.rgba2(0.5));
                            bGrad.addColorStop(1, p.rgba3(0.7));
                            ctx.fillStyle = bGrad;
                            ctx.beginPath();
                            ctx.arc(0, 0, bSize, 0, 2 * Math.PI);
                            ctx.fill();

                            // Rim
                            ctx.strokeStyle = p.c1;
                            ctx.lineWidth = 1.5;
                            ctx.globalAlpha = 0.8;
                            ctx.stroke();

                            // Glint
                            ctx.fillStyle = '#ffffff';
                            ctx.globalAlpha = 0.9;
                            ctx.beginPath();
                            ctx.ellipse(-bSize * 0.38, -bSize * 0.38, bSize * 0.3, bSize * 0.14, -Math.PI / 4, 0, 2 * Math.PI);
                            ctx.fill();

                            ctx.restore();
                        }

                    // 🌊 3. PROCEDURAL FLUID WAVES (0x60 - 0x8F / 96 - 143)
                    } else if (currentBgMode === 'fluid') {
                        const layers = 3;
                        const freq = 0.012 + (code % 10) * 0.002;
                        const amp = 25 + (code % 25);

                        for (let layer = 0; layer < layers; layer++) {
                            ctx.save();
                            ctx.globalAlpha = 0.65 + layer * 0.12;
                            const grad = ctx.createLinearGradient(0, 0, w, h);
                            grad.addColorStop(0, p.c1);
                            grad.addColorStop(0.5, p.c2);
                            grad.addColorStop(1, p.c3);
                            ctx.fillStyle = grad;

                            ctx.beginPath();
                            ctx.moveTo(0, h);
                            const speedOffset = (layer + 1) * 1.5;
                            const baseHeight = h * (0.32 + layer * 0.18);

                            for (let x = 0; x <= w; x += 5) {
                                const y = baseHeight + Math.sin(x * freq + bgTime * speedOffset) * (amp - layer * 5) + Math.cos(x * (freq * 0.7) - bgTime * 1.2) * 15;
                                ctx.lineTo(x, y);
                            }
                            ctx.lineTo(w, h);
                            ctx.lineTo(0, h);
                            ctx.closePath();
                            ctx.fill();
                            ctx.restore();
                        }

                    // 🔮 4. GPU MESH (0x90 - 0xBF / 144 - 191)
                    } else if (currentBgMode === 'mesh') {
                        const cx1 = w * 0.3 + Math.cos(bgTime) * (w * 0.3);
                        const cy1 = h * 0.3 + Math.sin(bgTime * 1.2) * (h * 0.3);
                        const rGrad1 = ctx.createRadialGradient(cx1, cy1, 10, cx1, cy1, w * 0.7);
                        rGrad1.addColorStop(0, p.c1);
                        rGrad1.addColorStop(1, 'transparent');
                        ctx.fillStyle = rGrad1;
                        ctx.fillRect(0, 0, w, h);

                        const cx2 = w * 0.7 + Math.sin(bgTime * 0.9) * (w * 0.3);
                        const cy2 = h * 0.7 + Math.cos(bgTime * 1.1) * (h * 0.3);
                        const rGrad2 = ctx.createRadialGradient(cx2, cy2, 10, cx2, cy2, w * 0.7);
                        rGrad2.addColorStop(0, p.c2);
                        rGrad2.addColorStop(1, 'transparent');
                        ctx.fillStyle = rGrad2;
                        ctx.fillRect(0, 0, w, h);

                    // 🌌 5. AURORA (0xC0 - 0xDF / 192 - 223)
                    } else if (currentBgMode === 'aurora') {
                        const bands = 4;
                        for (let i = 0; i < bands; i++) {
                            ctx.save();
                            ctx.globalAlpha = 0.45;
                            const grad = ctx.createLinearGradient(0, 0, 0, h);
                            grad.addColorStop(0, 'transparent');
                            grad.addColorStop(0.5, i % 2 === 0 ? p.c1 : p.c2);
                            grad.addColorStop(1, 'transparent');
                            ctx.fillStyle = grad;

                            ctx.beginPath();
                            for (let x = 0; x <= w; x += 5) {
                                const y = (h * 0.15) + i * 40 + Math.sin(x * 0.015 + bgTime * (1 + i * 0.4)) * 40;
                                if (x === 0) ctx.moveTo(x, y);
                                else ctx.lineTo(x, y);
                            }
                            ctx.lineTo(w, h);
                            ctx.lineTo(0, h);
                            ctx.closePath();
                            ctx.fill();
                            ctx.restore();
                        }

                    // 🪐 6. PROCEDURAL GALAXY SPIRAL (0xE0 - 0xFF / 224 - 255)
                    } else if (currentBgMode === 'cosmic') {
                        const cx = w / 2;
                        const cy = h / 2;
                        const totalArms = (code % 6) + 2; // 2 to 7 spiral arms linear!
                        const particlesPerArm = 35;

                        for (let arm = 0; arm < totalArms; arm++) {
                            const armAngle = (arm * 2 * Math.PI) / totalArms;
                            for (let i = 0; i < particlesPerArm; i++) {
                                const r = (i / particlesPerArm) * (w * 0.42);
                                const theta = armAngle + (i * 0.18) + (bgTime * 0.8);
                                const px = cx + Math.cos(theta) * r;
                                const py = cy + Math.sin(theta) * r;

                                ctx.fillStyle = i % 3 === 0 ? p.c1 : (i % 3 === 1 ? p.c2 : p.c3);
                                ctx.beginPath();
                                ctx.arc(px, py, 1.8 + (i % 3), 0, 2 * Math.PI);
                                ctx.fill();
                            }
                        }

                        // Singularity Core
                        const sGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 25);
                        sGrad.addColorStop(0, '#ffffff');
                        sGrad.addColorStop(0.6, p.c1);
                        sGrad.addColorStop(1, 'transparent');
                        ctx.fillStyle = sGrad;
                        ctx.beginPath();
                        ctx.arc(cx, cy, 25, 0, 2 * Math.PI);
                        ctx.fill();
                    }

                    // If user activated full page background mode
                    if (isPageBgActive) {
                        document.body.style.background = 'radial-gradient(circle at 50% 20%, ' + p.rgba2(0.25) + ' 0%, #030712 90%)';
                    }
                }
            } catch (err) {
                console.error("Titan render error:", err);
            }
            bgCanvasAnimFrame = requestAnimationFrame(renderBgCanvasLoop);
        }

        // Start render loop immediately
        renderBgCanvasLoop();

        // ── 🎬 SECTION 2.7: VIDEO EDITOR RIGHT PANEL & COMPOSITOR ENGINE ──
        let veState = {
            isPlaying: true,
            timeSec: 3.25,
            text: 'DANPHE CINEMA STUDIO',
            textAnimOpcode: '0x00',
            textVal: 0,
            colorVal: 0,
            normalVal: 0,
            fontSize: 24,
            spacing: 4,
            c1: '#06b6d4',
            c2: '#38bdf8',
            c3: '#fde047',
            opcode: 0,
            speed: 1.5,
            scale: 100,
            rotate: 0,
            yOffset: 0
        };

        function setVeTargetTrack(target) {
            ['backdrop', 'title', 'media'].forEach(t => {
                const p = document.getElementById('ve-panel-' + t);
                const btn = document.getElementById('ve-target-track' + (t === 'backdrop' ? '0' : (t === 'title' ? '3' : '1')));
                if (p) p.style.display = (t === target ? 'flex' : 'none');
                if (btn) {
                    if (t === target) {
                        btn.className = 'py-1.5 px-2 bg-indigo-600 text-slate-950 text-[10px] font-mono font-black rounded-lg transition shadow';
                    } else {
                        btn.className = 'py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-mono font-bold rounded-lg border border-slate-800 transition';
                    }
                }
            });
            const badge = document.getElementById('ve-active-track-badge');
            if (badge) {
                if (target === 'backdrop') badge.innerText = 'Track 0: Backdrop FX';
                else if (target === 'title') badge.innerText = 'Track 3: Kinetic Title';
                else if (target === 'media') badge.innerText = 'Track 1: Media/Icon';
            }
        }

        function selectVeOpcode(code, name) {
            veState.opcode = code;
            const chip = document.getElementById('ve-active-opcode-chip');
            if (chip) chip.innerText = 'Opcode #' + code + ' (' + name + ')';
            showLiveToast('Backdrop Animation', 'Switched to ' + name + ' (#0x' + code.toString(16).toUpperCase().padStart(2, '0') + ')', 'success');
        }

        function selectVeTextAnim(hex, name) {
            veState.textAnimOpcode = hex;
            renderVeTitleLayer();
            showLiveToast('Kinetic Title', 'Applied ' + name + ' (' + hex + ')', 'success');
        }

        function setVeMediaAnim(animClass) {
            const icon = document.getElementById('ve-media-icon');
            if (icon) {
                icon.className = 'text-cyan-300 drop-shadow-[0_0_25px_rgba(6,182,212,0.8)] ' + animClass;
            }
            showLiveToast('Media Motion', 'Applied ' + animClass + ' to Track 1', 'success');
        }

        function updateVeText(val) {
            veState.text = val || 'DANPHE CINEMA STUDIO';
            renderVeTitleLayer();
        }

        function setVeTextAnim(val) {
            veState.textAnimOpcode = val;
            renderVeTitleLayer();
        }

        function setVeFontSize(val) {
            veState.fontSize = val;
            const el = document.getElementById('ve-font-size-val');
            if (el) el.innerText = val + 'px';
            renderVeTitleLayer();
        }

        function setVeSpacing(val) {
            veState.spacing = val;
            const el = document.getElementById('ve-spacing-val');
            if (el) el.innerText = (val * 0.05).toFixed(2) + 'em';
            renderVeTitleLayer();
        }

        function setVeColor(index, hex) {
            if (index === 1) {
                veState.c1 = hex;
                const el = document.getElementById('ve-c1-hex');
                if (el) el.innerText = hex.toUpperCase();
            } else if (index === 2) {
                veState.c2 = hex;
                const el = document.getElementById('ve-c2-hex');
                if (el) el.innerText = hex.toUpperCase();
            } else if (index === 3) {
                veState.c3 = hex;
                const el = document.getElementById('ve-c3-hex');
                if (el) el.innerText = hex.toUpperCase();
            }
        }

        function setVePreset(c1, c2, c3) {
            veState.c1 = c1;
            veState.c2 = c2;
            veState.c3 = c3;
            const i1 = document.getElementById('ve-c1');
            if (i1) i1.value = c1;
            const h1 = document.getElementById('ve-c1-hex');
            if (h1) h1.innerText = c1.toUpperCase();

            const i2 = document.getElementById('ve-c2');
            if (i2) i2.value = c2;
            const h2 = document.getElementById('ve-c2-hex');
            if (h2) h2.innerText = c2.toUpperCase();

            const i3 = document.getElementById('ve-c3');
            if (i3) i3.value = c3;
            const h3 = document.getElementById('ve-c3-hex');
            if (h3) h3.innerText = c3.toUpperCase();

            showLiveToast('Video Palette', 'Brand Colors Applied to Compositor!', 'success');
        }

        window.titanProSliderUpdate = function(id, rawVal, min, max, unit, reg) {
            const val = Number(rawVal);
            const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
            const valEl = document.getElementById(id + '-val');
            const fillEl = document.getElementById(id + '-fill');
            const knobEl = document.getElementById(id + '-knob');
            
            const hex = '0x' + val.toString(16).toUpperCase().padStart(2, '0');
            if (valEl) valEl.innerText = val + ' (' + hex + ')';
            if (fillEl) fillEl.style.width = 'calc(' + pct + '% - 3px)';
            if (knobEl) knobEl.style.left = pct + '%';

            if (id === 'slider-text') {
                setSliderText(val);
            } else if (id === 'slider-color') {
                setSliderColor(val);
            } else if (id === 'slider-normal') {
                setSliderNormal(val);
            }
        };

        function setSliderText(val) {
            let num = parseInt(val, 10);
            if (isNaN(num)) num = 0;
            num = Math.max(0, Math.min(255, num));
            const hex = '0x' + num.toString(16).toUpperCase().padStart(2, '0');
            
            const animMeta = clientAnimMap[num] || { cssClass: 'titan-anim-type-rainbow', name: 'Motion FX #' + num };
            veState.textAnimOpcode = hex;
            const valEl = document.getElementById('slider-text-val');
            if (valEl) valEl.innerText = num + ' (' + hex + ' - ' + animMeta.name + ')';
            renderVeTitleLayer();
        }

        function setSliderColor(val) {
            let num = parseInt(val, 10);
            if (isNaN(num)) num = 0;
            num = Math.max(0, Math.min(255, num));
            veState.opcode = num;
            const hex = '0x' + num.toString(16).toUpperCase().padStart(2, '0');
            
            const model = getLinearModelFromOpcode(num);
            const valEl = document.getElementById('slider-color-val');
            if (valEl) valEl.innerText = num + ' (' + hex + ' - ' + model.name + ')';
        }

        // ── 🎛️ 100% PURE VECTOR SVG SLIDER DRAG ENGINE (FLAGSHIP MOBILE PRO LAYOUT) ──
        function updateSvgChannel(channelType, val) {
            val = Math.max(0, Math.min(255, Math.round(val)));
            const xRatio = val / 255;
            const knobX = 6 + xRatio * (194 - 12);
            const fillW = Math.max(2, xRatio * 192);

            const knobEl = document.getElementById('svg-knob-' + channelType);
            const fillEl = document.getElementById('svg-fill-' + channelType);
            const badgeEl = document.getElementById('svg-badge-' + channelType + '-val');
            const numBoxEl = document.getElementById('svg-num-' + channelType + '-box');

            if (knobEl) knobEl.setAttribute('transform', 'translate(' + knobX + ', 11)');
            if (fillEl) fillEl.setAttribute('width', fillW);
            if (numBoxEl) numBoxEl.textContent = val.toString().padStart(3, '0');

            const hex = '0x' + val.toString(16).toUpperCase().padStart(2, '0');

            if (channelType === 'text') {
                const animMeta = clientTextAnimMap[val] || clientAnimMap[val] || { cssClass: 'titan-anim-type-rainbow', name: 'Motion Effect' };
                if (badgeEl) badgeEl.textContent = hex + ' (' + animMeta.name.replace(/_/g, ' ').toUpperCase() + ')';
                veState.textAnimOpcode = hex;
                veState.textVal = val;
                renderVeTitleLayer();
            } else if (channelType === 'color') {
                const model = getLinearModelFromOpcode(val);
                if (badgeEl) badgeEl.textContent = hex + ' (' + model.name.toUpperCase() + ')';
                veState.opcode = val;
                veState.colorVal = val;
                veState.c1 = model.c1;
                veState.c2 = model.c2;
                veState.c3 = model.c3;
            } else if (channelType === 'normal') {
                const normalAnims = [
                    { class: 'titan-anim-laser', name: 'LASER STRIKE' },
                    { class: 'titan-anim-pulse', name: 'HEARTBEAT' },
                    { class: 'titan-anim-radar', name: 'RADAR SWEEP' },
                    { class: 'titan-anim-laser', name: 'LASER PULSE' },
                    { class: 'titan-anim-spin', name: 'VORTEX SPIN' },
                    { class: 'titan-anim-bounce', name: 'DYNAMIC BOUNCE' },
                    { class: 'titan-anim-wave', name: 'SINE WAVE' },
                    { class: 'titan-anim-spring', name: 'SPRING PHYSICS' },
                    { class: 'titan-anim-glitch', name: 'CYBER GLITCH' },
                    { class: 'titan-anim-hud', name: '3D HUD SCANNER' }
                ];
                const meta = normalAnims[val % normalAnims.length];
                if (badgeEl) badgeEl.textContent = hex + ' (' + meta.name + ')';
                const icon = document.getElementById('ve-sample-icon');
                if (icon) {
                    icon.className = 'text-cyan-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] ' + meta.class;
                }
                const mainIcon = document.getElementById('main-media-icon');
                if (mainIcon && icon) {
                    mainIcon.className = icon.className;
                }
                veState.normalVal = val;
            }
        }

        // ── 🎬 4-STAGE ANIMATION LIFECYCLE CONTROLLER ──
        const animStageConfig = {
            in: { name: 'IN (ENTRANCE)', fill: '#061a12', stroke: '#166534', activeFill: '#062d1b', activeStroke: '#22c55e', color: '#86efac', activeGlow: 'url(#phone-glow-emerald)', badgeText: 'IN (ENTRANCE)', badgeColor: '#86efac' },
            overall: { name: 'OVERALL (LOOP)', fill: '#0c2338', stroke: '#06b6d4', activeFill: '#0e2d4a', activeStroke: '#38bdf8', color: '#38bdf8', activeGlow: 'url(#phone-glow-cyan)', badgeText: 'OVERALL', badgeColor: '#38bdf8' },
            out: { name: 'OUT (EXIT)', fill: '#1f090d', stroke: '#991b1b', activeFill: '#380f17', activeStroke: '#ef4444', color: '#fca5a5', activeGlow: 'url(#phone-glow-rose)', badgeText: 'OUT (EXIT)', badgeColor: '#fca5a5' },
            trans: { name: 'TRANSITION', fill: '#170924', stroke: '#6b21a8', activeFill: '#2c0f45', activeStroke: '#a855f7', color: '#d8b4fe', activeGlow: 'url(#phone-glow-purple)', badgeText: 'TRANSITION', badgeColor: '#d8b4fe' }
        };

        function switchAnimStage(stageKey) {
            veState.activeStage = stageKey;
            const stages = ['in', 'overall', 'out', 'trans'];
            stages.forEach(k => {
                const el = document.getElementById('stage-btn-' + k);
                if (el) {
                    const rect = el.querySelector('rect');
                    const text = el.querySelector('text');
                    const conf = animStageConfig[k];
                    if (k === stageKey) {
                        if (rect) {
                            rect.setAttribute('fill', conf.activeFill);
                            rect.setAttribute('stroke', conf.activeStroke);
                            rect.setAttribute('stroke-width', '1.4');
                            rect.setAttribute('filter', conf.activeGlow);
                        }
                        if (text) text.setAttribute('fill', conf.color);
                    } else {
                        if (rect) {
                            rect.setAttribute('fill', conf.fill);
                            rect.setAttribute('stroke', conf.stroke);
                            rect.setAttribute('stroke-width', '1');
                            rect.removeAttribute('filter');
                        }
                        if (text) text.setAttribute('fill', conf.color);
                    }
                }
            });

            const badgeTextEl = document.getElementById('oled-stage-text');
            if (badgeTextEl) {
                badgeTextEl.textContent = animStageConfig[stageKey].badgeText;
                badgeTextEl.setAttribute('fill', animStageConfig[stageKey].badgeColor);
            }

            const lbl1 = document.getElementById('lbl-slider-1-name');
            const lbl2 = document.getElementById('lbl-slider-2-name');
            const lbl3 = document.getElementById('lbl-slider-3-name');

            if (stageKey === 'in') {
                if (lbl1) lbl1.textContent = '1. IN ENTRANCE EFFECT (OPCODE)';
                if (lbl2) lbl2.textContent = '2. IN DURATION (0.8s)';
                if (lbl3) lbl3.textContent = '3. ENTRANCE EASING CURVE';
            } else if (stageKey === 'overall') {
                if (lbl1) lbl1.textContent = '1. OVERALL LOOP EFFECT (OPCODE)';
                if (lbl2) lbl2.textContent = '2. DURATION / COLOR (0.8s)';
                if (lbl3) lbl3.textContent = '3. EASING CURVE / MOTION';
            } else if (stageKey === 'out') {
                if (lbl1) lbl1.textContent = '1. OUT EXIT EFFECT (OPCODE)';
                if (lbl2) lbl2.textContent = '2. OUT DURATION (0.6s)';
                if (lbl3) lbl3.textContent = '3. EXIT EASING CURVE';
            } else if (stageKey === 'trans') {
                if (lbl1) lbl1.textContent = '1. TRANSITION CUT TYPE (OPCODE)';
                if (lbl2) lbl2.textContent = '2. TRANSITION DURATION (0.5s)';
                if (lbl3) lbl3.textContent = '3. CROSS-DISSOLVE BLEND';
            }

            showLiveToast('Stage Selected', 'Configuring ' + animStageConfig[stageKey].name + ' Animation', 'info');
        }

        function stepSvgChannel(channelType, delta) {
            let cur = 0;
            if (channelType === 'text') {
                cur = (typeof veState.textVal === 'number') ? veState.textVal : 0;
            } else if (channelType === 'color') {
                cur = (typeof veState.opcode === 'number') ? veState.opcode : 0;
            } else {
                cur = (typeof veState.normalVal === 'number') ? veState.normalVal : 0;
            }
            let next = (cur + delta + 256) % 256;
            updateSvgChannel(channelType, next);
        }

        function switchMobileTab(tabKey) {
            if (tabKey === 'transform' || tabKey === 'video') {
                switchActiveCardInspector('transform');
                return;
            }
            if (tabKey === 'color') {
                switchActiveCardInspector('color');
                return;
            }
            if (tabKey === 'typo' || tabKey === 'text') {
                switchActiveCardInspector('typo');
                return;
            }
            if (tabKey === 'vfx') {
                switchActiveCardInspector('vfx');
                return;
            }
            if (tabKey === 'anim') {
                switchActiveCardInspector('anim');
                return;
            }

            const tabs = ['anim', 'text', 'typo', 'color', 'transform', 'audio'];
            tabs.forEach(k => {
                const el = document.getElementById('tab-btn-' + k);
                if (el) {
                    const txt = el.querySelector('span:last-of-type') || el.querySelector('span');
                    const svg = el.querySelector('svg');
                    if (k === tabKey) {
                        el.className = 'shrink-0 w-[70px] h-[66px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200 bg-[#082b47] border border-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.35)]';
                        if (txt) txt.className = 'text-[9.5px] font-black font-mono text-white tracking-wider';
                        if (svg) svg.setAttribute('stroke', '#38bdf8');
                    } else {
                        el.className = 'shrink-0 w-[70px] h-[66px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200 bg-[#090d16] border border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100';
                        if (txt) txt.className = 'text-[9.5px] font-black font-mono text-slate-400 tracking-wider';
                        if (svg) svg.setAttribute('stroke', '#cbd5e1');
                    }
                }
            });

            const tabNames = {
                anim: '⚡ ANIMATION FX (Active)',
                text: '🔤 TEXT & TYPOGRAPHY STUDIO',
                typo: '✍️ KINETIC MOTION SUITE',
                color: '🎨 256 COLOR BANK & GRADIENTS',
                transform: '📐 UNIVERSAL LAYER TRANSFORM & MOTION',
                audio: '🎵 AUDIO MASTERING & GAIN'
            };
            showLiveToast('Mobile Dock', 'Switched to ' + (tabNames[tabKey] || tabKey.toUpperCase()), 'info');
        }

        function scrollTabsLeft() {
            const el = document.getElementById('mobile-tab-scroll-container');
            if (el) el.scrollBy({ left: -75, behavior: 'smooth' });
        }

        function scrollTabsRight() {
            const el = document.getElementById('mobile-tab-scroll-container');
            if (el) el.scrollBy({ left: 75, behavior: 'smooth' });
        }

        function toggleMobileFrameMode(withFrame) {
            const chassis = document.getElementById('phone-hardware-chassis');
            const frameless = document.getElementById('phone-frameless-chassis');
            const island = document.getElementById('phone-dynamic-island-group');
            const btnWith = document.getElementById('btn-mode-with-frame');
            const btnWithout = document.getElementById('btn-mode-without-frame');

            if (withFrame) {
                if (chassis) chassis.style.display = 'block';
                if (frameless) frameless.style.display = 'none';
                if (island) island.style.display = 'block';
                if (btnWith) btnWith.className = 'px-2.5 py-1 rounded-lg font-bold text-cyan-300 bg-cyan-950 border border-cyan-700 shadow transition-all';
                if (btnWithout) btnWithout.className = 'px-2.5 py-1 rounded-lg font-bold text-slate-400 hover:text-white transition-all';
                showLiveToast('Frame Mode Active', 'Realistic Titanium Smartphone Hardware Mockup Enabled', 'info');
            } else {
                if (chassis) chassis.style.display = 'none';
                if (frameless) frameless.style.display = 'block';
                if (island) island.style.display = 'none';
                if (btnWith) btnWith.className = 'px-2.5 py-1 rounded-lg font-bold text-slate-400 hover:text-white transition-all';
                if (btnWithout) btnWithout.className = 'px-2.5 py-1 rounded-lg font-bold text-cyan-300 bg-cyan-950 border border-cyan-700 shadow transition-all';
                showLiveToast('Frameless Mode Active', 'Clean Edge-to-Edge OLED Studio Display Enabled', 'info');
            }
        }

        function initSvgSliderDrag() {
            const setupDrag = (hitId, channelType) => {
                const hitEl = document.getElementById(hitId);
                if (!hitEl) return;

                const updateValFromEvt = (e) => {
                    const rect = hitEl.getBoundingClientRect();
                    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
                    const xRatio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
                    const val = Math.round(xRatio * 255);
                    updateSvgChannel(channelType, val);
                };

                let isDragging = false;
                hitEl.addEventListener('mousedown', (e) => { isDragging = true; updateValFromEvt(e); });
                window.addEventListener('mousemove', (e) => { if (isDragging) updateValFromEvt(e); });
                window.addEventListener('mouseup', () => { isDragging = false; });

                hitEl.addEventListener('touchstart', (e) => { isDragging = true; updateValFromEvt(e); }, { passive: true });
                window.addEventListener('touchmove', (e) => { if (isDragging) updateValFromEvt(e); }, { passive: true });
                window.addEventListener('touchend', () => { isDragging = false; });
            };

            setupDrag('svg-hit-text', 'text');
            setupDrag('svg-hit-color', 'color');
            setupDrag('svg-hit-normal', 'normal');
        }

        // Initialize SVG Drag on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSvgSliderDrag);
        } else {
            initSvgSliderDrag();
        }

        function setVeSpeed(val) {
            veState.speed = (parseInt(val, 10) / 10).toFixed(1);
            const el = document.getElementById('ve-speed-val');
            if (el) el.innerText = veState.speed + 'x';
        }

        function setVeTransform() {
            const scale = document.getElementById('ve-layer-scale')?.value || 100;
            const rotate = document.getElementById('ve-layer-rotate')?.value || 0;
            const y = document.getElementById('ve-layer-y')?.value || 0;
            veState.scale = scale;
            veState.rotate = rotate;
            veState.yOffset = y;

            const scaleEl = document.getElementById('ve-scale-val');
            if (scaleEl) scaleEl.innerText = scale + '%';
            const rotEl = document.getElementById('ve-rotate-val');
            if (rotEl) rotEl.innerText = rotate + '°';
            const yEl = document.getElementById('ve-y-val');
            if (yEl) yEl.innerText = y + 'px';

            const mediaLayer = document.getElementById('ve-media-layer');
            if (mediaLayer) {
                mediaLayer.style.transform = 'scale(' + (scale / 100) + ') rotate(' + rotate + 'deg) translateY(' + y + 'px)';
            }
        }

        function toggleVePlayback() {
            veState.isPlaying = !veState.isPlaying;
            const btn = document.getElementById('ve-btn-play');
            const status = document.getElementById('ve-play-status');
            if (veState.isPlaying) {
                if (btn) btn.innerHTML = '⏸';
                if (status) {
                    status.innerText = 'PLAYING (120 FPS)';
                    status.className = 'text-emerald-400';
                }
            } else {
                if (btn) btn.innerHTML = '▶';
                if (status) {
                    status.innerText = 'PAUSED';
                    status.className = 'text-amber-400';
                }
            }
        }

        function resetVePlayback() {
            veState.timeSec = 0;
            const tc = document.getElementById('ve-timecode');
            if (tc) tc.innerText = 'REC 00:00:00:00';
        }

        function renderVeTitleLayer() {
            const sampleTitle = document.getElementById('ve-sample-text');
            const mainTitle = document.getElementById('main-kinetic-text');

            const hex = veState.textAnimOpcode || '0x00';
            const num = parseInt(hex, 16) || 0;
            const animMeta = clientTextAnimMap[num] || clientAnimMap[num] || { cssClass: 'titan-anim-idle', name: 'STATIC NORMAL' };
            const textContent = (num === 0 || animMeta.name === 'STATIC_NORMAL') ? (veState.text || 'DANPHE CINEMA STUDIO') : (animMeta.name.replace(/_/g, ' '));

            if (animMeta.name === 'CIRCULAR_ORBIT_SPIN' || animMeta.name === 'VR_360_SPHERICAL_PANORAMA' || animMeta.name === 'ARCANE_CIRCLE_SUMMON_SPIN' || animMeta.name === 'BULLET_TIME_360_ORBIT') {
                const circleHtml = '<div class="' + (animMeta.cssClass || 'titan-anim-type-circular-orbit') + '" style="width:64px;height:64px;margin:0 auto;display:flex;align-items:center;justify-content:center;">' +
                    '<svg viewBox="0 0 100 100" width="64" height="64">' +
                    '<path id="txt-circ-p" d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" fill="none" stroke="rgba(56,189,248,0.35)" stroke-dasharray="2 2" />' +
                    '<text font-size="9.5" font-weight="900" fill="#fde047" letter-spacing="1.5">' +
                    '<textPath href="#txt-circ-p" startOffset="0%">• DANPHE STUDIO • CIRCLE •</textPath>' +
                    '</text></svg></div>';
                if (sampleTitle) sampleTitle.innerHTML = circleHtml;
                if (mainTitle) mainTitle.innerHTML = circleHtml;
                return;
            }

            const buildChars = (textStr) => {
                if (num === 0 || animMeta.name === 'STATIC_NORMAL') {
                    return textStr;
                }
                const isWave = animMeta.name.includes('WAVE') || animMeta.name.includes('SINE');
                const delayStep = isWave ? 0.12 : (animMeta.name.includes('WIPE') ? 0.08 : 0.04);
                return textStr.split('').map((ch, idx) => {
                    const delay = (idx * delayStep).toFixed(2);
                    const displayChar = ch === ' ' ? '&nbsp;' : ch;
                    const shX = ((idx % 2 === 0 ? -1 : 1) * (16 + (idx * 7) % 36)) + 'px';
                    const shY = ((idx % 3 === 0 ? -1 : 1) * (14 + (idx * 8) % 30)) + 'px';
                    const shRot = ((idx % 2 === 0 ? -1 : 1) * (20 + (idx * 16) % 60)) + 'deg';
                    return '<span class="' + (animMeta.cssClass || '') + '" style="display:inline-block;animation-delay:' + delay + 's;--shatter-x:' + shX + ';--shatter-y:' + shY + ';--shatter-rot:' + shRot + ';">' + displayChar + '</span>';
                }).join('');
            };

            // Typography & Subtitle Styling
            const strokeW = (typeof typoState !== 'undefined' && typoState.strokeWidth !== undefined) ? typoState.strokeWidth : 0;
            const strokeC = (typeof typoState !== 'undefined' && typoState.strokeColor) || '#000000';
            const fillC = (typeof typoState !== 'undefined' && typoState.fillColor) || '#fbbf24';
            const shadowVal = (typeof typoState !== 'undefined' && typoState.shadow !== undefined) ? typoState.shadow : 8;
            const bgSt = (typeof typoState !== 'undefined' && typoState.bgStyle) || 'none';
            const bgOp = (typeof typoState !== 'undefined' && typoState.bgOpacity !== undefined ? typoState.bgOpacity : 80) / 100;
            const bgRad = (typeof typoState !== 'undefined' && typoState.bgRadius !== undefined) ? typoState.bgRadius : 8;
            const trk = (typeof typoState !== 'undefined' && typoState.tracking !== undefined) ? typoState.tracking : 1;

            let bgCss = 'transparent';
            let padCss = '0px';
            let borderCss = 'none';

            if (bgSt === 'obsidian') {
                bgCss = 'rgba(0, 0, 0, ' + bgOp + ')';
                padCss = '6px 14px';
                borderCss = '1px solid rgba(56, 189, 248, 0.4)';
            } else if (bgSt === 'red') {
                bgCss = 'rgba(185, 28, 28, ' + bgOp + ')';
                padCss = '6px 14px';
                borderCss = '1.5px solid #f87171';
            } else if (bgSt === 'gold') {
                bgCss = 'rgba(180, 83, 9, ' + bgOp + ')';
                padCss = '6px 14px';
                borderCss = '1.5px solid #fbbf24';
            } else if (bgSt === 'glass') {
                bgCss = 'rgba(8, 51, 68, ' + bgOp + ')';
                padCss = '6px 14px';
                borderCss = '1px solid #06b6d4';
            }

            // Gradient Text Background
            const grad = (typeof typoState !== 'undefined') ? typoState.gradient : 'none';
            let textGradCss = 'none';
            let isGrad = false;
            if (grad === 'sunset') { textGradCss = 'linear-gradient(135deg, #f59e0b, #ef4444)'; isGrad = true; }
            else if (grad === 'cyber') { textGradCss = 'linear-gradient(135deg, #06b6d4, #ec4899)'; isGrad = true; }
            else if (grad === 'chrome') { textGradCss = 'linear-gradient(135deg, #cbd5e1, #475569)'; isGrad = true; }
            else if (grad === 'emerald') { textGradCss = 'linear-gradient(135deg, #34d399, #059669)'; isGrad = true; }

            // Curve Arc Transform & Half Circle Geometric SVG TextPath Arch
            const arcDeg = (typeof typoState !== 'undefined' && typoState.curveArc !== undefined) ? typoState.curveArc : 0;
            
            if (arcDeg === 180 || arcDeg === -180 || arcDeg === 360) {
                const isConvex = (arcDeg === 180);
                const isFull = (arcDeg === 360);
                const svgId = 'svg-curved-text-' + Math.abs(arcDeg);
                let pathD = '';
                let vBox = '0 0 360 120';
                let startOff = '50%';

                if (isConvex) {
                    // Rainbow Arch Half Circle (180°)
                    pathD = 'M 30,105 A 150,150 0 0,1 330,105';
                    vBox = '0 0 360 120';
                } else if (isFull) {
                    // Full 360° Circular Ring
                    pathD = 'M 180,60 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0';
                    vBox = '0 0 360 120';
                } else {
                    // Smile Curve Half Circle (-180°)
                    pathD = 'M 30,15 A 150,150 0 0,0 330,15';
                    vBox = '0 0 360 120';
                }

                const curvedSvg = '<svg viewBox="' + vBox + '" width="100%" height="90" style="overflow:visible;">' +
                    '<defs><path id="' + svgId + '" d="' + pathD + '" fill="none" /></defs>' +
                    '<text font-size="20" font-weight="900" text-anchor="middle" fill="' + fillC + '" stroke="' + strokeC + '" stroke-width="' + strokeW + '" style="letter-spacing:' + trk + 'px; filter:drop-shadow(0 4px ' + shadowVal + 'px rgba(0,0,0,0.95));">' +
                    '<textPath href="#' + svgId + '" startOffset="' + startOff + '">' + textContent + '</textPath>' +
                    '</text></svg>';

                if (sampleTitle) {
                    sampleTitle.className = 'font-mono font-black uppercase inline-block';
                    sampleTitle.style.background = 'transparent';
                    sampleTitle.style.border = 'none';
                    sampleTitle.style.transform = 'none';
                    sampleTitle.innerHTML = curvedSvg;
                }
                if (mainTitle) {
                    mainTitle.className = 'font-mono font-black uppercase inline-block';
                    mainTitle.style.background = 'transparent';
                    mainTitle.style.border = 'none';
                    mainTitle.style.transform = 'none';
                    mainTitle.innerHTML = curvedSvg;
                }
                return;
            }

            const arcTransform = arcDeg !== 0 ? 'perspective(500px) rotateX(' + (arcDeg * 0.2) + 'deg) rotateZ(' + (arcDeg * 0.05) + 'deg)' : 'none';

            // Karaoke Word-by-Word Highlight Builder
            const isKaraoke = (typeof typoState !== 'undefined' && typoState.isKaraoke);
            const buildKaraokeOrChars = (textStr) => {
                if (isKaraoke) {
                    const words = textStr.split(' ');
                    const activeIdx = Math.floor((veState.timeSec || 0) * 2.5) % (words.length || 1);
                    return words.map((w, i) => {
                        const isCurWord = (i === activeIdx);
                        if (isCurWord) {
                            return '<span style="color:#fde047;text-shadow:0 0 16px #eab308;transform:scale(1.15);display:inline-block;font-weight:900;padding:0 3px;transition:all 0.1s;">' + w + '</span>';
                        }
                        return '<span style="color:rgba(255,255,255,0.7);display:inline-block;padding:0 3px;">' + w + '</span>';
                    }).join(' ');
                }
                return buildChars(textStr);
            };

            // Render live sample box text
            if (sampleTitle) {
                sampleTitle.className = 'font-mono font-black text-xs uppercase';
                sampleTitle.style.color = isGrad ? 'transparent' : fillC;
                if (isGrad) {
                    sampleTitle.style.backgroundImage = textGradCss;
                    sampleTitle.style.webkitBackgroundClip = 'text';
                    sampleTitle.style.webkitTextFillColor = 'transparent';
                } else {
                    sampleTitle.style.backgroundImage = 'none';
                    sampleTitle.style.webkitBackgroundClip = 'unset';
                    sampleTitle.style.webkitTextFillColor = fillC;
                }
                sampleTitle.style.webkitTextStroke = strokeW > 0 ? (strokeW * 0.5) + 'px ' + strokeC : 'none';
                sampleTitle.style.background = bgCss;
                sampleTitle.style.padding = padCss;
                sampleTitle.style.borderRadius = bgRad + 'px';
                sampleTitle.style.border = borderCss;
                sampleTitle.style.letterSpacing = trk + 'px';
                sampleTitle.style.transform = arcTransform;
                sampleTitle.innerHTML = buildKaraokeOrChars(textContent);
            }

            // Render main canvas text immediately
            if (mainTitle) {
                mainTitle.className = 'font-mono font-black text-lg sm:text-2xl uppercase inline-block';
                mainTitle.style.color = isGrad ? 'transparent' : fillC;
                if (isGrad) {
                    mainTitle.style.backgroundImage = textGradCss;
                    mainTitle.style.webkitBackgroundClip = 'text';
                    mainTitle.style.webkitTextFillColor = 'transparent';
                } else {
                    mainTitle.style.backgroundImage = 'none';
                    mainTitle.style.webkitBackgroundClip = 'unset';
                    mainTitle.style.webkitTextFillColor = fillC;
                }
                mainTitle.style.webkitTextStroke = strokeW > 0 ? strokeW + 'px ' + strokeC : 'none';
                mainTitle.style.textShadow = '0 4px ' + shadowVal + 'px rgba(0,0,0,0.95)';
                mainTitle.style.background = bgCss;
                mainTitle.style.padding = padCss;
                mainTitle.style.borderRadius = bgRad + 'px';
                mainTitle.style.border = borderCss;
                mainTitle.style.letterSpacing = trk + 'px';
                mainTitle.style.transform = arcTransform;
                mainTitle.innerHTML = buildKaraokeOrChars(textContent);
            }
        }

        function applyVeLayerToTimeline() {
            veState.isAppliedToMain = true;
            renderVeTitleLayer();
            
            // Sync Normal Icon to Main Canvas
            const sampleIcon = document.getElementById('ve-sample-icon');
            const mainIcon = document.getElementById('main-media-icon');
            if (sampleIcon && mainIcon) {
                mainIcon.className = sampleIcon.className;
            }

            const hex = veState.textAnimOpcode || '0x00';
            const num = parseInt(hex, 16) || 0;
            const animMeta = clientTextAnimMap[num] || clientAnimMap[num] || { cssClass: 'titan-anim-idle', name: 'STATIC NORMAL' };

            // 🚀 DISPATCH OFFICIAL TITAN OPCODE PACKET ACROSS BUS
            const packet = TitanOpcodeBus.dispatch(TitanOpcodeBus.PROTOCOL.EVENTS.CARD_APPLY_TRIGGERED, {
                sender: 'titan_card',
                target: 'timeline',
                stage: veState.activeStage || 'overall',
                opcode: hex,
                opcodeInt: num,
                name: animMeta.name,
                cssClass: animMeta.cssClass,
                durationSec: 0.8,
                channels: {
                    textVal: veState.textVal || 0,
                    colorVal: veState.colorVal || 0,
                    normalVal: veState.normalVal || 0
                },
                timeRange: { startSec: 0.0, endSec: 4.5, duration: 4.5 }
            });

            console.log('⚡ [TitanOpcodeBus] Dispatched Packet:', packet);

            const status = document.getElementById('main-canvas-status');
            if (status) {
                status.innerHTML = '<span class="text-emerald-400 font-bold">ACTIVE [Titan Opcode: ' + hex + ' (' + animMeta.name + ')]</span>';
            }

            showLiveToast('Opcode Dispatched', 'Titan Opcode ' + hex + ' (' + animMeta.name + ') emitted across Timeline Bus!', 'success');
        }

        function addVeKeyframe() {
            showLiveToast('Keyframe Inserted', 'Opcode Keyframe added at current cursor position!', 'info');
        }

        // ── 🎬 TITAN SVG TRANSFORM CARD CLIENT STATE & ACTIONS ──
        let tfState = {
            scale: 100,
            rotation: 0,
            posX: 0,
            posY: 0,
            opacity: 100,
            blur: 0,
            radius: 0,
            speed: '1.0x',
            anchor: 'cc',
            activeMode: 'scale',
            activeTab: 'basic',
            isFrameMode: true
        };

        function switchActiveCardInspector(type) {
            const animSlot = document.getElementById('inspector-card-anim-slot');
            const tfSlot = document.getElementById('inspector-card-transform-slot');
            const colorSlot = document.getElementById('inspector-card-color-slot');
            const typoSlot = document.getElementById('inspector-card-typo-slot');
            const vfxSlot = document.getElementById('inspector-card-vfx-slot');
            const mediaSlot = document.getElementById('inspector-card-media-slot');
            const btnAnim = document.getElementById('btn-card-anim');
            const btnTf = document.getElementById('btn-card-transform');
            const btnColor = document.getElementById('btn-card-color');
            const btnTypo = document.getElementById('btn-card-typo');
            const btnVfx = document.getElementById('btn-card-vfx');
            const btnMedia = document.getElementById('btn-card-media');

            const thumbSlot = document.getElementById('inspector-card-thumb-slot');
            const btnThumb = document.getElementById('btn-card-thumb');

            // Hide all slots first
            if (animSlot) animSlot.classList.add('hidden');
            if (tfSlot) tfSlot.classList.add('hidden');
            if (colorSlot) colorSlot.classList.add('hidden');
            if (typoSlot) typoSlot.classList.add('hidden');
            if (vfxSlot) vfxSlot.classList.add('hidden');
            if (mediaSlot) mediaSlot.classList.add('hidden');
            if (thumbSlot) thumbSlot.classList.add('hidden');

            // Reset all button styles
            const idleCls = 'flex-1 py-1 px-0.5 rounded-lg font-black text-[8px] sm:text-[8.5px] text-slate-400 hover:text-white transition-all truncate';
            if (btnAnim) btnAnim.className = idleCls;
            if (btnTf) btnTf.className = idleCls;
            if (btnColor) btnColor.className = idleCls;
            if (btnTypo) btnTypo.className = idleCls;
            if (btnVfx) btnVfx.className = idleCls;
            if (btnMedia) btnMedia.className = idleCls;
            if (btnThumb) btnThumb.className = idleCls;

            if (type === 'transform') {
                if (tfSlot) tfSlot.classList.remove('hidden');
                if (btnTf) btnTf.className = 'flex-1 py-1 px-0.5 rounded-lg font-black text-[8px] sm:text-[8.5px] text-cyan-300 bg-cyan-950/80 border border-cyan-500 shadow transition-all truncate';
                updateTfUI('titan-svg-transform-card');
                initTfSliderDrag();
                showLiveToast('Transform Studio', 'Switched to Titan Universal Transform & Motion Card!', 'info');
            } else if (type === 'color') {
                if (colorSlot) colorSlot.classList.remove('hidden');
                if (btnColor) btnColor.className = 'flex-1 py-1 px-0.5 rounded-lg font-black text-[8px] sm:text-[8.5px] text-pink-300 bg-pink-950/80 border border-pink-500 shadow transition-all truncate';
                updateColorUI('titan-svg-color-card');
                initColorSliderDrag();
                showLiveToast('Color Studio', 'Switched to Titan Color & Gradient Studio Card!', 'info');
            } else if (type === 'typo' || type === 'text') {
                if (typoSlot) typoSlot.classList.remove('hidden');
                if (btnTypo) btnTypo.className = 'flex-1 py-1 px-0.5 rounded-lg font-black text-[8px] sm:text-[8.5px] text-amber-300 bg-amber-950/80 border border-amber-500 shadow transition-all truncate';
                updateTypoUI('titan-svg-typo-card');
                initTypoSliderDrag();
                showLiveToast('Typo Studio', 'Switched to Titan 256 Typography & Font Studio Card!', 'info');
            } else if (type === 'vfx') {
                if (vfxSlot) vfxSlot.classList.remove('hidden');
                if (btnVfx) btnVfx.className = 'flex-1 py-1 px-0.5 rounded-lg font-black text-[8px] sm:text-[8.5px] text-red-300 bg-red-950/80 border border-red-500 shadow transition-all truncate';
                updateVfxUI('titan-svg-effect-card');
                initVfxSliderDrag();
                showLiveToast('VFX Studio', 'Switched to Titan 256 VFX & Power Shaders Card!', 'info');
            } else if (type === 'thumb' || type === 'thumbnail') {
                if (thumbSlot) thumbSlot.classList.remove('hidden');
                if (btnThumb) btnThumb.className = 'flex-1 py-1 px-0.5 rounded-lg font-black text-[8px] sm:text-[8.5px] text-amber-300 bg-amber-950/80 border border-amber-500 shadow transition-all truncate';
                showLiveToast('Thumbnail Studio', 'Switched to YouTube Thumbnail & Photoshop Photo Studio!', 'info');
            } else if (type === 'media') {
                if (mediaSlot) mediaSlot.classList.remove('hidden');
                if (btnMedia) btnMedia.className = 'flex-1 py-1 px-0.5 rounded-lg font-black text-[8px] sm:text-[8.5px] text-cyan-300 bg-cyan-950/80 border border-cyan-500 shadow transition-all truncate';
                updateMediaWheelUI('titan-svg-media-card');
                initMediaWheelDrag();
                showLiveToast('Media Studio', 'Switched to 360° Rotary Media Ingestion Wheel Card!', 'info');
            } else {
                if (animSlot) animSlot.classList.remove('hidden');
                if (btnAnim) btnAnim.className = 'flex-1 py-1 px-0.5 rounded-lg font-black text-[8px] sm:text-[8.5px] text-amber-300 bg-amber-950/80 border border-amber-500 shadow transition-all truncate';
                veState.isAppliedToMain = true;
                if (colorState) colorState.mode = 'animated';
                renderVeTitleLayer();
                initSvgSliderDrag();
                showLiveToast('Animation Studio', 'Switched to Titan Hardware Animation Card!', 'info');
            }
        }

        // 🖼️ YOUTUBE THUMBNAIL & PHOTOSHOP PHOTO STUDIO STATE & CLIENT FUNCTIONS
        let thumbnailStudioState = {
            activeTab: 'cutout',
            aiCutout: true,
            strokeColor: '#ffffff',
            strokeWidth: 8,
            glowIntensity: 80,
            hdrPop: 40,
            bgBlur: 12,
            vignette: 50,
            badge: '🔥 VIRAL!'
        };

        function switchThumbnailStudioTab(tabKey) {
            thumbnailStudioState.activeTab = tabKey;
            const tabs = ['cutout', 'outline', 'hdr', 'text', 'export'];
            tabs.forEach(t => {
                const panel = document.getElementById('titan-svg-thumbnail-card-panel-' + t);
                const btn = document.getElementById('titan-svg-thumbnail-card-tab-btn-' + t);
                if (panel) panel.style.display = (t === tabKey) ? 'inline' : 'none';
                if (btn) {
                    const isCur = (t === tabKey);
                    btn.style.background = isCur ? '#ea580c' : '#0e1726';
                    btn.style.color = isCur ? '#ffffff' : '#fb923c';
                    btn.style.borderColor = isCur ? '#fb923c' : '#334155';
                }
            });
            showLiveToast('Thumbnail Studio', 'Switched Tab: ' + tabKey.toUpperCase(), 'info');
        }

        function toggleAiCutout() {
            thumbnailStudioState.aiCutout = !thumbnailStudioState.aiCutout;
            const btn = document.getElementById('btn-toggle-ai-cutout');
            if (btn) {
                btn.style.background = thumbnailStudioState.aiCutout ? '#065f46' : '#1e293b';
                btn.textContent = thumbnailStudioState.aiCutout ? '🪄 AI CUTOUT ACTIVE (BG REMOVED)' : '🪄 REMOVE BACKGROUND';
            }
            showLiveToast('AI Cutout', thumbnailStudioState.aiCutout ? 'Isolated Person & Removed Background!' : 'Restored Background', 'success');
        }

        function selectCutoutSubject(sub) {
            showLiveToast('AI Cutout Subject', 'Optimized Neural Mask for: ' + sub.toUpperCase(), 'info');
        }

        function setCutoutFeather(val) {
            const el = document.getElementById('val-cutout-feather');
            if (el) el.textContent = val + ' px';
        }

        function applyCutoutToTimeline() {
            showLiveToast('AI Cutout Ingest', '🚀 Hero Cutout Layer Ingested to Timeline Active Track!', 'success');
        }

        function setCreatorStrokeColor(col) {
            thumbnailStudioState.strokeColor = col;
            document.querySelectorAll('.stroke-color-btn').forEach(b => {
                b.style.borderColor = '#334155';
            });
            showLiveToast('Creator Outline', 'Set Outline Stroke Color: ' + col, 'info');
        }

        function setCreatorStrokeWidth(w) {
            thumbnailStudioState.strokeWidth = parseInt(w);
            const el = document.getElementById('val-stroke-width');
            if (el) el.textContent = w + ' px';
        }

        function setCreatorGlowIntensity(g) {
            thumbnailStudioState.glowIntensity = parseInt(g);
            const el = document.getElementById('val-glow-intensity');
            if (el) el.textContent = g + '%';
        }

        function applyThumbnailGlowToCanvas() {
            showLiveToast('Creator Outline', 'Updated Live YouTube Pop Outline & Neon Glow!', 'success');
        }

        function setThumbnailHdrPop(val) {
            thumbnailStudioState.hdrPop = parseInt(val);
            const el = document.getElementById('val-hdr-pop');
            if (el) el.textContent = '+' + val + '%';
        }

        function setThumbnailBgBlur(val) {
            thumbnailStudioState.bgBlur = parseInt(val);
            const el = document.getElementById('val-bg-blur');
            if (el) el.textContent = val + ' px';
        }

        function setThumbnailVignette(val) {
            thumbnailStudioState.vignette = parseInt(val);
            const el = document.getElementById('val-vignette');
            if (el) el.textContent = val + '%';
        }

        function insertThumbnailBadge(badgeText) {
            thumbnailStudioState.badge = badgeText;
            const status = document.getElementById('main-canvas-status');
            if (status) {
                status.innerHTML = '<span class="text-yellow-400 font-bold">🔤 THUMBNAIL BADGE: ' + badgeText + '</span>';
            }
            showLiveToast('Thumbnail 3D Badge', 'Inserted: ' + badgeText + ' to Canvas!', 'success');
        }

        function applyCustomThumbnailText() {
            const input = document.getElementById('input-thumb-text');
            if (input && input.value.trim()) {
                insertThumbnailBadge(input.value.trim());
            }
        }

        function exportThumbnailHD(format) {
            format = format || 'png';
            const mainCanvas = document.getElementById('main-video-canvas');
            if (!mainCanvas) {
                showLiveToast('Export Failed', 'Canvas not found', 'error');
                return;
            }

            // Create 1280x720 High-Res Master Offscreen Canvas
            const offCanvas = document.createElement('canvas');
            offCanvas.width = 1280;
            offCanvas.height = 720;
            const oCtx = offCanvas.getContext('2d');

            // Draw current canvas scaled up with high quality bicubic interpolation
            oCtx.imageSmoothingEnabled = true;
            oCtx.imageSmoothingQuality = 'high';
            oCtx.drawImage(mainCanvas, 0, 0, 1280, 720);

            // Export Data URL
            const mime = (format === 'jpg' || format === 'jpeg') ? 'image/jpeg' : 'image/png';
            const dataUrl = offCanvas.toDataURL(mime, 0.95);

            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'YouTube_Thumbnail_1280x720_' + Date.now() + '.' + (format === 'jpg' ? 'jpg' : 'png');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            showLiveToast('HD Thumbnail Exported', 'Downloaded 1280x720 High-Resolution YouTube Master Thumbnail (' + format.toUpperCase() + ')!', 'success');
        }

        function stepTfChannel(id, channel, delta) {
            id = id || 'titan-svg-transform-card';
            if (channel === 'scale') {
                const next = Math.max(10, Math.min(400, (tfState.scale || 100) + delta));
                if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined' && TITAN_REG.VIDEO_SCALE) {
                    TitanMicroBus.write(TITAN_REG.VIDEO_SCALE, next);
                } else {
                    tfState.scale = next;
                    updateTfUI(id);
                }
            } else if (channel === 'rotation') {
                const next = Math.max(-180, Math.min(180, (tfState.rotation || 0) + delta));
                if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined' && TITAN_REG.VIDEO_ROTATION) {
                    TitanMicroBus.write(TITAN_REG.VIDEO_ROTATION, next);
                } else {
                    tfState.rotation = next;
                    updateTfUI(id);
                }
            } else if (channel === 'opacity') {
                const next = Math.max(0, Math.min(100, (tfState.opacity || 100) + delta));
                if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined' && TITAN_REG.VIDEO_OPACITY) {
                    TitanMicroBus.write(TITAN_REG.VIDEO_OPACITY, next);
                } else {
                    tfState.opacity = next;
                    updateTfUI(id);
                }
            }
        }

        function updateTfUI(id) {
            id = id || 'titan-svg-transform-card';
            // Scale
            const scalePct = Math.max(0, Math.min(1, (tfState.scale - 10) / 390));
            const fillScale = document.getElementById(id + '-fill-scale');
            const knobScale = document.getElementById(id + '-knob-scale');
            const valScale = document.getElementById(id + '-val-scale');
            const hudScale = document.getElementById(id + '-hud-scale');
            const lblScale = document.getElementById(id + '-lbl-scale');
            if (fillScale) fillScale.setAttribute('width', Math.max(6, scalePct * 190));
            if (knobScale) knobScale.setAttribute('transform', 'translate(' + (7 + scalePct * 190) + ', 12)');
            if (valScale) valScale.textContent = tfState.scale + '%';
            if (hudScale) hudScale.textContent = tfState.scale + '%';
            if (lblScale) lblScale.textContent = '1. SCALE / ZOOM (' + tfState.scale + '%)';

            // Rotation
            const rotPct = Math.max(0, Math.min(1, (tfState.rotation + 180) / 360));
            const fillRot = document.getElementById(id + '-fill-rot');
            const knobRot = document.getElementById(id + '-knob-rot');
            const valRot = document.getElementById(id + '-val-rot');
            const hudRot = document.getElementById(id + '-hud-rot');
            const lblRot = document.getElementById(id + '-lbl-rot');
            if (fillRot) fillRot.setAttribute('width', Math.max(6, rotPct * 190));
            if (knobRot) knobRot.setAttribute('transform', 'translate(' + (7 + rotPct * 190) + ', 12)');
            if (valRot) valRot.textContent = tfState.rotation + '°';
            if (hudRot) hudRot.textContent = tfState.rotation + '°';
            if (lblRot) lblRot.textContent = '2. ROTATION ANGLE (' + tfState.rotation + '°)';

            // Opacity
            const opPct = Math.max(0, Math.min(1, tfState.opacity / 100));
            const fillOp = document.getElementById(id + '-fill-opacity');
            const knobOp = document.getElementById(id + '-knob-opacity');
            const valOp = document.getElementById(id + '-val-opacity');
            const lblOp = document.getElementById(id + '-lbl-opacity');
            if (fillOp) fillOp.setAttribute('width', Math.max(6, opPct * 190));
            if (knobOp) knobOp.setAttribute('transform', 'translate(' + (7 + opPct * 190) + ', 12)');
            if (valOp) valOp.textContent = tfState.opacity + '%';
            if (lblOp) lblOp.textContent = '3. ALPHA OPACITY (' + tfState.opacity + '%)';

            // Update Viewport Matrix
            const matrixTarget = document.getElementById('tf-target-matrix');
            if (matrixTarget) {
                const s = (tfState.scale || 100) / 100;
                const r = tfState.rotation || 0;
                const x = (tfState.posX || 0) * 0.2;
                const y = (tfState.posY || 0) * 0.2;
                matrixTarget.setAttribute('transform', 'scale(' + s + ') rotate(' + r + ') translate(' + x + ', ' + y + ')');
            }

            // Update Main Canvas
            const mainIcon = document.getElementById('main-media-icon');
            if (mainIcon) {
                const s = (tfState.scale || 100) / 100;
                const r = tfState.rotation || 0;
                const op = (tfState.opacity || 100) / 100;
                mainIcon.style.transform = 'scale(' + s + ') rotate(' + r + 'deg) translate(' + tfState.posX + 'px, ' + tfState.posY + 'px)';
                mainIcon.style.opacity = op;
            }
        }

        function initTfSliderDrag() {
            const setupDrag = (hitId, channel) => {
                const hitEl = document.getElementById(hitId);
                if (!hitEl || hitEl._tfDragBound) return;
                hitEl._tfDragBound = true;

                const updateValFromEvt = (e) => {
                    const rect = hitEl.getBoundingClientRect();
                    if (!rect || rect.width <= 0) return;
                    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
                    const xRatio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
                    if (channel === 'scale') {
                        const next = Math.round(10 + xRatio * 390);
                        if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined' && TITAN_REG.VIDEO_SCALE) {
                            TitanMicroBus.write(TITAN_REG.VIDEO_SCALE, next);
                        } else {
                            tfState.scale = next;
                            updateTfUI('titan-svg-transform-card');
                        }
                    } else if (channel === 'rotation') {
                        const next = Math.round(-180 + xRatio * 360);
                        if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined' && TITAN_REG.VIDEO_ROTATION) {
                            TitanMicroBus.write(TITAN_REG.VIDEO_ROTATION, next);
                        } else {
                            tfState.rotation = next;
                            updateTfUI('titan-svg-transform-card');
                        }
                    } else if (channel === 'opacity') {
                        const next = Math.round(xRatio * 100);
                        if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined' && TITAN_REG.VIDEO_OPACITY) {
                            TitanMicroBus.write(TITAN_REG.VIDEO_OPACITY, next);
                        } else {
                            tfState.opacity = next;
                            updateTfUI('titan-svg-transform-card');
                        }
                    }
                };

                let isDragging = false;
                hitEl.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    isDragging = true;
                    updateValFromEvt(e);
                });
                window.addEventListener('mousemove', (e) => {
                    if (isDragging) {
                        e.preventDefault();
                        updateValFromEvt(e);
                    }
                });
                window.addEventListener('mouseup', () => { isDragging = false; });

                hitEl.addEventListener('touchstart', (e) => {
                    isDragging = true;
                    updateValFromEvt(e);
                }, { passive: true });
                window.addEventListener('touchmove', (e) => {
                    if (isDragging) updateValFromEvt(e);
                }, { passive: true });
                window.addEventListener('touchend', () => { isDragging = false; });
            };

            setupDrag('titan-svg-transform-card-hit-scale', 'scale');
            setupDrag('titan-svg-transform-card-hit-rot', 'rotation');
            setupDrag('titan-svg-transform-card-hit-opacity', 'opacity');
        }

        // ── 🏔️ ATTACH TITAN MICRO BUS HARDWARE REGISTERS REACTIVE SUBSCRIBERS ──
        if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined') {
            TitanMicroBus.subscribe(TITAN_REG.VIDEO_SCALE, (val) => {
                tfState.scale = Number(val);
                updateTfUI('titan-svg-transform-card');
            });
            TitanMicroBus.subscribe(TITAN_REG.VIDEO_ROTATION, (val) => {
                tfState.rotation = Number(val);
                updateTfUI('titan-svg-transform-card');
            });
            TitanMicroBus.subscribe(TITAN_REG.VIDEO_OPACITY, (val) => {
                tfState.opacity = Number(val);
                updateTfUI('titan-svg-transform-card');
            });
            TitanMicroBus.subscribe(TITAN_REG.VIDEO_POS_X, (val) => {
                tfState.posX = Number(val);
                updateTfUI('titan-svg-transform-card');
            });
            TitanMicroBus.subscribe(TITAN_REG.VIDEO_POS_Y, (val) => {
                tfState.posY = Number(val);
                updateTfUI('titan-svg-transform-card');
            });
        }

        function setTfAnchor(id, anchorCode) {
            tfState.anchor = anchorCode;
            showLiveToast('Anchor Point', 'Transform Anchor Point set to: ' + anchorCode.toUpperCase(), 'info');
        }

        function quickTfAction(id, action) {
            if (action === 'fit') {
                tfState.scale = 100;
                tfState.posX = 0;
                tfState.posY = 0;
                tfState.rotation = 0;
            } else if (action === 'fill') {
                tfState.scale = 135;
            } else if (action === 'center') {
                tfState.posX = 0;
                tfState.posY = 0;
            } else if (action === 'flipH') {
                tfState.scale = (tfState.scale || 100) * -1;
            } else if (action === 'flipV') {
                tfState.rotation = ((tfState.rotation || 0) + 180) % 360;
            }
            updateTfUI(id);
            showLiveToast('Quick Transform', 'Action ' + action.toUpperCase() + ' applied!', 'info');
        }

        function switchTfMode(id, mode) {
            tfState.activeMode = mode;
            showLiveToast('Transform Mode', 'Switched mode to: ' + mode.toUpperCase(), 'info');
        }

        function switchTfTab(id, tab) {
            id = id || 'titan-svg-transform-card';
            tfState.activeTab = tab;

            if (tab === 'anim') {
                switchActiveCardInspector('anim');
                return;
            }
            if (tab === 'color') {
                switchActiveCardInspector('color');
                return;
            }

            const tabs = ['anim', 'basic', 'rotate', 'crop', 'blend', 'speed', 'keyframe'];
            tabs.forEach(k => {
                const el = document.getElementById(id + '-tab-' + k);
                if (el) {
                    const txt = el.querySelector('span:last-of-type');
                    if (k === tab) {
                        el.className = 'flex-shrink-0 w-[70px] h-[58px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 bg-cyan-950 border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]';
                        if (txt) txt.className = 'text-[9px] font-black tracking-wider text-cyan-300';
                    } else {
                        el.className = 'flex-shrink-0 w-[70px] h-[58px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800';
                        if (txt) txt.className = 'text-[9px] font-black tracking-wider text-slate-400';
                    }
                }
            });

            // Dynamically adapt 3 slider labels to tab context
            const lbl1 = document.getElementById(id + '-lbl-scale');
            const lbl2 = document.getElementById(id + '-lbl-rot');
            const lbl3 = document.getElementById(id + '-lbl-opacity');

            if (tab === 'rotate') {
                if (lbl1) lbl1.textContent = '1. ROTATION X 3D (0°)';
                if (lbl2) lbl2.textContent = '2. ROTATION Y 3D (0°)';
                if (lbl3) lbl3.textContent = '3. ROTATION Z ROLL (' + tfState.rotation + '°)';
            } else if (tab === 'crop') {
                if (lbl1) lbl1.textContent = '1. CROP HORIZONTAL (0%)';
                if (lbl2) lbl2.textContent = '2. CROP VERTICAL (0%)';
                if (lbl3) lbl3.textContent = '3. CORNER RADIUS (0px)';
            } else if (tab === 'blend') {
                if (lbl1) lbl1.textContent = '1. BLEND MODE (NORMAL)';
                if (lbl2) lbl2.textContent = '2. ALPHA OPACITY (' + tfState.opacity + '%)';
                if (lbl3) lbl3.textContent = '3. GAUSSIAN BLUR (0px)';
            } else if (tab === 'speed') {
                if (lbl1) lbl1.textContent = '1. PLAYBACK SPEED (1.0x)';
                if (lbl2) lbl2.textContent = '2. TIME REMAPPING';
                if (lbl3) lbl3.textContent = '3. MOTION BLUR AMOUNT';
            } else {
                if (lbl1) lbl1.textContent = '1. SCALE / ZOOM (' + tfState.scale + '%)';
                if (lbl2) lbl2.textContent = '2. ROTATION ANGLE (' + tfState.rotation + '°)';
                if (lbl3) lbl3.textContent = '3. ALPHA OPACITY (' + tfState.opacity + '%)';
            }

            const tabNames = {
                basic: '🎬 BASIC 2D TRANSFORM (Active)',
                rotate: '🔄 3D ROTATION & PERSPECTIVE',
                crop: '✂️ CROP & CORNER RADIUS',
                blend: '🎭 BLEND MODES & COMPOSITING',
                speed: '⚡ SPEED & TIME REMAPPING',
                keyframe: '💎 KEYFRAME INTERPOLATION'
            };
            showLiveToast('Transform Tab', tabNames[tab] || tab.toUpperCase(), 'info');
        }

        function toggleTfKeyframe(id, channel) {
            showLiveToast('Keyframe Inserted', 'Transform Keyframe saved for channel: ' + channel.toUpperCase(), 'success');
        }

        function applyTfToTimeline(id) {
            const packet = TitanOpcodeBus.dispatch(TitanOpcodeBus.PROTOCOL.EVENTS.CARD_APPLY_TRIGGERED, {
                sender: 'titan_transform_card',
                target: 'timeline',
                action: 'APPLY_TRANSFORM',
                data: {
                    scale: tfState.scale,
                    rotation: tfState.rotation,
                    posX: tfState.posX,
                    posY: tfState.posY,
                    opacity: tfState.opacity,
                    anchor: tfState.anchor,
                    speed: tfState.speed
                }
            });
            console.log('⚡ [TitanOpcodeBus] Transform Packet Dispatched:', packet);
            const status = document.getElementById('main-canvas-status');
            if (status) {
                status.innerHTML = '<span class="text-cyan-400 font-bold">ACTIVE [Transform Applied: Scale ' + tfState.scale + '%, Rot ' + tfState.rotation + '°]</span>';
            }
            showLiveToast('Transform Applied', 'Transform & Matrix parameters emitted to Timeline Bus!', 'success');
        }

        function toggleTfFrameMode(id) {
            tfState.isFrameMode = !tfState.isFrameMode;
            const outer = document.getElementById(id + '-outer-chassis');
            const bezel = document.getElementById(id + '-bezel');
            const hwBtns = document.getElementById(id + '-hw-buttons');
            if (outer) outer.style.display = tfState.isFrameMode ? 'block' : 'none';
            if (bezel) bezel.style.display = tfState.isFrameMode ? 'block' : 'none';
            if (hwBtns) hwBtns.style.display = tfState.isFrameMode ? 'block' : 'none';
            showLiveToast('Display Mode', 'Toggled Transform Card: ' + (tfState.isFrameMode ? 'With Frame' : 'Without Frame'), 'info');
        }

        function scrollTfTabsLeft(id) {
            const el = document.getElementById(id + '-tabs-viewport');
            if (el) el.scrollBy({ left: -140, behavior: 'smooth' });
        }

        function scrollTfTabsRight(id) {
            const el = document.getElementById(id + '-tabs-viewport');
            if (el) el.scrollBy({ left: 140, behavior: 'smooth' });
        }

        // ── 🎨 TITAN SVG COLOR & GRADIENT CARD CLIENT STATE & ACTIONS ──
        let colorState = {
            opcode: 12,
            mode: 'gradient',
            activeTab: 'gradient',
            c1: '#06b6d4',
            c2: '#ec4899',
            c3: '#8b5cf6',
            hex: '#06B6D4',
            rgb: '6, 182, 212',
            hsl: '189°, 94%, 43%',
            saturation: 100,
            brightness: 0,
            isFrameMode: true
        };

        function stepColorChannel(id, channel, delta) {
            id = id || 'titan-svg-color-card';
            if (channel === 'hue') {
                const next = Math.max(0, Math.min(255, (colorState.opcode || 12) + delta));
                if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined' && TITAN_REG.COLOR_EXPOSURE) {
                    TitanMicroBus.write(TITAN_REG.COLOR_EXPOSURE, next);
                } else {
                    colorState.opcode = next;
                    updateColorFromOpcode(next);
                    updateColorUI(id);
                }
            } else if (channel === 'saturation') {
                const next = Math.max(0, Math.min(200, (colorState.saturation || 100) + delta));
                if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined' && TITAN_REG.COLOR_SATURATION) {
                    TitanMicroBus.write(TITAN_REG.COLOR_SATURATION, next);
                } else {
                    colorState.saturation = next;
                    updateColorUI(id);
                }
            } else if (channel === 'brightness') {
                const next = Math.max(-100, Math.min(100, (colorState.brightness || 0) + delta));
                if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined' && TITAN_REG.COLOR_CONTRAST) {
                    TitanMicroBus.write(TITAN_REG.COLOR_CONTRAST, next);
                } else {
                    colorState.brightness = next;
                    updateColorUI(id);
                }
            }
        }

        function updateColorFromOpcode(op) {
            const colors = getBgColors(op);
            colorState.opcode = op;
            colorState.c1 = colors.c1;
            colorState.c2 = colors.c2;
            colorState.c3 = colors.c3;
            colorState.hex = colors.c1.toUpperCase();
        }

        function updateColorUI(id) {
            id = id || 'titan-svg-color-card';
            const op = colorState.opcode || 0;
            const sat = colorState.saturation || 100;
            const br = colorState.brightness || 0;

            // Slider 1: Hue / Opcode
            const fillHue = document.getElementById(id + '-fill-hue');
            const knobHue = document.getElementById(id + '-knob-hue');
            const valHue = document.getElementById(id + '-val-hue');
            const lblHue = document.getElementById(id + '-lbl-hue');
            const badgeHue = document.getElementById(id + '-badge-hue');
            if (fillHue) fillHue.setAttribute('width', Math.max(6, (op / 255) * 190));
            if (knobHue) knobHue.setAttribute('transform', 'translate(' + (7 + (op / 255) * 190) + ', 12)');
            if (valHue) valHue.textContent = op.toString().padStart(3, '0');
            if (lblHue) lblHue.textContent = '1. HUE / COLOR BANK (' + op + ')';
            if (badgeHue) badgeHue.textContent = 'REG 0x4120 (0x' + op.toString(16).toUpperCase().padStart(2, '0') + ')';

            // Slider 2: Saturation
            const fillSat = document.getElementById(id + '-fill-sat');
            const knobSat = document.getElementById(id + '-knob-sat');
            const valSat = document.getElementById(id + '-val-sat');
            const lblSat = document.getElementById(id + '-lbl-sat');
            if (fillSat) fillSat.setAttribute('width', Math.max(6, (sat / 200) * 190));
            if (knobSat) knobSat.setAttribute('transform', 'translate(' + (7 + (sat / 200) * 190) + ', 12)');
            if (valSat) valSat.textContent = sat + '%';
            if (lblSat) lblSat.textContent = '2. SATURATION & CONTRAST (' + sat + '%)';

            // Slider 3: Brightness
            const fillBr = document.getElementById(id + '-fill-bright');
            const knobBr = document.getElementById(id + '-knob-bright');
            const valBr = document.getElementById(id + '-val-bright');
            const lblBr = document.getElementById(id + '-lbl-bright');
            if (fillBr) fillBr.setAttribute('width', Math.max(6, ((br + 100) / 200) * 190));
            if (knobBr) knobBr.setAttribute('transform', 'translate(' + (7 + ((br + 100) / 200) * 190) + ', 12)');
            if (valBr) valBr.textContent = (br >= 0 ? '+' : '') + br;
            if (lblBr) lblBr.textContent = '3. BRIGHTNESS / EXPOSURE (' + (br >= 0 ? '+' : '') + br + ')';

            // OLED Live Shader
            const stopC1 = document.getElementById(id + '-stop-c1');
            const stopC2 = document.getElementById(id + '-stop-c2');
            const stopC3 = document.getElementById(id + '-stop-c3');
            if (stopC1) stopC1.setAttribute('stop-color', colorState.c1);
            if (stopC2) stopC2.setAttribute('stop-color', colorState.c2);
            if (stopC3) stopC3.setAttribute('stop-color', colorState.c3);

            // HUD Badges
            const hudHex = document.getElementById(id + '-hud-hex');
            const hudOpcode = document.getElementById(id + '-hud-opcode');
            if (hudHex) hudHex.textContent = (colorState.c1 || '#06B6D4').toUpperCase();
            if (hudOpcode) hudOpcode.textContent = '0x' + op.toString(16).toUpperCase().padStart(2, '0');

            // ── 🎨 APPLY LIVE COLOR & GRADIENT DIRECTLY TO MAIN VIDEO CANVAS ──
            if (typeof customColors !== 'undefined') {
                customColors.c1 = colorState.c1;
                customColors.c2 = colorState.c2;
                customColors.c3 = colorState.c3;
            }
            if (typeof veState !== 'undefined') {
                veState.opcode = op;
                veState.isAppliedToMain = true;
            }

            const mainCanvas = document.getElementById('main-video-canvas');
            if (mainCanvas) {
                const brightFactor = 1 + (br / 100);
                const satFactor = sat;
                mainCanvas.style.filter = 'brightness(' + brightFactor + ') saturate(' + satFactor + '%)';
            }

            const mainIcon = document.getElementById('main-media-icon');
            if (mainIcon) {
                mainIcon.style.color = colorState.c1;
                mainIcon.style.filter = 'drop-shadow(0 0 25px ' + colorState.c1 + ')';
            }

            const mainText = document.getElementById('main-kinetic-text');
            if (mainText) {
                mainText.style.color = colorState.c1;
                mainText.style.textShadow = '0 0 20px ' + colorState.c2;
            }

            const status = document.getElementById('main-canvas-status');
            if (status) {
                status.innerHTML = '<span class="text-pink-400 font-bold">LIVE COLOR [Opcode: 0x' + op.toString(16).toUpperCase().padStart(2, '0') + ' | ' + colorState.hex + ' | Sat ' + sat + '%]</span>';
            }
        }

        function initColorSliderDrag() {
            const setupDrag = (hitId, channel) => {
                const hitEl = document.getElementById(hitId);
                if (!hitEl || hitEl._colorDragBound) return;
                hitEl._colorDragBound = true;

                const updateValFromEvt = (e) => {
                    const rect = hitEl.getBoundingClientRect();
                    if (!rect || rect.width <= 0) return;
                    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
                    const xRatio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
                    if (channel === 'hue') {
                        const next = Math.round(xRatio * 255);
                        if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined' && TITAN_REG.COLOR_EXPOSURE) {
                            TitanMicroBus.write(TITAN_REG.COLOR_EXPOSURE, next);
                        } else {
                            colorState.opcode = next;
                            updateColorFromOpcode(next);
                            updateColorUI('titan-svg-color-card');
                        }
                    } else if (channel === 'saturation') {
                        const next = Math.round(xRatio * 200);
                        if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined' && TITAN_REG.COLOR_SATURATION) {
                            TitanMicroBus.write(TITAN_REG.COLOR_SATURATION, next);
                        } else {
                            colorState.saturation = next;
                            updateColorUI('titan-svg-color-card');
                        }
                    } else if (channel === 'brightness') {
                        const next = Math.round(-100 + xRatio * 200);
                        if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined' && TITAN_REG.COLOR_CONTRAST) {
                            TitanMicroBus.write(TITAN_REG.COLOR_CONTRAST, next);
                        } else {
                            colorState.brightness = next;
                            updateColorUI('titan-svg-color-card');
                        }
                    }
                };

                let isDragging = false;
                hitEl.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    isDragging = true;
                    updateValFromEvt(e);
                });
                window.addEventListener('mousemove', (e) => {
                    if (isDragging) {
                        e.preventDefault();
                        updateValFromEvt(e);
                    }
                });
                window.addEventListener('mouseup', () => { isDragging = false; });

                hitEl.addEventListener('touchstart', (e) => {
                    isDragging = true;
                    updateValFromEvt(e);
                }, { passive: true });
                window.addEventListener('touchmove', (e) => {
                    if (isDragging) updateValFromEvt(e);
                }, { passive: true });
                window.addEventListener('touchend', () => { isDragging = false; });
            };

            setupDrag('titan-svg-color-card-hit-hue', 'hue');
            setupDrag('titan-svg-color-card-hit-sat', 'saturation');
            setupDrag('titan-svg-color-card-hit-bright', 'brightness');
        }

        // Attach TitanMicroBus subscribers for Color registers
        if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined') {
            const regHue = TITAN_REG.COLOR_EXPOSURE || 0x4120;
            const regSat = TITAN_REG.COLOR_SATURATION || 0x4122;
            const regBri = TITAN_REG.COLOR_CONTRAST || 0x4121;
            TitanMicroBus.subscribe(regHue, (val) => {
                colorState.opcode = Number(val);
                updateColorFromOpcode(colorState.opcode);
                updateColorUI('titan-svg-color-card');
            });
            TitanMicroBus.subscribe(regSat, (val) => {
                colorState.saturation = Number(val);
                updateColorUI('titan-svg-color-card');
            });
            TitanMicroBus.subscribe(regBri, (val) => {
                colorState.brightness = Number(val);
                updateColorUI('titan-svg-color-card');
            });
        }

        function switchColorMode(id, mode) {
            id = id || 'titan-svg-color-card';
            colorState.mode = mode;
            const modes = ['solid', 'gradient', 'mesh', 'palette'];
            modes.forEach(m => {
                const bg = document.getElementById(id + '-mode-' + (m === 'gradient' ? 'grad' : m) + '-bg');
                const txt = document.getElementById(id + '-mode-' + (m === 'gradient' ? 'grad' : m) + '-txt');
                if (bg) {
                    bg.setAttribute('fill', m === mode ? '#831843' : '#090d16');
                    bg.setAttribute('stroke', m === mode ? '#f472b6' : '#1e293b');
                }
                if (txt) {
                    txt.setAttribute('fill', m === mode ? '#ffffff' : '#94a3b8');
                }
            });
            showLiveToast('Color Mode', 'Mode switched to: ' + mode.toUpperCase(), 'info');
        }

        function selectDirectColor(id, hex) {
            id = id || 'titan-svg-color-card';
            colorState.c1 = hex;
            colorState.hex = hex.toUpperCase();
            colorState.mode = 'solid';
            if (typeof customColors !== 'undefined') {
                customColors.c1 = hex;
            }
            if (typeof veState !== 'undefined') {
                veState.isAppliedToMain = true;
            }
            updateColorUI(id);
            switchColorMode(id, 'solid');
            showLiveToast('Color Selected', 'Solid Color Swatch: ' + hex.toUpperCase(), 'success');
        }

        function switchColorTab(id, tab) {
            id = id || 'titan-svg-color-card';
            colorState.activeTab = tab;

            if (tab === 'anim') {
                switchActiveCardInspector('anim');
                return;
            }
            if (tab === 'transform') {
                switchActiveCardInspector('transform');
                return;
            }
            if (tab === 'solid') {
                colorState.mode = 'solid';
                switchColorMode(id, 'solid');
            } else if (tab === 'gradient') {
                colorState.mode = 'gradient';
                switchColorMode(id, 'gradient');
            } else if (tab === 'mesh') {
                colorState.mode = 'mesh';
                switchColorMode(id, 'mesh');
            } else if (tab === 'wheel') {
                colorState.mode = 'palette';
                switchColorMode(id, 'palette');
            }

            const tabs = ['anim', 'transform', 'solid', 'gradient', 'mesh', 'wheel'];
            tabs.forEach(k => {
                const el = document.getElementById(id + '-tab-' + k);
                if (el) {
                    const txt = el.querySelector('span:last-of-type');
                    if (k === tab) {
                        el.className = 'flex-shrink-0 w-[70px] h-[58px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 bg-pink-950 border-2 border-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.6)]';
                        if (txt) txt.className = 'text-[9px] font-black tracking-wider text-pink-300';
                    } else {
                        el.className = 'flex-shrink-0 w-[70px] h-[58px] flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800';
                        if (txt) txt.className = 'text-[9px] font-black tracking-wider text-slate-400';
                    }
                }
            });
            showLiveToast('Color Tab', 'Active Tab: ' + tab.toUpperCase(), 'info');
        }

        function applyColorPreset(id, c1, c2, c3, name) {
            id = id || 'titan-svg-color-card';
            colorState.c1 = c1;
            colorState.c2 = c2;
            colorState.c3 = c3;
            colorState.hex = c1.toUpperCase();
            if (typeof customColors !== 'undefined') {
                customColors.c1 = c1;
                customColors.c2 = c2;
                customColors.c3 = c3;
            }
            if (typeof veState !== 'undefined') {
                veState.isAppliedToMain = true;
            }
            updateColorUI(id);
            showLiveToast('Palette Applied', name + ' loaded into Color Engine & Main Canvas!', 'success');
        }

        function applyColorToTimeline(id) {
            const packet = TitanOpcodeBus.dispatch(TitanOpcodeBus.PROTOCOL.EVENTS.CARD_APPLY_TRIGGERED, {
                sender: 'titan_color_card',
                target: 'timeline',
                action: 'APPLY_COLOR',
                data: {
                    opcode: colorState.opcode,
                    mode: colorState.mode,
                    c1: colorState.c1,
                    c2: colorState.c2,
                    c3: colorState.c3,
                    saturation: colorState.saturation,
                    brightness: colorState.brightness
                }
            });
            console.log('⚡ [TitanOpcodeBus] Color Packet Dispatched:', packet);
            const status = document.getElementById('main-canvas-status');
            if (status) {
                status.innerHTML = '<span class="text-pink-400 font-bold">ACTIVE [Color Applied: ' + colorState.hex + ' | Opcode 0x' + (colorState.opcode || 12).toString(16).toUpperCase() + ']</span>';
            }
            showLiveToast('Color Applied', 'Color & Gradient parameters emitted to Timeline Bus!', 'success');
        }

        function toggleColorFrameMode(id) {
            colorState.isFrameMode = !colorState.isFrameMode;
            const outer = document.getElementById(id + '-outer-chassis');
            const bezel = document.getElementById(id + '-bezel');
            if (outer) outer.style.display = colorState.isFrameMode ? 'block' : 'none';
            if (bezel) bezel.style.display = colorState.isFrameMode ? 'block' : 'none';
            showLiveToast('Display Mode', 'Toggled Color Card: ' + (colorState.isFrameMode ? 'With Frame' : 'Without Frame'), 'info');
        }

        function scrollColorTabsLeft(id) {
            const el = document.getElementById(id + '-tabs-viewport');
            if (el) el.scrollBy({ left: -140, behavior: 'smooth' });
        }

        function scrollColorTabsRight(id) {
            const el = document.getElementById(id + '-tabs-viewport');
            if (el) el.scrollBy({ left: 140, behavior: 'smooth' });
        }

        // ═════════════════════════════════════════════════════════════════════════
        // 🔤 4TH FLAGSHIP: TITAN TYPOGRAPHY & 256 WORLD FONTS STUDIO CARD ENGINE
        // ═════════════════════════════════════════════════════════════════════════
        const typoState = {
            fontOpcode: 32, // 0x20 Sagarmatha Display by default
            fontSize: 28,
            activeTab: 'font',
            strokeWidth: 3,
            strokeColor: '#000000',
            shadow: 8,
            bgStyle: 'obsidian',
            bgOpacity: 80,
            bgRadius: 8,
            fillColor: '#fbbf24',
            gradient: 'none', // 'none' | 'sunset' | 'cyber' | 'chrome' | 'emerald'
            curveArc: 0, // -180 to +180
            isKaraoke: false,
            tracking: 1,
            isFrameMode: true,
            text: 'डाँफे सिनेमा स्टुडियो'
        };

        const clientFontsMap = (function() {
            const map = {};
            if (typeof GLOBAL_FONTS_256 !== 'undefined' && Array.isArray(GLOBAL_FONTS_256)) {
                GLOBAL_FONTS_256.forEach(f => { map[f.opcode] = f; });
            }
            return map;
        })();

        function getClientFont(op) {
            return clientFontsMap[op] || (typeof GLOBAL_FONTS_256 !== 'undefined' && GLOBAL_FONTS_256[op]) || { opcode: op, name: 'Font 0x' + op.toString(16).toUpperCase(), family: 'sans-serif' };
        }

        function switchTypoSubTab(subTabKey) {
            typoState.activeTab = subTabKey;
            const tabs = ['font', 'stroke', 'bg', 'grad', 'karaoke'];
            tabs.forEach(t => {
                const panel = document.getElementById('titan-svg-typo-card-panel-' + t);
                const btn = document.getElementById('titan-svg-typo-card-subtab-' + t);
                if (panel) panel.style.display = (t === subTabKey) ? 'inline' : 'none';
                if (btn) {
                    const isCur = (t === subTabKey);
                    btn.style.background = isCur ? '#ea580c' : '#0f172a';
                    btn.style.color = isCur ? '#ffffff' : '#fb923c';
                    btn.style.borderColor = isCur ? '#fb923c' : '#334155';
                }
            });
            showLiveToast('Typo Sub-Tab', 'Switched: ' + subTabKey.toUpperCase(), 'info');
        }

        function setTypoFontSize(val) {
            typoState.fontSize = parseInt(val);
            const el = document.getElementById('titan-svg-typo-card-val-size');
            if (el) el.textContent = val + 'px';
            updateTypoUI();
            renderVeTitleLayer();
        }

        function setTypoCurveArc(val) {
            typoState.curveArc = parseInt(val);
            const el = document.getElementById('val-typo-arc');
            if (el) el.textContent = val + '°';
            renderVeTitleLayer();
        }

        function setTypoGradient(gradName) {
            typoState.gradient = gradName;
            renderVeTitleLayer();
            showLiveToast('Text Gradient', 'Applied Gradient: ' + gradName.toUpperCase(), 'info');
        }

        function toggleKaraokeMode() {
            typoState.isKaraoke = !typoState.isKaraoke;
            const btn = document.getElementById('btn-toggle-karaoke');
            if (btn) {
                btn.style.background = typoState.isKaraoke ? '#10b981' : '#334155';
                btn.textContent = typoState.isKaraoke ? 'ACTIVE ON' : 'ENABLE';
            }
            renderVeTitleLayer();
            showLiveToast('CapCut Karaoke', typoState.isKaraoke ? '🎤 Activated Word-by-Word Active Caption Glow!' : 'Paused Karaoke Highlight', 'success');
        }

        function applyViralTypoTemplate(tpl) {
            if (tpl === 'tiktok') {
                typoState.fontOpcode = 160; // Sans bold
                typoState.fontSize = 32;
                typoState.strokeWidth = 4;
                typoState.strokeColor = '#000000';
                typoState.bgStyle = 'obsidian';
                typoState.bgOpacity = 90;
                typoState.fillColor = '#fde047';
                typoState.isKaraoke = true;
                typoState.gradient = 'none';
            } else if (tpl === 'netflix') {
                typoState.fontOpcode = 128; // Serif luxury
                typoState.fontSize = 24;
                typoState.strokeWidth = 0;
                typoState.bgStyle = 'obsidian';
                typoState.bgOpacity = 60;
                typoState.fillColor = '#ffffff';
                typoState.tracking = 4;
                typoState.isKaraoke = false;
            } else if (tpl === 'news') {
                typoState.fontOpcode = 96; // Movie Impact
                typoState.fontSize = 28;
                typoState.strokeWidth = 2;
                typoState.strokeColor = '#fbbf24';
                typoState.bgStyle = 'red';
                typoState.bgOpacity = 95;
                typoState.fillColor = '#ffffff';
                typoState.isKaraoke = false;
            } else if (tpl === 'gaming') {
                typoState.fontOpcode = 64; // Cyber
                typoState.fontSize = 30;
                typoState.strokeWidth = 3;
                typoState.strokeColor = '#06b6d4';
                typoState.bgStyle = 'glass';
                typoState.bgOpacity = 85;
                typoState.gradient = 'cyber';
                typoState.shadow = 16;
            }
            updateTypoUI();
            renderVeTitleLayer();
            showLiveToast('Viral Template', '🚀 Applied Template: ' + tpl.toUpperCase(), 'success');
        }

        function setTypoStrokeColor(col) {
            typoState.strokeColor = col;
            updateTypoUI();
            renderVeTitleLayer();
            showLiveToast('Text Outline', 'Set Stroke Color: ' + col, 'info');
        }

        function setTypoStrokeWidth(val) {
            typoState.strokeWidth = parseInt(val);
            const el = document.getElementById('val-typo-stroke');
            if (el) el.textContent = val + ' px';
            updateTypoUI();
            renderVeTitleLayer();
        }

        function setTypoShadow(val) {
            typoState.shadow = parseInt(val);
            const el = document.getElementById('val-typo-shadow');
            if (el) el.textContent = val + ' px';
            renderVeTitleLayer();
        }

        function setTypoBgStyle(style) {
            typoState.bgStyle = style;
            updateTypoUI();
            renderVeTitleLayer();
            showLiveToast('Subtitle Box', 'Set Background Style: ' + style.toUpperCase(), 'info');
        }

        function setTypoBgOpacity(val) {
            typoState.bgOpacity = parseInt(val);
            const el = document.getElementById('val-typo-bg-op');
            if (el) el.textContent = val + '%';
            renderVeTitleLayer();
        }

        function setTypoBgRadius(val) {
            typoState.bgRadius = parseInt(val);
            const el = document.getElementById('val-typo-bg-rad');
            if (el) el.textContent = val + ' px';
            renderVeTitleLayer();
        }

        function setTypoFillColor(col) {
            typoState.fillColor = col;
            typoState.gradient = 'none';
            updateTypoUI();
            renderVeTitleLayer();
            showLiveToast('Text Fill Color', 'Set Fill: ' + col, 'info');
        }

        function setTypoTracking(val) {
            typoState.tracking = parseInt(val);
            const el = document.getElementById('val-typo-tracking');
            if (el) el.textContent = val + ' px';
            renderVeTitleLayer();
        }

        function onTypoTextInput(id, text) {
            id = id || 'titan-svg-typo-card';
            typoState.text = text || '';
            if (typeof veState !== 'undefined') {
                veState.text = text || '';
            }
            updateTypoUI(id);
            if (typeof renderVeTitleLayer === 'function') {
                renderVeTitleLayer();
            }
        }

        function updateTypoUI(id) {
            id = id || 'titan-svg-typo-card';
            const op = typoState.fontOpcode || 0;
            const size = typoState.fontSize || 28;
            const fontObj = getClientFont(op);
            const hex = '0x' + op.toString(16).toUpperCase().padStart(2, '0');
            const fontFam = fontObj.family || 'sans-serif';

            // Text Input Box Sync
            const inputTxt = document.getElementById(id + '-input-text');
            if (inputTxt && document.activeElement !== inputTxt) {
                inputTxt.value = typoState.text || '';
            }

            // Slider 1: Font Opcode
            const fillF = document.getElementById(id + '-fill-font');
            const knobF = document.getElementById(id + '-knob-font');
            const valF = document.getElementById(id + '-val-font');
            const lblF = document.getElementById(id + '-lbl-font');
            if (fillF) fillF.setAttribute('width', Math.max(6, (op / 255) * 190));
            if (knobF) knobF.setAttribute('transform', 'translate(' + (7 + (op / 255) * 190) + ', 12)');
            if (valF) valF.textContent = op.toString().padStart(3, '0');
            if (lblF) lblF.textContent = '1. 256 WORLD FONT BANK (' + op + ')';

            // Slider 2: Font Size
            const fillS = document.getElementById(id + '-fill-size');
            const knobS = document.getElementById(id + '-knob-size');
            const valS = document.getElementById(id + '-val-size');
            const lblS = document.getElementById(id + '-lbl-size');
            if (fillS) fillS.setAttribute('width', Math.max(6, ((size - 12) / 132) * 190));
            if (knobS) knobS.setAttribute('transform', 'translate(' + (7 + ((size - 12) / 132) * 190) + ', 12)');
            if (valS) valS.textContent = size + 'px';
            if (lblS) lblS.textContent = '2. FONT SIZE (' + size + 'px)';

            // HUD Badges
            const hudName = document.getElementById(id + '-hud-fontname');
            const hudOp = document.getElementById(id + '-hud-opcode');
            if (hudName) hudName.textContent = (fontObj.name || '').slice(0, 18);
            if (hudOp) hudOp.textContent = 'OPCODE ' + hex;

            // Live Text Stage Inside Card
            const txtPrimary = document.getElementById(id + '-live-text-primary');
            const txtSec = document.getElementById(id + '-live-text-secondary');
            const bgPad = document.getElementById(id + '-preview-bg-pad');
            if (txtPrimary) {
                txtPrimary.style.setProperty('font-family', fontFam, 'important');
                txtPrimary.style.fontSize = Math.min(26, size) + 'px';
                txtPrimary.setAttribute('fill', typoState.fillColor || '#fbbf24');
                txtPrimary.setAttribute('stroke', typoState.strokeColor || '#000000');
                txtPrimary.setAttribute('stroke-width', typoState.strokeWidth || 0);
                txtPrimary.textContent = typoState.text || ' ';
            }
            if (txtSec) {
                txtSec.style.setProperty('font-family', fontFam, 'important');
                txtSec.textContent = (fontObj.name || '').toUpperCase() + ' • ' + hex;
            }
            if (bgPad) {
                bgPad.style.display = (typoState.bgStyle === 'none') ? 'none' : 'inline';
                if (typoState.bgStyle === 'obsidian') {
                    bgPad.setAttribute('fill', '#000000');
                    bgPad.setAttribute('stroke', '#38bdf8');
                } else if (typoState.bgStyle === 'red') {
                    bgPad.setAttribute('fill', '#7f1d1d');
                    bgPad.setAttribute('stroke', '#ef4444');
                } else if (typoState.bgStyle === 'gold') {
                    bgPad.setAttribute('fill', '#78350f');
                    bgPad.setAttribute('stroke', '#fbbf24');
                } else if (typoState.bgStyle === 'glass') {
                    bgPad.setAttribute('fill', '#083344');
                    bgPad.setAttribute('stroke', '#06b6d4');
                }
                bgPad.setAttribute('fill-opacity', (typoState.bgOpacity || 80) / 100);
            }

            // ── 🎨 APPLY DIRECTLY TO MAIN VIDEO CANVAS TEXT ──
            const mainText = document.getElementById('main-kinetic-text');
            if (mainText) {
                mainText.style.setProperty('font-family', fontFam, 'important');
                mainText.style.fontSize = (size * 0.8) + 'px';
                mainText.textContent = typoState.text || ' ';
            }
            const sampleText = document.getElementById('ve-sample-text');
            if (sampleText) {
                sampleText.style.setProperty('font-family', fontFam, 'important');
                sampleText.textContent = typoState.text || ' ';
            }

            const status = document.getElementById('main-canvas-status');
            if (status) {
                status.innerHTML = '<span class="text-amber-400 font-bold">LIVE TYPO [' + hex + ': ' + fontObj.name + ' | ' + size + 'px]</span>';
            }
        }

        function stepTypoChannel(id, channel, delta) {
            id = id || 'titan-svg-typo-card';
            if (channel === 'font') {
                typoState.fontOpcode = (typoState.fontOpcode + delta + 256) % 256;
                if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined') {
                    TitanMicroBus.write(0x4130, typoState.fontOpcode);
                }
            } else if (channel === 'size') {
                typoState.fontSize = Math.max(12, Math.min(144, (typoState.fontSize || 28) + delta));
                if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined') {
                    TitanMicroBus.write(0x4131, typoState.fontSize);
                }
            }
            updateTypoUI(id);
        }

        function initTypoSliderDrag() {
            const id = 'titan-svg-typo-card';
            const setupDrag = (hitId, channel) => {
                const hitEl = document.getElementById(hitId);
                if (!hitEl) return;

                const updateFromEvt = (e) => {
                    const rect = hitEl.getBoundingClientRect();
                    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
                    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

                    if (channel === 'font') {
                        typoState.fontOpcode = Math.round(ratio * 255);
                    } else if (channel === 'size') {
                        typoState.fontSize = Math.round(12 + ratio * 132);
                    }
                    updateTypoUI(id);
                };

                let isDragging = false;
                hitEl.addEventListener('mousedown', (e) => { isDragging = true; updateFromEvt(e); });
                window.addEventListener('mousemove', (e) => { if (isDragging) updateFromEvt(e); });
                window.addEventListener('mouseup', () => { isDragging = false; });
                hitEl.addEventListener('touchstart', (e) => { isDragging = true; updateFromEvt(e); }, { passive: true });
                window.addEventListener('touchmove', (e) => { if (isDragging) updateFromEvt(e); }, { passive: true });
                window.addEventListener('touchend', () => { isDragging = false; });
            };

            setupDrag(id + '-hit-font', 'font');
            setupDrag(id + '-hit-size', 'size');
        }

        function switchTypoStyle(id, style) {
            id = id || 'titan-svg-typo-card';
            typoState.textStyle = style;
            const styles = ['normal', '3d', 'neon', 'curve'];
            styles.forEach(s => {
                const bg = document.getElementById(id + '-style-' + s + '-bg');
                const txt = document.getElementById(id + '-style-' + s + '-txt');
                if (bg) {
                    bg.setAttribute('fill', s === style ? '#78350f' : '#090d16');
                    bg.setAttribute('stroke', s === style ? '#f59e0b' : '#1e293b');
                }
                if (txt) {
                    txt.setAttribute('fill', s === style ? '#ffffff' : '#94a3b8');
                }
            });
            updateTypoUI(id);
            showLiveToast('Text Style', 'Typography Style: ' + style.toUpperCase(), 'info');
        }

        function jumpTypoOpcode(id, opcode, name) {
            id = id || 'titan-svg-typo-card';
            typoState.fontOpcode = opcode;
            updateTypoUI(id);
            showLiveToast('Sector Jump', 'Jumped to ' + name + ' (Opcode: 0x' + opcode.toString(16).toUpperCase().padStart(2, '0') + ')', 'success');
        }

        function switchTypoTab(id, tab) {
            id = id || 'titan-svg-typo-card';
            if (tab === 'anim') {
                switchActiveCardInspector('anim');
                return;
            }
            if (tab === 'transform') {
                switchActiveCardInspector('transform');
                return;
            }
            if (tab === 'color') {
                switchActiveCardInspector('color');
                return;
            }
            if (tab === '3d') {
                switchTypoStyle(id, '3d');
                return;
            }
            if (tab === 'curve') {
                switchTypoStyle(id, 'curve');
                return;
            }
            showLiveToast('Typo Tab', 'Active Tab: ' + tab.toUpperCase(), 'info');
        }

        function applyTypoToTimeline(id) {
            const fontObj = getClientFont(typoState.fontOpcode);
            const packet = TitanOpcodeBus.dispatch(TitanOpcodeBus.PROTOCOL.EVENTS.CARD_APPLY_TRIGGERED, {
                sender: 'titan_typo_card',
                target: 'timeline',
                action: 'APPLY_TYPOGRAPHY',
                data: {
                    fontOpcode: typoState.fontOpcode,
                    fontName: fontObj.name,
                    fontFamily: fontObj.family,
                    fontSize: typoState.fontSize,
                    kerning: typoState.kerning,
                    textStyle: typoState.textStyle
                }
            });
            console.log('⚡ [TitanOpcodeBus] Typo Packet Dispatched:', packet);
            showLiveToast('Typography Applied', fontObj.name + ' emitted to Timeline Bus!', 'success');
        }

        function toggleTypoFrameMode(id) {
            typoState.isFrameMode = !typoState.isFrameMode;
            const outer = document.getElementById(id + '-outer-chassis');
            const bezel = document.getElementById(id + '-bezel');
            if (outer) outer.style.display = typoState.isFrameMode ? 'block' : 'none';
            if (bezel) bezel.style.display = typoState.isFrameMode ? 'block' : 'none';
            showLiveToast('Display Mode', 'Toggled Typo Card: ' + (typoState.isFrameMode ? 'With Frame' : 'Without Frame'), 'info');
        }

        function scrollTypoTabsLeft(id) {
            const el = document.getElementById(id + '-tabs-viewport');
            if (el) el.scrollBy({ left: -140, behavior: 'smooth' });
        }

        function scrollTypoTabsRight(id) {
            const el = document.getElementById(id + '-tabs-viewport');
            if (el) el.scrollBy({ left: 140, behavior: 'smooth' });
        }

        // ═════════════════════════════════════════════════════════════════════════
        // 💥 5TH FLAGSHIP: TITAN VFX, SUPERMAN LASER & POWER SHADERS STUDIO CARD
        // ═════════════════════════════════════════════════════════════════════════
        const vfxState = {
            effectOpcode: 32, // 0x20 Superman Heat Vision Beam by default
            intensity: 100,
            strokeWidth: 16,
            turbulence: 1.0,
            isPenMode: true,
            isFrameMode: true,
            activeTab: 'vfx',
            userPaths: [
                // Sample glowing Superman laser arc across the project stage
                [
                    { x: 120, y: 190 },
                    { x: 260, y: 150 },
                    { x: 400, y: 220 },
                    { x: 540, y: 140 },
                    { x: 680, y: 180 }
                ]
            ],
            currentStroke: null
        };

        const clientVfxMap = (function() {
            const map = {};
            if (typeof GLOBAL_EFFECTS_256 !== 'undefined' && Array.isArray(GLOBAL_EFFECTS_256)) {
                GLOBAL_EFFECTS_256.forEach(e => { map[e.opcode] = e; });
            }
            return map;
        })();

        function getClientVfx(op) {
            return clientVfxMap[op] || (typeof GLOBAL_EFFECTS_256 !== 'undefined' && GLOBAL_EFFECTS_256[op]) || {
                opcode: op,
                name: 'VFX Shader 0x' + op.toString(16).toUpperCase(),
                color1: '#ff0033',
                color2: '#ffffff',
                color3: '#ff8800',
                glow: 35,
                mode: 'superman_laser',
                speed: 1.4
            };
        }

        function updateVfxUI(id) {
            id = id || 'titan-svg-effect-card';
            const op = vfxState.effectOpcode || 0;
            const inten = vfxState.intensity || 100;
            const width = vfxState.strokeWidth || 16;
            const vfxObj = getClientVfx(op);
            const hex = '0x' + op.toString(16).toUpperCase().padStart(2, '0');

            // Slider 1: VFX Opcode
            const fillO = document.getElementById(id + '-fill-vfx');
            const knobO = document.getElementById(id + '-knob-vfx');
            const valO = document.getElementById(id + '-val-vfx');
            const lblO = document.getElementById(id + '-lbl-vfx');
            const badgeO = document.getElementById(id + '-badge-vfx');
            if (fillO) fillO.setAttribute('width', Math.max(6, (op / 255) * 190));
            if (knobO) knobO.setAttribute('transform', 'translate(' + (7 + (op / 255) * 190) + ', 12)');
            if (valO) valO.textContent = op.toString().padStart(3, '0');
            if (lblO) lblO.textContent = '1. VFX POWER SHADER (' + op + ')';
            if (badgeO) badgeO.textContent = 'REG 0x4140 (' + hex + ')';

            // Slider 2: Intensity
            const fillI = document.getElementById(id + '-fill-intensity');
            const knobI = document.getElementById(id + '-knob-intensity');
            const valI = document.getElementById(id + '-val-intensity');
            const lblI = document.getElementById(id + '-lbl-intensity');
            if (fillI) fillI.setAttribute('width', Math.max(6, ((inten - 20) / 180) * 190));
            if (knobI) knobI.setAttribute('transform', 'translate(' + (7 + ((inten - 20) / 180) * 190) + ', 12)');
            if (valI) valI.textContent = inten + '%';
            if (lblI) lblI.textContent = '2. ENERGY INTENSITY & BLOOM (' + inten + '%)';

            // Slider 3: Width
            const fillW = document.getElementById(id + '-fill-width');
            const knobW = document.getElementById(id + '-knob-width');
            const valW = document.getElementById(id + '-val-width');
            const lblW = document.getElementById(id + '-lbl-width');
            if (fillW) fillW.setAttribute('width', Math.max(6, ((width - 4) / 44) * 190));
            if (knobW) knobW.setAttribute('transform', 'translate(' + (7 + ((width - 4) / 44) * 190) + ', 12)');
            if (valW) valW.textContent = width + 'px';
            if (lblW) lblW.textContent = '3. STROKE WIDTH & RADIUS (' + width + 'px)';

            // HUD Badges
            const hudName = document.getElementById(id + '-hud-vfxname');
            const hudOp = document.getElementById(id + '-hud-opcode');
            const hudSpecs = document.getElementById(id + '-hud-specs');
            if (hudName) hudName.textContent = (vfxObj.name || '').slice(0, 20);
            if (hudOp) hudOp.textContent = 'OPCODE ' + hex;
            if (hudSpecs) hudSpecs.textContent = 'GLOW: ' + inten + '% | W: ' + width + 'px';

            // OLED Viewport SVG Stroke Colors
            const halo = document.getElementById(id + '-vfx-halo');
            const arc = document.getElementById(id + '-vfx-arc');
            const core = document.getElementById(id + '-vfx-core');
            if (halo) {
                halo.setAttribute('stroke', vfxObj.color1 || '#ff0033');
                halo.setAttribute('stroke-width', width * 2);
            }
            if (arc) {
                arc.setAttribute('stroke', vfxObj.color3 || '#ff8800');
                arc.setAttribute('stroke-width', width);
            }
            if (core) {
                core.setAttribute('stroke', vfxObj.color2 || '#ffffff');
                core.setAttribute('stroke-width', Math.max(3, width * 0.4));
            }

            const status = document.getElementById('main-canvas-status');
            if (status) {
                status.innerHTML = '<span class="text-red-400 font-bold">LIVE VFX [' + hex + ': ' + vfxObj.name + ']</span>';
            }
        }

        function stepVfxChannel(id, channel, delta) {
            id = id || 'titan-svg-effect-card';
            if (channel === 'opcode') {
                vfxState.effectOpcode = (vfxState.effectOpcode + delta + 256) % 256;
                if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined') {
                    TitanMicroBus.write(0x4140, vfxState.effectOpcode);
                }
            } else if (channel === 'intensity') {
                vfxState.intensity = Math.max(20, Math.min(200, (vfxState.intensity || 100) + delta));
                if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined') {
                    TitanMicroBus.write(0x4141, vfxState.intensity);
                }
            } else if (channel === 'width') {
                vfxState.strokeWidth = Math.max(4, Math.min(48, (vfxState.strokeWidth || 16) + delta));
                if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined') {
                    TitanMicroBus.write(0x4142, vfxState.strokeWidth);
                }
            }
            updateVfxUI(id);
        }

        function initVfxSliderDrag() {
            const id = 'titan-svg-effect-card';
            const setupDrag = (hitId, channel) => {
                const hitEl = document.getElementById(hitId);
                if (!hitEl) return;

                const updateFromEvt = (e) => {
                    const rect = hitEl.getBoundingClientRect();
                    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
                    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

                    if (channel === 'opcode') {
                        vfxState.effectOpcode = Math.round(ratio * 255);
                    } else if (channel === 'intensity') {
                        vfxState.intensity = Math.round(20 + ratio * 180);
                    } else if (channel === 'width') {
                        vfxState.strokeWidth = Math.round(4 + ratio * 44);
                    }
                    updateVfxUI(id);
                };

                let isDragging = false;
                hitEl.addEventListener('mousedown', (e) => { isDragging = true; updateFromEvt(e); });
                window.addEventListener('mousemove', (e) => { if (isDragging) updateFromEvt(e); });
                window.addEventListener('mouseup', () => { isDragging = false; });
                hitEl.addEventListener('touchstart', (e) => { isDragging = true; updateFromEvt(e); }, { passive: true });
                window.addEventListener('touchmove', (e) => { if (isDragging) updateFromEvt(e); }, { passive: true });
                window.addEventListener('touchend', () => { isDragging = false; });
            };

            setupDrag(id + '-hit-vfx', 'opcode');
            setupDrag(id + '-hit-intensity', 'intensity');
            setupDrag(id + '-hit-width', 'width');
        }

        function jumpVfxOpcode(id, opcode, name) {
            id = id || 'titan-svg-effect-card';
            vfxState.effectOpcode = opcode;
            updateVfxUI(id);
            showLiveToast('VFX Sector Jump', 'Jumped to ' + name + ' (Opcode: 0x' + opcode.toString(16).toUpperCase().padStart(2, '0') + ')', 'success');
        }

        function toggleCanvasPenMode(id) {
            id = id || 'titan-svg-effect-card';
            vfxState.isPenMode = !vfxState.isPenMode;
            
            const btn = document.getElementById('btn-toggle-canvas-pen');
            const cardBg = document.getElementById(id + '-pen-mode-bg');
            const cardDot = document.getElementById(id + '-pen-mode-dot');
            const cardTxt = document.getElementById(id + '-pen-mode-txt');
            
            if (btn) {
                if (vfxState.isPenMode) {
                    btn.className = 'px-2.5 py-1 rounded-lg text-[11px] font-black bg-red-950/80 border border-red-500 text-red-300 hover:bg-red-900 transition-all flex items-center gap-1.5 shadow';
                    btn.innerHTML = '<span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span><span>🖌️ LIVE PEN: ACTIVE</span>';
                } else {
                    btn.className = 'px-2.5 py-1 rounded-lg text-[11px] font-black bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-1.5 shadow';
                    btn.innerHTML = '<span class="w-2 h-2 rounded-full bg-slate-500"></span><span>🖌️ LIVE PEN: STANDBY</span>';
                }
            }
            if (cardBg) cardBg.setAttribute('fill', vfxState.isPenMode ? '#450a0a' : '#090d16');
            if (cardDot) cardDot.setAttribute('fill', vfxState.isPenMode ? '#ef4444' : '#64748b');
            if (cardTxt) {
                cardTxt.textContent = '🖌️ LIVE CANVAS POWER PEN: ' + (vfxState.isPenMode ? 'ACTIVE (DRAW ANYWHERE ON CANVAS)' : 'STANDBY');
                cardTxt.setAttribute('fill', vfxState.isPenMode ? '#fee2e2' : '#94a3b8');
            }
            showLiveToast('Canvas Pen', 'Live Power Pen is now: ' + (vfxState.isPenMode ? 'ACTIVE (Draw on canvas!)' : 'STANDBY'), 'info');
        }

        function clearCanvasVfxStrokes() {
            vfxState.userPaths = [];
            vfxState.currentStroke = null;
            showLiveToast('Canvas Pen', 'All power VFX strokes cleared!', 'info');
        }

        function toggleVfxFrameMode(id) {
            vfxState.isFrameMode = !vfxState.isFrameMode;
            const outer = document.getElementById(id + '-outer-chassis');
            const bezel = document.getElementById(id + '-bezel');
            if (outer) outer.style.display = vfxState.isFrameMode ? 'block' : 'none';
            if (bezel) bezel.style.display = vfxState.isFrameMode ? 'block' : 'none';
            showLiveToast('Display Mode', 'Toggled VFX Card: ' + (vfxState.isFrameMode ? 'With Frame' : 'Without Frame'), 'info');
        }

        function scrollVfxTabsLeft(id) {
            const el = document.getElementById(id + '-tabs-viewport');
            if (el) el.scrollBy({ left: -140, behavior: 'smooth' });
        }

        function scrollVfxTabsRight(id) {
            const el = document.getElementById(id + '-tabs-viewport');
            if (el) el.scrollBy({ left: 140, behavior: 'smooth' });
        }

        function switchVfxTab(id, tab) {
            id = id || 'titan-svg-effect-card';
            if (tab === 'anim') {
                switchActiveCardInspector('anim');
                return;
            }
            if (tab === 'transform') {
                switchActiveCardInspector('transform');
                return;
            }
            if (tab === 'color') {
                switchActiveCardInspector('color');
                return;
            }
            if (tab === 'typo') {
                switchActiveCardInspector('typo');
                return;
            }
            showLiveToast('VFX Tab', 'Active Tab: ' + tab.toUpperCase(), 'info');
        }

        function applyVfxToTimeline(id) {
            const vfxObj = getClientVfx(vfxState.effectOpcode);
            const packet = TitanOpcodeBus.dispatch(TitanOpcodeBus.PROTOCOL.EVENTS.CARD_APPLY_TRIGGERED, {
                sender: 'titan_vfx_card',
                target: 'timeline',
                action: 'APPLY_VFX_SHADER',
                data: {
                    opcode: vfxState.effectOpcode,
                    name: vfxObj.name,
                    category: vfxObj.category,
                    intensity: vfxState.intensity,
                    strokeWidth: vfxState.strokeWidth,
                    turbulence: vfxState.turbulence,
                    pathsCount: vfxState.userPaths.length
                }
            });
            console.log('⚡ [TitanOpcodeBus] VFX Packet Dispatched:', packet);
            showLiveToast('VFX Applied', vfxObj.name + ' emitted to Timeline Bus!', 'success');
        }

        // ═════════════════════════════════════════════════════════════════════════
        // 📁 6TH FLAGSHIP: 360° ROTARY MEDIA INGESTION WHEEL & IMPORTED FILES POOL
        // ═════════════════════════════════════════════════════════════════════════
        const MEDIA_WHEEL_CATEGORIES = [
            { id: 'video', name: 'Video Clips', label: '🎬 VIDEO', icon: '🎬', color: '#38bdf8', bg: '#082f49', stroke: '#0284c7', angle: 0, accept: 'video/*' },
            { id: 'photo', name: 'Photos & Logos', label: '📸 PHOTO', icon: '📸', color: '#c084fc', bg: '#3b0764', stroke: '#a855f7', angle: 45, accept: 'image/*' },
            { id: 'audio', name: 'Audio & Music', label: '🎵 AUDIO', icon: '🎵', color: '#34d399', bg: '#064e3b', stroke: '#10b981', angle: 90, accept: 'audio/*' },
            { id: 'cloud', name: 'Cloud & Stock', label: '🌐 CLOUD', icon: '🌐', color: '#fbbf24', bg: '#451a03', stroke: '#f59e0b', angle: 135, accept: '*/*' },
            { id: 'text', name: 'Kinetic Text', label: '✍️ TEXT', icon: '✍️', color: '#f472b6', bg: '#500724', stroke: '#ec4899', angle: 180, accept: '.txt,.json' },
            { id: 'vfx', name: 'VFX Shaders', label: '💥 VFX', icon: '💥', color: '#ef4444', bg: '#450a0a', stroke: '#dc2626', angle: 225, accept: '.fx,.frag' },
            { id: 'elements', name: 'Shapes & Badges', label: '🎭 SHAPES', icon: '🎭', color: '#60a5fa', bg: '#172554', stroke: '#3b82f6', angle: 270, accept: '.svg' },
            { id: 'voice', name: 'Voiceover Mic', label: '🎙️ RECORD', icon: '🎙️', color: '#facc15', bg: '#3a2e04', stroke: '#eab308', angle: 315, accept: 'audio/*' }
        ];

        // 📋 Live Ingested Media Files Pool (Sorted & Filtered by Route)
        const importedMediaPool = {
            video: [
                { name: 'Cinematic_Drone_4K.mp4', icon: '🎬', desc: '4K UHD • 60FPS • 18.2 MB', duration: '00:15', type: 'video' },
                { name: 'Cyber_City_Night.mp4', icon: '🏙️', desc: '1080p • 30FPS • 9.4 MB', duration: '00:08', type: 'video' },
                { name: 'Hyperlapse_Vortex.mp4', icon: '🏎️', desc: '4K • 120FPS • 24.1 MB', duration: '00:22', type: 'video' }
            ],
            photo: [
                { name: 'Danphe_Official_Logo.png', icon: '🦚', desc: 'PNG • Transparent • 2.4 MB', duration: 'Static', type: 'photo' },
                { name: 'Cyberpunk_Emblem.svg', icon: '⚡', desc: 'Vector SVG • 480 KB', duration: 'Static', type: 'photo' },
                { name: 'Titan_Watermark_Badge.png', icon: '🛡️', desc: 'PNG • 4K Alpha • 1.1 MB', duration: 'Static', type: 'photo' }
            ],
            audio: [
                { name: 'Retro_Synthwave_BGM.mp3', icon: '🎹', desc: '320kbps • 128 BPM • 4.8 MB', duration: '02:30', type: 'audio' },
                { name: 'Epic_Cinema_Trailer.wav', icon: '🎻', desc: '48kHz RAW • 14.2 MB', duration: '01:45', type: 'audio' },
                { name: 'Laser_Beam_Impact.sfx', icon: '🔊', desc: 'Sci-Fi Soundbite • 120 KB', duration: '00:02', type: 'audio' }
            ],
            cloud: [
                { name: 'Pexels_Cloud_Stock_4K.mp4', icon: '☁️', desc: 'Cloud Stock • 1080p • 12.1 MB', duration: '00:20', type: 'cloud' },
                { name: 'Unsplash_Urban_Hero.jpg', icon: '📷', desc: 'High-Res Photo • 6.4 MB', duration: 'Static', type: 'cloud' },
                { name: 'Giphy_Neon_Sticker.webp', icon: '✨', desc: 'Animated WebP • 850 KB', duration: '00:04', type: 'cloud' }
            ],
            text: [
                { name: 'Viral_Reel_Subtitle.ktext', icon: '📱', desc: 'Kinetic Subtitle • Yellow Pill', duration: '00:05', type: 'text' },
                { name: 'Cinema_3D_Headline.ktext', icon: '🎬', desc: '3D Gold Extrusion Title', duration: '00:08', type: 'text' },
                { name: 'Neon_Electric_Glow.ktext', icon: '✨', desc: 'Cyan Bloom Lower-Third', duration: '00:06', type: 'text' }
            ],
            vfx: [
                { name: 'Inferno_Fire_Flame.fx', icon: '🔥', desc: 'GPU Shader 0x00 • Volumetric Flame', duration: 'Live', type: 'vfx' },
                { name: 'Superman_Heat_Laser.fx', icon: '⚡', desc: 'GPU Shader 0x20 • Plasma Core', duration: 'Live', type: 'vfx' },
                { name: 'Cryo_Ice_Blizzard.fx', icon: '❄️', desc: 'GPU Shader 0x80 • Ice Shards', duration: 'Live', type: 'vfx' }
            ],
            elements: [
                { name: 'Neon_Target_Circle.svg', icon: '⭕', desc: 'Vector SVG • Reticle Mask', duration: 'Static', type: 'elements' },
                { name: 'Hexagon_Forcefield.svg', icon: '⬡', desc: 'Vector Mask • Shield Grid', duration: 'Static', type: 'elements' },
                { name: 'Cinematic_Letterbox.svg', icon: '⬛', desc: '2.39:1 Cinema Mask', duration: 'Static', type: 'elements' }
            ],
            voice: [
                { name: 'Studio_Voiceover_Take01.wav', icon: '🎙️', desc: 'HD 48kHz Audio • 6.2 MB', duration: '00:45', type: 'voice' },
                { name: 'Screen_Capture_Audio.wav', icon: '🖥️', desc: 'Stereo Audio • 18.5 MB', duration: '03:10', type: 'voice' },
                { name: 'AI_Nepali_Voiceover.wav', icon: '🤖', desc: 'AI Neural Voice • 2.1 MB', duration: '00:18', type: 'voice' }
            ]
        };

        const mediaState = {
            activeCategoryIdx: 0,
            wheelAngle: 0,
            targetAngle: 0,
            isDraggingWheel: false,
            loadedMedia: null
        };

        function shortestAngleDistance(current, target) {
            let delta = ((target - current) % 360);
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;
            return current + delta;
        }

        function selectRotaryCategory(id, idx, shouldOpenPicker) {
            id = id || 'titan-svg-media-card';
            mediaState.activeCategoryIdx = (idx + MEDIA_WHEEL_CATEGORIES.length) % MEDIA_WHEEL_CATEGORIES.length;
            const cat = MEDIA_WHEEL_CATEGORIES[mediaState.activeCategoryIdx];
            
            // Smooth shortest path interpolation
            mediaState.targetAngle = shortestAngleDistance(mediaState.wheelAngle, cat.angle);
            mediaState.wheelAngle = mediaState.targetAngle;
            
            if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined') {
                TitanMicroBus.write(0x4150, mediaState.activeCategoryIdx);
            }
            updateMediaWheelUI(id);
            showLiveToast('Media Route', 'Selected: ' + cat.label, 'info');

            if (shouldOpenPicker) {
                triggerNativeMediaImport(id);
            }
        }

        function stepRotaryWheel(id, deltaAngle) {
            id = id || 'titan-svg-media-card';
            mediaState.wheelAngle = (mediaState.wheelAngle + deltaAngle);
            
            // Normalize angle to find nearest route (45° per route)
            const norm = ((mediaState.wheelAngle % 360) + 360) % 360;
            mediaState.activeCategoryIdx = Math.round(norm / 45) % MEDIA_WHEEL_CATEGORIES.length;
            
            if (typeof TitanMicroBus !== 'undefined' && typeof TITAN_REG !== 'undefined') {
                TitanMicroBus.write(0x4150, mediaState.activeCategoryIdx);
            }
            updateMediaWheelUI(id);
        }

        function updateMediaWheelUI(id) {
            id = id || 'titan-svg-media-card';
            const activeIdx = mediaState.activeCategoryIdx % MEDIA_WHEEL_CATEGORIES.length;
            const cat = MEDIA_WHEEL_CATEGORIES[activeIdx];
            const hex = '0x' + (activeIdx * 32).toString(16).toUpperCase().padStart(2, '0');
            const files = importedMediaPool[cat.id] || [];

            // 1. Rotate Cinema Camera Lens Barrel & Reticle Pointer around (0,0)
            const wheelGroup = document.getElementById(id + '-wheel-group');
            if (wheelGroup) {
                wheelGroup.setAttribute('transform', 'rotate(' + mediaState.wheelAngle + ')');
                wheelGroup.style.transition = mediaState.isDraggingWheel ? 'none' : 'transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1)';
            }

            // 2. Synchronize Stationary 8 Category Nodes (Highlight Active Node)
            MEDIA_WHEEL_CATEGORIES.forEach((c, idx) => {
                const isCur = idx === activeIdx;
                const ring = document.getElementById(id + '-node-ring-' + idx);
                const bg = document.getElementById(id + '-node-bg-' + idx);
                if (ring) {
                    ring.style.display = isCur ? 'inline' : 'none';
                    if (isCur) ring.setAttribute('stroke', c.color);
                }
                if (bg) {
                    bg.setAttribute('stroke', isCur ? '#ffffff' : c.stroke);
                    bg.setAttribute('stroke-width', isCur ? '2.5' : '1.4');
                }
            });

            // 3. Update Reticle Pointer Glow & Header Badges
            const reticleRing = document.getElementById(id + '-active-reticle-ring');
            if (reticleRing) reticleRing.setAttribute('stroke', cat.color);

            const hudName = document.getElementById(id + '-hud-active-name');
            const hudPos = document.getElementById(id + '-hud-active-pos');
            const poolTitle = document.getElementById(id + '-pool-header-title');
            const poolCount = document.getElementById(id + '-pool-count-tag');
            const btnImportLblHtml = document.getElementById(id + '-btn-import-lbl-html');

            if (hudName) hudName.textContent = cat.label + ' POOL';
            if (hudPos) {
                hudPos.textContent = 'ROUTE: ' + cat.id.toUpperCase();
                hudPos.style.color = cat.color;
            }
            if (poolTitle) poolTitle.textContent = 'IMPORTED ' + cat.name.toUpperCase() + ' (CLICK TO INSERT):';
            if (poolCount) {
                poolCount.textContent = files.length + ' FILES';
                poolCount.style.color = cat.color;
            }
            if (btnImportLblHtml) {
                btnImportLblHtml.textContent = '📥 + IMPORT NEW ' + cat.label + ' FILE';
            }

            // 4. Render Categorized Imported Files List (ClearType HTML)
            const listStageHtml = document.getElementById(id + '-imported-files-list-html');
            if (listStageHtml) {
                if (files.length === 0) {
                    listStageHtml.innerHTML = '<div onclick="triggerNativeMediaImport()" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:50px; background:#070d18; border:1.2px dashed #334155; border-radius:7px; cursor:pointer;">' +
                        '<span style="font-size:10px; font-weight:900; color:' + cat.color + ';">📁 No ' + cat.name + ' imported yet</span>' +
                        '<span style="font-size:8px; font-weight:800; color:#94a3b8;">Click center lens or button below to import</span>' +
                    '</div>';
                } else {
                    listStageHtml.innerHTML = files.slice(0, 3).map(function(f, i) {
                        return '<div onclick="insertImportedFileToTimeline(' + i + ')" style="display:flex; align-items:center; justify-content:space-between; background:#0f172a; border:1.2px solid #334155; border-radius:7px; padding:4px 8px; cursor:pointer; transition:all 0.15s;">' +
                            '<div style="display:flex; align-items:center; gap:8px;">' +
                                '<div style="width:24px; height:24px; background:' + cat.color + '33; border-radius:5px; display:flex; align-items:center; justify-content:center; font-size:13px;">' + (f.icon || cat.icon) + '</div>' +
                                '<div style="display:flex; flex-direction:column; gap:1px;">' +
                                    '<span style="font-size:10px; font-weight:900; color:#ffffff;">' + (f.name || 'File').slice(0, 22) + '</span>' +
                                    '<span style="font-size:8px; font-weight:800; color:#93c5fd;">' + (f.desc || 'Media file') + '</span>' +
                                '</div>' +
                            '</div>' +
                            '<button style="height:22px; padding:0 10px; background:' + cat.bg + '; color:#ffffff; border:1px solid ' + cat.stroke + '; border-radius:5px; font-size:8.5px; font-weight:900; cursor:pointer;">➕ INSERT</button>' +
                        '</div>';
                    }).join('');
                }
            }
        }

        function initMediaWheelDrag() {
            const stage = document.getElementById('titan-svg-media-card-rotary-stage');
            const core = document.getElementById('titan-svg-media-card-center-core');
            if (!stage || !core) return;

            let startAngle = 0;
            let currentRotation = 0;

            const getCenter = () => {
                const coreRect = core.getBoundingClientRect();
                return {
                    cx: coreRect.left + coreRect.width / 2,
                    cy: coreRect.top + coreRect.height / 2
                };
            };

            const onStart = (e) => {
                const center = getCenter();
                const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
                const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;

                mediaState.isDraggingWheel = true;
                startAngle = Math.atan2(clientY - center.cy, clientX - center.cx) * (180 / Math.PI) + 90;
                currentRotation = mediaState.wheelAngle;
            };

            const onMove = (e) => {
                if (!mediaState.isDraggingWheel) return;
                const center = getCenter();
                const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
                const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;

                const moveAngle = Math.atan2(clientY - center.cy, clientX - center.cx) * (180 / Math.PI) + 90;
                const delta = moveAngle - startAngle;
                mediaState.wheelAngle = currentRotation + delta;

                const norm = ((mediaState.wheelAngle % 360) + 360) % 360;
                mediaState.activeCategoryIdx = Math.round(norm / 45) % MEDIA_WHEEL_CATEGORIES.length;
                updateMediaWheelUI('titan-svg-media-card');
            };

            const onEnd = () => {
                if (!mediaState.isDraggingWheel) return;
                mediaState.isDraggingWheel = false;
                // Snap to nearest 45-degree route notch smoothly
                const snapAngle = Math.round(mediaState.wheelAngle / 45) * 45;
                mediaState.wheelAngle = snapAngle;
                updateMediaWheelUI('titan-svg-media-card');
            };

            stage.addEventListener('mousedown', onStart);
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onEnd);
            stage.addEventListener('touchstart', onStart, { passive: true });
            window.addEventListener('touchmove', onMove, { passive: true });
            window.addEventListener('touchend', onEnd);
        }

        function triggerNativeMediaImport(id) {
            const cat = MEDIA_WHEEL_CATEGORIES[mediaState.activeCategoryIdx % MEDIA_WHEEL_CATEGORIES.length];
            const input = document.getElementById('native-media-file-input');
            if (input) {
                input.setAttribute('accept', cat.accept || 'video/*,image/*,audio/*');
                input.click();
            }
        }

        function handleNativeMediaFileChange(e) {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            const file = files[0];
            const url = URL.createObjectURL(file);
            const isVideo = file.type.startsWith('video/');
            const isImage = file.type.startsWith('image/');
            const isAudio = file.type.startsWith('audio/');

            const targetCatId = isVideo ? 'video' : (isImage ? 'photo' : (isAudio ? 'audio' : 'cloud'));
            const catIdx = MEDIA_WHEEL_CATEGORIES.findIndex(c => c.id === targetCatId);

            const newFileItem = {
                name: file.name,
                url: url,
                type: targetCatId,
                desc: (file.size / (1024 * 1024)).toFixed(1) + ' MB • ' + (isVideo ? 'Video 4K' : (isImage ? 'PNG Photo' : 'Audio Track')),
                duration: isVideo ? '00:15' : (isAudio ? '02:00' : 'Static'),
                icon: isVideo ? '🎬' : (isImage ? '📸' : '🎵')
            };

            // Prepend new file into the route category pool
            if (!importedMediaPool[targetCatId]) importedMediaPool[targetCatId] = [];
            importedMediaPool[targetCatId].unshift(newFileItem);

            // Rotate camera lens to this category
            if (catIdx !== -1) {
                selectRotaryCategory('titan-svg-media-card', catIdx);
            }

            // Insert to canvas & timeline immediately
            insertImportedFileToTimeline(0);

            showLiveToast('File Imported', 'Added ' + file.name + ' into ' + targetCatId.toUpperCase() + ' pool & inserted to Canvas!', 'success');
        }

        function insertImportedFileToTimeline(idx) {
            const cat = MEDIA_WHEEL_CATEGORIES[mediaState.activeCategoryIdx % MEDIA_WHEEL_CATEGORIES.length];
            const files = importedMediaPool[cat.id] || [];
            const fileItem = files[idx] || files[0];
            if (!fileItem) return;

            mediaState.loadedMedia = fileItem;

            // Update main canvas hero title
            const mainText = document.getElementById('main-media-title');
            if (mainText) {
                mainText.innerText = (fileItem.icon || cat.icon) + ' ' + fileItem.name;
            }

            // Update Status & Timeline Clip
            const status = document.getElementById('main-canvas-status');
            if (status) {
                status.innerHTML = '<span class="text-cyan-400 font-bold">LIVE MEDIA INSERTED: ' + fileItem.name + '</span>';
            }

            console.log('🎬 [Timeline Media Track] Inserted:', fileItem);
            showLiveToast('Timeline Ingest', 'Inserted ' + fileItem.name + ' to Timeline Active Track!', 'success');
        }

        function switchMediaCardTab(tabKey) {
            mediaState.activeTab = tabKey;
            const panels = ['lens', 'overlay_import', 'bg_pad', 'exports', 'cloud'];
            panels.forEach(p => {
                const panelEl = document.getElementById('titan-svg-media-card-panel-' + p);
                const btnEl = document.getElementById('titan-svg-media-card-tab-btn-' + p);
                if (panelEl) {
                    panelEl.style.display = (p === tabKey) ? 'inline' : 'none';
                }
                if (btnEl) {
                    if (btnEl.tagName === 'BUTTON') {
                        const isOv = (p === 'overlay_import');
                        const isPad = (p === 'bg_pad');
                        const activeCol = isOv ? '#c2410c' : (isPad ? '#7c2d12' : '#0284c7');
                        const activeBrd = isOv ? '#fb923c' : (isPad ? '#f97316' : '#38bdf8');
                        btnEl.style.background = (p === tabKey) ? activeCol : '#0e1726';
                        btnEl.style.color = (p === tabKey) ? '#ffffff' : (isOv ? '#fb923c' : (isPad ? '#fdba74' : '#cbd5e1'));
                        btnEl.style.borderColor = (p === tabKey) ? activeBrd : '#334155';
                        btnEl.style.boxShadow = (p === tabKey) ? ('0 0 10px ' + (isOv ? 'rgba(251,146,60,0.5)' : (isPad ? 'rgba(249,115,22,0.4)' : 'rgba(56,189,248,0.4)'))) : 'none';
                    }
                }
            });
            if (tabKey === 'lens') {
                updateMediaWheelUI('titan-svg-media-card');
                initMediaWheelDrag();
            }
            const tabTitles = {
                lens: '📷 360° Camera Optical Lens Hub',
                overlay_import: '🖼️ Dedicated Overlay Media Importer & PiP Shelf',
                bg_pad: '🎨 Overlay BG & Matte Pad Studio',
                exports: '📦 Exported Master Video Deliveries',
                cloud: '🌐 Cloud Assets & Stock Media Library'
            };
            showLiveToast('Left Mobile Screen', 'Switched to ' + (tabTitles[tabKey] || tabKey.toUpperCase()), 'info');
        }

        function triggerNativeOverlayImport() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*,video/*,.webm,.gif,.svg,.png';
            input.multiple = true;
            input.onchange = (e) => {
                const files = Array.from(e.target.files);
                if (files.length > 0) {
                    files.forEach(f => {
                        insertOverlayItemToTimeline(f.name, 'custom');
                    });
                    showLiveToast('Overlay Ingest', 'Imported ' + files.length + ' overlay file(s) into Timeline V2/PIP!', 'success');
                }
            };
            input.click();
        }

        // 🎭 AI HEAD SWAP & OBJECT MOTION TRACKER CLIENT STATE
        let headSwapState = {
            active: false,
            avatar: 'cyborg',
            walkingBob: 100,
            neckPivot: 90
        };

        function setHeadSwapAvatar(avatarName) {
            headSwapState.avatar = avatarName;
            headSwapState.active = true;
            document.querySelectorAll('.head-avatar-btn').forEach(btn => {
                const isCur = btn.textContent.toLowerCase().includes(avatarName.toLowerCase());
                btn.style.borderColor = isCur ? '#38bdf8' : '#334155';
                btn.style.color = isCur ? '#ffffff' : '#cbd5e1';
            });
            showLiveToast('Head Swap Avatar', 'Equipped: ' + avatarName.toUpperCase() + ' (Auto-Synced with Neck Pivot)', 'info');
        }

        function setWalkingBob(val) {
            headSwapState.walkingBob = parseInt(val);
            const el = document.getElementById('val-walking-bob');
            if (el) el.textContent = val + '%';
        }

        function setNeckPivot(val) {
            headSwapState.neckPivot = parseInt(val);
            const el = document.getElementById('val-neck-pivot');
            if (el) el.textContent = val + '%';
        }

        function activateHeadSwapMode() {
            headSwapState.active = !headSwapState.active;
            const status = document.getElementById('main-canvas-status');
            if (status) {
                status.innerHTML = headSwapState.active ? 
                    '<span class="text-purple-400 font-bold">🎭 LIVE HEAD SWAP ACTIVE: ' + headSwapState.avatar.toUpperCase() + ' [120 FPS TRACK]</span>' : 
                    '<span class="text-slate-400 font-bold">HEAD SWAP PAUSED</span>';
            }
            showLiveToast('AI Head Tracking', headSwapState.active ? '🚀 Activated 120 FPS Head Sync with Walking Physics!' : 'Paused Head Tracking', 'success');
        }

        // 🎨 OVERLAY BG PAD STUDIO CLIENT FUNCTIONS
        let overlayPadState = {
            active: true,
            ratio: '16:9',
            style: 'cyan-grad',
            anchor: 'top-right',
            opacity: 100,
            blendMode: 'source-over'
        };

        function setOverlayPadRatio(ratio) {
            overlayPadState.active = true;
            overlayPadState.ratio = ratio;
            document.querySelectorAll('.overlay-ratio-btn').forEach(btn => {
                const isCur = btn.textContent.includes(ratio);
                btn.style.borderColor = isCur ? '#38bdf8' : '#334155';
                btn.style.color = isCur ? '#ffffff' : '#cbd5e1';
            });
            showLiveToast('Overlay Pad Ratio', 'Selected Aspect Ratio: ' + ratio, 'info');
        }

        function setOverlayPadStyle(styleName) {
            overlayPadState.active = true;
            overlayPadState.style = styleName;
            showLiveToast('Overlay Background Style', 'Set Style: ' + styleName.toUpperCase(), 'info');
        }

        function setOverlayPipAnchor(anchorName) {
            overlayPadState.active = true;
            overlayPadState.anchor = anchorName;
            showLiveToast('PiP Position Preset', 'Set Anchor: ' + anchorName.toUpperCase(), 'info');
        }

        function updateOverlayOpacity(val) {
            overlayPadState.active = true;
            overlayPadState.opacity = parseInt(val);
            const el = document.getElementById('overlay-opacity-val');
            if (el) el.textContent = val + '%';
        }

        function updateOverlayBlendMode(mode) {
            overlayPadState.active = true;
            overlayPadState.blendMode = mode === 'normal' ? 'source-over' : mode;
            showLiveToast('Overlay Blend Mode', 'Set Blend: ' + mode.toUpperCase(), 'info');
        }

        function applyOverlayPadToTimeline() {
            overlayPadState.active = true;
            showLiveToast('Overlay Ingest', '🚀 Ingested Overlay Matte Pad (' + overlayPadState.ratio + ', ' + overlayPadState.style + ') to Timeline V2/PIP Track!', 'success');
            const status = document.getElementById('main-canvas-status');
            if (status) {
                status.innerHTML = '<span class="text-orange-400 font-bold">🎨 LIVE OVERLAY PAD ACTIVE: ' + overlayPadState.ratio + ' [' + overlayPadState.style.toUpperCase() + ']</span>';
            }
        }

        function createNewProjectBin() {
            const binName = prompt('Enter New Project Bin / Folder Name:', 'Scene_02_Action_Clips');
            if (!binName || !binName.trim()) return;

            const list = document.getElementById('titan-svg-media-card-bins-tree-list-html');
            if (list) {
                const newBinDiv = document.createElement('div');
                newBinDiv.setAttribute('onclick', 'openBinCategory("custom")');
                newBinDiv.setAttribute('style', 'display:flex; align-items:center; justify-content:space-between; background:#0f172a; border:1.2px solid #334155; border-radius:7px; padding:8px 10px; cursor:pointer;');
                newBinDiv.innerHTML = '<div style="display:flex; align-items:center; gap:10px;">' +
                    '<span style="font-size:18px;">📁</span>' +
                    '<div style="display:flex; flex-direction:column; gap:1px;">' +
                        '<span style="font-size:11px; font-weight:900; color:#ffffff;">' + binName.trim() + '</span>' +
                        '<span style="font-size:8.5px; font-weight:800; color:#93c5fd;">Native Disk Bin • 0 Items</span>' +
                    '</div>' +
                '</div>' +
                '<button style="height:24px; padding:0 12px; background:#0284c7; color:#ffffff; border:1px solid #38bdf8; border-radius:5px; font-size:9px; font-weight:900; cursor:pointer;">OPEN</button>';
                list.appendChild(newBinDiv);
            }
            showLiveToast('Native Bin Created', 'Created: ' + binName.trim() + ' in Project Root Directory!', 'success');
        }

        function openBinCategory(catId) {
            if (catId === 'video' || catId === 'photo' || catId === 'audio') {
                const idx = MEDIA_WHEEL_CATEGORIES.findIndex(c => c.id === catId);
                if (idx !== -1) {
                    switchMediaCardTab('lens');
                    selectRotaryCategory('titan-svg-media-card', idx);
                }
            } else {
                showLiveToast('Project Bin', 'Opened custom bin: ' + catId, 'info');
            }
        }

        function addTimelineTrackForMedia(media) {
            const timelineContainer = document.getElementById('timeline-tracks-container') || document.getElementById('timeline-tracks');
            const status = document.getElementById('main-canvas-status');
            if (status) {
                status.innerHTML = '<span class="text-cyan-400 font-bold">LIVE MEDIA TRACK: ' + media.name + '</span>';
            }
            console.log('🎬 [Timeline Auto-Track] Ingested Media Clip:', media);
        }

        // 🎞️ VINTAGE 35mm FILMSTRIP CINEMATIC TOOLBAR SCRIPT
        const FILMSTRIP_TOOLS_LIST = ${JSON.stringify(FILMSTRIP_TOOLS)};
        let activeFilmstripTool = 'split';

        function selectFilmstripTool(toolId, id) {
            id = id || 'titan-filmstrip-toolbar';
            activeFilmstripTool = toolId;
            const tool = FILMSTRIP_TOOLS_LIST.find(t => t.id === toolId) || FILMSTRIP_TOOLS_LIST[0];

            // 1. Update visual frame highlights in SVG with group-specific colors
            FILMSTRIP_TOOLS_LIST.forEach(t => {
                const isCur = t.id === toolId;
                const bg = document.getElementById(id + '-frame-bg-' + t.id);
                const line = document.getElementById(id + '-line-' + t.id);
                const activeBorder = t.group === 'cut' ? '#38bdf8' : (t.group === 'action' ? '#f59e0b' : '#10b981');
                const activeBg = t.group === 'cut' ? '#082f49' : (t.group === 'action' ? '#1c1917' : '#064e3b');
                if (bg) {
                    bg.setAttribute('fill', isCur ? activeBg : '#090d16');
                    bg.setAttribute('stroke', isCur ? activeBorder : '#1e293b');
                    bg.setAttribute('stroke-width', isCur ? '1.4' : '1');
                }
                if (line) {
                    line.style.display = isCur ? 'inline' : 'none';
                    line.setAttribute('fill', activeBorder);
                }
            });

            // 2. Update Main Canvas Status
            const canvasStatus = document.getElementById('main-canvas-status');
            if (canvasStatus) {
                canvasStatus.innerHTML = '<span class="text-amber-400 font-bold">ACTIVE TOOL: ' + tool.name + ' [' + tool.shortcut + ']</span>';
            }

            // 3. Emit MicroBus Telemetry & Trigger Direct Actions
            if (typeof TitanMicroBus !== 'undefined') {
                TitanMicroBus.write(0x4200, tool.id);
            }

            if (toolId === 'undo') {
                if (typeof window.undoTimelineStep === 'function') window.undoTimelineStep();
                showLiveToast('Undo [Ctrl+Z]', 'Reverted last timeline edit', 'info');
            } else if (toolId === 'redo') {
                if (typeof window.redoTimelineStep === 'function') window.redoTimelineStep();
                showLiveToast('Redo [Ctrl+Y]', 'Re-applied timeline edit', 'info');
            } else if (toolId === 'delete') {
                if (typeof window.executeBatchAction === 'function') window.executeBatchAction('delete');
                showLiveToast('Ripple Delete [Del]', 'Deleted selection & closed gap', 'info');
            } else {
                showLiveToast('Studio Tool', 'Equipped ' + tool.name + ' (' + tool.shortcut + ')', 'info');
            }
        }

        function showFilmstripTooltip(e, toolId, id) {
            id = id || 'titan-filmstrip-toolbar';
            const tt = document.getElementById(id + '-tooltip');
            if (!tt) return;
            const tool = FILMSTRIP_TOOLS_LIST.find(t => t.id === toolId);
            if (!tool) return;

            const nameEl = document.getElementById(id + '-tt-name');
            const keyEl = document.getElementById(id + '-tt-key');
            const descEl = document.getElementById(id + '-tt-desc');

            if (nameEl) nameEl.textContent = tool.name;
            if (keyEl) keyEl.textContent = '[ ' + tool.shortcut + ' ]';
            if (descEl) descEl.textContent = tool.desc;

            const rect = e.target.getBoundingClientRect ? e.target.getBoundingClientRect() : null;
            if (rect) {
                tt.style.left = (rect.left + rect.width / 2) + 'px';
                tt.style.top = (rect.top - 4) + 'px';
            } else {
                tt.style.left = e.clientX + 'px';
                tt.style.top = (e.clientY - 20) + 'px';
            }
            tt.style.display = 'block';
        }

        function hideFilmstripTooltip(id) {
            id = id || 'titan-filmstrip-toolbar';
            const tt = document.getElementById(id + '-tooltip');
            if (tt) tt.style.display = 'none';
        }

        function stepFilmstripScroll(id, deltaX) {
            id = id || 'titan-filmstrip-toolbar';
            const container = document.getElementById(id + '-track-container');
            if (container) {
                container.scrollBy({ left: deltaX, behavior: 'smooth' });
            }
        }

        function initFilmstripDrag(e, id) {
            id = id || 'titan-filmstrip-toolbar';
            const container = document.getElementById(id + '-track-container');
            if (!container) return;

            let isDown = true;
            let startX = e.pageX - container.offsetLeft;
            let scrollLeft = container.scrollLeft;
            container.style.cursor = 'grabbing';

            const onMouseMove = (ev) => {
                if (!isDown) return;
                ev.preventDefault();
                const x = ev.pageX - container.offsetLeft;
                const walk = (x - startX) * 1.5;
                container.scrollLeft = scrollLeft - walk;
            };

            const onMouseUp = () => {
                isDown = false;
                container.style.cursor = 'grab';
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }

        function initFilmstripWheel() {
            const container = document.getElementById('titan-filmstrip-toolbar-track-container');
            if (!container) return;
            container.addEventListener('wheel', (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    container.scrollLeft += e.deltaY * 0.8;
                }
            }, { passive: false });
        }
        function initCanvasPenDrawing() {
            const canvas = document.getElementById('main-video-canvas');
            if (!canvas) return;

            const getPos = (e) => {
                const rect = canvas.getBoundingClientRect();
                const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
                const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                return {
                    x: (clientX - rect.left) * scaleX,
                    y: (clientY - rect.top) * scaleY
                };
            };

            let isDrawing = false;

            const onStart = (e) => {
                if (!vfxState.isPenMode) return;
                isDrawing = true;
                vfxState.currentStroke = [getPos(e)];
            };

            const onMove = (e) => {
                if (!isDrawing || !vfxState.isPenMode || !vfxState.currentStroke) return;
                const pos = getPos(e);
                const last = vfxState.currentStroke[vfxState.currentStroke.length - 1];
                const dist = Math.hypot(pos.x - last.x, pos.y - last.y);
                if (dist > 3) {
                    vfxState.currentStroke.push(pos);
                }
            };

            const onEnd = () => {
                if (!isDrawing) return;
                isDrawing = false;
                if (vfxState.currentStroke && vfxState.currentStroke.length > 1) {
                    vfxState.userPaths.push(vfxState.currentStroke);
                }
                vfxState.currentStroke = null;
            };

            canvas.addEventListener('mousedown', onStart);
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onEnd);

            canvas.addEventListener('touchstart', onStart, { passive: true });
            window.addEventListener('touchmove', onMove, { passive: true });
            window.addEventListener('touchend', onEnd);

            // 🔌 TITAN PCB SIGNAL: Interactive Canvas Wheel Zoom Line
            canvas.addEventListener('wheel', (e) => {
                e.preventDefault();
                const zoomFactor = e.deltaY < 0 ? 1.05 : 0.95;
                if (typeof titanPCB !== 'undefined' && titanPCB.sendZoom) {
                    titanPCB.sendZoom(zoomFactor);
                }
                const cur = tfState.scale || 100;
                tfState.scale = Math.max(10, Math.min(400, Math.round(cur * zoomFactor)));
                updateTfUI();
                setVeTransform();
            }, { passive: false });
        }

        function renderAllCanvasVfxPaths(ctx, t) {
            if (!ctx) return;
            const currentVfx = getClientVfx(vfxState.effectOpcode);
            const opts = {
                strokeWidth: vfxState.strokeWidth || 16,
                intensity: (vfxState.intensity || 100) / 100,
                turbulence: vfxState.turbulence || 1.0
            };

            // 1. Draw all saved user paths OR the default dynamic power arc if none drawn
            const pathsToDraw = (vfxState.userPaths && vfxState.userPaths.length > 0)
                ? vfxState.userPaths
                : [
                    [
                        { x: 100, y: 200 },
                        { x: 240, y: 140 },
                        { x: 380, y: 220 },
                        { x: 520, y: 130 },
                        { x: 620, y: 190 }
                    ]
                ];

            pathsToDraw.forEach(path => {
                renderClientVfxStroke(ctx, path, currentVfx, t, opts);
            });

            // 2. Draw live active stroke being drawn right now
            if (vfxState.currentStroke && vfxState.currentStroke.length > 1) {
                renderClientVfxStroke(ctx, vfxState.currentStroke, currentVfx, t, opts);
            }
        }

        function renderClientVfxStroke(ctx, points, effect, timeSec, options) {
            if (!ctx || !points || points.length < 2) return;

            const strokeWidth = options.strokeWidth || 16;
            const intensity = options.intensity || 1.0;
            const turbulence = options.turbulence || 1.0;

            const c1 = effect.color1 || '#ff0033';
            const c2 = effect.color2 || '#ffffff';
            const c3 = effect.color3 || '#ff8800';
            const mode = (effect.mode || '').toLowerCase();
            const t = (timeSec || 0) * (effect.speed || 1.4) * turbulence;
            const total = points.length;

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            if (mode === 'fire_blue' || mode.includes('blue_hellfire')) {
                // 🔷 1. BLUE HELLFIRE FLAME (Cyan/Azure Plasma)
                renderProceduralFireInternal(ctx, points, '#0066ff', '#00ffff', '#ffffff', t, strokeWidth, intensity, turbulence);

            } else if (mode === 'fire_green' || mode.includes('ghostfire') || mode.includes('sulfur')) {
                // 🟢 2. GHOSTFIRE EMERALD FLAME (Green Ectoplasm)
                renderProceduralFireInternal(ctx, points, '#00ff66', '#ccff00', '#ffffff', t, strokeWidth, intensity, turbulence);

            } else if (mode.includes('lava') || mode.includes('magma') || mode.includes('molten')) {
                // 🌋 3. VOLCANIC LAVA & MOLTEN DRIPPING GLOBULES
                const step = Math.max(1, Math.floor(total / 12));
                for (let i = 0; i < total; i += step) {
                    const p = points[i];
                    const blobR = (12 + Math.sin(t * 5 + i) * 5) * intensity;
                    const lavaGrad = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, blobR);
                    lavaGrad.addColorStop(0, '#ffffff');
                    lavaGrad.addColorStop(0.3, c2);
                    lavaGrad.addColorStop(0.7, c1);
                    lavaGrad.addColorStop(1, 'transparent');
                    ctx.fillStyle = lavaGrad;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, blobR, 0, Math.PI * 2);
                    ctx.fill();

                    const dropY = p.y + ((t * 35 + i * 15) % 40);
                    ctx.fillStyle = c1;
                    ctx.beginPath();
                    ctx.arc(p.x + Math.sin(i) * 6, dropY, 3.5 * intensity, 0, Math.PI * 2);
                    ctx.fill();
                }

            } else if (mode.includes('fire') || mode.includes('flame') || mode.includes('inferno') || mode.includes('blaze') || mode.includes('ember')) {
                // 🔥 4. CLASSIC INFERNO FIRE & FLAME TONGUES
                renderProceduralFireInternal(ctx, points, c1, c3, c2, t, strokeWidth, intensity, turbulence);

            } else if (mode.includes('lightning') || mode.includes('thunder') || mode.includes('taser') || mode.includes('gigavolt') || mode.includes('dark_lightning')) {
                // ⚡ 5. THOR FRACTAL BRANCHING LIGHTNING FORKS
                ctx.shadowBlur = 25 * intensity;
                ctx.shadowColor = c1;
                ctx.strokeStyle = c2;
                ctx.lineWidth = Math.max(2.5, strokeWidth * 0.4);
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < total; i++) {
                    const jitter = (Math.sin(t * 25 + i * 4) - 0.5) * 8 * turbulence;
                    ctx.lineTo(points[i].x + jitter, points[i].y - jitter);
                }
                ctx.stroke();

                const step = Math.max(1, Math.floor(total / 10));
                ctx.strokeStyle = c3;
                ctx.lineWidth = 1.6 * intensity;
                for (let i = 0; i < total; i += step) {
                    const p = points[i];
                    for (let f = 0; f < 2; f++) {
                        const seed = i * 13 + f * 31;
                        const angle = (Math.sin(t * 15 + seed) * Math.PI) + (f === 0 ? 1 : -1) * (Math.PI / 2);
                        const branchLen = (20 + Math.sin(t * 20 + seed) * 16) * intensity;
                        let curX = p.x;
                        let curY = p.y;
                        ctx.beginPath();
                        ctx.moveTo(curX, curY);
                        for (let s = 1; s <= 4; s++) {
                            const segLen = branchLen / 4;
                            const jitter = (Math.sin(t * 30 + seed + s) - 0.5) * 12 * turbulence;
                            curX += Math.cos(angle) * segLen + Math.sin(angle) * jitter;
                            curY += Math.sin(angle) * segLen + Math.cos(angle) * jitter;
                            ctx.lineTo(curX, curY);
                        }
                        ctx.stroke();
                    }
                }

            } else if (mode.includes('tesla') || mode.includes('ionic') || mode.includes('synchrotron')) {
                // 🌀 6. TESLA COIL HARMONIC SINE WAVE ARCS
                ctx.shadowBlur = 20 * intensity;
                ctx.shadowColor = c1;
                for (let wave = 0; wave < 3; wave++) {
                    ctx.strokeStyle = wave === 0 ? c2 : (wave === 1 ? c1 : c3);
                    ctx.lineWidth = (2.5 - wave * 0.6) * intensity;
                    ctx.beginPath();
                    ctx.moveTo(points[0].x, points[0].y);
                    for (let i = 1; i < total; i++) {
                        const phase = t * 10 + i * 0.4 + (wave * Math.PI / 1.5);
                        const perpDist = Math.sin(phase) * (14 + wave * 6) * turbulence;
                        ctx.lineTo(points[i].x + perpDist, points[i].y - perpDist * 0.5);
                    }
                    ctx.stroke();
                }

            } else if (mode.includes('laser') || mode.includes('beam') || mode.includes('slicer') || mode.includes('superman') || mode.includes('kyber') || mode.includes('orbital') || mode.includes('atomic')) {
                // 🔴 7. BLINDING SUPERMAN HEAT VISION CORE LASER
                ctx.shadowBlur = 40 * intensity;
                ctx.shadowColor = c1;
                ctx.strokeStyle = c1;
                ctx.lineWidth = strokeWidth * 2.4;
                ctx.globalAlpha = 0.45 * intensity;
                drawPath(ctx, points);

                ctx.shadowBlur = 10 * intensity;
                ctx.shadowColor = '#ffffff';
                ctx.strokeStyle = c2;
                ctx.lineWidth = Math.max(3, strokeWidth * 0.45);
                ctx.globalAlpha = 1.0;
                drawPath(ctx, points);

                const step = Math.max(1, Math.floor(total / 8));
                for (let i = 0; i < total; i += step) {
                    const p = points[i];
                    for (let s = 0; s < 3; s++) {
                        const ang = (t * 7 + i + s * 2) % (Math.PI * 2);
                        const dst = (6 + Math.sin(t * 8 + s) * 12) * intensity;
                        ctx.fillStyle = s % 2 === 0 ? c1 : c2;
                        ctx.beginPath();
                        ctx.arc(p.x + Math.cos(ang) * dst, p.y + Math.sin(ang) * dst, 2.5 * intensity, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }

            } else if (mode.includes('shard') || mode.includes('spike') || mode.includes('glacier')) {
                // 🧊 8. JAGGED CRYO ICE SHARDS
                const step = Math.max(1, Math.floor(total / 10));
                for (let i = 0; i < total; i += step) {
                    const p = points[i];
                    const shardLen = (18 + Math.sin(t * 4 + i) * 8) * intensity;
                    const shardW = (6 + Math.sin(i) * 3) * intensity;
                    ctx.fillStyle = 'rgba(224, 242, 254, 0.85)';
                    ctx.strokeStyle = c1;
                    ctx.lineWidth = 1.5;
                    ctx.shadowBlur = 15 * intensity;
                    ctx.shadowColor = c1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y - shardLen);
                    ctx.lineTo(p.x + shardW, p.y);
                    ctx.lineTo(p.x, p.y + shardLen * 0.4);
                    ctx.lineTo(p.x - shardW, p.y);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }

            } else if (mode.includes('frost') || mode.includes('ice') || mode.includes('snow') || mode.includes('zero') || mode.includes('blizzard')) {
                // ❄️ 9. DENDRITIC SNOWFLAKE CRYSTAL BLOOMS
                const step = Math.max(1, Math.floor(total / 10));
                for (let i = 0; i < total; i += step) {
                    const p = points[i];
                    const crystalLen = (15 + Math.sin(t * 3 + i) * 6) * intensity;
                    ctx.strokeStyle = c2;
                    ctx.lineWidth = 1.6;
                    ctx.shadowBlur = 12 * intensity;
                    ctx.shadowColor = '#ffffff';

                    for (let a = 0; a < 6; a++) {
                        const rot = (a * Math.PI / 3) + Math.sin(t * 2 + i) * 0.15;
                        const endX = p.x + Math.cos(rot) * crystalLen;
                        const endY = p.y + Math.sin(rot) * crystalLen;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(endX, endY);
                        ctx.stroke();

                        const subLen = crystalLen * 0.45;
                        const midX = p.x + Math.cos(rot) * (crystalLen * 0.6);
                        const midY = p.y + Math.sin(rot) * (crystalLen * 0.6);
                        ctx.beginPath();
                        ctx.moveTo(midX, midY);
                        ctx.lineTo(midX + Math.cos(rot + Math.PI / 4) * subLen, midY + Math.sin(rot + Math.PI / 4) * subLen);
                        ctx.moveTo(midX, midY);
                        ctx.lineTo(midX + Math.cos(rot - Math.PI / 4) * subLen, midY + Math.sin(rot - Math.PI / 4) * subLen);
                        ctx.stroke();
                    }
                }

            } else if (mode.includes('portal') || mode.includes('wormhole') || mode.includes('eldritch') || mode.includes('gateway')) {
                // 🌌 10. DOCTOR STRANGE SPARKLING PORTAL
                const step = Math.max(1, Math.floor(total / 8));
                for (let i = 0; i < total; i += step) {
                    const p = points[i];
                    const portalR = (20 + Math.sin(t * 5 + i) * 6) * intensity;
                    ctx.strokeStyle = c1;
                    ctx.lineWidth = 2.2;
                    ctx.shadowBlur = 20 * intensity;
                    ctx.shadowColor = c2;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, portalR, 0, Math.PI * 2);
                    ctx.stroke();

                    for (let s = 0; s < 6; s++) {
                        const ang = t * 6 + (s * Math.PI / 3);
                        const sx = p.x + Math.cos(ang) * portalR;
                        const sy = p.y + Math.sin(ang) * portalR;
                        const tx = sx - Math.sin(ang) * 12 * intensity;
                        const ty = sy + Math.cos(ang) * 12 * intensity;
                        ctx.strokeStyle = c2;
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(sx, sy);
                        ctx.lineTo(tx, ty);
                        ctx.stroke();
                    }
                }

            } else if (mode.includes('magic') || mode.includes('rune') || mode.includes('sorcery') || mode.includes('mandala')) {
                // ☸️ 11. SACRED GEOMETRY MYSTIC RUNES
                const step = Math.max(1, Math.floor(total / 8));
                for (let i = 0; i < total; i += step) {
                    const p = points[i];
                    const runeR = (18 + Math.sin(t * 4 + i) * 6) * intensity;
                    const spin = t * 2 + i;
                    ctx.strokeStyle = c2;
                    ctx.lineWidth = 1.6;
                    ctx.shadowBlur = 15 * intensity;
                    ctx.shadowColor = c1;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, runeR, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.beginPath();
                    for (let g = 0; g < 3; g++) {
                        const ang = spin + (g * Math.PI * 2 / 3);
                        const gx = p.x + Math.cos(ang) * (runeR * 0.85);
                        const gy = p.y + Math.sin(ang) * (runeR * 0.85);
                        if (g === 0) ctx.moveTo(gx, gy);
                        else ctx.lineTo(gx, gy);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }

            } else if (mode.includes('glitter') || mode.includes('fairy') || mode.includes('stardust') || mode.includes('star')) {
                // ✨ 12. SHIMMERING FAIRY DUST & 4-POINT STARS
                const step = Math.max(1, Math.floor(total / 6));
                for (let i = 0; i < total; i += step) {
                    const p = points[i];
                    const pulse = Math.sin(t * 8 + i * 2) * 0.5 + 0.5;
                    const starSize = (4 + pulse * 7) * intensity;
                    ctx.fillStyle = c2;
                    ctx.shadowBlur = 15 * intensity;
                    ctx.shadowColor = c1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y - starSize);
                    ctx.quadraticCurveTo(p.x, p.y, p.x + starSize, p.y);
                    ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + starSize);
                    ctx.quadraticCurveTo(p.x, p.y, p.x - starSize, p.y);
                    ctx.quadraticCurveTo(p.x, p.y, p.x - starSize);
                    ctx.closePath();
                    ctx.fill();
                }

            } else if (mode.includes('shield') || mode.includes('forcefield') || mode.includes('barrier')) {
                // 🛡️ 13. HONEYCOMB HEXAGONAL FORCEFIELD
                const step = Math.max(1, Math.floor(total / 8));
                for (let i = 0; i < total; i += step) {
                    const p = points[i];
                    const hexR = (20 + Math.sin(t * 6 + i) * 6) * intensity;
                    ctx.strokeStyle = c1;
                    ctx.lineWidth = 1.8;
                    ctx.shadowBlur = 20 * intensity;
                    ctx.shadowColor = c3;
                    ctx.beginPath();
                    for (let h = 0; h < 6; h++) {
                        const ang = (h * Math.PI / 3) + (Math.PI / 6);
                        const hx = p.x + Math.cos(ang) * hexR;
                        const hy = p.y + Math.sin(ang) * hexR;
                        if (h === 0) ctx.moveTo(hx, hy);
                        else ctx.lineTo(hx, hy);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }

            } else if (mode.includes('cyber') || mode.includes('neon') || mode.includes('matrix') || mode.includes('glitch') || mode.includes('circuit')) {
                // 🧪 5. CYBERPUNK MATRIX GLITCH
                ctx.shadowBlur = 25 * intensity;
                ctx.shadowColor = c1;
                ctx.strokeStyle = c1;
                ctx.lineWidth = strokeWidth * 1.5;
                ctx.globalAlpha = 0.7 * intensity;
                drawPath(ctx, points);

                const step = Math.max(1, Math.floor(total / 10));
                for (let i = 0; i < total; i += step) {
                    const p = points[i];
                    for (let d = 0; d < 3; d++) {
                        const dropLife = (t * 60 + i * 20 + d * 30) % 50;
                        ctx.fillStyle = dropLife < 10 ? '#ffffff' : c3;
                        ctx.fillRect(p.x + (d - 1) * 8, p.y + dropLife, 3 * intensity, 8 * intensity);
                    }
                }

            } else {
                // 💥 6. COSMIC SUPERNOVA & VOLUMETRIC PLASMA BLAST
                const step = Math.max(1, Math.floor(total / 8));
                for (let i = 0; i < total; i += step) {
                    const p = points[i];
                    const plasmaR = Math.max(2, (18 + Math.sin(t * 8 + i) * 8) * intensity);

                    const plasmaGrad = ctx.createRadialGradient(p.x, p.y, 0.5, p.x, p.y, plasmaR);
                    plasmaGrad.addColorStop(0, '#ffffff');
                    plasmaGrad.addColorStop(0.35, c2);
                    plasmaGrad.addColorStop(0.7, c1);
                    plasmaGrad.addColorStop(1, 'transparent');

                    ctx.fillStyle = plasmaGrad;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, plasmaR, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.strokeStyle = c3;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.ellipse(p.x, p.y, plasmaR * 1.4, plasmaR * 0.5, t * 3 + i, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }

            ctx.restore();
        }

        // 🌟 RENDER SUPERPOWER AURA DIRECTLY ON CANVAS HERO OBJECT (ICON & TITLE)
        function renderHeroObjectVfxAura(ctx, w, h, effect, timeSec, options) {
            if (!ctx || !effect) return;
            try {
                const objX = w / 2;
                const objY = h / 2 - 15;
                const intensity = options.intensity || 1.0;
                const t = timeSec || 0;
                const c1 = effect.color1 || '#ff0033';
                const c2 = effect.color2 || '#ffffff';
                const c3 = effect.color3 || '#ff8800';
                const mode = (effect.mode || '').toLowerCase();

                ctx.save();
                ctx.globalCompositeOperation = 'lighter';

                if (mode.includes('fire') || mode.includes('flame') || mode.includes('lava') || mode.includes('inferno')) {
                    // Licking flames erupting from the hero icon
                    for (let f = 0; f < 5; f++) {
                        const angle = (f * Math.PI / 2.5) - Math.PI / 2;
                        const fx = objX + Math.cos(angle) * 35;
                        const fy = objY + Math.sin(angle) * 20;
                        const fH = (25 + Math.sin(t * 10 + f) * 15) * intensity;
                        const fW = 10 * intensity;

                        const grad = ctx.createLinearGradient(fx, fy, fx, fy - fH);
                        grad.addColorStop(0, c2);
                        grad.addColorStop(0.4, c3);
                        grad.addColorStop(0.8, c1);
                        grad.addColorStop(1, 'transparent');

                        ctx.fillStyle = grad;
                        ctx.beginPath();
                        ctx.moveTo(fx - fW, fy);
                        ctx.quadraticCurveTo(fx - fW * 1.5, fy - fH * 0.5, fx, fy - fH);
                        ctx.quadraticCurveTo(fx + fW * 1.5, fy - fH * 0.5, fx + fW, fy);
                        ctx.closePath();
                        ctx.fill();
                    }
                } else if (mode.includes('laser') || mode.includes('arc') || mode.includes('lightning')) {
                    // Crackling lightning discharging around the icon
                    ctx.strokeStyle = c3;
                    ctx.lineWidth = 2 * intensity;
                    ctx.shadowBlur = 20 * intensity;
                    ctx.shadowColor = c1;
                    for (let a = 0; a < 4; a++) {
                        const ang = (a * Math.PI / 2) + Math.sin(t * 5 + a) * 0.3;
                        ctx.beginPath();
                        ctx.moveTo(objX, objY);
                        const lx = objX + Math.cos(ang) * (50 * intensity);
                        const ly = objY + Math.sin(ang) * (50 * intensity);
                        ctx.lineTo(objX + (lx - objX) * 0.5 + Math.sin(t * 20 + a) * 10, objY + (ly - objY) * 0.5 + Math.cos(t * 20 + a) * 10);
                        ctx.lineTo(lx, ly);
                        ctx.stroke();
                    }
                } else if (mode.includes('frost') || mode.includes('ice') || mode.includes('cryo')) {
                    // Swirling ice blizzard around the icon
                    ctx.strokeStyle = c2;
                    ctx.lineWidth = 1.5;
                    for (let a = 0; a < 6; a++) {
                        const ang = (a * Math.PI / 3) + t * 2;
                        const r = (45 + Math.sin(t * 4 + a) * 10) * intensity;
                        ctx.beginPath();
                        ctx.arc(objX + Math.cos(ang) * r, objY + Math.sin(ang) * r, 3.5 * intensity, 0, Math.PI * 2);
                        ctx.fillStyle = '#ffffff';
                        ctx.fill();
                    }
                } else if (mode.includes('magic') || mode.includes('glitter') || mode.includes('rune')) {
                    // Doctor Strange Sacred Magic Mandala orbiting the icon
                    ctx.strokeStyle = c2;
                    ctx.lineWidth = 1.6;
                    ctx.shadowBlur = 18 * intensity;
                    ctx.shadowColor = c3;
                    const mandalaR = (50 + Math.sin(t * 4) * 6) * intensity;
                    ctx.beginPath();
                    ctx.arc(objX, objY, mandalaR, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.beginPath();
                    for (let g = 0; g < 6; g++) {
                        const ang = t * 2 + (g * Math.PI / 3);
                        const gx = objX + Math.cos(ang) * (mandalaR * 0.8);
                        const gy = objY + Math.sin(ang) * (mandalaR * 0.8);
                        if (g === 0) ctx.moveTo(gx, gy);
                        else ctx.lineTo(gx, gy);
                    }
                    ctx.closePath();
                    ctx.stroke();
                } else {
                    // Pulsing Supernova Corona
                    const coronaR = Math.max(12, (45 + Math.sin(t * 6) * 12) * intensity);
                    const cGrad = ctx.createRadialGradient(objX, objY, 2, objX, objY, coronaR);
                    cGrad.addColorStop(0, c2);
                    cGrad.addColorStop(0.5, c1);
                    cGrad.addColorStop(1, 'transparent');
                    ctx.fillStyle = cGrad;
                    ctx.beginPath();
                    ctx.arc(objX, objY, coronaR, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            } catch (err) {
                console.warn("Hero VFX Aura err:", err);
            }
        }

        function drawPath(ctx, points) {
            if (!points || points.length === 0) return;
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
        }

        // 🎨 120 FPS Dedicated Video Compositor Background Canvas Loop
        function renderVeCanvasLoop() {
            try {
                const sampleCanvas = document.getElementById('ve-sample-canvas');
                const mainCanvas = document.getElementById('main-video-canvas');

                veState.timeSec = (veState.timeSec || 0) + 0.018 * parseFloat(veState.speed || 1);
                const t = veState.timeSec;
                const p = getBgColors(veState.opcode || 12);
                const modelInfo = getLinearModelFromOpcode(veState.opcode || 12);
                const mode = modelInfo.mode;

                if (sampleCanvas) {
                    const ctx = sampleCanvas.getContext('2d');
                    drawCanvasFrame(ctx, sampleCanvas.width, sampleCanvas.height, mode, t, p, veState.opcode || 12);
                }

                if (mainCanvas) {
                    const mCtx = mainCanvas.getContext('2d');
                    // 1. Draw base canvas models
                    drawCanvasFrame(mCtx, mainCanvas.width, mainCanvas.height, mode, t, p, veState.opcode || 12);
                    
                    // 2. Render Superpower Aura directly on the Hero Object
                    const currentVfx = getClientVfx(vfxState.effectOpcode);
                    const opts = {
                        strokeWidth: vfxState.strokeWidth || 16,
                        intensity: (vfxState.intensity || 100) / 100,
                        turbulence: vfxState.turbulence || 1.0
                    };
                    renderHeroObjectVfxAura(mCtx, mainCanvas.width, mainCanvas.height, currentVfx, t, opts);

                    // 3. Render 120 FPS Live Overlay Background & PiP Pad
                    renderOverlayPadOnCanvas(mCtx, mainCanvas.width, mainCanvas.height, t);

                    // 4. Render 120 FPS Live AI Head Swap & Motion Tracker Sync
                    renderLiveHeadTrackingOnCanvas(mCtx, mainCanvas.width, mainCanvas.height, t);

                    // 5. Render 120 FPS YouTube Thumbnail Creator Outline & 3D Badge
                    renderLiveThumbnailStudioLayers(mCtx, mainCanvas.width, mainCanvas.height, t);

                    // 6. Render Live User VFX Pen Strokes at 120 FPS
                    if (typeof renderAllCanvasVfxPaths === 'function') {
                        renderAllCanvasVfxPaths(mCtx, t);
                    }
                }
            } catch (err) {
                console.error("VE canvas loop error:", err);
            }
            requestAnimationFrame(renderVeCanvasLoop);
        }

        // 🖼️ 120 FPS LIVE YOUTUBE THUMBNAIL & PHOTOSHOP STUDIO RENDERER
        function renderLiveThumbnailStudioLayers(ctx, w, h, t) {
            if (!thumbnailStudioState) return;

            // 1. Draw Creator Pop Outline Stroke around center hero
            if (thumbnailStudioState.strokeWidth > 0 && thumbnailStudioState.strokeColor) {
                ctx.save();
                ctx.shadowBlur = (thumbnailStudioState.glowIntensity || 80) * 0.3;
                ctx.shadowColor = thumbnailStudioState.strokeColor;
                ctx.strokeStyle = thumbnailStudioState.strokeColor;
                ctx.lineWidth = thumbnailStudioState.strokeWidth || 8;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';

                const cx = w / 2;
                const cy = h / 2;
                const r = 68;

                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.stroke();

                ctx.restore();
            }

            // 2. Draw 3D High-CTR Thumbnail Text Badge
            if (thumbnailStudioState.badge) {
                ctx.save();
                const badgeX = 36;
                const badgeY = h - 60;
                const text = thumbnailStudioState.badge;

                ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Montserrat", Impact, sans-serif';
                const metrics = ctx.measureText(text);
                const bw = metrics.width + 32;
                const bh = 42;

                ctx.shadowBlur = 20;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
                ctx.fillStyle = '#b91c1c';
                ctx.beginPath();
                ctx.roundRect(badgeX, badgeY, bw, bh, 8);
                ctx.fill();

                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.shadowBlur = 6;
                ctx.shadowColor = '#000000';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(text, badgeX + 16, badgeY + 29);

                ctx.restore();
            }
        }

        // 🎭 120 FPS LIVE AI HEAD SWAP & OBJECT MOTION TRACKER RENDERER
        function renderLiveHeadTrackingOnCanvas(ctx, w, h, t) {
            if (!headSwapState || !headSwapState.active) return;
            ctx.save();

            const walkSpeed = 1.8;
            const bobFactor = (headSwapState.walkingBob || 100) / 100;
            const walkCycle = t * 4 * walkSpeed;
            
            const centerX = (w * 0.35) + Math.sin(t * 0.6) * (w * 0.18);
            const groundY = h * 0.85;
            const bodyH = 140;
            
            const bobY = Math.sin(walkCycle) * 7 * bobFactor;
            const currentY = groundY - bodyH + bobY;
            const headTilt = Math.sin(walkCycle) * 0.08 * bobFactor;

            // 1. Draw Stylized Walking Actor
            ctx.shadowBlur = 12;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';

            const legSwing = Math.sin(walkCycle) * 22;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            // Left Leg
            ctx.beginPath();
            ctx.moveTo(centerX, groundY - 50 + bobY);
            ctx.lineTo(centerX - legSwing, groundY);
            ctx.stroke();
            // Right Leg
            ctx.beginPath();
            ctx.moveTo(centerX, groundY - 50 + bobY);
            ctx.lineTo(centerX + legSwing, groundY);
            ctx.stroke();

            // Torso
            const torsoGrad = ctx.createLinearGradient(centerX - 20, currentY + 25, centerX + 20, groundY - 45 + bobY);
            torsoGrad.addColorStop(0, '#0284c7');
            torsoGrad.addColorStop(1, '#0f172a');
            ctx.fillStyle = torsoGrad;
            ctx.beginPath();
            ctx.roundRect(centerX - 18, currentY + 25, 36, 65, 8);
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Arms
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(centerX - 16, currentY + 35);
            ctx.lineTo(centerX + legSwing * 0.6, currentY + 70);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(centerX + 16, currentY + 35);
            ctx.lineTo(centerX - legSwing * 0.6, currentY + 70);
            ctx.stroke();

            // 2. Neck Pivot Anchor Base
            const neckX = centerX;
            const neckY = currentY + 25;

            // 3. AI Landmark Tracking Vectors & Crosshairs
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#ec4899';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.arc(neckX, neckY, 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // 4. Render Replacement Head Synced to Neck
            ctx.save();
            ctx.translate(neckX, neckY);
            ctx.rotate(headTilt);

            const avatar = headSwapState.avatar || 'cyborg';
            const headSize = 28;

            if (avatar === 'cyborg') {
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#38bdf8';
                ctx.fillStyle = '#090d16';
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(0, -headSize, headSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#06b6d4';
                ctx.fillRect(-18, -headSize - 6, 36, 12);
                ctx.fillStyle = '#ef4444';
                ctx.shadowColor = '#ef4444';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(4, -headSize, 4, 0, Math.PI * 2);
                ctx.fill();
            } else if (avatar === 'lion') {
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#f59e0b';
                ctx.fillStyle = '#d97706';
                ctx.beginPath();
                ctx.arc(0, -headSize, headSize + 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.arc(0, -headSize, headSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(-8, -headSize - 2, 3, 0, Math.PI * 2);
                ctx.arc(8, -headSize - 2, 3, 0, Math.PI * 2);
                ctx.fill();
            } else if (avatar === 'crown') {
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#fbbf24';
                ctx.fillStyle = '#090d16';
                ctx.beginPath();
                ctx.arc(0, -headSize, headSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.moveTo(-headSize, -headSize - 12);
                ctx.lineTo(-headSize * 0.5, -headSize - 28);
                ctx.lineTo(0, -headSize - 16);
                ctx.lineTo(headSize * 0.5, -headSize - 28);
                ctx.lineTo(headSize, -headSize - 12);
                ctx.lineTo(headSize, -headSize - 8);
                ctx.lineTo(-headSize, -headSize - 8);
                ctx.closePath();
                ctx.fill();
            } else if (avatar === 'shades') {
                ctx.fillStyle = '#0f172a';
                ctx.beginPath();
                ctx.arc(0, -headSize, headSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#ec4899';
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#ec4899';
                ctx.fillRect(-20, -headSize - 6, 40, 10);
            } else if (avatar === 'alien') {
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#10b981';
                ctx.fillStyle = '#059669';
                ctx.beginPath();
                ctx.ellipse(0, -headSize, headSize * 0.9, headSize * 1.2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.ellipse(-10, -headSize - 2, 6, 12, -0.3, 0, Math.PI * 2);
                ctx.ellipse(10, -headSize - 2, 6, 12, 0.3, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#f43f5e';
                ctx.fillStyle = '#fb7185';
                ctx.beginPath();
                ctx.arc(0, -headSize, headSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(-8, -headSize - 4, 3, 0, Math.PI * 2);
                ctx.arc(8, -headSize - 4, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();

            // 5. Draw Tracking HUD Label above actor
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            ctx.fillRect(centerX - 65, currentY - 58, 130, 18);
            ctx.strokeStyle = '#c084fc';
            ctx.lineWidth = 1;
            ctx.strokeRect(centerX - 65, currentY - 58, 130, 18);

            ctx.fillStyle = '#f0abfc';
            ctx.font = 'bold 8.5px monospace';
            ctx.fillText('🎭 HEAD SYNC: ' + avatar.toUpperCase(), centerX - 58, currentY - 46);

            ctx.restore();
        }

        // 🎨 120 FPS LIVE OVERLAY BACKGROUND & PiP PAD CANVAS RENDERER
        function renderOverlayPadOnCanvas(ctx, w, h, t) {
            if (!overlayPadState || !overlayPadState.active) return;
            ctx.save();

            const opacity = (overlayPadState.opacity !== undefined ? overlayPadState.opacity : 100) / 100;
            ctx.globalAlpha = opacity;
            ctx.globalCompositeOperation = overlayPadState.blendMode || 'source-over';

            // Calculate Pad Dimensions based on Aspect Ratio
            let pw, ph;
            const ratio = overlayPadState.ratio || '16:9';
            if (ratio === '9:16') {
                ph = h * 0.75;
                pw = ph * (9 / 16);
            } else if (ratio === '1:1') {
                ph = h * 0.65;
                pw = ph;
            } else if (ratio === '4:5') {
                ph = h * 0.7;
                pw = ph * (4 / 5);
            } else {
                pw = w * 0.45;
                ph = pw * (9 / 16);
            }

            // Calculate PiP Position based on Anchor
            let px = 20, py = 20;
            const anchor = overlayPadState.anchor || 'top-right';
            if (anchor === 'top-left') {
                px = 24;
                py = 24;
            } else if (anchor === 'top-right') {
                px = w - pw - 24;
                py = 24;
            } else if (anchor === 'bottom-left') {
                px = 24;
                py = h - ph - 24;
            } else if (anchor === 'bottom-right') {
                px = w - pw - 24;
                py = h - ph - 24;
            } else if (anchor === 'center') {
                px = (w - pw) / 2;
                py = (h - ph) / 2;
            }

            // 1. Draw Outer Shadow
            ctx.shadowBlur = 18;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';

            // 2. Draw Pad Background Style
            const style = overlayPadState.style || 'cyan-grad';
            if (style === 'alpha') {
                ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
                ctx.fillRect(px, py, pw, ph);
                const tileSize = 12;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
                for (let cx = px; cx < px + pw; cx += tileSize * 2) {
                    for (let cy = py; cy < py + ph; cy += tileSize * 2) {
                        ctx.fillRect(cx, cy, tileSize, tileSize);
                        ctx.fillRect(cx + tileSize, cy + tileSize, tileSize, tileSize);
                    }
                }
            } else if (style === 'obsidian') {
                ctx.fillStyle = '#050811';
                ctx.fillRect(px, py, pw, ph);
            } else if (style === 'cyan-grad') {
                const grad = ctx.createLinearGradient(px, py, px + pw, py + ph);
                grad.addColorStop(0, '#0284c7');
                grad.addColorStop(0.5, '#0369a1');
                grad.addColorStop(1, '#082f49');
                ctx.fillStyle = grad;
                ctx.fillRect(px, py, pw, ph);
            } else if (style === 'sunset') {
                const grad = ctx.createLinearGradient(px, py, px + pw, py + ph);
                grad.addColorStop(0, '#ea580c');
                grad.addColorStop(0.5, '#c2410c');
                grad.addColorStop(1, '#431407');
                ctx.fillStyle = grad;
                ctx.fillRect(px, py, pw, ph);
            } else if (style === 'neon-purple') {
                const grad = ctx.createLinearGradient(px, py, px + pw, py + ph);
                grad.addColorStop(0, '#a855f7');
                grad.addColorStop(0.5, '#7e22ce');
                grad.addColorStop(1, '#1e1b4b');
                ctx.fillStyle = grad;
                ctx.fillRect(px, py, pw, ph);
            } else if (style === 'blur') {
                ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
                ctx.fillRect(px, py, pw, ph);
            }

            // 3. Draw PiP Border
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#38bdf8';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.2;
            ctx.strokeRect(px, py, pw, ph);

            // 4. Draw Corner Brackets
            const brLen = 8;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(px, py + brLen); ctx.lineTo(px, py); ctx.lineTo(px + brLen, py); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(px + pw - brLen, py); ctx.lineTo(px + pw, py); ctx.lineTo(px + pw, py + brLen); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(px, py + ph - brLen); ctx.lineTo(px, py + ph); ctx.lineTo(px + brLen, py + ph); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(px + pw - brLen, py + ph); ctx.lineTo(px + pw, py + ph); ctx.lineTo(px + pw, py + ph - brLen); ctx.stroke();

            // 5. Draw Overlay HUD Badge
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            ctx.fillRect(px + 6, py + 6, 92, 16);
            ctx.strokeStyle = '#fb923c';
            ctx.lineWidth = 0.8;
            ctx.strokeRect(px + 6, py + 6, 92, 16);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 8.5px monospace';
            ctx.fillText('🖼️ PIP ' + ratio, px + 10, py + 17.5);

            ctx.restore();
        }

        function drawCanvasFrame(ctx, w, h, mode, t, p, code) {
            code = code || 0;
            ctx.save();
            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
            ctx.globalCompositeOperation = 'source-over';

            try {
                // 1. Base Canvas Backdrop (Solid, Gradient, or Dark Titanium)
                if (colorState && colorState.mode === 'solid') {
                    ctx.fillStyle = colorState.c1 || '#06b6d4';
                    ctx.fillRect(0, 0, w, h);
                } else if (colorState && (colorState.mode === 'gradient' || colorState.activeTab === 'gradient')) {
                    const grad = ctx.createLinearGradient(0, 0, w, h);
                    grad.addColorStop(0, colorState.c1 || '#06b6d4');
                    grad.addColorStop(0.5, colorState.c2 || '#ec4899');
                    grad.addColorStop(1, colorState.c3 || '#8b5cf6');
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, w, h);
                } else {
                    ctx.fillStyle = '#03060c';
                    ctx.fillRect(0, 0, w, h);
                }

                // 2. Continuous 120 FPS Math-Driven Animation Models
                if (mode === 'flower') {
                const cx = w / 2;
                const cy = h / 2;
                const petalCount = (code % 14) + 3;
                const pulse = Math.sin(t * 1.5) * 0.18 + 0.92;

                for (let layer = 3; layer >= 1; layer--) {
                    const layerRadius = (35 + layer * 18) * pulse;
                    const col = layer === 1 ? p.rgba1(0.7) : (layer === 2 ? p.rgba2(0.55) : p.rgba3(0.4));
                    ctx.save();
                    ctx.translate(cx, cy);
                    ctx.rotate(t * (layer % 2 === 0 ? 0.3 : -0.3) + layer * 0.5);

                    for (let i = 0; i < petalCount; i++) {
                        ctx.save();
                        ctx.rotate((i * 2 * Math.PI) / petalCount);
                        const grad = ctx.createRadialGradient(0, layerRadius * 0.5, 2, 0, layerRadius * 0.5, layerRadius * 0.6);
                        grad.addColorStop(0, col);
                        grad.addColorStop(0.7, p.rgba2(0.3));
                        grad.addColorStop(1, 'transparent');
                        ctx.fillStyle = grad;
                        ctx.beginPath();
                        ctx.ellipse(0, layerRadius * 0.5, layerRadius * 0.25, layerRadius * 0.5, 0, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.restore();
                    }
                    ctx.restore();
                }
            } else if (mode === 'bubble') {
                const count = 12 + (code % 12);
                for (let i = 0; i < count; i++) {
                    const seed = (i + 1) * 73;
                    const bSize = 10 + (seed % 16);
                    const by = (h + bSize * 2) - ((t * 40 + seed * 20) % (h + bSize * 4));
                    const bx = ((seed * 41) % w) + Math.sin(t + seed) * 12;
                    ctx.save();
                    ctx.translate(bx, by);
                    const grad = ctx.createRadialGradient(-bSize * 0.3, -bSize * 0.3, bSize * 0.1, 0, 0, bSize);
                    grad.addColorStop(0, 'rgba(255,255,255,0.7)');
                    grad.addColorStop(0.5, p.rgba1(0.5));
                    grad.addColorStop(1, p.rgba2(0.8));
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(0, 0, bSize, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.restore();
                }
            } else if (mode === 'fluid') {
                for (let layer = 0; layer < 3; layer++) {
                    ctx.save();
                    ctx.globalAlpha = 0.65;
                    const grad = ctx.createLinearGradient(0, 0, w, h);
                    grad.addColorStop(0, p.rgba1(0.7));
                    grad.addColorStop(0.5, p.rgba2(0.7));
                    grad.addColorStop(1, p.rgba3(0.7));
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.moveTo(0, h);
                    for (let x = 0; x <= w; x += 6) {
                        const y = h * 0.35 + layer * 25 + Math.sin(x * 0.02 + t * (layer + 1.2)) * 20;
                        ctx.lineTo(x, y);
                    }
                    ctx.lineTo(w, h);
                    ctx.lineTo(0, h);
                    ctx.fill();
                    ctx.restore();
                }
            } else if (mode === 'mesh') {
                const cx1 = w * 0.3 + Math.cos(t) * (w * 0.25);
                const cy1 = h * 0.4 + Math.sin(t * 1.2) * (h * 0.25);
                const rGrad1 = ctx.createRadialGradient(cx1, cy1, 10, cx1, cy1, w * 0.6);
                rGrad1.addColorStop(0, p.rgba1(0.8));
                rGrad1.addColorStop(1, 'transparent');
                ctx.fillStyle = rGrad1;
                ctx.fillRect(0, 0, w, h);

                const cx2 = w * 0.7 + Math.sin(t * 0.9) * (w * 0.25);
                const cy2 = h * 0.6 + Math.cos(t * 1.1) * (h * 0.25);
                const rGrad2 = ctx.createRadialGradient(cx2, cy2, 10, cx2, cy2, w * 0.6);
                rGrad2.addColorStop(0, p.rgba2(0.8));
                rGrad2.addColorStop(1, 'transparent');
                ctx.fillStyle = rGrad2;
                ctx.fillRect(0, 0, w, h);
            } else if (mode === 'aurora') {
                for (let i = 0; i < 3; i++) {
                    ctx.save();
                    ctx.globalAlpha = 0.55;
                    const grad = ctx.createLinearGradient(0, 0, 0, h);
                    grad.addColorStop(0, 'transparent');
                    grad.addColorStop(0.5, i % 2 === 0 ? p.rgba1(0.8) : p.rgba2(0.8));
                    grad.addColorStop(1, 'transparent');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    for (let x = 0; x <= w; x += 6) {
                        const y = (h * 0.2) + i * 30 + Math.sin(x * 0.015 + t * (1 + i * 0.4)) * 30;
                        ctx.lineTo(x, y);
                    }
                    ctx.lineTo(w, h);
                    ctx.lineTo(0, h);
                    ctx.fill();
                    ctx.restore();
                }
            } else {
                // Cosmic / Galaxy Vortex
                const cx = w / 2;
                const cy = h / 2;
                const arms = (code % 6) + 2;
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(t * 0.5);
                for (let i = 0; i < arms; i++) {
                    ctx.rotate((Math.PI * 2) / arms);
                    const grad = ctx.createLinearGradient(0, 0, w * 0.5, h * 0.5);
                    grad.addColorStop(0, p.rgba1(0.8));
                    grad.addColorStop(0.7, p.rgba3(0.4));
                    grad.addColorStop(1, 'transparent');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.ellipse(w * 0.18, 0, w * 0.2, 8, 0.4, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
        } finally {
            ctx.restore();
        }
    }

        // Start Video Compositor loop immediately
        renderVeCanvasLoop();

        function toggleTwinIcon(key, isChecked) {
            const meta = twinMeta[key];
            if (!meta) return;

            const iconBox = document.getElementById('twin-icon-box-' + key);
            const label = document.getElementById('twin-state-label-' + key);
            const term = document.getElementById('io-terminal');

            if (isChecked) {
                iconBox.innerHTML = meta.onSvg;
                iconBox.className = 'w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all';
                label.innerText = meta.onName;
                label.className = 'text-[11px] font-mono text-cyan-300 font-bold';
                if (term) term.innerHTML = '<span class="text-emerald-400">🔄 TWIN-STATE TOGGLE:</span> <b class="text-white">&lt;TitanIcon icon="' + key + '" active={true} /&gt;</b> ➔ <span class="text-cyan-300 font-bold">' + meta.onName + '</span>';
            } else {
                iconBox.innerHTML = meta.offSvg;
                iconBox.className = 'w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-500/60 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all';
                label.innerText = meta.offName;
                label.className = 'text-[11px] font-mono text-rose-300 font-bold';
                if (term) term.innerHTML = '<span class="text-amber-400">🔄 TWIN-STATE TOGGLE:</span> <b class="text-white">&lt;TitanIcon icon="' + key + '" active={false} /&gt;</b> ➔ <span class="text-rose-300 font-bold">' + meta.offName + '</span>';
            }
        }

        let currentFontCat = 'all';

        function setFontCategory(cat, btn) {
            currentFontCat = cat;
            document.querySelectorAll('.font-cat-btn').forEach(b => {
                b.className = 'font-cat-btn px-4 py-1.5 rounded-xl font-mono text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition';
            });
            btn.className = 'font-cat-btn px-4 py-1.5 rounded-xl font-mono text-xs font-black bg-cyan-600 text-slate-950 shadow-lg transition';
            filterFontsList();
        }

        function filterFontsList() {
            const query = (document.getElementById('font-search-input')?.value || '').toLowerCase().trim();
            const cards = document.querySelectorAll('.font-card');
            let visibleCount = 0;

            cards.forEach(card => {
                const cat = card.getAttribute('data-cat') || '';
                const name = card.getAttribute('data-name') || '';

                const matchCat = (currentFontCat === 'all') || (currentFontCat === cat);
                const matchQuery = !query || name.includes(query) || cat.toLowerCase().includes(query);

                if (matchCat && matchQuery) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            const badge = document.getElementById('font-count-badge');
            if (badge) badge.innerText = visibleCount + ' / 256 FONTS';
        }

        function selectGlobalFont(opcode, name, family) {
            typoState.fontOpcode = opcode;
            updateTypoUI('titan-svg-typo-card');
            const mainText = document.getElementById('main-kinetic-text');
            if (mainText) {
                mainText.style.setProperty('font-family', family, 'important');
            }
            const sampleText = document.getElementById('ve-sample-text');
            if (sampleText) {
                sampleText.style.setProperty('font-family', family, 'important');
            }
            const status = document.getElementById('main-canvas-status');
            if (status) {
                status.innerHTML = '<span class="text-cyan-400 font-bold">FONT APPLIED [Opcode 0x' + opcode.toString(16).toUpperCase().padStart(2, '0') + ': ' + name + ']</span>';
            }
            showLiveToast('Font Applied', '#' + opcode + ' ' + name + ' applied to Cinema Canvas!', 'success');
        }

        // 🪟 BULLETPROOF MODAL HANDLERS
        function openTitanModal() {
            const backdrop = document.getElementById('titan-modal-backdrop');
            const box = document.getElementById('titan-modal-box');
            backdrop.style.opacity = '1';
            backdrop.style.pointerEvents = 'auto';
            box.style.transform = 'scale(1) translateY(0)';
            box.style.opacity = '1';
        }

        function closeTitanModal() {
            const backdrop = document.getElementById('titan-modal-backdrop');
            const box = document.getElementById('titan-modal-box');
            backdrop.style.opacity = '0';
            backdrop.style.pointerEvents = 'none';
            box.style.transform = 'scale(0.88) translateY(25px)';
            box.style.opacity = '0';
        }

        // 📑 BULLETPROOF DRAWER HANDLERS
        function openTitanDrawer(id) {
            const targetId = id || 'titan-drawer';
            const backdrop = document.getElementById(targetId + '-backdrop');
            const panel = document.getElementById(targetId);
            backdrop.style.opacity = '1';
            backdrop.style.pointerEvents = 'auto';
            panel.style.transform = 'translateX(0)';
        }

        function closeTitanDrawer(id) {
            const targetId = id || 'titan-drawer';
            const backdrop = document.getElementById(targetId + '-backdrop');
            const panel = document.getElementById(targetId);
            backdrop.style.opacity = '0';
            backdrop.style.pointerEvents = 'none';
            panel.style.transform = 'translateX(100%)';
        }

        // 🔔 BULLETPROOF TOAST NOTIFICATION
        function showLiveToast(title, message, type) {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = 'pointer-events-auto p-4 bg-slate-900 border-2 border-emerald-500 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-3 font-mono text-xs text-white transform transition-all duration-300 translate-y-0 opacity-100';
            toast.innerHTML = '<span class="text-2xl">🔔</span><div><b class="text-emerald-400 text-sm">' + title + '</b><p class="text-slate-300 text-[11px]\">' + message + '</p></div>';
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(50px)';
                setTimeout(() => toast.remove(), 350);
            }, 3500);
        }

        let currentCat = 'all';
        function setCategory(cat, btn) {
            currentCat = cat;
            document.querySelectorAll('.cat-btn').forEach(b => {
                b.className = 'cat-btn px-4 py-1.5 rounded-xl font-mono text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition';
            });
            btn.className = 'cat-btn px-4 py-1.5 rounded-xl font-mono text-xs font-black bg-cyan-600 text-slate-950 shadow-lg transition';
            filterIcons();
        }

        function filterIcons() {
            const query = document.getElementById('icon-search-input').value.toLowerCase().trim();
            const tiles = document.querySelectorAll('.icon-tile');
            let visibleCount = 0;

            tiles.forEach(tile => {
                const cat = tile.getAttribute('data-cat');
                const name = tile.getAttribute('data-name');
                const id = tile.getAttribute('data-id');

                const matchCat = (currentCat === 'all') || 
                                 (currentCat === 'core' && Number(id) <= 255) ||
                                 (currentCat === 'web' && Number(id) >= 256) ||
                                 (currentCat === cat);

                const matchQuery = !query || name.includes(query) || id.includes(query);

                if (matchCat && matchQuery) {
                    tile.style.display = 'flex';
                    visibleCount++;
                } else {
                    tile.style.display = 'none';
                }
            });

            document.getElementById('icon-count-badge').innerText = visibleCount + ' / 512 ICONS';
        }

        // ═══════════════════════════════════════════════════════════════════════════════
        // ✍️ LIVE SVG VECTOR WHITEBOARD & GEOMETRIC STUDIO ENGINE
        // ═══════════════════════════════════════════════════════════════════════════════
        const wbState = {
            mode: 'neon', // 'neon' | 'line' | 'arrow' | 'rect' | 'circle' | 'triangle' | 'highlighter' | 'eraser'
            color: '#22d3ee',
            width: 4,
            fillShape: false,
            drawing: false,
            startPos: null,
            paths: [],
            currentPoints: []
        };

        function initWhiteboard() {
            const id = 'titan-live-whiteboard';
            const canvas = document.getElementById(id + '-canvas');
            if (!canvas) return;

            function getPos(e) {
                const rect = canvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                const scaleX = 800 / rect.width;
                const scaleY = 380 / rect.height;
                return {
                    x: Math.round((clientX - rect.left) * scaleX * 10) / 10,
                    y: Math.round((clientY - rect.top) * scaleY * 10) / 10
                };
            }

            function pointsToSvgPath(pts) {
                if (pts.length === 0) return '';
                if (pts.length === 1) return 'M ' + pts[0].x + ' ' + pts[0].y + ' L ' + (pts[0].x + 0.1) + ' ' + (pts[0].y + 0.1);
                let d = 'M ' + pts[0].x + ' ' + pts[0].y;
                for (let i = 1; i < pts.length - 1; i++) {
                    const mx = (pts[i].x + pts[i + 1].x) / 2;
                    const my = (pts[i].y + pts[i + 1].y) / 2;
                    d += ' Q ' + pts[i].x + ' ' + pts[i].y + ', ' + mx + ' ' + my;
                }
                d += ' L ' + pts[pts.length - 1].x + ' ' + pts[pts.length - 1].y;
                return d;
            }

            function generateShapeHtml(shape) {
                const glowStyle = (shape.mode === 'neon' || shape.mode === 'rect' || shape.mode === 'circle' || shape.mode === 'triangle' || shape.mode === 'line' || shape.mode === 'arrow') ? 'filter: drop-shadow(0 0 6px ' + shape.color + ');' : '';
                const fillCol = shape.fill ? shape.color + '33' : 'none';
                const opacity = shape.mode === 'highlighter' ? '0.45' : '1';
                const strokeCol = shape.mode === 'eraser' ? '#090d16' : shape.color;
                const strokeW = shape.mode === 'eraser' ? shape.width * 2.5 : shape.width;

                if (shape.type === 'path') {
                    return '<path d="' + shape.d + '" fill="none" stroke="' + strokeCol + '" stroke-width="' + strokeW + '" stroke-linecap="round" stroke-linejoin="round" opacity="' + opacity + '" style="' + glowStyle + '"/>';
                }
                if (shape.type === 'line') {
                    return '<line x1="' + shape.x1 + '" y1="' + shape.y1 + '" x2="' + shape.x2 + '" y2="' + shape.y2 + '" stroke="' + strokeCol + '" stroke-width="' + strokeW + '" stroke-linecap="round" style="' + glowStyle + '"/>';
                }
                if (shape.type === 'arrow') {
                    return '<g style="' + glowStyle + '">' +
                        '<line x1="' + shape.x1 + '" y1="' + shape.y1 + '" x2="' + shape.x2 + '" y2="' + shape.y2 + '" stroke="' + strokeCol + '" stroke-width="' + strokeW + '" stroke-linecap="round"/>' +
                        '<polygon points="' + getArrowheadPoints(shape.x1, shape.y1, shape.x2, shape.y2, strokeW) + '" fill="' + strokeCol + '"/>' +
                    '</g>';
                }
                if (shape.type === 'rect') {
                    return '<rect x="' + shape.x + '" y="' + shape.y + '" width="' + shape.w + '" height="' + shape.h + '" rx="8" fill="' + fillCol + '" stroke="' + strokeCol + '" stroke-width="' + strokeW + '" style="' + glowStyle + '"/>';
                }
                if (shape.type === 'circle') {
                    return '<ellipse cx="' + shape.cx + '" cy="' + shape.cy + '" rx="' + shape.rx + '" ry="' + shape.ry + '" fill="' + fillCol + '" stroke="' + strokeCol + '" stroke-width="' + strokeW + '" style="' + glowStyle + '"/>';
                }
                if (shape.type === 'triangle') {
                    return '<polygon points="' + shape.points + '" fill="' + fillCol + '" stroke="' + strokeCol + '" stroke-width="' + strokeW + '" stroke-linejoin="round" style="' + glowStyle + '"/>';
                }
                return '';
            }

            function getArrowheadPoints(x1, y1, x2, y2, width) {
                const angle = Math.atan2(y2 - y1, x2 - x1);
                const headLen = Math.max(12, width * 3);
                const p1x = x2 - headLen * Math.cos(angle - Math.PI / 6);
                const p1y = y2 - headLen * Math.sin(angle - Math.PI / 6);
                const p2x = x2 - headLen * Math.cos(angle + Math.PI / 6);
                const p2y = y2 - headLen * Math.sin(angle + Math.PI / 6);
                return x2 + ',' + y2 + ' ' + p1x + ',' + p1y + ' ' + p2x + ',' + p2y;
            }

            function renderCurrentShape(curPos) {
                const container = document.getElementById(id + '-current-shape');
                if (!container || !wbState.startPos) return;
                const s = wbState.startPos;
                const e = curPos;

                if (wbState.mode === 'neon' || wbState.mode === 'highlighter' || wbState.mode === 'eraser') {
                    const d = pointsToSvgPath(wbState.currentPoints);
                    container.innerHTML = generateShapeHtml({
                        type: 'path',
                        d,
                        color: wbState.color,
                        width: wbState.width,
                        mode: wbState.mode
                    });
                } else if (wbState.mode === 'line') {
                    container.innerHTML = generateShapeHtml({
                        type: 'line',
                        x1: s.x, y1: s.y, x2: e.x, y2: e.y,
                        color: wbState.color,
                        width: wbState.width,
                        mode: wbState.mode
                    });
                } else if (wbState.mode === 'arrow') {
                    container.innerHTML = generateShapeHtml({
                        type: 'arrow',
                        x1: s.x, y1: s.y, x2: e.x, y2: e.y,
                        color: wbState.color,
                        width: wbState.width,
                        mode: wbState.mode
                    });
                } else if (wbState.mode === 'rect') {
                    const x = Math.min(s.x, e.x);
                    const y = Math.min(s.y, e.y);
                    const w = Math.abs(e.x - s.x);
                    const h = Math.abs(e.y - s.y);
                    container.innerHTML = generateShapeHtml({
                        type: 'rect',
                        x, y, w, h,
                        fill: wbState.fillShape,
                        color: wbState.color,
                        width: wbState.width,
                        mode: wbState.mode
                    });
                } else if (wbState.mode === 'circle') {
                    const cx = (s.x + e.x) / 2;
                    const cy = (s.y + e.y) / 2;
                    const rx = Math.abs(e.x - s.x) / 2;
                    const ry = Math.abs(e.y - s.y) / 2;
                    container.innerHTML = generateShapeHtml({
                        type: 'circle',
                        cx, cy, rx, ry,
                        fill: wbState.fillShape,
                        color: wbState.color,
                        width: wbState.width,
                        mode: wbState.mode
                    });
                } else if (wbState.mode === 'triangle') {
                    const topX = (s.x + e.x) / 2;
                    const topY = s.y;
                    const leftX = s.x;
                    const leftY = e.y;
                    const rightX = e.x;
                    const rightY = e.y;
                    const points = topX + ',' + topY + ' ' + leftX + ',' + leftY + ' ' + rightX + ',' + rightY;
                    container.innerHTML = generateShapeHtml({
                        type: 'triangle',
                        points,
                        fill: wbState.fillShape,
                        color: wbState.color,
                        width: wbState.width,
                        mode: wbState.mode
                    });
                }
            }

            function renderAll() {
                const group = document.getElementById(id + '-paths');
                if (!group) return;
                group.innerHTML = wbState.paths.map(shape => generateShapeHtml(shape)).join('');
                document.getElementById(id + '-current-shape').innerHTML = '';
            }

            function start(e) {
                e.preventDefault();
                wbState.drawing = true;
                const pos = getPos(e);
                wbState.startPos = pos;
                wbState.currentPoints = [pos];
                document.getElementById(id + '-helper')?.classList.add('opacity-0');
                renderCurrentShape(pos);
            }

            function move(e) {
                if (!wbState.drawing) return;
                e.preventDefault();
                const pos = getPos(e);
                wbState.currentPoints.push(pos);
                renderCurrentShape(pos);
            }

            function end(e) {
                if (!wbState.drawing) return;
                wbState.drawing = false;
                const pos = getPos(e);
                const s = wbState.startPos;

                if (wbState.mode === 'neon' || wbState.mode === 'highlighter' || wbState.mode === 'eraser') {
                    if (wbState.currentPoints.length > 0) {
                        const d = pointsToSvgPath(wbState.currentPoints);
                        wbState.paths.push({
                            type: 'path',
                            d,
                            color: wbState.color,
                            width: wbState.width,
                            mode: wbState.mode
                        });
                    }
                } else if (wbState.mode === 'line') {
                    wbState.paths.push({
                        type: 'line',
                        x1: s.x, y1: s.y, x2: pos.x, y2: pos.y,
                        color: wbState.color,
                        width: wbState.width,
                        mode: wbState.mode
                    });
                } else if (wbState.mode === 'arrow') {
                    wbState.paths.push({
                        type: 'arrow',
                        x1: s.x, y1: s.y, x2: pos.x, y2: pos.y,
                        color: wbState.color,
                        width: wbState.width,
                        mode: wbState.mode
                    });
                } else if (wbState.mode === 'rect') {
                    const x = Math.min(s.x, pos.x);
                    const y = Math.min(s.y, pos.y);
                    const w = Math.abs(pos.x - s.x);
                    const h = Math.abs(pos.y - s.y);
                    if (w > 2 || h > 2) {
                        wbState.paths.push({
                            type: 'rect',
                            x, y, w, h,
                            fill: wbState.fillShape,
                            color: wbState.color,
                            width: wbState.width,
                            mode: wbState.mode
                        });
                    }
                } else if (wbState.mode === 'circle') {
                    const cx = (s.x + pos.x) / 2;
                    const cy = (s.y + pos.y) / 2;
                    const rx = Math.abs(pos.x - s.x) / 2;
                    const ry = Math.abs(pos.y - s.y) / 2;
                    if (rx > 2 || ry > 2) {
                        wbState.paths.push({
                            type: 'circle',
                            cx, cy, rx, ry,
                            fill: wbState.fillShape,
                            color: wbState.color,
                            width: wbState.width,
                            mode: wbState.mode
                        });
                    }
                } else if (wbState.mode === 'triangle') {
                    const topX = (s.x + pos.x) / 2;
                    const topY = s.y;
                    const leftX = s.x;
                    const leftY = pos.y;
                    const rightX = pos.x;
                    const rightY = pos.y;
                    const points = topX + ',' + topY + ' ' + leftX + ',' + leftY + ' ' + rightX + ',' + rightY;
                    wbState.paths.push({
                        type: 'triangle',
                        points,
                        fill: wbState.fillShape,
                        color: wbState.color,
                        width: wbState.width,
                        mode: wbState.mode
                    });
                }

                wbState.currentPoints = [];
                wbState.startPos = null;
                renderAll();
            }

            canvas.addEventListener('mousedown', start);
            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', end);

            canvas.addEventListener('touchstart', start, { passive: false });
            canvas.addEventListener('touchmove', move, { passive: false });
            window.addEventListener('touchend', end);
        }

        window.titanWbSetMode = function(id, mode) {
            wbState.mode = mode;
            ['neon', 'line', 'arrow', 'rect', 'circle', 'triangle', 'highlighter', 'eraser'].forEach(m => {
                const btn = document.getElementById(id + '-btn-' + m);
                if (btn) {
                    if (m === mode) {
                        btn.className = 'px-2.5 py-1.5 rounded-lg font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 transition-all flex items-center gap-1';
                    } else {
                        btn.className = 'px-2.5 py-1.5 rounded-lg font-bold text-slate-400 hover:text-white transition-all flex items-center gap-1';
                    }
                }
            });
        };

        window.titanWbSetFill = function(id, checked) {
            wbState.fillShape = checked;
        };

        window.titanWbSetColor = function(id, color) {
            wbState.color = color;
            if (wbState.mode === 'eraser') window.titanWbSetMode(id, 'neon');
        };

        window.titanWbSetWidth = function(id, width) {
            wbState.width = Number(width);
            const valEl = document.getElementById(id + '-width-val');
            if (valEl) valEl.innerText = width;
        };

        window.titanWbUndo = function(id) {
            wbState.paths.pop();
            const group = document.getElementById(id + '-paths');
            if (group) {
                const id_canvas = 'titan-live-whiteboard';
                // re-render all
                const canvas = document.getElementById(id_canvas + '-canvas');
                if (canvas) {
                    // trigger renderAll logic
                    group.innerHTML = wbState.paths.map(shape => {
                        const glowStyle = (shape.mode === 'neon' || shape.mode === 'rect' || shape.mode === 'circle' || shape.mode === 'triangle' || shape.mode === 'line' || shape.mode === 'arrow') ? 'filter: drop-shadow(0 0 6px ' + shape.color + ');' : '';
                        const fillCol = shape.fill ? shape.color + '33' : 'none';
                        const opacity = shape.mode === 'highlighter' ? '0.45' : '1';
                        const strokeCol = shape.mode === 'eraser' ? '#090d16' : shape.color;
                        const strokeW = shape.mode === 'eraser' ? shape.width * 2.5 : shape.width;

                        if (shape.type === 'path') return '<path d="' + shape.d + '" fill="none" stroke="' + strokeCol + '" stroke-width="' + strokeW + '" stroke-linecap="round" stroke-linejoin="round" opacity="' + opacity + '" style="' + glowStyle + '"/>';
                        if (shape.type === 'line') return '<line x1="' + shape.x1 + '" y1="' + shape.y1 + '" x2="' + shape.x2 + '" y2="' + shape.y2 + '" stroke="' + strokeCol + '" stroke-width="' + strokeW + '" stroke-linecap="round" style="' + glowStyle + '"/>';
                        if (shape.type === 'arrow') {
                            const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);
                            const headLen = Math.max(12, strokeW * 3);
                            const p1x = shape.x2 - headLen * Math.cos(angle - Math.PI / 6);
                            const p1y = shape.y2 - headLen * Math.sin(angle - Math.PI / 6);
                            const p2x = shape.x2 - headLen * Math.cos(angle + Math.PI / 6);
                            const p2y = shape.y2 - headLen * Math.sin(angle + Math.PI / 6);
                            const pts = shape.x2 + ',' + shape.y2 + ' ' + p1x + ',' + p1y + ' ' + p2x + ',' + p2y;
                            return '<g style="' + glowStyle + '"><line x1="' + shape.x1 + '" y1="' + shape.y1 + '" x2="' + shape.x2 + '" y2="' + shape.y2 + '" stroke="' + strokeCol + '" stroke-width="' + strokeW + '" stroke-linecap="round"/><polygon points="' + pts + '" fill="' + strokeCol + '"/></g>';
                        }
                        if (shape.type === 'rect') return '<rect x="' + shape.x + '" y="' + shape.y + '" width="' + shape.w + '" height="' + shape.h + '" rx="8" fill="' + fillCol + '" stroke="' + strokeCol + '" stroke-width="' + strokeW + '" style="' + glowStyle + '"/>';
                        if (shape.type === 'circle') return '<ellipse cx="' + shape.cx + '" cy="' + shape.cy + '" rx="' + shape.rx + '" ry="' + shape.ry + '" fill="' + fillCol + '" stroke="' + strokeCol + '" stroke-width="' + strokeW + '" style="' + glowStyle + '"/>';
                        if (shape.type === 'triangle') return '<polygon points="' + shape.points + '" fill="' + fillCol + '" stroke="' + strokeCol + '" stroke-width="' + strokeW + '" stroke-linejoin="round" style="' + glowStyle + '"/>';
                        return '';
                    }).join('');
                }
            }
            if (wbState.paths.length === 0) {
                document.getElementById(id + '-helper')?.classList.remove('opacity-0');
            }
        };

        window.titanWbClear = function(id) {
            wbState.paths = [];
            wbState.currentPoints = [];
            const group = document.getElementById(id + '-paths');
            if (group) group.innerHTML = '';
            document.getElementById(id + '-current-shape').innerHTML = '';
            document.getElementById(id + '-helper')?.classList.remove('opacity-0');
        };

        window.titanWbDownloadSvg = function(id) {
            if (wbState.paths.length === 0) {
                showLiveToast('Drawing Canvas', 'Please draw something on the canvas first!', 'info');
                return;
            }
            const innerSvg = document.getElementById(id + '-paths')?.innerHTML || '';
            const fullSvg = '<?xml version="1.0" standalone="no"?>\\n<svg viewBox="0 0 800 380" width="800" height="380" xmlns="http://www.w3.org/2000/svg" style="background:#090d16;">\\n' + innerSvg + '\\n</svg>';
            const blob = new Blob([fullSvg], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'danphe-vector-drawing.svg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            showLiveToast('Export SVG', 'Standalone vector SVG downloaded successfully!', 'success');
        };

        window.setBgOpcodeFromNumber = setBgOpcodeFromNumber;
        window.stepBgOpcode = stepBgOpcode;
        window.selectBgPreset = selectBgPreset;
        window.setBgSpeed = setBgSpeed;
        window.togglePageBackgroundMode = togglePageBackgroundMode;
        window.toggleBgAutoCycle = toggleBgAutoCycle;
        window.updateBgStageUI = updateBgStageUI;
        window.toggleCustomColorMode = toggleCustomColorMode;
        window.setCustomColor = setCustomColor;
        window.applyBrandPreset = applyBrandPreset;

        // Video Editor Inspector Window Bindings
        window.setSliderText = setSliderText;
        window.stepSliderText = stepSliderText;
        window.setSliderColor = setSliderColor;
        window.stepSliderColor = stepSliderColor;
        window.setSliderNormal = setSliderNormal;
        window.stepSliderNormal = stepSliderNormal;
        window.toggleVePlayback = toggleVePlayback;
        window.resetVePlayback = resetVePlayback;
        window.applyVeLayerToTimeline = applyVeLayerToTimeline;
        window.addVeKeyframe = addVeKeyframe;
        window.toggleMobileFrameMode = toggleMobileFrameMode;
        window.scrollTabsLeft = scrollTabsLeft;
        window.scrollTabsRight = scrollTabsRight;

        // Transform Card Window Bindings
        window.switchActiveCardInspector = switchActiveCardInspector;
        window.stepTfChannel = stepTfChannel;
        window.stepTfSlider = stepTfChannel;
        window.updateTfUI = updateTfUI;
        window.updateTfViewportMatrix = updateTfViewportMatrix;
        window.setTfAnchor = setTfAnchor;
        window.quickTfAction = quickTfAction;
        window.switchTfMode = switchTfMode;
        window.switchTfTab = switchTfTab;
        window.toggleTfKeyframe = toggleTfKeyframe;
        window.applyTfToTimeline = applyTfToTimeline;
        window.toggleTfFrameMode = toggleTfFrameMode;
        window.scrollTfTabsLeft = scrollTfTabsLeft;
        window.scrollTfTabsRight = scrollTfTabsRight;

        // 🎞️ 35mm Filmstrip Toolbar Window Bindings
        window.selectFilmstripTool = selectFilmstripTool;
        window.stepFilmstripScroll = stepFilmstripScroll;
        window.initFilmstripDrag = initFilmstripDrag;
        window.showFilmstripTooltip = showFilmstripTooltip;
        window.hideFilmstripTooltip = hideFilmstripTooltip;

        // 🎨 Overlay BG Pad Studio Window Bindings
        window.setOverlayPadRatio = setOverlayPadRatio;
        window.setOverlayPadStyle = setOverlayPadStyle;
        window.setOverlayPipAnchor = setOverlayPipAnchor;
        window.updateOverlayOpacity = updateOverlayOpacity;
        window.updateOverlayBlendMode = updateOverlayBlendMode;
        window.applyOverlayPadToTimeline = applyOverlayPadToTimeline;
        window.triggerNativeOverlayImport = triggerNativeOverlayImport;
        window.insertOverlayItemToTimeline = insertOverlayItemToTimeline;

        // 🎭 AI Head Swap & Motion Tracker Window Bindings
        window.setHeadSwapAvatar = setHeadSwapAvatar;
        window.setWalkingBob = setWalkingBob;
        window.setNeckPivot = setNeckPivot;
        window.activateHeadSwapMode = activateHeadSwapMode;

        // 🖼️ YouTube Thumbnail & Photoshop Photo Studio Window Bindings
        window.switchThumbnailStudioTab = switchThumbnailStudioTab;
        window.toggleAiCutout = toggleAiCutout;
        window.selectCutoutSubject = selectCutoutSubject;
        window.setCutoutFeather = setCutoutFeather;
        window.applyCutoutToTimeline = applyCutoutToTimeline;
        window.setCreatorStrokeColor = setCreatorStrokeColor;
        window.setCreatorStrokeWidth = setCreatorStrokeWidth;
        window.setCreatorGlowIntensity = setCreatorGlowIntensity;
        window.applyThumbnailGlowToCanvas = applyThumbnailGlowToCanvas;
        window.setThumbnailHdrPop = setThumbnailHdrPop;
        window.setThumbnailBgBlur = setThumbnailBgBlur;
        window.setThumbnailVignette = setThumbnailVignette;
        window.insertThumbnailBadge = insertThumbnailBadge;
        window.applyCustomThumbnailText = applyCustomThumbnailText;
        window.exportThumbnailHD = exportThumbnailHD;

        // 🔤 Typography & Subtitle Styling Window Bindings
        window.switchTypoSubTab = switchTypoSubTab;
        window.setTypoFontSize = setTypoFontSize;
        window.setTypoCurveArc = setTypoCurveArc;
        window.setTypoGradient = setTypoGradient;
        window.toggleKaraokeMode = toggleKaraokeMode;
        window.applyViralTypoTemplate = applyViralTypoTemplate;
        window.setTypoStrokeColor = setTypoStrokeColor;
        window.setTypoStrokeWidth = setTypoStrokeWidth;
        window.setTypoShadow = setTypoShadow;
        window.setTypoBgStyle = setTypoBgStyle;
        window.setTypoBgOpacity = setTypoBgOpacity;
        window.setTypoBgRadius = setTypoBgRadius;
        window.setTypoFillColor = setTypoFillColor;
        window.setTypoTracking = setTypoTracking;

        // 🔌 TITAN MODULAR HARDWARE PCB CONTROLLER (READY-MADE BUS INTEGRATION)
        const titanPCB = {
            regs: new Uint32Array(4096),
            write: function(addr, val) {
                this.regs[addr & 0x0FFF] = Number(val) >>> 0;
                if (typeof TitanMicroBus !== 'undefined' && TitanMicroBus.write) {
                    TitanMicroBus.write(addr, val);
                }
            },
            read: function(addr) {
                return this.regs[addr & 0x0FFF] || 0;
            },
            sendMouseDrag: function(dx, dy) {
                tfState.posX = (tfState.posX || 0) + dx;
                tfState.posY = (tfState.posY || 0) + dy;
                updateTfUI();
                setVeTransform();
                const cli = '[TITAN_PCB_TX] MOUSE_DRAG dx:' + dx + ' dy:' + dy + ' POS:(' + tfState.posX + ',' + tfState.posY + ')';
                const status = document.getElementById('main-canvas-status');
                if (status) status.innerHTML = '<span class="text-cyan-400 font-mono text-[9px]">' + cli + '</span>';
            },
            sendZoom: function(factor) {
                const cur = tfState.scale || 100;
                tfState.scale = Math.max(10, Math.min(400, Math.round(cur * factor)));
                updateTfUI();
                setVeTransform();
                const cli = '[TITAN_PCB_TX] WHEEL_ZOOM factor:' + factor.toFixed(2) + ' SCALE:' + tfState.scale + '%';
                const status = document.getElementById('main-canvas-status');
                if (status) status.innerHTML = '<span class="text-cyan-400 font-mono text-[9px]">' + cli + '</span>';
            },
            selectTool: function(toolId) {
                this.write(0x4002, 1);
                const cli = '[TITAN_PCB_TX] TOOL_SELECT ' + toolId;
                const status = document.getElementById('main-canvas-status');
                if (status) status.innerHTML = '<span class="text-emerald-400 font-mono text-[9px]">' + cli + '</span>';
            },
            switchCard: function(cardId) {
                this.write(0x4001, 1);
                const cli = '[TITAN_PCB_TX] CARD_SWITCH ' + cardId.toUpperCase();
                const status = document.getElementById('main-canvas-status');
                if (status) status.innerHTML = '<span class="text-amber-400 font-mono text-[9px]">' + cli + '</span>';
            }
        };
        window.titanPCB = titanPCB;

        // Initialize Background UI, Master Stage, Whiteboard, and Video Editor on load
        setTimeout(() => {
            updateMasterStageUI(currentMasterOpcode);
            updateBgStageUI();
            initWhiteboard();
            renderVeTitleLayer();
            setVeTransform();
            initSvgSliderDrag();
            initTfSliderDrag();
            initVfxSliderDrag();
            initCanvasPenDrawing();
            initFilmstripWheel();
        }, 50);
    </script>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (req.method === 'GET') {
        if (url.pathname === '/') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(renderFullPage());
            return;
        }

        if (url.pathname === '/editor' || url.pathname === '/video-editor' || url.pathname === '/nle') {
            try {
                const editorPath = path.join(__dirname, 'views', 'index.html');
                if (fs.existsSync(editorPath)) {
                    const editorHtml = fs.readFileSync(editorPath, 'utf8');
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(editorHtml);
                    return;
                }
            } catch (e) {
                console.error('Error reading editor html:', e);
            }
        }
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`🚀 Danphe UI Full Suite Studio running at http://localhost:${PORT}`);
    console.log(`🎬 Cinema Master NLE Video Editor running at http://localhost:${PORT}/editor`);
});
