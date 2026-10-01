'use strict';

const { ANIMATIONS_256, TITAN_ANIM } = require('./ANIMATIONS_256');

/**
 * ⚡ Master Pixel-Perfect CSS Keyframes Generator
 * Generates hardware-accelerated 120fps GPU transform stylesheet for ALL 256 opcodes
 */
function generateAnimationCSS() {
    return `
/* ═══════════════════════════════════════════════════════════════════════════
   🐬 DANPHE-UI 256 1-BYTE HARDWARE ANIMATION SPECTRUM (120 FPS GPU)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── DOMAIN 0: BIOMETRICS & SIGNALS (0x00 - 0x1F / 0 - 31) ── */
@keyframes titan-heartbeat {
    0% { transform: scale(1); }
    14% { transform: scale(1.38); filter: drop-shadow(0 0 16px #f43f5e); }
    28% { transform: scale(1); }
    42% { transform: scale(1.22); filter: drop-shadow(0 0 10px #f43f5e); }
    70% { transform: scale(1); }
    100% { transform: scale(1); }
}

@keyframes titan-radar {
    0% { transform: scale(0.75); opacity: 0.7; filter: drop-shadow(0 0 4px #22d3ee); }
    50% { transform: scale(1.35); opacity: 1; filter: drop-shadow(0 0 30px #22d3ee); }
    100% { transform: scale(0.75); opacity: 0.7; filter: drop-shadow(0 0 4px #22d3ee); }
}

@keyframes titan-laser {
    0% { transform: translateY(-14px); filter: drop-shadow(0 -8px 16px #22d3ee); }
    50% { transform: translateY(14px); filter: drop-shadow(0 8px 20px #06b6d4); }
    100% { transform: translateY(-14px); filter: drop-shadow(0 -8px 16px #22d3ee); }
}

@keyframes titan-breathe {
    0%, 100% { opacity: 0.5; transform: scale(0.85); filter: drop-shadow(0 0 2px rgba(34,211,238,0.2)); }
    50% { opacity: 1; transform: scale(1.25); filter: drop-shadow(0 0 30px rgba(34,211,238,1)); }
}

@keyframes titan-ripple {
    0% { transform: scale(0.75); opacity: 1; }
    50% { transform: scale(1.45); opacity: 0.4; }
    100% { transform: scale(0.75); opacity: 1; }
}

@keyframes titan-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes titan-spring {
    0% { transform: scale(1); }
    30% { transform: scale(1.5) translateY(-14px); }
    60% { transform: scale(0.7) translateY(6px); }
    80% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

@keyframes titan-glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-8px, 6px); filter: drop-shadow(6px 0 #ef4444); }
    40% { transform: translate(-6px, -8px); filter: drop-shadow(-6px 0 #06b6d4); }
    60% { transform: translate(8px, 4px); filter: drop-shadow(5px 0 #10b981); }
    80% { transform: translate(4px, -6px); filter: drop-shadow(-5px 0 #a855f7); }
    100% { transform: translate(0); filter: none; }
}

@keyframes titan-shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-12px) rotate(-8deg); }
    40% { transform: translateX(12px) rotate(8deg); }
    60% { transform: translateX(-10px) rotate(-6deg); }
    70% { transform: translateX(10px) rotate(6deg); }
}

@keyframes titan-matrix {
    0% { transform: translateY(-12px); opacity: 0.3; }
    50% { transform: translateY(0); opacity: 1; filter: drop-shadow(0 0 16px #10b981); }
    100% { transform: translateY(12px); opacity: 0.3; }
}

@keyframes titan-shimmer {
    0% { color: #06b6d4; stroke: #06b6d4; transform: scale(1); filter: drop-shadow(0 0 10px #06b6d4); }
    33% { color: #a855f7; stroke: #a855f7; transform: scale(1.15); filter: drop-shadow(0 0 30px #a855f7); }
    66% { color: #f43f5e; stroke: #f43f5e; transform: scale(1.05); filter: drop-shadow(0 0 25px #f43f5e); }
    100% { color: #06b6d4; stroke: #06b6d4; transform: scale(1); filter: drop-shadow(0 0 10px #06b6d4); }
}

@keyframes titan-spark {
    0%, 100% { opacity: 0.9; color: #f59e0b; stroke: #f59e0b; transform: scale(1); filter: drop-shadow(0 0 10px #f59e0b); }
    25% { opacity: 1; color: #ffffff; stroke: #ffffff; transform: scale(1.4) rotate(15deg); filter: drop-shadow(0 0 30px #f59e0b); }
    50% { opacity: 0.3; color: #ef4444; stroke: #ef4444; transform: scale(0.7); }
    75% { opacity: 1; color: #fbbf24; stroke: #fbbf24; transform: scale(1.3) rotate(-15deg); filter: drop-shadow(0 0 35px #ef4444); }
}

@keyframes titan-float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-18px) rotate(6deg); }
}

@keyframes titan-pop {
    0% { transform: scale(0.65); }
    70% { transform: scale(1.45); }
    100% { transform: scale(1); }
}

@keyframes titan-ping {
    0% { transform: scale(0.8); opacity: 1; }
    75%, 100% { transform: scale(1.8); opacity: 0; }
}

@keyframes titan-ring {
    0%, 100% { transform: rotate(0deg); }
    20% { transform: rotate(25deg); }
    40% { transform: rotate(-25deg); }
    60% { transform: rotate(18deg); }
    80% { transform: rotate(-18deg); }
}

@keyframes titan-wave {
    0%, 100% { transform: scaleY(0.7); }
    50% { transform: scaleY(1.8); }
}

@keyframes titan-vortex {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(0.65); }
    100% { transform: rotate(360deg) scale(1); }
}

@keyframes titan-pendulum {
    0%, 100% { transform: rotate(30deg); transform-origin: top center; }
    50% { transform: rotate(-30deg); transform-origin: top center; }
}

@keyframes titan-torch {
    0%, 100% { transform: scale(1) rotate(-2deg); filter: drop-shadow(0 0 8px #ea580c); }
    50% { transform: scale(1.15) rotate(2deg); filter: drop-shadow(0 0 25px #f59e0b); }
}

@keyframes titan-jitter {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(-4px, 3px); }
    50% { transform: translate(4px, -3px); }
    75% { transform: translate(-3px, -4px); }
}

@keyframes titan-warp {
    0%, 100% { transform: scale(1, 1); }
    50% { transform: scale(1.6, 0.6) skewX(10deg); filter: drop-shadow(0 0 20px #38bdf8); }
}

@keyframes titan-strobe {
    0%, 50%, 100% { opacity: 1; filter: brightness(2) drop-shadow(0 0 30px #ffffff); }
    25%, 75% { opacity: 0.1; filter: none; }
}

@keyframes titan-spiral {
    0% { transform: rotate(0deg) scale(0.8); }
    50% { transform: rotate(180deg) scale(1.2); }
    100% { transform: rotate(360deg) scale(0.8); }
}

@keyframes titan-magnet {
    0%, 100% { transform: scale(1); }
    40% { transform: scale(0.7) translateY(-10px); }
    60% { transform: scale(1.4) translateY(0); filter: drop-shadow(0 0 25px #a855f7); }
}

@keyframes titan-ecg {
    0%, 100% { transform: scaleY(1); }
    20% { transform: scaleY(0.6); }
    40% { transform: scaleY(2.2) translateY(-8px); filter: drop-shadow(0 0 20px #ef4444); }
    60% { transform: scaleY(0.4) translateY(4px); }
    80% { transform: scaleY(1.3); }
}

@keyframes titan-arrhythmia {
    0%, 100% { transform: scale(1); }
    15% { transform: scale(1.4); }
    30% { transform: scale(0.9); }
    55% { transform: scale(1.6); filter: drop-shadow(0 0 25px #f43f5e); }
    70% { transform: scale(0.8); }
}

@keyframes titan-bloom {
    0%, 100% { filter: brightness(1) drop-shadow(0 0 4px #22d3ee); }
    50% { filter: brightness(3) drop-shadow(0 0 40px #ffffff); transform: scale(1.2); }
}

@keyframes titan-thump {
    0%, 100% { transform: scale(1); }
    20% { transform: scale(1.5); filter: drop-shadow(0 0 30px #38bdf8); }
    40% { transform: scale(0.95); }
    60% { transform: scale(1.3); }
}

@keyframes titan-plasma {
    0%, 100% { transform: rotate(0deg) scale(1); filter: drop-shadow(0 0 10px #f59e0b); }
    50% { transform: rotate(180deg) scale(1.3); filter: drop-shadow(0 0 40px #ef4444); }
}

@keyframes titan-siphon {
    0% { transform: rotate(0deg) scale(1.2); opacity: 1; }
    50% { transform: rotate(180deg) scale(0.4); opacity: 0.3; }
    100% { transform: rotate(360deg) scale(1.2); opacity: 1; }
}

/* ── DOMAIN 1: UI MICRO-INTERACTIONS (0x20 - 0x3F / 32 - 63) ── */
@keyframes titan-btn-jiggle {
    0%, 100% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(-8deg) scale(1.1); }
    75% { transform: rotate(8deg) scale(1.1); }
}

@keyframes titan-badge-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px) scale(1.2); filter: drop-shadow(0 0 15px #f43f5e); }
}

@keyframes titan-bell-swing {
    0%, 100% { transform: rotate(0deg); transform-origin: top center; }
    25% { transform: rotate(30deg); transform-origin: top center; }
    75% { transform: rotate(-30deg); transform-origin: top center; }
}

@keyframes titan-thumbs-pop {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.5) rotate(-15deg); filter: drop-shadow(0 0 20px #38bdf8); }
}

@keyframes titan-star-burst {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.6) rotate(72deg); filter: drop-shadow(0 0 30px #eab308); }
}

@keyframes titan-lock-error {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-10px); }
    40%, 80% { transform: translateX(10px); }
}

@keyframes titan-check-stamp {
    0% { transform: scale(0); opacity: 0; }
    70% { transform: scale(1.4); opacity: 1; filter: drop-shadow(0 0 25px #10b981); }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes titan-dl-drop {
    0% { transform: translateY(-20px); opacity: 0; }
    50% { transform: translateY(10px); opacity: 1; }
    100% { transform: translateY(0); opacity: 1; }
}

@keyframes titan-ul-jet {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px) scale(1.1); filter: drop-shadow(0 0 20px #06b6d4); }
}

@keyframes titan-cart-wobble {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(15deg) scale(1.1); }
    75% { transform: rotate(-15deg) scale(1.1); }
}

@keyframes titan-switch-snap {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3) rotate(10deg); }
}

@keyframes titan-vu-meter {
    0%, 100% { transform: scaleY(0.4); }
    50% { transform: scaleY(1.8); filter: drop-shadow(0 0 15px #10b981); }
}

@keyframes titan-bat-charge {
    0%, 100% { filter: drop-shadow(0 0 4px #10b981); opacity: 0.7; }
    50% { filter: drop-shadow(0 0 25px #34d399); opacity: 1; transform: scale(1.15); }
}

@keyframes titan-sig-ladder {
    0%, 100% { transform: scale(0.9); opacity: 0.6; }
    50% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 20px #22d3ee); }
}

@keyframes titan-trash-drop {
    0%, 100% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(20deg) scale(0.8) translateY(8px); }
}

@keyframes titan-bookmark {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(8px) scaleY(1.2); }
}

@keyframes titan-flip-y {
    0% { transform: perspective(600px) rotateY(0deg); }
    100% { transform: perspective(600px) rotateY(360deg); }
}

@keyframes titan-tilt-x {
    0%, 100% { transform: perspective(600px) rotateX(0deg); }
    50% { transform: perspective(600px) rotateX(40deg); }
}

@keyframes titan-accordion {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(0.3); }
}

@keyframes titan-modal-zoom {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3); filter: drop-shadow(0 0 30px #22d3ee); }
}

@keyframes titan-drawer-slide {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(-15px); }
}

@keyframes titan-toast-drop {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-14px) scale(1.1); }
}

@keyframes titan-tooltip-pop {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.35) translateY(-6px); }
}

@keyframes titan-border-cyan {
    0%, 100% { filter: drop-shadow(0 0 6px #22d3ee); }
    50% { filter: drop-shadow(0 0 30px #06b6d4) hue-rotate(90deg); }
}

@keyframes titan-rainbow-bar {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
}

@keyframes titan-skeleton {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.9; filter: drop-shadow(0 0 15px #38bdf8); }
}

@keyframes titan-cascade {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(12px) scale(1.1); }
}

@keyframes titan-ink-ripple {
    0% { transform: scale(0.6); opacity: 1; }
    100% { transform: scale(1.8); opacity: 0; }
}

@keyframes titan-fab-halo {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px #06b6d4); }
    50% { transform: scale(1.25); filter: drop-shadow(0 0 35px #22d3ee); }
}

@keyframes titan-glass-frost {
    0%, 100% { backdrop-filter: blur(4px); filter: drop-shadow(0 0 4px #38bdf8); }
    50% { backdrop-filter: blur(16px); filter: drop-shadow(0 0 25px #ffffff); transform: scale(1.1); }
}

@keyframes titan-focus-ring {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px #22d3ee); }
    50% { transform: scale(1.2); filter: drop-shadow(0 0 25px #22d3ee); }
}

@keyframes titan-rubber-squash {
    0%, 100% { transform: scale(1, 1); }
    30% { transform: scale(1.4, 0.6); }
    60% { transform: scale(0.7, 1.3); }
    80% { transform: scale(1.1, 0.9); }
}

/* ── DOMAIN 2: ✍️ TYPOGRAPHY, KINETIC TEXT & TYPEWRITER SUITE (0x40 - 0x5F / 64 - 95) ── */
@keyframes titan-type-marquee {
    0% { transform: translateX(110%); }
    100% { transform: translateX(-110%); }
}

@keyframes titan-caret-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}

@keyframes titan-type-neon-glow {
    0%, 100% { text-shadow: 0 0 5px #38bdf8, 0 0 15px #0284c7, 0 0 35px #0369a1; color: #f0f9ff; opacity: 1; }
    12% { text-shadow: none; color: #334155; opacity: 0.3; }
    22% { text-shadow: 0 0 8px #38bdf8, 0 0 25px #0284c7; color: #ffffff; opacity: 1; }
    28% { text-shadow: none; color: #1e293b; opacity: 0.2; }
    34%, 90% { text-shadow: 0 0 12px #38bdf8, 0 0 30px #0284c7, 0 0 70px #0284c7; color: #ffffff; opacity: 1; }
}

@keyframes titan-type-wave {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-16px) rotate(6deg); }
    75% { transform: translateY(16px) rotate(-6deg); }
}

@keyframes titan-type-gold-sheen {
    0% { background-position: -250% 0; }
    100% { background-position: 250% 0; }
}

@keyframes titan-type-bounce {
    0% { transform: translateY(-50px) scale(0.4); opacity: 0; }
    50% { transform: translateY(14px) scale(1.3); opacity: 1; }
    75% { transform: translateY(-6px) scale(0.9); }
    100% { transform: translateY(0) scale(1); opacity: 1; }
}

@keyframes titan-type-3d-flip {
    0% { transform: perspective(800px) rotateX(90deg) translateY(-20px); opacity: 0; filter: blur(6px); }
    50% { transform: perspective(800px) rotateX(-25deg) translateY(0); opacity: 1; filter: blur(0); }
    75% { transform: perspective(800px) rotateX(10deg); }
    100% { transform: perspective(800px) rotateX(0deg); opacity: 1; }
}

@keyframes titan-type-cinematic-tracking {
    0% { letter-spacing: -10px; opacity: 0; filter: blur(14px); transform: scale(0.7); }
    60% { letter-spacing: 14px; opacity: 1; filter: blur(0); transform: scale(1.08); }
    100% { letter-spacing: 4px; opacity: 1; filter: none; transform: scale(1); }
}

@keyframes titan-type-fire-burn {
    0%, 100% { text-shadow: 0 0 4px #ea580c, 0 -4px 10px #f97316, 0 -12px 22px #ef4444; color: #fef08a; transform: translateY(0); }
    50% { text-shadow: 0 0 10px #f59e0b, 0 -8px 25px #ea580c, 0 -22px 45px #dc2626; color: #ffffff; transform: translateY(-4px) scale(1.06); }
}

@keyframes titan-type-rainbow {
    0% { color: #ff0055 !important; stroke: #ff0055 !important; text-shadow: 0 0 20px #ff0055; filter: drop-shadow(0 0 20px #ff0055); }
    20% { color: #ff7700 !important; stroke: #ff7700 !important; text-shadow: 0 0 20px #ff7700; filter: drop-shadow(0 0 20px #ff7700); }
    40% { color: #ffff00 !important; stroke: #ffff00 !important; text-shadow: 0 0 20px #ffff00; filter: drop-shadow(0 0 20px #ffff00); }
    60% { color: #00ff66 !important; stroke: #00ff66 !important; text-shadow: 0 0 20px #00ff66; filter: drop-shadow(0 0 20px #00ff66); }
    80% { color: #00ccff !important; stroke: #00ccff !important; text-shadow: 0 0 20px #00ccff; filter: drop-shadow(0 0 20px #00ccff); }
    100% { color: #ff0055 !important; stroke: #ff0055 !important; text-shadow: 0 0 20px #ff0055; filter: drop-shadow(0 0 20px #ff0055); }
}

@keyframes titan-type-stamp-slam {
    0% { transform: scale(4.5) rotate(-20deg); opacity: 0; filter: blur(16px); }
    55% { transform: scale(0.85) rotate(3deg); opacity: 1; filter: blur(0); }
    75% { transform: scale(1.12) rotate(-2deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

@keyframes titan-type-fade-up {
    0% { transform: translateY(35px); opacity: 0; filter: blur(8px); }
    100% { transform: translateY(0); opacity: 1; filter: blur(0); }
}

@keyframes titan-type-decrypt {
    0% { filter: blur(6px) drop-shadow(0 0 16px #10b981); opacity: 0.3; transform: scale(0.8); }
    50% { filter: drop-shadow(0 0 30px #34d399); opacity: 1; transform: scale(1.1); }
    100% { filter: none; opacity: 1; transform: scale(1); }
}

@keyframes titan-type-extrude {
    0%, 100% { text-shadow: 1px 1px 0px #0284c7, 2px 2px 0px #0369a1, 3px 3px 0px #075985; transform: translateY(0); }
    50% { text-shadow: 3px 3px 0px #0284c7, 6px 6px 0px #0369a1, 9px 9px 0px #075985, 12px 12px 10px rgba(0,0,0,0.8); transform: translateY(-8px) scale(1.08); }
}

@keyframes titan-type-slot-spin {
    0% { transform: translateY(-250%) scaleY(2.5); opacity: 0; filter: blur(10px); }
    65% { transform: translateY(20%) scaleY(0.85); opacity: 1; filter: blur(0); }
    85% { transform: translateY(-6%) scaleY(1.05); }
    100% { transform: translateY(0) scaleY(1); opacity: 1; filter: none; }
}

@keyframes titan-type-zap {
    0%, 100% { text-shadow: 0 0 6px #38bdf8; opacity: 0.9; }
    15% { text-shadow: 0 0 40px #38bdf8, 0 0 80px #ffffff; transform: scale(1.18) rotate(5deg); opacity: 1; }
    30% { text-shadow: 0 0 8px #38bdf8; opacity: 0.8; }
    45% { text-shadow: 0 0 45px #fde047, 0 0 90px #ffffff; transform: scale(1.22) rotate(-5deg); opacity: 1; }
}

@keyframes titan-type-karaoke-fill {
    0% { background-position: 100% 0; }
    100% { background-position: 0% 0; }
}

@keyframes titan-type-slide-left {
    0% { transform: translateX(-120%); opacity: 0; }
    60% { transform: translateX(10%); opacity: 1; }
    100% { transform: translateX(0); opacity: 1; }
}

@keyframes titan-type-slide-right {
    0% { transform: translateX(120%); opacity: 0; }
    60% { transform: translateX(-10%); opacity: 1; }
    100% { transform: translateX(0); opacity: 1; }
}

@keyframes titan-type-slide-up {
    0% { transform: translateY(120%); opacity: 0; }
    60% { transform: translateY(-12%); opacity: 1; }
    100% { transform: translateY(0); opacity: 1; }
}

@keyframes titan-type-slide-down {
    0% { transform: translateY(-120%); opacity: 0; }
    60% { transform: translateY(12%); opacity: 1; }
    100% { transform: translateY(0); opacity: 1; }
}

@keyframes titan-type-drop-bounce {
    0% { transform: translateY(-160px) scale(0.6); opacity: 0; }
    50% { transform: translateY(16px) scale(1.3, 0.7); opacity: 1; }
    75% { transform: translateY(-8px) scale(0.9, 1.1); }
    100% { transform: translateY(0) scale(1, 1); opacity: 1; }
}

@keyframes titan-type-jump-bounce {
    0% { transform: translateY(140px) scale(0.7); opacity: 0; }
    50% { transform: translateY(-20px) scale(1.25); opacity: 1; }
    75% { transform: translateY(6px) scale(0.95); }
    100% { transform: translateY(0) scale(1); opacity: 1; }
}

@keyframes titan-type-zoom-in {
    0% { transform: scale(0); opacity: 0; }
    70% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes titan-type-zoom-out {
    0% { transform: scale(2.2); opacity: 0; filter: blur(10px); }
    100% { transform: scale(1); opacity: 1; filter: blur(0); }
}

@keyframes titan-type-blur-zoom {
    0% { filter: blur(20px); opacity: 0; transform: scale(1.4); }
    100% { filter: blur(0); opacity: 1; transform: scale(1); }
}

@keyframes titan-type-rotate-in {
    0% { transform: rotate(-360deg) scale(0.2); opacity: 0; }
    100% { transform: rotate(0deg) scale(1); opacity: 1; }
}

@keyframes titan-type-skew-left {
    0% { transform: translateX(-100%) skewX(-30deg); opacity: 0; }
    70% { transform: translateX(10%) skewX(10deg); opacity: 1; }
    100% { transform: translateX(0) skewX(0deg); opacity: 1; }
}

@keyframes titan-type-skew-right {
    0% { transform: translateX(100%) skewX(30deg); opacity: 0; }
    70% { transform: translateX(-10%) skewX(-10deg); opacity: 1; }
    100% { transform: translateX(0) skewX(0deg); opacity: 1; }
}

@keyframes titan-type-raindrop-shatter-fusion {
    0% {
        opacity: 0;
        transform: translateY(-160px) scale(0.35, 1.8) rotate(0deg);
        filter: blur(10px) drop-shadow(0 0 15px #38bdf8);
        color: #7dd3fc;
    }
    22% {
        opacity: 1;
        transform: translateY(16px) scale(1.7, 0.4);
        filter: blur(0px) drop-shadow(0 0 30px #06b6d4);
        color: #38bdf8;
    }
    38% {
        opacity: 0.9;
        transform: translate(var(--shatter-x, -30px), var(--shatter-y, -25px)) rotate(var(--shatter-rot, -40deg)) scale(0.7);
        filter: blur(2px) drop-shadow(0 0 20px #0284c7);
        color: #a5f3fc;
    }
    58% {
        opacity: 0.85;
        transform: translate(calc(var(--shatter-x, -30px) * 1.25), calc(var(--shatter-y, -25px) * 0.7)) rotate(calc(var(--shatter-rot, -40deg) * 1.3)) scale(0.85);
        filter: drop-shadow(0 0 25px #38bdf8);
        color: #67e8f9;
    }
    80% {
        opacity: 1;
        transform: translate(0px, -4px) rotate(0deg) scale(1.2);
        filter: blur(0px) drop-shadow(0 0 35px #fde047);
        color: #ffffff;
    }
    100% {
        opacity: 1;
        transform: translate(0px, 0px) rotate(0deg) scale(1);
        filter: drop-shadow(0 2px 10px rgba(0,0,0,0.95));
        color: #fde047;
    }
}

@keyframes titan-type-sine-wave {
    0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
    25% { transform: translateY(-18px) scale(1.12) rotate(10deg); color: #38bdf8; text-shadow: 0 0 15px #38bdf8; }
    50% { transform: translateY(0px) scale(1) rotate(0deg); }
    75% { transform: translateY(18px) scale(0.9) rotate(-10deg); color: #fde047; text-shadow: 0 0 15px #fde047; }
}

@keyframes titan-type-snake-wave {
    0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
    20% { transform: translate(-8px, -16px) rotate(-12deg); }
    40% { transform: translate(8px, -8px) rotate(8deg); }
    60% { transform: translate(-8px, 16px) rotate(-8deg); }
    80% { transform: translate(8px, 8px) rotate(12deg); }
}

@keyframes titan-type-wipe-right {
    0% { clip-path: inset(0 100% 0 0); opacity: 0; transform: translateX(-12px); }
    50% { clip-path: inset(0 0% 0 0); opacity: 1; transform: translateX(0); }
    100% { clip-path: inset(0 0% 0 0); opacity: 1; transform: translateX(0); }
}

@keyframes titan-type-wipe-left {
    0% { clip-path: inset(0 0 0 100%); opacity: 0; transform: translateX(12px); }
    50% { clip-path: inset(0 0 0 0%); opacity: 1; transform: translateX(0); }
    100% { clip-path: inset(0 0 0 0%); opacity: 1; transform: translateX(0); }
}

@keyframes titan-type-wipe-up {
    0% { clip-path: inset(100% 0 0 0); opacity: 0; transform: translateY(12px); }
    50% { clip-path: inset(0% 0 0 0); opacity: 1; transform: translateY(0); }
    100% { clip-path: inset(0% 0 0 0); opacity: 1; transform: translateY(0); }
}

@keyframes titan-type-wipe-down {
    0% { clip-path: inset(0 0 100% 0); opacity: 0; transform: translateY(-12px); }
    50% { clip-path: inset(0 0 0% 0); opacity: 1; transform: translateY(0); }
    100% { clip-path: inset(0 0 0% 0); opacity: 1; transform: translateY(0); }
}

@keyframes titan-type-circular-orbit {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes titan-type-cylinder-drum {
    0% { transform: perspective(600px) rotateX(0deg); }
    50% { transform: perspective(600px) rotateX(180deg) scale(0.9); }
    100% { transform: perspective(600px) rotateX(360deg); }
}

@keyframes titan-type-spiral-vortex {
    0% { transform: rotate(0deg) scale(1.6); opacity: 0.2; }
    50% { transform: rotate(360deg) scale(0.6); opacity: 1; filter: drop-shadow(0 0 20px #06b6d4); }
    100% { transform: rotate(720deg) scale(1); opacity: 1; }
}

@keyframes titan-type-karaoke-bounce {
    0%, 100% { transform: scale(1) translateY(0); color: #fde047; text-shadow: 0 0 10px rgba(253, 224, 71, 0.8); }
    50% { transform: scale(1.35) translateY(-8px); color: #ffffff; text-shadow: 0 0 25px #06b6d4, 0 0 45px #38bdf8; }
}

@keyframes titan-type-rollercoaster {
    0% { transform: translate(-20px, 10px) rotate(-12deg); }
    25% { transform: translate(0px, -15px) rotate(8deg); }
    50% { transform: translate(20px, 10px) rotate(-8deg); }
    75% { transform: translate(0px, -12px) rotate(6deg); }
    100% { transform: translate(-20px, 10px) rotate(-12deg); }
}

/* ── DOMAIN 3-7 MASTER GENERAL KEYFRAMES (0x60 - 0xFF / 96 - 255) ── */
@keyframes titan-hud-3d {
    0% { transform: perspective(500px) rotateY(0deg); filter: drop-shadow(0 0 8px #22d3ee); }
    50% { transform: perspective(500px) rotateY(180deg) scale(1.1); filter: drop-shadow(0 0 25px #06b6d4); }
    100% { transform: perspective(500px) rotateY(360deg); filter: drop-shadow(0 0 8px #22d3ee); }
}

@keyframes titan-video-fx {
    0% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.25) rotate(10deg); filter: contrast(150%) saturate(180%); }
    100% { transform: scale(1) rotate(0deg); }
}

@keyframes titan-element {
    0%, 100% { transform: translateY(0) scale(1); filter: drop-shadow(0 0 10px #f59e0b); }
    50% { transform: translateY(-16px) scale(1.2); filter: drop-shadow(0 0 35px #ef4444); }
}

@keyframes titan-audio-dsp {
    0%, 100% { transform: scaleY(0.6); filter: drop-shadow(0 0 6px #10b981); }
    50% { transform: scaleY(1.7); filter: drop-shadow(0 0 25px #34d399); }
}

@keyframes titan-telecom-hw {
    0%, 100% { opacity: 0.4; transform: scale(0.9); }
    50% { opacity: 1; transform: scale(1.15); filter: drop-shadow(0 0 20px #38bdf8); }
}

/* ── ACTIVE CSS CLASSES MAPPING (0x00 - 0x1F / 0 - 31) ── */
.titan-anim-idle        { animation: none !important; }
.titan-anim-heartbeat   { display: inline-block !important; animation: titan-heartbeat 1.0s cubic-bezier(0.4, 0, 0.6, 1) infinite !important; }
.titan-anim-radar       { display: inline-block !important; animation: titan-radar 1.6s ease-in-out infinite !important; }
.titan-anim-laser       { display: inline-block !important; animation: titan-laser 1.2s ease-in-out infinite !important; }
.titan-anim-breathe     { display: inline-block !important; animation: titan-breathe 2.0s ease-in-out infinite !important; }
.titan-anim-ripple      { display: inline-block !important; animation: titan-ripple 1.4s ease-out infinite !important; }
.titan-anim-spin        { display: inline-block !important; animation: titan-spin 0.6s linear infinite !important; }
.titan-anim-spring      { display: inline-block !important; animation: titan-spring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) infinite !important; }
.titan-anim-glitch      { display: inline-block !important; animation: titan-glitch 0.6s steps(2, start) infinite !important; }
.titan-anim-shake       { display: inline-block !important; animation: titan-shake 0.4s ease-in-out infinite !important; }
.titan-anim-matrix      { display: inline-block !important; animation: titan-matrix 1.0s linear infinite !important; }
.titan-anim-shimmer     { display: inline-block !important; animation: titan-shimmer 1.8s linear infinite !important; }
.titan-anim-spark       { display: inline-block !important; animation: titan-spark 0.6s ease-in-out infinite !important; }
.titan-anim-float       { display: inline-block !important; animation: titan-float 2.2s ease-in-out infinite !important; }
.titan-anim-pop         { display: inline-block !important; animation: titan-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite !important; }
.titan-anim-ping        { display: inline-block !important; animation: titan-ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite !important; }
.titan-anim-ring        { display: inline-block !important; animation: titan-ring 0.6s ease-in-out infinite !important; }
.titan-anim-wave        { display: inline-block !important; animation: titan-wave 0.8s ease-in-out infinite !important; }
.titan-anim-vortex      { display: inline-block !important; animation: titan-vortex 1.8s linear infinite !important; }
.titan-anim-pendulum    { display: inline-block !important; animation: titan-pendulum 1.2s ease-in-out infinite !important; }
.titan-anim-torch       { display: inline-block !important; animation: titan-torch 1.2s ease-in-out infinite !important; }
.titan-anim-jitter      { display: inline-block !important; animation: titan-jitter 0.3s linear infinite !important; }
.titan-anim-warp        { display: inline-block !important; animation: titan-warp 1.0s ease-in-out infinite !important; }
.titan-anim-strobe      { display: inline-block !important; animation: titan-strobe 0.2s steps(2, start) infinite !important; }
.titan-anim-spiral      { display: inline-block !important; animation: titan-spiral 2.5s linear infinite !important; }
.titan-anim-magnet      { display: inline-block !important; animation: titan-magnet 0.8s ease-in-out infinite !important; }
.titan-anim-ecg         { display: inline-block !important; animation: titan-ecg 1.0s ease-in-out infinite !important; }
.titan-anim-arrhythmia  { display: inline-block !important; animation: titan-arrhythmia 1.4s ease-in-out infinite !important; }
.titan-anim-bloom       { display: inline-block !important; animation: titan-bloom 1.6s ease-in-out infinite !important; }
.titan-anim-thump       { display: inline-block !important; animation: titan-thump 0.8s ease-in-out infinite !important; }
.titan-anim-plasma      { display: inline-block !important; animation: titan-plasma 2.2s linear infinite !important; }
.titan-anim-siphon      { display: inline-block !important; animation: titan-siphon 2.0s linear infinite !important; }

/* ── ACTIVE CSS CLASSES MAPPING (0x20 - 0x3F / 32 - 63) ── */
.titan-anim-btn-jiggle   { display: inline-block !important; animation: titan-btn-jiggle 0.6s ease-in-out infinite !important; }
.titan-anim-badge-bounce { display: inline-block !important; animation: titan-badge-bounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) infinite !important; }
.titan-anim-bell-swing   { display: inline-block !important; animation: titan-bell-swing 1.0s ease-in-out infinite !important; }
.titan-anim-thumbs-pop   { display: inline-block !important; animation: titan-thumbs-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite !important; }
.titan-anim-star-burst   { display: inline-block !important; animation: titan-star-burst 0.8s ease-in-out infinite !important; }
.titan-anim-lock-error   { display: inline-block !important; animation: titan-lock-error 0.4s ease-in-out infinite !important; }
.titan-anim-check-stamp  { display: inline-block !important; animation: titan-check-stamp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) infinite !important; }
.titan-anim-dl-drop      { display: inline-block !important; animation: titan-dl-drop 1.0s ease-in-out infinite !important; }
.titan-anim-ul-jet       { display: inline-block !important; animation: titan-ul-jet 1.2s ease-in-out infinite !important; }
.titan-anim-cart-wobble  { display: inline-block !important; animation: titan-cart-wobble 0.7s ease-in-out infinite !important; }
.titan-anim-switch-snap  { display: inline-block !important; animation: titan-switch-snap 0.4s ease-in-out infinite !important; }
.titan-anim-vu-meter     { display: inline-block !important; animation: titan-vu-meter 0.6s ease-in-out infinite !important; }
.titan-anim-bat-charge   { display: inline-block !important; animation: titan-bat-charge 1.4s ease-in-out infinite !important; }
.titan-anim-sig-ladder   { display: inline-block !important; animation: titan-sig-ladder 1.0s ease-in-out infinite !important; }
.titan-anim-trash-drop   { display: inline-block !important; animation: titan-trash-drop 0.7s ease-in-out infinite !important; }
.titan-anim-bookmark     { display: inline-block !important; animation: titan-bookmark 0.8s ease-in-out infinite !important; }
.titan-anim-flip-y       { display: inline-block !important; animation: titan-flip-y 1.0s linear infinite !important; }
.titan-anim-tilt-x       { display: inline-block !important; animation: titan-tilt-x 1.2s ease-in-out infinite !important; }
.titan-anim-accordion    { display: inline-block !important; animation: titan-accordion 0.6s ease-in-out infinite !important; }
.titan-anim-modal-zoom   { display: inline-block !important; animation: titan-modal-zoom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) infinite !important; }
.titan-anim-drawer-slide { display: inline-block !important; animation: titan-drawer-slide 0.6s ease-in-out infinite !important; }
.titan-anim-toast-drop   { display: inline-block !important; animation: titan-toast-drop 0.7s ease-in-out infinite !important; }
.titan-anim-tooltip-pop  { display: inline-block !important; animation: titan-tooltip-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite !important; }
.titan-anim-border-cyan  { display: inline-block !important; animation: titan-border-cyan 1.6s ease-in-out infinite !important; }
.titan-anim-rainbow-bar  { display: inline-block !important; animation: titan-rainbow-bar 2.0s linear infinite !important; }
.titan-anim-skeleton     { display: inline-block !important; animation: titan-skeleton 1.4s ease-in-out infinite !important; }
.titan-anim-cascade      { display: inline-block !important; animation: titan-cascade 0.8s ease-in-out infinite !important; }
.titan-anim-ink-ripple   { display: inline-block !important; animation: titan-ink-ripple 1.0s ease-out infinite !important; }
.titan-anim-fab-halo     { display: inline-block !important; animation: titan-fab-halo 1.8s ease-in-out infinite !important; }
.titan-anim-glass-frost  { display: inline-block !important; animation: titan-glass-frost 1.6s ease-in-out infinite !important; }
.titan-anim-focus-ring   { display: inline-block !important; animation: titan-focus-ring 1.0s ease-in-out infinite !important; }
.titan-anim-rubber-squash{ display: inline-block !important; animation: titan-rubber-squash 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) infinite !important; }

/* ── ACTIVE CSS CLASSES MAPPING (0x40 - 0x5F / 64 - 95: TYPOGRAPHY) ── */
.titan-anim-type-slide-left  { display: inline-block !important; animation: titan-type-slide-left 1.0s cubic-bezier(0.2, 0.8, 0.2, 1) infinite !important; }
.titan-anim-type-slide-right { display: inline-block !important; animation: titan-type-slide-right 1.0s cubic-bezier(0.2, 0.8, 0.2, 1) infinite !important; }
.titan-anim-type-slide-up    { display: inline-block !important; animation: titan-type-slide-up 1.0s cubic-bezier(0.2, 0.8, 0.2, 1) infinite !important; }
.titan-anim-type-slide-down  { display: inline-block !important; animation: titan-type-slide-down 1.0s cubic-bezier(0.2, 0.8, 0.2, 1) infinite !important; }
.titan-anim-type-drop-bounce { display: inline-block !important; animation: titan-type-drop-bounce 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite !important; }
.titan-anim-type-jump-bounce { display: inline-block !important; animation: titan-type-jump-bounce 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite !important; }
.titan-anim-type-zoom-in     { display: inline-block !important; animation: titan-type-zoom-in 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) infinite !important; }
.titan-anim-type-zoom-out    { display: inline-block !important; animation: titan-type-zoom-out 1.2s ease-out infinite !important; }
.titan-anim-type-blur-zoom   { display: inline-block !important; animation: titan-type-blur-zoom 1.4s ease-out infinite !important; }
.titan-anim-type-rotate-in   { display: inline-block !important; transform-origin: center center !important; animation: titan-type-rotate-in 1.4s ease-out infinite !important; }
.titan-anim-type-skew-left   { display: inline-block !important; animation: titan-type-skew-left 1.0s cubic-bezier(0.2, 0.8, 0.2, 1) infinite !important; }
.titan-anim-type-skew-right  { display: inline-block !important; animation: titan-type-skew-right 1.0s cubic-bezier(0.2, 0.8, 0.2, 1) infinite !important; }
.titan-anim-type-sine-wave   { display: inline-block !important; animation: titan-type-sine-wave 1.8s ease-in-out infinite !important; }
.titan-anim-type-snake-wave  { display: inline-block !important; animation: titan-type-snake-wave 2.2s ease-in-out infinite !important; }
.titan-anim-type-wipe-right  { display: inline-block !important; animation: titan-type-wipe-right 1.4s cubic-bezier(0.25, 1, 0.5, 1) infinite !important; }
.titan-anim-type-wipe-left   { display: inline-block !important; animation: titan-type-wipe-left 1.4s cubic-bezier(0.25, 1, 0.5, 1) infinite !important; }
.titan-anim-type-wipe-up     { display: inline-block !important; animation: titan-type-wipe-up 1.4s cubic-bezier(0.25, 1, 0.5, 1) infinite !important; }
.titan-anim-type-wipe-down   { display: inline-block !important; animation: titan-type-wipe-down 1.4s cubic-bezier(0.25, 1, 0.5, 1) infinite !important; }
.titan-anim-type-raindrop-shatter { display: inline-block !important; animation: titan-type-raindrop-shatter-fusion 2.8s ease-in-out infinite !important; }
.titan-anim-type-circular-orbit { display: inline-block !important; transform-origin: center center !important; animation: titan-type-circular-orbit 3.0s linear infinite !important; }
.titan-anim-type-cylinder-drum  { display: inline-block !important; animation: titan-type-cylinder-drum 2.4s ease-in-out infinite !important; }
.titan-anim-type-spiral-vortex  { display: inline-block !important; transform-origin: center center !important; animation: titan-type-spiral-vortex 2.0s ease-in-out infinite !important; }
.titan-anim-type-karaoke-bounce { display: inline-block !important; animation: titan-type-karaoke-bounce 1.2s ease-in-out infinite !important; }
.titan-anim-type-rollercoaster  { display: inline-block !important; animation: titan-type-rollercoaster 2.2s ease-in-out infinite !important; }
.titan-anim-typewriter   { display: inline-block !important; border-right: 3px solid #22d3ee; animation: titan-caret-blink 0.7s step-end infinite !important; }
.titan-anim-type-wipe    { display: inline-block !important; animation: titan-type-fade-up 1.4s ease-in-out infinite !important; }
.titan-anim-type-decrypt { display: inline-block !important; animation: titan-type-decrypt 1.2s ease-in-out infinite !important; }
.titan-anim-type-karaoke { display: inline-block !important; background: linear-gradient(90deg, #f59e0b 50%, #475569 50%); background-size: 200% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: titan-type-karaoke-fill 2.0s linear infinite !important; }
.titan-anim-type-neon    { display: inline-block !important; animation: titan-type-neon-glow 1.8s ease-in-out infinite !important; }
.titan-anim-type-3d-flip { display: inline-block !important; animation: titan-type-3d-flip 1.4s cubic-bezier(0.16, 1, 0.3, 1) infinite !important; }
.titan-anim-type-bounce  { display: inline-block !important; animation: titan-type-bounce 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) infinite !important; }
.titan-anim-type-wave    { display: inline-block !important; animation: titan-type-wave 1.8s ease-in-out infinite !important; }
.titan-anim-type-smoke   { display: inline-block !important; animation: titan-breathe 2.0s ease-in-out infinite !important; }
.titan-anim-type-track   { display: inline-block !important; animation: titan-type-cinematic-tracking 2.4s ease-in-out infinite !important; }
.titan-anim-type-fade-up { display: inline-block !important; animation: titan-type-fade-up 1.3s ease-out infinite !important; }
.titan-anim-type-rgb     { display: inline-block !important; animation: titan-glitch 0.6s steps(2, start) infinite !important; }
.titan-anim-type-fire    { display: inline-block !important; animation: titan-type-fire-burn 1.4s ease-in-out infinite !important; }
.titan-anim-type-gold    { display: inline-block !important; background: linear-gradient(120deg, #ca8a04 0%, #fef08a 50%, #ca8a04 100%); background-size: 200% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: titan-type-gold-sheen 2.2s linear infinite !important; }
.titan-anim-type-slot    { display: inline-block !important; animation: titan-type-slot-spin 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) infinite !important; }
.titan-anim-type-stamp   { display: inline-block !important; animation: titan-type-stamp-slam 1.0s cubic-bezier(0.2, 0.8, 0.2, 1) infinite !important; }
.titan-anim-type-laser   { display: inline-block !important; animation: titan-laser 1.4s ease-in-out infinite !important; }
.titan-anim-type-hacker  { display: inline-block !important; color: #10b981 !important; text-shadow: 0 0 10px #10b981; animation: titan-matrix 1.2s linear infinite !important; }
.titan-anim-type-rainbow { display: inline-block !important; animation: titan-type-rainbow 3.0s linear infinite !important; }
.titan-anim-type-extrude { display: inline-block !important; animation: titan-type-extrude 1.4s ease-in-out infinite !important; }
.titan-anim-type-explode { display: inline-block !important; animation: titan-spring 0.9s ease-out infinite !important; }
.titan-anim-type-aurora  { display: inline-block !important; animation: titan-type-rainbow 3.5s ease-in-out infinite !important; }
.titan-anim-type-8bit    { display: inline-block !important; animation: titan-glitch 0.4s steps(3) infinite !important; }
.titan-anim-type-ransom  { display: inline-block !important; animation: titan-shake 0.7s ease-in-out infinite !important; }
.titan-anim-type-cursive { display: inline-block !important; animation: titan-type-wave 2.2s ease-in-out infinite !important; }
.titan-anim-type-vortex  { display: inline-block !important; animation: titan-vortex 2.0s linear infinite !important; }
.titan-anim-type-uline   { display: inline-block !important; animation: titan-type-fade-up 0.9s ease-out infinite !important; }
.titan-anim-type-balloon { display: inline-block !important; animation: titan-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) infinite !important; }
.titan-anim-type-zap     { display: inline-block !important; animation: titan-type-zap 0.8s ease-in-out infinite !important; }
.titan-anim-type-water   { display: inline-block !important; animation: titan-ripple 1.8s ease-out infinite !important; }
.titan-anim-type-warp    { display: inline-block !important; animation: titan-type-cinematic-tracking 1.4s ease-in-out infinite !important; }
.titan-anim-type-mirror  { display: inline-block !important; animation: titan-type-3d-flip 1.6s ease-in-out infinite !important; }
.titan-anim-type-marquee { display: inline-block !important; white-space: nowrap !important; animation: titan-marquee 5.0s linear infinite !important; }

/* ── ACTIVE CSS CLASSES MAPPING (0x60 - 0xFF / 96 - 255: DOMAINS 3-7) ── */
.titan-anim-video-fx     { display: inline-block !important; animation: titan-video-fx 1.2s ease-in-out infinite !important; }
.titan-anim-hud-3d       { display: inline-block !important; animation: titan-hud-3d 2.0s linear infinite !important; }
.titan-anim-element      { display: inline-block !important; animation: titan-element 1.6s ease-in-out infinite !important; }
.titan-anim-audio        { display: inline-block !important; animation: titan-audio-dsp 0.8s ease-in-out infinite !important; }
.titan-anim-telecom      { display: inline-block !important; animation: titan-telecom-hw 1.0s ease-in-out infinite !important; }
`;
}

function getAnimationClass(animOpcode = 0) {
    const code = Number(animOpcode) & 0xFF;
    const meta = ANIMATIONS_256[code] || ANIMATIONS_256[0];
    return meta.cssClass;
}

module.exports = {
    generateAnimationCSS,
    getAnimationClass,
    ANIMATIONS_256,
    TITAN_ANIM
};
