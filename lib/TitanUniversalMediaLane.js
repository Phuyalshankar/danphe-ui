'use strict';

/**
 * 🎬 TitanUniversalMediaLane (danphe-ui)
 * Unified Polymorphic Pure SVG Media Lane / Track Component
 * ══════════════════════════════════════════════════════════════════════════
 * - Unified SVG Architecture: One component renders Video, Audio, Text, Image, or VFX
 * - Embedded Audio in Video: Video clips have an embedded mini-waveform at the bottom
 * - Audio Detach / Extract Feature: One-click extraction of audio to standalone track
 * - Serial Dynamic Morphing: Color, icons, handles & waveforms switch via SISO (0x5349)
 * - 100% Pure Vector SVG Geometry with zero bitmaps
 */

const LANE_THEMES = {
    video: {
        bg: '#082f49',
        border: '#0284c7',
        accent: '#38bdf8',
        handle: '#facc15',
        badgeBg: '#0369a1',
        badgeText: '#e0f2fe',
        icon: '🎬',
        title: 'VIDEO CLIP'
    },
    audio: {
        bg: '#064e3b',
        border: '#059669',
        accent: '#10b981',
        handle: '#34d399',
        badgeBg: '#047857',
        badgeText: '#d1fae5',
        icon: '🎵',
        title: 'AUDIO TRACK'
    },
    text: {
        bg: '#451a03',
        border: '#d97706',
        accent: '#f59e0b',
        handle: '#fbbf24',
        badgeBg: '#b45309',
        badgeText: '#fef3c7',
        icon: 'T',
        title: 'SUBTITLE / TEXT'
    },
    image: {
        bg: '#2e1065',
        border: '#7c3aed',
        accent: '#a855f7',
        handle: '#c084fc',
        badgeBg: '#6d28d9',
        badgeText: '#f3e8ff',
        icon: '🖼️',
        title: 'OVERLAY / PIP'
    },
    vfx: {
        bg: '#4c0519',
        border: '#e11d48',
        accent: '#fb7185',
        handle: '#fda4af',
        badgeBg: '#be123c',
        badgeText: '#ffe4e6',
        icon: '✨',
        title: 'AI VFX / FILTER'
    }
};

/**
 * Generate Pure SVG Waveform Path string
 */
function generateSvgWaveformPath(x, y, width, height, density = 36) {
    let d = `M ${x} ${y + height / 2}`;
    const step = width / density;
    const midY = y + height / 2;
    const maxAmp = height * 0.42;

    for (let i = 0; i <= density; i++) {
        const cx = x + i * step;
        // Pseudo-harmonic amplitude pattern
        const harmonic = Math.sin(i * 0.65) * 0.5 + Math.cos(i * 1.3) * 0.35 + Math.sin(i * 2.8) * 0.15;
        const amp = Math.max(2, Math.abs(harmonic) * maxAmp);
        const cy = (i % 2 === 0) ? (midY - amp) : (midY + amp);
        d += ` L ${cx.toFixed(1)} ${cy.toFixed(1)}`;
    }
    return d;
}

/**
 * Render Universal Polymorphic Media Lane
 */
function renderUniversalMediaLane(options = {}) {
    const {
        id = 'titan-media-lane',
        type = 'video',                 // 'video' | 'audio' | 'text' | 'image' | 'vfx'
        x = 15,
        y = 0,
        width = 240,
        height = 42,
        clipTitle = 'Clip_01.mp4',
        durationSec = 12.5,
        hasEmbeddedAudio = true,        // When true in video, embeds lower waveform
        isAudioDetached = false,        // If detached, audio is separated
        isSelected = true,
        isMuted = false,
        isLocked = false,
        reg = 1001,
        className = ''
    } = options;

    const theme = LANE_THEMES[type] || LANE_THEMES.video;
    const rx = 8;
    const innerW = Math.max(40, width);
    const innerH = Math.max(28, height);

    // Dynamic Slices / Elements
    const strokeColor = isSelected ? theme.handle : theme.border;
    const strokeWidth = isSelected ? 2 : 1.2;

    return `
    <g id="${id}" data-lane-type="${type}" data-reg="${reg}" class="titan-universal-lane cursor-pointer select-none transition-all ${className}" transform="translate(${x}, ${y})">
        
        <defs>
            <linearGradient id="${id}-bg-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${theme.bg}" stop-opacity="0.95"/>
                <stop offset="100%" stop-color="#020617" stop-opacity="0.98"/>
            </linearGradient>

            <pattern id="${id}-filmstrip-pattern" width="28" height="24" patternUnits="userSpaceOnUse">
                <rect width="26" height="22" rx="2" fill="#031525" stroke="#0c4a6e" stroke-width="0.8"/>
                <circle cx="5" cy="5" r="1.5" fill="#38bdf8" opacity="0.6"/>
                <line x1="10" y1="8" x2="22" y2="8" stroke="#38bdf8" stroke-width="0.8" opacity="0.4"/>
                <line x1="10" y1="12" x2="18" y2="12" stroke="#38bdf8" stroke-width="0.8" opacity="0.3"/>
            </pattern>
        </defs>

        <!-- ── 1. MAIN LANE CONTAINER ── -->
        <rect id="${id}-body" x="0" y="0" width="${innerW}" height="${innerH}" rx="${rx}" 
              fill="url(#${id}-bg-grad)" stroke="${strokeColor}" stroke-width="${strokeWidth}" 
              class="transition-colors duration-200" />

        <!-- ── 2. CAPCUT-STYLE YELLOW / ACCENT TRIM HANDLES ── -->
        <g id="${id}-handles" class="transition-opacity duration-200">
            <!-- Left Trim Handle -->
            <rect x="0" y="0" width="8" height="${innerH}" rx="3" fill="${theme.handle}"/>
            <line x1="4" y1="8" x2="4" y2="${innerH - 8}" stroke="#000000" stroke-width="1.2" stroke-linecap="round"/>

            <!-- Right Trim Handle -->
            <rect x="${innerW - 8}" y="0" width="8" height="${innerH}" rx="3" fill="${theme.handle}"/>
            <line x1="${innerW - 4}" y1="8" x2="${innerW - 4}" y2="${innerH - 8}" stroke="#000000" stroke-width="1.2" stroke-linecap="round"/>
        </g>

        <!-- ── 3. POLYMORPHIC CONTENT RENDERING BASED ON TYPE ── -->
        ${type === 'video' ? `
            <!-- 🎬 VIDEO LANE WITH OPTIONAL EMBEDDED AUDIO -->
            <g id="${id}-video-content">
                <!-- Filmstrip Thumbnails Preview Strip -->
                <rect x="12" y="3" width="${innerW - 24}" height="${hasEmbeddedAudio ? 18 : innerH - 6}" rx="3" fill="url(#${id}-filmstrip-pattern)"/>

                <!-- Clip Title & Type Badge -->
                <g transform="translate(14, 4)">
                    <rect x="0" y="0" width="14" height="12" rx="2" fill="${theme.badgeBg}"/>
                    <text x="7" y="9" font-family="sans-serif" font-size="8" fill="#ffffff" text-anchor="middle" font-weight="900">🎬</text>
                    <text x="18" y="10" font-family="monospace" font-size="8" font-weight="bold" fill="#f0f9ff">${clipTitle}</text>
                </g>

                ${hasEmbeddedAudio && !isAudioDetached ? `
                <!-- 🎵 EMBEDDED AUDIO WAVEFORM (LOWER PORTION) -->
                <g id="${id}-embedded-audio" class="transition-all" transform="translate(12, ${innerH - 18})">
                    <!-- Subtle Waveform Background Separator Seam -->
                    <line x1="0" y1="0" x2="${innerW - 24}" y2="0" stroke="#0369a1" stroke-width="0.8" stroke-dasharray="2,2"/>
                    <rect x="0" y="1" width="${innerW - 24}" height="14" rx="2" fill="#064e3b" fill-opacity="0.4"/>
                    
                    <!-- Emerald Waveform Path -->
                    <path d="${generateSvgWaveformPath(4, 2, innerW - 32, 12, Math.floor((innerW - 32) / 8))}" 
                          fill="none" stroke="#10b981" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>

                    <!-- Embedded Audio Indicator & Detach Shortcut -->
                    <g onclick="event.stopPropagation(); triggerSisoTool(1014, 'DetachAudio')" class="cursor-pointer group" transform="translate(${innerW - 55}, 1)">
                        <rect x="0" y="0" width="28" height="12" rx="2" fill="#047857" stroke="#34d399" stroke-width="0.6"/>
                        <text x="14" y="9" font-family="monospace" font-size="6.5" font-weight="900" fill="#d1fae5" text-anchor="middle">📻 EXTRACT</text>
                    </g>
                </g>
                ` : (isAudioDetached ? `
                <!-- Audio Detached Indicator Badge -->
                <g transform="translate(${innerW - 55}, 4)">
                    <rect x="0" y="0" width="28" height="10" rx="2" fill="#334155" opacity="0.8"/>
                    <text x="14" y="8" font-family="monospace" font-size="6" font-weight="bold" fill="#94a3b8" text-anchor="middle">MUTED AV</text>
                </g>
                ` : '')}
            </g>
        ` : (type === 'audio' ? `
            <!-- 🎵 STANDALONE DEDICATED AUDIO TRACK -->
            <g id="${id}-audio-content">
                <!-- Dynamic High-Precision Waveform -->
                <path d="${generateSvgWaveformPath(14, 2, innerW - 28, innerH - 4, Math.floor((innerW - 28) / 7))}" 
                      fill="none" stroke="#34d399" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                
                <!-- Beat Sync Diamond Pins -->
                <g transform="translate(50, 4)">
                    <polygon points="0,0 3,3 0,6 -3,3" fill="#facc15"/>
                </g>
                <g transform="translate(${Math.floor(innerW * 0.45)}, 4)">
                    <polygon points="0,0 3,3 0,6 -3,3" fill="#facc15"/>
                </g>
                <g transform="translate(${Math.floor(innerW * 0.75)}, 4)">
                    <polygon points="0,0 3,3 0,6 -3,3" fill="#facc15"/>
                </g>

                <!-- Audio Track Label -->
                <g transform="translate(14, ${innerH - 8})">
                    <text x="0" y="0" font-family="monospace" font-size="7.5" font-weight="900" fill="#a7f3d0">🎵 ${clipTitle}</text>
                </g>
            </g>
        ` : (type === 'text' ? `
            <!-- 📝 KINETIC TEXT & CAPTION LANE -->
            <g id="${id}-text-content" transform="translate(12, 6)">
                <rect x="0" y="0" width="16" height="16" rx="3" fill="#b45309"/>
                <text x="8" y="12" font-family="sans-serif" font-size="10" font-weight="900" fill="#fef3c7" text-anchor="middle">T</text>
                <text x="22" y="12" font-family="sans-serif" font-size="9" font-weight="900" fill="#fef3c7">${clipTitle}</text>
                <!-- Text In/Out Fade Bars -->
                <line x1="22" y1="18" x2="${innerW - 36}" y2="18" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3,3"/>
            </g>
        ` : `
            <!-- 🖼️ IMAGE / OVERLAY / VFX LANE -->
            <g id="${id}-generic-content" transform="translate(14, 6)">
                <rect x="0" y="0" width="16" height="16" rx="3" fill="${theme.badgeBg}"/>
                <text x="8" y="12" font-family="sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">${theme.icon}</text>
                <text x="22" y="12" font-family="sans-serif" font-size="9" font-weight="bold" fill="${theme.badgeText}">${clipTitle}</text>
            </g>
        `))}

        <!-- ── 4. DURATION PILL (BOTTOM RIGHT) ── -->
        <g transform="translate(${innerW - 34}, ${innerH - 10})">
            <rect x="0" y="0" width="22" height="7" rx="1.5" fill="#000000" fill-opacity="0.6"/>
            <text x="11" y="5.5" font-family="monospace" font-size="5.5" font-weight="bold" fill="#cbd5e1" text-anchor="middle">${durationSec}s</text>
        </g>

    </g>
    `;
}

module.exports = {
    renderUniversalMediaLane,
    TitanUniversalMediaLane: renderUniversalMediaLane,
    LANE_THEMES,
    generateSvgWaveformPath
};
