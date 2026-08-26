'use strict';

const { ANIMATIONS_256, TITAN_ANIM } = require('./ANIMATIONS_256');

/**
 * ⚡ Master Pixel-Perfect CSS Keyframes Generator
 * Generates hardware-accelerated 120fps GPU transform stylesheet
 */
function generateAnimationCSS() {
    return `
/* ═══════════════════════════════════════════════════════════════════════════
   🐬 DANPHE-UI 1-BYTE PIXEL-PERFECT ANIMATION STYLESHEET (120 FPS GPU)
   ═══════════════════════════════════════════════════════════════════════════ */

@keyframes titan-heartbeat {
    0% { transform: scale(1); }
    14% { transform: scale(1.4); }
    28% { transform: scale(1); }
    42% { transform: scale(1.25); }
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
    80% { transform: translateX(10px) rotate(6deg); }
}

@keyframes titan-matrix {
    0% { transform: translateY(-12px); opacity: 0.3; }
    50% { transform: translateY(0); opacity: 1; filter: drop-shadow(0 0 16px #10b981); }
    100% { transform: translateY(12px); opacity: 0.3; }
}

@keyframes titan-shimmer {
    0% { transform: scale(1); filter: hue-rotate(0deg) drop-shadow(0 0 10px #06b6d4); }
    50% { transform: scale(1.15); filter: hue-rotate(180deg) drop-shadow(0 0 30px #a855f7); }
    100% { transform: scale(1); filter: hue-rotate(360deg) drop-shadow(0 0 10px #06b6d4); }
}

@keyframes titan-spark {
    0%, 100% { opacity: 0.9; transform: scale(1); }
    25% { opacity: 1; transform: scale(1.4) rotate(15deg); filter: drop-shadow(0 0 25px #f59e0b); }
    50% { opacity: 0.2; transform: scale(0.7); }
    75% { opacity: 1; transform: scale(1.3) rotate(-15deg); filter: drop-shadow(0 0 30px #ef4444); }
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

/* ── CSS ACTIVE CLASSES ── */
.titan-anim-idle      { animation: none !important; }
.titan-anim-heartbeat { display: inline-block !important; animation: titan-heartbeat 1.0s cubic-bezier(0.4, 0, 0.6, 1) infinite !important; }
.titan-anim-radar     { display: inline-block !important; animation: titan-radar 1.6s ease-in-out infinite !important; }
.titan-anim-laser     { display: inline-block !important; animation: titan-laser 1.2s ease-in-out infinite !important; }
.titan-anim-breathe   { display: inline-block !important; animation: titan-breathe 2.0s ease-in-out infinite !important; }
.titan-anim-ripple    { display: inline-block !important; animation: titan-ripple 1.4s ease-out infinite !important; }
.titan-anim-spin      { display: inline-block !important; animation: titan-spin 0.6s linear infinite !important; }
.titan-anim-spring    { display: inline-block !important; animation: titan-spring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) infinite !important; }
.titan-anim-glitch    { display: inline-block !important; animation: titan-glitch 0.6s steps(2, start) infinite !important; }
.titan-anim-shake     { display: inline-block !important; animation: titan-shake 0.4s ease-in-out infinite !important; }
.titan-anim-matrix    { display: inline-block !important; animation: titan-matrix 1.0s linear infinite !important; }
.titan-anim-shimmer   { display: inline-block !important; animation: titan-shimmer 1.8s linear infinite !important; }
.titan-anim-spark     { display: inline-block !important; animation: titan-spark 0.6s ease-in-out infinite !important; }
.titan-anim-float     { display: inline-block !important; animation: titan-float 2.2s ease-in-out infinite !important; }
.titan-anim-pop       { display: inline-block !important; animation: titan-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite !important; }
.titan-anim-ping      { display: inline-block !important; animation: titan-ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite !important; }
.titan-anim-ring      { display: inline-block !important; animation: titan-ring 0.6s ease-in-out infinite !important; }
.titan-anim-wave      { display: inline-block !important; animation: titan-wave 0.8s ease-in-out infinite !important; }
.titan-anim-vortex    { display: inline-block !important; animation: titan-vortex 1.8s linear infinite !important; }
.titan-anim-pendulum  { display: inline-block !important; animation: titan-pendulum 1.2s ease-in-out infinite !important; }
`;
}

/**
 * Get CSS Class by 1-Byte Opcode
 */
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
