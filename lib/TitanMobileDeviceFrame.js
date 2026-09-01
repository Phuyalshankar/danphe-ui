'use strict';

/**
 * 📱 TitanMobileDeviceFrame (danphe-ui / lib)
 * Ultra-High-Precision Detachable Titanium Smartphone Hardware Mockup & Video Compositor Layer
 * 
 * Features:
 * 1. Detachable & Floating Picture-in-Picture (PiP) Window support
 * 2. Standalone Video Mockup Mode (renders 9:16 video/recording inside realistic 3D titanium chassis)
 * 3. Dynamic Island & Camera HUD Punch Hole
 * 4. Micro-grooved Volume / Power buttons & Optical Glass Glare
 * 5. Full 256 Kinetic Motion & 3D Spatial Transforms
 */

function renderTitanMobileDeviceFrame(options = {}) {
    const {
        id = 'titan-mobile-frame-' + Math.floor(Math.random() * 10000),
        mode = 'video_mockup', // 'video_mockup' | 'editor_inspector' | 'floating_pip'
        width = 340,
        height = 540,
        className = '',
        screenContent = '',
        title = 'DANPHE SMARTPHONE',
        batteryPct = 98,
        timecode = '09:41',
        isDetached = false,
        deviceColor = 'titanium', // 'titanium' | 'midnight' | 'gold' | 'sapphire'
        scale = 1.0,
        rotateX = 0,
        rotateY = 0,
        rotateZ = 0,
        showReflection = true,
        showDynamicIsland = true
    } = options;

    const rimColorGrad = deviceColor === 'sapphire' ? 
        '<stop offset="0%" stop-color="#0284c7" /><stop offset="50%" stop-color="#0f172a" /><stop offset="100%" stop-color="#083344" />' :
        deviceColor === 'gold' ?
        '<stop offset="0%" stop-color="#ca8a04" /><stop offset="50%" stop-color="#1c1917" /><stop offset="100%" stop-color="#78350f" />' :
        '<stop offset="0%" stop-color="#475569" /><stop offset="25%" stop-color="#1e293b" /><stop offset="50%" stop-color="#0f172a" /><stop offset="75%" stop-color="#1e293b" /><stop offset="100%" stop-color="#334155" />';

    return `
    <div id="${id}" class="titan-mobile-device-wrapper select-none transition-all duration-300 ${className}" 
         style="perspective: 1200px; transform: scale(${scale});">
        
        <!-- Detachable Floating Control Header (When in floating or editor mode) -->
        ${isDetached ? `
        <div class="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-t-2xl backdrop-blur-md text-[10px] font-mono text-cyan-300 shadow-lg">
            <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span class="font-bold">📱 DETACHED MOCKUP</span>
            </div>
            <div class="flex items-center gap-2">
                <button type="button" onclick="window.reAttachMobileFrame('${id}')" class="hover:text-white transition" title="Re-attach to Dock">📌 Dock</button>
                <button type="button" onclick="window.toggleMobilePip('${id}')" class="hover:text-rose-400 transition" title="Close">✕</button>
            </div>
        </div>` : ''}

        <!-- 3D Transform Device Chassis Container -->
        <div class="titan-mobile-chassis-3d relative" style="transform: rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg); transform-style: preserve-3d;">
            
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 540" width="${width}" height="${height}" class="drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] overflow-visible">
                <defs>
                    <!-- Chassis Titanium Rim Gradient -->
                    <linearGradient id="${id}-titanium-rim" x1="0" y1="0" x2="1" y2="1">
                        ${rimColorGrad}
                    </linearGradient>

                    <!-- Bezel Matte Gradient -->
                    <linearGradient id="${id}-inner-bezel" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#020617" />
                        <stop offset="100%" stop-color="#000000" />
                    </linearGradient>

                    <!-- Curved Glass Optical Glare -->
                    <linearGradient id="${id}-glass-glare" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="rgba(255, 255, 255, 0.18)" />
                        <stop offset="30%" stop-color="rgba(255, 255, 255, 0.05)" />
                        <stop offset="60%" stop-color="rgba(255, 255, 255, 0.0)" />
                        <stop offset="100%" stop-color="rgba(255, 255, 255, 0.04)" />
                    </linearGradient>
                </defs>

                <!-- Hardware Buttons (Side Accents) -->
                <!-- Left Volume Keys -->
                <rect x="0" y="90" width="3.5" height="26" rx="1.75" fill="#475569" />
                <rect x="0" y="126" width="3.5" height="26" rx="1.75" fill="#475569" />
                
                <!-- Right Action Key -->
                <rect x="336.5" y="105" width="3.5" height="38" rx="1.75" fill="#475569" />

                <!-- Outer Titanium Body -->
                <rect x="3" y="3" width="334" height="534" rx="38" fill="url(#${id}-titanium-rim)" stroke="#0f172a" stroke-width="1.8" />
                
                <!-- Inner OLED Display Frame -->
                <rect x="7.5" y="7.5" width="325" height="525" rx="33" fill="url(#${id}-inner-bezel)" stroke="#000000" stroke-width="2" />
                <rect x="9.5" y="9.5" width="321" height="521" rx="31" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.8" />

                <!-- Dynamic Island / Speaker Notch Bar -->
                ${showDynamicIsland ? `
                <g transform="translate(125, 13)">
                    <rect width="90" height="15" rx="7.5" fill="#000000" stroke="#1e293b" stroke-width="0.8" />
                    <!-- Camera Lens -->
                    <circle cx="22" cy="7.5" r="3.2" fill="#050811" />
                    <circle cx="22" cy="7.5" r="1.8" fill="#0c4a6e" />
                    <circle cx="22.5" cy="7" r="0.6" fill="#ffffff" opacity="0.8" />
                    <!-- FaceID Sensor -->
                    <circle cx="68" cy="7.5" r="2.2" fill="#1e1b4b" opacity="0.6" />
                </g>
                ` : ''}

                <!-- Status Bar (Time, Wifi, Battery) -->
                <g class="font-mono" font-size="7.5" font-weight="900" fill="#94a3b8">
                    <text x="24" y="24">${timecode}</text>
                    <text x="316" y="24" text-anchor="end">${batteryPct}% 🔋</text>
                </g>

                <!-- Embedded Screen Media Content (Video / Canvas / HTML Layer) -->
                <foreignObject x="10" y="32" width="320" height="492" style="overflow: hidden; border-radius: 0 0 28px 28px;">
                    <div xmlns="http://www.w3.org/1999/xhtml" class="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
                        ${screenContent ? screenContent : `
                        <div class="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-slate-950 via-slate-900 to-black">
                            <div class="w-16 h-16 rounded-3xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 mb-3 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            </div>
                            <span class="text-xs font-black font-mono text-white tracking-wider uppercase mb-1">${title}</span>
                            <span class="text-[9px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">9:16 ULTRA HD MOCKUP</span>
                        </div>
                        `}
                    </div>
                </foreignObject>

                <!-- Optical Glass Reflection Overlay -->
                ${showReflection ? `
                <path d="M3.5,3.5 L336.5,3.5 L336.5,140 L3.5,50 Z" fill="url(#${id}-glass-glare)" pointer-events="none" />
                ` : ''}

                <!-- Home Indicator Bar -->
                <rect x="120" y="528" width="100" height="3.5" rx="1.75" fill="rgba(255,255,255,0.4)" />
            </svg>
        </div>
    </div>
    `;
}

module.exports = {
    renderTitanMobileDeviceFrame,
    TitanMobileDeviceFrame: renderTitanMobileDeviceFrame
};
