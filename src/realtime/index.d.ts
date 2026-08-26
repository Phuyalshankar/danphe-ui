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
import WebSocketClient from './WebSocketClient';
import RealtimeChannel from './RealtimeChannel';
import StreamManager from './StreamManager';
import { WebSocketClientConfig, RealtimeChannelConfig } from './types';
declare const _default: {
    WebSocketClient: typeof WebSocketClient;
    RealtimeChannel: typeof RealtimeChannel;
    StreamManager: typeof StreamManager;
    version: string;
    createClient: (url: string, opts?: WebSocketClientConfig) => WebSocketClient;
    createChannel: (name: string, opts?: RealtimeChannelConfig) => RealtimeChannel;
    createStreamManager: () => StreamManager;
} & {
    Realtime: {
        WebSocketClient: typeof WebSocketClient;
        RealtimeChannel: typeof RealtimeChannel;
        StreamManager: typeof StreamManager;
        version: string;
        createClient: (url: string, opts?: WebSocketClientConfig) => WebSocketClient;
        createChannel: (name: string, opts?: RealtimeChannelConfig) => RealtimeChannel;
        createStreamManager: () => StreamManager;
    };
    WebSocketClient: typeof WebSocketClient;
    RealtimeChannel: typeof RealtimeChannel;
    StreamManager: typeof StreamManager;
};
export = _default;
//# sourceMappingURL=index.d.ts.map