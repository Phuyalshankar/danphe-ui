'use strict';

/**
 * 🌊 DolphinJS v4.0.0 — Main Entry Point
 *
 * Hybrid UI framework that compiles JSX/HTML to 16-byte Titan binary
 * and renders natively on Android devices via hot-reload TCP protocol.
 *
 * Usage:
 *   const dolphin = require('dolphin-native');
 *   const { Hardware, Camera, GPS } = require('dolphin-native/hardware');
 */

// Re-export everything from src/index.js
module.exports = require('./src/index.js');

// Named convenience exports
const { DolphinFramework, DolphinApp } = require('./src/framework/DolphinFramework');
const { DolphinRouter }                = require('./src/router/DolphinRouter');
const DolphinCompiler                  = require('./src/compiler/DolphinCompiler');

module.exports.DolphinFramework = DolphinFramework;
module.exports.DolphinApp       = DolphinApp;
module.exports.DolphinRouter    = DolphinRouter;
module.exports.DolphinCompiler  = DolphinCompiler;

/** Start the DolphinJS dev server programmatically */
module.exports.startServer = function(config = {}) {
    const { DevServer } = require('./src/runtime/DevServer');
    const server = new DevServer(config);
    server.start();
    return server;
};

/** Hardware API — all device sensors & capabilities */
const DolphinHardwareAPI = require('./src/hardware/DolphinHardwareAPI');
const hardwareFunc = function(category, sub, value, timeoutMs = 10000) {
    const app = global.dolphinApp;
    if (!app) {
        console.error('[Dolphin] Cannot call hardware: app instance not initialized.');
        return Promise.resolve(null);
    }
    
    return new Promise((resolve, reject) => {
        const fullAction = `hw:${category}:${sub}`;
        const responseAction = `hw_result:${fullAction}`;
        const deviceId = app.framework?.deviceContextStore?.getStore() || 'default';
        console.log(`[Dolphin Hardware] [Device: ${deviceId}] Invoking ${fullAction} with timeout: ${timeoutMs}ms`);
        
        const timeout = setTimeout(() => {
            if (app._actionHandlers.has(responseAction)) {
                app._actionHandlers.delete(responseAction);
            }
            console.error(`[Dolphin Hardware] [Device: ${deviceId}] ERROR: ${fullAction} TIMED OUT after ${timeoutMs}ms`);
            reject(new Error(`Hardware call ${fullAction} timed out`));
        }, timeoutMs);
        
        app.action(responseAction, (action, resultVal) => {
            clearTimeout(timeout);
            app._actionHandlers.delete(responseAction);
            console.log(`[Dolphin Hardware] [Device: ${deviceId}] SUCCESS: Received response for ${fullAction}`);
            
            try {
                const res = typeof resultVal === 'string' ? JSON.parse(resultVal) : resultVal;
                resolve(res);
            } catch (e) {
                resolve(resultVal);
            }
        });
        
        const payload = {
            action: `${category}:${sub}`,
            value: value
        };
        app.state('hw', JSON.stringify(payload));
    });
};
Object.assign(hardwareFunc, DolphinHardwareAPI);
module.exports.hardware = hardwareFunc;


/** Intercom API — HttpCall, VideoCall, Chat, Meeting, Group */
const _intercom = require('./src/intercom');
module.exports.Intercom  = _intercom.Intercom;
module.exports.HttpCall  = _intercom.HttpCall;
module.exports.VideoCall = _intercom.VideoCall;
module.exports.Chat      = _intercom.Chat;
module.exports.Meeting   = _intercom.Meeting;
module.exports.Group     = _intercom.Group;

/** Realtime API — WebSocketClient, RealtimeChannel, StreamManager */
const _realtime = require('./src/realtime');
module.exports.Realtime        = _realtime.Realtime;
module.exports.WebSocketClient = _realtime.WebSocketClient;
module.exports.RealtimeChannel = _realtime.RealtimeChannel;
module.exports.StreamManager   = _realtime.StreamManager;

/** IoT API — MQTTClient, TelemetryEncoder, DeviceRegistry */
const _iot = require('./src/iot');
module.exports.IoT              = _iot.IoT;
module.exports.MQTTClient       = _iot.MQTTClient;
module.exports.TelemetryEncoder = _iot.TelemetryEncoder;
module.exports.DeviceRegistry   = _iot.DeviceRegistry;

/** UI System — Animation, Theme, Gesture, Responsive */
const _ui2 = require('./src/ui');
module.exports.animate           = _ui2.animate;
module.exports.stagger           = _ui2.stagger;
module.exports.spring            = _ui2.spring;
module.exports.AnimationBuilder  = _ui2.AnimationBuilder;
module.exports.AnimPresets       = _ui2.AnimPresets;
module.exports.Theme             = _ui2.Theme;
module.exports.ThemeEngine       = _ui2.ThemeEngine;
module.exports.PALETTES          = _ui2.PALETTES;
module.exports.TYPOGRAPHY        = _ui2.TYPOGRAPHY;
module.exports.Gesture           = _ui2.Gesture;
module.exports.GestureRecognizer = _ui2.GestureRecognizer;
module.exports.Responsive        = _ui2.Responsive;
module.exports.ResponsiveContext  = _ui2.ResponsiveContext;
module.exports.BREAKPOINTS       = _ui2.BREAKPOINTS;

// Universal UB 2.0 Engine
module.exports.ub = require('./src/ub');
