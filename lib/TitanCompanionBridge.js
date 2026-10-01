'use strict';

/**
 * 🌉 TitanCompanionBridge (danphe-ui / lib)
 * High-Speed Titan-Bus TCP Connector linking Danphe Video Editor to Titan-Companion Standalone App
 */

const net = require('net');

const TITAN_SIGNATURE = 0x5442;
const TITAN_VERSION = 0x02;
const TITAN_HEADER_SIZE = 24;

const CMD = {
    REGISTER:       0x08,
    REGISTER_ACK:   0x09,
    VIDEO_FRAME:    0x15,
    AUDIO_FRAME:    0x14,
    HEARTBEAT:      0x30,
    HEARTBEAT_ACK:  0x31,
    CUSTOM_ACTION:  0x40,
};

class TitanCompanionBridge {
    constructor(options = {}) {
        this.host = options.host || '127.0.0.1';
        this.port = options.port || 9092;
        this.nodeId = options.nodeId || 101; // Danphe Video Editor Node ID
        this.name = options.name || 'Danphe Video Editor';
        this.socket = null;
        this.isConnected = false;
        this.buffer = Buffer.alloc(0);
        this.seqNo = 1;
        this.onTimelineInsert = options.onTimelineInsert || null;
    }

    connect() {
        return new Promise((resolve) => {
            this.socket = new net.Socket();

            this.socket.connect(this.port, this.host, () => {
                this.isConnected = true;
                console.log(`🌉 [TitanCompanionBridge] Connected to Titan-Companion TCP on ${this.host}:${this.port}`);
                
                // Register with Companion Hub
                this.send(300, CMD.REGISTER, { name: this.name, type: 'video_editor' });
                resolve(true);
            });

            this.socket.on('data', (chunk) => {
                this.buffer = Buffer.concat([this.buffer, chunk]);
                this.processIncoming();
            });

            this.socket.on('close', () => {
                this.isConnected = false;
                console.log('⚠️ [TitanCompanionBridge] Disconnected from Titan-Companion. Reconnecting in 3s...');
                setTimeout(() => this.connect(), 3000);
            });

            this.socket.on('error', (err) => {
                this.isConnected = false;
                // Silent retry
            });
        });
    }

    processIncoming() {
        while (this.buffer.length >= TITAN_HEADER_SIZE) {
            const sig = this.buffer.readUInt16BE(0);
            if (sig !== TITAN_SIGNATURE) {
                let offset = 1;
                while (offset < this.buffer.length - 1) {
                    if (this.buffer.readUInt16BE(offset) === TITAN_SIGNATURE) break;
                    offset++;
                }
                this.buffer = this.buffer.subarray(offset);
                continue;
            }

            const pLen = this.buffer.readInt32BE(12);
            const totalLen = TITAN_HEADER_SIZE + pLen;
            if (this.buffer.length < totalLen) break;

            const frame = this.buffer.subarray(0, totalLen);
            this.buffer = this.buffer.subarray(totalLen);

            const cmd = frame.readUInt8(3);
            const sender = frame.readInt32BE(4);
            const flags = frame.readUInt8(22);

            let payload = null;
            if (pLen > 0) {
                const raw = frame.subarray(TITAN_HEADER_SIZE, totalLen);
                if (flags === 1) {
                    try { payload = JSON.parse(raw.toString('utf8')); } catch { payload = raw.toString('utf8'); }
                } else {
                    payload = raw;
                }
            }

            if (cmd === CMD.CUSTOM_ACTION && payload && payload.type === 'TIMELINE_INSERT') {
                console.log('🎬 [TitanCompanionBridge] Ingesting Video to Timeline:', payload.title);
                if (typeof this.onTimelineInsert === 'function') {
                    this.onTimelineInsert(payload);
                }
            }
        }
    }

    send(targetId, cmd, payload = null) {
        if (!this.socket || !this.socket.writable) return;
        let pBuf;
        let flags = 0;
        if (typeof payload === 'object' && payload !== null) {
            pBuf = Buffer.from(JSON.stringify(payload), 'utf8');
            flags = 1;
        } else if (typeof payload === 'string') {
            pBuf = Buffer.from(payload, 'utf8');
        } else {
            pBuf = Buffer.alloc(0);
        }

        const frame = Buffer.alloc(TITAN_HEADER_SIZE + pBuf.length);
        frame.writeUInt16BE(TITAN_SIGNATURE, 0);
        frame.writeUInt8(TITAN_VERSION, 2);
        frame.writeUInt8(cmd, 3);
        frame.writeInt32BE(this.nodeId, 4);
        frame.writeInt32BE(targetId, 8);
        frame.writeInt32BE(pBuf.length, 12);
        frame.writeInt32BE(this.seqNo++, 16);
        frame.writeUInt16BE(0, 20);
        frame.writeUInt8(flags, 22);
        frame.writeUInt8(0xAA, 23);

        if (pBuf.length > 0) pBuf.copy(frame, TITAN_HEADER_SIZE);
        this.socket.write(frame);
    }

    sendExportForSocialUpload(filename, platform = 'tiktok', metadata = {}) {
        this.send(300, CMD.CUSTOM_ACTION, {
            type: 'EXPORT_UPLOAD',
            filename: filename,
            platform: platform,
            metadata: metadata
        });
    }
}

module.exports = { TitanCompanionBridge };
