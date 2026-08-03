'use strict';

/**
 * 🐬 ub/animations.js — Binary Animation Packer & Keyframe Injector
 */

const ANIMATION_MAP = {
  none: 0x00, fade: 0x01, slide: 0x02, scale: 0x03, rotate: 0x04, bounce: 0x05, pulse: 0x06
};

function packAnimation(anim) {
  if (!anim) return 0x00;
  if (typeof anim === 'number') return anim & 0xFF;
  if (typeof anim === 'string') {
    const key = anim.toLowerCase().split('-')[0];
    return ANIMATION_MAP[key] || 0x00;
  }
  return 0x00;
}

function injectKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('dolphin-keyframes')) return;
  const styleEl = document.createElement('style');
  styleEl.id = 'dolphin-keyframes';
  styleEl.textContent = `
    @keyframes dolphinPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    @keyframes dolphinSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `;
  document.head.appendChild(styleEl);
}

module.exports = {
  ANIMATION_MAP,
  packAnimation,
  injectKeyframes
};
