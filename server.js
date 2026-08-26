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
    TITAN_REG,
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
const { generateAnimationCSS, ANIMATIONS_256 } = require('./animations/index.js');

let TitanMicroBus;
try {
    const tb = require('d:/titan-bus/index.js');
    TitanMicroBus = tb.TitanMicroBus;
} catch (e) {
    class MockBus {
        constructor() { this.regs = new Map(); this.subs = new Map(); }
        write(r, v) { this.regs.set(r, v); (this.subs.get(r) || []).forEach(fn => fn(v)); }
        read(r, d = '') { return this.regs.has(r) ? this.regs.get(r) : d; }
        subscribe(r, fn) { if (!this.subs.has(r)) this.subs.set(r, []); this.subs.get(r).push(fn); }
    }
    TitanMicroBus = new MockBus();
}

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

    const animCss = generateAnimationCSS();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🐬 Danphe UI Full 512 Vector Suite & Components</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        ${animCss}
        ${DANPHE_LOGO_CSS}
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #090d16; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
    </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 font-sans">
    
    <!-- TOP MASTER NAVBAR -->
    <div class="w-full max-w-7xl">
        ${navbarHtml}
    </div>

    <!-- TOAST OVERLAY TARGET -->
    <div id="toast-container" class="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"></div>

    <!-- 🪟 GLOBAL POPUP MODAL (DIRECT INLINE CSS TRANSFORM ACCELERATION) -->
    <div id="titan-modal-backdrop" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4" 
         style="opacity: 0; pointer-events: none; transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);" 
         onclick="if(event.target===this)closeTitanModal();">
        <div id="titan-modal-box" class="max-w-lg w-full bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(34,211,238,0.3)] flex flex-col gap-4" 
             style="transform: scale(0.88) translateY(25px); opacity: 0; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;">
            <div class="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-inner">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                        <h3 class="text-sm font-black uppercase tracking-wider text-white font-mono">Hospital Patient Admission</h3>
                        <p class="text-[11px] text-slate-400 font-mono">ICU Bed & Biometric Vitals Allocation Dialog</p>
                    </div>
                </div>
                <button type="button" onclick="closeTitanModal();" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 flex items-center justify-center font-mono font-bold transition">✕</button>
            </div>
            <div class="flex flex-col gap-3 py-2 text-xs font-mono text-slate-300">
                <div class="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-1">
                    <span class="text-[10px] text-slate-500 font-bold uppercase">Assigned Attending Doctor</span>
                    <span class="text-white font-bold text-sm">👨‍⚕️ Dr. Shankar Phuyal (Chief Cardiologist)</span>
                </div>
                <div class="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-1">
                    <span class="text-[10px] text-slate-500 font-bold uppercase">Assigned Unit</span>
                    <span class="text-cyan-300 font-bold text-sm">🏥 Emergency ICU Ward - Bed #04 (Connected 98% SpO2)</span>
                </div>
            </div>
            <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button type="button" onclick="closeTitanModal();" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono rounded-xl font-bold transition shadow-md">Cancel</button>
                <button type="button" onclick="showLiveToast('Admission Approved', 'Bed #04 allocated to Patient successfully.', 'success'); closeTitanModal();" class="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-mono rounded-xl font-black transition shadow-[0_0_15px_rgba(34,211,238,0.4)]">Authorize Admission</button>
            </div>
        </div>
    </div>

    <!-- 📑 GLOBAL SLIDE-OUT DRAWER -->
    ${renderTitanDrawer({
        id: 'titan-drawer',
        title: 'Patient Medical History',
        subtitle: 'ICU Bed #01 &bull; Sunita Sharma',
        position: 'right',
        content: `
        <div class="flex flex-col gap-3">
            <div class="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-1">
                <span class="text-[10px] text-slate-500 font-bold uppercase">Diagnosis</span>
                <span class="text-xs text-white font-bold">Acute Respiratory Distress & Cardio Monitoring</span>
            </div>
            <div class="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-1">
                <span class="text-[10px] text-slate-500 font-bold uppercase">Attending Specialist</span>
                <span class="text-xs text-cyan-300 font-bold">Dr. Shankar Phuyal (Chief of Cardiology)</span>
            </div>
            <div class="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-2">
                <span class="text-[10px] text-slate-500 font-bold uppercase">Live Vitals Telemetry</span>
                <div class="flex items-center justify-between text-xs text-emerald-400 font-bold">
                    <span>💓 Heart Rate: 78 bpm</span>
                    <span>💨 SpO2: 98%</span>
                </div>
            </div>
        </div>`
    })}

    <!-- Main Container -->
    <main class="w-full max-w-7xl flex flex-col gap-8">
        
        <!-- 🇳🇵 HERO NATIONAL BIRD DANPHE, FLAG OF NEPAL & LIVE NEPALI DATE CARD -->
        <section class="p-6 bg-gradient-to-r from-slate-900/95 via-cyan-950/30 to-rose-950/30 rounded-3xl border-2 border-cyan-500/40 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] backdrop-blur-2xl">
            <div class="flex flex-col sm:flex-row items-center gap-6">
                <!-- 3D Animated Danphe Bird Logo & Flag -->
                <div class="flex items-center gap-3">
                    <div class="p-3 bg-slate-950/90 rounded-2xl border border-cyan-500/50 flex items-center justify-center shadow-inner">
                        ${renderDanpheLogo({ size: 90, animated: true, glow: true, showBadge: true })}
                    </div>
                    <div class="p-3 bg-slate-950/90 rounded-2xl border border-rose-500/40 flex items-center justify-center shadow-inner">
                        ${renderNepalFlag({ width: 68, height: 84, animated: true })}
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="text-xs font-mono bg-cyan-950 text-cyan-300 px-3 py-0.5 rounded-full border border-cyan-700 font-black">🇳🇵 ३डी एनिमेटेड डाँफे (DANPHE 3D)</span>
                        <span class="text-xs font-mono bg-rose-950 text-rose-300 px-3 py-0.5 rounded-full border border-rose-700 font-bold">१२० FPS झण्डा</span>
                        <!-- 🇳🇵 Live Nepali Date Pill Tag -->
                        ${renderNepaliDateTag({ variant: 'pill' })}
                    </div>
                    <h2 class="text-xl sm:text-2xl font-black text-white font-mono tracking-tight flex items-center gap-2">
                        राष्ट्रिय चरा डाँफे र नेपालको झण्डा <span class="text-sm font-bold text-slate-400 font-sans">(Himalayan Monal & Flag)</span>
                    </h2>
                    <p class="text-xs text-slate-300 max-w-2xl font-mono">
                        9-Color Iridescent Metallic Plumage &bull; Emerald Crown Crest Flutter &bull; Sky-Blue Eye Orbit &bull; 120 FPS GPU Wing Physics & Bullseye Precision Vector Bézier Curves.
                    </p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                ${renderNepaliDateTag({ variant: 'badge' })}
            </div>
        </section>

        <!-- SECTION 1: STAT METRIC CARDS -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            ${stat1}
            ${stat2}
            ${stat3}
            ${stat4}
        </section>

        <!-- 🎛️ SECTION 1.5: BIOMETRIC GAUGES, PROGRESS & OVERLAYS ROW -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <!-- Progress Bars Card -->
            <div class="p-5 bg-slate-950/90 rounded-3xl border border-slate-800 flex flex-col justify-between gap-4 shadow-xl">
                <div class="flex items-center justify-between pb-2 border-b border-slate-900">
                    <span class="text-xs font-black uppercase text-cyan-400 font-mono flex items-center gap-2">
                        <span>📊</span> Vector Progress & Capacity
                    </span>
                    <span class="text-[10px] font-mono text-slate-500 font-bold">&lt;TitanProgress /&gt;</span>
                </div>
                <div class="flex flex-col gap-3">
                    ${renderTitanProgress({ value: 88, color: 'cyan', label: 'ICU Oxygen Reserve', showValue: true })}
                    ${renderTitanProgress({ value: 65, color: 'emerald', label: 'PBX Trunk Line Capacity', showValue: true })}
                    ${renderTitanProgress({ value: 92, color: 'rose', label: 'Hospital Bed Occupancy', showValue: true })}
                </div>
            </div>

            <!-- Circular Radial Gauges -->
            <div class="p-5 bg-slate-950/90 rounded-3xl border border-slate-800 flex flex-col justify-between gap-4 shadow-xl">
                <div class="flex items-center justify-between pb-2 border-b border-slate-900">
                    <span class="text-xs font-black uppercase text-emerald-400 font-mono flex items-center gap-2">
                        <span>🎯</span> Circular Radial Gauges
                    </span>
                    <span class="text-[10px] font-mono text-slate-500 font-bold">variant="circular"</span>
                </div>
                <div class="flex items-center justify-around">
                    ${renderTitanProgress({ value: 98, variant: 'circular', color: 'emerald', label: 'SpO2 Oxygen' })}
                    ${renderTitanProgress({ value: 78, variant: 'circular', color: 'cyan', label: 'Pulse BPM' })}
                    ${renderTitanProgress({ value: 45, variant: 'circular', color: 'amber', label: 'DSP Load' })}
                </div>
            </div>

            <!-- Overlays & Triggers: Modal, Toast, Drawer -->
            <div class="p-5 bg-slate-950/90 rounded-3xl border border-slate-800 flex flex-col justify-between gap-4 shadow-xl">
                <div class="flex items-center justify-between pb-2 border-b border-slate-900">
                    <span class="text-xs font-black uppercase text-amber-400 font-mono flex items-center gap-2">
                        <span>🪟</span> Modals, Toasts & Drawers
                    </span>
                    <span class="text-[10px] font-mono text-slate-500 font-bold">1-Click Live Triggers</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button type="button" onclick="openTitanModal();" class="px-3 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-slate-950 font-mono text-xs font-black rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.4)] transition">🪟 Open Modal</button>
                    <button type="button" onclick="showLiveToast('Patient Admitted', 'Dr. Shankar allocated ICU Bed #04 successfully.', 'success');" class="px-3 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-slate-950 font-mono text-xs font-black rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] transition">🔔 Fire Toast</button>
                    <button type="button" onclick="openTitanDrawer('titan-drawer');" class="px-3 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-mono text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.4)] transition">📑 Open Drawer</button>
                </div>
            </div>
        </section>

        <!-- ═══════════════════════════════════════════════════════════════════════════════
             🌟 SECTION 2: DEDICATED TWIN-STATE BINARY PAIRED ICONS STUDIO (WITH TOGGLES)
        ═══════════════════════════════════════════════════════════════════════════════ -->
        <section class="p-6 bg-gradient-to-r from-slate-900/95 via-cyan-950/30 to-slate-900/95 rounded-3xl border-2 border-cyan-500/50 flex flex-col gap-5 shadow-[0_0_40px_rgba(34,211,238,0.15)] backdrop-blur-2xl">
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                        <h2 class="text-sm sm:text-base font-black uppercase tracking-wider text-white font-mono flex items-center gap-2">
                            <span>🔄</span> Twin-State Binary Paired Icons (Click Any Toggle Below!)
                        </h2>
                        <p class="text-[11px] text-slate-300">1-Bit Hardware State: Eye/EyeOff, Lock/Unlock, Mic/MicOff, Play/Pause, WiFi, Sun/Moon auto-morph live!</p>
                    </div>
                </div>
                <span class="text-xs font-mono bg-cyan-950 text-cyan-400 px-3 py-1 rounded-full border border-cyan-700 font-bold shadow-inner">10 ACTIVE PAIRS</span>
            </div>

            <!-- Twin Pairs Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                ${twinPairsHtml}
            </div>

        </section>

        <!-- ═══════════════════════════════════════════════════════════════════════════════
             🌟 SECTION 3: FULL 512 PURE VECTOR ICONS MATRIX (SEARCHABLE)
        ═══════════════════════════════════════════════════════════════════════════════ -->
        <section class="p-6 bg-gradient-to-b from-slate-900/95 to-slate-950/95 rounded-3xl border border-slate-800 flex flex-col gap-5 shadow-2xl backdrop-blur-2xl">
            
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                    <h2 class="text-base sm:text-lg font-black uppercase tracking-wider text-white font-mono flex items-center gap-2">
                        <span>🎨</span> Full 512 Pure Vector Icons Spectrum (0 to 511)
                    </h2>
                    <p class="text-xs text-slate-400">100% Unique, Non-Repeating &bull; Sub-Pixel Bézier Curves &bull; Native Samsung ThorVG</p>
                </div>

                <div class="flex flex-wrap items-center gap-3">
                    <div class="relative">
                        <input id="icon-search-input" type="text" oninput="filterIcons()" placeholder="Search 512 icons..." 
                               class="py-2 pl-9 pr-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400 w-64 shadow-inner">
                        <svg class="w-4 h-4 text-slate-500 absolute left-3 top-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    <span id="icon-count-badge" class="text-xs font-mono bg-cyan-950 text-cyan-300 px-3 py-1.5 rounded-xl border border-cyan-700 font-bold">512 / 512 ICONS</span>
                </div>
            </div>

            <!-- Category Filter Tabs -->
            <div class="flex flex-wrap items-center gap-2">
                <button onclick="setCategory('all', this)" class="cat-btn px-4 py-1.5 rounded-xl font-mono text-xs font-black bg-cyan-600 text-slate-950 shadow-lg transition">🌟 All 512 Icons</button>
                <button onclick="setCategory('core', this)" class="cat-btn px-4 py-1.5 rounded-xl font-mono text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition">📞 Core Telephony (0-255)</button>
                <button onclick="setCategory('web', this)" class="cat-btn px-4 py-1.5 rounded-xl font-mono text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition">🌐 Extended Web (256-511)</button>
                <button onclick="setCategory('medical', this)" class="cat-btn px-4 py-1.5 rounded-xl font-mono text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition">🩺 Hospital & Medical</button>
                <button onclick="setCategory('fintech', this)" class="cat-btn px-4 py-1.5 rounded-xl font-mono text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition">💳 FinTech & E-Commerce</button>
            </div>

            <!-- 512 Grid -->
            <div id="icon-grid" class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-16 gap-2.5 max-h-[500px] overflow-y-auto custom-scrollbar p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                ${iconsGridHtml}
            </div>

        </section>

        <!-- SECTION 4: HOSPITAL PATIENT & ICU TABLE -->
        <section class="flex flex-col gap-3.5">
            <span class="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">🏥 Hospital Patient & Vitals Data Table (&lt;TitanTable variant="medical" /&gt;)</span>
            ${hospitalTableHtml}
        </section>

        <!-- ═══════════════════════════════════════════════════════════════════════════════
             🌟 SECTION 5: SILICON-GRADE MATHEMATICAL VECTOR CHARTS (<TitanChart />)
        ═══════════════════════════════════════════════════════════════════════════════ -->
        <section class="flex flex-col gap-5">
            <div class="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                    <h2 class="text-base sm:text-lg font-black uppercase tracking-wider text-white font-mono flex items-center gap-2">
                        <span>📈</span> Zero-Dependency Vector Charts Suite (&lt;TitanChart /&gt;)
                    </h2>
                    <p class="text-xs text-slate-400 font-mono">16-Bit Register Micro-Bus Mapped &bull; 100/100 Core Web Vitals &bull; 100% Pure SVG Bézier Math</p>
                </div>
                <span class="text-xs font-mono bg-cyan-950 text-cyan-300 px-3 py-1 rounded-full border border-cyan-700 font-bold">16-BIT TELEMETRY</span>
            </div>

            <!-- Charts Grid: 1 Big Area Wave Chart + 1 Bar Chart + 1 Donut Chart -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- 1. ICU 24-Hr Wave Area Chart (Spans 2 columns on lg) -->
                <div class="lg:col-span-2">
                    ${renderTitanChart({
                        variant: 'area',
                        title: 'ICU Patient Vitals & Heart Rate Telemetry',
                        subtitle: 'Continuous 24-Hour Real-Time Pulse & SpO2 Stream',
                        badge: 'LIVE 98 BPM',
                        data: [72, 75, 78, 85, 98, 88, 76, 80, 84, 92, 78, 82],
                        labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
                        color: 'cyan'
                    })}
                </div>

                <!-- 2. Capacity & Resource Donut Chart -->
                <div class="lg:col-span-1">
                    ${renderTitanChart({
                        variant: 'donut',
                        title: 'Hospital Bed Allocation',
                        subtitle: 'Live Ward Capacity Breakdown',
                        badge: '85% OCCUPIED',
                        centerValue: '85%',
                        centerLabel: 'OCCUPIED',
                        segments: [
                            { label: 'ICU Critical (Bed 1-4)', value: 60, color: '#22d3ee' },
                            { label: 'General Ward', value: 25, color: '#10b981' },
                            { label: 'Emergency Reserve', value: 15, color: '#f59e0b' }
                        ]
                    })}
                </div>
            </div>

            <!-- Weekly Call Traffic Bar Chart -->
            <div class="w-full">
                ${renderTitanChart({
                    variant: 'bar',
                    title: 'Weekly PBX Call Volume & Inbound Workload',
                    subtitle: 'Total Processed Calls (Monday through Sunday)',
                    badge: '14,820 CALLS',
                    data: [1850, 2420, 2680, 2910, 2750, 1420, 790],
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    color: 'emerald'
                })}
            </div>
        </section>

        <!-- ═══════════════════════════════════════════════════════════════════════════════
             🌟 SECTION 6: LIVE SVG VECTOR WHITEBOARD & SIGNATURE PAD (<TitanWhiteboard />)
        ═══════════════════════════════════════════════════════════════════════════════ -->
        <section class="flex flex-col gap-4">
            <div class="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                    <h2 class="text-base sm:text-lg font-black uppercase tracking-wider text-white font-mono flex items-center gap-2">
                        <span>✍️</span> Live SVG Vector Drawing & Signature Canvas (&lt;TitanWhiteboard /&gt;)
                    </h2>
                    <p class="text-xs text-slate-400 font-mono">120 FPS Sub-Pixel Quadratic Bézier Curve Smoothing &bull; Real-Time Neon Glow & Freehand Vector Export</p>
                </div>
                <span class="text-xs font-mono bg-cyan-950 text-cyan-300 px-3 py-1 rounded-full border border-cyan-700 font-bold">120 FPS VECTOR</span>
            </div>

            ${renderTitanWhiteboard({
                id: 'titan-live-whiteboard',
                title: 'Interactive Vector Drawing & Telemetry Signature Pad',
                subtitle: 'Draw with Mouse / Touch / Stylus &bull; 1-Click Standalone SVG Vector Download',
                width: 800,
                height: 360
            })}
        </section>

        <!-- Real-time I/O Stream Terminal -->
        <footer class="w-full p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col gap-1.5 shadow-2xl">
            <div class="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-900">
                <span class="text-emerald-400 font-bold flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    TITAN FULL HIGHWAY (MODAL, TOAST, DRAWER, 512 ICONS & NEPAL FLAG ONLINE)
                </span>
                <span>STATUS: 100% ONLINE</span>
            </div>
            <div id="io-terminal" class="text-cyan-300 min-h-[30px] flex items-center">
                Toggle any switch or click Drawer/Modal buttons above...
            </div>
        </footer>

    </main>

    <!-- Client-side Interactive Script -->
    <script>
        const twinMeta = ${JSON.stringify(clientTwinMeta)};

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

        // Initialize Whiteboard on load
        setTimeout(initWhiteboard, 100);
    </script>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (req.method === 'GET' && url.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(renderFullPage());
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`🚀 Danphe UI Full Suite Studio running at http://localhost:${PORT}`);
});
