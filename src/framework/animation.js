// src/framework/ub/animations.js
// 🐬 Animation System - 24-byte Protocol Ready

'use strict';

// ─── ANIMATION MAP ──────────────────────────────────────────────────────────
const ANIMATION_MAP = {
  // Basic
  none: 0x00,
  fade: 0x01,
  slide: 0x02,
  scale: 0x03,
  rotate: 0x04,
  bounce: 0x05,
  pulse: 0x06,
  
  // Advanced
  shake: 0x07,
  flip: 0x08,
  zoom: 0x09,
  swing: 0x0A,
  wobble: 0x0B,
  jello: 0x0C,
  heartBeat: 0x0D,
  flash: 0x0E,
  rubberBand: 0x0F,
  headShake: 0x10,
  
  // Framer animations
  'framer-spring': 0x11,
  'framer-slide-up': 0x12,
  'framer-slide-down': 0x13,
  'framer-bounce': 0x14,
  'framer-fade': 0x15,
  'framer-flip': 0x16,
  'framer-zoom': 0x17,
  
  // Custom
  glow: 0x18,
  breathe: 0x19,
  float: 0x1A,
  shimmer: 0x1B,
  ripple: 0x1C,
  wave: 0x1D,
};

// ─── ANIMATION DURATION MAP ─────────────────────────────────────────────────
const DURATION_MAP = {
  'fast': 100,   // 0-255 → 0-5000ms (100ms)
  'normal': 300, // 300ms
  'slow': 500,   // 500ms
  'slower': 800, // 800ms
  'very-slow': 1000, // 1000ms
};

// ─── ANIMATION EASING ──────────────────────────────────────────────────────
const EASING_MAP = {
  'linear': 'linear',
  'in': 'ease-in',
  'out': 'ease-out',
  'in-out': 'ease-in-out',
  'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  'sharp': 'cubic-bezier(0.4, 0, 0.6, 1)',
};

// ─── KEYFRAMES ───────────────────────────────────────────────────────────────
const KEYFRAMES = {
  'fade': '@keyframes dolphin-fade { from { opacity: 0; } to { opacity: 1; } }',
  'slide-up': '@keyframes dolphin-slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }',
  'slide-down': '@keyframes dolphin-slide-down { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }',
  'slide-left': '@keyframes dolphin-slide-left { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }',
  'slide-right': '@keyframes dolphin-slide-right { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }',
  'scale': '@keyframes dolphin-scale { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }',
  'rotate': '@keyframes dolphin-rotate { from { opacity: 0; transform: rotate(-180deg); } to { opacity: 1; transform: rotate(0); } }',
  'bounce': '@keyframes dolphin-bounce { 0% { opacity: 0; transform: scale(0.3); } 50% { transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }',
  'pulse': '@keyframes dolphin-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }',
  'shake': '@keyframes dolphin-shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); } 20%, 40%, 60%, 80% { transform: translateX(6px); } }',
  'flip': '@keyframes dolphin-flip { from { opacity: 0; transform: rotateY(-90deg); } to { opacity: 1; transform: rotateY(0); } }',
  'zoom': '@keyframes dolphin-zoom { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }',
  'swing': '@keyframes dolphin-swing { 20% { transform: rotate(15deg); } 40% { transform: rotate(-10deg); } 60% { transform: rotate(5deg); } 80% { transform: rotate(-5deg); } 100% { transform: rotate(0deg); } }',
  'wobble': '@keyframes dolphin-wobble { 0% { transform: translateX(0%) rotate(0deg); } 15% { transform: translateX(-25%) rotate(-5deg); } 30% { transform: translateX(20%) rotate(3deg); } 45% { transform: translateX(-15%) rotate(-3deg); } 60% { transform: translateX(10%) rotate(2deg); } 75% { transform: translateX(-5%) rotate(-1deg); } 100% { transform: translateX(0%) rotate(0deg); } }',
  'jello': '@keyframes dolphin-jello { 0%, 100% { transform: skewX(0deg) skewY(0deg); } 25% { transform: skewX(-12.5deg) skewY(-12.5deg); } 50% { transform: skewX(6.25deg) skewY(6.25deg); } 75% { transform: skewX(-3.125deg) skewY(-3.125deg); } }',
  'heartBeat': '@keyframes dolphin-heartBeat { 0%, 100% { transform: scale(1); } 14% { transform: scale(1.3); } 28% { transform: scale(1); } 42% { transform: scale(1.3); } 70% { transform: scale(1); } }',
  'flash': '@keyframes dolphin-flash { 0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: 0; } }',
  'rubberBand': '@keyframes dolphin-rubberBand { 0%, 100% { transform: scale(1); } 30% { transform: scale(1.25, 0.75); } 40% { transform: scale(0.75, 1.25); } 50% { transform: scale(1.15, 0.85); } 65% { transform: scale(0.95, 1.05); } 75% { transform: scale(1.05, 0.95); } }',
  'headShake': '@keyframes dolphin-headShake { 0%, 100% { transform: translateX(0) rotate(0deg); } 25% { transform: translateX(-6px) rotate(-3deg); } 75% { transform: translateX(5px) rotate(3deg); } }',
  'glow': '@keyframes dolphin-glow { 0%, 100% { box-shadow: 0 0 8px rgba(59,130,246,0.4); } 50% { box-shadow: 0 0 20px rgba(59,130,246,0.8); } }',
  'breathe': '@keyframes dolphin-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }',
  'float': '@keyframes dolphin-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }',
  'shimmer': '@keyframes dolphin-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }',
  'ripple': '@keyframes dolphin-ripple { 0% { transform: scale(0); opacity: 0.8; } 100% { transform: scale(2); opacity: 0; } }',
  'wave': '@keyframes dolphin-wave { 0% { transform: rotate(0deg); } 25% { transform: rotate(20deg); } 75% { transform: rotate(-20deg); } 100% { transform: rotate(0deg); } }',
  
  // Framer animations
  'framer-spring': '@keyframes framer-spring { 0% { opacity: 0; transform: scale(0.8); } 60% { transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }',
  'framer-slide-up': '@keyframes framer-slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }',
  'framer-slide-down': '@keyframes framer-slide-down { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }',
  'framer-bounce': '@keyframes framer-bounce { 0% { opacity: 0; transform: scale(0.3); } 50% { transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }',
  'framer-fade': '@keyframes framer-fade { from { opacity: 0; } to { opacity: 1; } }',
  'framer-flip': '@keyframes framer-flip { from { opacity: 0; transform: rotateY(-90deg); } to { opacity: 1; transform: rotateY(0); } }',
  'framer-zoom': '@keyframes framer-zoom { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }',
};

// ─── PACK ANIMATION ──────────────────────────────────────────────────────────
function packAnimation(anim) {
  if (!anim) return 0x00;
  
  // If already a number
  if (typeof anim === 'number') return anim & 0xFF;
  
  // If string
  if (typeof anim === 'string') {
    const key = anim.toLowerCase().split('-')[0];
    return ANIMATION_MAP[key] || 0x00;
  }
  
  // If object with type
  if (typeof anim === 'object' && anim.type) {
    return ANIMATION_MAP[anim.type] || 0x00;
  }
  
  return 0x00;
}

// ─── PACK ANIMATION DURATION ──────────────────────────────────────────────
function packDuration(duration) {
  if (!duration) return 0;
  
  // String: "fast", "normal", "slow"
  if (typeof duration === 'string') {
    return DURATION_MAP[duration] || 0;
  }
  
  // Number: 0-5000ms → 0-255
  if (typeof duration === 'number') {
    return Math.min(Math.round(duration / 20), 255);
  }
  
  return 0;
}

// ─── PACK ANIMATION WITH DURATION ──────────────────────────────────────────
function packAnimationWithDuration(anim, duration) {
  const type = packAnimation(anim);
  const dur = packDuration(duration);
  
  return {
    type: type,
    duration: dur,
    // Byte 18: type, Byte 19: duration
    binary: (type & 0xFF) | ((dur & 0xFF) << 8)
  };
}

// ─── GET ANIMATION STYLE ────────────────────────────────────────────────────
function getAnimationStyle(anim, duration = 300, easing = 'ease') {
  const type = typeof anim === 'string' ? anim : (anim.type || 'fade');
  const dur = typeof duration === 'number' ? duration : 300;
  const ease = EASING_MAP[easing] || 'ease';
  
  return `animation: ${type} ${dur}ms ${ease} forwards;`;
}

// ─── INJECT KEYFRAMES ──────────────────────────────────────────────────────
function injectKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('dolphin-keyframes')) return;
  
  const styleEl = document.createElement('style');
  styleEl.id = 'dolphin-keyframes';
  styleEl.textContent = Object.values(KEYFRAMES).join('\n');
  document.head.appendChild(styleEl);
}

// ─── CHECK IF ANIMATION IS SUPPORTED ──────────────────────────────────────
function isAnimationSupported(anim) {
  if (!anim) return false;
  const type = typeof anim === 'string' ? anim : (anim.type || '');
  return !!ANIMATION_MAP[type] || !!KEYFRAMES[type];
}

// ─── GET SUPPORTED ANIMATIONS ──────────────────────────────────────────────
function getSupportedAnimations() {
  return Object.keys(ANIMATION_MAP);
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────
module.exports = {
  ANIMATION_MAP,
  DURATION_MAP,
  EASING_MAP,
  KEYFRAMES,
  packAnimation,
  packDuration,
  packAnimationWithDuration,
  getAnimationStyle,
  injectKeyframes,
  isAnimationSupported,
  getSupportedAnimations,
};