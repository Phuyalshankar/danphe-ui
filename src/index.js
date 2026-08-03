'use strict';

// Core modules
const DolphinCSS = require('./core/DolphinCSS');
const BinStore = require('./store/BinStore');
const LightBinStore = require('./store/LightBinStore');
const { defineStore } = require('./store/defineStore');
const DolphinNanoStore = require('./store/DolphinNanoStore');
const { definePage, defineControllerPage } = require('./store/definePage');
const DolphinCompiler = require('./compiler/DolphinCompiler');
const HTMLParser = require('./parser/HTMLParser');
const HybridParser = require('./parser/HybridParser');
const DolphinError = require('./errors/DolphinError');
const AlignmentUtils = require('./utils/AlignmentUtils');

// Framework modules
const DolphinFramework = require('./framework/DolphinFramework');
const { DolphinRouter } = require('./router/DolphinRouter');
const UniversalUIImporter = require('./ui/UniversalUIImporter');
const Integration = require('./integration');

// Constants
const { MAPPING } = require('./constants/mappings');
const { MAGIC_BYTES, PLATFORM_CONFIG } = require('./constants/platforms');
const { VERSION, DEFAULT_CONFIG } = require('./constants/defaults');

module.exports = {
    // Core
    DolphinCSS,
    BinStore,
    LightBinStore,
    DolphinCompiler,
    HTMLParser,
    HybridParser,
    DolphinError,
    AlignmentUtils,
    get DolphinCLI() { return require('./cli/DolphinCLI'); },
    
    // Framework
    DolphinFramework,
    DolphinRouter,
    UniversalUIImporter,
    Integration,
    get DolphinWebEngine() { return require('./web/DolphinWebEngine'); },
    get DolphinWebStore() { return require('./web/DolphinWebStore'); },
    
    // Components
    ...components,
    
    // Constants
    MAPPING,
    VERSION,
    DEFAULT_CONFIG,
    MAGIC_BYTES,
    PLATFORM_CONFIG,
    
    // Factory
    create: (config) => new DolphinCSS(config),
    createApp: (config) => DolphinFramework.DolphinFramework.createApp(config),
    createBinStore: (config) => new LightBinStore(config),
    createRouter: (config) => new DolphinRouter(config),
    defineStore,
    definePage,
    defineControllerPage,
    createNanoStore: DolphinNanoStore.createStore,
    createStore: DolphinNanoStore.createStore,
    atom: DolphinNanoStore.atom,
    
    // Utilities
    compileForPlatform: (html, platform, options = {}) => {
        const i = new DolphinCSS({ ...options, platform });
        const r = i.compileForPlatform(html, platform, options);
        i.destroy();
        return r;
    },
    
    toCHeader: (binary, name, options = {}) => {
        const i = new DolphinCSS(options);
        const r = i.toCHeader(binary, name, options);
        i.destroy();
        return r;
    },
    
    compileHTML: (html, options = {}) => {
        const i = new DolphinCSS(options);
        const r = i.compile(html, options);
        i.destroy();
        return r;
    },
    
    parseBinary: (binary, options = {}) => {
        const i = new DolphinCSS(options);
        const r = i.parse(binary, options);
        i.destroy();
        return r;
    },
    
    version: VERSION,
    platforms: Object.keys(PLATFORM_CONFIG),
    
    health: () => ({
        status: 'OK',
        version: VERSION,
        timestamp: new Date().toISOString(),
        crossPlatform: true,
        supportedPlatforms: Object.keys(PLATFORM_CONFIG)
    })
};
// ── Intercom ──────────────────────────────────────────────────────────────────
const Intercom = require('./intercom');
module.exports.Intercom  = Intercom.Intercom;
module.exports.HttpCall  = Intercom.HttpCall;
module.exports.VideoCall = Intercom.VideoCall;
module.exports.Chat      = Intercom.Chat;
module.exports.Meeting   = Intercom.Meeting;
module.exports.Group     = Intercom.Group;

// ── Realtime ──────────────────────────────────────────────────────────────────
const Realtime = require('./realtime');
module.exports.Realtime        = Realtime.Realtime;
module.exports.WebSocketClient = Realtime.WebSocketClient;
module.exports.RealtimeChannel = Realtime.RealtimeChannel;
module.exports.StreamManager   = Realtime.StreamManager;

// ── IoT ───────────────────────────────────────────────────────────────────────
const IoT = require('./iot');
module.exports.IoT              = IoT.IoT;
module.exports.MQTTClient       = IoT.MQTTClient;
module.exports.TelemetryEncoder = IoT.TelemetryEncoder;
module.exports.DeviceRegistry   = IoT.DeviceRegistry;

// ── UI System (Animation + Theme + Gesture + Responsive) ──────────────────
const _ui = require('./ui');
module.exports.animate          = _ui.animate;
module.exports.stagger          = _ui.stagger;
module.exports.spring           = _ui.spring;
module.exports.AnimationBuilder = _ui.AnimationBuilder;
module.exports.AnimPresets      = _ui.AnimPresets;
module.exports.Theme            = _ui.Theme;
module.exports.ThemeEngine      = _ui.ThemeEngine;
module.exports.PALETTES         = _ui.PALETTES;
module.exports.TYPOGRAPHY       = _ui.TYPOGRAPHY;
module.exports.Gesture          = _ui.Gesture;
module.exports.GestureRecognizer= _ui.GestureRecognizer;
module.exports.Responsive       = _ui.Responsive;
module.exports.ResponsiveContext = _ui.ResponsiveContext;
module.exports.BREAKPOINTS      = _ui.BREAKPOINTS;
