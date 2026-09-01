'use strict';

/**
 * 🐬 TitanOpcodeBus & Communication Protocol (danphe-ui)
 * Enterprise-Grade Bi-directional Opcode Communication Bridge
 * Connects: Titan Animation Card ⇄ NLE Multi-Track Timeline ⇄ 16:9 Cinema Canvas ⇄ C++/Wasm Compositor
 */

(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        global.TitanOpcodeBus = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    // ── 1. PROTOCOL CONSTANTS & MAGIC HEADERS ──
    const PROTOCOL = {
        MAGIC: 0x54495441, // 'TITA'
        VERSION: '1.0.0',
        EVENTS: {
            // Card -> Timeline / Stage
            CARD_OPCODE_CHANGED: 'TITAN:CARD_OPCODE_CHANGED',
            CARD_STAGE_CHANGED: 'TITAN:CARD_STAGE_CHANGED',
            CARD_CHANNEL_UPDATED: 'TITAN:CARD_CHANNEL_UPDATED',
            CARD_APPLY_TRIGGERED: 'TITAN:CARD_APPLY_TRIGGERED',
            CARD_MODE_TOGGLED: 'TITAN:CARD_MODE_TOGGLED',

            // Timeline -> Card / Stage
            TIMELINE_LAYER_SELECTED: 'TITAN:TIMELINE_LAYER_SELECTED',
            TIMELINE_RANGE_DRAWN: 'TITAN:TIMELINE_RANGE_DRAWN',
            TIMELINE_RANGE_CLEARED: 'TITAN:TIMELINE_RANGE_CLEARED',
            TIMELINE_CUT_TRIGGERED: 'TITAN:TIMELINE_CUT_TRIGGERED',
            TIMELINE_KEYFRAME_ADDED: 'TITAN:TIMELINE_KEYFRAME_ADDED',
            TIMELINE_SEEK_CHANGED: 'TITAN:TIMELINE_SEEK_CHANGED',

            // Stage / Compositor -> Timeline / Card
            COMPOSITOR_FRAME_RENDERED: 'TITAN:COMPOSITOR_FRAME_RENDERED',
            COMPOSITOR_STATE_SYNC: 'TITAN:COMPOSITOR_STATE_SYNC'
        },
        STAGES: {
            IN: 'in',
            OVERALL: 'overall',
            OUT: 'out',
            TRANS: 'trans'
        },
        LAYER_TYPES: {
            TEXT: 'text',
            VIDEO: 'video',
            IMAGE: 'image',
            AUDIO: 'audio',
            EFFECT: 'effect'
        }
    };

    // ── 2. INTERNAL EVENT REGISTRY ──
    const _listeners = new Map();
    let _history = [];
    const MAX_HISTORY = 100;

    /**
     * Create a standard validated Titan Opcode Packet
     */
    function createPacket(action, payload = {}) {
        return {
            magic: PROTOCOL.MAGIC,
            version: PROTOCOL.VERSION,
            timestamp: Date.now(),
            action: action,
            sender: payload.sender || 'titan_card',
            target: payload.target || 'timeline',
            data: {
                layerId: payload.layerId || null,
                layerType: payload.layerType || PROTOCOL.LAYER_TYPES.TEXT,
                stage: payload.stage || PROTOCOL.STAGES.OVERALL,
                opcode: typeof payload.opcode === 'string' ? payload.opcode : ('0x' + (payload.opcode || 0).toString(16).padStart(2, '0').toUpperCase()),
                opcodeInt: typeof payload.opcodeInt === 'number' ? payload.opcodeInt : (parseInt(payload.opcode, 16) || 0),
                name: payload.name || 'STATIC_NORMAL',
                cssClass: payload.cssClass || 'titan-anim-idle',
                durationSec: typeof payload.durationSec === 'number' ? payload.durationSec : 0.8,
                easing: payload.easing || 'cubic-bezier(0.4, 0, 0.2, 1)',
                timeRange: payload.timeRange || { startSec: 0, endSec: 0, duration: 0 },
                channels: payload.channels || { textVal: 0, colorVal: 0, normalVal: 0 },
                meta: payload.meta || {}
            }
        };
    }

    /**
     * Subscribe a callback to a Titan Opcode event
     */
    function subscribe(eventName, callback) {
        if (typeof callback !== 'function') return () => {};
        if (!_listeners.has(eventName)) {
            _listeners.set(eventName, new Set());
        }
        _listeners.get(eventName).add(callback);

        // Return unsubscribe handle
        return function unsubscribe() {
            if (_listeners.has(eventName)) {
                _listeners.get(eventName).delete(callback);
            }
        };
    }

    /**
     * Dispatch an Opcode Event across the bus
     */
    function dispatch(eventName, packetOrPayload) {
        const packet = (packetOrPayload && packetOrPayload.magic === PROTOCOL.MAGIC) 
            ? packetOrPayload 
            : createPacket(eventName, packetOrPayload);

        // Record history
        _history.push(packet);
        if (_history.length > MAX_HISTORY) _history.shift();

        // Notify subscribers
        if (_listeners.has(eventName)) {
            _listeners.get(eventName).forEach(cb => {
                try {
                    cb(packet);
                } catch (err) {
                    console.error('[TitanOpcodeBus] Error in listener for ' + eventName + ':', err);
                }
            });
        }

        // Global wildcard listener support
        if (_listeners.has('*')) {
            _listeners.get('*').forEach(cb => {
                try { cb(eventName, packet); } catch (e) {}
            });
        }

        return packet;
    }

    // ── 3. HIGH-LEVEL COMMUNICATION SHORTCUTS ──

    /**
     * Card ➔ Timeline: Apply active opcode and parameters to timeline range
     */
    function emitCardApplyToTimeline(cardState, targetRange) {
        const packet = createPacket(PROTOCOL.EVENTS.CARD_APPLY_TRIGGERED, {
            sender: 'titan_card',
            target: 'timeline',
            stage: cardState.stage || 'overall',
            opcode: cardState.opcode || '0x00',
            opcodeInt: cardState.opcodeInt || 0,
            name: cardState.name || 'STATIC_NORMAL',
            cssClass: cardState.cssClass || 'titan-anim-idle',
            durationSec: cardState.durationSec || 0.8,
            channels: {
                textVal: cardState.textVal || 0,
                colorVal: cardState.colorVal || 0,
                normalVal: cardState.normalVal || 0
            },
            timeRange: targetRange || { startSec: 0, endSec: 0 }
        });
        return dispatch(PROTOCOL.EVENTS.CARD_APPLY_TRIGGERED, packet);
    }

    /**
     * Timeline ➔ Card: Select a layer on the timeline and sync card controls
     */
    function emitTimelineLayerSelect(layer) {
        const packet = createPacket(PROTOCOL.EVENTS.TIMELINE_LAYER_SELECTED, {
            sender: 'timeline',
            target: 'titan_card',
            layerId: layer.id,
            layerType: layer.type,
            stage: layer.stage || 'overall',
            opcode: layer.opcode || '0x00',
            durationSec: layer.durationSec || 0.8,
            meta: layer
        });
        return dispatch(PROTOCOL.EVENTS.TIMELINE_LAYER_SELECTED, packet);
    }

    /**
     * Timeline Pen Tool ➔ Card/Editor: Broadcast Point A to Point B range drawn
     */
    function emitTimelinePenRange(range) {
        const packet = createPacket(PROTOCOL.EVENTS.TIMELINE_RANGE_DRAWN, {
            sender: 'timeline_pen_tool',
            target: 'titan_card',
            layerId: range.layerId,
            timeRange: {
                startSec: range.startSec,
                endSec: range.endSec,
                duration: range.endSec - range.startSec
            }
        });
        return dispatch(PROTOCOL.EVENTS.TIMELINE_RANGE_DRAWN, packet);
    }

    /**
     * Binary Serializer (Fast ArrayBuffer for Web Workers & WebCodecs)
     */
    function encodeBinary(packet) {
        const buffer = new ArrayBuffer(32);
        const view = new DataView(buffer);
        view.setUint32(0, PROTOCOL.MAGIC, false); // Magic
        view.setUint8(4, packet.data.opcodeInt & 0xFF); // Opcode Byte
        view.setUint8(5, packet.data.channels.textVal & 0xFF);
        view.setUint8(6, packet.data.channels.colorVal & 0xFF);
        view.setUint8(7, packet.data.channels.normalVal & 0xFF);
        view.setFloat32(8, packet.data.durationSec, false);
        view.setFloat32(12, packet.data.timeRange.startSec || 0, false);
        view.setFloat32(16, packet.data.timeRange.endSec || 0, false);
        view.setFloat64(20, packet.timestamp, false);
        return buffer;
    }

    /**
     * Binary Deserializer
     */
    function decodeBinary(buffer) {
        if (buffer.byteLength < 28) return null;
        const view = new DataView(buffer);
        if (view.getUint32(0, false) !== PROTOCOL.MAGIC) return null;

        return {
            magic: PROTOCOL.MAGIC,
            opcodeInt: view.getUint8(4),
            opcodeHex: '0x' + view.getUint8(4).toString(16).padStart(2, '0').toUpperCase(),
            channels: {
                textVal: view.getUint8(5),
                colorVal: view.getUint8(6),
                normalVal: view.getUint8(7)
            },
            durationSec: view.getFloat32(8, false),
            timeRange: {
                startSec: view.getFloat32(12, false),
                endSec: view.getFloat32(16, false)
            },
            timestamp: view.getFloat64(20, false)
        };
    }

    return {
        PROTOCOL,
        createPacket,
        subscribe,
        dispatch,
        emitCardApplyToTimeline,
        emitTimelineLayerSelect,
        emitTimelinePenRange,
        encodeBinary,
        decodeBinary,
        getHistory: () => [..._history],
        clearHistory: () => { _history = []; }
    };
}));
