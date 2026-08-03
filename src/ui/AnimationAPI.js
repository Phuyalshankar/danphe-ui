'use strict';

/**
 * 🎬 DolphinAnimation — Flutter-beating Animation API
 *
 * Zero-dep, runs on Android native via Titan binary animation codes.
 * Beats Flutter: declarative chainable API, physics-based springs, stagger.
 *
 * Usage:
 *   const { animate } = require('dolphin-native');
 *   animate(el, { type: 'spring', to: { y: -100 }, duration: 400 });
 */

// Animation type binary codes (Titan protocol byte 6)
const ANIM_CODES = {
  none:          0x00,
  fade:          0x01,
  fadeIn:        0x01,
  fadeOut:       0x02,
  slideUp:       0x03,
  slideDown:     0x04,
  slideLeft:     0x05,
  slideRight:    0x06,
  scale:         0x07,
  scaleIn:       0x07,
  scaleOut:      0x08,
  rotate:        0x09,
  bounce:        0x0A,
  spring:        0x0B,
  shake:         0x0C,
  pulse:         0x0D,
  flip:          0x0E,
  zoom:          0x0F,
  ripple:        0x10,
  morphWidth:    0x11,
  morphHeight:   0x12,
  stagger:       0x13,
  hero:          0x14,
  parallax:      0x15,
  elastic:       0x16,
  swing:         0x17,
  heartbeat:     0x18,
  flash:         0x19,
  tada:          0x1A,
};

// Easing binary codes (Titan protocol byte 7)
const EASING_CODES = {
  linear:       0x00,
  easeIn:       0x01,
  easeOut:      0x02,
  easeInOut:    0x03,
  spring:       0x04,
  bounce:       0x05,
  elastic:      0x06,
  back:         0x07,
  expo:         0x08,
  circ:         0x09,
  quad:         0x0A,
  cubic:        0x0B,
  quart:        0x0C,
  quint:        0x0D,
};

class AnimationBuilder {
  constructor(config = {}) {
    this._steps  = [];
    this._config = {
      duration:  config.duration  || 300,
      easing:    config.easing    || 'easeInOut',
      delay:     config.delay     || 0,
      repeat:    config.repeat    || 0,     // 0 = once, -1 = infinite
      yoyo:      config.yoyo      || false,
      stagger:   config.stagger   || 0,
    };
  }

  // ── Chainable API ─────────────────────────────────────────────────────────

  fade(from = 0, to = 1, opts = {})       { return this._add('fade',      { from, to, ...opts }); }
  fadeIn(opts = {})                        { return this._add('fadeIn',    { from: 0, to: 1, ...opts }); }
  fadeOut(opts = {})                       { return this._add('fadeOut',   { from: 1, to: 0, ...opts }); }
  slideUp(distance = 100, opts = {})       { return this._add('slideUp',   { distance, ...opts }); }
  slideDown(distance = 100, opts = {})     { return this._add('slideDown', { distance, ...opts }); }
  slideLeft(distance = 100, opts = {})     { return this._add('slideLeft', { distance, ...opts }); }
  slideRight(distance = 100, opts = {})    { return this._add('slideRight',{ distance, ...opts }); }
  scale(from = 0, to = 1, opts = {})       { return this._add('scale',     { from, to, ...opts }); }
  scaleIn(opts = {})                       { return this._add('scaleIn',   { from: 0, to: 1, ...opts }); }
  scaleOut(opts = {})                      { return this._add('scaleOut',  { from: 1, to: 0, ...opts }); }
  rotate(degrees = 360, opts = {})         { return this._add('rotate',    { degrees, ...opts }); }
  bounce(opts = {})                        { return this._add('bounce',    opts); }
  spring(to = {}, opts = {})               { return this._add('spring',    { to, tension: 170, friction: 26, ...opts }); }
  shake(opts = {})                         { return this._add('shake',     { amplitude: 10, ...opts }); }
  pulse(opts = {})                         { return this._add('pulse',     opts); }
  flip(axis = 'x', opts = {})             { return this._add('flip',      { axis, ...opts }); }
  zoom(factor = 1.2, opts = {})            { return this._add('zoom',      { factor, ...opts }); }
  ripple(origin = { x: 0.5, y: 0.5 }, opts = {}) { return this._add('ripple', { origin, ...opts }); }
  hero(tag, opts = {})                     { return this._add('hero',      { tag, ...opts }); }
  stagger(children, delay = 50, opts = {}) { return this._add('stagger',   { children, delay, ...opts }); }
  elastic(opts = {})                       { return this._add('elastic',   opts); }
  tada(opts = {})                          { return this._add('tada',      opts); }
  heartbeat(opts = {})                     { return this._add('heartbeat', opts); }

  /** Delay next step by `ms` milliseconds */
  wait(ms) {
    this._steps.push({ type: 'wait', duration: ms });
    return this;
  }

  /** Apply to a component JSX object or binary */
  to(target) {
    const binary = this.toBinary();
    if (target && typeof target === 'object') {
      target._animation = { steps: this._steps, config: this._config, binary };
    }
    return { target, animation: this, binary };
  }

  // ── Output ────────────────────────────────────────────────────────────────

  /** Compile animation to 16-byte Titan binary */
  toBinary() {
    const bin = Buffer.alloc(16);
    const step = this._steps[0] || { type: 'none' };
    bin[0]  = 0xAA;                                         // Animation magic
    bin[1]  = ANIM_CODES[step.type] ?? 0x00;               // Anim type
    bin[2]  = Math.min(this._config.duration >> 3, 0xFF);  // Duration (×8ms)
    bin[3]  = EASING_CODES[this._config.easing]  ?? 0x03;  // Easing
    bin[4]  = Math.min(this._config.delay >> 2,   0xFF);   // Delay (×4ms)
    bin[5]  = this._config.repeat === -1 ? 0xFF : Math.min(this._config.repeat, 0xFE);
    bin[6]  = this._config.yoyo ? 0x01 : 0x00;
    bin[7]  = Math.min(this._steps.length, 0xFF);           // Step count
    bin[8]  = Math.min(this._config.stagger >> 1, 0xFF);   // Stagger (×2ms)
    bin[9]  = step.from != null  ? Math.round(step.from * 255) : 0x00;
    bin[10] = step.to != null    ? Math.round(step.to   * 255) : 0xFF;
    bin[11] = step.distance != null ? Math.min(step.distance, 0xFF) : 0x00;
    bin[12] = step.degrees != null  ? Math.min(step.degrees & 0xFF, 0xFF) : 0x00;
    bin[13] = step.factor != null   ? Math.round(step.factor * 100) : 0x00;
    bin[14] = 0x00;
    bin[15] = 0xAA;                                         // End magic
    return bin;
  }

  toJSON() {
    return { steps: this._steps, config: this._config };
  }

  toString() {
    const types = this._steps.map(s => s.type).join(' → ');
    return `DolphinAnimation[${types || 'empty'}]`;
  }

  // ── Private ───────────────────────────────────────────────────────────────

  _add(type, props = {}) {
    this._steps.push({ type, ...props });
    return this;
  }
}

// ── Static factory functions ───────────────────────────────────────────────

function animate(opts = {}) {
  return new AnimationBuilder(opts);
}

function stagger(children = [], delay = 50, opts = {}) {
  const b = new AnimationBuilder(opts);
  b.stagger(children, delay);
  return b;
}

function spring(config = {}) {
  return new AnimationBuilder().spring({}, config);
}

// Preset animations (Flutter MotionSpec equivalents)
const Presets = {
  enterScreen:  () => animate({ duration: 300 }).fadeIn().slideUp(20),
  exitScreen:   () => animate({ duration: 250 }).fadeOut().slideDown(20),
  tapFeedback:  () => animate({ duration: 150 }).scale(1, 0.96).spring().scale(0.96, 1),
  listItem:     () => animate({ duration: 400, easing: 'elastic' }).fadeIn().slideRight(40),
  alert:        () => animate({ duration: 200 }).shake({ amplitude: 6 }),
  success:      () => animate({ duration: 600 }).tada(),
  loading:      () => animate({ repeat: -1, duration: 1000 }).pulse(),
  heroTransit:  (tag) => animate({ duration: 350, easing: 'easeInOut' }).hero(tag),
};

module.exports = {
  animate,
  stagger,
  spring,
  AnimationBuilder,
  ANIM_CODES,
  EASING_CODES,
  Presets,
};
