'use strict';

/**
 * 🐬 ub/spacing.js — Spacing & Layout Utilities for Dolphin Native
 */

const PX_MULTIPLIER = 4;
const GAP_MULTIPLIER = 4;
const BORDER_MULTIPLIER = 1;

function px(v) { return `${v * PX_MULTIPLIER}px`; }
function gapPx(v) { return `${v * GAP_MULTIPLIER}px`; }
function borderPx(v) { return `${v * BORDER_MULTIPLIER}px`; }

function parseSpacing(val) {
  if (typeof val === 'number') {
    return { t: val, r: val, b: val, l: val };
  }
  if (typeof val === 'string') {
    const parts = val.split(' ').map(p => parseInt(p, 10) || 0);
    if (parts.length === 1) return { t: parts[0], r: parts[0], b: parts[0], l: parts[0] };
    if (parts.length === 2) return { t: parts[0], r: parts[1], b: parts[0], l: parts[1] };
    if (parts.length === 4) return { t: parts[0], r: parts[1], b: parts[2], l: parts[3] };
  }
  return { t: 0, r: 0, b: 0, l: 0 };
}

module.exports = {
  px,
  gapPx,
  borderPx,
  parseSpacing
};
