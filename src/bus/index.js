'use strict';

/**
 * 🏔️ EVEREST FIELDBUS & TITAN MICRO BUS ENGINE (Integrated in Danphe Framework)
 * ═════════════════════════════════════════════════════════════════════════════
 * - 2-Byte UInt16 (0 - 65,535) Memory-Mapped Register Bus
 * - 6-Byte Micro SISO (Serial In / Serial Out) Ultra Low-Latency Stream
 * - 7-Byte Titan-Shield Secure SISO (8-bit Rolling 2FA + In-Binary Encryption)
 * - 24-Byte Macro Packet Highway (Media, Signaling, PBX, Hardware Coils)
 * - Zero Register Collision (Animation 0x4700-0x4705 vs Video Opacity 0x4100)
 * - Zero-Overhead URL Routing Index (SessionId -> URL Mapping)
 * - 100% Backward Compatible with legacy EverestBus & Titan implementations
 */

// ── Protocol Signatures & Constants ──────────────────────────────────────────
const TITAN_SIGNATURE = 0x5442;               // 'TB' (Macro 24-Byte Frame)
const TITAN_VERSION = 0x02;
const TITAN_HEADER_SIZE = 24;

const TITAN_SISO_SIGNATURE = 0x5349;          // 'SI' (Micro 6-Byte Stream)
const TITAN_SISO_SECURE_SIGNATURE = 0x5353;   // 'SS' (Titan-Shield 7-Byte Stream)
const TITAN_SISO_PACKET_LEN = 6;
const TITAN_SISO_SECURE_PACKET_LEN = 7;

const TITAN_FLAG_ENCRYPTED = 0x02;
const TITAN_FLAG_AUTH_HEARTBEAT = 0x04;
const TITAN_DEFAULT_SECRET_SEED = 0xA596;     // 42390
const TITAN_ERR_AUTH_FAIL = 90;

// ── Command Opcodes ──────────────────────────────────────────────────────────
const CMD = {
  // PBX & Signaling
  REGISTER:       0x08,
  REGISTER_ACK:   0x09,
  INVITE:         0x10,
  ACCEPT:         0x11,
  REJECT:         0x12,
  HANGUP:         0x13,

  // Media Streaming
  AUDIO_FRAME:    0x14,
  VIDEO_FRAME:    0x15,

  // Messaging & UI Events
  CHAT_MESSAGE:   0x20,
  KEYPAD_EVENT:   0x21,
  DISPLAY_WRITE:  0x22,
  RELAY_SET:      0x23,
  SENSOR_STREAM:  0x24,
  SISO_STREAM:    0x25,                       // ⚡ 6B/7B Micro Stream Ingest

  // Lifecycle & Diagnostics
  HEARTBEAT:      0x30,
  HEARTBEAT_ACK:  0x31,
  CUSTOM_ACTION:  0x40,
  ERROR:          0xFF,
};

// ── Memory Register Map (16-bit: 0 - 65,535) ─────────────────────────────────
const REG = {
  // Core & Page Navigation (0 - 999)
  BUS_STATUS:          1,
  BUS_HEARTBEAT:       2,
  SECURITY_TOKEN:      3,
  SECURITY_STATUS:     4, // 0 = Open, 1 = Secured, 2 = Locked Out
  SECURITY_FAILURES:   5,
  ACTIVE_SCREEN:       10,
  DRAWER_STATE:        11,
  THEME_MODE:          12,

  // Master Error Registers (90 - 99)
  ERROR_MASTER:        90,
  ERROR_COUNT:         91,
  ERROR_MODULE:        92,
  ERROR_CODE:          93,
  ERROR_SEVERITY:      94,
  ERROR_JSON:          99,

  // UI Registers (1,000 - 9,999)
  KEYPAD_DIAL_BUFFER:  1000,
  KEYPAD_LAST_KEY:     1001,
  LCD_LINE_1:          1010,
  LCD_LINE_2:          1011,

  // Hardware Registers (0x4000 - 0x44FF)
  AUDIO_MASTER_VOL:    0x4000,
  VIDEO_OPACITY:       0x4100, // 16640 - Zero collision with animations!
  VIDEO_SCALE:         0x4101,
  VIDEO_POS_X:         0x4103,
  VIDEO_POS_Y:         0x4104,

  // Studio Motion Animation Registers (0x4700 - 0x4705)
  ANIM_STAGE:          0x4700, // 18176
  ANIM_OPCODE:         0x4701,
  ANIM_DURATION:       0x4702,
  ANIM_EASING:         0x4703,
  ANIM_TARGET:         0x4704,
  ANIM_TRIGGER:        0x4705,
};

// ── Security & Mathematical Cryptographic Helpers ────────────────────────────
function computeRollingToken(seed = TITAN_DEFAULT_SECRET_SEED, epochSec = null) {
  const sec = epochSec !== null ? epochSec : Math.floor(Date.now() / 1000);
  return Number((BigInt((seed ^ (sec & 0xFFFF))) * 109n + 89n) & 0xFFn);
}

function maskSisoPayload(token, reg, val) {
  const k1 = token;
  const k2 = (token * 37 + 13) & 0xFF;
  const regMasked = reg ^ ((k1 << 8) | k2);
  const uVal = val & 0xFFFF;
  const valMasked = uVal ^ ((k2 << 8) | k1);
  const signedVal = (valMasked & 0x8000) ? valMasked - 0x10000 : valMasked;
  return { reg: regMasked, val: signedVal };
}

function maskMacroPayload(token, buf) {
  if (!buf || buf.length === 0) return;
  for (let i = 0; i < buf.length; i++) {
    const key = (token ^ (i * 31 + 7)) & 0xFF;
    buf[i] ^= key;
  }
}

// ── Everest / Titan Micro Bus Engine ─────────────────────────────────────────
class EverestBusEngine {
  constructor() {
    this.registers = new Map();
    this.listeners = new Map();
    this.cmdHandlers = new Map();
    this.urlRoutes = new Map();
    this.rxBuffer = Buffer.alloc(0);
    this.seqNo = 1;
    this.myNodeId = 101;

    // Security Matrix
    this.securitySeed = TITAN_DEFAULT_SECRET_SEED;
    this.securityEnabled = false;
    this.authFailures = 0;
    this.lastHeartbeatTime = Math.floor(Date.now() / 1000);

    this.initDefaults();
  }

  initDefaults() {
    this.registers.clear();
    this.urlRoutes.clear();
    this.rxBuffer = Buffer.alloc(0);
    this.authFailures = 0;

    this.write(REG.BUS_STATUS, 1);
    this.write(REG.BUS_HEARTBEAT, 0);
    this.write(REG.SECURITY_TOKEN, 0);
    this.write(REG.SECURITY_STATUS, 0); // 0 = Open
    this.write(REG.SECURITY_FAILURES, 0);
    this.write(REG.ACTIVE_SCREEN, 'Home');
    this.write(REG.KEYPAD_DIAL_BUFFER, '');
  }

  // 1. Memory Register Operations
  write(reg, value, silent = false) {
    const numericReg = typeof reg === 'string' ? parseInt(reg, 10) : reg;
    this.registers.set(numericReg, value);
    if (!silent) {
      const subs = this.listeners.get(numericReg);
      if (subs) {
        subs.forEach(listener => {
          try { listener(value, numericReg); } catch (e) { console.error(e); }
        });
      }
    }
  }

  writeInt(reg, value) {
    this.write(reg, Number(value));
  }

  read(reg, defaultValue = null) {
    const numericReg = typeof reg === 'string' ? parseInt(reg, 10) : reg;
    return this.registers.has(numericReg) ? this.registers.get(numericReg) : defaultValue;
  }

  readInt(reg, defaultValue = 0) {
    const val = this.read(reg, defaultValue);
    if (val === null || val === undefined || val === '') return defaultValue;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  subscribe(reg, listener) {
    const numericReg = typeof reg === 'string' ? parseInt(reg, 10) : reg;
    if (!this.listeners.has(numericReg)) {
      this.listeners.set(numericReg, new Set());
    }
    this.listeners.get(numericReg).add(listener);

    if (this.registers.has(numericReg)) {
      try { listener(this.registers.get(numericReg), numericReg); } catch (e) {}
    }

    return () => {
      this.listeners.get(numericReg)?.delete(listener);
    };
  }

  onRegisterChange(reg, listener) {
    return this.subscribe(reg, listener);
  }

  // 2. 🌟 Unified 6-Byte Micro SISO (Serial In / Serial Out) Stream
  packSiso(reg, value) {
    const buf = Buffer.alloc(TITAN_SISO_PACKET_LEN);
    buf.writeUInt16BE(TITAN_SISO_SIGNATURE, 0); // 'SI'
    buf.writeUInt16BE(reg & 0xFFFF, 2);
    buf.writeInt16BE(value, 4);
    return buf;
  }

  emitSiso(reg, value) {
    const buf = this.packSiso(reg, value);
    this.writeInt(reg, value);

    const handlers = this.cmdHandlers.get(CMD.SISO_STREAM);
    if (handlers) {
      handlers.forEach(h => {
        try { h(CMD.SISO_STREAM, this.myNodeId, buf); } catch (e) { console.error(e); }
      });
    }
    return buf;
  }

  // 3. 🛡️ Titan-Shield 7-Byte Secure SISO Stream
  packSecureSiso(reg, value, token = null) {
    const t = token !== null ? token : this.getRollingToken();
    const masked = maskSisoPayload(t, reg, value);
    const buf = Buffer.alloc(TITAN_SISO_SECURE_PACKET_LEN);
    buf.writeUInt16BE(TITAN_SISO_SECURE_SIGNATURE, 0); // 'SS'
    buf.writeUInt8(t, 2);
    buf.writeUInt16BE(masked.reg & 0xFFFF, 3);
    buf.writeInt16BE(masked.val, 5);
    return buf;
  }

  emitSecureSiso(reg, value) {
    const token = this.getRollingToken();
    const buf = this.packSecureSiso(reg, value, token);

    this.writeInt(reg, value);
    this.writeInt(REG.SECURITY_TOKEN, token);
    this.writeInt(REG.BUS_HEARTBEAT, token);
    this.writeInt(REG.BUS_STATUS, 1);
    this.lastHeartbeatTime = Math.floor(Date.now() / 1000);

    const handlers = this.cmdHandlers.get(CMD.SISO_STREAM);
    if (handlers) {
      handlers.forEach(h => {
        try { h(CMD.SISO_STREAM, this.myNodeId, buf); } catch (e) { console.error(e); }
      });
    }
    return buf;
  }

  // 4. Security Matrix (2FA, Watchdog, Intrusion Lockout)
  setSecuritySeed(seed) { this.securitySeed = seed; }
  getSecuritySeed() { return this.securitySeed; }
  setSecurityEnabled(enabled) {
    this.securityEnabled = enabled;
    this.writeInt(REG.SECURITY_STATUS, enabled ? 1 : 0);
  }
  isSecurityEnabled() { return this.securityEnabled; }
  isLockedOut() { return this.authFailures >= 3; }
  resetSecurityFailures() {
    this.authFailures = 0;
    this.writeInt(REG.SECURITY_FAILURES, 0);
  }

  getRollingToken(epochSec = null) {
    return computeRollingToken(this.securitySeed, epochSec);
  }

  verifyToken(token, epochSec = null) {
    const sec = epochSec !== null ? epochSec : Math.floor(Date.now() / 1000);
    const t0 = computeRollingToken(this.securitySeed, sec);
    const t1 = computeRollingToken(this.securitySeed, sec - 1);
    return token === t0 || token === t1;
  }

  reportError(errorCode, severity = 2, moduleId = 101, msg = '') {
    this.writeInt(REG.ERROR_MASTER, severity);
    this.writeInt(REG.ERROR_MODULE, moduleId);
    this.writeInt(REG.ERROR_CODE, errorCode);
    this.writeInt(REG.ERROR_SEVERITY, severity);
    const count = this.readInt(REG.ERROR_COUNT, 0);
    this.writeInt(REG.ERROR_COUNT, count + 1);

    if (msg) {
      this.write(REG.ERROR_JSON, typeof msg === 'object' ? JSON.stringify(msg) : String(msg));
    }
    this.emit(0, CMD.ERROR, msg);
  }

  clearError() {
    this.writeInt(REG.ERROR_MASTER, 0);
    this.writeInt(REG.ERROR_CODE, 0);
    this.writeInt(REG.ERROR_SEVERITY, 0);
    this.write(REG.ERROR_JSON, '');
  }

  checkHeartbeatWatchdog(timeoutMs = 3000) {
    const now = Math.floor(Date.now() / 1000);
    if (this.lastHeartbeatTime > 0 && (now - this.lastHeartbeatTime) * 1000 > timeoutMs) {
      this.writeInt(REG.BUS_STATUS, 0); // OFFLINE
    }
  }

  // 5. Zero-Overhead URL Routing Index
  setRoutingUrl(id, url) { this.urlRoutes.set(id, url); }
  getRoutingUrl(id) { return this.urlRoutes.get(id) || ''; }

  // 6. 24-Byte Macro Packet Highway (100% Backward Compatible)
  pack(cmd, targetId, payloadBuf = Buffer.alloc(0), flags = 0, seqNo = 0, sessionId = 0) {
    const frame = Buffer.alloc(TITAN_HEADER_SIZE + payloadBuf.length);
    frame.writeUInt16BE(TITAN_SIGNATURE, 0);
    frame.writeUInt8(TITAN_VERSION, 2);
    frame.writeUInt8(cmd, 3);
    frame.writeInt32BE(this.myNodeId, 4);
    frame.writeInt32BE(targetId, 8);
    frame.writeInt32BE(payloadBuf.length, 12);
    frame.writeInt32BE(seqNo > 0 ? seqNo : this.seqNo++, 16);
    frame.writeUInt16BE(sessionId, 20);
    frame.writeUInt8(flags, 22);
    frame.writeUInt8(this.getRollingToken(), 23); // Checksum / Rolling token

    if (payloadBuf.length > 0) {
      payloadBuf.copy(frame, TITAN_HEADER_SIZE);
    }
    return frame;
  }

  emit(targetId, cmd, payload = null, isJson = false, flags = 0) {
    let payloadBuf;
    let effectiveFlags = flags;

    if (Buffer.isBuffer(payload)) {
      payloadBuf = payload;
    } else if (typeof payload === 'string') {
      payloadBuf = Buffer.from(payload, 'utf8');
    } else if (payload !== null && typeof payload === 'object') {
      payloadBuf = Buffer.from(JSON.stringify(payload), 'utf8');
      effectiveFlags |= 1;
    } else if (typeof payload === 'number') {
      payloadBuf = Buffer.alloc(4);
      payloadBuf.writeInt32BE(payload, 0);
    } else {
      payloadBuf = Buffer.alloc(0);
    }

    const frame = this.pack(cmd, targetId, payloadBuf, effectiveFlags);

    const handlers = this.cmdHandlers.get(cmd);
    if (handlers) {
      handlers.forEach(h => {
        try { h(cmd, this.myNodeId, payload); } catch (e) { console.error(e); }
      });
    }

    return frame;
  }

  onCommand(cmd, handler) {
    if (!this.cmdHandlers.has(cmd)) {
      this.cmdHandlers.set(cmd, new Set());
    }
    this.cmdHandlers.get(cmd).add(handler);
    return () => {
      this.cmdHandlers.get(cmd)?.delete(handler);
    };
  }

  // 7. ⚡ Single-Pipe Multi-Packet Stream Ingestion ('SS', 'SI', 'TB')
  processIncomingBytes(chunk) {
    if (!chunk || chunk.length === 0) return;
    this.rxBuffer = Buffer.concat([this.rxBuffer, Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)]);

    while (this.rxBuffer.length >= 2) {
      // A. 🛡️ 7-Byte Titan-Shield Secure SISO: 'SS' (0x5353)
      if (this.rxBuffer[0] === 0x53 && this.rxBuffer[1] === 0x53) {
        if (this.rxBuffer.length < TITAN_SISO_SECURE_PACKET_LEN) break;

        const token = this.rxBuffer[2];
        const valid = !this.securityEnabled || this.verifyToken(token);

        if (!valid) {
          this.authFailures++;
          this.writeInt(REG.SECURITY_FAILURES, this.authFailures);
          if (this.authFailures >= 3) {
            this.writeInt(REG.SECURITY_STATUS, 2); // Locked out
            this.reportError(TITAN_ERR_AUTH_FAIL, 3, 101, 'Titan-Shield 8-bit Auth Failed - Locked Out');
          }
        } else {
          this.authFailures = 0;
          this.writeInt(REG.SECURITY_FAILURES, 0);
          this.writeInt(REG.SECURITY_TOKEN, token);
          this.writeInt(REG.BUS_HEARTBEAT, token);
          this.writeInt(REG.BUS_STATUS, 1);
          this.lastHeartbeatTime = Math.floor(Date.now() / 1000);

          const rawReg = this.rxBuffer.readUInt16BE(3);
          const rawVal = this.rxBuffer.readInt16BE(5);
          const unmasked = maskSisoPayload(token, rawReg, rawVal);

          this.writeInt(unmasked.reg, unmasked.val);

          const handlers = this.cmdHandlers.get(CMD.SISO_STREAM);
          if (handlers) {
            const frameCopy = Buffer.from(this.rxBuffer.subarray(0, TITAN_SISO_SECURE_PACKET_LEN));
            handlers.forEach(h => {
              try { h(CMD.SISO_STREAM, 0, frameCopy); } catch (e) {}
            });
          }
        }

        this.rxBuffer = this.rxBuffer.subarray(TITAN_SISO_SECURE_PACKET_LEN);
        continue;
      }

      // B. 6-Byte Micro SISO Stream: 'SI' (0x5349)
      if (this.rxBuffer[0] === 0x53 && this.rxBuffer[1] === 0x49) {
        if (this.rxBuffer.length < TITAN_SISO_PACKET_LEN) break;

        if (this.securityEnabled) {
          this.authFailures++;
          this.writeInt(REG.SECURITY_FAILURES, this.authFailures);
        } else {
          const reg = this.rxBuffer.readUInt16BE(2);
          const val = this.rxBuffer.readInt16BE(4);
          this.writeInt(reg, val);
          this.writeInt(REG.BUS_STATUS, 1);
          this.lastHeartbeatTime = Math.floor(Date.now() / 1000);

          const handlers = this.cmdHandlers.get(CMD.SISO_STREAM);
          if (handlers) {
            const frameCopy = Buffer.from(this.rxBuffer.subarray(0, TITAN_SISO_PACKET_LEN));
            handlers.forEach(h => {
              try { h(CMD.SISO_STREAM, 0, frameCopy); } catch (e) {}
            });
          }
        }

        this.rxBuffer = this.rxBuffer.subarray(TITAN_SISO_PACKET_LEN);
        continue;
      }

      // C. 24-Byte Macro Packet: 'TB' (0x5442)
      if (this.rxBuffer[0] === 0x54 && this.rxBuffer[1] === 0x42) {
        if (this.rxBuffer.length < TITAN_HEADER_SIZE) break;

        const cmd = this.rxBuffer[3];
        const sender = this.rxBuffer.readInt32BE(4);
        const payloadLen = this.rxBuffer.readInt32BE(12);
        const flags = this.rxBuffer[22];
        const token = this.rxBuffer[23];

        if (payloadLen < 0 || payloadLen > 65536) {
          this.rxBuffer = Buffer.alloc(0); // Framing recovery
          break;
        }

        const totalLen = TITAN_HEADER_SIZE + payloadLen;
        if (this.rxBuffer.length < totalLen) break;

        const payloadBuf = Buffer.from(this.rxBuffer.subarray(TITAN_HEADER_SIZE, totalLen));
        if ((flags & TITAN_FLAG_ENCRYPTED) && payloadLen > 0) {
          maskMacroPayload(token, payloadBuf);
        }

        const handlers = this.cmdHandlers.get(cmd);
        if (handlers) {
          handlers.forEach(h => {
            try { h(cmd, sender, payloadBuf); } catch (e) {}
          });
        }

        this.rxBuffer = this.rxBuffer.subarray(totalLen);
        continue;
      }

      // Desync recovery: slide forward 1 byte
      this.rxBuffer = this.rxBuffer.subarray(1);
    }
  }
}

// ── Declarative UI Directives & Actions ───────────────────────────────────────
class EverestDeclarative {
  static extractRegisterId(str) {
    if (!str) return null;
    const match = str.match(/\[?bus:(\d+)\]?/);
    return match ? parseInt(match[1], 10) : null;
  }

  static executeAction(actionStr) {
    if (!actionStr || !actionStr.startsWith('bus:')) return false;

    const parts = actionStr.split(':');
    const verb = parts[1];

    switch (verb) {
      case 'write': {
        const reg = parseInt(parts[2], 10);
        const val = parts.slice(3).join(':');
        EverestBus.write(reg, val);
        return true;
      }

      case 'siso': {
        const reg = parseInt(parts[2], 10);
        const val = parseInt(parts[3], 10) || 0;
        EverestBus.emitSiso(reg, val);
        return true;
      }

      case 'sec': {
        const reg = parseInt(parts[2], 10);
        const val = parseInt(parts[3], 10) || 0;
        EverestBus.emitSecureSiso(reg, val);
        return true;
      }

      case 'key': {
        const key = parts[2];
        const current = EverestBus.read(1000, '');
        const updated = current + key;
        EverestBus.write(1000, updated);
        EverestBus.emit(101, CMD.KEYPAD_EVENT, key);
        return true;
      }

      case 'backspace': {
        const current = EverestBus.read(1000, '');
        const updated = current.length > 0 ? current.slice(0, -1) : '';
        EverestBus.write(1000, updated);
        return true;
      }

      case 'dial': {
        const ext = parts[2] || EverestBus.read(1000, '');
        if (ext) {
          EverestBus.emit(101, CMD.INVITE, ext);
          EverestBus.write(10, 'ActiveCall');
        }
        return true;
      }

      case 'relay': {
        const relayId = parseInt(parts[2], 10);
        const state = parts[3] === 'on' || parts[3] === '1' ? 1 : 0;
        const pulse = parts[4] ? parseInt(parts[4], 10) : 0;
        EverestBus.write(20000 + relayId, state);
        EverestBus.emit(300, CMD.RELAY_SET, { relayId, state, pulse });
        return true;
      }

      case 'screen': {
        const screenName = parts[2];
        EverestBus.write(10, screenName);
        return true;
      }

      case 'show': {
        const text = parts.slice(2).join(':');
        EverestBus.write(1010, text);
        return true;
      }

      default:
        return false;
    }
  }
}

const EverestBus = new EverestBusEngine();

module.exports = {
  EverestBus,
  EverestDeclarative,
  TitanMicroBus: EverestBus,
  EverestBusEngine,
  CMD,
  REG,
  TITAN_SIGNATURE,
  TITAN_VERSION,
  TITAN_HEADER_SIZE,
  TITAN_SISO_SIGNATURE,
  TITAN_SISO_SECURE_SIGNATURE,
  TITAN_SISO_PACKET_LEN,
  TITAN_SISO_SECURE_PACKET_LEN,
  TITAN_FLAG_ENCRYPTED,
  computeRollingToken,
  maskSisoPayload,
  maskMacroPayload
};
