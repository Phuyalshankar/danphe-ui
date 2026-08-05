'use strict';

const { Buffer } = require('buffer');

/**
 * ⚡ TitanFrameBuilder — Pure Binary TCP Packet Encoder/Decoder for Titan Realtime Protocol (0x5442 'TB' Header).
 */
const TITAN_FRAME = {
    PING: 0x30,
    PONG: 0x31,
    SUBSCRIBE: 0xf2,
    PUBLISH: 0xf3,
    ACK: 0xf4,
    ERROR: 0xf5,
    STREAM: 0x15,
    PRESENCE: 0xf7,
};

class TitanFrameBuilder {
    static TITAN_FRAME = TITAN_FRAME;

    static buildFrame(type, channel = '', payload = '') {
        const ch = Buffer.from(channel.padEnd(32).slice(0, 32));
        const pay = Buffer.isBuffer(payload)
            ? payload
            : Buffer.from(typeof payload === 'string' ? payload : JSON.stringify(payload));
        
        const msg = Buffer.alloc(2 + 1 + 32 + 4 + pay.length);
        let off = 0;
        msg.writeUInt8(0x54, off++); // 'T'
        msg.writeUInt8(0x42, off++); // 'B'
        msg.writeUInt8(type, off++);
        ch.copy(msg, off);
        off += 32;
        msg.writeUInt32LE(pay.length, off);
        off += 4;
        pay.copy(msg, off);
        return msg;
    }

    static parseFrame(buffer) {
        if (!buffer || buffer.length < 39) return null;
        const magic1 = buffer.readUInt8(0);
        const magic2 = buffer.readUInt8(1);
        if (magic1 !== 0x54 || magic2 !== 0x42) return null; // Not 'TB'

        const type = buffer.readUInt8(2);
        const channel = buffer.toString('utf-8', 3, 35).trim();
        const payloadLen = buffer.readUInt32LE(35);
        const payload = buffer.subarray(39, 39 + payloadLen);

        return { type, channel, payloadLen, payload };
    }
}

module.exports = { TitanFrameBuilder, TITAN_FRAME };
