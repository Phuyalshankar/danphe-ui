'use strict';

const WebSocket = require('ws');

/**
 * 🌊 DolphinRealtimeEngine
 * Enterprise-grade robust WebSocket client for Dolphin Native.
 * Features Exponential Backoff with Jitter, Heartbeat Ping/Pong, RTT Latency checks,
 * Offline Message Buffering, and Auto Subscription Recovery.
 */
class DolphinRealtimeEngine {
    constructor(app, deviceId = 'default') {
        this.app = app;
        this.contextDeviceId = deviceId;
        
        // Connection config
        this.ws = null;
        this.deviceId = null;
        this.originalUrl = null;
        this.wsUrl = null;
        
        // Status flags
        this.isConnected = false;
        this.isReconnecting = false;
        this.reconnectCount = 0;
        
        // Robustness parameters
        this.reconnectInterval = 1500;        // Base delay (1.5s)
        this.maxReconnectInterval = 12000;    // Cap delay (12s)
        this.reconnectMultiplier = 1.6;       // Delay backoff rate
        this.pingInterval = 30000;            // Heartbeat send frequency (30s)
        this.pongTimeout = 15000;             // Heartbeat timeout limit (15s)
        this.maxQueueSize = 300;              // Max offline buffer messages
        
        // Timers & Metrics
        this.pingTimer = null;
        this.pongTimer = null;
        this.reconnectTimer = null;
        this.heartbeatSentTime = 0;
        this.latency = 0;
        
        // State storage
        this.messageQueue = [];
        this.subscribers = new Map();         // topic -> Set<callbacks>
        this.activeSubscriptions = new Set(); // set of subscribed topics
        this.listeners = new Map();           // eventName -> Set<callbacks>
        
        this._log('⚡ DolphinRealtimeEngine initialized');
    }

    // ─────────────────────────────────────────────────────
    // EVENT EMITTER IMPLEMENTATION
    // ─────────────────────────────────────────────────────

    on(event, fn) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(fn);
        return this;
    }

    off(event, fn) {
        if (this.listeners.has(event)) {
            if (fn) {
                this.listeners.get(event).delete(fn);
            } else {
                this.listeners.delete(event);
            }
        }
        return this;
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(fn => {
                try {
                    const ctxStore = this.app.framework.deviceContextStore;
                    if (ctxStore) {
                        ctxStore.run(this.contextDeviceId || 'default', () => {
                            fn(data);
                        });
                    } else {
                        fn(data);
                    }
                } catch (err) {
                    this._log(`Error in event listener for "${event}":`, err.message);
                }
            });
        }
    }

    // ─────────────────────────────────────────────────────
    // CONNECTION LIFE CYCLE
    // ─────────────────────────────────────────────────────

    /**
     * Connect to Dolphin WebSocket Server with Dynamic Protocol/URL parsing.
     * @param {string} serverUrl - HTTP/HTTPS/WS/WSS server url
     * @param {string} deviceId - Extension/device identifier
     */
    connect(serverUrl, deviceId, token = null) {
        if (!serverUrl || !deviceId) {
            this._log('❌ Connection failed: serverUrl and deviceId are required');
            return;
        }

        this.originalUrl = serverUrl;
        this.deviceId = deviceId;
        this.token = token;
        this.wsUrl = this.parseServerUrl(serverUrl, deviceId, token);

        this._log(`⏳ Connecting to WebSocket: ${this.wsUrl}`);
        this.emit('connecting', this.wsUrl);

        try {
            // Clean up any old socket
            if (this.ws) {
                this.ws.removeAllListeners();
                try { this.ws.close(); } catch (_) {}
            }

            this.ws = new WebSocket(this.wsUrl);

            this.ws.on('open', () => {
                this._log(`✅ Connected successfully to ${this.wsUrl}`);
                this.isConnected = true;
                this.reconnectCount = 0;
                
                this.emit('connected');
                
                // Restore active pub/sub topics
                this.restoreSubscriptions();
                
                // Flush buffered offline messages
                this.flushQueue();
                
                // Start heartbeat pings
                this.startHeartbeat();
            });

            this.ws.on('message', (data) => {
                this.handleMessage(data);
            });

            this.ws.on('close', (code, reason) => {
                this._log(`🔌 Connection closed (Code: ${code}, Reason: ${reason || 'None'})`);
                if (code === 4000 || code === 4001) {
                    this._log(`❌ Auth failed on Signaling WebSocket (Code: ${code}). Stopping reconnection.`);
                    this.isConnected = false;
                    this.emit('disconnected');
                    return;
                }
                this.reconnect();
            });

            this.ws.on('error', (err) => {
                this._log('❌ WebSocket Error:', err.message);
                this.emit('error', err);
                // Close triggers reconnect
            });

        } catch (e) {
            this._log('❌ Socket instantiation error:', e.message);
            this.reconnect();
        }
    }

    /**
     * Disconnect cleanly and wipe all retry mechanisms.
     */
    disconnect() {
        this._log('🔌 Disconnection commanded.');
        this.clearTimers();
        this.reconnectCount = 0;
        this.isReconnecting = false;
        
        if (this.ws) {
            try {
                this.ws.removeAllListeners();
                this.ws.on('error', () => {}); // Catch any error thrown during close
                this.ws.close();
            } catch (_) {}
            this.ws = null;
        }
        this.isConnected = false;
        this.emit('disconnected');
    }

    /**
     * Trigger Exponential Backoff reconnection with Jitter.
     */
    reconnect() {
        if (this.isReconnecting) return;
        this.isReconnecting = true;
        this.isConnected = false;
        this.emit('disconnected');
        
        this.clearTimers();

        // Calculate backoff delay
        const delay = Math.min(
            this.reconnectInterval * Math.pow(this.reconnectMultiplier, this.reconnectCount),
            this.maxReconnectInterval
        );
        // Add random jitter (0 to 500ms) to prevent synchronization issues
        const jitter = Math.random() * 500;
        const totalDelay = delay + jitter;

        this._log(`🔄 Attempting reconnect in ${(totalDelay / 1000).toFixed(2)} seconds (Attempt ${this.reconnectCount + 1})...`);
        
        this.reconnectTimer = setTimeout(() => {
            this.reconnectCount++;
            this.isReconnecting = false;
            this.connect(this.originalUrl, this.deviceId, this.token);
        }, totalDelay);
    }

    // ─────────────────────────────────────────────────────
    // HEARTBEAT PROTOCOL (RTT LATENCY MONITOR)
    // ─────────────────────────────────────────────────────

    startHeartbeat() {
        this.clearHeartbeatTimers();

        this.pingTimer = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.heartbeatSentTime = Date.now();
                this.ws.send(JSON.stringify({ type: 'HEARTBEAT' }));

                // Set pong timeout listener
                this.pongTimer = setTimeout(() => {
                    this._log('⚠️ Heartbeat response timeout (5s). Assuming connection lost.');
                    this.terminateConnection();
                }, this.pongTimeout);
            }
        }, this.pingInterval);
    }

    handleHeartbeatAck() {
        clearTimeout(this.pongTimer);
        const rtt = Date.now() - this.heartbeatSentTime;
        this.latency = rtt;
        this.emit('latency', rtt);
        this._log(`⏱️ Latency RTT: ${rtt}ms`);
    }

    terminateConnection() {
        if (this.ws) {
            try {
                this.ws.terminate(); // Node-ws method to immediately close socket (forces reconnect)
            } catch (_) {
                this.reconnect();
            }
        } else {
            this.reconnect();
        }
    }

    // ─────────────────────────────────────────────────────
    // MESSAGE BUFFER & QUEUE HANDLING
    // ─────────────────────────────────────────────────────

    /**
     * Send payload or buffer if offline.
     * @param {object} msg - The JSON-serializable message object
     */
    sendRaw(msg) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            try {
                this.ws.send(JSON.stringify(msg));
                return true;
            } catch (err) {
                this._log('❌ Failed sending payload:', err.message);
            }
        }

        // Buffer offline
        if (this.messageQueue.length < this.maxQueueSize) {
            this.messageQueue.push(msg);
        } else {
            this.messageQueue.shift(); // Drop oldest
            this.messageQueue.push(msg);
            this._log('⚠️ Offline buffer full, dropped oldest signal.');
        }
        
        this._log(`📥 Buffered offline command: ${msg.type || msg.topic}`);
        return false;
    }

    flushQueue() {
        if (this.messageQueue.length === 0) return;
        this._log(`📤 Flushing ${this.messageQueue.length} buffered offline signals...`);
        
        while (this.messageQueue.length > 0 && this.ws && this.ws.readyState === WebSocket.OPEN) {
            const msg = this.messageQueue.shift();
            this.sendRaw(msg);
        }
    }

    // ─────────────────────────────────────────────────────
    // PUB/SUB PROTOCOL
    // ─────────────────────────────────────────────────────

    subscribe(topic, callback) {
        if (!this.subscribers.has(topic)) {
            this.subscribers.set(topic, new Set());
        }
        this.subscribers.get(topic).add(callback);
        this.activeSubscriptions.add(topic);

        this.sendRaw({ type: 'sub', topic });
        this._log(`📡 Subscribed to topic: ${topic}`);
    }

    unsubscribe(topic, callback) {
        if (this.subscribers.has(topic)) {
            if (callback) {
                this.subscribers.get(topic).delete(callback);
                if (this.subscribers.get(topic).size === 0) {
                    this.subscribers.delete(topic);
                    this.activeSubscriptions.delete(topic);
                }
            } else {
                this.subscribers.delete(topic);
                this.activeSubscriptions.delete(topic);
            }
            this.sendRaw({ type: 'unsub', topic });
            this._log(`🔌 Unsubscribed from topic: ${topic}`);
        }
    }

    publish(topic, payload) {
        this.sendRaw({ type: 'pub', topic, payload });
    }

    restoreSubscriptions() {
        if (this.activeSubscriptions.size === 0) return;
        this._log(`📡 Restoring ${this.activeSubscriptions.size} subscriptions...`);
        this.activeSubscriptions.forEach(topic => {
            this.ws.send(JSON.stringify({ type: 'sub', topic }));
        });
    }

    // ─────────────────────────────────────────────────────
    // SINGLE LINE TELEPHONY / SIGNALING APIS
    // ─────────────────────────────────────────────────────

    invite(targetId, callType = 'audio', sdp = null, isPaging = false) {
        const msgId = `cli_inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        this.sendRaw({
            type: 'signal',
            to: targetId,
            data: {
                type: 'INVITE',
                callType,
                sdp,
                msgId,
                isPaging
            }
        });
        return msgId;
    }

    accept(targetId, callLogId = null, sdp = null) {
        this.sendRaw({
            type: 'signal',
            to: targetId,
            data: {
                type: 'ACCEPT',
                callLogId,
                sdp
            }
        });
    }

    reject(targetId, callLogId = null, reason = 'Busy') {
        this.sendRaw({
            type: 'signal',
            to: targetId,
            data: {
                type: 'REJECT',
                callLogId,
                reason
            }
        });
    }

    end(targetId, callLogId = null, duration = 0) {
        this.sendRaw({
            type: 'signal',
            to: targetId,
            data: {
                type: 'END',
                callLogId,
                duration
            }
        });
    }

    sendIceCandidate(targetId, candidate) {
        this.sendRaw({
            type: 'signal',
            to: targetId,
            data: {
                type: 'ICE_CANDIDATE',
                candidate
            }
        });
    }

    sendChat(targetId, message) {
        const msgId = `cli_chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        this.sendRaw({
            type: 'signal',
            to: targetId,
            data: {
                type: 'CHAT',
                message,
                msgId
            }
        });
        return msgId;
    }

    // ─────────────────────────────────────────────────────
    // INBOUND MESSAGE PROCESSING
    // ─────────────────────────────────────────────────────

    handleMessage(rawData) {
        try {
            const msg = JSON.parse(rawData.toString());
            
            // Route Pub/Sub messages
            if (msg.topic) {
                this.emit(msg.topic, msg.payload ?? msg);
                
                const callbacks = this.subscribers.get(msg.topic);
                if (callbacks) {
                    callbacks.forEach(fn => {
                        try {
                            const ctxStore = this.app.framework.deviceContextStore;
                            if (ctxStore) {
                                ctxStore.run(this.contextDeviceId || 'default', () => {
                                    fn(msg.payload ?? msg);
                                });
                            } else {
                                fn(msg.payload ?? msg);
                            }
                        } catch (err) {
                            this._log(`Error in subscriber callback for "${msg.topic}":`, err.message);
                        }
                    });
                }
            }

            // Route Direct Signaling/Telecom messages
            if (msg.type) {
                this.emit(msg.type, msg);

                // Handle wrapped signal data from standard orchestrators
                let targetMsg = msg;
                if (msg.type === 'signal' && msg.data && typeof msg.data === 'object') {
                    targetMsg = {
                        ...msg.data,
                        from: msg.from
                    };
                    // Emit the mapped signal type (e.g. INVITE, ACCEPT)
                    if (targetMsg.type) {
                        this.emit(targetMsg.type, targetMsg);
                    }
                }

                switch (targetMsg.type) {
                    case 'HEARTBEAT_ACK':
                        this.handleHeartbeatAck();
                        break;
                        
                    case 'INIT_STATUS':
                        this.emit('init_status', targetMsg);
                        break;

                    case 'CHAT':
                        this.emit('chat', {
                            from: targetMsg.from,
                            message: targetMsg.message,
                            timestamp: targetMsg.timestamp,
                            msgId: targetMsg.msgId
                        });
                        break;

                    case 'CHAT_ACK':
                        this.emit('chat_ack', targetMsg.msgId);
                        break;

                    case 'INVITE':
                        // Incoming call routed via server UniversalSignaling or signal wrapper
                        this.emit('incoming_call', {
                            from: targetMsg.from,
                            callType: targetMsg.callType || 'audio',
                            callLogId: targetMsg.callLogId || targetMsg.msgId,
                            sdp: targetMsg.sdp,
                            isPaging: targetMsg.isPaging || false,
                            msgId: targetMsg.msgId
                        });
                        break;

                    case 'ACCEPT':
                        this.emit('call_accepted', {
                            from: targetMsg.from,
                            sdp: targetMsg.sdp
                        });
                        break;

                    case 'REJECT':
                        this.emit('call_rejected', {
                            from: targetMsg.from,
                            reason: targetMsg.reason || 'Busy'
                        });
                        break;

                    case 'END':
                        this.emit('call_ended', {
                            from: targetMsg.from,
                            reason: targetMsg.reason || 'Hung up'
                        });
                        break;

                    case 'ICE_CANDIDATE':
                        this.emit('ice_candidate', {
                            from: targetMsg.from,
                            candidate: targetMsg.candidate
                        });
                        break;

                    case 'CALL_FAILED':
                        this.emit('call_failed', {
                            to: targetMsg.to,
                            reason: targetMsg.reason
                        });
                        break;

                    case 'CALL_WAITING':
                        this.emit('call_waiting', {
                            from: targetMsg.from,
                            callType: targetMsg.callType,
                            msgId: targetMsg.msgId
                        });
                        break;

                    case 'CALL_WAITING_ALERT':
                        this.emit('call_waiting_alert', {
                            to: targetMsg.to
                        });
                        break;

                    case 'MWI':
                        this.emit('voicemail_indicator', {
                            unreadCount: targetMsg.voicemailCount,
                            newVoicemail: targetMsg.newVoicemail
                        });
                        break;
                }
            }

        } catch (e) {
            this._log('⚠️ Error parsing received message:', e.message);
        }
    }

    // ─────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────

    parseServerUrl(serverUrl, deviceId, token = null) {
        let url = serverUrl.trim();
        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }

        // Change protocol to WebSocket
        if (url.startsWith('https://')) {
            url = 'wss://' + url.substring(8);
        } else if (url.startsWith('http://')) {
            url = 'ws://' + url.substring(7);
        } else if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
            url = 'ws://' + url;
        }

        let wsUrl = `${url}/phone?id=${deviceId}`;
        if (token) {
            wsUrl += `&token=${token}`;
        }
        return wsUrl;
    }

    clearTimers() {
        clearTimeout(this.reconnectTimer);
        this.clearHeartbeatTimers();
    }

    clearHeartbeatTimers() {
        clearInterval(this.pingTimer);
        clearTimeout(this.pongTimer);
    }

    _log(...args) {
        if (this.app.framework.config.debug || process.env.DOLPHIN_DEBUG) {
            console.log(`[DolphinRealtime-${this.contextDeviceId}]`, ...args);
        }
    }
}

module.exports = DolphinRealtimeEngine;
