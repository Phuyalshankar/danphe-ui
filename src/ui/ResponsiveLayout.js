'use strict';

/**
 * 📱 DolphinResponsive — Flutter-beating Responsive/Adaptive Layout
 *
 * Phone / Tablet / Desktop auto-layout. Breakpoint-based, zero-dep.
 * Better than Flutter LayoutBuilder: declarative API + Titan binary.
 *
 * Usage:
 *   const { Responsive } = require('dolphin-native');
 *   const layout = Responsive.choose({ phone: PhoneUI, tablet: TabletUI });
 */

// Breakpoints (dp) — matches Bootstrap + Flutter defaults
const BREAKPOINTS = {
  xs:    0,
  sm:    576,
  md:    768,
  lg:    992,
  xl:    1200,
  xxl:   1400,
  // Named aliases
  phone:   0,
  phablet: 480,
  tablet:  768,
  desktop: 1200,
  tv:      1920,
};

// Device class binary codes (Titan protocol byte 1 when magic=0xDD)
const DEVICE_CODES = {
  phone:   0x01,
  phablet: 0x02,
  tablet:  0x03,
  desktop: 0x04,
  tv:      0x05,
};

// Orientation codes
const ORIENTATION_CODES = {
  portrait:  0x01,
  landscape: 0x02,
};

class ResponsiveContext {
  constructor(opts = {}) {
    this._width       = opts.width       || 390;     // default phone width (dp)
    this._height      = opts.height      || 844;
    this._orientation = opts.orientation || (this._width > this._height ? 'landscape' : 'portrait');
    this._pixelRatio  = opts.pixelRatio  || 3;
    this._platform    = opts.platform    || 'android';
    this._listeners   = [];
  }

  // ── Breakpoint helpers ────────────────────────────────────────────────────

  get isPhone()   { return this._width < 480;  }
  get isPhablet() { return this._width >= 480 && this._width < 768; }
  get isTablet()  { return this._width >= 768 && this._width < 1200; }
  get isDesktop() { return this._width >= 1200; }
  get isTV()      { return this._width >= 1920; }

  get isPortrait()  { return this._orientation === 'portrait'; }
  get isLandscape() { return this._orientation === 'landscape'; }

  get deviceClass() {
    if (this._width < 480)  return 'phone';
    if (this._width < 768)  return 'phablet';
    if (this._width < 1200) return 'tablet';
    if (this._width < 1920) return 'desktop';
    return 'tv';
  }

  get width()  { return this._width; }
  get height() { return this._height; }

  /** Flutter MediaQuery.of(context).size parity */
  get size() { return { width: this._width, height: this._height }; }

  /** CSS vw/vh equivalent — fraction of screen */
  vw(fraction) { return this._width  * fraction; }
  vh(fraction) { return this._height * fraction; }

  /** Responsive value — pick based on current breakpoint */
  value(opts = {}) {
    if (this.isTV      && opts.tv)      return opts.tv;
    if (this.isDesktop && opts.desktop) return opts.desktop;
    if (this.isTablet  && opts.tablet)  return opts.tablet;
    if (this.isPhablet && opts.phablet) return opts.phablet;
    return opts.phone ?? opts.default ?? opts[Object.keys(opts)[0]];
  }

  /**
   * Choose component/layout based on device
   * Flutter LayoutBuilder parity
   */
  choose(opts = {}) {
    return this.value(opts);
  }

  /** Column count for Grid — smart defaults */
  gridColumns(opts = {}) {
    return this.value({
      phone:   opts.phone   || 1,
      phablet: opts.phablet || 2,
      tablet:  opts.tablet  || 3,
      desktop: opts.desktop || 4,
      tv:      opts.tv      || 6,
      ...opts,
    });
  }

  /** Font scale factor (accessibility + display) */
  fontScale(base = 14) {
    const factor = this.isTV ? 1.5 : this.isDesktop ? 1.2 : this.isTablet ? 1.1 : 1.0;
    return Math.round(base * factor);
  }

  /** Adaptive spacing multiplier */
  spacing(base = 16) {
    const factor = this.isTablet ? 1.5 : this.isDesktop ? 2.0 : 1.0;
    return Math.round(base * factor);
  }

  /** Update screen dimensions (call on orientation change) */
  update(width, height, orientation) {
    this._width       = width;
    this._height      = height;
    this._orientation = orientation || (width > height ? 'landscape' : 'portrait');
    this._notify();
    return this;
  }

  onChange(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(f => f !== fn); };
  }

  /** Compile to 16-byte Titan binary */
  toBinary() {
    const bin = Buffer.alloc(16);
    bin[0]  = 0xDD;                                               // Responsive magic
    bin[1]  = DEVICE_CODES[this.deviceClass] || 0x01;
    bin[2]  = ORIENTATION_CODES[this._orientation] || 0x01;
    bin[3]  = (this._width  >> 2) & 0xFF;                        // Width  / 4
    bin[4]  = (this._height >> 2) & 0xFF;                        // Height / 4
    bin[5]  = Math.round(this._pixelRatio * 10) & 0xFF;
    bin[6]  = this.gridColumns() & 0xFF;
    bin[7]  = this.isTablet ? 0x01 : 0x00;
    bin[8]  = this.isDesktop ? 0x01 : 0x00;
    bin[9]  = Math.round(this.fontScale() / 2) & 0xFF;
    bin[10] = this.spacing() & 0xFF;
    bin[11] = 0x00;
    bin[12] = 0x00;
    bin[13] = 0x00;
    bin[14] = 0x00;
    bin[15] = 0xDD;
    return bin;
  }

  _notify() { this._listeners.forEach(fn => fn(this)); }
}

// ── Responsive static helpers ──────────────────────────────────────────────

class ResponsiveGrid {
  constructor(ctx) { this._ctx = ctx; }

  columns(opts) { return this._ctx.gridColumns(opts); }

  itemWidth(gap = 16, opts = {}) {
    const cols = this.columns(opts);
    return Math.floor((this._ctx.width - gap * (cols + 1)) / cols);
  }
}

// Default context (server-side defaults to phone)
const defaultContext = new ResponsiveContext({ width: 390, height: 844 });

const Responsive = {
  // Factory
  create: (opts) => new ResponsiveContext(opts),

  // Default context helpers
  get context() { return defaultContext; },

  choose:      (opts)        => defaultContext.choose(opts),
  value:       (opts)        => defaultContext.value(opts),
  gridColumns: (opts)        => defaultContext.gridColumns(opts),
  fontScale:   (base)        => defaultContext.fontScale(base),
  spacing:     (base)        => defaultContext.spacing(base),

  // Breakpoint checkers
  isPhone:     ()            => defaultContext.isPhone,
  isTablet:    ()            => defaultContext.isTablet,
  isDesktop:   ()            => defaultContext.isDesktop,
  isPortrait:  ()            => defaultContext.isPortrait,
  isLandscape: ()            => defaultContext.isLandscape,
  deviceClass: ()            => defaultContext.deviceClass,

  // Grid
  grid:        ()            => new ResponsiveGrid(defaultContext),

  // Named breakpoints for inline use
  BREAKPOINTS,
  DEVICE_CODES,
};

module.exports = {
  Responsive,
  ResponsiveContext,
  ResponsiveGrid,
  BREAKPOINTS,
  DEVICE_CODES,
};
