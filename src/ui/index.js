'use strict';

const { animate, stagger, spring, AnimationBuilder, ANIM_CODES, EASING_CODES, Presets: AnimPresets } = require('./AnimationAPI');
const { Theme, ThemeEngine, PALETTES, TYPOGRAPHY, SPACING, ELEVATION, RADIUS }                        = require('./ThemeEngine');
const { Gesture, GestureRecognizer, GESTURE_CODES }                                                    = require('./GestureHandler');
const { Responsive, ResponsiveContext, ResponsiveGrid, BREAKPOINTS, DEVICE_CODES }                     = require('./ResponsiveLayout');
const UniversalUIImporter                                                                               = require('./UniversalUIImporter');
const { TitanIcon, PhoneIcon, ICONS, NAME_TO_ID, getIconSvg }                                           = require('./TitanIconBundle');

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

  // CDN importer
  UniversalUIImporter,

  // 👑 Master 255 Icon Bundle
  TitanIcon,
  PhoneIcon,
  ICONS,
  NAME_TO_ID,
  getIconSvg
};
