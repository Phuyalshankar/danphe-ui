"use strict";
/**
 * 🌊 DolphinRealtime — Unified Realtime Module
 *
 * Better than Flutter for realtime communication:
 *   - WebSocketClient  → Binary WS with multiplexing, auto-reconnect, heartbeat
 *   - RealtimeChannel  → Pub/sub with wildcard, history, dedup, priority
 *   - StreamManager    → High-throughput sensor/camera/audio binary streaming
 *
 * Usage:
 *   const { Realtime } = require('dolphin-realtime');
 *   const ws = Realtime.createClient('ws://your-server');
 *   ws.subscribe('sensor:temp', data => console.log(data));
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const WebSocketClient_1 = __importDefault(require("./WebSocketClient"));
const RealtimeChannel_1 = __importDefault(require("./RealtimeChannel"));
const StreamManager_1 = __importDefault(require("./StreamManager"));
const Realtime = {
    WebSocketClient: WebSocketClient_1.default,
    RealtimeChannel: RealtimeChannel_1.default,
    StreamManager: StreamManager_1.default,
    version: '4.0.0',
    createClient: (url, opts = {}) => {
        const client = new WebSocketClient_1.default({ url, ...opts });
        client.connect();
        return client;
    },
    createChannel: (name, opts = {}) => new RealtimeChannel_1.default({ name, ...opts }),
    createStreamManager: () => new StreamManager_1.default(),
};
module.exports = Object.assign(Realtime, {
    Realtime,
    WebSocketClient: WebSocketClient_1.default,
    RealtimeChannel: RealtimeChannel_1.default,
    StreamManager: StreamManager_1.default,
});
//# sourceMappingURL=index.js.map