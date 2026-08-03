'use strict';

/**
 * 🌊 DolphinUI — Complete UI Module
 *
 * Bootstrap/MUI supported via CDN (UniversalUIImporter.setCDNs).
 * All modules compile to Titan 16-byte binary for Android native rendering.
 *
 * Usage:
 *   const { animate, Theme, Gesture, Responsive } = require('dolphin-native');
 */

const { animate, stagger, spring, AnimationBuilder, ANIM_CODES, EASING_CODES, Presets: AnimPresets } = require('./AnimationAPI');
const { Theme, ThemeEngine, PALETTES, TYPOGRAPHY, SPACING, ELEVATION, RADIUS }                        = require('./ThemeEngine');
const { Gesture, GestureRecognizer, GESTURE_CODES }                                                    = require('./GestureHandler');
const { Responsive, ResponsiveContext, ResponsiveGrid, BREAKPOINTS, DEVICE_CODES }                     = require('./ResponsiveLayout');
const UniversalUIImporter                                                                               = require('./UniversalUIImporter');

module.exports = {
  // Animation
  animate,
  stagger,
  spring,
  AnimationBuilder,
  ANIM_CODES,
  EASING_CODES,
  AnimPresets,

  // Theme
  Theme,
  ThemeEngine,
  PALETTES,
  TYPOGRAPHY,
  SPACING,
  ELEVATION,
  RADIUS,

  // Gesture
  Gesture,
  GestureRecognizer,
  GESTURE_CODES,

  // Responsive
  Responsive,
  ResponsiveContext,
  ResponsiveGrid,
  BREAKPOINTS,
  DEVICE_CODES,

  // CDN importer (Bootstrap, MUI, Tailwind)
  UniversalUIImporter,
};
