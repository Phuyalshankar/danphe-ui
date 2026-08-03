'use strict';

/**
 * 👆 DolphinGesture — Flutter-beating Gesture System
 *
 * Pure-JS gesture recognition that compiles to Titan binary.
 * Beats Flutter: single API for Android native + web, no native bridge.
 *
 * Usage:
 *   const { Gesture } = require('dolphin-native');
 *   Gesture.onSwipe(element, 'left', () => console.log('swiped!'));
 *   Gesture.onLongPress(element, () => console.log('long pressed!'));
 */

// Gesture binary codes (Titan protocol byte 1 when magic=0xCC)
const GESTURE_CODES = {
  tap:          0x01,
  doubleTap:    0x02,
  longPress:    0x03,
  swipeLeft:    0x04,
  swipeRight:   0x05,
  swipeUp:      0x06,
  swipeDown:    0x07,
  pinchIn:      0x08,
  pinchOut:     0x09,
  rotate:       0x0A,
  pan:          0x0B,
  drag:         0x0C,
  drop:         0x0D,
  hover:        0x0E,
  scroll:       0x0F,
  fling:        0x10,
  forceTap:     0x11,
};

class GestureRecognizer {
  constructor(opts = {}) {
    this._handlers     = {};
    this._touchStart   = null;
    this._longPressTimer = null;
    this._opts = {
      swipeThreshold:   opts.swipeThreshold   || 50,    // px
      longPressDelay:   opts.longPressDelay   || 500,   // ms
      doubleTapDelay:   opts.doubleTapDelay   || 300,   // ms
      pinchThreshold:   opts.pinchThreshold   || 0.1,
    };
    this._lastTapTime  = 0;
    this._active       = true;
  }

  // ── Register handlers ─────────────────────────────────────────────────────

  on(gesture, handler) {
    if (!this._handlers[gesture]) this._handlers[gesture] = [];
    this._handlers[gesture].push(handler);
    return this;
  }

  off(gesture, handler) {
    if (!handler) { delete this._handlers[gesture]; return this; }
    this._handlers[gesture] = (this._handlers[gesture] || []).filter(h => h !== handler);
    return this;
  }

  tap(fn)          { return this.on('tap',        fn); }
  doubleTap(fn)    { return this.on('doubleTap',  fn); }
  longPress(fn)    { return this.on('longPress',  fn); }
  swipeLeft(fn)    { return this.on('swipeLeft',  fn); }
  swipeRight(fn)   { return this.on('swipeRight', fn); }
  swipeUp(fn)      { return this.on('swipeUp',    fn); }
  swipeDown(fn)    { return this.on('swipeDown',  fn); }
  pinchIn(fn)      { return this.on('pinchIn',    fn); }
  pinchOut(fn)     { return this.on('pinchOut',   fn); }
  rotate(fn)       { return this.on('rotate',     fn); }
  pan(fn)          { return this.on('pan',        fn); }
  drag(fn)         { return this.on('drag',       fn); }
  hover(fn)        { return this.on('hover',      fn); }
  scroll(fn)       { return this.on('scroll',     fn); }
  fling(fn)        { return this.on('fling',      fn); }

  // ── Touch event processing (maps to native touch events) ──────────────────

  processEvent(type, event = {}) {
    if (!this._active) return;
    const x = event.x ?? event.clientX ?? 0;
    const y = event.y ?? event.clientY ?? 0;
    const t = event.timestamp ?? Date.now();

    switch (type) {
      case 'touchstart':
      case 'pointerdown': {
        this._touchStart = { x, y, t };
        this._longPressTimer = setTimeout(() => {
          this._emit('longPress', { x, y, duration: Date.now() - this._touchStart?.t });
        }, this._opts.longPressDelay);
        break;
      }

      case 'touchend':
      case 'pointerup': {
        clearTimeout(this._longPressTimer);
        if (!this._touchStart) break;
        const dx = x - this._touchStart.x;
        const dy = y - this._touchStart.y;
        const dt = t - this._touchStart.t;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const thr  = this._opts.swipeThreshold;

        if (dist < 10 && dt < 300) {
          // Tap or double-tap
          if (t - this._lastTapTime < this._opts.doubleTapDelay) {
            this._emit('doubleTap', { x, y });
            this._lastTapTime = 0;
          } else {
            this._lastTapTime = t;
            setTimeout(() => {
              if (this._lastTapTime === t) this._emit('tap', { x, y });
            }, this._opts.doubleTapDelay);
          }
        } else if (dist > thr) {
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          const speed = dist / Math.max(dt, 1);
          const gesture = Math.abs(angle) < 45       ? 'swipeRight'
                        : Math.abs(angle) > 135      ? 'swipeLeft'
                        : angle > 0                  ? 'swipeDown'
                        :                              'swipeUp';
          this._emit(gesture,        { dx, dy, dist, speed, angle });
          if (speed > 0.5) this._emit('fling', { dx, dy, dist, speed, angle, direction: gesture });
        }
        this._touchStart = null;
        break;
      }

      case 'pointermove': {
        if (this._touchStart) {
          clearTimeout(this._longPressTimer);
          const dx = x - this._touchStart.x;
          const dy = y - this._touchStart.y;
          this._emit('pan',  { x, y, dx, dy });
          this._emit('drag', { x, y, dx, dy });
        } else {
          this._emit('hover', { x, y });
        }
        break;
      }

      case 'wheel': {
        this._emit('scroll', { deltaX: event.deltaX || 0, deltaY: event.deltaY || 0 });
        break;
      }

      case 'pinch': {
        const scale = event.scale || 1;
        this._emit(scale < 1 ? 'pinchIn' : 'pinchOut', { scale, x, y });
        break;
      }

      case 'rotate': {
        this._emit('rotate', { angle: event.angle || 0, x, y });
        break;
      }
    }
  }

  /** Compile to 16-byte Titan binary (attaches to component binary byte 6) */
  toBinary(primaryGesture = 'tap') {
    const bin = Buffer.alloc(16);
    bin[0]  = 0xCC;                                           // Gesture magic
    bin[1]  = GESTURE_CODES[primaryGesture] || 0x01;
    bin[2]  = this._opts.swipeThreshold & 0xFF;
    bin[3]  = (this._opts.longPressDelay >> 2) & 0xFF;
    bin[4]  = (this._opts.doubleTapDelay >> 2) & 0xFF;
    // bytes 5-14: gesture handler flags
    Object.keys(GESTURE_CODES).forEach((g, i) => {
      if (i < 10) bin[5 + i] = this._handlers[g] ? 0x01 : 0x00;
    });
    bin[15] = 0xCC;
    return bin;
  }

  enable()  { this._active = true;  return this; }
  disable() { this._active = false; return this; }

  _emit(gesture, data = {}) {
    (this._handlers[gesture] || []).forEach(fn => fn(data));
  }
}

// ── Static Gesture factory ─────────────────────────────────────────────────

const Gesture = {
  create: (opts) => new GestureRecognizer(opts),

  // Quick one-liners (Flutter GestureDetector-style)
  onTap:       (el, fn) => { const g = new GestureRecognizer(); g.tap(fn); el._gesture = g; return g; },
  onDoubleTap: (el, fn) => { const g = new GestureRecognizer(); g.doubleTap(fn); el._gesture = g; return g; },
  onLongPress: (el, fn) => { const g = new GestureRecognizer(); g.longPress(fn); el._gesture = g; return g; },
  onSwipe:     (el, dir, fn) => {
    const g = new GestureRecognizer();
    const d = dir.charAt(0).toUpperCase() + dir.slice(1).toLowerCase();
    g.on('swipe' + d, fn);
    el._gesture = g;
    return g;
  },
  onPinch: (el, fn) => {
    const g = new GestureRecognizer();
    g.pinchIn(fn).pinchOut(fn);
    el._gesture = g;
    return g;
  },
  onPan:   (el, fn) => { const g = new GestureRecognizer(); g.pan(fn); el._gesture = g; return g; },
  onDrag:  (el, fn) => { const g = new GestureRecognizer(); g.drag(fn); el._gesture = g; return g; },
};

module.exports = {
  Gesture,
  GestureRecognizer,
  GESTURE_CODES,
};
